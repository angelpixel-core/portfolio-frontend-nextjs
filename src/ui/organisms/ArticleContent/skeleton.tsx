import "./styles.css";

const ArticleContentSkeleton = () => {
  return (
    <article className="article-content">
      <header className="article-content__header">
        <div className="h-10 w-3/4 bg-dark/10 dark:bg-light/10 rounded animate-pulse mx-auto" />

        <div className="article-content__meta">
          <div className="h-4 w-32 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
          <div className="h-4 w-24 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
        </div>

        <div className="article-content__share">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 w-8 bg-dark/10 dark:bg-light/10 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </header>

      <figure className="article-content__featured-image">
        <div className="w-full h-64 bg-dark/10 dark:bg-light/10 rounded-lg animate-pulse" />
      </figure>

      <div className="article-content__body">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-full bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-full bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-full bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-full bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <footer className="article-content__footer">
        <div className="h-5 w-36 bg-dark/10 dark:bg-light/10 rounded animate-pulse" />
      </footer>
    </article>
  );
};

export default ArticleContentSkeleton;
