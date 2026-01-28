/**
 * ChevronDownIcon - Expand/collapse toggle indicator
 * Story 12.10: About Experiences/Education UX
 *
 * Used for expandable sections like Experience details.
 * Rotates 180° when expanded state is active.
 */
const ChevronDownIcon = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`w-full h-auto ${className}`}
      {...rest}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m6 9 6 6 6-6"
      />
    </svg>
  );
};

export default ChevronDownIcon;
