import React from "react";

const pulse = "bg-dark/10 dark:bg-light/10 rounded animate-pulse";

/**
 * Skeleton card for featured article - uses real BEM classes
 * Matches FeaturedArticleCard structure for consistent layout
 */
const FeaturedCardSkeleton = (): React.JSX.Element => (
  <article className="article-card article-card--featured" aria-hidden="true">
    {/* Image */}
    <div className="article-card__image-link--featured w-full">
      <div
        className={`w-full ${pulse} rounded-lg`}
        style={{ aspectRatio: "800/450" }}
      />
    </div>

    {/* Content — uses BEM classes for layout */}
    <div className="article-card__content--featured">
      {/* Meta: date + reading time */}
      <div className="article-card__meta">
        <div className={`h-4 w-24 ${pulse}`} />
        <span className="article-card__separator" aria-hidden="true">
          &bull;
        </span>
        <div className={`h-4 w-16 ${pulse}`} />
      </div>

      {/* Title (5 lines to match real card height at 320px) */}
      <div className="article-card__title-link my-2 space-y-2">
        <div className={`h-7 w-full ${pulse}`} />
        <div className={`h-7 w-full ${pulse}`} />
        <div className={`h-7 w-full ${pulse}`} />
        <div className={`h-7 w-3/4 ${pulse}`} />
        <div className={`h-7 w-1/2 ${pulse}`} />
      </div>

      {/* Summary (3 lines to match line-clamp-3) */}
      <div className="article-card__summary flex-col space-y-2">
        <div className={`h-4 w-full ${pulse}`} />
        <div className={`h-4 w-full ${pulse}`} />
        <div className={`h-4 w-2/3 ${pulse}`} />
      </div>
    </div>
  </article>
);

/**
 * Skeleton for carousel dot indicators
 */
const CarouselDotsSkeleton = (): React.JSX.Element => (
  <div className="featured-carousel__dots" aria-hidden="true">
    <div className={`w-6 h-3 rounded-md ${pulse}`} />
    <div className={`w-3 h-3 rounded-full ${pulse}`} />
  </div>
);

/**
 * ArticleListSkeleton - Displays loading state for Articles page
 * Uses real BEM classes for consistent layout with actual content
 */
const ArticleListSkeleton = (): React.JSX.Element => {
  return (
    <div className="articles-page" data-testid="articles-skeleton">
      {/* Hero Blade: Title + Featured */}
      <section className="articles-blade articles-blade--hero">
        {/* Title — uses .articles-title for matching sizing at each bp */}
        <div className="articles-title flex flex-col items-center gap-2">
          <div className={`h-10 w-40 ${pulse}`} />
          <div className={`h-10 w-28 ${pulse}`} />
        </div>

        {/* Featured card in carousel structure */}
        <div className="articles-blade__featured">
          <div className="featured-carousel">
            <div className="featured-carousel__viewport">
              <div className="featured-carousel__track">
                <div className="featured-carousel__slide">
                  <FeaturedCardSkeleton />
                </div>
              </div>
            </div>
            <CarouselDotsSkeleton />
          </div>
        </div>
      </section>

      {/* List Blade: All Articles */}
      <section className="articles-blade articles-blade--list">
        <h2 className="articles-list__heading">
          <span className={`block h-8 w-32 ${pulse} mx-auto`} />
        </h2>
        <div className="articles-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="articles-list__item">
              {/* Uses article-list-item class for consistent layout with shadow */}
              <article className="article-list-item" aria-hidden="true">
                {/* Shadow placeholder - matches box-shadow--list-item */}
                <div className="absolute -top-1 left-2 -z-10 w-full h-[calc(100%+8px)] rounded-2xl rounded-br-3xl mobile:rounded-br-2xl bg-dark/20 dark:bg-light/20" />
                <div className={`h-5 w-3/4 ${pulse}`} />
                <div className={`h-4 w-32 ${pulse}`} />
              </article>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArticleListSkeleton;
