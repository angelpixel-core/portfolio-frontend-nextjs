"use client";

import TransitionEffect from "@/molecules/TransitionEffect";
import { useTransition } from "@/hooks/ui/useTransition";

/**
 * AnimatedChildren - Wrapper for page content with transition animations
 *
 * Story 13.1: Integrated with TransitionProvider for centralized state management
 * Story 13.2: Simplified - TransitionEffect now handles its own animation logic
 *             based on provider phase. Removed AnimatePresence key={pathname}
 *             since transitions are now phase-driven, not pathname-driven.
 *
 * The TransitionEffect component renders the curtain overlay and handles
 * all animation logic internally based on the transition phase from context.
 */
const AnimatedChildren = ({ children }) => {
  const { phase, shouldReduceMotion } = useTransition();

  // Skip transition effects wrapper when reduced motion is preferred
  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <div data-transition-phase={phase}>
      <TransitionEffect />
      {children}
    </div>
  );
};

export default AnimatedChildren;
