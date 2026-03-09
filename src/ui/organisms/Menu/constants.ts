/**
 * Header social providers are intentionally split by surface.
 * Desktop/tablet header slots are curated while mobile menus keep broader coverage.
 */
export const DESKTOP_HEADER_SOCIAL_PROVIDERS: readonly string[] = [
  "github",
  "linkedin",
];

export const MOBILE_MENU_SOCIAL_PROVIDERS: readonly string[] = [
  "linkedin",
  "github",
  "twitter",
  "dribbble",
];

// Legacy alias retained for tests and transitional imports.
export const HEADER_SOCIAL_PROVIDERS = MOBILE_MENU_SOCIAL_PROVIDERS;
