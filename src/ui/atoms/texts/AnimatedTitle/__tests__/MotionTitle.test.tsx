import React from "react";
import { render, screen } from "@testing-library/react";
import MotionTitle from "../MotionTitle";

// Mock framer-motion to capture animation props
// Note: jest.mock is hoisted above variable declarations, so all functions must be inlined
jest.mock("framer-motion", () => {
  const React = require("react");
  const h1Mock = jest.fn(
    ({
      children,
      animate,
      initial,
      variants: _variants,
      ...props
    }: Record<string, unknown>) =>
      React.createElement(
        "h1",
        {
          "data-testid": "motion-h1",
          "data-animate": animate,
          "data-initial": initial,
          ...props,
        },
        children
      )
  );
  const spanMock = jest.fn(
    ({ children, variants: _variants, ...props }: Record<string, unknown>) =>
      React.createElement(
        "span",
        { "data-testid": "motion-span", ...props },
        children
      )
  );
  return {
    m: { h1: h1Mock, span: spanMock },
    motion: { h1: h1Mock, span: spanMock },
  };
});

// Mock useReducedMotion
const mockUseReducedMotion = jest.fn(() => false);
jest.mock("@/hooks/ui/useReducedMotion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

// Mock useTransition - will be controlled per test
type TransitionPhase = "idle" | "entering" | "covering" | "exiting";
const mockUseTransition = jest.fn(() => ({
  canAnimate: false,
  isInitialLoad: true,
  isTransitioning: false,
  phase: "idle" as TransitionPhase,
  progress: 0,
  targetHref: null as string | null,
  shouldReduceMotion: false,
  startTransition: jest.fn(),
  onProgressUpdate: jest.fn(),
  registerFiftyPercentCallback: jest.fn(),
  unregisterFiftyPercentCallback: jest.fn(),
}));

jest.mock("@/hooks/ui/useTransition", () => ({
  useTransition: () => mockUseTransition(),
}));

describe("MotionTitle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
  });

  describe("Story 13.5 AC1: Title animation triggers at 50% point", () => {
    it("should NOT animate during entering phase (before 50% trigger)", () => {
      mockUseTransition.mockReturnValue({
        canAnimate: false,
        isInitialLoad: false, // Not initial load, in middle of transition
        isTransitioning: true,
        phase: "entering", // During entering phase, title should be hidden
        progress: 25,
        targetHref: "/about",
        shouldReduceMotion: false,
        startTransition: jest.fn(),
        onProgressUpdate: jest.fn(),
        registerFiftyPercentCallback: jest.fn(),
        unregisterFiftyPercentCallback: jest.fn(),
      });

      render(<MotionTitle title="Test Title" className="" />);

      const h1 = screen.getByTestId("motion-h1");
      // Should stay in initial state during entering phase
      expect(h1.dataset.animate).toBe("initial");
    });

    it("should stay visible after transition completes (idle phase)", () => {
      mockUseTransition.mockReturnValue({
        canAnimate: false, // canAnimate resets to false after transition
        isInitialLoad: false,
        isTransitioning: false,
        phase: "idle", // Transition complete, title should stay visible
        progress: 0,
        targetHref: null,
        shouldReduceMotion: false,
        startTransition: jest.fn(),
        onProgressUpdate: jest.fn(),
        registerFiftyPercentCallback: jest.fn(),
        unregisterFiftyPercentCallback: jest.fn(),
      });

      render(<MotionTitle title="Test Title" className="" />);

      const h1 = screen.getByTestId("motion-h1");
      // Should remain in animate state when idle (visible)
      expect(h1.dataset.animate).toBe("animate");
    });

    it("should animate when canAnimate becomes true (50% trigger fired)", () => {
      mockUseTransition.mockReturnValue({
        canAnimate: true, // 50% trigger has fired
        isInitialLoad: false,
        isTransitioning: true,
        phase: "covering",
        progress: 50,
        targetHref: "/about",
        shouldReduceMotion: false,
        startTransition: jest.fn(),
        onProgressUpdate: jest.fn(),
        registerFiftyPercentCallback: jest.fn(),
        unregisterFiftyPercentCallback: jest.fn(),
      });

      render(<MotionTitle title="Test Title" className="" />);

      const h1 = screen.getByTestId("motion-h1");
      // Should animate now
      expect(h1.dataset.animate).toBe("animate");
    });

    it("should stay visible during covering phase (between 50% trigger and idle)", () => {
      mockUseTransition.mockReturnValue({
        canAnimate: true, // Still true during covering
        isInitialLoad: false,
        isTransitioning: true,
        phase: "covering", // Navigation happening, page mounted
        progress: 75,
        targetHref: "/about",
        shouldReduceMotion: false,
        startTransition: jest.fn(),
        onProgressUpdate: jest.fn(),
        registerFiftyPercentCallback: jest.fn(),
        unregisterFiftyPercentCallback: jest.fn(),
      });

      render(<MotionTitle title="Test Title" className="" />);

      const h1 = screen.getByTestId("motion-h1");
      // Should remain visible during covering phase
      expect(h1.dataset.animate).toBe("animate");
    });
  });

  describe("Story 13.5 AC7: Initial page load behavior", () => {
    it("should animate on mount when isInitialLoad is true", () => {
      mockUseTransition.mockReturnValue({
        canAnimate: false, // Not from transition
        isInitialLoad: true, // Initial page load
        isTransitioning: false,
        phase: "idle",
        progress: 0,
        targetHref: null,
        shouldReduceMotion: false,
        startTransition: jest.fn(),
        onProgressUpdate: jest.fn(),
        registerFiftyPercentCallback: jest.fn(),
        unregisterFiftyPercentCallback: jest.fn(),
      });

      render(<MotionTitle title="Test Title" className="" />);

      const h1 = screen.getByTestId("motion-h1");
      // Should animate on initial load
      expect(h1.dataset.animate).toBe("animate");
    });
  });

  describe("Story 13.5 AC6: Reduced motion support", () => {
    it("should show title instantly when reduced motion is preferred", () => {
      mockUseReducedMotion.mockReturnValue(true);
      mockUseTransition.mockReturnValue({
        canAnimate: true,
        isInitialLoad: false,
        isTransitioning: true,
        phase: "covering",
        progress: 50,
        targetHref: "/about",
        shouldReduceMotion: false,
        startTransition: jest.fn(),
        onProgressUpdate: jest.fn(),
        registerFiftyPercentCallback: jest.fn(),
        unregisterFiftyPercentCallback: jest.fn(),
      });

      render(<MotionTitle title="Test Title" className="" />);

      const h1 = screen.getByTestId("motion-h1");
      // Should animate (with duration: 0 in variants) when canAnimate is true
      expect(h1.dataset.animate).toBe("animate");
    });
  });

  describe("Story 13.5 AC2/AC3: Slide-up and fade-in animation", () => {
    it("renders title text correctly", () => {
      mockUseTransition.mockReturnValue({
        canAnimate: false,
        isInitialLoad: true,
        isTransitioning: false,
        phase: "idle",
        progress: 0,
        targetHref: null,
        shouldReduceMotion: false,
        startTransition: jest.fn(),
        onProgressUpdate: jest.fn(),
        registerFiftyPercentCallback: jest.fn(),
        unregisterFiftyPercentCallback: jest.fn(),
      });

      render(<MotionTitle title="Hello World" className="test-class" />);

      // Check words are rendered
      const spans = screen.getAllByTestId("motion-span");
      expect(spans).toHaveLength(2); // "Hello" and "World"
    });
  });

  describe("Story 13.5 AC5: Word-by-word stagger animation", () => {
    it("renders each word as a separate m.span", () => {
      mockUseTransition.mockReturnValue({
        canAnimate: false,
        isInitialLoad: true,
        isTransitioning: false,
        phase: "idle",
        progress: 0,
        targetHref: null,
        shouldReduceMotion: false,
        startTransition: jest.fn(),
        onProgressUpdate: jest.fn(),
        registerFiftyPercentCallback: jest.fn(),
        unregisterFiftyPercentCallback: jest.fn(),
      });

      render(<MotionTitle title="One Two Three" className="" />);

      const spans = screen.getAllByTestId("motion-span");
      expect(spans).toHaveLength(3);
    });
  });
});
