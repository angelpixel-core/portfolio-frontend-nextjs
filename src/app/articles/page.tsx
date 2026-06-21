import React, { Suspense } from "react";

import ArticlesContent from "./ArticlesContent";
import ArticleListSkeleton from "./ArticleListSkeleton";

export const dynamic = "force-dynamic";

export default function ArticlesPage(): React.JSX.Element {
  return (
    <Suspense fallback={<ArticleListSkeleton />}>
      <ArticlesContent />
    </Suspense>
  );
}
