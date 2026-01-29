# Story 13.3: Curtain Exit Animation (Right→Left)

Status: review

## Story

As a **user completing a page navigation**,
I want the **transition curtain to reveal the new page with a cascading Right→Left animation**,
so that **the page transition feels complete and polished, with the three-layer curtain effect creating visual depth and brand identity**.

## Acceptance Criteria

### AC1: Exit animation direction is Right→Left
**Given** the entering phase has completed and phase is "exiting"
**When** the exit animation begins
**Then** the curtains animate from x: 100% (covering screen) to x: 0% (off-screen left)
**And** the animation reveals the new page progressively from right to left
**And** the animation direction is visually "right to left"

### AC2: Three-layer cascade effect during exit
**Given** the exit animation is in progress
**When** the curtains reveal the page
**Then** the pink curtain (z-30) exits FIRST
**Then** the white curtain (z-20) exits with a delay
**Then** the dark curtain (z-10) exits with a longer delay
**And** this creates a visual "peeling away" cascade effect

### AC3: Extensions only visible during exit
**Given** a page transition is in progress
**When** the entering phase is active
**Then** ONLY the pink curtain is visually prominent
**When** the exiting phase is active
**Then** all three curtains (pink, white, dark) become visible as they cascade

### AC4: Extensions never fully visible simultaneously
**Given** the exit animation with cascade is running
**When** the curtains are animating
**Then** the white and dark extensions are revealed progressively
**And** they are never fully visible at the same time as the pink curtain

### AC5: Transition completes to idle after exit
**Given** the exit animation has completed
**When** all three curtains have exited the viewport
**Then** the phase transitions to "idle"
**And** the new page is fully visible
**And** user interaction is restored

### AC6: Timing coordination with TransitionProvider
**Given** the TransitionProvider controls phase transitions
**When** phase changes from "entering" to "exiting"
**Then** the exit animation begins immediately
**And** the exit animation duration is coordinated with EXIT_DURATION (800ms)

## Tasks / Subtasks

- [x] **Task 1: Implement exit animation for pink curtain** (AC: 1)
  - [x] 1.1 Modify `getAnimateState()` to return `{ x: "0%" }` when phase is "exiting"
  - [x] 1.2 Pink curtain animates from x: 100% to x: 0% (Right→Left)
  - [x] 1.3 Duration: 0.8s, ease: "easeInOut"
  - [x] 1.4 Verify animation direction visually in browser

- [x] **Task 2: Add cascade delays for white and dark curtains during exit** (AC: 2, 4)
  - [x] 2.1 White curtain: delay 0.1s after pink starts exiting
  - [x] 2.2 Dark curtain: delay 0.2s after pink starts exiting
  - [x] 2.3 Each curtain takes 0.8s to exit
  - [x] 2.4 Total cascade duration: ~1.0s (0.8s + 0.2s stagger)

- [x] **Task 3: Hide white/dark during entering phase** (AC: 3, ADR-13.3-002)
  - [x] 3.1 Modify `getAnimateState()` to accept curtain index parameter
  - [x] 3.2 During "entering": only pink (index 0) goes to x: 100%, others stay at x: 0%
  - [x] 3.3 During "exiting": all three go to x: 0% with cascade delays
  - [x] 3.4 **Decision (ADR):** Extensions stay invisible during entry, cascade during exit

- [x] **Task 4: Coordinate timing with TransitionProvider** (AC: 5, 6)
  - [x] 4.1 Keep `exit={{ opacity: 0 }}` as AnimatePresence cleanup (not exit animation)
  - [x] 4.2 Phase transitions: entering → exiting → idle (working via pathname check)
  - [x] 4.3 Idle transition happens when pathname === targetHref
  - [x] 4.4 Timeout fallback deferred to Task 5 (ADR-13.3-003)

- [x] **Task 5: Implement timeout fallback for stuck transitions** (ADR-13.3-003)
  - [x] 5.1 Add `EXIT_FALLBACK_TIMEOUT = EXIT_DURATION + 500` constant (1300ms)
  - [x] 5.2 Add useEffect that starts timeout when phase becomes "exiting"
  - [x] 5.3 Timeout forces state to idle if still exiting after deadline
  - [x] 5.4 Clear timeout on cleanup when phase changes

