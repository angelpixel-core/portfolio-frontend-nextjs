import { expect, test } from "@playwright/test";

test.describe("Resume Request Public Link Smoke", () => {
  test("submit invalidates token reuse", async ({ page }) => {
    const token = "smoke-token";
    let used = false;

    await page.route(`**/api/resume-request/public/${token}`, async (route) => {
      const method = route.request().method();

      if (method === "GET") {
        if (used) {
          await route.fulfill({
            status: 410,
            contentType: "application/json",
            body: JSON.stringify({ ok: false, error: "token_used" }),
          });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            recipientName: "Jane Doe",
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
          }),
        });
        return;
      }

      if (method === "POST") {
        if (used) {
          await route.fulfill({
            status: 410,
            contentType: "application/json",
            body: JSON.stringify({ ok: false, error: "token_used" }),
          });
          return;
        }

        used = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true, item: { id: "sub-1" } }),
        });
      }
    });

    await page.goto(`/resume-request/${token}`, { waitUntil: "domcontentloaded" });

    await expect(page.getByLabel("Name")).toHaveValue("Jane Doe");
    await page.getByLabel("Email (required)").fill("hello@test.com");
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(
      page.getByText("Request sent successfully. Thank you.")
    ).toBeVisible();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText("This link has already been used.")).toBeVisible();
  });
});
