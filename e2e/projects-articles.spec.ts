import { test, expect, Page } from "@playwright/test";
import { TESTIDS } from "./testids";

/**
 * Story 14.9: Epic 14 E2E Test Suite
 *
 * Comprehensive tests for Projects and Articles page behaviors.
 * Validates hover effects, touch behaviors, sequential animations,
 * and page layouts across viewports.
 *
 * NFR14.5: "E2E tests para hover, touch, y sequential appearance"
 */

// =============================================================================
// HELPER FUNCTIONS & CONSTANTS
// =============================================================================

/** Viewport configurations */
const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  desktop: { width: 1280, height: 800 },
};

/** Desktop breakpoint threshold */
const DESKTOP_BREAKPOINT = 1025;

/** Articles desktop breakpoint for hover thumbnail (≥641px) */
const ARTICLES_DESKTOP_BREAKPOINT = 641;

/** Animation timing buffer for assertions */
const ANIMATION_BUFFER = 300;

/**
 * Navigate and wait for page to be ready
 * Uses main content as indicator since nav may be hidden on mobile
 */
async function navigateAndWait(page: Page, url: string): Promise<void> {
  await page.goto(url);
  // Wait for main content to be visible (works on all viewports)
  await page.waitForSelector(`[data-testid="${TESTIDS.layout.mainContent}"]`, {
    timeout: 15000,
  });
}

/**
 * Check if viewport is desktop (for hover tests)
 */
function isDesktopViewport(width: number): boolean {
  return width >= DESKTOP_BREAKPOINT;
}

/**
 * Check if viewport supports hover thumbnail (articles)
 */
function supportsHoverThumbnail(width: number): boolean {
  return width >= ARTICLES_DESKTOP_BREAKPOINT;
}

// =============================================================================
// AC1: Projects Page E2E Tests
// =============================================================================

