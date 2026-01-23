# Story 1.5: Theme Toggle Accessibility

**Status:** done

---

## Story

As a **visitor**,
I want **to toggle between light and dark themes**,
so that **I can view comfortably in any lighting condition**.

---

## Acceptance Criteria

### AC1: Theme Toggle Functionality

**Given** I view the site in light mode
**When** I click the theme toggle button
**Then** the theme switches to dark mode immediately
**And** the visual change is instant (no flash/flicker)

### AC2: Persistence Across Sessions

**Given** I set a theme preference (e.g., dark mode)
**When** I close and reopen the browser/tab
**Then** my preference persists and is applied automatically

### AC3: Keyboard Accessibility

**Given** I navigate using keyboard
**When** I focus on the theme toggle button
**Then** I can activate it with Enter or Space keys
**And** the toggle has visible focus indicator

### AC4: ARIA Label

**Given** the theme toggle button
**When** it renders in any state
**Then** it has an appropriate ARIA label describing its current state/action
**And** screen readers can announce the button purpose

### AC5: System Preference Detection

**Given** my system preference is dark mode (prefers-color-scheme: dark)
**When** I visit the site for the first time (no stored preference)
**Then** dark mode is applied automatically

### AC6: TypeScript Migration

**Given** the themeMode slice and ThemeButton component
**When** I run `npm run typecheck`
**Then** all theme-related files pass type checking
**And** types are properly inferred from Redux state

---

## Tasks / Subtasks

