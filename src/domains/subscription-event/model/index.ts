import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";

import { db } from "../../../db";
import { subscriptionEvents } from "../../../db/schema";

export type SubscriptionEventType =
  | "created"
  | "confirm_sent"
  | "confirmed"
  | "unsubscribed"
  | "resubscribed"
  | "bounced"
  | "complained";

type RecordSubscriptionEventInput = {
  subscriptionId: string;
  type: SubscriptionEventType;
  payload?: string;
};

export type SubscriptionEventRecord = {
  id: string;
  subscriptionId: string;
  type: SubscriptionEventType;
  payload: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const recordEvent = async (
  input: RecordSubscriptionEventInput
): Promise<void> => {
  const now = new Date();

  await db.insert(subscriptionEvents).values({
    id: randomUUID(),
    subscriptionId: input.subscriptionId,
    type: input.type,
    payload: input.payload ?? null,
    createdAt: now,
    updatedAt: now,
  });
};

const listBySubscriptionId = async (
  subscriptionId: string
): Promise<SubscriptionEventRecord[]> => {
  const rows = await db
    .select()
    .from(subscriptionEvents)
    .where(eq(subscriptionEvents.subscriptionId, subscriptionId))
    .orderBy(desc(subscriptionEvents.createdAt));

  return rows as SubscriptionEventRecord[];
};

const model = {
  recordEvent,
  listBySubscriptionId,
};

export default model;
