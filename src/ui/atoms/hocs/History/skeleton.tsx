import React from "react";

import "./styles.css";

interface HistorySkeletonProps {
  children: React.ReactNode;
}

export const Skeleton = ({
  children,
}: HistorySkeletonProps): React.JSX.Element => {
  return (
    <div className="history-container">
      <div className="history_progress-bar" />

      <ul className="history_list-grig">{children}</ul>
    </div>
  );
};
