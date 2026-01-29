"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks";
import { TransitionContext } from "./TransitionContext";
import type {
  TransitionState,
  TransitionPhase,
  TransitionProviderProps,
} from "./types";

/**
 * Transition timing configuration (in ms)
 * These values coordinate with framer-motion animation durations
 */
const TRANSITION_TIMING = {
  /** Duration of entering phase (curtain covers screen) */
  ENTER_DURATION: 800,
  /** Duration of exiting phase (curtain reveals new page) */
  EXIT_DURATION: 800,
  /** Brief pause at full coverage before navigation */
  PAUSE_AT_FULL: 100,
} as const;

/**
 * CSS class applied to body during transition for interaction blocking
 */
const TRANSITION_ACTIVE_CLASS = "transition-active";

/**
 * TransitionProvider - Centralized page transition state management
 *
 * Provides:
 * - Transition state (isTransitioning, phase, progress)
 * - startTransition function for triggering navigations
 * - Interaction blocking during transitions
 * - Reduced motion support
 *
 * @example
 * ```tsx
 * // In RootProvider
 * <TransitionProvider>
 *   {children}
 * </TransitionProvider>
 *
 * // In a component
 * const { startTransition, isTransitioning } = useTransition();
 * onClick={() => startTransition('/about')}
 * ```
 */
const TransitionProvider = ({ children }: TransitionProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    phase: "idle",
    progress: 0,
    targetHref: null,
  });

  /**
   * Track if this is the initial page load.
   * Set to false after first navigation to enable transitions.
   * Story 13.2 AC5: Skip transitions on direct URL loads.
   */
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  /**
   * Apply/remove interaction blocking on body
   */
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (state.isTransitioning) {
      document.body.classList.add(TRANSITION_ACTIVE_CLASS);
    } else {
      document.body.classList.remove(TRANSITION_ACTIVE_CLASS);
    }

    return () => {
      document.body.classList.remove(TRANSITION_ACTIVE_CLASS);
    };
  }, [state.isTransitioning]);

  /**
   * Reset transition state when pathname changes (navigation complete)
   * Only reset when pathname matches targetHref, indicating navigation finished
   */
  useEffect(() => {
    if (
      state.phase === "exiting" &&
      state.targetHref &&
      pathname === state.targetHref
    ) {
      // Navigation has actually completed (pathname now matches target)
      setState({
        isTransitioning: false,
        phase: "idle",
        progress: 0,
        targetHref: null,
      });
    }
  }, [pathname, state.phase, state.targetHref]);

  /**
   * Update phase based on state machine transitions
   */
  const setPhase = useCallback((phase: TransitionPhase) => {
    setState((prev) => ({
      ...prev,
      phase,
      isTransitioning: phase !== "idle",
    }));
  }, []);

  /**
   * Update progress (0-100) for 50% trigger sync
   */
  const setProgress = useCallback((progress: number) => {
    setState((prev) => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  /**
   * Ref to store timeout ID for cleanup on unmount
   */
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /**
   * Cleanup timeout on unmount to prevent memory leaks
   */
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Trigger a page transition
   *
   * State machine:
   * idle → entering → (navigation) → exiting → idle
   *
   * With reduced motion, navigation is instant
   */
  const startTransition = useCallback(
    (href: string) => {
      // Don't start new transition if already transitioning
      if (state.isTransitioning) return;

      // Don't transition to current page
      if (href === pathname) return;

      // Reduced motion: instant navigation
      if (shouldReduceMotion) {
        router.push(href);
        return;
      }

      // Mark that we've had a navigation (no longer initial load)
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }

      // Start entering phase
      setState({
        isTransitioning: true,
        phase: "entering",
        progress: 0,
        targetHref: href,
      });

      // After entering animation completes, navigate and start exiting
      // Store timeout ref for cleanup on unmount
      transitionTimeoutRef.current = setTimeout(() => {
        router.push(href);
        setPhase("exiting");
        setProgress(0);
      }, TRANSITION_TIMING.ENTER_DURATION + TRANSITION_TIMING.PAUSE_AT_FULL);
    },
    [
      state.isTransitioning,
      pathname,
      shouldReduceMotion,
      router,
      setPhase,
      setProgress,
      isInitialLoad,
    ]
  );

  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo(
    () => ({
      ...state,
      startTransition,
      shouldReduceMotion,
      isInitialLoad,
    }),
    [state, startTransition, shouldReduceMotion, isInitialLoad]
  );

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionProvider;
export { TransitionContext } from "./TransitionContext";
export type {
  TransitionState,
  TransitionPhase,
  TransitionContextValue,
  TransitionProviderProps,
} from "./types";
