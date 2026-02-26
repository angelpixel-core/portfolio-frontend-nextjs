import React from "react";

import "./styles.css";

export const Skeleton = (): React.JSX.Element => {
  return (
    <figure className="li-icon__figure">
      <svg
        width="75"
        height="75"
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="li-icon__figure-svg"
      >
        <circle
          cx="75"
          cy="50"
          r="20"
          className="stroke-primary dark:stroke-primaryDark stroke-1 fill-none"
        />
        <circle
          cx="75"
          cy="50"
          r="20"
          className="stroke-[5px] fill-light dark:fill-dark"
        />
        <circle
          cx="75"
          cy="50"
          r="10"
          className="animate-pulse stroke-1 fill-primary dark:fill-primaryDark"
        />
      </svg>
    </figure>
  );
};
