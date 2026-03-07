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
import type { ProfilesModel } from "./schema";

/**
 * Convert null to undefined for optional schema fields
 */
const nullToUndefined = (value: string | null): string | undefined =>
  value ?? undefined;

/**
 * Ensure URL has a protocol (https:// by default)
 * Fixes common mistake of omitting protocol in env vars
 */
const ensureProtocol = (url: string | undefined): string | undefined => {
  if (!url || url === "#") return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const DEFAULT_BIOGRAPHY = [
  "Hi, I'm a Full Stack Developer passionate about creating user-centric digital experiences.",
  "With expertise in modern web technologies, I build scalable applications that solve real-world problems.",
  "I'm constantly learning and adapting to new technologies to deliver the best solutions.",
];

const resolveBiography = (): string[] => {
  const aboutContent = process.env.NEXT_PUBLIC_ABOUT_CONTENT;

  if (!aboutContent) {
    return DEFAULT_BIOGRAPHY;
  }

  const parsedByLineBreak = aboutContent
    .split(/\r?\n+/)
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  if (parsedByLineBreak.length > 1) {
    return parsedByLineBreak;
  }

  const parsedBySentence = (aboutContent.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  return parsedBySentence.length > 0 ? parsedBySentence : DEFAULT_BIOGRAPHY;
};

/**
 * Get social URL with undefined fallback for optional fields
 */
const getSocialUrlOrUndefined = (
  provider: string,
  fallbackId: string
): string | undefined =>
  nullToUndefined(
    getSocialUrl(provider) || buildSocialUrl(provider, fallbackId)
  );

/**
 * Get hero click link URL based on configured provider
 */
const getHeroLinkUrl = (): string | undefined => {
  const provider = process.env.NEXT_PUBLIC_HERO_LINK_PROVIDER || "linkedin";
  return getSocialUrlOrUndefined(provider, "username");
};

/**
 * Get "Hire Me" button URL based on configured provider
 */
const getHireMeUrl = (): string | undefined => {
  const provider = process.env.NEXT_PUBLIC_HIRE_ME_PROVIDER || "telegram";
  return getSocialUrlOrUndefined(provider, "username");
};

const profilesMock: ProfilesModel = [
  {
    id: 1,
    // Identity
    nickname: "portfolio-owner",
    authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || "Author",
    biography: resolveBiography(),
    location: "Location",

    // Images
    avatar: process.env.NEXT_PUBLIC_HERO_IMAGE || "/images/profile/hero.png",
    logo: process.env.NEXT_PUBLIC_LOGO_IMAGE || "/images/logo.svg",

    // Contact
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com",

    // Social URLs (built from env identifiers)
    linkedin: getSocialUrlOrUndefined("linkedin", "username"),
    github: getSocialUrlOrUndefined("github", "username"),
    twitter: getSocialUrlOrUndefined("twitter", "username"),
    dribbble: getSocialUrlOrUndefined("dribbble", "username"),
    telegram: nullToUndefined(getSocialUrl("telegram")),
    whatsapp: getSocialUrlOrUndefined("whatsapp", "5491100000000"),
    calendly: getSocialUrlOrUndefined("calendly", "username"),

    // Action URLs
    resume: ensureProtocol(process.env.NEXT_PUBLIC_RESUME_URL) || "#",
    heroLink: getHeroLinkUrl(),
    hireMeLink: getHireMeUrl(),
  },
];

export default profilesMock;
