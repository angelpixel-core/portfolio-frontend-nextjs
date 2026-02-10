import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Header Nav Breakpoint Tests
 *
 * Validates the nav: breakpoint at 800px where:
 * - Mobile elements (logo-menu-trigger, auth, theme) hide
 * - Desktop Menu appears (brand, social, ui zones)
 * - Nav links appear at 880px (inside Menu)
 *
 * Actual Visibility at Boundaries:
 * | Element        | 799px | 800px | 879px | 880px |
 * |----------------|-------|-------|-------|-------|
 * | LogoTrigger    | ✅    | ❌    | ❌    | ❌    |
 * | Menu (brand)   | ❌    | ✅    | ✅    | ✅    |
 * | Nav zone       | ❌    | ❌    | ❌    | ✅    |
 */

const BOUNDARY_VIEWPORTS = {
  lastMobile: { width: 799, height: 800 },
  firstNav: { width: 800, height: 800 },
  lastNavCompact: { width: 879, height: 800 },
  firstNavFull: { width: 880, height: 800 },
  midDesktop: { width: 1000, height: 800 },
};

test.describe("Nav Breakpoint (800px)", () => {
  test.describe("Boundary Tests at 799px (last mobile)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(BOUNDARY_VIEWPORTS.lastMobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("logo-menu-trigger is visible at 799px", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeVisible();
    });

    test("nav zone is hidden at 799px", async ({ page }) => {
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeHidden();
    });

    test("brand zone is hidden at 799px (Menu not visible)", async ({
      page,
    }) => {
      await expect(page.getByTestId(TESTIDS.header.brandZone)).toBeHidden();
    });
  });

  test.describe("Boundary Tests at 800px (first nav)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(BOUNDARY_VIEWPORTS.firstNav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("logo-menu-trigger is hidden at 800px", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeHidden();
    });

    test("brand zone is visible at 800px", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.brandZone)
      ).toBeVisible();
    });

    test("social zone is visible at 800px", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.socialZone)
      ).toBeVisible();
    });

    test("UI controls zone is visible at 800px", async ({ page }) => {
      await expect(page.getByTestId(TESTIDS.header.uiZone)).toBeVisible();
    });

    test("nav zone is hidden at 800px (shows at 880px)", async ({ page }) => {
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeHidden();
    });
  });

  test.describe("Transition Tests", () => {
    test("799→800: mobile hides, Menu appears", async ({ page }) => {
      await page.setViewportSize(BOUNDARY_VIEWPORTS.lastMobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const logoTrigger = page.getByTestId(TESTIDS.header.logoMenuTrigger);
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);

      await expect(logoTrigger).toBeVisible();
      await expect(brandZone).toBeHidden();

      await page.setViewportSize(BOUNDARY_VIEWPORTS.firstNav);
      await page.waitForTimeout(100);

      await expect(logoTrigger).toBeHidden();
      await expect(brandZone).toBeVisible();
    });

    test("800→799: Menu hides, mobile appears", async ({ page }) => {
      await page.setViewportSize(BOUNDARY_VIEWPORTS.firstNav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const logoTrigger = page.getByTestId(TESTIDS.header.logoMenuTrigger);
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);

      await expect(logoTrigger).toBeHidden();
      await expect(brandZone).toBeVisible();

      await page.setViewportSize(BOUNDARY_VIEWPORTS.lastMobile);
      await page.waitForTimeout(100);

      await expect(logoTrigger).toBeVisible();
      await expect(brandZone).toBeHidden();
    });

    test("879→880: nav zone appears", async ({ page }) => {
      await page.setViewportSize(BOUNDARY_VIEWPORTS.lastNavCompact);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeHidden();

      await page.setViewportSize(BOUNDARY_VIEWPORTS.firstNavFull);
      await page.waitForTimeout(100);

      await expect(navZone).toBeVisible();
    });

    test("no layout shift during nav transition", async ({ page }) => {
      await page.setViewportSize(BOUNDARY_VIEWPORTS.lastMobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const container = page.getByTestId(TESTIDS.header.container);
      const initialBox = await container.boundingBox();

      await page.setViewportSize(BOUNDARY_VIEWPORTS.firstNav);
      await page.waitForTimeout(100);

      const finalBox = await container.boundingBox();

      expect(initialBox).not.toBeNull();
      expect(finalBox).not.toBeNull();
      // Header container Y position should be stable
      expect(finalBox!.y).toBe(initialBox!.y);
    });
  });

  test.describe("Mid-range Desktop (1000px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(BOUNDARY_VIEWPORTS.midDesktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("all Menu zones are visible at 1000px", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.brandZone)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeVisible();
      await expect(
        page.getByTestId(TESTIDS.header.socialZone)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.uiZone)).toBeVisible();
    });

    test("mobile elements are hidden at 1000px", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeHidden();
    });
  });
});
