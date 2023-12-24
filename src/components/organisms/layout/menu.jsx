import ActiveLink from "@/atoms/links/active-link";
import SocialNetworkLink from "@/atoms/links/social-network-link";
import ThemeSwitcherButton from "@/atoms/buttons/theme-switcher-button";

export default function Menu({ menuPaths, socialNetworkLinks }) {
  return (
    <div
      className="
        flex
        justify-between
        items-center
        lg:hidden
        w-full
      "
    >
      <nav>
        {menuPaths.map(({ href, title }, index) => (
          <ActiveLink key={index} href={href} title={title} className="mr-4" />
        ))}
      </nav>

      <nav className="flex items-center justify-center flex-wrap">
        {socialNetworkLinks.map((social, index) => (
          <SocialNetworkLink
            key={index}
            href={social.href}
            className="w-6 mr-3 sm:mx-1"
          >
            <social.icon />
          </SocialNetworkLink>
        ))}

        <ThemeSwitcherButton />
      </nav>
    </div>
  );
}
