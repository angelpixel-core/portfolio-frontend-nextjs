import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  demo: z.string().url(),
  repository: z.string().url(),
  img: z.string(),
  tags: z.string(),
  featured: z.boolean(),
});

export const ProjectsSchema = z.array(ProjectSchema);