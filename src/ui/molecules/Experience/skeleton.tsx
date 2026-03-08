import React from "react";

import "./styles.css";

import { Skeleton as TransitionerLiSkeleton } from "@/atoms/hocs/TransitionerLi/skeleton";

export const Skeleton = (): React.JSX.Element => {
  return (
    <TransitionerLiSkeleton data="">
      <div
        className="experience__skeleton"
        role="status"
        aria-label="Loading experience"
      >
        <div className="experience__skeleton-header">
          <span className="experience__skeleton-title" />
          <span className="experience__skeleton-company" />
        </div>

        <span className="experience__skeleton-location" />

        <div className="experience__skeleton-history-row">
          <span className="experience__skeleton-toggle" />
          <span className="experience__skeleton-history" />
        </div>
      </div>
    </TransitionerLiSkeleton>
  );
};
