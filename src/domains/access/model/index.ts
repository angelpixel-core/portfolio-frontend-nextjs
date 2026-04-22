import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

import { db } from "../../../db";
import { access } from "../../../db/schema";

type GrantAccessInput = {
  userId: string;
  productKey: string;
};

type AccessRecord = {
  id: string;
  userId: string;
  productKey: string;
  createdAt: Date;
  updatedAt: Date;
};

const grantAccess = async (input: GrantAccessInput): Promise<AccessRecord> => {
  const now = new Date();
  const inserted = await db
    .insert(access)
    .values({
      id: randomUUID(),
      userId: input.userId,
      productKey: input.productKey,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .returning({
      id: access.id,
      userId: access.userId,
      productKey: access.productKey,
      createdAt: access.createdAt,
      updatedAt: access.updatedAt,
    });

  if (inserted[0]) {
    return inserted[0];
  }

  const rows = await db
    .select({
      id: access.id,
      userId: access.userId,
      productKey: access.productKey,
      createdAt: access.createdAt,
      updatedAt: access.updatedAt,
    })
    .from(access)
    .where(
      and(
        eq(access.userId, input.userId),
        eq(access.productKey, input.productKey)
      )
    )
    .limit(1);

  const existing = rows[0];
  if (!existing) {
    throw new Error("Failed to resolve access record after upsert");
  }

  return existing;
};

const hasAccess = async (
  userId: string,
  productKey: string
): Promise<boolean> => {
  const rows = await db
    .select({ id: access.id })
    .from(access)
    .where(and(eq(access.userId, userId), eq(access.productKey, productKey)))
    .limit(1);

  return Boolean(rows[0]);
};

const model = {
  grantAccess,
  hasAccess,
};

export default model;
