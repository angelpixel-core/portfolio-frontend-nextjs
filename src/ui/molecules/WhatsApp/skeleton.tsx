import "./styles.css";

/**
 * Skeleton - Loading state for WhatsApp component
 * Story 5.2: WhatsApp Contact
 */
const Skeleton = () => {
  return (
    <span
      className="whatsapp__link--disabled whatsapp__link"
      aria-hidden="true"
    >
      Loading...
    </span>
  );
};

export default Skeleton;
