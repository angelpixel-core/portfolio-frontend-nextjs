import { z } from "zod";

export const ContactSchema = z.object({
  email: z.string().email().max(254),
  message: z.string().min(1).max(4500),
  projectName: z.string().optional(),
  source: z.string().optional(),
  jobTypes: z.array(z.string()).optional(),
  formStart: z.coerce.number().optional(),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().min(1).optional(),
  recaptchaAction: z.string().min(1).optional(),
});

export type ContactPayload = z.infer<typeof ContactSchema>;
