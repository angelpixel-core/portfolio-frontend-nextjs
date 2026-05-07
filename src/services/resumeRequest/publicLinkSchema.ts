import { z } from "zod";

import { DEFAULT_TTL_DAYS, MAX_TTL_DAYS, MIN_TTL_DAYS } from "./publicLink";

export const AdminCreateResumeRequestLinkSchema = z.object({
  recipientName: z.string().trim().min(1).max(120),
  ttlDays: z.number().int().min(MIN_TTL_DAYS).max(MAX_TTL_DAYS).optional(),
});

export const PublicResumeRequestSubmissionSchema = z.object({
  email: z.string().trim().email().max(320),
  context: z.string().trim().max(1000).optional(),
  role: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const normalizeTtlDays = (ttlDays?: number): number => {
  return ttlDays ?? DEFAULT_TTL_DAYS;
};
