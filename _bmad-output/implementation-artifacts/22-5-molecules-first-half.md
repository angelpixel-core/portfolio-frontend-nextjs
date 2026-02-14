# Story 22.5: Molecules First Half — Batch E (A-M)

Status: in-progress

## Story

As a **developer maintaining this portfolio**,
I want **the first half of molecule components (A-M alphabetically) migrated from JSX to TSX with proper type annotations**,
so that **TypeScript strict mode catches type errors in these 18 presentation components at build time**.

## Acceptance Criteria

1. **AC1: File Rename** — All 18 `.jsx` files renamed to `.tsx` via `git mv` with no broken imports.
2. **AC2: Type Annotations** — Each component has explicit return types, typed props interfaces (where applicable), typed hook generics, and typed function parameters.
3. **AC3: No Behavior Change** — Zero functional changes. Same JSX output, same exports, same runtime behavior.
4. **AC4: Validation Suite** — All 4 commands pass:
   - `npm run lint` (zero new warnings)
   - `npm run typecheck` (zero new errors)
   - `npm test` (all tests pass)
   - `npm run build` (production build succeeds)
5. **AC5: No Forbidden Patterns** — Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`. No refactoring, no import path changes.

## Tasks / Subtasks

- [ ] **Task 1: Rename all 18 files** (AC: #1)
  - [ ] 1.1 Create branch `migration/ts-batch-e-molecules-1`
  - [ ] 1.2 `git mv` all 18 `.jsx` files to `.tsx`
  - [ ] 1.3 Run `npm run typecheck` — verify no resolution errors from rename
  - [ ] 1.4 Commit: `refactor: rename Batch E files from .jsx to .tsx`

- [ ] **Task 2: Type skeleton files (7 files, trivial)** (AC: #2, #3, #5)
  - [ ] 2.1 `Author/skeleton.tsx` — No props, add `React.JSX.Element` return
  - [ ] 2.2 `Copyright/skeleton.tsx` — No props, add `React.JSX.Element` return
  - [ ] 2.3 `Education/skeleton.tsx` — No props, named export `EducationSkeleton`, add return type
  - [ ] 2.4 `Experience/skeleton.tsx` — No props, named export `Skeleton`, add return type
  - [ ] 2.5 `ExtraInfo/skeleton.tsx` — No props, named export function `ExtraInfoSkeleton`, add return type
  - [ ] 2.6 `Education/skeleton.tsx` has inline `props` object — type it with `Record<string, string>`
  - [ ] 2.7 All skeletons: add `import React from "react"` if using `React.JSX.Element`

- [ ] **Task 3: Type simple no-props components (5 files)** (AC: #2, #3, #5)
  - [ ] 3.1 `Author/index.tsx` — No props, return type `React.JSX.Element`
  - [ ] 3.2 `Author/Link.tsx` — No props, uses `useProfile(1)` (already typed), return type
  - [ ] 3.3 `Copyright/Text.tsx` — No props, uses `useProfile(1)`, return type
  - [ ] 3.4 `Logo/index.tsx` — No props, return type
  - [ ] 3.5 `CustomersSlider/index.tsx` — No props, uses `getSliderCustomers()` (returns `SliderCustomersModel`), return type

- [ ] **Task 4: Type components with simple props (4 files)** (AC: #2, #3, #5)
  - [ ] 4.1 `Copyright/index.tsx` — Props: `{ children: React.ReactNode }`, define `CopyrightProps`
  - [ ] 4.2 `ExtraInfo/index.tsx` — Props: `{ number: number; subtitle: string }`, define `ExtraInfoProps`
  - [ ] 4.3 `AnimatedChildren/index.tsx` — Props: `{ children: React.ReactNode }`, define `AnimatedChildrenProps`
  - [ ] 4.4 `FeaturedArticle/index.tsx` — Named export, props: `{ props: { img: string; title: string; time: string; summary: string; link: string } }`, define `FeaturedArticleInnerProps` and `FeaturedArticleProps`

- [ ] **Task 5: Type components with complex props or hooks (2 files)** (AC: #2, #3, #5)
  - [ ] 5.1 `Hero/index.tsx` — Two components: `HeroContent` and `Hero`. Define `HeroContentProps: { name?: string; size: string; sizes: string; className: string; imageSrc?: string }`. `Hero` wraps with SectionErrorBoundary, spreads props. Type `useProfile(1)` return (already typed)
  - [ ] 5.2 `LogoMenuTrigger/index.tsx` — No props, but type `handleClick(e: React.MouseEvent<HTMLButtonElement>): void`. Uses `useMenuPanel()` (already typed). Type `useRef<HTMLDivElement>(null)` — wait, no ref in this file. Just type the event handler.

- [ ] **Task 6: Type components with framer-motion** (2 files) (AC: #2, #3, #5)
  - [ ] 6.1 `MovingImage/index.tsx` — Named export. Props: `{ title: string; img: string; link: string }`, define `MovingImageProps`. Type `useMotionValue`, `useRef<HTMLImageElement>(null)`, `handleMouse(event: React.MouseEvent): void`, `handleMouseLeave(): void`
  - [ ] 6.2 `HireMe/index.tsx` — No props. Type `useRef<HTMLDivElement>(null)`, `useState<boolean>(false)`, `useState<number>(0)`. Type `handleScroll` as inner function, `dynamicStyle` as `React.CSSProperties`

- [ ] **Task 7: Commit types + validate** (AC: #4)
  - [ ] 7.1 Commit: `feat(ts): add TypeScript annotations to Batch E — Molecules first half`
  - [ ] 7.2 Run full validation: lint, typecheck, tests (`npm test -- --no-cache`), build

## Dev Notes

### Files to Migrate (18 files)

| # | File | Lines | Props | Key Challenge |
|---|------|-------|-------|---------------|
| 1 | `AnimatedChildren/index.jsx` | 33 | `{ children }` | `React.ReactNode` children type |
| 2 | `Author/index.jsx` | 18 | None | Trivial |
| 3 | `Author/Link.jsx` | 30 | None | `useProfile` return type already typed |
| 4 | `Author/skeleton.jsx` | 7 | None | Trivial |
| 5 | `Copyright/index.jsx` | 19 | `{ children }` | `React.ReactNode` children type |
| 6 | `Copyright/Text.jsx` | 19 | None | `useProfile` return type already typed |
| 7 | `Copyright/skeleton.jsx` | 5 | None | Trivial — zero imports |
| 8 | `CustomersSlider/index.jsx` | 54 | None | `getSliderCustomers()` return already typed |
| 9 | `Education/skeleton.jsx` | 18 | None | Named export, inline `props` object |
| 10 | `Experience/skeleton.jsx` | 22 | None | Named export |
| 11 | `ExtraInfo/index.jsx` | 17 | `{ number, subtitle }` | Simple numeric + string props |
| 12 | `ExtraInfo/skeleton.jsx` | 15 | None | Named export function (not arrow) |
| 13 | `FeaturedArticle/index.jsx` | 40 | `{ props }` | Nested destructure pattern |
| 14 | `Hero/index.jsx` | 54 | `{ name, size, sizes, className, imageSrc }` | Two components in one file, optional props |
| 15 | `HireMe/index.jsx` | 93 | None | `useRef`, `useState`, DOM event handlers, `React.CSSProperties` |
| 16 | `Logo/index.jsx` | 24 | None | Trivial |
| 17 | `LogoMenuTrigger/index.jsx` | 47 | None | `handleClick` event type |
| 18 | `MovingImage/index.jsx` | 57 | `{ title, img, link }` | `useMotionValue`, `useRef` for img, mouse events |

### Files ALREADY TypeScript — NOT Migration Targets

| File | Reason |
|------|--------|
| `Education/__tests__/Education.test.tsx` | Test file — already `.tsx` |
| `Education/stories/Education.stories.tsx` | Story file — already `.tsx` |
| `Experience/__tests__/Experience.test.tsx` | Test file — already `.tsx` |
| `Experience/stories/Experience.stories.tsx` | Story file — already `.tsx` |
| `HireMe/stories/HireMe.stories.tsx` | Story file — already `.tsx` |
| `Logo/stories/Logo.stories.tsx` | Story file — already `.tsx` |

### Migration Rules (CRITICAL — from `docs/architecture/typescript-migration.md`)

**DO:**
- Rename `.jsx` → `.tsx`
- Add return type on all components and exported functions
- Add `import React from "react"` when using `React.JSX.Element` (ESLint `no-undef`)
- Add Props interface for components with props
- Preserve existing export patterns (default vs named)
- Use `import type` for type-only imports

**DO NOT:**
- Change component behavior or logic
- Refactor code structure or existing import paths
- Add `@ts-ignore`, `@ts-expect-error`, or `any`
- Change `export default` patterns
- Add/remove features or fix bugs
- Change barrel file re-exports (Epic 23)

### Typing Patterns — File-Specific

**Skeleton files (trivial — no props):**
```tsx
import React from "react";

