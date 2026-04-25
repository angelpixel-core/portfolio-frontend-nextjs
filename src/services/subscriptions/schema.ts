import { z } from "zod";

export const SubscribeCreateSchema = z.object({
  email: z.string().email().max(254),
  source: z.string().trim().min(1).max(120).optional(),
  articleSlug: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  locale: z.string().trim().min(2).max(12).optional(),
  honeypot: z.string().trim().max(120).optional(),
  formStart: z.number().int().positive().optional(),
});

export const SubscribeTokenSchema = z.object({
  token: z.string().trim().min(1).max(2048),
});

export type SubscribeCreateInput = z.infer<typeof SubscribeCreateSchema>;
