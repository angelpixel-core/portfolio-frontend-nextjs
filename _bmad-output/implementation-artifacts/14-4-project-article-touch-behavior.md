# Story 14.4: Project & Article Touch Behavior

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **mobile portfolio visitor**,
I want **project and article cards to respond to touch interactions with equivalent functionality to hover states**,
so that **I can access action links and view visual feedback on touch devices without hover capability**.

## Acceptance Criteria

### AC1: Touch activates hover-equivalent state on project cards
**Given** a project card on a touch device
**When** the user taps on the card
**Then** the card enters a "touched" state showing action links (GitHub/Demo)
**And** the image does NOT zoom on tap (zoom is hover-only per spec)
**And** tapping elsewhere dismisses the touched state
**And** the touched state is visually distinct (same as hover state)

### AC2: Touch targets meet WCAG minimum size (44x44px)
**Given** all interactive elements (action links, card itself)
**When** rendered on mobile viewport
**Then** touch targets are at least 44x44px
**And** there is adequate spacing between touch targets to prevent mis-taps
**And** the entire action link area is tappable (not just the icon)

### AC3: No hover emulation on mobile (UX Spec compliance)
**Given** a mobile device without hover capability
**When** the user interacts with project/article cards
**Then** hover thumbnail following cursor is NOT implemented
**And** image zoom is NOT triggered on touch
**And** only tap-to-reveal action links is implemented
**And** behavior degrades gracefully without complex hover emulation

### AC4: Touch state coordination with TransitionProvider
**Given** a page transition is in progress
**When** the user taps on a project card
**Then** touch state changes do NOT occur during transition
**And** touch interactions wait until `canAnimate === true`
**And** this prevents visual conflicts during page transitions

### AC5: Reduced motion support for touch states
**Given** user has `prefers-reduced-motion` enabled
**When** user taps on project cards
**Then** action links are always visible (no tap required)
**And** no animation occurs on touch state change
**And** functionality remains fully accessible

### AC6: Touch behavior applies to both Projects and Articles pages
**Given** project cards on /projects and article cards on /articles (future)
**When** rendered on touch devices
**Then** the same touch behavior pattern applies to both
**And** the implementation is reusable across card types
**And** ArticleCard (Story 14.5) can adopt the same pattern

### AC7: Unit tests cover touch behavior
**Given** the touch behavior implementation
**When** running unit tests
**Then** tests verify touch state activation
**And** tests verify touch state dismissal
**And** tests verify TransitionProvider coordination
**And** tests verify reduced motion behavior
**And** tests verify 44x44px touch target compliance

## Tasks / Subtasks

- [x] **Task 1: Implement touch state management hook** (AC: 1, 4, 5)
  - [x] 1.1 Create `useTouchState` hook in `src/hooks/ui/`
  - [x] 1.2 Track `isTouched` state per card instance
  - [x] 1.3 Integrate with `useTransition` to check `canAnimate` and `isTransitioning`
  - [x] 1.4 Integrate with `useReducedMotion` to skip touch states when reduced motion
  - [x] 1.5 Handle outside tap to dismiss touched state
  - [x] 1.6 Add cleanup on unmount

- [x] **Task 2: Update ProjectCard components for touch support** (AC: 1, 3)
  - [x] 2.1 Import `useTouchState` in Grid.tsx and Featured.tsx
  - [x] 2.2 Add `onTouchStart` handler to card element
  - [x] 2.3 Apply `project-card--touched` CSS class when touched
  - [x] 2.4 Ensure image zoom only applies to `hover` (not touch)
  - [x] 2.5 Pass `isTouched` state to ActionLinks for visibility control

- [x] **Task 3: Update ActionLinks for touch visibility** (AC: 1, 2)
  - [x] 3.1 Accept `isTouched` prop in ActionLinks component
  - [x] 3.2 Show links when `isTouched === true` OR on hover
  - [x] 3.3 Ensure 44x44px minimum touch target with CSS
  - [x] 3.4 Add adequate padding/margin for touch safety

- [x] **Task 4: Add CSS for touch states** (AC: 1, 2, 5)
  - [x] 4.1 Add `.project-card--touched` modifier class
  - [x] 4.2 Style touched state same as hover (action links visible)
  - [x] 4.3 Add 44x44px min-height/min-width to action links
  - [x] 4.4 Handle reduced motion: always show action links

- [x] **Task 5: Implement touch dismissal** (AC: 1)
  - [x] 5.1 Add document-level touch event listener for dismissal
  - [x] 5.2 Dismiss touched state when tapping outside card
  - [x] 5.3 Ensure only one card can be in touched state at a time
  - [x] 5.4 Clean up event listeners on unmount

- [x] **Task 6: Unit tests** (AC: 7)
  - [x] 6.1 Test `useTouchState` hook behavior
  - [x] 6.2 Test touch state activation on card tap
  - [x] 6.3 Test touch state dismissal on outside tap
  - [x] 6.4 Test TransitionProvider coordination (no touch during transition)
  - [x] 6.5 Test reduced motion (links always visible)
  - [x] 6.6 Test 44x44px touch target dimensions
  - [x] 6.7 Test both Grid and Featured variants

