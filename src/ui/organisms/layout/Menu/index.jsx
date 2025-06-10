import "./styles.css";

import { Suspense } from "react";
import { FeatureLinksSkeleton, SocialLinksSkeleton } from "./skeletons";
import { FeatureLinks, SocialLinks } from "@/molecules/_index";
import { ThemeButton } from "@/atoms/buttons/_index";
import {
  LinkedInIcon,
  MicrosoftIcon,
  GooglePlusIcon,
} from "@/ui/atoms/icons/_index";

export function Menu() {
  // Function to handle login (placeholder)
  const handleSocialLogin = (provider) => {
    console.log(`Attempting login with ${provider}`);
    // Actual login logic will be implemented later
  };

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

        {/* Social Login Buttons */}
        <button
          onClick={() => handleSocialLogin("LinkedIn")}
          title="Login with LinkedIn"
          className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Login with LinkedIn"
        >
          <LinkedInIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleSocialLogin("Microsoft")}
          title="Login with Microsoft"
          className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Login with Microsoft"
        >
          <MicrosoftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleSocialLogin("Google")}
          title="Login with Google"
          className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Login with Google"
        >
          <GooglePlusIcon className="h-5 w-5" />
        </button>

        <ThemeButton />
      </nav>
    </div>
  );
}
