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
      slider: 'customers-slider',
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

  // Projects page (Epic 14)
  projects: {
    page: 'projects-page',
    heroBlade: 'projects-hero-blade',
    gridBlade: 'projects-grid-blade',
    grid: 'projects-grid',
    gridItem: 'projects-grid-item',
    filterWrapper: 'projects-filter-wrapper',
    count: 'projects-count',
    empty: 'projects-empty',
  },

  // Project card (Epic 14)
  projectCard: {
    article: 'project-card',
    featured: 'project-card-featured',
    grid: 'project-card-grid',
    imageLink: 'project-card-image-link',
    image: 'project-card-image',
    content: 'project-card-content',
    tags: 'project-card-tags',
    title: 'project-card-title',
    summary: 'project-card-summary',
    techStack: 'project-card-tech-stack',
    actions: 'project-card-actions',
    actionGithub: 'project-card-action-github',
    actionVisit: 'project-card-action-visit',
    // Legacy aliases (for backwards compatibility with snapshots)
    actionRepo: 'project-card-action-repo',
    actionDemo: 'project-card-action-demo',
  },

  // Articles page (Epic 14)
  articles: {
    page: 'articles-page',
    heroBlade: 'articles-hero-blade',
    listBlade: 'articles-list-blade',
    featuredContainer: 'articles-featured-container',
    listHeading: 'articles-list-heading',
    list: 'articles-list',
    empty: 'articles-empty',
  },

  // Article list item (Epic 14)
  // Note: tags are shown in FeaturedArticleCard, not in ArticleListItem
  // ArticleListItem is designed to be minimal: title + date only (FR14.11)
  articleListItem: {
    article: 'article-list-item',
    link: 'article-list-item-link',
    title: 'article-list-item-title',
    date: 'article-list-item-date',
    // tags: 'article-list-item-tags', // Reserved for future use if design changes
  },

  // Article hover thumbnail (Epic 14)
  articleHoverThumbnail: {
    container: 'article-hover-thumbnail',
    image: 'article-hover-thumbnail-image',
    placeholder: 'article-hover-thumbnail-placeholder',
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