const Skeleton = (): React.JSX.Element => {
  return <span className="author_link--disabled">?BRAND?</span>;
};
export default Skeleton;
```

**Copyright/skeleton.tsx (zero imports — special case):**
```tsx
import React from "react";

const Skeleton = (): React.JSX.Element => {
  return <>???</>;
};
export default Skeleton;
```

**Named export skeletons (Education, Experience, ExtraInfo):**
```tsx
import React from "react";
// ...existing imports...

export const EducationSkeleton = (): React.JSX.Element => {
  // ...unchanged...
};
```
Note: `ExtraInfo/skeleton.jsx` uses `export function` syntax — preserve it:
```tsx
export function ExtraInfoSkeleton(): React.JSX.Element {
  // ...unchanged...
}
```

**Components with `{ children }` props:**
```tsx
import React from "react";

interface CopyrightProps {
  children: React.ReactNode;
}

const Copyright = ({ children }: CopyrightProps): React.JSX.Element => {
  // ...unchanged...
};
export default Copyright;
```

**ExtraInfo/index.tsx — Simple props:**
```tsx
import React from "react";

interface ExtraInfoProps {
  number: number;
  subtitle: string;
}

const ExtraInfo = ({ number, subtitle }: ExtraInfoProps): React.JSX.Element => {
  // ...unchanged...
};
export default ExtraInfo;
```

**FeaturedArticle/index.tsx — Nested props pattern (CRITICAL):**

This component has an unusual pattern: `({ props })` where `props` is destructured inside. Preserve this exact pattern:
```tsx
import React from "react";

