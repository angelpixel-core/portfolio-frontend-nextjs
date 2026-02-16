import React from "react";

import "./styles.css";

interface ParagraphSkeletonProps {
  className?: string;
  lines?: number;
}

export const ParagraphSkeleton = ({
  className = "",
  lines = 4,
}: ParagraphSkeletonProps): React.JSX.Element => {
  return (
    <div
      className={`paragraph-skeleton ${className}`}
      role="status"
      aria-label="Loading content..."
    >
      {/* Skeleton lines only - no text indicator needed */}
      <div className="paragraph-skeleton__lines">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="paragraph-skeleton__line"
            style={{
              width: i === lines - 1 ? "60%" : "100%", // Last line shorter
            }}
          />
        ))}
      </div>
    </div>
  );
};
