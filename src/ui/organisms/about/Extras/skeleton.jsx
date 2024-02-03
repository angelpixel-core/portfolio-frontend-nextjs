import "./styles.css";

import { ExtraInfoSkeleton } from "@/molecules/_index";

export function ExtrasSkeleton() {
  return (
    <div className="extras-container">
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
    </div>
  );
}
