import { render, screen, act, fireEvent } from "@testing-library/react";
import { useContext } from "react";
import TransitionProvider, { TransitionContext } from "../index";
import type { TransitionContextValue } from "../types";

// Mock Next.js navigation
const mockPush = jest.fn();
const mockPathname = jest.fn(() => "/");

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname(),
}));

// Mock useReducedMotion hook
const mockUseReducedMotion = jest.fn(() => false);
jest.mock("@/hooks", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

// Test component to access context
const TestConsumer = ({
  onContextReady,
}: {
  onContextReady?: (_ctx: TransitionContextValue) => void;
}) => {
  const context = useContext(TransitionContext);
  onContextReady?.(context);
  return (
    <div data-testid="consumer">
      <span data-testid="is-transitioning">
        {String(context.isTransitioning)}
      </span>
      <span data-testid="phase">{context.phase}</span>
      <span data-testid="progress">{context.progress}</span>
      <span data-testid="should-reduce-motion">
        {String(context.shouldReduceMotion)}
      </span>
      <span data-testid="can-animate">
        {String((context as TransitionContextValue).canAnimate ?? false)}
      </span>
      <button
        data-testid="start-transition"
        onClick={() => context.startTransition("/about")}
      >
        Navigate
      </button>
    </div>
  );
};

describe("TransitionProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
    mockPathname.mockReturnValue("/");
    document.body.className = "";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Task 1: TransitionProvider renders children (AC1)", () => {
    it("should render children within the provider", () => {
      render(
        <TransitionProvider>
          <div data-testid="child">Child Content</div>
        </TransitionProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByTestId("child")).toHaveTextContent("Child Content");
    });

    it("should provide TransitionContext to children", () => {
      let capturedContext: TransitionContextValue | null = null;

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      expect(capturedContext).not.toBeNull();
      expect(capturedContext!.startTransition).toBeDefined();
      expect(typeof capturedContext!.startTransition).toBe("function");
    });
  });

  describe("Task 2: useTransition returns correct state (AC2)", () => {
    it("should provide initial idle state", () => {
      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      expect(screen.getByTestId("is-transitioning")).toHaveTextContent("false");
      expect(screen.getByTestId("phase")).toHaveTextContent("idle");
      expect(screen.getByTestId("progress")).toHaveTextContent("0");
    });

    it("should provide shouldReduceMotion from hook", () => {
      mockUseReducedMotion.mockReturnValue(true);

      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      expect(screen.getByTestId("should-reduce-motion")).toHaveTextContent(
        "true"
      );
    });
  });

  describe("Task 3: Phase transitions (AC3)", () => {
    it("should transition to entering phase when startTransition is called", () => {
      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      expect(screen.getByTestId("is-transitioning")).toHaveTextContent("true");
      expect(screen.getByTestId("phase")).toHaveTextContent("entering");
    });

    it("should call router.push after entering duration", () => {
      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      // router.push should not be called yet
      expect(mockPush).not.toHaveBeenCalled();

      // Advance past entering duration + pause
      act(() => {
        jest.advanceTimersByTime(900); // 800ms enter + 100ms pause
      });

      // router.push should now be called
      expect(mockPush).toHaveBeenCalledWith("/about");
    });

    it("should not start transition if already transitioning", () => {
      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      // mockPush should not be called yet (still in entering phase)
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should not transition to current page", () => {
      mockPathname.mockReturnValue("/about");

      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition")); // tries to go to /about
      });

      expect(screen.getByTestId("is-transitioning")).toHaveTextContent("false");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Task 4: Reduced motion behavior (AC6)", () => {
    it("should navigate instantly when reduced motion is preferred", () => {
      mockUseReducedMotion.mockReturnValue(true);

      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      // Should navigate immediately without transition
      expect(mockPush).toHaveBeenCalledWith("/about");
      expect(screen.getByTestId("is-transitioning")).toHaveTextContent("false");
      expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    });
  });

  describe("Task 4: Interaction blocking (AC4)", () => {
    it("should add transition-active class to body during transition", () => {
      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      expect(document.body.classList.contains("transition-active")).toBe(false);

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      expect(document.body.classList.contains("transition-active")).toBe(true);
    });

    it("should remove transition-active class on unmount", () => {
      const { unmount } = render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      expect(document.body.classList.contains("transition-active")).toBe(true);

      unmount();

      expect(document.body.classList.contains("transition-active")).toBe(false);
    });
  });

  describe("Story 13.6: Focus blocking with inert attribute (AC4)", () => {
    it("should add inert attribute to body during transition", () => {
      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      expect(document.body.hasAttribute("inert")).toBe(false);

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      expect(document.body.hasAttribute("inert")).toBe(true);
    });

    it("should remove inert attribute when transition ends", () => {
      const { rerender } = render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      expect(document.body.hasAttribute("inert")).toBe(true);

      // Advance to covering phase
      act(() => {
        jest.advanceTimersByTime(900);
      });

      // Pathname changes (navigation success)
      mockPathname.mockReturnValue("/about");
      rerender(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      // Pause before exit (100ms)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Exit animation + buffer (800ms + 200ms)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(document.body.hasAttribute("inert")).toBe(false);
    });

    it("should remove inert attribute on unmount", () => {
      const { unmount } = render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      expect(document.body.hasAttribute("inert")).toBe(true);

      unmount();

      expect(document.body.hasAttribute("inert")).toBe(false);
    });

    it("should NOT add inert when reduced motion is preferred", () => {
      mockUseReducedMotion.mockReturnValue(true);

      render(
        <TransitionProvider>
          <TestConsumer />
        </TransitionProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("start-transition"));
      });

      // With reduced motion, navigation is instant, no transition state
      expect(document.body.hasAttribute("inert")).toBe(false);
    });
  });
});