interface FeaturedArticleInnerProps {
  img: string;
  title: string;
  time: string;
  summary: string;
  link: string;
}

interface FeaturedArticleProps {
  props: FeaturedArticleInnerProps;
}

export const FeaturedArticle = ({
  props,
}: FeaturedArticleProps): React.JSX.Element => {
  const { img, title, time, summary, link } = props;
  // ...unchanged...
};
```

**Hero/index.tsx — Two components in one file:**
```tsx
import React from "react";

interface HeroContentProps {
  name?: string;
  size: string;
  sizes: string;
  className: string;
  imageSrc?: string;
}

const HeroContent = ({
  name,
  size,
  sizes,
  className,
  imageSrc,
}: HeroContentProps): React.JSX.Element => {
  // ...unchanged...
};

const Hero = (props: HeroContentProps): React.JSX.Element => {
  return (
    <SectionErrorBoundary sectionName="Profile">
      <HeroContent {...props} />
    </SectionErrorBoundary>
  );
};
export default Hero;
```

**HireMe/index.tsx — Hooks + DOM events:**
```tsx
import React from "react";
import { useState, useEffect, useRef } from "react";

const HireMe = (): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [offsetFromBottom, setOffsetFromBottom] = useState(0);

  // In useEffect:
  const handleScroll = (): void => {
    // ...unchanged...
    const buttonHeight = containerRef.current?.offsetHeight || 96;
    // ...unchanged...
  };

  const dynamicStyle: React.CSSProperties = isAtFooter
    ? { bottom: `${16 + offsetFromBottom}px` }
    : {};
  // ...unchanged...
};
```

**LogoMenuTrigger/index.tsx — Event handler typing:**
```tsx
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  toggleMenuPanel();
};
```

**MovingImage/index.tsx — framer-motion + ref:**
```tsx
import React from "react";
import { useMotionValue } from "framer-motion";
import { useRef } from "react";

interface MovingImageProps {
  title: string;
  img: string;
  link: string;
}

