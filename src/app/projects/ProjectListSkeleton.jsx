import React from "react";

const pulse = "bg-dark/10 dark:bg-light/10 rounded animate-pulse";

const FeaturedCardSkeleton = () => (
  <article className="project-card project-card--featured" aria-hidden="true">
    {/* Image */}
    <div className="project-card__image-link--featured w-full">
      <div className={`w-full ${pulse} rounded-lg`} style={{ aspectRatio: "16/9" }} />
    </div>

    {/* Content */}
    <div className="project-card__content--featured">
      {/* Tags */}
      <div className={`h-4 w-32 ${pulse}`} />
      {/* Title */}
      <div className={`h-7 w-3/4 ${pulse} my-2`} />
      {/* Summary */}
      <div className="w-full space-y-2 my-2">
        <div className={`h-3 w-full ${pulse}`} />
        <div className={`h-3 w-5/6 ${pulse}`} />
        <div className={`h-3 w-4/6 ${pulse}`} />
      </div>
      {/* Tech icons */}
      <div className="project-card__tech-stack">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`w-6 h-6 ${pulse} rounded-full`} />
        ))}
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2 mt-2">
        <div className={`w-8 h-8 ${pulse} rounded-full`} />
        <div className={`h-8 w-28 ${pulse} rounded-lg`} />
      </div>
    </div>
  </article>
);

const GridCardSkeleton = () => (
  <article className="project-card project-card--grid" aria-hidden="true">
    {/* Image */}
    <div className="project-card__image-link w-full">
      <div className={`w-full ${pulse} rounded-lg`} style={{ aspectRatio: "16/9" }} />
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

const ProjectListSkeleton = () => {
  return (
    <div className="projects-page" data-testid="projects-skeleton">
      {/* Hero Blade: Title + Featured */}
      <section className="projects-blade projects-blade--hero">
        {/* Title placeholder */}
        <div className="flex justify-center mb-4">
          <div className={`h-8 w-3/4 ${pulse}`} />
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
    </div>
  );
};

export default ProjectListSkeleton;
