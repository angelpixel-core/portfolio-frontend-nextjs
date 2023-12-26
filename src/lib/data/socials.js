// import { sql } from "@vercel/postgres";

import TwitterIcon from "@/atoms/icons/twitter-icon";
import LinkedInIcon from "@/atoms/icons/linked-in-icon";
import GithubIcon from "@/atoms/icons/github-icon";
import DribbbleIcon from "@/atoms/icons/dribble-icon";
import PinterestIcon from "@/atoms/icons/pinterest-icon";

export function fetchSocials() {
  // noStore()
  try {
    // const socials = await sql`
    //   SELECT *
    //   FROM socials
    // `;
    //
    // return socials.rows;
    //
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
}
