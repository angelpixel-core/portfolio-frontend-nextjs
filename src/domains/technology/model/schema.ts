import { z } from "zod";

/**
 * Zod schema for Technology domain
 * Based on mock data structure: { id, name, status, x, y }
 */
export const TechnologySchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  x: z.string(),
  y: z.string(),
  proficiency: z.string().optional(),
});

export const TechnologiesSchema = z.array(TechnologySchema);

export type TechnologyModel = z.infer<typeof TechnologySchema>;
export type TechnologiesModel = z.infer<typeof TechnologiesSchema>;

export default TechnologySchema;
