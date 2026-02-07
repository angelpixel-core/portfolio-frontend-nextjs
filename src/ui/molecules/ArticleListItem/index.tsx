"use client";

import { useCallback, type MouseEvent } from "react";
import Link from "next/link";
import { BoxShadow } from "@/atoms/shadows";
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
 * Story 14.8: Hover handlers on LINK element (not article box), with mouse tracking
 *
 * @example
 * ```tsx
 * <ArticleListItem
 *   article={article}
 *   onHoverChange={(isHovered, mousePos) => {
 *     // For Story 14.8 thumbnail - follows cursor
 *   }}
 * />
 * ```
 */
function ArticleListItem({
  article,
  className = "",
  onHoverChange,
}: ArticleListItemProps) {
  const { slug, title, published_at, url } = article;

  /**
   * Handle mouse enter on LINK - notify parent with initial mouse position
   * Story 14.8: Thumbnail triggers on link hover, not entire box
   */
  const handleMouseEnter = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (onHoverChange) {
        onHoverChange(true, { x: e.clientX, y: e.clientY });
      }
    },
    [onHoverChange]
  );

  /**
   * Handle mouse move on LINK - update thumbnail position to follow cursor
   * Story 14.8: Thumbnail follows mouse horizontally
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (onHoverChange) {
        onHoverChange(true, { x: e.clientX, y: e.clientY });
      }
    },
    [onHoverChange]
  );

  /**
   * Handle mouse leave on LINK - hide thumbnail
   */
  const handleMouseLeave = useCallback(() => {
    if (onHoverChange) {
      onHoverChange(false, null);
    }
  }, [onHoverChange]);

  const formattedDate = formatDate(published_at);

  return (
    <article
      className={`article-list-item ${className}`.trim()}
      data-testid="article-list-item"
    >
      <BoxShadow variant="list-item" />
      {/* Link only wraps title - hover triggers thumbnail */}
      <Link
        href={url || `/articles/${slug}`}
        className="article-list-item__link"
        aria-label={`Read article: ${title}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-testid="article-list-item-link"
      >
        <h3
          className="article-list-item__title"
          data-testid="article-list-item-title"
        >
          {title}
        </h3>
      </Link>
      {/* Date outside link - pushed to right via flex */}
      <time
        dateTime={published_at}
        className="article-list-item__date"
        data-testid="article-list-item-date"
      >
        {formattedDate}
      </time>
    </article>
  );
}

export default ArticleListItem;
export type { ArticleListItemProps };
