"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTransition } from "./useTransition";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Configuration constants for scroll appearance behavior
 *
 * THRESHOLD: 0 means trigger immediately when element touches the trigger line
 * ROOT_MARGIN: Calculated dynamically as -50% of viewport height
 */
const DEFAULT_THRESHOLD = 0;

/**
 * Options for useScrollAppearance hook
 */
export interface UseScrollAppearanceOptions {
  /** Intersection threshold (0-1), default 0 to trigger on touch */
  threshold?: number;
}

/**
 * Return value from useScrollAppearance hook
 */
export interface UseScrollAppearanceReturn {
  /** Check if an item is visible (has appeared) */
  isVisible: (_id: string) => boolean;
  /** Register an element ref for observation */
  registerRef: (_id: string, _element: Element | null) => void;
  /** Whether animations should play (respects canAnimate and reduced motion) */
  shouldAnimate: boolean;
}

/**
 * Hook for tracking scroll-triggered visibility of items.
 *
 * Coordinates with TransitionProvider's canAnimate state and respects
 * user's reduced motion preference.
 *
 * Features:
 * - IntersectionObserver-based visibility detection
 * - Once-only triggering (items stay visible after appearing)
 * - TransitionProvider coordination via canAnimate
 * - Reduced motion support (all items immediately visible)
 * - Fast scroll handling (no animation queue)
 *
 * @param options - Configuration options
 * @returns Object with visibility checking and ref registration
 *
 * @example
 * ```tsx
 * function ArticleList({ articles }) {
 *   const { isVisible, registerRef, shouldAnimate } = useScrollAppearance();
 *
 *   return articles.map((article, index) => (
 *     <motion.div
 *       key={article.slug}
 *       ref={(el) => registerRef(article.slug, el)}
 *       initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
 *       animate={isVisible(article.slug) ? { opacity: 1, y: 0 } : {}}
 *     >
 *       <ArticleCard article={article} />
 *     </motion.div>
 *   ));
 * }
 * ```
 */
export function useScrollAppearance(
  options: UseScrollAppearanceOptions = {}
): UseScrollAppearanceReturn {
  const { threshold = DEFAULT_THRESHOLD } = options;

  // TransitionProvider coordination
  const { canAnimate, isTransitioning } = useTransition();
  const shouldReduceMotion = useReducedMotion();

  // Whether animations should play
  // Enable scroll animations when:
  // 1. Not requesting reduced motion
  // 2. AND one of:
  //    a. canAnimate is true (just transitioned via curtain - animations should sync)
  //    b. Not transitioning (direct load or after transition completes)
  const shouldAnimate = !shouldReduceMotion && (canAnimate || !isTransitioning);

  // Track visible items using Set for O(1) lookup
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  // Map of element refs by id
  const elementMapRef = useRef<Map<string, Element>>(new Map());

  // IntersectionObserver ref
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * Check if an item is visible
   * If animations disabled, all registered items are immediately visible
   */
  const isVisible = useCallback(
    (id: string): boolean => {
      if (!shouldAnimate) {
        return elementMapRef.current.has(id);
      }
      return visibleItems.has(id);
    },
    [shouldAnimate, visibleItems]
  );

  /**
   * Handle intersection events
   * Note: Uses functional update to avoid stale closure issues with visibleItems
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // Only trigger when entering the observation area
        if (entry.isIntersecting) {
          for (const [id, element] of elementMapRef.current.entries()) {
            if (element === entry.target) {
              setVisibleItems((prev) => {
                if (prev.has(id)) return prev;
                const next = new Set(prev);
                next.add(id);
                return next;
              });
              break;
            }
          }
        }
      });
    },
    []
  );

  /**
   * Initialize IntersectionObserver
   * Always create observer - shouldAnimate only affects whether animations play
   */
  useEffect(() => {
    // Calculate rootMargin as pixels (50% of viewport height)
    const viewportHeight = window.innerHeight;
    const calculatedRootMargin = `0px 0px -${Math.floor(viewportHeight / 2)}px 0px`;

    observerRef.current = new IntersectionObserver(
      (entries) => handleIntersection(entries),
      { threshold, rootMargin: calculatedRootMargin }
    );

    // Observe all currently registered elements
    elementMapRef.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection, threshold]);

  /**
   * Register an element for observation
   * Always observe elements - let IntersectionObserver handle visibility
   */
  const registerRef = useCallback((id: string, element: Element | null) => {
    const currentElement = elementMapRef.current.get(id);

    if (element === null) {
      if (currentElement) {
        observerRef.current?.unobserve(currentElement);
        elementMapRef.current.delete(id);
      }
      return;
    }

    if (currentElement === element) return;

    if (currentElement) {
      observerRef.current?.unobserve(currentElement);
    }

    elementMapRef.current.set(id, element);

    // Always try to observe - observer might not exist yet on first render
    // The useEffect will observe all elements once observer is created
    observerRef.current?.observe(element);
  }, []);

  return {
    isVisible,
    registerRef,
    shouldAnimate,
  };
}

export default useScrollAppearance;
