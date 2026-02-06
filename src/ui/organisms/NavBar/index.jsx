"use client";

import "./styles.css";

import { HireMe, LogoMenuTrigger, SocialNetworkLink } from "@/molecules";
import { default as SocialNetworkLinkSkeleton } from "@/molecules/SocialNetworkLink/skeleton";
import { Menu, MobileMenuOverlay } from "@/organisms";
import { AuthButton, ThemeButton } from "@/buttons";
import { useContactPoints } from "@/hooks";
import { HEADER_SOCIAL_PROVIDERS } from "../Menu/constants";

/**
 * NavBar - Main header component with mobile/desktop layouts.
 *
 * ## Mobile Layout (<841px) per design doc:
 * | logo (menu trigger) | AIR | auth | AIR | theme |
 * - Logo: far left, acts as menu trigger
 * - Theme: far right, mirrored with logo (same padding)
 * - Auth: center area
 * - HireMe circular floats (fixed to viewport bottom-right)
 * - NO hamburger menu icon - Logo is the trigger
 *
 * ## Desktop Layout (≥841px) per design doc:
 * | padding | logo | AIR | nav | AIR | socials | AIR | ui | AIR | hireMe |
 * - Menu component handles full layout
 * - HireMe circular is part of header flow (not fixed)
 *
 * NOTE: No rectangular HireMe button exists. Only circular HireMe.
 *
 * @see _bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/
 */
const NavBar = () => {
  const { data: contactPoints, isLoading: isLoadingContacts } =
    useContactPoints();

  const socialLinks = contactPoints?.filter(
    ({ provider }) => provider && HEADER_SOCIAL_PROVIDERS.includes(provider)
  );

  return (
    <header className="layout_navbar-container" data-testid="header-container">
      {/* Mobile: Logo as menu trigger (far left) - hidden on nav+ */}
      <div
        className="layout_logo-menu-trigger"
        data-testid="header-logo-menu-trigger"
      >
        <LogoMenuTrigger />
      </div>

      {/* Mobile: Auth button (center area) - hidden on nav+ */}
      <div className="layout_mobile-auth" data-testid="header-mobile-auth">
        <AuthButton />
      </div>

      {/* 720px-840px: Social links - hidden below 720px and at nav+ */}
      <nav
        className="layout_tablet-social"
        aria-label="Social links"
        data-testid="header-tablet-social"
      >
        {isLoadingContacts && (
          <>
            <SocialNetworkLinkSkeleton />
            <SocialNetworkLinkSkeleton />
            <SocialNetworkLinkSkeleton />
            <SocialNetworkLinkSkeleton />
          </>
        )}
        {socialLinks?.map(({ id, href, icon, provider }, idx) => (
          <SocialNetworkLink
            key={id || idx}
            href={href}
            iconName={icon ?? provider}
            iconClassName=""
          />
        ))}
      </nav>

      {/* Mobile: Theme button (far right, mirrored with logo) - hidden on nav+ */}
      <div className="layout_mobile-theme" data-testid="header-mobile-theme">
        <ThemeButton />
      </div>

      {/* Desktop: Full Menu with all zones - hidden below nav */}
      <Menu />

      {/* Mobile: Menu overlay (nav + socials) - controlled by LogoMenuTrigger */}
      <MobileMenuOverlay />

      {/* Mobile: HireMe circular floating - fixed to viewport bottom-right */}
      <div className="layout_hireme-mobile">
        <HireMe />
      </div>
    </header>
  );
};

export default NavBar;
