"use client";

import "../styles.css";

import React from "react";
import { BoxShadow } from "@/atoms/shadows";
import { FramerImage } from "@/atoms/hocs";
import { useTouchState } from "@/hooks/ui";
import { ArticleLink } from "../ArticleLink";
import { ArticleMeta } from "../ArticleMeta";
import type { ArticleCardVariantProps } from "../ArticleCard.types";

/**
 * Grid variant of ArticleCard for non-featured articles.
 * Displays a compact card suitable for grid layouts.
 *
 * Touch behavior:
 * - Single tap reveals action area (if any actions added later)
 * - Tap elsewhere dismisses touched state
 * - Only one card can be touched at a time
 * - Disabled during page transitions
 */
export function GridArticleCard({
  article,
  className = "",
}: ArticleCardVariantProps) {
  const { slug, title, summary, img, img_alt, published_at, reading_time, url } =
    article;

  // Touch state management for mobile interactions
  const { isTouched, handleTouchStart, handleClick, elementRef } =
    useTouchState({ id: `grid-article-${slug}` });

  const touchedClass = isTouched ? "article-card--touched" : "";

  return (
    <article
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`article-card article-card--grid ${touchedClass} ${className}`.trim()}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <BoxShadow />

      <ArticleLink
        url={url}
        slug={slug}
        className="article-card__image-link"
        ariaLabel={`Read article: ${title}`}
      >
        <FramerImage
          src={img}
          alt={img_alt ?? title}
          width={600}
          height={400}
          className="article-card__image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </ArticleLink>

      <div className="article-card__content">
        <ArticleMeta publishedAt={published_at} readingTime={reading_time} />

        <ArticleLink
          url={url}
          slug={slug}
          className="article-card__title-link"
          ariaLabel={`Read article: ${title}`}
        >
          <h2 className="article-card__title">{title}</h2>
        </ArticleLink>

        <p className="article-card__summary--grid">{summary}</p>
      </div>
    </article>
  );
}

export default GridArticleCard;
