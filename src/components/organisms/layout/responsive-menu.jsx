import { motion } from "framer-motion";

import ActiveMobileLink from "@/atoms/links/active-mobile-link";
import SocialNetworkLink from "@/atoms/links/social-network-link";
import ThemeSwitcherButton from "@/atoms/buttons/theme-switcher-button";

export default function ResponsiveMenu({ socials, features, handleClick }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
      animate={{ scale: 1, opacity: 1 }}
      className="
        hidden
        fixed
        flex flex-col lg:flex
        items-center justify-between
        min-w-[70vw]
        py-32
        top-1/2
        left-1/2
        z-30
        -translate-x-1/2
        -translate-y-1/2
        bg-dark/90 dark:bg-light/75
        rounded-lg
        backdrop-blur-md
      "
    >
      <nav
        className="
          flex flex-col
          items-center justify-center
          gap-1
          my-2
          text-light dark:text-dark
        "
      >
        {features.map(({ href, title }, index) => (
          <ActiveMobileLink
            key={index}
            href={href}
            title={title}
            toggle={handleClick}
            className="my-2"
          />
        ))}
      </nav>

      <nav
        className="
          flex
          flex-wrap
          items-center justify-center
        "
      >
        {socials.map((social, index) => (
          <SocialNetworkLink
            key={index}
            href={social.href}
            className={`w-6 mr-3 ${social.className}`}
          >
            <social.icon className={social.iconClassName} />
          </SocialNetworkLink>
        ))}

        <ThemeSwitcherButton />
      </nav>
    </motion.div>
  );
}
