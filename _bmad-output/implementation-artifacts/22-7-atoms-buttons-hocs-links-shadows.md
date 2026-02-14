# Story 22.7: Atoms — Buttons, HOCs, Links, Shadows — Batch G

Status: in-progress

## Story

As a **developer maintaining this portfolio**,
I want **the atom components in buttons (skeletons), hocs, links, and shadows migrated from JSX/JS to TSX/TS with proper type annotations**,
so that **TypeScript strict mode catches type errors in these 19 foundational UI components at build time, resolving cross-batch latent errors from molecules and organisms that import these atoms**.

## Acceptance Criteria

1. **AC1: File Rename** — All 19 files (16 `.jsx` + 3 `.js` barrels) renamed to `.tsx`/`.ts` via `git mv` with no broken imports.
2. **AC2: Type Annotations** — Each component has explicit return types, typed props interfaces (where applicable), typed hook generics, and typed function parameters.
3. **AC3: No Behavior Change** — Zero functional changes. Same JSX output, same exports, same runtime behavior.
4. **AC4: Validation Suite** — All 4 commands pass:
   - `npm run lint` (zero new warnings)
   - `npm run typecheck` (zero new errors)
   - `npm test` (all tests pass)
   - `npm run build` (zero new build failures)
5. **AC5: No Forbidden Patterns** — Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. No refactoring, no import path changes.

## Tasks / Subtasks

