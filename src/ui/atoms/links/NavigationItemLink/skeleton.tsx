import React from "react";

import "./styles.css";

interface NavigationItemLinkSkeletonProps {
  width?: string;
}

const Skeleton = ({
  width = "3rem",
}: NavigationItemLinkSkeletonProps): React.JSX.Element => {
  return (
    <span className="menu-bar__link navigation-item_name" aria-hidden="true">
      <span
        className="block h-[1em] rounded bg-dark/10 dark:bg-light/10 animate-pulse"
        style={{ width }}
      />
    </span>
  );
};

export default Skeleton;
