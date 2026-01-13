import { render, screen, waitFor, within } from "@testing-library/react";
import { RootProvider } from "@/providers";
import Menu from "../index";

import navigationItemsMock from "@/domains/navigation-item/model/mock";
import contactPointsMock from "@/domains/contact-point/model/mock";

// Keep this list in sync with HEADER_SOCIAL_PROVIDERS in Menu/index.jsx
const HEADER_SOCIAL_PROVIDERS = [
  "github",
  "linkedin",
  "twitter",
  "dribbble",
  "telegram",
  "whatsapp",
];

jest.useFakeTimers();

describe("Menu (desktop header)", () => {
  it("renders navigation links and header social contact points from mocks", async () => {
    render(
      <RootProvider>
        <Menu />
      </RootProvider>
    );

    // Advance timers so domain mock delays (2s) complete
    jest.advanceTimersByTime(2000);

    // Wait until the primary navigation is rendered
    const primaryNav = await waitFor(() =>
      screen.getByRole("navigation", { name: /primary navigation/i })
    );

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
      ({ provider }) => provider && HEADER_SOCIAL_PROVIDERS.includes(provider)
    );

    expect(socialLinks).toHaveLength(expectedSocials.length);

    const socialHrefs = socialLinks.map((link) => link.getAttribute("href"));
    expectedSocials.forEach(({ href }) => {
      expect(socialHrefs).toContain(href);
    });
  });
})
