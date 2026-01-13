"use client";

import "./styles.css";

import { NavigationItemLink } from "@/links";
import { useNavigationItems } from "@/domains/navigation-item/queries";
import { NavigationItemLinksSkeleton, SocialNetworkLinksSkeleton } from "./skeletons";

import { SocialNetworkLink } from "@/molecules";
import { useContactPoints } from "@/domains/contact-point/queries";

import { ThemeButton } from "@/buttons";

import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

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
            .filter(({ type }) => type === "social")
            .map(({ id, href, icon, provider }, idx) => (
              <SocialNetworkLink
                key={id || idx}
                href={href}
                iconName={icon ?? provider}
                iconClassName=""
              />
            ))}
      </nav>

      <nav className="menu-bar__social-login" aria-label="Social login">
        <button
          // TODO: onClick={() => handleSocialLogin("LinkedIn")}
          title="Login with LinkedIn"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Login with LinkedIn"
        >
          <LinkedInIcon className="h-5 w-5" />
        </button>

        <button
          // TODO: onClick={() => handleSocialLogin("Microsoft")}
          title="Login with Microsoft"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Login with Microsoft"
        >
          <MicrosoftIcon className="h-5 w-5" />
        </button>

        <button
          // TODO: onClick={() => handleSocialLogin("Google")}
          title="Login with Google"
          className="menu-bar__social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Login with Google"
        >
          <GooglePlusIcon className="h-5 w-5" />
        </button>
      </nav>

      <ThemeButton />
    </div>
  );
};

export default Menu;
