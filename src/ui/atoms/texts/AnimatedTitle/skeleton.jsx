import "./styles.css";

/**
 * AnimatedTitle Skeleton - Reserves space for the title during loading
 *
 * Matches the final title height to prevent layout shift.
 * Shows a skeleton line (no text) that matches the title width.
 * Accepts className to inherit parent spacing classes (e.g., home_title).
 */
export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animated-title-skeleton ${className}`}
      role="status"
      aria-label="Loading title..."
    >
      {/* Skeleton line - no text, matches title width */}
      <div className="animated-title-skeleton__line" aria-hidden="true" />
    </div>
  );
}
