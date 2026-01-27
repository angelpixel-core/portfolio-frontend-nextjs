# Story 8.1: A11y Test Consolidation

## Story

**As a** developer,
**I want** a unified accessibility testing strategy,
**So that** a11y tests are maintainable and not duplicated across specs.

## Status

- **Epic:** 8 - Test Infrastructure Hardening
- **Sprint Status:** ready-for-dev
- **Priority:** MEDIUM
- **Estimated Effort:** Small (1-2 sessions)

## Acceptance Criteria

### AC1: Consolidate Duplicate A11y Tests

**Given** accessibility tests exist in multiple spec files
**When** I consolidate them
**Then** a single strategy is documented and implemented
**And** duplicate a11y checks are removed from individual specs
**And** the dedicated `accessibility.spec.ts` is the single source of a11y tests

### AC2: Export WCAG_TAGS and Clean Up Utility

**Given** the WCAG_TAGS constant in `e2e/utils/accessibility.ts`
**When** I review the module
**Then** WCAG_TAGS is exported for test introspection
**And** unnecessary spread operator is removed from `checkA11y()`

### AC3: Document Consolidation Strategy

**Given** accessibility testing infrastructure
**When** a developer wants to add a11y validation
**Then** documentation clearly indicates to NOT add a11y tests to feature specs
**And** all a11y testing should be added to `accessibility.spec.ts`

## Tasks / Subtasks

### Task 1: Audit Current A11y Test Duplication

- [ ] 1.1 List all files with a11y imports/tests
- [ ] 1.2 Categorize: authoritative (accessibility.spec.ts) vs duplicate
- [ ] 1.3 Document findings in story

**Current Duplication Analysis (from codebase read):**

| File | Test | Duplicates | Action |
|------|------|------------|--------|
| `e2e/home.spec.ts:61-80` | Homepage a11y test | `accessibility.spec.ts` `/` route | REMOVE |
| `e2e/navigation.spec.ts:85-98` | Projects page a11y | `accessibility.spec.ts` `/projects` | REMOVE |
| `e2e/navigation.spec.ts:101-115` | Articles page a11y | `accessibility.spec.ts` `/articles` | REMOVE |
| `e2e/contact.spec.ts:88-103` | Contact section a11y | `accessibility.spec.ts` `/` route | REMOVE |
| `e2e/theme.spec.ts:142-163` | Dark mode a11y | `accessibility.spec.ts` Theme State | REMOVE |
| `e2e/theme.spec.ts:165-186` | Light mode a11y | `accessibility.spec.ts` Theme State | REMOVE |
| `e2e/accessibility.spec.ts` | All routes, themes, viewports | AUTHORITATIVE | KEEP |

**Note:** After removal, feature specs will still import a11y utils for any feature-specific a11y needs, but standard page/route audits live exclusively in `accessibility.spec.ts`.

### Task 2: Clean Up Accessibility Utility (AC2)

- [ ] 2.1 Export `WCAG_TAGS` constant for test introspection
- [ ] 2.2 Remove unnecessary spread in `checkA11y()` function (line 40)
- [ ] 2.3 Add JSDoc noting this is the single source of a11y configuration
- [ ] 2.4 Verify no breaking changes in `accessibility.spec.ts`

**Before (`e2e/utils/accessibility.ts:40`):**
```typescript
const results = await new AxeBuilder({ page })
  .withTags([...WCAG_TAGS])  // Unnecessary spread
  .analyze();
```

**After:**
```typescript
const results = await new AxeBuilder({ page })
  .withTags(WCAG_TAGS)  // Direct use (readonly array is compatible)
  .analyze();
```

**Export Change:**
```typescript
// BEFORE:
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'] as const;

// AFTER:
export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'] as const;
```

### Task 3: Remove Duplicate A11y Tests from Feature Specs (AC1)

- [ ] 3.1 Remove a11y test from `e2e/home.spec.ts` (lines 61-80)
- [ ] 3.2 Remove a11y tests from `e2e/navigation.spec.ts` (lines 85-115)
- [ ] 3.3 Remove a11y test from `e2e/contact.spec.ts` (lines 88-103)
- [ ] 3.4 Remove a11y tests from `e2e/theme.spec.ts` (lines 142-186)
- [ ] 3.5 Clean up unused a11y imports from feature specs
- [ ] 3.6 Verify all E2E tests still pass

**Important:** Do NOT remove the imports entirely if other tests in the file use them. Check each file individually.

### Task 4: Update Documentation (AC3)

