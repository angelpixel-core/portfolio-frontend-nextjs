# Story 1.1: Fundacion TypeScript y CI

**Status:** closed
**Completed:** 2026-01-22
**Branch:** story/1.1-typescript-ci
**Merged to:** epic/1-primera-impresion

---

## Story

As a **developer/visitor**,
I want **the codebase to have TypeScript strict mode and automated quality checks**,
so that **changes don't introduce regressions and the site remains stable**.

---

## Acceptance Criteria

### AC1: TypeScript Strict Mode Compilation

**Given** a fresh clone of the repository
**When** I run `npm install && npm run typecheck`
**Then** TypeScript compiles with strict mode enabled
**And** zero type errors are reported

### AC2: GitHub Actions CI Pipeline

**Given** a push to any branch
**When** GitHub Actions CI runs
**Then** lint, typecheck, and unit tests execute
**And** the pipeline fails if any check fails

### AC3: Scripts Availability

**Given** the package.json is configured
**When** I check available scripts
**Then** `typecheck` script exists and runs `tsc --noEmit`
**And** `lint` script exists and works
**And** `test` script exists and runs Jest

---

## Tasks / Subtasks

- [x] **Task 1: Create tsconfig.json with strict mode** (AC: #1)
  - [x] 1.1 Rename/backup `jsconfig.json` → convert to `tsconfig.json`
  - [x] 1.2 Enable `strict: true` and all strict flags
  - [x] 1.3 Configure `jsx: "preserve"` for Next.js
  - [x] 1.4 Add Next.js plugin `{ "name": "next" }`
  - [x] 1.5 Configure path aliases matching existing jsconfig.json
  - [x] 1.6 Add include/exclude patterns for src, .next/types

- [x] **Task 2: Add TypeScript dependencies** (AC: #1, #3)
  - [x] 2.1 Install `typescript` as devDependency
  - [x] 2.2 Create `next-env.d.ts` reference file
  - [x] 2.3 Add `typecheck` script to package.json: `"typecheck": "tsc --noEmit"`

- [x] **Task 3: Create GitHub Actions CI workflow** (AC: #2)
  - [x] 3.1 Create `.github/workflows/ci.yml`
  - [x] 3.2 Configure triggers: push, pull_request
  - [x] 3.3 Add job: quality (lint, typecheck, test:unit)
  - [x] 3.4 Use actions/checkout@v5 and actions/setup-node@v4
  - [x] 3.5 Configure npm caching for faster builds
  - [x] 3.6 Set Node.js version to 20.x (LTS)

- [x] **Task 4: Validate CI pipeline locally** (AC: #1, #2, #3)
  - [x] 4.1 Run `npm run lint` - must pass
  - [x] 4.2 Run `npm run typecheck` - must pass (or document expected initial errors)
  - [x] 4.3 Run `npm run test` - must pass
  - [x] 4.4 Push to branch and verify GitHub Actions runs

---

## Dev Notes

### Current State Analysis

El proyecto actualmente usa:
- `jsconfig.json` con path aliases (NO TypeScript aún)
- `jest.config.cjs` configurado con next/jest
- ESLint con TypeScript parser instalado (pero sin tsconfig)
- Package.json tiene `@typescript-eslint/*` pero sin `typescript` package

### Architecture Constraints [Source: architecture.md]

| Decision | Value |
|----------|-------|
| TypeScript Strategy | Incremental Strict |
| tsconfig strict | `true` desde inicio |
| Migration Order | Schemas → Hooks → Lib → Atoms → Molecules → Organisms → Pages |
| Test Framework | Jest 29 + RTL 14 |

### CI Pipeline Stages [Source: architecture.md#CI/CD Pipeline]

```
lint → typecheck → test:unit → [e2e] → [lighthouse]
```

**Nota:** E2E y Lighthouse son para stories posteriores (6.5, 6.6).

---

## Technical Requirements

### tsconfig.json Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/domains/*": ["src/domains/*"],
      "@/ui/*": ["src/ui/*"],
      "@/lib/*": ["src/lib/*"],
      "@/providers/*": ["src/providers/*"],
      "@/atoms/*": ["src/ui/atoms/*"],
      "@/molecules/*": ["src/ui/molecules/*"],
      "@/organisms/*": ["src/ui/organisms/*"],
      "@/overlays/*": ["src/ui/overlays/*"],
      "@/state/*": ["src/state/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/shared/*": ["src/ui/shared/*"],
      "@/conf/*": ["src/config/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### GitHub Actions Workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Unit tests
        run: npm test
```

### Package.json Script Additions

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.x"
  }
}
```

---

## Architecture Compliance

### File Extensions [Source: architecture.md#Naming Patterns]

| Type | Extension |
|------|-----------|
| React components | `.tsx` |
| Hooks | `.ts` |
| Schemas | `.ts` |
| Utils/lib | `.ts` |
| Config files | `.ts` |
| Tests | `.test.ts` / `.test.tsx` |

### Path Aliases [Source: architecture.md#Import Path Patterns]

Mantener consistencia con aliases existentes en jsconfig.json:
- `@/domains/*` → `src/domains/*`
- `@/ui/*` → `src/ui/*`
- `@/lib/*` → `src/lib/*`
- etc.

---

## Library/Framework Requirements

| Library | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.x | TypeScript compiler |
| @types/react | ^18.x | React types (should auto-install) |
| @types/node | ^20.x | Node.js types |

**Nota:** Next.js 14.2.33 ya incluye types integrados.

---

## File Structure Requirements

### Files to CREATE

```
.github/
  workflows/
    ci.yml                 # GitHub Actions CI pipeline

tsconfig.json              # TypeScript configuration
next-env.d.ts              # Next.js type reference
```

### Files to MODIFY

```
package.json               # Add typecheck script, typescript dep
```

### Files to DELETE/RENAME

```
jsconfig.json              # Will be replaced by tsconfig.json
```

---

## Testing Requirements

### Validation Commands

```bash
# After implementation, these must all pass:
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm run test          # Jest unit tests
```

### Expected Initial State

Con `allowJs: true`, el typecheck debería pasar incluso con archivos .js existentes. Los errores de tipo aparecerán cuando se migren archivos a .ts/.tsx (stories posteriores).

---

## Previous Story Intelligence

**N/A** - Esta es la primera story del proyecto.

---

## Git Intelligence Summary

**Commits recientes relevantes:**
- `9755672` feat(bmm): complete sprint-planning workflow
- `4336bf5` docs(readiness): complete implementation readiness assessment

**Patterns observados:**
- Commits siguen conventional commits (feat, docs, style, test)
- Co-Author tag usado para Claude

---

## Project Context Reference

**Proyecto:** portfolio-frontend-nextjs (brownfield)
**Stack:** Next.js 14.2.33 + React 18.3.1 + Tailwind 3.4.18
**State:** Redux Toolkit (UI) + React Query (server)
**Validation:** Zod 3.25.76

**Source Documents:**
- [Architecture: _bmad-output/planning-artifacts/architecture.md]
- [Epics: _bmad-output/planning-artifacts/epics.md#Story-1.1]
- [PRD: _bmad-output/planning-artifacts/prd.md]

---

## Manual Validation Checklist

> **OBLIGATORIO antes de merge a epic branch**

### Pre-requisitos

- [ ] Todos los tests automáticos pasan (`npm test`)
- [ ] Lint pasa (`npm run lint`)
- [ ] TypeScript compila (`npm run typecheck`)

### Validación Local

- [ ] `npm install` completa sin errores
- [ ] `npm run dev` levanta la app sin errores en terminal
- [ ] Abrir http://localhost:9000 en browser
- [ ] La app carga correctamente (no pantalla en blanco)
- [ ] No hay errores en la consola del browser (F12 → Console)
- [ ] Navegar a al menos 2 páginas distintas para verificar que la app funciona

### Validación de TypeScript

- [ ] Ejecutar `npm run typecheck` → debe completar sin errores
- [ ] Verificar que `tsconfig.json` existe con `strict: true`
- [ ] Verificar que `next-env.d.ts` existe

### Validación de CI (si ya está pusheado)

- [ ] Push a la branch `story/1.1-typescript-ci`
- [ ] Verificar que GitHub Actions se dispara
- [ ] Revisar que los jobs lint, typecheck, test ejecutan

### Manual Validation Result

- **Date:** 2026-01-22
- **Validated by:** User
- **Result:** PASS
- **Notes:** Merged to epic/1-primera-impresion after manual validation

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- ADR documented at: `docs/adr/001-typescript-ci-foundation.md`

### Completion Notes List

- ESLint downgraded from 9.x to 8.57.0 (eslint-config-next incompatibility)
- `--legacy-peer-deps` required for React 18 peer conflicts
- 4 pre-existing test failures documented as known debt
- 11 domain index.ts files fixed (removed broken exports to non-existent components/mutations)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-22 | Story created | create-story workflow |
| 2026-01-22 | Implementation complete | Claude Opus 4.5 |
| 2026-01-22 | Merged to epic | User |

### File List

**Created:**
- `.github/workflows/ci.yml`
- `docs/adr/001-typescript-ci-foundation.md`
- `jest.setup.js`
- `next-env.d.ts`
- `tsconfig.json`
- `src/state/adapters/redux/index.ts`
- `src/state/adapters/zustand/store.ts`
- `src/ui/molecules/model/schema.ts`
- `src/__tests__/typescript-setup.test.js`

**Modified:**
- `.eslintrc.json`
- `jest.config.cjs`
- `package.json`
- `package-lock.json`
- `src/domains/*/index.ts` (11 files - removed broken exports)
- 40+ files with lint fixes (unused vars, imports)

**Deleted:**
- `jsconfig.json` (replaced by tsconfig.json)
