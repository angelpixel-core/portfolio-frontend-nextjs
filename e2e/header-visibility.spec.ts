import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Header Zone Visibility Tests (Story 11.3, updated Story 12.1, Story 12.3)
 *
 * Validates that header zones show/hide according to the visibility matrix
 * defined in docs/layout-system.md.
 *
 * Visibility Matrix (Updated Story 12.3):
 * | Breakpoint          | Brand | Nav | Social | Auth | Theme | Burger |
 * |---------------------|-------|-----|--------|------|-------|--------|
 * | Mobile (0-640px)    | ✅    | ❌  | ❌     | ❌   | ❌    | ✅     |
 * | Tablet (641-840px)  | ✅    | ❌  | ❌     | ❌   | ✅    | ✅     |
 * | Nav (841-1024px)    | ✅    | ✅  | ✅     | ❌   | ✅    | ❌     |
 * | Desktop (1025-1440) | ✅    | ✅  | ✅     | ✅   | ✅    | ❌     |
 * | Wide (≥1441px)      | ✅    | ✅  | ✅     | ✅   | ✅    | ❌     |
 *
 * Story 12.3 changes:
 * - Social: visible at nav+ (841px+) instead of wide only
 * - Auth: visible at desktop+ (1025px+) instead of wide only
 *
 * Uses semantic breakpoints: tablet: 641px, nav: 841px, desktop: 1025px, wide: 1441px
 */

// Viewport configurations matching docs/layout-system.md
// Updated Story 12.1: tablet range is now 641-840px (nav appears at 841px)
const VIEWPORTS = {
  mobile: { width: 375, height: 667 }, // 0-640px range
  tablet: { width: 720, height: 1024 }, // 641-840px range (updated: was 768, now < 841 nav breakpoint)
  nav: { width: 900, height: 800 }, // 841-1024px range (Story 12.1: nav breakpoint)
  desktop: { width: 1280, height: 800 }, // 1025-1440px range
  wide: { width: 1920, height: 1080 }, // ≥1441px range
};

