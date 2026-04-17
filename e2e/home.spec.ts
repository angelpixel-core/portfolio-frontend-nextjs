import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

// A11y tests consolidated in e2e/accessibility.spec.ts

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads successfully with HTTP 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("displays profile section with title", async ({ page }) => {
    // The title should be visible (either loaded content or fallback "Welcome")
    const titleContainer = page.getByTestId(
      TESTIDS.profile.hero.titleContainer
    );
    await expect(titleContainer).toBeVisible();
  });

  test("displays hero image", async ({ page }) => {
    const heroImage = page.getByTestId(TESTIDS.profile.hero.image);
    await expect(heroImage).toBeVisible();
  });

  test("displays technology stack section (CustomersSlider)", async ({
    page,
  }) => {
    // CustomersSlider displays technologies/customers
    const slider = page.getByTestId(TESTIDS.profile.tech.slider);
    await expect(slider).toBeVisible();
  });

  test("has no console errors on page load", async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Filter out expected React hydration warnings or third-party errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes("hydration") &&
        !error.includes("ResizeObserver") &&
        !error.includes("third-party") &&
        !(
          error.includes("Content Security Policy") &&
          error.includes("recaptcha/api.js")
        )
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
