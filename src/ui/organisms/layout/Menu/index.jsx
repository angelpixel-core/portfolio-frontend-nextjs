import "./styles.css";

import { MenuLink, SocialLink } from "@/atoms/links/_index";
import { ThemeButton } from "@/atoms/buttons/_index";

import { fetchFeatures, fetchSocials } from "@/lib/data/_index";

// Static Query
export const Menu = async () => {
  const features = await fetchFeatures();
  const socials = await fetchSocials();

  const featureLinks = await features.map(({ href, name }, index) => (
    <MenuLink key={index} href={href} title={name} className="menu_option" />
  ));
  const socialLinks = await socials.map((item, index) => (
    <SocialLink
      key={index}
      href={item.href}
      iconName={item.name}
      className="social-menu_option sm:mx-1"
      iconClassName={`${item.styles} w-8 h-8`}
    />
  ));

  const FeatureLinks = () => {
    return <>{featureLinks}</>;
  };
  const SocialLinks = () => {
    return <>{socialLinks}</>;
  };

  return (
    <div className="layout_menu-container">
      <nav className="menu">
        <FeatureLinks />
      </nav>

      <nav className="social-menu">
        <SocialLinks />

        <ThemeButton />
      </nav>
    </div>
  );
};
