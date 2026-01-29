# Story 13.6: Interaction Blocking During Transition

Status: ready-for-dev

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

- [ ] **Task 1: Audit and enhance CSS interaction blocking** (AC: 1, 2, 3)
  - [ ] 1.1 Review current `.transition-active` styles in globals.css
  - [ ] 1.2 Add `cursor: wait` or `cursor: default` to indicate non-interactivity
  - [ ] 1.3 Verify `pointer-events: none !important` covers all edge cases
  - [ ] 1.4 Ensure hover pseudo-states are suppressed (`:hover` effects don't trigger)

- [ ] **Task 2: Implement keyboard focus blocking** (AC: 4)
  - [ ] 2.1 Research options: CSS `visibility`, `inert` attribute, or JS focus trap
  - [ ] 2.2 Add `inert` attribute to body during transition (best a11y approach)
  - [ ] 2.3 If `inert` not supported, fallback to tabindex management
  - [ ] 2.4 Ensure focus returns to appropriate element after transition

- [ ] **Task 3: Verify curtain z-index hierarchy** (AC: 5)
  - [ ] 3.1 Identify current z-index values for header, footer, modals, curtains
  - [ ] 3.2 Ensure curtains z-index (z-30, z-20, z-10) is above header
  - [ ] 3.3 Create z-index documentation if not exists
  - [ ] 3.4 Test that no elements "peek through" during transition

- [ ] **Task 4: Verify blocking cleanup on transition end** (AC: 6)
  - [ ] 4.1 Review TransitionProvider cleanup in phase === "idle" effect
  - [ ] 4.2 Test that body.transition-active class is removed
  - [ ] 4.3 Test that inert attribute is removed
  - [ ] 4.4 Verify no memory leaks or lingering event listeners

- [ ] **Task 5: Add unit tests for interaction blocking** (AC: 1-7)
  - [ ] 5.1 Test body class addition/removal during transition phases
  - [ ] 5.2 Test inert attribute toggling
  - [ ] 5.3 Test reduced motion users skip blocking
  - [ ] 5.4 Test cleanup on unmount

- [ ] **Task 6: Manual validation of all interaction types** (AC: 1-6)
  - [ ] 6.1 Manually test click blocking during transition
  - [ ] 6.2 Manually test tab navigation is blocked
  - [ ] 6.3 Manually test scroll is blocked
  - [ ] 6.4 Manually test hover effects are suppressed

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

**Current z-index values to verify:**

| Element | z-index | Notes |
|---------|---------|-------|
| Curtain primary (pink) | z-30 | Highest curtain |
| Curtain secondary (white) | z-20 | Middle curtain |
| Curtain tertiary (dark) | z-10 | Lowest curtain |
| Header | ? | Need to verify |
| Fixed Hire Me button | ? | Need to verify |
| Mobile menu | ? | Need to verify |

**Tailwind z-index scale:**
- z-10 = 10
- z-20 = 20
- z-30 = 30
- z-40 = 40
- z-50 = 50

If header uses z-40 or z-50, curtains need to be increased.

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

(To be filled by dev agent)

### Debug Log References

### Completion Notes List

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with gap analysis of current implementation | SM Agent |

### File List

**Modified:**
(To be filled by dev agent)

**Created:**
(To be filled by dev agent)
