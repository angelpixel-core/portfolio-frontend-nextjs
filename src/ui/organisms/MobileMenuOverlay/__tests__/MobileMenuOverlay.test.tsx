import React from "react";
import { render, screen, act } from "@testing-library/react";
import { RootProvider } from "@/providers";
import { ReduxStore } from "@/state/stores";
import { setMenuPanel } from "@/state/slices/menuPanel/slice";
import MobileMenuOverlay from "../index";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/"),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock domain query barrels to provide named exports
jest.mock("@/domains/navigation-item/queries", () => {
  const actual = jest.requireActual(
    "@/domains/navigation-item/queries/useNavigationItems"
  );
  return { __esModule: true, useNavigationItems: actual.default };
});

jest.mock("@/domains/contact-point/queries", () => {
  const actual = jest.requireActual(
    "@/domains/contact-point/queries/useContactPoints"
  );
  return { __esModule: true, useContactPoints: actual.default };
});

// Mock window.matchMedia for breakpoint detection
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.useFakeTimers();

describe("MobileMenuOverlay", () => {
  afterEach(() => {
    // Reset menu state between tests
    ReduxStore.dispatch(setMenuPanel(false));
  });

  it("returns null when menu is closed", () => {
    render(
      <RootProvider>
        <MobileMenuOverlay />
      </RootProvider>
    );

    // MobileMenuOverlay renders a Floating with aria-label "Mobile navigation" when open
    expect(
      screen.queryByRole("navigation", { name: /mobile navigation/i })
    ).not.toBeInTheDocument();
  });

  it("closes overlay when viewport crosses to navContent breakpoint", () => {
    const listeners: Record<string, Function> = {};

    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((event: string, handler: Function) => {
        listeners[event] = handler;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia;

    // Open the menu via Redux store before rendering
    act(() => {
      ReduxStore.dispatch(setMenuPanel(true));
    });

    render(
      <RootProvider>
        <MobileMenuOverlay />
      </RootProvider>
    );

    // Menu should be open — overlay visible
    expect(
      screen.getByRole("navigation", { name: /mobile navigation/i })
    ).toBeInTheDocument();

    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 880px)");

    // Simulate viewport crossing to navContent breakpoint (≥880px)
    act(() => {
      listeners["change"]?.({ matches: true } as MediaQueryListEvent);
    });

    // Menu should be closed
    expect(
      screen.queryByRole("navigation", { name: /mobile navigation/i })
    ).not.toBeInTheDocument();
  });
});
