"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTransition } from "./useTransition";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Configuration constants for scroll appearance behavior
 *
 * THRESHOLD: How much of element must be visible to trigger (0.1 = 10%)
 * - Lower than spec's "50%" to trigger earlier for smoother UX
 * - Combined with ROOT_MARGIN for optimal trigger timing
 *
 * ROOT_MARGIN: Offset for intersection detection
 * - Negative bottom margin triggers before element reaches viewport center
 *
 * FALLBACK_TIMER_MS: Time before forcing visibility if observer doesn't fire
 * - Handles edge cases where IntersectionObserver may not trigger reliably
 *
 * DELAYED_VISIBILITY_MS: Quick visibility delay per item
 * - Framer-motion handles stagger animation timing
 */
const DEFAULT_THRESHOLD = 0.1;
const DEFAULT_ROOT_MARGIN = "0px 0px -50px 0px";
const FALLBACK_TIMER_MS = 500;
const DELAYED_VISIBILITY_MS = 50;

/**
 * Options for useScrollAppearance hook
 */
export interface UseScrollAppearanceOptions {
  /** Intersection threshold (0-1), default 0.1 for early trigger */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
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
  const {
    threshold = DEFAULT_THRESHOLD,
    rootMargin = DEFAULT_ROOT_MARGIN,
  } = options;

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

  // Track items that should be immediately visible (no animation)
  const immediateVisibleRef = useRef<Set<string>>(new Set());

  /**
   * Check if an item is visible
   */
  const isVisible = useCallback(
    (id: string): boolean => {
      // If animations are disabled, all registered items are visible
      if (!shouldAnimate) {
        return (
          elementMapRef.current.has(id) || immediateVisibleRef.current.has(id)
        );
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
      if (!shouldAnimate) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
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
    [shouldAnimate, threshold]
  );

  /**
   * Initialize IntersectionObserver
   */
  useEffect(() => {
    if (!shouldAnimate) return;

    observerRef.current = new IntersectionObserver(
      (entries) => handleIntersection(entries),
      { threshold, rootMargin }
    );

    // Observe all currently registered elements
    elementMapRef.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    // Fallback: force visibility if observer doesn't fire reliably
    const fallbackTimer = setTimeout(() => {
      setVisibleItems((prev) => {
        const next = new Set(prev);
        elementMapRef.current.forEach((_, id) => {
          if (!prev.has(id)) next.add(id);
        });
        return next.size > prev.size ? next : prev;
      });
    }, FALLBACK_TIMER_MS);

    return () => {
      clearTimeout(fallbackTimer);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [shouldAnimate, handleIntersection, threshold, rootMargin]);

  /**
   * Register an element for observation
   */
  const registerRef = useCallback(
    (id: string, element: Element | null) => {
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

      if (!shouldAnimate) {
        immediateVisibleRef.current.add(id);
        return;
      }

      observerRef.current?.observe(element);

      // Fallback: ensure visibility after short delay if observer doesn't fire
      setTimeout(() => {
        setVisibleItems((prev) => {
          if (prev.has(id)) return prev;
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }, DELAYED_VISIBILITY_MS);
    },
    [shouldAnimate]
  );

  return {
    isVisible,
    registerRef,
    shouldAnimate,
  };
}

export default useScrollAppearance;
