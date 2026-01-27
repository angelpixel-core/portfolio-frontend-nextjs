# Story 8.3: E2E Test Consistency

## Story

**As a** developer,
**I want** consistent patterns across all E2E tests,
**So that** tests are predictable and easy to maintain.

## Status

- **Epic:** 8 - Test Infrastructure Hardening
- **Sprint Status:** done
- **Priority:** MEDIUM
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Standardize waitForLoadState Usage

**Given** E2E tests use waitForLoadState
**When** I review them
**Then** usage is standardized to `networkidle` where appropriate
**And** the pattern is documented

### AC2: Follow Established Patterns

**Given** any E2E test file
**When** I read it
**Then** it follows the established patterns from Story 7.2
**And** no arbitrary timeouts exist

### AC3: Document Wait Strategy

**Given** the E2E testing documentation
**When** a developer needs to add wait logic
**Then** clear guidance exists on which wait strategy to use
**And** examples are provided for common scenarios

## Tasks / Subtasks

### Task 1: Audit Current waitForLoadState Usage (AC1)

- [x] 1.1 Identify all waitForLoadState calls across E2E tests
- [x] 1.2 Categorize: `networkidle` vs `domcontentloaded` usage
- [x] 1.3 Determine if `domcontentloaded` is appropriate or should be `networkidle`
- [x] 1.4 Document rationale for each pattern

**Current State (from codebase analysis):**

| File | Line | Current Pattern | Issue |
|------|------|-----------------|-------|
| `theme.spec.ts` | 27, 43, 84, 103, 125 | `domcontentloaded` | Inconsistent with accessibility.spec |
| `home.spec.ts` | 45 | `networkidle` | ✅ Consistent |
| `accessibility.spec.ts` | 33, 75, 111, 143, 169, 199 | `networkidle` | ✅ Authoritative pattern |
| `contact.spec.ts` | 12 | `networkidle` | ✅ Consistent |

### Task 2: Standardize Wait Patterns (AC1, AC2)

- [x] 2.1 Update `theme.spec.ts` to use `networkidle` where appropriate
- [x] 2.2 Verify tests still pass after standardization
- [x] 2.3 Add comment explaining why `networkidle` is preferred

**Before (`theme.spec.ts`):**
```typescript
await page.waitForLoadState('domcontentloaded');
```

**After:**
```typescript
await page.waitForLoadState('networkidle');
```

### Task 3: Remove Any Arbitrary Timeouts (AC2)

- [x] 3.1 Search for `waitForTimeout` or `setTimeout` in E2E tests
- [x] 3.2 Replace with proper wait conditions if found
- [x] 3.3 Verify no hardcoded delays exist

**Result:** No arbitrary timeouts found - E2E tests already follow best practices.

### Task 4: Document Wait Strategy (AC3)

- [x] 4.1 Add "Wait Strategies" section to `docs/development-workflow.md` Section 14
- [x] 4.2 Document when to use `networkidle` vs `domcontentloaded`
- [x] 4.3 Add examples for common wait scenarios
- [x] 4.4 Reference Playwright best practices

**Documentation to add:**
```markdown
### Wait Strategies

| Strategy | Use When | Example |
|----------|----------|---------|
| `networkidle` | Page needs full data load | A11y audits, content assertions |
| `domcontentloaded` | Only DOM structure needed | Fast UI checks, no API data |
| `waitForSelector` | Specific element required | Navigation after click |

**Preferred Pattern:**
- Use `networkidle` by default for reliability
- Use `domcontentloaded` only for explicit performance optimization
- Never use arbitrary timeouts (`waitForTimeout`)
```

### Task 5: Verify Test Suite Integrity

- [x] 5.1 Run `npm run test:e2e` and verify all tests pass
- [x] 5.2 Verify no test timing regressions
- [x] 5.3 Confirm consistency across all spec files

**Expected Outcome:**
- All tests use consistent wait patterns
- No arbitrary timeouts in E2E tests
- Clear documentation for future developers

**Actual Outcome:**
- ✅ 27 E2E tests pass (1 skipped)
- ✅ No timing regressions after networkidle standardization
- ✅ All spec files now use consistent patterns

## Dev Notes

### Technical Context

- **Debt Origin:** Story 7.1 code review identified L2 (inconsistent waitForLoadState)
- **Previous Story Intelligence:** Stories 8.1 and 8.2 established accessibility.spec.ts patterns
- **Current Issue:** `theme.spec.ts` uses `domcontentloaded` while others use `networkidle`

