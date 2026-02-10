/**
 * Home Hero Blade Structure Tests (Story 12.6)
 *
 * Tests for AC1-AC3:
 * - AC1: Hero blade contains essential elements (hero, title, description, buttons, sliders)
 * - AC2: Buttons layout — natural width (flex-none), centered, approximately equal
 * - AC3: Hero blade fills viewport minus header (calc(100dvh - 114px))
 *
 * Note: Secondary blade (Story 12.7) was removed. Home uses a single-blade layout.
 * Sliders are inside the hero blade (pushed to bottom via margin-top: auto).
 *
 * @see _bmad-output/implementation-artifacts/stories/epic-12/12-6-home-hero-blade-structure.md
 * @see docs/layout-system.md
 */

import { test, expect } from "@playwright/test";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

test.describe("Home Hero Blade Structure (Story 12.6)", () => {
  test.describe("AC1: Hero Blade Contains Essential Elements", () => {
    test("hero blade contains hero image, title, description, and buttons", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeVisible();

      // Verify essential elements exist within hero blade
      await expect(heroBlade.getByTestId("profile-hero-image")).toBeVisible();
      await expect(heroBlade.locator(".home_title")).toBeVisible();
      await expect(heroBlade.locator(".home_slogan")).toBeVisible();
      await expect(heroBlade.locator(".home_contact-container")).toBeVisible();
    });

    test("hero blade contains customers slider (single-blade layout)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeVisible();

      // CustomersSlider IS inside hero blade (single-blade layout)
      const sliderInHero = heroBlade.locator(".customers-slider");
      await expect(sliderInHero).toBeVisible();
    });
  });

  test.describe("AC2: Button Layout", () => {
    test("buttons have approximately equal width on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const buttonContainer = page.locator(".home_contact-container");
      await expect(buttonContainer).toBeVisible();

      const buttons = buttonContainer.locator("> *");
      const buttonCount = await buttons.count();

      if (buttonCount < 2) {
        test.skip(true, "Requires at least 2 buttons for comparison");
        return;
      }

      const firstWidth = await buttons
        .first()
        .evaluate((el) => (el as HTMLElement).offsetWidth);
      const lastWidth = await buttons
        .last()
        .evaluate((el) => (el as HTMLElement).offsetWidth);

      // Buttons should be roughly equal (within 35% tolerance)
      const ratio = firstWidth / lastWidth;
      expect(ratio).toBeGreaterThan(0.65);
      expect(ratio).toBeLessThan(1.35);
    });

    test("buttons use natural width on mobile (flex-none)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const buttonContainer = page.locator(".home_contact-container");
      const containerWidth = await buttonContainer.evaluate(
        (el) => (el as HTMLElement).offsetWidth
      );

      const buttons = buttonContainer.locator("> *");
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(2);

      // Each button should be narrower than half the container (natural width, not stretched)
      for (let i = 0; i < count; i++) {
        const width = await buttons
          .nth(i)
          .evaluate((el) => (el as HTMLElement).offsetWidth);
        expect(width).toBeLessThan(containerWidth * 0.5);
        expect(width).toBeGreaterThan(0);
      }
    });

    test("buttons use natural width on tablet", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const buttonContainer = page.locator(".home_contact-container");
      const buttons = buttonContainer.locator("> *");
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(2);

      // Buttons should have natural width (not stretched to fill grid cell)
      for (let i = 0; i < count; i++) {
        const width = await buttons
          .nth(i)
          .evaluate((el) => (el as HTMLElement).offsetWidth);
        expect(width).toBeLessThan(VIEWPORTS.tablet.width * 0.4);
        expect(width).toBeGreaterThan(0);
      }
    });
  });

  test.describe("AC3: Hero Blade Fills Viewport", () => {
    test("hero blade occupies viewport minus header on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeVisible();

      const heroHeight = await heroBlade.evaluate(
        (el) => (el as HTMLElement).offsetHeight
      );
      const viewportHeight = VIEWPORTS.mobile.height;

      // Hero uses calc(100dvh - 114px), so ~80-85% of viewport
      expect(heroHeight).toBeGreaterThanOrEqual(viewportHeight * 0.80);
    });

    test("hero blade occupies viewport minus header on desktop", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeVisible();

      const heroHeight = await heroBlade.evaluate(
        (el) => (el as HTMLElement).offsetHeight
      );
      const viewportHeight = VIEWPORTS.desktop.height;

      // Hero uses calc(100dvh - 114px), so ~80-85% of viewport
      expect(heroHeight).toBeGreaterThanOrEqual(viewportHeight * 0.80);
    });
  });
});
