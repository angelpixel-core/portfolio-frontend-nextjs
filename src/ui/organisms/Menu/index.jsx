import "./styles.css";
// TODO: continuar aqui

import { Suspense } from "react";

import {
  FeatureLinksSkeleton, // FeatureButtonsSkeleton,
  SocialLinksSkeleton,
} from "@/organisms/Menu/skeletons";

import { Feature, SocialNetwork } from "@/models";
import { FeatureLink } from "@/links";
import { SocialLink } from "@/molecules";
import { ThemeButton } from "@/buttons";
import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

const Menu = async () => {
  // const handleSocialLogin = (provider) => {
  //   console.log(`Attempting login with ${provider}`);
  //   Actual login logic will be implemented later
  // };

  const features = await Feature.fetchAll();
  const socials = await SocialNetwork.fetchAll();

  return (
    <div className="layout_menu-container">
      <nav className="features_container">
        {/* <Suspense fallback={<FeatureButtonsSkeleton />}> */}
        <Suspense fallback={<FeatureLinksSkeleton />}>
          {features.map(({ href, label: name }, idx) => (
            <FeatureLink
              key={idx}
              href={href}
              name={name}
              className="feature_link"
            />
          ))}
        </Suspense>
      </nav>

      <nav className="socials_container">
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

        <button
          // onClick={() => handleSocialLogin("LinkedIn")}
          title="Login with LinkedIn"
          className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Login with LinkedIn"
        >
          <LinkedInIcon className="h-5 w-5" />
        </button>
        <button
          // onClick={() => handleSocialLogin("Microsoft")}
          title="Login with Microsoft"
          className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Login with Microsoft"
        >
          <MicrosoftIcon className="h-5 w-5" />
        </button>
        <button
          // onClick={() => handleSocialLogin("Google")}
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
};

export default Menu;
