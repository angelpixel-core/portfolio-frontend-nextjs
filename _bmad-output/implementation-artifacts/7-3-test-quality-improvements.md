# Story 7.3: Test Quality Improvements

## Story

**As a** developer,
**I want** to fix flaky tests and improve test quality,
**So that** CI results are reliable and trustworthy.

## Status

- **Epic:** 7 - Technical Infrastructure & Maintenance
- **Sprint Status:** done
- **Priority:** MEDIUM
- **Estimated Effort:** Small (1-2 sessions)

## Acceptance Criteria

### AC1: Replace Arbitrary Timeouts with Proper Async Assertions

**Given** a test that uses arbitrary timeouts
**When** I refactor it
**Then** proper async assertions replace timeouts
**And** the test is deterministic

### AC2: Strengthen Weak Assertions

**Given** a test with weak assertions (always passes)
**When** I review it
**Then** assertions are strengthened to validate real behavior
**And** edge cases are covered

### AC3: Zero Flaky Tests

**Given** the test suite runs
**When** all tests complete
**Then** zero flaky tests are reported
**And** test execution time is under 30 seconds (unit tests)

## Tasks / Subtasks

### Task 1: Audit Test Suite for Quality Issues

- [x] 1.1 Run test suite and identify slow/flaky tests
- [x] 1.2 Categorize issues: timeouts, weak assertions, console.log abuse
- [x] 1.3 Document findings in story for reference

**Known Issues from Analysis:**

| File | Issue | Type | Priority |
|------|-------|------|----------|
| `useProject.test.tsx:51` | `setTimeout(..., 1000)` | Arbitrary timeout | MEDIUM |
| `useProjects.test.tsx:50` | `setTimeout(..., 2000)` | Arbitrary timeout | MEDIUM |
| `useJobExperiences.test.tsx:50` | `setTimeout(..., 2000)` | Arbitrary timeout | MEDIUM |
| `Calendar.test.tsx:168` | `expect(skeleton \|\| disabledLinks.length >= 0).toBeTruthy()` | Weak assertion (always true) | HIGH |
| `WhatsApp.test.tsx:168` | `expect(skeleton \|\| disabledLinks.length >= 0).toBeTruthy()` | Weak assertion (always true) | HIGH |
| `validate-data.test.ts:79` | `expect(true).toBe(true)` | No-op assertion | LOW |
| `validate-data.test.ts:64-78` | `console.log()` output in tests | Console abuse | LOW |
| `article-jsonld.test.ts:100-104` | Multiple `.toBeDefined()` | Weak assertions | MEDIUM |

### Task 2: Fix Arbitrary Timeout Tests (AC1)

- [x] 2.1 Refactor `useProject.test.tsx` to use `jest.useFakeTimers()` properly
- [x] 2.2 Refactor `useProjects.test.tsx` - replace setTimeout with immediate resolution
- [x] 2.3 Refactor `useJobExperiences.test.tsx` - replace setTimeout with immediate resolution
- [x] 2.4 Verify tests remain deterministic after changes

**Pattern to Apply:**
```typescript
// BEFORE (flaky with real timers):
mockedModel.fetch.mockImplementation(() =>
  new Promise((resolve) => setTimeout(() => resolve(data), 2000))
);

// AFTER (deterministic):
mockedModel.fetch.mockResolvedValue(data);
```

### Task 3: Fix Weak Assertions (AC2)

- [x] 3.1 Fix `Calendar.test.tsx:168` - assert specific loading behavior
- [x] 3.2 Fix `WhatsApp.test.tsx:168` - assert specific loading behavior
- [x] 3.3 Strengthen `article-jsonld.test.ts` assertions with value checks
- [x] 3.4 Remove or fix no-op assertion in `validate-data.test.ts`

**Pattern for Loading State Tests:**
```typescript
// BEFORE (always passes):
expect(skeleton || disabledLinks.length >= 0).toBeTruthy();

// AFTER (meaningful):
const skeleton = screen.getByTestId('calendar-skeleton');
expect(skeleton).toBeInTheDocument();
// OR if no skeleton:
expect(screen.queryByRole('link')).not.toBeInTheDocument();
```

### Task 4: Clean Up Console Output in Tests (AC2)

- [x] 4.1 Remove `console.log` from `validate-data.test.ts` (article)
- [x] 4.2 Remove `console.log` from `validate-data.test.ts` (project)
- [x] 4.3 Keep `console.error` suppression in error boundary tests (legitimate)
- [x] 4.4 Verify test output is clean

### Task 5: Verify Test Suite Health (AC3)

- [x] 5.1 Run full test suite 3 times to verify no flakiness
- [x] 5.2 Measure and document test execution time
- [x] 5.3 Ensure all tests pass consistently