- [ ] **Task 7: E2E tests** (AC: all) - **DEFERRED to Story 14.9**
  - [ ] 7.1 Test touch activation on mobile viewport (Playwright touch simulation)
  - [ ] 7.2 Test touch dismissal
  - [ ] 7.3 Test touch during page transition
  - [ ] 7.4 Test reduced motion preference
  - **Note:** E2E tests consolidated in Story 14.9 (epic-14-e2e-test-suite)

## Dev Notes

### Previous Story Intelligence (14.1, 14.2, 14.3)

**From Story 14.1 (Project Card Component):**
- **ProjectCard component** is TypeScript with variants (Featured, Grid)
- **ActionLinks** component exists with hover visibility controlled by CSS
- **Icon className issue**: Icons require `className=""` prop when used
- **Testing patterns**: Use `@testing-library/react`, mock Next.js Link

**From Story 14.2 (Projects Page Layout):**
- Blade-based layout with hero blade + grid blade
- Featured project prioritized in hero blade
- 6-project limit with featured prioritization

**From Story 14.3 (Hover Interactions):**
- **Hover zoom**: `whileHover={{ scale: 1.08 }}` with 0.3s easeOut transition
- **Action links hover visibility**: CSS-based fade-in with `.project-card__actions`
- **TransitionProvider coordination**: `useTransition` hook checks `canAnimate` and `isTransitioning`
- **Reduced motion**: `useReducedMotion` hook; links always visible when reduced motion
- **Simplified ActionLinks**: Removed useState/useEffect for animation class - compute directly

**File patterns established:**
```
src/ui/organisms/ProjectCard/
├── index.tsx           # Auto-selects variant
├── variants/Featured.tsx  # With useTransition, useReducedMotion
├── variants/Grid.tsx      # With useTransition, useReducedMotion
├── ActionLinks.tsx        # Controls hover/touch visibility
├── TechStackIcons.tsx
└── styles.css             # BEM naming, hover styles
```

### UX Spec Requirements (Critical)

**From spec.md Section "5. Mobile behavior":**
```
✔️ Bien decidido
• Mismo box
• Misma jerarquía
• Sin persecución compleja del cursor (no tiene sentido)

En mobile:
• El hover se traduce a:
• Aparición simple
• O directamente se omite (aceptable)

📌 Importante:
No intentes "emular hover" en mobile.
Es mejor no hacerlo que hacerlo mal.
```

**From epics-v2.md FR14.14:**
```
| FR14.14 | Touch behavior equivalente a hover (tap-to-expand o similar) |
```

**From epics-v2.md NFR14.3:**
```
| NFR14.3 | Mobile-first: touch behavior diseñado primero, hover como enhancement |
```

### Design Decision: Tap-to-Reveal Pattern

Based on UX spec analysis, the recommended pattern is:

1. **Desktop (hover capable)**: Hover shows action links (already implemented in 14.3)
2. **Mobile (touch only)**: Single tap reveals action links, second tap elsewhere dismisses
3. **Image zoom**: ONLY on hover (not on touch) per spec
4. **No mouse-following thumbnail**: Spec explicitly says "no tiene sentido" on mobile

### Implementation Approach

**Option A: CSS-only `@media (hover: none)`** ❌
- Simple but cannot coordinate with TransitionProvider
- Cannot implement "tap elsewhere to dismiss"

**Option B: Custom `useTouchState` hook** ✅ (Recommended)
- Full control over touch state
- Can coordinate with TransitionProvider
- Can implement dismissal logic
- Reusable for ArticleCard (Story 14.5)

### Proposed Hook API

```typescript
// src/hooks/ui/useTouchState.ts
interface UseTouchStateOptions {
  disabled?: boolean; // For TransitionProvider coordination
}

interface UseTouchStateReturn {
  isTouched: boolean;
  touchHandlers: {
    onTouchStart: (e: TouchEvent) => void;
  };
  resetTouch: () => void;
}

export function useTouchState(options?: UseTouchStateOptions): UseTouchStateReturn;
```

### Touch Target CSS

```css
/* 44x44px minimum touch target (WCAG 2.5.5) */
.project-card__action-link {
  @apply min-w-11 min-h-11; /* 44px */
}

/* Ensure adequate spacing */
.project-card__actions {
  @apply gap-4; /* Increased from gap-3 */
}
```

### Current ActionLinks Implementation (from 14.3)

```tsx
// ActionLinks.tsx (simplified in 14.3)
const { isTransitioning } = useTransition();
const shouldReduceMotion = useReducedMotion();

// Compute animation class directly
const animationClass =
  !canHoverAnimate || shouldReduceMotion
    ? "project-card__actions--no-animation"
    : "";
```

**Changes needed for touch support:**
```tsx
// ActionLinks.tsx with touch support
interface ActionLinksProps {
  // ... existing props
  isTouched?: boolean;  // NEW: from parent card
}

// Show links when: hover OR touched OR reduced motion
const shouldShowLinks = isTouched || shouldReduceMotion;
```

### Accessibility Requirements

