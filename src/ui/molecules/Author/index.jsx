import "./styles.css";

import { Suspense } from "react";
import AuthorLinkSkeleton from "./skeleton";
import AuthorLink from "./AuthorLink";

export function Author() {
  return (
    <span className="author_link-container">
      by &nbsp;
      <Suspense fallback={<AuthorLinkSkeleton />}>
        <AuthorLink />
      </Suspense>
    </span>
  );
}
