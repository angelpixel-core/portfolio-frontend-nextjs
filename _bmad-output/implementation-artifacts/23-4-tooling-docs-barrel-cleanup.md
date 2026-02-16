# Story 23.4: Tooling & Docs para Barrel Cleanup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como **team lead**,
quiero **automatizar la detección de barrel imports prohibidos y documentar el proceso de cleanup**,
para que **cualquier regresión futura se bloquee automáticamente y el equipo tenga una guía clara**.

## Acceptance Criteria

1. **AC1: ESLint rule completa y testeada** — Regla `no-barrel-imports-in-ui` verificada con tests incluidos en la suite de Jest (no solo ejecutables con `node`). El test file (`eslint-rules/__tests__/no-barrel-imports-in-ui.test.js`) debe ejecutarse como parte de `npm test`.
2. **AC2: Documentación playbook** — `docs/architecture/import-rules.md` ampliado con una sección "9. Barrel Cleanup Playbook (Epic 23)":
   - Pasos para detectar barrels prohibidos
   - Ejemplos de migración de imports (`@/icons` → `@/atoms/icons/GitHubIcon`, etc.)
   - Cómo interpretar los errores de ESLint relacionados con barrels
   - Checklist de cleanup para futuros barrels
3. **AC3: Script de auditoría** — Script `npm run audit:barrels` que liste: (a) todos los barrel files en `src/`, (b) tipo de export (named vs `export *`), (c) cantidad de exports, (d) barrels con `export *` (candidates para conversión).
4. **AC4: Métricas stale corregidas** — `docs/architecture/import-rules.md` y `docs/architecture/folder-structure.md` verificados y corregidos para reflejar el estado post-Epic 23 (Stories 23.1–23.3).
5. **AC5: Lint, typecheck y tests pasan** — `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` pasan sin nuevos errores.

## Tasks / Subtasks

