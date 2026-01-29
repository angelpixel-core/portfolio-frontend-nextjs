"use client";

import "./styles.css";

import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "@/hooks";

/**
 * TransitionEffect - Page transition curtain animation
 *
 * Story 13.2: Refactored to be phase-driven by TransitionProvider.
 *
 * Animation sequence:
 * - "entering" phase: Curtain animates Left→Right, covering the screen
 * - "exiting" phase: Curtain stays covering screen (exit animation in Story 13.3)
 *
 * The curtain ONLY renders when a transition is in progress (phase !== "idle").
 * On initial page load, nothing renders (isInitialLoad === true).
 *
 * CSS positioning context:
 * - .transition-effect_blade has `right-full` (right: 100%)
 * - This positions the blade's right edge at the viewport's left edge
 * - x: "0%" = invisible (off-screen left)
 * - x: "100%" = covers screen (moved right by 100% of screen width)
 *
 * IMPORTANT: Same keys are used for both phases to prevent flash when
 * transitioning from "entering" to "exiting". Different keys would cause
 * AnimatePresence to run exit animations on the old elements.
 */
const TransitionEffect = () => {
  const { phase, shouldReduceMotion, isInitialLoad } = useTransition();

  // Skip transition animation entirely when reduced motion is preferred
  if (shouldReduceMotion) {
    return null;
  }

  // Don't render anything on initial page load (AC5)
  if (isInitialLoad) {
    return null;
  }

  // Only render curtains during active transitions
  const isActive = phase === "entering" || phase === "exiting";

  // Determine animation state based on phase:
  // - "entering": animate from left (0%) to covering screen (100%)
  // - "exiting": stay at 100% (exit animation will be added in Story 13.3)
  const getAnimateState = () => {
    if (phase === "entering") return { x: "100%" };
    if (phase === "exiting") return { x: "100%" };
    return { x: "0%" };
  };

  // Stagger delays for cascade effect
  const STAGGER_DELAY = 0.1;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <>
          {/* Primary curtain (pink) - z-30 is highest */}
          <motion.div
            key="curtain-primary"
            className="transition-effect_blade z-30 bg-primary"
            initial={{ x: "0%" }}
            animate={getAnimateState()}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Secondary curtain (white) - delayed */}
          <motion.div
            key="curtain-secondary"
            className="transition-effect_blade z-20 bg-light"
            initial={{ x: "0%" }}
            animate={getAnimateState()}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              delay: phase === "entering" ? STAGGER_DELAY : 0,
            }}
          />

          {/* Tertiary curtain (dark) - most delayed */}
          <motion.div
            key="curtain-tertiary"
            className="transition-effect_blade z-10 bg-dark"
            initial={{ x: "0%" }}
            animate={getAnimateState()}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              delay: phase === "entering" ? STAGGER_DELAY * 2 : 0,
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default TransitionEffect;
