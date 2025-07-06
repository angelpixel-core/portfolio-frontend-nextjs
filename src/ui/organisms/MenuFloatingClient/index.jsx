"use client";

import { Suspense } from "react";
import { Floating } from "@/atoms/hocs";

import { MenuButton, ThemeButton } from "@/atoms/buttons";
import { FeatureLink, SocialLink } from "@/atoms/links";

import { useMenuPanel } from "@/state/slices/menuPanel";

import {
  FeatureButtonsSkeleton,
  SocialLinksSkeleton,
} from "@/organisms/MenuFloating/skeletons";

const MenuFloatingClient = ({ features, socials }) => {
  // const { isMenuOpen } = useSelector((state) => state.menu);
  // TODO: continaur con la integracio del state
  // const { isOpen: isMenuOpen, close: closeMenu } = useMenuPanel();
  const { isOpen: isMenuOpen } = useMenuPanel();

  return (
    <>
      <MenuButton />
      {isMenuOpen && (
        <Floating id="menu" className="hidden">
          <nav className="features_container--floating">
            <Suspense fallback={<FeatureButtonsSkeleton />}>
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
            <Suspense fallback={<SocialLinksSkeleton />}>
              {socials.map(({ href, name, styles }, idx) => (
                <SocialLink
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