- [x] **Task 1: Migrate themeMode Redux slice to TypeScript** (AC: #6)
  - [x] 1.1 Review `src/state/slices/themeMode/slice.js` structure
  - [x] 1.2 Create `slice.ts` with typed state and actions
  - [x] 1.3 Add unit tests for slice in TypeScript (RED phase)
  - [x] 1.4 Migrate existing tests to TypeScript format
  - [x] 1.5 Delete old JS slice file

- [x] **Task 2: Migrate themeMode hooks to TypeScript** (AC: #6)
  - [x] 2.1 Review `src/state/slices/themeMode/hooks.js`
  - [x] 2.2 Create `hooks.ts` with typed return values
  - [x] 2.3 Update barrel export in `index.js` → `index.ts`
  - [x] 2.4 Delete old JS files

- [x] **Task 3: Add system preference detection** (AC: #5)
  - [x] 3.1 Write failing test for system preference detection (RED)
  - [x] 3.2 Update slice to detect `prefers-color-scheme: dark` on init
  - [x] 3.3 Ensure localStorage takes precedence over system preference
  - [x] 3.4 Verify test passes (GREEN)

- [x] **Task 4: Migrate ThemeButton component to TypeScript with a11y** (AC: #1, #3, #4)
  - [x] 4.1 Review `src/ui/atoms/buttons/ThemeButton/index.jsx`
  - [x] 4.2 Write failing tests for accessibility (RED phase):
    - Keyboard activation (Enter/Space)
    - ARIA label presence
    - Focus visibility
  - [x] 4.3 Convert to `index.tsx` with proper types
  - [x] 4.4 Add `aria-label` that reflects current state (e.g., "Switch to dark mode")
  - [x] 4.5 Ensure keyboard handlers work (button element handles this natively)
  - [x] 4.6 Add `role="switch"` and `aria-checked` for toggle semantics
  - [x] 4.7 Connect to Redux useThemeMode hook (replace local state)
  - [x] 4.8 Verify tests pass (GREEN)

- [x] **Task 5: Fix localStorage key inconsistency** (AC: #2)
  - [x] 5.1 Identify key mismatch: slice uses `themeMode`, button uses `theme`
  - [x] 5.2 Standardize to single key `themeMode`
  - [x] 5.3 Add migration logic for existing users with old key
  - [x] 5.4 Write test for persistence

- [x] **Task 6: Validation** (AC: #1-6)
  - [x] 6.1 Run `npm run typecheck` - verify no errors
  - [x] 6.2 Run `npm run test` - verify all tests pass (21 story-related tests pass)
  - [x] 6.3 Manual validation: toggle works visually
  - [x] 6.4 Manual validation: keyboard navigation works
  - [x] 6.5 Manual validation: preference persists after refresh

---

## Dev Notes

### Current State Analysis

**Redux themeMode slice:**
- `src/state/slices/themeMode/slice.js` - Redux Toolkit slice with actions
- `src/state/slices/themeMode/hooks.js` - Custom hook wrapping dispatch
- `src/state/slices/themeMode/index.js` - Barrel exports
- `src/state/slices/__tests__/themeMode.slice.test.js` - Existing tests (4 tests)

**ThemeProvider:**
- `src/state/providers/ThemeProvider/index.jsx` - Applies class to `<html>` and saves to localStorage

**ThemeButton component:**
- `src/ui/atoms/buttons/ThemeButton/index.jsx` - UI toggle button
- Uses local React state instead of Redux (NOT connected to themeMode slice!)
- Uses localStorage key `theme` (inconsistent with slice using `themeMode`)
- Missing: aria-label, keyboard semantics documentation

### Critical Issues Found

1. **State Duplication**: ThemeButton has its own local state AND there's a Redux slice. They don't sync.
2. **Key Mismatch**: ThemeButton uses `localStorage.setItem(THEME_KEY, ...)` where `THEME_KEY = "theme"`, but the slice uses `KEY_NAME = "themeMode"`.
3. **No system preference detection**: Neither implementation checks `prefers-color-scheme`.
4. **Missing a11y**: No aria-label on the button, missing toggle semantics.

### Architecture Constraints [Source: architecture.md]

| Decision | Value |
|----------|-------|
| TypeScript Strategy | Incremental Strict |
| State Management | Redux for UI state (theme), React Query for server state |
| Testing | Jest + RTL + jest-axe |
| File Convention | `.tsx` for React, `.ts` for everything else |

### Component Structure [Source: docs/architecture.md]

```
src/state/slices/themeMode/
├── slice.ts      # Redux slice (migrate from .js)
├── hooks.ts      # Custom hooks (migrate from .js)
├── index.ts      # Barrel exports
└── __tests__/
    └── themeMode.slice.test.ts

src/ui/atoms/buttons/ThemeButton/
├── index.tsx     # Main component (migrate from .jsx)
├── styles.css    # Existing styles
└── __tests__/
    └── ThemeButton.test.tsx  # New tests
```

### localStorage Strategy

Current state:
- Slice: `themeMode` key
- ThemeButton: `theme` key
- ThemeProvider: `themeMode` key

**Resolution**: Standardize on `themeMode` key, add one-time migration for users with old `theme` key.

### Accessibility Requirements [Source: PRD NFR13-20]

- WCAG 2.2 AA compliance
- Keyboard accessible (Enter/Space activation)
- ARIA label describing action
- Focus visible indicator
- Semantic toggle pattern (`role="switch"`, `aria-checked`)

---

## Previous Story Intelligence

**Story 1.4:** Migrated contact-point domain to TypeScript.
- Pattern: Delete .js BEFORE creating .ts (Jest cache issues)
- Clear Jest cache after deletion: `npm test -- --clearCache`
- Fixed pre-existing issues during validation (tsconfig aliases)
- Pattern: Mock framer-motion for tests

**Story 1.3:** Migrated technology domain to TypeScript.
- Pattern: schema.js → schema.ts with Zod
- Updated React Query v5: `cacheTime` → `gcTime`

**Story 1.2:** Migrated profile domain with error boundary.
- Created SectionErrorBoundary pattern

**Learnings Applied:**
- Use atomic commits for each phase (RED, GREEN, refactor)
- Delete old JS files BEFORE creating TS equivalents
- Run `npm test -- --clearCache` after file changes
- Mock external dependencies (framer-motion, etc.) in tests

---

## Library/Framework Requirements

| Library | Version | Purpose |
|---------|---------|---------|
| @reduxjs/toolkit | ^2.9.2 | State management (already installed) |
| react-redux | ^9.x | Redux bindings (already installed) |
| Jest | ^29.7.0 | Unit testing (already installed) |
| @testing-library/react | ^14.1.2 | Component testing (already installed) |

---

## Testing Requirements

### Unit Tests (Redux Slice)

```typescript
// src/state/slices/__tests__/themeMode.slice.test.ts
describe("themeMode slice", () => {
  it("defaults to light mode when no preference stored", () => {});
  it("defaults to system preference when no localStorage", () => {});
  it("uses localStorage over system preference", () => {});
  it("toggles between light and dark", () => {});
  it("persists preference to localStorage", () => {});
});
```

### Component Tests (ThemeButton)

```typescript
// src/ui/atoms/buttons/ThemeButton/__tests__/ThemeButton.test.tsx
describe("ThemeButton", () => {
  describe("accessibility", () => {
    it("has aria-label describing the toggle action", () => {
      render(<ThemeButton />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-label");
    });

    it("is keyboard accessible with Enter", () => {
      render(<ThemeButton />);
      const button = screen.getByRole("switch");
      button.focus();
      fireEvent.keyDown(button, { key: "Enter" });
      // Assert theme changed
    });

    it("is keyboard accessible with Space", () => {
      render(<ThemeButton />);
      const button = screen.getByRole("switch");
      button.focus();
      fireEvent.keyDown(button, { key: " " });
      // Assert theme changed
    });

    it("has visible focus indicator", () => {
      // CSS test or visual regression
    });
  });

  describe("functionality", () => {
    it("toggles theme on click", () => {});
    it("displays correct icon for current mode", () => {});
  });
});
```

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm run test          # Jest unit tests
```

---

## Manual Validation Checklist

> **OBLIGATORIO antes de merge a epic branch**

### Pre-requisitos

- [ ] Todos los tests automáticos pasan (`npm test`)
- [ ] Lint pasa (`npm run lint`)
- [ ] TypeScript compila (`npm run typecheck`)

### Validación Local

- [ ] `npm run dev` levanta la app sin errores
- [ ] Abrir http://localhost:9000 en browser
- [ ] Theme toggle button visible en header/menu
- [ ] Click toggle → theme changes immediately (no flash)
- [ ] Refresh page → theme preference persisted
- [ ] Clear localStorage → system preference applied
- [ ] Tab to toggle → focus visible
- [ ] Press Enter on focused toggle → theme changes
- [ ] Press Space on focused toggle → theme changes
- [ ] Screen reader announces button purpose

### Manual Validation Result

- **Date:** 2026-01-23
- **Validated by:** User
- **Result:** PASSED
- **Notes:** All validation items confirmed working correctly

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Fixed casing mismatch in `src/state/slices/index.js`: `./ThemeMode` → `./themeMode`
- Fixed ESLint unused-vars warning in interface definition using underscore prefix

### Completion Notes List

- Migrated themeMode Redux slice to TypeScript with full type safety
- Added system preference detection (`prefers-color-scheme: dark`) with localStorage priority
- Added legacy localStorage key migration (`theme` → `themeMode`) for existing users
- Migrated ThemeButton to TypeScript with full accessibility improvements:
  - Added `role="switch"` for proper toggle semantics
  - Added `aria-checked` to reflect current state
  - Added `aria-label` that updates based on mode ("Switch to dark/light mode")
  - Connected to Redux instead of local state (fixed state duplication bug)
- All 21 story-related tests pass
- TypeScript strict mode passes
- ESLint passes

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-22 | Story created from epics.md | Claude Opus 4.5 |
| 2026-01-22 | Task 1: Migrated themeMode slice to TypeScript | Claude Opus 4.5 |
| 2026-01-22 | Task 2: Migrated themeMode hooks to TypeScript | Claude Opus 4.5 |
| 2026-01-22 | Task 3: Added system preference detection | Claude Opus 4.5 |
| 2026-01-22 | Task 4: Migrated ThemeButton with a11y improvements | Claude Opus 4.5 |
| 2026-01-22 | Task 5: Fixed localStorage key inconsistency with migration | Claude Opus 4.5 |
| 2026-01-22 | Task 6: Automated validation complete | Claude Opus 4.5 |

### File List

**Created:**
- `src/state/slices/themeMode/slice.ts`
- `src/state/slices/themeMode/hooks.ts`
- `src/state/slices/themeMode/index.ts`
- `src/state/slices/__tests__/themeMode.slice.test.ts`
- `src/ui/atoms/buttons/ThemeButton/index.tsx`
- `src/ui/atoms/buttons/ThemeButton/__tests__/ThemeButton.test.tsx`

**Deleted:**
- `src/state/slices/themeMode/slice.js`
- `src/state/slices/themeMode/hooks.js`
- `src/state/slices/themeMode/index.js`
- `src/state/slices/__tests__/themeMode.slice.test.js`
- `src/ui/atoms/buttons/ThemeButton/index.jsx`

**Modified:**
- `src/state/slices/index.js` (fixed casing: ThemeMode → themeMode)
