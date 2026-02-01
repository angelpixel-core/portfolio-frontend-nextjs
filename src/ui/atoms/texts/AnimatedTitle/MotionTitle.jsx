"use client";

import { motion } from "framer-motion";
import { useReducedMotion, useTransition } from "@/hooks";

/**
 * MotionTitle - Animated page title with transition sync
 *
 * Story 13.5: Integrates with TransitionProvider for 50% trigger synchronization.
 * - On initial page load: animates on mount (existing behavior)
 * - On navigation transition: waits for canAnimate flag (50% trigger)
 *
 * Animation: slide-up from y:50 to y:0 + fade from opacity:0 to opacity:1
 * Each word animates with stagger delay for visual polish.
 */
const MotionTitle = ({ title, className }) => {
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
    <motion.h1
      className={`animated-title ${className}`}
      variants={quote}
      initial="initial"
      animate={shouldAnimate ? "animate" : "initial"}
    >
      {title.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="animated-title_word"
          variants={singleWord}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default MotionTitle;