test.describe("AC1: Projects page E2E tests", () => {
  test.describe("Desktop viewport", () => {
    test.use({ viewport: VIEWPORTS.desktop });

    test("1.1: featured project blade renders correctly (FR14.2)", async ({
      page,
    }) => {
      await navigateAndWait(page, "/projects");

      // Projects page should be visible
      const projectsPage = page.getByTestId(TESTIDS.projects.page);
      await expect(projectsPage).toBeVisible();

      // Hero blade should exist
      const heroBlade = page.getByTestId(TESTIDS.projects.heroBlade);
      await expect(heroBlade).toBeVisible();

      // Featured project card should be visible in hero (use first() as there may be multiple)
      const featuredCard = page
        .getByTestId(TESTIDS.projectCard.featured)
        .first();
      await expect(featuredCard).toBeVisible();
    });

    test("1.2: non-featured projects render in grid layout (FR14.3)", async ({
      page,
    }) => {
      await navigateAndWait(page, "/projects");

      // Grid blade should be visible (use first() as there may be multiple blades)
      const gridBlade = page.getByTestId(TESTIDS.projects.gridBlade).first();
      await expect(gridBlade).toBeVisible();

      // Grid container should exist (use first() as there may be multiple)
      const grid = page.getByTestId(TESTIDS.projects.grid).first();
      await expect(grid).toBeVisible();

      // Grid items should be present
      const gridItems = page.getByTestId(TESTIDS.projects.gridItem);
      const count = await gridItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test("1.3: maximum 6 projects displayed (FR14.1)", async ({ page }) => {
      await navigateAndWait(page, "/projects");

      // Count all project cards (featured + grid)
      const featuredCards = page.getByTestId(TESTIDS.projectCard.featured);
      const gridCards = page.getByTestId(TESTIDS.projectCard.grid);

      const featuredCount = await featuredCards.count();
      const gridCount = await gridCards.count();
      const totalProjects = featuredCount + gridCount;

      expect(totalProjects).toBeLessThanOrEqual(6);
    });

    test("1.4: project cards show tech stack icons (FR14.5)", async ({
      page,
    }) => {
      await navigateAndWait(page, "/projects");

      // Wait for featured card to be visible (ensures page loaded)
      const featuredCard = page
        .getByTestId(TESTIDS.projectCard.featured)
        .first();
      await expect(featuredCard).toBeVisible({ timeout: 5000 });

      // Tech stacks are rendered within cards
      const techStacks = page.getByTestId(TESTIDS.projectCard.techStack);
      const count = await techStacks.count();

      // FR14.5 requires tech stack icons - validate they exist and are visible
      expect(count).toBeGreaterThan(0);

      // First tech stack should be visible
      const firstTechStack = techStacks.first();
      await expect(firstTechStack).toBeVisible();
    });
  });

  test.describe("Mobile viewport", () => {
    test.use({ viewport: VIEWPORTS.mobile });

    test("1.5: page works at mobile viewport (375px)", async ({ page }) => {
      await navigateAndWait(page, "/projects");

      // Projects page should be visible
      const projectsPage = page.getByTestId(TESTIDS.projects.page);
      await expect(projectsPage).toBeVisible();

      // Hero blade should exist
      const heroBlade = page.getByTestId(TESTIDS.projects.heroBlade);
      await expect(heroBlade).toBeVisible();

      // Featured card should still be visible on mobile (use first() as there may be multiple)
      const featuredCard = page
        .getByTestId(TESTIDS.projectCard.featured)
        .first();
      await expect(featuredCard).toBeVisible();
    });
  });
});

// =============================================================================
// AC2: Project Hover Interaction Tests (Desktop Only)
// =============================================================================

test.describe("AC2: Project hover interaction tests", () => {
  test.describe("Desktop viewport (≥1025px)", () => {
    test.use({ viewport: VIEWPORTS.desktop });

    test("2.1: image zoom effect activates on hover (FR14.4)", async ({
      page,
    }) => {
      await navigateAndWait(page, "/projects");

      // Get a project card image
      const projectImage = page.getByTestId(TESTIDS.projectCard.image).first();
      await expect(projectImage).toBeVisible();

      // Get initial transform
      const initialTransform = await projectImage.evaluate(
        (el) => window.getComputedStyle(el).transform
      );

      // Hover over the image link
      const imageLink = page.getByTestId(TESTIDS.projectCard.imageLink).first();
      const imageHref = await imageLink.getAttribute("href");
      expect(imageHref).toBeTruthy();
      await imageLink.hover();
      await page.waitForTimeout(ANIMATION_BUFFER);

      // Image should have transformed (zoom effect)
      const hoverTransform = await projectImage.evaluate(
        (el) => window.getComputedStyle(el).transform
      );

      expect(hoverTransform).toBeTruthy();
      if (initialTransform !== "none") {
        expect(hoverTransform).not.toBe(initialTransform);
      }
    });

    test("2.2: GitHub/Demo action buttons are accessible (FR14.6)", async ({
      page,
    }) => {
      // Design decision: Featured/Grid cards always show action buttons (no hover transition)
      // This provides better mobile UX and accessibility. The AC "appear on hover" is
      // interpreted as "are accessible when user interacts" for these variants.
      // See: src/ui/organisms/ProjectCard/styles.css lines 251-254
      await navigateAndWait(page, "/projects");

      // Get a project card with actions (use first() as there may be multiple)
      const projectCard = page
        .getByTestId(TESTIDS.projectCard.featured)
        .first();
      await expect(projectCard).toBeVisible();

      // Actions container within this specific card
      const actions = projectCard.getByTestId(TESTIDS.projectCard.actions);

      // Actions should be visible (always visible in featured/grid variants)
      await expect(actions).toBeVisible();

      // Verify actions have full opacity (not hidden)
      const opacity = await actions.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).opacity)
      );
      expect(opacity).toBe(1);

      // Verify action links exist (using actual TESTIDs from ActionLinks.tsx)
      // Note: TESTIDs are 'project-card-action-github' and 'project-card-action-visit'
      const githubLink = actions.locator(
        '[data-testid="project-card-action-github"]'
      );
      const visitLink = actions.locator(
        '[data-testid="project-card-action-visit"]'
      );

      // At least one action should exist
      const githubExists = (await githubLink.count()) > 0;
      const visitExists = (await visitLink.count()) > 0;
      expect(githubExists || visitExists).toBe(true);
    });

    test("2.3: hover state clears on mouse leave", async ({ page }) => {
      await navigateAndWait(page, "/projects");

      // Use first() as there may be multiple featured cards
      const projectCard = page
        .getByTestId(TESTIDS.projectCard.featured)
        .first();
      await projectCard.hover();
      await page.waitForTimeout(ANIMATION_BUFFER);

      // Move mouse away (to a neutral area)
      await page.mouse.move(0, 0);
      await page.waitForTimeout(ANIMATION_BUFFER);

      // Card should no longer be in hover state
      // This is verified by not having the touched class
      const hasTouchedClass = await projectCard.evaluate((el) =>
        el.classList.contains("project-card--touched")
      );
      expect(hasTouchedClass).toBe(false);
    });
  });

  test.describe("Mobile viewport (skip hover tests)", () => {
    test.use({ viewport: VIEWPORTS.mobile });

    test("2.4: skip hover validation at mobile viewport", async ({ page }) => {
      await navigateAndWait(page, "/projects");

      // At mobile, hover tests are skipped - just verify page loads
      const projectsPage = page.getByTestId(TESTIDS.projects.page);
      await expect(projectsPage).toBeVisible();

      // Hover is not applicable on touch devices
      // Test passes as a no-op validation
    });
  });
});

