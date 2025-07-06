"use client";

import "./styles.css";

import { motion, useScroll } from "framer-motion";

const LiIcon = ({ reference }) => {
  const { scrollYProgress } = useScroll({
    target: reference,
    offset: ["center end", "center center"],
  });

  return (
    <figure className="li-icon_figure">
      <svg
        width="75"
        height="75"
        viewBox="0 0 100 100"
        className="li-icon_figure-svg"
      >
        <circle cx="75" cy="50" r="20" className="li-icon_circle--outer" />
        <motion.circle
          cx="75"
          cy="50"
          r="20"
          className="li-icon_circle--progress-bar"
          style={{ pathLength: scrollYProgress }}
        />
        <circle cx="75" cy="50" r="10" className="li-icon_circle--inner" />
      </svg>
    </figure>
  );
};

export default LiIcon;
