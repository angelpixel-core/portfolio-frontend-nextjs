import type { Article } from "@/domains/article/model/schema";

/**
 * Mouse position for hover thumbnail tracking
 * Story 14.8: Article Hover Thumbnail
 */
export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Props for the ArticleListItem component
 * Story 14.10: Article List Format
 */
export interface ArticleListItemProps {
  /** Article data from the domain model */
  article: Article;
  /** Optional class name for custom styling */
  className?: string;
  /**
   * Callback for hover state changes with mouse position (for Story 14.8 thumbnail)
   * Triggered on the LINK element (not the entire article box)
   * Includes mouse coordinates for cursor-following thumbnail
   */
  onHoverChange?: (
    _isHovered: boolean,
    _mousePosition: MousePosition | null
  ) => void;
}
