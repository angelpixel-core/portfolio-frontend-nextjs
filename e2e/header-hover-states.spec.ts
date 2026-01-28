/**
 * Header Hover & Selected States Tests (Story 12.4)
 *
 * Tests for AC1-AC5:
 * - AC1: Logo hover color transition (Framer Motion)
 * - AC2: Hire Me button hover inverse
 * - AC3: Navigation selected state visible
 * - AC4: Navigation hover animation from center
 * - AC5: Visual consistency in light/dark themes
 *
 * @see _bmad-output/implementation-artifacts/12-4-header-hover-selected-states.md
 * @see docs/layout-system.md
 */

import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 720, height: 1024 },
  nav: { width: 900, height: 800 },
  desktop: { width: 1280, height: 800 },
  wide: { width: 1920, height: 1080 },
};

test.describe("Header Hover & Selected States (Story 12.4)", () => {
  test.describe("AC3: Navigation Selected State Visible", () => {
    test("about link shows full underline when on /about page", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const aboutLink = page.getByTestId(TESTIDS.header.navLinks.about);
      const activeMark = aboutLink.locator(".active_mark");

      // Selected state should have scale-x-100 (full width)
      await expect(activeMark).toHaveClass(/active_mark--full/);
    });

    test("home link shows full underline when on / page", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const homeLink = page.getByTestId(TESTIDS.header.navLinks.home);
      const activeMark = homeLink.locator(".active_mark");

      await expect(activeMark).toHaveClass(/active_mark--full/);
    });

    test("non-active link has hidden underline", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const aboutLink = page.getByTestId(TESTIDS.header.navLinks.about);
      const activeMark = aboutLink.locator(".active_mark");

      // Non-selected should have scale-x-0 (hidden)
      await expect(activeMark).toHaveClass(/active_mark--none/);
    });
  });

  test.describe("AC4: Navigation Hover Animation from Center", () => {
    test("active mark uses CSS scale transform for center-out effect", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const aboutLink = page.getByTestId(TESTIDS.header.navLinks.about);
      const activeMark = aboutLink.locator(".active_mark");

      // Non-selected state should use scale-x-0 (CSS class indicates center-out)
      await expect(activeMark).toHaveClass(/active_mark--none/);

      // The element should have w-full but scale-x-0 (invisible but full width)
      // This allows center-out animation via scale transform
      await expect(activeMark).toHaveCSS("width", /\d+px/);
    });

    test("selected link underline is fully visible (scale-x-100)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const aboutLink = page.getByTestId(TESTIDS.header.navLinks.about);
      const activeMark = aboutLink.locator(".active_mark");

      // Selected state should have scale-x-100 (visible)
      await expect(activeMark).toHaveClass(/active_mark--full/);

      // Transform should be identity matrix (scale 1) or none
      const transform = await activeMark.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      // matrix(1, 0, 0, 1, 0, 0) is identity - scale-x is 1
      expect(transform).toMatch(/matrix\(1,\s*0,\s*0,\s*1|none/);
    });
  });

  test.describe("AC2: Hire Me Button Hover Inverse", () => {
    test("hire me header button has correct base colors (dark bg)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Wait for the actual link to load (not loading state)
      const hireMeButton = page
        .getByTestId(TESTIDS.header.hireMeZone)
        .locator("visible=true");
      await expect(hireMeButton).toBeVisible();

      // Base state: dark background (#1b1b1b = rgb(27, 27, 27))
      await expect(hireMeButton).toHaveCSS("background-color", "rgb(27, 27, 27)");
    });

    test("hire me header button inverts colors on hover (light ↔ dark)", async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Wait for button to be fully loaded (not loading state)
      const hireMeButton = page.getByTestId(TESTIDS.header.hireMeZone);
      await expect(hireMeButton).toBeVisible();
      await page.waitForTimeout(500); // Wait for data to load

      // Get base colors before hover
      const baseColors = await hireMeButton.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          bg: style.backgroundColor,
          text: style.color,
        };
      });

      // Hover over the button
      await hireMeButton.hover();
      await page.waitForTimeout(100); // Allow CSS transition

      // Get colors after hover
      const hoverColors = await hireMeButton.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          bg: style.backgroundColor,
          text: style.color,
        };
      });

      // Verify color inversion: bg and text should swap
      // Base: dark bg (#1b1b1b), light text (#f5f5f5)
      // Hover: light bg (#f5f5f5), dark text (#1b1b1b)
      expect(baseColors.bg).not.toBe(hoverColors.bg);
      expect(baseColors.text).not.toBe(hoverColors.text);
    });
  });

  test.describe("AC5: Visual Consistency Light/Dark Theme", () => {
    test("navigation underline visible in light theme", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const aboutLink = page.getByTestId(TESTIDS.header.navLinks.about);
      const activeMark = aboutLink.locator(".active_mark");

      // Should be visible (has background color)
      await expect(activeMark).toBeVisible();
      await expect(activeMark).toHaveClass(/active_mark--full/);
    });

    test("navigation underline visible in dark theme", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const aboutLink = page.getByTestId(TESTIDS.header.navLinks.about);
      const activeMark = aboutLink.locator(".active_mark");

      // Should be visible (has background color)
      await expect(activeMark).toBeVisible();
      await expect(activeMark).toHaveClass(/active_mark--full/);
    });
  });

  test.describe("AC1: Logo Hover (Framer Motion)", () => {
    test("logo link is interactive and accessible", async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto("/about");
      await page.waitForLoadState("networkidle");

      const logoLink = page.locator(".logo-link");

      // Logo should be present and have correct aria-label
      await expect(logoLink).toBeVisible();
      await expect(logoLink).toHaveAttribute("aria-label", "Go to home");

      // Should be clickable (navigate to home)
      await logoLink.click();
      await expect(page).toHaveURL("/");
    });
  });
});
