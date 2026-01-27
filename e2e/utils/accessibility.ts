/**
 * Accessibility testing utilities wrapping @axe-core/playwright
 *
 * SINGLE SOURCE OF TRUTH for accessibility test configuration.
 * All a11y audits should use these utilities.
 * Route/page audits live in e2e/accessibility.spec.ts (authoritative).
 *
 * @see e2e/accessibility.spec.ts - Authoritative a11y test file
 */

import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * WCAG 2.2 AA compliance tags for axe-core.
 * Exported for test introspection and documentation.
 */
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'] as const;

/**
 * Represents a single accessibility violation found by axe-core
 */
export interface A11yViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpUrl: string;
  nodes: Array<{ target: string[] }>;
}

/**
 * Result of an accessibility audit
 */
export interface A11yResult {
  violations: A11yViolation[];
  passes: number;
  incomplete: number;
}

/**
 * Run accessibility audit on the current page
 * Targets WCAG 2.2 AA compliance (wcag2a, wcag2aa, wcag21aa tags)
 */
export async function checkA11y(page: Page): Promise<A11yResult> {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze();

  return {
    violations: results.violations as A11yViolation[],
    passes: results.passes.length,
    incomplete: results.incomplete.length,
  };
}

/**
 * Filter violations to only critical severity
 * Critical violations should block the build
 */
export function filterCriticalViolations(
  violations: A11yViolation[]
): A11yViolation[] {
  return violations.filter((v) => v.impact === 'critical');
}

/**
 * Format violations into a human-readable report
 * Includes severity, rule ID, description, and help URL
 */
export function formatViolationReport(violations: A11yViolation[]): string {
  if (violations.length === 0) {
    return 'No accessibility violations found.';
  }

  return violations
    .map(
      (v) =>
        `[${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n  Help: ${v.helpUrl}`
    )
    .join('\n\n');
}
