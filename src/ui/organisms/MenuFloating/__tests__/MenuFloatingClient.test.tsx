import { render, screen, fireEvent, act } from "@testing-library/react";
import { RootProvider } from "@/providers";
import MenuFloatingClient from "../../MenuFloatingClient";

// Mock window.matchMedia for breakpoint detection (Story 11.3)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false, // Simulate mobile/tablet viewport (< desktop breakpoint)
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock useReducedMotion hook used by Floating component
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

// Mock domain query barrels to provide named exports.
// Components import as: import { useNavigationItems } from "@/domains/navigation-item/queries"
// Re-export the actual hook as a named export.
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

// We use fake timers so the mock delays inside domain hooks
// (navigation-item, contact-point) don't complete during this basic
// render test. We only care that the component renders without
// throwing and the closed state matches the snapshot.
jest.useFakeTimers();

describe("MenuFloatingClient", () => {
  it("renders closed state with menu button without crashing", () => {
    const { container } = render(
      <RootProvider>
        <MenuFloatingClient />
      </RootProvider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("opens floating menu when the menu button is toggled", () => {
    render(
      <RootProvider>
        <MenuFloatingClient />
      </RootProvider>
    );

    // Initially, only the button should be present; no floating nav.
    expect(
      screen.queryByRole("navigation", { name: /floating navigation/i })
    ).not.toBeInTheDocument();

    // Click the menu button (it should toggle the Redux menuPanel slice).
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // After toggling, the floating navigation and contact points should exist.
    expect(
      screen.getByRole("navigation", { name: /floating navigation/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("navigation", { name: /floating contact points/i })
    ).toBeInTheDocument();
  });

  it("closes floating menu when viewport crosses to navContent breakpoint", () => {
    const originalMatchMedia = window.matchMedia;
    const listeners: Record<string, Function> = {};

    // Override matchMedia to capture event listeners
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

    render(
      <RootProvider>
        <MenuFloatingClient />
      </RootProvider>
    );

    // Ensure menu is open (toggle until aria-expanded="true")
    const button = screen.getByRole("button");
    if (button.getAttribute("aria-expanded") !== "true") {
      fireEvent.click(button);
    }

    // Menu should be open
    expect(
      screen.getByRole("navigation", { name: /floating navigation/i })
    ).toBeInTheDocument();

    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 880px)");

    // Simulate viewport crossing to navContent breakpoint (≥880px)
    act(() => {
      listeners["change"]?.({ matches: true } as MediaQueryListEvent);
    });

    // Menu should be closed — only the button remains
    expect(
      screen.queryByRole("navigation", { name: /floating navigation/i })
    ).not.toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });
});