- [x] **Task 6: Update unit tests** (AC: 1-6, ADR-13.3-003)
  - [x] 6.1 Test exit animation renders when phase is "exiting"
  - [x] 6.2 Test cascade delays are applied correctly
  - [x] 6.3 Test phase transitions to idle after exit
  - [x] 6.4 Test timeout fallback triggers on stuck transition
  - [x] 6.5 Created TransitionEffect.exitAnimation.test.tsx (7 tests)

## Dev Notes

### Elicitation Analysis (Pre-implementation)

#### Pre-mortem Analysis (Risk Prevention)

| Failure Mode | Root Cause | Prevention |
|--------------|------------|------------|
| Double-click navega dos veces | Second `startTransition()` fires while exit runs | Guard exists: `if (state.isTransitioning) return;` |
| Cortinas quedan pegadas | `phase` nunca llega a "idle" | **Add timeout fallback** (ADR-13.3-003) |
| Exit sin Entry previo | Direct URL → navigate | Covered: `isInitialLoad` prevents animation |
| Cascade desincronizado | Browser lag | Use framer-motion `delay` (GPU accelerated) |
| Back/Forward browser | popstate bypasses `startTransition()` | **Accept:** instant navigation without animation |

#### What-If Scenarios (Edge Cases)

| Scenario | Expected Behavior | Notes |
|----------|-------------------|-------|
| Double-click rápido | Second ignored | `isTransitioning` guard |
| Back/Forward | Instant navigation, no animation | popstate not intercepted |
| Same route click | No action | `href === pathname` guard |
| Click during entering/exiting | Ignored | `isTransitioning` guard |
| Navigation error | **Timeout fallback → idle** | NEW: Must implement |
| Slow route (Suspense) | Exit waits for pathname | Timeout as safety net |

#### Architecture Decision Records

**ADR-13.3-001: Same State Machine**
- Exit uses existing `phase` state machine
- No separate exit state needed
- Single source of truth prevents race conditions

**ADR-13.3-002: Extensions Visibility**
- **Decision:** White/dark stay at `x: 0%` during "entering"
- Only pink animates during entry
- All three cascade during exit
- Implementation: conditional `getAnimateState()` per curtain

**ADR-13.3-003: Timeout Fallback**
- **Decision:** Add fallback timeout for stuck transitions
- Trigger: `EXIT_DURATION + 500ms` without pathname change
- Action: Force reset to idle
- Prevents permanent stuck state on navigation errors

---

### Previous Story Learnings (Story 13.2)

**Key fixes applied:**
- Use SAME keys for curtains across phases to prevent AnimatePresence flash
- `pathname === targetHref` check before transitioning to idle
- Exit via `opacity: 0, duration: 0` was a temporary placeholder for this story

**CSS positioning context (CRITICAL):**
```css
.transition-effect_blade {
  @apply fixed top-0 bottom-0 right-full w-screen h-screen;
}
```

With `right-full` (right: 100%):
- `x: 0%` = blade is off-screen to the LEFT (invisible)
- `x: 100%` = blade covers the screen (visible)

**Animation directions:**
- Entry (Left→Right, covers): `x: 0%` → `x: 100%`
- Exit (Right→Left, reveals): `x: 100%` → `x: 0%`

### Current Code State (Start of Story 13.3)

```jsx
// TransitionEffect/index.jsx - Current
const getAnimateState = () => {
  if (phase === "entering") return { x: "100%" };
  if (phase === "exiting") return { x: "100%" };  // ← CHANGE THIS
  return { x: "0%" };
};

// Current: exit={{ opacity: 0, transition: { duration: 0 } }}
// This was temporary - replace with actual exit animation
```

### Target Implementation (ADR-aligned)

```jsx
// TransitionEffect - getAnimateState per curtain (ADR-13.3-002)
const getAnimateState = (curtainIndex) => {
  if (phase === "entering") {
    // Only pink (index 0) covers screen, others stay hidden
    return curtainIndex === 0 ? { x: "100%" } : { x: "0%" };
  }
  if (phase === "exiting") {
    return { x: "0%" };  // All reveal (cascade via delays)
  }
  return { x: "0%" };
};

// Exit animation cascade delays
const getExitDelay = (curtainIndex) => {
  if (phase !== "exiting") return 0;
  return curtainIndex * STAGGER_DELAY;  // 0, 0.1, 0.2
};

// TransitionProvider - Timeout fallback (ADR-13.3-003)
const EXIT_FALLBACK_TIMEOUT = TRANSITION_TIMING.EXIT_DURATION + 500;

useEffect(() => {
  if (state.phase === "exiting") {
    const fallback = setTimeout(() => {
      console.warn("[TransitionProvider] Exit timeout - forcing idle");
      setState({ isTransitioning: false, phase: "idle", progress: 0, targetHref: null });
    }, EXIT_FALLBACK_TIMEOUT);
    return () => clearTimeout(fallback);
  }
}, [state.phase]);
```

