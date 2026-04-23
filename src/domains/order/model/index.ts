import { randomUUID } from "crypto";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../../../db";
import { access, orders, user } from "../../../db/schema";

type CreatePendingOrderInput = {
  userId?: string;
  email?: string;
  productKey: string;
  amount: number;
  currency: string;
  provider?: string;
};

type AttachStripeSessionInput = {
  orderId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
};

type TransitionStatus = "paid" | "failed";

export type OrderStatus = "pending" | "paid" | "failed";

export type OrderRecord = {
  id: string;
  productKey: string;
  status: OrderStatus;
  provider: string;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminOrderRecord = {
  id: string;
  status: OrderStatus;
  productKey: string;
  amount: number;
  currency: string;
  provider: string;
  email: string | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminOrderDetailRecord = AdminOrderRecord & {
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
};

export type AdminOverviewStats = {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  unlinkedPaidOrders: number;
  totalAccessGrants: number;
};

type TransitionResult =
  | { ok: true; changed: boolean; orderId: string; status: string }
  | {
      ok: false;
      reason: "not_found" | "invalid_transition";
      orderId?: string;
      status?: string;
    };

const createPendingOrder = async (
  input: CreatePendingOrderInput
): Promise<{ id: string }> => {
  const id = randomUUID();
  const now = new Date();

  await db.insert(orders).values({
    id,
    userId: input.userId,
    email: input.email,
    productKey: input.productKey,
    amount: input.amount,
    currency: input.currency,
    status: "pending",
    provider: input.provider ?? "stripe",
    createdAt: now,
    updatedAt: now,
  });

  return { id };
};

const attachStripeSession = async (
  input: AttachStripeSessionInput
): Promise<void> => {
  await db
    .update(orders)
    .set({
      stripeSessionId: input.stripeSessionId,
      stripePaymentIntentId: input.stripePaymentIntentId ?? null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, input.orderId));
};

const transitionOrderStatus = async (
  orderId: string,
  nextStatus: TransitionStatus
): Promise<TransitionResult> => {
  const rows = await db
    .select({ id: orders.id, status: orders.status })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  const current = rows[0];
  if (!current) {
    return { ok: false, reason: "not_found" };
  }

  if (current.status === nextStatus) {
    return {
      ok: true,
      changed: false,
      orderId: current.id,
      status: current.status,
    };
  }

  if (current.status !== "pending") {
    return {
      ok: false,
      reason: "invalid_transition",
      orderId: current.id,
      status: current.status,
    };
  }

  await db
    .update(orders)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(orders.id, current.id));

  return {
    ok: true,
    changed: true,
    orderId: current.id,
    status: nextStatus,
  };
};

const transitionByStripeSessionId = async (
  stripeSessionId: string,
  nextStatus: TransitionStatus
): Promise<TransitionResult> => {
  const rows = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.stripeSessionId, stripeSessionId))
    .limit(1);

  const order = rows[0];
  if (!order) {
    return { ok: false, reason: "not_found" };
  }

  return transitionOrderStatus(order.id, nextStatus);
};

const transitionByStripePaymentIntentId = async (
  stripePaymentIntentId: string,
  nextStatus: TransitionStatus
): Promise<TransitionResult> => {
  const rows = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.stripePaymentIntentId, stripePaymentIntentId))
    .limit(1);

  const order = rows[0];
  if (!order) {
    return { ok: false, reason: "not_found" };
  }

  return transitionOrderStatus(order.id, nextStatus);
};

const attachStripePaymentIntentBySessionId = async (
  stripeSessionId: string,
  stripePaymentIntentId: string
): Promise<void> => {
  await db
    .update(orders)
    .set({ stripePaymentIntentId, updatedAt: new Date() })
    .where(eq(orders.stripeSessionId, stripeSessionId));
};

const attachUser = async (
  orderId: string,
  userId: string,
  email?: string
): Promise<void> => {
  await db
    .update(orders)
    .set({
      userId,
      email: email ?? null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));
};

const findById = async (orderId: string): Promise<OrderRecord | null> => {
  const rows = await db
    .select({
      id: orders.id,
      productKey: orders.productKey,
      status: orders.status,
      provider: orders.provider,
      amount: orders.amount,
      currency: orders.currency,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  const order = rows[0];
  if (!order) {
    return null;
  }

  return {
    ...order,
    status: order.status as OrderStatus,
  };
};

const canUnlock = async (orderId: string): Promise<boolean> => {
  const order = await findById(orderId);
  return Boolean(order && order.status === "paid");
};

const listForAdmin = async (
  limit: number = 200
): Promise<AdminOrderRecord[]> => {
  const rows = await db
    .select({
      id: orders.id,
      status: orders.status,
      productKey: orders.productKey,
      amount: orders.amount,
      currency: orders.currency,
      provider: orders.provider,
      email: orders.email,
      userId: orders.userId,
      userEmail: user.email,
      userName: user.name,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .leftJoin(user, eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    ...row,
    status: row.status as OrderStatus,
  }));
};

const findAdminById = async (
  orderId: string
): Promise<AdminOrderDetailRecord | null> => {
  const rows = await db
    .select({
      id: orders.id,
      status: orders.status,
      productKey: orders.productKey,
      amount: orders.amount,
      currency: orders.currency,
      provider: orders.provider,
      email: orders.email,
      userId: orders.userId,
      userEmail: user.email,
      userName: user.name,
      stripeSessionId: orders.stripeSessionId,
      stripePaymentIntentId: orders.stripePaymentIntentId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .leftJoin(user, eq(orders.userId, user.id))
    .where(eq(orders.id, orderId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    ...row,
    status: row.status as OrderStatus,
  };
};

const adminSetStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<boolean> => {
  const result = await db
    .update(orders)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  return (result.rowCount ?? 0) > 0;
};

const getAdminOverviewStats = async (): Promise<AdminOverviewStats> => {
  const orderStatsRows = await db
    .select({
      totalOrders: sql<number>`count(*)::int`,
      paidOrders: sql<number>`count(*) filter (where ${orders.status} = 'paid')::int`,
      pendingOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')::int`,
      failedOrders: sql<number>`count(*) filter (where ${orders.status} = 'failed')::int`,
      unlinkedPaidOrders: sql<number>`count(*) filter (where ${orders.status} = 'paid' and ${orders.userId} is null)::int`,
    })
    .from(orders);

  const accessStatsRows = await db
    .select({
      totalAccessGrants: sql<number>`count(*)::int`,
    })
    .from(access);

  const orderStats = orderStatsRows[0];
  const accessStats = accessStatsRows[0];

  return {
    totalOrders: orderStats?.totalOrders ?? 0,
    paidOrders: orderStats?.paidOrders ?? 0,
    pendingOrders: orderStats?.pendingOrders ?? 0,
    failedOrders: orderStats?.failedOrders ?? 0,
    unlinkedPaidOrders: orderStats?.unlinkedPaidOrders ?? 0,
    totalAccessGrants: accessStats?.totalAccessGrants ?? 0,
  };
};

const model = {
  createPendingOrder,
  attachStripeSession,
  attachStripePaymentIntentBySessionId,
  attachUser,
  transitionByStripeSessionId,
  transitionByStripePaymentIntentId,
  findById,
  canUnlock,
  listForAdmin,
  getAdminOverviewStats,
  findAdminById,
  adminSetStatus,
};

export default model;
