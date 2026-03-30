import { z } from "zod";

export const ResumeRequestSchema = z.object({
  source: z.enum(["resume_cta", "resume_intent"]),
  context: z.string().max(1000).optional(),
  role: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
});

export type ResumeRequestPayload = z.infer<typeof ResumeRequestSchema>;
