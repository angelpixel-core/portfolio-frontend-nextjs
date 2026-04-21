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

const model = {
  createPendingOrder,
  attachStripeSession,
};

export default model;
