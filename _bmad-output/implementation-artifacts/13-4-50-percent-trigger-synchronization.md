# Story 13.4: 50% Trigger Synchronization

Status: ready-for-dev

## Story

As a **user navigating between pages**,
I want the **page transition animations to be synchronized with the 50% viewport coverage point**,
so that **the new page content, animations, and data requests start at the precise moment the dark curtain crosses the center of the screen, creating a perfectly choreographed transition experience**.

## Acceptance Criteria

### AC1: Progress tracking during entering phase
**Given** a page transition is in progress
**When** the curtain animation is in "entering" phase
**Then** the progress value (0-100%) is updated in real-time based on the dark curtain's position
**And** progress 0% = dark curtain at left edge, 100% = dark curtain fully covering screen
**And** the progress value is accessible via `useTransition()` hook

### AC2: 50% trigger fires at correct moment
**Given** the entering animation is in progress
**When** the dark curtain (z-10) crosses the 50% viewport mark
**Then** a "fifty percent reached" event fires exactly once
**And** the event includes the target href for the navigation
**And** the event is available to consuming components via context

### AC3: Navigation delayed until 50% point
**Given** a page transition has been initiated via `startTransition(href)`
**When** the entering animation progresses
**Then** the actual navigation (`router.push`) does NOT occur until 50% is reached
**And** the navigation fires immediately upon reaching 50%
**And** the "covering" phase begins at this point

### AC4: Page animations sync with 50% trigger
**Given** components on the new page want to animate on mount
**When** the 50% trigger fires
**Then** a `canAnimate` flag becomes true in the transition context
**And** components can use this flag to start their entrance animations
**And** animations are NOT started before this flag is true (FR13.10)

### AC5: Data requests sync with 50% trigger (optional hook)
**Given** the new page needs to fetch data on mount
**When** the 50% trigger fires
**Then** an optional `onFiftyPercent` callback is invoked (if registered)
**And** data fetching can be initiated in this callback
**And** this provides a synchronization point for React Query or similar

### AC6: Progress resets correctly between transitions
**Given** a transition has completed (phase = "idle")
**When** a new transition starts
**Then** progress resets to 0%
**And** the 50% trigger is re-armed for the new transition
**And** no stale state from previous transitions affects the new one

## Tasks / Subtasks

- [ ] **Task 1: Implement progress tracking via framer-motion onUpdate** (AC: 1)
  - [ ] 1.1 Add `onUpdate` callback to dark curtain motion.div in TransitionEffect
  - [ ] 1.2 Calculate progress as percentage of x position (0% at x:0%, 100% at x:100%)
  - [ ] 1.3 Call `setProgress()` from TransitionProvider via new callback
  - [ ] 1.4 Expose progress value in useTransition hook (already exists, verify working)
  - [ ] 1.5 Only track progress during "entering" phase (not exiting)

- [ ] **Task 2: Implement 50% trigger detection** (AC: 2)
  - [ ] 2.1 Add `hasFiredFiftyPercent` ref to prevent multiple firings
  - [ ] 2.2 Add `onFiftyPercent` callback to TransitionContextValue interface
  - [ ] 2.3 In onUpdate, detect when progress crosses 50% threshold
  - [ ] 2.4 Fire event exactly once per transition
  - [ ] 2.5 Reset `hasFiredFiftyPercent` when transition ends (phase = "idle")

- [ ] **Task 3: Delay navigation until 50% trigger** (AC: 3)
  - [ ] 3.1 Remove current setTimeout-based navigation in startTransition
  - [ ] 3.2 Move `router.push(href)` to be called when 50% is reached
  - [ ] 3.3 Transition to "covering" phase at 50% (not after ENTER_DURATION timeout)
  - [ ] 3.4 Keep timeout fallback in case animation callbacks fail
  - [ ] 3.5 Verify animation continues smoothly after navigation fires

- [ ] **Task 4: Add canAnimate flag for page components** (AC: 4)
  - [ ] 4.1 Add `canAnimate: boolean` to TransitionState interface
  - [ ] 4.2 Set `canAnimate = false` at start of transition
  - [ ] 4.3 Set `canAnimate = true` when 50% trigger fires
  - [ ] 4.4 Reset `canAnimate = false` on transition end
  - [ ] 4.5 Document usage pattern for page components

- [ ] **Task 5: Add optional onFiftyPercent callback registration** (AC: 5)
  - [ ] 5.1 Add `registerFiftyPercentCallback` function to context
  - [ ] 5.2 Store registered callbacks in ref array
  - [ ] 5.3 Call all registered callbacks when 50% trigger fires
  - [ ] 5.4 Add `unregisterFiftyPercentCallback` for cleanup
  - [ ] 5.5 Document usage pattern for data fetching

- [ ] **Task 6: Unit tests for progress tracking and 50% trigger** (AC: 1-6)
  - [ ] 6.1 Test progress updates during entering phase
  - [ ] 6.2 Test 50% trigger fires exactly once
  - [ ] 6.3 Test navigation occurs at 50% point
  - [ ] 6.4 Test canAnimate flag state transitions
  - [ ] 6.5 Test callback registration and invocation
  - [ ] 6.6 Test progress reset between transitions

## Dev Notes

### Understanding the 50% Trigger Requirement

