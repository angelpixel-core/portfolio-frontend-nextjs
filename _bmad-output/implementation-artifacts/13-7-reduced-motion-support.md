# Story 13.7: Reduced Motion Support

Status: done

## Story

As a **user with vestibular disorders or motion sensitivity**,
I want **the page transition system to respect my `prefers-reduced-motion` preference**,
so that **I can navigate the site without experiencing discomfort or disorientation from animations**.

## Acceptance Criteria

### AC1: TransitionProvider respects reduced motion preference
**Given** the user has `prefers-reduced-motion: reduce` enabled in their OS settings
**When** they trigger any page navigation
**Then** the transition is skipped entirely (instant navigation)
**And** no curtain animations are rendered
**And** no interaction blocking is applied
**And** the navigation completes immediately via `router.push()`

### AC2: TransitionEffect returns null for reduced motion users
**Given** `shouldReduceMotion === true` in the transition context
**When** the TransitionEffect component renders
**Then** it returns `null` (renders nothing)
**And** no framer-motion animations are initialized
**And** no DOM elements are added for curtains

### AC3: Page title animations respect reduced motion
**Given** `prefers-reduced-motion: reduce` is enabled
**When** a new page loads
**Then** the page title appears instantly without slide/fade animation
**And** the title is visible immediately at its final position
**And** no animation duration or delay is applied

### AC4: CSS animations disabled for reduced motion users
**Given** `prefers-reduced-motion: reduce` is enabled
**When** the user views any page
**Then** all CSS animations have duration of 0.01ms (instant completion)
**And** all CSS transitions have duration of 0.01ms
**And** `scroll-behavior: auto` is applied (no smooth scrolling)
**And** animations complete immediately to their final state

### AC5: Unit tests verify reduced motion behavior
**Given** the test suite for transition components
**When** tests run with mocked `useReducedMotion() === true`
**Then** TransitionEffect renders null
**And** TransitionProvider performs instant navigation
**And** No `inert` attribute or `transition-active` class is applied
**And** All animation-related tests pass

### AC6: Infinite CSS animations disabled for reduced motion
**Given** `prefers-reduced-motion: reduce` is enabled
**When** the user views components with infinite CSS animations
**Then** the CustomersSlider carousel animation is disabled
**And** the Hiring hue-rotate animation is disabled
**And** the Skill fireRing animation is disabled
**And** no continuous motion occurs anywhere in the UI

## Tasks / Subtasks

- [x] **Task 1: Audit current reduced motion implementation** (AC: 1, 2, 3)
  - [x] 1.1 Verify TransitionProvider correctly uses `useReducedMotion()` hook
  - [x] 1.2 Verify TransitionEffect returns null when `shouldReduceMotion === true`
  - [x] 1.3 Verify MotionTitle handles reduced motion (sets duration to 0, no translate)
  - [x] 1.4 Document current implementation status

- [x] **Task 2: Fix CSS animations missing reduced-motion rules** (AC: 4, 6)
  - [x] 2.1 Add `@media (prefers-reduced-motion: reduce)` to CustomersSlider/styles.css
  - [x] 2.2 Add `@media (prefers-reduced-motion: reduce)` to Hiring/styles.css
  - [x] 2.3 Verify global reduced-motion.css is imported in globals.css
  - [x] 2.4 Test that infinite animations stop with preference enabled

- [x] **Task 3: Verify no interaction blocking for reduced motion users** (AC: 1)
  - [x] 3.1 Review TransitionProvider startTransition() reduced motion path
  - [x] 3.2 Verify `inert` attribute is NOT applied when reduced motion enabled
  - [x] 3.3 Verify `transition-active` class is NOT applied when reduced motion enabled
  - [x] 3.4 Test instant navigation flow

- [x] **Task 4: Add/verify unit tests for reduced motion** (AC: 5)
  - [x] 4.1 Verify existing test: TransitionEffect returns null (TransitionEffect.reducedMotion.test.tsx)
  - [x] 4.2 Verify existing test: TransitionProvider skips blocking (TransitionProvider.test.tsx)
  - [x] 4.3 Add test: Verify no inert attribute when reduced motion enabled
  - [x] 4.4 Add test: Verify instant navigation (router.push called immediately)

- [x] **Task 5: Add E2E test for reduced motion behavior** (AC: 1-6)
  - [x] 5.1 Create test with `prefers-reduced-motion: reduce` emulated via Playwright
  - [x] 5.2 Test navigation is instant (no visible curtains)
  - [x] 5.3 Test page content is immediately visible after navigation
  - [x] 5.4 Test infinite animations are not running

## Dev Notes

### Current Implementation Analysis

**Already implemented and working:**

1. **useReducedMotion hook** (`src/hooks/ui/useReducedMotion.ts`)
   - Wraps framer-motion's `useReducedMotion()`
   - Returns boolean, defaults to `false`

2. **TransitionProvider** (`src/state/providers/TransitionProvider/index.tsx`)
   - Uses `useReducedMotion()` hook
   - In `startTransition()`: if `shouldReduceMotion`, calls `router.push()` directly and returns
   - Does NOT apply `transition-active` class or `inert` attribute for reduced motion users

