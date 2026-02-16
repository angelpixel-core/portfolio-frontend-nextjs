# Story 22.3: Content Organisms (Batch C)

Status: done

## Story

As a **developer maintaining this portfolio**,
I want **all Content-group organisms migrated from JSX to TSX with proper type annotations**,
so that **TypeScript strict mode catches type errors across the about/home page sections at build time**.

## Acceptance Criteria

1. **AC1: File Rename** — All 11 JSX files renamed to `.tsx` via `git mv` with no broken imports.
2. **AC2: Type Annotations** — Each component has explicit return type (`React.JSX.Element` or `React.JSX.Element | null`), typed props (where applicable), and typed hook destructuring.
3. **AC3: No Behavior Change** — Zero functional changes. Same JSX output, same exports, same runtime behavior.
4. **AC4: Validation Suite** — All 4 commands pass:
   - `npm run lint` (zero new warnings)
   - `npm run typecheck` (zero new errors)
   - `npm test` (all tests pass)
   - `npm run build` (production build succeeds)
5. **AC5: No Forbidden Patterns** — Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. No refactoring, no import path changes.

## Tasks / Subtasks

- [x] **Task 1: Rename files** (AC: #1)
  - [x] 1.1 Create branch `migration/ts-batch-c-content-organisms`
  - [x] 1.2 `git mv` all 11 files (`.jsx` -> `.tsx`)
  - [x] 1.3 Run `npm run typecheck` — verify no resolution errors from rename alone
  - [x] 1.4 Commit rename-only: `refactor: rename Batch C files from .jsx to .tsx`

- [x] **Task 2: Add types to skeleton files** (AC: #2, #3, #5)
  - [x] 2.1 `Academics/skeleton.tsx` — Named export, no props, return `React.JSX.Element`
  - [x] 2.2 `Biography/skeletons.tsx` — Named export, no props, return `React.JSX.Element`
  - [x] 2.3 `ExperienceStats/skeleton.tsx` — Named export, no props, return `React.JSX.Element`
  - [x] 2.4 `Experiences/skeleton.tsx` — Named export, no props, return `React.JSX.Element`
  - [x] 2.5 `Hiring/skeleton.tsx` — Named export, no props, return `React.JSX.Element`
  - [x] 2.6 `Skills/skeleton.tsx` — Named export, no props, return `React.JSX.Element`

- [x] **Task 3: Add types to main components** (AC: #2, #3, #5)
  - [x] 3.1 `Biography/index.tsx` — Props interface `BiographyProps { showTitle?: boolean }`, return `React.JSX.Element`, `"use client"` stays first
  - [x] 3.2 `ExperienceStats/index.tsx` — No props, return `React.JSX.Element`, `"use client"` stays first
  - [x] 3.3 `Hiring/index.tsx` — No props, return `React.JSX.Element`, NO `"use client"` (component is SSR-compatible)
  - [x] 3.4 `Skills/index.tsx` — No props, return `React.JSX.Element`, `"use client"` stays first
  - [x] 3.5 `Footer/index.tsx` — Props interface `FooterProps { whatsAppText?: string }`, return `React.JSX.Element`, NO `"use client"`

- [x] **Task 4: Commit types + validate** (AC: #4)
  - [x] 4.1 Commit type additions: `feat(ts): add TypeScript annotations to Batch C — Content organisms`
  - [x] 4.2 Run full validation: lint (65 pre-existing stories), typecheck (48 = 35 stories + 13 latent child .jsx), tests (99 suites / 987 pass), build (compiled successfully)

## Dev Notes

### Files to Migrate (11 JSX files)

| # | File | Type | Props | Return | Hooks | Key Notes |
|---|------|------|-------|--------|-------|-----------|
| 1 | `organisms/Academics/skeleton.jsx` | Skeleton | None | `JSX.Element` | None | Named export `AcademicsSkeleton` |
| 2 | `organisms/Biography/index.jsx` | Component | `{ showTitle?: boolean }` | `JSX.Element` | `useProfile(1)` | `"use client"`, default prop value |
| 3 | `organisms/Biography/skeletons.jsx` | Skeleton | None | `JSX.Element` | None | Named export `BiographySkeleton` |
| 4 | `organisms/ExperienceStats/index.jsx` | Component | None | `JSX.Element` | `useExperienceStats()` | `"use client"`, destructures `{ number, subtitle }` in map |
| 5 | `organisms/ExperienceStats/skeleton.jsx` | Skeleton | None | `JSX.Element` | None | Named export `ExtraInfoListSkeleton` |
| 6 | `organisms/Experiences/skeleton.jsx` | Skeleton | None | `JSX.Element` | None | Named export `Skeleton`, no styles import |
| 7 | `organisms/Hiring/index.jsx` | Component | None | `JSX.Element` | None | Uses `Suspense`, NO `"use client"` |
| 8 | `organisms/Hiring/skeleton.jsx` | Skeleton | None | `JSX.Element` | None | Named export `Skeleton`, trivial |
| 9 | `organisms/Skills/index.jsx` | Component | None | `JSX.Element` | `useTechnologies()` | `"use client"`, framer-motion props passed to `Skill` |
| 10 | `organisms/Skills/skeleton.jsx` | Skeleton | None | `JSX.Element` | None | Named export `SkillsListSkeleton` |
| 11 | `organisms/Footer/index.jsx` | Component | `{ whatsAppText?: string }` | `JSX.Element` | None | NO `"use client"`, composes molecules |

### Files ALREADY TypeScript — NOT Migration Targets

These files are in the Content Group but are already `.tsx`. **Do NOT touch them:**

| File | Reason |
|------|--------|
| `organisms/Academics/index.tsx` | Already migrated |
| `organisms/Experiences/index.tsx` | Already migrated |
| `organisms/Footer/FooterChatColumn.tsx` | Already migrated |

### Migration Rules (CRITICAL — from `docs/architecture/typescript-migration.md`)

**DO:**
- Rename `.jsx` -> `.tsx`
- Add return type `React.JSX.Element` on all components
- Add `import React from "react"` when using `React.JSX.Element` (ESLint `no-undef`)
- Add Props interface for components with props (Biography, Footer)
- Preserve existing export pattern (named export for skeletons, default export for components)

**DO NOT:**
- Change component behavior or logic
- Refactor code structure or import paths
- Add `@ts-ignore`, `@ts-expect-error`, or `any`
- Change `export default` patterns
- Add/remove features or fix bugs
- Replace Redux hooks (none used in these files)

### Typing Patterns — Component-Specific

**Skeletons (no props, named export):**
```tsx
import React from "react";
// ...existing imports...

export const SkeletonName = (): React.JSX.Element => {
  // ...unchanged logic...
};
```

**Components with props (Biography, Footer):**
```tsx
import React from "react";
// ...existing imports...

interface BiographyProps {
  showTitle?: boolean;
}

const Biography = ({ showTitle = false }: BiographyProps): React.JSX.Element => {
  // ...unchanged logic...
};
export default Biography;
```

```tsx
import React from "react";
// ...existing imports...

interface FooterProps {
  whatsAppText?: string;
}

const Footer = ({ whatsAppText = "Direct Message!" }: FooterProps): React.JSX.Element => {
  // ...unchanged logic...
};
export default Footer;
```

**Components without props (ExperienceStats, Hiring, Skills):**
```tsx
import React from "react";
// ...existing imports...

const ComponentName = (): React.JSX.Element => {
  // ...unchanged logic...
};
export default ComponentName;
```

### Hooks Already Typed — No Changes Needed

| Hook | Source | Notes |
|------|--------|-------|
| `useProfile` | `@/domains/profile/queries` | Takes numeric ID: `useProfile(1)` |
| `useExperienceStats` | `@/domains/experience-stat/queries` | No params |
| `useTechnologies` | `@/domains/technology/queries` | No params |

All domain hooks are already TypeScript — they return typed data. No additional typing needed for hook calls.

### Framer Motion Note (Skills/index.jsx)

Skills passes `initial`, `whileHover`, `whileInView`, `viewport` props to the `Skill` molecule. These are **passed through as props** — Skills does NOT import framer-motion directly. No framer-motion typing needed in this file. The `Skill` molecule is responsible for its own prop types.

### Existing Tests (DO NOT MODIFY unless path references break)

| Test File | Status |
|-----------|--------|
| `Skills/__tests__/Skills.test.tsx` | TypeScript, imports `../index` (no extension) — NO change needed |

No other test files exist for the Content group. NavBar, MobileMenuOverlay, MenuFloatingClient tests (from Story 22-2) are unrelated and must not be touched.

### Storybook Stories (DO NOT MODIFY)

Stories exist for: Academics, Biography, ExperienceStats, Experiences, Hiring, Skills. These import from barrel files or domain mocks — renames will NOT affect them. No story updates needed.

### Story 22-1 and 22-2 Learnings (CRITICAL)

1. **`import React from "react"` IS NEEDED** — ESLint `no-undef` rule requires explicit React import when using `React.JSX.Element` as type annotation.
2. **Commit strategy**: First commit = renames only via `git mv`, second commit = type annotations.
3. **Jest cache**: After `.jsx` → `.tsx` rename, run `npm test -- --no-cache` if tests fail with "Cannot find module" errors.
4. **Pre-existing errors**: ~39 typecheck errors in Storybook stories + 65 prettier lint errors exist on main. NOT introduced by migration.
5. **`"use client"` directive**: MUST remain as first line in files that have it. Only 3 of 9 files have it (Biography, ExperienceStats, Skills).
6. **Latent typecheck errors**: Child components still in `.jsx` (e.g., ParagraphText, ExtraInfo, Skill) may produce type errors when parent is `.tsx`. These are expected and resolve when those files migrate in Batch E/F.

### Anti-Patterns to Avoid

- Do NOT add `React.FC` or `React.FunctionComponent` — use explicit arrow functions (project convention)
- Do NOT type `Suspense` generics in Hiring — it works as-is
- Do NOT create shared Props types across files — each file is self-contained
- Do NOT change the `skills.find(s => s.name === "WWW")` logic in Skills
- Do NOT change `whatsAppText` default value string in Footer
- Do NOT add barrel file changes — that's Epic 23

### Commit Strategy

Per `docs/architecture/typescript-migration.md` Section 4:
1. **First commit**: File renames only (`git mv`)
2. **Second commit**: Type annotations added
3. Branch: `migration/ts-batch-c-content-organisms`

### Project Structure Notes

- All 9 files are in `src/ui/organisms/` subdirectories
- 3 components have `"use client"` directive (Biography, ExperienceStats, Skills)
- 2 components take props (Biography: `showTitle`, Footer: `whatsAppText`)
- 6 files are skeletons with named exports
- 3 files are main components with default exports
- No Redux usage in any of these files
- No direct framer-motion imports in any of these files

### References

- [Source: docs/architecture/typescript-migration.md#P2: Organisms] — Batch C file list (Content Group)
- [Source: docs/architecture/typescript-migration.md#3. Migration Rules] — DO/DO NOT rules
- [Source: docs/architecture/typescript-migration.md#4. Batch Definitions] — Commit strategy, ACs
- [Source: _bmad-output/implementation-artifacts/22-1-app-router-pages-providers.md] — Story 22.1 learnings
- [Source: _bmad-output/implementation-artifacts/22-2-navbar-menu-mobilemenuoverlay.md] — Story 22.2 learnings (import React, Jest cache, latent errors)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Pre-existing lint errors (65 prettier formatting issues in story files) confirmed on main
- Pre-existing typecheck errors (35 in Storybook story files) confirmed on main
- 6 latent typecheck errors from child components still in .jsx (HistorySkeleton, ParagraphSkeleton x4, Copyright children) — will resolve in Batch E-H
- 2 latent typecheck errors from Skill molecule props (whileInView, viewport) — will resolve in Batch E/F
- Prettier formatting required for Biography and Footer props destructuring (line length > 80 chars)

### Completion Notes List

- All 11 files renamed `.jsx` → `.tsx` via `git mv` (commit e729991)
- Type annotations added: `React.JSX.Element` return types, `BiographyProps`, `FooterProps` interfaces
- Added `import React from "react"` to all 11 files (required by ESLint `no-undef` for `React.JSX.Element`)
- Hiring component: merged `import { Suspense } from "react"` into `import React, { Suspense } from "react"`
- Prettier fix: expanded props destructuring to multiline for Biography and Footer (line length compliance)
- Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error` introduced
- Zero behavior changes — JSX output identical
- Tests: 99 suites, 987 tests — all passing
- No new test files needed (migration is rename + type only, existing Skills test passes)

**Code Review Fixes (adversarial review):**
- M1: Fixed file count inconsistency — story AC1 and table header said "9 files" but 11 were actually migrated. Updated to "11".
- L1: Hiring import order change acknowledged — `import React, { Suspense }` moved before CSS import. Follows established Batch B pattern, no functional impact.
- L2: Fixed Dev Notes table — added missing Hiring/skeleton.jsx and Skills/skeleton.jsx entries (rows 8 and 10).

### File List

- `src/ui/organisms/Academics/skeleton.tsx` (renamed from .jsx, typed)
- `src/ui/organisms/Biography/index.tsx` (renamed from .jsx, typed, BiographyProps interface)
- `src/ui/organisms/Biography/skeletons.tsx` (renamed from .jsx, typed)
- `src/ui/organisms/ExperienceStats/index.tsx` (renamed from .jsx, typed)
- `src/ui/organisms/ExperienceStats/skeleton.tsx` (renamed from .jsx, typed)
- `src/ui/organisms/Experiences/skeleton.tsx` (renamed from .jsx, typed)
- `src/ui/organisms/Footer/index.tsx` (renamed from .jsx, typed, FooterProps interface)
- `src/ui/organisms/Hiring/index.tsx` (renamed from .jsx, typed)
- `src/ui/organisms/Hiring/skeleton.tsx` (renamed from .jsx, typed)
- `src/ui/organisms/Skills/index.tsx` (renamed from .jsx, typed)
- `src/ui/organisms/Skills/skeleton.tsx` (renamed from .jsx, typed)
