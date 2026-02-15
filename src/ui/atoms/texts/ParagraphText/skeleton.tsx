import "./styles.css";

/**
 * ParagraphSkeleton - Text-like placeholder that reserves space for paragraph content
 *
 * Features:
 * - Reserves ~4 lines of text height (matching typical slogan content)
 * - Shows text-like skeleton lines (not a generic gray block)
 * - Displays "Loading..." indicator
 * - Subtle pulse animation
 * - Respects prefers-reduced-motion
 *
 * @param {string} className - Additional CSS classes
 * @param {number} lines - Number of skeleton lines to show (default: 4)
 */
export const ParagraphSkeleton = ({ className = "", lines = 4 }) => {
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