**Results:**
- 508 tests passing consistently across 3 runs
- Execution time: ~24 seconds (target: under 30s) ✅
- Zero flaky tests detected ✅

## Dev Notes

### Technical Context

- **Test Framework:** Jest 29 + React Testing Library 14
- **Current Test Count:** 508 unit tests (2 no-op tests removed)
- **E2E Tests:** 33 Playwright tests (separate suite)
- **Previous Story:** 7.2 established testid patterns for E2E resilience

### Implementation Constraints

1. **Non-breaking:** Tests must continue to pass after refactoring
2. **Deterministic:** No test should depend on timing or external state
3. **Fast:** Keep unit test suite under 30 seconds
4. **Clean output:** No console spam during test runs

### Testing Approach (TDD-lite)

1. Run test, identify timing issue
2. Refactor to remove timing dependency
3. Run test multiple times to verify stability
4. Move to next test

### Dependencies

- **Blocks:** None
- **Blocked by:** None (Story 7.2 complete)
- **Related:** Story 7.2 (shared test infrastructure)

## Project Structure Notes

### Files to Modify

```
src/
├── domains/
│   ├── project/queries/__tests__/
│   │   ├── useProject.test.tsx        # FIX: setTimeout, toBeDefined
│   │   └── useProjects.test.tsx       # FIX: setTimeout
│   ├── job-experience/queries/__tests__/
│   │   └── useJobExperiences.test.tsx # FIX: setTimeout
│   └── article/model/__tests__/
│       └── validate-data.test.ts      # FIX: console.log, no-op assertion
├── lib/seo/__tests__/
│   └── article-jsonld.test.ts         # FIX: toBeDefined assertions
└── ui/molecules/
    ├── Calendar/__tests__/
    │   └── Calendar.test.tsx          # FIX: weak loading assertion
    └── WhatsApp/__tests__/
        └── WhatsApp.test.tsx          # FIX: weak loading assertion
```

## References

### Architecture Alignment

- **Testing Architecture (Architecture.md):** "Jest 29 + React Testing Library 14 para unit/integration tests"
- **Coverage Target:** "MVP critical paths, Growth 80%+"
- **Best Practice:** Deterministic tests, no arbitrary waits

### Existing Code References

- `src/domains/project/queries/__tests__/useProject.test.tsx:51` - setTimeout pattern
- `src/ui/molecules/Calendar/__tests__/Calendar.test.tsx:168` - Weak assertion
- `src/domains/article/model/__tests__/validate-data.test.ts:64-79` - Console.log abuse

### External Documentation

- [Jest Fake Timers](https://jestjs.io/docs/timer-mocks)
- [Testing Library Async Utilities](https://testing-library.com/docs/dom-testing-library/api-async/)

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-26 |
| Story Author | Workflow: create-story |
| Epic | 7 - Technical Infrastructure & Maintenance |
| FR Coverage | N/A (internal quality) |
| NFR Coverage | Test reliability, CI stability |
| Debt Origin | Code reviews Epic 5-6, retrospectives |

### Files Modified

| File | Change |
|------|--------|
| `src/domains/project/queries/__tests__/useProject.test.tsx` | Remove setTimeout, use mockResolvedValue |
| `src/domains/project/queries/__tests__/useProjects.test.tsx` | Remove setTimeout, use mockResolvedValue |
| `src/domains/job-experience/queries/__tests__/useJobExperiences.test.tsx` | Remove setTimeout, use mockResolvedValue |
| `src/ui/molecules/Calendar/__tests__/Calendar.test.tsx` | Fix weak loading state assertion |
| `src/ui/molecules/WhatsApp/__tests__/WhatsApp.test.tsx` | Fix weak loading state assertion |
| `src/lib/seo/__tests__/article-jsonld.test.ts` | Strengthen toBeDefined to value assertions |
| `src/domains/article/model/__tests__/validate-data.test.ts` | Remove console.log and no-op assertion |
| `src/domains/project/model/__tests__/validate-data.test.ts` | Remove console.log and no-op assertion |

### Test Quality Issue Inventory

| Category | Count | Priority |
|----------|-------|----------|
| Arbitrary timeouts | 3 | MEDIUM |
| Weak assertions | 4 | HIGH |
| Console abuse | 2 | LOW |
| No-op assertions | 1 | LOW |
| **Total** | **10** | - |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-26 | Story created via create-story workflow |
| 2026-01-26 | Implementation complete - all tasks done, moved to review |
| 2026-01-26 | Code review: 0 critical, 4 medium (cosmetic), 2 low. ACs met. DONE |
