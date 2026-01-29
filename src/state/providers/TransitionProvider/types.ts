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
  /**
   * True after 50% trigger fires - components can start animations (FR13.10)
   *
   * @example
   * ```tsx
   * // In a page component that needs to animate on mount
   * const { canAnimate } = useTransition();
   *
   * return (
   *   <motion.div
   *     initial={{ opacity: 0, y: 20 }}
   *     animate={canAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   *     transition={{ duration: 0.5, delay: 0.1 }}
   *   >
   *     Page content
   *   </motion.div>
   * );
   * ```
   */
  canAnimate: boolean;
}

/**
 * Callback type for 50% trigger listeners
 */
export type FiftyPercentCallback = () => void;

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
  /** Called by TransitionEffect to report animation progress (0-100) */
  onProgressUpdate: (_progress: number) => void;
  /**
   * Register a callback for when 50% trigger fires.
   * Use this to synchronize data fetching with page transitions.
   *
   * @example
   * ```tsx
   * // Sync data fetching with transition (React Query example)
   * const { registerFiftyPercentCallback, unregisterFiftyPercentCallback } = useTransition();
   * const queryClient = useQueryClient();
   *
   * useEffect(() => {
   *   const prefetchData = () => {
   *     queryClient.prefetchQuery({
   *       queryKey: ['pageData', targetPath],
   *       queryFn: fetchPageData,
   *     });
   *   };
   *
   *   registerFiftyPercentCallback(prefetchData);
   *   return () => unregisterFiftyPercentCallback(prefetchData);
   * }, [targetPath]);
   * ```
   */
  registerFiftyPercentCallback: (_cb: FiftyPercentCallback) => void;
  /** Unregister a previously registered 50% callback */
  unregisterFiftyPercentCallback: (_cb: FiftyPercentCallback) => void;
}

/**
 * Props for TransitionProvider component
 */
export interface TransitionProviderProps {
  children: ReactNode;
}
