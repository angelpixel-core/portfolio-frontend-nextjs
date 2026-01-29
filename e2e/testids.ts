/**
 * Central registry of data-testid values used in E2E tests.
 * Pattern: {domain}-{component}-{element}
 *
 * Benefits:
 * - Single source of truth for selectors
 * - TypeScript autocomplete in tests
 * - Easy to find all testids in codebase
 *
 * @see docs/development-workflow.md#e2e-test-selectors
 */

export const TESTIDS = {
  // Navigation
  nav: {
    header: {
      homeLink: 'nav-header-home-link',
      aboutLink: 'nav-header-about-link',
      projectsLink: 'nav-header-projects-link',
      articlesLink: 'nav-header-articles-link',
    },
    social: {
      container: 'header-social-zone', // Updated in Story 11.2 for zone identification
      // Dynamic testids for social links use pattern: nav-social-{provider}-link
    },
  },
  // Header zones (Story 11.2, 12.2, 12.4)
  header: {
    container: 'header-container',
    brandZone: 'header-brand-zone',
    navZone: 'header-nav-zone',
    socialZone: 'header-social-zone',
    authZone: 'header-auth-zone',
    uiZone: 'header-ui-zone',
    burgerZone: 'header-burger-zone',
    hireMeZone: 'header-hire-me-zone', // Story 12.2
    // Navigation links (Story 12.4) - pattern: nav-header-{page}-link
    navLinks: {
      home: 'nav-header-home-link',
      about: 'nav-header-about-link',
      projects: 'nav-header-projects-link',
      articles: 'nav-header-articles-link',
    },
  },

  // Profile / Homepage
  profile: {
    hero: {
      image: 'profile-hero-image',
      titleContainer: 'profile-title-container',
    },
    tech: {
      slider: 'profile-tech-slider',
    },
  },

  // Theme
  theme: {
    toggleButton: 'theme-toggle-button',
  },

  // Contact
  contact: {
    emailLink: 'contact-email-link',
    whatsappLink: 'contact-whatsapp-link',
    calendlyLink: 'contact-calendly-link',
  },

  // Main layout
  layout: {
    mainContent: 'layout-main-content',
  },
} as const;

/**
 * Helper to generate dynamic social link testid
 * @param provider - Social provider name (github, linkedin, etc.)
 * @returns data-testid value
 */
export function getSocialLinkTestId(provider: string): string {
  return `nav-social-${provider.toLowerCase()}-link`;
}
