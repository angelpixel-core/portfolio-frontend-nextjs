/**
 * Story 13.3: Curtain Exit Animation (Right→Left)
 *
 * Tests for exit animation behavior:
 * - AC1: Exit animation direction R→L (x: 100% → x: 0%)
 * - AC2: Three-layer cascade effect during exit
 * - AC3: All curtains animate together (cascade creates "peeling" effect)
 * - AC5: Transition completes to idle after exit
 * - NEW: "covering" phase keeps curtains at x: 100%
 */

import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Extended mock to capture animate props for verification
const capturedAnimateProps: Map<string, Record<string, unknown>> = new Map();

jest.mock("framer-motion", () => {
  const React = require("react");

  const createMockMotion = (tag: string) => {
    return React.forwardRef(function MockMotion(
      props: Record<string, unknown>,
      ref: React.Ref<unknown>
    ) {
      const { children, initial, animate, exit, transition, ...rest } = props;

      // Capture animate props for test verification using data-testid or className
      const key = (rest["data-testid"] as string) || (rest.className as string);
      if (key && animate) {
        capturedAnimateProps.set(key, {
          initial,
          animate,
          exit,
          transition,
        });
      }

      return React.createElement(tag, { ...rest, ref }, children);
    });
  };

  return {
    motion: {
      div: createMockMotion("div"),
      span: createMockMotion("span"),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: () => false,
  };
});

describe("TransitionEffect exit animation (Story 13.3)", () => {
  beforeEach(() => {
    jest.resetModules();
    capturedAnimateProps.clear();
  });

  describe("AC1: Exit animation direction is Right→Left", () => {
    it("animates pink curtain to x: 0% when phase is exiting", async () => {
      jest.doMock("@/hooks", () => ({
        useReducedMotion: () => false,
        useTransition: () => ({
          phase: "exiting",
          shouldReduceMotion: false,
          isInitialLoad: false,
          isTransitioning: true,
          progress: 0,
          targetHref: "/about",
          startTransition: jest.fn(),
        }),
      }));

      const TransitionEffect = (await import("../index")).default;
      render(<TransitionEffect />);

      // Find the pink curtain (z-30 bg-primary)
      const pinkCurtainProps = capturedAnimateProps.get(
        "transition-effect_blade z-30 bg-primary w-screen"
      );

      expect(pinkCurtainProps).toBeDefined();
      expect(pinkCurtainProps?.animate).toEqual({ x: "0%" });
    });

    it("pink curtain stays at x: 100% when phase is entering", async () => {
      jest.doMock("@/hooks", () => ({
        useReducedMotion: () => false,
        useTransition: () => ({
          phase: "entering",
          shouldReduceMotion: false,
          isInitialLoad: false,
          isTransitioning: true,
          progress: 0,
          targetHref: "/about",
          startTransition: jest.fn(),
        }),
      }));

      const TransitionEffect = (await import("../index")).default;
      render(<TransitionEffect />);

      const pinkCurtainProps = capturedAnimateProps.get(
        "transition-effect_blade z-30 bg-primary w-screen"
      );

      expect(pinkCurtainProps).toBeDefined();
      expect(pinkCurtainProps?.animate).toEqual({ x: "100%" });
    });
  });

  describe("AC2: Three-layer cascade effect during exit", () => {
    it("applies staggered delays during exit phase", async () => {
      jest.doMock("@/hooks", () => ({
        useReducedMotion: () => false,
        useTransition: () => ({
          phase: "exiting",
          shouldReduceMotion: false,
          isInitialLoad: false,
          isTransitioning: true,
          progress: 0,
          targetHref: "/about",
          startTransition: jest.fn(),
        }),
      }));

      const TransitionEffect = (await import("../index")).default;
      render(<TransitionEffect />);

      const pinkProps = capturedAnimateProps.get(
        "transition-effect_blade z-30 bg-primary w-screen"
      );
      const whiteProps = capturedAnimateProps.get(
        "transition-effect_blade z-20 bg-light w-[120vw]"
      );
      const darkProps = capturedAnimateProps.get(
        "transition-effect_blade z-10 bg-dark w-[140vw]"
      );

      // Pink exits first (delay 0 or undefined)
      const pinkDelay = (pinkProps?.transition as Record<string, unknown>)
        ?.delay;
      expect(pinkDelay === 0 || pinkDelay === undefined).toBe(true);

      // White exits with 0.1s delay
      expect((whiteProps?.transition as Record<string, unknown>)?.delay).toBe(
        0.1
      );

      // Dark exits with 0.2s delay
      expect((darkProps?.transition as Record<string, unknown>)?.delay).toBe(
        0.2
      );
    });
  });

  describe("AC3: All curtains animate together with cascade", () => {
    it("all curtains animate to x: 100% during entering phase", async () => {
      jest.doMock("@/hooks", () => ({
        useReducedMotion: () => false,
        useTransition: () => ({
          phase: "entering",
          shouldReduceMotion: false,
          isInitialLoad: false,
          isTransitioning: true,
          progress: 0,
          targetHref: "/about",
          startTransition: jest.fn(),
        }),
      }));

      const TransitionEffect = (await import("../index")).default;
      render(<TransitionEffect />);

      const pinkProps = capturedAnimateProps.get(
        "transition-effect_blade z-30 bg-primary w-screen"
      );
      const whiteProps = capturedAnimateProps.get(
        "transition-effect_blade z-20 bg-light w-[120vw]"
      );
      const darkProps = capturedAnimateProps.get(
        "transition-effect_blade z-10 bg-dark w-[140vw]"
      );

      // All curtains go to 100% during entering (pink covers others)
      expect(pinkProps?.animate).toEqual({ x: "100%" });
      expect(whiteProps?.animate).toEqual({ x: "100%" });
      expect(darkProps?.animate).toEqual({ x: "100%" });
    });

    it("all curtains stay at x: 100% during covering phase", async () => {
      jest.doMock("@/hooks", () => ({
        useReducedMotion: () => false,
        useTransition: () => ({
          phase: "covering",
          shouldReduceMotion: false,
          isInitialLoad: false,
          isTransitioning: true,
          progress: 0,
          targetHref: "/about",
          startTransition: jest.fn(),
        }),
      }));

      const TransitionEffect = (await import("../index")).default;
      render(<TransitionEffect />);

      const pinkProps = capturedAnimateProps.get(
        "transition-effect_blade z-30 bg-primary w-screen"
      );
      const whiteProps = capturedAnimateProps.get(
        "transition-effect_blade z-20 bg-light w-[120vw]"
      );
      const darkProps = capturedAnimateProps.get(
        "transition-effect_blade z-10 bg-dark w-[140vw]"
      );

      // All curtains stay at 100% during covering (page changes behind)
      expect(pinkProps?.animate).toEqual({ x: "100%" });
      expect(whiteProps?.animate).toEqual({ x: "100%" });
      expect(darkProps?.animate).toEqual({ x: "100%" });
    });

    it("all three curtains animate to x: 0% during exiting phase", async () => {
      jest.doMock("@/hooks", () => ({
        useReducedMotion: () => false,
        useTransition: () => ({
          phase: "exiting",
          shouldReduceMotion: false,
          isInitialLoad: false,
          isTransitioning: true,
          progress: 0,
          targetHref: "/about",
          startTransition: jest.fn(),
        }),
      }));

      const TransitionEffect = (await import("../index")).default;
      render(<TransitionEffect />);

      const pinkProps = capturedAnimateProps.get(
        "transition-effect_blade z-30 bg-primary w-screen"
      );
      const whiteProps = capturedAnimateProps.get(
        "transition-effect_blade z-20 bg-light w-[120vw]"
      );
      const darkProps = capturedAnimateProps.get(
        "transition-effect_blade z-10 bg-dark w-[140vw]"
      );

      // All should animate to x: 0% during exit
      expect(pinkProps?.animate).toEqual({ x: "0%" });
      expect(whiteProps?.animate).toEqual({ x: "0%" });
      expect(darkProps?.animate).toEqual({ x: "0%" });
    });
  });

  describe("AC5: Transition completes to idle after exit", () => {
    it("renders curtains during exiting phase", async () => {
      jest.doMock("@/hooks", () => ({
        useReducedMotion: () => false,
        useTransition: () => ({
          phase: "exiting",
          shouldReduceMotion: false,
          isInitialLoad: false,
          isTransitioning: true,
          progress: 0,
          targetHref: "/about",
          startTransition: jest.fn(),
        }),
      }));

      const TransitionEffect = (await import("../index")).default;
      const { container } = render(<TransitionEffect />);

      const blades = container.querySelectorAll(".transition-effect_blade");
      expect(blades).toHaveLength(3);
    });

    it("renders nothing when phase is idle", async () => {
      jest.doMock("@/hooks", () => ({
        useReducedMotion: () => false,
        useTransition: () => ({
          phase: "idle",
          shouldReduceMotion: false,
          isInitialLoad: false,
          isTransitioning: false,
          progress: 0,
          targetHref: null,
          startTransition: jest.fn(),
        }),
      }));

      const TransitionEffect = (await import("../index")).default;
      const { container } = render(<TransitionEffect />);

      expect(container.firstChild).toBeNull();
    });
  });
});