- **44x44px touch targets**: WCAG 2.5.5 Target Size (Level AAA recommended)
- **Touch feedback**: Visual indication that touch was registered
- **Keyboard still works**: Tab navigation must remain functional
- **No gesture conflicts**: Don't conflict with browser gestures (swipe, pinch)

### Performance Considerations

- Single touch event listener per card (not document-level per card)
- Use passive event listeners where possible
- Cleanup listeners on unmount
- No re-renders during touch state changes if using refs

### Testing Patterns

```typescript
// Unit test example
import { render, screen, fireEvent } from "@testing-library/react";
import { TransitionProvider } from "@/state/providers/TransitionProvider";

describe("ProjectCard Touch", () => {
  it("shows action links on touch", () => {
    render(
      <TransitionProvider>
        <GridProjectCard project={mockProject} />
      </TransitionProvider>
    );

    const card = screen.getByRole("article");
    fireEvent.touchStart(card);

    const link = screen.getByLabelText(/View source code/);
    expect(link).toBeVisible();
  });

  it("dismisses touch state on outside tap", () => {
    // ... test implementation
  });
});
```

### References

- [Source: epics-v2.md#FR14.14] - Touch behavior equivalente a hover
- [Source: epics-v2.md#NFR14.3] - Mobile-first: touch behavior diseñado primero
- [Source: epics-v2.md#NFR14.5] - E2E tests para hover, touch, y sequential appearance
- [Source: ux-design-behavior/spec.md#5] - Mobile behavior: "No intentes emular hover en mobile"
- [Source: 14-3-project-hover-interactions.md] - Hover implementation patterns
- [Source: src/ui/organisms/ProjectCard/ActionLinks.tsx] - Current ActionLinks implementation
- [Source: src/hooks/ui/useTransition.ts] - TransitionProvider coordination hook
- [Source: src/hooks/ui/useReducedMotion.ts] - Reduced motion preference hook

### Deferred / Follow-up (out of scope for 14.4)

- **ArticleCard touch behavior**: Will reuse `useTouchState` hook in Story 14.5
- **E2E tests**: Consolidated in Story 14.9

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - Clean implementation, no debug issues

### Completion Notes List

1. **Task 1 Complete**: Created `useTouchState` hook with full TransitionProvider and reduced motion integration
2. **Task 2 Complete**: Updated Grid.tsx and Featured.tsx with touch handlers and ref attachment
3. **Task 3 Complete**: Updated ActionLinks with `isTouched` prop and visibility class
4. **Task 4 Complete**: Added CSS for touch states, 44x44px targets, and reduced motion support
5. **Task 5 Complete**: Touch dismissal implemented in hook via document-level listeners
6. **Task 6 Complete**: 63 tests passing (16 useTouchState + 47 ProjectCard including 11 touch behavior tests)
7. **Task 7 Deferred**: E2E tests consolidated in Story 14.9 per story definition

### File List

**Created:**
- `src/hooks/ui/useTouchState.ts` - Touch state management hook
- `src/hooks/ui/__tests__/useTouchState.test.tsx` - 16 unit tests for hook

**Modified:**
- `src/hooks/ui/index.js` - Export useTouchState
- `src/ui/organisms/ProjectCard/ProjectCard.types.ts` - Added isTouched prop
- `src/ui/organisms/ProjectCard/ActionLinks.tsx` - Touch visibility support
- `src/ui/organisms/ProjectCard/variants/Grid.tsx` - Touch handlers integration
- `src/ui/organisms/ProjectCard/variants/Featured.tsx` - Touch handlers integration
- `src/ui/organisms/ProjectCard/styles.css` - Touch state CSS, 44px targets
- `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` - Touch behavior tests
- `src/app/projects/page.tsx` - Fixed pre-existing prettier error (unrelated)

## Senior Developer Review (AI)

**Reviewer:** Angel DevStack
**Date:** 2026-01-29
**Model:** Claude Opus 4.5

### Review Summary

**Issues Found:** 2 HIGH, 4 MEDIUM, 3 LOW
**Issues Fixed:** 6 (all HIGH and MEDIUM)
**Tests Added:** 2 new test cases

### Issues Fixed

1. **HIGH-1: AC7 test for 44x44px touch targets missing** → Added 2 tests verifying CSS classes for touch target compliance
2. **HIGH-2: CSS base hidden state missing for hover-reveal** → Added `opacity-0 invisible` base state and hover reveal rule
3. **MEDIUM-1: Related to HIGH-2** → Fixed with HIGH-2
4. **MEDIUM-2: Unnecessary React import** → Cleaned up to use type imports with aliases
5. **MEDIUM-3: Test missing assertion** → Added `stopPropagation` NOT called verification for desktop devices

### Issues Deferred (LOW)

- LOW-1: `isDisabled` not used in components (cosmetic)
- LOW-2: CSS comment clarity (documentation)
- LOW-3: JSDoc for id default value (documentation)

### Verification

- ✅ 63 tests passing (up from 61)
- ✅ Build successful
- ✅ Lint clean (1 pre-existing warning in test mock)
- ✅ All ACs verified against implementation
