import { test, expect } from "@playwright/test";
import { TESTIDS, getSocialLinkTestId } from "./testids";

// A11y tests consolidated in e2e/accessibility.spec.ts

// Use viewport within lg breakpoint where contact methods are visible
test.use({ viewport: { width: 1000, height: 720 } });

test.describe("Contact Methods", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("email link is visible and has mailto: href", async ({ page }) => {
    const emailLinks = page
      .getByTestId(TESTIDS.contact.emailLink)
      .locator("visible=true");
    await expect(emailLinks).toHaveCount(1);
    const emailLink = emailLinks.first();
    await expect(emailLink).toBeVisible({ timeout: 10000 });

    const href = await emailLink.getAttribute("href");
    expect(href).toMatch(/^mailto:/);
  });

  test("WhatsApp link is visible and has wa.me href", async ({ page }) => {
    const whatsappLinks = page
      .getByTestId(TESTIDS.contact.whatsappLink)
      .locator("visible=true");

    const visibleCount = await whatsappLinks.count();
    expect(visibleCount).toBeLessThanOrEqual(1);

    if (visibleCount === 1) {
      const whatsappLink = whatsappLinks.first();
      await expect(whatsappLink).toBeVisible({ timeout: 10000 });

      const href = await whatsappLink.getAttribute("href");
      expect(href).toMatch(/wa\.me|whatsapp/i);
    } else {
      await expect(whatsappLinks).toHaveCount(0);
    }
  });

  test("Calendly link follows deterministic optional contract", async ({
    page,
  }) => {
    const visibleCalendlyLinks = page
      .getByTestId(TESTIDS.contact.calendlyLink)
      .locator("visible=true");

    const visibleCount = await visibleCalendlyLinks.count();

    expect(visibleCount).toBeLessThanOrEqual(1);

    if (visibleCount === 1) {
      const calendlyLink = visibleCalendlyLinks.first();
      const href = await calendlyLink.getAttribute("href");
      expect(href).toMatch(/calendly/i);
    } else {
      await expect(visibleCalendlyLinks).toHaveCount(0);
    }
  });

  test("contact methods are keyboard accessible", async ({ page }) => {
    const emailLinks = page
      .getByTestId(TESTIDS.contact.emailLink)
      .locator("visible=true");
    await expect(emailLinks).toHaveCount(1);
    const emailLink = emailLinks.first();
    await expect(emailLink).toBeVisible({ timeout: 10000 });

    // Focus on the email link
    await emailLink.focus();
    await expect(emailLink).toBeFocused();

    // Verify the link has accessible name
    const ariaLabel = await emailLink.getAttribute("aria-label");
    const text = await emailLink.textContent();

    // Either aria-label or text content should provide accessible name
    expect(ariaLabel || text).toBeTruthy();
  });

  test("desktop header shows curated social providers at wide viewport", async ({
    page,
  }) => {
    // Social links only visible at wide viewport (≥1441px) per Story 11.3
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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
    const socialLinks = socialNav.getByRole("link");
    await expect(socialLinks.first()).toBeVisible({ timeout: 10000 });

    const linkCount = await socialLinks.count();
    expect(linkCount).toBe(2);

    await expect(
      socialNav.getByTestId(getSocialLinkTestId("github"))
    ).toBeVisible();
    await expect(
      socialNav.getByTestId(getSocialLinkTestId("linkedin"))
    ).toBeVisible();
    await expect(
      socialNav.getByTestId(getSocialLinkTestId("twitter"))
    ).toHaveCount(0);
    await expect(
      socialNav.getByTestId(getSocialLinkTestId("dribbble"))
    ).toHaveCount(0);
  });
});
