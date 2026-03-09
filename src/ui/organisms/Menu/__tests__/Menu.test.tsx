import { render, screen, within } from "@testing-library/react";
import { RootProvider } from "@/providers";
import Menu from "../index";

import navigationItemsMock from "@/domains/navigation-item/model/mock";
import contactPointsMock from "@/domains/contact-point/model/mock";

// Mock the domain hooks to avoid timing issues with React Query + fake timers
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

// Import actual constant to keep in sync
import { DESKTOP_HEADER_SOCIAL_PROVIDERS } from "../constants";

describe("Menu (desktop header)", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("renders navigation links and only curated desktop social contact points", () => {
    // Mock hooks to return loaded state immediately
    mockUseNavigationItems.mockReturnValue({
      data: navigationItemsMock,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useNavigationItems>);

    mockUseContactPoints.mockReturnValue({
      data: contactPointsMock,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useContactPoints>);

    render(
      <RootProvider>
        <Menu />
      </RootProvider>
    );

    // Get primary navigation (should now be in loaded state)
    const primaryNav = screen.getByRole("navigation", {
      name: /primary navigation/i,
    });

    // Assert navigation links match mock navigation items
    const navLinks = within(primaryNav).getAllByRole("link");
    expect(navLinks).toHaveLength(navigationItemsMock.length);

    const navHrefs = navLinks.map((link) => link.getAttribute("href"));
    const expectedHrefs = navigationItemsMock.map(({ href }) => href);
    expectedHrefs.forEach((href) => {
      expect(navHrefs).toContain(href);
    });

    // Now assert header social links come from the contact-point mock
    const socialNav = screen.getByRole("navigation", { name: /social links/i });
    const socialLinks = within(socialNav).getAllByRole("link");

    const expectedSocials = contactPointsMock.filter(
      ({ provider }) =>
        provider && DESKTOP_HEADER_SOCIAL_PROVIDERS.includes(provider)
    );

    expect(socialLinks).toHaveLength(expectedSocials.length);

    const socialHrefs = socialLinks.map((link) => link.getAttribute("href"));
    expectedSocials.forEach(({ href }) => {
      expect(socialHrefs).toContain(href);
    });

    const nonCuratedSocials = contactPointsMock.filter(
      ({ provider }) =>
        provider && !DESKTOP_HEADER_SOCIAL_PROVIDERS.includes(provider)
    );

    nonCuratedSocials.forEach(({ href }) => {
      expect(socialHrefs).not.toContain(href);
    });
  });

  it("does not replace missing curated providers with non-curated ones", () => {
    mockUseNavigationItems.mockReturnValue({
      data: navigationItemsMock,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useNavigationItems>);

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
    } as ReturnType<typeof useContactPoints>);

    render(
      <RootProvider>
        <Menu />
      </RootProvider>
    );

    const socialNav = screen.getByRole("navigation", { name: /social links/i });
    const socialLinks = within(socialNav).getAllByRole("link");

    expect(socialLinks).toHaveLength(1);
    expect(socialLinks[0]).toHaveAttribute(
      "href",
      "https://linkedin.com/in/example"
    );
    const socialHrefs = socialLinks.map((link) => link.getAttribute("href"));
    expect(socialHrefs).not.toContain("https://x.com/example");
  });

  it("renders loading state when navigation is loading", () => {
    mockUseNavigationItems.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useNavigationItems>);

    mockUseContactPoints.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useContactPoints>);

    render(
      <RootProvider>
        <Menu />
      </RootProvider>
    );

    // Should show loading state
    expect(
      screen.getByRole("navigation", {
        name: /primary navigation loading state/i,
      })
    ).toBeInTheDocument();
  });

  it("renders error state when navigation fails to load", () => {
    mockUseNavigationItems.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useNavigationItems>);

    mockUseContactPoints.mockReturnValue({
      data: contactPointsMock,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useContactPoints>);

    render(
      <RootProvider>
        <Menu />
      </RootProvider>
    );

    // Should show error state
    expect(
      screen.getByRole("navigation", {
        name: /primary navigation error state/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/error loading navigation/i)).toBeInTheDocument();
  });
});
