# Story 20.7: TypeScript Migration Plan

Status: in-progress

## Story

As a **developer working on the portfolio frontend**,
I want **a prioritized migration strategy from JavaScript (.jsx/.js) to TypeScript (.tsx/.ts) with file inventory, batch definitions, migration rules, and rollback strategy**,
so that **the remaining 170 JS files can be converted systematically without breaking functionality, with clear batch boundaries and acceptance criteria per batch**.

## Acceptance Criteria

1. Full inventory of 170 JS/JSX files organized by layer and priority tier
2. Migration rules defining what to change and what NOT to change during conversion
3. Batch size recommendation with files grouped by dependency and risk level
4. Codemod script specification (rename + basic interface scaffolding approach)
5. Rollback strategy (per-file, not big-bang)
6. `CLAUDE.md` updated with link to new document in Key Files Reference section

## Tasks / Subtasks

- [ ] Task 1: Create `docs/architecture/typescript-migration.md` (AC: #1-5)
  - [ ] Section 1: Current State & Migration Scope (AC: #1)
    - Document current TS adoption: 229 TS/TSX files vs 170 JS/JSX files (57% TS)
    - Breakdown by layer: src/ui/ = 153 JS (15 .js + 138 .jsx) vs 77 TS (8 .ts + 69 .tsx)
    - App Router: 7 .jsx files (pages + layouts)
    - Providers: 1 .jsx file (RootProvider)
    - Lib: 6 .js files (utils, actions, httpRequest, social-urls)
    - Other: 3 files (test setup, WordCloud data/telemetry)
    - 5 components with existing .types.ts files (easy wins)
    - 15 barrel files (.js) that need .ts conversion
    - 7 root config files (.js) — document as OUT OF SCOPE (CommonJS, not worth converting)
  - [ ] Section 2: Priority Tiers (AC: #1)
    - P0 (Quick Wins): 5 components with existing `.types.ts` — types already defined, just rename + import
      - `atoms/motion/ArticleAppearance/index.jsx` → `.tsx`
      - `atoms/ArticleHoverThumbnail/index.jsx` → `.tsx`
      - `molecules/ArticleListItem/index.jsx` → `.tsx`
      - `organisms/ArticleCard/index.jsx` → `.tsx`
      - `organisms/ProjectCard/index.jsx` → `.tsx`
    - P1 (App Router + Providers): 8 files — high visibility, type safety for Next.js pages
      - `app/layout.jsx`, `app/page.jsx`, `app/about/layout.jsx`, `app/about/page.jsx`
      - `app/projects/layout.jsx`, `app/projects/ProjectListSkeleton.jsx`
      - `app/coming-soon/page.jsx`
      - `providers/RootProvider/index.jsx`
    - P2 (Organisms): ~25 files — most complex components, highest value from typing
      - NavBar, Footer, Menu, MenuFloating, MenuFloatingClient, MobileMenuOverlay
      - Biography, ExperienceStats, Hiring, Skills, WordCloud
      - All organism skeletons
      - `organisms/index.js` barrel → `.ts`
    - P3 (Molecules): ~35 files — medium complexity
      - All molecule components and skeletons
      - `molecules/index.js` barrel → `.ts`
    - P4 (Atoms — non-icons): ~25 files — simple components
      - hocs/ (MainContainer, FramerImage, History, TransitionerLi)
      - links/ (BaseLink, ImageLink, NavigationItemLink, WhatsAppLink)
      - texts/ (AnimatedTitle, AnimatedNumber, CircularText, ParagraphText, ActiveMark, ActiveMarkFloating)
      - shadows/ (BoxShadow, FeaturedBoxShadow)
      - motion/ barrel
      - All atom skeletons
      - Atom sub-barrels: `hocs/index.js`, `links/index.js`, `texts/index.js`, `shadows/index.js`, `motion/index.js`
      - `atoms/index.ts` — already TS, no change needed
    - P5 (Icons): ~57 files — simplest components, most numerous, batch-convertible
      - All icon components (`[IconName]/index.jsx` → `.tsx`)
      - `icons/index.js` barrel → `.ts`
      - Note: icons barrel has ZERO consumers (Story 20.5 data), but rename anyway for consistency
    - P6 (Lib + Utilities): ~9 files — non-React utilities
      - `lib/index.js`, `lib/actions.js`, `lib/utils.js`, `lib/suppressWarnings.js`
      - `lib/social-urls/index.js`
      - `lib/httpRequest/index.js`, `lib/httpRequest/config.js`
      - `organisms/Menu/constants.js`, `organisms/WordCloud/data.js`, `organisms/WordCloud/telemetry.js`
    - P7 (Shared + Overlays + Test): ~5 files — smallest groups
      - `shared/skeletons/index.js` barrel, `shared/skeletons/skeletons.jsx`
      - `overlays/index.js` barrel
      - `providers/index.js` barrel
      - `__tests__/typescript-setup.test.js` → `.test.ts`
  - [ ] Section 3: Migration Rules (AC: #2)
    - DO: Rename `.jsx` → `.tsx`, `.js` → `.ts`
    - DO: Add `Props` interface for component props (inline if < 10 props, separate `.types.ts` if >= 10)
    - DO: Import existing `.types.ts` where available (P0 components)
    - DO: Add return type `React.ReactElement` or `JSX.Element` on component functions
    - DO: Type event handlers (`React.MouseEvent`, `React.ChangeEvent`, etc.)
    - DO: Type `useRef` generics (`useRef<HTMLDivElement>(null)`)
    - DO: Replace `any` with proper types — never introduce new `any`
    - DO NOT: Change component behavior or logic
    - DO NOT: Refactor code structure during migration
    - DO NOT: Add/remove features, fix bugs, or "improve" anything
    - DO NOT: Change import paths (barrel → direct is a SEPARATE task, Story 20.5 scope)
    - DO NOT: Migrate root config files (jest.config.cjs, next.config.js, etc.) — CommonJS stays .js
    - DO NOT: Add `@ts-ignore` or `@ts-expect-error` — fix the type instead
    - DO NOT: Change `export default` patterns — preserve existing export style
    - EXCEPTION: Barrel files converting `export { default as X } from` — TypeScript may require explicit type annotations
  - [ ] Section 4: Batch Definitions & Execution Plan (AC: #3)
    - Batch A (P0): 5 files — 1 PR — Quick wins with existing types
    - Batch B (P1): 8 files — 1 PR — App Router + Providers
    - Batch C (P2): ~25 files — 2-3 PRs — Organisms (split by dependency: NavBar group, content group, menu group)
    - Batch D (P3): ~35 files — 2-3 PRs — Molecules (split by letter/dependency)
    - Batch E (P4): ~25 files — 1-2 PRs — Atoms non-icons
    - Batch F (P5): ~57 files — 1 PR — Icons (all identical pattern, safe to batch)
    - Batch G (P6+P7): ~14 files — 1 PR — Lib + Shared + Overlays + Test
    - **Total: ~170 files across ~10-12 PRs**
    - Each PR acceptance: `npm run lint && npm run typecheck && npm test` must pass
    - Branch naming: `migration/ts-batch-{letter}-{description}`
  - [ ] Section 5: Codemod Specification (AC: #4)
    - Phase 1: File rename (`.jsx` → `.tsx`, `.js` → `.ts`)
    - Phase 2: Add minimal Props interface from existing prop destructuring
    - Phase 3: Fix type errors incrementally
    - Script approach: bash + `sed` for rename, manual for props interface
    - Note: Full AST-based codemod (jscodeshift) is overkill for 170 files — manual + rename is faster
    - Rename command: `find src/ui/atoms/icons -name "index.jsx" -exec bash -c 'mv "$0" "${0%.jsx}.tsx"' {} \;`
    - Post-rename: `npm run typecheck` to identify missing types
  - [ ] Section 6: Rollback Strategy (AC: #5)
    - Per-file rollback: `git checkout HEAD -- path/to/file.tsx && mv path/to/file.tsx path/to/file.jsx`
    - Per-batch rollback: `git revert <batch-merge-commit>`
    - Never big-bang: each batch is independently revertable
    - CI gate: PR cannot merge if `typecheck` or `test` fails
    - Escape hatch: If a file is too complex to type correctly, create `ComponentName.types.ts` with minimal types and defer full typing
  - [ ] Section 7: Risk Assessment & Known Challenges (AC: #2)
    - Risk: Barrel files with `export *` may surface hidden type conflicts after rename
    - Risk: `framer-motion` `m.*` components need proper Motion generics
    - Risk: Redux `useSelector`/`useDispatch` hooks need typed store — verify `src/state/store.ts` exports `RootState`/`AppDispatch`
    - Risk: Dynamic imports in `layout.jsx` (`next/dynamic`) need return type annotations
    - Risk: Mock files (`.mock.ts`) may break if schema types change during migration
    - Challenge: AnimatedTitle has 3 related files (index.jsx, MotionTitle.jsx, Title.jsx) — migrate together
    - Challenge: Menu + MenuFloating + MenuFloatingClient are tightly coupled — migrate in same batch
    - Challenge: Icon components are trivially typed but numerous — test one first, then batch
  - [ ] Section 8: Out of Scope (AC: #2)
    - Root config files: `jest.config.cjs`, `next.config.js`, `.eslintrc.js`, `postcss.config.js`, `tailwind.config.js`, `next-sitemap.config.js`, `lighthouserc.js` — CommonJS, no benefit from TS
    - E2E tests: `e2e/*.spec.ts` — already TypeScript
    - CSS files: not affected by migration
    - `CLAUDE.md`, docs: not affected
    - Barrel import cleanup (direct → barrel): separate concern (Epic 23 per epic-20 future plan)
- [ ] Task 2: Update `CLAUDE.md` (AC: #6)
  - [ ] Add `docs/architecture/typescript-migration.md` to Key Files Reference section
- [ ] Task 3: Verify document quality (AC: #1-6)
  - [ ] `npm run lint` — no regressions
  - [ ] `npm run typecheck` — no regressions
  - [ ] `npm test` — all tests pass (no code changes, but verify)

## Dev Notes

### Tipo de Story

**DOCUMENTATION ONLY** — Esta story produce un documento markdown. NO hay cambios de codigo fuente, solo `docs/architecture/typescript-migration.md` + update a `CLAUDE.md`.

### Datos del Codebase (auditoria exhaustiva)

#### File Count Summary

| Category | .js | .jsx | .ts (non-test) | .tsx (non-test) | .types.ts | Total |
|----------|-----|------|-----------------|-----------------|-----------|-------|
| src/ui/ | 15 | 138 | 8 | 69 | 5 | 235 |
| src/app/ | 0 | 7 | 4 | 9 | 0 | 20 |
| src/providers/ | 1 | 1 | 0 | 1 | 0 | 3 |
| src/lib/ | 6 | 0 | 5 | 0 | 0 | 11 |
| src/domains/ | 0 | 0 | 40 | 0 | 0 | 40 |
| src/hooks/ | 0 | 0 | 24 | 0 | 0 | 24 |
| src/state/ | 0 | 0 | 22 | 0 | 0 | 22 |
| src/config/ | 0 | 0 | 7 | 0 | 0 | 7 |
| src/services/ | 0 | 0 | 4 | 0 | 0 | 4 |
| src/test-utils/ | 0 | 0 | 6 | 0 | 0 | 6 |
| src/styles/ | 0 | 0 | 0 | 0 | 0 | 0 |
| src/__tests__/ | 1 | 0 | 0 | 0 | 0 | 1 |
| **Total** | **23** | **146** | **120** | **79** | **5** | **373** |

**Migration target: 169 files (23 .js + 146 .jsx)**

Note: Exact counts may vary by ±2 depending on barrel classification. The explore agent found 24 .js and 170 total — minor discrepancy due to counting methodology. Use the layer-by-layer breakdown as source of truth.

#### UI Layer JS/JSX Breakdown

| Subcategory | .js | .jsx | Total JS | Notes |
|-------------|-----|------|----------|-------|
| atoms/icons | 1 (barrel) | 57 | 58 | All identical pattern |
| atoms/texts | 1 (barrel) | 11 | 12 | AnimatedTitle = 3 related files |
| atoms/links | 1 (barrel) | 6 | 7 | Includes skeletons |
| atoms/hocs | 1 (barrel) | 5 | 6 | MainContainer, FramerImage, etc. |
| atoms/shadows | 1 (barrel) | 2 | 3 | Simple components |
| atoms/motion | 1 (barrel) | 1 | 2 | ArticleAppearance has .types.ts |
| atoms/ArticleHoverThumbnail | 0 | 1 | 1 | Has .types.ts — misplaced (no subcategory) |
| molecules/ | 1 (barrel) | 34 | 35 | Includes skeletons and sub-files |
| organisms/ | 3 (barrels+data) | 22 | 25 | Menu group = 3 tightly coupled |
| overlays/ | 1 (barrel) | 0 | 1 | Barrel only (components are .tsx) |
| shared/ | 1 (barrel) | 1 | 2 | Skeleton utilities |
| **Total** | **13** | **140** | **153** | — |

#### Components with Existing .types.ts (P0 Quick Wins)

| Component | .types.ts Path | Props Defined |
|-----------|---------------|---------------|
| ArticleAppearance | `atoms/motion/ArticleAppearance/ArticleAppearance.types.ts` | Yes |
| ArticleHoverThumbnail | `atoms/ArticleHoverThumbnail/ArticleHoverThumbnail.types.ts` | Yes |
| ArticleListItem | `molecules/ArticleListItem/ArticleListItem.types.ts` | Yes |
| ArticleCard | `organisms/ArticleCard/ArticleCard.types.ts` | Yes |
| ProjectCard | `organisms/ProjectCard/ProjectCard.types.ts` | Yes |

#### Barrel Files to Migrate (.js → .ts)

| Barrel File | Export Count | Pattern | Risk |
|-------------|-------------|---------|------|
| `atoms/icons/index.js` | 57 | Named `export { default as X }` | LOW (0 consumers) |
| `atoms/links/index.js` | 6 | Named exports | LOW |
| `atoms/texts/index.js` | 5 | Named exports | LOW |
| `atoms/hocs/index.js` | 5 | Mix: `export *` + named | MEDIUM |
| `atoms/shadows/index.js` | 2 | `export * from` wildcard | LOW |
| `atoms/motion/index.js` | 1 | Named export | LOW |
| `molecules/index.js` | 25+ | Named exports | MEDIUM |
| `organisms/index.js` | 19+ | Named + ArticleCard named | MEDIUM |
| `overlays/index.js` | 2 | Named exports | LOW |
| `organisms/Menu/skeletons/index.js` | 2 | Named exports | LOW |
| `organisms/MenuFloating/skeletons/index.js` | 1 | Named export | LOW |
| `shared/skeletons/index.js` | 1 | Named export | LOW |
| `lib/index.js` | varies | Mixed | LOW |
| `lib/social-urls/index.js` | varies | Mixed | LOW |
| `lib/httpRequest/index.js` | varies | Mixed | LOW |
| `providers/index.js` | 1 | Named export | LOW |

#### Root Config Files (OUT OF SCOPE)

| File | Reason to Skip |
|------|---------------|
| `jest.config.cjs` | Already CommonJS (.cjs), Jest requires it |
| `next.config.js` | Next.js convention, CommonJS |
| `.eslintrc.js` | ESLint convention, CommonJS |
| `tailwind.config.js` | Tailwind convention, CommonJS |
| `postcss.config.js` | PostCSS convention, CommonJS |
| `next-sitemap.config.js` | Library convention, CommonJS |
| `lighthouserc.js` | Lighthouse convention, CommonJS |

### Scope Boundaries — Que NO Hacer

| NO hacer | Razon |
|----------|-------|
| Renombrar archivos JS/JSX | Solo documentar plan, ejecucion es Epic 22 |
| Agregar interfaces Props | Solo documentar reglas, no implementar |
| Modificar barrel files | Solo documentar, cleanup es Epic 23 |
| Tocar `src/` | Epic 20 es docs-only |
| Convertir config files | CommonJS, fuera de scope |

### Previous Story Intelligence (Story 20.6)

- Story 20.6 creó `docs/architecture/layout-patterns.md` exitosamente
- Code review encontró 10 issues (4H, 3M, 3L) — todos corregidos
- Key learning: VERIFICAR datos contra codebase real — los conteos iniciales del epic (153 JS en src/ui/) eran correctos pero el total (153+128=281) no coincide con la auditoría actual (153+77=230)
- Key learning: la auditoría del Explore agent puede tener ±2 de discrepancia con Glob counts — siempre incluir nota de metodología
- Key learning: Sidebar del codebase usa Grid, no flex-wrap del Every Layout original — NO asumir que los patrones "estándar" se aplican idénticamente
- Pattern: cross-references a otros documentos del epic
- **Verificación triple**: Todo dato citado en el documento debe ser verificable contra codebase real

### Documentacion Existente a Referenciar

| Documento | Contenido Relevante |
|-----------|-------------------:|
| `docs/architecture/folder-structure.md` | Component folder structure, file extension rules (Story 20.1) |
| `docs/architecture/styles-architecture.md` | CSS patterns (Story 20.2) |
| `docs/architecture/component-api.md` | Props interface naming: `ComponentNameProps`, inline vs .types.ts threshold (Story 20.3) |
| `docs/architecture/test-conventions.md` | Test file patterns (Story 20.4) |
| `docs/architecture/import-rules.md` | Barrel file rules, import aliases (Story 20.5) |
| `docs/architecture/layout-patterns.md` | Layout patterns (Story 20.6) |
| `CLAUDE.md` | TypeScript preference: "New files must be TypeScript (.ts/.tsx)" |
| `tsconfig.json` | Path aliases (20+ entries), compiler options |

### References

- [Source: epic-20-component-style-architecture.md#Story 20.7]
- [Source: tsconfig.json — compilerOptions.paths (20+ aliases)]
- [Source: CLAUDE.md — TypeScript preference note]
- [Source: docs/architecture/component-api.md — Props interface naming (Story 20.3)]
- [Source: docs/architecture/import-rules.md — barrel file inventory (Story 20.5)]
- [Source: docs/architecture/folder-structure.md — file extension rules (Story 20.1)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

### File List

| Archivo | Accion | Estado |
|---------|--------|--------|
| `docs/architecture/typescript-migration.md` | CREAR | pending |
| `CLAUDE.md` | MODIFICAR — agregar referencia en Key Files Reference | pending |
