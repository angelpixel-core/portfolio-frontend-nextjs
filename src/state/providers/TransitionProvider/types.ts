import type { ReactNode } from "react";

/**
 * Transition phase states
 * - idle: No transition in progress
 * - entering: Curtain moving left-to-right, covering page
 * - covering: Curtain fully covers screen, waiting for navigation to complete
 * - exiting: Curtain moving right-to-left, revealing new page
 */
export type TransitionPhase = "idle" | "entering" | "covering" | "exiting";

/**
 * Internal transition state
 */
export interface TransitionState {
  /** Whether a transition is currently in progress */
  isTransitioning: boolean;
  /** Current phase of the transition animation */
  phase: TransitionPhase;
  /** Progress percentage (0-100) for 50% trigger sync */
  progress: number;
  /** Target URL for navigation */
  targetHref: string | null;
}

/**
 * Context value exposed to consumers via useTransition hook
 */
export interface TransitionContextValue extends TransitionState {
  /** Trigger a page transition to the specified URL */
  startTransition: (_href: string) => void;
  /** Whether user prefers reduced motion */
  shouldReduceMotion: boolean;
  /** Whether this is the initial page load (no transition should play) */
  isInitialLoad: boolean;
}

/**
 * Props for TransitionProvider component
 */
export interface TransitionProviderProps {
  children: ReactNode;
}
