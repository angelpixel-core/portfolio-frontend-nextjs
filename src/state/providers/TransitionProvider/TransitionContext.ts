"use client";

import { createContext } from "react";
import type { TransitionContextValue } from "./types";

/**
 * Default context value when no provider is present
 * All functions are no-ops to prevent runtime errors
 */
const defaultContextValue: TransitionContextValue = {
  isTransitioning: false,
  phase: "idle",
  progress: 0,
  targetHref: null,
  canAnimate: false,
  startTransition: () => {
    console.warn(
      "TransitionContext: startTransition called outside of TransitionProvider"
    );
  },
  shouldReduceMotion: false,
  isInitialLoad: true,
  onProgressUpdate: () => {
    // No-op when used outside provider
  },
  registerFiftyPercentCallback: () => {
    // No-op when used outside provider
  },
  unregisterFiftyPercentCallback: () => {
    // No-op when used outside provider
  },
};

/**
 * React Context for page transition state
 * Provides centralized transition management across the application
 */
export const TransitionContext =
  createContext<TransitionContextValue>(defaultContextValue);

TransitionContext.displayName = "TransitionContext";

export default TransitionContext;
