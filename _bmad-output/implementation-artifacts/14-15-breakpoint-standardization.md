# Story 14.15: Breakpoint Standardization

Status: ready-for-dev

<!-- Note: This story is part of Code Quality & Refactorization work merged into Epic 14. -->
<!-- Source: _bmad-output/planning-artifacts/epic-17-code-quality-refactor.md Story 17.5 -->

## Story

As a **developer maintaining this codebase**,
I want **a single, consistent breakpoint system without magic numbers**,
so that **responsive layouts are predictable, maintainable, and aligned with the semantic breakpoint system**.

## Background

Engineering analysis identified **63 occurrences** of magic number breakpoints in CSS:
- `@media (min-width: 400px)` - 10 occurrences in Experience component
- `@media (min-width: 480px)` - 53 occurrences across 8 components

These magic numbers exist outside the official breakpoint system defined in `tailwind.config.js` and `docs/layout-system.md`, causing:
- Inconsistent responsive behavior
- Difficulty understanding layout intent
- Maintenance burden when breakpoint strategy changes

**Current state:** 3 breakpoint systems coexisting (legacy max-width, semantic min-width, magic numbers)
**Target state:** 1 unified semantic breakpoint system

## Acceptance Criteria

### AC1: ADR decision documented
**Given** the need to handle 400px and 480px breakpoints
**When** I analyze the use cases
**Then** an Architecture Decision Record documents the chosen approach:
- Option A: Add 400px/480px to tailwind.config.js as semantic breakpoints
- Option B: Migrate components to use existing semantic breakpoints
**And** rationale for decision is clear

### AC2: Magic number breakpoints eliminated
**Given** 63 occurrences of magic number media queries
**When** I apply the chosen approach
**Then** `grep -r "@media (min-width: 400px)" src/` returns 0 results
**And** `grep -r "@media (min-width: 480px)" src/` returns 0 results

### AC3: Components migrated or config updated
**Given** the ADR decision
**When** I implement the changes
**Then** all affected components use breakpoints from tailwind.config.js
**And** responsive behavior is preserved (no visual regression)

### AC4: Legacy breakpoints marked deprecated
**Given** legacy max-width breakpoints still exist in config
**When** I update tailwind.config.js
**Then** legacy breakpoints have `@deprecated` JSDoc comments
**And** CLAUDE.md documents the deprecation

### AC5: Documentation updated
**Given** breakpoint changes complete
**When** I update documentation
**Then** docs/layout-system.md reflects final breakpoint system
**And** any new semantic breakpoints are documented with use cases

### AC6: No visual regressions
**Given** all breakpoint changes applied
**When** running validation
**Then** `npm run build` passes
**And** Playwright viewport tests pass at: 320px, 400px, 480px, 640px, 800px, 1024px, 1440px
**And** visual inspection confirms no layout breaks

## Tasks / Subtasks

- [ ] **Task 1: Analyze current usage** (AC: 1)
  - [ ] 1.1 Identify all files using 400px breakpoint (10 in Experience)
  - [ ] 1.2 Identify all files using 480px breakpoint (53 across 8 components)
  - [ ] 1.3 Understand the design intent of each magic number
  - [ ] 1.4 Map current breakpoints to semantic equivalents

- [ ] **Task 2: Create ADR** (AC: 1)
  - [ ] 2.1 Document Option A: Add `phablet:` (400px) and `large-mobile:` (480px) to config
  - [ ] 2.2 Document Option B: Migrate to nearest semantic breakpoints (tablet: 640px)
  - [ ] 2.3 Analyze risk/benefit of each approach
  - [ ] 2.4 Make and document decision with rationale

- [ ] **Task 3: Implement chosen approach** (AC: 2, 3)
  - [ ] 3.1 If Option A: Update tailwind.config.js with new breakpoints
  - [ ] 3.2 If Option B: Migrate Experience/styles.css to semantic breakpoints
  - [ ] 3.3 Migrate TechnologiesSlider/styles.css
  - [ ] 3.4 Migrate Education/styles.css
  - [ ] 3.5 Migrate CustomersSlider/styles.css
  - [ ] 3.6 Migrate HireMe/styles.css
  - [ ] 3.7 Migrate ArrowButton/styles.css
  - [ ] 3.8 Migrate any remaining components

- [ ] **Task 4: Mark legacy breakpoints deprecated** (AC: 4)
  - [ ] 4.1 Add @deprecated JSDoc to legacy breakpoints in tailwind.config.js
  - [ ] 4.2 Update CLAUDE.md with deprecation warning
  - [ ] 4.3 Create migration checklist for legacy → semantic

