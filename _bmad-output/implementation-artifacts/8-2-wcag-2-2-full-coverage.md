# Story 8.2: WCAG 2.2 Full Coverage

## Story

**As a** developer,
**I want** complete WCAG 2.2 AA coverage in accessibility tests,
**So that** we catch all relevant accessibility violations.

## Status

- **Epic:** 8 - Test Infrastructure Hardening
- **Sprint Status:** ready-for-dev
- **Priority:** MEDIUM
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Add wcag22aa Tag to Configuration

**Given** the axe-core configuration in `e2e/utils/accessibility.ts`
**When** I review WCAG tags
**Then** `wcag22aa` is included alongside existing tags
**And** the configuration matches WCAG 2.2 Level AA requirements

### AC2: Distinguish Serious Violations

**Given** an accessibility violation is detected
**When** the test reports it
**Then** serious violations are distinguished from moderate/minor
**And** `filterSeriousViolations()` utility exists for consistent filtering

### AC3: Update Documentation

**Given** the WCAG_TAGS constant is updated
**When** a developer reads the JSDoc
**Then** it clearly indicates WCAG 2.2 AA compliance
**And** all available severity filters are documented

## Tasks / Subtasks

### Task 1: Update WCAG_TAGS Configuration (AC1)

- [ ] 1.1 Add `wcag22aa` to WCAG_TAGS array in `e2e/utils/accessibility.ts`
- [ ] 1.2 Update JSDoc to reflect WCAG 2.2 AA coverage
- [ ] 1.3 Verify checkA11y() function still works with updated tags
- [ ] 1.4 Run accessibility tests to ensure no breaking changes

**Before (`e2e/utils/accessibility.ts:18`):**
```typescript
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'] as const;
```

**After:**
```typescript
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] as const;
```

### Task 2: Add filterSeriousViolations Utility (AC2)

- [ ] 2.1 Create `filterSeriousViolations()` function in `e2e/utils/accessibility.ts`
- [ ] 2.2 Add export for the new function
- [ ] 2.3 Add JSDoc documentation for the function
- [ ] 2.4 Verify type safety with A11yViolation interface

**New function to add:**
```typescript
/**
 * Filter violations to only serious severity
 * Serious violations should be fixed soon but don't block build
 */
export function filterSeriousViolations(
  violations: A11yViolation[]
): A11yViolation[] {
  return violations.filter((v) => v.impact === 'serious');
}
```

### Task 3: Update accessibility.spec.ts to Use New Filter (AC2)

- [ ] 3.1 Import `filterSeriousViolations` in accessibility.spec.ts
- [ ] 3.2 Add serious violation logging to existing tests
- [ ] 3.3 Ensure serious violations are logged but don't fail tests (non-blocking)
- [ ] 3.4 Verify test output distinguishes critical from serious

**Pattern to add in tests:**
```typescript
const serious = filterSeriousViolations(results.violations);
if (serious.length > 0) {
  console.warn(
    `Serious a11y violations (should fix soon):\n`,
    formatViolationReport(serious)
  );
}
```

### Task 4: Update Documentation (AC3)

- [ ] 4.1 Update JSDoc in accessibility.ts to note WCAG 2.2 AA
- [ ] 4.2 Document all filter functions in module header
- [ ] 4.3 Update docs/development-workflow.md Section 13 if needed

### Task 5: Verify Test Suite Integrity

- [ ] 5.1 Run `npm run test:e2e` and verify all tests pass
- [ ] 5.2 Run accessibility tests: `npx playwright test accessibility`
- [ ] 5.3 Verify new WCAG 2.2 rules are being checked (may find new violations)
- [ ] 5.4 Document any new violations found (for future fixes)

**Expected Outcome:**
- WCAG_TAGS includes 4 tags (was 3)
- filterSeriousViolations() utility available
- Tests pass with enhanced coverage

## Dev Notes

### Technical Context

