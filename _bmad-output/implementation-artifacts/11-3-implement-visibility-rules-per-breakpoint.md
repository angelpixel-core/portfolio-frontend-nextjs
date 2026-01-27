# Story 11.3: Implement Visibility Rules per Breakpoint

Status: done

## Story

As a visitor,
I want consistent navigation visibility at every screen size,
so that I never see "ghost" elements or missing navigation.

## Acceptance Criteria

1. **AC1: Visibility Matrix Compliance**
   - **Given** the visibility rules matrix:
     | Breakpoint | Nav | Social | Auth | Theme | Burger |
     |------------|-----|--------|------|-------|--------|
     | Mobile (0-640px) | ❌ | ❌ | ❌ | ❌ | ✅ |
     | Tablet (641-1024px) | ❌ | ❌ | ❌ | ✅ | ✅ |
     | Desktop (1025-1440px) | ✅ | ❌ | ❌ | ✅ | ❌ |
     | Wide (≥1441px) | ✅ | ✅ | ✅ | ✅ | ❌ |
   - **When** I resize the browser to any breakpoint
   - **Then** elements show/hide according to the matrix

2. **AC2: Smooth Breakpoint Transitions**
   - **Given** a breakpoint transition (e.g., 1024px → 1025px)
   - **When** the viewport crosses the boundary
   - **Then** visibility changes smoothly without intermediate states

3. **AC3: No Orphan Elements**
   - **Given** any viewport width
   - **When** I inspect the header
   - **Then** no "orphan" or "floating" elements appear

## Tasks / Subtasks

- [x] Task 1: Migrate Menu Zone Visibility (AC: 1, 2)
  - [x] 1.1: Replace `.menu-bar { hidden lg:flex }` with `hidden tablet:flex`
  - [x] 1.2: Add visibility classes to `.menu-bar__primary-nav` (desktop+)
  - [x] 1.3: Add visibility classes to `.menu-bar__social-links` (wide only)
  - [x] 1.4: Add visibility classes to `.menu-bar__social-login` (wide only)
  - [x] 1.5: Add visibility classes to `.menu-bar__ui-controls` (tablet+)

- [x] Task 2: Migrate MenuFloating Zone Visibility (AC: 1, 2)
  - [x] 2.1: Replace `.menu-floating { flex lg:hidden }` with `flex desktop:hidden`
  - [x] 2.2: Burger zone visible on mobile+tablet, hidden on desktop+

- [x] Task 3: Theme Button Independent Visibility (AC: 1, 3)
  - [x] 3.1: MenuButton migrated from `lg:flex hidden` to `flex desktop:hidden`
  - [x] 3.2: ThemeButton visible at tablet+ via Menu container

- [x] Task 4: Validate Visibility Rules (AC: 1, 2, 3)
  - [x] 4.1: 24 E2E tests covering all breakpoints (header-visibility.spec.ts)
  - [x] 4.2: All 64 E2E tests pass, 521 unit tests pass
  - [x] 4.3: Updated legacy test files to use semantic breakpoints

## Dev Notes

### Critical Migration: Legacy to Semantic Breakpoints

**Current Problem:**
Menu and MenuFloating use legacy inverted breakpoints (`lg:` = max-width: 1023px), causing the navbar to disappear at ~1250px and creating confusing intermediate states.

**Current Behavior (WRONG):**
```css
/* Menu/styles.css - line 2 */
.menu-bar {
  @apply hidden lg:flex; /* Shows at ≤1023px (mobile), hides at >1023px (desktop) */
}

/* MenuFloating/styles.css - line 2 */
.menu-floating {
  @apply flex lg:hidden; /* Shows at >1023px (desktop), hides at ≤1023px (mobile) */
}
```

This is **inverted** from the intended behavior!

**Target Behavior (CORRECT):**
```css
/* Menu should be hidden on mobile, visible on desktop+ */
.menu-bar {
  @apply hidden desktop:flex; /* Hidden at <1025px, flex at ≥1025px */
}

/* MenuFloating (burger) should be visible on mobile+tablet, hidden on desktop+ */
.menu-floating {
  @apply flex desktop:hidden; /* Flex at <1025px, hidden at ≥1025px */
}
```

### Zone-Specific Visibility Classes

Based on the visibility matrix from `docs/layout-system.md`:

| Zone | CSS Class | Target Visibility |
|------|-----------|-------------------|
| Primary Nav | `.menu-bar__primary-nav` | `hidden desktop:flex` |
| Social | `.menu-bar__social-links` | `hidden wide:flex` |
| Auth | `.menu-bar__social-login` | `hidden wide:flex` |
| UI Controls | `.menu-bar__ui-controls` | `hidden tablet:flex` |
| Burger | `.menu-floating` | `flex desktop:hidden` |

### Implementation Strategy

**Step 1: Update Menu Container**
```css
/* Menu/styles.css */
.menu-bar {
  @apply hidden desktop:flex justify-between items-center w-full;
}
```