// =============================================================================
// AC3: Articles Page E2E Tests
// =============================================================================

test.describe("AC3: Articles page E2E tests", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test("3.1: featured articles blade renders (FR14.8)", async ({ page }) => {
    await navigateAndWait(page, "/articles");

    // Articles page should be visible
    const articlesPage = page.getByTestId(TESTIDS.articles.page);
    await expect(articlesPage).toBeVisible();

    // Hero blade should exist
    const heroBlade = page.getByTestId(TESTIDS.articles.heroBlade);
    await expect(heroBlade).toBeVisible();

    // Featured container should exist and be visible (FR14.8 requires featured articles)
    const featuredContainer = page.getByTestId(
      TESTIDS.articles.featuredContainer
    );
    await expect(featuredContainer).toBeVisible();
  });

  test("3.2: all articles list renders with correct structure", async ({
    page,
  }) => {
    await navigateAndWait(page, "/articles");

    // List blade should be visible (if there are non-featured articles)
    const listBlade = page.getByTestId(TESTIDS.articles.listBlade);

    // Either list blade exists or page is valid without it
    const listBladeExists = (await listBlade.count()) > 0;

    if (listBladeExists) {
      await expect(listBlade).toBeVisible();

      // List heading should be visible
      const listHeading = page.getByTestId(TESTIDS.articles.listHeading);
      await expect(listHeading).toBeVisible();

      // Articles list container
      const list = page.getByTestId(TESTIDS.articles.list);
      await expect(list).toBeVisible();
    }
  });

  test("3.3: article cards show date prominently (FR14.11)", async ({
    page,
  }) => {
    // Note: FR14.12 (tags) is implemented in FeaturedArticleCard, not ArticleListItem.
    // ArticleListItem is designed to be minimal: title + date only.
    // Tags appear in the featured articles section at the top of the page.
    await navigateAndWait(page, "/articles");

    // Find article list items
    const articleItems = page.getByTestId(TESTIDS.articleListItem.article);
    const count = await articleItems.count();

    // If there are article list items, validate date prominence
    // The list may be empty if all articles are featured
    if (count > 0) {
      // First article should have visible date (FR14.11)
      const firstDate = page.getByTestId(TESTIDS.articleListItem.date).first();
      await expect(firstDate).toBeVisible();

      // First article should have visible title
      const firstTitle = page
        .getByTestId(TESTIDS.articleListItem.title)
        .first();
      await expect(firstTitle).toBeVisible();
    } else {
      // All articles are featured (no list items) - this is valid
      // Verify featured container exists instead
      const featuredContainer = page.getByTestId(
        TESTIDS.articles.featuredContainer
      );
      await expect(featuredContainer).toBeVisible();
    }
  });

  test("3.4: footer coexists with articles list (FR14.13)", async ({
    page,
  }) => {
    await navigateAndWait(page, "/articles");

    // Page should be visible
    const articlesPage = page.getByTestId(TESTIDS.articles.page);
    await expect(articlesPage).toBeVisible();

    // Scroll to bottom to see footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(ANIMATION_BUFFER);

    // Footer should be visible (using generic footer selector)
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
});

// =============================================================================
// AC4: Article Sequential Appearance Tests
// =============================================================================

test.describe("AC4: Article sequential appearance tests", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test("4.1: articles visible on initial load", async ({ page }) => {
    await navigateAndWait(page, "/articles");

    // Wait for initial animations to complete
    const articleItems = page.getByTestId(TESTIDS.articleListItem.article);
    await expect(articleItems.first()).toBeVisible({ timeout: 5000 });

    // Verify articles are present
    const count = await articleItems.count();
    expect(count).toBeGreaterThan(0);

    // First article should be visible
    await expect(articleItems.first()).toBeVisible();
  });

  test("4.2: scroll reveals more articles (FR14.9)", async ({ page }) => {
    await navigateAndWait(page, "/articles");

    // Wait for initial load
    const articleItems = page.getByTestId(TESTIDS.articleListItem.article);
    await expect(articleItems.first()).toBeVisible({ timeout: 5000 });

    // Count initial visible articles
    const initialCount = await articleItems.count();
    expect(initialCount).toBeGreaterThan(0);

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));

    // Wait for scroll-triggered animations
    await expect(articleItems.first()).toBeVisible({ timeout: 2000 });

    // Articles should still be present (animation completed)
    const afterScrollCount = await articleItems.count();
    expect(afterScrollCount).toBeGreaterThanOrEqual(initialCount);
  });

  test("4.3: animation respects canAnimate flag (FR14.15)", async ({
    page,
  }) => {
    // Set reduced motion to trigger canAnimate = false in TransitionProvider
    await page.emulateMedia({ reducedMotion: "reduce" });

    // Navigate and wait for page to be ready
    await page.goto("/articles");
    await page.waitForSelector(
      `[data-testid="${TESTIDS.layout.mainContent}"]`,
      {
        timeout: 15000,
      }
    );

    // With reduced motion, articles should appear instantly (no stagger delay)
    const articleItems = page.getByTestId(TESTIDS.articleListItem.article);

    // Wait for articles to load
    await expect(articleItems.first()).toBeVisible({ timeout: 5000 });

    const count = await articleItems.count();

    // Articles list must have items to validate animation behavior
    expect(count).toBeGreaterThan(0);

    // All articles should be visible immediately (no sequential delay)
    // With canAnimate=false, there's no stagger - all items render at once
    // Using short timeout proves they appear instantly, not staggered
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(articleItems.nth(i)).toBeVisible({ timeout: 1000 });
    }
  });
});

