/**
 * Home Footer Blade Tests (Story 12.7 Updated)
 *
 * Updated structure:
 * - Primary blade: Hero + Content + CustomersSlider (all living content)
 * - Footer blade: Footer only (intrinsic height, NOT full viewport)
 *
 * Tests for:
 * - Footer blade contains footer
 * - Footer blade has intrinsic height (NOT 100vh)
 * - Visual separation from primary content
 * - Footer visibility when scrolled
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

test.describe("Home Footer Blade Structure (Story 12.7 Updated)", () => {
  test.describe("AC1: Footer Blade Contains Correct Elements", () => {
    test("footer blade exists with correct testid", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const footerBlade = page.getByTestId("home-secondary-blade");
      await expect(footerBlade).toBeVisible();
    });

    test("CustomersSlider is inside primary blade (not footer)", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Slider should be in primary blade (home-hero-blade)
      const heroBlade = page.getByTestId("home-hero-blade");
      const sliderInHero = heroBlade.locator(".customers-slider");
      await expect(sliderInHero).toBeVisible();

      // Slider should NOT be in footer blade
      const footerBlade = page.getByTestId("home-secondary-blade");
      const sliderInFooter = footerBlade.locator(".customers-slider");
      await expect(sliderInFooter).toHaveCount(0);
    });

    test("Footer is inside footer blade", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const footerBlade = page.getByTestId("home-secondary-blade");

      // Scroll to footer blade to ensure Footer is visible
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      // Footer should be inside footer blade
      const footer = footerBlade.locator("footer, .footer-content");
      await expect(footer.first()).toBeVisible();
    });

    test("Footer from global layout is hidden on Home page", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Footer from global layout should be hidden via CSS display:none
      const layout = page.locator(".layout");
      const globalFooter = layout.locator("> footer");

      // Global Footer should be hidden (display: none) on Home page
      await expect(globalFooter).toBeHidden();
    });

    test("footer blade does not contain hero content", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const footerBlade = page.getByTestId("home-secondary-blade");

      // Hero elements should NOT be in footer blade
      const heroImage = footerBlade.getByTestId("profile-hero-image");
      await expect(heroImage).toHaveCount(0);

      const homeTitle = footerBlade.locator(".home_title");
      await expect(homeTitle).toHaveCount(0);
    });
  });

  test.describe("AC2: Footer Blade Has Intrinsic Height (NOT Full Viewport)", () => {
    test("footer blade height is based on content, not 100vh on mobile", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const footerBlade = page.getByTestId("home-secondary-blade");
      const bladeHeight = await footerBlade.evaluate(
        (el) => (el as HTMLElement).offsetHeight
      );
      const viewportHeight = VIEWPORTS.mobile.height;

      // Footer blade should be LESS than full viewport (intrinsic height)
      // It's just the footer content, not a full "blade"
      expect(bladeHeight).toBeLessThan(viewportHeight * 0.8);
    });

    test("footer blade height is based on content, not 100vh on desktop", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const footerBlade = page.getByTestId("home-secondary-blade");
      const bladeHeight = await footerBlade.evaluate(
        (el) => (el as HTMLElement).offsetHeight
      );
      const viewportHeight = VIEWPORTS.desktop.height;

      // Footer blade should be LESS than full viewport (intrinsic height)
      expect(bladeHeight).toBeLessThan(viewportHeight * 0.8);
    });
  });

  test.describe("AC3: Scroll Reveals Footer", () => {
    test("footer blade is not visible in initial viewport on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Hero blade should be visible initially
      const heroBlade = page.getByTestId("home-hero-blade");
      await expect(heroBlade).toBeInViewport();

      // Footer blade should NOT be in initial viewport
      const footerBlade = page.getByTestId("home-secondary-blade");
      await expect(footerBlade).not.toBeInViewport();
    });

    test("scrolling reveals footer blade", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      // Footer blade should now be visible
      const footerBlade = page.getByTestId("home-secondary-blade");
      await expect(footerBlade).toBeInViewport();
    });

    test("footer blade has visual separation from primary content", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const footerBlade = page.getByTestId("home-secondary-blade");

      // Check that footer blade has border-top (visual separation)
      const borderTop = await footerBlade.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.borderTopWidth;
      });

      // Should have a border (1px or more)
      expect(parseInt(borderTop)).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe("AC4: CustomersSlider in Primary Blade", () => {
    test("CustomersSlider is visible in primary blade", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const slider = page.locator(".customers-slider");
      await expect(slider).toBeVisible();

      // Slider should be accessible without scrolling (in primary blade)
      // Scroll to ensure visibility
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(200);
      await expect(slider).toBeVisible();
    });
  });

  test.describe("AC5: Footer Integration", () => {
    test("footer is visible when scrolled to bottom", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      const footerBlade = page.getByTestId("home-secondary-blade");
      await expect(footerBlade).toBeInViewport();
    });

    test("footer contains expected components", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      const footerBlade = page.getByTestId("home-secondary-blade");

      // Footer should have content (Copyright, Author, etc.)
      const footerContent = footerBlade.locator(".footer-content");
      await expect(footerContent).toBeVisible();
    });
  });
});
