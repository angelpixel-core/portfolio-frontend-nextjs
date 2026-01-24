import { renderHook } from "@testing-library/react";

// Mock framer-motion's useReducedMotion
const mockUseReducedMotion = jest.fn();

jest.mock("framer-motion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

import { useReducedMotion } from "../useReducedMotion";

describe("useReducedMotion", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReset();
  });

  it("returns false when user does not prefer reduced motion", () => {
    mockUseReducedMotion.mockReturnValue(false);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it("returns true when user prefers reduced motion", () => {
    mockUseReducedMotion.mockReturnValue(true);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it("returns false when framer-motion returns null (defensive)", () => {
    mockUseReducedMotion.mockReturnValue(null);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it("returns false when framer-motion returns undefined (defensive)", () => {
    mockUseReducedMotion.mockReturnValue(undefined);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });
});
