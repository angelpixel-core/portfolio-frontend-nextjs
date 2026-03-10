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
      homeLink: "nav-header-home-link",
      aboutLink: "nav-header-about-link",
      projectsLink: "nav-header-projects-link",
      articlesLink: "nav-header-articles-link",
    },
    social: {
      container: "header-social-zone", // Updated in Story 11.2 for zone identification
      // Dynamic testids for social links use pattern: nav-social-{provider}-link
    },
  },
  // Header zones — Mobile (<880px) and Desktop Menu (≥880px)
  header: {
    container: "header-container",
    // Mobile elements (visible below navContent breakpoint, 0-879px)
    logoMenuTrigger: "header-logo-menu-trigger",
    mobileAuth: "header-mobile-auth",
    tabletSocial: "header-tablet-social",
    mobileTheme: "header-mobile-theme",
    // Desktop Menu zones (visible at navContent+, ≥880px)
    brandZone: "header-brand-zone",
    navZone: "header-nav-zone",
    socialZone: "header-social-zone",
    uiZone: "header-ui-zone",
    ctaZone: "header-cta-zone",
    // Navigation links (inside navZone) - pattern: nav-header-{page}-link
    navLinks: {
      home: "nav-header-home-link",
      about: "nav-header-about-link",
      projects: "nav-header-projects-link",
      articles: "nav-header-articles-link",
    },
  },

  // Profile / Homepage
  profile: {
    hero: {
      image: "profile-hero-image",
      titleContainer: "profile-title-container",
      contactContainer: "profile-hero-contact",
      // slogan: uses CSS selector '.home__slogan' (Paragraph molecule doesn't forward data-testid)
    },
    tech: {
      slider: "customers-slider",
    },
  },

  // Theme
  theme: {
    toggleButton: "theme-toggle-button",
  },

  // Contact
  contact: {
    emailLink: "contact-email-link",
    whatsappLink: "contact-whatsapp-link",
    calendlyLink: "contact-calendly-link",
  },

  // Main layout
  layout: {
    mainContent: "layout-main-content",
    footer: "footer",
  },

  // Projects page (Epic 14)
  projects: {
    page: "projects-page",
    heroBlade: "projects-hero-blade",
    gridBlade: "projects-grid-blade",
    grid: "projects-grid",
    gridItem: "projects-grid-item",
    filterWrapper: "projects-filter-wrapper",
    count: "projects-count",
    empty: "projects-empty",
  },

  // Project card (Epic 14)
  projectCard: {
    article: "project-card",
    featured: "project-card-featured",
    grid: "project-card-grid",
    imageLink: "project-card-image-link",
    image: "project-card-image",
    content: "project-card-content",
    tags: "project-card-tags",
    title: "project-card-title",
    summary: "project-card-summary",
    techStack: "project-card-tech-stack",
    actions: "project-card-actions",
    actionArchitecture: "project-card-action-architecture",
    actionSource: "project-card-action-source",
    actionLiveDemo: "project-card-action-demo",
    actionGithub: "project-card-action-github",
    actionVisit: "project-card-action-visit",
    // Legacy aliases (for backwards compatibility with snapshots)
    actionRepo: "project-card-action-repo",
    actionDemo: "project-card-action-demo",
  },

  architectureOverlay: {
    container: "project-architecture-overlay",
    close: "project-architecture-overlay-close",
  },

  // Articles page (Epic 14)
  articles: {
    page: "articles-page",
    heroBlade: "articles-hero-blade",
    listBlade: "articles-list-blade",
    featuredContainer: "articles-featured-container",
    listHeading: "articles-list-heading",
    list: "articles-list",
    empty: "articles-empty",
  },

  // Article list item (Epic 14)
  // Note: tags are shown in FeaturedArticleCard, not in ArticleListItem
  // ArticleListItem is designed to be minimal: title + date only (FR14.11)
  articleListItem: {
    article: "article-list-item",
    link: "article-list-item-link",
    title: "article-list-item-title",
    date: "article-list-item-date",
    // tags: 'article-list-item-tags', // Reserved for future use if design changes
  },

  // Chat (Story 24.3)
  chat: {
    panel: "chatPanel-panel",
    sendButton: "chat-send-button",
  },

  // Auth (Epic 16)
  auth: {
    button: "auth-button",
    initials: "auth-initials",
    dropdown: "auth-dropdown",
    dropdownSignOut: "auth-dropdown-sign-out",
    modal: "auth-modal",
    modalClose: "auth-modal-close",
    tabLogin: "auth-tab-login",
    tabSignup: "auth-tab-signup",
    formSubmit: "auth-form-submit",
    oauth: {
      linkedin: "auth-oauth-linkedin",
      microsoft: "auth-oauth-microsoft",
      google: "auth-oauth-google",
    },
  },

  // Article hover thumbnail (Epic 14)
  articleHoverThumbnail: {
    container: "article-hover-thumbnail",
    image: "article-hover-thumbnail-image",
    placeholder: "article-hover-thumbnail-placeholder",
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
