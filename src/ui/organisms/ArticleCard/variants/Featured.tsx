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
 * Featured variant of ArticleCard for highlighted articles.
 * Displays a larger card with summary text, suitable for hero sections.
 *
 * Touch behavior:
 * - Single tap reveals action area (if any actions added later)
 * - Tap elsewhere dismisses touched state
 * - Only one card can be touched at a time
 * - Disabled during page transitions
 */
export function FeaturedArticleCard({
  article,
  className = "",
}: ArticleCardVariantProps) {
  const { slug, title, summary, img, published_at, reading_time, url } =
    article;

  // Touch state management for mobile interactions
  const { isTouched, handleTouchStart, handleClick, elementRef } =
    useTouchState({ id: `featured-article-${slug}` });

  const touchedClass = isTouched ? "article-card--touched" : "";

  return (
    <article
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`article-card article-card--featured ${touchedClass} ${className}`.trim()}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <BoxShadow />

      <ArticleLink
        url={url}
        slug={slug}
        className="article-card__title-link article-card__title-link--featured"
        ariaLabel={`Read article: ${title}`}
      >
        <h2 className="article-card__title--featured">{title}</h2>
      </ArticleLink>

      <div className="article-card__body--featured">
        <ArticleLink
          url={url}
          slug={slug}
          className="article-card__image-link--featured"
          ariaLabel={`Read article: ${title}`}
        >
          <FramerImage
            src={img}
            alt={title}
            width={800}
            height={450}
            className="article-card__image--featured"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          />
        </ArticleLink>

        <div className="article-card__content--featured">
          <ArticleMeta publishedAt={published_at} readingTime={reading_time} />
          <p className="article-card__summary">{summary}</p>
        </div>
      </div>
    </article>
  );
}

export default FeaturedArticleCard;
