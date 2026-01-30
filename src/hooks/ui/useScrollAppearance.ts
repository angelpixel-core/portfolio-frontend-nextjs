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
  const { threshold = 0.5, rootMargin = "0px" } = options;

  // TransitionProvider coordination
  const { canAnimate } = useTransition();
  const shouldReduceMotion = useReducedMotion();

  // Whether animations should play
  const shouldAnimate = canAnimate && !shouldReduceMotion;

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
   */
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // If animations are disabled, don't process intersections
      if (!shouldAnimate) return;

      const newVisible: string[] = [];

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          // Find the id for this element
          for (const [id, element] of elementMapRef.current.entries()) {
            if (element === entry.target && !visibleItems.has(id)) {
              newVisible.push(id);
              break;
            }
          }
        }
      });

      if (newVisible.length > 0) {
        setVisibleItems((prev) => {
          const next = new Set(prev);
          newVisible.forEach((id) => next.add(id));
          return next;
        });
      }
    },
    [shouldAnimate, threshold, visibleItems]
  );

  /**
   * Initialize IntersectionObserver
   */
  useEffect(() => {
    // Skip if animations disabled - items are immediately visible
    if (!shouldAnimate) {
      return;
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    // Observe all currently registered elements
    elementMapRef.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
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
        return;
      }

      // Observe new element
      observerRef.current?.observe(element);
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
