# Story 23.4: Tooling & Docs para Barrel Cleanup

Status: ready-for-dev

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

- [ ] Task 1: Integrar ESLint rule tests en Jest (AC: #1)
  - [ ] Verificar que `eslint-rules/__tests__/no-barrel-imports-in-ui.test.js` pasa con `node` actualmente
  - [ ] Configurar Jest para incluir `eslint-rules/__tests__/` en la suite (puede requerir ajuste de `testMatch` o `testPathIgnorePatterns` en `jest.config.cjs`)
  - [ ] Verificar que `npm test` ejecuta el test file y los 22 cases (11 valid + 11 invalid) pasan
  - [ ] Si Jest no puede ejecutar RuleTester directamente, crear un wrapper Jest test que invoque el test file
- [ ] Task 2: Verificar y corregir métricas stale en docs (AC: #4)
  - [ ] `docs/architecture/import-rules.md` sección 3: Verificar barrel aliases table — confirmar `@/hooks` muestra "24 named re-exports"
  - [ ] `docs/architecture/import-rules.md` sección 6: Verificar Hooks/State rows son "Named re-exports" (no "export * cascading")
  - [ ] `docs/architecture/import-rules.md` sección 6: Verificar organisms count (doc dice 20, ESLint config dice 19, barrel tiene 16 export lines) — normalizar
  - [ ] `docs/architecture/folder-structure.md`: Verificar barrel aliases table, confirmar "58+ icons" → "57 named" si corresponde
  - [ ] CLAUDE.md: Verificar que la sección "Performance Anti-pattern: Barrel Imports" es exacta
- [ ] Task 3: Crear script de auditoría de barrels (AC: #3)
  - [ ] Crear `scripts/audit-barrels.ts` (TypeScript) que:
    - Busque todos los `index.ts`/`index.js` en `src/` que contengan `export`
    - Clasifique tipo: `export *` vs named `export {` vs `export { default as`
    - Cuente exports por archivo
    - Flaggee barrels con `export *` como "candidates for conversion"
    - Output: tabla formateada por consola
  - [ ] Añadir script en `package.json`: `"audit:barrels": "npx tsx scripts/audit-barrels.ts"`
  - [ ] Verificar que el script funciona correctamente
- [ ] Task 4: Escribir Barrel Cleanup Playbook (AC: #2)
  - [ ] Añadir sección "9. Barrel Cleanup Playbook (Epic 23)" a `docs/architecture/import-rules.md`
  - [ ] Incluir subsecciones:
    - "How to Detect Prohibited Barrels" (usando el audit script + ESLint)
    - "Migration Guide" (paso a paso con ejemplos before/after)
    - "Understanding ESLint Errors" (qué significa el error, cómo corregirlo)
    - "Cleanup Checklist" (checklist para convertir un barrel)
    - "When to Keep a Barrel" (decision criteria resumida de sección 1)
- [ ] Task 5: Ejecutar suite de validación completa (AC: #5)
  - [ ] `npm run lint` — sin errores
  - [ ] `npm run typecheck` — sin errores
  - [ ] `npm test` — todos los tests pasan (incluyendo ESLint rule tests)
  - [ ] `npm run build` — build exitoso

## Dev Notes

### Contexto del Epic

Story 23.4 es la última story de **Epic 23: Barrel File Cleanup**. Stories 23.1 (Icons), 23.2 (UI Barrels), y 23.3 (Safe Barrels) están completadas. Esta story consolida la automatización y documentación.

### Estado Actual de la ESLint Rule

**Archivo:** `eslint-rules/no-barrel-imports-in-ui.js`
- 9 barrel paths protegidos: `@/atoms`, `@/buttons`, `@/icons`, `@/links`, `@/texts`, `@/molecules`, `@/organisms`, `@/overlays`, `@/hooks`
- Scope: `src/ui/**/*` y `src/app/**/*` (severity: `error`)
- Permite side-effect imports y sub-path imports

**Test file existente:** `eslint-rules/__tests__/no-barrel-imports-in-ui.test.js`
- 11 valid cases + 11 invalid cases = 22 test cases
- Usa `RuleTester` de ESLint (CommonJS)
- Se ejecuta con `node eslint-rules/__tests__/no-barrel-imports-in-ui.test.js`
- **NO** está incluido en Jest (`jest.config.cjs` no lo cubre)

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
