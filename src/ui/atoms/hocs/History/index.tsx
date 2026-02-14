"use client";

import "./styles.css";

import { useRef } from "react";
import { m, useScroll } from "framer-motion";

const History = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
    layoutEffect: false,
  });

  return (
    <div
      ref={ref}
      className="history-container"
      style={{ position: "relative" }}
    >
      <m.div
        style={{ scaleY: scrollYProgress }}
        className="history_progress-bar"
      />

      <ul className="history_list-grid">{children}</ul>
    </div>
  );
};

export default History;
