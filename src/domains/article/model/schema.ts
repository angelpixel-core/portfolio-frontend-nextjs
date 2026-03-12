import { z } from "zod";

export const ArticleCategorySchema = z.enum([
  "React",
  "Architecture",
  "Performance",
  "Testing",
]);

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  slug: z.string(),
  reading_time: z.string(),
  published_at: z.string(),
  summary: z.string(),
  content: z.string().optional(),
  img: z.string(),
  featured: z.boolean(),
  category: ArticleCategorySchema.optional(),
  badges: z.array(z.string()).optional(),
  status: z.enum(["published", "draft"]).optional().default("published"),
});

export const ArticlesSchema = z.array(ArticleSchema);

// Inferred types
export type Article = z.infer<typeof ArticleSchema>;
export type Articles = z.infer<typeof ArticlesSchema>;
