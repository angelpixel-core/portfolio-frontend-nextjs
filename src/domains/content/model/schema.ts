import { z } from "zod";

/**
 * Content Schema
 *
 * Represents page content sections (landing, about, etc.)
 * Content values are sourced from environment variables for easy configuration.
 */
export const ContentSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  mainContent: z.string(),
});

export const ContentsSchema = z.array(ContentSchema);

// Inferred types from Zod schemas
export type ContentModel = z.infer<typeof ContentSchema>;
export type ContentsModel = z.infer<typeof ContentsSchema>;
