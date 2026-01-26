import { test, expect } from '@playwright/test';
import {
  checkA11y,
  filterCriticalViolations,
  formatViolationReport,
} from './utils/accessibility';

// Use viewport within lg breakpoint where theme button is visible in menu
test.use({ viewport: { width: 1000, height: 720 } });

test.describe('Theme Toggle', () => {
  // Helper function to click theme button using JavaScript dispatch
  async function clickThemeButton(page: import('@playwright/test').Page) {
    const themeButton = page.getByRole('switch', {
      name: /switch to (light|dark) mode/i,
    });
    await expect(themeButton).toBeVisible({ timeout: 10000 });

    // Use dispatchEvent to trigger click without pointer event issues
    await themeButton.evaluate((btn) => (btn as HTMLElement).click());
  }

  test('theme toggle button is visible', async ({ page }) => {
    // Clear stored theme preference
    await page.addInitScript(() => {
      localStorage.removeItem('themeMode');
      localStorage.removeItem('theme');
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const themeButton = page.getByRole('switch', {
      name: /switch to (light|dark) mode/i,
    });
    await expect(themeButton).toBeVisible({ timeout: 10000 });
  });

  test('click toggle switches theme from light to dark', async ({ page }) => {
    // Clear stored theme preference
    await page.addInitScript(() => {
      localStorage.removeItem('themeMode');
      localStorage.removeItem('theme');
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const themeButton = page.getByRole('switch', {
      name: /switch to (light|dark) mode/i,
    });
    await expect(themeButton).toBeVisible({ timeout: 10000 });

    // Get initial state (should be light mode based on system default in test env)
    const initialAriaChecked = await themeButton.getAttribute('aria-checked');

    // Click to toggle theme using JS click
    await clickThemeButton(page);

    // Wait for aria-checked to change (proper assertion instead of arbitrary timeout)
    const expectedNewState = initialAriaChecked === 'true' ? 'false' : 'true';
    await expect(themeButton).toHaveAttribute('aria-checked', expectedNewState, {
      timeout: 5000,
    });

    const newAriaChecked = await themeButton.getAttribute('aria-checked');
    expect(newAriaChecked).not.toBe(initialAriaChecked);

    // Verify HTML element has dark class if toggled to dark
    const htmlClass = await page.locator('html').getAttribute('class');
    if (newAriaChecked === 'true') {
      expect(htmlClass).toContain('dark');
    } else {
      expect(htmlClass).not.toContain('dark');
    }
  });

  test('theme persists after page reload', async ({ page }) => {
    // Clear stored theme preference only on the FIRST page load
    // by checking if a marker is set
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('_e2e_theme_test_started')) {
        localStorage.removeItem('themeMode');
        localStorage.removeItem('theme');
        sessionStorage.setItem('_e2e_theme_test_started', 'true');
      }
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const themeButton = page.getByRole('switch', {
      name: /switch to (light|dark) mode/i,
    });
    await expect(themeButton).toBeVisible({ timeout: 10000 });

    // Toggle theme using JS click
    const initialAriaChecked = await themeButton.getAttribute('aria-checked');
    await clickThemeButton(page);

    // Wait for aria-checked to change (proper assertion instead of arbitrary timeout)
    const expectedNewState = initialAriaChecked === 'true' ? 'false' : 'true';
    await expect(themeButton).toHaveAttribute('aria-checked', expectedNewState, {
      timeout: 5000,
    });

    const afterClickAriaChecked = await themeButton.getAttribute('aria-checked');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Theme should persist
    const afterReloadButton = page.getByRole('switch', {
      name: /switch to (light|dark) mode/i,
    });
    await expect(afterReloadButton).toBeVisible({ timeout: 10000 });

    const afterReloadAriaChecked =
      await afterReloadButton.getAttribute('aria-checked');
    expect(afterReloadAriaChecked).toBe(afterClickAriaChecked);
  });

  test('theme respects system preference on first visit', async ({ page }) => {
    // Clear stored theme preference
    await page.addInitScript(() => {
      localStorage.removeItem('themeMode');
      localStorage.removeItem('theme');
    });

    // Emulate dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const themeButton = page.getByRole('switch', {
      name: /switch to (light|dark) mode/i,
    });
    await expect(themeButton).toBeVisible({ timeout: 10000 });

    // Should be in dark mode (aria-checked=true means dark mode)
    const ariaChecked = await themeButton.getAttribute('aria-checked');
    expect(ariaChecked).toBe('true');

    // HTML should have dark class
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
  });

  test('dark mode has no critical accessibility violations', async ({ page }) => {
    // Clear stored theme preference
    await page.addInitScript(() => {
      localStorage.removeItem('themeMode');
      localStorage.removeItem('theme');
    });

    // Emulate dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await checkA11y(page);
    const critical = filterCriticalViolations(results.violations);

    if (critical.length > 0) {
      console.error('Critical a11y violations in dark mode:', formatViolationReport(critical));
    }

    expect(critical, 'Dark mode should have no critical accessibility violations').toHaveLength(0);
  });

  test('light mode has no critical accessibility violations', async ({ page }) => {
    // Clear stored theme preference
    await page.addInitScript(() => {
      localStorage.removeItem('themeMode');
      localStorage.removeItem('theme');
    });

    // Emulate light mode preference
    await page.emulateMedia({ colorScheme: 'light' });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await checkA11y(page);
    const critical = filterCriticalViolations(results.violations);

    if (critical.length > 0) {
      console.error('Critical a11y violations in light mode:', formatViolationReport(critical));
    }

    expect(critical, 'Light mode should have no critical accessibility violations').toHaveLength(0);
  });
});
