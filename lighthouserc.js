/**
 * Lighthouse CI Configuration
 * @see https://github.com/GoogleChrome/lighthouse-ci
 *
 * Thresholds per architecture.md and PRD NFRs:
 * - Performance: ≥90 (NFR1)
 * - Accessibility: ≥95 (NFR14)
 *
 * Note: Assertions are set to 'warn' (non-blocking) per architecture decision.
 * This gives visibility into regressions without blocking velocity during MVP.
 */
module.exports = {
  ci: {
    collect: {
      // URLs to test - homepage is the critical path
      url: ['http://localhost:9000/'],
      // Start Next.js production server (requires build first)
      startServerCommand: 'npm run start -- --port 9000',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 30000,
      // Run 3 times for consistent results
      numberOfRuns: 3,
      settings: {
        // Use desktop preset for consistent CI results
        preset: 'desktop',
        // Throttling settings for CI stability
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        // Performance: ≥90 (NFR1)
        'categories:performance': ['warn', { minScore: 0.9 }],
        // Accessibility: ≥95 (NFR14)
        'categories:accessibility': ['warn', { minScore: 0.95 }],
        // Best Practices: ≥90
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        // SEO: ≥90
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      // Use temporary public storage (no LHCI server needed)
      target: 'temporary-public-storage',
    },
  },
};
