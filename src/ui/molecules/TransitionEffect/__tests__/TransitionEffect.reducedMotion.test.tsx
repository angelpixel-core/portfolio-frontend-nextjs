import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

describe("TransitionEffect reduced motion behavior", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("renders transition blades when reduced motion is NOT preferred and phase is entering", async () => {
    jest.doMock("@/hooks/ui/useTransition", () => ({
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

    const { container } = render(<TransitionEffect />);

    // Should render the three transition blades
    const blades = container.querySelectorAll(".transition-effect_blade");
    expect(blades).toHaveLength(3);
  });

  it("returns null when reduced motion IS preferred", async () => {
    jest.doMock("@/hooks/ui/useTransition", () => ({
      useTransition: () => ({
        phase: "entering",
        shouldReduceMotion: true,
        isInitialLoad: false,
        isTransitioning: true,
        progress: 0,
        targetHref: "/about",
        startTransition: jest.fn(),
      }),
    }));

    const TransitionEffect = (await import("../index")).default;

    const { container } = render(<TransitionEffect />);

    // Should render nothing
    expect(container.firstChild).toBeNull();
  });

  it("returns null on initial page load (isInitialLoad: true)", async () => {
    jest.doMock("@/hooks/ui/useTransition", () => ({
      useTransition: () => ({
        phase: "idle",
        shouldReduceMotion: false,
        isInitialLoad: true,
        isTransitioning: false,
        progress: 0,
        targetHref: null,
        startTransition: jest.fn(),
      }),
    }));

    const TransitionEffect = (await import("../index")).default;

    const { container } = render(<TransitionEffect />);

    // Should render nothing on initial load
    expect(container.firstChild).toBeNull();
  });

  it("returns null when phase is idle and not initial load", async () => {
    jest.doMock("@/hooks/ui/useTransition", () => ({
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

    // Should render nothing when idle (no active transition)
    expect(container.firstChild).toBeNull();
  });
});
