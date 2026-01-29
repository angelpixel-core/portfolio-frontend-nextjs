# Story 12.4: Header Hover & Selected States

Status: done

## Story

As a user navigating the header,
I want clear visual feedback when hovering over interactive elements and when viewing my current page,
So that I understand what is clickable and where I am in the navigation.

## Acceptance Criteria

1. **AC1: Logo Hover Color Transition**
   - **Given** the header logo is visible
   - **When** user hovers over the logo
   - **Then** a color transition animation plays (gradient cycle)
   - **And** respects prefers-reduced-motion (no animation if reduced motion)

2. **AC2: Hire Me Button Hover Inverse**
   - **Given** the Hire Me button is visible (mobile/tablet header or footer)
   - **When** user hovers over Hire Me
   - **Then** colors invert (light ↔ dark swap)
   - **Note:** HireMeHeaderButton already has hover:bg-primary, but FR6 specifies "color inverso (light ↔ dark)"

3. **AC3: Navigation Selected State Visible**
   - **Given** user is on a specific page (e.g., /about)
   - **When** header navigation is displayed
   - **Then** the current page link shows a full-width underline
   - **And** the underline is visible without hover

4. **AC4: Navigation Hover Animation from Center**
   - **Given** user hovers over a navigation link (not the current page)
   - **When** hover begins
   - **Then** underline animates from center outward to full width
   - **And** respects prefers-reduced-motion

5. **AC5: Visual Consistency Light/Dark**
   - **Given** user toggles between light and dark theme
   - **When** viewing hover/selected states
   - **Then** all states are clearly visible in both themes
   - **And** contrast ratios meet WCAG AA (4.5:1 for text)

## Tasks / Subtasks

- [x] Task 1: Audit Current Hover/Selected States (AC: 1-5)
  - [x] 1.1: Test Logo hover animation in browser (current: gradient cycle via Framer Motion)
  - [x] 1.2: Test HireMeHeaderButton hover (current: hover:bg-primary)
  - [x] 1.3: Test HireMeButton hover (current: color inversion implemented)
  - [x] 1.4: Test NavigationItemLink selected state (current: ActiveMark with w-full)
  - [x] 1.5: Test NavigationItemLink hover animation (current: group-hover:w-full from left)
  - [x] 1.6: Document gaps vs FR5, FR6, FR9 requirements

- [x] Task 2: Fix Hire Me Hover Inverse (AC: 2)
  - [x] 2.1: Review FR6 requirement: "color inverso (light ↔ dark)"
  - [x] 2.2: Update HireMeHeaderButton hover to match HireMeButton pattern
  - [x] 2.3: Verify hover works correctly in light and dark themes
  - [x] 2.4: Ensure WCAG touch target compliance maintained (44x44px)

- [x] Task 3: Fix Navigation Hover Animation Center-Out (AC: 4)
  - [x] 3.1: Review FR9: "Hover con animación desde el centro hacia los lados"
  - [x] 3.2: Current implementation animates from left (left-0, w-0 → w-full)
  - [x] 3.3: Changed to center-out: w-full + left-0 + origin-center + scale-x-0 → group-hover:scale-x-100
  - [x] 3.4: Test animation in both light and dark themes
  - [x] 3.5: Verify prefers-reduced-motion disables animation (global CSS handles)

- [x] Task 4: Verify Logo Hover (AC: 1)
  - [x] 4.1: Confirm Logo uses shouldReduceMotion hook correctly
  - [x] 4.2: Test reduced motion preference disables animation
  - [x] 4.3: Verify animation is smooth and not jarring

- [x] Task 5: Theme Consistency Audit (AC: 5)
  - [x] 5.1: Test all hover states in light theme
  - [x] 5.2: Test all hover states in dark theme
  - [x] 5.3: Verify contrast ratios for underlines
  - [x] 5.4: Document any theme-specific adjustments needed

