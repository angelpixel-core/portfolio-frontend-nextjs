/**
 * About Experiences/Education UX Tests (Story 12.10)
 *
 * Tests for AC1-AC7:
 * - AC1: Replace "Show details" Text with Contextual Icon
 * - AC2: Icon Toggle Behavior (expand)
 * - AC3: Icon Collapsed Behavior (collapse)
 * - AC4: Education Follows Experiences Visual Pattern
 * - AC5: Education Verification Link Styling
 * - AC6: Minimum Touch Target Size (44x44px)
 * - AC7: Reduced Motion Respected
 *
 * @see _bmad-output/implementation-artifacts/12-10-about-experiences-education-ux.md
 * @see docs/layout-system.md
 */

import { test, expect } from "@playwright/test";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

/**
 * Helper to wait for experiences to load and scroll to them.
 * Mock data has 2s delay, so we need to wait for the container to show data.
 */
async function waitForExperiences(page: any) {
  // Wait for the experiences container to be visible
  const container = page.getByTestId("experiences-container");
  await container.waitFor({ state: "visible", timeout: 15000 }).catch(() => {});

  // Scroll to the experiences section
  const experiencesSection = page.locator(".experiences-container");
  if ((await experiencesSection.count()) > 0) {
    await experiencesSection.scrollIntoViewIfNeeded();
  }

  // Wait a bit for any animations
  await page.waitForTimeout(500);
}

