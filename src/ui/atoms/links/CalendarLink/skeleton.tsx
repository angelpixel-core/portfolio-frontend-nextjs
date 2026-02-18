import "./styles.css";

/**
 * CalendarLink Skeleton
 * Reserves space for [icon]ontact during loading
 */
const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <span
      className={`calendar_link--skeleton ${className}`}
      style={{ color: "var(--calendar-text-color)" }}
      aria-hidden="true"
    >
      <span className="calendar_icon--skeleton" />
      <span className="calendar_text">ontact</span>
    </span>
  );
};

export default Skeleton;
