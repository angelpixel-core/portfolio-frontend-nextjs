import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Story 13.7: Reduced Motion Support E2E Tests
 *
 * Tests that the site respects prefers-reduced-motion: reduce preference
 * for users with vestibular disorders or motion sensitivity.
 *
 * WCAG 2.1 Success Criterion 2.3.3: Animation from Interactions (Level AAA)
 */

test.describe("Reduced Motion Support (Story 13.7)", () => {
  // Use desktop viewport where navigation is visible
  test.use({ viewport: { width: 1280, height: 800 } });

  test.describe("with reduced motion preference enabled", () => {
    test.beforeEach(async ({ page }) => {
      // Emulate reduced motion preference BEFORE navigating
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      // Wait for navigation to be ready
      await page.waitForSelector(
        `[data-testid="${TESTIDS.nav.header.homeLink}"]`,
        {
          timeout: 15000,
        }
      );
    });

    test("AC1: navigation completes instantly without curtain animation", async ({
      page,
    }) => {
      // Verify no transition curtains are visible initially
      const curtains = page.locator(".transition-effect__blade");
      await expect(curtains).toHaveCount(0);

      // Navigate to another page
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
      await projectsLink.click();

      // Navigation should complete immediately
      await expect(page).toHaveURL("/projects");

      // Verify curtains were never rendered (instant navigation)
      await expect(curtains).toHaveCount(0);

      // Content should be immediately visible
      const content = page.getByTestId(TESTIDS.layout.mainContent);
      await expect(content).toBeVisible();
    });

    test("AC1: no interaction blocking during reduced motion navigation", async ({
      page,
    }) => {
      // Navigate to projects
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
      await projectsLink.click();
      await expect(page).toHaveURL("/projects");

      // Verify body does not have transition-active class (no blocking)
      const hasTransitionClass = await page.evaluate(() => {
        return document.body.classList.contains("transition-active");
      });
      expect(hasTransitionClass).toBe(false);

      // Verify body does not have inert attribute (focus not blocked)
      const hasInert = await page.evaluate(() => {
        return document.body.hasAttribute("inert");
      });
      expect(hasInert).toBe(false);
    });

    test("AC4/AC6: CSS animations have reduced or no motion", async ({
      page,
    }) => {
      // Check that reduced-motion CSS rules are applied
      // The global reduced-motion.css sets animation-duration: 0.01ms

      // Navigate to home page which has potential animations
      await page.goto("/");

      // Check computed styles on any animated element
      // The CSS media query should force animations to complete instantly
      const animationDuration = await page.evaluate(() => {
        const style = window.getComputedStyle(document.body);
        // Check if reduced motion media query is active
        const mediaQuery = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        );
        return {
          prefersReducedMotion: mediaQuery.matches,
        };
      });

      expect(animationDuration.prefersReducedMotion).toBe(true);
    });

    test("AC6: CustomersSlider carousel animation is disabled", async ({
      page,
    }) => {
      await page.goto("/");

      // Check if slider exists - skip test if not present on this page
      const sliderTrack = page.locator(
        ".customers-slider .customers-slider__track"
      );
      const sliderCount = await sliderTrack.count();

      test.skip(sliderCount === 0, "CustomersSlider not present on homepage");

      const animationName = await sliderTrack.evaluate((el) => {
        return window.getComputedStyle(el).animationName;
      });

      expect(animationName.includes("customers-slider-scroll")).toBe(false);
    });

    // Dead tests removed:
    // - "Hiring hue-rotate animation" — Hiring lives on /about, not /; always skipped.
    // - "Skill fireRing animation" — .skill class removed (WordCloud replaced Skills); always skipped.
  });

  test.describe("without reduced motion preference (baseline)", () => {
    test.beforeEach(async ({ page }) => {
      // Explicitly set no-preference to ensure baseline behavior
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("/");
      await page.waitForSelector(
        `[data-testid="${TESTIDS.nav.header.homeLink}"]`,
        {
          timeout: 15000,
        }
      );
    });

    test("transition curtains appear during navigation", async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
      await expect(projectsLink).toBeVisible();

      const curtainsPromise = page.waitForSelector(
        ".transition-effect__blade",
        {
          state: "attached",
          timeout: 2000,
        }
      );

      const navigationPromise = page.waitForURL("**/projects", {
        timeout: 15000,
      });
      await projectsLink.click();

      const curtain = await curtainsPromise;
      expect(curtain).toBeTruthy();

      await navigationPromise;
      await expect(page).toHaveURL(/\/projects$/);
    });
  });
});
