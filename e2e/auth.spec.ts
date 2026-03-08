/**
 * Auth E2E Tests — Story 16.7
 *
 * Tests for all auth flows: modal, login, signup, OAuth, dropdown, logout,
 * session persistence, cross-tab sync, and accessibility.
 *
 * Mock service delays: login/signup/logout 800ms, OAuth 1200ms.
 */

import { test, expect, type Page } from "@playwright/test";
import { TESTIDS } from "./testids";

// Desktop viewport — auth button always visible
test.use({ viewport: { width: 1280, height: 800 } });

// ─── Helpers ────────────────────────────────────────────────────────────────

const VALID_LOGIN = { email: "user@test.com", password: "password123" };
const EXISTING_EMAIL = "existing@test.com";

/**
 * Get the visible AuthButton. At desktop viewport (1280px) there are 2 AuthButton
 * instances in the DOM (mobile-auth zone + ui zone). We scope to the desktop
 * UI zone (header-ui-zone) which is visible at navContent+ breakpoints (≥880px).
 */
function getAuthButton(page: Page) {
  return page
    .getByTestId(TESTIDS.header.uiZone)
    .getByTestId(TESTIDS.auth.button);
}

async function clearAuthSession(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("auth_session");
  });
}

async function loginWithCredentials(
  page: Page,
  email: string,
  password: string
) {
  await getAuthButton(page).click();
  await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible({
    timeout: 5000,
  });
  await page.locator("#auth-email").fill(email);
  await page.locator("#auth-password").fill(password);
  await page.getByTestId(TESTIDS.auth.formSubmit).click();
}

async function waitForAuthenticatedState(page: Page) {
  await expect(
    page.getByTestId(TESTIDS.header.uiZone).getByTestId(TESTIDS.auth.initials)
  ).toBeVisible({ timeout: 5000 });
}

async function setupAuthenticatedState(page: Page) {
  await loginWithCredentials(page, VALID_LOGIN.email, VALID_LOGIN.password);
  await waitForAuthenticatedState(page);
}

// ─── Auth Disabled State ─────────────────────────────────────────────────────

test.describe("Auth Entry State", () => {
  test("button starts enabled with collapsed aria state", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const authButton = getAuthButton(page);

    await expect(authButton).toBeEnabled();
    await expect(authButton).toHaveAttribute(
      "aria-label",
      "Open sign in panel"
    );
    await expect(authButton).toHaveAttribute("aria-expanded", "false");
  });
});

// ─── Auth Modal Tests (AC2) ─────────────────────────────────────────────────

test.describe("Auth Modal", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthSession(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("opens modal when clicking AuthButton (logged out)", async ({
    page,
  }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();
  });

  test("closes modal on backdrop click", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    // Click the backdrop (the modal container itself, not the panel)
    await page
      .getByTestId(TESTIDS.auth.modal)
      .click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId(TESTIDS.auth.modal)).not.toBeVisible({
      timeout: 3000,
    });
  });

  test("closes modal on Escape key", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId(TESTIDS.auth.modal)).not.toBeVisible({
      timeout: 3000,
    });
  });

  test("closes modal on X button click", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    await page.getByTestId(TESTIDS.auth.modalClose).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).not.toBeVisible({
      timeout: 3000,
    });
  });

  test("switches between Login and Signup tabs", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    // Default tab is Login
    await expect(page.locator("#auth-email")).toBeVisible();
    await expect(page.locator("#auth-name")).not.toBeVisible();

    // Switch to Signup
    await page.getByTestId(TESTIDS.auth.tabSignup).click();
    await expect(page.locator("#auth-name")).toBeVisible({ timeout: 3000 });
    await expect(page.locator("#auth-confirm")).toBeVisible({ timeout: 3000 });

    // Switch back to Login
    await page.getByTestId(TESTIDS.auth.tabLogin).click();
    await expect(page.locator("#auth-name")).not.toBeVisible({ timeout: 3000 });
  });

  test("has correct a11y attributes", async ({ page }) => {
    await getAuthButton(page).click();
    const modal = page.getByTestId(TESTIDS.auth.modal);
    await expect(modal).toBeVisible();

    await expect(modal).toHaveAttribute("role", "dialog");
    await expect(modal).toHaveAttribute("aria-modal", "true");
    await expect(modal).toHaveAttribute("aria-labelledby", "auth-dialog-title");
  });

  test("traps focus within modal", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    // First focusable element should be focused
    const firstFocusable = page
      .locator(
        "#authPanelFloating .auth-panel a[href], #authPanelFloating .auth-panel button, #authPanelFloating .auth-panel input"
      )
      .first();
    await expect(firstFocusable).toBeFocused({ timeout: 3000 });
  });
});

// ─── Email/Password Login Tests (AC3) ───────────────────────────────────────

