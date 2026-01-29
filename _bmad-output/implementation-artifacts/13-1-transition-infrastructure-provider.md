# Story 13.1: Transition Infrastructure & Provider

Status: done

## Story

As a **developer**,
I want a **centralized transition system provider** that orchestrates page transitions with state management and interaction blocking,
so that **all pages share consistent transition behavior and animations can be synchronized to specific trigger points**.

## Acceptance Criteria

### AC1: TransitionProvider exists and wraps the app
**Given** the application renders
**When** I inspect the component tree
**Then** a `TransitionProvider` wraps children inside `RootProvider`
**And** it provides transition state via React Context

### AC2: Transition state is accessible
**Given** any component within the app
**When** it calls `useTransition()` hook
**Then** it receives: `{ isTransitioning, phase, progress, startTransition }`
**And** phase is one of: `'idle' | 'entering' | 'exiting'`

### AC3: startTransition triggers navigation
**Given** a navigation event (menu click, logo click, link click)
**When** `startTransition(href)` is called
**Then** transition state changes to `isTransitioning: true`
**And** phase progresses: `idle → entering → exiting → idle`
**And** actual Next.js navigation occurs at the appropriate phase

### AC4: Interaction blocking during transition
**Given** `isTransitioning` is true
**When** user attempts click, hover, scroll, or focus
**Then** interactions are blocked via CSS `pointer-events: none`
**And** scroll is locked on body

### AC5: Existing TransitionEffect integrates with provider
**Given** the existing `TransitionEffect` component
**When** transition is triggered
**Then** it renders the 3-layer curtain animation as before
**And** animation phases are coordinated with provider state

### AC6: Reduced motion support preserved
**Given** user has `prefers-reduced-motion: reduce`
**When** a transition is triggered
**Then** no visual animation plays (instant transition)
**And** navigation still occurs correctly

## Tasks / Subtasks

- [x] **Task 1: Create TransitionContext and Provider** (AC: 1, 2)
  - [x] 1.1 Create `src/state/providers/TransitionProvider/index.tsx`
  - [x] 1.2 Define TypeScript types for transition state
  - [x] 1.3 Create `TransitionContext` with default values
  - [x] 1.4 Implement `TransitionProvider` component with state management
  - [x] 1.5 Export from `src/state/providers/index.js`

- [x] **Task 2: Create useTransition hook** (AC: 2)
  - [x] 2.1 Create `src/hooks/ui/useTransition.ts`
  - [x] 2.2 Implement context consumer with error boundary
  - [x] 2.3 Export from `src/hooks/index.js`

- [x] **Task 3: Implement startTransition logic** (AC: 3)
  - [x] 3.1 Add `startTransition(href: string)` to provider
  - [x] 3.2 Implement phase state machine: idle → entering → exiting → idle
  - [x] 3.3 Integrate with Next.js router for actual navigation
  - [x] 3.4 Handle timing coordination (navigation at correct phase)

- [x] **Task 4: Implement interaction blocking** (AC: 4)
  - [x] 4.1 Add CSS class to body during transition (`transition-active`)
  - [x] 4.2 Create styles for pointer-events blocking
  - [x] 4.3 Implement scroll lock during transition
  - [x] 4.4 Ensure blocking applies to entire viewport

- [x] **Task 5: Integrate with existing TransitionEffect** (AC: 5)
  - [x] 5.1 Refactor `AnimatedChildren` to use new provider
  - [x] 5.2 Connect `TransitionEffect` animation to provider phases
  - [x] 5.3 Ensure backward compatibility with existing behavior

- [x] **Task 6: Preserve reduced motion support** (AC: 6)
  - [x] 6.1 Pass `shouldReduceMotion` through context
  - [x] 6.2 Skip animation phases when reduced motion enabled
  - [x] 6.3 Test with system preference enabled

- [x] **Task 7: Add unit tests** (AC: 1-6)
  - [x] 7.1 Test TransitionProvider renders children
  - [x] 7.2 Test useTransition returns correct state
  - [x] 7.3 Test phase transitions
  - [x] 7.4 Test reduced motion behavior

## Dev Notes

### Existing Infrastructure Analysis

**Current Implementation:**
- `TransitionEffect` component exists at `src/ui/molecules/TransitionEffect/index.jsx`
- Uses 3 motion.div layers (primary/pink, white, dark) - MATCHES UX SPEC
- Already respects `prefers-reduced-motion` via `useReducedMotion` hook
- Wrapped by `AnimatedChildren` which uses `AnimatePresence`
- Animation currently: right-to-left swipe (100% → 0%)

