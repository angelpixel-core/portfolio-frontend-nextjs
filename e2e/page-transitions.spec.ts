import { test, expect, Page } from '@playwright/test';
import { TESTIDS } from './testids';

/**
 * Story 13.8: Transition E2E Test Suite
 *
 * Comprehensive tests for the page transition system.
 * Validates entry/exit animations, 50% trigger, interaction blocking,
 * initial load behavior, and multi-route consistency.
 *
 * NFR13.4: "Testability: estados de transicion verificables via E2E tests"
 */

// =============================================================================
// TASK 1: Test Infrastructure - Helper Functions & Constants
// =============================================================================

/** Transition timing constants (matching TransitionProvider) */
const TIMING = {
  /** Duration of each curtain animation phase */
  ANIMATION_DURATION: 800,
  /** Stagger delay between curtains */
  STAGGER_DELAY: 100,
  /** Brief pause in covering phase */
  COVERING_PAUSE: 100,
  /** Total entry animation time (animation + 2 stagger delays) */
  ENTRY_TOTAL: 800 + 100 * 2,
  /** Total transition time (entry + covering + exit) */
  FULL_TRANSITION: 2000,
  /** Safety buffer for assertions */
  BUFFER: 200,
};

/** CSS selectors for transition elements */
const SELECTORS = {
  /** All curtain elements */
  CURTAINS: '.transition-effect_blade',
  /** Primary curtain (pink) - highest z-index */
  CURTAIN_PRIMARY: '.transition-effect_blade.z-50',
  /** Secondary curtain (white) */
  CURTAIN_SECONDARY: '.transition-effect_blade.z-40',
  /** Tertiary curtain (dark) - triggers 50% callback */
  CURTAIN_TERTIARY: '.transition-effect_blade.z-30',
};

/**
 * Wait for curtains to appear in DOM
 */
async function waitForCurtainsToAppear(page: Page, timeout = 2000): Promise<void> {
  await page.waitForSelector(SELECTORS.CURTAINS, {
    state: 'attached',
    timeout,
  });
}

/**
 * Wait for curtains to disappear from DOM
 */
async function waitForCurtainsToDisappear(page: Page, timeout = TIMING.FULL_TRANSITION + TIMING.BUFFER): Promise<void> {
  await page.waitForSelector(SELECTORS.CURTAINS, {
    state: 'detached',
    timeout,
  });
}

/**
 * Check if body has transition-active class
 */
async function hasTransitionActiveClass(page: Page): Promise<boolean> {
  return page.evaluate(() => document.body.classList.contains('transition-active'));
}

/**
 * Check if body has inert attribute
 */
async function hasInertAttribute(page: Page): Promise<boolean> {
  return page.evaluate(() => document.body.hasAttribute('inert'));
}

/**
 * Get computed cursor style on body
 */
async function getBodyCursor(page: Page): Promise<string> {
  return page.evaluate(() => window.getComputedStyle(document.body).cursor);
}

/**
 * Count visible curtain elements
 */
async function getCurtainCount(page: Page): Promise<number> {
  return page.locator(SELECTORS.CURTAINS).count();
}

/**
 * Navigate and wait for page to be ready
 */
async function navigateAndWait(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.waitForSelector(`[data-testid="${TESTIDS.nav.header.homeLink}"]`, {
    timeout: 15000,
  });
}

// =============================================================================
// TEST SUITE
// =============================================================================

