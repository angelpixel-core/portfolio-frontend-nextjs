import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

test.describe.configure({ timeout: 90000 });

// A11y tests consolidated in e2e/accessibility.spec.ts

// Use desktop viewport (≥1025px) where navigation is visible
// Story 11.3: Nav zone visible at desktop breakpoint (min-width: 1025px)
test.use({ viewport: { width: 1280, height: 800 } });

test.describe("Navigation", () => {
  const getDesktopNavZone = (page: import("@playwright/test").Page) =>
    page.getByTestId(TESTIDS.header.navZone);

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // Wait for navigation items to load (there's a 2s simulated delay in mock data)
    await page.waitForSelector(
      `[data-testid="${TESTIDS.nav.header.homeLink}"]`,
      {
        timeout: 15000,
      }
    );
  });

  test("main navigation links are visible", async ({ page }) => {
    const navZone = getDesktopNavZone(page);

    // Check for key navigation links using resilient testid selectors
    const homeLink = navZone.getByTestId(TESTIDS.nav.header.homeLink);
    const projectsLink = navZone.getByTestId(TESTIDS.nav.header.projectsLink);
    const articlesLink = navZone.getByTestId(TESTIDS.nav.header.articlesLink);

    await expect(homeLink).toBeVisible();
    await expect(projectsLink).toBeVisible();
    await expect(articlesLink).toBeVisible();
  });

  test("projects nav link targets Projects page", async ({ page }) => {
    const navZone = getDesktopNavZone(page);
    const projectsLink = navZone.getByTestId(TESTIDS.nav.header.projectsLink);
    await expect(projectsLink).toHaveAttribute("href", "/projects");

    await page.goto("/projects", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/projects");

    // Projects page should have content
    const content = page.getByTestId(TESTIDS.layout.mainContent);
    await expect(content).toBeVisible();
  });

  test("articles nav link targets Articles page", async ({ page }) => {
    const navZone = getDesktopNavZone(page);
    const articlesLink = navZone.getByTestId(TESTIDS.nav.header.articlesLink);
    await expect(articlesLink).toHaveAttribute("href", "/articles");

    await page.goto("/articles", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/articles");

    // Articles page should have content
    const content = page.getByTestId(TESTIDS.layout.mainContent);
    await expect(content).toBeVisible();
  });

  test("home nav link targets Homepage", async ({ page }) => {
    const navZone = getDesktopNavZone(page);

    const homeLink = navZone.getByTestId(TESTIDS.nav.header.homeLink);
    await expect(homeLink).toHaveAttribute("href", "/");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL("/");
  });

  test("navigation is keyboard accessible", async ({ page }) => {
    const navZone = getDesktopNavZone(page);

    // Find the first navigation link
    const homeLink = navZone.getByTestId(TESTIDS.nav.header.homeLink);
    await expect(homeLink).toBeVisible();

    // Focus on the link and verify it receives focus
    await homeLink.focus();
    await expect(homeLink).toBeFocused();

    // Tab to next element and verify focus moves
    await page.keyboard.press("Tab");
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });
});
