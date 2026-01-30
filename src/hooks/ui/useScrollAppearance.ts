"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTransition } from "./useTransition";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Options for useScrollAppearance hook
 */
export interface UseScrollAppearanceOptions {
  /** Intersection threshold (0-1), default 0.5 for 50% visibility */
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
  // Lower threshold (0.1) to trigger earlier - element only needs 10% visibility
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px" } = options;

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

  // Debug: log shouldAnimate calculation
  if (process.env.NODE_ENV === "development") {
    console.log("[useScrollAppearance] shouldAnimate:", shouldAnimate, {
      shouldReduceMotion,
      canAnimate,
      isTransitioning,
    });
  }

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
      // If animations are disabled, don't process intersections
      if (!shouldAnimate) return;

      entries.forEach((entry) => {
        // Debug: log intersection events
        if (process.env.NODE_ENV === "development") {
          console.log("[useScrollAppearance] intersection:", {
            isIntersecting: entry.isIntersecting,
            ratio: entry.intersectionRatio,
            threshold,
          });
        }

        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          // Find the id for this element
          for (const [id, element] of elementMapRef.current.entries()) {
            if (element === entry.target) {
              if (process.env.NODE_ENV === "development") {
                console.log("[useScrollAppearance] marking visible:", id);
              }
              // Use functional update to check current state and add if not present
              setVisibleItems((prev) => {
                if (prev.has(id)) return prev; // Already visible, no update
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
    // Skip if animations disabled - items are immediately visible
    if (!shouldAnimate) {
      if (process.env.NODE_ENV === "development") {
        console.log("[useScrollAppearance] skipping observer (shouldAnimate=false)");
      }
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[useScrollAppearance] creating observer, registered elements:", elementMapRef.current.size);
    }

    // Create observer with a wrapper callback for debugging
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[useScrollAppearance] observer callback fired, entries:", entries.length);
      }
      handleIntersection(entries, observer);
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    // Observe all currently registered elements
    elementMapRef.current.forEach((element, id) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[useScrollAppearance] observing:", id);
      }
      observerRef.current?.observe(element);
    });

    // Fallback: If items don't become visible within 500ms, make them visible
    // This handles cases where IntersectionObserver might not fire
    const fallbackTimer = setTimeout(() => {
      if (process.env.NODE_ENV === "development") {
        console.log("[useScrollAppearance] fallback timer fired");
      }
      setVisibleItems((prev) => {
        const next = new Set(prev);
        elementMapRef.current.forEach((_, id) => {
          if (!prev.has(id)) {
            if (process.env.NODE_ENV === "development") {
              console.log("[useScrollAppearance] fallback making visible:", id);
            }
            next.add(id);
          }
        });
        return next.size > prev.size ? next : prev;
      });
    }, 500);

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
        // Unregister
        if (currentElement) {
          observerRef.current?.unobserve(currentElement);
          elementMapRef.current.delete(id);
        }
        return;
      }

      // If same element, skip
      if (currentElement === element) {
        return;
      }

      // Unobserve old element if exists
      if (currentElement) {
        observerRef.current?.unobserve(currentElement);
      }

      // Register new element
      elementMapRef.current.set(id, element);

      // If animations disabled, mark immediately visible
      if (!shouldAnimate) {
        immediateVisibleRef.current.add(id);
        if (process.env.NODE_ENV === "development") {
          console.log("[useScrollAppearance] registerRef (no animate):", id);
        }
        return;
      }

      // Observe new element
      if (process.env.NODE_ENV === "development") {
        console.log("[useScrollAppearance] registerRef:", id, "observer exists:", !!observerRef.current);
      }
      observerRef.current?.observe(element);

      // WORKAROUND: Make item visible after a short delay
      // This handles cases where IntersectionObserver doesn't fire reliably
      // The stagger is handled by framer-motion, so we just need items to become visible quickly
      setTimeout(() => {
        setVisibleItems((prev) => {
          if (prev.has(id)) return prev;
          if (process.env.NODE_ENV === "development") {
            console.log("[useScrollAppearance] delayed visibility for:", id);
          }
          const next = new Set(prev);
          next.add(id);
          return next;
        });
      }, 50); // Quick visibility - framer-motion handles the stagger animation
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
