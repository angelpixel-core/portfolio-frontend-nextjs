"use client";

import "./styles.css";

import { Suspense } from "react";

import { NavigationItemLink } from "@/links";
import { useNavigationItems } from "@/domains/navigation-item/queries";
import { NavigationItemLinksSkeleton } from "./skeletons";

// import { SocialNetworkLink } from "@/molecules";
// import { useContactPoints } from "@/domains/contact-point/queries";
// import { SocialNetworkLinksSkeleton } from "@/organisms/Menu/skeletons";

import { ThemeButton } from "@/buttons";

import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

const Menu = () => {
  const {
    data: navigationItems,
    isLoading: isLoadingNavigation,
    isError: isErrorNavigation,
  } = useNavigationItems();

  // const {
  //   data: socials,
  //   isLoading: isLoadingSocials,
  //   isError: isErrorSocials,
  // } = useContactPoints();

  return (
    <div className="layout_menu-container">
      <nav className="navigation-items_container">
        NavigationItemLinksSkeleton
        <Suspense fallback={<NavigationItemLinksSkeleton />}>
          {navigationItems.map(({ href, name }, idx) => (
            <NavigationItemLink
              key={idx}
              href={href}
              name={name}
              className="navigation-item_link"
            />
          ))}
        </Suspense>
      </nav>

      <nav className="socials_container">
        SocialNetworkLinksSkeleton
        {/* <Suspense fallback={<SocialNetworkLinksSkeleton />}> */}
        {/*   {socials.map(({ href, name, styles }, idx) => ( */}
        {/*     <SocialNetworkLink */}
        {/*       key={idx} */}
        {/*       href={href} */}
        {/*       iconName={name} */}
        {/*       iconClassName={styles} */}
        {/*     /> */}
        {/*   ))} */}
        {/* </Suspense> */}
      </nav>

      <nav className="social-login-buttons">
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
      </nav>

      <ThemeButton />
    </div>
  );
};

export default Menu;
