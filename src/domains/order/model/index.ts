import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { orders } from "../../../db/schema";

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

const model = {
  createPendingOrder,
  attachStripeSession,
  attachStripePaymentIntentBySessionId,
  transitionByStripeSessionId,
  transitionByStripePaymentIntentId,
};

export default model;
