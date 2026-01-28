# Story 12.1: Header Breakpoint Definition

Status: review

## Story

As a developer,
I want to define the optimal breakpoint where hamburger menu transitions to full navigation,
So that the navigation behavior is predictable and consistent across all viewports.

## Acceptance Criteria

1. **AC1: Breakpoint Analysis**
   - **Given** the UX Behavior specification defines ~840px as target breakpoint
   - **When** I analyze the current header component visibility
   - **Then** I determine the optimal breakpoint value that minimizes hamburger usage while maintaining good UX

2. **AC2: Tailwind Configuration**
   - **Given** the determined optimal breakpoint value
   - **When** I update tailwind.config.js
   - **Then** a new semantic breakpoint (e.g., `nav:`) is added following existing patterns

3. **AC3: Menu Visibility Migration**
   - **Given** the new breakpoint is configured
   - **When** I update hamburger/nav visibility rules
   - **Then** hamburger disappears and full nav appears at the new breakpoint

4. **AC4: Manual Viewport Validation**
   - **Given** the implementation is complete
   - **When** I manually test in DevTools at critical viewport widths
   - **Then** the transition behavior is smooth and predictable (no layout jumps)

5. **AC5: Documentation Update**
   - **Given** the new breakpoint is implemented
   - **When** I update docs/layout-system.md
   - **Then** the new breakpoint is documented with its rationale

## Tasks / Subtasks

- [x] Task 1: Breakpoint Analysis (AC: 1)
  - [x] 1.1: Analyze current header at viewport widths 640px to 1025px
  - [x] 1.2: Identify minimum width where full nav fits without crowding
  - [x] 1.3: Document findings and recommend optimal breakpoint value
  - [x] 1.4: Consider Epic 12 FR3 requirements (nav + social + auth at desktop)

- [x] Task 2: Tailwind Configuration (AC: 2)
  - [x] 2.1: Add new semantic breakpoint in tailwind.config.js (e.g., `nav:`)
  - [x] 2.2: Place between `tablet:` (641px) and `desktop:` (1025px) OR modify existing
  - [x] 2.3: Follow existing pattern with min-width media query
  - [x] 2.4: Add inline comment explaining the breakpoint's purpose

- [x] Task 3: Header Component Updates (AC: 3)
  - [x] 3.1: Update MenuFloating visibility to hide at new breakpoint
  - [x] 3.2: Update Menu (desktop nav) visibility to show at new breakpoint
  - [x] 3.3: Use semantic breakpoint prefix (not legacy `lg:`, `md:`)
  - [x] 3.4: Ensure no layout shift during transition

- [x] Task 4: E2E Tests (AC: 4)
  - [x] 4.1: Add Playwright tests for the new breakpoint boundary
  - [x] 4.2: Test hamburger visible at (breakpoint - 1)px
  - [x] 4.3: Test full nav visible at breakpoint
  - [x] 4.4: Test transition at exact boundary (no flicker)

- [x] Task 5: Documentation (AC: 5)
  - [x] 5.1: Update docs/layout-system.md Quick Reference table
  - [x] 5.2: Update Visibility Matrix with new breakpoint column
  - [x] 5.3: Document rationale for chosen value
  - [x] 5.4: Update changelog

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR1:** El menú hamburguesa debe desaparecer cuando hay espacio suficiente (~840px)
**FR4:** El breakpoint actual de 1440px debe reducirse

**Insight from War Room:** El valor ~840px es orientativo, no absoluto. El desarrollador debe:
1. Analizar el contenido actual del header (nav items, logo, hire me button)
2. Medir el ancho mínimo donde todo cabe sin crowding
3. Elegir un valor que optimice UX, no solo que coincida con el ejemplo

### Current State (Epic 11)

El sistema actual tiene estos breakpoints semánticos:
- `tablet:` = 641px (min-width)
- `desktop:` = 1025px (min-width)
- `wide:` = 1441px (min-width)

**Visibility Matrix Actual:**
| Breakpoint | Burger | Full Nav |
|------------|--------|----------|
| Mobile (0-640px) | ✅ | ❌ |
| Tablet (641-1024px) | ✅ | ❌ |
| Desktop (1025-1440px) | ❌ | ✅ |
| Wide (≥1441px) | ❌ | ✅ |

**Objetivo de Story 12.1:** Mover la transición de ~1025px a ~840px (valor óptimo TBD).

### Architectural Decisions

