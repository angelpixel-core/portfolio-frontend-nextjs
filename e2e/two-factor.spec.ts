/**
 * Two-Factor Settings E2E
 *
 * Covers: enrollment, verification, recovery codes, disable flow, and sign-in challenge.
 */

import { test, expect, type Page } from "@playwright/test";
import { TESTIDS } from "./testids";

test.use({ viewport: { width: 1280, height: 800 } });

test.setTimeout(60000);

const VALID_LOGIN = {
  email: "user@test.com",
  password: "password123",
  name: "Test User",
};

async function mockTwoFactorRoutes(page: Page) {
  const context = page.context();
  let twoFactorEnabled = false;
  let isAuthenticated = false;
  let enrollmentStarted = false;

  const getBodyValue = (
    body: Record<string, unknown>,
    key: string
  ): string | undefined => {
    const value = body[key];
    return typeof value === "string" ? value : undefined;
  };

  await context.unroute("**/api/auth/**");
  await context.route("**/api/auth/**", async (route) => {
    const requestUrl = new URL(route.request().url());
    const path = requestUrl.pathname;
    const body: Record<string, unknown> = {};

    try {
      Object.assign(body, route.request().postDataJSON?.() ?? {});
    } catch {
      const rawBody = route.request().postData();
      if (rawBody) {
        const params = new URLSearchParams(rawBody);
        for (const [key, value] of params.entries()) {
          body[key] = value;
        }
      }
    }

    if (path.includes("/sign-in/email")) {
      if (
        getBodyValue(body, "email") === VALID_LOGIN.email &&
        getBodyValue(body, "password") === VALID_LOGIN.password
      ) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ twoFactor: true }),
        });
        return;
      }

      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          error: { message: "Invalid email or password" },
        }),
      });
      return;
    }

    if (path.includes("/two-factor/enable")) {
      enrollmentStarted = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          totpURI:
            "otpauth://totp/Angel%20Solutions:user@test.com?secret=ABC123&issuer=Angel%20Solutions",
          backupCodes: ["code-1", "code-2"],
        }),
      });
      return;
    }

    if (path.includes("/two-factor/verify-totp")) {
      if (enrollmentStarted) {
        twoFactorEnabled = true;
        enrollmentStarted = false;
      }
      isAuthenticated = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "token",
          user: {
            email: VALID_LOGIN.email,
            name: VALID_LOGIN.name,
            twoFactorEnabled,
          },
        }),
      });
      return;
    }

    if (path.includes("/two-factor/disable")) {
      twoFactorEnabled = false;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: true }),
      });
      return;
    }

    if (path.includes("/two-factor/generate-backup-codes")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: true,
          backupCodes: ["code-3", "code-4"],
        }),
      });
      return;
    }

    if (path.includes("/session") || path.includes("/get-session")) {
      if (!isAuthenticated) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "null",
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            email: VALID_LOGIN.email,
            name: VALID_LOGIN.name,
            twoFactorEnabled,
          },
        }),
      });
      return;
    }

    if (path.includes("/csrf")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ csrfToken: "test-token" }),
      });
      return;
    }

    await route.continue();
  });
}

function getAuthButton(page: Page) {
  return page
    .getByTestId(TESTIDS.header.uiZone)
    .getByTestId(TESTIDS.auth.button);
}

test.describe("Two-Factor Settings", () => {
  test.beforeEach(async ({ page }) => {
    await mockTwoFactorRoutes(page);
    await page.addInitScript(() => {
      window.localStorage.removeItem("auth_session");
      window.grecaptcha = {
        ready: (callback: () => void) => callback(),
        execute: async () => "test-recaptcha-token",
      };
    });
    await page.goto("/settings", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(
      `[data-testid="${TESTIDS.layout.mainContent}"]`,
      {
        timeout: 10000,
      }
    );

    await page
      .getByTestId("settings-auth-required")
      .getByRole("button", { name: "Sign in" })
      .click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible({
      timeout: 5000,
    });
    await page.locator("#auth-email").fill(VALID_LOGIN.email);
    await page.locator("#auth-password").fill(VALID_LOGIN.password);
    await page.getByTestId(TESTIDS.auth.formSubmit).click();
    await page.getByLabel("Two-factor code").fill("123456");
    await page.getByTestId(TESTIDS.auth.formSubmit).click();

    await expect(page.getByTestId(TESTIDS.auth.modal)).not.toBeVisible({
      timeout: 5000,
    });
    await page.getByRole("button", { name: "Security" }).click();
  });

  test("enrolls and verifies two-factor", async ({ page }) => {
    await expect(page.getByText("Two-factor authentication")).toBeVisible();

    await page.getByLabel("Account password").fill(VALID_LOGIN.password);
    await page.getByRole("button", { name: "Start enrollment" }).click();

    await expect(page.getByAltText("2FA QR code")).toBeVisible();

    await page.getByLabel("Verification code").fill("123456");
    await page.getByRole("button", { name: "Verify and enable" }).click();

    await expect(page.getByTestId("recovery-codes")).toBeVisible();
  });
});

test.describe("Two-Factor Sign-In", () => {
  test.beforeEach(async ({ page }) => {
    await mockTwoFactorRoutes(page);
    await page.addInitScript(() => {
      window.localStorage.removeItem("auth_session");
      window.grecaptcha = {
        ready: (callback: () => void) => callback(),
        execute: async () => "test-recaptcha-token",
      };
    });
    await page.goto("/settings", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(
      `[data-testid="${TESTIDS.layout.mainContent}"]`,
      {
        timeout: 10000,
      }
    );
  });

  test("prompts for challenge during sign-in", async ({ page }) => {
    await page
      .getByTestId("settings-auth-required")
      .getByRole("button", { name: "Sign in" })
      .click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible({
      timeout: 5000,
    });
    await page.locator("#auth-email").fill(VALID_LOGIN.email);
    await page.locator("#auth-password").fill(VALID_LOGIN.password);
    await page.getByTestId(TESTIDS.auth.formSubmit).click();

    await expect(page.getByLabel("Two-factor code")).toBeVisible();
    await page.getByLabel("Two-factor code").fill("123456");
    await page.getByTestId(TESTIDS.auth.formSubmit).click();

    await expect(page.getByTestId(TESTIDS.auth.modal)).not.toBeVisible({
      timeout: 5000,
    });
  });
});
