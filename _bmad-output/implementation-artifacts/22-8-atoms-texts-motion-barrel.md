# Story 22.8: Atoms — Texts, Motion Barrel — Batch H

Status: done

## Story

As a **developer maintaining this portfolio**,
I want **the atom components in texts/ and the motion/ barrel migrated from JSX/JS to TSX/TS with proper type annotations**,
so that **TypeScript strict mode catches type errors in these 13 foundational UI components at build time, resolving cross-batch latent errors from molecules that import ParagraphSkeleton and ActiveMark**.

## Acceptance Criteria

1. **AC1: File Rename** — All 13 files (11 `.jsx` + 2 `.js` barrels) renamed to `.tsx`/`.ts` via `git mv` with no broken imports.
2. **AC2: Type Annotations** — Each component has explicit return types, typed props interfaces (where applicable), typed hook generics, and typed function parameters.
3. **AC3: No Behavior Change** — Zero functional changes. Same JSX output, same exports, same runtime behavior.
4. **AC4: Validation Suite** — All 4 commands pass with zero NEW failures:
   - `npm run lint` (zero new warnings)
   - `npm run typecheck` (zero new errors vs baseline)
   - `npm test` (all tests pass — use `--no-cache` if needed)
   - `npm run build` (zero new build failures)
5. **AC5: No Forbidden Patterns** — Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. No refactoring, no import path changes.

## Tasks / Subtasks