describe("Story 13.3: Phase transitions and timeout fallback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
    mockPathname.mockReturnValue("/");
    document.body.className = "";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should transition to covering phase after entering", () => {
    render(
      <TransitionProvider>
        <TestConsumer />
      </TransitionProvider>
    );

    // Start transition
    act(() => {
      fireEvent.click(screen.getByTestId("start-transition"));
    });

    expect(screen.getByTestId("phase")).toHaveTextContent("entering");

    // Advance to covering phase (800ms enter + 100ms pause)
    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
  });

  it("should transition to exiting phase when pathname changes", () => {
    const { rerender } = render(
      <TransitionProvider>
        <TestConsumer />
      </TransitionProvider>
    );

    // Start transition
    act(() => {
      fireEvent.click(screen.getByTestId("start-transition"));
    });

    // Advance to covering phase
    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(screen.getByTestId("phase")).toHaveTextContent("covering");

    // Pathname changes (navigation success)
    mockPathname.mockReturnValue("/about");
    rerender(
      <TransitionProvider>
        <TestConsumer />
      </TransitionProvider>
    );

    // Small pause before exiting
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByTestId("phase")).toHaveTextContent("exiting");
  });

  it("should force idle after EXIT_FALLBACK_TIMEOUT if pathname never changes", () => {
    render(
      <TransitionProvider>
        <TestConsumer />
      </TransitionProvider>
    );

    // Start transition
    act(() => {
      fireEvent.click(screen.getByTestId("start-transition"));
    });

    // Advance to covering phase
    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(screen.getByTestId("phase")).toHaveTextContent("covering");

    // Pathname never changes (simulating navigation failure)
    // Advance past EXIT_FALLBACK_TIMEOUT (5000ms - increased in Story 14.2 fix)
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Should be forced to idle by timeout
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("is-transitioning")).toHaveTextContent("false");
  });

  it("should complete full transition cycle and go to idle", () => {
    const { rerender } = render(
      <TransitionProvider>
        <TestConsumer />
      </TransitionProvider>
    );

    // Start transition
    act(() => {
      fireEvent.click(screen.getByTestId("start-transition"));
    });

    // Advance to covering phase
    act(() => {
      jest.advanceTimersByTime(900);
    });

    // Pathname changes
    mockPathname.mockReturnValue("/about");
    rerender(
      <TransitionProvider>
        <TestConsumer />
      </TransitionProvider>
    );

    // Pause before exit
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByTestId("phase")).toHaveTextContent("exiting");

    // Exit animation + buffer (800ms + 200ms)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("is-transitioning")).toHaveTextContent("false");
  });
});

