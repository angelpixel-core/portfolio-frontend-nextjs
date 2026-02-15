import "./styles.css";

/**
 * AnimatedTitle Skeleton - Reserves space for the title during loading
 *
 * Matches the final title height to prevent layout shift.
 * Mobile: Shows 2 stacked lines (title wraps to 2 lines on narrow screens)
 * Desktop: Shows 1 line (title fits on single line)
 * Accepts className to inherit parent spacing classes (e.g., home_title).
 */
export default function Skeleton({ className = "" }) {
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
