# Story 7.1: Automated Accessibility Testing

## Story

**As a** developer,
**I want** automated accessibility audits in CI,
**So that** accessibility regressions are caught before deploy.

## Status

- **Epic:** 7 - Technical Infrastructure & Maintenance
- **Sprint Status:** ready-for-dev
- **Priority:** HIGH
- **Estimated Effort:** Medium (2-3 sessions)

## Acceptance Criteria

### AC1: @axe-core/playwright Integration

**Given** the E2E test infrastructure (Playwright)
**When** E2E tests execute
**Then** @axe-core/playwright runs accessibility audits on each page
**And** violations are logged with severity levels (critical, serious, moderate, minor)

### AC2: Critical Violations Fail Build

**Given** CI runs on a PR
**When** the E2E test stage executes with accessibility audits
**Then** critical WCAG violations fail the build
**And** serious violations are reported as warnings (non-blocking for MVP)
**And** moderate/minor violations are logged for future review

### AC3: Violation Reporting

**Given** a component has accessibility violations
**When** the audit runs
**Then** specific elements are identified (CSS selector)
**And** WCAG criteria violated are listed (e.g., wcag2aa, wcag21aa)
**And** remediation guidance is provided (axe-core help URL)

### AC4: CI Artifact Generation

**Given** the audit completes
**When** results are available
**Then** a detailed JSON report is saved as CI artifact
**And** summary is included in the test output
**And** report is available for 7 days (retention policy)

## Tasks / Subtasks

### Task 1: Install @axe-core/playwright

- [ ] 1.1 Add `@axe-core/playwright` to devDependencies
- [ ] 1.2 Verify compatibility with existing Playwright version (1.58.0)
- [ ] 1.3 Update package-lock.json

**Command:**
```bash
npm install --save-dev @axe-core/playwright
```

### Task 2: Create Accessibility Test Utility

- [ ] 2.1 Create `e2e/utils/accessibility.ts` utility module
- [ ] 2.2 Implement `checkA11y()` helper function wrapping axe-core
- [ ] 2.3 Configure axe-core rules (WCAG 2.2 AA, excluding known acceptable violations)
- [ ] 2.4 Add violation severity filtering logic
- [ ] 2.5 Write unit test for utility if applicable

