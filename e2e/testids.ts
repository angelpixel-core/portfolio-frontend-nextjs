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
      projectsLink: 'nav-header-projects-link',
      articlesLink: 'nav-header-articles-link',
    },
    social: {
      container: 'nav-social-container',
      // Dynamic testids for social links use pattern: nav-social-{provider}-link
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
