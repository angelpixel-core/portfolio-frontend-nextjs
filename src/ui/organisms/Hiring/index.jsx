import "./styles.css";

import { Suspense } from "react";
import { HireMeButton } from "@/atoms/buttons/_index";
import { HireMeButtonSkeleton } from "./skeleton";

export function Hiring() {
  return (
    <div className="hiring_container">
      <div className="cloud">
        <Suspense fallback={<HireMeButtonSkeleton />}>
          <HireMeButton className="hiring_links" />
        </Suspense>
      </div>
    </div>
  );
}
