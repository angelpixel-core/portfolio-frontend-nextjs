import { z } from "zod";

export const ExperienceStatSchema = z.object({
  number: z.union([z.string(), z.number()]),
  subtitle: z.string(),
});

export const ExperienceStatsSchema = z.array(ExperienceStatSchema);

export type ExperienceStatModel = z.infer<typeof ExperienceStatSchema>;
export type ExperienceStatsModel = z.infer<typeof ExperienceStatsSchema>;
