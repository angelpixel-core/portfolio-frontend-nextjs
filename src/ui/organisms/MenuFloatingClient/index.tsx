"use client";

import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import NavigationItemLink from "@/links/NavigationItemLink";
import SocialNetworkLink from "@/molecules/SocialNetworkLink";
import { useNavigationItems } from "@/domains/navigation-item/queries";
import { useContactPoints } from "@/domains/contact-point/queries";
import { NavigationItemButtonsSkeleton } from "@/organisms/MenuFloating/skeletons";
import { SocialNetworkLinksSkeleton } from "@/organisms/Menu/skeletons";

import MenuButton from "@/buttons/MenuButton";
import ThemeButton from "@/buttons/ThemeButton";
import useMenuPanel from "@/state/slices/menuPanel/hooks";
import Floating from "@/overlays/Floating";
import { HEADER_SOCIAL_PROVIDERS } from "@/organisms/Menu/constants";

/**
 * Nav breakpoint where floating menu is hidden and desktop nav appears.
 *
 * ⚠️ IMPORTANT: This value MUST match tailwind.config.js `navContent:` breakpoint.
 * If you change the navContent breakpoint in Tailwind, update this constant too.
 *
 * Story 12.1: Changed from desktop (1025px) to nav (841px).
 * @see tailwind.config.js - screens.nav
 * @see docs/layout-system.md for breakpoint definitions
 */
const NAV_BREAKPOINT = 880;

/**
 * MenuFloatingClient - Client-side burger menu with floating overlay.
 *
 * ## Zones within floating overlay (Epic 11)
 *
 * When opened, the floating menu contains:
 * - Primary Nav: NavigationItemLink[] (same as desktop Menu)
 * - Social/Contact: SocialNetworkLink[] (same as desktop Menu)
 * - UI Controls: ThemeButton
 *
 * ## Breakpoint Reset Behavior (Story 11.3, updated Story 12.1)
 *
 * When the viewport crosses to navContent breakpoint (≥880px), the menu state is
 * automatically reset to prevent "zombie" states where:
 * - The menu button shows ❌ (close) but no menu is visible
 * - The overlay remains in state but is hidden by CSS
 *
 * ## Auto-Close on Navigation (Story 12.5, FR8)
 *
 * All navigation and social links in the floating menu receive the closeMenu
 * callback. When clicked, the menu closes automatically before navigation.
 * This provides smooth UX per FR8: "Al navegar, el menú se cierra automáticamente"
 *
 * NOTE: This floating menu mirrors the desktop header menu for
 * small screens. It uses the same domain hooks (mock-first) to render
 * navigation items and curated header social contact points.
 *
 * @see docs/layout-system.md for breakpoint definitions and visibility matrix
 */

const MenuFloatingClient = (): React.JSX.Element => {
  const { isOpen: isMenuOpen, closeMenuPanel: closeMenu } = useMenuPanel();

  /**
   * Close menu when viewport transitions to navContent breakpoint.
   * This prevents "zombie" menu states where isOpen=true but the
   * floating menu container is hidden by CSS (navContent:hidden).
   * Story 12.1: Changed from desktop (1025px) to nav; now tied to navContent.
   */
  useEffect(() => {
    // Skip if not in browser or menu is already closed
    if (typeof window === "undefined" || !isMenuOpen) return;

    const mediaQuery = window.matchMedia(`(min-width: ${NAV_BREAKPOINT}px)`);

    const handleBreakpointChange = (event: MediaQueryListEvent): void => {
      if (event.matches) {
        // Viewport crossed to navContent breakpoint (≥880px) - close the menu
        closeMenu();
      }
    };

    // Check on mount in case we're already at desktop
    if (mediaQuery.matches) {
      closeMenu();
    }

    // Listen for viewport changes
    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [isMenuOpen, closeMenu]);

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

  if (!isMenuOpen) return <MenuButton />;

  return (
    <>
      <MenuButton />

      <AnimatePresence>
        {isMenuOpen && (
          <Floating id="menu" title="Navigation Menu">
            <nav
              className="menu-floating__nav"
              aria-label="Floating navigation"
            >
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
                    className="menu-floating__link"
                    onClick={closeMenu}
                  />
                ))}
            </nav>

            <nav
              className="menu-floating__contact-points"
              aria-label="Floating contact points"
            >
              {isLoadingContactPoints && <SocialNetworkLinksSkeleton />}

              {isErrorContactPoints && (
                <p className="text-sm text-red-500 p-2">
                  Error loading contact points.
                </p>
              )}

              {!isLoadingContactPoints &&
                !isErrorContactPoints &&
                contactPoints &&
                contactPoints
                  .filter(
                    ({ provider }) =>
                      provider && HEADER_SOCIAL_PROVIDERS.includes(provider)
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

            <div className="my-4 flex items-center justify-center gap-2">
              {/* Social login actions could be added here in the future, ensure they have proper labels */}
              {/* Example: <button type="button" aria-label="Sign in with Google">...</button> */}
              <ThemeButton />
            </div>
          </Floating>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuFloatingClient;
