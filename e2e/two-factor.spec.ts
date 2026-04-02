/**
 * Two-Factor Settings E2E (placeholder)
 *
 * TODO: Enable once auth + 2FA flows are stable in E2E environment.
 * Covers: enrollment, verification, recovery codes, and disable flow.
 */

import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 800 } });

test.describe.skip("Two-Factor Settings", () => {
  test("enrolls, verifies, and disables two-factor", async ({ page }) => {
    // TODO: seed authenticated session or mock auth client.
    // TODO: visit /settings and navigate to two-factor panel.
    // TODO: trigger enrollment, verify TOTP code, assert recovery codes.
    // TODO: disable two-factor and confirm status state.

    await page.goto("/settings", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/settings/);
  });
});
