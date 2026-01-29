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
    // Advance past EXIT_FALLBACK_TIMEOUT (1300ms)
    act(() => {
      jest.advanceTimersByTime(1300);
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
