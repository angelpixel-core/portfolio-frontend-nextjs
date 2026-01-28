# Story 12.2: Header Mobile Layout

Status: ready-for-dev

## Story

As a mobile user,
I want the header to show hamburger (left), logo (center), and Hire Me button (right),
So that I can navigate and take action with a clear, predictable layout.

## Acceptance Criteria

1. **AC1: Mobile Header Layout**
   - **Given** viewport width < 841px (mobile/tablet with burger visible)
   - **When** header is displayed
   - **Then** layout shows: hamburger (left), logo (center), Hire Me button (right)

2. **AC2: Menu Opens Full Blade**
   - **Given** user clicks hamburger button
   - **When** menu opens
   - **Then** floating overlay occupies full viewport (blade completo) with proper z-index

3. **AC3: Close Button Visible Without Overflow**
   - **Given** menu is open
   - **When** user views the menu
   - **Then** close button (X) is visible without scrolling or overflow

4. **AC4: Menu Content Structure**
   - **Given** menu is open
   - **When** user views menu content
   - **Then** shows: Navigation (Home, About, Projects, Articles), Social links, Auth row (Google, Microsoft, LinkedIn), Theme toggle

5. **AC5: No Layout Shift**
   - **Given** any mobile viewport (375px - 840px)
   - **When** header renders
   - **Then** no Cumulative Layout Shift (CLS) occurs, elements stay positioned

## Tasks / Subtasks

- [ ] Task 1: Audit Current Mobile Header (AC: 1, 5)
  - [ ] 1.1: Screenshot header at 375px, 640px, 840px to document current state
  - [ ] 1.2: Identify if Hire Me button exists in mobile header
  - [ ] 1.3: Measure current element positions (left/center/right alignment)
  - [ ] 1.4: Document any existing layout issues

- [ ] Task 2: Implement Header Layout Structure (AC: 1)
  - [ ] 2.1: Ensure NavBar has three zones: left (burger), center (logo), right (Hire Me)
  - [ ] 2.2: Update NavBar/styles.css with proper flexbox or grid for mobile layout
  - [ ] 2.3: Add Hire Me button to header if missing (reuse existing HireMe component)
  - [ ] 2.4: Ensure Hire Me button visibility on mobile (currently may be desktop-only)

- [ ] Task 3: Validate Floating Menu Occupies Full Blade (AC: 2)
  - [ ] 3.1: Verify floating_container styles for full viewport coverage
  - [ ] 3.2: Ensure min-h-[70vh] in floating_panel is appropriate or adjust
  - [ ] 3.3: Test z-index layering (z-20 container, z-30 panel)

- [ ] Task 4: Ensure Close Button Visibility (AC: 3)
  - [ ] 4.1: Verify MenuButton renders as X when isOpen=true
  - [ ] 4.2: Ensure button is in visible area without scroll
  - [ ] 4.3: Check overflow:hidden on parent containers doesn't clip button
  - [ ] 4.4: Test on 375px viewport for smallest screen

- [ ] Task 5: Validate Menu Content (AC: 4)
  - [ ] 5.1: Verify navigation items render (Home, About, Projects, Articles)
  - [ ] 5.2: Verify social links render with HEADER_SOCIAL_PROVIDERS filter
  - [ ] 5.3: Add auth row if missing (Google, Microsoft, LinkedIn sign-in buttons)
  - [ ] 5.4: Verify ThemeButton renders in menu

- [ ] Task 6: E2E Tests (AC: 1-5)
  - [ ] 6.1: Test header layout at 375px, 640px, 840px
  - [ ] 6.2: Test menu open/close at mobile viewports
  - [ ] 6.3: Test close button visibility when menu open
  - [ ] 6.4: Test menu content presence

- [ ] Task 7: Manual Viewport Validation (AC: 5)
  - [ ] 7.1: Test at 375px (iPhone SE) - no CLS, correct layout
  - [ ] 7.2: Test at 640px (tablet boundary) - no CLS, correct layout
  - [ ] 7.3: Test at 840px (last mobile viewport) - no CLS, correct layout
  - [ ] 7.4: Document any visual issues found

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR2:** Header mobile: hamburguesa (izq), logo (centro), Hire Me (der)
**FR7:** Menú abierto ocupa un blade completo
**FR11:** Botón cerrar visible sin overflow cuando menú abierto

### Current State (Post Story 12.1)

**Breakpoint System:**
- `nav:` breakpoint at 841px (Story 12.1 complete)
- Mobile/Tablet (< 841px): burger visible, nav hidden
- Nav+ (≥ 841px): nav visible, burger hidden