test.describe("Header Zone Visibility (Story 11.3)", () => {
  test.describe("Mobile Viewport (0-640px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("nav zone is hidden on mobile", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeHidden();
    });

    test("social zone is hidden on mobile", async ({ page }) => {
      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      await expect(socialZone).toBeHidden();
    });

    test("auth zone is hidden on mobile", async ({ page }) => {
      const authZone = page.getByTestId(TESTIDS.header.authZone);
      await expect(authZone).toBeHidden();
    });

    test("UI controls zone is hidden on mobile", async ({ page }) => {
      const uiZone = page.getByTestId(TESTIDS.header.uiZone);
      await expect(uiZone).toBeHidden();
    });

    test("burger zone is visible on mobile", async ({ page }) => {
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeVisible();
    });

    test("brand zone is always visible", async ({ page }) => {
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);
      await expect(brandZone).toBeVisible();
    });
  });

  test.describe("Tablet Viewport (641-840px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("nav zone is hidden on tablet", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeHidden();
    });

    test("social zone is hidden on tablet", async ({ page }) => {
      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      await expect(socialZone).toBeHidden();
    });

    test("auth zone is hidden on tablet", async ({ page }) => {
      const authZone = page.getByTestId(TESTIDS.header.authZone);
      await expect(authZone).toBeHidden();
    });

    test("UI controls zone is visible on tablet", async ({ page }) => {
      const uiZone = page.getByTestId(TESTIDS.header.uiZone);
      await expect(uiZone).toBeVisible();
    });

    test("burger zone is visible on tablet", async ({ page }) => {
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeVisible();
    });

    test("brand zone is visible on tablet", async ({ page }) => {
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);
      await expect(brandZone).toBeVisible();
    });
  });

  test.describe("Nav Viewport (841-1024px) - Story 12.1, 12.3", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.nav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("nav zone is visible on nav viewport", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeVisible();
    });

    test("social zone is visible on nav viewport (Story 12.3)", async ({
      page,
    }) => {
      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      await expect(socialZone).toBeVisible();
    });

    test("auth zone is hidden on nav viewport", async ({ page }) => {
      const authZone = page.getByTestId(TESTIDS.header.authZone);
      await expect(authZone).toBeHidden();
    });

    test("UI controls zone is visible on nav viewport", async ({ page }) => {
      const uiZone = page.getByTestId(TESTIDS.header.uiZone);
      await expect(uiZone).toBeVisible();
    });

    test("burger zone is hidden on nav viewport", async ({ page }) => {
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeHidden();
    });

    test("brand zone is visible on nav viewport", async ({ page }) => {
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);
      await expect(brandZone).toBeVisible();
    });
  });

  test.describe("Desktop Viewport (1025-1440px) - Story 12.3", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("nav zone is visible on desktop", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeVisible();
    });

    test("social zone is visible on desktop (Story 12.3)", async ({ page }) => {
      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      await expect(socialZone).toBeVisible();
    });

    test("auth zone is visible on desktop (Story 12.3)", async ({ page }) => {
      const authZone = page.getByTestId(TESTIDS.header.authZone);
      await expect(authZone).toBeVisible();
    });

    test("UI controls zone is visible on desktop", async ({ page }) => {
      const uiZone = page.getByTestId(TESTIDS.header.uiZone);
      await expect(uiZone).toBeVisible();
    });

    test("burger zone is hidden on desktop", async ({ page }) => {
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeHidden();
    });

    test("brand zone is visible on desktop", async ({ page }) => {
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);
      await expect(brandZone).toBeVisible();
    });
  });

  test.describe("Wide Viewport (≥1441px)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.wide);
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    });

    test("nav zone is visible on wide", async ({ page }) => {
      const navZone = page.getByTestId(TESTIDS.header.navZone);
      await expect(navZone).toBeVisible();
    });

    test("social zone is visible on wide", async ({ page }) => {
      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      await expect(socialZone).toBeVisible();
    });

    test("auth zone is visible on wide", async ({ page }) => {
      const authZone = page.getByTestId(TESTIDS.header.authZone);
      await expect(authZone).toBeVisible();
    });

    test("UI controls zone is visible on wide", async ({ page }) => {
      const uiZone = page.getByTestId(TESTIDS.header.uiZone);
      await expect(uiZone).toBeVisible();
    });

    test("burger zone is hidden on wide", async ({ page }) => {
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);
      await expect(burgerZone).toBeHidden();
    });

    test("brand zone is visible on wide", async ({ page }) => {
      const brandZone = page.getByTestId(TESTIDS.header.brandZone);
      await expect(brandZone).toBeVisible();
    });
  });

  test.describe("Breakpoint Transitions (AC4)", () => {
    test("tablet→nav transition shows nav, hides burger (Story 12.1)", async ({
      page,
    }) => {
      // Start at tablet (840px) - last viewport with burger
      await page.setViewportSize({ width: 840, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const navZone = page.getByTestId(TESTIDS.header.navZone);
      const burgerZone = page.getByTestId(TESTIDS.header.burgerZone);

      // At tablet (840px): nav hidden, burger visible
      await expect(navZone).toBeHidden();
      await expect(burgerZone).toBeVisible();

      // Transition to nav breakpoint (841px)
      await page.setViewportSize({ width: 841, height: 800 });
      await page.waitForTimeout(100); // Allow CSS transition

      // At nav (841px): nav visible, burger hidden
      await expect(navZone).toBeVisible();
      await expect(burgerZone).toBeHidden();
    });

    test("nav→desktop transition shows auth zone (Story 12.3)", async ({
      page,
    }) => {
      // Start at nav (1024px) - last nav viewport
      await page.setViewportSize({ width: 1024, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const socialZone = page.getByTestId(TESTIDS.header.socialZone);
      const authZone = page.getByTestId(TESTIDS.header.authZone);

      // At nav: social visible, auth hidden (Story 12.3)
      await expect(socialZone).toBeVisible();
      await expect(authZone).toBeHidden();

      // Transition to desktop (1025px)
      await page.setViewportSize({ width: 1025, height: 800 });
      await page.waitForTimeout(100); // Allow CSS transition

      // At desktop: social and auth visible (Story 12.3)
      await expect(socialZone).toBeVisible();
      await expect(authZone).toBeVisible();
    });

    test("mobile→tablet transition shows theme button", async ({ page }) => {
      // Start at mobile (640px)
      await page.setViewportSize({ width: 640, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const uiZone = page.getByTestId(TESTIDS.header.uiZone);

      // At mobile: UI controls hidden
      await expect(uiZone).toBeHidden();

      // Transition to tablet (641px)
      await page.setViewportSize({ width: 641, height: 800 });
      await page.waitForTimeout(100); // Allow CSS transition

      // At tablet: UI controls visible
      await expect(uiZone).toBeVisible();
    });

    test("tablet→nav transition shows social zone (Story 12.3)", async ({
      page,
    }) => {
      // Start at tablet (840px) - last tablet viewport
      await page.setViewportSize({ width: 840, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const socialZone = page.getByTestId(TESTIDS.header.socialZone);

      // At tablet: social hidden
      await expect(socialZone).toBeHidden();

      // Transition to nav (841px)
      await page.setViewportSize({ width: 841, height: 800 });
      await page.waitForTimeout(100); // Allow CSS transition

      // At nav: social visible (Story 12.3)
      await expect(socialZone).toBeVisible();
    });
  });
});
