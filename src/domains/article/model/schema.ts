import { z } from "zod";

export const ArticleBlockTypeSchema = z.enum([
  "text",
  "image",
  "quote",
  "callout",
  "code",
  "divider",
]);

export const ArticleBlockImagePositionSchema = z.enum([
  "top",
  "left",
  "right",
  "bottom",
]);

export const ArticleBlockSchema = z.object({
  id: z.string(),
  article_id: z.number(),
  sort_order: z.number(),
  block_type: ArticleBlockTypeSchema,
  title: z.string().optional(),
  body: z.string().optional(),
  image_asset_id: z.string().optional(),
  image_ref: z.string().optional(),
  image_alt: z.string().optional(),
  image_position: ArticleBlockImagePositionSchema.optional(),
  caption: z.string().optional(),
  image_url: z.string().optional(),
});

export const ArticleBlocksSchema = z.array(ArticleBlockSchema);

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
  blocks: ArticleBlocksSchema.optional(),
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
export type ArticleBlock = z.infer<typeof ArticleBlockSchema>;
export type ArticleBlocks = z.infer<typeof ArticleBlocksSchema>;
