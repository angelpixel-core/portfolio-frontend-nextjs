"use client";

import React from "react";

import "./styles.css";

import { m, useScroll } from "framer-motion";

interface LiIconProps {
  reference: React.RefObject<HTMLElement>;
}

const LiIcon = ({ reference }: LiIconProps): React.JSX.Element => {
  const { scrollYProgress } = useScroll({
    target: reference,
    offset: ["center end", "center center"],
    layoutEffect: false,
  });

  return (
    <figure className="li-icon__figure">
      <svg
        width="75"
        height="75"
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="li-icon__figure-svg"
      >
        <circle cx="75" cy="50" r="20" className="li-icon__circle--outer" />
        <m.circle
          cx="75"
          cy="50"
          r="20"
          className="li-icon__circle--progress-bar"
          style={{ pathLength: scrollYProgress }}
        />
        <circle cx="75" cy="50" r="10" className="li-icon__circle--inner" />
      </svg>
    </figure>
  );
};

export default LiIcon;
