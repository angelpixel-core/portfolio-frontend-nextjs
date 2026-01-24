import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

describe("TransitionEffect reduced motion behavior", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("renders transition blades when reduced motion is NOT preferred", async () => {
    jest.doMock("@/hooks", () => ({
      useReducedMotion: () => false,
    }));

    const TransitionEffect = (
      await import("../index")
    ).default;

    const { container } = render(<TransitionEffect />);

    // Should render the three transition blades
    const blades = container.querySelectorAll(".transition-effect_blade");
    expect(blades).toHaveLength(3);
  });

  it("returns null when reduced motion IS preferred", async () => {
    jest.doMock("@/hooks", () => ({
      useReducedMotion: () => true,
    }));

    const TransitionEffect = (
      await import("../index")
    ).default;

    const { container } = render(<TransitionEffect />);

    // Should render nothing
    expect(container.firstChild).toBeNull();
  });
});
