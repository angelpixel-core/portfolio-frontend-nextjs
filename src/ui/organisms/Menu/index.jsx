"use client";

import "./styles.css";

import { NavigationItemLink } from "@/links";
import {
  NavigationItemLinksSkeleton,
  SocialNetworkLinksSkeleton,
} from "./skeletons";

import { SocialNetworkLink } from "@/molecules";
import { useNavigationItems, useContactPoints } from "@/hooks";

import { ThemeButton } from "@/buttons";

import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

import { HEADER_SOCIAL_PROVIDERS } from "./constants";

/**
 * Menu - Desktop header navigation containing multiple zones.
 *
 * ## Zones in this component (Epic 11)
 *
 * | Zone         | CSS Class              | data-testid         | Visibility    |
 * |--------------|------------------------|---------------------|---------------|
 * | Primary Nav  | .menu-bar__primary-nav | header-nav-zone     | desktop+      |
 * | Social       | .menu-bar__social-links| header-social-zone  | wide only     |
 * | Auth         | .menu-bar__social-login| header-auth-zone    | wide only     |
 * | UI Controls  | .menu-bar__ui-controls | header-ui-zone      | tablet+       |
 *
 * NOTE: This organism is mock-first. It relies on domain hooks
 * (useNavigationItems, useContactPoints) that internally decide whether
 * to return mock data or call the real API, based on configuration.
 *
 * @see docs/layout-system.md for breakpoint definitions and visibility matrix
 */

const Menu = () => {
  const {
    data: navigationItems,
    isLoading: isLoadingNavigation,
    isError: isErrorNavigation,
  } = useNavigationItems();

  const {
    data: contactPoints,
    isLoading: isLoadingContactPoints,
    isError: isErrorContactPoints,
  } = useContactPoints();

  // Handle loading state
  if (isLoadingNavigation) {
    return (
      <div className="menu-bar">
        <nav
          className="menu-bar__primary-nav"
          aria-label="Primary navigation loading state"
          data-testid="header-nav-zone"
        >
          <NavigationItemLinksSkeleton />
        </nav>
        <nav
          className="menu-bar__social-links"
          aria-label="Social links loading state"
          data-testid="header-social-zone"
        />
        <nav
          className="menu-bar__social-login"
          aria-label="Social login loading state"
          data-testid="header-auth-zone"
        />
        <div className="menu-bar__ui-controls" data-testid="header-ui-zone">
          <ThemeButton />
        </div>
      </div>
    );
  }

  // Handle error state
  if (isErrorNavigation || !navigationItems) {
    return (
      <div className="menu-bar">
        <nav
          className="menu-bar__primary-nav"
          aria-label="Primary navigation error state"
          data-testid="header-nav-zone"
        >
          <p>Error loading navigation</p>
        </nav>
        <nav
          className="menu-bar__social-links"
          aria-label="Social links"
          data-testid="header-social-zone"
        />
        <nav
          className="menu-bar__social-login"
          aria-label="Social login"
          data-testid="header-auth-zone"
        />
        <div className="menu-bar__ui-controls" data-testid="header-ui-zone">
          <ThemeButton />
        </div>
      </div>
    );
  }

  return (
    <div className="menu-bar">
      {/* Zone: Primary Navigation */}
      <nav
        className="menu-bar__primary-nav"
        aria-label="Primary navigation"
        data-testid="header-nav-zone"
      >
        {navigationItems.map(({ href, name }, idx) => (
          <NavigationItemLink
            key={idx}
            href={href}
            name={name}
            className="menu-bar__link"
          />
        ))}
      </nav>

      {/* Zone: Social/Contact Links */}
      <nav
        className="menu-bar__social-links"
        aria-label="Social links"
        data-testid="header-social-zone"
      >
        {isLoadingContactPoints && <SocialNetworkLinksSkeleton />}

        {isErrorContactPoints && (
          <p className="text-sm text-red-500">Error loading social links</p>
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
              />
            ))}
      </nav>

      {/* Zone: Auth Actions */}
      <nav
        className="menu-bar__social-login"
        aria-label="Social sign in options"
        data-testid="header-auth-zone"
      >
        <button
          // TODO: onClick={() => handleSocialLogin("LinkedIn")}
          type="button"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Sign in with LinkedIn"
        >
          <LinkedInIcon
            className="h-5 w-5"
            aria-hidden="true"
            focusable="false"
          />
          <span className="sr-only">Sign in with LinkedIn</span>
        </button>

        <button
          // TODO: onClick={() => handleSocialLogin("Microsoft")}
          type="button"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Sign in with Microsoft"
        >
          <MicrosoftIcon
            className="h-5 w-5"
            aria-hidden="true"
            focusable="false"
          />
          <span className="sr-only">Sign in with Microsoft</span>
        </button>

        <button
          // TODO: onClick={() => handleSocialLogin("Google")}
          type="button"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Sign in with Google"
        >
          <GooglePlusIcon
            className="h-5 w-5"
            aria-hidden="true"
            focusable="false"
          />
          <span className="sr-only">Sign in with Google</span>
        </button>
      </nav>

      {/* Zone: UI Controls */}
      <div className="menu-bar__ui-controls" data-testid="header-ui-zone">
        <ThemeButton />
      </div>
    </div>
  );
};

export default Menu;
