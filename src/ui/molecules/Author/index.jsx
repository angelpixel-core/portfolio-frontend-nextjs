import "./styles.css";

import { Suspense } from "react";
import { default as Skeleton } from "./skeleton";
import { default as Link } from "./Link";

const Author = () => {
  return (
    <span className="author_link-container">
      by &nbsp;
      <Suspense fallback={<Skeleton />}>
        <Link />
      </Suspense>
    </span>
  );
};

export default Author;