**File: `e2e/utils/accessibility.ts`**
```typescript
import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export interface A11yViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  helpUrl: string;
  nodes: Array<{ target: string[] }>;
}

export interface A11yResult {
  violations: A11yViolation[];
  passes: number;
  incomplete: number;
}

export async function checkA11y(
  page: Page,
  options?: { includedImpacts?: string[] }
): Promise<A11yResult> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();

  return {
    violations: results.violations as A11yViolation[],
    passes: results.passes.length,
    incomplete: results.incomplete.length,
  };
}

export function filterCriticalViolations(violations: A11yViolation[]): A11yViolation[] {
  return violations.filter((v) => v.impact === 'critical');
}

export function formatViolationReport(violations: A11yViolation[]): string {
  if (violations.length === 0) return 'No accessibility violations found.';

  return violations
    .map((v) => `[${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n  Help: ${v.helpUrl}`)
    .join('\n\n');
}
```

### Task 3: Integrate A11y Checks into E2E Tests

- [ ] 3.1 Add accessibility check to `e2e/home.spec.ts`
- [ ] 3.2 Add accessibility check to `e2e/navigation.spec.ts`
- [ ] 3.3 Add accessibility check to `e2e/contact.spec.ts`
- [ ] 3.4 Add accessibility check to `e2e/theme.spec.ts`
- [ ] 3.5 Verify all 4 critical journeys include a11y validation

**Pattern for existing tests:**
```typescript
import { checkA11y, filterCriticalViolations } from './utils/accessibility';

test('page is accessible', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const results = await checkA11y(page);
  const critical = filterCriticalViolations(results.violations);

  // Critical violations fail the test
  expect(critical).toHaveLength(0);

  // Log non-critical for awareness
  if (results.violations.length > 0) {
    console.log('A11y warnings:', results.violations.length);
  }
});
```

### Task 4: Create Dedicated A11y Spec File

- [ ] 4.1 Create `e2e/accessibility.spec.ts` for comprehensive audits
- [ ] 4.2 Test all main routes: `/`, `/about`, `/projects`, `/articles`
- [ ] 4.3 Include theme toggle state tests (light/dark mode both accessible)
- [ ] 4.4 Include mobile viewport accessibility check

**File: `e2e/accessibility.spec.ts`**
```typescript
import { test, expect } from '@playwright/test';
import { checkA11y, filterCriticalViolations, formatViolationReport } from './utils/accessibility';

const routes = ['/', '/about', '/projects', '/articles'];

test.describe('Accessibility Audits', () => {
  for (const route of routes) {
    test(`${route} has no critical accessibility violations`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const results = await checkA11y(page);
      const critical = filterCriticalViolations(results.violations);

      if (critical.length > 0) {
        console.error(formatViolationReport(critical));
      }

      expect(critical, `Critical violations on ${route}`).toHaveLength(0);
    });
  }

  test('dark mode is accessible', async ({ page }) => {
    await page.goto('/');

    // Toggle to dark mode
    const themeToggle = page.getByRole('button', { name: /theme|mode/i });
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }

    const results = await checkA11y(page);
    const critical = filterCriticalViolations(results.violations);

    expect(critical).toHaveLength(0);
  });

  test('mobile viewport is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await checkA11y(page);
    const critical = filterCriticalViolations(results.violations);

    expect(critical).toHaveLength(0);
  });
});
```

### Task 5: Update CI Configuration

- [ ] 5.1 Ensure e2e job includes a11y tests (already part of Playwright suite)
- [ ] 5.2 Add a11y report to artifact upload
- [ ] 5.3 Verify CI fails on critical violations

**No CI changes needed** - accessibility tests run as part of existing `npm run test:e2e` command. The Playwright report artifact already includes all test results.

### Task 6: Documentation

- [ ] 6.1 Add "Accessibility Testing" section to `docs/development-workflow.md`
- [ ] 6.2 Document how to run a11y tests locally
- [ ] 6.3 Document how to interpret violation reports
- [ ] 6.4 Add troubleshooting for common violations

**Documentation content:**
```markdown
## Accessibility Testing

### Running Locally

```bash
# Run all E2E tests including accessibility
npm run test:e2e

# Run only accessibility tests
npx playwright test accessibility
```

### Understanding Results

- **Critical:** Must fix before merge (build fails)
- **Serious:** Should fix soon (warning logged)
- **Moderate/Minor:** Logged for review, non-blocking

### Common Issues

| Violation | Fix |
|-----------|-----|
| color-contrast | Ensure 4.5:1 ratio for text |
| button-name | Add aria-label to icon buttons |
| image-alt | Add alt text to images |
```

## Dev Notes

### Technical Context

- **Existing Infrastructure:** Playwright 1.58.0 with 4 E2E test files (18 tests total)
- **Architecture Pattern:** E2E tests in `e2e/` directory, utility modules in `e2e/utils/`
- **CI Integration:** E2E tests run in `e2e` job after `quality` job passes
- **Debt Origin:** Epic 5-6 retrospectives identified @axe-core/playwright as deferred item

### Implementation Constraints

1. **Non-breaking:** Must not break existing E2E tests
2. **Performance:** A11y checks add ~1-2s per page; acceptable overhead
3. **Failure Mode:** Only critical violations block (MVP scope)
4. **WCAG Version:** Target WCAG 2.2 AA (matching NFR13-14)

### Known Considerations

- **Theme Toggle:** May need to locate by `data-testid` if current selector fragile (prep for Story 7.2)
- **Dynamic Content:** Use `waitForLoadState('networkidle')` before a11y scan
- **Third-party Components:** May need to exclude specific regions if violations are in external embeds

### Testing Approach (TDD)

1. **RED:** Write a11y test that fails (intentionally break a11y on test page)
2. **GREEN:** Verify test passes when page is accessible
3. **REFACTOR:** Extract reusable utilities

### Dependencies

- **Blocks:** None (independent infrastructure task)
- **Blocked by:** None
- **Related:** Story 7.2 (E2E Test Selector Resilience) may improve a11y test reliability

## Project Structure Notes

### Files to Create

```
e2e/
├── utils/
│   └── accessibility.ts    # NEW: A11y utility functions
└── accessibility.spec.ts   # NEW: Dedicated a11y test file
```

### Files to Modify

```
e2e/
├── home.spec.ts           # ADD: a11y check in critical path test
├── navigation.spec.ts     # ADD: a11y check in navigation tests
├── contact.spec.ts        # ADD: a11y check in contact tests
└── theme.spec.ts          # ADD: a11y check for theme states

docs/
└── development-workflow.md # ADD: Accessibility Testing section

package.json               # ADD: @axe-core/playwright devDependency
```

## References

### Architecture Alignment

- **Testing Architecture (Architecture.md):** "jest-axe + @axe-core/playwright para testing de accesibilidad"
- **NFR13:** WCAG 2.2 Level AA compliance
- **NFR14:** Lighthouse Accessibility ≥95

### External Documentation

- [@axe-core/playwright Documentation](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/4.8)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)

### Existing Code References

- `playwright.config.ts` - Playwright configuration
- `e2e/home.spec.ts:1-54` - Example E2E test pattern
- `.github/workflows/ci.yml:33-62` - E2E CI job configuration

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-26 |
| Story Author | Workflow: create-story |
| Epic | 7 - Technical Infrastructure & Maintenance |
| FR Coverage | FR32 |
| NFR Coverage | NFR13, NFR14 |
| Debt Origin | Epic 5-6 retrospectives |

---

**Ready for Implementation**

This story is fully specified and ready for a developer agent to pick up. All acceptance criteria have clear validation steps, tasks are atomic and ordered, and technical context is provided.
