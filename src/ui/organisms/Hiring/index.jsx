import "./styles.css";

import { Suspense } from "react";
import { HireMeButton } from "@/atoms/buttons";
import { Skeleton as HireMeButtonSkeleton } from "./skeleton";

const Hiring = () => {
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
