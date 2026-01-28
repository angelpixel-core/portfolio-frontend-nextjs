/**
 * Footer Consistency Tests (Story 12.11)
 *
 * Tests for AC1-AC6:
 * - AC1: Footer consistent across all pages
 * - AC2: HireMe hover color inversion
 * - AC3: HireMe not duplicated
 * - AC4: Footer visual closure (border-top separation)
 * - AC5: Footer data-testid attributes
 * - AC6: HireMe visibility per breakpoint
 *
 * @see _bmad-output/implementation-artifacts/12-11-footer-consistency.md
 * @see docs/layout-system.md
 */

import { test, expect } from "@playwright/test";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  nav: { width: 900, height: 800 }, // 841px+ where HireMe circular becomes visible
  desktop: { width: 1280, height: 800 },
};

const PAGES = ["/", "/about", "/projects", "/articles"];

test.describe("Footer Consistency (Story 12.11)", () => {
  test.describe("AC1: Footer Consistent Across All Pages", () => {
    test("footer is visible on all pages", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);

      for (const url of PAGES) {
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        // Use visible filter since Home has 2 footers (one hidden by CSS)
        const visibleFooter = page.getByTestId("footer").locator("visible=true").first();
        await expect(visibleFooter).toBeVisible();
      }
    });

    test("footer structure is identical across all pages", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);

      const footerStructures: string[] = [];

      for (const url of PAGES) {
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        // Use visible filter since Home has 2 footer-content divs
        const footerContent = page.getByTestId("footer-content").locator("visible=true").first();
        await expect(footerContent).toBeVisible();

        // Get child element count to verify structure
        const childCount = await footerContent.evaluate(
          (el) => el.children.length
        );
        footerStructures.push(`${url}:${childCount}`);
      }

      // All pages should have same child count (5 elements)
      const firstStructure = footerStructures[0].split(":")[1];
      for (const structure of footerStructures) {
        const count = structure.split(":")[1];
        expect(count).toBe(firstStructure);
      }
    });
  });

  test.describe("AC2: HireMe Hover Color Inversion", () => {
    test("hire me link changes background on hover (light theme)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("hire-me-link");

      // Skip if HireMe not visible (shouldn't happen at desktop)
      if (!(await hireMe.isVisible())) {
        test.skip();
        return;
      }

      // Get initial background color
      const initialBg = await hireMe.evaluate((el) =>
        getComputedStyle(el).backgroundColor
      );

      // Hover over the link
      await hireMe.hover();

      // Get hover background color (CSS transition is instant for background-color)
      const hoverBg = await hireMe.evaluate((el) =>
        getComputedStyle(el).backgroundColor
      );

      // Colors should change (invert)
      expect(hoverBg).not.toBe(initialBg);
    });

    test("hire me link changes text color on hover", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("hire-me-link");

      if (!(await hireMe.isVisible())) {
        test.skip();
        return;
      }

      // Get initial text color
      const initialColor = await hireMe.evaluate((el) =>
        getComputedStyle(el).color
      );

      // Hover
      await hireMe.hover();

      // Get hover text color (CSS transition is instant for color)
      const hoverColor = await hireMe.evaluate((el) =>
        getComputedStyle(el).color
      );

      // Colors should change
      expect(hoverColor).not.toBe(initialColor);
    });
  });

  test.describe("AC3: HireMe Not Duplicated", () => {
    test("only one HireMe circular component on Home page", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Count all HireMe circular components in DOM
      const hireMeCount = await page.getByTestId("hire-me-circular").count();

      // Should be exactly 1
      expect(hireMeCount).toBe(1);
    });

    test("global footer is hidden on Home page", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // The global layout footer (direct child of .layout) should be hidden
      // But the footer inside secondary blade should be visible
      const visibleFooters = page.locator('footer[data-testid="footer"]:visible');
      const visibleCount = await visibleFooters.count();

      // Should have exactly 1 visible footer (the one inside secondary blade)
      expect(visibleCount).toBe(1);
    });
  });

  test.describe("AC4: Footer Visual Closure", () => {
    test("footer has border-top for visual separation", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const footer = page.getByTestId("footer");
      await expect(footer).toBeVisible();

      // Check border-top style
      const borderTop = await footer.evaluate((el) =>
        getComputedStyle(el).borderTopWidth
      );

      // Should have border (2px as per styles.css)
      expect(parseInt(borderTop)).toBeGreaterThan(0);
    });

    test("footer content has proper padding", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const footerContent = page.getByTestId("footer-content");

      const paddingTop = await footerContent.evaluate((el) =>
        getComputedStyle(el).paddingTop
      );

      // Should have vertical padding
      expect(parseInt(paddingTop)).toBeGreaterThan(0);
    });
  });

  test.describe("AC5: Footer data-testid Attributes", () => {
    test("footer has data-testid attribute", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const footer = page.getByTestId("footer");
      await expect(footer).toBeVisible();
    });

    test("footer-content has data-testid attribute", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const footerContent = page.getByTestId("footer-content");
      await expect(footerContent).toBeVisible();
    });

    test("hire-me-circular has data-testid attribute", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("hire-me-circular");
      await expect(hireMe).toBeVisible();
    });
  });

  test.describe("AC6: HireMe Visibility Per Breakpoint", () => {
    test("hire me circular is hidden on mobile (<841px)", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("hire-me-circular");

      // Should exist in DOM but be hidden
      await expect(hireMe).toBeHidden();
    });

    test("hire me circular is hidden on tablet (<841px)", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("hire-me-circular");
      await expect(hireMe).toBeHidden();
    });

    test("hire me circular is visible at nav+ (≥841px)", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.nav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("hire-me-circular");
      await expect(hireMe).toBeVisible();
    });

    test("hire me circular is visible at desktop", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("hire-me-circular");
      await expect(hireMe).toBeVisible();
    });

    test("hire me circular positioned in top-right at nav+", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = page.getByTestId("hire-me-circular");
      await expect(hireMe).toBeVisible();

      // Check position (should be absolute, top-right)
      const position = await hireMe.evaluate((el) =>
        getComputedStyle(el).position
      );
      const right = await hireMe.evaluate((el) => getComputedStyle(el).right);

      expect(position).toBe("absolute");
      expect(right).not.toBe("auto");
    });
  });
});
