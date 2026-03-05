import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

test.use({ viewport: { width: 1280, height: 800 } });

test.describe("Auth Disabled State", () => {
  test("button shows disabled UX when OAuth flag is disabled", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const authButton = page
      .getByTestId(TESTIDS.header.uiZone)
      .getByTestId(TESTIDS.auth.button);

    await expect(authButton).toBeDisabled();
    await expect(authButton).toHaveAttribute(
      "aria-label",
      "Sign in (coming soon)"
    );
    await expect(authButton).not.toHaveAttribute("aria-expanded", "true");
  });
});
