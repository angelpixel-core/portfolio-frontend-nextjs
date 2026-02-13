import React from "react";

const pulse = "bg-dark/10 dark:bg-light/10 rounded animate-pulse";

const FeaturedCardSkeleton = (): React.JSX.Element => (
  <article className="project-card project-card--featured" aria-hidden="true">
    {/* Image */}
    <div className="project-card__image-link--featured w-full">
      <div
        className={`w-full ${pulse} rounded-lg`}
        style={{ aspectRatio: "16/9" }}
      />
    </div>

    {/* Content — uses BEM classes for CSS Grid placement at 800px+ */}
    <div className="project-card__content--featured">
      {/* Tags */}
      <div className={`project-card__tags h-4 w-32 ${pulse}`} />
      {/* Title (multi-line to match real card height) */}
      <div className="project-card__title-link my-2 space-y-2">
        <div className={`h-7 w-full ${pulse}`} />
        <div className={`h-7 w-3/4 ${pulse}`} />
        <div className={`h-7 w-1/2 ${pulse}`} />
      </div>
      {/* Summary */}
      <div className="project-card__summary flex-col space-y-2">
        <div className={`h-4 w-full ${pulse}`} />
        <div className={`h-4 w-full ${pulse}`} />
        <div className={`h-4 w-5/6 ${pulse}`} />
        <div className={`h-4 w-3/5 ${pulse}`} />
        <div className={`h-4 w-2/3 ${pulse}`} />
      </div>
      {/* Actions (col 1 at 800px+) */}
      <div className="project-card__actions project-card__actions--featured project-card__actions--visible">
        <div className={`w-8 h-8 ${pulse} rounded-full`} />
        <div className={`h-8 w-28 ${pulse} rounded-lg`} />
      </div>
      {/* Tech icons (col 2 at 800px+) */}
      <div className="project-card__tech-stack">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`w-6 h-6 ${pulse} rounded-full`} />
        ))}
      </div>
    </div>
  </article>
);

const GridCardSkeleton = (): React.JSX.Element => (
  <article className="project-card project-card--grid" aria-hidden="true">
    {/* Image */}
    <div className="project-card__image-link w-full">
      <div
        className={`w-full ${pulse} rounded-lg`}
        style={{ aspectRatio: "16/9" }}
      />
    </div>

    {/* Content */}
    <div className="project-card__content w-full mt-4">
      {/* Tags */}
      <div className={`h-4 w-24 ${pulse}`} />
      {/* Title */}
      <div className={`h-6 w-3/4 ${pulse} my-2`} />
      {/* Tech icons */}
      <div className="project-card__tech-stack">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-5 h-5 ${pulse} rounded-full`} />
        ))}
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between w-full mt-2">
        <div className={`h-4 w-12 ${pulse}`} />
        <div className={`w-8 h-8 ${pulse} rounded-full`} />
      </div>
    </div>
  </article>
);

const ProjectListSkeleton = (): React.JSX.Element => {
  return (
    <div className="projects-page" data-testid="projects-skeleton">
      {/* Hero Blade: Title + Filter + Featured */}
      <section className="projects-blade projects-blade--hero">
        {/* Title — uses .projects-title for matching margin-bottom at each bp */}
        <div className="projects-title flex flex-col items-center gap-2">
          <div className={`h-10 w-3/4 ${pulse}`} />
          <div
            className={`h-10 w-1/2 ${pulse} projects-skeleton__title-line2`}
          />
        </div>

        {/* Filter — uses .tech-filter for matching visibility & margin */}
        <div className="projects-blade__filter-wrapper">
          <div className="tech-filter">
            <div className="tech-filter__chips justify-center">
              {[80, 108, 84, 52, 68, 96, 60, 76, 88, 72].map((w, i) => (
                <div
                  key={i}
                  className={`h-7 rounded-full ${pulse}`}
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Featured card */}
        <div className="projects-blade__featured">
          <FeaturedCardSkeleton />
        </div>
      </section>

      {/* Grid Blade: Non-featured */}
      <section className="projects-blade projects-blade--grid">
        <div className="projects-grid">
          <div className="projects-grid__item">
            <GridCardSkeleton />
          </div>
          <div className="projects-grid__item">
            <GridCardSkeleton />
          </div>
        </div>
      </section>

      {/* Secondary Hero Blade: Second featured */}
      <section className="projects-blade projects-blade--hero projects-blade--secondary">
        <div className="projects-blade__featured">
          <FeaturedCardSkeleton />
        </div>
      </section>

      {/* Secondary Grid Blade */}
      <section className="projects-blade projects-blade--grid">
        <div className="projects-grid">
          <div className="projects-grid__item">
            <GridCardSkeleton />
          </div>
          <div className="projects-grid__item">
            <GridCardSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectListSkeleton;
