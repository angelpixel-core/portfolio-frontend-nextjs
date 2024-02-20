import "./styles.css";

import { ExtraInfoSkeleton } from "@/molecules/ExtraInfo/skeleton";

export function ExtraInfoListSkeleton() {
  return (
    <div className="extras-container">
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
    </div>
  );
}