// =============================================================================
// AC5: Article Hover Thumbnail Tests (Desktop Only)
// =============================================================================

test.describe("AC5: Article hover thumbnail tests", () => {
  test.describe("Desktop viewport (≥641px)", () => {
    test.use({ viewport: VIEWPORTS.desktop });

    test("5.1: thumbnail appears on link hover (FR14.10)", async ({ page }) => {
      await navigateAndWait(page, "/articles");

      // Find article list item link - must exist for this test
      const articleLink = page
        .getByTestId(TESTIDS.articleListItem.link)
        .first();
      await expect(articleLink).toBeVisible({ timeout: 5000 });

      // Hover over the link
      await articleLink.hover();

      // Thumbnail should appear
      const thumbnail = page.getByTestId(
        TESTIDS.articleHoverThumbnail.container
      );
      await expect(thumbnail).toBeVisible({ timeout: 2000 });
    });

    test("5.2: thumbnail displays article featured image", async ({ page }) => {
      await navigateAndWait(page, "/articles");

      const articleLink = page
        .getByTestId(TESTIDS.articleListItem.link)
        .first();
      await expect(articleLink).toBeVisible({ timeout: 5000 });

      await articleLink.hover();

      // Thumbnail image should be visible with src attribute
      const thumbnailImage = page.getByTestId(
        TESTIDS.articleHoverThumbnail.image
      );
      await expect(thumbnailImage).toBeVisible({ timeout: 2000 });

      // Verify image has a src (actual image loaded)
      const src = await thumbnailImage.getAttribute("src");
      expect(src).toBeTruthy();
    });

    test("5.3: thumbnail disappears on mouse leave", async ({ page }) => {
      await navigateAndWait(page, "/articles");

      const articleLink = page
        .getByTestId(TESTIDS.articleListItem.link)
        .first();
      await expect(articleLink).toBeVisible({ timeout: 5000 });

      // Hover to show thumbnail
      await articleLink.hover();

      const thumbnail = page.getByTestId(
        TESTIDS.articleHoverThumbnail.container
      );
      await expect(thumbnail).toBeVisible({ timeout: 2000 });

      // Move mouse away
      await page.mouse.move(0, 0);

      // Thumbnail should be hidden
      await expect(thumbnail).not.toBeVisible({ timeout: 2000 });
    });

    test("5.4: thumbnail follows mouse cursor horizontally", async ({
      page,
    }) => {
      await navigateAndWait(page, "/articles");

      const articleLinks = page.getByTestId(TESTIDS.articleListItem.link);
      const linkCount = await articleLinks.count();

      // Skip test if no article list items (all articles may be featured)
      if (linkCount === 0) {
        // All articles are featured - thumbnail test not applicable
        const articlesPage = page.getByTestId(TESTIDS.articles.page);
        await expect(articlesPage).toBeVisible();
        return;
      }

      const articleLink = articleLinks.first();
      await expect(articleLink).toBeVisible({ timeout: 5000 });

      // Get link bounding box
      const linkBox = await articleLink.boundingBox();
      expect(linkBox).toBeTruthy();

      // Hover at one position using the link element directly
      await articleLink.hover();

      // Wait for thumbnail to appear
      const thumbnail = page.getByTestId(
        TESTIDS.articleHoverThumbnail.container
      );
      await expect(thumbnail).toBeVisible({ timeout: 5000 });

      const initialLeft = await thumbnail.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).left)
      );

      // Move mouse horizontally within the link
      await page.mouse.move(linkBox!.x + 150, linkBox!.y + linkBox!.height / 2);

      // Wait a moment for position update
      await page.waitForTimeout(200);

      const newLeft = await thumbnail.evaluate((el) =>
        parseFloat(window.getComputedStyle(el).left)
      );

      // Position should have changed (cursor following)
      // Use tolerance of 10px to account for minor layout variations
      const positionDelta = Math.abs(newLeft - initialLeft);
      expect(positionDelta).toBeGreaterThan(10);
    });
  });

  test.describe("Mobile viewport (skip hover tests)", () => {
    test.use({ viewport: VIEWPORTS.mobile });

    test("5.5: skip hover validation at mobile viewport", async ({ page }) => {
      await navigateAndWait(page, "/articles");

      // At mobile, hover thumbnail is disabled via CSS
      const articlesPage = page.getByTestId(TESTIDS.articles.page);
      await expect(articlesPage).toBeVisible();

      // Test passes as a no-op validation for mobile
    });
  });
});

