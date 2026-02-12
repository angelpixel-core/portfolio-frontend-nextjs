# TypeScript Migration Plan

> Reference document for the systematic migration of 170 JavaScript files to TypeScript.
> Part of [Epic 20 — Component & Style Architecture](../../_bmad-output/implementation-artifacts/epic-20-component-style-architecture.md).

---

## Table of Contents

1. [Current State & Migration Scope](#1-current-state--migration-scope)
2. [Priority Tiers](#2-priority-tiers)
3. [Migration Rules](#3-migration-rules)
4. [Batch Definitions & Execution Plan](#4-batch-definitions--execution-plan)
5. [Codemod Specification](#5-codemod-specification)
6. [Rollback Strategy](#6-rollback-strategy)
7. [Risk Assessment & Known Challenges](#7-risk-assessment--known-challenges)
8. [Out of Scope](#8-out-of-scope)

---

## 1. Current State & Migration Scope

### Adoption Summary

| Metric | Count | Percentage |
|--------|-------|-----------|
| TypeScript files (.ts/.tsx, non-test) | ~199 | **57%** |
| JavaScript files (.js/.jsx) | ~170 | **43%** |
| Test files (.test.ts/.test.tsx) | 96 | — |
| Type definition files (.types.ts) | 5 | — |

TypeScript is the **majority language**, but 170 JS/JSX files remain — almost entirely in the UI layer.

### Breakdown by Layer

| Layer | .js | .jsx | Total JS | .ts | .tsx | Total TS | Notes |
|-------|-----|------|----------|-----|------|----------|-------|
| `src/ui/atoms/` | 7 barrels | ~80 | ~87 | ~5 | ~55 | ~60 | Icons = 58 files alone |
| `src/ui/molecules/` | 1 barrel | ~34 | ~35 | ~2 | ~10 | ~12 | Includes sub-files (Author/Link, Copyright/Text) |
| `src/ui/organisms/` | 3 (barrels+data) | ~22 | ~25 | ~3 | ~4 | ~7 | Menu group = tightly coupled |
| `src/ui/overlays/` | 1 barrel | 0 | 1 | 0 | 2 | 2 | Components already .tsx |
| `src/ui/shared/` | 1 barrel | 1 | 2 | 0 | 0 | 0 | Skeleton utilities |
| `src/app/` | 0 | 7 | 7 | ~4 | ~9 | ~13 | Pages + layouts |
| `src/providers/` | 1 barrel | 1 | 2 | 0 | 1 | 1 | RootProvider |
| `src/lib/` | 6 | 0 | 6 | ~5 | 0 | ~5 | Utils, httpRequest, social-urls |
| `src/domains/` | 0 | 0 | 0 | ~40 | 0 | ~40 | **100% TypeScript** |
| `src/hooks/` | 0 | 0 | 0 | ~24 | 0 | ~24 | **100% TypeScript** |
| `src/state/` | 0 | 0 | 0 | ~22 | 0 | ~22 | **100% TypeScript** |
| `src/config/` | 0 | 0 | 0 | ~7 | 0 | ~7 | **100% TypeScript** |
| `src/services/` | 0 | 0 | 0 | ~4 | 0 | ~4 | **100% TypeScript** |
| Other (`src/__tests__/`) | 1 | 0 | 1 | 0 | 0 | 0 | `typescript-setup.test.js` |
| **Total** | **~21** | **~145** | **~170**¹ | **~116** | **~81** | **~199**¹ | — |

¹ Exact counts ±3 depending on counting methodology (barrel classification, skeleton inclusion).

### Key Observations

1. **Domains, hooks, state, config, services** — already 100% TypeScript. No migration needed.
2. **UI layer** concentrates **~150/170** of all JS files (88%).
3. **Icons alone** account for **~58/170** files (34%) — trivially typed, batch-convertible.
4. **App Router pages** — 7 .jsx files with Next.js-specific typing requirements.
5. **5 components with `.types.ts`** — ArticleAppearance, ArticleHoverThumbnail, ArticleListItem, ArticleCard, ProjectCard — are **already .tsx**. These are NOT migration targets.

### TypeScript Configuration

The project uses **strict mode** (`"strict": true` in `tsconfig.json`), which enables:

- `noImplicitAny` — No implicit `any` types
- `strictNullChecks` — Null/undefined must be handled explicitly
- `strictFunctionTypes` — Function parameter types are checked contravariantly
- `strictPropertyInitialization` — Class properties must be initialized
- `noImplicitThis` — `this` must have an explicit type

This means **all migrated files must satisfy strict type-checking** — no shortcuts with `any`.

### Redux Type Infrastructure

Typed Redux hooks are **already available** and should be used in all migrated components:

| Resource | Location | Exports |
|----------|----------|---------|
| Store types | `src/state/stores/ReduxStore/index.ts` | `RootState`, `AppDispatch` |
| Typed selector | `src/hooks/store/AppSelector/index.ts` | `useAppSelector` (TypedUseSelectorHook) |
| Typed dispatch | `src/hooks/store/AppDispatch/index.ts` | `useAppDispatch` |

Components currently using `useSelector`/`useDispatch` should switch to `useAppSelector`/`useAppDispatch` during migration.

---

## 2. Priority Tiers

### Tier Overview

| Tier | Category | Files | Effort | Value |
|------|----------|-------|--------|-------|
| P1 | App Router + Providers | ~8 | Low | HIGH — typed pages prevent runtime errors |
| P2 | Organisms | ~25 | Medium-High | HIGH — most complex, highest type safety benefit |
| P3 | Molecules | ~35 | Medium | MEDIUM — reduces implicit `any` surface |
| P4 | Atoms (non-icons) | ~25 | Low-Medium | MEDIUM — simple but numerous |
| P5 | Icons | ~58 | Low (batch) | LOW — trivial components, but consistency |
| P6 | Lib + Utilities | ~9 | Low | MEDIUM — shared utilities benefit from types |
| P7 | Shared + Barrels + Test | ~10 | Low | LOW — mostly re-exports |

### P1: App Router + Providers (~8 files)

High visibility, Next.js-specific typing. Provides typed page props, metadata, and layout patterns.

| File | Current | Target | Notes |
|------|---------|--------|-------|
| `src/app/layout.jsx` | .jsx | .tsx | Root layout — `Metadata` type, `children` prop |
| `src/app/page.jsx` | .jsx | .tsx | Home page |
| `src/app/about/layout.jsx` | .jsx | .tsx | About layout |
| `src/app/about/page.jsx` | .jsx | .tsx | About page |
| `src/app/projects/layout.jsx` | .jsx | .tsx | Projects layout |
| `src/app/projects/ProjectListSkeleton.jsx` | .jsx | .tsx | Skeleton component |
| `src/app/coming-soon/page.jsx` | .jsx | .tsx | Coming soon page |
| `src/providers/RootProvider/index.jsx` | .jsx | .tsx | Main provider tree |

**Why first:** App Router files define the type contract for the entire application. Next.js provides built-in types (`Metadata`, `LayoutProps`, `PageProps`) that catch errors at build time.

### P2: Organisms (~25 files)

Most complex components. Highest type safety value due to prop drilling, event handlers, and Redux integration.

**NavBar Group** (migrate together — tightly coupled):
- `organisms/NavBar/index.jsx`
- `organisms/Menu/index.jsx`
- `organisms/Menu/constants.js` → `.ts`
- `organisms/Menu/skeletons/index.js` → `.ts` (barrel)
- `organisms/Menu/skeletons/NavigationItemLinksSkeleton.jsx` → `.tsx`
- `organisms/Menu/skeletons/SocialNetworkLinksSkeleton.jsx` → `.tsx`
- `organisms/MenuFloating/index.jsx`
- `organisms/MenuFloating/skeletons/index.js` → `.ts` (barrel)
- `organisms/MenuFloating/skeletons/NavigationItemsSkeleton.jsx` → `.tsx`
- `organisms/MenuFloatingClient/index.jsx`
- `organisms/MobileMenuOverlay/index.jsx`

**Content Group**:
- `organisms/Biography/index.jsx`
- `organisms/Biography/skeletons.jsx`
- `organisms/ExperienceStats/index.jsx`
- `organisms/ExperienceStats/skeleton.jsx`
- `organisms/Experiences/skeleton.jsx`
- `organisms/Hiring/index.jsx`
- `organisms/Hiring/skeleton.jsx`
- `organisms/Skills/index.jsx`
- `organisms/Skills/skeleton.jsx`
- `organisms/Footer/index.jsx`

**WordCloud Group**:
- `organisms/WordCloud/index.jsx`
- `organisms/WordCloud/data.js` → `.ts`
- `organisms/WordCloud/SkillDetail.jsx` → `.tsx`
- `organisms/WordCloud/telemetry.js` → `.ts`

**Barrels**:
- `organisms/index.js` → `.ts`

### P3: Molecules (~35 files)

Medium complexity. Many have sub-files (Author/Link.jsx, Copyright/Text.jsx).

| Component | Files | Notes |
|-----------|-------|-------|
| AnimatedChildren | 1 | Wraps children with animation |
| Author | 3 | index + Link + skeleton |
| Copyright | 3 | index + Text + skeleton |
| CustomersSlider | 1 | Props: slider config |
| Education | 1 | skeleton only |
| Experience | 1 | skeleton only |
| ExtraInfo | 2 | index + skeleton |
| FeaturedArticle | 1 | Article prop |
| Hero | 1 | Complex — image + links |
| HireMe | 1 | Contact integration |
| Logo | 1 | SVG component |
| LogoMenuTrigger | 1 | Menu state integration |
| MovingImage | 1 | Framer Motion animation |
| NavigationItems | 2 | index + skeleton |
| Paragraph | 2 | index + Text |
| Resume | 2 | index + Button |
| skill | 2 | index + skeleton (lowercase — naming debt) |
| SkillSelector | 1 | Filter interaction |
| SocialNetworkLink | 3 | index + Icon + skeleton |
| TechnologiesSlider | 1 | Slider config |
| Title | 1 | Simple text wrapper |
| TransitionEffect | 1 | Page transition animation |
| **Barrel** | 1 | `molecules/index.js` → `.ts` |

### P4: Atoms — Non-Icons (~25 files)

Simple components with predictable prop patterns.

| Subcategory | Files | Notes |
|-------------|-------|-------|
| `hocs/` | 5 + barrel | MainContainer, FramerImage, History, TransitionerLi + skeletons |
| `links/` | 6 + barrel | BaseLink, ImageLink, NavigationItemLink, WhatsAppLink + skeletons |
| `texts/` | 11 + barrel | AnimatedTitle (3 files), AnimatedNumber (2), CircularText, ParagraphText (2), ActiveMark, ActiveMarkFloating |
| `shadows/` | 2 + barrel | BoxShadow, FeaturedBoxShadow |
| `motion/` | barrel only | ArticleAppearance already .tsx |

**Note:** `atoms/index.ts` is already TypeScript — no change needed.

### P5: Icons (~58 files)

All 57+ icon components follow identical pattern: receive no props (or minimal `className`), return JSX with SVG paths. Trivially typed.

```
atoms/icons/[IconName]/index.jsx → .tsx
atoms/icons/index.js → .ts (barrel — 0 consumers, but rename for consistency)
atoms/icons/LiIcon/index.jsx → .tsx
atoms/icons/LiIcon/skeleton.jsx → .tsx
```

**Batch strategy:** Rename all at once, run `typecheck` to catch issues, fix any that fail.

### P6: Lib + Utilities (~9 files)

Non-React utility files.

| File | Target | Notes |
|------|--------|-------|
| `lib/index.js` | `.ts` | Barrel |
| `lib/actions.js` | `.ts` | Server actions |
| `lib/utils.js` | `.ts` | General utilities |
| `lib/suppressWarnings.js` | `.ts` | Console warning suppression |
| `lib/social-urls/index.js` | `.ts` | Barrel |
| `lib/httpRequest/index.js` | `.ts` | HTTP client barrel |
| `lib/httpRequest/config.js` | `.ts` | HTTP config |
| `organisms/Menu/constants.js`² | `.ts` | Already counted in P2 |
| `organisms/WordCloud/data.js`² | `.ts` | Already counted in P2 |

² These are counted under P2 for execution but are `.js` → `.ts` (not `.jsx` → `.tsx`).

### P7: Shared + Barrels + Test (~5 files)

| File | Target | Notes |
|------|--------|-------|
| `shared/skeletons/index.js` | `.ts` | Barrel |
| `shared/skeletons/skeletons.jsx` | `.tsx` | Shared skeleton utilities |
| `overlays/index.js` | `.ts` | Barrel (components already .tsx) |
| `providers/index.js` | `.ts` | Barrel |
| `__tests__/typescript-setup.test.js` | `.test.ts` | Test file |

---

## 3. Migration Rules

### DO — Required Changes

| Rule | Example |
|------|---------|
| Rename `.jsx` → `.tsx` | `NavBar/index.jsx` → `NavBar/index.tsx` |
| Rename `.js` → `.ts` (non-React) | `lib/utils.js` → `lib/utils.ts` |
| Add `Props` interface for component props | `interface NavBarProps { ... }` |
| Inline Props if < 10 properties | `interface LogoProps { className?: string }` |
| Separate `.types.ts` if ≥ 10 properties | `NavBar.types.ts` with `NavBarProps` |
| Follow naming: `ComponentNameProps` | Per [component-api.md](component-api.md) |
| Type event handlers explicitly | `onClick: (e: React.MouseEvent<HTMLButtonElement>) => void` |
| Type `useRef` generics | `useRef<HTMLDivElement>(null)` |
| Type `useState` when not inferrable | `useState<Article \| null>(null)` |
| Use `useAppSelector` / `useAppDispatch` | Replace untyped `useSelector` / `useDispatch` |
| Add return type on components | `function NavBar(props: NavBarProps): React.ReactElement` |
| Import types with `import type` | `import type { Article } from "@/domains/article/model/schema"` |

### DO NOT — Forbidden During Migration

| Rule | Rationale |
|------|-----------|
| Change component behavior or logic | Migration is rename + type, not refactor |
| Refactor code structure | Separate concern — not in scope |
| Add/remove features or fix bugs | Separate PRs for separate concerns |
| Change import paths (barrel → direct) | Barrel cleanup is Epic 23 |
| Migrate root config files | CommonJS convention — see [Out of Scope](#8-out-of-scope) |
| Add `@ts-ignore` or `@ts-expect-error` | Fix the type instead |
| Change `export default` patterns | Preserve existing export style |
| Add runtime type checking (Zod) | Schema validation is a domain concern |
| Introduce `any` type | Strict mode forbids implicit `any` — explicit `any` defeats the purpose |

### EXCEPTION

- **Barrel files** using `export { default as X } from` may need minor syntax adjustments for TypeScript module resolution. This is acceptable.
- **Framer Motion** `m.*` components may need `as` assertions for custom components: `m.div` is typed, but `m(CustomComponent)` needs `ComponentProps`.

---

## 4. Batch Definitions & Execution Plan

### Batch Schedule

| Batch | Tier | Files | PRs | Branch Name | Description |
|-------|------|-------|-----|-------------|-------------|
| A | P1 | ~8 | 1 | `migration/ts-batch-a-app-router` | App Router pages + providers |
| B | P2a | ~11 | 1 | `migration/ts-batch-b-navbar-group` | NavBar + Menu + MobileMenuOverlay |
| C | P2b | ~10 | 1 | `migration/ts-batch-c-content-organisms` | Biography, ExperienceStats, Hiring, Footer |
| D | P2c | ~5 | 1 | `migration/ts-batch-d-wordcloud-group` | WordCloud + Skills + organism barrel |
| E | P3a | ~18 | 1 | `migration/ts-batch-e-molecules-1` | First half of molecules (A-M) |
| F | P3b | ~18 | 1 | `migration/ts-batch-f-molecules-2` | Second half of molecules (N-Z) + barrel |
| G | P4a | ~13 | 1 | `migration/ts-batch-g-atoms-hocs-links` | hocs + links + shadow atoms |
| H | P4b | ~13 | 1 | `migration/ts-batch-h-atoms-texts` | texts + motion atoms |
| I | P5 | ~58 | 1 | `migration/ts-batch-i-icons` | All icon components (identical pattern) |
| J | P6+P7 | ~14 | 1 | `migration/ts-batch-j-lib-shared` | Lib utilities + shared + barrels + test |

**Total: ~170 files across 10 PRs**

### Acceptance Criteria Per Batch

Every batch PR must satisfy ALL of:

```bash
npm run lint          # Zero warnings (strict: --max-warnings 0)
npm run typecheck     # Zero errors (tsc --noEmit)
npm test              # All tests pass (no regressions)
npm run build         # Production build succeeds
```

### Execution Guidelines

1. **One batch at a time** — merge before starting next batch
2. **Tests first** — run full suite before AND after rename
3. **Commit rename separately** — first commit: rename files, second commit: add types
4. **Fix forward** — if a type error surfaces, fix it in the same PR (don't skip with `any`)
5. **Update test imports** — test files may need import path updates after rename
6. **Verify barrel re-exports** — barrel files must still resolve after member files change extension

### Dependency Considerations

Some batches have soft dependencies:

```
Batch A (App Router) — independent, safe to start first
Batch B (NavBar group) — independent
Batch C (Content organisms) — independent
Batch D (WordCloud) — independent
Batch E-F (Molecules) — some molecules imported by organisms, but organisms import by path
Batch G-H (Atoms) — atoms imported by everything, but import paths don't include extension
Batch I (Icons) — independent (0 barrel consumers)
Batch J (Lib) — lib imported by many, but path-based imports don't include extension
```

**Key insight:** Next.js and TypeScript resolve imports without explicit extensions. Renaming `.jsx` → `.tsx` does NOT break existing imports because `import X from "./Component"` resolves both extensions.

---

## 5. Codemod Specification

### Approach: Manual Rename + Incremental Typing

A full AST-based codemod (e.g., jscodeshift) is **not recommended** for this project:

- 170 files is manageable manually (~10 files per batch session)
- Each component needs context-aware Props interface — AST tools can't infer this well
- Risk of AST transforms introducing bugs outweighs time savings

### Phase 1: Batch Rename Script

```bash
# Rename all .jsx files in a directory to .tsx
find src/ui/atoms/icons -name "*.jsx" -exec bash -c 'mv "$0" "${0%.jsx}.tsx"' {} \;

# Rename all .js files (non-barrel) to .ts
find src/lib -name "*.js" -not -name "*.test.js" -exec bash -c 'mv "$0" "${0%.js}.ts"' {} \;

# Verify no broken imports
npm run typecheck 2>&1 | head -50
```

### Phase 2: Add Props Interface

For each renamed component:

```typescript
// BEFORE (JavaScript — no types)
export default function NavBar({ items, onMenuToggle }) {
  return <nav>...</nav>;
}

// AFTER (TypeScript — typed props)
interface NavBarProps {
  items: NavigationItem[];
  onMenuToggle: () => void;
}

export default function NavBar({ items, onMenuToggle }: NavBarProps): React.ReactElement {
  return <nav>...</nav>;
}
```

**Prop type inference sources:**
1. Existing `.types.ts` files (5 components — already migrated)
2. Domain schema types from `src/domains/*/model/schema.ts` (Zod-inferred)
3. Redux state types from `src/state/stores/ReduxStore` (`RootState`)
4. React built-in types (`React.ReactNode`, `React.MouseEvent`, etc.)
5. Manual inference from usage patterns in JSX

### Phase 3: Fix Type Errors

After rename + Props interface:

```bash
npm run typecheck 2>&1 | grep "error TS" | sort | uniq -c | sort -rn
```

Common fixes:
- Missing null checks → add `if (!data) return null;` guard
- Implicit `any` in callbacks → add parameter types
- Missing generics → `useRef<HTMLDivElement>(null)`
- Redux untyped → switch to `useAppSelector` / `useAppDispatch`

---

## 6. Rollback Strategy

### Per-File Rollback

If a single file's migration causes issues:

```bash
# Revert the file rename
git checkout HEAD~1 -- src/ui/organisms/NavBar/index.jsx
# Remove the .tsx version
git rm src/ui/organisms/NavBar/index.tsx
```

### Per-Batch Rollback

If an entire batch needs reverting:

```bash
# Revert the merge commit
git revert <batch-merge-commit-sha>
```

### Safety Guarantees

| Guard | Mechanism |
|-------|-----------|
| No big-bang | Each batch is independently revertable |
| CI gate | PR cannot merge if `typecheck` or `test` fails |
| Extension-only first | Rename commit separate from type-addition commit |
| Escape hatch | If a file is too complex, create `ComponentName.types.ts` with minimal types and defer full typing to next iteration |

### Never Do

- Force-push over a migration batch
- Merge a batch with failing tests
- Skip `typecheck` validation
- Use `@ts-ignore` as a "temporary" workaround

---

## 7. Risk Assessment & Known Challenges

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Barrel files surface hidden type conflicts | Medium | Rename barrel last in each category, run typecheck after each |
| `framer-motion` `m.*` needs Motion generics | Low | `m.div` is pre-typed; custom `m(Component)` needs explicit typing |
| Dynamic imports in `layout.jsx` need types | Low | `next/dynamic` is generic: `dynamic<ComponentProps>(() => import(...))` |
| Mock files may break if schema types change | Low | Mocks use Zod `.parse()` — types are inferred, not duplicated |
| Test files import from renamed paths | Low | Import paths don't include extensions — no breakage expected |
| `export *` in barrels may re-export conflicting names | Medium | Audit each barrel's re-exports before converting |

### Known Challenges

| Challenge | Files | Strategy |
|-----------|-------|----------|
| AnimatedTitle has 3 related files | `index.jsx`, `MotionTitle.jsx`, `Title.jsx` | Migrate together in same commit |
| Menu + MenuFloating + MenuFloatingClient | 3 tightly coupled organisms | Migrate in Batch B together |
| Icon components: trivial but 57+ files | All identical pattern | Batch rename, single `typecheck` pass |
| `skill/` lowercase naming | `molecules/skill/index.jsx` | Rename to `.tsx` only — naming fix is separate debt |
| No global types directory | Types colocated with usage | Follow existing pattern — don't create `src/types/` |
| Redux hooks already typed | `useAppSelector`, `useAppDispatch` exist | Replace untyped `useSelector`/`useDispatch` during migration |

---

## 8. Out of Scope

### Root Configuration Files

These 7 files remain `.js` (CommonJS convention):

| File | Reason |
|------|--------|
| `jest.config.cjs` | Jest requires CommonJS (`.cjs` extension) |
| `next.config.js` | Next.js convention, loaded before TypeScript compiler |
| `.eslintrc.js` | ESLint convention, CommonJS |
| `tailwind.config.js` | Tailwind convention, CommonJS |
| `postcss.config.js` | PostCSS convention, CommonJS |
| `next-sitemap.config.js` | Library convention, CommonJS |
| `lighthouserc.js` | Lighthouse convention, CommonJS |

### Other Exclusions

| Item | Reason |
|------|--------|
| E2E tests (`e2e/*.spec.ts`) | Already TypeScript |
| CSS files | Not affected by migration |
| Domain layer (`src/domains/`) | Already 100% TypeScript |
| Hooks layer (`src/hooks/`) | Already 100% TypeScript |
| State layer (`src/state/`) | Already 100% TypeScript |
| Barrel import cleanup | Separate concern — Epic 23 per [import-rules.md](import-rules.md) |
| Component refactoring | Migration is rename + type only |

---

## Cross-References

- [Folder Structure](folder-structure.md) — File extension rules (Story 20.1)
- [Styles Architecture](styles-architecture.md) — CSS not affected by TS migration (Story 20.2)
- [Component API](component-api.md) — Props interface naming: `ComponentNameProps`, inline vs `.types.ts` threshold (Story 20.3)
- [Test Conventions](test-conventions.md) — Test file patterns and mock typing (Story 20.4)
- [Import Rules](import-rules.md) — Barrel file inventory and ESLint enforcement (Story 20.5)
- [Layout Patterns](layout-patterns.md) — Layout system documentation (Story 20.6)
- [CLAUDE.md](../../CLAUDE.md) — TypeScript preference: "New files must be TypeScript (.ts/.tsx)"
