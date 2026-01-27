# Story 11.5: Playwright Viewport Tests for Header

Status: ready-for-dev

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

- [ ] Task 1: Audit Existing Test Coverage (AC: 1, 2, 3, 4)
  - [ ] 1.1: Review `e2e/header-visibility.spec.ts` (created in Story 11.3)
  - [ ] 1.2: Verify all ACs are covered by existing tests
  - [ ] 1.3: Document coverage gaps if any

- [ ] Task 2: Add Breakpoint Boundary Tests if Missing (AC: 1)
  - [ ] 2.1: Verify tests exist at exact boundaries (640, 641, 1024, 1025, 1440, 1441)
  - [ ] 2.2: Add missing boundary tests if needed

- [ ] Task 3: Verify All Tests Pass (AC: 1, 2, 3, 4)
  - [ ] 3.1: Run full E2E suite
  - [ ] 3.2: Confirm all header visibility tests pass
  - [ ] 3.3: Document test count and coverage

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
