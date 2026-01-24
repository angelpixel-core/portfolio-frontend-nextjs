# Story 0: Technical Sanitation

**Status:** ready-for-dev
**Branch:** story/0-technical-sanitation
**Source:** Epic 1 Retrospective (2026-01-24)
**Timebox:** 1-2 sessions maximum

---

## Story

As a **developer**,
I want **to resolve accumulated technical debt before starting Epic 2**,
So that **new features aren't slowed down by recurring issues**.

---

## Context

This story was created as an outcome of the Epic 1 Retrospective. The team identified debt that appeared in 2+ stories, triggering the new **2-Story Debt Escalation Rule**:

> "If debt appears in 2+ stories, it stops being 'documented debt' and becomes 'mandatory technical story'."

---

## Acceptance Criteria

### AC1: Legacy Test Failures Resolved

**Given** the pre-existing test failures in Menu.test.tsx and MenuFloatingClient.test.tsx
**When** I run `npm test`
**Then** these tests pass (or are explicitly removed with documented rationale)
**And** no new test failures are introduced

### AC2: Framer Motion Mocks Normalized

**Given** framer-motion mocks are duplicated across 4+ test files
**When** I check the test utilities
**Then** a shared mock exists in `src/test-utils/`
**And** existing tests use the shared mock
**And** pattern is documented for future use

### AC3: Icon Accessibility Complete

**Given** only 10/52 icon components have `aria-hidden="true"`
**When** I audit all icon components
**Then** all 52 icons have `aria-hidden="true"` (decorative icons)
**And** no accessibility regressions occur

### AC4: All Quality Gates Pass

**Given** sanitation work is complete
**When** I run the CI pipeline
**Then** `npm run lint` passes
**And** `npm run typecheck` passes
**And** `npm test` passes with no failures

---

## Tasks / Subtasks

- [ ] **Task 1: Fix Menu.test.tsx Failures** (AC: #1, #4)
  - [ ] 1.1 Analyze current failure reason (mock timing, state, or assertion issue)
  - [ ] 1.2 Fix the root cause OR document why test should be removed
  - [ ] 1.3 Verify test passes in isolation: `npm test -- Menu.test.tsx`
  - [ ] 1.4 Atomic commit

- [ ] **Task 2: Fix MenuFloatingClient.test.tsx Failures** (AC: #1, #4)
  - [ ] 2.1 Analyze current failure reason
  - [ ] 2.2 Fix the root cause OR document why test should be removed
  - [ ] 2.3 Verify test passes in isolation
  - [ ] 2.4 Atomic commit

- [ ] **Task 3: Create Shared Framer Motion Mock** (AC: #2)
  - [ ] 3.1 Create `src/test-utils/framer-motion-mock.ts`
  - [ ] 3.2 Include motion components with forwardRef support
  - [ ] 3.3 Include useReducedMotion mock
  - [ ] 3.4 Include AnimatePresence mock
  - [ ] 3.5 Update existing tests to use shared mock (SocialNetworkLink, Skills, Floating, FloatingMobile, TransitionEffect)
  - [ ] 3.6 Atomic commit

- [ ] **Task 4: Add aria-hidden to Remaining Icons** (AC: #3)
  - [ ] 4.1 List all icon components in `src/ui/atoms/icons/`
  - [ ] 4.2 Identify icons already having aria-hidden (10 done)
  - [ ] 4.3 Add `aria-hidden="true"` to remaining 42 icons
  - [ ] 4.4 Verify no a11y regressions with jest-axe
  - [ ] 4.5 Atomic commit

- [ ] **Task 5: Final Validation** (AC: #4)
  - [ ] 5.1 Run `npm run lint` - must pass
  - [ ] 5.2 Run `npm run typecheck` - must pass
  - [ ] 5.3 Run `npm test` - must pass with 0 failures
  - [ ] 5.4 Document any items NOT completed (if timebox exceeded)

---

## Dev Notes

### Debt Items Being Addressed

| Item | Stories Affected | Priority |
|------|------------------|----------|
| Menu.test.tsx failures | 1.1, 1.2, 1.7, 1.8 | HIGH |
| MenuFloatingClient.test.tsx failures | 1.1, 1.7, 1.8 | HIGH |
| framer-motion mock duplication | 1.6, 1.7, 1.8 | MEDIUM |
| Icons missing aria-hidden | 1.7, 1.8 | MEDIUM |

### Known Test File Locations

```
src/ui/organisms/Menu/__tests__/Menu.test.tsx
src/ui/organisms/MenuFloating/__tests__/MenuFloatingClient.test.tsx
```

### Icon Components Location

```
src/ui/atoms/icons/
```

### Already Have aria-hidden (10 icons)

From Story 1.7:
- CopyIcon, CheckIcon, MoonIcon, SunIcon
- GitHubIcon, LinkedInIcon, TwitterIcon
- TelegramIcon, WhatsAppIcon, DribbbleIcon

### Framer Motion Mock Pattern (Reference)

```typescript
// src/test-utils/framer-motion-mock.ts
import React from "react";

const createMotionComponent = (tag: string) => {
  return React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
    ({ children, ...props }, ref) => {
      return React.createElement(tag, { ...props, ref }, children);
    }
  );
};

export const motion = {
  div: createMotionComponent("div"),
  span: createMotionComponent("span"),
  button: createMotionComponent("button"),
  a: createMotionComponent("a"),
  ul: createMotionComponent("ul"),
  li: createMotionComponent("li"),
  nav: createMotionComponent("nav"),
  header: createMotionComponent("header"),
  section: createMotionComponent("section"),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const useReducedMotion = () => false;
```

---

## Timebox Rules

**Maximum:** 2 sessions

**If timebox exceeded:**
1. Document what was completed
2. Document what remains with rationale
3. Create follow-up ticket if needed
4. DO NOT extend indefinitely

**Success criteria for partial completion:**
- At minimum, AC1 (test failures) must be resolved
- AC2, AC3 can be deferred if timebox exceeded
- Document decision clearly

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm test              # Jest unit tests (should have 0 failures)
```

### Before/After Metrics

| Metric | Before | Target After |
|--------|--------|--------------|
| Test failures | 2+ | 0 |
| framer-motion mock files | 4+ | 1 shared |
| Icons with aria-hidden | 10/52 | 52/52 |

---

## Manual Validation Checklist

> **OBLIGATORIO antes de merge**

### Pre-requisitos

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes with 0 failures

### Validation

- [ ] Menu component renders correctly in browser
- [ ] MenuFloating opens/closes correctly
- [ ] Icons don't announce in screen reader (aria-hidden working)
- [ ] No console errors

### Manual Validation Result

- **Date:** _pending_
- **Validated by:** _pending_
- **Result:** _pending_
- **Notes:** _pending_

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-24 | Story created from Epic 1 Retrospective | Claude Opus 4.5 |

### File List

**To Create:**
- `src/test-utils/framer-motion-mock.ts`

**To Modify:**
- `src/ui/organisms/Menu/__tests__/Menu.test.tsx`
- `src/ui/organisms/MenuFloating/__tests__/MenuFloatingClient.test.tsx`
- `src/ui/atoms/icons/*/index.jsx` (42 files)
- Various test files to use shared mock

**To Delete:**
- None expected
