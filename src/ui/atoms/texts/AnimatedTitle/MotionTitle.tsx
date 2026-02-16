"use client";

import React from "react";
import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import { useTransition } from "@/hooks/ui/useTransition";

interface MotionTitleProps {
  title: string;
  className: string;
}

const MotionTitle = ({
  title,
  className,
}: MotionTitleProps): React.JSX.Element => {
  const shouldReduceMotion = useReducedMotion();
  const { canAnimate, isInitialLoad, phase } = useTransition();

  /**
   * Determine if animation should play:
   * - Initial page load (isInitialLoad === true): animate on mount
   * - Navigation transition: wait for 50% trigger (canAnimate === true)
   * - Idle phase: stay visible after transition completes
   *
   * This ensures:
   * 1. Titles don't animate before the curtain reveals them (FR13.10)
   * 2. Titles stay visible after the transition ends (don't hide again)
   */
  const shouldAnimate = isInitialLoad || canAnimate || phase === "idle";

  const quote = {
    initial: { opacity: shouldReduceMotion ? 1 : 0.5 },
    animate: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { delay: 0.1, duration: 0.6, ease: "easeOut" },
      staggerChildren: shouldReduceMotion ? 0 : 0.05,
    },
  };

  const singleWord = {
    initial: {
      opacity: shouldReduceMotion ? 1 : 0.5,
      y: shouldReduceMotion ? 0 : 15,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" },
    },
  };

  return (
    <m.h1
      className={`animated-title ${className}`}
      variants={quote}
      initial="initial"
      animate={shouldAnimate ? "animate" : "initial"}
    >
      {title.split(" ").map((word, index) => (
        <m.span
          key={`${word}-${index}`}
          className="animated-title_word"
          variants={singleWord}
        >
          {word}&nbsp;
        </m.span>
      ))}
    </m.h1>
  );
};

export default MotionTitle;
