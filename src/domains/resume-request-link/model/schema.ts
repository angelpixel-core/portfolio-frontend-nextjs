import { z } from "zod";

export const ResumeRequestLinkSchema = z.object({
  id: z.string(),
  tokenHash: z.string(),
  recipientName: z.string(),
  ttlDays: z.number().int().positive(),
  expiresAt: z.date(),
  usedAt: z.date().nullable().optional(),
  revokedAt: z.date().nullable().optional(),
  createdByAdminEmail: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ResumeRequestLinksSchema = z.array(ResumeRequestLinkSchema);

export type ResumeRequestLink = z.infer<typeof ResumeRequestLinkSchema>;
export type ResumeRequestLinks = z.infer<typeof ResumeRequestLinksSchema>;
