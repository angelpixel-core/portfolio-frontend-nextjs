"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import type { ArticleListItemProps } from "./ArticleListItem.types";
import "./styles.css";

/**
 * Format date string to readable format
 * "2023-01-27" -> "January 27, 2023"
 *
 * Note: We parse the date parts directly to avoid timezone issues
 * that occur when using new Date() with ISO date strings.
 */
function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * ArticleListItem - Simple list item for "All Articles" section
 *
 * Displays article title and date in a clean list format with left border accent.
 * Does NOT display image or summary (those are for FeaturedArticleCard).
 *
 * Story 14.10: Article List Format
 *
 * @example
 * ```tsx
 * <ArticleListItem
 *   article={article}
 *   onHoverChange={(isHovered, rect) => {
 *     // For Story 14.8 thumbnail integration
 *   }}
 * />
 * ```
 */
export function ArticleListItem({
  article,
  className = "",
  onHoverChange,
}: ArticleListItemProps) {
  const { slug, title, published_at, url } = article;
  const elementRef = useRef<HTMLElement>(null);

  /**
   * Handle mouse enter - notify parent of hover state
   */
  const handleMouseEnter = useCallback(() => {
    if (onHoverChange && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      onHoverChange(true, rect);
    }
  }, [onHoverChange]);

  /**
   * Handle mouse leave - notify parent of hover end
   */
  const handleMouseLeave = useCallback(() => {
    if (onHoverChange) {
      onHoverChange(false, null);
    }
  }, [onHoverChange]);

  const formattedDate = formatDate(published_at);

  return (
    <article
      ref={elementRef}
      className={`article-list-item ${className}`.trim()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={url || `/articles/${slug}`}
        className="article-list-item__link"
        aria-label={`Read article: ${title}`}
      >
        <h3 className="article-list-item__title">{title}</h3>
        <time dateTime={published_at} className="article-list-item__date">
          {formattedDate}
        </time>
      </Link>
    </article>
  );
}

export default ArticleListItem;
export type { ArticleListItemProps };
