import "./styles.css";

/**
 * AnimatedTitle Skeleton - Reserves space for the title during loading
 *
 * Matches the final title height to prevent layout shift.
 * Shows "Loading..." indicator with subtle pulse animation.
 */
export default function Skeleton() {
  return (
    <div
      className="animated-title-skeleton"
      role="status"
      aria-label="Loading title..."
    >
      <span className="animated-title-skeleton__text">Loading...</span>
    </div>
  );
}
