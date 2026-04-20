/**
 * Accessibility testing utilities wrapping @axe-core/playwright
 *
 * SINGLE SOURCE OF TRUTH for accessibility test configuration.
 * All a11y audits should use these utilities.
 * Route/page audits live in e2e/accessibility.spec.ts (authoritative).
 *
 * Severity Filters Available:
 * - filterCriticalViolations() - Must fix, blocks build
 * - filterSeriousViolations() - Should fix soon, logged as warnings
 * - filterColorContrastViolations() - Color contrast rule, blocks build (Story 24.6)
 *
 * @see e2e/accessibility.spec.ts - Authoritative a11y test file
 */

import AxeBuilder from "@axe-core/playwright";

/**
 * WCAG 2.2 AA compliance tags for axe-core.
 * Includes all WCAG 2.0, 2.1, and 2.2 Level AA criteria.
 * Exported for test introspection and documentation.
 */
export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] as const;

/**
 * Represents a single accessibility violation found by axe-core
 */
export interface A11yViolation {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
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
 * Targets WCAG 2.2 AA compliance (wcag2a, wcag2aa, wcag21aa, wcag22aa tags)
 */
export async function checkA11y(page: any): Promise<A11yResult> {
  const results = await new AxeBuilder({ page })
    .withTags([...WCAG_TAGS])
    .exclude('iframe[title="reCAPTCHA"]')
    .exclude(".grecaptcha-badge")
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
  return violations.filter((v) => v.impact === "critical");
}

/**
 * Filter violations to only serious severity
 * Serious violations should be fixed soon but don't block build
 */
export function filterSeriousViolations(
  violations: A11yViolation[]
): A11yViolation[] {
  return violations.filter((v) => v.impact === "serious");
}

/**
 * Filter violations to only color-contrast rule
 * Story 24.6: Promotes color-contrast from warning to build failure
 */
export function filterColorContrastViolations(
  violations: A11yViolation[]
): A11yViolation[] {
  return violations.filter((v) => v.id === "color-contrast");
}

/**
 * Format violations into a human-readable report
 * Includes severity, rule ID, description, and help URL
 */
export function formatViolationReport(violations: A11yViolation[]): string {
  if (violations.length === 0) {
    return "No accessibility violations found.";
  }

  return violations
    .map(
      (v) =>
        `[${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n  Help: ${v.helpUrl}`
    )
    .join("\n\n");
}
