"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import type { ArticleAppearanceProps } from "./ArticleAppearance.types";

/**
 * Animation variants for scroll-triggered appearance
 * y: 50 provides dramatic "floating up from below" effect
 */
const variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

/**
 * Default transition configuration for cinematographic feel
 * Duration: 1.5s for dramatic entrance effect
 */
const defaultTransition = {
  duration: 1.5,
  ease: [0.16, 1, 0.3, 1], // Smooth ease-out curve
};

/**
 * ArticleAppearance - Scroll-triggered animation wrapper
 *
 * Uses Framer Motion's whileInView for reliable scroll detection.
 * Trigger line: 50% viewport (margin: "0px 0px -50% 0px")
 *
 * Story 14.7: Article Sequential Appearance
 *
 * @example
 * ```tsx
 * <ArticleAppearance id={article.slug} index={0}>
 *   <ArticleCard article={article} />
 * </ArticleAppearance>
 * ```
 */
function ArticleAppearance({
  id,
  children,
  className = "",
  delay = 0.25,
  index: _index = 0,
}: ArticleAppearanceProps) {
  const shouldReduceMotion = useReducedMotion();

  // Calculate total delay including index-based stagger
  const totalDelay = delay; // + index;

  // If reduced motion, render without animation
  if (shouldReduceMotion) {
    return (
      <div className={className} data-article-id={id}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      data-article-id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true, // Only animate once
        margin: "0px 0px -5% 0px", // Trigger at 20% viewport
      }}
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