- [x] Task 1: Integrar ESLint rule tests en Jest (AC: #1)
  - [x] Verificar que `eslint-rules/__tests__/no-barrel-imports-in-ui.test.js` pasa con `node` actualmente
  - [x] Configurar Jest para incluir `eslint-rules/__tests__/` en la suite (ya incluido — testMatch `**/__tests__/**/*.test.[jt]s?(x)` lo cubre)
  - [x] Verificar que `npm test` ejecuta el test file y los 27 cases (15 valid + 12 invalid) pasan
  - [x] No necesario — Jest ejecuta RuleTester directamente sin wrapper
- [x] Task 2: Verificar y corregir métricas stale en docs (AC: #4)
  - [x] `docs/architecture/import-rules.md` sección 3: Corregido 6 barrel paths `.js` → `.ts` (migrados en Epic 22)
  - [x] `docs/architecture/import-rules.md` sección 4: Corregido ESLint config comments — `.js` → `.ts` + organisms "19" → "20" + hooks "4 wildcard" → "24 named"
  - [x] `docs/architecture/import-rules.md` sección 6: organisms count verificado: 20 es correcto (16 export lines, 15 single + 1 multi-export de 5)
  - [x] `docs/architecture/folder-structure.md`: Corregido "58+ icons" → "57", barrel aliases `.js` → `.ts`, icons barrel "index.js" → "index.ts"
  - [x] CLAUDE.md: Corregido "index.js re-exports 58+" → "index.ts re-exports 57"
- [x] Task 3: Crear script de auditoría de barrels (AC: #3)
  - [x] Crear `scripts/audit-barrels.ts` (TypeScript) que:
    - Busque todos los `index.ts`/`index.js` en `src/` que contengan `export`
    - Clasifique tipo: `export *` vs named `export {` vs `export { default as`
    - Cuente exports por archivo
    - Flaggee barrels con `export *` como "candidates for conversion"
    - Output: tabla formateada por consola
  - [x] Añadir script en `package.json`: `"audit:barrels": "npx tsx scripts/audit-barrels.ts"`
  - [x] Verificar que el script funciona correctamente — 45 barrels detectados (12 candidates, 33 safe)
- [x] Task 4: Escribir Barrel Cleanup Playbook (AC: #2)
  - [x] Añadir sección "9. Barrel Cleanup Playbook (Epic 23)" a `docs/architecture/import-rules.md`
  - [x] Incluir subsecciones:
    - "How to Detect Prohibited Barrels" (usando el audit script + ESLint)
    - "Migration Guide" (paso a paso con ejemplos before/after)
    - "Understanding ESLint Errors" (qué significa el error, cómo corregirlo)
    - "Cleanup Checklist" (checklist para convertir un barrel)
    - "When to Keep a Barrel" (decision criteria resumida de sección 1)
- [x] Task 5: Ejecutar suite de validación completa (AC: #5)
  - [x] `npm run lint` — sin errores (0 warnings)
  - [x] `npm run typecheck` — sin errores
  - [x] `npm test` — 987 tests, 99 suites, all passing (incluye 27 ESLint rule tests)
  - [x] `npm run build` — build exitoso

## Dev Notes

### Contexto del Epic

Story 23.4 es la última story de **Epic 23: Barrel File Cleanup**. Stories 23.1 (Icons), 23.2 (UI Barrels), y 23.3 (Safe Barrels) están completadas. Esta story consolida la automatización y documentación.

### Estado Actual de la ESLint Rule

**Archivo:** `eslint-rules/no-barrel-imports-in-ui.js`
- 9 barrel paths protegidos: `@/atoms`, `@/buttons`, `@/icons`, `@/links`, `@/texts`, `@/molecules`, `@/organisms`, `@/overlays`, `@/hooks`
- Scope: `src/ui/**/*` y `src/app/**/*` (severity: `error`)
- Permite side-effect imports y sub-path imports

**Test file existente:** `eslint-rules/__tests__/no-barrel-imports-in-ui.test.js`
- 15 valid cases + 12 invalid cases = 27 test cases
- Usa `RuleTester` de ESLint (CommonJS)
- Se ejecuta con `node` standalone o vía `npm test` (Jest)
- **Incluido en Jest** — `testMatch: **/__tests__/**/*.test.[jt]s?(x)` lo cubre

### ESLint Rule — Rutas NO protegidas

| Barrel | Razón de exclusión |
|--------|-------------------|
| `@/state` | Interno, bajo riesgo (52 named re-exports post-23.3) |
| `@/providers` | Solo 1 export |
| `@/lib` | Solo 1 export |
| `@/domains/*` | Server-side DDD pattern |
| `@/services/*` | Bajo impacto |

**Decisión: No añadir `@/state` a la ESLint rule** — ya tiene 0 imports directos desde UI/App y el riesgo es bajo.

### Métricas a Verificar/Corregir

| Documento | Sección | Issue |
|-----------|---------|-------|
| `import-rules.md` | Sección 3 (Barrel Aliases) | Verificar que `@/hooks` dice "24 named re-exports" (ya corregido en 23.3 review) |
| `import-rules.md` | Sección 6 (Metrics) | organisms: doc dice "20 exports", ESLint config dice "19", barrel file tiene 16 export lines |
| `folder-structure.md` | Barrel section | "58+ icons" puede ser "57 named" |
| CLAUDE.md | Anti-pattern section | "58+ icons" puede ser "57 named" (verificar) |

### Script de Auditoría — Diseño

```typescript
// scripts/audit-barrels.ts
// Input: scan src/**/(index.ts|index.js)
// Output: table with columns:
//   File | Exports | Type | export * Count | Status
// where:
//   Type = "named" | "wildcard" | "mixed"
//   Status = "safe" | "candidate for conversion"
```

**Dependencia:** `tsx` ya está disponible como devDependency o se usa `npx tsx`.

### Playbook — Estructura Planificada

```markdown
## 9. Barrel Cleanup Playbook (Epic 23)

### 9.1 How to Detect Prohibited Barrels
### 9.2 Migration Guide (Step by Step)
### 9.3 Understanding ESLint Errors
### 9.4 Cleanup Checklist
### 9.5 When to Keep a Barrel (Decision Criteria)
```

### Lecciones de Stories 23.1–23.3

1. **File List debe distinguir Modified vs Referenced**
2. **Usar counts exactos** — nunca "~" aproximaciones
3. **Mantener docs sincronizados** — reviews de 23.2 y 23.3 ambos encontraron datos stale en import-rules.md
4. **Verificar export types exactos** antes de documentar (named vs default)
5. **Ejecutar tests después de cada cambio**
6. **Grep para export * residuales** como verificación final

### Risk Assessment

- **Riesgo**: Bajo
- **Razón**: Story de tooling/docs — no modifica código de producción
- **Riesgo principal**: Jest config change podría afectar test discovery si se amplía el testMatch incorrectamente
- **Mitigación**: Verificar que solo se incluye el directorio `eslint-rules/__tests__/`, no todo `eslint-rules/`

### Project Structure Notes

- Scripts van en `scripts/` (crear directorio si no existe)
- `tsx` disponible via `npx tsx` (no requiere devDependency adicional)
- Jest config en `jest.config.cjs` (CommonJS)
- Docs architecture en `docs/architecture/`

### Referencias

- [Source: eslint-rules/no-barrel-imports-in-ui.js] — Custom ESLint rule implementation
- [Source: eslint-rules/__tests__/no-barrel-imports-in-ui.test.js] — 22 test cases (RuleTester)
- [Source: .eslintrc.js#overrides] — Rule configuration (9 barrel paths, error severity)
- [Source: docs/architecture/import-rules.md] — Complete barrel documentation (8 sections)
- [Source: docs/architecture/folder-structure.md#Section 9] — Barrel file rules summary
- [Source: CLAUDE.md#Performance Anti-pattern] — Barrel imports warning
- [Source: jest.config.cjs] — Test configuration
- [Source: _bmad-output/implementation-artifacts/23-3-safe-barrels-lib-domains-hooks-state.md#Review Record] — Stale metrics findings from 23.3 review
- [Source: _bmad-output/implementation-artifacts/epic-23-barrel-file-cleanup.md#Story 23.4] — Epic-level requirements

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

None — no blocking issues encountered.

### Completion Notes List

1. **Task 1 (AC1)**: ESLint rule tests already discovered by Jest — `testMatch: **/__tests__/**/*.test.[jt]s?(x)` covers `eslint-rules/__tests__/`. Verified 27 tests (15 valid + 12 invalid) pass via `npm test`. No code changes needed.
2. **Task 2 (AC4)**: Fixed stale metrics across 3 doc files:
   - `import-rules.md`: 6 barrel paths `.js` → `.ts`, organisms count "19" → "20", hooks "4 wildcard cascading" → "24 named re-exports"
   - `folder-structure.md`: "58+" → "57", `.js` → `.ts` in barrel aliases table, icons barrel "index.js" → "index.ts"
   - `CLAUDE.md`: "index.js re-exports 58+" → "index.ts re-exports 57"
3. **Task 3 (AC3)**: Created `scripts/audit-barrels.ts` (TypeScript) — scans `src/` for barrel files, classifies by type (named/wildcard/mixed), flags `export *` barrels as candidates. Added `npm run audit:barrels` script. Output: 49 barrels (12 candidates, 37 safe). Exits with code 1 when candidates found (CI-ready).
4. **Task 4 (AC2)**: Added section "9. Barrel Cleanup Playbook (Epic 23)" to `import-rules.md` with 5 subsections: Detection, Migration Guide, ESLint Errors, Cleanup Checklist, Decision Criteria.
5. **Task 5 (AC5)**: Full validation passed — lint (0 warnings), typecheck, 987 tests (99 suites), build successful.

### File List

**Modified:**
- `docs/architecture/import-rules.md` — Fixed stale metrics (Task 2) + added Playbook section 9 (Task 4)
- `docs/architecture/folder-structure.md` — Fixed stale counts and file extensions (Task 2)
- `CLAUDE.md` — Fixed icons barrel reference (Task 2)
- `package.json` — Added `audit:barrels` script (Task 3)

**Created:**
- `scripts/audit-barrels.ts` — Barrel audit script (Task 3)

### Review Record

**Reviewer:** Claude Opus 4.6 (adversarial code review)
**Date:** 2026-02-16

**Issues Found:** 1 High, 2 Medium, 2 Low — all fixed.

| ID | Severity | Issue | Fix |
|----|----------|-------|-----|
| H1 | High | `audit-barrels.ts` missed multi-line `export { ... }` blocks — state reported 8 (actual 52), organisms reported 15 (actual 20) | Rewrote parser: collapse multi-line blocks before counting. Verified: state=52, organisms=20 |
| M1 | Medium | `import-rules.md` section 3 `@/atoms` still said "7 `export *` + 1 named" (pre-23.2 state) | Updated to "30 named" |
| M2 | Medium | Story Dev Notes said "22 test cases" and "NO está incluido en Jest" — contradicts Task 1 findings (27 tests, IS included) | Updated to "27 test cases" and "Incluido en Jest" |
| L1 | Low | organisms count inconsistency between docs (20) and script (15) | Resolved by H1 — script now reports 20 |
| L2 | Low | Script had no `process.exit(1)` for CI gate usage | Added `process.exit(1)` when candidates found |
