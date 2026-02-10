import { test, expect, Page } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Header Padding Tests (Story 11.4)
 *
 * Validates that header padding uses semantic breakpoints correctly.
 * Expected padding values per breakpoint (from NavBar styles.css):
 * - Mobile (0-639px): 24px (px-6)
 * - Tablet (640-1024px): 48px (tablet:px-12)
 * - Desktop (1025-1440px): 64px (desktop:px-16)
 * - Wide (≥1441px): 128px (wide:px-32)
 *
 * Vertical padding:
 * - Mobile/Tablet (0-1024px): 16px (py-4)
 * - Desktop+ (≥1025px): 24px (desktop:py-6)
 */

test.describe("Header Padding (Story 11.4)", () => {
  const getHeaderPadding = async (page: Page) => {
    const header = page.getByTestId(TESTIDS.header.container);
    return header.evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        paddingLeft: parseInt(styles.paddingLeft),
        paddingRight: parseInt(styles.paddingRight),
        paddingTop: parseInt(styles.paddingTop),
        paddingBottom: parseInt(styles.paddingBottom),
      };
    });
  };

  test.describe("Mobile Breakpoint (0-639px)", () => {
    test("has 24px horizontal padding at 375px", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      expect(padding.paddingLeft).toBe(24); // px-6 = 24px
      expect(padding.paddingRight).toBe(24);
    });

    test("has 24px horizontal padding at 639px (last mobile)", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 639, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      expect(padding.paddingLeft).toBe(24); // Still mobile px-6
      expect(padding.paddingRight).toBe(24);
    });
  });

  test.describe("Tablet Breakpoint (640-1024px)", () => {
    test("has 48px horizontal padding at 640px (tablet start)", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 640, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      expect(padding.paddingLeft).toBe(48); // px-12 = 48px
      expect(padding.paddingRight).toBe(48);
    });

    test("has 48px horizontal padding at 1024px (tablet end)", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1024, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      expect(padding.paddingLeft).toBe(48); // Still tablet
      expect(padding.paddingRight).toBe(48);
    });
  });

  test.describe("Desktop Breakpoint (1025-1440px)", () => {
    test("has 64px horizontal padding at 1025px (desktop start)", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1025, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      expect(padding.paddingLeft).toBe(64); // px-16 = 64px
      expect(padding.paddingRight).toBe(64);
    });

    test("has 64px horizontal padding at 1440px (desktop end)", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      expect(padding.paddingLeft).toBe(64); // Still desktop
      expect(padding.paddingRight).toBe(64);
    });
  });

  test.describe("Wide Breakpoint (≥1441px)", () => {
    test("has 128px horizontal padding at 1441px (wide start)", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1441, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      expect(padding.paddingLeft).toBe(128); // px-32 = 128px
      expect(padding.paddingRight).toBe(128);
    });

    test("has 128px horizontal padding at 1920px", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      expect(padding.paddingLeft).toBe(128); // Still wide
      expect(padding.paddingRight).toBe(128);
    });
  });

  test.describe("Vertical Padding", () => {
    test("has consistent vertical padding at mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      // py-4 = 16px at mobile (base)
      expect(padding.paddingTop).toBe(16);
      expect(padding.paddingBottom).toBe(16);
    });

    test("has consistent vertical padding at tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      // py-4 = 16px at tablet (same as mobile, desktop:py-6 doesn't apply)
      expect(padding.paddingTop).toBe(16);
      expect(padding.paddingBottom).toBe(16);
    });

    test("has reduced vertical padding at desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const padding = await getHeaderPadding(page);
      // desktop:py-6 = 24px at desktop+
      expect(padding.paddingTop).toBe(24);
      expect(padding.paddingBottom).toBe(24);
    });
  });
});
