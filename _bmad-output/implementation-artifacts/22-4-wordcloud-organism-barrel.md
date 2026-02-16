# Story 22.4: WordCloud Organism + Barrel (Batch D)

Status: done

## Story

As a **developer maintaining this portfolio**,
I want **the WordCloud organism group and the organisms barrel file migrated from JS/JSX to TS/TSX with proper type annotations**,
so that **TypeScript strict mode catches type errors in the most complex organism (3D tag cloud, skill detail overlay, telemetry) at build time**.

## Acceptance Criteria

1. **AC1: File Rename** — All 5 JS/JSX files renamed to `.ts`/`.tsx` via `git mv` with no broken imports.
2. **AC2: Type Annotations** — Each component/module has explicit return types, typed props (where applicable), typed hook generics, and typed function parameters.
3. **AC3: No Behavior Change** — Zero functional changes. Same JSX output, same exports, same runtime behavior.
4. **AC4: Validation Suite** — All 4 commands pass:
   - `npm run lint` (zero new warnings)
   - `npm run typecheck` (zero new errors)
   - `npm test` (all tests pass)
   - `npm run build` (production build succeeds)
5. **AC5: No Forbidden Patterns** — Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. No refactoring, no import path changes.

## Tasks / Subtasks

- [x] **Task 1: Rename files** (AC: #1)
  - [x] 1.1 Create branch `migration/ts-batch-d-wordcloud-group`
  - [x] 1.2 `git mv` all 5 files (`.jsx` → `.tsx`, `.js` → `.ts`)
  - [x] 1.3 Run `npm run typecheck` — verify no resolution errors from rename alone
  - [x] 1.4 Commit rename-only: `refactor: rename Batch D files from .jsx/.js to .tsx/.ts`

- [x] **Task 2: Add types to data module** (AC: #2, #3, #5)
  - [x] 2.1 `WordCloud/data.ts` — Define and export `Technology` and `Concept` interfaces; type `CONCEPTS` array; type `getWeightClass` function

- [x] **Task 3: Add types to telemetry module** (AC: #2, #3, #5)
  - [x] 3.1 `WordCloud/telemetry.ts` — Define `TrackSkillInterestParams` interface; type `trackSkillInterest` and `matchesConcept` functions; import `Concept` type from `./data`

- [x] **Task 4: Add types to SkillDetail component** (AC: #2, #3, #5)
  - [x] 4.1 `WordCloud/SkillDetail.tsx` — Define `SkillDetailProps` interface using `Concept` type; type `useRef` generics; type event handlers; type `getFloatingStyle` return; type `getIconComponent` helper

- [x] **Task 5: Add types to WordCloud component** (AC: #2, #3, #5)
  - [x] 5.1 `WordCloud/index.tsx` — Type all `useState` generics; type all `useRef` generics; type `useCallback` parameters; handle TagCloud.js dynamic import typing

- [x] **Task 6: Rename organisms barrel** (AC: #1, #2)
  - [x] 6.1 `organisms/index.ts` — Rename only; barrel re-export syntax is already valid TypeScript

- [x] **Task 7: Commit types + validate** (AC: #4)
  - [x] 7.1 Commit type additions: `feat(ts): add TypeScript annotations to Batch D — WordCloud group`
  - [x] 7.2 Run full validation: lint (70 pre-existing stories), typecheck (48 pre-existing), tests (99 suites / 987 pass), build (fails on pre-existing story Prettier errors — confirmed identical failure on parent branch)

## Dev Notes

### Files to Migrate (5 files)

| # | File | Ext Change | Lines | Props | Return | Key Challenge |
|---|------|-----------|-------|-------|--------|---------------|
| 1 | `organisms/WordCloud/data.js` | `.ts` | 179 | None | N/A (constants) | Define `Concept` + `Technology` interfaces |
| 2 | `organisms/WordCloud/telemetry.js` | `.ts` | 90 | None | N/A (functions) | `TrackSkillInterestParams` interface |
| 3 | `organisms/WordCloud/SkillDetail.jsx` | `.tsx` | 198 | `{ skill, anchorRect, onClose }` | `React.JSX.Element \| null` | Framer Motion `m.*`, dynamic icon lookup |
| 4 | `organisms/WordCloud/index.jsx` | `.tsx` | 360 | None | `React.JSX.Element` | TagCloud.js dynamic import (no @types), many hooks |
| 5 | `organisms/index.js` | `.ts` | 31 | None | N/A (barrel) | Trivial rename |

### Files ALREADY TypeScript — NOT Migration Targets

| File | Reason |
|------|--------|
| `organisms/WordCloud/icons.ts` | Already `.ts` — re-exports 22 icon components + `ICON_MAP` |
| `organisms/WordCloud/stories/WordCloud.stories.tsx` | Already `.tsx` — Storybook story |

### Migration Rules (CRITICAL — from `docs/architecture/typescript-migration.md`)

**DO:**
- Rename `.jsx` → `.tsx` and `.js` → `.ts`
- Add return type on all components and exported functions
- Add `import React from "react"` when using `React.JSX.Element` (ESLint `no-undef`)
- Add Props interface for components with props (SkillDetail)
- Define shared types in `data.ts` where the data lives, import with `import type` elsewhere
- Preserve existing export patterns

**DO NOT:**
- Change component behavior or logic
- Refactor code structure or existing import paths
- Add `@ts-ignore`, `@ts-expect-error`, or `any`
- Change `export default` patterns
- Add/remove features or fix bugs
- Change barrel file re-exports (Epic 23)

### Typing Patterns — File-Specific

**data.ts — Shared type definitions:**
```tsx
export interface Technology {
  name: string;
  icon: string;
}

export interface Concept {
  id: string;
  label: string;
  weight: number;
  description: string;
  relatedKeywords: string[];
  technologies: Technology[];
  companies: string[];
}

export const CONCEPTS: Concept[] = [
  // ...unchanged data...
];

export const getWeightClass = (weight: number): string => {
  const sizeMap: Record<number, string> = {
    5: "word-cloud__word--xl",
    // ...unchanged...
  };
  return sizeMap[weight] || sizeMap[3];
};
```

**telemetry.ts — Function parameters:**
```tsx
import type { Concept } from "./data";

interface TrackSkillInterestParams {
  skillId: string;
  source: string;
  interaction: string;
  searchQuery?: string;
}

export const trackSkillInterest = ({
  skillId,
  source,
  interaction,
  searchQuery,
}: TrackSkillInterestParams): void => {
  // ...unchanged logic...
};

export const matchesConcept = (concept: Concept, query: string): boolean => {
  // ...unchanged logic...
};
```

**SkillDetail.tsx — Component with props + framer-motion `m`:**
```tsx
"use client";

import React from "react";
import { useEffect, useRef } from "react";
import { m } from "framer-motion";
import * as Icons from "./icons";
import type { Concept } from "./data";

interface SkillDetailProps {
  skill: Concept;
  anchorRect: DOMRect | null;
  onClose: () => void;
}

const SkillDetail = ({
  skill,
  anchorRect,
  onClose,
}: SkillDetailProps): React.JSX.Element | null => {
  const overlayRef = useRef<HTMLDivElement>(null);
  // ...unchanged logic...
};
export default SkillDetail;
```

**WordCloud/index.tsx — Complex hooks + dynamic import:**
```tsx
"use client";

import React from "react";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { AnimatePresence } from "framer-motion";
import { CONCEPTS } from "./data";
import type { Concept } from "./data";
import { trackSkillInterest } from "./telemetry";

const SkillDetail = lazy(() => import("./SkillDetail"));

const WordCloud = (): React.JSX.Element => {
  const [selectedSkill, setSelectedSkill] = useState<Concept | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedConcept, setMatchedConcept] = useState<Concept | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagCloudInstanceRef = useRef<{ destroy(): void } | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ...unchanged logic...
};
export default WordCloud;
```

**organisms/index.ts — Barrel (rename only):**
No type changes needed. `export { default as X } from "./Y"` is valid TypeScript.

### TagCloud.js Dynamic Import (CRITICAL)

TagCloud is a vanilla JS library (`"TagCloud": "^2.3.2"` in package.json). It does NOT ship types and no `@types/tagcloud` exists.

**Strategy:** Type the instance interface inline in `WordCloud/index.tsx`:

```typescript
// Minimal type for TagCloud instance — just what we use
const tagCloudInstanceRef = useRef<{ destroy(): void } | null>(null);
```

For the dynamic import itself, TypeScript infers `any` for untyped modules. Two options (dev agent should choose):

1. **Option A — Accept inference:** `const TagCloudModule = await import("TagCloud")` — TypeScript may infer `any` for the module. If strict mode complains, use Option B.

2. **Option B — Local type declaration:** Create `src/ui/organisms/WordCloud/tagcloud.d.ts`:
```typescript
declare module "TagCloud" {
  interface TagCloudInstance {
    destroy(): void;
  }
  type TagCloudFactory = (
    container: HTMLElement,
    texts: string[],
    options: Record<string, unknown>
  ) => TagCloudInstance;
  const TagCloud: TagCloudFactory;
  export default TagCloud;
}
```

**Preference:** Option A first. Only fall back to Option B if typecheck fails. A `.d.ts` file is NOT a behavior change — it's a type declaration, which is within migration scope.

### Icon Dynamic Lookup in SkillDetail (CRITICAL)

`SkillDetail` does `import * as Icons from "./icons"` then accesses `Icons[iconName]` dynamically. The `Icons` namespace contains 22 React components + `ICON_MAP` constant.

**Strategy:** Cast the namespace for dynamic access:

```typescript
const getIconComponent = (iconName: string): React.ComponentType | null => {
  const icon = (Icons as Record<string, React.ComponentType>)[iconName];
  return icon || null;
};
```

**Note:** This cast is technically imprecise (ICON_MAP is not a ComponentType) but is safe because no `data.ts` entry uses "ICON_MAP" as an icon name. This is the most minimal typing change that preserves exact runtime behavior.

### Event Handler Types in SkillDetail

- `handleEscape`: receives `KeyboardEvent` (DOM, not React — attached via `document.addEventListener`)
- `handleClickOutside`: receives `MouseEvent` (DOM, not React)
- `onClose` backdrop click: receives `React.MouseEvent<HTMLDivElement>`

```typescript
// In useEffect:
const handleEscape = (e: KeyboardEvent): void => {
  if (e.key === "Escape") onClose();
};

const handleClickOutside = (e: MouseEvent): void => {
  if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
    onClose();
  }
};
```

**Note:** `e.target` is `EventTarget | null` but `contains()` expects `Node | null`. The `as Node` cast is standard for this pattern and NOT an `any`.

### Event Handler Types in WordCloud/index.tsx

- `handleSearchChange`: receives `React.ChangeEvent<HTMLInputElement>`
- `findMatchingConcept(query: string): Concept | undefined` — `.find()` returns `T | undefined`
- `highlightConcept(concept: Concept | null): void`
- `handleSearchResultClick()`: void
- `handleCloseDetail()`: void
- `handleClearSearch()`: void
- Click handlers inside `useEffect` (DOM addEventListener): `(e: MouseEvent) => void`

### getFloatingStyle Return Type

```typescript
const getFloatingStyle = (): React.CSSProperties => {
  if (!anchorRect || typeof window === "undefined") return {};
  if (window.innerWidth < 720) return {};
  // ...returns { position: "fixed", top: `${top}px`, left: `${left}px`, width: `${cardWidth}px` }
};
```

`React.CSSProperties` covers both `{}` and the full style object. No cast needed.

### Recommended Task Execution Order

1. **data.ts FIRST** — defines shared `Concept` and `Technology` types used by all other files
2. **telemetry.ts SECOND** — imports `Concept` type from data.ts
3. **SkillDetail.tsx THIRD** — imports `Concept` type from data.ts
4. **WordCloud/index.tsx FOURTH** — imports `Concept` type from data.ts (most complex, do last)
5. **organisms/index.ts LAST** — trivial barrel rename

### Existing Tests (NONE)

No test files exist for the WordCloud group. No test modification needed.

### Storybook Stories (DO NOT MODIFY)

`WordCloud/stories/WordCloud.stories.tsx` — already TypeScript, imports from parent. Rename will NOT affect it.

### Story 22-1, 22-2, 22-3 Learnings (CRITICAL)

1. **`import React from "react"` IS NEEDED** — ESLint `no-undef` rule requires explicit React import when using `React.JSX.Element` as type annotation.
2. **Commit strategy**: First commit = renames only via `git mv`, second commit = type annotations.
3. **Jest cache**: After rename, run `npm test -- --no-cache` if tests fail with "Cannot find module" errors.
4. **Pre-existing errors**: ~35 typecheck errors in Storybook stories + 65 prettier lint errors exist on main. NOT introduced by migration.
5. **`"use client"` directive**: MUST remain as first line. WordCloud/index.jsx and SkillDetail.jsx have it; data.js and telemetry.js do NOT.
6. **Prettier line length**: If adding types to props destructuring exceeds 80 chars, expand to multiline format (see Batch C Biography/Footer pattern).
7. **Latent typecheck errors**: Icons imported from `@/atoms/icons/*` are still `.jsx` — may produce type errors from the `.tsx` consumers. Expected, resolves in Batch I.
8. **`import type` for type-only imports**: Use `import type { Concept } from "./data"` (not `import { Concept }`) to ensure zero runtime impact.

### Anti-Patterns to Avoid

- Do NOT add `React.FC` or `React.FunctionComponent` — use explicit arrow functions (project convention)
- Do NOT use `any` for TagCloud — define minimal inline type or `.d.ts`
- Do NOT change the `CONCEPTS` data array contents
- Do NOT refactor `getIconComponent` logic beyond adding types
- Do NOT change the `import * as Icons` pattern — barrel cleanup is Epic 23
- Do NOT add barrel file content changes — that's Epic 23
- Do NOT change the `eslint-disable-next-line react-hooks/exhaustive-deps` comment (line 284)

### Commit Strategy

Per `docs/architecture/typescript-migration.md` Section 4:
1. **First commit**: File renames only (`git mv`)
2. **Second commit**: Type annotations added
3. Branch: `migration/ts-batch-d-wordcloud-group`

### Project Structure Notes

- All 4 WordCloud files are in `src/ui/organisms/WordCloud/`
- 1 barrel file is at `src/ui/organisms/index.js`
- 2 files have `"use client"` directive (WordCloud/index, SkillDetail)
- 1 component takes props (SkillDetail: `skill`, `anchorRect`, `onClose`)
- Shared types live in `data.ts` (where the data is defined)
- `icons.ts` is already TypeScript — provides icon component re-exports
- Direct framer-motion imports: `AnimatePresence` in WordCloud/index, `m` in SkillDetail

### References

- [Source: docs/architecture/typescript-migration.md#P2: Organisms] — Batch D file list (WordCloud Group + Barrels)
- [Source: docs/architecture/typescript-migration.md#3. Migration Rules] — DO/DO NOT rules
- [Source: docs/architecture/typescript-migration.md#4. Batch Definitions] — Commit strategy, ACs
- [Source: _bmad-output/implementation-artifacts/22-3-content-organisms.md] — Story 22.3 learnings (Prettier line length, latent errors)
- [Source: _bmad-output/implementation-artifacts/22-2-navbar-menu-mobilemenuoverlay.md] — Story 22.2 learnings (import React, Jest cache)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Pre-existing lint errors (70 Prettier formatting issues in story files) confirmed on parent branch
- Pre-existing typecheck errors (48 total: 35 in stories + 13 latent from child .jsx) confirmed on parent branch
- Pre-existing build failure: Prettier errors in Epic 21 story files cause `Failed to compile` — confirmed identical on parent branch `migration/ts-batch-c-content-organisms`
- Jest cache: `Menu.test.tsx` failed with stale cache after organisms barrel rename; passes with `--no-cache`
- TagCloudFactory type: ESLint `no-unused-vars` triggered on type alias parameter names; fixed with `_` prefix convention
- SkillDetail icon lookup: `Icons` namespace cast requires `unknown` intermediate (`as unknown as Record<string, React.ComponentType>`)
- `e.currentTarget` in DOM addEventListener: needs `as HTMLElement` cast (EventTarget doesn't have `getBoundingClientRect`)
- `e.target` in click outside handler: needs `as Node` cast (EventTarget doesn't have `contains` method)

### Completion Notes List

- All 5 files renamed via `git mv` (commit bb4313a)
- Type annotations added (commit 591b8f0):
  - `data.ts`: `Technology` and `Concept` interfaces exported, `CONCEPTS: Concept[]`, `getWeightClass(weight: number): string`
  - `telemetry.ts`: `TrackSkillInterestParams` interface, `import type { Concept }`, typed both functions
  - `SkillDetail.tsx`: `SkillDetailProps` interface, `useRef<HTMLDivElement>`, `React.CSSProperties` return, DOM event types
  - `WordCloud/index.tsx`: `TagCloudInstance` + `TagCloudFactory` local types, all `useState<T>` generics, all `useRef<T>` generics, `React.ChangeEvent<HTMLInputElement>`, `as TagCloudFactory` for dynamic import
  - `organisms/index.ts`: Rename only, barrel syntax valid as-is
- Added `import React from "react"` to SkillDetail.tsx and WordCloud/index.tsx (ESLint `no-undef`)
- Added `import type { Concept } from "./data"` to telemetry.ts, SkillDetail.tsx, WordCloud/index.tsx
- Prettier fixes: multiline for `getIconComponent` param, `overlayRef.current` condition, `e.currentTarget as HTMLElement` cast
- `findMatchingConcept` returns `Concept | undefined` (from `.find()`); callers use `|| null` to normalize to `Concept | null`
- Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error` introduced
- Zero behavior changes — JSX output identical
- Tests: 99 suites, 987 tests — all passing (with `--no-cache`)

### Code Review Fixes

- **[M1]** Added explicit return type `: Concept | undefined` to `findMatchingConcept` in `index.tsx:54`; changed early return from `null` to `undefined`; reformatted useCallback body indentation for Prettier compliance
- **[M2]** Noted: commit `bb4313a` mixed story file creation with `git mv` renames. Cannot rewrite history without force push. Deviation from atomic commit policy documented.
- **[L1]** `matchesConcept` in `telemetry.ts:75` is dead code — exported but never imported. Pre-existing, not introduced by migration. Documented as tech debt for future cleanup.
- **[L2]** Tightened `TrackSkillInterestParams.source` and `.interaction` from `string` to string literal unions matching actual usage: `"search" | "cloud" | "browse"` and `"hover" | "tap" | "click" | "highlight"`
- **[L3]** Pre-existing typecheck errors count: 48 total (35 in `.stories.tsx` files + 13 latent from child `.jsx` consumers). Zero new errors from Batch D.

### File List

- `src/ui/organisms/WordCloud/data.ts` (renamed from .js, typed, exports Technology + Concept interfaces)
- `src/ui/organisms/WordCloud/telemetry.ts` (renamed from .js, typed, TrackSkillInterestParams interface)
- `src/ui/organisms/WordCloud/SkillDetail.tsx` (renamed from .jsx, typed, SkillDetailProps interface)
- `src/ui/organisms/WordCloud/index.tsx` (renamed from .jsx, typed, TagCloudInstance + TagCloudFactory local types)
- `src/ui/organisms/index.ts` (renamed from .js, no type changes needed)
