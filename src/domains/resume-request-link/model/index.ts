import "server-only";

import { and, desc, eq, gt, isNull } from "drizzle-orm";

import { db } from "../../../db";
import { resumeRequestLinks } from "../../../db/schema";
import {
  ResumeRequestLinkSchema,
  ResumeRequestLinksSchema,
  type ResumeRequestLink,
} from "./schema";

type CreateLinkInput = {
  id: string;
  tokenHash: string;
  recipientName: string;
  ttlDays: number;
  expiresAt: Date;
  createdByAdminEmail: string;
};

const create = async (input: CreateLinkInput): Promise<ResumeRequestLink> => {
  const now = new Date();

  await db.insert(resumeRequestLinks).values({
    ...input,
    createdAt: now,
    updatedAt: now,
  });

  const [created] = await db
    .select()
    .from(resumeRequestLinks)
    .where(eq(resumeRequestLinks.id, input.id))
    .limit(1);

  return ResumeRequestLinkSchema.parse(created);
};

const list = async (limit = 200): Promise<ResumeRequestLink[]> => {
  const rows = await db
    .select()
    .from(resumeRequestLinks)
    .orderBy(desc(resumeRequestLinks.createdAt))
    .limit(limit);

  return ResumeRequestLinksSchema.parse(rows);
};

const findById = async (id: string): Promise<ResumeRequestLink | null> => {
  const rows = await db
    .select()
    .from(resumeRequestLinks)
    .where(eq(resumeRequestLinks.id, id))
    .limit(1);

  if (!rows[0]) return null;
  return ResumeRequestLinkSchema.parse(rows[0]);
};

const findByTokenHash = async (
  tokenHash: string
): Promise<ResumeRequestLink | null> => {
  const rows = await db
    .select()
    .from(resumeRequestLinks)
    .where(eq(resumeRequestLinks.tokenHash, tokenHash))
    .limit(1);

  if (!rows[0]) return null;
  return ResumeRequestLinkSchema.parse(rows[0]);
};

const findActiveByTokenHash = async (
  tokenHash: string,
  now = new Date()
): Promise<ResumeRequestLink | null> => {
  const rows = await db
    .select()
    .from(resumeRequestLinks)
    .where(
      and(
        eq(resumeRequestLinks.tokenHash, tokenHash),
        isNull(resumeRequestLinks.usedAt),
        isNull(resumeRequestLinks.revokedAt),
        gt(resumeRequestLinks.expiresAt, now)
      )
    )
    .limit(1);

  if (!rows[0]) return null;
  return ResumeRequestLinkSchema.parse(rows[0]);
};

const markUsed = async (id: string): Promise<void> => {
  await db
    .update(resumeRequestLinks)
    .set({ usedAt: new Date(), updatedAt: new Date() })
    .where(eq(resumeRequestLinks.id, id));
};

const revoke = async (id: string): Promise<void> => {
  await db
    .update(resumeRequestLinks)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(resumeRequestLinks.id, id));
};

const consumeActiveByTokenHash = async (
  tokenHash: string,
  now = new Date()
): Promise<ResumeRequestLink | null> => {
  const updated = await db
    .update(resumeRequestLinks)
    .set({ usedAt: now, updatedAt: now })
    .where(
      and(
        eq(resumeRequestLinks.tokenHash, tokenHash),
        isNull(resumeRequestLinks.usedAt),
        isNull(resumeRequestLinks.revokedAt),
        gt(resumeRequestLinks.expiresAt, now)
      )
    )
    .returning();

  if (!updated[0]) return null;
  return ResumeRequestLinkSchema.parse(updated[0]);
};

const resumeRequestLinkModel = {
  create,
  list,
  findById,
  findByTokenHash,
  findActiveByTokenHash,
  markUsed,
  revoke,
  consumeActiveByTokenHash,
};

export default resumeRequestLinkModel;
