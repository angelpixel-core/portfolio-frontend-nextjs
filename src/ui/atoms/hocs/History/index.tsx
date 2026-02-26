"use client";

import React, { useRef } from "react";

import "./styles.css";

import { m, useScroll } from "framer-motion";

interface HistoryProps {
  children: React.ReactNode;
}

const History = ({ children }: HistoryProps): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
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
        className="history__progress-bar"
      />

      <ul className="history__list-grid">{children}</ul>
    </div>
  );
};

export default History;
