# Story 13.3: Curtain Exit Animation (Right→Left)

Status: done

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

- [x] **Task 3: Extensions visibility via z-index stacking** (AC: 3, ADR-13.3-002)
  - [x] 3.1 All curtains animate to x:100% during "entering" (pink z-30 covers others visually)
  - [x] 3.2 All curtains stay at x:100% during "covering" phase while page changes
  - [x] 3.3 During "exiting": all three go to x: 0% with cascade delays (0, 0.1, 0.2s)
  - [x] 3.4 **Decision (ADR):** Z-index stacking achieves "only pink visible during entry" requirement

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
  - [x] 6.5 Created TransitionEffect.exitAnimation.test.tsx (10 tests)

### Review Follow-ups (AI)
- [ ] [AI-Review][LOW] Replace console.warn with proper logging system [src/state/providers/TransitionProvider/index.tsx:178-179]

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
- **Decision:** All curtains animate to `x: 100%` during "entering", but pink (z-30) covers white/dark visually
- During "covering": all stay at x:100% while page changes behind
- During "exiting": all cascade to x:0% with staggered delays, creating "peeling away" effect
- Implementation: z-index stacking (pink z-30 > white z-20 > dark z-10) achieves AC3 requirement

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

### Final Implementation

```jsx
// TransitionEffect - getAnimateState (no parameter needed)
const getAnimateState = () => {
  if (phase === "entering") return { x: "100%" };  // All cover (pink on top)
  if (phase === "covering") return { x: "100%" };  // All stay covering
  if (phase === "exiting") return { x: "0%" };     // All reveal with cascade
  return { x: "0%" };
};

// Cascade delays for staggered effect
const getCascadeDelay = (curtainIndex) => {
  if (phase === "entering" || phase === "exiting") {
    return curtainIndex * 0.1;  // 0, 0.1, 0.2s
  }
  return 0;
};

// Curtain widths for visible extensions during exit
// Pink: w-screen (100vw), White: w-[120vw], Dark: w-[140vw]

// TransitionProvider - Timeout fallback on "covering" phase (ADR-13.3-003)
useEffect(() => {
  if (state.phase === "covering") {
    const fallback = setTimeout(() => {
      console.warn("[TransitionProvider] Covering timeout - forcing idle");
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
| 2026-01-29 | Added "covering" phase, env var config, extension widths | Dev Agent |
| 2026-01-29 | Code Review: Updated File List, ADR-13.3-002, Task 3 docs; added 1 LOW action item | Review Agent |

### File List

**Modified:**
- `src/ui/molecules/TransitionEffect/index.jsx` - Exit animation, cascade delays, extension widths (w-screen, w-[120vw], w-[140vw])
- `src/ui/molecules/TransitionEffect/styles.css` - Removed w-screen from base class (now per-curtain)
- `src/state/providers/TransitionProvider/index.tsx` - "covering" phase, env var config, timeout fallback
- `src/state/providers/TransitionProvider/types.ts` - Added "covering" to TransitionPhase type
- `src/state/providers/TransitionProvider/__tests__/TransitionProvider.test.tsx` - covering phase tests
- `.env.template` - Added NEXT_PUBLIC_TRANSITION_PAUSE_MS documentation

**Created:**
- `src/ui/molecules/TransitionEffect/__tests__/TransitionEffect.exitAnimation.test.tsx` - 10 tests for exit animation
