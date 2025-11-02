"use client";

import { Suspense } from "react";

import { NavigationItemLink } from "@/links";
import { useNavigationItems } from "@/domains/navigation-item/queries";
import { NavigationItemLinksSkeleton } from "@/organisms/Menu/skeletons";

import { SocialNetworkLink } from "@/molecules";
import { useContactPoints } from "@/domains/contact-point/queries";
import { SocialNetworkLinksSkeleton } from "@/organisms/Menu/skeletons";

import { MenuButton, ThemeButton } from "@/buttons";
import { useMenuPanel } from "@/state/slices";
import { Floating } from "@/overlays";

const MenuFloatingClient = () => {
  const { isOpen: isMenuOpen } = useMenuPanel();

  const {
    data: navigationItems,
    isLoading: isLoadingNavigationItems,
    isError: isErrorNavigationItems,
  } = useNavigationItems();

  const {
    data: contactPoints,
    isLoading: isLoadingContactcPoints,
    isError: isErrorContactcPoints,
  } = useContactPoints();

  if (!isMenuOpen) return <MenuButton />;

  return (
    <>
      <MenuButton />

      {isMenuOpen && (
        <Floating id="menu" className="hidden">
          <nav className="navigation-items_container--floating">
            <Suspense fallback={<NavigationItemLinksSkeleton />}>
              {isLoadingNavigationItems && <NavigationItemLinksSkeleton />}
              {isErrorNavigationItems && (
                <p className="text-red-500 text-sm p-2">
                  Error loading navigation items.
                </p>
              )}
              {navigationItems?.map(({ href, label }, idx) => (
                <NavigationItemLink
                  key={idx}
                  href={href}
                  name={label}
                  className="navigation-item_link"
                />
              ))}
            </Suspense>
          </nav>

          <nav className="contact-points_container--floating">
            <Suspense fallback={<ContactPointLinksSkeleton />}>
              {isLoadingContactcPoints && <ContactPointLinksSkeleton />}
              {isErrorContactcPoints && (
                <p className="text-red-500 text-sm p-2">
                  Error loading contact points.
                </p>
              )}
              {contactPoints?.map(({ href, name, styles }, idx) => (
                <ContactPointLink
                  key={idx}
                  href={href}
                  iconName={name}
                  iconClassName={styles}
                />
              ))}
            </Suspense>
          </nav>

          <div className="my-4">
            <ThemeButton />
          </div>
        </Floating>
      )}
    </>
  );
};

export default MenuFloatingClient;
