"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Wrapper hook for framer-motion's useReducedMotion.
 * Returns true if user prefers reduced motion.
 *
 * @returns {boolean} Whether the user has enabled prefers-reduced-motion
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

export default useReducedMotion;
