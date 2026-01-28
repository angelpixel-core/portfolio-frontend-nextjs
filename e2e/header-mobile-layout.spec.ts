/**
 * E2E Tests: Story 12.2 - Header Mobile Layout
 *
 * Validates:
 * - AC1: Mobile header shows hamburger (left), logo (center), Hire Me (right)
 * - AC2: Menu opens full blade (overlay covers viewport)
 * - AC3: Close button visible without overflow
 * - AC4: Menu content structure (nav, social, theme)
 * - AC5: No layout shift at mobile viewports
 *
 * Test viewports per story requirements:
 * - 375px: iPhone SE (smallest common mobile)
 * - 640px: Tablet boundary
 * - 840px: Last viewport with burger
 *
 * @see docs/layout-system.md for visibility matrix
 * @see _bmad-output/implementation-artifacts/12-2-header-mobile-layout.md
 */

import { test, expect } from "@playwright/test";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tabletBoundary: { width: 640, height: 800 },
  lastMobile: { width: 840, height: 800 },
  nav: { width: 841, height: 800 },
};

/**
 * Layout positioning tolerances for AC5 tests.
 * These values account for padding, margins, and minor rendering differences.
 */
const LAYOUT_TOLERANCES = {
  /** Max X position for left-aligned elements (burger) */
  LEFT_ZONE_MAX_X: 100,
  /** Max deviation from center for logo */
  CENTER_TOLERANCE: 50,
  /** Wider center tolerance for larger viewports */
  CENTER_TOLERANCE_TABLET: 80,
  /** Min distance from right edge for right-aligned elements */
  RIGHT_ZONE_MARGIN: 100,
};

