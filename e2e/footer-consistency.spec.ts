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
  nav: { width: 900, height: 800 }, // 800px+ where Menu becomes visible
  desktop: { width: 1280, height: 800 },
};

const PAGES = ["/", "/about", "/projects", "/articles"];

/**
 * HireMe circular renders in multiple DOM locations (Menu CTA zone + NavBar floating
 * container), but only ONE instance is ever visible: the floating CTA in
 * layout__hireme-mobile (position: fixed, bottom-right).
 * Menu's .menu-bar__cta is permanently hidden via CSS.
 *
 * Use visibility filtering to target the active instance and avoid strict mode violations.
 */
function getVisibleHireMe(page: import("@playwright/test").Page) {
  return page.getByTestId("hire-me-circular").locator("visible=true");
}

function getVisibleHireMeLink(page: import("@playwright/test").Page) {
  return page.getByTestId("hire-me-link").locator("visible=true");
}

test.describe("Footer Consistency (Story 12.11)", () => {
  test.describe("AC1: Footer Consistent Across All Pages", () => {
    test("footer is visible on all pages", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);

      for (const url of PAGES) {
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        // Use visible filter since Home has 2 footers (one hidden by CSS)
        const visibleFooter = page
          .getByTestId("footer")
          .locator("visible=true")
          .first();
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
        const footerContent = page
          .getByTestId("footer-content")
          .locator("visible=true")
          .first();
        await expect(footerContent).toBeVisible();

        const structure = await footerContent.evaluate((el) => {
          const top = el.querySelector(".footer-top");
          const identity = el.querySelector(".footer-top__identity");
          const groups = el.querySelector(".footer-top__groups");
          const bottom = el.querySelector(".footer-bottom");

          return {
            directChildren: el.children.length,
            hasTop: !!top,
            identitySections: identity ? identity.children.length : 0,
            groupedColumns: groups ? groups.children.length : 0,
            hasBottom: !!bottom,
          };
        });

        footerStructures.push(
          `${url}:${structure.directChildren}:${structure.hasTop}:${structure.identitySections}:${structure.groupedColumns}:${structure.hasBottom}`
        );
      }

      // All pages should have same structure:
      // footer-content => [footer-top, footer-bottom]
      // footer-top => [footer-top__identity, footer-top__groups]
      // footer-top__groups => [contact, links]
      const firstStructure = footerStructures[0].split(":").slice(1).join(":");
      for (const structure of footerStructures) {
        const normalized = structure.split(":").slice(1).join(":");
        expect(normalized).toBe(firstStructure);
      }
    });

    test("footer exposes Contact and Links groups with summary block", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const footer = page.getByTestId("footer");
      await expect(footer).toBeVisible();

      await expect(
        footer.getByRole("heading", { name: "Contact" })
      ).toBeVisible();
      await expect(
        footer.getByRole("heading", { name: "Links" })
      ).toBeVisible();

      const summary = footer.getByLabel("Technology stack summary");
      await expect(summary).toBeVisible();
      await expect(
        summary.getByText("Built with Next.js", { exact: false })
      ).toBeVisible();
      await expect(
        summary.getByText("State & Data", { exact: false })
      ).toBeVisible();
      await expect(
        summary.getByText("Redux Toolkit · TanStack Query · Zod", {
          exact: false,
        })
      ).toBeVisible();
      await expect(
        summary.getByText("Motion & UI", { exact: false })
      ).toBeVisible();
      await expect(
        summary.getByText("Framer Motion · Storybook", { exact: false })
      ).toBeVisible();
      await expect(
        summary.getByText("Testing & Accessibility", { exact: false })
      ).toBeVisible();
      await expect(
        summary.getByText("Playwright · Jest · axe-core", { exact: false })
      ).toBeVisible();
    });
  });

  test.describe("AC2: HireMe Hover Color Inversion", () => {
    // Expected hover values derived from styles.css:
    // Light hover → dark-mode palette: bg #e8e8e8 = rgb(232, 232, 232), text #1a1a1a = rgb(26, 26, 26)
    // Dark hover  → light-mode palette: bg #2a2a2a = rgb(42, 42, 42),   text #f5f5f5 = rgb(245, 245, 245)

    test("hire me link inverts to dark-mode colors on hover (light theme)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = getVisibleHireMeLink(page);
      await expect(hireMe).toBeVisible();

      await hireMe.hover();

      // Hover replaces gradient with flat background-color (cross-browser reliable)
      await expect(hireMe).toHaveCSS("background-color", "rgb(232, 232, 232)");
      await expect(hireMe).toHaveCSS("color", "rgb(26, 26, 26)");
    });

    test("hire me link inverts to light-mode colors on hover (dark theme)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      // Pre-set dark theme before navigation via localStorage
      await page.addInitScript(() => {
        localStorage.setItem("themeMode", "dark");
      });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      await expect
        .poll(async () =>
          page.evaluate(() =>
            document.documentElement.classList.contains("dark")
          )
        )
        .toBe(true);

      const hireMe = getVisibleHireMeLink(page);
      await expect(hireMe).toBeVisible();

      await hireMe.hover();

      await expect(hireMe).toHaveCSS("background-color", "rgb(42, 42, 42)");
      await expect(hireMe).toHaveCSS("color", "rgb(245, 245, 245)");
    });
  });

  test.describe("AC3: HireMe Not Duplicated", () => {
    test("only one HireMe circular visible at desktop viewport", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // HireMe exists in multiple DOM locations but only 1 should be visible.
      // Wait for post-load motion/layout effects before asserting strict count.
      await expect
        .poll(async () => getVisibleHireMe(page).count())
        .toBeGreaterThan(0);

      const visibleCount = await getVisibleHireMe(page).count();
      expect(visibleCount).toBe(1);
    });

    test("global footer is hidden on Home page", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // The global layout footer (direct child of .layout) should be hidden
      // But the footer inside secondary blade should be visible
      const visibleFooters = page.locator(
        'footer[data-testid="footer"]:visible'
      );
      await expect.poll(async () => visibleFooters.count()).toBeGreaterThan(0);
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
      const borderTop = await footer.evaluate(
        (el) => getComputedStyle(el).borderTopWidth
      );

      // Should have border (2px as per styles.css)
      expect(parseInt(borderTop)).toBeGreaterThan(0);
    });

    test("footer content has proper padding", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const footerContent = page
        .getByTestId("footer-content")
        .locator(".footer-top");

      const paddingTop = await footerContent.evaluate(
        (el) => getComputedStyle(el).paddingTop
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

      // Use visible filter — multiple HireMe in DOM, only 1 visible
      const hireMe = getVisibleHireMe(page);
      await expect(hireMe).toBeVisible();
    });
  });

  test.describe("AC6: HireMe Visibility Per Breakpoint", () => {
    test("floating hire me is visible on mobile", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Floating HireMe (layout__hireme-mobile) is always visible
      const hireMe = getVisibleHireMe(page);
      await expect(hireMe).toBeVisible();
    });

    test("floating hire me is visible on tablet", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = getVisibleHireMe(page);
      await expect(hireMe).toBeVisible();
    });

    test("floating hire me is visible at nav+", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.nav);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = getVisibleHireMe(page);
      await expect(hireMe).toBeVisible();
    });

    test("floating hire me is visible at desktop", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = getVisibleHireMe(page);
      await expect(hireMe).toBeVisible();
    });

    test("floating hire me positioned fixed at bottom-right", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const hireMe = getVisibleHireMe(page);
      await expect(hireMe).toBeVisible();

      // HireMe uses position:fixed in layout__hireme-mobile, anchored bottom-right
      const position = await hireMe.evaluate(
        (el) => getComputedStyle(el).position
      );
      const bottom = await hireMe.evaluate((el) => getComputedStyle(el).bottom);

      expect(position).toBe("fixed");
      expect(parseInt(bottom)).toBeGreaterThan(0);
    });
  });
});
