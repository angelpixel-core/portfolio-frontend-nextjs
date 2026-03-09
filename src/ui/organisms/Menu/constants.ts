/**
 * Header social providers are intentionally split by surface.
 * Desktop/tablet header slots are curated while mobile menus keep broader coverage.
 */
export const DESKTOP_HEADER_SOCIAL_PROVIDERS = ["github", "linkedin"] as const;

export const MOBILE_MENU_SOCIAL_PROVIDERS = [
  "linkedin",
  "github",
  "twitter",
  "dribbble",
] as const;
