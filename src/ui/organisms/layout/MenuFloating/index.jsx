"use client";

import "./styles.css";

import { useSelector } from "react-redux";

import { MenuButton, ThemeButton } from "@/atoms/buttons/_index";
import { Floating } from "@/atoms/hocs/_index";
import { Suspense } from "react";
import { FeatureButtonsSkeleton, SocialLinksSkeleton } from "./skeletons";
import { FeatureButtons, SocialLinks } from "@/molecules/_index";

export function MenuFloating() {
  const { isMenuOpen } = useSelector((state) => state.menu);

  return (
    <>
      <MenuButton />

      {isMenuOpen ? (
        <Floating id="menu" className="hidden">
          <nav className="features_container--floating">
            <Suspense callbacks={<FeatureButtonsSkeleton />}>
              <FeatureButtons />
            </Suspense>
          </nav>

          <nav className="socials_container--floating">
            <Suspense callbacks={<SocialLinksSkeleton />}>
              <SocialLinks />
            </Suspense>
          </nav>

          <div className="my-4">
            <ThemeButton />
          </div>
        </Floating>
      ) : null}
    </>
  );
}
