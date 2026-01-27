# Story 11.5: Playwright Viewport Tests for Header

Status: done

## Story

As a developer,
I want automated tests that validate header visibility at each breakpoint,
so that layout regressions are caught automatically.

## Acceptance Criteria

1. **AC1: E2E Tests Execute for All Breakpoints**
   - **Given** the E2E test suite
   - **When** I run Playwright tests
   - **Then** header visibility tests execute for all defined breakpoints (mobile, tablet, desktop, wide)

2. **AC2: Mobile Viewport Test**
   - **Given** a test for Mobile viewport (≤640px)
   - **When** the header renders
   - **Then** only Burger and Brand are visible; Nav, Social, Auth, Theme are hidden

3. **AC3: Wide Viewport Test**
   - **Given** a test for Wide viewport (≥1441px)
   - **When** the header renders
   - **Then** all zones are visible; Burger is hidden

4. **AC4: Viewport Transition Test**
   - **Given** a viewport transition test
   - **When** resizing from 1024px to 1025px
   - **Then** Nav becomes visible, Burger becomes hidden

## Tasks / Subtasks

- [x] Task 1: Audit Existing Test Coverage (AC: 1, 2, 3, 4)
  - [x] 1.1: Review `e2e/header-visibility.spec.ts` (created in Story 11.3)
  - [x] 1.2: Verify all ACs are covered by existing tests
  - [x] 1.3: Document coverage gaps if any

- [x] Task 2: Add Breakpoint Boundary Tests if Missing (AC: 1)
  - [x] 2.1: Verify tests exist at exact boundaries (640, 641, 1024, 1025, 1440, 1441)
  - [x] 2.2: Add missing boundary tests if needed (None needed - all exist)

- [x] Task 3: Verify All Tests Pass (AC: 1, 2, 3, 4)
  - [x] 3.1: Run full E2E suite
  - [x] 3.2: Confirm all header visibility tests pass
  - [x] 3.3: Document test count and coverage

## Dev Notes

### Critical: Story 11.3 Already Implemented These Tests

**IMPORTANT:** Story 11.3 created `e2e/header-visibility.spec.ts` which already covers most/all of Story 11.5's acceptance criteria. This story's primary task is **verification and gap-filling**, not creation from scratch.

### Existing Test Files

| File | Tests | Coverage |
|------|-------|----------|
| `e2e/header-visibility.spec.ts` | ~25 | Zone visibility at all breakpoints + transitions |
| `e2e/header-zones.spec.ts` | ~10 | Zone data-testid identification |
| `e2e/header-padding.spec.ts` | 11 | Padding at all breakpoints |

### Visibility Matrix Reference (from docs/layout-system.md)

| Breakpoint | Range | Nav | Social | Auth | Theme | Burger |
|------------|-------|-----|--------|------|-------|--------|
| Base (mobile) | 0-640px | ❌ | ❌ | ❌ | ❌ | ✅ |
| `tablet:` | 641-1024px | ❌ | ❌ | ❌ | ✅ | ✅ |
| `desktop:` | 1025-1440px | ✅ | ❌ | ❌ | ✅ | ❌ |
| `wide:` | ≥1441px | ✅ | ✅ | ✅ | ✅ | ❌ |

### Existing Tests in header-visibility.spec.ts

**Mobile (0-640px):** 6 tests
- nav, social, auth, UI zones hidden
- burger visible
- brand visible

**Tablet (641-1024px):** 5 tests
- nav, social, auth hidden
- UI controls visible
- burger visible

**Desktop (1025-1440px):** 5 tests
- nav visible
- social, auth hidden
- UI controls visible
- burger hidden

**Wide (≥1441px):** 5 tests
- nav, social, auth, UI controls visible
- burger hidden

**Transitions:** 3 tests
- tablet→desktop (1024→1025)
- desktop→wide (1440→1441)
- mobile→tablet (640→641)

### Potential Gaps to Verify

1. **Brand zone visibility** - Only tested on mobile, should verify at all breakpoints
2. **Boundary tests** - Transitions test the boundaries but individual viewport tests use middle values (375, 768, 1280, 1920)
3. **Visual regression** - Not implemented (optional per epics)

### Previous Story Intelligence (11.4)

**Learnings:**
1. TDD approach works well - write tests first, then verify implementation
2. `page.waitForLoadState("networkidle")` is essential before assertions
3. `TESTIDS` object in `e2e/testids.ts` centralizes selectors
4. Padding tests use `getComputedStyle()` for precise pixel validation

**Pattern for viewport tests:**
```typescript
await page.setViewportSize({ width: 1025, height: 800 });
await page.goto("/");
await page.waitForLoadState("networkidle");
await expect(element).toBeVisible(); // or .toBeHidden()
```

### Project Structure Notes

**E2E Test Files (Header-related):**
```
e2e/
├── header-visibility.spec.ts  # Story 11.3 - Zone visibility
├── header-zones.spec.ts       # Story 11.2 - Zone identification
├── header-padding.spec.ts     # Story 11.4 - Padding validation
└── testids.ts                 # Centralized data-testid values
```

### References

- [Source: docs/layout-system.md:89-94] - Header Zone Visibility Matrix
- [Source: e2e/header-visibility.spec.ts:1-235] - Existing visibility tests
- [Source: e2e/testids.ts:26-35] - Header zone testid definitions
- [Source: _bmad-output/implementation-artifacts/11-4-refactor-header-layout-implementation.md] - Previous story learnings
- [Source: _bmad-output/planning-artifacts/epics.md:1549-1578] - Story 11.5 requirements

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- All 45 header-related E2E tests passed (updated after code review)

### Completion Notes List

1. **AC Coverage Verification** - All 4 ACs fully covered by existing tests from Story 11.3
   - AC1: Tests execute for all breakpoints (mobile 375px, tablet 768px, desktop 1280px, wide 1920px)
   - AC2: Mobile viewport tests verify Burger+Brand visible, Nav/Social/Auth/Theme hidden
   - AC3: Wide viewport tests verify all zones visible, Burger hidden
   - AC4: Transition test 1024→1025 verifies Nav becomes visible, Burger hidden

2. **Boundary Tests Present** - All exact breakpoint boundaries tested in transition tests:
   - 640/641 (mobile→tablet)
   - 1024/1025 (tablet→desktop)
   - 1440/1441 (desktop→wide)

3. **Test Count Summary**:
   - header-visibility.spec.ts: 27 tests (zone visibility at all breakpoints + transitions)
   - header-zones.spec.ts: 7 tests (zone data-testid identification)
   - header-padding.spec.ts: 11 tests (padding validation at breakpoints)
   - **Total: 45 header-related tests passing**

4. **Code Review Fixes Applied**:
   - Fixed comment "AC2" → "AC4" for Breakpoint Transitions section
   - Added 3 brand zone visibility tests (tablet, desktop, wide) to close documented gap
   - Brand zone now tested at all 4 breakpoints (was only mobile)

### File List

**Modified:**
- `e2e/header-visibility.spec.ts` - Added 3 brand zone tests, fixed AC comment (27 tests total)

**Verified (no changes):**
- `e2e/header-zones.spec.ts` - 7 tests for zone identification
- `e2e/header-padding.spec.ts` - 11 tests for padding validation
- `e2e/testids.ts` - Centralized testid registry

**E2E Test Results:** 45 passed, 0 failed
