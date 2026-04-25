import { expect, test } from "@playwright/test";

test.describe("Subscriptions CTA", () => {
  test.skip(
    process.env.NEXT_PUBLIC_MONETIZATION_MODE !== "subscribe",
    "Run with NEXT_PUBLIC_MONETIZATION_MODE=subscribe"
  );

  test("renders subscribe CTA mode for monetized article", async ({ page }) => {
    await page.goto("/articles/why-portfolio-not-convert", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector('[data-testid="layout-main-content"]', {
      state: "visible",
    });

    await expect(page.getByText("This content is locked")).toHaveCount(0);

    const monetizationSection = page.locator(
      '[data-testid="article-monetization"]'
    );
    await expect(monetizationSection).toBeVisible();
    await expect(page.getByText("Used in real client funnels")).toHaveCount(0);

    await expect(
      monetizationSection.locator('input[aria-label="Email address"]')
    ).toBeVisible();
    await expect(
      monetizationSection.getByRole("button", { name: "Subscribe" })
    ).toBeVisible();
  });
});
