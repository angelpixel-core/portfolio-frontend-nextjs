import { render, screen, fireEvent } from "@testing-library/react";
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
});
