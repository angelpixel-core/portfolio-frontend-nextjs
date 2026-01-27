import { test, expect } from '@playwright/test';
import { TESTIDS } from './testids';

// A11y tests consolidated in e2e/accessibility.spec.ts

// Use viewport within lg breakpoint (max: 1023px) where desktop menu shows
// Project uses inverted breakpoints: lg: { max: "1023px" }
test.use({ viewport: { width: 1000, height: 720 } });

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for navigation items to load (there's a 2s simulated delay in mock data)
    await page.waitForSelector(`[data-testid="${TESTIDS.nav.header.homeLink}"]`, {
      timeout: 15000,
    });
  });

  test('main navigation links are visible', async ({ page }) => {
    // Check for key navigation links using resilient testid selectors
    const homeLink = page.getByTestId(TESTIDS.nav.header.homeLink);
    const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
    const articlesLink = page.getByTestId(TESTIDS.nav.header.articlesLink);

    await expect(homeLink).toBeVisible();
    await expect(projectsLink).toBeVisible();
    await expect(articlesLink).toBeVisible();
  });

  test('navigate to Projects page', async ({ page }) => {
    const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
    await projectsLink.click();
    await expect(page).toHaveURL('/projects');

    // Projects page should have content
    const content = page.getByTestId(TESTIDS.layout.mainContent);
    await expect(content).toBeVisible();
  });

  test('navigate to Articles page', async ({ page }) => {
    const articlesLink = page.getByTestId(TESTIDS.nav.header.articlesLink);
    await articlesLink.click();
    await expect(page).toHaveURL('/articles');

    // Articles page should have content
    const content = page.getByTestId(TESTIDS.layout.mainContent);
    await expect(content).toBeVisible();
  });

  test('navigate back to Homepage', async ({ page }) => {
    // First navigate away
    const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
    await projectsLink.click();
    await expect(page).toHaveURL('/projects');

    // Wait for navigation to load again
    await page.waitForSelector(`[data-testid="${TESTIDS.nav.header.homeLink}"]`, {
      timeout: 15000,
    });

    // Navigate back home
    const homeLink = page.getByTestId(TESTIDS.nav.header.homeLink);
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    // Find the first navigation link
    const homeLink = page.getByTestId(TESTIDS.nav.header.homeLink);
    await expect(homeLink).toBeVisible();

    // Focus on the link and verify it receives focus
    await homeLink.focus();
    await expect(homeLink).toBeFocused();

    // Tab to next element and verify focus moves
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
