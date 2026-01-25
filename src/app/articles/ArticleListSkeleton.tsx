import React from "react";

const ArticleSkeletonCard = (): React.JSX.Element => (
  <div className="grid grid-cols-12 gap-4 items-center p-4 border border-solid border-dark/40 dark:border-light/40 rounded-lg animate-pulse">
    <div className="col-span-4 md:col-span-12 h-48 rounded-lg bg-dark/10 dark:bg-light/10" />
    <div className="col-span-8 md:col-span-12 flex flex-col gap-3">
      <div className="h-6 w-3/4 rounded bg-dark/10 dark:bg-light/10" />
      <div className="h-4 w-full rounded bg-dark/5 dark:bg-light/5" />
      <div className="h-4 w-2/3 rounded bg-dark/5 dark:bg-light/5" />
      <div className="flex gap-4 mt-2">
        <div className="h-3 w-16 rounded bg-dark/10 dark:bg-light/10" />
        <div className="h-3 w-24 rounded bg-dark/10 dark:bg-light/10" />
      </div>
    </div>
  </div>
);

const ArticleListSkeleton = (): React.JSX.Element => {
  return (
    <div className="articles-grid">
      <ul className="articles-list flex flex-col gap-8">
        <li>
          <ArticleSkeletonCard />
        </li>
        <li>
          <ArticleSkeletonCard />
        </li>
        <li>
          <ArticleSkeletonCard />
        </li>
      </ul>
    </div>
  );
};

export default ArticleListSkeleton;
