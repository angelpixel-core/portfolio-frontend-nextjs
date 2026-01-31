/**
 * Profile Mock Data
 *
 * External URLs are built from environment variables using the pattern:
 * BASE_URL + IDENTIFIER (from NEXT_PUBLIC_{PROVIDER}_USERNAME)
 *
 * In production, this data comes from the backend API.
 *
 * @see .env.template for required variables
 * @see src/lib/social-urls for URL construction
 */
import { buildSocialUrl, getSocialUrl } from "@/lib/social-urls";

/**
 * Get hero click link URL based on configured provider
 * @returns {string} URL for hero image click destination
 */
const getHeroLinkUrl = () => {
  const provider = process.env.NEXT_PUBLIC_HERO_LINK_PROVIDER || "linkedin";
  return getSocialUrl(provider) || buildSocialUrl(provider, "username");
};

/**
 * Get "Hire Me" button URL based on configured provider
 * @returns {string} URL for hire me button destination
 */
const getHireMeUrl = () => {
  const provider = process.env.NEXT_PUBLIC_HIRE_ME_PROVIDER || "telegram";
  return getSocialUrl(provider) || buildSocialUrl(provider, "username");
};

const profilesMock = [
  {
    id: 1,
    // Identity
    nickname: "portfolio-owner",
    authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || "Author",
    biography: [
      "Hi, I'm a Full Stack Developer passionate about creating user-centric digital experiences.",
      "With expertise in modern web technologies, I build scalable applications that solve real-world problems.",
      "I'm constantly learning and adapting to new technologies to deliver the best solutions.",
    ],
    location: "Location",

    // Images
    avatar: process.env.NEXT_PUBLIC_HERO_IMAGE || "/images/profile/hero.png",
    logo: process.env.NEXT_PUBLIC_LOGO_IMAGE || "/images/logo.svg",

    // Contact
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com",

    // Social URLs (built from env identifiers)
    linkedin:
      getSocialUrl("linkedin") || buildSocialUrl("linkedin", "username"),
    github: getSocialUrl("github") || buildSocialUrl("github", "username"),
    twitter: getSocialUrl("twitter") || buildSocialUrl("twitter", "username"),
    dribbble:
      getSocialUrl("dribbble") || buildSocialUrl("dribbble", "username"),
    telegram:
      getSocialUrl("telegram") || buildSocialUrl("telegram", "username"),
    whatsapp:
      getSocialUrl("whatsapp") || buildSocialUrl("whatsapp", "5491100000000"),
    calendly:
      getSocialUrl("calendly") || buildSocialUrl("calendly", "username"),

    // Action URLs
    resume: process.env.NEXT_PUBLIC_RESUME_URL || "#",
    heroLink: getHeroLinkUrl(),
    hireMeLink: getHireMeUrl(),
  },
];

export default profilesMock;
