"use client";

import React from "react";
import "./styles.css";

import NavigationItemLink from "@/links/NavigationItemLink";
import {
  NavigationItemLinksSkeleton,
  SocialNetworkLinksSkeleton,
} from "./skeletons";

import Logo from "@/molecules/Logo";
import SocialNetworkLink from "@/molecules/SocialNetworkLink";
import HireMe from "@/molecules/HireMe";
import { useNavigationItems } from "@/domains/navigation-item/queries";
import { useContactPoints } from "@/domains/contact-point/queries";

import AuthButton from "@/buttons/AuthButton";
import ThemeButton from "@/buttons/ThemeButton";

import { HEADER_SOCIAL_PROVIDERS } from "./constants";

/**
 * Menu - Desktop header navigation following design doc order.
 *
 * ## Desktop Layout (per 03-header-navbar-rules_final-version.md):
 * | padding | logo | AIR | nav | AIR | socials | AIR | ui | AIR | hireMe |
 *
 * Order:
 * 1. Logo (left)
 * 2. Primary Nav (HOME, ABOUT, PROJECTS, ARTICLES)
 * 3. Social Links (relaxed toward center, not at edge)
 * 4. UI Settings (Auth + Theme)
 * 5. HireMe circular CTA
 *
 * Uses CSS Grid for proper AIR (breathing space) distribution.
 * The AIR ratio is 2:3 as specified in the design doc.
 *
 * Visibility: nav+ (≥841px) - hidden below nav breakpoint
 */

const Menu = (): React.JSX.Element => {
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
        <div className="menu-bar__logo" data-testid="header-brand-zone">
          <Logo />
        </div>
        <nav
          className="menu-bar__nav"
          aria-label="Primary navigation loading state"
          data-testid="header-nav-zone"
        >
          <NavigationItemLinksSkeleton />
        </nav>
        <nav
          className="menu-bar__social"
          aria-label="Social links loading state"
          data-testid="header-social-zone"
        >
          <SocialNetworkLinksSkeleton />
        </nav>
        <div className="menu-bar__ui" data-testid="header-ui-zone">
          <AuthButton />
          <ThemeButton />
        </div>
        <div className="menu-bar__cta" data-testid="header-cta-zone">
          <HireMe />
        </div>
      </div>
    );
  }

  // Handle error state
  if (isErrorNavigation || !navigationItems) {
    return (
      <div className="menu-bar">
        <div className="menu-bar__logo" data-testid="header-brand-zone">
          <Logo />
        </div>
        <nav
          className="menu-bar__nav"
          aria-label="Primary navigation error state"
          data-testid="header-nav-zone"
        >
          <p>Error loading navigation</p>
        </nav>
        <nav
          className="menu-bar__social"
          aria-label="Social links"
          data-testid="header-social-zone"
        />
        <div className="menu-bar__ui" data-testid="header-ui-zone">
          <AuthButton />
          <ThemeButton />
        </div>
        <div className="menu-bar__cta" data-testid="header-cta-zone">
          <HireMe />
        </div>
      </div>
    );
  }

  return (
    <div className="menu-bar">
      {/* Zone 1: Logo (leftmost) */}
      <div className="menu-bar__logo" data-testid="header-brand-zone">
        <Logo />
      </div>

      {/* Zone 2: Primary Navigation */}
      <nav
        className="menu-bar__nav"
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

      {/* Zone 3: Social Links (relaxed toward center per doc) */}
      <nav
        className="menu-bar__social"
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

      {/* Zone 4: UI Settings (Auth + Theme) */}
      <div className="menu-bar__ui" data-testid="header-ui-zone">
        <AuthButton />
        <ThemeButton />
      </div>

      {/* Zone 5: HireMe circular CTA (rightmost) */}
      <div className="menu-bar__cta" data-testid="header-cta-zone">
        <HireMe />
      </div>
    </div>
  );
};

export default Menu;