### Playwright Wait Strategies Reference

From Playwright documentation:

| Method | Waits Until |
|--------|-------------|
| `domcontentloaded` | DOMContentLoaded event fired |
| `load` | Load event fired |
| `networkidle` | No network connections for 500ms |

**Why `networkidle` is preferred for most tests:**
- Ensures all API calls have completed
- Prevents flaky tests due to race conditions
- Required for accessibility audits (axe needs full content)

### Scope Boundaries

Per Epic 8 definition:
- This story standardizes existing patterns
- Does NOT add new test coverage
- Does NOT refactor test structure

### Previous Story Intelligence

From Story 8.1:
- `accessibility.spec.ts` is authoritative source for a11y tests
- Uses `networkidle` consistently (6 occurrences)
- Pattern works reliably in CI

From Story 8.2:
- M3 (filterModerate/MinorViolations) was deferred to this story as potential enhancement
- Decision: Out of scope for 8.3 (focus on wait consistency, not filter expansion)

### Dependencies

- **Blocks:** None
- **Blocked by:** Story 8.2 (done)
- **Related:** Epic 9 (documentation improvements)

## Project Structure Notes

### Files to Modify

```
e2e/
├── theme.spec.ts            # MODIFY: Standardize waitForLoadState
└── (verify others are consistent)

docs/
└── development-workflow.md  # MODIFY: Add Wait Strategies section
```

### Files NOT Modified

- `e2e/accessibility.spec.ts` - Already uses `networkidle` consistently
- `e2e/home.spec.ts` - Already uses `networkidle`
- `e2e/contact.spec.ts` - Already uses `networkidle`
- `e2e/navigation.spec.ts` - Uses waitForSelector (appropriate for navigation)

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| L2 | Inconsistent waitForLoadState usage | Story 7.1 | Standardize to networkidle |

### Architecture Alignment

- **Testing Architecture:** Playwright for E2E tests
- **Pattern:** Story 7.2 established data-testid patterns

### External Documentation

- [Playwright waitForLoadState](https://playwright.dev/docs/api/class-page#page-wait-for-load-state)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### Existing Code References

- `e2e/accessibility.spec.ts:33` - Authoritative `networkidle` pattern
- `e2e/theme.spec.ts:27` - Current `domcontentloaded` to update
- `docs/development-workflow.md:1065+` - Section 14 E2E Test Selectors

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-26 |
| Story Author | Workflow: create-story |
| Epic | 8 - Test Infrastructure Hardening |
| Debt Origin | Story 7.1 code review (L2) |
| Implementation Started | 2026-01-26 |
| Implementation Completed | 2026-01-26 |
| Dev Agent | Claude Opus 4.5 |

### Completion Notes

- ✅ All 5 tasks completed
- ✅ 27 E2E tests pass (1 skipped)
- ✅ All 3 acceptance criteria satisfied:
  - AC1: waitForLoadState standardized to `networkidle` in theme.spec.ts
  - AC2: No arbitrary timeouts found, all patterns follow Story 7.2
  - AC3: Wait Strategies section added to development-workflow.md

### TDD Commits

| Phase | Commit | Description |
|-------|--------|-------------|
| RED | 1cb5acc | Audit waitForLoadState patterns |
| GREEN | 7e730fe | Standardize to networkidle |
| GREEN | 6642cf3 | Verify no arbitrary timeouts |
| GREEN | add7e5c | Document wait strategies |

---

## File List

### Files Modified

| File | Changes |
|------|---------|
| `e2e/theme.spec.ts` | Changed 5 occurrences of domcontentloaded to networkidle, added wait strategy comment |
| `docs/development-workflow.md` | Added Wait Strategies subsection to Section 14 |

### Code Review Record

**Review Date:** 2026-01-26
**Reviewer:** Claude Opus 4.5 (Adversarial Code Review)

| Metric | Value |
|--------|-------|
| Critical Issues | 0 |
| Medium Issues | 0 |
| Low Issues | 1 (accepted) |
| Decision | **APPROVED** |

**Low Issues (Accepted):**

| ID | File | Issue | Decision |
|----|------|-------|----------|
| L1 | Story file | File List cosmetically minimal | Accepted - accurate for scope |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-26 | Story created via create-story workflow |
| 2026-01-26 | Code review passed, marked done |
