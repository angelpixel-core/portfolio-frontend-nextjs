# Story 13.6: Interaction Blocking During Transition

Status: done

## Story

As a **user navigating between pages**,
I want **all interactions (click, hover, scroll, keyboard focus) to be blocked while the page transition is in progress**,
so that **I cannot accidentally trigger actions or interrupt the transition, ensuring a smooth and predictable navigation experience**.

## Acceptance Criteria

### AC1: Click events blocked during transition
**Given** a page transition is in progress (phase: entering, covering, or exiting)
**When** the user attempts to click any element
**Then** the click is blocked and has no effect
**And** this applies to all clickable elements (buttons, links, inputs)
**And** cursor should indicate non-interactivity (cursor: default or wait)

### AC2: Hover effects suppressed during transition
**Given** a page transition is in progress
**When** the user hovers over any interactive element
**Then** no hover effects are triggered (no color changes, no tooltips)
**And** this applies globally to all elements with hover states
**And** existing hover states are cleared when transition starts

### AC3: Scroll disabled during transition
**Given** a page transition is in progress
**When** the user attempts to scroll (mouse wheel, touch swipe, keyboard arrows)
**Then** the page does not scroll
**And** `overflow: hidden` is applied to body
**And** scroll position is preserved for when transition ends

### AC4: Keyboard focus blocked during transition
**Given** a page transition is in progress
**When** the user presses Tab or Shift+Tab to navigate focus
**Then** focus does not move to any element
**And** no focus rings are visible
**And** form inputs cannot receive focus or input
**And** focus state is restored appropriately after transition completes (FR13.2)

### AC5: Curtains cover entire viewport including header
**Given** a page transition is in progress
**When** the curtain animation is visible
**Then** the curtains cover the entire viewport (100vw x 100vh)
**And** the curtains are positioned above all other content (z-index > header z-index)
**And** no content is visible through or around the curtains during full coverage (FR13.7)
**And** header, footer, and all fixed-position elements are below the curtains

### AC6: Interaction blocking is removed after transition
**Given** a page transition has completed (phase returns to idle)
**When** the transition ends
**Then** all interactions are re-enabled immediately
**And** click, hover, scroll, and focus work normally
**And** no residual blocking classes remain on body or elements

### AC7: Reduced motion users have instant blocking/unblocking
**Given** the user prefers reduced motion
**When** they navigate between pages
**Then** interaction blocking is NOT applied (navigation is instant)
**And** there is no visual transition to block interactions for (NFR13.2)

## Tasks / Subtasks

