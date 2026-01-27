import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Header Zone Tests (Story 11.2, updated for Story 11.3)
 *
 * Validates that header zones are properly identified with data-testid attributes.
 * This enables reliable E2E testing of header visibility rules.
 *
 * Zone Definitions (from Epic 11):
 * - Brand: Logo (center) - always visible
 * - Primary Nav: Home/About/Projects/Articles links - desktop+ (≥1025px)
 * - Social: GitHub/LinkedIn/Twitter etc. links - wide (≥1441px)
 * - Auth: Sign-in buttons (LinkedIn/Microsoft/Google) - wide (≥1441px)
 * - UI Controls: ThemeButton - tablet+ (≥641px)
 * - Burger: Mobile menu button - mobile/tablet (<1025px)
 *
 * Uses semantic min-width breakpoints (Story 11.3):
 * - tablet: 641px
 * - desktop: 1025px
 * - wide: 1441px
 */

test.describe("Header Zone Identification (Story 11.2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("header container has data-testid", async ({ page }) => {
    const header = page.getByTestId(TESTIDS.header.container);
    await expect(header).toBeVisible();
  });

  test("brand zone has data-testid", async ({ page }) => {
    const brandZone = page.getByTestId(TESTIDS.header.brandZone);
    await expect(brandZone).toBeVisible();
  });

  test.describe("Menu Zones (semantic breakpoints - Story 11.3)", () => {
    test("primary nav zone has data-testid (visible at desktop+)", async ({
      page,
    }) => {
      // Nav visible at desktop (≥1025px)
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeVisible();
    });

    test("social zone has data-testid (visible at wide)", async ({ page }) => {
      // Social visible at wide (≥1441px)
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      await expect(socialZone).toBeVisible();
    });

    test("auth zone has data-testid (visible at wide)", async ({ page }) => {
      // Auth visible at wide (≥1441px)
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const authZone = page.getByTestId(TESTIDS.header.authZone);
      await expect(authZone).toBeVisible();
    });

    test("UI controls zone has data-testid (visible at tablet+)", async ({
      page,
    }) => {
      // UI controls visible at tablet (≥641px)
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const uiZone = page.getByTestId(TESTIDS.header.uiZone);
      await expect(uiZone).toBeVisible();
    });
  });

  test.describe("Burger Zone", () => {
    test.beforeEach(async ({ page }) => {
      // Using mobile viewport where burger is definitely visible
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("burger zone has data-testid and is in DOM", async ({ page }) => {
      // Story 11.2: Verify testid exists; visibility tests are in header-visibility.spec.ts
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeAttached();
    });
  });
});
