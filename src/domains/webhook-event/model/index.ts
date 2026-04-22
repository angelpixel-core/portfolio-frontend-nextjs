import { eq } from "drizzle-orm";

import { db } from "../../../db";
import { webhookEvents } from "../../../db/schema";

type RegisterWebhookEventInput = {
  id: string;
  type: string;
};

const registerWebhookEvent = async (
  input: RegisterWebhookEventInput
): Promise<{ created: boolean }> => {
  const now = new Date();
  const inserted = await db
    .insert(webhookEvents)
    .values({
      id: input.id,
      type: input.type,
      processed: false,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .returning({ id: webhookEvents.id });

  return { created: inserted.length > 0 };
};

const markProcessed = async (id: string): Promise<void> => {
  await db
    .update(webhookEvents)
    .set({ processed: true, updatedAt: new Date() })
    .where(eq(webhookEvents.id, id));
};

const isProcessed = async (id: string): Promise<boolean> => {
  const rows = await db
    .select({ processed: webhookEvents.processed })
    .from(webhookEvents)
    .where(eq(webhookEvents.id, id))
    .limit(1);

  return Boolean(rows[0]?.processed);
};

const model = {
  registerWebhookEvent,
  markProcessed,
  isProcessed,
};

export default model;