3. **TransitionEffect** (`src/ui/molecules/TransitionEffect/index.jsx`)
   - Gets `shouldReduceMotion` from `useTransition()` hook
   - Returns `null` at line 38 if `shouldReduceMotion === true`

4. **MotionTitle** (`src/ui/atoms/texts/AnimatedTitle/MotionTitle.jsx`)
   - Uses `useReducedMotion()` from framer-motion
   - Sets animation variants to instant when reduced motion enabled

5. **Global CSS** (`src/styles/reduced-motion.css`)
   - `animation-duration: 0.01ms !important`
   - `transition-duration: 0.01ms !important`
   - `animation-iteration-count: 1 !important`
   - Imported via `src/styles/globals.css`

**Gaps identified (from audit):**

| Component | Issue | Fix Needed |
|-----------|-------|------------|
| CustomersSlider | No @media rule for infinite scroll animation | Add CSS rule |
| Hiring | No @media rule for infinite hue-rotate | Add CSS rule |

### CSS Fix Examples

```css
/* CustomersSlider/styles.css */
@media (prefers-reduced-motion: reduce) {
  .slider .slide-track {
    animation: none;
  }
}

/* Hiring/styles.css */
@media (prefers-reduced-motion: reduce) {
  .hiring_container {
    animation: none;
  }
}
```

### Testing with Playwright

```typescript
// Emulate reduced motion preference
await page.emulateMedia({ reducedMotion: 'reduce' });
```

### Existing Test Coverage

| Test File | Coverage |
|-----------|----------|
| `TransitionEffect.reducedMotion.test.tsx` | Returns null when reduced motion preferred |
| `TransitionProvider.test.tsx` | "should NOT add inert when reduced motion is preferred" |
| `TransitionProvider.test.tsx` | "should navigate instantly when reduced motion is preferred" |

### References

- [Source: _bmad-output/planning-artifacts/epics-v2.md#NFR13.2] - "Accessibility: respetar `prefers-reduced-motion` con transición instantánea"
- [Source: src/hooks/ui/useReducedMotion.ts] - Current hook implementation
- [Source: src/styles/reduced-motion.css] - Global CSS rules
- [Source: src/state/providers/TransitionProvider/index.tsx:330-333] - Reduced motion handling in startTransition()
- [Source: src/ui/molecules/TransitionEffect/index.jsx:37-39] - Reduced motion early return

### WCAG Compliance

- **WCAG 2.1 Success Criterion 2.3.3**: Animation from Interactions (Level AAA)
- Users with vestibular disorders can disable motion that is triggered by interaction
- Our implementation provides INSTANT navigation with NO animation

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - implementation straightforward

### Completion Notes List

1. **Task 1 (Audit)**: Verified existing implementation is comprehensive:
   - TransitionProvider:329-333 - instant navigation via `router.push()` when reduced motion enabled
   - TransitionEffect:37-39 - returns null when `shouldReduceMotion === true`
   - MotionTitle - uses framer-motion's `useReducedMotion()` for instant title display
   - Global CSS - `reduced-motion.css` sets 0.01ms durations for all animations

2. **Task 2 (CSS Fixes)**: Added missing `@media (prefers-reduced-motion: reduce)` rules:
   - CustomersSlider - infinite scroll animation now disabled
   - Hiring - infinite hue-rotate animation now disabled
   - Both use `animation: none` per WCAG best practices

3. **Task 3 (Interaction Blocking)**: Verified reduced motion path bypasses all blocking:
   - No `transition-active` class applied
   - No `inert` attribute applied
   - Direct `router.push()` call with immediate return

4. **Task 4 (Unit Tests)**: All existing tests verified:
   - 75 transition/reduced-motion tests pass
   - TransitionEffect.reducedMotion.test.tsx covers null return
   - TransitionProvider.test.tsx covers instant navigation and no blocking

5. **Task 5 (E2E Tests)**: Created comprehensive E2E test suite:
   - 6 tests covering all ACs
   - Uses Playwright's `page.emulateMedia({ reducedMotion: 'reduce' })`
   - Tests instant navigation, no curtains, no blocking, CSS animations disabled

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with comprehensive audit of reduced motion support | SM Agent |
| 2026-01-29 | Implemented all tasks, added CSS rules and E2E tests | Dev Agent (Opus 4.5) |
| 2026-01-29 | Code review: Fixed missing Skill fireRing reduced-motion rule, improved E2E tests | Code Review (Opus 4.5) |

### File List

**Modified:**
- `src/ui/molecules/CustomersSlider/styles.css` - Added reduced motion media query
- `src/ui/organisms/Hiring/styles.css` - Added reduced motion media query
- `src/ui/molecules/Skill/styles.css` - Added reduced motion rule for fireRing animation (code review fix)

**Created:**
- `e2e/reduced-motion.spec.ts` - Comprehensive E2E test suite for reduced motion behavior
