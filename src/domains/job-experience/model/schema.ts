import { z } from "zod";

/**
 * Schema for individual work tasks within a job experience
 */
export const JobExperienceTaskSchema = z.object({
  description: z.string(),
  tags: z.array(z.string()).optional(),
});

export const JobExperienceGroupSchema = z.enum(["engineering", "platform"]);

/**
 * Schema for job experience entries
 * Represents a single position at a company
 */
export const JobExperienceSchema = z.object({
  id: z.number(),
  position: z.string(),
  company: z.string(),
  companyLink: z.string().url(),
  time: z.string(), // Format: "Dec 2021 - Aug 2022"
  year: z.string(),
  address: z.string(),
  contextBadges: z.array(z.string()),
  technologies: z.array(z.string()),
  group: JobExperienceGroupSchema,
  work: z.array(JobExperienceTaskSchema).optional(),
});

/**
 * Schema for validating arrays of job experiences
 */
export const JobExperiencesSchema = z.array(JobExperienceSchema);

// Type exports using Zod inference
export type JobExperienceTask = z.infer<typeof JobExperienceTaskSchema>;
export type JobExperienceGroup = z.infer<typeof JobExperienceGroupSchema>;
export type JobExperience = z.infer<typeof JobExperienceSchema>;
export type JobExperiences = z.infer<typeof JobExperiencesSchema>;
