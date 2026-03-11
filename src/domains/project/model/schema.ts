import { z } from "zod";

export const ProjectArchitectureSchema = z.object({
  image: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export const ProjectFeaturedRibbonVariantSchema = z.enum([
  "default",
  "wip",
  "planned",
  "shipped",
]);

export const ProjectFeaturedRibbonSchema = z.object({
  text: z.string().trim().min(1),
  variant: ProjectFeaturedRibbonVariantSchema.optional(),
});

export const ProjectFeaturedCardSchema = z
  .object({
    contextBadges: z.array(z.string()).optional(),
    focusLine: z.string().optional(),
    ribbon: ProjectFeaturedRibbonSchema.optional(),
    architecture: ProjectArchitectureSchema.optional(),
  })
  .optional();

export const ProjectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  outcomes: z.string().optional(),
  demo: z.string().url().optional(),
  repository: z.string().url().optional(),
  img: z.string(),
  screenshots: z.array(z.string()).optional(),
  tags: z.string(),
  featured: z.boolean(),
  featuredCard: ProjectFeaturedCardSchema,
});

export const ProjectsSchema = z.array(ProjectSchema);

// Inferred types from Zod schemas
export type ProjectModel = z.infer<typeof ProjectSchema>;
export type ProjectsModel = z.infer<typeof ProjectsSchema>;
export type ProjectArchitectureModel = z.infer<
  typeof ProjectArchitectureSchema
>;
export type ProjectFeaturedRibbonVariantModel = z.infer<
  typeof ProjectFeaturedRibbonVariantSchema
>;
export type ProjectFeaturedRibbonModel = z.infer<
  typeof ProjectFeaturedRibbonSchema
>;
export type ProjectFeaturedCardModel = z.infer<
  typeof ProjectFeaturedCardSchema
>;