- [x] **Task 1: Rename all 13 files** (AC: #1)
  - [x] 1.1 Create branch `migration/ts-batch-h-atoms-texts-motion`
  - [x] 1.2 `git mv` all 11 `.jsx` files to `.tsx` and 2 `.js` files to `.ts`
  - [x] 1.3 Run `npm run typecheck` — verify no resolution errors from rename
  - [x] 1.4 Commit: `refactor: rename Batch H files from .jsx/.js to .tsx/.ts` → `d1c492c`

- [x] **Task 2: Type trivial components — no-props and simple props (6 files)** (AC: #2, #3, #5)
  - [x] 2.1 `texts/ActiveMark/index.tsx` — `ActiveMarkProps { activePath: string }`
  - [x] 2.2 `texts/ActiveMarkFloating/index.tsx` — `ActiveMarkFloatingProps { activePath: string }`
  - [x] 2.3 `texts/ParagraphText/index.tsx` — `ParagraphTextProps { text: string; className?: string }`
  - [x] 2.4 `texts/ParagraphText/skeleton.tsx` — `ParagraphSkeletonProps { className?: string; lines?: number }`
  - [x] 2.5 `texts/AnimatedNumber/skeleton.tsx` — Added `React.JSX.Element` return type
  - [x] 2.6 `texts/CircularText/index.tsx` — `CircularTextProps extends React.SVGAttributes<SVGSVGElement>`

- [x] **Task 3: Type AnimatedNumber — framer-motion heavy (1 file)** (AC: #2, #3, #5)
  - [x] 3.1 `texts/AnimatedNumber/index.tsx` — `AnimatedNumberProps { value: number }`, `useRef<HTMLSpanElement>(null)`, consolidated react import

- [x] **Task 4: Type AnimatedTitle group — tightly coupled (4 files)** (AC: #2, #3, #5)
  - [x] 4.1 `texts/AnimatedTitle/index.tsx` — `AnimatedTitleProps { className?: string }`
  - [x] 4.2 `texts/AnimatedTitle/skeleton.tsx` — `SkeletonProps { className?: string }`
  - [x] 4.3 `texts/AnimatedTitle/Title.tsx` — `TitleProps { className: string }`
  - [x] 4.4 `texts/AnimatedTitle/MotionTitle.tsx` — `MotionTitleProps { title: string; className: string }`

- [x] **Task 5: Barrel files (2 files)** (AC: #1)
  - [x] 5.1 `texts/index.ts` — 5 re-exports verified (ActiveMark, AnimatedNumber, AnimatedTitle, CircularText, ParagraphText)
  - [x] 5.2 `motion/index.ts` — ArticleAppearance re-export verified

- [x] **Task 6: Commit types + validate** (AC: #4)
  - [x] 6.1 Commit: `feat(ts): add TypeScript annotations to Batch H — Atoms texts, motion barrel` → `b577370`
  - [x] 6.2 Run full validation: lint, typecheck, tests, build (code review: typecheck fix applied in `AnimatedNumber/index.tsx` — `value` → `String(value)` for `textContent`)

## Dev Notes

### Files to Migrate (13 files)

| # | File | Lines | Props | Key Challenge |
|---|------|-------|-------|---------------|
| 1 | `texts/index.js` | 5 | N/A | Barrel — 5 named re-exports |
| 2 | `texts/ActiveMark/index.jsx` | 24 | `{ activePath }` | `usePathname()`, `clsx`, `"use client"` |
| 3 | `texts/ActiveMarkFloating/index.jsx` | 24 | `{ activePath }` | Same as ActiveMark, different CSS |
| 4 | `texts/AnimatedNumber/index.jsx` | 37 | `{ value }` | **Complex FM:** useMotionValue, useSpring, useInView, useReducedMotion |
| 5 | `texts/AnimatedNumber/skeleton.jsx` | 4 | None | Trivial named export |
| 6 | `texts/CircularText/index.jsx` | 1120 | `{ className?, fillSvgColor?, ...rest }` | Large SVG, `React.SVGAttributes` rest props |
| 7 | `texts/ParagraphText/index.jsx` | 8 | `{ text, className? }` | Simple presentational |
| 8 | `texts/ParagraphText/skeleton.jsx` | 38 | `{ className?, lines? }` | Named `ParagraphSkeleton`, Array.from |
| 9 | `texts/AnimatedTitle/index.jsx` | 16 | `{ className? }` | Wrapper, imports Title |
| 10 | `texts/AnimatedTitle/Title.jsx` | 30 | `{ className }` | `useContent(1)` hook, `"use client"` |
| 11 | `texts/AnimatedTitle/MotionTitle.jsx` | 77 | `{ title, className }` | **Complex FM:** m.h1, m.span, useReducedMotion, useTransition |
| 12 | `texts/AnimatedTitle/skeleton.jsx` | 30 | `{ className? }` | Responsive skeleton |
| 13 | `motion/index.js` | 2 | N/A | Barrel — 1 re-export (ArticleAppearance already .tsx) |

### Files ALREADY TypeScript — NOT Migration Targets

| File | Reason |
|------|--------|
| `motion/ArticleAppearance/index.tsx` | Already `.tsx` |
| `motion/ArticleAppearance/ArticleAppearance.types.ts` | Already `.ts` |
| All `__tests__/*.test.tsx` | Test files |

### Migration Rules (CRITICAL — from `docs/architecture/typescript-migration.md`)

**DO:**
- Rename `.jsx` → `.tsx`, `.js` → `.ts`
- Add return type on all components and exported functions
- Add `import React from "react"` when using `React.JSX.Element` (ESLint `no-undef`)
- Add Props interface for components with props
- Preserve existing export patterns (default vs named vs function)
- Use `import type` for type-only imports
- Consolidate duplicate `import ... from "react"` into single import

**DO NOT:**
- Change component behavior or logic
- Refactor code structure or existing import paths
- Add `@ts-ignore`, `@ts-expect-error`, or `any`
- Change `export default` / `export const` patterns
- Add/remove features or fix bugs
- Change barrel file re-exports (Epic 23)

### Typing Patterns — File-Specific

**texts/ActiveMark/index.tsx and ActiveMarkFloating/index.tsx:**

```tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import "./styles.css";

interface ActiveMarkProps {
  activePath: string;
}

const ActiveMark = ({ activePath }: ActiveMarkProps): React.JSX.Element => {
  const pathname = usePathname();
  // ...unchanged...
};

export default ActiveMark;
```

**texts/AnimatedNumber/index.tsx — COMPLEX: Multiple framer-motion hooks:**

```tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

interface AnimatedNumberProps {
  value: number;
}

const AnimatedNumber = ({ value }: AnimatedNumberProps): React.JSX.Element => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  // ...unchanged...
};
```

NOTE: `useMotionValue(0)` returns `MotionValue<number>`. `useSpring` returns `MotionValue<number>`. `useInView` returns `boolean`. All inferred by TypeScript — no explicit generics needed. The `latest` variable from the `useEffect` onChange callback is `number`. Check if `.toFixed()` is called — if so, type is already `number`, no issues.

**texts/CircularText/index.tsx — Large SVG with rest props:**

```tsx
import React from "react";

interface CircularTextProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
  fillSvgColor?: string;
}

const CircularText = ({
  className = "",
  fillSvgColor = "",
  ...rest
}: CircularTextProps): React.JSX.Element => {
  // ...1100+ lines of SVG paths unchanged...
};
```

NOTE: `React.SVGAttributes<SVGSVGElement>` already includes `className`. The explicit `className?: string` is redundant but preserved for documentation clarity.

**texts/AnimatedTitle/MotionTitle.tsx — Complex variant animations:**

```tsx
"use client";

import React from "react";
import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import { useTransition } from "@/hooks/ui/useTransition";

interface MotionTitleProps {
  title: string;
  className: string;
}

const MotionTitle = ({ title, className }: MotionTitleProps): React.JSX.Element => {
  const shouldReduceMotion = useReducedMotion();
  const { isTransitioning } = useTransition();
  // ...unchanged — m.h1 and m.span with variants...
};
```

NOTE: The `variants` objects for framer-motion are plain JavaScript objects. TypeScript infers their types correctly from the object literals. Do NOT add explicit `Variants` type import — let TS infer.

**texts/AnimatedTitle/Title.tsx — useContent React Query hook:**

```tsx
"use client";

import React from "react";
import useContent from "@/domains/content/queries/useContent";

interface TitleProps {
  className: string;
}

const Title = ({ className }: TitleProps): React.JSX.Element => {
  const { data: content, isLoading, isError } = useContent(1);
  // ...unchanged — conditional rendering...
};
```

NOTE: `useContent(1)` is already typed from `@/domains/content/queries`. The return type includes `data`, `isLoading`, `isError`. No explicit typing needed for the destructured values.

**texts/ParagraphText/skeleton.tsx — Named export ParagraphSkeleton:**

```tsx
import React from "react";

interface ParagraphSkeletonProps {
  className?: string;
  lines?: number;
}

export const ParagraphSkeleton = ({
  className = "",
  lines = 4,
}: ParagraphSkeletonProps): React.JSX.Element => {
  // ...unchanged — Array.from({ length: lines }) pattern...
};
```

NOTE: This is a named export (`export const ParagraphSkeleton`), NOT default export. Preserve exactly.

### Export Pattern Diversity (CRITICAL)

| Pattern | Files |
|---------|-------|
| `export default ComponentName` | ActiveMark, ActiveMarkFloating, AnimatedNumber, CircularText, ParagraphText, AnimatedTitle/index, AnimatedTitle/Title, AnimatedTitle/MotionTitle, AnimatedTitle/skeleton |
| `export const ComponentName` | ParagraphSkeleton, AnimatedNumberSkeleton |
| Barrel re-exports | texts/index, motion/index |

**Preserve each pattern exactly.** Do NOT change `export const` to `export default` or vice versa. Note: AnimatedTitle/skeleton uses `export default function Skeleton` (default export, not named).

### Potential Latent Type Errors (Expected, Do NOT Fix)

1. **AnimatedTitle/Title.tsx**: Imports Skeleton from `./skeleton` and MotionTitle from `./MotionTitle` — both migrated in this batch, should resolve
2. **Paragraph/index.tsx** (upstream): Currently has TS2322 importing `ParagraphSkeleton` — this batch RESOLVES it
3. **AnimatedNumber/index.tsx**: Uses framer-motion hooks — all already typed, no issues expected

### Impact on Upstream Consumers

Migrating these atoms to `.tsx` will **resolve latent cross-batch errors**:
- `molecules/Paragraph/index.tsx` (TS2322) — imports `ParagraphSkeleton` from `atoms/texts/ParagraphText/skeleton` → **RESOLVED by this batch**
- `organisms/Skills/index.tsx` — imports `ActiveMark` → **RESOLVED by this batch**

### Story 22-1 through 22-7 Learnings (CRITICAL)

1. **`import React from "react"` IS NEEDED** — ESLint `no-undef` rule requires it when using `React.JSX.Element`
2. **Commit strategy**: First commit = renames only via `git mv`, second commit = type annotations
3. **Jest cache**: After rename, run `npm test -- --no-cache` if tests fail with "Cannot find module"
4. **Pre-existing errors**: Typecheck errors on branch are baseline. NOT from this batch
5. **`"use client"` directive**: MUST remain as first line where present
6. **Prettier line length**: If props destructuring exceeds 80 chars, expand to multiline format
7. **Latent typecheck errors**: Icons imported from `@/atoms/icons/*` are still `.jsx` — may produce type errors. Expected, resolves in Batch I
8. **`import type` for type-only imports**: Use when importing only types
9. **Non-null assertion `!`**: Acceptable for ref access where element existence is guaranteed by lifecycle
10. **Redundant useState generics**: Don't add `useState<boolean>` when initial value makes type inferrable
11. **Build failure baseline**: Pre-existing lint errors in story files cause `npm run build` to fail. AC4 means "zero NEW build failures"
12. **Duplicate react imports**: Consolidate into single `import React, { ... } from "react"` (review finding M1 from Story 22-6)
13. **`HTMLLIElement` not `HTMLLiElement`**: Capital I for `<li>` elements (Story 22-7 finding)
14. **`extends React.SVGAttributes<SVGSVGElement>`**: Use for SVG components with rest props (similar to HTMLAttributes pattern from Story 22-7)
15. **AnimatedTitle group**: 4 files tightly coupled — migrate together to avoid intermediate broken imports
16. **Menu.test.tsx failure**: Pre-existing from Batch B (constants.js→.ts rename). Run `npm test -- --no-cache` to clear Jest cache if it appears

### Anti-Patterns to Avoid

- Do NOT add `React.FC` or `React.FunctionComponent` — use explicit arrow functions (project convention)
- Do NOT use `any` — define proper types
- Do NOT change barrel file re-exports — that's Epic 23
- Do NOT add redundant useState generics — let TS infer
- Do NOT change framer-motion `m.div`/`m.h1`/`m.span` to `motion.*` — project uses LazyMotion pattern
- Do NOT change `export const` to `export default` or vice versa
- Do NOT add explicit `Variants` type to framer-motion variant objects — let TS infer
- Do NOT fix icon import type mismatches — those resolve in Batch I
- Do NOT consolidate barrel `export *` into named exports — that's Epic 23

### Recommended Task Execution Order

1. **Rename all 13 files** → commit
2. **Trivial + simple props** (6 files — ActiveMark pair, ParagraphText pair, AnimatedNumber skeleton, CircularText)
3. **AnimatedNumber** (1 file — complex framer-motion hooks)
4. **AnimatedTitle group** (4 files — tightly coupled, migrate together)
5. **Barrel verification** (already renamed in step 1)
6. **Validate + commit**

### Commit Strategy

Per `docs/architecture/typescript-migration.md` Section 4:
1. **First commit**: File renames only (`git mv`)
2. **Second commit**: Type annotations added
3. Branch: `migration/ts-batch-h-atoms-texts-motion`

### Project Structure Notes

- `texts/index.js` barrel has 5 named re-exports: ActiveMark, AnimatedNumber, AnimatedTitle, CircularText, ParagraphText
- `motion/index.js` barrel has 1 re-export: ArticleAppearance (already .tsx)
- ActiveMarkFloating is NOT in the texts barrel (imported directly)
- AnimatedTitle group: index imports Title, Title imports Skeleton and MotionTitle
- CircularText is 1120 lines but structurally trivial (SVG paths)

### References

- [Source: docs/architecture/typescript-migration.md#P4: Atoms (non-icons)] — Batch H file list
- [Source: docs/architecture/typescript-migration.md#3. Migration Rules] — DO/DO NOT rules
- [Source: docs/architecture/typescript-migration.md#4. Batch Definitions] — Commit strategy, ACs
- [Source: _bmad-output/implementation-artifacts/22-7-atoms-buttons-hocs-links-shadows.md] — Story 22-7 learnings and review fixes
- [Source: CLAUDE.md#Performance Anti-pattern] — Barrel import rules

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Commit `d1c492c`: Rename 13 files (.jsx→.tsx, .js→.ts) via git mv
- Commit `b577370`: Type annotations for 11 component files

### Completion Notes List

- All 11 component files typed with Props interfaces and React.JSX.Element return types
- `import React from "react"` added to all files (ESLint no-undef requirement)
- Consolidated react imports where useEffect/useRef existed (`AnimatedNumber/index.tsx`)
- Preserved all export patterns: default exports unchanged, named exports (ParagraphSkeleton, AnimatedNumberSkeleton) unchanged
- Preserved `"use client"` directives as first line in 5 files
- `CircularText` uses `extends React.SVGAttributes<SVGSVGElement>` for rest props
- `AnimatedNumber` uses `useRef<HTMLSpanElement>(null)` generic
- No `any`, no `@ts-ignore`, no `@ts-expect-error` used
- Barrel files (texts/index.ts, motion/index.ts) verified — no content changes needed
- JSDoc comment removed from ParagraphSkeleton (replaced by TypeScript interface)
- JSDoc comment removed from AnimatedTitle/skeleton (replaced by TypeScript interface)
- JSDoc comment removed from MotionTitle (replaced by TypeScript interface)
- Code review fix: `AnimatedNumber/index.tsx` line 24 — `ref.current.textContent = value` caused TS2322 (number not assignable to string); changed to `String(value)`
- Code review fix: `CircularText/index.tsx` — default `className = ""` in destructuring to avoid "circular-text undefined" in DOM when className omitted
- Validation (AC4): typecheck passes for Batch H after fix; tests 99 suites / 987 passed; lint and build have repo baseline failures (0 new failures from this batch)

### Change Log

| File | Change |
|------|--------|
| `texts/ActiveMark/index.tsx` | +`import React`, +`ActiveMarkProps`, +return type |
| `texts/ActiveMarkFloating/index.tsx` | +`import React`, +`ActiveMarkFloatingProps`, +return type |
| `texts/ParagraphText/index.tsx` | +`import React`, +`ParagraphTextProps`, +return type |
| `texts/ParagraphText/skeleton.tsx` | +`import React`, +`ParagraphSkeletonProps`, +return type, -JSDoc |
| `texts/AnimatedNumber/skeleton.tsx` | +`import React`, +return type |
| `texts/AnimatedNumber/index.tsx` | consolidated react import, +`AnimatedNumberProps`, +`useRef<HTMLSpanElement>`, +return type; code review: `textContent = String(value)` |
| `texts/CircularText/index.tsx` | +`import React`, +`CircularTextProps extends SVGAttributes`, +return type; code review: default `className = ""` |
| `texts/AnimatedTitle/index.tsx` | +`import React`, +`AnimatedTitleProps`, +return type |
| `texts/AnimatedTitle/skeleton.tsx` | +`import React`, +`SkeletonProps`, +return type, -JSDoc |
| `texts/AnimatedTitle/Title.tsx` | +`import React`, +`TitleProps`, +return type |
| `texts/AnimatedTitle/MotionTitle.tsx` | +`import React`, +`MotionTitleProps`, +return type, -JSDoc |

### File List

| # | File | Status |
|---|------|--------|
| 1 | `src/ui/atoms/texts/index.ts` | Renamed, verified |
| 2 | `src/ui/atoms/texts/ActiveMark/index.tsx` | Renamed + typed |
| 3 | `src/ui/atoms/texts/ActiveMarkFloating/index.tsx` | Renamed + typed |
| 4 | `src/ui/atoms/texts/AnimatedNumber/index.tsx` | Renamed + typed |
| 5 | `src/ui/atoms/texts/AnimatedNumber/skeleton.tsx` | Renamed + typed |
| 6 | `src/ui/atoms/texts/CircularText/index.tsx` | Renamed + typed |
| 7 | `src/ui/atoms/texts/ParagraphText/index.tsx` | Renamed + typed |
| 8 | `src/ui/atoms/texts/ParagraphText/skeleton.tsx` | Renamed + typed |
| 9 | `src/ui/atoms/texts/AnimatedTitle/index.tsx` | Renamed + typed |
| 10 | `src/ui/atoms/texts/AnimatedTitle/Title.tsx` | Renamed + typed |
| 11 | `src/ui/atoms/texts/AnimatedTitle/MotionTitle.tsx` | Renamed + typed |
| 12 | `src/ui/atoms/texts/AnimatedTitle/skeleton.tsx` | Renamed + typed |
| 13 | `src/ui/atoms/motion/index.ts` | Renamed, verified |

### Code Review (2026-02-14)

- **Typecheck fix:** `AnimatedNumber/index.tsx` — `textContent` requires string; `value` (number) now passed as `String(value)`.
- **M2 fix:** `CircularText/index.tsx` — default `className = ""` so optional prop does not render "undefined" in class.
- **H2/M1:** Task 6.2 marked complete; validation documented (tests 99/987 pass; typecheck green for Batch H; lint/build baseline may fail elsewhere).
- **L1:** Export table note: AnimatedTitle/skeleton is `export default function Skeleton`.
- **L2:** Change Log / Completion Notes updated with review fixes.
