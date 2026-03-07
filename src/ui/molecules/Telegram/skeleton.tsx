import "./styles.css";

/**
 * Skeleton - Loading state for Telegram component
 * Story 5.2: Telegram Contact
 */
const Skeleton = () => {
  return (
    <span
      className="telegram__link--disabled telegram__link"
      aria-hidden="true"
    >
      Loading...
    </span>
  );
};

export default Skeleton;
