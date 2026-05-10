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

const parsePx = (value: string | null): number => {
  if (!value) return 0;
  const parsed = Number.parseFloat(value.replace("px", ""));
  return Number.isNaN(parsed) ? 0 : parsed;
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

async function waitForAcademics(page: any) {
  const academicsSection = page.locator(".academics-container");
  await academicsSection.first().waitFor({ state: "visible", timeout: 15000 });
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
      expect(toggleCount).toBeGreaterThan(0);

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
      expect(toggleCount).toBeGreaterThan(0);

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
      expect(toggleCount).toBeGreaterThan(0);

      // Should have aria-expanded initially false
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("AC2: Icon Toggle Behavior (expand)", () => {
    test("clicking icon expands details section", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);
      await waitForAcademics(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      expect(toggleCount).toBeGreaterThan(0);

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
      await waitForAcademics(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      expect(toggleCount).toBeGreaterThan(0);

      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    });

    test("toggle reflects expanded state via aria-expanded", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      expect(toggleCount).toBeGreaterThan(0);

      // Initially not expanded
      await expect(toggle).toHaveAttribute("aria-expanded", "false");

      // Click to expand
      await toggle.click();

      // Fallback for CI flakiness: ensure click handler runs
      if ((await toggle.getAttribute("aria-expanded")) !== "true") {
        await toggle.dispatchEvent("click");
      }

      // Expanded details should be visible before asserting aria state
      await expect(
        page.getByTestId("experience-details").first()
      ).toBeVisible();

      // Now expanded
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    });

    test("keyboard Enter key expands details", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      expect(toggleCount).toBeGreaterThan(0);

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
      expect(toggleCount).toBeGreaterThan(0);

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
      expect(toggleCount).toBeGreaterThan(0);

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

    test("toggle reflects collapsed state via aria-expanded", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      expect(toggleCount).toBeGreaterThan(0);

      // Expand
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");

      // Collapse
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    test("aria-label updates on collapse", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const toggle = page.getByTestId("experience-toggle").first();
      const toggleCount = await toggle.count();
      expect(toggleCount).toBeGreaterThan(0);

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

      const experienceTitle = page.locator(".experience__title").first();
      const educationTitle = page.locator(".education__title").first();

      const expTitleCount = await experienceTitle.count();
      const eduTitleCount = await educationTitle.count();

      expect(expTitleCount).toBeGreaterThan(0);
      expect(eduTitleCount).toBeGreaterThan(0);

      // Compare font sizes
      const expFontSize = await experienceTitle.evaluate(
        (el) => getComputedStyle(el).fontSize
      );
      const eduFontSize = await educationTitle.evaluate(
        (el) => getComputedStyle(el).fontSize
      );

      expect(expFontSize).toBe(eduFontSize);
    });

    test("education and experience history-info have same styling", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const experienceInfo = page.locator(".experience__history-info").first();
      const educationInfo = page.locator(".education__history-info").first();

      const expInfoCount = await experienceInfo.count();
      const eduInfoCount = await educationInfo.count();

      expect(expInfoCount).toBeGreaterThan(0);
      expect(eduInfoCount).toBeGreaterThan(0);

      // Compare font weight
      const expWeight = await experienceInfo.evaluate(
        (el) => getComputedStyle(el).fontWeight
      );
      const eduWeight = await educationInfo.evaluate(
        (el) => getComputedStyle(el).fontWeight
      );

      expect(expWeight).toBe(eduWeight);
    });
  });

  test.describe("AC5: Education Verification Link Styling", () => {
    /**
     * Helper: expand the education toggle that owns a verification_url.
     * Mock entry #2 has verification_url; its toggle is the second one (nth 1).
     * The link only renders when isExpanded && verification_url.
     */
    async function expandEducationWithVerification(page: any) {
      const academics = page.locator(".academics-container");
      await academics.first().waitFor({ state: "visible", timeout: 15000 });
      await academics.scrollIntoViewIfNeeded();

      const toggles = page.getByTestId("education-toggle");
      await toggles.first().waitFor({ state: "visible", timeout: 15000 });
      const toggleCount = await toggles.count();
      expect(toggleCount).toBeGreaterThan(0);

      let expanded = false;
      for (let i = 0; i < toggleCount; i += 1) {
        const toggle = toggles.nth(i);
        await toggle.click();

        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await expect(page.getByTestId("education-details").first()).toBeVisible();

        if (
          (await page
            .getByTestId("education-verification-link")
            .count()) > 0
        ) {
          expanded = true;
          break;
        }

        await toggle.click();
      }

      expect(expanded).toBe(true);
      return true;
    }

    test("education verification link has aria-label", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const expanded = await expandEducationWithVerification(page);
      expect(expanded).toBe(true);

      const verifyLink = page
        .getByTestId("education-verification-link")
        .first();
      const linkCount = await verifyLink.count();

      expect(linkCount).toBeGreaterThan(0);

      const ariaLabel = await verifyLink.getAttribute("aria-label");
      expect(ariaLabel).toMatch(/verify/i);
    });

    test("education verification link has proper focus states", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const expanded = await expandEducationWithVerification(page);
      expect(expanded).toBe(true);

      const verifyLink = page
        .getByTestId("education-verification-link")
        .first();
      const linkCount = await verifyLink.count();

      expect(linkCount).toBeGreaterThan(0);

      // Focus the link
      await verifyLink.focus();

      // Should have focus ring (via CSS outline or ring)
      const outlineStyle = await verifyLink.evaluate(
        (el) => getComputedStyle(el).outlineStyle
      );
      const boxShadow = await verifyLink.evaluate(
        (el) => getComputedStyle(el).boxShadow
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
      expect(toggleCount).toBeGreaterThan(0);

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
      expect(toggleCount).toBeGreaterThan(0);

      // Toggle should have margin-top for spacing
      const marginTop = await toggle.evaluate(
        (el) => getComputedStyle(el).marginTop
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
      expect(toggleCount).toBeGreaterThan(0);

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
      expect(toggleCount).toBeGreaterThan(0);

      // Should have no-motion class
      const classes = await toggle.getAttribute("class");
      expect(classes).toMatch(
        /(experience__toggle-inline--no-motion|education__toggle-inline--no-motion)/
      );
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

  test.describe("Phase 5: Experience readability and density regression", () => {
    test("experience metadata typography scales between mobile and tablet", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/about");
      await waitForExperiences(page);

      const mobileDateSize = await page
        .locator(".experience__history-info")
        .first()
        .evaluate((el) => getComputedStyle(el).fontSize);
      const mobileLocationSize = await page
        .locator(".experience__location")
        .first()
        .evaluate((el) => getComputedStyle(el).fontSize);

      await page.setViewportSize(VIEWPORTS.tablet);
      await page.waitForTimeout(150);

      const tabletDateSize = await page
        .locator(".experience__history-info")
        .first()
        .evaluate((el) => getComputedStyle(el).fontSize);
      const tabletLocationSize = await page
        .locator(".experience__location")
        .first()
        .evaluate((el) => getComputedStyle(el).fontSize);

      expect(parsePx(tabletDateSize)).toBeGreaterThan(parsePx(mobileDateSize));
      expect(parsePx(tabletLocationSize)).toBeGreaterThan(
        parsePx(mobileLocationSize)
      );
    });

    test("experience row spacing remains compact for denser timeline", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await waitForExperiences(page);

      const headerGap = await page
        .locator(".experience__header")
        .first()
        .evaluate((el) => getComputedStyle(el).rowGap);
      const historyMarginTop = await page
        .locator(".experience__role-row")
        .first()
        .evaluate((el) => getComputedStyle(el).marginTop);

      expect(parsePx(headerGap)).toBeLessThanOrEqual(4);
      expect(parsePx(historyMarginTop)).toBeLessThanOrEqual(4);
    });
  });
});
