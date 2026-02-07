# Story 14.18: Menu Auto-Close on Navigation

Status: ready

## Story

As a **mobile user navigating the site**,
I want **the menu overlay to automatically close when I navigate to a new page**,
so that **I see the destination page immediately without having to manually close the menu**.

## Background

**Bug Report (2026-02-07):**
El menú overlay no se cierra automáticamente al navegar. Cuando el usuario:
1. Abre el menú móvil
2. Hace clic en un link de navegación (ej: "Articles")
3. La cortina de transición se cierra y reabre
4. El menú sigue visible en lugar de la página destino

El usuario debe cerrar manualmente el menú después de cada navegación.

**Análisis Técnico:**
- `closeMenu()` (Redux dispatch) y `startTransition()` se ejecutan casi simultáneamente
- Durante la fase "covering", la navegación ocurre (`router.push`)
- El dispatch de Redux puede no completarse antes de que el componente se re-renderice
- El estado `isMenuOpen` no se sincroniza correctamente con la transición de página

**Solución Propuesta:**
Agregar un efecto en `MobileMenuOverlay` que escuche cambios de `pathname` y cierre el menú automáticamente cuando cambie la URL.

## Acceptance Criteria

### AC1: Menu closes on navigation
**Given** the mobile menu overlay is open
**When** the user navigates to a different page (via menu link or any TransitionLink)
**Then** the menu closes automatically before or during the page transition
**And** the destination page is visible when the transition completes

### AC2: No manual close required
**Given** the user navigated from the menu
**When** the page transition completes
**Then** the user does NOT need to manually close the menu
**And** the menu state is correctly set to closed

### AC3: Synchronized with transition timing
**Given** the menu is open and user clicks a navigation link
**When** the curtain animation begins (phase="entering")
**Then** the menu should start closing immediately or at 50% progress
**And** the menu should be fully hidden before the curtain reveals the new page

### AC4: No flicker on same-page navigation
**Given** the menu is open
**When** the user clicks a link to the current page
**Then** the menu closes without triggering a page transition
**And** no visual flicker occurs

### AC5: Works with reduced motion
**Given** the user has `prefers-reduced-motion: reduce` enabled
**When** the user navigates from the menu
**Then** the menu closes instantly (no animation conflict)
**And** navigation works correctly

## Tasks / Subtasks

- [ ] **Task 1: Add pathname listener to MobileMenuOverlay** (AC: 1, 2)
  - [ ] 1.1 Import `usePathname` from `next/navigation`
  - [ ] 1.2 Add useEffect that watches pathname changes
  - [ ] 1.3 Call `closeMenu()` when pathname changes (not on initial mount)
  - [ ] 1.4 Use ref to track previous pathname and avoid closing on initial render

- [ ] **Task 2: Integrate with TransitionProvider 50% callback** (AC: 3)
  - [ ] 2.1 Use `registerFiftyPercentCallback` from useTransition
  - [ ] 2.2 Register closeMenu as a 50% callback when menu is open
  - [ ] 2.3 Unregister callback on unmount or when menu closes
  - [ ] 2.4 This ensures menu closes at the optimal transition point

- [ ] **Task 3: Handle edge cases** (AC: 4, 5)
  - [ ] 3.1 Verify same-page navigation doesn't cause issues
  - [ ] 3.2 Test with reduced motion enabled
  - [ ] 3.3 Test rapid navigation (multiple clicks)
  - [ ] 3.4 Test opening/closing menu multiple times before navigating

- [ ] **Task 4: Validation** (AC: 1-5)
  - [ ] 4.1 Manual smoke test on mobile viewport
  - [ ] 4.2 Run `npm run build` to ensure no errors
  - [ ] 4.3 Run existing E2E tests
  - [ ] 4.4 Add E2E test for menu auto-close behavior (optional)

## Dev Notes

### Current Code Location

```typescript
// MobileMenuOverlay - src/ui/organisms/MobileMenuOverlay/index.jsx
const MobileMenuOverlay = () => {
  const { isOpen: isMenuOpen, close: closeMenu } = useMenuPanel();

  // BUG: closeMenu() is called in onClick, but Redux dispatch may not complete
  // before startTransition() begins navigation

  return (
    <Floating id="mobile-menu" title="Navigation Menu">
      <NavigationItemLink
        href={href}
        name={name}
        onClick={closeMenu} // ← This races with startTransition
      />
    </Floating>
  );
};
```

### Proposed Fix Pattern

```typescript
// Option A: Pathname listener (simpler, more reliable)
useEffect(() => {
  if (isMenuOpen && previousPathnameRef.current !== pathname) {
    closeMenu();
  }
  previousPathnameRef.current = pathname;
}, [pathname, isMenuOpen, closeMenu]);

// Option B: 50% transition callback (synchronized with animation)
const { registerFiftyPercentCallback, unregisterFiftyPercentCallback } = useTransition();

useEffect(() => {
  if (isMenuOpen) {
    registerFiftyPercentCallback(closeMenu);
    return () => unregisterFiftyPercentCallback(closeMenu);
  }
}, [isMenuOpen, closeMenu, registerFiftyPercentCallback, unregisterFiftyPercentCallback]);
```

### Recommended Approach

Use **Option A (pathname listener)** as the primary solution because:
1. Simpler to implement and understand
2. Works even if TransitionProvider changes
3. Handles all navigation cases (not just TransitionLink)
4. Less coupling between components

Add **Option B (50% callback)** as enhancement if timing is critical for visual polish.

### Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| Double close calls | 🟢 Low | closeMenu is idempotent |
| Flicker on close | 🟡 Medium | Use AnimatePresence exit animation |
| Memory leak | 🟢 Low | Proper cleanup in useEffect |
| Initial render close | 🟡 Medium | Track previous pathname with ref |

### Files to Modify

1. `src/ui/organisms/MobileMenuOverlay/index.jsx` - Add pathname listener
2. (Optional) Add E2E test to `e2e/projects-articles.spec.ts` or new file

### Related Stories

- Story 12.5: NavigationItemLink onClick prop (added closeMenu support)
- Story 13.2: TransitionLink integration
- Story 14-17: State Management Cleanup (renamed close → closeMenuPanel)

## Definition of Done

- [ ] Menu closes automatically when user navigates via menu links
- [ ] Menu closes when navigating via any other TransitionLink
- [ ] No manual close required after navigation
- [ ] Works correctly with reduced motion
- [ ] No visual flicker or zombie states
- [ ] `npm run build` passes
- [ ] Existing E2E tests pass

## Change Log

| Date | Change |
|------|--------|
| 2026-02-07 | Story created from bug report during code review session |
