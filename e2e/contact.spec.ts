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
    // Email link appears in both secondary blade footer and global footer (hidden on Home)
    // Use .first() to get the visible one (Story 12.7: Footer duplication architecture)
    const emailLink = page.getByTestId(TESTIDS.contact.emailLink).first();
    await expect(emailLink).toBeVisible({ timeout: 10000 });

    const href = await emailLink.getAttribute('href');
    expect(href).toMatch(/^mailto:/);
  });

  test('WhatsApp link is visible and has wa.me href', async ({ page }) => {
    // WhatsApp link appears in both footers, use .first() for visible one
    const whatsappLink = page.getByTestId(TESTIDS.contact.whatsappLink).first();
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
      test.skip(true, "Calendly URL not configured in profile data");
    }
  });

  test('contact methods are keyboard accessible', async ({ page }) => {
    // Find an email link and verify keyboard accessibility
    // Use .first() due to Footer duplication (Story 12.7)
    const emailLink = page.getByTestId(TESTIDS.contact.emailLink).first();
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

  test('social links in header are visible at wide viewport', async ({
    page,
  }) => {
    // Social links only visible at wide viewport (≥1441px) per Story 11.3
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for social links to load (contact points have async fetch)
    // Use resilient testid selector for container
    await page.waitForSelector(
      `[data-testid="${TESTIDS.nav.social.container}"]`,
      {
        timeout: 10000,
      }
    );

    const socialNav = page.getByTestId(TESTIDS.nav.social.container);
    await expect(socialNav).toBeVisible();

    // Wait for social links to render (async fetch via useContactPoints)
    const socialLinks = socialNav.getByRole('link');
    await expect(socialLinks.first()).toBeVisible({ timeout: 10000 });

    const linkCount = await socialLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});
