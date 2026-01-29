"use client";

import { useContext } from "react";
import { TransitionContext } from "@/state/providers/TransitionProvider";
import type { TransitionContextValue } from "@/state/providers/TransitionProvider";

/**
 * Hook to access page transition state and controls
 *
 * @returns TransitionContextValue containing:
 * - isTransitioning: boolean - whether a transition is in progress
 * - phase: 'idle' | 'entering' | 'exiting' - current transition phase
 * - progress: number - progress percentage (0-100)
 * - targetHref: string | null - URL being navigated to
 * - startTransition: (href: string) => void - trigger a transition
 * - shouldReduceMotion: boolean - user's motion preference
 *
 * @example
 * ```tsx
 * const { startTransition, isTransitioning, phase } = useTransition();
 *
 * // Trigger navigation with transition
 * const handleClick = () => startTransition('/about');
 *
 * // React to transition state
 * if (isTransitioning && phase === 'entering') {
 *   // Curtain is covering the screen
 * }
 * ```
 *
 * @note If used outside TransitionProvider, returns default context with
 * no-op functions that log warnings. This allows graceful degradation
 * in testing scenarios.
 */
export function useTransition(): TransitionContextValue {
  return useContext(TransitionContext);
}

export default useTransition;
