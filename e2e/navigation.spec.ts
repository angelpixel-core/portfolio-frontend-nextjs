import { test, expect } from '@playwright/test';
import {
  checkA11y,
  filterCriticalViolations,
  formatViolationReport,
} from './utils/accessibility';

// Use viewport within lg breakpoint (max: 1023px) where desktop menu shows
// Project uses inverted breakpoints: lg: { max: "1023px" }
test.use({ viewport: { width: 1000, height: 720 } });

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for navigation items to load (there's a 2s simulated delay in mock data)
    await page.waitForSelector('a:has-text("home")', { timeout: 15000 });
  });

  test('main navigation links are visible', async ({ page }) => {
    // Check for key navigation links
    const homeLink = page.locator('a:has-text("home")').first();
    const projectsLink = page.locator('a:has-text("projects")').first();
    const articlesLink = page.locator('a:has-text("articles")').first();

    await expect(homeLink).toBeVisible();
    await expect(projectsLink).toBeVisible();
    await expect(articlesLink).toBeVisible();
  });

  test('navigate to Projects page', async ({ page }) => {
    const projectsLink = page.locator('a:has-text("projects")').first();
    await projectsLink.click();
    await expect(page).toHaveURL('/projects');

    // Projects page should have content
    const content = page.locator('#main-content');
    await expect(content).toBeVisible();
  });

  test('navigate to Articles page', async ({ page }) => {
    const articlesLink = page.locator('a:has-text("articles")').first();
    await articlesLink.click();
    await expect(page).toHaveURL('/articles');

    // Articles page should have content
    const content = page.locator('#main-content');
    await expect(content).toBeVisible();
  });

  test('navigate back to Homepage', async ({ page }) => {
    // First navigate away
    const projectsLink = page.locator('a:has-text("projects")').first();
    await projectsLink.click();
    await expect(page).toHaveURL('/projects');

    // Wait for navigation to load again
    await page.waitForSelector('a:has-text("home")', { timeout: 15000 });

    // Navigate back home
    const homeLink = page.locator('a:has-text("home")').first();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    // Find the first navigation link
    const homeLink = page.locator('a:has-text("home")').first();
    await expect(homeLink).toBeVisible();

    // Focus on the link and verify it receives focus
    await homeLink.focus();
    await expect(homeLink).toBeFocused();

    // Tab to next element and verify focus moves
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('Projects page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const results = await checkA11y(page);
    const critical = filterCriticalViolations(results.violations);

    if (critical.length > 0) {
      console.error('Critical a11y violations:', formatViolationReport(critical));
    }

    expect(critical, 'Projects page should have no critical accessibility violations').toHaveLength(
      0
    );
  });

  test('Articles page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');

    const results = await checkA11y(page);
    const critical = filterCriticalViolations(results.violations);

    if (critical.length > 0) {
      console.error('Critical a11y violations:', formatViolationReport(critical));
    }

    expect(critical, 'Articles page should have no critical accessibility violations').toHaveLength(
      0
    );
  });
});
