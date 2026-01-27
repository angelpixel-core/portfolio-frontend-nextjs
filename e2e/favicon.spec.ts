/**
 * Favicon Tests - Story 10.4
 *
 * Tests for favicon implementation.
 * Ensures favicon is accessible and properly served.
 */

import { test, expect } from "@playwright/test";

test.describe("Favicon Implementation", () => {
  test("favicon.ico returns 200 status (Story 10.4 AC2)", async ({ page }) => {
    // Navigate to the site first to establish context
    await page.goto("/");

    // Fetch favicon directly and check status
    const response = await page.request.get("/favicon.ico");

    expect(
      response.status(),
      "favicon.ico should return 200, not 404"
    ).toBe(200);
  });

  test("favicon is referenced in HTML head (Story 10.4 AC1)", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for favicon link in head
    // Next.js automatically adds this when favicon.ico exists in public/
    const faviconLink = page.locator('link[rel="icon"]');
    const shortcutIcon = page.locator('link[rel="shortcut icon"]');

    // At least one favicon reference should exist
    const hasFaviconLink = (await faviconLink.count()) > 0;
    const hasShortcutIcon = (await shortcutIcon.count()) > 0;

    expect(
      hasFaviconLink || hasShortcutIcon,
      "HTML head should contain a favicon link"
    ).toBe(true);
  });

  test("favicon has valid ICO content type (Story 10.4 AC2)", async ({
    page,
  }) => {
    await page.goto("/");

    const response = await page.request.get("/favicon.ico");

    // Verify content type is appropriate for favicon
    const contentType = response.headers()["content-type"];

    // ICO files can be served as image/x-icon, image/vnd.microsoft.icon, or image/ico
    const validContentTypes = [
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "image/ico",
      "image/png", // Next.js may serve PNG as favicon
    ];

    const hasValidContentType = validContentTypes.some((type) =>
      contentType?.includes(type)
    );

    expect(
      hasValidContentType,
      `favicon should have valid image content type, got: ${contentType}`
    ).toBe(true);
  });
});
