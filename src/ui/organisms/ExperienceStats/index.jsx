import "./styles.css";

import { Suspense } from "react";
import { ExtraInfoListSkeleton } from "./skeleton";
import { ExtraInfo } from "@/molecules";
import { useExperienceStats } from "@/hooks";

const ExperienceStats = () => {
  const { data: experienceStats = [] } = useExperienceStats();

  return (
    <div className="extras-container">
      <Suspense fallback={<ExtraInfoListSkeleton />}>
        {experienceStats.map(({ number, subtitle }, idx) => (
          <ExtraInfo key={idx} number={number} subtitle={subtitle} />
        ))}
      </Suspense>
    </div>
  );
};

export default ExperienceStats;
