# Story 20.1: Folder Structure & Naming Conventions

Status: review

## Story

As a **developer working on the portfolio frontend**,
I want **a canonical, documented folder structure and naming convention guide**,
so that **all new files are placed consistently and naming conflicts are prevented across the codebase**.

## Acceptance Criteria

1. Document `docs/architecture/folder-structure.md` created with canonical path definitions for every file type
2. Document includes complete directory tree visualization of `src/`
3. Document lists ALL known misplacements with proposed resolution paths
4. Before/after examples for at least 3 component types (atom, molecule, organism)
5. Naming rules table with valid/invalid examples for each layer
6. File extension rules documented: `.tsx` for components, `.ts` for logic, never `.jsx`/`.js` for new files
7. Barrel file rules cross-referenced (detailed in Story 20.5)
8. `CLAUDE.md` updated with link to new document in Key Files Reference section

## Tasks / Subtasks

- [x] Task 1: Create `docs/architecture/` directory (AC: #1)
  - [x] `mkdir -p docs/architecture`
- [x] Task 2: Write `docs/architecture/folder-structure.md` (AC: #1-7)
  - [x] Section 1: Canonical Directory Tree — complete `src/` visualization with annotations
  - [x] Section 2: Layer Definitions — atoms, molecules, organisms, overlays, shared, domains, state, hooks, providers, lib, app
  - [x] Section 3: Atom Subcategory Rules — buttons/, icons/, links/, texts/, motion/, shadows/ (lowercase category folders, PascalCase component folders)
  - [x] Section 4: Component Folder Contents — `index.tsx` + `styles.css` + `__tests__/` + `skeleton.tsx` + `*.types.ts`
  - [x] Section 5: Naming Convention Rules Table — PascalCase for components, camelCase for hooks/slices, kebab-case for domains
  - [x] Section 6: File Extension Rules — `.tsx`/`.ts` only for new files, never `.jsx`/`.js`
  - [x] Section 7: Known Misplacements & Resolutions — audit findings with proposed fixes
  - [x] Section 8: Before/After Examples — 3 component types showing correct structure
  - [x] Section 9: Barrel File Rules (cross-reference Story 20.5)
- [x] Task 3: Update `CLAUDE.md` (AC: #8)
  - [x] Add `docs/architecture/folder-structure.md` to Key Files Reference section
- [x] Task 4: Verify document quality (AC: #1-8)
  - [x] `npm run lint` — no regressions
  - [x] `npm run typecheck` — no regressions
  - [x] `npm test` — all tests pass (no code changes, but verify)

## Dev Notes

### Tipo de Story

**DOCUMENTATION ONLY** — Esta story produce un documento markdown. NO hay cambios de código fuente, solo `docs/architecture/folder-structure.md` + update a `CLAUDE.md`.

### Auditoría del Estado Actual (datos reales del codebase)

#### Distribución de Archivos en `src/`

| Extension | Count | Percentage |
|-----------|-------|------------|
| `.tsx` | 159 | 32.2% |
| `.ts` | 165 | 33.4% |
| `.jsx` | 146 | 29.6% |
| `.js` | 24 | 4.8% |
| **TypeScript total** | **324** | **65.6%** |
| **JavaScript total** | **170** | **34.4%** |

#### Distribución en `src/ui/`

| Extension | Count |
|-----------|-------|
| `.tsx` | 115 |
| `.jsx` | 138 |
| `.ts` | 13 |
| `.js` | 15 |
| `.css` | 76 |

#### Naming Conventions Actuales por Layer

| Layer | Convention | Exceptions |
|-------|-----------|-----------|
| **Domains** (`src/domains/`) | kebab-case | Ninguna — 100% consistente |
| **UI Components** | PascalCase | `molecules/skill/` (lowercase) |
| **UI Atom subcategories** | lowercase folders | Ninguna |
| **State Slices** | camelCase | `EmailClipboard/` (PascalCase) |
| **Hooks** | camelCase (`useX`) | Ninguna |
| **App Routes** | lowercase | Ninguna (Next.js standard) |

### Misplacements Conocidos (de auditoría de codebase)

| Item | Ubicación Actual | Problema | Resolución Propuesta |
|------|-----------------|----------|---------------------|
| `atoms/hocs/` | `src/ui/atoms/hocs/` | HOCs no son atoms — son utility wrappers | Documentar como excepción histórica o proponer mover a `src/lib/hocs/` |
| `molecules/skill/` | `src/ui/molecules/skill/` | Único folder en lowercase entre components | Proponer rename a `Skill/` (acción futura, no en esta story) |
| `molecules/model/` | `src/ui/molecules/model/` | Contiene solo `schema.ts` — dominio, no UI | Investigar propósito; proponer mover a dominio o eliminar |
| `atoms/ArticleHoverThumbnail/` | `src/ui/atoms/ArticleHoverThumbnail/` | No está dentro de una subcategoría (buttons/, links/, etc.) | Documentar como excepción o proponer subcategoría |
| `state/slices/EmailClipboard/` | PascalCase entre camelCase slices | Inconsistente con `authPanel/`, `chatPanel/`, etc. | Documentar como excepción histórica |

### Import Aliases Actuales (de tsconfig.json)

```
@/atoms       → src/ui/atoms/index.ts
@/atoms/*     → src/ui/atoms/*
@/buttons     → src/ui/atoms/buttons/index.ts
@/icons       → src/ui/atoms/icons/index.js     ⚠️ BARREL (58+ exports)
@/links       → src/ui/atoms/links/index.js
@/texts       → src/ui/atoms/texts/index.js
@/molecules   → src/ui/molecules/index.js
@/organisms   → src/ui/organisms/index.js
@/overlays    → src/ui/overlays/index.js
@/domains/*   → src/domains/*
@/hooks       → src/hooks/index.ts
@/state/*     → src/state/*
@/lib/*       → src/lib/*
@/conf/*      → src/config/*
@/services/*  → src/services/*
@/shared/*    → src/ui/shared/*
@/providers   → src/providers/index.js
@/test-utils/* → src/test-utils/*
@/images/*    → public/images/*
```

### Atom Subcategories (estado actual)

| Categoría | Components | Barrel File |
|-----------|-----------|-------------|
| `buttons/` | 12 | `index.ts` |
| `icons/` | 58 | `index.js` ⚠️ BUNDLE RISK |
| `links/` | 6 | `index.js` |
| `texts/` | 6 | `index.js` |
| `hocs/` | 4 | `index.js` (⚠️ misplaced) |
| `motion/` | 2 | `index.js` |
| `shadows/` | 2 | `index.js` |

### Component Folder Patterns (observados)

**Pattern estándar:**
```
ComponentName/
├── __tests__/
│   └── ComponentName.test.tsx
├── index.{tsx|jsx}
├── styles.css
└── skeleton.{tsx|jsx}        # optional
```

**Pattern con types:**
```
ComponentName/
├── __tests__/
├── index.tsx
├── ComponentName.types.ts    # if > 10 props or shared
├── styles.css
└── skeleton.tsx
```

**Pattern con sub-components:**
```
ComponentName/
├── __tests__/
├── index.tsx
├── SubComponent.tsx
├── AnotherSub.tsx
├── ComponentName.types.ts
├── styles.css
├── utils/
│   └── helper.ts
└── variants/
    ├── Featured.tsx
    └── Grid.tsx
```

### Skeleton File Distribution

- 20 skeleton files totales
- 4 `.tsx`, 16 `.jsx`
- Naming: `skeleton.{tsx|jsx}` (lowercase)

### Domain Layer Pattern (100% consistente)

```
domain-name/               # kebab-case
├── model/
│   ├── index.ts           # fetchAll, fetchById
│   ├── mock.ts            # Development mock data
│   └── schema.ts          # Zod schema + TypeScript types
├── queries/
│   ├── useDomain.ts       # React Query hook
│   └── index.ts           # barrel
└── index.ts               # domain barrel
```

11 domains: `academic`, `article`, `contact-point`, `content`, `customer`, `experience-stat`, `job-experience`, `navigation-item`, `profile`, `project`, `technology`

### Documentación Existente a Referenciar

| Documento | Contenido Relevante |
|-----------|-------------------|
| `docs/architecture.md` | Executive summary, stack, architecture diagram, layer responsibilities |
| `docs/layout-system.md` | Breakpoint system, header zones |
| `docs/index.md` | Master index, component inventory |
| `docs/adr/ADR-002.md` | Breakpoint standardization |
| `docs/adr/ADR-003.md` | Import strategy (barrel vs direct) |
| `CLAUDE.md` | Directory Structure, Import Aliases, Performance anti-patterns |

### Directorio `docs/architecture/` NO EXISTE

Se debe crear `docs/architecture/` como nuevo directorio. Actualmente `docs/` contiene:
- `architecture.md` (flat, en root de docs/)
- `layout-system.md`
- `index.md`
- `adr/` (5+ ADR documents)
- `component-inventory.md`

El nuevo archivo va en `docs/architecture/folder-structure.md` (subdirectorio nuevo).

### Project Structure Notes

- Este es un epic de DOCUMENTATION — no modifica código fuente
- `docs/architecture/` será el home de todos los documentos de Epic 20
- Solo se modifican 2 archivos: nuevo `folder-structure.md` + update `CLAUDE.md`
- Los misplacements se **documentan** pero NO se corrigen (corrección es epic futuro)

### Scope Boundaries — Qué NO Hacer

| NO hacer | Razón |
|----------|-------|
| Renombrar folders/archivos | Solo documentar, no migrar |
| Crear ESLint rules | Solo documentar reglas, implementar en epic futuro |
| Modificar tsconfig.json | Solo documentar aliases existentes |
| Eliminar barrel files | Solo documentar anti-pattern, acción en Story 20.5 |
| Tocar `src/` | Epic 20 es docs-only |

### References

- [Source: _bmad-output/implementation-artifacts/epic-20-component-style-architecture.md#Story 20.1]
- [Source: docs/architecture.md — executive summary, layer definitions]
- [Source: docs/adr/ADR-003.md — import strategy decisions]
- [Source: tsconfig.json — all import path aliases]
- [Source: CLAUDE.md — Directory Structure, Import Aliases sections]
- [Source: _bmad-output/implementation-artifacts/epic-19-retro-2026-02-12.md — action items]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A — documentation-only story, no debugging needed.

### Completion Notes List

- All 9 sections written covering canonical tree, layer definitions, naming rules, extension rules, misplacements, before/after examples, barrel file rules, import aliases, and codebase metrics appendix
- Comprehensive audit data from real codebase: 494 files in src/, 65.6% TypeScript
- 5 known misplacements documented with proposed resolutions
- 3 before/after examples: atom (button), molecule, organism
- Cross-reference to Story 20.5 for barrel file detailed rules
- Lint, typecheck, 983 tests — all passing, 0 regressions

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `docs/architecture/folder-structure.md` | CREAR | done |
| `CLAUDE.md` | MODIFICAR — agregar referencia en Key Files Reference | done |
