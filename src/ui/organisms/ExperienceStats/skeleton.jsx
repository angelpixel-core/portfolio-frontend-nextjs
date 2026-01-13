import "./styles.css";

import { ExtraInfoSkeleton } from "@/molecules/ExtraInfo/skeleton";

export const ExtraInfoListSkeleton = () => {
  return (
    <div className="experience-stats">
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
    </div>
  );
};
