"use client";

/**
 * Suppress specific console warnings in development
 * This is used for known false-positive warnings from third-party libraries
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalWarn = console.warn;

  console.warn = (...args: unknown[]) => {
    const message = args[0];

    // Suppress Framer Motion position warning (false positive)
    if (
      typeof message === "string" &&
      message.includes("non-static position")
    ) {
      return;
    }

    // Suppress Next.js auto-scroll warnings for TransitionEffect (expected behavior)
    if (
      typeof message === "string" &&
      message.includes("Skipping auto-scroll behavior")
    ) {
      return;
    }

    // Call original console.warn for other warnings
    originalWarn.apply(console, args);
  };
}

export {};
