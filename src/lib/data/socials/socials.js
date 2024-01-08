import {
  TwitterIcon,
  LinkedInIcon,
  GithubIcon,
  DribbbleIcon,
  PinterestIcon,
} from "@/atoms/icons/_index";

export const fetchSocials = () => {
  try {
    const socials = [
      { href: "https://twitter.com", icon: TwitterIcon },
      { href: "https://linkedin.com", icon: LinkedInIcon },
      {
        href: "https://github.com",
        icon: GithubIcon,
        iconClassName: "bg-light dark:bg-dark rounded-full",
      },
      { href: "https://dribbble.com", icon: DribbbleIcon },
      {
        href: "https://pinterest.com",
        icon: PinterestIcon,
        className: "bg-light",
      },
    ];

    return socials;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch socials.");
  }
};
