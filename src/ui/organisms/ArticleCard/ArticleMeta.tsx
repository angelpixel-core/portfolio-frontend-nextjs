import type { ArticleMetaProps } from "./ArticleCard.types";

/**
 * Formats an ISO date string to a human-readable format
 * Returns fallback text for invalid dates
 * @example formatDate("2026-01-15") → "January 15, 2026"
 */
function formatDate(isoDate: string): string {
  if (!isoDate) return "Date unavailable";

  const date = new Date(isoDate);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * ArticleMeta component displays publication date and reading time.
 *
 * Renders the metadata prominently as required by FR14.11:
 * "Fecha de publicación prominente en article card"
 *
 * @example
 * ```tsx
 * <ArticleMeta
 *   publishedAt="2026-01-15"
 *   readingTime="9 min read"
 * />
 * ```
 */
export function ArticleMeta({
  publishedAt,
  readingTime,
  className = "",
}: ArticleMetaProps) {
  const formattedDate = formatDate(publishedAt);

  return (
    <div className={`article-card__meta ${className}`.trim()}>
      <time
        dateTime={publishedAt}
        className="article-card__date"
        aria-label={`Published on ${formattedDate}`}
      >
        {formattedDate}
      </time>
      <span className="article-card__separator" aria-hidden="true">
        •
      </span>
      <span className="article-card__reading-time" aria-label={readingTime}>
        {readingTime}
      </span>
    </div>
  );
}

export default ArticleMeta;
