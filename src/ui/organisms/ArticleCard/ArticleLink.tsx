import Link from "next/link";
import type { ArticleLinkProps } from "./ArticleCard.types";

/**
 * Determines if a URL is internal (within the site) or external
 * Internal URLs: start with "/" or are relative
 * External URLs: start with "http://" or "https://"
 */
function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * ArticleLink component that handles internal and external article URLs.
 *
 * - Internal URLs (e.g., "/articles/my-article") use Next.js Link for client-side routing
 * - External URLs (e.g., "https://dev.to/my-article") open in a new tab with proper security attributes
 *
 * @example
 * ```tsx
 * // Internal article
 * <ArticleLink url="/articles/my-article" slug="my-article">
 *   Read Article
 * </ArticleLink>
 *
 * // External article
 * <ArticleLink url="https://dev.to/my-article" slug="my-article">
 *   Read on Dev.to
 * </ArticleLink>
 * ```
 */
export function ArticleLink({
  url,
  slug,
  children,
  className = "",
  ariaLabel,
}: ArticleLinkProps) {
  // Determine if external once (avoid double call)
  const isExternal = isExternalUrl(url);
  const href = isExternal ? url : `/articles/${slug}`;

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export default ArticleLink;
