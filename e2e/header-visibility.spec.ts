import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Header Zone Visibility Tests
 *
 * Validates that header elements show/hide according to actual CSS breakpoints.
 *
 * Actual Visibility Matrix:
 * | Breakpoint              | LogoTrigger | MobileAuth | MobileTheme | TabletSocial | Brand | Nav  | Social | UI  |
 * |-------------------------|-------------|------------|-------------|--------------|-------|------|--------|-----|
 * | Mobile (0-719px)        | ✅          | ✅         | ✅          | ❌           | ❌    | ❌   | ❌     | ❌  |
 * | Tablet (720-799px)      | ✅          | ✅         | ✅          | ✅           | ❌    | ❌   | ❌     | ❌  |
 * | Nav (800-879px)         | ❌          | ❌         | ❌          | ❌           | ✅    | ❌   | ✅     | ✅  |
 * | Desktop (880px+)        | ❌          | ❌         | ❌          | ❌           | ✅    | ✅   | ✅     | ✅  |
 *
 * Key CSS breakpoints:
 * - 720px: tablet social links appear (absolute centered)
 * - nav: (800px): mobile elements hide, Menu component appears (brand + social + ui)
 * - 880px: nav links appear inside Menu
 */

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 720, height: 1024 },
  nav: { width: 850, height: 800 },
  desktop: { width: 1280, height: 800 },
  wide: { width: 1920, height: 1080 },
};

test.describe("Header Zone Visibility", () => {
  test.describe("Mobile Viewport (375px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("mobile elements are visible", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeVisible();
      await expect(
        page.getByTestId(TESTIDS.header.mobileAuth)
      ).toBeVisible();
      await expect(
        page.getByTestId(TESTIDS.header.mobileTheme)
      ).toBeVisible();
    });

    test("tablet social is hidden below 720px", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.tabletSocial)
      ).toBeHidden();
    });

    test("desktop Menu zones are hidden", async ({ page }) => {
      await expect(page.getByTestId(TESTIDS.header.brandZone)).toBeHidden();
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.socialZone)
      ).toBeHidden();
      await expect(page.getByTestId(TESTIDS.header.uiZone)).toBeHidden();
    });
  });

  test.describe("Tablet Viewport (720px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("mobile elements remain visible", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeVisible();
      await expect(
        page.getByTestId(TESTIDS.header.mobileAuth)
      ).toBeVisible();
      await expect(
        page.getByTestId(TESTIDS.header.mobileTheme)
      ).toBeVisible();
    });

    test("tablet social appears at 720px", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.tabletSocial)
      ).toBeVisible();
    });

    test("desktop Menu zones are still hidden", async ({ page }) => {
      await expect(page.getByTestId(TESTIDS.header.brandZone)).toBeHidden();
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.socialZone)
      ).toBeHidden();
      await expect(page.getByTestId(TESTIDS.header.uiZone)).toBeHidden();
    });
  });

  test.describe("Nav Viewport (850px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.nav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("mobile elements are hidden", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.mobileAuth)
      ).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.mobileTheme)
      ).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.tabletSocial)
      ).toBeHidden();
    });

    test("Menu brand, social, and UI zones are visible", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.brandZone)
      ).toBeVisible();
      await expect(
        page.getByTestId(TESTIDS.header.socialZone)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.uiZone)).toBeVisible();
    });

    test("nav zone is still hidden (appears at 880px)", async ({ page }) => {
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeHidden();
    });
  });

  test.describe("Desktop Viewport (1280px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("all Menu zones are visible", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.brandZone)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeVisible();
      await expect(
        page.getByTestId(TESTIDS.header.socialZone)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.uiZone)).toBeVisible();
    });

    test("mobile elements are hidden", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.mobileAuth)
      ).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.mobileTheme)
      ).toBeHidden();
    });
  });

  test.describe("Wide Viewport (1920px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.wide);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("all Menu zones are visible", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.brandZone)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeVisible();
      await expect(
        page.getByTestId(TESTIDS.header.socialZone)
      ).toBeVisible();
      await expect(page.getByTestId(TESTIDS.header.uiZone)).toBeVisible();
    });

    test("mobile elements are hidden", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.mobileAuth)
      ).toBeHidden();
      await expect(
        page.getByTestId(TESTIDS.header.mobileTheme)
      ).toBeHidden();
    });
  });

  test.describe("Breakpoint Transitions", () => {
    test("719→720: tablet social appears", async ({ page }) => {
      await page.setViewportSize({ width: 719, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByTestId(TESTIDS.header.tabletSocial)
      ).toBeHidden();

      await page.setViewportSize({ width: 720, height: 800 });
      await page.waitForTimeout(100);

      await expect(
        page.getByTestId(TESTIDS.header.tabletSocial)
      ).toBeVisible();
    });

    test("799→800: mobile hides, Menu appears", async ({ page }) => {
      await page.setViewportSize({ width: 799, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const logoTrigger = page.getByTestId(TESTIDS.header.logoMenuTrigger);
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);

      await expect(logoTrigger).toBeVisible();
      await expect(brandZone).toBeHidden();

      await page.setViewportSize({ width: 800, height: 800 });
      await page.waitForTimeout(100);

      await expect(logoTrigger).toBeHidden();
      await expect(brandZone).toBeVisible();
    });

    test("879→880: nav zone appears", async ({ page }) => {
      await page.setViewportSize({ width: 879, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeHidden();

      await page.setViewportSize({ width: 880, height: 800 });
      await page.waitForTimeout(100);

      await expect(navZone).toBeVisible();
    });
  });
});
