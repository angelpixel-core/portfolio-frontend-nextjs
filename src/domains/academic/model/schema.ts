import { z } from "zod";

/**
 * Schema for academic credentials (degrees, certifications)
 * Story 3.3: Academic Background
 * Story 3.4: Added verification_url and type fields
 */
export const AcademicSchema = z.object({
  id: z.number(),
  degree: z.string(),
  institution: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  resume: z.string().optional(),
  verification_url: z.string().url().optional(),
});

/**
 * Schema for validating arrays of academic entries
 */
export const AcademicsSchema = z.array(AcademicSchema);

// Type exports using Zod inference
export type Academic = z.infer<typeof AcademicSchema>;
export type Academics = z.infer<typeof AcademicsSchema>;
