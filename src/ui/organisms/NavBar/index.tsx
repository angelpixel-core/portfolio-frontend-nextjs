"use client";

import React from "react";
import { usePathname } from "next/navigation";
import "./styles.css";

import HireMe from "@/molecules/HireMe";
import LogoMenuTrigger from "@/molecules/LogoMenuTrigger";
import SocialNetworkLink from "@/molecules/SocialNetworkLink";
import SocialNetworkLinkSkeleton from "@/molecules/SocialNetworkLink/skeleton";
import Menu from "@/organisms/Menu";
import MobileMenuOverlay from "@/organisms/MobileMenuOverlay";
import AuthButton from "@/buttons/AuthButton";
import ThemeButton from "@/buttons/ThemeButton";
import { useContactPoints } from "@/domains/contact-point/queries";
import { DESKTOP_HEADER_SOCIAL_PROVIDERS } from "../Menu/constants";

/**
 * NavBar - Main header component with mobile/desktop layouts.
 *
 * ## Mobile Layout (<880px) per design doc:
 * | logo (menu trigger) | AIR | auth | AIR | theme |
 * - Logo: far left, acts as menu trigger
 * - Theme: far right, mirrored with logo (same padding)
 * - Auth: center area
 * - HireMe circular floats (fixed to viewport bottom-right)
 * - NO hamburger menu icon - Logo is the trigger
 *
 * ## Desktop Layout (≥880px) per design doc:
 * | padding | logo | AIR | nav | AIR | socials | AIR | ui | AIR | hireMe |
 * - Menu component handles full layout
 * - HireMe circular is part of header flow (not fixed)
 *
 * NOTE: No rectangular HireMe button exists. Only circular HireMe.
 *
 * @see _bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/
 */
const NavBar = (): React.JSX.Element => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
  const isPaymentResultRoute =
    pathname === "/success" ||
    pathname === "/cancel" ||
    Boolean(pathname?.match(/^\/articles\/[^/]+\/(success|cancel)$/));
  const showHireMe = !isAdminRoute && !isPaymentResultRoute;

  const { data: contactPoints, isLoading: isLoadingContacts } =
    useContactPoints();

  // const socialLinks = contactPoints?.filter(
  //   ({ provider }) =>
  //     provider && DESKTOP_HEADER_SOCIAL_PROVIDERS.includes(provider)
  // );
  const socialLinks = [
    {
      id: 1,
      type: "communication",
      provider: "email",
      label: "Email",
      href: "mailto:contact@angelpixel.io",
      value: "contact@angelpixel.io",
      icon: "Mail",
    },
    {
      id: 2,
      type: "social",
      provider: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/in/angelszymczak",
      value: "https://linkedin.com/in/angelszymczak",
      icon: "LinkedIn",
    },
    {
      id: 3,
      type: "social",
      provider: "github",
      label: "GitHub",
      href: "https://github.com/angelpixel-core",
      value: "https://github.com/angelpixel-core",
      icon: "GitHub",
    },
    {
      id: 4,
      type: "communication",
      provider: "whatsapp",
      label: "WhatsApp",
      href: "https://wa.me/54912345678",
      value: "https://wa.me/54912345678",
      icon: "WhatsApp",
    },
    {
      id: 5,
      type: "social",
      provider: "twitter",
      label: "Twitter",
      href: "https://twitter.com/angelpixelio",
      value: "https://twitter.com/angelpixelio",
      icon: "Twitter",
    },
    {
      id: 6,
      type: "social",
      provider: "dribbble",
      label: "Dribbble",
      href: "https://dribbble.com/angelpixel",
      value: "https://dribbble.com/angelpixel",
      icon: "Dribbble",
    },
    {
      id: 7,
      type: "messaging",
      provider: "telegram",
      label: "Telegram",
      href: "https://t.me/angelszymczak",
      value: "https://t.me/angelszymczak",
      icon: "Telegram",
    },
    {
      id: 8,
      type: "communication",
      provider: "calendly",
      label: "Calendly",
      href: "https://calendly.com/angelpixel",
      value: "https://calendly.com/angelpixel",
      icon: "Calendar",
    },
  ];

  return (
    <header className="layout__navbar-container" data-testid="header-container">
      {/* Mobile: Logo as menu trigger (far left) - hidden on navContent+ */}
      <div
        className="layout__logo-menu-trigger"
        data-testid="header-logo-menu-trigger"
      >
        <LogoMenuTrigger />
      </div>

      {/* Mobile: Auth button (center area) - hidden on navContent+ */}
      <div className="layout__mobile-auth" data-testid="header-mobile-auth">
        <AuthButton />
      </div>

      {/* 720px-879px: Social links - hidden below 720px and at navContent+ */}
      <nav
        className="layout__tablet-social"
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

      {/* Mobile: Theme button (far right, mirrored with logo) - hidden on navContent+ */}
      <div className="layout__mobile-theme" data-testid="header-mobile-theme">
        <ThemeButton />
      </div>

      {/* Desktop: Full Menu with all zones - hidden below navContent */}
      <Menu showHireMe={showHireMe} />

      {/* Mobile: Menu overlay (nav + socials) - controlled by LogoMenuTrigger */}
      <MobileMenuOverlay />

      {/* Mobile: HireMe circular floating - fixed to viewport bottom-right */}
      {showHireMe ? (
        <div className="layout__hireme-mobile">
          <HireMe />
        </div>
      ) : null}
    </header>
  );
};

export default NavBar;
