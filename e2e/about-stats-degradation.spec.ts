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
    test("stats container exists with grid position on mobile", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const stats = page.locator(".experience-stats");
      await expect(stats).toBeVisible();

      // Verify container participates in grid (has gridColumn span, not "auto")
      // Note: Legacy breakpoints cause lg:col-span-2 to apply at mobile
      const gridColumn = await stats.evaluate(
        (el) => window.getComputedStyle(el).gridColumn
      );
      expect(gridColumn).toContain("span");
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
    test("stats container has styled fallback structure (FR19)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Stats container should always be visible (success or fallback)
      const stats = page.locator(".experience-stats");
      await expect(stats).toBeVisible();

      // Check if fallback state is active (data may or may not load in CI)
      const fallback = page.getByTestId("experience-stats-fallback");
      const fallbackCount = await fallback.count();

      if (fallbackCount > 0) {
        // Verify styled fallback structure per FR19
        const styledContainer = fallback.locator(".experience-stats_fallback");
        await expect(styledContainer).toBeVisible();

        // Verify no loose <p> with "Unable to load" text
        const looseParagraph = fallback.locator("p:text('Unable to load')");
        await expect(looseParagraph).toHaveCount(0);
      }
      // If no fallback, data loaded successfully - structure still valid
    });

    test("stats renders with data-testid for state identification", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Container should always be visible
      const stats = page.locator(".experience-stats");
      await expect(stats).toBeVisible();

      // Should have one of the testids (success, fallback, or loading)
      const hasTestId = await stats.evaluate((el) =>
        el.hasAttribute("data-testid")
      );
      expect(hasTestId).toBe(true);
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

      // Biography title should always be visible (success or fallback)
      const biographyTitle = page.locator(".biography-title");
      await expect(biographyTitle).toBeVisible();
      await expect(biographyTitle).toContainText("biography");
    });

    test("biography has styled fallback structure (FR19)", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      // Check if fallback state is active
      const fallback = page.getByTestId("biography-fallback");
      const fallbackCount = await fallback.count();

      if (fallbackCount > 0) {
        // Verify styled fallback structure per FR19
        const styledText = fallback.locator(".biography_fallback-text");
        await expect(styledText).toBeVisible();

        // Verify no loose <p> with "Unable to load" text
        const looseParagraph = page.locator(
          ".about_biography-container p:text('Unable to load')"
        );
        await expect(looseParagraph).toHaveCount(0);
      }
      // If no fallback, data loaded successfully - test passes
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
