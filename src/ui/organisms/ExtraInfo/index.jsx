import "./styles.css";

import { Suspense } from "react";
import { ExtraInfoListSkeleton } from "./skeleton";
import { ExtraInfoList } from "./ExtraInfoList";

export function ExtraInfo() {
  return (
    <div className="extras-container">
      <Suspense fallback={<ExtraInfoListSkeleton />}>
        <ExtraInfoList />
      </Suspense>
    </div>
  );
}
