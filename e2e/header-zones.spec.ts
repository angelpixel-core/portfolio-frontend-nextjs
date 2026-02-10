import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Header Zone Identification Tests
 *
 * Validates that header zones have proper data-testid attributes.
 * Tests both mobile elements and desktop Menu zones.
 *
 * Mobile elements (<800px): logoMenuTrigger, mobileAuth, mobileTheme, tabletSocial
 * Desktop Menu zones (≥800px): brandZone, navZone, socialZone, uiZone
 */

test.describe("Header Zone Identification", () => {
  test("header container has data-testid", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId(TESTIDS.header.container)).toBeVisible();
  });

  test.describe("Mobile Elements (<800px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("logo-menu-trigger has data-testid", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.logoMenuTrigger)
      ).toBeVisible();
    });

    test("mobile-auth has data-testid", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.mobileAuth)
      ).toBeVisible();
    });

    test("mobile-theme has data-testid", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.mobileTheme)
      ).toBeVisible();
    });
  });

  test("tablet-social has data-testid (visible at 720px+)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 720, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByTestId(TESTIDS.header.tabletSocial)
    ).toBeVisible();
  });

  test.describe("Desktop Menu Zones (≥800px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("brand zone has data-testid", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.brandZone)
      ).toBeVisible();
    });

    test("nav zone has data-testid (visible at 880px+)", async ({ page }) => {
      await expect(page.getByTestId(TESTIDS.header.navZone)).toBeVisible();
    });

    test("social zone has data-testid", async ({ page }) => {
      await expect(
        page.getByTestId(TESTIDS.header.socialZone)
      ).toBeVisible();
    });

    test("UI controls zone has data-testid", async ({ page }) => {
      await expect(page.getByTestId(TESTIDS.header.uiZone)).toBeVisible();
    });
  });
});
