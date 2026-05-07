import { z } from "zod";

export const ResumeRequestSubmissionSchema = z.object({
  id: z.string(),
  linkId: z.string(),
  email: z.string().email(),
  name: z.string(),
  context: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.string(),
  origin: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ResumeRequestSubmissionsSchema = z.array(
  ResumeRequestSubmissionSchema
);

export type ResumeRequestSubmission = z.infer<
  typeof ResumeRequestSubmissionSchema
>;
export type ResumeRequestSubmissions = z.infer<
  typeof ResumeRequestSubmissionsSchema
>;