**Current Header Layout (NavBar):**
```
layout_navbar-container: flex items-center justify-between
├── Menu (hidden on mobile, visible nav+)
├── MenuFloating (visible mobile/tablet, hidden nav+)
└── layout_logo-container (absolute center)
```

**Issue Identified:** The current header uses `justify-between` but doesn't have explicit left/right zones for mobile. The logo is absolute-centered, which may conflict with a three-zone layout.

### Architectural Decisions

**Option A: Keep Logo Absolute + Add Hire Me**
```jsx
// NavBar structure
<header className="layout_navbar-container">
  <MenuFloating /> {/* Left zone: burger */}
  <div className="layout_logo-container"> {/* Absolute center */}
    <Logo />
  </div>
  <HireMeButton /> {/* Right zone: visible on mobile */}
</header>
```
- **Pros:** Minimal change, logo stays perfectly centered
- **Cons:** justify-between won't work properly with absolute positioning

**Option B: Remove Absolute, Use CSS Grid**
```css
.layout_navbar-container {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
}
.layout_logo-container {
  justify-self: center;
}
```
- **Pros:** True three-zone layout, logo still centered
- **Cons:** More significant refactor

**Recommendation:** Start with Option A (add Hire Me button to right, keep current structure). If layout issues arise, consider Option B grid refactor.

### Files to Modify

```
src/ui/organisms/NavBar/index.jsx      # Add Hire Me button zone
src/ui/organisms/NavBar/styles.css     # Layout adjustments for mobile
src/ui/overlays/Floating/styles.css    # Validate full-blade coverage
src/ui/atoms/buttons/MenuButton/styles.css # Ensure no overflow clip
e2e/header-mobile-layout.spec.ts       # New E2E tests (create)
```

### Testing Strategy

**TDD Approach:**
1. Write failing test: expect Hire Me button visible at 375px
2. Write failing test: expect header has three zones at mobile
3. Implement layout changes
4. Verify tests pass

**Critical Test Viewports:**
- 375px: iPhone SE (smallest common mobile)
- 640px: Tablet boundary
- 840px: Last viewport with burger

### Previous Story Intelligence (Story 12.1)

**Patterns Established:**
- Use semantic breakpoints: `tablet:`, `nav:`, `desktop:`, `wide:`
- TDD RED-GREEN cycle works well for layout tests
- Zone visibility uses pattern: `hidden nav:flex` or `flex nav:hidden`
- Update layout-system.md when changing visibility rules

**Code Review Learnings:**
- Document coupling between JS constants and Tailwind config
- Align test file JSDoc with docs/layout-system.md
- Add viewport test block for each breakpoint range

### Component References

**MenuFloating Zone:**
- File: `src/ui/organisms/MenuFloating/styles.css`
- Pattern: `@apply flex nav:hidden flex-shrink-0;`
- Test: `data-testid="header-burger-zone"`

**Floating Overlay:**
- File: `src/ui/overlays/Floating/styles.css`
- Full viewport: `w-screen h-screen`
- Panel: `min-w-[50vw] min-h-[70vh]` (may need adjustment for blade)

**MenuButton:**
- File: `src/ui/atoms/buttons/MenuButton/index.jsx`
- Renders hamburger or X based on `isOpen` state
- aria-label toggles between "Open/Close navigation menu"

### E2E Test Patterns

From `e2e/header-visibility.spec.ts`:
```typescript
const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 720, height: 1024 },
  nav: { width: 900, height: 800 },
  // ...
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.mobile);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
});
```

### Zombie State Note (Story 12.1)

The "hire me" link currently intercepts clicks on menu button at 720px viewport. This is a UX layout issue that may be addressed in this story when implementing proper three-zone layout.

From `e2e/debug-breakpoint-transitions.spec.ts`:
```typescript
// FIXME: Test disabled - "hire me" link intercepts clicks on menu button at 720px viewport
test.fixme("menu state resets when transitioning...", ...)
```

### References

- [Source: docs/layout-system.md] - Breakpoint system and visibility matrix
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:54-77] - Mobile header specification
- [Source: _bmad-output/planning-artifacts/epics-v2.md:137-138] - FR2, FR7, FR11 coverage
- [Source: src/ui/organisms/NavBar/styles.css] - Current header styles
- [Source: src/ui/overlays/Floating/styles.css] - Floating overlay styles
- [Source: _bmad-output/implementation-artifacts/12-1-header-breakpoint-definition.md] - Previous story patterns

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

(To be filled by dev agent)

### Completion Notes List

(To be filled by dev agent)

### File List

(To be filled by dev agent)
