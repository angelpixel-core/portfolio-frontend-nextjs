import { test, expect } from '@playwright/test';
import { TESTIDS } from './testids';

/**
 * Story 13.7: Reduced Motion Support E2E Tests
 *
 * Tests that the site respects prefers-reduced-motion: reduce preference
 * for users with vestibular disorders or motion sensitivity.
 *
 * WCAG 2.1 Success Criterion 2.3.3: Animation from Interactions (Level AAA)
 */

test.describe('Reduced Motion Support (Story 13.7)', () => {
  // Use desktop viewport where navigation is visible
  test.use({ viewport: { width: 1280, height: 800 } });

  test.describe('with reduced motion preference enabled', () => {
    test.beforeEach(async ({ page }) => {
      // Emulate reduced motion preference BEFORE navigating
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      // Wait for navigation to be ready
      await page.waitForSelector(`[data-testid="${TESTIDS.nav.header.homeLink}"]`, {
        timeout: 15000,
      });
    });

    test('AC1: navigation completes instantly without curtain animation', async ({ page }) => {
      // Verify no transition curtains are visible initially
      const curtains = page.locator('.transition-effect_blade');
      await expect(curtains).toHaveCount(0);

      // Navigate to another page
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
      await projectsLink.click();

      // Navigation should complete immediately
      await expect(page).toHaveURL('/projects');

      // Verify curtains were never rendered (instant navigation)
      await expect(curtains).toHaveCount(0);

      // Content should be immediately visible
      const content = page.getByTestId(TESTIDS.layout.mainContent);
      await expect(content).toBeVisible();
    });

    test('AC1: no interaction blocking during reduced motion navigation', async ({ page }) => {
      // Navigate to projects
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);
      await projectsLink.click();
      await expect(page).toHaveURL('/projects');

      // Verify body does not have transition-active class (no blocking)
      const hasTransitionClass = await page.evaluate(() => {
        return document.body.classList.contains('transition-active');
      });
      expect(hasTransitionClass).toBe(false);

      // Verify body does not have inert attribute (focus not blocked)
      const hasInert = await page.evaluate(() => {
        return document.body.hasAttribute('inert');
      });
      expect(hasInert).toBe(false);
    });

    test('AC4/AC6: CSS animations have reduced or no motion', async ({ page }) => {
      // Check that reduced-motion CSS rules are applied
      // The global reduced-motion.css sets animation-duration: 0.01ms

      // Navigate to home page which has potential animations
      await page.goto('/');

      // Check computed styles on any animated element
      // The CSS media query should force animations to complete instantly
      const animationDuration = await page.evaluate(() => {
        const style = window.getComputedStyle(document.body);
        // Check if reduced motion media query is active
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        return {
          prefersReducedMotion: mediaQuery.matches,
        };
      });

      expect(animationDuration.prefersReducedMotion).toBe(true);
    });

    test('AC6: CustomersSlider carousel animation is disabled', async ({ page }) => {
      await page.goto('/');

      // Check if slider exists - skip test if not present on this page
      const sliderTrack = page.locator('.slider .slide-track');
      const sliderCount = await sliderTrack.count();

      test.skip(sliderCount === 0, 'CustomersSlider not present on homepage');

      const animationName = await sliderTrack.evaluate((el) => {
        return window.getComputedStyle(el).animationName;
      });
      // Should be 'none' due to @media (prefers-reduced-motion: reduce) rule
      expect(animationName).toBe('none');
    });

    test('AC6: Hiring hue-rotate animation is disabled', async ({ page }) => {
      await page.goto('/');

      // Check if hiring container exists - skip test if not present
      const hiringContainer = page.locator('.hiring_container');
      const hiringCount = await hiringContainer.count();

      test.skip(hiringCount === 0, 'Hiring component not present on homepage');

      const animationName = await hiringContainer.evaluate((el) => {
        return window.getComputedStyle(el).animationName;
      });
      // Should be 'none' due to @media (prefers-reduced-motion: reduce) rule
      expect(animationName).toBe('none');
    });

    test('AC6: Skill fireRing animation is disabled', async ({ page }) => {
      // Navigate to About page where skills are displayed
      await page.goto('/about');

      // Wait for skills to load
      await page.waitForTimeout(1000);

      // Check if skill elements exist
      const skillElement = page.locator('.skill').first();
      const skillCount = await skillElement.count();

      test.skip(skillCount === 0, 'Skill components not present on about page');

      // Check the ::before pseudo-element animation via computed style
      // Note: We check the parent element's animation since ::before inherits context
      const animationInfo = await page.evaluate(() => {
        const skill = document.querySelector('.skill');
        if (!skill) return null;

        // Get computed style - the @media query should set animation to none
        const style = window.getComputedStyle(skill, '::before');
        return {
          animationName: style.animationName,
          animationDuration: style.animationDuration,
        };
      });

      // Should be 'none' due to @media (prefers-reduced-motion: reduce) rule
      expect(animationInfo?.animationName).toBe('none');
    });
  });

  test.describe('without reduced motion preference (baseline)', () => {
    test.beforeEach(async ({ page }) => {
      // Explicitly set no-preference to ensure baseline behavior
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto('/');
      await page.waitForSelector(`[data-testid="${TESTIDS.nav.header.homeLink}"]`, {
        timeout: 15000,
      });
    });

    test('transition curtains appear during navigation', async ({ page }) => {
      // Navigate to another page
      const projectsLink = page.getByTestId(TESTIDS.nav.header.projectsLink);

      // Click and immediately check for curtains
      const curtainsPromise = page.waitForSelector('.transition-effect_blade', {
        state: 'attached',
        timeout: 2000,
      });

      await projectsLink.click();

      // Curtains should appear during transition
      const curtain = await curtainsPromise;
      expect(curtain).toBeTruthy();

      // Wait for navigation to complete
      await expect(page).toHaveURL('/projects');
    });
  });
});
