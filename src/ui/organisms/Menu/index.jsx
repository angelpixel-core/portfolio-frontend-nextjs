"use client";

import "./styles.css";

import { NavigationItemLink } from "@/links";
import { NavigationItemLinksSkeleton, SocialNetworkLinksSkeleton } from "./skeletons";

import { SocialNetworkLink } from "@/molecules";
import { useNavigationItems, useContactPoints } from "@/hooks";

import { ThemeButton } from "@/buttons";

import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

// NOTE: This organism is mock-first. It relies on domain hooks
// (useNavigationItems, useContactPoints) that internally decide whether
// to return mock data or call the real API, based on configuration.
// Contact points that should appear as social icons in the header menu.
// This explicit whitelist lets us separate "header socials" from other
// contact points like mail, location, scheduling, etc.
const HEADER_SOCIAL_PROVIDERS = [
  "github",
  "linkedin",
  "twitter",
  "dribbble",
  "telegram",
  "whatsapp",
];

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
        <nav className="menu-bar__primary-nav" aria-label="Primary navigation loading state">
          <NavigationItemLinksSkeleton />
        </nav>
        <nav className="menu-bar__social-links" aria-label="Social links loading state" />
        <nav className="menu-bar__social-login" aria-label="Social login loading state" />
        <ThemeButton />
      </div>
    );
  }

  // Handle error state
  if (isErrorNavigation || !navigationItems) {
    return (
      <div className="menu-bar">
        <nav className="menu-bar__primary-nav" aria-label="Primary navigation error state">
          <p>Error loading navigation</p>
        </nav>
        <nav className="menu-bar__social-links" aria-label="Social links" />
        <nav className="menu-bar__social-login" aria-label="Social login" />
        <ThemeButton />
      </div>
    );
  }

  return (
    <div className="menu-bar">
      <nav className="menu-bar__primary-nav" aria-label="Primary navigation">
        {navigationItems.map(({ href, name }, idx) => (
          <NavigationItemLink
            key={idx}
            href={href}
            name={name}
            className="menu-bar__link"
          />
        ))}
      </nav>

      <nav className="menu-bar__social-links" aria-label="Social links">
        {isLoadingContactPoints && <SocialNetworkLinksSkeleton />}

        {isErrorContactPoints && (
          <p className="text-sm text-red-500">Error loading social links</p>
        )}

        {!isLoadingContactPoints &&
          !isErrorContactPoints &&
          contactPoints &&
          contactPoints
            .filter(({ provider }) =>
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

      <nav className="menu-bar__social-login" aria-label="Social sign in options">
        <button
          // TODO: onClick={() => handleSocialLogin("LinkedIn")}
          type="button"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Sign in with LinkedIn"
        >
          <LinkedInIcon className="h-5 w-5" aria-hidden="true" focusable="false" />
          <span className="sr-only">Sign in with LinkedIn</span>
        </button>

        <button
          // TODO: onClick={() => handleSocialLogin("Microsoft")}
          type="button"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Sign in with Microsoft"
        >
          <MicrosoftIcon className="h-5 w-5" aria-hidden="true" focusable="false" />
          <span className="sr-only">Sign in with Microsoft</span>
        </button>

        <button
          // TODO: onClick={() => handleSocialLogin("Google")}
          type="button"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Sign in with Google"
        >
          <GooglePlusIcon className="h-5 w-5" aria-hidden="true" focusable="false" />
          <span className="sr-only">Sign in with Google</span>
        </button>
      </nav>

      <ThemeButton />
    </div>
  );
};

export default Menu;
