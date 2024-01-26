import "./styles.css";

export const HistorySkeleton = ({ children }) => {
  return (
    <div className="history-container">
      <div className="history_progress-bar" />

      <ul className="history_list-grig">{children}</ul>
    </div>
  );
};