test.describe("Email/Password Login", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthSession(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("logs in with valid credentials", async ({ page }) => {
    await loginWithCredentials(page, VALID_LOGIN.email, VALID_LOGIN.password);

    // Modal should close and initials should appear
    await waitForAuthenticatedState(page);
    await expect(page.getByTestId(TESTIDS.auth.modal)).not.toBeVisible({
      timeout: 5000,
    });
  });

  test('shows "Signing in..." during login request', async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    await page.locator("#auth-email").fill(VALID_LOGIN.email);
    await page.locator("#auth-password").fill(VALID_LOGIN.password);
    await page.getByTestId(TESTIDS.auth.formSubmit).click();

    // Button should show loading text
    await expect(page.getByTestId(TESTIDS.auth.formSubmit)).toContainText(
      "Signing in...",
      { timeout: 2000 }
    );
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await loginWithCredentials(page, "wrong@test.com", "wrongpass");

    // Scope to the auth-error inside the modal to avoid Next.js route announcer
    await expect(page.locator(".auth-error")).toContainText(
      "Invalid email or password",
      { timeout: 5000 }
    );

    // Modal should remain open
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();
  });

  test("session persists after page reload", async ({ page }) => {
    await setupAuthenticatedState(page);

    // Grab the session from localStorage before reload
    const session = await page.evaluate(() =>
      localStorage.getItem("auth_session")
    );
    expect(session).toBeTruthy();

    // Inject the session BEFORE the page reloads so the Redux store
    // picks it up in getInitialAuthState() (runs at module-eval time).
    await page.addInitScript((s: string) => {
      localStorage.setItem("auth_session", s);
    }, session!);

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Should still be authenticated (initials visible)
    await expect(
      page.getByTestId(TESTIDS.header.uiZone).getByTestId(TESTIDS.auth.initials)
    ).toBeVisible({ timeout: 10000 });
  });
});

// ─── Signup Tests (AC4) ─────────────────────────────────────────────────────

test.describe("Signup", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthSession(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("signs up with valid data", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    // Switch to Signup tab
    await page.getByTestId(TESTIDS.auth.tabSignup).click();
    await expect(page.locator("#auth-name")).toBeVisible({ timeout: 3000 });

    // Fill signup form
    await page.locator("#auth-name").fill("New User");
    await page.locator("#auth-email").fill("newuser@test.com");
    await page.locator("#auth-password").fill("password123");
    await page.locator("#auth-confirm").fill("password123");
    await page.getByTestId(TESTIDS.auth.formSubmit).click();

    // Should authenticate and close modal
    await waitForAuthenticatedState(page);
    await expect(page.getByTestId(TESTIDS.auth.modal)).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("shows error on duplicate email", async ({ page }) => {
    await getAuthButton(page).click();
    await page.getByTestId(TESTIDS.auth.tabSignup).click();
    await expect(page.locator("#auth-name")).toBeVisible({ timeout: 3000 });

    await page.locator("#auth-name").fill("Test");
    await page.locator("#auth-email").fill(EXISTING_EMAIL);
    await page.locator("#auth-password").fill("password123");
    await page.locator("#auth-confirm").fill("password123");
    await page.getByTestId(TESTIDS.auth.formSubmit).click();

    // Scope to the auth-error inside the modal to avoid Next.js route announcer
    await expect(page.locator(".auth-error")).toContainText(
      "An account with this email already exists",
      { timeout: 5000 }
    );
  });

  test("shows Name and Confirm Password fields in signup mode", async ({
    page,
  }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    // In Login mode, name and confirm should not be visible
    await expect(page.locator("#auth-name")).not.toBeVisible();
    await expect(page.locator("#auth-confirm")).not.toBeVisible();

    // Switch to Signup
    await page.getByTestId(TESTIDS.auth.tabSignup).click();

    // Fields should appear
    await expect(page.locator("#auth-name")).toBeVisible({ timeout: 3000 });
    await expect(page.locator("#auth-confirm")).toBeVisible({ timeout: 3000 });
  });
});

// ─── OAuth Tests (AC5) ──────────────────────────────────────────────────────

test.describe("OAuth Login", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthSession(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("all 3 OAuth buttons are visible", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    await expect(page.getByTestId(TESTIDS.auth.oauth.google)).toBeVisible();
    await expect(page.getByTestId(TESTIDS.auth.oauth.linkedin)).toBeVisible();
    await expect(page.getByTestId(TESTIDS.auth.oauth.microsoft)).toBeVisible();
  });

  test("OAuth Google login succeeds and closes modal", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.modal)).toBeVisible();

    await page.getByTestId(TESTIDS.auth.oauth.google).click();

    // Wait for OAuth delay (1200ms) + state update
    await waitForAuthenticatedState(page);
    await expect(page.getByTestId(TESTIDS.auth.modal)).not.toBeVisible({
      timeout: 5000,
    });
  });
});

// ─── Auth Dropdown & Logout Tests (AC6) ─────────────────────────────────────

