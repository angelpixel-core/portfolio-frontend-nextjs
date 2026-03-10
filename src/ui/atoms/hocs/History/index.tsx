"use client";

import React, { useEffect, useRef, useState } from "react";

import "./styles.css";

import { m } from "framer-motion";

interface HistoryProps {
  children: React.ReactNode;
}

const History = ({ children }: HistoryProps): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const node = ref.current;
      if (!node || typeof window === "undefined") return;

      const rect = node.getBoundingClientRect();
      const viewportMid = window.innerHeight * 0.5;

      const rawProgress = (viewportMid - rect.top) / Math.max(rect.height, 1);
      const clampedProgress = Math.min(1, Math.max(0, rawProgress));

      const scrollBottom = Math.ceil(window.scrollY + window.innerHeight);
      const pageBottom = document.documentElement.scrollHeight;
      const isAtPageBottom = scrollBottom >= pageBottom;

      setProgress(isAtPageBottom ? 1 : clampedProgress);
    };

    let rafId = 0;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="history-container"
      style={{ position: "relative" }}
    >
      <div className="history__track" aria-hidden="true" />

      <m.div
        style={{ scaleY: progress }}
        className="history__progress-bar"
        aria-hidden="true"
      />

      <ul className="history__list-grid">{children}</ul>
    </div>
  );
};

export default History;
