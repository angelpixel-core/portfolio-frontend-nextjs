/**
 * Social URL Builder
 *
 * Constructs full URLs from base patterns and identifiers.
 * Pattern: BASE_URL + IDENTIFIER from environment variables.
 *
 * In production, these same URLs will come from the backend.
 * This utility ensures consistent URL construction in mock mode.
 */

export type SocialProvider =
  | "linkedin"
  | "github"
  | "twitter"
  | "dribbble"
  | "telegram"
  | "whatsapp"
  | "calendly"
  | "email";

/**
 * Social network base URL patterns
 * Each platform has a specific URL structure
 */
const SOCIAL_BASE_URLS: Record<SocialProvider, string> = {
  linkedin: "https://linkedin.com/in/",
  github: "https://github.com/",
  twitter: "https://twitter.com/",
  dribbble: "https://dribbble.com/",
  telegram: "https://t.me/",
  whatsapp: "https://wa.me/",
  calendly: "https://calendly.com/",
  email: "mailto:",
};

/**
 * Environment variable mapping for each provider
 */
const PROVIDER_ENV_VARS: Record<SocialProvider, string> = {
  linkedin: "NEXT_PUBLIC_LINKEDIN_USERNAME",
  github: "NEXT_PUBLIC_GITHUB_USERNAME",
  twitter: "NEXT_PUBLIC_TWITTER_USERNAME",
  dribbble: "NEXT_PUBLIC_DRIBBBLE_USERNAME",
  telegram: "NEXT_PUBLIC_TELEGRAM_USERNAME",
  whatsapp: "NEXT_PUBLIC_WHATSAPP_PHONE",
  calendly: "NEXT_PUBLIC_CALENDLY_USERNAME",
  email: "NEXT_PUBLIC_CONTACT_EMAIL",
};

/**
 * Get identifier from environment variable for a provider
 * @param {string} provider - Social network provider name
 * @returns {string|null} - The identifier or null if not set
 */
export const getIdentifier = (
  provider: SocialProvider | string
): string | null => {
  const envValues: Record<SocialProvider, string | undefined> = {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_USERNAME,
    github: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
    twitter: process.env.NEXT_PUBLIC_TWITTER_USERNAME,
    dribbble: process.env.NEXT_PUBLIC_DRIBBBLE_USERNAME,
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME,
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_PHONE,
    calendly: process.env.NEXT_PUBLIC_CALENDLY_USERNAME,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  };

  if (!(provider in envValues)) return null;

  return envValues[provider as SocialProvider] || null;
};

/**
 * Build a full social URL from provider and optional identifier
 * @param {string} provider - Social network provider name
 * @param {string} [identifier] - Optional identifier (uses env var if not provided)
 * @returns {string|null} - Full URL or null if provider/identifier not available
 */
export const buildSocialUrl = (
  provider: SocialProvider | string,
  identifier?: string
): string | null => {
  const baseUrl =
    provider in SOCIAL_BASE_URLS
      ? SOCIAL_BASE_URLS[provider as SocialProvider]
      : null;
  if (!baseUrl) return null;

  const id = identifier ?? getIdentifier(provider);
  if (!id) return null;

  return `${baseUrl}${id}`;
};

/**
 * Get URL for a provider using environment variable
 * @param {string} provider - Social network provider name
 * @returns {string|null} - Full URL or null if not configured
 */
export const getSocialUrl = (
  provider: SocialProvider | string
): string | null => {
  return buildSocialUrl(provider);
};

/**
 * Get all configured social URLs
 * @returns {Object} - Object with provider names as keys and URLs as values
 */
export const getAllSocialUrls = (): Partial<Record<SocialProvider, string>> => {
  const urls: Partial<Record<SocialProvider, string>> = {};

  (Object.keys(SOCIAL_BASE_URLS) as SocialProvider[]).forEach((provider) => {
    const url = getSocialUrl(provider);
    if (url) {
      urls[provider] = url;
    }
  });

  return urls;
};

/**
 * Check if a provider is configured (has identifier in env)
 * @param {string} provider - Social network provider name
 * @returns {boolean}
 */
export const isProviderConfigured = (
  provider: SocialProvider | string
): boolean => {
  return !!getIdentifier(provider);
};

const socialUrls = {
  buildSocialUrl,
  getSocialUrl,
  getAllSocialUrls,
  getIdentifier,
  isProviderConfigured,
  SOCIAL_BASE_URLS,
  PROVIDER_ENV_VARS,
};

export default socialUrls;
