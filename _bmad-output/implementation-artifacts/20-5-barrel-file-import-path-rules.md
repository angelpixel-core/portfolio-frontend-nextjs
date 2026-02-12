# Story 20.5: Barrel File & Import Path Rules

Status: review

## Story

As a **developer working on the portfolio frontend**,
I want **a canonical guide defining when barrel files are appropriate, how to structure import paths, and how existing ESLint enforcement works**,
so that **all new imports follow tree-shaking-safe patterns and the icons barrel contamination lesson is institutionalized**.

## Acceptance Criteria

1. Barrel file decision matrix documenting when to use barrel files vs direct imports, with size thresholds
2. Icons barrel anti-pattern case study with real bundle size data and resolution history
3. Import alias reference table covering all 20+ aliases from tsconfig.json paths
4. ESLint `no-barrel-imports-in-ui` rule documentation (existing custom rule already active)
5. Before/after code snippets for barrel → direct import migration pattern
6. `CLAUDE.md` updated with link to new document in Key Files Reference section

## Tasks / Subtasks

- [x] Task 1: Create `docs/architecture/import-rules.md` (AC: #1-5)
  - [x] Section 1: Barrel File Decision Matrix (AC: #1)
    - When barrel files are SAFE: < 10 exports, named exports only, server-side consumption
    - When barrel files are PROHIBITED: > 15 exports, UI/App layer, `export *` pattern
    - Current barrel inventory summary (73+ files, 11 UI barrels, 12 domain barrels)
    - Decision flowchart: "Should this module have a barrel file?"
  - [x] Section 2: Icons Barrel Case Study (AC: #2)
    - History: 57-export barrel → chunk 514 (~50 KiB) → zero barrel imports after refactor
    - Bundle impact data: before vs after elimination
    - Resolution: direct path imports + ESLint enforcement
    - Current state: barrel file exists but zero consumers (can be deprecated)
  - [x] Section 3: Import Alias Reference (AC: #3)
    - Full table of all tsconfig.json path aliases (20+ entries)
    - Categorize by type: UI layers, domains, state, hooks, config, assets, test-utils
    - Mark barrel aliases vs direct-path aliases
    - Usage pattern: `@/atoms/icons/GitHubIcon` (direct) vs `@/icons` (barrel, prohibited in UI)
  - [x] Section 4: ESLint Enforcement (AC: #4)
    - Document existing custom rule: `no-barrel-imports-in-ui`
    - 9 protected barrel paths listed in `.eslintrc.js`
    - Scope: `src/ui/**/*` and `src/app/**/*` (error severity)
    - Error message format and ADR-003 reference
    - Unprotected layers: hooks, state, domains, services, lib (document gap + rationale)
  - [x] Section 5: Migration Patterns (AC: #5)
    - Before/after: barrel → direct import for icons, molecules, organisms
    - `export * from` cascading problem explained (hooks → ui → state chain)
    - Domain barrel pattern: `export * from "./model"; export * from "./queries"` risk analysis
    - How to add new components without barrel contamination
  - [x] Section 6: Current State Metrics (AC: #1)
    - 73+ barrel files total (11 UI, 12 domain, 4 hooks, 5 state, others)
    - 0 barrel imports in src/ui/ and src/app/ (100% compliance)
    - 174+ verified direct imports across UI layers
    - next.config.js `optimizePackageImports` for external packages only
  - [x] Section 7: Anti-patterns & Risk Zones (AC: #1, #2)
    - Anti-pattern: `export *` cascading re-exports (atoms → buttons + icons + links + ...)
    - Anti-pattern: Importing from barrel in UI layer
    - Risk zone: hooks/index.ts uses `export * from` 4 wildcards
    - Risk zone: state/index.ts uses `export * from` 3 wildcards
    - Risk zone: domain barrels chain model + queries together
- [x] Task 2: Update `CLAUDE.md` (AC: #6)
  - [x] Add `docs/architecture/import-rules.md` to Key Files Reference section
- [x] Task 3: Verify document quality (AC: #1-6)
  - [x] `npm run lint` — no regressions
  - [x] `npm run typecheck` — no regressions
  - [x] `npm test` — all tests pass (no code changes, but verify)

## Dev Notes

### Tipo de Story

**DOCUMENTATION ONLY** — Esta story produce un documento markdown. NO hay cambios de codigo fuente, solo `docs/architecture/import-rules.md` + update a `CLAUDE.md`.

### Datos del Codebase (auditoria exhaustiva)

#### Barrel File Inventory

| Category | Count | Pattern | Tree-shake Risk |
|----------|-------|---------|-----------------|
| UI Atoms barrels | 8 | Named `export { default as X }` | HIGH (prohibited by ESLint) |
| UI Molecules/Organisms/Overlays | 3 | Named exports | HIGH (prohibited by ESLint) |
| Domain barrels | 12 | `export * from` | MEDIUM (chains model+queries) |
| Hooks barrels | 4 | `export * from` cascading | HIGH (consumed by UI) |
| State barrels | 5 | `export * from` cascading | MEDIUM |
| Other (lib, providers, etc.) | 41+ | Varied | LOW-MEDIUM |
| **Total** | **73+** | — | — |

#### UI Barrel Files (detailed)

| Path | Extension | Export Count | Pattern |
|------|-----------|-------------|---------|
| `src/ui/atoms/icons/index.js` | .js | 57 | Named `export { default as X }` |
| `src/ui/atoms/buttons/index.ts` | .ts | 11 | Named `export { default as X }` |
| `src/ui/atoms/links/index.js` | .js | 6 | Named `export { default as X }` |
| `src/ui/atoms/texts/index.js` | .js | 5 | Named `export { default as X }` |
| `src/ui/atoms/hocs/index.js` | .js | 5 | Mix: `export *` + named |
| `src/ui/atoms/shadows/index.js` | .js | 2 | `export * from` wildcard |
| `src/ui/atoms/motion/index.js` | .js | 1 | Named `export { default as X }` |
| `src/ui/atoms/index.ts` | .ts | 9 | `export * from` (cascading ALL subcategories) |
| `src/ui/molecules/index.js` | .js | 25 | Named `export { default as X }` |
| `src/ui/organisms/index.js` | .js | 19 | Named + 5 from ArticleCard |
| `src/ui/overlays/index.js` | .js | 2 | Named `export { default as X }` |

#### Current Barrel Import Consumption (UI/App layers)

| Pattern | Count | Status |
|---------|-------|--------|
| Direct path imports (`@/atoms/icons/GitHubIcon`) | 174+ | GOOD |
| Barrel imports (`@/icons`, `@/molecules`, etc.) | **0** | CLEAN |

**100% compliance** — zero barrel imports detected in UI and App layers.

#### Cascading Wildcard Re-export Chains

```
@/atoms → export * from ./buttons, ./hocs, ./icons, ./links, ./motion, ./shadows, ./texts
  → Importing from @/atoms pulls ALL atom subcategories (57 icons + 11 buttons + ...)

@/hooks → export * from ./store, ./ui, ./domains, ./auth
  → Importing from @/hooks pulls ALL hook categories

@/state → export * from ./stores, ./slices, ./providers
  → Importing from @/state pulls ALL Redux state
```

#### TSConfig Path Aliases (complete)

| Alias | Maps To | Type |
|-------|---------|------|
| `@/app/*` | `src/app/*` | Direct |
| `@/domains/*` | `src/domains/*` | Direct |
| `@/styles/*` | `src/styles/*` | Direct |
| `@/lib/*` | `src/lib/*` | Direct |
| `@/services/*` | `src/services/*` | Direct |
| `@/shared/*` | `src/ui/shared/*` | Direct |
| `@/hooks` | `src/hooks/index.ts` | **Barrel** |
| `@/hooks/*` | `src/hooks/*` | Direct |
| `@/providers` | `src/providers/index.js` | **Barrel** |
| `@/providers/*` | `src/providers/*` | Direct |
| `@/atoms` | `src/ui/atoms/index.ts` | **Barrel** |
| `@/atoms/*` | `src/ui/atoms/*` | Direct |
| `@/buttons` | `src/ui/atoms/buttons/index.ts` | **Barrel** |
| `@/buttons/*` | `src/ui/atoms/buttons/*` | Direct |
| `@/icons` | `src/ui/atoms/icons/index.js` | **Barrel** (57 exports!) |
| `@/icons/*` | `src/ui/atoms/icons/*` | Direct |
| `@/links` | `src/ui/atoms/links/index.js` | **Barrel** |
| `@/links/*` | `src/ui/atoms/links/*` | Direct |
| `@/texts` | `src/ui/atoms/texts/index.js` | **Barrel** |
| `@/texts/*` | `src/ui/atoms/texts/*` | Direct |
| `@/molecules` | `src/ui/molecules/index.js` | **Barrel** |
| `@/molecules/*` | `src/ui/molecules/*` | Direct |
| `@/organisms` | `src/ui/organisms/index.js` | **Barrel** |
| `@/organisms/*` | `src/ui/organisms/*` | Direct |
| `@/overlays` | `src/ui/overlays/index.js` | **Barrel** |
| `@/overlays/*` | `src/ui/overlays/*` | Direct |
| `@/state/*` | `src/state/*` | Direct |
| `@/conf/*` | `src/config/*` | Direct |
| `@/images/*` | `public/images/*` | Asset |
| `@/test-utils/*` | `src/test-utils/*` | Direct |

**13 barrel aliases, 15+ direct aliases.**

#### ESLint Custom Rule (existing enforcement)

| Property | Value |
|----------|-------|
| Rule name | `rulesdir/no-barrel-imports-in-ui` |
| Rule file | `eslint-rules/no-barrel-imports-in-ui.js` |
| Severity | `error` (blocks CI) |
| Scope | `src/ui/**/*`, `src/app/**/*` |
| Protected barrels | `@/atoms`, `@/buttons`, `@/icons`, `@/links`, `@/texts`, `@/molecules`, `@/organisms`, `@/overlays`, `@/hooks` |
| Error message | `Barrel import from '{{source}}' harms tree-shaking. Use a direct path import instead.` |
| Reference | ADR-003 |

#### Unprotected Layers (ESLint gap)

| Layer | Can import from barrels | Risk |
|-------|------------------------|------|
| `src/hooks/**/*` | Yes | HIGH — hooks cascade to UI |
| `src/state/**/*` | Yes | MEDIUM — state internal |
| `src/domains/**/*` | Yes | LOW — server-side primarily |
| `src/services/**/*` | Yes | LOW |
| `src/lib/**/*` | Yes | LOW |

#### Next.js Tree-shaking Config

```javascript
// next.config.js
experimental: {
  optimizePackageImports: ["framer-motion", "@tanstack/react-query", "zod", "immer"],
  optimizeCss: true,
}
```

Only external packages are optimized. Internal barrel files are NOT covered by `optimizePackageImports`.

### Scope Boundaries — Que NO Hacer

| NO hacer | Razon |
|----------|-------|
| Eliminar barrel files existentes | Solo documentar reglas, cleanup es epic futuro |
| Modificar .eslintrc.js | Solo documentar regla existente |
| Cambiar tsconfig.json paths | Solo documentar aliases, reorganizacion es futuro |
| Tocar `src/` | Epic 20 es docs-only |
| Agregar `modularizeImports` | Solo documentar, decision de implementacion es futuro |

### Previous Story Intelligence (Story 20.4)

- Story 20.4 creo `docs/architecture/test-conventions.md` exitosamente
- Code review encontro 5 issues (1 HIGH, 1 MEDIUM, 3 LOW) — todos corregidos
- Key learning: verificar TODOS los numeros contra codebase real (snapshot counts, distribution table)
- Key learning: "Based on" vs "Adapted from" para templates simplificados
- Pattern: documentar excepciones historicas explicitamente
- Pattern: incluir cross-references a otros documentos del epic
- **Verificacion triple**: Todo dato citado en el documento debe ser verificable contra codebase real

### Documentacion Existente a Referenciar

| Documento | Contenido Relevante |
|-----------|-------------------:|
| `docs/architecture/folder-structure.md` | Component folder structure, barrel file mentions (Story 20.1) |
| `docs/architecture/styles-architecture.md` | Import patterns for CSS (Story 20.2) |
| `docs/architecture/component-api.md` | Import patterns for props types (Story 20.3) |
| `docs/architecture/test-conventions.md` | Import patterns for test mocks (Story 20.4) |
| `CLAUDE.md` | Performance Anti-pattern: Barrel Imports section |
| `.eslintrc.js` | Custom rule `no-barrel-imports-in-ui` configuration |
| `eslint-rules/no-barrel-imports-in-ui.js` | Custom rule implementation |
| `tsconfig.json` | Path aliases (20+ entries) |
| `next.config.js` | `optimizePackageImports` configuration |

### References

- [Source: _bmad-output/implementation-artifacts/epic-20-component-style-architecture.md#Story 20.5]
- [Source: tsconfig.json — compilerOptions.paths (20+ aliases)]
- [Source: .eslintrc.js — overrides[].rules.rulesdir/no-barrel-imports-in-ui]
- [Source: eslint-rules/no-barrel-imports-in-ui.js — custom rule implementation]
- [Source: next.config.js — experimental.optimizePackageImports]
- [Source: CLAUDE.md — Performance Anti-pattern: Barrel Imports]
- [Source: src/ui/atoms/icons/index.js — 57-export barrel (zero consumers)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A — documentation-only story, no debugging needed.

### Completion Notes List

- All 7 sections written covering barrel file decision matrix (safe/prohibited thresholds + decision flowchart), icons barrel case study (57 exports → chunk 514 ~50 KiB → eliminated → zero consumers), import alias reference (20+ direct + 10 barrel aliases from tsconfig.json), ESLint enforcement (existing `no-barrel-imports-in-ui` custom rule, 9 protected paths, error severity, scope documentation), migration patterns (3 before/after examples: icons, molecules, organisms + cascading wildcard problem + domain barrel risk + new component pattern), current state metrics (~56 barrel files, 0 barrel imports in UI/App, 100% compliance, optimizePackageImports external-only), anti-patterns & risk zones (3 anti-patterns + 3 risk zones: hooks cascading, state cascading, domain model+queries chain)
- Data sourced from exhaustive codebase audit: 57 icon exports, 25 molecule exports, 19 organism exports, 11 button exports verified against real barrel files
- ESLint rule implementation verified: `eslint-rules/no-barrel-imports-in-ui.js` (73 lines), `.eslintrc.js` overrides configuration
- Cross-references to folder-structure.md, styles-architecture.md, component-api.md, test-conventions.md, CLAUDE.md, ESLint rule source
- Lint, typecheck, 983 tests — all passing, 0 regressions

### File List

| Archivo | Accion | Estado |
|---------|--------|--------|
| `docs/architecture/import-rules.md` | CREAR | done |
| `CLAUDE.md` | MODIFICAR — agregar referencia en Key Files Reference | done |
