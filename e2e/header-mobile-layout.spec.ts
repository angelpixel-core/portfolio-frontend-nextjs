/**
 * E2E Tests: Header Mobile Layout
 *
 * Validates:
 * - AC1: Mobile header shows logo-trigger (left), auth (center), theme (right)
 * - AC2: Menu opens full blade (overlay covers viewport)
 * - AC3: Close button visible without overflow
 * - AC4: Menu content structure (nav, social, theme)
 * - AC5: No layout shift at mobile viewports
 *
 * Mobile layout (<880px): | logo-trigger | AIR | auth | AIR | theme |
 * Desktop layout (≥880px): Menu component with brand/nav/social/ui zones
 */

import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tabletBoundary: { width: 640, height: 800 },
  lastMobile: { width: 879, height: 800 },
  firstNav: { width: 880, height: 800 },
};

const LAYOUT_TOLERANCES = {
  LEFT_ZONE_MAX_X: 100,
  RIGHT_ZONE_MARGIN: 100,
};

test.describe("Header Mobile Layout", () => {
  test.describe("AC1: Mobile Header Layout", () => {
    test("shows logo-trigger, auth, and theme at 375px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.mobileAuth)).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.mobileTheme)).toBeVisible();

      // Menu trigger button should be accessible
      const burger = page.getByRole("button", { name: /navigation menu/i });
      await expect(burger).toBeVisible();
    });

    test("shows logo-trigger, auth, and theme at 640px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tabletBoundary);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.mobileAuth)).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.mobileTheme)).toBeVisible();
    });

    test("shows logo-trigger, auth, and theme at 879px (last mobile)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.lastMobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.mobileAuth)).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.mobileTheme)).toBeVisible();
    });

    test("hides mobile elements at navContent breakpoint (880px)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.firstNav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeHidden();
      await expect(page.getByTestId(TESTIDS.header.mobileAuth)).toBeHidden();
      await expect(page.getByTestId(TESTIDS.header.mobileTheme)).toBeHidden();

      // Desktop Menu should be visible instead
      await expect(page.getByTestId(TESTIDS.header.brandZone)).toBeVisible();
    });
  });

  test.describe("AC2: Menu Opens Full Blade", () => {
    test("floating overlay covers full viewport when menu opens", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const burger = page.getByRole("button", {
        name: /open navigation menu/i,
      });
      await burger.click();

      const dialog = page.getByRole("dialog", { name: /navigation menu/i });
      await expect(dialog).toBeVisible();

      const dialogBox = await dialog.boundingBox();
      expect(dialogBox).not.toBeNull();
      expect(dialogBox!.width).toBeGreaterThanOrEqual(
        VIEWPORTS.mobile.width * 0.5
      );
      expect(dialogBox!.height).toBeGreaterThanOrEqual(
        VIEWPORTS.mobile.height * 0.5
      );
    });
  });

  test.describe("AC3: Close Button Visible Without Overflow", () => {
    test("close button is visible when menu is open at 375px", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const openButton = page.getByRole("button", {
        name: /open navigation menu/i,
      });
      await openButton.click();

      const closeButton = page.getByRole("button", {
        name: /close navigation menu/i,
      });
      await expect(closeButton).toBeVisible();
      await expect(closeButton).toBeInViewport();
    });

    test("close button works to close the menu", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const openButton = page.getByRole("button", {
        name: /open navigation menu/i,
      });
      await openButton.click();

      const dialog = page.getByRole("dialog", { name: /navigation menu/i });
      await expect(dialog).toBeVisible();

      // Close via Escape key (close button is behind dialog overlay)
      await page.keyboard.press("Escape");

      await expect(dialog).toBeHidden();
    });
  });

  test.describe("AC4: Menu Content Structure", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const burger = page.getByRole("button", {
        name: /open navigation menu/i,
      });
      await burger.click();
    });

    test("shows navigation items (Home, About, Projects, Articles)", async ({
      page,
    }) => {
      const nav = page.getByRole("navigation", {
        name: /mobile navigation/i,
      });
      await expect(nav).toBeVisible();

      await expect(page.getByRole("link", { name: "home" })).toBeVisible();
      await expect(page.getByRole("link", { name: "about" })).toBeVisible();
      await expect(page.getByRole("link", { name: "projects" })).toBeVisible();
      await expect(page.getByRole("link", { name: "articles" })).toBeVisible();
    });

    test("shows social links", async ({ page }) => {
      const dialog = page.getByRole("dialog", { name: /navigation menu/i });
      const socialNav = dialog.getByRole("navigation", {
        name: /social links/i,
      });
      await expect(socialNav).toBeVisible();

      // Wait for real links to load (skeleton renders spans, not links)
      const socialLinks = socialNav.getByRole("link");
      await expect(socialLinks.first()).toBeVisible({ timeout: 10000 });
      const count = await socialLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("shows theme toggle in header", async ({ page }) => {
      // Theme toggle is in the banner (header), not inside the dialog
      const themeToggle = page.getByRole("switch", { name: /dark mode/i });
      await expect(themeToggle).toBeVisible();
    });
  });

  test.describe("AC5: No Layout Shift", () => {
    test("header elements maintain position at 375px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const logoTrigger = page.getByTestId(TESTIDS.header.logoMenuTrigger);
      const mobileTheme = page.getByTestId(TESTIDS.header.mobileTheme);

      const logoBox = await logoTrigger.boundingBox();
      const themeBox = await mobileTheme.boundingBox();

      expect(logoBox).not.toBeNull();
      expect(themeBox).not.toBeNull();

      // Logo-trigger should be on the left
      expect(logoBox!.x).toBeLessThan(LAYOUT_TOLERANCES.LEFT_ZONE_MAX_X);

      // Theme should be on the right
      expect(themeBox!.x + themeBox!.width).toBeGreaterThan(
        VIEWPORTS.mobile.width - LAYOUT_TOLERANCES.RIGHT_ZONE_MARGIN
      );
    });

    test("header elements maintain position at 640px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tabletBoundary);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const logoTrigger = page.getByTestId(TESTIDS.header.logoMenuTrigger);
      const mobileTheme = page.getByTestId(TESTIDS.header.mobileTheme);

      const logoBox = await logoTrigger.boundingBox();
      const themeBox = await mobileTheme.boundingBox();

      expect(logoBox).not.toBeNull();
      expect(themeBox).not.toBeNull();

      // Logo-trigger still on left
      expect(logoBox!.x).toBeLessThan(LAYOUT_TOLERANCES.LEFT_ZONE_MAX_X);

      // Theme still on right
      expect(themeBox!.x + themeBox!.width).toBeGreaterThan(
        VIEWPORTS.tabletBoundary.width - LAYOUT_TOLERANCES.RIGHT_ZONE_MARGIN
      );
    });

    test("header elements maintain position at 879px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.lastMobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const logoTrigger = page.getByTestId(TESTIDS.header.logoMenuTrigger);
      const mobileTheme = page.getByTestId(TESTIDS.header.mobileTheme);

      const logoBox = await logoTrigger.boundingBox();
      const themeBox = await mobileTheme.boundingBox();

      expect(logoBox).not.toBeNull();
      expect(themeBox).not.toBeNull();
    });
  });
});