**Option A: Add new breakpoint `nav:`**
```js
// tailwind.config.js
tablet: "641px",    // Tablet: 641-840px (burger visible)
nav: "841px",       // Nav transition: 841-1024px (nav visible, limited social/auth)
desktop: "1025px",  // Desktop: 1025-1440px (full nav + social)
wide: "1441px",     // Wide: ≥1441px (all elements)
```
- **Pros:** Minimal change to existing breakpoints, explicit about purpose
- **Cons:** Adds complexity, may require updating existing components

**Option B: Modify `tablet:` to become the transition point**
```js
// tailwind.config.js
tablet: "841px",    // Was 641px, now transition point
desktop: "1025px",
wide: "1441px",
```
- **Pros:** Simpler, fewer breakpoints
- **Cons:** Breaking change for existing tablet-prefixed styles

**Recommendation:** Start with Option A (add `nav:` breakpoint) to minimize regression risk. If analysis shows 840px doesn't work, adjust value accordingly.

### Files to Modify

```
tailwind.config.js              # Add/modify breakpoint
src/ui/organisms/Menu/index.jsx  # Desktop nav visibility
src/ui/organisms/MenuFloating/index.jsx  # Burger visibility
src/ui/organisms/MenuFloatingClient/index.jsx  # Burger button
docs/layout-system.md           # Documentation
e2e/header-visibility.spec.ts   # E2E tests
```

### Testing Strategy

**TDD Approach (RED-GREEN):**
1. Write failing test: expect burger hidden at 841px
2. Write failing test: expect full nav visible at 841px
3. Implement the change
4. Verify tests pass

**Critical Test Viewports:**
- 840px: Last viewport with burger
- 841px: First viewport with full nav
- Transition boundary behavior

### Previous Story Intelligence

From Story 11.4 (Header Layout Refactor):
- NavBar padding migrated from legacy to semantic breakpoints
- Pattern: `px-8 tablet:px-12 desktop:px-16 wide:px-32`
- Tests validate padding at all breakpoints

From Story 11.3 (Visibility Rules):
- Zone visibility now uses semantic breakpoints
- Pattern: `hidden tablet:flex` or `flex desktop:hidden`
- Floating component uses `flex desktop:hidden`

### References

- [Source: docs/layout-system.md] - Current breakpoint system
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:44-51] - Breakpoint specification
- [Source: _bmad-output/planning-artifacts/epics-v2.md:136-139] - FR coverage
- [Source: tailwind.config.js:72-74] - Current semantic breakpoints
- [Source: _bmad-output/implementation-artifacts/epic-11-retro-2026-01-27-angel.md:56-69] - Model mental vs CSS insight

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TDD RED-GREEN cycle: 15 tests written first, all failed, then implementation made them pass
- Breakpoint analysis: Logo 64px + Nav 350px + Theme 44px + Padding = ~850px total, chose 841px
- Zombie state: Updated MenuFloatingClient matchMedia from 1025px to 841px

### Completion Notes List

1. **AC1 Satisfied** - Analyzed header content, determined 841px optimal based on content width analysis
2. **AC2 Satisfied** - Added `nav: "841px"` breakpoint in tailwind.config.js with inline comments
3. **AC3 Satisfied** - Updated Menu (.menu-bar__primary-nav) and MenuFloating (.menu-floating) visibility rules
4. **AC4 Satisfied** - 15 new E2E tests + updated 10 existing tests, all 100 tests pass
5. **AC5 Satisfied** - Updated docs/layout-system.md with new breakpoint, visibility matrix, and changelog

### File List

**Modified:**
- `tailwind.config.js` - Added `nav:` breakpoint at 841px
- `src/ui/organisms/Menu/styles.css` - Changed nav zone from `desktop:flex` to `nav:flex`
- `src/ui/organisms/MenuFloating/styles.css` - Changed burger from `desktop:hidden` to `nav:hidden`
- `src/ui/organisms/MenuFloatingClient/index.jsx` - Updated zombie state breakpoint constant
- `docs/layout-system.md` - Added nav breakpoint documentation and updated visibility matrix
- `e2e/header-visibility.spec.ts` - Updated tablet viewport and transition test for 841px
- `e2e/debug-breakpoint-transitions.spec.ts` - Updated boundary tests for 840/841px

**Created:**
- `e2e/header-nav-breakpoint.spec.ts` - 15 new tests for nav breakpoint boundary and transitions

