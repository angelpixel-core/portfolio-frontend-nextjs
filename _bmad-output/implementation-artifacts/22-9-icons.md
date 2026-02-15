# Story 22.9: Atoms — Icons — Batch I

Status: review

## Story

As a **developer maintaining this portfolio**,
I want **all 57 icon components, 1 skeleton, and the icons barrel migrated from JSX/JS to TSX/TS with proper type annotations**,
so that **TypeScript strict mode catches type errors in these foundational SVG components at build time, completing the atoms layer migration and resolving all cross-batch latent type errors from components importing icons**.

## Acceptance Criteria

1. **AC1: File Rename** — All 57 files (55 `.jsx` icons + 1 `.jsx` skeleton + 1 `.js` barrel) renamed to `.tsx`/`.ts` via `git mv` with no broken imports.
2. **AC2: Type Annotations** — Each component has explicit return types, typed props interfaces (where applicable), typed hook generics, and typed function parameters.
3. **AC3: No Behavior Change** — Zero functional changes. Same JSX output, same exports, same runtime behavior.
4. **AC4: Validation Suite** — All 4 commands pass with zero NEW failures:
   - `npm run lint` (zero new warnings)
   - `npm run typecheck` (zero new errors vs baseline)
   - `npm test` (all tests pass — use `--no-cache` if needed)
   - `npm run build` (zero new build failures)
5. **AC5: No Forbidden Patterns** — Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. No refactoring, no import path changes.

## Tasks / Subtasks