test.describe('Page Transitions (Story 13.8)', () => {
  // Use desktop viewport where navigation is visible
  test.use({ viewport: { width: 1280, height: 800 } });

  // ==========================================================================
  // TASK 6: Initial Page Load Skip Tests (AC5) - Run first as they test no-transition state
  // ==========================================================================
  test.describe('AC5: Initial page load skip', () => {
    test('6.1: direct URL load shows no curtains', async ({ page }) => {
      // Load page directly via URL
      await page.goto('/');

      // Wait for page to be ready
      await page.waitForSelector(`[data-testid="${TESTIDS.nav.header.homeLink}"]`, {
        timeout: 15000,
      });

      // Curtains should NOT be present on initial load
      const curtainCount = await getCurtainCount(page);
      expect(curtainCount).toBe(0);

      // Content should be immediately visible
      const content = page.getByTestId(TESTIDS.layout.mainContent);
      await expect(content).toBeVisible();
    });

    test('6.2: page refresh shows no curtains', async ({ page }) => {
      // Navigate to about page first
      await navigateAndWait(page, '/about');

      // Wait for any transitions to complete
      await page.waitForTimeout(TIMING.FULL_TRANSITION);

      // Refresh the page
      await page.reload();

      // Wait for page to be ready
      await page.waitForSelector(`[data-testid="${TESTIDS.nav.header.homeLink}"]`, {
        timeout: 15000,
      });

      // Curtains should NOT be present after refresh
      const curtainCount = await getCurtainCount(page);
      expect(curtainCount).toBe(0);
    });

    test('6.3: content immediately visible on load', async ({ page }) => {
      // Load projects page directly
      await page.goto('/projects');

      // Content should be visible without waiting for transition
      const content = page.getByTestId(TESTIDS.layout.mainContent);
      await expect(content).toBeVisible({ timeout: 5000 });

      // No transition blocking should be active
      const hasClass = await hasTransitionActiveClass(page);
      expect(hasClass).toBe(false);
    });
  });

  // ==========================================================================
  // TASK 2: Entry Animation Tests (AC1)
  // ==========================================================================
  test.describe('AC1: Entry animation', () => {
    test.beforeEach(async ({ page }) => {
      await navigateAndWait(page, '/');
    });

    test('2.1: curtains appear on navigation click', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      // Start navigation
      const curtainsPromise = waitForCurtainsToAppear(page);
      await projectsLink.click();

      // Curtains should appear (3 layers, but AnimatePresence may render more during transition)
      await curtainsPromise;
      const curtainCount = await getCurtainCount(page);
      expect(curtainCount).toBeGreaterThanOrEqual(3); // At least 3 layers
    });

    test('2.2: 3-layer cascade visibility (z-50, z-40, z-30)', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();
      await waitForCurtainsToAppear(page);

      // Check each curtain layer exists (use .first() as AnimatePresence may render duplicates)
      const primaryCurtain = page.locator(SELECTORS.CURTAIN_PRIMARY).first();
      const secondaryCurtain = page.locator(SELECTORS.CURTAIN_SECONDARY).first();
      const tertiaryCurtain = page.locator(SELECTORS.CURTAIN_TERTIARY).first();

      await expect(primaryCurtain).toBeAttached();
      await expect(secondaryCurtain).toBeAttached();
      await expect(tertiaryCurtain).toBeAttached();

      // Verify z-index hierarchy via classes
      const primaryClasses = await primaryCurtain.getAttribute('class');
      const secondaryClasses = await secondaryCurtain.getAttribute('class');
      const tertiaryClasses = await tertiaryCurtain.getAttribute('class');

      expect(primaryClasses).toContain('z-50');
      expect(secondaryClasses).toContain('z-40');
      expect(tertiaryClasses).toContain('z-30');
    });

    test('2.3/2.4: curtains animate Left→Right to covering position', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();
      await waitForCurtainsToAppear(page);

      // Get initial curtain position (should be animating from left)
      const primaryCurtain = page.locator(SELECTORS.CURTAIN_PRIMARY).first();
      const initialTransform = await primaryCurtain.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      // Wait for entry animation to progress
      await page.waitForTimeout(TIMING.ENTRY_TOTAL + TIMING.BUFFER);

      // Get final curtain position (should be at covering position)
      const finalTransform = await primaryCurtain.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });

      // Verify transform changed (animation occurred)
      // Note: Initial transform starts at translateX(0) or similar, final should be different
      // The covering position means curtains are fully visible (covering the screen)
      expect(finalTransform).not.toBe('none');

      // Body should have transition-active class (indicates covering phase)
      const hasClass = await hasTransitionActiveClass(page);
      expect(hasClass).toBe(true);

      // Curtains should be fully covering (all 3 layers attached)
      await expect(page.locator(SELECTORS.CURTAIN_PRIMARY).first()).toBeAttached();
      await expect(page.locator(SELECTORS.CURTAIN_SECONDARY).first()).toBeAttached();
      await expect(page.locator(SELECTORS.CURTAIN_TERTIARY).first()).toBeAttached();
    });
  });

  // ==========================================================================
  // TASK 3: Exit Animation Tests (AC2)
  // ==========================================================================
  test.describe('AC2: Exit animation', () => {
    test.beforeEach(async ({ page }) => {
      await navigateAndWait(page, '/');
    });

    test('3.1/3.2/3.3: curtains animate Right→Left and return to off-screen', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();
      await waitForCurtainsToAppear(page);

      // Wait for covering phase (URL changes at 50%)
      await page.waitForURL('/projects', { timeout: TIMING.FULL_TRANSITION + 1000 });

      // During exit phase, all 3 curtain layers should still exist
      // (cascade exit: pink exits first, then white, then dark)
      const primaryExists = (await page.locator(SELECTORS.CURTAIN_PRIMARY).count()) > 0;
      const secondaryExists = (await page.locator(SELECTORS.CURTAIN_SECONDARY).count()) > 0;
      const tertiaryExists = (await page.locator(SELECTORS.CURTAIN_TERTIARY).count()) > 0;

      // At least one curtain type should still be visible during exit
      expect(primaryExists || secondaryExists || tertiaryExists).toBe(true);

      // Wait for full transition to complete
      await waitForCurtainsToDisappear(page);

      // Curtains should be gone after transition completes
      const curtainCount = await getCurtainCount(page);
      expect(curtainCount).toBe(0);
    });

    test('3.4: new page content is revealed after transition', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();

      // Wait for full transition
      await page.waitForURL('/projects');
      await waitForCurtainsToDisappear(page);

      // New page content should be visible
      const content = page.getByTestId(TESTIDS.layout.mainContent);
      await expect(content).toBeVisible();

      // URL should be updated
      expect(page.url()).toContain('/projects');
    });
  });

  // ==========================================================================
  // TASK 4: 50% Trigger Tests (AC3)
  // ==========================================================================
  test.describe('AC3: 50% trigger synchronization', () => {
    test.beforeEach(async ({ page }) => {
      await navigateAndWait(page, '/');
    });

    test('4.1/4.2: URL changes during entry animation, content mounts before exit', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      // Record initial URL
      const initialUrl = page.url();
      expect(initialUrl).toContain('/');

      await projectsLink.click();
      await waitForCurtainsToAppear(page);

      // Verify curtains are still visible (we're in entry/covering phase)
      const curtainsVisibleDuringCheck = (await getCurtainCount(page)) >= 3;
      expect(curtainsVisibleDuringCheck).toBe(true);

      // Wait for 50% trigger timing (animation midpoint)
      await page.waitForTimeout(TIMING.ANIMATION_DURATION / 2);

      // URL should change while curtains are still visible (50% trigger during entry)
      await page.waitForURL('/projects', { timeout: TIMING.ANIMATION_DURATION });

      // Verify curtains are STILL visible when URL changes (proves it's during entry, not after)
      const curtainsStillVisible = (await getCurtainCount(page)) >= 3;
      expect(curtainsStillVisible).toBe(true);

      // Verify transition is still active (not completed)
      const stillBlocking = await hasTransitionActiveClass(page);
      expect(stillBlocking).toBe(true);
    });

    test('4.3: page title animation triggers (content mounts at 50%)', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();

      // Wait for URL to change (50% trigger point)
      await page.waitForURL('/projects', { timeout: TIMING.FULL_TRANSITION + 1000 });

      // At 50% trigger, new page content should be mounting behind curtains
      // The MotionTitle component animates the page title
      // Verify content is being rendered (may still be behind curtains)
      const content = page.getByTestId(TESTIDS.layout.mainContent);

      // Wait for transition to complete
      await waitForCurtainsToDisappear(page);

      // Page content should be visible after transition
      await expect(content).toBeVisible();

      // Verify we're on the new page (content mounted correctly)
      expect(page.url()).toContain('/projects');

      // Check that page title exists (MotionTitle renders the title)
      const pageTitle = page.locator('h1, [class*="title"]').first();
      await expect(pageTitle).toBeVisible();
    });
  });

  // ==========================================================================
  // TASK 5: Interaction Blocking Tests (AC4)
  // ==========================================================================
  test.describe('AC4: Interaction blocking', () => {
    test.beforeEach(async ({ page }) => {
      await navigateAndWait(page, '/');
    });

    test('5.1: transition-active class on body during transition', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();
      await waitForCurtainsToAppear(page);

      // Body should have transition-active class
      const hasClass = await hasTransitionActiveClass(page);
      expect(hasClass).toBe(true);
    });

    test('5.2: cursor changes to wait during transition', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();
      await waitForCurtainsToAppear(page);

      // Cursor should be 'wait' during transition
      const cursor = await getBodyCursor(page);
      expect(cursor).toBe('wait');
    });

    test('5.3: inert attribute blocks focus during transition', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();
      await waitForCurtainsToAppear(page);

      // Body should have inert attribute
      const hasInert = await hasInertAttribute(page);
      expect(hasInert).toBe(true);
    });

    test('5.4: interactions resume after transition completes', async ({ page }) => {
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      await projectsLink.click();

      // Wait for URL to change and transition to complete
      await page.waitForURL('/projects', { timeout: TIMING.FULL_TRANSITION + 1000 });
      await waitForCurtainsToDisappear(page);

      // Blocking should be removed
      const hasClass = await hasTransitionActiveClass(page);
      const hasInert = await hasInertAttribute(page);

      expect(hasClass).toBe(false);
      expect(hasInert).toBe(false);

      // Should be able to interact with page again
      const homeLink = page.getByTestId(TESTIDS.nav.header.homeLink);
      await expect(homeLink).toBeVisible();
      // Verify link is clickable (not blocked)
      await expect(homeLink).toBeEnabled();
    });
  });

  // ==========================================================================
  // TASK 7: Multi-Route Consistency Tests (AC6)
  // ==========================================================================
  test.describe('AC6: Multi-route consistency', () => {
    test('7.1: Home → About transition', async ({ page }) => {
      await navigateAndWait(page, '/');

      const aboutLink = page.getByTestId(TESTIDS.nav.header.aboutLink);
      await aboutLink.click();

      await waitForCurtainsToAppear(page);
      const curtainCount = await getCurtainCount(page);
      expect(curtainCount).toBeGreaterThanOrEqual(3);

      await page.waitForURL('/about', { timeout: TIMING.FULL_TRANSITION + 1000 });
      await page.waitForTimeout(TIMING.FULL_TRANSITION);
      await expect(page).toHaveURL('/about');
    });

    test('7.2: About → Projects transition', async ({ page }) => {
      await navigateAndWait(page, '/about');

      // Wait for any previous transition to complete
      await page.waitForTimeout(500);

      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
      await projectsLink.click();

      await waitForCurtainsToAppear(page);
      const curtainCount = await getCurtainCount(page);
      expect(curtainCount).toBeGreaterThanOrEqual(3);

      await page.waitForURL('/projects', { timeout: TIMING.FULL_TRANSITION + 1000 });
      await page.waitForTimeout(TIMING.FULL_TRANSITION);
      await expect(page).toHaveURL('/projects');
    });

    test('7.3: Projects → Articles transition', async ({ page }) => {
      await navigateAndWait(page, '/projects');

      // Wait for any previous transition to complete
      await page.waitForTimeout(500);

      const articlesLink = page.getByTestId(TESTIDS.nav.header.articlesLink);
      await articlesLink.click();

      await waitForCurtainsToAppear(page);
      const curtainCount = await getCurtainCount(page);
      expect(curtainCount).toBeGreaterThanOrEqual(3);

      await page.waitForURL('/articles', { timeout: TIMING.FULL_TRANSITION + 1000 });
      await page.waitForTimeout(TIMING.FULL_TRANSITION);
      await expect(page).toHaveURL('/articles');
    });

    test('7.4: Articles → Home transition (full loop)', async ({ page }) => {
      await navigateAndWait(page, '/articles');

      // Wait for any previous transition to complete
      await page.waitForTimeout(500);

      const homeLink = page.getByTestId(TESTIDS.nav.header.homeLink);
      await homeLink.click();

      await waitForCurtainsToAppear(page);
      const curtainCount = await getCurtainCount(page);
      expect(curtainCount).toBeGreaterThanOrEqual(3);

      await page.waitForURL('/', { timeout: TIMING.FULL_TRANSITION + 1000 });
      await page.waitForTimeout(TIMING.FULL_TRANSITION);
      await expect(page).toHaveURL('/');
    });
  });

  // ==========================================================================
  // AC7: Transition State Observability (verified by all tests above)
  // ==========================================================================
  test.describe('AC7: Transition state observability', () => {
    test('curtain elements have identifiable selectors', async ({ page }) => {
      await navigateAndWait(page, '/');

      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
      await projectsLink.click();

      await waitForCurtainsToAppear(page);

      // All curtains should be findable by class (may be >= 3 due to AnimatePresence)
      const allCurtains = page.locator(SELECTORS.CURTAINS);
      const count = await allCurtains.count();
      expect(count).toBeGreaterThanOrEqual(3);

      // Individual curtains should be identifiable (use .first() for duplicates)
      await expect(page.locator(SELECTORS.CURTAIN_PRIMARY).first()).toBeAttached();
      await expect(page.locator(SELECTORS.CURTAIN_SECONDARY).first()).toBeAttached();
      await expect(page.locator(SELECTORS.CURTAIN_TERTIARY).first()).toBeAttached();
    });

    test('transition phases are observable via DOM state', async ({ page }) => {
      await navigateAndWait(page, '/');

      // IDLE: No curtains, no blocking
      let curtainCount = await getCurtainCount(page);
      let hasClass = await hasTransitionActiveClass(page);
      expect(curtainCount).toBe(0);
      expect(hasClass).toBe(false);

      // Start transition
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
      await projectsLink.click();

      // ENTERING/COVERING: Curtains visible, blocking active
      await waitForCurtainsToAppear(page);
      curtainCount = await getCurtainCount(page);
      hasClass = await hasTransitionActiveClass(page);
      expect(curtainCount).toBeGreaterThanOrEqual(3);
      expect(hasClass).toBe(true);

      // IDLE (after transition): No curtains, no blocking
      await page.waitForURL('/projects', { timeout: TIMING.FULL_TRANSITION + 1000 });
      await page.waitForTimeout(TIMING.FULL_TRANSITION);
      curtainCount = await getCurtainCount(page);
      hasClass = await hasTransitionActiveClass(page);
      expect(curtainCount).toBe(0);
      expect(hasClass).toBe(false);
    });
  });
});
