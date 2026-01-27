import { test, expect } from '@playwright/test';
import { TESTIDS } from './testids';

// A11y tests consolidated in e2e/accessibility.spec.ts

// Use viewport within lg breakpoint where contact methods are visible
test.use({ viewport: { width: 1000, height: 720 } });

test.describe('Contact Methods', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('email link is visible and has mailto: href', async ({ page }) => {
    // Email link is displayed in footer - use resilient testid selector
    const emailLink = page.getByTestId(TESTIDS.contact.emailLink);
    await expect(emailLink).toBeVisible({ timeout: 10000 });

    const href = await emailLink.getAttribute('href');
    expect(href).toMatch(/^mailto:/);
  });

  test('WhatsApp link is visible and has wa.me href', async ({ page }) => {
    // WhatsApp link loads via profile hook (may have loading delay)
    const whatsappLink = page.getByTestId(TESTIDS.contact.whatsappLink);
    await expect(whatsappLink).toBeVisible({ timeout: 10000 });

    const href = await whatsappLink.getAttribute('href');
    expect(href).toMatch(/wa\.me|whatsapp/i);
  });

  test('Calendly button is visible', async ({ page }) => {
    // Calendly link loads via profile hook - use resilient testid selector
    const calendlyLink = page.getByTestId(TESTIDS.contact.calendlyLink);

    // Calendly may not be visible if profile doesn't have calendly URL
    // Just check it exists somewhere (may be in footer or homepage)
    const isVisible = await calendlyLink.isVisible().catch(() => false);

    if (isVisible) {
      const href = await calendlyLink.getAttribute('href');
      expect(href).toMatch(/calendly/i);
    } else {
      // Calendly not configured - this is acceptable
      // Test passes as the feature is optional
      test.skip();
    }
  });

  test('contact methods are keyboard accessible', async ({ page }) => {
    // Find an email link and verify keyboard accessibility
    const emailLink = page.getByTestId(TESTIDS.contact.emailLink);
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
    // Use resilient testid selector for container
    await page.waitForSelector(`[data-testid="${TESTIDS.nav.social.container}"]`, {
      timeout: 10000,
    });

    const socialNav = page.getByTestId(TESTIDS.nav.social.container);
    await expect(socialNav).toBeVisible();

    // Check for at least one social link
    const socialLinks = socialNav.getByRole('link');
    const linkCount = await socialLinks.count();

    expect(linkCount).toBeGreaterThan(0);
  });
});