- [ ] **Task 5: Update documentation** (AC: 5)
  - [ ] 5.1 Update docs/layout-system.md with final breakpoint system
  - [ ] 5.2 Add new breakpoints to Quick Reference table if added
  - [ ] 5.3 Update migration examples if approach changes

- [ ] **Task 6: Visual validation** (AC: 6)
  - [ ] 6.1 Run `npm run build`
  - [ ] 6.2 Run Playwright tests at critical viewports
  - [ ] 6.3 Manual visual inspection at 320px, 400px, 480px, 640px
  - [ ] 6.4 Verify Experience component layout at all breakpoints
  - [ ] 6.5 Verify Education component layout at all breakpoints

## Dev Notes

### Affected Files (63 occurrences total)

| File | 400px | 480px | Total |
|------|-------|-------|-------|
| `src/ui/molecules/Experience/styles.css` | 10 | 10 | 20 |
| `src/ui/molecules/Education/styles.css` | 0 | 4 | 4 |
| `src/ui/molecules/TechnologiesSlider/styles.css` | 0 | 1 | 1 |
| `src/ui/molecules/CustomersSlider/styles.css` | 0 | 2 | 2 |
| `src/ui/molecules/HireMe/styles.css` | 0 | 2 | 2 |
| `src/ui/atoms/buttons/ArrowButton/styles.css` | 0 | 1 | 1 |
| (other) | 0 | ~33 | ~33 |

### Current Semantic Breakpoints (tailwind.config.js)

| Breakpoint | Value | CSS | Usage |
|------------|-------|-----|-------|
| (base) | 0px | default | Mobile phones |
| `tablet:` | 640px | min-width: 640px | Tablets |
| `nav:` | 800px | min-width: 800px | Nav transition |
| `stage:` | 960px | min-width: 960px | Hero layout |
| `desktop:` | 1025px | min-width: 1025px | Desktop |
| `wide:` | 1441px | min-width: 1441px | Wide screens |

### Gap Analysis

Magic numbers fall between `base` (0px) and `tablet:` (640px):
- 400px: ~62% of tablet breakpoint
- 480px: ~75% of tablet breakpoint

**Design Intent Hypothesis:**
- 400px: Very small phones → small phones transition
- 480px: Small phones → normal phones/small tablets

### Option Analysis

**Option A: Add to Config (Conservative)**
- Add `phablet: 400px` and `large-mobile: 480px`
- Pro: No visual risk, preserves current behavior
- Con: More breakpoints to manage, legitimizes fragmentation

**Option B: Migrate to Semantic (Consolidation)**
- Map 400px/480px → `tablet:` (640px) or stay at base
- Pro: Simpler system, forces mobile-first discipline
- Con: Visual adjustments needed, may require design iteration

### Previous Story Learnings (14-14)

From Query Hook Factory:
- Pattern: Atomic commits for each file/component
- Testing: Run `npm run build` after each migration
- Verify: Visual inspection at boundary viewports

### Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Layout breaks at 400-640px | 🔴 Alto | Before/after screenshots at 480px |
| Experience component breaks | 🔴 Alto | Dedicated testing pass for Experience |
| Slider components misaligned | 🟡 Medio | Test CustomersSlider, TechnologiesSlider separately |
| Regression in dark mode | 🟡 Medio | Test both themes at critical viewports |

### Verification Commands

```bash
# Count magic number breakpoints
grep -rn "@media (min-width: 400px)" src/ | wc -l  # Should be 0 after
grep -rn "@media (min-width: 480px)" src/ | wc -l  # Should be 0 after

# Full validation
npm run build && npm run test:e2e

# Visual testing at specific viewports
npx playwright test --project=chromium --grep="viewport"
```

### Definition of Done

- [ ] ADR created documenting decision rationale
- [ ] `grep -r "@media (min-width: 400px)" src/` returns 0 results
- [ ] `grep -r "@media (min-width: 480px)" src/` returns 0 results
- [ ] All affected components use breakpoints from config
- [ ] Legacy breakpoints marked @deprecated in config
- [ ] docs/layout-system.md updated
- [ ] CLAUDE.md updated if breakpoints added
- [ ] `npm run build` passes
- [ ] Playwright viewport tests pass
- [ ] No visual regressions at 320px, 400px, 480px, 640px viewports

### References

- [Source: epic-17-code-quality-refactor.md] - Story 17.5 Breakpoint Standardization
- [Source: docs/layout-system.md] - Current breakpoint documentation
- [Source: tailwind.config.js] - Breakpoint definitions
- [Source: CLAUDE.md] - Responsive Breakpoint System section

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

(To be filled by dev agent)

### Completion Notes List

(To be filled by dev agent)

### File List

(To be filled by dev agent)

## Change Log

| Date | Change |
|------|--------|
| 2026-02-06 | Story created from Epic 17.5 merged into Epic 14 |
