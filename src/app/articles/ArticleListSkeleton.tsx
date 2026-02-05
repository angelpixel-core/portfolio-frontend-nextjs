import React from "react";
import "@/atoms/shadows/BoxShadow/styles.css";
import "@/molecules/FeaturedArticlesCarousel/styles.css";

/**
 * Title skeleton - uses articles-title class for same centering/sizing
 */
const TitleSkeleton = (): React.JSX.Element => (
  <div className="articles-title" aria-hidden="true">
    {/* Line 1: "Thoughts &" */}
    <span className="animated-title_word inline">
      <span className="block h-[1em] w-32 rounded bg-dark/10 dark:bg-light/10 animate-pulse" />
    </span>
    {/* Line 2: "Insights" (block for new line) */}
    <span className="animated-title_word block">
      <span className="block h-[1em] w-24 rounded bg-dark/10 dark:bg-light/10 animate-pulse mx-auto" />
    </span>
  </div>
);

/**
 * Skeleton card for featured article - matches FeaturedArticleCard structure exactly
 */
const FeaturedArticleSkeletonCard = (): React.JSX.Element => (
  <article className="article-card article-card--featured animate-pulse">
    {/* BoxShadow - same as real card */}
    <div className="box-shadow" aria-hidden="true" />

    {/* Image placeholder */}
    <div className="article-card__image-link--featured">
      <div
        className="article-card__image--featured bg-dark/10 dark:bg-light/10 rounded-lg"
        style={{ aspectRatio: "800/450" }}
      />
    </div>

    {/* Content */}
    <div className="article-card__content--featured">
      {/* Meta: date + reading time */}
      <div className="article-card__meta">
        <span className="h-4 w-28 rounded bg-dark/10 dark:bg-light/10 block" />
        <span className="article-card__separator" aria-hidden="true">
          &bull;
        </span>
        <span className="h-4 w-16 rounded bg-dark/10 dark:bg-light/10 block" />
      </div>

      {/* Title */}
      <div className="article-card__title-link">
        <div className="article-card__title--featured">
          <span className="block h-8 w-full rounded bg-dark/10 dark:bg-light/10 mb-2" />
          <span className="block h-8 w-3/4 rounded bg-dark/10 dark:bg-light/10" />
        </div>
      </div>

      {/* Summary */}
      <div className="article-card__summary">
        <span className="block h-4 w-full rounded bg-dark/5 dark:bg-light/5 mb-2" />
        <span className="block h-4 w-full rounded bg-dark/5 dark:bg-light/5 mb-2" />
        <span className="block h-4 w-2/3 rounded bg-dark/5 dark:bg-light/5" />
      </div>
    </div>
  </article>
);

/**
 * Skeleton for carousel dot indicators
 */
const CarouselDotsSkeleton = (): React.JSX.Element => (
  <div className="featured-carousel__dots" aria-hidden="true">
    <div className="w-6 h-3 rounded-md bg-dark/10 dark:bg-light/10 animate-pulse" />
    <div className="w-3 h-3 rounded-full bg-dark/10 dark:bg-light/10 animate-pulse" />
  </div>
);

/**
 * ArticleListSkeleton - Displays loading state for Articles page
 * Uses exact same container/class structure as real content to prevent layout shift
 */
const ArticleListSkeleton = (): React.JSX.Element => {
  return (
    <div className="articles-page">
      {/* Hero Blade Skeleton */}
      <section className="articles-blade articles-blade--hero">
        <TitleSkeleton />

        <div className="articles-blade__featured">
          {/* Carousel structure with same padding as real carousel */}
          <div className="featured-carousel">
            <div className="featured-carousel__viewport">
              <div className="featured-carousel__track">
                <div className="featured-carousel__slide">
                  <FeaturedArticleSkeletonCard />
                </div>
              </div>
            </div>
            <CarouselDotsSkeleton />
          </div>
        </div>
      </section>

      {/* List Blade Skeleton */}
      <section className="articles-blade articles-blade--list">
        <h2 className="articles-list__heading">
          <span className="block h-8 w-32 rounded bg-dark/10 dark:bg-light/10 animate-pulse mx-auto" />
        </h2>
        <div className="articles-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="articles-list__item animate-pulse">
              <div className="flex flex-col gap-2 py-4 border border-dark/10 dark:border-light/10 rounded-lg px-4 border-l-4 border-l-primary dark:border-l-primaryDark">
                <span className="h-5 w-3/4 rounded bg-dark/10 dark:bg-light/10 block" />
                <span className="h-4 w-32 rounded bg-dark/5 dark:bg-light/5 block" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArticleListSkeleton;