- [ ] **Task 1: Rename all 19 files** (AC: #1)
  - [ ] 1.1 Create branch `migration/ts-batch-g-atoms-buttons-hocs-links`
  - [ ] 1.2 `git mv` all 16 `.jsx` files to `.tsx` and 3 `.js` files to `.ts`
  - [ ] 1.3 Run `npm run typecheck` — verify no resolution errors from rename
  - [ ] 1.4 Commit: `refactor: rename Batch G files from .jsx/.js to .tsx/.ts`

- [ ] **Task 2: Type trivial components — skeletons and no-props (7 files)** (AC: #2, #3, #5)
  - [ ] 2.1 `buttons/ArrowButton/skeleton.tsx` — No props, add `React.JSX.Element` return type
  - [ ] 2.2 `buttons/NavigationItemButton/skeleton.tsx` — No props, add `React.JSX.Element` return type
  - [ ] 2.3 `shadows/FeaturedBoxShadow/index.tsx` — No props, named `export const`, add return type
  - [ ] 2.4 `hocs/History/skeleton.tsx` — Props: `{ children }`, named `export const`, add `HistorySkeletonProps`
  - [ ] 2.5 `hocs/TransitionerLi/skeleton.tsx` — Props: `{ data, children }`, named `export const`, add `TransitionerLiSkeletonProps`
  - [ ] 2.6 `links/NavigationItemLink/skeleton.tsx` — Props: `{ width }`, add `NavigationItemLinkSkeletonProps`
  - [ ] 2.7 All: add `import React from "react"` for `React.JSX.Element`

- [ ] **Task 3: Type simple prop components (5 files)** (AC: #2, #3, #5)
  - [ ] 3.1 `shadows/BoxShadow/index.tsx` — Props: `{ variant }` with `"default" | "list-item"` literal type, named `export const`
  - [ ] 3.2 `links/BaseLink/index.tsx` — Props: `{ href, target, text, className }`, uses Next.js `Link`
  - [ ] 3.3 `links/WhatsAppLink/index.tsx` — Props: `{ href, target, text, className }`, imports WhatsAppIcon
  - [ ] 3.4 `links/NavigationItemLink/index.tsx` — Props: `{ href, name, className, onClick? }`, uses TransitionLink + ActiveMark
  - [ ] 3.5 `links/ImageLink/index.tsx` — Props: `{ href, src, alt, size, className?, sizes? }`, uses Next.js Image + Link

- [ ] **Task 4: Type ImageLink skeleton — complex className logic (1 file)** (AC: #2, #3, #5)
  - [ ] 4.1 `links/ImageLink/skeleton.tsx` — Props: `{ className, size }`, named `export function`, complex className filtering + SVG

- [ ] **Task 5: Type MainContainer — rest props pattern (1 file)** (AC: #2, #3, #5)
  - [ ] 5.1 `hocs/MainContainer/index.tsx` — Props: `{ children, className?, ...rest }` with `React.HTMLAttributes<HTMLDivElement>`. Named `export const`

- [ ] **Task 6: Type framer-motion heavy components (3 files)** (AC: #2, #3, #5)
  - [ ] 6.1 `hocs/FramerImage/index.tsx` — `m(Image)` motion-wrapped Next.js Image. CRITICAL: see typing pattern below
  - [ ] 6.2 `hocs/History/index.tsx` — `useRef<HTMLDivElement>`, `useScroll` from framer-motion, `m.div` with scaleY MotionValue
  - [ ] 6.3 `hocs/TransitionerLi/index.tsx` — `useRef<HTMLLiElement>`, `useReducedMotion`, `m.div` with conditional motion

- [ ] **Task 7: Rename barrel files** (AC: #1)
  - [ ] 7.1 `hocs/index.js` → `.ts`, `links/index.js` → `.ts`, `shadows/index.js` → `.ts` — Renamed in Task 1. Verify re-exports resolve.

- [ ] **Task 8: Commit types + validate** (AC: #4)
  - [ ] 8.1 Commit: `feat(ts): add TypeScript annotations to Batch G — Atoms buttons, hocs, links, shadows`
  - [ ] 8.2 Run full validation: lint, typecheck, tests, build

## Dev Notes

### Files to Migrate (19 files)

| # | File | Lines | Props | Key Challenge |
|---|------|-------|-------|---------------|
| 1 | `buttons/ArrowButton/skeleton.jsx` | 8 | None | Trivial |
| 2 | `buttons/NavigationItemButton/skeleton.jsx` | 8 | None | Trivial |
| 3 | `hocs/index.js` | 5 | N/A | Barrel — mixed `export *` and `export { default as }` |
| 4 | `hocs/MainContainer/index.jsx` | 22 | `{ children, className?, ...rest }` | Rest props → `React.HTMLAttributes<HTMLDivElement>` |
| 5 | `hocs/FramerImage/index.jsx` | 8 | Inherits Image+motion | **`m(Image)` motion wrapper** — CRITICAL typing |
| 6 | `hocs/History/index.jsx` | 33 | `{ children }` | `useRef<HTMLDivElement>`, `useScroll`, `m.div` with MotionValue |
| 7 | `hocs/History/skeleton.jsx` | 12 | `{ children }` | Named `export const` |
| 8 | `hocs/TransitionerLi/index.jsx` | 37 | `{ data, children }` | `useRef<HTMLLiElement>`, `useReducedMotion`, conditional animation |
| 9 | `hocs/TransitionerLi/skeleton.jsx` | 18 | `{ data, children }` | Named `export const` |
| 10 | `links/index.js` | 7 | N/A | Barrel — `export { default as }` pattern |
| 11 | `links/BaseLink/index.jsx` | 14 | `{ href, target, text, className }` | Next.js `Link` wrapper |
| 12 | `links/ImageLink/index.jsx` | 30 | `{ href, src, alt, size, className?, sizes? }` | Next.js Image + Link |
| 13 | `links/ImageLink/skeleton.jsx` | 66 | `{ className, size }` | Complex className filtering, SVG |
| 14 | `links/NavigationItemLink/index.jsx` | 40 | `{ href, name, className, onClick? }` | TransitionLink, computed testid |
| 15 | `links/NavigationItemLink/skeleton.jsx` | 15 | `{ width }` | Simple skeleton with width prop |
| 16 | `links/WhatsAppLink/index.jsx` | 29 | `{ href, target, text, className }` | WhatsAppIcon import |
| 17 | `shadows/index.js` | 3 | N/A | Barrel — `export *` pattern |
| 18 | `shadows/BoxShadow/index.jsx` | 8 | `{ variant }` | String literal union type |
| 19 | `shadows/FeaturedBoxShadow/index.jsx` | 6 | None | Trivial |

### Files ALREADY TypeScript — NOT Migration Targets

| File | Reason |
|------|--------|
| `buttons/ArrowButton/index.tsx` | Already `.tsx` |
| `buttons/NavigationItemButton/index.tsx` | Already `.tsx` |
| `buttons/SkillSelectorButton/index.tsx` | Already `.tsx` |
| `buttons/index.ts` | Already `.ts` barrel |
| `links/CalendarLink/index.tsx` | Already `.tsx` |
| `links/TransitionLink/index.tsx` | Already `.tsx` |
| `hocs/FramerImage/index.tsx` — Wait, this IS .jsx | This IS a migration target |
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

**hocs/FramerImage/index.tsx — CRITICAL: `m(Image)` motion wrapper:**

This component creates a framer-motion wrapped Next.js Image using `m(Image)`. Typing approach:

```tsx
"use client";

import { m } from "framer-motion";
import Image from "next/image";

export const FramerImage = m(Image);
```

The `m()` function from framer-motion returns a typed motion component. TypeScript infers the correct type automatically — `m(Image)` returns `ForwardRefComponent<HTMLImageElement, MotionProps & ImageProps>`. **No explicit type annotation needed beyond what `m()` provides.** Do NOT add `React.JSX.Element` return type — this is a component factory, not a function component.

**hocs/MainContainer/index.tsx — Rest props with HTMLDivElement:**

```tsx
import React from "react";

interface MainContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const MainContainer = ({
  children,
  className,
  ...rest
}: MainContainerProps): React.JSX.Element => {
  // ...unchanged...
};
```

NOTE: `MainContainerProps extends React.HTMLAttributes<HTMLDivElement>` automatically includes `className`, `data-testid`, `onClick`, etc. The explicit `className?: string` is redundant but preserved for documentation clarity (already in HTMLAttributes).

**hocs/History/index.tsx — useRef + useScroll + m.div:**

```tsx
"use client";

import React, { useRef } from "react";
import { m, useScroll } from "framer-motion";

interface HistoryProps {
  children: React.ReactNode;
}

const History = ({ children }: HistoryProps): React.JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    // ...unchanged — m.div with style={{ scaleY: scrollYProgress }}
  );
};
```

NOTE: `useScroll` returns `{ scrollYProgress: MotionValue<number> }`. The `scaleY` prop on `m.div` accepts `MotionValue<number>`. No explicit MotionValue typing needed — TypeScript infers correctly.

**hocs/TransitionerLi/index.tsx — useRef<HTMLLiElement> + conditional animation:**

```tsx
"use client";

import React, { useRef } from "react";
import { m, useScroll } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

interface TransitionerLiProps {
  data: string;
  children: React.ReactNode;
}

const TransitionerLi = ({ data, children }: TransitionerLiProps): React.JSX.Element => {
  const ref = useRef<HTMLLiElement>(null);
  const shouldReduceMotion = useReducedMotion();
  // ...unchanged...
};
```

NOTE: Check if `useScroll` or `useInView` is used — the explore agent mentioned `useScroll` but the component may use a different framer-motion hook. Read the actual file to confirm.

**links/ImageLink/skeleton.tsx — Complex className filtering:**

```tsx
import React from "react";

interface ImageLinkSkeletonProps {
  className?: string;
  size?: number | string;
}

export function ImageLinkSkeleton({
  className = "",
  size = 512,
}: ImageLinkSkeletonProps): React.JSX.Element {
  // className filtering logic — preserve exactly as-is
  // ...unchanged...
};
```

NOTE: `size` prop may be used as both `number` (for width/height) and `string`. Check actual usage pattern and type accordingly.

**links/NavigationItemLink/index.tsx — Computed testid:**

```tsx
import React from "react";

interface NavigationItemLinkProps {
  href: string;
  name: string;
  className: string;
  onClick?: () => void;
}

const NavigationItemLink = ({
  href,
  name,
  className,
  onClick,
}: NavigationItemLinkProps): React.JSX.Element => {
  // ...unchanged...
};
```

**shadows/BoxShadow/index.tsx — String literal variant:**

```tsx
import React from "react";

interface BoxShadowProps {
  variant?: "default" | "list-item";
}

export const BoxShadow = ({ variant = "default" }: BoxShadowProps): React.JSX.Element => {
  // ...unchanged...
};
```

### Export Pattern Diversity (CRITICAL)

| Pattern | Files |
|---------|-------|
| `export default ComponentName` | BaseLink, History, ImageLink, NavigationItemLink, NavigationItemLink/skeleton, TransitionerLi, WhatsAppLink, button skeletons |
| `export const ComponentName` | BoxShadow, FeaturedBoxShadow, MainContainer, FramerImage, History/skeleton, TransitionerLi/skeleton |
| `export function NamedExport` | ImageLink/skeleton (`ImageLinkSkeleton`) |
| Barrel re-exports | hocs/index, links/index, shadows/index |

**Preserve each pattern exactly.** Do NOT change `export const` to `export default` or vice versa.

### Potential Latent Type Errors (Expected, Do NOT Fix)

1. **TransitionerLi/index.tsx**: Imports `LiIcon` from `@/atoms/icons/LiIcon` — icon is still `.jsx` until Batch I. May produce prop type mismatch.
2. **TransitionerLi/skeleton.tsx**: Imports LiIcon skeleton — same issue.
3. **WhatsAppLink/index.tsx**: Imports `WhatsAppIcon` from `@/atoms/icons/WhatsAppIcon` — still `.jsx` until Batch I.
4. **NavigationItemLink/index.tsx**: Imports `ActiveMark` and `TransitionLink` — TransitionLink is already `.tsx`, ActiveMark may still be `.jsx` (Batch H atoms/texts).
5. **ImageLink/index.tsx**: Uses Next.js `Image` and `Link` — these are already typed. No issues expected.

### Impact on Upstream Consumers

Migrating these atoms to `.tsx` will **resolve latent cross-batch errors** in molecules and organisms that import them:
- `Paragraph/index.tsx` (TS2322) — imports `ParagraphSkeleton` from atoms/texts (Batch H, not this batch)
- `SocialNetworkLink/Icon.tsx` (TS2322) — imports icons (Batch I, not this batch)
- `Resume/Button.tsx` — imports `ArrowButton` from `@/atoms/buttons` barrel (THIS batch resolves the skeleton types)

### Story 22-1 through 22-6 Learnings (CRITICAL)

1. **`import React from "react"` IS NEEDED** — ESLint `no-undef` rule requires it when using `React.JSX.Element`
2. **Commit strategy**: First commit = renames only via `git mv`, second commit = type annotations
3. **Jest cache**: After rename, run `npm test -- --no-cache` if tests fail with "Cannot find module"
4. **Pre-existing errors**: ~53 typecheck errors on branch (baseline). NOT from this batch
5. **`"use client"` directive**: MUST remain as first line where present
6. **Prettier line length**: If props destructuring exceeds 80 chars, expand to multiline format
7. **Latent typecheck errors**: Icons imported from `@/atoms/icons/*` are still `.jsx` — may produce type errors. Expected, resolves in Batch I
8. **`import type` for type-only imports**: Use when importing only types
9. **Non-null assertion `!`**: Acceptable for ref access where element existence is guaranteed by lifecycle
10. **Redundant useState generics**: Don't add `useState<boolean>` when initial value makes type inferrable
11. **Build failure baseline**: Pre-existing lint errors in story files cause `npm run build` to fail on both main and branch. AC4 means "zero NEW build failures"
12. **Duplicate react imports**: Consolidate into single `import React, { ... } from "react"` (review finding M1 from Story 22-6)
13. **`m(Component)` typing**: `m()` returns a typed component — no manual return type needed. It's a factory, not a function component
14. **`extends React.HTMLAttributes<HTMLDivElement>`**: Use for rest props pattern instead of explicit prop list

### Anti-Patterns to Avoid

- Do NOT add `React.FC` or `React.FunctionComponent` — use explicit arrow functions (project convention)
- Do NOT use `any` — define proper types
- Do NOT change barrel file re-exports — that's Epic 23
- Do NOT add redundant useState generics — let TS infer
- Do NOT change framer-motion `m.div` to `motion.div` — project uses LazyMotion pattern
- Do NOT change `export const` to `export default` or vice versa
- Do NOT try to type `m(Image)` with explicit return type — let `m()` infer
- Do NOT fix icon import type mismatches — those resolve in Batch I
- Do NOT consolidate barrel `export *` into named exports — that's Epic 23

### Recommended Task Execution Order

1. **Rename all 19 files** → commit
2. **Trivial skeletons + no-props** (7 files)
3. **Simple props** (5 files — links, BoxShadow)
4. **ImageLink skeleton** (1 file — complex className logic)
5. **MainContainer rest props** (1 file)
6. **Framer-motion heavy** (3 files — FramerImage, History, TransitionerLi)
7. **Barrel verification** (already renamed in step 1)
8. **Validate + commit**

### Commit Strategy

Per `docs/architecture/typescript-migration.md` Section 4:
1. **First commit**: File renames only (`git mv`)
2. **Second commit**: Type annotations added
3. Branch: `migration/ts-batch-g-atoms-buttons-hocs-links`

### Project Structure Notes

- `hocs/` contains higher-order components used by organisms/molecules
- `hocs/index.js` barrel uses mixed patterns: `export *` (FramerImage, MainContainer) and `export { default as }` (History, TransitionerLi)
- `shadows/index.js` barrel uses `export *` from both children
- `links/index.js` barrel uses `export { default as }` for all 6 links
- Icon imports use direct paths (correct per CLAUDE.md barrel import rules)

### References

- [Source: docs/architecture/typescript-migration.md#P4: Atoms (non-icons)] — Batch G file list
- [Source: docs/architecture/typescript-migration.md#3. Migration Rules] — DO/DO NOT rules
- [Source: docs/architecture/typescript-migration.md#4. Batch Definitions] — Commit strategy, ACs
- [Source: _bmad-output/implementation-artifacts/22-6-molecules-second-half.md] — Story 22-6 learnings and review fixes
- [Source: CLAUDE.md#Performance Anti-pattern] — Barrel import rules

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