**Step 2: Add Zone Visibility**
```css
.menu-bar__primary-nav {
  @apply hidden desktop:flex gap-1;
}

.menu-bar__social-links {
  @apply hidden wide:flex flex-wrap items-center justify-center;
}

.menu-bar__social-login {
  @apply hidden wide:flex; /* Add nav wrapper visibility */
}

.menu-bar__ui-controls {
  @apply hidden tablet:flex;
}
```

**Step 3: Update MenuFloating Container**
```css
/* MenuFloating/styles.css */
.menu-floating {
  @apply flex desktop:hidden;
}
```

### Testing Considerations

**Viewport Test Points:**
- 375px (iPhone SE) - Mobile: Only Burger visible
- 640px (boundary) - Still Mobile
- 641px (boundary) - Tablet: Burger + Theme visible
- 1024px (boundary) - Still Tablet
- 1025px (boundary) - Desktop: Nav + Theme visible, Burger hidden
- 1440px (boundary) - Still Desktop
- 1441px (boundary) - Wide: All zones visible

**Edge Cases:**
- Resize from 1024→1025 should smoothly transition (no flash)
- Resize from 1440→1441 should show Social/Auth zones
- No element should appear "orphaned" at any width

### Previous Story Intelligence

From Story 11.2:
- Zone testids implemented: `header-nav-zone`, `header-social-zone`, `header-auth-zone`, `header-ui-zone`, `header-burger-zone`
- Existing E2E tests in `e2e/header-zones.spec.ts` verify testid presence
- `HEADER_SOCIAL_PROVIDERS` extracted to `Menu/constants.js`

From Story 11.1:
- Semantic breakpoints defined: `tablet:` (641px), `desktop:` (1025px), `wide:` (1441px)
- Legacy breakpoints deprecated but preserved for compatibility
- `docs/layout-system.md` created with visibility matrix

### Project Structure Notes

**Files to Modify:**
- `src/ui/organisms/Menu/styles.css` - Primary visibility migration
- `src/ui/organisms/MenuFloating/styles.css` - Burger zone visibility

**Files to Reference:**
- `tailwind.config.js` - Semantic breakpoints (line 72-74)
- `docs/layout-system.md` - Visibility matrix (line 89-94)
- `e2e/header-zones.spec.ts` - Zone testids for testing

### References

- [Source: docs/layout-system.md:89-94] - Header Zone Visibility Matrix
- [Source: tailwind.config.js:72-74] - Semantic breakpoint definitions
- [Source: src/ui/organisms/Menu/styles.css:1-4] - Current legacy breakpoints
- [Source: src/ui/organisms/MenuFloating/styles.css:1-3] - Current legacy breakpoints
- [Source: _bmad-output/planning-artifacts/epics.md:1490-1514] - Story 11.3 requirements
- [Source: 11-2-map-header-zones-and-component-structure.md:136-141] - Zone-breakpoint reference

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- `e2e/debug-breakpoint-transitions.spec.ts` - Diagnostic tests for exact breakpoint boundaries (640, 641, 1023, 1024, 1025)

### Completion Notes List

1. **Floating component migration** - `src/ui/overlays/Floating/styles.css` was using legacy `hidden lg:flex` which caused the floating menu to be hidden at 1024px. Migrated to `flex desktop:hidden` for correct visibility on mobile+tablet.

2. **Zombie state prevention** - Added `useEffect` in `MenuFloatingClient` that uses `matchMedia` to detect when viewport crosses to desktop (≥1025px) and automatically closes the menu. This prevents "zombie" states where `isMenuOpen=true` but the menu is hidden by CSS.

3. **Unit test mock** - Added `window.matchMedia` mock to `MenuFloatingClient.test.tsx` since jsdom doesn't provide matchMedia.

4. **Documentation update** - Updated `docs/layout-system.md:96` to reflect Story 11.3 completion status.

### File List

**Modified:**
- `src/ui/organisms/Menu/styles.css` - Container and zone visibility rules
- `src/ui/organisms/MenuFloating/styles.css` - Burger zone visibility (`flex desktop:hidden`)
- `src/ui/overlays/Floating/styles.css` - Migrated from `hidden lg:flex` to `flex desktop:hidden`
- `src/ui/organisms/MenuFloatingClient/index.jsx` - Added breakpoint reset logic for zombie state prevention
- `src/ui/organisms/MenuFloating/__tests__/MenuFloatingClient.test.tsx` - Added matchMedia mock
- `docs/layout-system.md` - Updated status note

**Created:**
- `e2e/header-visibility.spec.ts` - 24 visibility tests per breakpoint
- `e2e/debug-breakpoint-transitions.spec.ts` - 8 diagnostic tests for breakpoint boundaries

**E2E Test Results:** 72 passed, 1 skipped
**Unit Test Results:** 521 passed
