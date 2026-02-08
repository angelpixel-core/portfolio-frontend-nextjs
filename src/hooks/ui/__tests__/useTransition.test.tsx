import React from "react";
import { renderHook } from "@testing-library/react";
import { useTransition } from "../useTransition";
import TransitionProvider from "@/state/providers/TransitionProvider";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/",
}));

// Mock useReducedMotion hook
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

describe("useTransition hook", () => {
  it("returns context value when used within TransitionProvider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TransitionProvider>{children}</TransitionProvider>
    );

    const { result } = renderHook(() => useTransition(), { wrapper });

    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.phase).toBe("idle");
    expect(result.current.progress).toBe(0);
    expect(result.current.targetHref).toBeNull();
    expect(typeof result.current.startTransition).toBe("function");
    expect(result.current.shouldReduceMotion).toBe(false);
  });

  it("returns default values when used outside TransitionProvider", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    const { result } = renderHook(() => useTransition());

    // Should return default values
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.phase).toBe("idle");
    expect(result.current.progress).toBe(0);
    expect(result.current.targetHref).toBeNull();
    expect(result.current.shouldReduceMotion).toBe(false);

    // Calling startTransition should warn (via logger)
    result.current.startTransition("/test");
    expect(consoleSpy).toHaveBeenCalledWith(
      "⚠️  [Transition]",
      "startTransition called outside of TransitionProvider",
      ""
    );

    consoleSpy.mockRestore();
  });
});
