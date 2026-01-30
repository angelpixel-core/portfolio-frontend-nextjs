import "./skeleton.css";

/**
 * ImageLinkSkeleton - Placeholder that reserves exact space for the final image
 *
 * Prevents layout shift by:
 * - Using explicit width/height matching the final image
 * - Using aspect-ratio: 1/1 as fallback for square images
 * - Showing a neutral animated placeholder (no decorative elements)
 *
 * @param {string} className - CSS classes (excludes animation classes like 'ligthning')
 * @param {number|string} size - Image dimensions in pixels (default: 512)
 */
export function ImageLinkSkeleton({ className = "", size = 512 }) {
  // Filter out animation classes that add decorative pseudo-elements
  const filteredClassName = className
    .split(" ")
    .filter((cls) => !cls.includes("ligthning"))
    .join(" ");

  return (
    <div
      className={`image-link-skeleton ${filteredClassName}`}
      style={{
        width: "100%",
        maxWidth: `${size}px`,
        aspectRatio: "1 / 1",
        // NO explicit height - let aspect-ratio control it
      }}
      aria-label="Loading..."
      role="img"
    >
      <span className="image-link-skeleton__text">Loading...</span>
    </div>
  );
}
