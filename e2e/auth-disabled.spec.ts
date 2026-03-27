import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

const OAUTH_DISABLED = process.env.NEXT_PUBLIC_OAUTH_ENABLED === "false";

test.use({ viewport: { width: 1280, height: 800 } });

test.describe.skip("Auth Disabled State", () => {
  test("button reflects oauth mode contract", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const authButton = page
      .getByTestId(TESTIDS.header.uiZone)
      .getByTestId(TESTIDS.auth.button);

    if (OAUTH_DISABLED) {
      await expect(authButton).toBeDisabled();
      await expect(authButton).toHaveAttribute(
        "aria-label",
        "Sign in (coming soon)"
      );
      await expect(authButton).not.toHaveAttribute("aria-expanded", "true");
      return;
    }

    await expect(authButton).toBeEnabled();
    await expect(authButton).toHaveAttribute(
      "aria-label",
      "Open sign in panel"
    );
    await expect(authButton).toHaveAttribute("aria-expanded", "false");
  });
});
