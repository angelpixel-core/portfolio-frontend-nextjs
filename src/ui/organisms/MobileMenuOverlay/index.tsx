"use client";

import React, { useEffect, useRef } from "react";
import "./styles.css";

import { usePathname } from "next/navigation";
import NavigationItemLink from "@/links/NavigationItemLink";
import SocialNetworkLink from "@/molecules/SocialNetworkLink";
import { useNavigationItems } from "@/domains/navigation-item/queries";
import { useContactPoints } from "@/domains/contact-point/queries";
import { NavigationItemButtonsSkeleton } from "@/organisms/MenuFloating/skeletons";
import { SocialNetworkLinksSkeleton } from "@/organisms/Menu/skeletons";

import useMenuPanel from "@/state/slices/menuPanel/hooks";
import Floating from "@/overlays/Floating";
import { MOBILE_MENU_SOCIAL_PROVIDERS } from "@/organisms/Menu/constants";

/**
 * Nav breakpoint where mobile menu overlay is hidden.
 *
 * IMPORTANT: This value MUST match tailwind.config.js `navContent:` breakpoint.
 * @see tailwind.config.js - screens.navContent
 */
const NAV_BREAKPOINT = 880;

/**
 * MobileMenuOverlay - Floating overlay with navigation and social links.
 *
 * Triggered by LogoMenuTrigger (not hamburger button).
 * Contains:
 * - Primary Nav: NavigationItemLink[] (Home, About, Projects, Articles)
 * - Social/Contact: SocialNetworkLink[] (LinkedIn, GitHub, Twitter, Dribbble)
 *
 * Auto-closes when:
 * - Viewport crosses to navContent breakpoint (≥880px)
 * - Pathname changes (navigation occurred via any TransitionLink)
 * - User clicks outside the overlay
 *
 * @see _bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/
 */
const MobileMenuOverlay = (): React.JSX.Element | null => {
  const { isOpen: isMenuOpen, closeMenuPanel: closeMenu } = useMenuPanel();
  const pathname = usePathname();
  const previousPathnameRef = useRef<string>(pathname);

  /**
   * Close menu when viewport transitions to navContent breakpoint.
   * Prevents "zombie" menu states where isOpen=true but overlay is hidden by CSS.
   */
  useEffect(() => {
    if (typeof window === "undefined" || !isMenuOpen) return;

    const mediaQuery = window.matchMedia(`(min-width: ${NAV_BREAKPOINT}px)`);

    const handleBreakpointChange = (event: MediaQueryListEvent): void => {
      if (event.matches) {
        closeMenu();
      }
    };

    if (mediaQuery.matches) {
      closeMenu();
    }

    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [isMenuOpen, closeMenu]);

  /**
   * Close menu when pathname changes (navigation occurred).
   * This handles the race condition where closeMenu() in onClick
   * doesn't complete before startTransition() triggers navigation.
   *
   * @see _bmad-output/implementation-artifacts/14-18-menu-auto-close-on-navigation.md
   */
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      if (isMenuOpen) {
        closeMenu();
      }
      previousPathnameRef.current = pathname;
    }
  }, [pathname, isMenuOpen, closeMenu]);

  const {
    data: navigationItems,
    isLoading: isLoadingNavigationItems,
    isError: isErrorNavigationItems,
  } = useNavigationItems();

  const {
    data: contactPoints,
    isLoading: isLoadingContactPoints,
    isError: isErrorContactPoints,
  } = useContactPoints();

  if (!isMenuOpen) return null;

  return (
    <Floating id="mobile-menu" title="Navigation Menu">
      <nav className="mobile-menu-overlay__nav" aria-label="Mobile navigation">
        {isLoadingNavigationItems && <NavigationItemButtonsSkeleton />}

        {isErrorNavigationItems && (
          <p className="text-sm text-red-500 p-2">
            Error loading navigation items.
          </p>
        )}

        {!isLoadingNavigationItems &&
          !isErrorNavigationItems &&
          navigationItems &&
          navigationItems.map(({ href, name }, idx) => (
            <NavigationItemLink
              key={idx}
              href={href}
              name={name}
              className="mobile-menu-overlay__link"
              onClick={closeMenu}
            />
          ))}
      </nav>

      <nav className="mobile-menu-overlay__socials" aria-label="Social links">
        {isLoadingContactPoints && <SocialNetworkLinksSkeleton />}

        {isErrorContactPoints && (
          <p className="text-sm text-red-500 p-2">
            Error loading social links.
          </p>
        )}

        {!isLoadingContactPoints &&
          !isErrorContactPoints &&
          contactPoints &&
          contactPoints
            .filter(
              ({ provider }) =>
                provider && MOBILE_MENU_SOCIAL_PROVIDERS.includes(provider)
            )
            .map(({ id, href, icon, provider }, idx) => (
              <SocialNetworkLink
                key={id || idx}
                href={href}
                iconName={icon ?? provider}
                iconClassName=""
                onClick={closeMenu}
              />
            ))}
      </nav>
    </Floating>
  );
};

export default MobileMenuOverlay;
