import "./styles.css";

import { ExtraInfoSkeleton } from "@/molecules/ExtraInfo/skeleton";

export const ExtraInfoListSkeleton = () => {
  return (
    <div className="extras-container">
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
    </div>
  );
};
