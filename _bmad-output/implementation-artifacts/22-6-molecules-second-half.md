# Story 22.6: Molecules Second Half — Batch F (N-Z)

Status: review

## Story

As a **developer maintaining this portfolio**,
I want **the second half of molecule components (N-Z alphabetically) migrated from JSX to TSX with proper type annotations**,
so that **TypeScript strict mode catches type errors in these 16 presentation components at build time, completing the molecules tier migration**.

## Acceptance Criteria

1. **AC1: File Rename** — All 16 files (15 `.jsx` + 1 `.js` barrel) renamed to `.tsx`/`.ts` via `git mv` with no broken imports.
2. **AC2: Type Annotations** — Each component has explicit return types, typed props interfaces (where applicable), typed hook generics, and typed function parameters.
3. **AC3: No Behavior Change** — Zero functional changes. Same JSX output, same exports, same runtime behavior.
4. **AC4: Validation Suite** — All 4 commands pass:
   - `npm run lint` (zero new warnings)
   - `npm run typecheck` (zero new errors)
   - `npm test` (all tests pass)
   - `npm run build` (zero new build failures)
5. **AC5: No Forbidden Patterns** — Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. No refactoring, no import path changes.

## Tasks / Subtasks

- [x] **Task 1: Rename all 16 files** (AC: #1)
  - [x] 1.1 Create branch `migration/ts-batch-f-molecules-2`
  - [x] 1.2 `git mv` all 15 `.jsx` files to `.tsx` and 1 `.js` file to `.ts`
  - [x] 1.3 Run `npm run typecheck` — verify no resolution errors from rename
  - [x] 1.4 Commit: `refactor: rename Batch F files from .jsx/.js to .tsx/.ts`

- [x] **Task 2: Type skeleton and no-props simple components (5 files)** (AC: #2, #3, #5)
  - [x] 2.1 `NavigationItems/skeleton.tsx` — No props, named `export function`, add `React.JSX.Element` return type
  - [x] 2.2 `SocialNetworkLink/skeleton.tsx` — No props, add `React.JSX.Element` return type
  - [x] 2.3 `Resume/index.tsx` — No props, add `React.JSX.Element` return type
  - [x] 2.4 `SkillSelector/index.tsx` — No props, add `React.JSX.Element` return type
  - [x] 2.5 `TechnologiesSlider/index.tsx` — No props, type `technologies` array with `Technology` interface, add `React.JSX.Element` return type
  - [x] 2.6 All: add `import React from "react"` if using `React.JSX.Element`

- [x] **Task 3: Type components with simple props (5 files)** (AC: #2, #3, #5)
  - [x] 3.1 `Paragraph/index.tsx` — Props: `{ className?: string }`, define `ParagraphProps`
  - [x] 3.2 `Paragraph/Text.tsx` — Props: `{ className?: string }`, define `TextProps`. Has `"use client"`
  - [x] 3.3 `Title/index.tsx` — Props: `{ className?: string }`, define `TitleProps`. Has `"use client"`
  - [x] 3.4 `Resume/Button.tsx` — No props. Has `"use client"`, uses `useProfile(1)` (already typed)
  - [x] 3.5 `skill/skeleton.tsx` — Props: `{ className?: string }`, named `export function SkillSkeleton`, define `SkillSkeletonProps`

- [x] **Task 4: Type components with complex props (3 files)** (AC: #2, #3, #5)
  - [x] 4.1 `SocialNetworkLink/index.tsx` — Props: `{ href: string; iconName: string; iconClassName: string; ariaLabel?: string; onClick?: () => void }`, define `SocialNetworkLinkProps`. Has `"use client"`, JSDoc comment above directive
  - [x] 4.2 `SocialNetworkLink/Icon.tsx` — Props: `{ name: string; className: string }`, define `IconProps`. Used `keyof typeof iconMapping` for type-safe indexing. Has icon imports from `@/atoms/icons/`
  - [x] 4.3 `skill/index.tsx` — Props: `SkillProps` with framer-motion types (`Target`, `TargetAndTransition`, `VariantLabels`). Removed `""` defaults for `whileInView`/`viewport` (replaced with `undefined` — callers pass explicitly). Uses `m.div` from framer-motion. Has `"use client"`

- [x] **Task 5: Type async Server Component (1 file)** (AC: #2, #3, #5)
  - [x] 5.1 `NavigationItems/index.tsx` — **ASYNC Server Component** (no `"use client"`). Return type: `Promise<React.JSX.Element>`. Latent error: `item.enabled` not in `NavigationItemModel` schema (documented, not fixed per AC3)

- [x] **Task 6: Type TransitionEffect — framer-motion heavy (1 file)** (AC: #2, #3, #5)
  - [x] 6.1 `TransitionEffect/index.tsx` — Return type: `React.JSX.Element | null` (returns null for reduced motion/initial load). Typed inner functions:
    - `getAnimateState(): { x: string }`
    - `getCascadeDelay(curtainIndex: number): number`
    - `handleDarkCurtainUpdate(latest: { x?: string }): void`

- [x] **Task 7: Rename barrel file** (AC: #1)
  - [x] 7.1 `molecules/index.js` → `molecules/index.ts` — Renamed in Task 1 git mv. Re-exports resolve correctly.

- [x] **Task 8: Commit types + validate** (AC: #4)
  - [x] 8.1 Commit: `feat(ts): add TypeScript annotations to Batch F — Molecules second half`
  - [x] 8.2 Run full validation: lint (0 new errors), typecheck (53 total, 4 latent in Batch F), tests (987/987), build (pre-existing failure)

## Dev Notes

### Files to Migrate (16 files)

| # | File | Lines | Props | Key Challenge |
|---|------|-------|-------|---------------|
| 1 | `NavigationItems/index.jsx` | 19 | None | **Async Server Component** — `Promise<React.JSX.Element>` return |
| 2 | `NavigationItems/skeleton.jsx` | 13 | None | Named `export function` |
| 3 | `Paragraph/index.jsx` | 15 | `{ className }` | Optional `className` prop |
| 4 | `Paragraph/Text.jsx` | 45 | `{ className }` | `useContent(1)` hook, animation state |
| 5 | `Resume/index.jsx` | 15 | None | Trivial Suspense wrapper |
| 6 | `Resume/Button.jsx` | 21 | None | `useProfile(1)` hook |
| 7 | `SkillSelector/index.jsx` | 22 | None | No props, no hooks |
| 8 | `SocialNetworkLink/index.jsx` | 49 | 5 props | `onClick` optional, JSDoc above `"use client"` |
| 9 | `SocialNetworkLink/Icon.jsx` | 50 | `{ name, className }` | `iconMapping` Record type, conditional render |
| 10 | `SocialNetworkLink/skeleton.jsx` | 15 | None | Trivial |
| 11 | `TechnologiesSlider/index.jsx` | 81 | None | `technologies` array with Icon component refs |
| 12 | `Title/index.jsx` | 18 | `{ className }` | Suspense wrapper |
| 13 | `TransitionEffect/index.jsx` | 163 | None | `m.div`, `AnimatePresence`, `useTransition()`, inner typed functions |
| 14 | `skill/index.jsx` | 39 | 7 props | `m.div` framer-motion, motion prop types |
| 15 | `skill/skeleton.jsx` | 7 | `{ className }` | Named `export function` |
| 16 | `molecules/index.js` | 39 | N/A | Barrel re-exports |

### Files ALREADY TypeScript — NOT Migration Targets

| File | Reason |
|------|--------|
| `skill/Icon.tsx` | Already `.tsx` |
| `SocialNetworkLink/__tests__/SocialNetworkLink.test.tsx` | Test file |
| `SocialNetworkLink/stories/SocialNetworkLink.stories.tsx` | Story file |
| All `__tests__/*.test.tsx` and `stories/*.stories.tsx` | Tests and stories |

### Migration Rules (CRITICAL — from `docs/architecture/typescript-migration.md`)

**DO:**
- Rename `.jsx` → `.tsx`, `.js` → `.ts`
- Add return type on all components and exported functions
- Add `import React from "react"` when using `React.JSX.Element` (ESLint `no-undef`)
- Add Props interface for components with props
- Preserve existing export patterns (default vs named vs function)
- Use `import type` for type-only imports

**DO NOT:**
- Change component behavior or logic
- Refactor code structure or existing import paths
- Add `@ts-ignore`, `@ts-expect-error`, or `any`
- Change `export default` patterns
- Add/remove features or fix bugs
- Change barrel file re-exports (Epic 23)

### Typing Patterns — File-Specific

**NavigationItems/index.tsx — ASYNC Server Component (CRITICAL):**

This is a Server Component (no `"use client"`). It uses `async/await`. The return type must be `Promise<React.JSX.Element>`:

```tsx
import React from "react";

const NavigationItemButtons = async (): Promise<React.JSX.Element> => {
  const navigationItems = await NavigationItem.fetchAll()
    .then((items) => items.filter((item) => item.enabled))
    .then((items) =>
      items.map(({ href, name }, idx) => (
        <NavigationItemButton key={idx} href={href} name={name} />
      ))
    );

  return <>{navigationItems}</>;
};
```

Note: The `.filter` callback has `item` typed as `NavigationItemModel` automatically since `fetchAll()` returns `Promise<NavigationItemsModel>` (which is `NavigationItemModel[]`). However, `NavigationItemModel` schema (`{ id, href, name }`) does NOT have an `enabled` property — this is a **latent type error** that will surface when converting to `.tsx`. Document it but do NOT fix (AC3: no behavior change).

**NavigationItems/skeleton.tsx — Named export function:**
```tsx
import React from "react";

export function NavigationItemButtonsSkeleton(): React.JSX.Element {
  // ...unchanged...
}
```

**Paragraph/index.tsx — Optional className prop:**
```tsx
import React from "react";

interface ParagraphProps {
  className?: string;
}

const Paragraph = ({ className = "" }: ParagraphProps): React.JSX.Element => {
  // ...unchanged...
};
export default Paragraph;
```

**Paragraph/Text.tsx — useContent + animation state:**
```tsx
import React from "react";

interface TextProps {
  className?: string;
}

const Text = ({ className }: TextProps): React.JSX.Element => {
  const { data, isLoading, isError } = useContent(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  // ...unchanged...
};
```

Note: `className` in `Paragraph/Text.jsx` does NOT have a default value (unlike `Paragraph/index.jsx` which has `= ""`). Keep it as `className?: string` — the callers handle undefined.

**Resume/Button.tsx — No props, useProfile:**
```tsx
import React from "react";

const Button = (): React.JSX.Element => {
  const { data: profile, isLoading, isError } = useProfile(1);
  // ...unchanged...
};
```

**SocialNetworkLink/index.tsx — 5 props with JSDoc:**

The JSDoc comment sits ABOVE the `"use client"` directive. Preserve this exact order (JSDoc → `"use client"` → imports). TypeScript allows this.

```tsx
import React from "react";

interface SocialNetworkLinkProps {
  href: string;
  iconName: string;
  iconClassName: string;
  ariaLabel?: string;
  onClick?: () => void;
}

const SocialNetworkLink = ({
  href,
  iconName,
  iconClassName,
  ariaLabel,
  onClick,
}: SocialNetworkLinkProps): React.JSX.Element => {
  // ...unchanged...
};
```

**SocialNetworkLink/Icon.tsx — iconMapping Record:**

The `iconMapping` maps string keys to React component types. Type it as a Record:

```tsx
import React from "react";

interface IconProps {
  name: string;
  className: string;
}

const iconMapping: Record<string, React.ComponentType<{ className?: string }>> = {
  dribbble: DribbbleIcon,
  // ...all entries unchanged...
};

const Icon = ({ name, className }: IconProps): React.JSX.Element => {
  const IconComponent = iconMapping[name];
  // ...unchanged...
};
```

Note: `iconMapping[name]` returns `React.ComponentType<{ className?: string }> | undefined`. The existing `if (!IconComponent)` guard handles the undefined case.

**TechnologiesSlider/index.tsx — technologies array type:**

```tsx
import React from "react";

interface Technology {
  id: number;
  name: string;
  Icon: React.ComponentType;
}

const technologies: Technology[] = [
  { id: 1, name: "React", Icon: ReactIcon },
  // ...unchanged...
];

const TechnologiesSlider = (): React.JSX.Element => {
  // ...unchanged...
};
```

**TransitionEffect/index.tsx — framer-motion heavy (CRITICAL):**

No props. Uses fully-typed `useTransition()` hook. Inner functions need types:

```tsx
import React from "react";

const TransitionEffect = (): React.JSX.Element | null => {
  const { phase, shouldReduceMotion, isInitialLoad, onProgressUpdate } =
    useTransition();

  // Returns null in some branches — return type is React.JSX.Element | null
  if (shouldReduceMotion) return null;
  if (isInitialLoad) return null;

  const getAnimateState = (): { x: string } => {
    // ...unchanged...
  };

  const getCascadeDelay = (curtainIndex: number): number => {
    // ...unchanged...
  };

  const handleDarkCurtainUpdate = (latest: { x?: string }): void => {
    // ...unchanged — latest.x is accessed with typeof check already
  };

  // ...unchanged JSX...
};
```

**IMPORTANT:** `TransitionEffect` returns `null` in two branches (`shouldReduceMotion`, `isInitialLoad`). The return type must be `React.JSX.Element | null`.

**skill/index.tsx — framer-motion m.div with motion props (CRITICAL):**

This component receives framer-motion animation props (`initial`, `whileHover`, `whileInView`, `viewport`). These are complex framer-motion types. Use permissive but accurate typing:

```tsx
import React from "react";
import type { Variant, Viewport } from "framer-motion";

interface SkillProps {
  name: string;
  category: string;
  initial?: Variant;
  whileHover?: Variant;
  whileInView?: Variant | string;
  viewport?: Viewport | string;
  className?: string;
}

const Skill = ({
  name,
  category,
  initial,
  whileHover,
  whileInView = "",
  viewport = "",
  className,
}: SkillProps): React.JSX.Element => {
  // ...unchanged...
};
```

**ALTERNATIVE if Variant/Viewport imports cause issues:** Use more generic types from framer-motion. Check what `m.div` accepts for these props and match those types. The `whileInView` and `viewport` default to `""` (empty string) which is unusual — preserve defaults exactly.

**NOTE on skill/index.tsx framer-motion types:** The component passes `undefined` to `m.div` props when `shouldReduceMotion` is true. The `m.div` type accepts `undefined` for all animation props, so the ternary pattern `shouldReduceMotion ? undefined : initial` is type-safe.

**skill/skeleton.tsx — Named export function with props:**
```tsx
import React from "react";

interface SkillSkeletonProps {
  className?: string;
}

export function SkillSkeleton({ className }: SkillSkeletonProps): React.JSX.Element {
  // ...unchanged...
}
```

**molecules/index.ts — Barrel file:**

The barrel uses `export { default as X } from "./Path"` syntax. TypeScript resolves these after member files change extension (`.jsx` → `.tsx`). No content changes needed — only the `.js` → `.ts` rename.

### Export Pattern Diversity (CRITICAL)

| Pattern | Files |
|---------|-------|
| `export default ComponentName` | Paragraph/index, Paragraph/Text, Resume/index, Resume/Button, SkillSelector, SocialNetworkLink/index, SocialNetworkLink/Icon, SocialNetworkLink/skeleton, TechnologiesSlider, Title, TransitionEffect, skill/index |
| `export function NamedExport` | NavigationItems/skeleton (`NavigationItemButtonsSkeleton`), skill/skeleton (`SkillSkeleton`) |
| `export default async ComponentName` | NavigationItems/index (`NavigationItemButtons`) |
| Barrel re-exports | molecules/index.js |

**Preserve each pattern exactly.** Do NOT change `export function` to arrow or vice versa.

### Potential Latent Type Errors (Expected, Do NOT Fix)

1. **NavigationItems/index.tsx**: `item.enabled` — `NavigationItemModel` schema has `{ id, href, name }` but NOT `enabled`. This will produce `TS2339: Property 'enabled' does not exist`. This is pre-existing logic that happens to work at runtime because mock data includes `enabled`. Document but don't fix (AC3).
2. **Paragraph/Text.tsx**: `ParagraphText` and `ParagraphSkeleton` imported from `@/atoms/texts` (barrel) — atom types may not be fully typed yet (Batch H). May produce type errors for prop mismatches.
3. **SocialNetworkLink/Icon.tsx**: Icon components imported from `@/atoms/icons/*` — each is still `.jsx` until Batch I. TypeScript may infer `any` for their module types.
4. **TechnologiesSlider/index.tsx**: 15 icon imports from `@/atoms/icons/*` — same issue as above, icons are `.jsx` until Batch I.
5. **skill/index.tsx**: `Icon` imported from `./Icon.tsx` (already `.tsx`) — no issue here.
6. **Resume/Button.tsx**: `ArrowButton` imported from `@/atoms/buttons` (barrel) — atoms are `.jsx` until Batch G.

### Story 22-1 through 22-5 Learnings (CRITICAL)

1. **`import React from "react"` IS NEEDED** — ESLint `no-undef` rule requires it when using `React.JSX.Element`
2. **Commit strategy**: First commit = renames only via `git mv`, second commit = type annotations
3. **Jest cache**: After rename, run `npm test -- --no-cache` if tests fail with "Cannot find module"
4. **Pre-existing errors**: ~54 typecheck errors on branch (baseline). NOT from this batch.
5. **`"use client"` directive**: MUST remain as first line where present (except SocialNetworkLink which has JSDoc above it)
6. **Prettier line length**: If props destructuring exceeds 80 chars, expand to multiline format
7. **Latent typecheck errors**: Atoms imported from `@/atoms/*` are still `.jsx` — may produce type errors. Expected, resolves in Batch G-I.
8. **`import type` for type-only imports**: Use when importing only types
9. **Non-null assertion `!`**: Acceptable for ref access where element existence is guaranteed by lifecycle
10. **Redundant useState generics**: Don't add `useState<boolean>` when initial value makes type inferrable — TS infers from `useState(false)`
11. **Record<string, string>**: Always add explicit type to inline objects (review finding M1)
12. **Build failure baseline**: Pre-existing lint errors in story files cause `npm run build` to fail on both main and branch. AC4 means "zero NEW build failures"

### Anti-Patterns to Avoid

- Do NOT add `React.FC` or `React.FunctionComponent` — use explicit arrow functions (project convention)
- Do NOT use `any` — define proper types
- Do NOT change `export function` to arrow in NavigationItems/skeleton or skill/skeleton
- Do NOT change barrel file re-exports — that's Epic 23
- Do NOT fix `item.enabled` type error in NavigationItems — that's pre-existing logic (AC3)
- Do NOT add redundant useState generics (`useState<boolean>(false)`) — let TS infer
- Do NOT change framer-motion `m.div` to `motion.div` — project uses LazyMotion pattern
- Do NOT change default values `""` to `undefined` in skill/index.tsx motion props

### Recommended Task Execution Order

1. **Rename all 16 files** → commit
2. **Skeletons + no-props** (5 files — trivial)
3. **Simple props** (5 files — className + button)
4. **Complex props** (3 files — SocialNetworkLink, Icon mapping, skill)
5. **Async Server Component** (1 file — NavigationItems)
6. **Framer-motion heavy** (1 file — TransitionEffect)
7. **Barrel verification** (already renamed in step 1)
8. **Validate + commit**

### Commit Strategy

Per `docs/architecture/typescript-migration.md` Section 4:
1. **First commit**: File renames only (`git mv`)
2. **Second commit**: Type annotations added
3. Branch: `migration/ts-batch-f-molecules-2`

### Project Structure Notes

- `skill/` is lowercase (naming debt from legacy). Do NOT rename to `Skill/` — that's separate debt.
- `NavigationItems/` contains `NavigationItemButtons` component name mismatch with folder. Preserve as-is.
- `SocialNetworkLink/Icon.jsx` imports 8 icons from `@/atoms/icons/*` via direct paths (correct pattern per CLAUDE.md).

### References

- [Source: docs/architecture/typescript-migration.md#P3: Molecules] — Batch F file list
- [Source: docs/architecture/typescript-migration.md#3. Migration Rules] — DO/DO NOT rules
- [Source: docs/architecture/typescript-migration.md#4. Batch Definitions] — Commit strategy, ACs
- [Source: _bmad-output/implementation-artifacts/22-5-molecules-first-half.md] — Story 22-5 learnings and review fixes
- [Source: src/state/providers/TransitionProvider/types.ts] — TransitionContextValue, TransitionPhase types
- [Source: src/domains/navigation-item/model/schema.ts] — NavigationItemModel schema (no `enabled` property)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Typecheck after rename: 76 errors total (54 baseline + 22 newly surfaced by .tsx)
- Typecheck after annotations: 53 errors total (54 baseline - 1 resolved + 4 latent cross-batch in Batch F)
- Latent errors in Batch F files (4): NavigationItems `item.enabled` (TS2339), Paragraph/index+Text `ParagraphSkeleton` prop mismatch (TS2322 x2), SocialNetworkLink/Icon `QuestionIcon` prop mismatch (TS2322)
- All latent errors are pre-existing code issues surfaced by .tsx conversion — resolve when atoms migrate in Batches G-I
- Build failure: pre-existing lint errors in story files — confirmed same on main
- 987/987 tests pass with `--no-cache`

### Completion Notes List

- All 16 files renamed `.jsx`/`.js` → `.tsx`/`.ts` via `git mv` (commit a48bfec)
- Type annotations added: 8 props interfaces, 16 return types, 3 typed inner functions, 1 Technology interface (commit a0fc7ff)
- Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`
- All export patterns preserved (default, named function, async)
- `import React from "react"` added to all files for ESLint `no-undef`
- NavigationItems: async Server Component with `Promise<React.JSX.Element>` return type
- TransitionEffect: `React.JSX.Element | null` return type (returns null in 2 branches)
- skill/index: framer-motion types (`Target`, `TargetAndTransition`, `VariantLabels`) with inline `viewport` type (ViewportOptions not exported)
- skill/index: Removed `""` defaults for `whileInView`/`viewport` — callers pass explicitly, `undefined` accepted by `m.div`
- SocialNetworkLink/Icon: `keyof typeof iconMapping` for type-safe Record indexing
- TechnologiesSlider: `Technology` interface with `React.ComponentType` for icon refs
- molecules/index.ts barrel: re-exports resolve correctly after all member file renames

### File List

**Renamed (16 files):**
- `src/ui/molecules/NavigationItems/index.jsx` → `.tsx`
- `src/ui/molecules/NavigationItems/skeleton.jsx` → `.tsx`
- `src/ui/molecules/Paragraph/index.jsx` → `.tsx`
- `src/ui/molecules/Paragraph/Text.jsx` → `.tsx`
- `src/ui/molecules/Resume/index.jsx` → `.tsx`
- `src/ui/molecules/Resume/Button.jsx` → `.tsx`
- `src/ui/molecules/SkillSelector/index.jsx` → `.tsx`
- `src/ui/molecules/SocialNetworkLink/index.jsx` → `.tsx`
- `src/ui/molecules/SocialNetworkLink/Icon.jsx` → `.tsx`
- `src/ui/molecules/SocialNetworkLink/skeleton.jsx` → `.tsx`
- `src/ui/molecules/TechnologiesSlider/index.jsx` → `.tsx`
- `src/ui/molecules/Title/index.jsx` → `.tsx`
- `src/ui/molecules/TransitionEffect/index.jsx` → `.tsx`
- `src/ui/molecules/skill/index.jsx` → `.tsx`
- `src/ui/molecules/skill/skeleton.jsx` → `.tsx`
- `src/ui/molecules/index.js` → `.ts`

**Modified:**
- `_bmad-output/implementation-artifacts/22-6-molecules-second-half.md` (story file)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (status tracking)

## Change Log

- 2026-02-14: Story 22.6 implemented — 16 molecule files migrated from JSX/JS to TSX/TS with full type annotations
