import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import { db } from "../../../db";
import { subscriptions } from "../../../db/schema";

export type SubscriptionStatus =
  | "pending_confirmation"
  | "subscribed"
  | "unsubscribed"
  | "bounced"
  | "complained";

export type SubscriptionRecord = {
  id: string;
  email: string;
  status: SubscriptionStatus;
  source: string | null;
  articleSlug: string | null;
  locale: string | null;
  confirmedAt: Date | null;
  unsubscribedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateOrUpdatePendingInput = {
  email: string;
  source?: string;
  articleSlug?: string;
  locale?: string;
};

const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const mapRow = (row: SubscriptionRecord): SubscriptionRecord => ({
  ...row,
  status: row.status as SubscriptionStatus,
});

const createOrUpdatePending = async (
  input: CreateOrUpdatePendingInput
): Promise<SubscriptionRecord> => {
  const now = new Date();
  const email = normalizeEmail(input.email);

  const inserted = await db
    .insert(subscriptions)
    .values({
      id: randomUUID(),
      email,
      status: "pending_confirmation",
      source: input.source ?? null,
      articleSlug: input.articleSlug ?? null,
      locale: input.locale ?? null,
      confirmedAt: null,
      unsubscribedAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: subscriptions.email,
      set: {
        status: "pending_confirmation",
        source: input.source ?? null,
        articleSlug: input.articleSlug ?? null,
        locale: input.locale ?? null,
        confirmedAt: null,
        unsubscribedAt: null,
        updatedAt: now,
      },
    })
    .returning();

  return mapRow(inserted[0] as SubscriptionRecord);
};

const markConfirmed = async (subscriptionId: string): Promise<void> => {
  const now = new Date();

  await db
    .update(subscriptions)
    .set({
      status: "subscribed",
      confirmedAt: now,
      unsubscribedAt: null,
      updatedAt: now,
    })
    .where(eq(subscriptions.id, subscriptionId));
};

const markUnsubscribed = async (subscriptionId: string): Promise<void> => {
  const now = new Date();

  await db
    .update(subscriptions)
    .set({
      status: "unsubscribed",
      unsubscribedAt: now,
      updatedAt: now,
    })
    .where(eq(subscriptions.id, subscriptionId));
};

const findByEmail = async (
  email: string
): Promise<SubscriptionRecord | null> => {
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, normalizeEmail(email)))
    .limit(1);

  const row = rows[0] as SubscriptionRecord | undefined;
  return row ? mapRow(row) : null;
};

const findById = async (
  subscriptionId: string
): Promise<SubscriptionRecord | null> => {
  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, subscriptionId))
    .limit(1);

  const row = rows[0] as SubscriptionRecord | undefined;
  return row ? mapRow(row) : null;
};

const model = {
  createOrUpdatePending,
  markConfirmed,
  markUnsubscribed,
  findByEmail,
  findById,
};

export default model;