- [ ] 4.1 Add note to `e2e/accessibility.spec.ts` header: "AUTHORITATIVE source for all a11y testing"
- [ ] 4.2 Update `docs/development-workflow.md` Section 13 (Accessibility Testing) with consolidation note
- [ ] 4.3 Add comment to `e2e/utils/accessibility.ts` about single source of truth

**Documentation Update for `docs/development-workflow.md`:**
```markdown
### Testing Strategy

All accessibility audits are centralized in `e2e/accessibility.spec.ts`:
- Route audits for all main pages (/, /about, /projects, /articles)
- Theme state audits (light/dark mode)
- Viewport audits (mobile, tablet, desktop)

**Do NOT add accessibility tests to feature spec files.** If you need a11y validation for a new route or state, add it to `accessibility.spec.ts`.
```

### Task 5: Verify Test Suite Integrity

- [ ] 5.1 Run `npm run test:e2e` and verify all tests pass
- [ ] 5.2 Confirm test count reduction (expect 6 fewer tests)
- [ ] 5.3 Run accessibility tests specifically: `npx playwright test accessibility`
- [ ] 5.4 Verify no regressions in CI

**Expected Outcome:**
- Before: 33 E2E tests (with 6 duplicated a11y tests)
- After: 27 E2E tests (6 duplicates removed, all a11y in accessibility.spec.ts)

## Dev Notes

### Technical Context

- **Existing Infrastructure:** Playwright 1.58.0 with @axe-core/playwright 4.11.0
- **Current E2E Test Count:** 33 tests across 5 spec files
- **Authoritative A11y Spec:** `e2e/accessibility.spec.ts` (10 comprehensive tests)
- **Debt Origin:** Story 7.1 code review identified M4, L1, L3

### Implementation Constraints

1. **Non-breaking:** E2E tests must continue to pass
2. **Test reduction:** Removing duplicates reduces total test count (acceptable)
3. **Coverage maintained:** No coverage is lost since accessibility.spec.ts already covers everything
4. **Documentation updated:** Developers must know where to add future a11y tests

### Scope Boundaries

Per Epic 8 definition:
- This story does NOT add new a11y test coverage
- This story consolidates existing infrastructure only
- Focus: eliminate duplication, improve maintainability

### Testing Approach

1. **Verify baseline:** Run all E2E tests, note count and results
2. **Make changes:** Remove duplicates, update utility
3. **Verify no regression:** Run all E2E tests again
4. **Verify specific:** Run only accessibility tests

### Dependencies

- **Blocks:** None
- **Blocked by:** None
- **Related:** Story 8.2 (WCAG 2.2 coverage builds on this consolidation)

## Project Structure Notes

### Files to Modify

```
e2e/
├── utils/
│   └── accessibility.ts     # MODIFY: Export WCAG_TAGS, remove spread
├── accessibility.spec.ts    # MODIFY: Add header comment (authoritative)
├── home.spec.ts             # MODIFY: Remove a11y test + unused imports
├── navigation.spec.ts       # MODIFY: Remove 2 a11y tests + unused imports
├── contact.spec.ts          # MODIFY: Remove a11y test + unused imports
└── theme.spec.ts            # MODIFY: Remove 2 a11y tests + unused imports

docs/
└── development-workflow.md  # MODIFY: Update Section 13 with consolidation note
```

### Files NOT Modified

- `e2e/testids.ts` - Not related to a11y consolidation
- `playwright.config.ts` - Configuration unchanged
- Any unit test files - This story is E2E-specific

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| M4 | Duplicate a11y tests across specs | Story 7.1 | Consolidated to accessibility.spec.ts |
| L1 | Unnecessary spread in withTags | Story 7.1 | Removed spread, use WCAG_TAGS directly |
| L3 | WCAG_TAGS not exported | Story 7.1 | Exported for test introspection |

### Architecture Alignment

- **Testing Architecture:** "Single spec file per concern" pattern
- **NFR13:** WCAG 2.2 Level AA compliance (configuration unchanged)
- **NFR14:** Lighthouse Accessibility ≥95 (testing unchanged)

### Existing Code References

- `e2e/utils/accessibility.ts:12` - WCAG_TAGS constant
- `e2e/utils/accessibility.ts:40` - Spread operator to remove
- `e2e/accessibility.spec.ts:1-177` - Authoritative a11y tests
- `docs/development-workflow.md:1200+` - Section 13 Accessibility Testing

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-26 |
| Story Author | Workflow: create-story |
| Epic | 8 - Test Infrastructure Hardening |
| Debt Origin | Story 7.1 code review (M4, L1, L3) |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-26 | Story created via create-story workflow |
