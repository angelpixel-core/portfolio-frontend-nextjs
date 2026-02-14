"use client";

import "./styles.css";

import { m, AnimatePresence } from "framer-motion";
import { useTransition } from "@/hooks/ui/useTransition";

/**
 * TransitionEffect - Page transition curtain animation
 *
 * Story 13.2: Phase-driven by TransitionProvider.
 * Story 13.3: Exit animation with cascade effect.
 * Story 13.4: Reports progress via onUpdate for 50% trigger synchronization.
 *
 * Phase sequence:
 * 1. "entering": All curtains animate Left→Right with cascade (pink first)
 * 2. "covering": All curtains stay at x:100%, page changes behind
 * 3. "exiting": All curtains animate Right→Left with cascade, revealing new page
 * 4. "idle": All at x:0% (off-screen)
 *
 * Note: During "entering", pink (z-50) covers white/dark, so cascade isn't visible.
 * Story 13.6 AC5: Z-index hierarchy (z-50/40/30) ensures curtains cover header (z-10).
 * During "exiting", the cascade creates the "peeling away" effect.
 *
 * CSS positioning context:
 * - .transition-effect_blade has `right-full` (right: 100%)
 * - x: "0%" = invisible (off-screen left)
 * - x: "100%" = covers screen
 *
 * IMPORTANT: Same keys are used for all phases to prevent flash.
 */
const TransitionEffect = () => {
  const { phase, shouldReduceMotion, isInitialLoad, onProgressUpdate } =
    useTransition();

  // Skip transition animation entirely when reduced motion is preferred
  if (shouldReduceMotion) {
    return null;
  }

  // Don't render anything on initial page load (AC5)
  if (isInitialLoad) {
    return null;
  }

  // Only render curtains during active transitions
  const isActive =
    phase === "entering" || phase === "covering" || phase === "exiting";

  // Stagger delays for cascade effect
  const STAGGER_DELAY = 0.1;

  // Determine animation state based on phase:
  // - "entering": all cover screen (L→R) with cascade
  // - "covering": all stay covering (x: 100%)
  // - "exiting": all reveal (R→L) with cascade
  // - "idle": all at x: 0% (off-screen left)
  const getAnimateState = () => {
    if (phase === "entering") {
      // All curtains go to 100% with cascade delay
      // Pink is on top (z-50), so extensions aren't visible during entry
      return { x: "100%" };
    }
    if (phase === "covering") {
      // All stay covering the screen
      return { x: "100%" };
    }
    if (phase === "exiting") {
      // All curtains reveal the page (Right→Left)
      return { x: "0%" };
    }
    return { x: "0%" };
  };

  // Get delay for cascade effect
  const getCascadeDelay = (curtainIndex) => {
    if (phase === "entering") {
      // During entry: pink first, then white, then dark
      return curtainIndex * STAGGER_DELAY;
    }
    if (phase === "exiting") {
      // During exit: pink first, then white, then dark
      return curtainIndex * STAGGER_DELAY;
    }
    return 0;
  };

  /**
   * Handle animation progress update from dark curtain
   * Story 13.4: Track progress during entering phase for 50% trigger
   *
   * @param {Object} latest - Latest animation values from framer-motion
   */
  const handleDarkCurtainUpdate = (latest) => {
    // Only track progress during entering phase
    if (phase !== "entering") return;

    // latest.x is a string like "50%" - parse to number
    const xValue = latest.x;
    if (typeof xValue === "string") {
      const progress = parseFloat(xValue);
      if (!isNaN(progress)) {
        onProgressUpdate?.(progress);
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <>
          {/* Primary curtain (pink) - z-50 is highest, index 0 */}
          {/* Story 13.6 AC5: z-50 ensures curtains are above header (z-10) */}
          <m.div
            key="curtain-primary"
            className="transition-effect_blade z-50 bg-primary w-screen"
            initial={{ x: "0%" }}
            animate={getAnimateState()}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              delay: getCascadeDelay(0),
            }}
          />

          {/* Secondary curtain (white) - z-40, index 1, +20vw extension */}
          <m.div
            key="curtain-secondary"
            className="transition-effect_blade z-40 bg-light w-[120vw]"
            initial={{ x: "0%" }}
            animate={getAnimateState()}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              delay: getCascadeDelay(1),
            }}
          />

          {/* Tertiary curtain (dark) - z-30, index 2, +40vw extension */}
          {/* Story 13.4: This curtain reports progress for 50% trigger */}
          <m.div
            key="curtain-tertiary"
            className="transition-effect_blade z-30 bg-dark w-[140vw]"
            initial={{ x: "0%" }}
            animate={getAnimateState()}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              delay: getCascadeDelay(2),
            }}
            onUpdate={handleDarkCurtainUpdate}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default TransitionEffect;