**Spec says (FR13.8-10):**
> "La transición real ocurre cuando la extensión negra cruza el 50% del viewport"
> "El evento del 50% dispara: montaje de nueva página, inicio de animaciones, inicio de requests"
> "NADA animado se dispara antes del punto del 50%"

**Current implementation (Stories 13.1-13.3):**
- Navigation happens after `ENTER_DURATION + PAUSE_AT_FULL` timeout (fixed timing)
- No progress tracking during animation
- `progress` state exists but is always 0

**This story transforms navigation from time-based to progress-based:**
- Track actual animation progress via framer-motion callbacks
- Fire navigation exactly when dark curtain crosses 50%
- Provide synchronization hook for page components

### Technical Approach: framer-motion onUpdate

Framer-motion provides `onUpdate` callback that fires on every animation frame:

```jsx
<motion.div
  animate={{ x: "100%" }}
  onUpdate={(latest) => {
    // latest.x = "50%" or similar
    const progress = parseFloat(latest.x) // Extract numeric percentage
    setProgress(progress)
    if (progress >= 50 && !hasFiredFiftyPercent.current) {
      hasFiredFiftyPercent.current = true
      onFiftyPercent()
    }
  }}
/>
```

**Key considerations:**
1. Only the DARK curtain (z-10) determines the 50% point
2. Dark curtain has `w-[140vw]` width, so its position calculation differs
3. Progress is 0-100% based on x transform value
4. Must handle easing curve (progress is not linear in time)

### Progress Calculation for Dark Curtain

The dark curtain starts at `x: 0%` (off-screen left) and animates to `x: 100%` (covering screen).

With `right-full` positioning:
- `x: 0%` = curtain right edge at viewport left edge
- `x: 50%` = curtain right edge at viewport center
- `x: 100%` = curtain right edge at viewport right edge (fully covering)

Since the spec says "dark extension crosses 50% of viewport", we track when `x >= 50%`.

### State Machine Changes

**Current flow:**
```
idle → entering → [TIMEOUT] → covering → [pathname match] → exiting → idle
                    ↑
              Fixed timing
```

**New flow:**
```
idle → entering → [50% reached] → covering → [pathname match] → exiting → idle
                      ↑
                Progress-based
```

### Interface Changes Required

```typescript
// types.ts additions
export interface TransitionState {
  // ... existing
  canAnimate: boolean;  // NEW: True after 50% trigger
}

export interface TransitionContextValue extends TransitionState {
  // ... existing
  onProgressUpdate: (progress: number) => void;  // NEW: Called by TransitionEffect
  registerFiftyPercentCallback: (cb: () => void) => void;  // NEW
  unregisterFiftyPercentCallback: (cb: () => void) => void;  // NEW
}
```

### Previous Story Learnings (Story 13.3)

**Key architectural decisions to maintain:**
- Phase state machine: idle → entering → covering → exiting → idle
- "covering" phase is when navigation actually happens
- Timeout fallback for stuck transitions (ADR-13.3-003)
- Progress tracking via `setProgress()` already exists (unused)

**CSS positioning context (CRITICAL):**
```css
.transition-effect_blade {
  @apply fixed top-0 bottom-0 right-full h-screen;
}
```

With `right-full` (right: 100%):
- `x: 0%` = blade is off-screen to the LEFT (invisible)
- `x: 100%` = blade covers the screen (visible)

**Curtain widths:**
- Pink: `w-screen` (100vw)
- White: `w-[120vw]` (+20vw extension)
- Dark: `w-[140vw]` (+40vw extension)

### Timing Considerations

**Current timing constants:**
```typescript
const TRANSITION_TIMING = {
  ENTER_DURATION: 800,    // Total entering animation duration
  PAUSE_AT_FULL: 10,      // Configurable via env (currently 10ms)
  EXIT_DURATION: 800,
  PAUSE_BEFORE_EXIT: 100,
  EXIT_FALLBACK_TIMEOUT: 1300,
}
```

**With 50% trigger:**
- Navigation fires at ~400ms into entering (50% of 800ms with linear easing)
- Actual timing depends on easing curve ("easeInOut")
- With easeInOut, 50% progress occurs around 400ms
- Keep timeout fallback: if 50% not reached by ENTER_DURATION + buffer, force navigation

### Files to Modify

| File | Change |
|------|--------|
| `src/state/providers/TransitionProvider/types.ts` | Add `canAnimate`, callback types |
| `src/state/providers/TransitionProvider/index.tsx` | Progress-based navigation, 50% trigger |
| `src/ui/molecules/TransitionEffect/index.jsx` | Add onUpdate to dark curtain |
| `src/state/providers/TransitionProvider/__tests__/TransitionProvider.test.tsx` | New tests |

### Library Versions

| Library | Version | Notes |
|---------|---------|-------|
| framer-motion | ^10.18.0 | onUpdate callback for progress tracking |
| next | ^14.2.33 | App Router |
| react | ^18.3.1 | Context, hooks, refs |

### References

- [Source: _bmad-output/planning-artifacts/epics-v2.md#Epic-13] - FR13.8, FR13.9, FR13.10
- [Source: _bmad-output/implementation-artifacts/13-3-curtain-exit-animation.md] - Previous story context
- [Source: src/state/providers/TransitionProvider/index.tsx] - Current implementation
- [Source: src/ui/molecules/TransitionEffect/index.jsx] - Curtain animation

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with comprehensive context from Story 13.3 | SM Agent |

### File List

