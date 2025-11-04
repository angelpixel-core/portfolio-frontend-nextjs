"use client";

import "./styles.css";

import { ExtraInfoListSkeleton } from "./skeleton";
import { ExtraInfo } from "@/molecules";
import { useExperienceStats } from "@/hooks";

const ExperienceStats = () => {
  const { data: experienceStats = [], isLoading, isError } = useExperienceStats();

  if (isLoading) {
    return (
      <div className="extras-container">
        <ExtraInfoListSkeleton />
      </div>
    );
  }

  if (isError || !experienceStats.length) {
    return (
      <div className="extras-container">
        <p>Unable to load stats.</p>
      </div>
    );
  }

  return (
    <div className="extras-container">
      {experienceStats.map(({ number, subtitle }, idx) => (
        <ExtraInfo key={idx} number={number} subtitle={subtitle} />
      ))}
    </div>
  );
};

export default ExperienceStats;