describe("Story 13.4: 50% Trigger Synchronization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseReducedMotion.mockReturnValue(false);
    mockPathname.mockReturnValue("/");
    document.body.className = "";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Task 1: Progress tracking via onProgressUpdate (AC1)", () => {
    it("should update progress when onProgressUpdate is called", () => {
      let capturedContext: TransitionContextValue | null = null;

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Start transition
      act(() => {
        capturedContext!.startTransition("/about");
      });

      // Simulate progress update from TransitionEffect
      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      expect(screen.getByTestId("progress")).toHaveTextContent("50");
    });

    it("should clamp progress between 0 and 100", () => {
      let capturedContext: TransitionContextValue | null = null;

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.startTransition("/about");
      });

      // Test upper clamp
      act(() => {
        capturedContext!.onProgressUpdate?.(150);
      });
      expect(screen.getByTestId("progress")).toHaveTextContent("100");

      // Test lower clamp
      act(() => {
        capturedContext!.onProgressUpdate?.(-10);
      });
      expect(screen.getByTestId("progress")).toHaveTextContent("0");
    });

    it("should only track progress during entering phase", () => {
      let capturedContext: TransitionContextValue | null = null;

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Try to update progress when idle (should be ignored or reset)
      act(() => {
        capturedContext!.onProgressUpdate?.(75);
      });

      // Progress should still be 0 when not in entering phase
      expect(screen.getByTestId("progress")).toHaveTextContent("0");
    });
  });

  describe("Task 2: 50% trigger detection (AC2)", () => {
    it("should fire fifty percent event exactly once when progress crosses 50%", () => {
      let capturedContext: TransitionContextValue | null = null;
      const fiftyPercentCallback = jest.fn();

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Register callback
      act(() => {
        capturedContext!.registerFiftyPercentCallback?.(fiftyPercentCallback);
      });

      // Start transition
      act(() => {
        capturedContext!.startTransition("/about");
      });

      // Progress to 49% - should not fire
      act(() => {
        capturedContext!.onProgressUpdate?.(49);
      });
      expect(fiftyPercentCallback).not.toHaveBeenCalled();

      // Progress to 50% - should fire
      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });
      expect(fiftyPercentCallback).toHaveBeenCalledTimes(1);

      // Progress to 75% - should NOT fire again
      act(() => {
        capturedContext!.onProgressUpdate?.(75);
      });
      expect(fiftyPercentCallback).toHaveBeenCalledTimes(1);
    });

    it("should reset fifty percent trigger for new transitions", () => {
      let capturedContext: TransitionContextValue | null = null;
      const fiftyPercentCallback = jest.fn();

      const { rerender } = render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.registerFiftyPercentCallback?.(fiftyPercentCallback);
      });

      // First transition
      act(() => {
        capturedContext!.startTransition("/about");
      });

      // Re-render to get updated context after startTransition
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });
      expect(fiftyPercentCallback).toHaveBeenCalledTimes(1);

      // Advance to covering phase (800ms + 100ms pause)
      act(() => {
        jest.advanceTimersByTime(900);
      });

      // Pathname changes (navigation completes)
      mockPathname.mockReturnValue("/about");
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Wait for pause before exit (100ms)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Exit animation (800ms + 200ms buffer)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Re-render to get updated context after transition ends
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Verify we're back to idle
      expect(screen.getByTestId("phase")).toHaveTextContent("idle");

      // Second transition - navigating from /about to /contact
      act(() => {
        capturedContext!.startTransition("/contact");
      });

      // Re-render to get updated context after startTransition
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Verify we're entering
      expect(screen.getByTestId("phase")).toHaveTextContent("entering");

      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      // Should fire again for new transition
      expect(fiftyPercentCallback).toHaveBeenCalledTimes(2);
    });
  });

  describe("Task 3: Navigation delayed until 50% point (AC3)", () => {
    it("should NOT navigate until 50% progress is reached", () => {
      let capturedContext: TransitionContextValue | null = null;

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Start transition
      act(() => {
        capturedContext!.startTransition("/about");
      });

      // Progress to 49% - should NOT navigate
      act(() => {
        capturedContext!.onProgressUpdate?.(49);
      });

      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByTestId("phase")).toHaveTextContent("entering");
    });

    it("should navigate immediately when 50% progress is reached", () => {
      let capturedContext: TransitionContextValue | null = null;

      const { rerender } = render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Start transition
      act(() => {
        capturedContext!.startTransition("/about");
      });

      // Re-render to get updated context
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Progress to 50% - should navigate
      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      expect(mockPush).toHaveBeenCalledWith("/about");
      expect(screen.getByTestId("phase")).toHaveTextContent("covering");
    });

    it("should transition to covering phase at 50%", () => {
      let capturedContext: TransitionContextValue | null = null;

      const { rerender } = render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.startTransition("/about");
      });

      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      expect(screen.getByTestId("phase")).toHaveTextContent("entering");

      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      expect(screen.getByTestId("phase")).toHaveTextContent("covering");
    });

    it("should use fallback timeout if 50% callback never fires", () => {
      let capturedContext: TransitionContextValue | null = null;

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Start transition but never send progress updates
      act(() => {
        capturedContext!.startTransition("/about");
      });

      // router.push should not be called yet
      expect(mockPush).not.toHaveBeenCalled();

      // Advance past fallback timeout (ENTER_DURATION + PAUSE_AT_FULL)
      act(() => {
        jest.advanceTimersByTime(900);
      });

      // Should have navigated via fallback
      expect(mockPush).toHaveBeenCalledWith("/about");
    });
  });

  describe("Task 4: canAnimate flag (AC4)", () => {
    it("should set canAnimate to false at start of transition", () => {
      let capturedContext: TransitionContextValue | null = null;

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.startTransition("/about");
      });

      expect(capturedContext!.canAnimate).toBe(false);
    });

    it("should set canAnimate to true when 50% trigger fires", () => {
      let capturedContext: TransitionContextValue | null = null;

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.startTransition("/about");
      });

      expect(capturedContext!.canAnimate).toBe(false);

      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      expect(capturedContext!.canAnimate).toBe(true);
    });

    it("should reset canAnimate to false on transition end", () => {
      let capturedContext: TransitionContextValue | null = null;

      const { rerender } = render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.startTransition("/about");
      });

      // Re-render to get updated context
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      // Re-render to get updated context after progress update
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      expect(capturedContext!.canAnimate).toBe(true);

      // Advance to covering phase (800ms + 100ms pause)
      act(() => {
        jest.advanceTimersByTime(900);
      });

      // Pathname changes (navigation completes)
      mockPathname.mockReturnValue("/about");
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Wait for pause before exit (100ms)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Now in exiting phase. Wait for exit animation (800ms + 200ms buffer)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Re-render to get final context state
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      expect(capturedContext!.canAnimate).toBe(false);
    });
  });

  describe("Task 5: Callback registration (AC5)", () => {
    it("should allow registering and unregistering fifty percent callbacks", () => {
      let capturedContext: TransitionContextValue | null = null;
      const callback = jest.fn();

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Register callback
      act(() => {
        capturedContext!.registerFiftyPercentCallback?.(callback);
      });

      act(() => {
        capturedContext!.startTransition("/about");
      });
      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      expect(callback).toHaveBeenCalledTimes(1);

      // Unregister callback
      act(() => {
        capturedContext!.unregisterFiftyPercentCallback?.(callback);
      });

      // Start new transition - callback should NOT be called
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      mockPathname.mockReturnValue("/about");

      act(() => {
        capturedContext!.startTransition("/contact");
      });
      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      // Should still be 1 (not called after unregister)
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should call multiple registered callbacks", () => {
      let capturedContext: TransitionContextValue | null = null;
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.registerFiftyPercentCallback?.(callback1);
        capturedContext!.registerFiftyPercentCallback?.(callback2);
      });

      act(() => {
        capturedContext!.startTransition("/about");
      });
      act(() => {
        capturedContext!.onProgressUpdate?.(50);
      });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe("Task 6: Progress reset between transitions (AC6)", () => {
    it("should reset progress to 0 when new transition starts", () => {
      let capturedContext: TransitionContextValue | null = null;

      const { rerender } = render(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // First transition with progress
      act(() => {
        capturedContext!.startTransition("/about");
      });

      // Re-render to get updated context after startTransition
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      act(() => {
        capturedContext!.onProgressUpdate?.(75);
      });
      expect(screen.getByTestId("progress")).toHaveTextContent("75");

      // Pathname changes (navigation completes)
      mockPathname.mockReturnValue("/about");
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Wait for pause before exit (100ms)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Exit animation (800ms + 200ms buffer)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Re-render to get final context state
      rerender(
        <TransitionProvider>
          <TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />
        </TransitionProvider>
      );

      // Progress should be reset to 0 after transition ends
      expect(screen.getByTestId("progress")).toHaveTextContent("0");

      // Start second transition
      act(() => {
        capturedContext!.startTransition("/contact");
      });

      // Progress should be 0 at start of new transition
      expect(screen.getByTestId("progress")).toHaveTextContent("0");
    });
  });
});

describe("TransitionContext default values", () => {
  it("should provide default values when used outside provider", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    let capturedContext: TransitionContextValue | null = null;

    render(<TestConsumer onContextReady={(ctx) => (capturedContext = ctx)} />);

    // Should have default values
    expect(capturedContext!.isTransitioning).toBe(false);
    expect(capturedContext!.phase).toBe("idle");
    expect(capturedContext!.progress).toBe(0);

    // Calling startTransition should warn
    act(() => {
      capturedContext!.startTransition("/test");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "TransitionContext: startTransition called outside of TransitionProvider"
    );

    consoleSpy.mockRestore();
  });
});
