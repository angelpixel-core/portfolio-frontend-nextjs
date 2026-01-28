import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Header Nav Breakpoint Tests (Story 12.1)
 *
 * Validates the new nav: breakpoint at 841px where:
 * - Hamburger menu disappears
 * - Full navigation appears
 *
 * New Visibility Matrix (Epic 12):
 * | Breakpoint          | Nav | Burger |
 * |---------------------|-----|--------|
 * | Mobile (0-640px)    | ❌  | ✅     |
 * | Tablet (641-840px)  | ❌  | ✅     |
 * | Nav (841-1024px)    | ✅  | ❌     |
 * | Desktop (1025-1440) | ✅  | ❌     |
 * | Wide (≥1441px)      | ✅  | ❌     |
 *
 * @see docs/layout-system.md for breakpoint definitions
 */

// Critical viewport widths for nav: breakpoint testing
const NAV_BREAKPOINT_VIEWPORTS = {
  // Last viewport with burger (840px)
  lastBurger: { width: 840, height: 800 },
  // First viewport with full nav (841px)
  firstNav: { width: 841, height: 800 },
  // Mid-range nav viewport (900px)
  midNav: { width: 900, height: 800 },
};

test.describe("Nav Breakpoint (Story 12.1)", () => {
  test.describe("Boundary Tests at 840px (last burger)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.lastBurger);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("burger zone is visible at 840px", async ({ page }) => {
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeVisible();
    });

    test("nav zone is hidden at 840px", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeHidden();
    });

    test("brand zone is always visible at 840px", async ({ page }) => {
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);
      await expect(brandZone).toBeVisible();
    });

    test("UI controls zone is visible at 840px (tablet range)", async ({
      page,
    }) => {
      const uiZone = page.getByTestId(TESTIDS.header.uiZone);
      await expect(uiZone).toBeVisible();
    });
  });

  test.describe("Boundary Tests at 841px (first nav)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.firstNav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("burger zone is hidden at 841px", async ({ page }) => {
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeHidden();
    });

    test("nav zone is visible at 841px", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeVisible();
    });

    test("brand zone is always visible at 841px", async ({ page }) => {
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);
      await expect(brandZone).toBeVisible();
    });

    test("UI controls zone is visible at 841px", async ({ page }) => {
      const uiZone = page.getByTestId(TESTIDS.header.uiZone);
      await expect(uiZone).toBeVisible();
    });

    test("social zone is hidden at 841px (only visible at wide)", async ({
      page,
    }) => {
      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      await expect(socialZone).toBeHidden();
    });

    test("auth zone is hidden at 841px (only visible at wide)", async ({
      page,
    }) => {
      const authZone = page.getByTestId(TESTIDS.header.authZone);
      await expect(authZone).toBeHidden();
    });
  });

  test.describe("Transition Tests (AC4)", () => {
    test("840px→841px transition: burger disappears, nav appears", async ({
      page,
    }) => {
      // Start at 840px (last burger viewport)
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.lastBurger);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const navZone = page.getByTestId(TESTIDS.header.navZone);
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);

      // At 840px: nav hidden, burger visible
      await expect(navZone).toBeHidden();
      await expect(burgerZone).toBeVisible();

      // Transition to 841px (first nav viewport)
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.firstNav);
      await page.waitForTimeout(100); // Allow CSS transition

      // At 841px: nav visible, burger hidden
      await expect(navZone).toBeVisible();
      await expect(burgerZone).toBeHidden();
    });

    test("841px→840px transition: nav disappears, burger appears", async ({
      page,
    }) => {
      // Start at 841px (first nav viewport)
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.firstNav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const navZone = page.getByTestId(TESTIDS.header.navZone);
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);

      // At 841px: nav visible, burger hidden
      await expect(navZone).toBeVisible();
      await expect(burgerZone).toBeHidden();

      // Transition to 840px (last burger viewport)
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.lastBurger);
      await page.waitForTimeout(100); // Allow CSS transition

      // At 840px: nav hidden, burger visible
      await expect(navZone).toBeHidden();
      await expect(burgerZone).toBeVisible();
    });

    test("no layout shift during nav transition", async ({ page }) => {
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.lastBurger);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Get brand zone position before transition
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);
      const initialBoundingBox = await brandZone.boundingBox();

      // Transition to nav breakpoint
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.firstNav);
      await page.waitForTimeout(100);

      // Get brand zone position after transition
      const finalBoundingBox = await brandZone.boundingBox();

      // Brand should stay centered (x position relative to viewport center)
      expect(initialBoundingBox).not.toBeNull();
      expect(finalBoundingBox).not.toBeNull();

      // Y position should be stable
      expect(finalBoundingBox!.y).toBe(initialBoundingBox!.y);
    });
  });

  test.describe("Mid-range Nav Viewport (900px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(NAV_BREAKPOINT_VIEWPORTS.midNav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("nav zone is visible at 900px", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeVisible();
    });

    test("burger zone is hidden at 900px", async ({ page }) => {
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeHidden();
    });
  });
});