test.describe("Auth Dropdown & Logout", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthSession(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await setupAuthenticatedState(page);
  });

  test("opens dropdown when clicking AuthButton (logged in)", async ({
    page,
  }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).toBeVisible({
      timeout: 3000,
    });
  });

  test("dropdown shows user name and email", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).toBeVisible({
      timeout: 3000,
    });

    // Mock login returns name "Test User" and email "user@test.com"
    await expect(page.locator(".auth-dropdown__name")).toContainText(
      "Test User"
    );
    await expect(page.locator(".auth-dropdown__email")).toContainText(
      "user@test.com"
    );
  });

  test('Sign Out button shows "Signing out..." during logout', async ({
    page,
  }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).toBeVisible({
      timeout: 3000,
    });

    await page.getByTestId(TESTIDS.auth.dropdownSignOut).click();

    // Button should show loading text during 800ms mock delay
    await expect(page.getByTestId(TESTIDS.auth.dropdownSignOut)).toContainText(
      "Signing out",
      { timeout: 2000 }
    );
  });

  test("logout closes dropdown and shows UserIcon", async ({ page }) => {
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).toBeVisible({
      timeout: 3000,
    });

    await page.getByTestId(TESTIDS.auth.dropdownSignOut).click();

    // After logout, dropdown should close and initials should disappear
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).not.toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.getByTestId(TESTIDS.header.uiZone).getByTestId(TESTIDS.auth.initials)
    ).not.toBeVisible({
      timeout: 5000,
    });
  });

  test("session does not persist after logout + reload", async ({ page }) => {
    // Logout
    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).toBeVisible({
      timeout: 3000,
    });
    await page.getByTestId(TESTIDS.auth.dropdownSignOut).click();
    await expect(
      page.getByTestId(TESTIDS.header.uiZone).getByTestId(TESTIDS.auth.initials)
    ).not.toBeVisible({
      timeout: 5000,
    });

    // Reload
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Should NOT be authenticated
    await expect(
      page.getByTestId(TESTIDS.header.uiZone).getByTestId(TESTIDS.auth.initials)
    ).not.toBeVisible({
      timeout: 5000,
    });
  });
});

// ─── Session Persistence & Cross-Tab Tests (AC7) ────────────────────────────

test.describe("Session Persistence & Cross-Tab", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthSession(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("new tab shows authenticated state after login", async ({
    page,
    context,
  }) => {
    await setupAuthenticatedState(page);

    // Open a new tab in the same context (shares localStorage)
    const page2 = await context.newPage();
    await page2.goto("/");
    await page2.waitForLoadState("networkidle");

    // New tab should show authenticated state
    await expect(
      page2
        .getByTestId(TESTIDS.header.uiZone)
        .getByTestId(TESTIDS.auth.initials)
    ).toBeVisible({
      timeout: 10000,
    });

    await page2.close();
  });

  test("cross-tab logout propagation", async ({ page, context }) => {
    await setupAuthenticatedState(page);

    // Open second tab
    const page2 = await context.newPage();
    await page2.goto("/");
    await page2.waitForLoadState("networkidle");
    await expect(
      page2
        .getByTestId(TESTIDS.header.uiZone)
        .getByTestId(TESTIDS.auth.initials)
    ).toBeVisible({
      timeout: 10000,
    });

    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).toBeVisible({
      timeout: 3000,
    });
    await page.getByTestId(TESTIDS.auth.dropdownSignOut).click();

    await expect(
      page.getByTestId(TESTIDS.header.uiZone).getByTestId(TESTIDS.auth.initials)
    ).not.toBeVisible({
      timeout: 5000,
    });

    await page2.reload();
    await page2.waitForLoadState("networkidle");
    await expect(
      page2
        .getByTestId(TESTIDS.header.uiZone)
        .getByTestId(TESTIDS.auth.initials)
    ).not.toBeVisible({
      timeout: 5000,
    });

    await page2.close();
  });
});

// ─── Accessibility Tests (AC8) ──────────────────────────────────────────────

test.describe("Auth Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthSession(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("AuthButton has correct aria-expanded when logged out", async ({
    page,
  }) => {
    const button = getAuthButton(page);
    await expect(button).toHaveAttribute("aria-expanded", "false");

    // Open modal
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
  });

  test("dropdown has role=menu and Sign Out has role=menuitem", async ({
    page,
  }) => {
    await setupAuthenticatedState(page);

    await getAuthButton(page).click();
    const dropdown = page.getByTestId(TESTIDS.auth.dropdown);
    await expect(dropdown).toBeVisible({ timeout: 3000 });

    await expect(dropdown).toHaveAttribute("role", "menu");
    await expect(
      page.getByTestId(TESTIDS.auth.dropdownSignOut)
    ).toHaveAttribute("role", "menuitem");
  });

  test("AuthButton has aria-expanded for dropdown state", async ({ page }) => {
    await setupAuthenticatedState(page);

    const button = getAuthButton(page);
    await expect(button).toHaveAttribute("aria-expanded", "false");

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
  });

  test("keyboard Escape closes dropdown", async ({ page }) => {
    await setupAuthenticatedState(page);

    await getAuthButton(page).click();
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).toBeVisible({
      timeout: 3000,
    });

    await page.keyboard.press("Escape");
    await expect(page.getByTestId(TESTIDS.auth.dropdown)).not.toBeVisible({
      timeout: 3000,
    });
  });
});
