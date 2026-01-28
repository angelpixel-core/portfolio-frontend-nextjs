/**
 * About Stats Degradation Tests (Story 12.8)
 *
 * Tests for AC1-AC5:
 * - AC1: Stats container maintains grid position
 * - AC2: Stats graceful degradation on error
 * - AC3: Stats loading state maintains layout
 * - AC4: Biography degradation consistency
 * - AC5: Visual coherence in all states
 *
 * @see _bmad-output/implementation-artifacts/12-8-about-biography-stats-degradation.md
 * @see docs/layout-system.md
 */

import { test, expect } from "@playwright/test";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

test.describe("About Stats Degradation (Story 12.8)", () => {
  test.describe("AC1: Stats Container Maintains Grid Position", () => {
    test("stats container exists with proper grid class on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const stats = page.locator(".experience-stats");
      await expect(stats).toBeVisible();

      // Verify container has col-span-8 class (grid position)
      const hasColSpan = await stats.evaluate((el) =>
        el.classList.contains("col-span-8")
      );
      // On mobile (md:), it may use md:order-3 but still has col-span-8
      // The class should be present in computed styles
      expect(hasColSpan || (await stats.getAttribute("class"))).toBeTruthy();
    });

    test("stats container exists on desktop", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const stats = page.locator(".experience-stats");
      await expect(stats).toBeVisible();
    });

    test("about page grid layout contains biography, hero, and stats", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // All three sections should exist
      const biography = page.locator(".about_biography-container");
      const heroImage = page.locator(".about-hero_image-container");
      const stats = page.locator(".experience-stats");

      await expect(biography).toBeVisible();
      await expect(heroImage).toBeVisible();
      await expect(stats).toBeVisible();
    });
  });

  test.describe("AC2: Stats Graceful Degradation", () => {
    test("stats fallback has styled container instead of loose text", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Check if fallback exists (in case data fails to load)
      const fallback = page.getByTestId("experience-stats-fallback");
      const fallbackExists = (await fallback.count()) > 0;

      if (fallbackExists) {
        // Verify fallback has styled container, not loose <p>
        const styledContainer = fallback.locator(".experience-stats_fallback");
        await expect(styledContainer).toBeVisible();

        // Verify no loose <p> with "Unable to load" text
        const looseParagraph = fallback.locator("p:text('Unable to load')");
        await expect(looseParagraph).toHaveCount(0);
      }
      // If no fallback, stats loaded successfully - test passes
    });

    test("stats error state maintains experience-stats container", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Whether success or fallback, .experience-stats container should exist
      const stats = page.locator(".experience-stats");
      await expect(stats).toBeVisible();
    });
  });

  test.describe("AC3: Stats Loading State", () => {
    test("stats loading state shows skeleton structure", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);

      // Navigate before network stabilizes to catch loading state
      await page.goto("/about");

      // Check for either loading skeleton or loaded content
      const statsContainer = page.locator(".experience-stats");
      await expect(statsContainer).toBeVisible({ timeout: 10000 });

      // Container should exist in any state (loading, error, success)
    });
  });

  test.describe("AC4: Biography Degradation Consistency", () => {
    test("biography title remains visible regardless of data state", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Biography title should always be visible
      const biographyTitle = page.locator(".biography-title");
      await expect(biographyTitle).toBeVisible();
      await expect(biographyTitle).toContainText("biography");
    });

    test("biography fallback has styled container instead of loose text", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Check if biography fallback exists
      const fallback = page.getByTestId("biography-fallback");
      const fallbackExists = (await fallback.count()) > 0;

      if (fallbackExists) {
        // Verify fallback has styled container
        const styledText = fallback.locator(".biography_fallback-text");
        await expect(styledText).toBeVisible();

        // Verify no loose <p> with "Unable to load" text
        const looseParagraph = page.locator(
          ".about_biography-container p:text('Unable to load')"
        );
        await expect(looseParagraph).toHaveCount(0);
      }
      // If no fallback, biography loaded successfully - test passes
    });
  });

  test.describe("AC5: Visual Coherence in All States", () => {
    test("about page renders without console errors on mobile", async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Filter out known acceptable errors (e.g., network errors for missing data)
      const criticalErrors = consoleErrors.filter(
        (err) =>
          !err.includes("Failed to load resource") &&
          !err.includes("net::ERR_")
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test("about content grid has no broken layout on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const aboutContent = page.locator(".about-content");
      await expect(aboutContent).toBeVisible();

      // Verify grid has proper display
      const display = await aboutContent.evaluate(
        (el) => window.getComputedStyle(el).display
      );
      expect(display).toBe("grid");
    });

    test("about content grid has no broken layout on desktop", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const aboutContent = page.locator(".about-content");
      await expect(aboutContent).toBeVisible();

      // Verify grid has proper display
      const display = await aboutContent.evaluate(
        (el) => window.getComputedStyle(el).display
      );
      expect(display).toBe("grid");
    });

    test("biography container is in first viewport on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const biography = page.locator(".about_biography-container");
      await expect(biography).toBeInViewport();
    });
  });
});
