import { z } from "zod";

export const ArticleCategorySchema = z.enum([
  "React",
  "Architecture",
  "Performance",
  "Testing",
]);

export const ArticleLangSchema = z.enum(["ES", "EN"]);

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  slug: z.string(),
  lang: ArticleLangSchema,
  reading_time: z.string(),
  published_at: z.string(),
  summary: z.string(),
  content: z.string().optional(),
  img: z.string(),
  img_alt: z.string().optional(),
  hero_asset_id: z.string().optional(),
  featured: z.boolean(),
  visible: z.boolean().optional(),
  priority: z.number().optional(),
  category: ArticleCategorySchema.optional(),
  badges: z.array(z.string()).optional(),
  status: z.enum(["published", "draft"]).optional().default("published"),
});

export const ArticlesSchema = z.array(ArticleSchema);

// Inferred types
export type Article = z.infer<typeof ArticleSchema>;
export type Articles = z.infer<typeof ArticlesSchema>;