- [x] Task 6: E2E Tests (AC: 1-5)
  - [x] 6.1: Add test for navigation selected state visibility
  - [x] 6.2: Add test for hover states (visual regression or accessibility)
  - [x] 6.3: Verify tests pass in both light and dark themes

- [x] Task 7: Documentation Update
  - [x] 7.1: Add changelog entry for Story 12.4
  - [x] 7.2: Update any component JSDoc if behavior changes

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR5:** Hover en logo: transición de color
**FR6:** Hover en Hire Me: color inverso (light ↔ dark)
**FR9:** Subrayados de navegación: selected visible + hover con animación desde centro

**From epic-12-ux-behavior.md Section 3.2:**
> Hover / interacción
> • Logo: transición de color
> • Hire Me: color inverso (light ↔ dark)
> • Subrayados:
>   • Item activo (selected) visible
>   • Hover con animación desde el centro hacia los lados

### Current State Analysis

**Logo (src/ui/molecules/Logo):**
- ✅ Has gradient color transition on hover via Framer Motion
- ✅ Respects prefers-reduced-motion via useReducedMotion hook
- ⚠️ May need verification that transition is visible enough

**HireMeHeaderButton (src/ui/atoms/buttons/HireMeHeaderButton):**
- ❌ Current hover: `hover:bg-primary dark:bg-primaryDark`
- ❌ Does NOT match FR6 "color inverso" pattern
- ✅ HireMeButton (footer) HAS correct inverse pattern

**NavigationItemLink + ActiveMark:**
- ✅ Selected state shows full-width underline
- ❌ Hover animation from LEFT (left-0), not CENTER per FR9
- ✅ Uses group-hover for coordination

### CSS Changes Required

**HireMeHeaderButton (Task 2):**
```css
/* BEFORE */
.hire-me-header:hover {
  @apply bg-primary dark:bg-primaryDark;
}

/* AFTER (match HireMeButton inverse pattern) */
.hire-me-header:hover {
  @apply bg-light dark:bg-dark
         text-dark dark:text-light;
}
```

**ActiveMark Center-Out Animation (Task 3):**
```css
/* BEFORE (left-to-right) */
.active_mark {
  @apply absolute inline-block
  group-hover:w-full
  h-[1px]
  left-0
  -bottom-1
  transition-[width] ease-in-out duration-300
  bg-dark dark:bg-light;
}

/* AFTER (center-out using scale) */
.active_mark {
  @apply absolute inline-block
  h-[1px]
  left-1/2
  -translate-x-1/2
  -bottom-1
  transition-transform ease-in-out duration-300
  bg-dark dark:bg-light
  scale-x-0 group-hover:scale-x-100
  origin-center;
}

.active_mark--full {
  @apply scale-x-100;
}

.active_mark--none {
  @apply scale-x-0;
}
```

### Previous Story Intelligence (Story 12.3)

**Patterns Established:**
- Use semantic breakpoints: `tablet:`, `nav:`, `desktop:`, `wide:`
- Update layout-system.md changelog when making changes
- Always update JSDoc in component when changing behavior
- Test at boundary viewports

**Code Review Learnings:**
- Complete Dev Agent Record with file list
- Test in both light and dark themes
- Verify prefers-reduced-motion compliance

### Component File Locations

```
src/ui/molecules/Logo/
├── index.jsx              # Framer Motion hover animation
└── styles.css             # Base styles

src/ui/atoms/buttons/HireMeHeaderButton/
├── index.jsx              # Button component
└── styles.css             # Hover styles to fix

src/ui/atoms/buttons/HireMeButton/
├── index.jsx              # Reference for correct hover pattern
└── styles.css             # Has correct inverse hover

src/ui/atoms/links/NavigationItemLink/
├── index.jsx              # Uses ActiveMark
└── styles.css             # relative positioning

src/ui/atoms/texts/ActiveMark/
├── index.jsx              # Selected/hover state indicator
└── styles.css             # Animation styles to fix
```

