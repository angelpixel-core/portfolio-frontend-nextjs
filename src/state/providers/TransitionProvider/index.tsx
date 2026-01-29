"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks";
import { TransitionContext } from "./TransitionContext";
import type {
  TransitionState,
  TransitionPhase,
  TransitionProviderProps,
  FiftyPercentCallback,
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
    canAnimate: false,
  });

  /**
   * Ref to track if 50% trigger has fired for current transition
   * Prevents multiple firings during the same transition
   */
  const hasFiredFiftyPercentRef = useRef(false);

  /**
   * Ref to store registered 50% callbacks
   */
  const fiftyPercentCallbacksRef = useRef<FiftyPercentCallback[]>([]);

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
   * Handle progress update from TransitionEffect
   * Tracks animation progress and fires 50% trigger when threshold is crossed
   * Story 13.4 AC1, AC2, AC3
   */
  const onProgressUpdate = useCallback(
    (progress: number) => {
      // Only track progress during entering phase
      if (state.phase !== "entering") return;

      const clampedProgress = Math.min(100, Math.max(0, progress));
      setProgress(clampedProgress);

      // Fire 50% trigger exactly once per transition (AC2, AC3)
      if (clampedProgress >= 50 && !hasFiredFiftyPercentRef.current) {
        hasFiredFiftyPercentRef.current = true;

        // Clear the fallback timeout since we're navigating now
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
          transitionTimeoutRef.current = null;
        }

        // Transition to covering phase and navigate (AC3)
        setState((prev) => ({
          ...prev,
          phase: "covering",
          progress: clampedProgress,
          canAnimate: true,
        }));

        // Navigate to target href (AC3)
        if (state.targetHref) {
          router.push(state.targetHref);
        }

        // Call all registered callbacks (AC5)
        fiftyPercentCallbacksRef.current.forEach((cb) => {
          try {
            cb();
          } catch (error) {
            console.error("[TransitionProvider] Error in 50% callback:", error);
          }
        });
      }
    },
    [state.phase, state.targetHref, setProgress, router]
  );

  /**
   * Register a callback to be called when 50% trigger fires
   * Story 13.4 AC5
   */
  const registerFiftyPercentCallback = useCallback(
    (cb: FiftyPercentCallback) => {
      if (!fiftyPercentCallbacksRef.current.includes(cb)) {
        fiftyPercentCallbacksRef.current.push(cb);
      }
    },
    []
  );

  /**
   * Unregister a previously registered 50% callback
   * Story 13.4 AC5
   */
  const unregisterFiftyPercentCallback = useCallback(
    (cb: FiftyPercentCallback) => {
      fiftyPercentCallbacksRef.current =
        fiftyPercentCallbacksRef.current.filter(
          (registeredCb) => registeredCb !== cb
        );
    },
    []
  );

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
          canAnimate: false,
        });
        // Reset 50% trigger for next transition (AC6)
        hasFiredFiftyPercentRef.current = false;
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
          canAnimate: false,
        });
        // Reset 50% trigger for next transition
        hasFiredFiftyPercentRef.current = false;
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

      // Reset 50% trigger for new transition (AC6)
      hasFiredFiftyPercentRef.current = false;

      // Start entering phase
      setState({
        isTransitioning: true,
        phase: "entering",
        progress: 0,
        targetHref: href,
        canAnimate: false,
      });

      // Story 13.4 AC3: Navigation is now triggered by 50% progress via onProgressUpdate
      // This timeout serves as a FALLBACK in case animation callbacks fail
      // The timeout is cancelled when 50% trigger fires in onProgressUpdate
      transitionTimeoutRef.current = setTimeout(() => {
        // Only navigate if we haven't already (50% trigger didn't fire)
        if (!hasFiredFiftyPercentRef.current) {
          console.warn(
            "[TransitionProvider] Fallback timeout triggered - 50% callback may have failed"
          );
          hasFiredFiftyPercentRef.current = true;
          setState((prev) => ({
            ...prev,
            phase: "covering",
            canAnimate: true,
          }));
          router.push(href);
        }
      }, TRANSITION_TIMING.ENTER_DURATION + TRANSITION_TIMING.PAUSE_AT_FULL);
    },
    [state.isTransitioning, pathname, shouldReduceMotion, router, isInitialLoad]
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
      onProgressUpdate,
      registerFiftyPercentCallback,
      unregisterFiftyPercentCallback,
    }),
    [
      state,
      startTransition,
      shouldReduceMotion,
      isInitialLoad,
      onProgressUpdate,
      registerFiftyPercentCallback,
      unregisterFiftyPercentCallback,
    ]
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
  FiftyPercentCallback,
} from "./types";
