import React from "react";
import { render, screen, act, within } from "@testing-library/react";
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

// Mock domain query hooks for deterministic social filtering tests
jest.mock("@/domains/navigation-item/queries", () => ({
  useNavigationItems: jest.fn(),
}));

jest.mock("@/domains/contact-point/queries", () => ({
  useContactPoints: jest.fn(),
}));

import { useNavigationItems } from "@/domains/navigation-item/queries";
import { useContactPoints } from "@/domains/contact-point/queries";

const mockUseNavigationItems = useNavigationItems as jest.MockedFunction<
  typeof useNavigationItems
>;
const mockUseContactPoints = useContactPoints as jest.MockedFunction<
  typeof useContactPoints
>;

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
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseNavigationItems.mockReturnValue({
      data: [
        { id: 1, name: "Home", href: "/" },
        { id: 2, name: "About", href: "/about" },
      ],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useNavigationItems>);

    mockUseContactPoints.mockReturnValue({
      data: [
        {
          id: 1,
          provider: "github",
          href: "https://github.com/example",
          icon: "github",
        },
        {
          id: 2,
          provider: "linkedin",
          href: "https://linkedin.com/in/example",
          icon: "linkedin",
        },
        {
          id: 3,
          provider: "twitter",
          href: "https://x.com/example",
          icon: "twitter",
        },
        {
          id: 4,
          provider: "dribbble",
          href: "https://dribbble.com/example",
          icon: "dribbble",
        },
      ],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useContactPoints>);
  });

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

  it("retains broader mobile social provider set", () => {
    act(() => {
      ReduxStore.dispatch(setMenuPanel(true));
    });

    render(
      <RootProvider>
        <MobileMenuOverlay />
      </RootProvider>
    );

    const socialNav = screen.getByRole("navigation", { name: /social links/i });
    const socialLinks = within(socialNav).getAllByRole("link");
    const hrefs = socialLinks.map((link) => link.getAttribute("href"));

    expect(hrefs).toHaveLength(4);
    expect(hrefs).toContain("https://github.com/example");
    expect(hrefs).toContain("https://linkedin.com/in/example");
    expect(hrefs).toContain("https://x.com/example");
    expect(hrefs).toContain("https://dribbble.com/example");
  });
});
