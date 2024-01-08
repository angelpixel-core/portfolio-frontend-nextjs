import { fetchFeatures, fetchSocials } from "@/data/_index";
import { ThemeButton } from "@/atoms/buttons/_index";
import { MenuLink, SocialLink } from "@/atoms/links/_index";

export const Menu = () => {
  const features = fetchFeatures();
  const socials = fetchSocials();

  return (
    <div className="menu_container">
      <nav className="nav-menu">
        {features.map(({ href, title }, index) => (
          <MenuLink
            key={index}
            href={href}
            title={title}
            className="nav-menu_option"
          />
        ))}
      </nav>

      <nav className="social-menu">
        {socials.map((social, index) => (
          <SocialLink
            key={index}
            href={social.href}
            className="social-menu_option sm:mx-1"
          >
            <social.icon />
          </SocialLink>
        ))}

        <ThemeButton />
      </nav>
    </div>
  );
};
