# Story 13.4: 50% Trigger Synchronization

Status: done

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

- [x] **Task 1: Implement progress tracking via framer-motion onUpdate** (AC: 1)
  - [x] 1.1 Add `onUpdate` callback to dark curtain motion.div in TransitionEffect
  - [x] 1.2 Calculate progress as percentage of x position (0% at x:0%, 100% at x:100%)
  - [x] 1.3 Call `setProgress()` from TransitionProvider via new callback
  - [x] 1.4 Expose progress value in useTransition hook (already exists, verify working)
  - [x] 1.5 Only track progress during "entering" phase (not exiting)

- [x] **Task 2: Implement 50% trigger detection** (AC: 2)
  - [x] 2.1 Add `hasFiredFiftyPercent` ref to prevent multiple firings
  - [x] 2.2 Add `onFiftyPercent` callback to TransitionContextValue interface
  - [x] 2.3 In onUpdate, detect when progress crosses 50% threshold
  - [x] 2.4 Fire event exactly once per transition
  - [x] 2.5 Reset `hasFiredFiftyPercent` when transition ends (phase = "idle")

- [x] **Task 3: Delay navigation until 50% trigger** (AC: 3)
  - [x] 3.1 Remove current setTimeout-based navigation in startTransition
  - [x] 3.2 Move `router.push(href)` to be called when 50% is reached
  - [x] 3.3 Transition to "covering" phase at 50% (not after ENTER_DURATION timeout)
  - [x] 3.4 Keep timeout fallback in case animation callbacks fail
  - [x] 3.5 Verify animation continues smoothly after navigation fires

- [x] **Task 4: Add canAnimate flag for page components** (AC: 4)
  - [x] 4.1 Add `canAnimate: boolean` to TransitionState interface
  - [x] 4.2 Set `canAnimate = false` at start of transition
  - [x] 4.3 Set `canAnimate = true` when 50% trigger fires
  - [x] 4.4 Reset `canAnimate = false` on transition end
  - [x] 4.5 Document usage pattern for page components

- [x] **Task 5: Add optional onFiftyPercent callback registration** (AC: 5)
  - [x] 5.1 Add `registerFiftyPercentCallback` function to context
  - [x] 5.2 Store registered callbacks in ref array
  - [x] 5.3 Call all registered callbacks when 50% trigger fires
  - [x] 5.4 Add `unregisterFiftyPercentCallback` for cleanup
  - [x] 5.5 Document usage pattern for data fetching

- [x] **Task 6: Unit tests for progress tracking and 50% trigger** (AC: 1-6)
  - [x] 6.1 Test progress updates during entering phase
  - [x] 6.2 Test 50% trigger fires exactly once
  - [x] 6.3 Test navigation occurs at 50% point
  - [x] 6.4 Test canAnimate flag state transitions
  - [x] 6.5 Test callback registration and invocation
  - [x] 6.6 Test progress reset between transitions

### Review Follow-ups (AI)
- [ ] [AI-Review][LOW] Replace console.error with proper logging system [src/state/providers/TransitionProvider/index.tsx:165]
- [ ] [AI-Review][LOW] Replace console.warn with proper logging system [src/state/providers/TransitionProvider/index.tsx:351-352]

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
// In TransitionEffect - dark curtain reports progress
const handleDarkCurtainUpdate = (latest) => {
  if (phase !== "entering") return;
  const xValue = latest.x;
  if (typeof xValue === "string") {
    const progress = parseFloat(xValue);
    if (!isNaN(progress)) {
      onProgressUpdate?.(progress); // Calls TransitionProvider
    }
  }
};

<motion.div
  animate={{ x: "100%" }}
  onUpdate={handleDarkCurtainUpdate}
/>

// In TransitionProvider - onProgressUpdate handles 50% trigger
const onProgressUpdate = (progress) => {
  if (state.phase !== "entering") return;
  setProgress(progress);
  if (progress >= 50 && !hasFiredFiftyPercentRef.current) {
    hasFiredFiftyPercentRef.current = true;
    setState(prev => ({ ...prev, phase: "covering", canAnimate: true }));
    router.push(state.targetHref);
    fiftyPercentCallbacksRef.current.forEach(cb => cb());
  }
};
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
Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References
- Initial tests RED: 12 new tests for Story 13.4 features failed as expected
- GREEN: All 31 TransitionProvider tests pass after implementation
- All 59 transition-related tests pass

### Completion Notes List
- Task 1: Implemented `onProgressUpdate` in TransitionProvider and `handleDarkCurtainUpdate` in TransitionEffect
- Task 2: Added `hasFiredFiftyPercentRef` ref, detects 50% threshold crossing, fires exactly once per transition
- Task 3: Navigation moved from timeout-based to progress-based at 50%, timeout kept as fallback
- Task 4: Added `canAnimate` boolean to TransitionState, set true at 50%, reset on transition end
- Task 5: Added `registerFiftyPercentCallback` and `unregisterFiftyPercentCallback` with ref array storage
- Task 6: 12 new unit tests covering all ACs (progress tracking, 50% trigger, navigation sync, canAnimate, callbacks, reset)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with comprehensive context from Story 13.3 | SM Agent |
| 2026-01-29 | Implementation complete - all 6 tasks, 6 ACs satisfied | Dev Agent |
| 2026-01-29 | Code Review: Added usage documentation for canAnimate and registerFiftyPercentCallback, updated Dev Notes examples, created 2 LOW action items for logging | Review Agent |

### File List

**Modified:**
- `src/state/providers/TransitionProvider/types.ts` - Added `canAnimate`, `FiftyPercentCallback`, `onProgressUpdate`, `registerFiftyPercentCallback`, `unregisterFiftyPercentCallback`
- `src/state/providers/TransitionProvider/index.tsx` - Progress-based navigation, 50% trigger, callback system
- `src/state/providers/TransitionProvider/TransitionContext.ts` - Default values for new context properties
- `src/state/providers/TransitionProvider/__tests__/TransitionProvider.test.tsx` - 12 new tests for Story 13.4
- `src/ui/molecules/TransitionEffect/index.jsx` - Added `onUpdate` callback to dark curtain for progress tracking

