import { randomUUID } from "crypto";

import { db } from "../../../db";
import { orderAdminActions } from "../../../db/schema";

type RecordActionInput = {
  orderId: string;
  adminEmail: string;
  action: string;
  reason?: string;
  beforeState?: string;
  afterState?: string;
};

const recordAction = async (input: RecordActionInput): Promise<void> => {
  const now = new Date();

  await db.insert(orderAdminActions).values({
    id: randomUUID(),
    orderId: input.orderId,
    adminEmail: input.adminEmail,
    action: input.action,
    reason: input.reason ?? null,
    beforeState: input.beforeState ?? null,
    afterState: input.afterState ?? null,
    createdAt: now,
    updatedAt: now,
  });
};

const model = {
  recordAction,
};

export default model;
