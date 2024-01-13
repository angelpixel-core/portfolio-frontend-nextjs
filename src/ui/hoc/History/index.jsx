"use client";

import "./styles.css";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

export const History = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <div ref={ref} className="history-container">
      <motion.div
        style={{ scaleY: scrollYProgress }}
        className="history_progress-bar"
      />

      <ul className="history_list-grig">{children}</ul>
    </div>
  );
};
