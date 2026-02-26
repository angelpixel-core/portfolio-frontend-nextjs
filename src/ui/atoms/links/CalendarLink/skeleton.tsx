import "./styles.css";

/**
 * CalendarLink Skeleton
 * Reserves space for [icon]ontact during loading
 */
const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <span
      className={`calendar__link--skeleton ${className}`}
      style={{ color: "var(--calendar-text-color)" }}
      aria-hidden="true"
    >
      <span className="calendar__icon--skeleton" />
      <span className="calendar__text">ontact</span>
    </span>
  );
};

export default Skeleton;
