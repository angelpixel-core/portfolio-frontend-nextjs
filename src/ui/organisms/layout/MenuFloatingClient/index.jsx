"use client";

import { useSelector } from "react-redux";

import { Suspense } from "react";
import { FeatureLink } from "@/atoms/links";

import { SocialLink } from "@/atoms/links";
import { Floating } from "@/atoms/hocs";

import { MenuButton, ThemeButton } from "@/atoms/buttons";

import {
  FeatureButtonsSkeleton,
  SocialLinksSkeleton,
} from "@/organisms/layout/MenuFloating/skeletons";

export function MenuFloatingClient({ features, socials }) {
  const { isMenuOpen } = useSelector((state) => state.menu);

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
}
