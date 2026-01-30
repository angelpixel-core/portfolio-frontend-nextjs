import "./styles.css";

import { FeaturedArticleCard } from "./variants/Featured";
import { GridArticleCard } from "./variants/Grid";
import type { ArticleCardProps } from "./ArticleCard.types";

// Re-export types for convenience
export type {
  ArticleCardProps,
  ArticleCardVariantProps,
  ArticleMetaProps,
  ArticleLinkProps,
} from "./ArticleCard.types";

// Re-export subcomponents for direct use if needed
export { ArticleMeta } from "./ArticleMeta";
export { ArticleLink } from "./ArticleLink";
export { FeaturedArticleCard } from "./variants/Featured";
export { GridArticleCard } from "./variants/Grid";

/**
 * ArticleCard component that automatically selects the appropriate variant
 * based on the article's `featured` flag.
 *
 * @example
 * ```tsx
 * // Auto-selects variant based on article.featured
 * <ArticleCard article={article} />
 *
 * // Or use variants directly
 * <FeaturedArticleCard article={article} />
 * <GridArticleCard article={article} />
 * ```
 */
export function ArticleCard({ article, className }: ArticleCardProps) {
  if (article.featured) {
    return <FeaturedArticleCard article={article} className={className} />;
  }

  return <GridArticleCard article={article} className={className} />;
}

// Default export for simpler imports
export default ArticleCard;