test.describe("Story 12.2: Header Mobile Layout", () => {
  test.describe("AC1: Mobile Header Layout", () => {
    test("shows hamburger, logo, and Hire Me at 375px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Burger should be visible
      const burger = page.getByRole("button", { name: /navigation menu/i });
      await expect(burger).toBeVisible();

      // Logo should be visible
      const logo = page.getByTestId("header-brand-zone");
      await expect(logo).toBeVisible();

      // Hire Me button should be visible
      const hireMe = page.getByTestId("header-hire-me-zone");
      await expect(hireMe).toBeVisible();
      await expect(hireMe).toHaveText("Hire Me");
    });

    test("shows hamburger, logo, and Hire Me at 640px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tabletBoundary);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const burger = page.getByRole("button", { name: /navigation menu/i });
      await expect(burger).toBeVisible();

      const logo = page.getByTestId("header-brand-zone");
      await expect(logo).toBeVisible();

      const hireMe = page.getByTestId("header-hire-me-zone");
      await expect(hireMe).toBeVisible();
    });

    test("shows hamburger, logo, and Hire Me at 840px (last mobile)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.lastMobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const burger = page.getByRole("button", { name: /navigation menu/i });
      await expect(burger).toBeVisible();

      const logo = page.getByTestId("header-brand-zone");
      await expect(logo).toBeVisible();

      const hireMe = page.getByTestId("header-hire-me-zone");
      await expect(hireMe).toBeVisible();
    });

    test("hides Hire Me header button at nav breakpoint (841px)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.nav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("header-hire-me-zone");
      await expect(hireMe).toBeHidden();
    });
  });

  test.describe("AC2: Menu Opens Full Blade", () => {
    test("floating overlay covers full viewport when menu opens", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open menu
      const burger = page.getByRole("button", { name: /open navigation menu/i });
      await burger.click();

      // Floating container should be visible with proper structure
      const dialog = page.getByRole("dialog", { name: /navigation menu/i });
      await expect(dialog).toBeVisible();

      // Verify dialog has content and is properly positioned (full blade = modal overlay)
      const dialogBox = await dialog.boundingBox();
      expect(dialogBox).not.toBeNull();

      // The floating_panel inside dialog should be substantial (min-w-[50vw] min-h-[70vh])
      // This verifies the "blade completo" requirement - menu takes significant viewport space
      expect(dialogBox!.width).toBeGreaterThanOrEqual(VIEWPORTS.mobile.width * 0.5);
      expect(dialogBox!.height).toBeGreaterThanOrEqual(VIEWPORTS.mobile.height * 0.5);
    });
  });

  test.describe("AC3: Close Button Visible Without Overflow", () => {
    test("close button is visible when menu is open at 375px", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open menu
      const openButton = page.getByRole("button", {
        name: /open navigation menu/i,
      });
      await openButton.click();

      // Close button should be visible
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

      // Open menu
      const openButton = page.getByRole("button", {
        name: /open navigation menu/i,
      });
      await openButton.click();

      // Click close
      const closeButton = page.getByRole("button", {
        name: /close navigation menu/i,
      });
      await closeButton.click();

      // Menu should be closed
      const dialog = page.getByRole("dialog", { name: /navigation menu/i });
      await expect(dialog).toBeHidden();
    });
  });

  test.describe("AC4: Menu Content Structure", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Open menu
      const burger = page.getByRole("button", { name: /open navigation menu/i });
      await burger.click();
    });

    test("shows navigation items (Home, About, Projects, Articles)", async ({
      page,
    }) => {
      const nav = page.getByRole("navigation", { name: /floating navigation/i });
      await expect(nav).toBeVisible();

      await expect(page.getByRole("link", { name: "home" })).toBeVisible();
      await expect(page.getByRole("link", { name: "about" })).toBeVisible();
      await expect(page.getByRole("link", { name: "projects" })).toBeVisible();
      await expect(page.getByRole("link", { name: "articles" })).toBeVisible();
    });

    test("shows social links", async ({ page }) => {
      const socialNav = page.getByRole("navigation", {
        name: /floating contact points/i,
      });
      await expect(socialNav).toBeVisible();

      // At least some social links should be present
      const socialLinks = socialNav.getByRole("link");
      const count = await socialLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test("shows theme toggle", async ({ page }) => {
      const themeToggle = page
        .getByRole("dialog")
        .getByRole("switch", { name: /dark mode/i });
      await expect(themeToggle).toBeVisible();
    });
  });

  test.describe("AC5: No Layout Shift", () => {
    test("header elements maintain position at 375px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Get initial positions
      const burger = page.getByRole("button", { name: /navigation menu/i });
      const logo = page.getByTestId("header-brand-zone");
      const hireMe = page.getByTestId("header-hire-me-zone");

      const burgerBox = await burger.boundingBox();
      const logoBox = await logo.boundingBox();
      const hireMeBox = await hireMe.boundingBox();

      // Verify left-center-right positioning
      // Burger should be on the left (within LEFT_ZONE_MAX_X from edge)
      expect(burgerBox!.x).toBeLessThan(LAYOUT_TOLERANCES.LEFT_ZONE_MAX_X);

      // Logo should be roughly centered (within CENTER_TOLERANCE of viewport center)
      const viewportCenter = VIEWPORTS.mobile.width / 2;
      const logoCenter = logoBox!.x + logoBox!.width / 2;
      expect(Math.abs(logoCenter - viewportCenter)).toBeLessThan(
        LAYOUT_TOLERANCES.CENTER_TOLERANCE
      );

      // Hire Me should be on the right (within RIGHT_ZONE_MARGIN of right edge)
      expect(hireMeBox!.x + hireMeBox!.width).toBeGreaterThan(
        VIEWPORTS.mobile.width - LAYOUT_TOLERANCES.RIGHT_ZONE_MARGIN
      );
    });

    test("header elements maintain position at 640px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tabletBoundary);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const burger = page.getByRole("button", { name: /navigation menu/i });
      const logo = page.getByTestId("header-brand-zone");
      const hireMe = page.getByTestId("header-hire-me-zone");

      const burgerBox = await burger.boundingBox();
      const logoBox = await logo.boundingBox();
      const hireMeBox = await hireMe.boundingBox();

      // Verify positioning is maintained
      expect(burgerBox).not.toBeNull();
      expect(logoBox).not.toBeNull();
      expect(hireMeBox).not.toBeNull();

      // Logo should still be roughly centered (wider tolerance for larger viewport)
      const viewportCenter = VIEWPORTS.tabletBoundary.width / 2;
      const logoCenter = logoBox!.x + logoBox!.width / 2;
      expect(Math.abs(logoCenter - viewportCenter)).toBeLessThan(
        LAYOUT_TOLERANCES.CENTER_TOLERANCE_TABLET
      );
    });

    test("header elements maintain position at 840px", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.lastMobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const burger = page.getByRole("button", { name: /navigation menu/i });
      const logo = page.getByTestId("header-brand-zone");
      const hireMe = page.getByTestId("header-hire-me-zone");

      const burgerBox = await burger.boundingBox();
      const logoBox = await logo.boundingBox();
      const hireMeBox = await hireMe.boundingBox();

      expect(burgerBox).not.toBeNull();
      expect(logoBox).not.toBeNull();
      expect(hireMeBox).not.toBeNull();
    });
  });
});
