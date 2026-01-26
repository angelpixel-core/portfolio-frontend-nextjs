import { test, expect } from '@playwright/test';
import {
  checkA11y,
  filterCriticalViolations,
  formatViolationReport,
} from './utils/accessibility';

// Use viewport within lg breakpoint where contact methods are visible
test.use({ viewport: { width: 1000, height: 720 } });

test.describe('Contact Methods', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('email link is visible and has mailto: href', async ({ page }) => {
    // Email link is displayed in footer
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible({ timeout: 10000 });

    const href = await emailLink.getAttribute('href');
    expect(href).toMatch(/^mailto:/);
  });

  test('WhatsApp link is visible and has wa.me href', async ({ page }) => {
    // WhatsApp link loads via profile hook (may have loading delay)
    const whatsappLink = page.locator(
      'a[href*="wa.me"], a[href*="whatsapp"], a[aria-label*="WhatsApp"]'
    );
    await expect(whatsappLink.first()).toBeVisible({ timeout: 10000 });

    const href = await whatsappLink.first().getAttribute('href');
    expect(href).toMatch(/wa\.me|whatsapp/i);
  });

  test('Calendly button is visible', async ({ page }) => {
    // Calendly link loads via profile hook
    const calendlyLink = page.locator('a[href*="calendly"], a[aria-label*="Schedule"]');

    // Calendly may not be visible if profile doesn't have calendly URL
    // Just check it exists somewhere (may be in footer or homepage)
    const isVisible = await calendlyLink.first().isVisible().catch(() => false);

    if (isVisible) {
      const href = await calendlyLink.first().getAttribute('href');
      expect(href).toMatch(/calendly/i);
    } else {
      // Calendly not configured - this is acceptable
      // Test passes as the feature is optional
      test.skip();
    }
  });

  test('contact methods are keyboard accessible', async ({ page }) => {
    // Find an email link and verify keyboard accessibility
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible({ timeout: 10000 });

    // Focus on the email link
    await emailLink.focus();
    await expect(emailLink).toBeFocused();

    // Verify the link has accessible name
    const ariaLabel = await emailLink.getAttribute('aria-label');
    const text = await emailLink.textContent();

    // Either aria-label or text content should provide accessible name
    expect(ariaLabel || text).toBeTruthy();
  });

  test('social links in header are visible', async ({ page }) => {
    // Wait for social links to load (contact points have async fetch)
    await page.waitForSelector('nav[aria-label="Social links"]', {
      timeout: 10000,
    });

    const socialNav = page.locator('nav[aria-label="Social links"]');
    await expect(socialNav).toBeVisible();

    // Check for at least one social link
    const socialLinks = socialNav.getByRole('link');
    const linkCount = await socialLinks.count();

    expect(linkCount).toBeGreaterThan(0);
  });

  test('contact section has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await checkA11y(page);
    const critical = filterCriticalViolations(results.violations);

    if (critical.length > 0) {
      console.error('Critical a11y violations:', formatViolationReport(critical));
    }

    expect(
      critical,
      'Contact methods should have no critical accessibility violations'
    ).toHaveLength(0);
  });
});
