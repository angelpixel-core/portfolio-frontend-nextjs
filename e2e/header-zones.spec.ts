import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Header Zone Tests (Story 11.2)
 *
 * Validates that header zones are properly identified with data-testid attributes.
 * This enables reliable E2E testing of header visibility rules in Story 11.3+.
 *
 * Zone Definitions (from Epic 11):
 * - Brand: Logo (center)
 * - Primary Nav: Home/About/Projects/Articles links
 * - Social: GitHub/LinkedIn/Twitter etc. links
 * - Auth: Sign-in buttons (LinkedIn/Microsoft/Google)
 * - UI Controls: ThemeButton
 * - Burger: Mobile menu button
 *
 * NOTE: Current visibility uses LEGACY inverted breakpoints (lg: = max-width: 1023px).
 * This means Menu shows on mobile/tablet, hides on desktop. Story 11.3/11.4 will fix this.
 * These tests verify testids exist in the DOM, using viewports where zones are visible.
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

  test.describe("Menu Zones (visible at tablet viewport due to legacy breakpoints)", () => {
    test.beforeEach(async ({ page }) => {
      // IMPORTANT: Legacy breakpoints use max-width (inverted from standard Tailwind).
      // Menu uses `lg:flex` which means visible at ≤1023px, hidden at >1023px.
      // Using 800px ensures Menu is visible for zone testid verification.
      await page.setViewportSize({ width: 800, height: 600 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("primary nav zone has data-testid", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeVisible();
    });

    test("social zone has data-testid", async ({ page }) => {
      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      await expect(socialZone).toBeVisible();
    });

    test("auth zone has data-testid", async ({ page }) => {
      const authZone = page.getByTestId(TESTIDS.header.authZone);
      await expect(authZone).toBeVisible();
    });

    test("UI controls zone has data-testid", async ({ page }) => {
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
      // Using toBeAttached() because legacy breakpoints may affect visibility.
      // Story 11.3 will implement correct visibility rules; this test confirms
      // the data-testid exists for future viewport-based visibility tests.
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeAttached();
    });
  });
});