### Timing Coordination

**Current TransitionProvider timing:**
```
ENTER_DURATION: 800ms
PAUSE_AT_FULL: 100ms
EXIT_DURATION: 800ms (defined but not yet used for animation)
```

**Sequence:**
1. entering phase starts → pink covers L→R (800ms)
2. pause at full (100ms)
3. router.push() called
4. phase = "exiting" → cascade reveals R→L (~1000ms with stagger)
5. pathname changes → phase = "idle"

**Issue to consider:** Currently, phase goes to "idle" when pathname changes. But the exit animation might not be complete. Options:
1. Let animation complete naturally (AnimatePresence handles cleanup)
2. Add onAnimationComplete callback to TransitionEffect
3. Adjust timing so animation always completes before pathname change

### Extensions Behavior Decision

**Spec says:** "Las extensiones SOLO aparecen en la retirada, NUNCA durante la ida"

**Options:**
1. **Hide during entry:** White/dark curtains don't render or stay at x: 0% during entering
2. **Behind pink:** All 3 animate together in entry, but pink is on top (z-30) so others aren't visible

**Recommendation:** Option 1 is cleaner - only render white/dark during "exiting" phase, or keep them at x: 0% during entering so they're invisible.

### Library Versions

| Library | Version | Notes |
|---------|---------|-------|
| framer-motion | ^10.18.0 | AnimatePresence, motion components |
| next | ^14.2.33 | App Router |
| react | ^18.3.1 | Context, hooks |

### Files to Modify

| File | Change |
|------|--------|
| `src/ui/molecules/TransitionEffect/index.jsx` | Exit animation logic |
| `src/ui/molecules/TransitionEffect/__tests__/*.tsx` | Update/add tests |
| `src/state/providers/TransitionProvider/index.tsx` | Possible timing adjustments |

### References

- [Source: _bmad-output/planning-artifacts/epics-v2.md#Epic-13]
- [Source: _bmad-output/implementation-artifacts/13-2-curtain-entry-animation.md]
- [Source: src/ui/molecules/TransitionEffect/index.jsx] - Current implementation
- [Source: src/state/providers/TransitionProvider/index.tsx] - Timing control

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References
- Initial tests showed 4 failures (RED phase confirmed)
- All 25 transition-related tests pass after implementation
- Lint passes with 0 errors after adding React import

### Completion Notes List
- Task 1: Implemented `getAnimateState(curtainIndex)` with phase-aware logic
- Task 2: Added `getExitDelay(curtainIndex)` for cascade delays (0, 0.1, 0.2s)
- Task 3: Extensions (white/dark) stay at x:0% during entering, only pink animates
- Task 4: Timing coordination verified - pathname check triggers idle transition
- Task 5: Added EXIT_FALLBACK_TIMEOUT (1300ms) with useEffect in TransitionProvider
- Task 6: Created TransitionEffect.exitAnimation.test.tsx with 7 tests
- All 6 ACs satisfied, 3 ADRs implemented

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with context from Story 13.2 completion | SM Agent |
| 2026-01-29 | Advanced Elicitation: Pre-mortem, What-If, ADRs applied | SM Agent |
| 2026-01-29 | Added Task 5 (timeout fallback), Task 6 (tests), updated Task 3 | SM Agent |
| 2026-01-29 | Implementation complete - all tasks, tests pass | Dev Agent |

### File List

**Modified:**
- `src/ui/molecules/TransitionEffect/index.jsx` - Exit animation logic, getAnimateState per curtain
- `src/state/providers/TransitionProvider/index.tsx` - EXIT_FALLBACK_TIMEOUT, timeout fallback useEffect
- `src/state/providers/TransitionProvider/__tests__/TransitionProvider.test.tsx` - Timeout fallback tests

**Created:**
- `src/ui/molecules/TransitionEffect/__tests__/TransitionEffect.exitAnimation.test.tsx` - 7 tests for exit animation
