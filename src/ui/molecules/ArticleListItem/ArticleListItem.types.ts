import type { Article } from "@/domains/article/model/schema";

/**
 * Props for the ArticleListItem component
 * Story 14.10: Article List Format
 */
export interface ArticleListItemProps {
  /** Article data from the domain model */
  article: Article;
  /** Optional class name for custom styling */
  className?: string;
  /** Callback for hover state changes (for Story 14.8 thumbnail integration) */
  onHoverChange?: (_isHovered: boolean, _rect: DOMRect | null) => void;
}
