import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useTouchState } from "../useTouchState";

// Mock useTransition hook
let mockIsTransitioning = false;
let mockCanAnimate = true;
jest.mock("../useTransition", () => ({
  useTransition: () => ({
    isTransitioning: mockIsTransitioning,
    canAnimate: mockCanAnimate,
    phase: "idle",
    progress: 0,
    targetHref: null,
    startTransition: jest.fn(),
  }),
}));

// Mock useReducedMotion hook
let mockReducedMotion = false;
jest.mock("../useReducedMotion", () => ({
  useReducedMotion: () => mockReducedMotion,
}));

// Mock matchMedia for hover detection
const mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
  matches: query === "(hover: none)",
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));
window.matchMedia = mockMatchMedia;

describe("useTouchState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsTransitioning = false;
    mockCanAnimate = true;
    mockReducedMotion = false;
  });

  describe("Basic functionality", () => {
    it("returns initial state with isTouched false", () => {
      const { result } = renderHook(() => useTouchState({ id: "test-1" }));

      expect(result.current.isTouched).toBe(false);
      expect(result.current.isDisabled).toBe(false);
      expect(typeof result.current.handleTouchStart).toBe("function");
      expect(typeof result.current.handleClick).toBe("function");
      expect(typeof result.current.resetTouch).toBe("function");
    });

    it("sets isTouched to true on touch start", () => {
      const { result } = renderHook(() => useTouchState({ id: "test-2" }));

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });

      expect(result.current.isTouched).toBe(true);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it("resets touch state with resetTouch", () => {
      const { result } = renderHook(() => useTouchState({ id: "test-3" }));

      // First touch
      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });
      expect(result.current.isTouched).toBe(true);

      // Reset
      act(() => {
        result.current.resetTouch();
      });
      expect(result.current.isTouched).toBe(false);
    });

    it("calls onTouchChange callback when touch state changes", () => {
      const onTouchChange = jest.fn();
      const { result } = renderHook(() =>
        useTouchState({ id: "test-4", onTouchChange })
      );

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });

      expect(onTouchChange).toHaveBeenCalledWith(true);

      act(() => {
        result.current.resetTouch();
      });

      expect(onTouchChange).toHaveBeenCalledWith(false);
    });
  });

  describe("TransitionProvider coordination (AC4)", () => {
    it("is disabled when isTransitioning is true", () => {
      mockIsTransitioning = true;

      const { result } = renderHook(() => useTouchState({ id: "test-5" }));

      expect(result.current.isDisabled).toBe(true);
    });

    it("is disabled when canAnimate is false", () => {
      mockCanAnimate = false;

      const { result } = renderHook(() => useTouchState({ id: "test-6" }));

      expect(result.current.isDisabled).toBe(true);
    });

    it("does not activate touch when disabled", () => {
      mockIsTransitioning = true;

      const { result } = renderHook(() => useTouchState({ id: "test-7" }));

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });

      expect(result.current.isTouched).toBe(false);
      expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
    });

    it("resets touch state when transition starts", () => {
      const { result, rerender } = renderHook(() =>
        useTouchState({ id: "test-8" })
      );

      // Activate touch
      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });
      expect(result.current.isTouched).toBe(true);

      // Start transition
      mockIsTransitioning = true;
      rerender();

      // Touch should be reset
      expect(result.current.isTouched).toBe(false);
    });
  });

  describe("Reduced motion support (AC5)", () => {
    it("is disabled when reduced motion is enabled", () => {
      mockReducedMotion = true;

      const { result } = renderHook(() => useTouchState({ id: "test-9" }));

      expect(result.current.isDisabled).toBe(true);
    });

    it("does not activate touch when reduced motion is enabled", () => {
      mockReducedMotion = true;

      const { result } = renderHook(() => useTouchState({ id: "test-10" }));

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });

      expect(result.current.isTouched).toBe(false);
    });
  });

  describe("Link passthrough (AC1)", () => {
    it("does not activate touch when tapping on a link", () => {
      const { result } = renderHook(() => useTouchState({ id: "test-11" }));

      const linkElement = document.createElement("a");
      linkElement.href = "https://example.com";

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: linkElement,
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });

      expect(result.current.isTouched).toBe(false);
      expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
    });

    it("does not activate touch when tapping on element inside a link", () => {
      const { result } = renderHook(() => useTouchState({ id: "test-12" }));

      const linkElement = document.createElement("a");
      linkElement.href = "https://example.com";
      const spanElement = document.createElement("span");
      linkElement.appendChild(spanElement);

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: spanElement,
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });

      expect(result.current.isTouched).toBe(false);
    });
  });

  describe("Single card touch (AC1)", () => {
    it("only one card can be touched at a time", () => {
      const { result: result1 } = renderHook(() =>
        useTouchState({ id: "card-1" })
      );
      const { result: result2 } = renderHook(() =>
        useTouchState({ id: "card-2" })
      );

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.TouchEvent<HTMLElement>;

      // Touch first card
      act(() => {
        result1.current.handleTouchStart(mockEvent);
      });
      expect(result1.current.isTouched).toBe(true);
      expect(result2.current.isTouched).toBe(false);

      // Touch second card
      act(() => {
        result2.current.handleTouchStart(mockEvent);
      });
      expect(result1.current.isTouched).toBe(false);
      expect(result2.current.isTouched).toBe(true);
    });
  });

  describe("Outside touch dismissal (AC1)", () => {
    it("dismisses touch state when tapping outside", () => {
      const { result } = renderHook(() => useTouchState({ id: "test-13" }));

      // Create a container element and set it as the ref
      const containerElement = document.createElement("div");
      document.body.appendChild(containerElement);

      // Manually set the ref
      Object.defineProperty(result.current.elementRef, "current", {
        value: containerElement,
        writable: true,
      });

      // Activate touch
      const mockEvent = {
        stopPropagation: jest.fn(),
        target: containerElement,
      } as unknown as React.TouchEvent<HTMLElement>;

      act(() => {
        result.current.handleTouchStart(mockEvent);
      });
      expect(result.current.isTouched).toBe(true);

      // Simulate outside touch
      const outsideElement = document.createElement("div");
      document.body.appendChild(outsideElement);

      act(() => {
        const touchEvent = new TouchEvent("touchstart", {
          bubbles: true,
        });
        Object.defineProperty(touchEvent, "target", { value: outsideElement });
        document.dispatchEvent(touchEvent);
      });

      expect(result.current.isTouched).toBe(false);

      // Cleanup
      document.body.removeChild(containerElement);
      document.body.removeChild(outsideElement);
    });
  });

  describe("Click handler for touch devices (AC1)", () => {
    it("handles click on touch devices (hover: none)", () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query === "(hover: none)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useTouchState({ id: "test-14" }));

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.MouseEvent<HTMLElement>;

      act(() => {
        result.current.handleClick(mockEvent);
      });

      expect(result.current.isTouched).toBe(true);
    });

    it("ignores click on devices with hover", () => {
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: false, // hover is available
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useTouchState({ id: "test-15" }));

      const mockEvent = {
        stopPropagation: jest.fn(),
        target: document.createElement("div"),
      } as unknown as React.MouseEvent<HTMLElement>;

      act(() => {
        result.current.handleClick(mockEvent);
      });

      expect(result.current.isTouched).toBe(false);
      // Verify stopPropagation was NOT called on desktop devices
      expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
    });
  });
});