- **Existing Infrastructure:** Story 8.1 consolidated a11y tests to `e2e/accessibility.spec.ts`
- **Current WCAG_TAGS:** `['wcag2a', 'wcag2aa', 'wcag21aa']` (line 18)
- **Missing Tag:** `wcag22aa` for WCAG 2.2 Level AA
- **Debt Origin:** Story 7.1 code review identified M2, M3

### axe-core WCAG Tag Reference

From axe-core documentation, available WCAG tags:
- `wcag2a` - WCAG 2.0 Level A
- `wcag2aa` - WCAG 2.0 Level AA
- `wcag21a` - WCAG 2.1 Level A (new criteria)
- `wcag21aa` - WCAG 2.1 Level AA (new criteria)
- `wcag22a` - WCAG 2.2 Level A (new criteria)
- `wcag22aa` - WCAG 2.2 Level AA (new criteria)

Current config covers 2.0 and 2.1, but not 2.2 criteria.

### WCAG 2.2 New Success Criteria (AA Level)

| Criterion | ID | Description |
|-----------|-----|-------------|
| Focus Not Obscured (Minimum) | 2.4.11 | Focused component not entirely hidden |
| Dragging Movements | 2.5.7 | Single pointer alternative to dragging |
| Target Size (Minimum) | 2.5.8 | Touch targets at least 24x24 CSS pixels |
| Consistent Help | 3.2.6 | Help mechanisms in consistent location |
| Accessible Authentication | 3.3.7 | No cognitive function tests for auth |
| Redundant Entry | 3.3.8 | Previously entered info available |

### Implementation Constraints

1. **Non-breaking:** Adding tags should not break existing tests
2. **Informational:** New violations logged but don't fail build (yet)
3. **Progressive:** May reveal new violations to address in future

### Scope Boundaries

Per Epic 8 definition:
- This story adds WCAG 2.2 coverage to existing infrastructure
- Does NOT fix any violations found
- Does NOT add new test cases, only configures existing tests

### Previous Story Intelligence

From Story 8.1:
- `accessibility.spec.ts` is authoritative source for a11y tests
- `e2e/utils/accessibility.ts` contains all utility functions
- WCAG_TAGS is already exported (L3 resolved in 8.1)
- Spread operator removed (L1 resolved in 8.1)

### Dependencies

- **Blocks:** None
- **Blocked by:** Story 8.1 (done - consolidated a11y tests)
- **Related:** Story 8.3 (E2E Test Consistency)

## Project Structure Notes

### Files to Modify

```
e2e/
├── utils/
│   └── accessibility.ts     # MODIFY: Add wcag22aa, add filterSeriousViolations
└── accessibility.spec.ts    # MODIFY: Import and use filterSeriousViolations

docs/
└── development-workflow.md  # MODIFY: Update Section 13 if needed
```

### Files NOT Modified

- `e2e/home.spec.ts` - No a11y tests (consolidated in 8.1)
- `e2e/navigation.spec.ts` - No a11y tests (consolidated in 8.1)
- `e2e/contact.spec.ts` - No a11y tests (consolidated in 8.1)
- `e2e/theme.spec.ts` - No a11y tests (consolidated in 8.1)

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| M2 | Serious violations not distinguished | Story 7.1 | Add filterSeriousViolations() |
| M3 | WCAG_TAGS missing wcag22aa | Story 7.1 | Add wcag22aa to array |

### Architecture Alignment

- **NFR13:** WCAG 2.2 Level AA compliance
- **NFR14:** Lighthouse Accessibility ≥95

### External Documentation

- [axe-core API - WCAG Tags](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)

### Existing Code References

- `e2e/utils/accessibility.ts:18` - WCAG_TAGS constant
- `e2e/utils/accessibility.ts:60-64` - filterCriticalViolations pattern
- `e2e/accessibility.spec.ts:18-22` - Import pattern

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-26 |
| Story Author | Workflow: create-story |
| Epic | 8 - Test Infrastructure Hardening |
| Debt Origin | Story 7.1 code review (M2, M3) |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-26 | Story created via create-story workflow |
