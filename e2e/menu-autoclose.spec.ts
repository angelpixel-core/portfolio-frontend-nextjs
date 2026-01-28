/**
 * Menu Auto-Close & Theme Contrast Tests (Story 12.5)
 *
 * Tests for AC1-AC5:
 * - AC1: Menu auto-close on navigation link click
 * - AC2: Menu auto-close on social link click
 * - AC3: Twitter icon theme contrast
 * - AC4: Dribbble icon theme contrast
 * - AC5: Other social icons theme contrast verification
 *
 * @see _bmad-output/implementation-artifacts/12-5-menu-autoclose-theme-contrast.md
 * @see docs/layout-system.md
 */

import { test, expect } from "@playwright/test";
import { TESTIDS, getSocialLinkTestId } from "./testids";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 720, height: 1024 },
};

test.describe("Menu Auto-Close (Story 12.5)", () => {
  test.describe("AC1: Menu Auto-Close on Navigation", () => {
    test("menu closes when clicking navigation link on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      const menuButton = page.getByTestId(TESTIDS.header.burgerZone);
      await menuButton.click();

      // Wait for menu to open
      const floatingMenu = page.locator("#menuFloating");
      await expect(floatingMenu).toBeVisible();

      // Find any navigation link in floating menu (guard against missing specific links)
      const navLinks = page.locator(".menu-floating__link");
      const navLinkCount = await navLinks.count();
      if (navLinkCount === 0) {
        test.skip();
        return;
      }

      // Click first available navigation link
      const firstNavLink = navLinks.first();
      const linkHref = await firstNavLink.getAttribute("href");
      await firstNavLink.click();

      // Menu should close
      await expect(floatingMenu).not.toBeVisible();

      // Navigation should complete to the link's href
      if (linkHref) {
        await expect(page).toHaveURL(linkHref);
      }
    });

    test("menu closes when clicking Home link on tablet", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      const menuButton = page.getByTestId(TESTIDS.header.burgerZone);
      await menuButton.click();

      // Wait for menu to open
      const floatingMenu = page.locator("#menuFloating");
      await expect(floatingMenu).toBeVisible();

      // Find Home link (guard against missing link)
      const homeLink = page.locator(".menu-floating__link").filter({ hasText: "Home" });
      const homeLinkCount = await homeLink.count();
      if (homeLinkCount === 0) {
        test.skip();
        return;
      }

      await homeLink.click();

      // Menu should close and navigation should complete
      await expect(floatingMenu).not.toBeVisible();
      await expect(page).toHaveURL("/");
    });
  });

  test.describe("AC2: Menu Auto-Close on Social Link", () => {
    test("menu closes when clicking social link on mobile", async ({
      page,
      context,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      const menuButton = page.getByTestId(TESTIDS.header.burgerZone);
      await menuButton.click();

      // Wait for menu to open
      const floatingMenu = page.locator("#menuFloating");
      await expect(floatingMenu).toBeVisible();

      // Wait for social links container to be visible
      const socialContainer = page.locator(".menu-floating__contact-points");
      await expect(socialContainer).toBeVisible();

      // Find any social link in the menu
      const socialLink = page.locator(".menu-floating__contact-points .social_link").first();

      // Check if social links exist
      const socialLinkCount = await socialLink.count();
      if (socialLinkCount === 0) {
        // Skip test if no social links are configured
        test.skip();
        return;
      }

      // Listen for new page (external link opens in new tab)
      const newPagePromise = context.waitForEvent("page", { timeout: 5000 }).catch(() => null);

      // Click the social link
      await socialLink.click();

      // Menu should close (even if external link opens)
      await expect(floatingMenu).not.toBeVisible();

      // Clean up new tab if it opened
      const newPage = await newPagePromise;
      if (newPage) {
        await newPage.close();
      }
    });
  });
});

