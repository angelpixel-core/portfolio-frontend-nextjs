import "./styles.css";

import { Suspense } from "react";
import { FeatureLinksSkeleton, SocialLinksSkeleton } from "./skeletons";
import { FeatureLinks, SocialLinks } from "@/molecules/_index";
import { ThemeButton } from "@/atoms/buttons/_index";

export function Menu() {
  return (
    <div className="layout_menu-container">
      <nav className="features_container">
        <Suspense fallback={<FeatureLinksSkeleton />}>
          <FeatureLinks />
        </Suspense>
      </nav>

      <nav className="socials_container">
        <Suspense fallback={<SocialLinksSkeleton />}>
          <SocialLinks />
        </Suspense>

        <ThemeButton />
      </nav>
    </div>
  );
}
