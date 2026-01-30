import type { Article } from "@/domains/article/model/schema";

/**
 * Props for ArticleHoverThumbnail component
 * Story 14.8: Article Hover Thumbnail
 */
export interface ArticleHoverThumbnailProps {
  /** Article being hovered (null when not hovering) */
  article: Article | null;
  /** Bounding rect of the hovered element (for positioning) */
  rect: DOMRect | null;
}