export const MovingImage = ({
  title,
  img,
  link,
}: MovingImageProps): React.JSX.Element => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgRef = useRef<HTMLImageElement>(null);
  // ...

  const handleMouse = (event: React.MouseEvent): void => {
    if (shouldReduceMotion) return;
    imgRef.current!.style.display = "inline-block";
    // Note: imgRef.current! is acceptable here because the handler only fires
    // when the element exists (it's on the same Link that contains the image)
    // ...unchanged...
  };

  const handleMouseLeave = (): void => {
    if (shouldReduceMotion) return;
    imgRef.current!.style.display = "none";
    // ...unchanged...
  };
};
```

**CRITICAL NOTE on MovingImage imgRef:** The existing code does `imgRef.current.style.display = "..."` without null check. Options:
1. Use non-null assertion `imgRef.current!.style.display` — safe because handler fires only when element exists
2. Add optional chain `imgRef.current?.style.display` — changes behavior (silently skips instead of throwing)

**Prefer option 1** (`!`) to maintain exact runtime behavior. This is NOT an `any` — it's a controlled assertion.

### Author/Link.tsx — Naming Collision

This file exports `const Link` which shadows `next/link`'s `Link`. The existing code imports `{ default as NextLink } from "next/link"` to avoid collision. No typing issue — just be aware of the naming.

### `useProfile` Return Types

`useProfile(1)` returns `UseQueryResult<ProfileModel, Error>`. The `data` property is `ProfileModel | undefined`. The existing code handles this with `isLoading`/`isError` guards. No additional typing needed — React Query hooks are already fully typed.

### `getSliderCustomers` Return Type

`getSliderCustomers()` already returns `SliderCustomersModel` (typed in `src/domains/customer/model/mock.ts`). No additional typing needed in `CustomersSlider`.

### Export Pattern Diversity (CRITICAL)

| Pattern | Files |
|---------|-------|
| `export default ComponentName` | Author/index, Author/skeleton, Author/Link, Copyright/index, Copyright/Text, Copyright/skeleton, AnimatedChildren, CustomersSlider, Hero, HireMe, Logo, LogoMenuTrigger |
| `export const ComponentName` | FeaturedArticle, MovingImage |
| `export const NamedExport` | Education/skeleton (`EducationSkeleton`), Experience/skeleton (`Skeleton`) |
| `export function NamedExport` | ExtraInfo/skeleton (`ExtraInfoSkeleton`) |

**Preserve each pattern exactly.** Do NOT change `export const` to `export default` or vice versa.

### Story 22-1 through 22-4 Learnings (CRITICAL)

1. **`import React from "react"` IS NEEDED** — ESLint `no-undef` rule requires it when using `React.JSX.Element`
2. **Commit strategy**: First commit = renames only via `git mv`, second commit = type annotations
3. **Jest cache**: After rename, run `npm test -- --no-cache` if tests fail with "Cannot find module"
4. **Pre-existing errors**: ~48 typecheck errors (35 stories + 13 latent) exist on branch. NOT from this batch.
5. **`"use client"` directive**: MUST remain as first line where present
6. **Prettier line length**: If props destructuring exceeds 80 chars, expand to multiline format
7. **Latent typecheck errors**: Atoms imported from `@/atoms/*` are still `.jsx` — may produce type errors. Expected, resolves in Batch G-I.
8. **`import type` for type-only imports**: Use when importing only types
9. **Non-null assertion `!`**: Acceptable for ref access where element existence is guaranteed by component lifecycle. NOT the same as `any`.
10. **Code review M1 fix**: Always add explicit return types even on private callbacks for consistency

### Anti-Patterns to Avoid

- Do NOT add `React.FC` or `React.FunctionComponent` — use explicit arrow functions (project convention)
- Do NOT use `any` — define proper types
- Do NOT change the nested `{ props }` pattern in FeaturedArticle
- Do NOT add null checks to MovingImage `imgRef.current.style` — use `!` assertion instead
- Do NOT change `export function` to arrow in ExtraInfo/skeleton
- Do NOT change barrel file re-exports — that's Epic 23

### Recommended Task Execution Order

1. **Rename all 18 files** → commit
2. **Skeleton files** (7 files — trivial, no logic)
3. **No-props components** (5 files — just add return type)
4. **Simple props** (4 files — add interface + return type)
5. **Complex props/hooks** (2 files — Hero with two components, HireMe with DOM events)
6. **Framer-motion** (2 files — MovingImage needs ref typing + mouse events)
7. **Validate + commit**

### Commit Strategy

Per `docs/architecture/typescript-migration.md` Section 4:
1. **First commit**: File renames only (`git mv`)
2. **Second commit**: Type annotations added
3. Branch: `migration/ts-batch-e-molecules-1`

### References

- [Source: docs/architecture/typescript-migration.md#P3: Molecules] — Batch E file list
- [Source: docs/architecture/typescript-migration.md#3. Migration Rules] — DO/DO NOT rules
- [Source: docs/architecture/typescript-migration.md#4. Batch Definitions] — Commit strategy, ACs
- [Source: _bmad-output/implementation-artifacts/22-4-wordcloud-organism-barrel.md] — Story 22-4 learnings (return types, Prettier, assertions)
- [Source: _bmad-output/implementation-artifacts/22-3-content-organisms.md] — Story 22-3 learnings (Prettier, latent errors)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
