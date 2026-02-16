import React, { Suspense } from "react";

import "./styles.css";

import { HireMeButton } from "@/atoms/buttons";
import { Skeleton as HireMeButtonSkeleton } from "./skeleton";

const Hiring = (): React.JSX.Element => {
  return (
    <div className="hiring_container">
      <div className="cloud">
        <Suspense fallback={<HireMeButtonSkeleton />}>
          <HireMeButton className="hiring_links" />
        </Suspense>
      </div>
    </div>
  );
};

export default Hiring;
