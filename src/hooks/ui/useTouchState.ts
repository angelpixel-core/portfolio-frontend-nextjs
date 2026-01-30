"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  TouchEvent as ReactTouchEvent,
  MouseEvent as ReactMouseEvent,
  RefObject,
} from "react";
import { useTransition } from "./useTransition";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Options for useTouchState hook
 */
export interface UseTouchStateOptions {
  /** Unique identifier for this touch state (used for global coordination) */
  id?: string;
  /** Callback when touch state changes */
  onTouchChange?: (_isTouched: boolean) => void;
}

/**
 * Return value from useTouchState hook
 */
export interface UseTouchStateReturn {
  /** Whether the element is currently in touched state */
  isTouched: boolean;
  /** Whether touch interactions are disabled (during transitions or reduced motion) */
  isDisabled: boolean;
  /** Handler for touch start events - attach to the element */
  handleTouchStart: (_e: ReactTouchEvent<HTMLElement>) => void;
  /** Handler for click events (fallback for non-touch) - attach to the element */
  handleClick: (_e: ReactMouseEvent<HTMLElement>) => void;
  /** Manually reset the touch state */
  resetTouch: () => void;
  /** Ref to attach to the element for outside click detection */
  elementRef: RefObject<HTMLElement>;
}

// Global state to track which card is currently touched (only one at a time)
let currentTouchedId: string | null = null;
const touchStateListeners = new Set<(_id: string | null) => void>();

function notifyTouchStateChange(id: string | null) {
  currentTouchedId = id;
  touchStateListeners.forEach((listener) => listener(id));
}

/**
 * Hook for managing touch state on cards with TransitionProvider coordination.
 *
 * Features:
 * - Single tap activates touched state (shows action links)
 * - Tap outside dismisses touched state
 * - Only one card can be touched at a time
 * - Disabled during page transitions
 * - Disabled when reduced motion is enabled (links always visible)
 *
 * @example
 * ```tsx
 * const { isTouched, handleTouchStart, elementRef } = useTouchState({ id: 'card-1' });
 *
 * return (
 *   <article
 *     ref={elementRef}
 *     onTouchStart={handleTouchStart}
 *     className={isTouched ? 'touched' : ''}
 *   >
 *     <ActionLinks isTouched={isTouched} />
 *   </article>
 * );
 * ```
 */
export function useTouchState(
  options: UseTouchStateOptions = {}
): UseTouchStateReturn {
  const {
    id = `touch-${Math.random().toString(36).slice(2, 9)}`,
    onTouchChange,
  } = options;

  const [isTouched, setIsTouched] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const idRef = useRef(id);

  // TransitionProvider coordination
  const { isTransitioning, canAnimate } = useTransition();
  const shouldReduceMotion = useReducedMotion();

  // Touch is disabled during transitions or when reduced motion is enabled
  const isDisabled = isTransitioning || !canAnimate || shouldReduceMotion;

  // Subscribe to global touch state changes
  useEffect(() => {
    const listener = (touchedId: string | null) => {
      // If another card was touched, reset this one
      if (touchedId !== idRef.current && isTouched) {
        setIsTouched(false);
        onTouchChange?.(false);
      }
    };

    touchStateListeners.add(listener);
    return () => {
      touchStateListeners.delete(listener);
    };
  }, [isTouched, onTouchChange]);

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: ReactTouchEvent<HTMLElement>) => {
      if (isDisabled) return;

      // Don't activate if tapping on a link (let the link handle it)
      const target = e.target as HTMLElement;
      if (target.tagName === "A" || target.closest("a")) {
        return;
      }

      e.stopPropagation();

      if (!isTouched) {
        setIsTouched(true);
        notifyTouchStateChange(idRef.current);
        onTouchChange?.(true);
      }
    },
    [isDisabled, isTouched, onTouchChange]
  );

  // Handle click (fallback for devices that don't support touch)
  const handleClick = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      // Only handle as touch if it's a touch-capable device without hover
      if (window.matchMedia("(hover: none)").matches) {
        if (isDisabled) return;

        const target = e.target as HTMLElement;
        if (target.tagName === "A" || target.closest("a")) {
          return;
        }

        e.stopPropagation();

        if (!isTouched) {
          setIsTouched(true);
          notifyTouchStateChange(idRef.current);
          onTouchChange?.(true);
        }
      }
    },
    [isDisabled, isTouched, onTouchChange]
  );

  // Reset touch state
  const resetTouch = useCallback(() => {
    if (isTouched) {
      setIsTouched(false);
      if (currentTouchedId === idRef.current) {
        notifyTouchStateChange(null);
      }
      onTouchChange?.(false);
    }
  }, [isTouched, onTouchChange]);

  // Handle outside touch/click to dismiss
  useEffect(() => {
    if (!isTouched) return;

    const handleOutsideTouch = (e: TouchEvent | MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        setIsTouched(false);
        if (currentTouchedId === idRef.current) {
          notifyTouchStateChange(null);
        }
        onTouchChange?.(false);
      }
    };

    // Use both touchstart and mousedown for broader compatibility
    document.addEventListener("touchstart", handleOutsideTouch, {
      passive: true,
    });
    document.addEventListener("mousedown", handleOutsideTouch);

    return () => {
      document.removeEventListener("touchstart", handleOutsideTouch);
      document.removeEventListener("mousedown", handleOutsideTouch);
    };
  }, [isTouched, onTouchChange]);

  // Reset touch state during transitions
  useEffect(() => {
    if (isTransitioning && isTouched) {
      resetTouch();
    }
  }, [isTransitioning, isTouched, resetTouch]);

  // Cleanup on unmount
  useEffect(() => {
    // Capture the current id for cleanup
    const currentId = idRef.current;
    return () => {
      if (currentTouchedId === currentId) {
        notifyTouchStateChange(null);
      }
    };
  }, []);

  return {
    isTouched,
    isDisabled,
    handleTouchStart,
    handleClick,
    resetTouch,
    elementRef: elementRef as RefObject<HTMLElement>,
  };
}

export default useTouchState;
