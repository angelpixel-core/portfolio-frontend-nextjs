
import "./styles.css";
import { Suspense } from "react";

import {
  FeatureLinksSkeleton,
  SocialNetworkLinksSkeleton,
} from "@/organisms/Menu/skeletons";

import { useFeatures, useSocialNetworks } from "@/hooks";

import { FeatureLink } from "@/links";
import { SocialNetworkLink } from "@/molecules";
import { ThemeButton } from "@/buttons";

import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";




const SocialNetworksAuthButtons = () => {
  return (
    <>
      <button
        // TODO: onClick={() => handleSocialLogin("LinkedIn")}
        title="Login with LinkedIn"
        className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Login with LinkedIn"
      >
        <LinkedInIcon className="h-5 w-5" />
      </button>

      <button
        // TODO: onClick={() => handleSocialLogin("Microsoft")}
        title="Login with Microsoft"
        className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Login with Microsoft"
      >
        <MicrosoftIcon className="h-5 w-5" />
      </button>

      <button
        // TODO: onClick={() => handleSocialLogin("Google")}
        title="Login with Google"
        className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Login with Google"
      >
        <GooglePlusIcon className="h-5 w-5" />
      </button>
    </>
  );
};

const Menu = () => {
  return (
    <div className="layout_menu-container">
      <nav className="features_container">
        <Suspense fallback={<FeatureLinksSkeleton />}>
          <Features />
        </Suspense>
      </nav>

      <nav className="socials_container">
        <Suspense fallback={<SocialNetworkLinksSkeleton />}>
          <SocialNetworks />
        </Suspense>
      </nav>

      <nav className="social-login-buttons">
        <SocialNetworksAuthButtons />
      </nav>

      <ThemeButton />
    </div>
  );
};

export default Menu;