- [x] **Task 1: Rename all 57 files** (AC: #1)
  - [x] 1.1 Create branch `migration/ts-batch-i-icons`
  - [x] 1.2 `git mv` all 55 `.jsx` icon files to `.tsx`, 1 skeleton `.jsx` to `.tsx`, and 1 `.js` barrel to `.ts`
  - [x] 1.3 Verify no resolution errors from rename
  - [x] 1.4 Commit: `refactor: rename Batch I files from .jsx/.js to .tsx/.ts` (a6fbcd2)

- [x] **Task 2: Type Pattern A icons — SVG with className + rest props (53 files)** (AC: #2, #3, #5)
  - [x] 2.1 Add `import React from "react"` where missing
  - [x] 2.2 Add `interface IconNameProps extends React.SVGAttributes<SVGSVGElement> { className?: string }` to each
  - [x] 2.3 Add typed destructuring and `React.JSX.Element` return type
  - [x] 2.4 Add default `className = ""` where missing to prevent "undefined" in DOM (per Story 22-8 code review M2 finding)

- [x] **Task 3: Type LiIcon — framer-motion `m.circle` + `useScroll` (1 file)** (AC: #2, #3, #5)
  - [x] 3.1 `icons/LiIcon/index.tsx` — LiIconProps { reference: React.RefObject<HTMLElement> }

- [x] **Task 4: Type LiIcon skeleton (1 file)** (AC: #2, #3, #5)
  - [x] 4.1 `icons/LiIcon/skeleton.tsx` — Named `export const Skeleton`, return type added

- [x] **Task 5: Barrel file (1 file)** (AC: #1)
  - [x] 5.1 `icons/index.js` → `.ts` — 58 re-exports verified (AWSIcon as `Icon` preserved)

- [x] **Task 6: Commit types + validate** (AC: #4)
  - [x] 6.1 Commit: `feat(ts): add TypeScript annotations to Batch I icons` (428c751)
  - [x] 6.2 Run full validation: lint, typecheck, tests, build (code review: lint 0, typecheck 0 in icons, tests 99/987 pass; build baseline may fail elsewhere — 0 new failures from this batch)

## Dev Notes

### Files to Migrate (57 files)

| # | File | Props | Key Notes |
|---|------|-------|-----------|
| 1 | `icons/index.js` | N/A | Barrel — 58 re-exports. AWSIcon exported as `Icon` |
| 2 | `icons/ArrowIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 3 | `icons/AWSIcon/index.jsx` | `{ className, ...rest }` | Pattern A. Barrel exports as `Icon` |
| 4 | `icons/BashIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 5 | `icons/CheckIcon/index.jsx` | `{ className = "", ...rest }` | Pattern A + `styles.css` |
| 6 | `icons/ChevronDownIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 7 | `icons/CopyIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 8 | `icons/CSS3Icon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 9 | `icons/CucumberIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 10 | `icons/DockerIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 11 | `icons/DribbbleIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 12 | `icons/EnvelopeIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 13 | `icons/FigmaIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 14 | `icons/GitHubIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 15 | `icons/GitIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 16 | `icons/GooglePlusIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 17 | `icons/GraphQLIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 18 | `icons/HerokuIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 19 | `icons/HTML5Icon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 20 | `icons/JavaScriptIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 21 | `icons/JenkinsIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 22 | `icons/KafkaIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 23 | `icons/LiIcon/index.jsx` | `{ reference }` | **Pattern B**: `"use client"`, `m.circle`, `useScroll` |
| 24 | `icons/LiIcon/skeleton.jsx` | None | **Pattern C**: Named `export const Skeleton` |
| 25 | `icons/LinkedInIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 26 | `icons/LinuxIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 27 | `icons/LogoIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 28 | `icons/MicrosoftIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 29 | `icons/MongoIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 30 | `icons/MoonIcon/index.jsx` | `{ className, ...rest }` | Pattern A — large SVG with animations |
| 31 | `icons/NextIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 32 | `icons/NodeIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 33 | `icons/PinterestIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 34 | `icons/PostgresIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 35 | `icons/PulumiIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 36 | `icons/QuestionIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 37 | `icons/RailsIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 38 | `icons/ReactIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 39 | `icons/RedisIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 40 | `icons/ReduxIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 41 | `icons/RSpecIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 42 | `icons/RubyIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 43 | `icons/RustIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 44 | `icons/SASSIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 45 | `icons/SolidityIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 46 | `icons/StorybookIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 47 | `icons/SunIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 48 | `icons/SvelteIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 49 | `icons/TailwindIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 50 | `icons/TelegramIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 51 | `icons/TerraformIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 52 | `icons/TwitterIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 53 | `icons/TypeScriptIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 54 | `icons/UnixIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 55 | `icons/UserIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 56 | `icons/WhatsAppIcon/index.jsx` | `{ className, ...rest }` | Pattern A |
| 57 | `icons/WWWIcon/index.jsx` | `{ className, ...rest }` | Pattern A |

### Files ALREADY TypeScript — NOT Migration Targets

| File | Reason |
|------|--------|
| `icons/CalendarIcon/index.tsx` | Already `.tsx` — reference pattern for migration |
| `icons/CalendlyIcon/index.tsx` | Already `.tsx` |
| `icons/stories/IconGallery.stories.tsx` | Story file |

### Migration Rules (CRITICAL — from `docs/architecture/typescript-migration.md`)

**DO:**
- Rename `.jsx` → `.tsx`, `.js` → `.ts`
- Add return type on all components and exported functions
- Add `import React from "react"` when using `React.JSX.Element` (ESLint `no-undef`)
- Add Props interface for components with props
- Preserve existing export patterns (default vs named vs function)
- Use `import type` for type-only imports
- Consolidate duplicate `import ... from "react"` into single import
- Add default `className = ""` where className is used without default (prevents "undefined" in DOM)

**DO NOT:**
- Change component behavior or logic
- Refactor code structure or existing import paths
- Add `@ts-ignore`, `@ts-expect-error`, or `any`
- Change `export default` / `export const` patterns
- Add/remove features or fix bugs
- Change barrel file re-exports (Epic 23)

### Typing Patterns — By Category

**Pattern A: Standard SVG Icon (53 files) — Reference: CalendarIcon/index.tsx**

```tsx
import React from "react";

interface IconNameProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
}

const IconName = ({
  className = "",
  ...rest
}: IconNameProps): React.JSX.Element => {
  return (
    <svg
      {...rest}
      className={`w-full h-auto ${className}`}
    >
      {/* SVG paths unchanged */}
    </svg>
  );
};

export default IconName;
```

NOTE: `extends React.SVGAttributes<SVGSVGElement>` provides type safety for `...rest` spread. Most icons use `{ className, ...rest }` — add default `className = ""` where missing. Some icons have `styles.css` import (CheckIcon, etc.) — preserve as-is.

IMPORTANT: Some icons have `{...rest}` BEFORE `className` prop (e.g., `GitHubIcon`, `MoonIcon`): `{...rest} className={...}`. Others have `className` BEFORE `{...rest}` (e.g., `ArrowIcon`): `className={...} {...rest}`. **PRESERVE the exact ordering** of props on `<svg>` — do NOT reorder. The ordering affects which prop wins when both `rest` and explicit `className` are provided.

**Pattern B: LiIcon — Complex framer-motion icon**

```tsx
"use client";

import React from "react";

import "./styles.css";

import { m, useScroll } from "framer-motion";

interface LiIconProps {
  reference: React.RefObject<HTMLElement>;
}

const LiIcon = ({ reference }: LiIconProps): React.JSX.Element => {
  const { scrollYProgress } = useScroll({
    target: reference,
    offset: ["center end", "center center"],
    layoutEffect: false,
  });
  // ...unchanged — m.circle with scrollYProgress...
};

export default LiIcon;
```

NOTE: `reference` prop is a React ref passed from parent (`TransitionerLi`). The `useScroll` hook from framer-motion takes `target` as `RefObject`. Check actual usage in `TransitionerLi` to determine the exact element type. If uncertain, use `React.RefObject<HTMLElement>` which is the most general.

**Pattern C: LiIcon Skeleton — Named export, no props**

```tsx
import React from "react";

import "./styles.css";

export const Skeleton = (): React.JSX.Element => {
  // ...unchanged...
};
```

### Export Pattern Diversity (CRITICAL)

| Pattern | Files |
|---------|-------|
| `export default IconName` | All 55 icon components (including LiIcon) |
| `export const Skeleton` | LiIcon/skeleton |
| Barrel re-exports | icons/index |

**Preserve each pattern exactly.** Do NOT change `export const` to `export default` or vice versa.

### Barrel File Warning (CRITICAL)

The `icons/index.js` barrel re-exports 58 icons. Per CLAUDE.md Performance Anti-pattern, **importing from this barrel pulls ALL icons into the chunk**. This batch only renames it to `.ts` — do NOT change its content. Barrel cleanup is Epic 23.

Note: `AWSIcon` is exported as `Icon` (not `AWSIcon`): `export { default as Icon } from "./AWSIcon"`. **PRESERVE this exact export name.**

### Story 22-1 through 22-8 Learnings (CRITICAL)

1. **`import React from "react"` IS NEEDED** — ESLint `no-undef` rule requires it when using `React.JSX.Element`
2. **Commit strategy**: First commit = renames only via `git mv`, second commit = type annotations
3. **Jest cache**: After rename, run `npm test -- --no-cache` if tests fail with "Cannot find module"
4. **Pre-existing errors**: Typecheck errors on branch are baseline. NOT from this batch
5. **`"use client"` directive**: MUST remain as first line where present (LiIcon only)
6. **Prettier line length**: If props destructuring exceeds 80 chars, expand to multiline format
7. **Build failure baseline**: Pre-existing lint errors in story files cause `npm run build` to fail. AC4 means "zero NEW build failures"
8. **Duplicate react imports**: Consolidate into single `import React, { ... } from "react"`
9. **`extends React.SVGAttributes<SVGSVGElement>`**: Use for SVG components with rest props (Story 22-7/22-8 pattern)
10. **Default className = ""**: Always add default for optional className to prevent "undefined" in DOM (Story 22-8 code review M2)
11. **Menu.test.tsx failure**: Pre-existing from Batch B (constants.js→.ts rename). Run `npm test -- --no-cache` to clear Jest cache
12. **MASSIVE BATCH**: 57 files is the largest batch. Consider batching `git mv` operations to avoid shell command length limits
13. **`textContent = String(value)`**: When assigning number to `.textContent`, wrap with `String()` (Story 22-8 finding)

### Batch Size Strategy

This is the largest batch (57 files). Recommended approach:
1. **Rename all 57 files in a single commit** using `git mv` in batches of ~15 to avoid shell line length limits
2. **Type all Pattern A icons (53)** using a repetitive mechanical approach — all follow identical structure
3. **Type LiIcon + skeleton separately** — they have unique patterns
4. **Verify barrel re-exports** — already renamed, just check resolution

### Anti-Patterns to Avoid

- Do NOT add `React.FC` or `React.FunctionComponent` — use explicit arrow functions (project convention)
- Do NOT use `any` — define proper types
- Do NOT change barrel file re-exports — that's Epic 23
- Do NOT reorder SVG props (`{...rest}` before/after `className`) — preserve exact ordering
- Do NOT add `extends React.SVGAttributes` to LiIcon — it doesn't have rest props
- Do NOT change `export const` to `export default` or vice versa
- Do NOT fix the `Icon` vs `AWSIcon` naming in barrel — that's Epic 23

### Recommended Task Execution Order

1. **Rename all 57 files** → commit
2. **Pattern A icons** (53 files — bulk mechanical typing)
3. **LiIcon** (1 file — complex framer-motion)
4. **LiIcon skeleton** (1 file — trivial)
5. **Barrel verification** (already renamed)
6. **Validate + commit**

### Commit Strategy

Per `docs/architecture/typescript-migration.md` Section 4:
1. **First commit**: File renames only (`git mv`)
2. **Second commit**: Type annotations added
3. Branch: `migration/ts-batch-i-icons`

### Impact on Upstream Consumers

Migrating these icons to `.tsx` will **resolve all remaining cross-batch type errors** from components that import icons via direct paths. After this batch:
- All `atoms/` components will be fully TypeScript
- Latent typecheck errors from `.jsx` icon imports will be resolved
- The only remaining JS files will be in `lib/`, `shared/`, and barrel files (Batch J)

### References

- [Source: docs/architecture/typescript-migration.md#P5: Icons] — Batch I file list and strategy
- [Source: docs/architecture/typescript-migration.md#3. Migration Rules] — DO/DO NOT rules
- [Source: docs/architecture/typescript-migration.md#4. Batch Definitions] — Commit strategy, ACs
- [Source: _bmad-output/implementation-artifacts/22-8-atoms-texts-motion-barrel.md] — Story 22-8 learnings and code review fixes
- [Source: CLAUDE.md#Performance Anti-pattern] — Barrel import rules
- [Source: src/ui/atoms/icons/CalendarIcon/index.tsx] — Reference pattern for already-migrated icon

## Dev Agent Record

### Agent Model Used

—

### Debug Log References

- Commit `a6fbcd2`: Rename 57 files (.jsx→.tsx, .js→.ts) via git mv
- Commit `428c751`: Type annotations for 55 icon components + LiIcon + LiIcon/skeleton

### Completion Notes List

- Pattern A (53 icons): `IconNameProps extends React.SVGAttributes<SVGSVGElement>`, `className = ""`, `React.JSX.Element` return type; SVG prop order preserved per icon (rest before/after className as in originals)
- Pattern B: LiIcon — `LiIconProps { reference: React.RefObject<HTMLElement> }`, `"use client"`, useScroll, m.circle
- Pattern C: LiIcon/skeleton — named `export const Skeleton`, no props, return type
- Barrel `icons/index.ts`: 58 re-exports verified; AWSIcon as `Icon` preserved
- Lint: 0 new warnings; typecheck: 0 new errors in icons; tests: 99 suites, 987 passed
- Build: 0 new failures from this batch (repo baseline may have pre-existing build failures)
- IconGallery.stories.tsx: contains `any` types; out of scope for Batch I (story file, not migration target)

### File List

| # | File | Status |
|---|------|--------|
| 1 | `src/ui/atoms/icons/index.ts` | Renamed, verified |
| 2 | `src/ui/atoms/icons/ArrowIcon/index.tsx` | Renamed + typed |
| 3 | `src/ui/atoms/icons/AWSIcon/index.tsx` | Renamed + typed |
| 4 | `src/ui/atoms/icons/BashIcon/index.tsx` | Renamed + typed |
| 5 | `src/ui/atoms/icons/CheckIcon/index.tsx` | Renamed + typed |
| 6 | `src/ui/atoms/icons/ChevronDownIcon/index.tsx` | Renamed + typed |
| 7 | `src/ui/atoms/icons/CopyIcon/index.tsx` | Renamed + typed |
| 8 | `src/ui/atoms/icons/CSS3Icon/index.tsx` | Renamed + typed |
| 9 | `src/ui/atoms/icons/CucumberIcon/index.tsx` | Renamed + typed |
| 10 | `src/ui/atoms/icons/DockerIcon/index.tsx` | Renamed + typed |
| 11 | `src/ui/atoms/icons/DribbbleIcon/index.tsx` | Renamed + typed |
| 12 | `src/ui/atoms/icons/EnvelopeIcon/index.tsx` | Renamed + typed |
| 13 | `src/ui/atoms/icons/FigmaIcon/index.tsx` | Renamed + typed |
| 14 | `src/ui/atoms/icons/GitHubIcon/index.tsx` | Renamed + typed |
| 15 | `src/ui/atoms/icons/GitIcon/index.tsx` | Renamed + typed |
| 16 | `src/ui/atoms/icons/GooglePlusIcon/index.tsx` | Renamed + typed |
| 17 | `src/ui/atoms/icons/GraphQLIcon/index.tsx` | Renamed + typed |
| 18 | `src/ui/atoms/icons/HerokuIcon/index.tsx` | Renamed + typed |
| 19 | `src/ui/atoms/icons/HTML5Icon/index.tsx` | Renamed + typed |
| 20 | `src/ui/atoms/icons/JavaScriptIcon/index.tsx` | Renamed + typed |
| 21 | `src/ui/atoms/icons/JenkinsIcon/index.tsx` | Renamed + typed |
| 22 | `src/ui/atoms/icons/KafkaIcon/index.tsx` | Renamed + typed |
| 23 | `src/ui/atoms/icons/LiIcon/index.tsx` | Renamed + typed |
| 24 | `src/ui/atoms/icons/LiIcon/skeleton.tsx` | Renamed + typed |
| 25 | `src/ui/atoms/icons/LinkedInIcon/index.tsx` | Renamed + typed |
| 26 | `src/ui/atoms/icons/LinuxIcon/index.tsx` | Renamed + typed |
| 27 | `src/ui/atoms/icons/LogoIcon/index.tsx` | Renamed + typed |
| 28 | `src/ui/atoms/icons/MicrosoftIcon/index.tsx` | Renamed + typed |
| 29 | `src/ui/atoms/icons/MongoIcon/index.tsx` | Renamed + typed |
| 30 | `src/ui/atoms/icons/MoonIcon/index.tsx` | Renamed + typed |
| 31 | `src/ui/atoms/icons/NextIcon/index.tsx` | Renamed + typed |
| 32 | `src/ui/atoms/icons/NodeIcon/index.tsx` | Renamed + typed |
| 33 | `src/ui/atoms/icons/PinterestIcon/index.tsx` | Renamed + typed |
| 34 | `src/ui/atoms/icons/PostgresIcon/index.tsx` | Renamed + typed |
| 35 | `src/ui/atoms/icons/PulumiIcon/index.tsx` | Renamed + typed |
| 36 | `src/ui/atoms/icons/QuestionIcon/index.tsx` | Renamed + typed |
| 37 | `src/ui/atoms/icons/RailsIcon/index.tsx` | Renamed + typed |
| 38 | `src/ui/atoms/icons/ReactIcon/index.tsx` | Renamed + typed |
| 39 | `src/ui/atoms/icons/RedisIcon/index.tsx` | Renamed + typed |
| 40 | `src/ui/atoms/icons/ReduxIcon/index.tsx` | Renamed + typed |
| 41 | `src/ui/atoms/icons/RSpecIcon/index.tsx` | Renamed + typed |
| 42 | `src/ui/atoms/icons/RubyIcon/index.tsx` | Renamed + typed |
| 43 | `src/ui/atoms/icons/RustIcon/index.tsx` | Renamed + typed |
| 44 | `src/ui/atoms/icons/SASSIcon/index.tsx` | Renamed + typed |
| 45 | `src/ui/atoms/icons/SolidityIcon/index.tsx` | Renamed + typed |
| 46 | `src/ui/atoms/icons/StorybookIcon/index.tsx` | Renamed + typed |
| 47 | `src/ui/atoms/icons/SunIcon/index.tsx` | Renamed + typed |
| 48 | `src/ui/atoms/icons/SvelteIcon/index.tsx` | Renamed + typed |
| 49 | `src/ui/atoms/icons/TailwindIcon/index.tsx` | Renamed + typed |
| 50 | `src/ui/atoms/icons/TelegramIcon/index.tsx` | Renamed + typed |
| 51 | `src/ui/atoms/icons/TerraformIcon/index.tsx` | Renamed + typed |
| 52 | `src/ui/atoms/icons/TwitterIcon/index.tsx` | Renamed + typed |
| 53 | `src/ui/atoms/icons/TypeScriptIcon/index.tsx` | Renamed + typed |
| 54 | `src/ui/atoms/icons/UnixIcon/index.tsx` | Renamed + typed |
| 55 | `src/ui/atoms/icons/UserIcon/index.tsx` | Renamed + typed |
| 56 | `src/ui/atoms/icons/WhatsAppIcon/index.tsx` | Renamed + typed |
| 57 | `src/ui/atoms/icons/WWWIcon/index.tsx` | Renamed + typed |

### Change Log

- (implementation date): Story 22.9 implemented — Batch I icons migration (57 files, 2 commits)
- 2026-02-14: Code review — H1: Task 6.2 marked complete, validation documented; H2: File List filled (57 files); M1: Completion Notes filled; M2: Debug Log (commits), agent placeholder removed; L1: IconGallery.stories.tsx any noted; L2: build documented as 0 new failures from batch
