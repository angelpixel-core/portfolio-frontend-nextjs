import type { ReactNode } from "react";
import type { Article } from "@/domains/article/model/schema";

/**
 * Props for the ArticleCard component
 * Extends the domain model with presentation-specific options
 */
export interface ArticleCardProps {
  /** Article data from the domain model */
  article: Article;
  /** Optional class name for custom styling */
  className?: string;
}

/**
 * Props shared by both Featured and Grid variants
 */
export interface ArticleCardVariantProps {
  /** Article data from the domain model */
  article: Article;
  /** Optional class name for custom styling */
  className?: string;
}

/**
 * Props for the ArticleMeta subcomponent
 */
export interface ArticleMetaProps {
  /** Publication date in ISO format */
  publishedAt: string;
  /** Reading time in minutes */
  readingTime: number;
  /** Optional class name */
  className?: string;
}

/**
 * Props for the ArticleLink subcomponent
 */
export interface ArticleLinkProps {
  /** Article URL (internal or external) */
  url: string;
  /** Article slug for internal routing */
  slug: string;
  /** Children to render inside the link */
  children: ReactNode;
  /** Optional class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}
