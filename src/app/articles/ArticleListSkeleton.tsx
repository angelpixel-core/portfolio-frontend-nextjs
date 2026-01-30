import React from "react";

/**
 * Skeleton card for featured articles in hero blade
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
 * Skeleton card for grid articles
 */
const GridArticleSkeletonCard = (): React.JSX.Element => (
  <div className="article-card article-card--grid animate-pulse">
    <div className="article-card__image-link">
      <div className="article-card__image bg-dark/10 dark:bg-light/10 rounded-lg aspect-[3/2]" />
    </div>
    <div className="article-card__content">
      <div className="flex gap-4 mb-2">
        <div className="h-3 w-20 rounded bg-dark/10 dark:bg-light/10" />
        <div className="h-3 w-14 rounded bg-dark/10 dark:bg-light/10" />
      </div>
      <div className="h-6 w-3/4 rounded bg-dark/10 dark:bg-light/10 mb-2" />
      <div className="h-4 w-full rounded bg-dark/5 dark:bg-light/5 mb-1" />
      <div className="h-4 w-1/2 rounded bg-dark/5 dark:bg-light/5" />
    </div>
  </div>
);

/**
 * ArticleListSkeleton - Displays loading state for Articles page
 * Matches the blade structure layout (AC6)
 */
const ArticleListSkeleton = (): React.JSX.Element => {
  return (
    <div className="articles-page">
      {/* Hero Blade Skeleton */}
      <section className="articles-blade articles-blade--hero">
        <div className="h-16 w-2/3 rounded bg-dark/10 dark:bg-light/10 mb-8 animate-pulse" />
        <div className="articles-blade__featured">
          <FeaturedArticleSkeletonCard />
          <FeaturedArticleSkeletonCard />
        </div>
      </section>

      {/* Grid Blade Skeleton */}
      <section className="articles-blade articles-blade--grid">
        <div className="articles-grid">
          <div className="articles-grid__item">
            <GridArticleSkeletonCard />
          </div>
          <div className="articles-grid__item">
            <GridArticleSkeletonCard />
          </div>
          <div className="articles-grid__item">
            <GridArticleSkeletonCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticleListSkeleton;
