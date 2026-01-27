/**
 * Dark Mode Contrast Debug Test
 *
 * Temporary test to identify specific elements failing color contrast.
 * Used for Story 10.1 investigation.
 *
 * This test will be removed after fixing the contrast issues.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Dark Mode Contrast Debug', () => {
  test('identify elements with contrast violations', async ({ page }) => {
    // Set dark mode
    await page.addInitScript(() => {
      localStorage.removeItem('themeMode');
      localStorage.removeItem('theme');
    });
    await page.emulateMedia({ colorScheme: 'dark' });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify dark mode is active
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');

    // Run axe-core with detailed output
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();

    // Find color-contrast violations specifically
    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    if (contrastViolations.length > 0) {
      console.log('\n=== COLOR CONTRAST VIOLATIONS DETAIL ===\n');

      for (const violation of contrastViolations) {
        console.log(`Rule: ${violation.id}`);
        console.log(`Impact: ${violation.impact}`);
        console.log(`Description: ${violation.description}`);
        console.log(`Help: ${violation.helpUrl}`);
        console.log(`\nAffected elements (${violation.nodes.length}):`);

        for (const node of violation.nodes) {
          console.log('\n---');
          console.log(`Selector: ${node.target.join(' ')}`);
          console.log(`HTML: ${node.html}`);
          console.log(`Failure Summary: ${node.failureSummary}`);

          // Extract specific color info from failureSummary if available
          if (node.any && node.any.length > 0) {
            for (const check of node.any) {
              if (check.data) {
                console.log(`\nContrast Data:`);
                console.log(`  Foreground: ${check.data.fgColor}`);
                console.log(`  Background: ${check.data.bgColor}`);
                console.log(`  Contrast Ratio: ${check.data.contrastRatio}`);
                console.log(`  Expected Ratio: ${check.data.expectedContrastRatio}`);
                console.log(`  Font Size: ${check.data.fontSize}`);
                console.log(`  Font Weight: ${check.data.fontWeight}`);
              }
            }
          }
        }
        console.log('\n');
      }
      console.log('=== END CONTRAST VIOLATIONS ===\n');
    }

    // This test should FAIL until we fix the contrast issues
    // This is the RED phase of TDD
    expect(
      contrastViolations.length,
      'Expected zero color-contrast violations in dark mode'
    ).toBe(0);
  });
});
