import "./styles.css";

import { fetchFeatures, fetchSocials } from "@/data/_index";

import { ThemeButton } from "@/atoms/buttons/_index";
import { MenuLinkResponsive, SocialLink } from "@/atoms/links/_index";
import { MotionDiv } from "@/hoc/_index";

export const MenuResponsive = () => {
  const features = fetchFeatures();
  const socials = fetchSocials();

  return (
    <MotionDiv>
      <nav className="nav-menu--responsive">
        {features.map(({ href, title }, index) => (
          <MenuLinkResponsive
            key={index}
            href={href}
            title={title}
            className="nav-menu_option--responsive"
          />
        ))}
      </nav>

      <nav className="social-menu">
        {socials.map((social, index) => (
          <SocialLink
            key={index}
            href={social.href}
            className={`social-menu_option ${social.className}`}
          >
            <social.icon className={social.iconClassName} />
          </SocialLink>
        ))}

        <ThemeButton />
      </nav>
    </MotionDiv>
  );
};
