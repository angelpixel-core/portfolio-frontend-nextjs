import React from "react";
import { render, screen, within } from "@testing-library/react";
import { RootProvider } from "@/providers";
import NavBar from "../index";

// Mock child organisms to isolate NavBar rendering
jest.mock("@/organisms/Menu", () => {
  const MockMenu = () => <div data-testid="mock-menu" />;
  return { __esModule: true, default: MockMenu };
});

jest.mock("@/organisms/MobileMenuOverlay", () => {
  const MockOverlay = () => null;
  return { __esModule: true, default: MockOverlay };
});

jest.mock("@/molecules/SocialNetworkLink", () => {
  const MockSocialNetworkLink = ({
    href,
    iconName,
  }: {
    href: string;
    iconName?: string;
  }) => (
    <a href={href} data-testid={`social-link-${iconName ?? "unknown"}`}>
      {iconName}
    </a>
  );

  return { __esModule: true, default: MockSocialNetworkLink };
});

// Mock domain hooks used directly by NavBar
jest.mock("@/domains/contact-point/queries", () => ({
  useContactPoints: jest.fn(),
}));

import { useContactPoints } from "@/domains/contact-point/queries";

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

describe("NavBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header container with all layout zones", () => {
    mockUseContactPoints.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useContactPoints>);

    render(
      <RootProvider>
        <NavBar />
      </RootProvider>
    );

    expect(screen.getByTestId("header-container")).toBeInTheDocument();
    expect(screen.getByTestId("header-logo-menu-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("header-mobile-auth")).toBeInTheDocument();
    expect(screen.getByTestId("header-mobile-theme")).toBeInTheDocument();
  });

  it("renders only curated social providers in tablet social zone", () => {
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
    } as unknown as ReturnType<typeof useContactPoints>);

    render(
      <RootProvider>
        <NavBar />
      </RootProvider>
    );

    const tabletSocialNav = screen.getByRole("navigation", {
      name: /social links/i,
    });
    const socialLinks = within(tabletSocialNav).getAllByRole("link");
    const hrefs = socialLinks.map((link) => link.getAttribute("href"));

    expect(hrefs).toHaveLength(2);
    expect(hrefs).toContain("https://github.com/example");
    expect(hrefs).toContain("https://linkedin.com/in/example");
    expect(hrefs).not.toContain("https://x.com/example");
    expect(hrefs).not.toContain("https://dribbble.com/example");
  });

  it("shows only available curated provider when one is missing", () => {
    mockUseContactPoints.mockReturnValue({
      data: [
        {
          id: 1,
          provider: "linkedin",
          href: "https://linkedin.com/in/example",
          icon: "linkedin",
        },
        {
          id: 2,
          provider: "twitter",
          href: "https://x.com/example",
          icon: "twitter",
        },
      ],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useContactPoints>);

    render(
      <RootProvider>
        <NavBar />
      </RootProvider>
    );

    const tabletSocialNav = screen.getByRole("navigation", {
      name: /social links/i,
    });
    const socialLinks = within(tabletSocialNav).getAllByRole("link");
    const hrefs = socialLinks.map((link) => link.getAttribute("href"));

    expect(hrefs).toHaveLength(1);
    expect(hrefs).toContain("https://linkedin.com/in/example");
    expect(hrefs).not.toContain("https://x.com/example");
  });
});
