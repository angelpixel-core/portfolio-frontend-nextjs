/**
 * Home Secondary Blade Tests (Story 12.7)
 *
 * Tests for AC1-AC5:
 * - AC1: Secondary blade contains correct elements
 * - AC2: Secondary blade occupies viewport
 * - AC3: Scroll feels like blade change
 * - AC4: CustomersSlider is visible and functional
 * - AC5: Footer is complete in secondary blade
 *
 * @see _bmad-output/implementation-artifacts/stories/epic-12/12-7-home-secondary-blade-scroll.md
 * @see docs/layout-system.md
 */

import { test, expect } from "@playwright/test";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

test.describe("Home Secondary Blade Structure (Story 12.7)", () => {
  test.describe("AC1: Secondary Blade Contains Correct Elements", () => {
    test("secondary blade exists with correct testid", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const secondaryBlade = page.getByTestId("home-secondary-blade");
      await expect(secondaryBlade).toBeVisible();
    });

    test("CustomersSlider is inside secondary blade", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const secondaryBlade = page.getByTestId("home-secondary-blade");
      const slider = secondaryBlade.locator(".slider");

      // Slider should be inside secondary blade
      await expect(slider).toBeVisible();
    });

    test("Footer is inside secondary blade", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const secondaryBlade = page.getByTestId("home-secondary-blade");
      
      // Scroll to secondary blade to ensure Footer is visible
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForFunction(
        () => window.scrollY >= window.innerHeight * 0.5
      );

      // Footer should be inside secondary blade (FR15 requirement)
      const footer = secondaryBlade.locator("footer");
      await expect(footer).toBeVisible();
      await expect(footer).toHaveCount(1);
    });

    test("Footer from global layout is hidden on Home page", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Footer from global layout should be hidden via CSS display:none
      // The element exists in DOM but is not visible (FR15 compliance)
      const layout = page.locator(".layout");
      const globalFooter = layout.locator("> footer");

      // Global Footer should be hidden (display: none) on Home page
      // CSS rule: .layout:has(.main_home) > footer { display: none; }
      await expect(globalFooter).toBeHidden();

      // Verify Footer exists and is visible inside secondary blade
      const secondaryBlade = page.getByTestId("home-secondary-blade");
      const bladeFooter = secondaryBlade.locator("footer");
      await expect(bladeFooter).toBeVisible();
    });

    test("secondary blade does not contain hero content", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const secondaryBlade = page.getByTestId("home-secondary-blade");

      // Hero elements should NOT be in secondary blade
      const heroImage = secondaryBlade.getByTestId("profile-hero-image");
      await expect(heroImage).toHaveCount(0);

      const homeTitle = secondaryBlade.locator(".home_title");
      await expect(homeTitle).toHaveCount(0);
    });
  });

  test.describe("AC2: Secondary Blade Occupies Viewport", () => {
    test("secondary blade has full viewport height on mobile", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const secondaryBlade = page.getByTestId("home-secondary-blade");
      const bladeHeight = await secondaryBlade.evaluate(
        (el) => el.offsetHeight
      );
      const viewportHeight = VIEWPORTS.mobile.height;

      // Secondary blade should occupy full viewport per FR16
      expect(bladeHeight).toBeGreaterThanOrEqual(viewportHeight * 0.9); // Allow 10% tolerance
    });

    test("secondary blade has full viewport height on desktop", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const secondaryBlade = page.getByTestId("home-secondary-blade");
      const bladeHeight = await secondaryBlade.evaluate(
        (el) => el.offsetHeight
      );
      const viewportHeight = VIEWPORTS.desktop.height;

      // Secondary blade should occupy full viewport per FR16
      expect(bladeHeight).toBeGreaterThanOrEqual(viewportHeight * 0.9); // Allow 10% tolerance
    });
  });

  test.describe("AC3: Scroll Feels Like Blade Change", () => {
    test("secondary blade is not visible in initial viewport on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Hero blade should be visible initially
      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeInViewport();

      // Secondary blade should NOT be in initial viewport
      const secondaryBlade = page.getByTestId("home-secondary-blade");
      await expect(secondaryBlade).not.toBeInViewport();
    });

    test("scrolling reveals secondary blade", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll down past hero blade
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForFunction(
        () => window.scrollY >= window.innerHeight * 0.5
      );

      // Secondary blade should now be visible
      const secondaryBlade = page.getByTestId("home-secondary-blade");
      await expect(secondaryBlade).toBeInViewport();
    });

    test("secondary blade has visual separation from hero", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const secondaryBlade = page.getByTestId("home-secondary-blade");

      // Check that secondary blade has border-top (visual separation)
      const borderTop = await secondaryBlade.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.borderTopWidth;
      });

      // Should have a border (1px or more)
      expect(parseInt(borderTop)).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("AC4: CustomersSlider Visibility", () => {
    test("CustomersSlider is visible when scrolled to secondary blade", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll to secondary blade
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForFunction(
        () => window.scrollY >= window.innerHeight * 0.5
      );

      const slider = page.locator(".slider");
      await expect(slider).toBeVisible();
    });
  });

  test.describe("AC5: Footer Integration", () => {
    test("footer is visible when scrolled to secondary blade", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll to secondary blade
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForFunction(
        () => window.scrollY >= window.innerHeight * 0.5
      );

      const secondaryBlade = page.getByTestId("home-secondary-blade");
      const footer = secondaryBlade.locator("footer");
      await expect(footer).toBeInViewport();
    });

    test("footer contains expected components", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll to secondary blade
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForFunction(
        () => window.scrollY >= window.innerHeight * 0.5
      );

      const secondaryBlade = page.getByTestId("home-secondary-blade");
      const footer = secondaryBlade.locator("footer");
      await expect(footer).toBeVisible();

      // Footer should have content (Copyright, Author, etc.)
      const footerContent = footer.locator(".footer-content");
      await expect(footerContent).toBeVisible();
    });
  });
});
