import "./styles.css";

import { Suspense } from "react";
import BrandTextSkeleton from "./skeleton";

import BrandText from "./BrandText";

export function Copyright({ children }) {
  return (
    <span className="copyright_year">
      <Suspense fallback={<BrandTextSkeleton />}>
        <BrandText />
      </Suspense>
      {children} &copy; All Rights Reserved.
    </span>
  );
}
