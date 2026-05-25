import { and, desc, eq, gt, isNull } from "drizzle-orm";

import { db } from "../../db";
import {
  activity,
  resumeRequestLinks,
  resumeRequestSubmissions,
} from "../../db/schema";

const ACTIVITY_TYPE = "request_resume";
const REQUESTED_STATUS = "requested";

export const getLatestResumeRequestStatus = async (userId: string) => {
  const rows = await db
    .select({ status: activity.status })
    .from(activity)
    .where(and(eq(activity.userId, userId), eq(activity.type, ACTIVITY_TYPE)))
    .orderBy(desc(activity.createdAt))
    .limit(1);

  return rows[0]?.status ?? null;
};

export const hasPendingResumeRequest = async (userId: string) => {
  const existing = await db
    .select({ id: activity.id })
    .from(activity)
    .where(
      and(
        eq(activity.userId, userId),
        eq(activity.type, ACTIVITY_TYPE),
        eq(activity.status, REQUESTED_STATUS)
      )
    )
    .limit(1);

  return existing.length > 0;
};

export const createResumeRequestActivity = async (input: {
  id: string;
  userId: string;
  source: string;
  createdAt: Date;
}) => {
  await db.insert(activity).values({
    id: input.id,
    userId: input.userId,
    type: ACTIVITY_TYPE,
    status: REQUESTED_STATUS,
    event: "resume_request",
    source: input.source,
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
  });
};

export const markResumeRequestSent = async (
  activityId: string,
  updatedAt: Date
) => {
  await db
    .update(activity)
    .set({ status: "sent", updatedAt })
    .where(eq(activity.id, activityId));
};

export const consumePublicLinkAndCreateSubmission = async (input: {
  tokenHash: string;
  now: Date;
  email: string;
  context?: string | null;
  role?: string | null;
  company?: string | null;
  notes?: string | null;
  idFactory: () => string;
}) => {
  return db.transaction(async (tx) => {
    const consumed = await tx
      .update(resumeRequestLinks)
      .set({ usedAt: input.now, updatedAt: input.now })
      .where(
        and(
          eq(resumeRequestLinks.tokenHash, input.tokenHash),
          isNull(resumeRequestLinks.usedAt),
          isNull(resumeRequestLinks.revokedAt),
          gt(resumeRequestLinks.expiresAt, input.now)
        )
      )
      .returning();

    if (!consumed[0]) return { ok: false as const };

    const link = consumed[0];
    const [submission] = await tx
      .insert(resumeRequestSubmissions)
      .values({
        id: input.idFactory(),
        linkId: link.id,
        email: input.email,
        name: link.recipientName,
        context: input.context ?? null,
        role: input.role ?? null,
        company: input.company ?? null,
        notes: input.notes ?? null,
        status: "requested",
        origin: "on_demand_link",
        createdAt: input.now,
        updatedAt: input.now,
      })
      .returning();

    return { ok: true as const, submission };
  });
};
