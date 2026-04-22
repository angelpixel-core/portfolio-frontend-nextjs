import { randomUUID } from "crypto";
import { desc, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "../../../db";
import { access, orders, user } from "../../../db/schema";

type UserRecord = {
  id: string;
  email: string;
  name: string;
  createdAt?: Date;
};

export type AdminUserListRecord = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  ordersCount: number;
  paidOrdersCount: number;
  accessCount: number;
  lastOrderAt: Date | null;
};

export type AdminUserOrderRecord = {
  id: string;
  status: "pending" | "paid" | "failed";
  productKey: string;
  amount: number;
  currency: string;
  provider: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserAccessRecord = {
  id: string;
  productKey: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUserDetail = {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  };
  stats: {
    ordersCount: number;
    paidOrdersCount: number;
    accessCount: number;
    lastOrderAt: Date | null;
  };
  orders: AdminUserOrderRecord[];
  access: AdminUserAccessRecord[];
};

const fallbackNameFromEmail = (email: string): string => {
  const local = email.split("@")[0]?.trim();
  if (!local) {
    return "Customer";
  }

  return local.slice(0, 80);
};

const findByEmail = async (email: string): Promise<UserRecord | null> => {
  const rows = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return rows[0] ?? null;
};

const findOrCreateByEmail = async (email: string): Promise<UserRecord> => {
  const existing = await findByEmail(email);
  if (existing) {
    return existing;
  }

  const now = new Date();
  const inserted = await db
    .insert(user)
    .values({
      id: randomUUID(),
      email,
      name: fallbackNameFromEmail(email),
      emailVerified: false,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .returning({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });

  if (inserted[0]) {
    return inserted[0];
  }

  const raced = await findByEmail(email);
  if (!raced) {
    throw new Error("Failed to resolve user by email after upsert");
  }

  return raced;
};

const listForAdmin = async (
  limit: number = 200
): Promise<AdminUserListRecord[]> => {
  const users = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(limit);

  const orderStats = await db
    .select({
      userId: orders.userId,
      ordersCount: sql<number>`count(*)::int`,
      paidOrdersCount: sql<number>`count(*) filter (where ${orders.status} = 'paid')::int`,
      lastOrderAt: sql<Date | null>`max(${orders.createdAt})`,
    })
    .from(orders)
    .where(isNotNull(orders.userId))
    .groupBy(orders.userId);

  const accessStats = await db
    .select({
      userId: access.userId,
      accessCount: sql<number>`count(*)::int`,
    })
    .from(access)
    .groupBy(access.userId);

  const orderStatsMap = new Map(
    orderStats
      .filter((row): row is typeof row & { userId: string } =>
        Boolean(row.userId)
      )
      .map((row) => [
        row.userId,
        {
          ordersCount: row.ordersCount,
          paidOrdersCount: row.paidOrdersCount,
          lastOrderAt: row.lastOrderAt,
        },
      ])
  );

  const accessStatsMap = new Map(
    accessStats.map((row) => [row.userId, row.accessCount])
  );

  return users.map((row) => {
    const orderData = orderStatsMap.get(row.id);
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      createdAt: row.createdAt,
      ordersCount: orderData?.ordersCount ?? 0,
      paidOrdersCount: orderData?.paidOrdersCount ?? 0,
      lastOrderAt: orderData?.lastOrderAt ?? null,
      accessCount: accessStatsMap.get(row.id) ?? 0,
    };
  });
};

const getAdminDetailById = async (
  id: string,
  orderLimit: number = 200
): Promise<AdminUserDetail | null> => {
  const rows = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  const targetUser = rows[0];
  if (!targetUser) {
    return null;
  }

  const orderRows = await db
    .select({
      id: orders.id,
      status: orders.status,
      productKey: orders.productKey,
      amount: orders.amount,
      currency: orders.currency,
      provider: orders.provider,
      email: orders.email,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .where(eq(orders.userId, targetUser.id))
    .orderBy(desc(orders.createdAt))
    .limit(orderLimit);

  const accessRows = await db
    .select({
      id: access.id,
      productKey: access.productKey,
      createdAt: access.createdAt,
      updatedAt: access.updatedAt,
    })
    .from(access)
    .where(eq(access.userId, targetUser.id))
    .orderBy(desc(access.createdAt));

  const paidOrdersCount = orderRows.filter(
    (row) => row.status === "paid"
  ).length;

  return {
    user: targetUser,
    stats: {
      ordersCount: orderRows.length,
      paidOrdersCount,
      accessCount: accessRows.length,
      lastOrderAt: orderRows[0]?.createdAt ?? null,
    },
    orders: orderRows.map((row) => ({
      ...row,
      status: row.status as "pending" | "paid" | "failed",
    })),
    access: accessRows,
  };
};

const model = {
  findByEmail,
  findOrCreateByEmail,
  listForAdmin,
  getAdminDetailById,
};

export default model;
