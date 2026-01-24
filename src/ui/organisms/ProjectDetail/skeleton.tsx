const ProjectDetailSkeleton = () => {
  return (
    <article className="project-detail">
      <header className="project-detail__header">
        <div className="h-10 w-3/4 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-dark/10 dark:bg-light/10 rounded mt-2 animate-pulse" />
      </header>

      <div className="project-detail__image-container">
        <div className="w-full h-64 bg-dark/10 dark:bg-light/10 rounded-lg animate-pulse" />
      </div>

      <section className="project-detail__content">
        <div className="project-detail__description">
          <div className="h-6 w-48 bg-dark/10 dark:bg-light/10 rounded mb-4 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-full bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
          </div>
        </div>

        <div className="project-detail__technologies mt-8">
          <div className="h-6 w-40 bg-dark/10 dark:bg-light/10 rounded mb-4 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-dark/10 dark:bg-light/10 rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="project-detail__outcomes mt-8">
          <div className="h-6 w-32 bg-dark/10 dark:bg-light/10 rounded mb-4 animate-pulse" />
          <div className="h-4 w-2/3 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
        </div>
      </section>

      <footer className="project-detail__links mt-8 flex gap-4">
        <div className="h-10 w-32 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
        <div className="h-10 w-36 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
      </footer>
    </article>
  );
};

export default ProjectDetailSkeleton;
