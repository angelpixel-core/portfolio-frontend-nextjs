import React from "react";

/**
 * Skeleton card for featured article in carousel
 */
const FeaturedArticleSkeletonCard = (): React.JSX.Element => (
  <div className="article-card article-card--featured animate-pulse">
    <div className="article-card__image-link--featured">
      <div className="article-card__image--featured bg-dark/10 dark:bg-light/10 rounded-lg" />
    </div>
    <div className="article-card__content--featured">
      <div className="flex gap-4 mb-3">
        <div className="h-4 w-24 rounded bg-dark/10 dark:bg-light/10" />
        <div className="h-4 w-16 rounded bg-dark/10 dark:bg-light/10" />
      </div>
      <div className="h-8 w-3/4 rounded bg-dark/10 dark:bg-light/10 mb-3" />
      <div className="h-4 w-full rounded bg-dark/5 dark:bg-light/5 mb-2" />
      <div className="h-4 w-2/3 rounded bg-dark/5 dark:bg-light/5" />
    </div>
  </div>
);

/**
 * Skeleton for carousel dot indicators
 */
const CarouselDotsSkeleton = (): React.JSX.Element => (
  <div className="flex items-center justify-center gap-2 mt-4">
    <div className="w-6 h-3 rounded-md bg-dark/10 dark:bg-light/10 animate-pulse" />
    <div className="w-3 h-3 rounded-full bg-dark/10 dark:bg-light/10 animate-pulse" />
  </div>
);

/**
 * ArticleListSkeleton - Displays loading state for Articles page
 * Matches the blade structure layout with carousel hero and list (AC6)
 */
const ArticleListSkeleton = (): React.JSX.Element => {
  return (
    <div className="articles-page">
      {/* Hero Blade Skeleton - Single featured card (carousel shows 1 at a time) */}
      <section className="articles-blade articles-blade--hero">
        <div className="h-16 w-2/3 rounded bg-dark/10 dark:bg-light/10 mb-8 animate-pulse" />
        <div className="articles-blade__featured">
          <FeaturedArticleSkeletonCard />
          <CarouselDotsSkeleton />
        </div>
      </section>

      {/* List Blade Skeleton */}
      <section className="articles-blade articles-blade--list">
        <div className="h-8 w-40 rounded bg-dark/10 dark:bg-light/10 mb-6 mx-auto animate-pulse" />
        <div className="articles-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="articles-list__item animate-pulse">
              <div className="flex flex-col gap-2 py-4 border border-dark/10 dark:border-light/10 rounded-lg px-4">
                <div className="h-5 w-3/4 rounded bg-dark/10 dark:bg-light/10" />
                <div className="h-4 w-32 rounded bg-dark/5 dark:bg-light/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArticleListSkeleton;
