import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  demo: z.string().url().optional(),
  repository: z.string().url().optional(),
  img: z.string(),
  tags: z.string(),
  featured: z.boolean(),
});

export const ProjectsSchema = z.array(ProjectSchema);

// Inferred types from Zod schemas
export type ProjectModel = z.infer<typeof ProjectSchema>;
export type ProjectsModel = z.infer<typeof ProjectsSchema>;
