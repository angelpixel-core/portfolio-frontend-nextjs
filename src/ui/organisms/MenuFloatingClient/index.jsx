"use client";

import { Suspense } from "react";
import { Floating } from "@/overlays";

import { MenuButton, ThemeButton } from "@/buttons";
import { FeatureLink } from "@/links";
import { SocialNetworkLink } from "@/molecules";

import { useMenuPanel } from "@/state/slices/menuPanel";

import {
  FeatureLinksSkeleton,
  SocialNetworkLinksSkeleton,
} from "@/organisms/Menu/skeletons";

const MenuFloatingClient = ({ features, socials }) => {
  // TODO: const { isOpen: isMenuOpen, close: closeMenu } = useMenuPanel();
  const { isOpen: isMenuOpen } = useMenuPanel();

  return (
    <>
      <MenuButton />
      {isMenuOpen && (
        <Floating id="menu" className="hidden">
          <nav className="features_container--floating">
            <Suspense fallback={<FeatureLinksSkeleton />}>
              {features.map(({ href, label }, idx) => (
                <FeatureLink
                  key={idx}
                  href={href}
                  name={label}
                  className="feature_link"
                />
              ))}
            </Suspense>
          </nav>

          <nav className="socials_container--floating">
            <Suspense fallback={<SocialNetworkLinksSkeleton />}>
              {socials.map(({ href, name, styles }, idx) => (
                <SocialNetworkLink
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
