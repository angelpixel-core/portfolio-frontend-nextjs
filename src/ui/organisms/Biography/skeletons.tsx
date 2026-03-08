import React from "react";

import "./styles.css";

interface BiographySkeletonProps {
  lines?: number;
  showMobileHero?: boolean;
}

const getLineWidth = (index: number, total: number): string => {
  if (total <= 2) {
    return index === total - 1 ? "78%" : "100%";
  }

  if (index === total - 1) {
    return "72%";
  }

  return index === total - 2 ? "92%" : "100%";
};

export const BiographySkeleton = ({
  lines = 3,
  showMobileHero = false,
}: BiographySkeletonProps): React.JSX.Element => {
  return (
    <div
      className="biography__skeleton"
      role="status"
      aria-label="Loading content..."
    >
      <div className="biography__skeleton-lines">
        {Array.from({ length: lines }).map((_, index) => (
          <span
            key={index}
            className="biography__skeleton-line"
            style={{ width: getLineWidth(index, lines) }}
          />
        ))}
      </div>

      {showMobileHero && (
        <div className="biography__mobile-hero biography__mobile-hero--skeleton">
          <div className="biography__mobile-hero-frame">
            <div className="biography__mobile-hero-image biography__mobile-hero-image--skeleton" />
          </div>
        </div>
      )}
    </div>
  );
};