- [x] **Task 1: Audit and enhance CSS interaction blocking** (AC: 1, 2, 3)
  - [x] 1.1 Review current `.transition-active` styles in globals.css
  - [x] 1.2 Add `cursor: wait` or `cursor: default` to indicate non-interactivity
  - [x] 1.3 Verify `pointer-events: none !important` covers all edge cases
  - [x] 1.4 Ensure hover pseudo-states are suppressed (`:hover` effects don't trigger)

- [x] **Task 2: Implement keyboard focus blocking** (AC: 4)
  - [x] 2.1 Research options: CSS `visibility`, `inert` attribute, or JS focus trap
  - [x] 2.2 Add `inert` attribute to body during transition
  - [x] 2.3 Inert is supported in all modern browsers (Chrome 102+, Firefox 112+, Safari 15.5+)
  - [x] 2.4 Focus returns automatically when inert is removed

- [x] **Task 3: Verify curtain z-index hierarchy** (AC: 5)
  - [x] 3.1 Identify current z-index values for header (z-10), curtains (were z-10/20/30)
  - [x] 3.2 Updated curtains z-index to z-50/40/30 (above header z-10)
  - [x] 3.3 Z-index hierarchy documented in TransitionEffect component comments
  - [x] 3.4 All curtains properly cover header during transition

- [x] **Task 4: Verify blocking cleanup on transition end** (AC: 6)
  - [x] 4.1 Reviewed TransitionProvider cleanup in phase === "idle" effect
  - [x] 4.2 Tested body.transition-active class is removed
  - [x] 4.3 Tested inert attribute is removed
  - [x] 4.4 Cleanup effect in useEffect ensures no lingering attributes

- [x] **Task 5: Add unit tests for interaction blocking** (AC: 1-7)
  - [x] 5.1 Test body class addition/removal during transition phases
  - [x] 5.2 Test inert attribute toggling (4 new tests added)
  - [x] 5.3 Test reduced motion users skip blocking
  - [x] 5.4 Test cleanup on unmount

- [x] **Task 6: Validation of interaction blocking mechanisms** (AC: 1-6)
  - [x] 6.1 Click blocking: `pointer-events: none` prevents all click events (CSS-level, not testable in JSDOM)
  - [x] 6.2 Focus blocking: `inert` attribute tested via unit tests (4 tests)
  - [x] 6.3 Scroll blocking: `overflow: hidden` applied to body; browser natively preserves scroll position
  - [x] 6.4 Hover suppression: `pointer-events: none` prevents hover events (CSS-level, not testable in JSDOM)
  - [x] 6.5 Note: CSS behaviors (pointer-events, overflow) rely on browser implementation; unit tests verify attribute application

## Dev Notes

### Current Implementation Analysis

**What's already implemented (Story 13.1):**

```css
/* globals.css - Current state */
body.transition-active {
  overflow: hidden;        /* ✅ Blocks scroll */
  pointer-events: none;    /* ✅ Blocks clicks */
  touch-action: none;      /* ✅ Blocks touch gestures */
  user-select: none;       /* ✅ Blocks text selection */
}

body.transition-active * {
  pointer-events: none !important;
}
```

**Gap: Focus is NOT blocked** - Users can still Tab through elements during transition.

### Recommended Approach: `inert` Attribute

The `inert` HTML attribute is the recommended solution for blocking focus:

```tsx
// TransitionProvider enhancement
useEffect(() => {
  if (typeof document === "undefined") return;

  const mainContent = document.getElementById("main-content"); // or body

  if (state.isTransitioning) {
    document.body.classList.add(TRANSITION_ACTIVE_CLASS);
    mainContent?.setAttribute("inert", "");
  } else {
    document.body.classList.remove(TRANSITION_ACTIVE_CLASS);
    mainContent?.removeAttribute("inert");
  }

  return () => {
    document.body.classList.remove(TRANSITION_ACTIVE_CLASS);
    mainContent?.removeAttribute("inert");
  };
}, [state.isTransitioning]);
```

**Benefits of `inert`:**
- Native browser support (all modern browsers)
- Blocks Tab navigation
- Removes elements from accessibility tree during transition
- No JavaScript focus management needed
- Works with screen readers

**Browser Support:** Chrome 102+, Firefox 112+, Safari 15.5+

### Z-Index Hierarchy

**Implemented z-index values (Story 13.6):**

| Element | z-index | Notes |
|---------|---------|-------|
| Curtain primary (pink) | z-50 | Highest - covers everything |
| Curtain secondary (white) | z-40 | Middle curtain |
| Curtain tertiary (dark) | z-30 | Lowest curtain (same as HireMe/Floating) |
| HireMe circular text/link | z-30 | Fixed position in header |
| Floating panel | z-30 | Mobile menu overlay |
| Floating container | z-20 | Mobile menu backdrop |
| Header (NavBar) | z-10 | Main navigation |

**Tailwind z-index scale:**
- z-10 = 10
- z-20 = 20
- z-30 = 30
- z-40 = 40
- z-50 = 50

**Note:** Curtains at z-50/40/30 properly cover header (z-10). The dark curtain (z-30) shares z-index with HireMe and Floating panel, but since curtains cover full viewport and have `pointer-events: none`, there's no visual conflict during transitions.

### CSS Enhancements Needed

```css
/* Enhanced blocking styles */
body.transition-active {
  overflow: hidden;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  cursor: wait; /* NEW: Visual feedback */
}

/* Suppress hover pseudo-states */
body.transition-active *:hover {
  /* Force no hover effects - may need specific overrides */
}
```

### Files to Modify

| File | Change |
|------|--------|
| `src/state/providers/TransitionProvider/index.tsx` | Add `inert` attribute management |
| `src/styles/globals.css` | Add `cursor: wait`, verify hover suppression |
| `src/state/providers/TransitionProvider/__tests__/TransitionProvider.test.tsx` | Add tests for `inert` |

### Testing Strategy

1. **Unit tests:**
   - `inert` attribute added during `isTransitioning === true`
   - `inert` removed when `isTransitioning === false`
   - Cleanup on unmount

2. **Manual testing:**
   - Start navigation, try to Tab - should not move focus
   - Start navigation, click anywhere - should have no effect
   - Start navigation, scroll - should not scroll
   - Start navigation, hover over buttons - no visual feedback

### Edge Cases

1. **Focus on input during transition start**: If user has focus on input and transition starts, focus should be preserved conceptually but input should become non-interactive.

2. **Modal open during transition**: If a modal is open when transition starts, modal should also be blocked.

3. **Tab pressed repeatedly**: Even rapid Tab presses should not queue up focus changes.

### Library Versions

| Library | Version | Notes |
|---------|---------|-------|
| react | ^18.3.1 | useEffect for attribute management |
| next | ^15.3.0 | App Router compatible |
| framer-motion | ^10.18.0 | Transition animations |

### References

- [Source: _bmad-output/planning-artifacts/epics-v2.md#Epic-13] - FR13.2, FR13.7
- [Source: _bmad-output/implementation-artifacts/ux-design-behavior/spec-[curated].md#1.1] - "Durante la transición: Se bloquea toda interacción (click, hover, scroll, focus)"
- [Source: src/state/providers/TransitionProvider/index.tsx] - Current blocking implementation
- [Source: src/styles/globals.css] - Current .transition-active styles
- [Source: _bmad-output/implementation-artifacts/13-1-transition-infrastructure-provider.md] - Original blocking implementation

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Test run: All 63 Transition-related tests pass
- TransitionProvider: 35 tests pass (including 4 new inert attribute tests)
- TransitionEffect: 28 tests pass (updated z-index class references)

### Completion Notes List

1. **AC1 (Click blocking)**: `pointer-events: none` on body + children, `cursor: wait` feedback added
2. **AC2 (Hover suppression)**: `pointer-events: none` prevents hover events at CSS level (browser behavior, not unit-testable in JSDOM)
3. **AC3 (Scroll blocking)**: `overflow: hidden` on body; scroll position preserved natively by browser when overflow is restored
4. **AC4 (Keyboard focus blocking)**: Implemented using HTML `inert` attribute on body (4 unit tests)
5. **AC5 (Z-index hierarchy)**: Curtains increased from z-10/20/30 to z-50/40/30, ensuring coverage above header (z-10)
6. **AC6 (Cleanup)**: Verified - `inert` and `transition-active` removed when transition ends
7. **AC7 (Reduced motion)**: Verified - no blocking applied when `shouldReduceMotion` is true

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with gap analysis of current implementation | SM Agent |
| 2026-01-29 | Implemented Tasks 1-6: cursor:wait, inert attribute, z-index hierarchy | Dev Agent |
| 2026-01-29 | Code review fixes: updated z-index comment (z-30→z-50), documented z-index hierarchy, clarified AC2/AC3 testing limitations | Code Review |

### File List

**Modified:**
- `src/styles/globals.css` - Added cursor: wait to body.transition-active and children
- `src/state/providers/TransitionProvider/index.tsx` - Added inert attribute management
- `src/ui/molecules/TransitionEffect/index.jsx` - Updated z-index: z-50/40/30 (was z-30/20/10)
- `src/state/providers/TransitionProvider/__tests__/TransitionProvider.test.tsx` - Added 4 inert attribute tests
- `src/ui/molecules/TransitionEffect/__tests__/TransitionEffect.exitAnimation.test.tsx` - Updated z-index class references

**Created:**
None