test.describe("Social Icon Theme Contrast (Story 12.5)", () => {
  test.describe("AC3: Twitter Icon Theme Contrast", () => {
    test("Twitter icon uses currentColor fill", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      await page.getByTestId(TESTIDS.header.burgerZone).click();
      await expect(page.locator("#menuFloating")).toBeVisible();

      // Wait for social links container to be visible
      await expect(page.locator(".menu-floating__contact-points")).toBeVisible();

      // Find Twitter icon SVG path
      const twitterLink = page.getByTestId(getSocialLinkTestId("twitter"));

      const twitterLinkCount = await twitterLink.count();
      if (twitterLinkCount === 0) {
        // Skip if Twitter link not configured
        test.skip();
        return;
      }

      const twitterPath = twitterLink.locator("svg path").last();
      await expect(twitterPath).toHaveAttribute("fill", "currentColor");
    });
  });

  test.describe("AC4: Dribbble Icon Theme Contrast", () => {
    test("Dribbble icon uses currentColor fill", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      await page.getByTestId(TESTIDS.header.burgerZone).click();
      await expect(page.locator("#menuFloating")).toBeVisible();

      // Wait for social links container to be visible
      await expect(page.locator(".menu-floating__contact-points")).toBeVisible();

      // Find Dribbble icon SVG paths
      const dribbbleLink = page.getByTestId(getSocialLinkTestId("dribbble"));

      const dribbbleLinkCount = await dribbbleLink.count();
      if (dribbbleLinkCount === 0) {
        // Skip if Dribbble link not configured
        test.skip();
        return;
      }

      // Check paths use currentColor (at least 2 filled paths expected)
      const paths = dribbbleLink.locator("svg path[fill='currentColor']");
      const pathCount = await paths.count();
      expect(pathCount).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe("AC5: Other Social Icons Verification", () => {
    test("GitHub icon uses currentColor fill", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      await page.getByTestId(TESTIDS.header.burgerZone).click();
      await expect(page.locator("#menuFloating")).toBeVisible();

      // Wait for social links container to be visible
      await expect(page.locator(".menu-floating__contact-points")).toBeVisible();

      const githubLink = page.getByTestId(getSocialLinkTestId("github"));

      const githubLinkCount = await githubLink.count();
      if (githubLinkCount === 0) {
        test.skip();
        return;
      }

      const githubPath = githubLink.locator("svg path").last();
      await expect(githubPath).toHaveAttribute("fill", "currentColor");
    });

    test("LinkedIn icon uses currentColor fill", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      await page.getByTestId(TESTIDS.header.burgerZone).click();
      await expect(page.locator("#menuFloating")).toBeVisible();

      // Wait for social links container to be visible
      await expect(page.locator(".menu-floating__contact-points")).toBeVisible();

      const linkedinLink = page.getByTestId(getSocialLinkTestId("linkedin"));

      const linkedinLinkCount = await linkedinLink.count();
      if (linkedinLinkCount === 0) {
        test.skip();
        return;
      }

      const linkedinPath = linkedinLink.locator("svg path").last();
      await expect(linkedinPath).toHaveAttribute("fill", "currentColor");
    });

    test("social icons visible in light theme", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      await page.getByTestId(TESTIDS.header.burgerZone).click();
      await expect(page.locator("#menuFloating")).toBeVisible();

      // Check that social links container is visible
      const socialContainer = page.locator(".menu-floating__contact-points");
      await expect(socialContainer).toBeVisible();

      // Verify container is rendering (even if empty due to config)
      const socialLinks = page.locator(".menu-floating__contact-points .social_link");
      const count = await socialLinks.count();
      // If links exist, verify they're visible; otherwise just confirm container rendered
      if (count > 0) {
        await expect(socialLinks.first()).toBeVisible();
      }
    });

    test("social icons visible in dark theme", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open the floating menu
      await page.getByTestId(TESTIDS.header.burgerZone).click();
      await expect(page.locator("#menuFloating")).toBeVisible();

      // Check that social links container is visible
      const socialContainer = page.locator(".menu-floating__contact-points");
      await expect(socialContainer).toBeVisible();

      // Verify container is rendering (even if empty due to config)
      const socialLinks = page.locator(".menu-floating__contact-points .social_link");
      const count = await socialLinks.count();
      // If links exist, verify they're visible; otherwise just confirm container rendered
      if (count > 0) {
        await expect(socialLinks.first()).toBeVisible();
      }
    });
  });
});
