import React from "react";

import "./styles.css";

const Skeleton = (): React.JSX.Element => {
  return (
    <span className="social__link" aria-hidden="true">
      <span
        className="rounded-full bg-dark/10 dark:bg-light/10 animate-pulse block"
        style={{ width: 40, height: 40 }}
      />
    </span>
  );
};

export default Skeleton;
