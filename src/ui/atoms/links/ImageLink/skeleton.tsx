import React from "react";

import "./skeleton.css";

/**
 * ImageLinkSkeleton - Placeholder that reserves exact space for the final image
 *
 * Prevents layout shift by:
 * - Using explicit width/height matching the final image constraints
 * - Mobile: 50vh, Desktop: 60vh (same as actual image max-height)
 * - Showing a neutral animated placeholder (no decorative elements)
 *
 * @param {string} className - CSS classes (filters out conflicting classes)
 * @param {number|string} size - Max image dimensions in pixels (default: 512)
 */

interface ImageLinkSkeletonProps {
  className?: string;
  size?: number | string;
}

export function ImageLinkSkeleton({
  className = "",
  size = 512,
}: ImageLinkSkeletonProps): React.JSX.Element {
  // Filter out classes that would override skeleton dimensions
  // - 'ligthning': adds decorative pseudo-elements
  // - 'home-hero__image': has width/height: auto !important that breaks reservation
  const filteredClassName = className
    .split(" ")
    .filter(
      (cls) => !cls.includes("ligthning") && !cls.includes("home-hero__image")
    )
    .join(" ");

  return (
    <div
      className={`image-link-skeleton ${filteredClassName}`}
      style={{
        // Max dimensions from prop, but CSS controls responsive sizing
        maxWidth: `${size}px`,
      }}
      aria-label="Loading image..."
      role="img"
    >
      {/* Infinite spinner - no text */}
      <div className="image-link-skeleton__spinner" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="image-link-skeleton__spinner-svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="image-link-skeleton__spinner-track"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
            className="image-link-skeleton__spinner-arc"
          />
        </svg>
      </div>
    </div>
  );
}
