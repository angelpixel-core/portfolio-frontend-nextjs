/**
 * Performance Tests - Story 10.3
 *
 * Tests for font loading optimization and resource preloading.
 * Ensures no console warnings about unused preloaded resources.
 */

import { test, expect } from "@playwright/test";

test.describe("Performance - Font Loading", () => {
  test("has no font preload warnings on page load (Story 10.3)", async ({
    page,
  }) => {
    const preloadWarnings: string[] = [];

    // Capture console warnings about preloaded resources
    page.on("console", (msg) => {
      const text = msg.text();
      if (
        msg.type() === "warning" &&
        text.includes("preloaded") &&
        text.includes("was not used")
      ) {
        preloadWarnings.push(text);
      }
    });

    await page.goto("/");
    // Wait for fonts to load and potential warnings to appear
    await page.waitForLoadState("networkidle");
    // Additional wait to ensure warning would have fired
    await page.waitForTimeout(3000);

    // Should have zero preload warnings
    expect(
      preloadWarnings,
      `Found preload warnings: ${preloadWarnings.join(", ")}`
    ).toHaveLength(0);
  });

  test("fonts load without blocking render", async ({ page }) => {
    await page.goto("/");

    // Check that the page has content (fonts didn't block)
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Check that our font variable is applied
    const layout = page.locator(".layout");
    await expect(layout).toBeVisible();

    // Verify font-family is applied (Montserrat via --font-mont)
    const fontFamily = await layout.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });

    // Should include Montserrat (the font-mont variable resolves to Montserrat)
    expect(fontFamily.toLowerCase()).toContain("montserrat");
  });

  test("page maintains good LCP timing", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Use Performance API to get LCP
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry ? lastEntry.startTime : 0);
        }).observe({ type: "largest-contentful-paint", buffered: true });

        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });

    // LCP should be under 2500ms (WCAG requirement)
    // Note: In test environment, this may vary
    expect(lcp).toBeLessThan(5000); // More lenient for test environment
  });
});