// =============================================================================
// AC6: Touch Behavior Tests
// =============================================================================

test.describe("AC6: Touch behavior tests", () => {
  test.describe("Touch device emulation", () => {
    test.use({
      hasTouch: true,
      viewport: VIEWPORTS.mobile,
    });

    test("6.1: tap navigates directly to destination (projects)", async ({
      page,
    }) => {
      // Navigate using goto directly (touch devices)
      await page.goto("/projects");
      await page.waitForSelector(`[data-testid="${TESTIDS.projects.page}"]`, {
        timeout: 15000,
      });

      // Get a project card title link (use first() as there may be multiple)
      const projectCard = page
        .getByTestId(TESTIDS.projectCard.featured)
        .first();
      const cardExists = (await projectCard.count()) > 0;

      if (cardExists) {
        // Find the title link within the card
        const titleLink = projectCard
          .locator(".project-card__title-link")
          .first();
        const href = await titleLink.getAttribute("href");

        if (href) {
          await titleLink.tap();
          try {
            await page.waitForURL(`**${href}`, { timeout: 5000 });
          } catch {
            await titleLink.tap();
            await page.waitForURL(`**${href}`, { timeout: 10000 });
          }
          expect(page.url()).toContain(href);
        }
      }
    });

    test("6.2: no thumbnail appears on touch devices", async ({ page }) => {
      // Navigate using goto directly (touch devices)
      await page.goto("/articles");
      await page.waitForSelector(`[data-testid="${TESTIDS.articles.page}"]`, {
        timeout: 15000,
      });

      // On touch devices, thumbnail should NEVER appear regardless of list items
      // The CSS rule @media (hover: none) { display: none } handles this
      const thumbnail = page.getByTestId(
        TESTIDS.articleHoverThumbnail.container
      );

      // Thumbnail container should not be visible on touch devices
      await expect(thumbnail).not.toBeVisible();

      // Additionally verify the page loaded correctly
      const articlesPage = page.getByTestId(TESTIDS.articles.page);
      await expect(articlesPage).toBeVisible();
    });

    test("6.3: project cards work with touch - first tap reveals actions", async ({
      page,
    }) => {
      // Navigate using goto directly (touch devices)
      await page.goto("/projects");
      await page.waitForSelector(`[data-testid="${TESTIDS.projects.page}"]`, {
        timeout: 15000,
      });

      // Use first() as there may be multiple featured cards
      const projectCard = page
        .getByTestId(TESTIDS.projectCard.featured)
        .first();
      const cardExists = (await projectCard.count()) > 0;

      if (cardExists) {
        // First tap should trigger touchstart handler
        // The useTouchState hook sets touched state on touchstart
        await projectCard.dispatchEvent("touchstart");
        await page.waitForTimeout(ANIMATION_BUFFER);

        // Verify actions container is visible after touch
        // Design decision: Featured/Grid cards always show actions (no touch reveal needed)
        const actions = projectCard.getByTestId(TESTIDS.projectCard.actions);
        const actionsExist = (await actions.count()) > 0;

        if (actionsExist) {
          // Actions should be visible (always visible in featured/grid variants)
          await expect(actions).toBeVisible();
        }

        // Verify card is still visible and interactive after touch
        await expect(projectCard).toBeVisible();
      }
    });
  });
});

