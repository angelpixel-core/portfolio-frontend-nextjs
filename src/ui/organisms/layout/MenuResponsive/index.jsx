import "./styles.css";

import { fetchFeatures, fetchSocials } from "@/lib/data/_index";

import { ThemeButton } from "@/atoms/buttons/_index";
import { MenuLinkResponsive, SocialLink } from "@/atoms/links/_index";
import { MotionDiv } from "@/hoc/_index";

export const MenuResponsive = async () => {
  const features = await fetchFeatures();
  const socials = await fetchSocials();

  const featureLinks = await features.map(({ href, name }, index) => (
    <MenuLinkResponsive
      key={index}
      href={href}
      title={name}
      className="nav-menu_option--responsive"
    />
  ));
  const socialLinks = await socials.map((item, index) => (
    <SocialLink
      key={index}
      href={item.href}
      className={`social-menu_option ${item.className}`}
      iconName={item.name}
      iconClassName={item.responsiveStyles}
    />
  ));

  const FeatureLinks = () => {
    return <>{featureLinks}</>;
  };
  const SocialLinks = () => {
    return <>{socialLinks}</>;
  };

  return (
    <MotionDiv>
      <nav className="nav-menu--responsive">
        <FeatureLinks />
      </nav>

      <nav className="social-menu">
        <SocialLinks />

        <ThemeButton />
      </nav>
    </MotionDiv>
  );
};
