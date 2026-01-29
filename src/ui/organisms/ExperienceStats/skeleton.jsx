import "./styles.css";

import { ExtraInfoSkeleton } from "@/molecules/ExtraInfo/skeleton";

/**
 * Skeleton for ExperienceStats list
 * Note: Parent component provides .experience-stats wrapper
 */
export const ExtraInfoListSkeleton = () => {
  return (
    <>
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
      <ExtraInfoSkeleton />
    </>
  );
};