**Gap Analysis vs UX Spec:**
| UX Spec Requirement | Current State | Story 13.1 Scope |
|---------------------|---------------|------------------|
| 3-layer curtain | ✅ Exists | Preserve |
| Entry: Left→Right (0%→100%) | ❌ Current is Right→Left | Story 13.2 |
| Exit: Right→Left with cascade | ❌ No cascade timing | Story 13.3 |
| 50% trigger sync | ❌ Not implemented | Story 13.4 |
| Interaction blocking | ❌ Not implemented | ✅ THIS STORY |
| State management | ❌ Not centralized | ✅ THIS STORY |

### Architecture Decisions

**Provider Location:** `src/state/providers/TransitionProvider/`
- Follows existing pattern (ReduxProvider, ThemeProvider, ReactQueryProvider)
- Must be inside RootProvider tree (needs Redux/React Query access potentially)

**State Shape:**
```typescript
interface TransitionState {
  isTransitioning: boolean;
  phase: 'idle' | 'entering' | 'exiting';
  progress: number; // 0-100, for 50% trigger sync (Story 13.4)
  targetHref: string | null;
}

interface TransitionContextValue extends TransitionState {
  startTransition: (href: string) => void;
  shouldReduceMotion: boolean;
}
```

**Integration Point:**
```jsx
// src/providers/RootProvider/index.jsx (updated)
<ReduxProvider>
  <ReactQueryProvider>
    <ThemeProvider>
      <TransitionProvider>  {/* NEW */}
        {children}
      </TransitionProvider>
    </ThemeProvider>
  </ReactQueryProvider>
</ReduxProvider>
```

### Library Versions

| Library | Version | Notes |
|---------|---------|-------|
| framer-motion | ^10.18.0 | Already installed, use AnimatePresence |
| next | 14.2.33 | Use `useRouter` from `next/navigation` |
| react | 18.3.1 | Use React Context API |

### File Structure

```
src/
├── state/providers/
│   ├── TransitionProvider/
│   │   ├── index.tsx           # Provider component
│   │   ├── TransitionContext.ts # Context definition
│   │   └── types.ts            # TypeScript types
│   └── index.js                # Add export
├── hooks/
│   └── ui/
│       └── useTransition.ts    # Consumer hook
└── styles/
    └── globals.css             # Add .transition-active styles
```

### Critical Implementation Notes

1. **DO NOT break existing navigation** - This story adds infrastructure, animations change in 13.2-13.3
2. **Preserve router.asPath key** - AnimatedChildren uses this for AnimatePresence
3. **TypeScript strict** - New files must be .tsx/.ts with proper types
4. **Test file co-location** - Tests in `__tests__/` folder next to component

### Scroll Lock Implementation

```css
/* globals.css */
body.transition-active {
  overflow: hidden;
  pointer-events: none;
}

body.transition-active * {
  pointer-events: none !important;
}
```

### References

- [Source: _bmad-output/implementation-artifacts/ux-design-behavior/spec-[curated].md#1.1-Alcance]
- [Source: _bmad-output/planning-artifacts/epics-v2.md#Epic-13]
- [Source: src/ui/molecules/TransitionEffect/index.jsx] - Existing implementation
- [Source: src/ui/molecules/AnimatedChildren/index.jsx] - Current wrapper
- [Source: src/providers/RootProvider/index.jsx] - Provider tree structure

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- All 12 unit tests pass for TransitionProvider
- Lint passes with 0 errors/warnings
- E2E tests pass (14/15, 1 skipped)
- Pre-existing test failures in Skills and Experience (unrelated - stale test expectations)

### Completion Notes List

- Created TransitionProvider with full TypeScript types
- Implemented phase state machine: idle → entering → exiting → idle
- Added interaction blocking via CSS class on body
- Integrated with existing AnimatedChildren and TransitionEffect
- Added global jest mock for next/navigation to support tests using RootProvider
- Reduced motion support bypasses animation and navigates instantly

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with full context analysis | SM Agent |
| 2026-01-29 | Implemented TransitionProvider, useTransition hook, interaction blocking, tests | Dev Agent |

### File List

**New Files:**
- src/state/providers/TransitionProvider/index.tsx
- src/state/providers/TransitionProvider/TransitionContext.ts
- src/state/providers/TransitionProvider/types.ts
- src/state/providers/TransitionProvider/__tests__/TransitionProvider.test.tsx
- src/hooks/ui/useTransition.ts

**Modified Files:**
- src/state/providers/index.js (added TransitionProvider export)
- src/hooks/ui/index.js (added useTransition export)
- src/providers/RootProvider/index.jsx (wrapped children with TransitionProvider)
- src/ui/molecules/AnimatedChildren/index.jsx (integrated with useTransition)
- src/styles/globals.css (added .transition-active styles)
- jest.setup.js (added global next/navigation mock)
