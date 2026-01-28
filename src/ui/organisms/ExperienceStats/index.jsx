"use client";

import "./styles.css";

import { ExtraInfoListSkeleton } from "./skeleton";
import { ExtraInfo } from "@/molecules";
import { useExperienceStats } from "@/hooks";

const ExperienceStats = () => {
  const {
    data: experienceStats = [],
    isLoading,
    isError,
  } = useExperienceStats();

  if (isLoading) {
    return (
      <div className="experience-stats" data-testid="experience-stats-loading">
        <ExtraInfoListSkeleton />
      </div>
    );
  }

  if (isError || !experienceStats.length) {
    return (
      <div className="experience-stats" data-testid="experience-stats-fallback">
        <div className="experience-stats_fallback">
          <span className="experience-stats_fallback-text">
            Statistics currently unavailable
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="experience-stats" data-testid="experience-stats">
      {experienceStats.map(({ number, subtitle }, idx) => (
        <ExtraInfo key={idx} number={number} subtitle={subtitle} />
      ))}
    </div>
  );
};

export default ExperienceStats;