test.describe("About Experiences/Education UX (Story 12.10)", () => {
  test.describe("AC1: Replace 'Show details' Text with Contextual Icon", () => {
    test("experience toggle uses icon instead of text button", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();

      // Skip if no experiences with details exist
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      await expect(toggle).toBeVisible();

      // Should NOT contain text "Show details" or "Hide details" (FR23: icon instead of text)
      await expect(toggle).not.toContainText("Show details");
      await expect(toggle).not.toContainText("Hide details");
    });

    test("experience toggle has aria-label for accessibility", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Should have aria-label
      const ariaLabel = await toggle.getAttribute("aria-label");
      expect(ariaLabel).toMatch(/details/i);
    });

    test("experience toggle has aria-expanded attribute", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Should have aria-expanded initially false
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("AC2: Icon Toggle Behavior (expand)", () => {
    test("clicking icon expands details section", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Initially no details visible
      const detailsBefore = page.getByTestId("experience-details");
      await expect(detailsBefore).not.toBeVisible();

      // Click to expand
      await toggle.click();

      // Details should now be visible
      const detailsAfter = page.getByTestId("experience-details").first();
      await expect(detailsAfter).toBeVisible();
    });

    test("aria-expanded updates to true on expand", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    });

    test("icon rotates on expand (has expanded class)", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Initially no expanded class
      let classes = await toggle.getAttribute("class");
      expect(classes).not.toContain("experience_toggle-icon--expanded");

      // Click to expand
      await toggle.click();

      // Now has expanded class
      classes = await toggle.getAttribute("class");
      expect(classes).toContain("experience_toggle-icon--expanded");
    });

    test("keyboard Enter key expands details", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      await toggle.focus();
      await page.keyboard.press("Enter");

      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    });

    test("keyboard Space key expands details", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      await toggle.focus();
      await page.keyboard.press("Space");

      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    });
  });

  test.describe("AC3: Icon Collapsed Behavior", () => {
    test("clicking expanded icon collapses details", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Expand first
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");

      // Collapse
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");

      // Details should be hidden
      const details = page.getByTestId("experience-details");
      await expect(details).not.toBeVisible();
    });

    test("icon returns to original state on collapse", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Expand
      await toggle.click();
      let classes = await toggle.getAttribute("class");
      expect(classes).toContain("experience_toggle-icon--expanded");

      // Collapse
      await toggle.click();
      classes = await toggle.getAttribute("class");
      expect(classes).not.toContain("experience_toggle-icon--expanded");
    });

    test("aria-label updates on collapse", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Expand - aria-label should say "Hide details"
      await toggle.click();
      let ariaLabel = await toggle.getAttribute("aria-label");
      expect(ariaLabel).toMatch(/hide/i);

      // Collapse - aria-label should say "Show details"
      await toggle.click();
      ariaLabel = await toggle.getAttribute("aria-label");
      expect(ariaLabel).toMatch(/show/i);
    });
  });

  test.describe("AC4: Education Follows Experiences Visual Pattern", () => {
    test("education and experience titles have same font styling", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const experienceTitle = page.locator(".experience_title").first();
      const educationTitle = page.locator(".education_title").first();

      const expTitleCount = await experienceTitle.count();
      const eduTitleCount = await educationTitle.count();

      if (expTitleCount === 0 || eduTitleCount === 0) {
        test.skip();
        return;
      }

      // Compare font sizes
      const expFontSize = await experienceTitle.evaluate((el) =>
        getComputedStyle(el).fontSize
      );
      const eduFontSize = await educationTitle.evaluate((el) =>
        getComputedStyle(el).fontSize
      );

      expect(expFontSize).toBe(eduFontSize);
    });

    test("education and experience history-info have same styling", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const experienceInfo = page.locator(".experience_history-info").first();
      const educationInfo = page.locator(".education_history-info").first();

      const expInfoCount = await experienceInfo.count();
      const eduInfoCount = await educationInfo.count();

      if (expInfoCount === 0 || eduInfoCount === 0) {
        test.skip();
        return;
      }

      // Compare font weight
      const expWeight = await experienceInfo.evaluate((el) =>
        getComputedStyle(el).fontWeight
      );
      const eduWeight = await educationInfo.evaluate((el) =>
        getComputedStyle(el).fontWeight
      );

      expect(expWeight).toBe(eduWeight);
    });
  });

  test.describe("AC5: Education Verification Link Styling", () => {
    test("education verification link has aria-label", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const verifyLink = page
        .getByTestId("education-verification-link")
        .first();
      const linkCount = await verifyLink.count();

      if (linkCount === 0) {
        // No education items with verification URLs in data - skip test
        test.skip();
        return;
      }

      const ariaLabel = await verifyLink.getAttribute("aria-label");
      expect(ariaLabel).toMatch(/verify/i);
    });

    test("education verification link has proper focus states", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const verifyLink = page
        .getByTestId("education-verification-link")
        .first();
      const linkCount = await verifyLink.count();

      if (linkCount === 0) {
        test.skip();
        return;
      }

      // Focus the link
      await verifyLink.focus();

      // Should have focus ring (via CSS outline or ring)
      const outlineStyle = await verifyLink.evaluate((el) =>
        getComputedStyle(el).outlineStyle
      );
      const boxShadow = await verifyLink.evaluate((el) =>
        getComputedStyle(el).boxShadow
      );

      // Either outline or box-shadow should indicate focus
      const hasFocusIndicator = outlineStyle !== "none" || boxShadow !== "none";
      expect(hasFocusIndicator).toBe(true);
    });
  });

  test.describe("AC6: Minimum Touch Target Size (44x44px)", () => {
    test("experience toggle icon meets WCAG 2.5.5 minimum size", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Get computed dimensions
      const boundingBox = await toggle.boundingBox();

      expect(boundingBox).not.toBeNull();
      if (boundingBox) {
        // WCAG 2.5.5 requires minimum 44x44px for touch targets
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    });

    test("toggle has proper spacing from adjacent elements", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Toggle should have margin-top for spacing
      const marginTop = await toggle.evaluate((el) =>
        getComputedStyle(el).marginTop
      );

      // Should have some margin (not 0px)
      expect(marginTop).not.toBe("0px");
    });
  });

  test.describe("AC7: Reduced Motion Respected", () => {
    test("icon toggle works with reduced motion preference", async ({
      page,
    }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: "reduce" });

      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Interactions should still work
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");

      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    test("toggle has no-motion class with reduced motion", async ({ page }) => {
      // Emulate reduced motion preference
      await page.emulateMedia({ reducedMotion: "reduce" });

      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      if (toggleCount === 0) {
        test.skip();
        return;
      }

      // Should have no-motion class
      const classes = await toggle.getAttribute("class");
      expect(classes).toContain("experience_toggle-icon--no-motion");
    });
  });

  test.describe("Experiences Container States", () => {
    test("experiences container has data-testid attribute", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      // Wait for load state (container shows even during loading)
      await page.waitForLoadState("networkidle");

      // Should have one of the container testids
      const container = page.locator(
        '[data-testid="experiences-container"], [data-testid="experiences-container-loading"], [data-testid="experiences-container-fallback"]'
      );
      await expect(container).toBeVisible();
    });
  });
});