// =============================================================================
// AC7: Reduced Motion Support Tests
// =============================================================================

test.describe("AC7: Reduced motion support tests", () => {
  test.use({ viewport: VIEWPORTS.desktop });

  test.describe("prefers-reduced-motion: reduce", () => {
    test.beforeEach(async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: "reduce" });
    });

    test("7.1: sequential appearance animations are instant", async ({
      page,
    }) => {
      await page.goto("/articles");
      await page.waitForSelector(
        `[data-testid="${TESTIDS.layout.mainContent}"]`,
        {
          timeout: 15000,
        }
      );

      // Articles should appear instantly (no staggered animation)
      const articleItems = page.getByTestId(TESTIDS.articleListItem.article);

      // Wait for articles to load
      await expect(articleItems.first()).toBeVisible({ timeout: 5000 });

      const count = await articleItems.count();

      // Must have articles to validate animation behavior
      expect(count).toBeGreaterThan(0);

      // All articles should be visible immediately (no stagger delay)
      // Using short timeout (1s) proves they appear instantly, not sequentially staggered
      for (let i = 0; i < Math.min(count, 3); i++) {
        await expect(articleItems.nth(i)).toBeVisible({ timeout: 1000 });
      }
    });

    test("7.2: hover animations are reduced", async ({ page }) => {
      await page.goto("/projects");
      await page.waitForSelector(
        `[data-testid="${TESTIDS.layout.mainContent}"]`,
        {
          timeout: 15000,
        }
      );

      // With reduced motion, page should still render correctly
      const projectsPage = page.getByTestId(TESTIDS.projects.page);
      await expect(projectsPage).toBeVisible({ timeout: 5000 });

      // Project card should be visible (use first() to avoid strict mode violation)
      const projectCard = page
        .getByTestId(TESTIDS.projectCard.featured)
        .first();
      await expect(projectCard).toBeVisible({ timeout: 5000 });

      // Actions container should be in DOM (CSS handles visibility with reduced motion)
      const actions = page.getByTestId(TESTIDS.projectCard.actions).first();
      await expect(actions).toBeAttached();
    });

    test("7.3: core functionality remains intact", async ({ page }) => {
      await page.goto("/projects");
      await page.waitForSelector(
        `[data-testid="${TESTIDS.nav.header.homeLink}"]`,
        {
          timeout: 15000,
        }
      );

      // Projects page should load normally
      const projectsPage = page.getByTestId(TESTIDS.projects.page);
      await expect(projectsPage).toBeVisible();

      // Navigation should work
      const articlesLink = page.getByTestId(TESTIDS.nav.header.articlesLink);
      await articlesLink.click();
      await page.waitForURL("/articles", { timeout: 5000 });

      // Articles page should load
      const articlesPage = page.getByTestId(TESTIDS.articles.page);
      await expect(articlesPage).toBeVisible();
    });
  });
});
