import { test, expect } from '@playwright/test';
import {
  checkA11y,
  filterCriticalViolations,
  formatViolationReport,
} from './utils/accessibility';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully with HTTP 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('displays profile section with title', async ({ page }) => {
    // The title should be visible (either loaded content or fallback "Welcome")
    const titleContainer = page.locator('.home-content .animated-title_container').first();
    await expect(titleContainer).toBeVisible();
  });

  test('displays hero image', async ({ page }) => {
    const heroImage = page.locator('.home-hero_image');
    await expect(heroImage).toBeVisible();
  });

  test('displays technology stack section (CustomersSlider)', async ({
    page,
  }) => {
    // CustomersSlider displays technologies/customers
    const slider = page.locator('.slider');
    await expect(slider).toBeVisible();
  });

  test('has no console errors on page load', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out expected React hydration warnings or third-party errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('hydration') &&
        !error.includes('ResizeObserver') &&
        !error.includes('third-party')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await checkA11y(page);
    const critical = filterCriticalViolations(results.violations);

    if (critical.length > 0) {
      console.error('Critical a11y violations:', formatViolationReport(critical));
    }

    // Log non-critical for awareness
    if (results.violations.length > critical.length) {
      console.log(
        `A11y warnings: ${results.violations.length - critical.length} non-critical violations`
      );
    }

    expect(critical, 'Homepage should have no critical accessibility violations').toHaveLength(0);
  });
});
