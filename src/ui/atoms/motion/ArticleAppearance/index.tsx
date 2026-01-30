"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScrollAppearance } from "@/hooks";
import type { ArticleAppearanceProps } from "./ArticleAppearance.types";

/**
 * Animation variants for scroll-triggered appearance
 */
const variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

/**
 * Default transition configuration for cinematographic feel
 */
const defaultTransition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1], // Smooth ease-out curve
};

/**
 * ArticleAppearance - Scroll-triggered animation wrapper
 *
 * Wraps content to animate in when scrolled into view.
 * Coordinates with TransitionProvider and respects reduced motion.
 *
 * Story 14.7: Article Sequential Appearance
 *
 * @example
 * ```tsx
 * <ArticleAppearance id={article.slug}>
 *   <ArticleCard article={article} />
 * </ArticleAppearance>
 * ```
 */
function ArticleAppearance({
  id,
  children,
  className = "",
  delay = 0,
  index = 0,
}: ArticleAppearanceProps) {
  // Mutable ref to store current element for cleanup
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { isVisible, registerRef, shouldAnimate } = useScrollAppearance();

  // Calculate total delay including index-based stagger
  const totalDelay = delay + index * 0.05; // 50ms stagger between items

  /**
   * Register element for intersection observation
   */
  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      registerRef(id, node);
    },
    [id, registerRef]
  );

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      registerRef(id, null);
    };
  }, [id, registerRef]);

  // Check visibility for this specific item
  const itemIsVisible = isVisible(id);

  // If animations are disabled, render children directly without motion wrapper
  if (!shouldAnimate) {
    return (
      <div ref={handleRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={handleRef}
      className={className}
      initial="hidden"
      animate={itemIsVisible ? "visible" : "hidden"}
      variants={variants}
      transition={{
        ...defaultTransition,
        delay: totalDelay,
      }}
    >
      {children}
    </motion.div>
  );
}

export default ArticleAppearance;
export type { ArticleAppearanceProps };
