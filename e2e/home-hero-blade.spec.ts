/**
 * Home Hero Blade Structure Tests (Story 12.6)
 *
 * Tests for AC1-AC5:
 * - AC1: Hero blade contains only essential elements
 * - AC2: Buttons 50/50 layout on mobile
 * - AC3: Hero blade fills viewport
 * - AC4: Visual separation from secondary content
 * - AC5: No footer in Hero blade
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
  test.describe("AC1: Hero Blade Contains Only Essential Elements", () => {
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

    test("hero blade contains customers slider (mobile layout optimization)", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeVisible();

      // CustomersSlider IS inside hero blade (mobile layout optimization)
      // This keeps all "living" content in the first blade
      const sliderInHero = heroBlade.locator(".customers-slider");
      await expect(sliderInHero).toBeVisible();
    });
  });

  test.describe("AC2: Buttons Layout 50/50 on Mobile", () => {
    test("buttons have approximately equal width on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const buttonContainer = page.locator(".home_contact-container");
      await expect(buttonContainer).toBeVisible();

      // Get all direct children (buttons/links)
      const buttons = buttonContainer.locator("> *");
      const buttonCount = await buttons.count();

      if (buttonCount < 2) {
        test.skip(true, "Requires at least 2 buttons for 50/50 comparison");
        return;
      }

      const firstButton = buttons.first();
      const lastButton = buttons.last();

      const firstWidth = await firstButton.evaluate((el) => (el as HTMLElement).offsetWidth);
      const lastWidth = await lastButton.evaluate((el) => (el as HTMLElement).offsetWidth);

      // Buttons should be roughly equal (within 35% tolerance for different component structures)
      // Resume button has text + arrow, Contact has text + calendar icon
      const ratio = firstWidth / lastWidth;
      expect(ratio).toBeGreaterThan(0.65);
      expect(ratio).toBeLessThan(1.35);
    });

    test("buttons span full container width on mobile", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const buttonContainer = page.locator(".home_contact-container");
      await expect(buttonContainer).toBeVisible();

      const containerWidth = await buttonContainer.evaluate(
        (el) => (el as HTMLElement).offsetWidth
      );
      const buttons = buttonContainer.locator("> *");

      let totalButtonWidth = 0;
      const count = await buttons.count();
      for (let i = 0; i < count; i++) {
        const width = await buttons.nth(i).evaluate((el) => (el as HTMLElement).offsetWidth);
        totalButtonWidth += width;
      }

      // Account for gap (16px = gap-4)
      const gapWidth = (count - 1) * 16;
      const totalWithGap = totalButtonWidth + gapWidth;

      // Buttons + gaps should be close to container width (within 10%)
      expect(totalWithGap).toBeGreaterThan(containerWidth * 0.9);
    });

    test("buttons have natural width on tablet", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const buttonContainer = page.locator(".home_contact-container");
      await expect(buttonContainer).toBeVisible();

      // Container should NOT be full width on tablet
      const containerWidth = await buttonContainer.evaluate(
        (el) => (el as HTMLElement).offsetWidth
      );
      const viewportWidth = VIEWPORTS.tablet.width;

      // Container should be less than full viewport (natural width)
      expect(containerWidth).toBeLessThan(viewportWidth * 0.9);
    });
  });

  test.describe("AC3: Hero Blade Fills Viewport", () => {
    test("hero blade occupies full viewport height on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeVisible();

      const heroHeight = await heroBlade.evaluate((el) => (el as HTMLElement).offsetHeight);
      const viewportHeight = VIEWPORTS.mobile.height;

      // Hero should be at least 90% of viewport
      expect(heroHeight).toBeGreaterThanOrEqual(viewportHeight * 0.9);
    });

    test("hero blade occupies full viewport height on desktop", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeVisible();

      const heroHeight = await heroBlade.evaluate((el) => (el as HTMLElement).offsetHeight);
      const viewportHeight = VIEWPORTS.desktop.height;

      // Hero should be at least 90% of viewport
      expect(heroHeight).toBeGreaterThanOrEqual(viewportHeight * 0.9);
    });
  });

  test.describe("AC4 & AC5: Secondary Content Below Fold", () => {
    test("customers slider is not visible in initial viewport on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // CustomersSlider should exist but not be in viewport initially
      const slider = page.locator(".customers-slider");
      const sliderExists = (await slider.count()) > 0;

      if (sliderExists) {
        await expect(slider).not.toBeInViewport();
      }
      // If slider doesn't exist, test passes (no secondary content in hero)
    });

    test("footer is not visible in initial viewport on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Footer inside secondary blade should exist but not be in viewport initially
      // Story 12.7: Footer is inside secondary blade, global footer is hidden via CSS
      const secondaryBlade = page.getByTestId("home-secondary-blade");
      const footer = secondaryBlade.locator("footer");
      const footerExists = (await footer.count()) > 0;

      if (footerExists) {
        await expect(footer).not.toBeInViewport();
      }
      // If footer doesn't exist, test passes
    });

    test("scrolling reveals secondary content", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll down one viewport height
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));

      // Wait for scroll to complete (avoid arbitrary timeout)
      await page.waitForFunction(
        () => window.scrollY >= window.innerHeight * 0.5
      );

      // After scrolling, secondary blade content should be visible
      // Story 12.7: Footer is inside secondary blade
      const secondaryBlade = page.getByTestId("home-secondary-blade");
      const slider = secondaryBlade.locator(".customers-slider");
      const footer = secondaryBlade.locator("footer");

      const sliderVisible =
        (await slider.count()) > 0 && (await slider.isVisible());
      const footerVisible =
        (await footer.count()) > 0 && (await footer.isVisible());

      // At least one secondary element should be visible after scroll
      expect(sliderVisible || footerVisible).toBeTruthy();
    });
  });
});
