"use client";

import { NavigationItemLink } from "@/links";
import { SocialNetworkLink } from "@/molecules";
import { useNavigationItems, useContactPoints } from "@/hooks";
import { NavigationItemButtonsSkeleton } from "@/organisms/MenuFloating/skeletons";
import { SocialNetworkLinksSkeleton } from "@/organisms/Menu/skeletons";

import { MenuButton, ThemeButton } from "@/buttons";
import { useMenuPanel } from "@/state/slices";
import { Floating } from "@/overlays";

// NOTE: This floating menu mirrors the desktop header menu for
// small screens. It uses the same domain hooks (mock-first) to render
// navigation items and curated header social contact points.
// Same semantic set of header social providers as in the desktop menu.
const HEADER_SOCIAL_PROVIDERS = [
  "github",
  "linkedin",
  "twitter",
  "dribbble",
  "telegram",
  "whatsapp",
];

const MenuFloatingClient = () => {
  const { isOpen: isMenuOpen } = useMenuPanel();

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

      {isMenuOpen && (
        <Floating id="menu" title="Navigation Menu">
          <nav className="menu-floating__nav" aria-label="Floating navigation">
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
    </>
  );
};

export default MenuFloatingClient;
