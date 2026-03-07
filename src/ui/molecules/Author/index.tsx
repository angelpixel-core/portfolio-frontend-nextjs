import React from "react";

import "./styles.css";

import { Suspense } from "react";
import { default as Skeleton } from "./skeleton";
import { default as Link } from "./Link";

const Author = (): React.JSX.Element => {
  return (
    <span className="author__link-container">
      <Suspense fallback={<Skeleton />}>
        <Link />
      </Suspense>
    </span>
  );
};

export default Author;
