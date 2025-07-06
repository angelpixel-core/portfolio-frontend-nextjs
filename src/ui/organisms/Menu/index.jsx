// TODO: continuar aqui
import "./styles.css";

// import { Suspense } from "react";

// import { FeatureLinksSkeleton, SocialLinksSkeleton } from "./skeletons";
// import { Feature, Social } from "@/models";
// import { FeatureLink, SocialLink } from "@/links";
// import { ThemeButton } from "@/buttons";
// import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

const Menu = async () => {
  // Function to handle login (placeholder)
  // const handleSocialLogin = (provider) => {
  //   console.log(`Attempting login with ${provider}`);
  //   Actual login logic will be implemented later
  // };

  // const features = await Feature.all();
  // const socials = await Social.all();

  return (
    <div className="layout_menu-container">
      MENU
      {/* <nav className="features_container"> */}
      {/*   <Suspense fallback={<FeatureLinksSkeleton />}> */}
      {/*     {features.map(({ href, label: name }, idx) => ( */}
      {/*       <FeatureLink */}
      {/*         key={idx} */}
      {/*         href={href} */}
      {/*         name={name} */}
      {/*         className="feature_link" */}
      {/*       /> */}
      {/*     ))} */}
      {/*   </Suspense> */}
      {/* </nav> */}
      {/**/}
      {/* <nav className="socials_container"> */}
      {/*   <Suspense fallback={<SocialLinksSkeleton />}> */}
      {/*     {socials.map(({ href, name, styles }, idx) => ( */}
      {/*       <SocialLink */}
      {/*         key={idx} */}
      {/*         href={href} */}
      {/*         iconName={name} */}
      {/*         iconClassName={styles} */}
      {/*       /> */}
      {/*     ))} */}
      {/*   </Suspense> */}
      {/**/}
      {/*   {/* Social Login Buttons */}
      {/*   <button */}
      {/*     // onClick={() => handleSocialLogin("LinkedIn")} */}
      {/*     title="Login with LinkedIn" */}
      {/*     className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" */}
      {/*     aria-label="Login with LinkedIn" */}
      {/*   > */}
      {/*     <LinkedInIcon className="h-5 w-5" /> */}
      {/*   </button> */}
      {/*   <button */}
      {/*     // onClick={() => handleSocialLogin("Microsoft")} */}
      {/*     title="Login with Microsoft" */}
      {/*     className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" */}
      {/*     aria-label="Login with Microsoft" */}
      {/*   > */}
      {/*     <MicrosoftIcon className="h-5 w-5" /> */}
      {/*   </button> */}
      {/*   <button */}
      {/*     // onClick={() => handleSocialLogin("Google")} */}
      {/*     title="Login with Google" */}
      {/*     className="social-login-button p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" */}
      {/*     aria-label="Login with Google" */}
      {/*   > */}
      {/*     <GooglePlusIcon className="h-5 w-5" /> */}
      {/*   </button> */}
      {/**/}
      {/*   <ThemeButton /> */}
      {/* </nav> */}
    </div>
  );
};

export default Menu;
