import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Breakpoint Transition Tests (Story 11.3)
 *
 * Tests exact boundary points: 640, 641, 1023, 1024, 1025
 * Also tests menu state reset behavior when crossing to desktop.
 */

test.describe("Breakpoint Transition Diagnosis", () => {
  const getZoneStatus = async (page: any) => {
    const zones = {
      burger: page.getByTestId(TESTIDS.header.burgerZone),
      nav: page.getByTestId(TESTIDS.header.navZone),
      ui: page.getByTestId(TESTIDS.header.uiZone),
      social: page.getByTestId(TESTIDS.header.socialZone),
      auth: page.getByTestId(TESTIDS.header.authZone),
    };

    const status: Record<string, any> = {};
    for (const [name, locator] of Object.entries(zones)) {
      const isVisible = await locator.isVisible();
      let styles = null;
      try {
        styles = await locator.evaluate((el: HTMLElement) => {
          const s = window.getComputedStyle(el);
          return {
            display: s.display,
            visibility: s.visibility,
            width: s.width,
            height: s.height,
          };
        });
      } catch {
        styles = "not in DOM or error";
      }
      status[name] = { visible: isVisible, styles };
    }

    // Check MenuButton specifically
    const menuButton = page.locator(".menu_button");
    const menuButtonVisible = await menuButton.isVisible().catch(() => false);
    let menuButtonStyles = null;
    try {
      menuButtonStyles = await menuButton.evaluate((el: HTMLElement) => {
        const s = window.getComputedStyle(el);
        return { display: s.display, width: s.width, height: s.height };
      });
    } catch {
      menuButtonStyles = "not found";
    }
    status.menuButton = { visible: menuButtonVisible, styles: menuButtonStyles };

    // Check ThemeButton specifically
    const themeButton = page.locator(".theme-button");
    const themeButtonVisible = await themeButton.isVisible().catch(() => false);
    status.themeButton = { visible: themeButtonVisible };

    return status;
  };

  test("diagnose 640px (mobile boundary)", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const status = await getZoneStatus(page);
    console.log("=== 640px (mobile boundary) ===");
    console.log(JSON.stringify(status, null, 2));

    // Expected: burger visible, everything else hidden
    expect(status.burger.visible).toBe(true);
    expect(status.nav.visible).toBe(false);
    expect(status.ui.visible).toBe(false);
    expect(status.menuButton.visible).toBe(true);
  });

  test("diagnose 641px (tablet start)", async ({ page }) => {
    await page.setViewportSize({ width: 641, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const status = await getZoneStatus(page);
    console.log("=== 641px (tablet start) ===");
    console.log(JSON.stringify(status, null, 2));

    // Expected: burger visible, UI controls visible, nav hidden
    expect(status.burger.visible).toBe(true);
    expect(status.ui.visible).toBe(true);
    expect(status.nav.visible).toBe(false);
    expect(status.menuButton.visible).toBe(true);
    expect(status.themeButton.visible).toBe(true);
  });

  test("diagnose 1023px (tablet upper boundary)", async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const status = await getZoneStatus(page);
    console.log("=== 1023px (tablet upper boundary) ===");
    console.log(JSON.stringify(status, null, 2));

    // Expected: same as tablet - burger visible, UI visible, nav hidden
    expect(status.burger.visible).toBe(true);
    expect(status.ui.visible).toBe(true);
    expect(status.nav.visible).toBe(false);
    expect(status.menuButton.visible).toBe(true);
  });

  test("diagnose 1024px (tablet/desktop boundary)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const status = await getZoneStatus(page);
    console.log("=== 1024px (tablet/desktop boundary) ===");
    console.log(JSON.stringify(status, null, 2));

    // 1024 is still tablet (< 1025px desktop breakpoint)
    // Expected: burger visible, UI visible, nav hidden
    expect(status.burger.visible).toBe(true);
    expect(status.ui.visible).toBe(true);
    expect(status.nav.visible).toBe(false);
    expect(status.menuButton.visible).toBe(true);
  });

  test("diagnose 1025px (desktop start)", async ({ page }) => {
    await page.setViewportSize({ width: 1025, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const status = await getZoneStatus(page);
    console.log("=== 1025px (desktop start) ===");
    console.log(JSON.stringify(status, null, 2));

    // Expected: nav visible, UI visible, burger HIDDEN
    expect(status.nav.visible).toBe(true);
    expect(status.ui.visible).toBe(true);
    expect(status.burger.visible).toBe(false);
    expect(status.menuButton.visible).toBe(false);
    expect(status.social.visible).toBe(false); // only at wide
    expect(status.auth.visible).toBe(false); // only at wide
  });

  test("diagnose transition 640 → 641 (mobile → tablet)", async ({ page }) => {
    // Start at mobile
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    console.log("=== BEFORE: 640px ===");
    let status = await getZoneStatus(page);
    console.log(JSON.stringify(status, null, 2));

    // Transition to tablet
    await page.setViewportSize({ width: 641, height: 800 });
    await page.waitForTimeout(200);

    console.log("=== AFTER: 641px ===");
    status = await getZoneStatus(page);
    console.log(JSON.stringify(status, null, 2));

    // After transition: burger should still be visible, UI controls should appear
    expect(status.burger.visible).toBe(true);
    expect(status.ui.visible).toBe(true);
    expect(status.menuButton.visible).toBe(true);
    expect(status.themeButton.visible).toBe(true);
  });

  test("diagnose transition 1024 → 1025 (tablet → desktop)", async ({
    page,
  }) => {
    // Start at tablet boundary
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    console.log("=== BEFORE: 1024px ===");
    let status = await getZoneStatus(page);
    console.log(JSON.stringify(status, null, 2));

    // Transition to desktop
    await page.setViewportSize({ width: 1025, height: 800 });
    await page.waitForTimeout(200);

    console.log("=== AFTER: 1025px ===");
    status = await getZoneStatus(page);
    console.log(JSON.stringify(status, null, 2));

    // After transition: nav should appear, burger should disappear
    expect(status.nav.visible).toBe(true);
    expect(status.burger.visible).toBe(false);
    expect(status.menuButton.visible).toBe(false);
  });

  test("menu state resets when transitioning to desktop (zombie state prevention)", async ({
    page,
  }) => {
    // Start at tablet where burger menu is visible
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open the menu by clicking the burger button
    // Use force to bypass any overlay issues in test environment
    const menuButton = page.locator(".menu_button");
    await expect(menuButton).toBeVisible();
    await menuButton.click({ force: true });

    // Verify menu is open (floating overlay should appear)
    // The Floating component uses id="${id}Floating" format
    const floatingOverlay = page.locator('[id="menuFloating"]');
    await expect(floatingOverlay).toBeVisible({ timeout: 5000 });

    // Menu button should show "Close" aria-label when open
    await expect(menuButton).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    console.log("=== Menu opened at 1024px ===");

    // Transition to desktop - menu should auto-close
    await page.setViewportSize({ width: 1025, height: 800 });
    await page.waitForTimeout(300); // Allow for state update

    console.log("=== After transition to 1025px ===");

    // Menu button should be hidden at desktop
    await expect(menuButton).toBeHidden();

    // When we resize back to tablet, menu should be closed (not zombie state)
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.waitForTimeout(300);

    console.log("=== After returning to 1024px ===");

    // Menu button should be visible again
    await expect(menuButton).toBeVisible();

    // But it should show "Open" state (aria-expanded=false), not "Close" state
    await expect(menuButton).toHaveAttribute(
      "aria-expanded",
      "false"
    );

    // Floating overlay should NOT be visible (menu was auto-closed)
    await expect(floatingOverlay).toBeHidden();
  });
});
