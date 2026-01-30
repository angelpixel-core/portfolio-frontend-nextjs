import type { Article } from "@/domains/article/model/schema";

/**
 * Mouse position for cursor-following thumbnail
 * Story 14.8: Article Hover Thumbnail
 */
export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Props for ArticleHoverThumbnail component
 * Story 14.8: Article Hover Thumbnail
 *
 * Thumbnail follows cursor position - appears above and to the right of mouse
 */
export interface ArticleHoverThumbnailProps {
  /** Article being hovered (null when not hovering) */
  article: Article | null;
  /** Mouse position for cursor-following positioning (null when not hovering) */
  mousePosition: MousePosition | null;
}