### E2E Test Patterns

```typescript
// Test navigation selected state
test("current page link shows active underline", async ({ page }) => {
  await page.goto("/about");
  await page.waitForLoadState("networkidle");

  const aboutLink = page.getByTestId("nav-header-about-link");
  const activeMark = aboutLink.locator(".active_mark--full");

  await expect(activeMark).toBeVisible();
});

// Test hover state (may need visual comparison)
test("navigation link shows underline on hover", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const aboutLink = page.getByTestId("nav-header-about-link");
  await aboutLink.hover();

  // Check that underline appears (scale-x changes)
  const activeMark = aboutLink.locator(".active_mark");
  await expect(activeMark).toHaveCSS("transform", /scaleX\(1\)/);
});
```

### Risk Assessment

**Riesgo:** 🔴 Alto (CSS + JS coordination)

**Potential Issues:**
1. Center-out animation may behave differently with different text lengths
2. Framer Motion and CSS transitions may conflict
3. Reduced motion may not be fully respected
4. Theme switching during hover may cause visual glitches

**Mitigations:**
1. Use transform scale-x which works regardless of element width
2. Keep Logo animation in Framer Motion, nav animation in CSS
3. Test with prefers-reduced-motion explicitly
4. Add transition-colors for smooth theme switching

### References

- [Source: docs/layout-system.md] - Component file locations
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:61-65] - Hover specifications
- [Source: _bmad-output/planning-artifacts/epics-v2.md:140-144] - FR5, FR6, FR9 mapping
- [Source: src/ui/atoms/texts/ActiveMark/styles.css] - Current animation implementation
- [Source: src/ui/atoms/buttons/HireMeButton/styles.css] - Correct inverse hover pattern
- [Source: src/ui/molecules/Logo/index.jsx] - Current Logo hover implementation

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Task 1 audit: Logo (src/ui/molecules/Logo/index.jsx:23-37) ✅, HireMeHeaderButton (styles.css:24-26) ❌ needs inverse, ActiveMark (styles.css:1-18) ❌ needs center-out
- Task 2: HireMeHeaderButton/styles.css:28-31 changed from `bg-primary` to `bg-light dark:bg-dark text-dark dark:text-light`
- Task 3: ActiveMark/styles.css:14-25 changed from `w-0 group-hover:w-full` to `w-full scale-x-0 group-hover:scale-x-100 origin-center`
- Task 4: Logo/index.jsx:14 uses `useReducedMotion()` hook, line 24-26 returns undefined if reduced motion
- Task 5: src/styles/reduced-motion.css:16-18 sets `transition-duration: 0.01ms !important` globally
- Task 6: e2e/header-hover-states.spec.ts created with 10 tests, all 90 header tests pass
- Task 7: docs/layout-system.md:234-238 changelog, e2e/testids.ts:34-41 navLinks added

### Completion Notes List

- HireMeHeaderButton hover now matches HireMeButton inverse pattern (FR6 compliant)
- ActiveMark uses CSS scale-x transform for center-out animation (FR9 compliant)
- Global reduced-motion.css (0.01ms transition-duration) handles ActiveMark animation
- Logo Framer Motion animation respects prefers-reduced-motion via useReducedMotion hook
- All 90 header E2E tests pass (10 new + 80 existing)

### File List

- `src/ui/atoms/buttons/HireMeHeaderButton/styles.css` - Changed hover to color inverse, updated JSDoc (12.2→12.4)
- `src/ui/atoms/texts/ActiveMark/styles.css` - Changed to center-out scale animation
- `e2e/header-hover-states.spec.ts` - New test file with 10 tests for Story 12.4, added wide viewport
- `e2e/testids.ts` - Added hireMeZone and navLinks to TESTIDS
- `docs/layout-system.md` - Added changelog entry for Story 12.4
