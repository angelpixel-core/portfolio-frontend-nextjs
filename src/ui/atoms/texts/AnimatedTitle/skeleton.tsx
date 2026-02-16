import React from "react";

import "./styles.css";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({
  className = "",
}: SkeletonProps): React.JSX.Element {
  return (
    <div
      className={`animated-title-skeleton ${className}`}
      role="status"
      aria-label="Loading title..."
    >
      {/* Mobile: 2 lines stacked, Desktop: only first line visible */}
      <div
        className="animated-title-skeleton__line animated-title-skeleton__line--primary"
        aria-hidden="true"
      />
      <div
        className="animated-title-skeleton__line animated-title-skeleton__line--secondary"
        aria-hidden="true"
      />
    </div>
  );
}
