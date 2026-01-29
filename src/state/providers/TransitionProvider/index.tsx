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
 * Parse environment variable for transition pause duration
 * Falls back to default if not set or invalid
 */
const getTransitionPauseMs = (): number => {
  const envValue = process.env.NEXT_PUBLIC_TRANSITION_PAUSE_MS;
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      return parsed;
    }
  }
  return 100; // Default fallback
};

/**
 * Transition timing configuration (in ms)
 * These values coordinate with framer-motion animation durations
 */
const TRANSITION_TIMING = {
  /** Duration of entering phase (curtain covers screen) */
  ENTER_DURATION: 800,
  /** Duration of exiting phase (curtain reveals new page) */
  EXIT_DURATION: 800,
  /** Brief pause at full coverage before navigation - configurable via NEXT_PUBLIC_TRANSITION_PAUSE_MS */
  PAUSE_AT_FULL: getTransitionPauseMs(),
  /** Pause after navigation completes before exit animation */
  PAUSE_BEFORE_EXIT: 100,
  /** Timeout fallback for stuck transitions (ADR-13.3-003) */
  EXIT_FALLBACK_TIMEOUT: 800 + 500, // EXIT_DURATION + buffer
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
   * Handle navigation completion and phase transitions
   *
   * Flow:
   * 1. "covering" phase: curtain is covering, waiting for navigation
   * 2. pathname changes to targetHref: navigation complete
   * 3. Small pause, then transition to "exiting"
   * 4. "exiting" animation completes, then "idle"
   */
  useEffect(() => {
    // When covering and pathname matches target, navigation is complete
    // Start exit animation after a small pause
    if (
      state.phase === "covering" &&
      state.targetHref &&
      pathname === state.targetHref
    ) {
      const exitTimer = setTimeout(() => {
        setPhase("exiting");
      }, TRANSITION_TIMING.PAUSE_BEFORE_EXIT);

      return () => clearTimeout(exitTimer);
    }
  }, [pathname, state.phase, state.targetHref, setPhase]);

  /**
   * Transition to idle after exit animation completes
   */
  useEffect(() => {
    if (state.phase === "exiting") {
      const idleTimer = setTimeout(() => {
        setState({
          isTransitioning: false,
          phase: "idle",
          progress: 0,
          targetHref: null,
        });
      }, TRANSITION_TIMING.EXIT_DURATION + 200); // Exit duration + cascade buffer

      return () => clearTimeout(idleTimer);
    }
  }, [state.phase]);

  /**
   * Timeout fallback for stuck transitions (ADR-13.3-003)
   * If phase stays "covering" too long (navigation failed), force to idle.
   */
  useEffect(() => {
    if (state.phase === "covering") {
      const fallbackTimeout = setTimeout(() => {
        console.warn(
          "[TransitionProvider] Covering timeout - forcing idle (navigation may have failed)"
        );
        setState({
          isTransitioning: false,
          phase: "idle",
          progress: 0,
          targetHref: null,
        });
      }, TRANSITION_TIMING.EXIT_FALLBACK_TIMEOUT);

      return () => clearTimeout(fallbackTimeout);
    }
  }, [state.phase]);

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

      // After entering animation completes:
      // 1. Go to "covering" phase (curtain stays covering)
      // 2. Navigate to new page
      // 3. Wait for pathname to change (handled by useEffect)
      // 4. Then start exiting animation
      transitionTimeoutRef.current = setTimeout(() => {
        setPhase("covering");
        router.push(href);
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
