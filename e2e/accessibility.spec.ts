/**
 * Comprehensive Accessibility Audit Tests
 *
 * These tests run WCAG 2.2 AA audits across all main routes
 * and verify accessibility in different states (themes, viewports).
 *
 * Critical violations fail the build.
 * Non-critical violations are logged for awareness.
 */

import { test, expect } from '@playwright/test';
import {
  checkA11y,
  filterCriticalViolations,
  formatViolationReport,
} from './utils/accessibility';

/** Main routes to audit for accessibility */
const routes = ['/', '/about', '/projects', '/articles'];

test.describe('Accessibility Audits', () => {
  test.describe('Route Audits', () => {
    for (const route of routes) {
      test(`${route} has no critical accessibility violations`, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        const results = await checkA11y(page);
        const critical = filterCriticalViolations(results.violations);

        if (critical.length > 0) {
          console.error(
            `Critical a11y violations on ${route}:\n`,
            formatViolationReport(critical)
          );
        }

        // Log summary of all violations for awareness
        if (results.violations.length > 0) {
          console.log(
            `${route}: ${results.violations.length} total violations, ${critical.length} critical`
          );
        }

        expect(critical, `Critical violations on ${route}`).toHaveLength(0);
      });
    }
  });

  test.describe('Theme State Audits', () => {
    test('dark mode is accessible', async ({ page }) => {
      // Clear stored theme preference and set dark mode
      await page.addInitScript(() => {
        localStorage.removeItem('themeMode');
        localStorage.removeItem('theme');
      });
      await page.emulateMedia({ colorScheme: 'dark' });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify we're in dark mode
      const htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass).toContain('dark');

      const results = await checkA11y(page);
      const critical = filterCriticalViolations(results.violations);

      if (critical.length > 0) {
        console.error(
          'Critical a11y violations in dark mode:\n',
          formatViolationReport(critical)
        );
      }

      expect(critical, 'Dark mode should have no critical violations').toHaveLength(0);
    });

    test('light mode is accessible', async ({ page }) => {
      // Clear stored theme preference and set light mode
      await page.addInitScript(() => {
        localStorage.removeItem('themeMode');
        localStorage.removeItem('theme');
      });
      await page.emulateMedia({ colorScheme: 'light' });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify we're in light mode (class may be null or not contain 'dark')
      const htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass ?? '').not.toContain('dark');

      const results = await checkA11y(page);
      const critical = filterCriticalViolations(results.violations);

      if (critical.length > 0) {
        console.error(
          'Critical a11y violations in light mode:\n',
          formatViolationReport(critical)
        );
      }

      expect(critical, 'Light mode should have no critical violations').toHaveLength(0);
    });
  });

  test.describe('Viewport Audits', () => {
    test('mobile viewport (375x667) is accessible', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await checkA11y(page);
      const critical = filterCriticalViolations(results.violations);

      if (critical.length > 0) {
        console.error(
          'Critical a11y violations on mobile:\n',
          formatViolationReport(critical)
        );
      }

      expect(critical, 'Mobile viewport should have no critical violations').toHaveLength(0);
    });

    test('tablet viewport (768x1024) is accessible', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await checkA11y(page);
      const critical = filterCriticalViolations(results.violations);

      if (critical.length > 0) {
        console.error(
          'Critical a11y violations on tablet:\n',
          formatViolationReport(critical)
        );
      }

      expect(critical, 'Tablet viewport should have no critical violations').toHaveLength(0);
    });
  });

  test.describe('Accessibility Summary', () => {
    test('audit summary across all routes', async ({ page }) => {
      const summary: Record<string, { total: number; critical: number }> = {};

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        const results = await checkA11y(page);
        const critical = filterCriticalViolations(results.violations);

        summary[route] = {
          total: results.violations.length,
          critical: critical.length,
        };
      }

      // Log summary
      console.log('\n=== Accessibility Audit Summary ===');
      for (const [route, data] of Object.entries(summary)) {
        const status = data.critical === 0 ? '✅' : '❌';
        console.log(`${status} ${route}: ${data.total} violations (${data.critical} critical)`);
      }
      console.log('===================================\n');

      // Fail if any route has critical violations
      const totalCritical = Object.values(summary).reduce((sum, d) => sum + d.critical, 0);
      expect(totalCritical, 'No critical violations across all routes').toBe(0);
    });
  });
});
