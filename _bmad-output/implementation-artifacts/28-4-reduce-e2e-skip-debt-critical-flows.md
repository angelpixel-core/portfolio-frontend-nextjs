# Story 28.4: Reduce E2E Skip Debt Critical Flows

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como owner de calidad,
quiero reducir la deuda de `test.skip` en flujos E2E criticos,
para que un CI verde represente calidad real y no una falsa senal de confianza.

## Acceptance Criteria

1. Los journeys criticos definidos para fase 1 ejecutan sin `skip` en los archivos objetivo iniciales: `e2e/about-experiences-education-ux.spec.ts`, `e2e/auth.spec.ts` y `e2e/menu-autoclose.spec.ts`.
2. Se documenta inventario de skips remanentes con racional explicito (por que existe), riesgo y plan de remocion.
3. Se mantienen quality gates en verde para cambios afectados (`lint`, `typecheck`, `test`, `test:e2e` o subset equivalente con evidencia).
4. La implementacion respeta contratos actuales de Playwright (Chromium-only), convenciones de `data-testid` y flujos E2E criticos definidos en la base documental del proyecto.

## Tasks / Subtasks

- [ ] Task 1: Auditar y clasificar skip debt en specs criticos (AC: 1,2)
  - [ ] 1.1 Levantar inventario actual de `test.skip` en los tres archivos target de TD-02.1.
  - [ ] 1.2 Clasificar cada skip en: removable-now, blocked-by-fixture, blocked-by-env-contract.
  - [ ] 1.3 Definir orden de des-skip por impacto en release signal (P0 first).

- [ ] Task 2: Rehabilitar ejecucion de journeys criticos sin skip (AC: 1,4)
  - [ ] 2.1 Eliminar `skip` de casos que ya tienen setup deterministico disponible.
  - [ ] 2.2 Ajustar fixtures/selectors/esperas para estabilizar los tests reactivados.
  - [ ] 2.3 Verificar compatibilidad con reglas de navegacion, theme persistence, auth modal y menu autoclose.

- [ ] Task 3: Trazabilidad de deuda remanente y plan de salida (AC: 2)
  - [ ] 3.1 Documentar skips remanentes con causa tecnica y owner.
  - [ ] 3.2 Registrar fecha objetivo o condicion de salida por cada skip remanente.
  - [ ] 3.3 Alinear inventario con estrategia de budget/waiver para story 28.5.

- [ ] Task 4: Validacion integral y evidencia (AC: 3)
  - [ ] 4.1 Ejecutar `npm run lint`.
  - [ ] 4.2 Ejecutar `npm run typecheck`.
  - [ ] 4.3 Ejecutar tests afectados (`npm test` y `npm run test:e2e` o subset justificado).
  - [ ] 4.4 Ejecutar `npm run build`.
  - [ ] 4.5 Actualizar esta story con evidencias, archivos tocados y riesgos residuales.

## Dev Notes

### Technical Requirements

- Esta story implementa TD-02.1 (Epic 28, P0) para restaurar confiabilidad del semaforo CI.
- El foco de fase 1 es remover skip en flujos criticos primero, no eliminar el 100% de skip debt global en una sola iteracion.
- Debe preservarse la semantica de pruebas E2E existentes y evitar flakiness introducida por cambios apresurados.

### Architecture Compliance

- Mantener stack y contratos actuales: Next.js App Router, React 18, TypeScript, Playwright Chromium-only.
- Respetar regla de test-UI synchronization: si cambia UI o selectors, actualizar pruebas en el mismo cambio.
- No degradar cobertura de flujos E2E criticos listados en convenciones del repositorio.

### Library / Framework Requirements

- Playwright es el runner E2E oficial; mantener patrones de fixtures/helpers ya usados en `e2e/`.
- Evitar sleeps ad-hoc; priorizar `expect(...).toBeVisible()`/waits deterministicas y contratos de estado.
- Mantener consistencia con `data-testid` centralizados y convenciones de accesibilidad de navegacion.

### File Structure Requirements

- Archivos primarios esperados para implementacion:
  - `e2e/about-experiences-education-ux.spec.ts`
  - `e2e/auth.spec.ts`
  - `e2e/menu-autoclose.spec.ts`
  - `e2e/testids.ts` (si se requieren nuevos ids resilientes)
  - `docs/release/production-readiness-audit.md` (si se actualiza evidencia de skip debt)
  - `_bmad-output/implementation-artifacts/28-4-reduce-e2e-skip-debt-critical-flows.md`

### Testing Requirements

- Cobertura minima requerida para esta story:
  - ejecucion activa (sin skip) de journeys criticos fase 1
  - evidencia de estabilidad en entorno local/CI para los tests reactivados
  - inventario de skips remanentes con justificacion y riesgo
- Validaciones obligatorias post-cambio:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run test:e2e` (o subset equivalente, explicitando alcance)
  - `npm run build`

### Previous Story Intelligence

- Story 28.3 reforzo disciplina de hardening con commits atomicos por finding y evidencia explicita por AC.
- Leccion aplicada: cerrar brechas de review con cambios pequenos y verificables reduce riesgo de regresiones laterales.
- Leccion aplicada: quality gates deben ejecutarse completos para sostener confianza en historias P0.

### Git Intelligence Summary

- Commits recientes relevantes del epic (patron de ejecucion):
  - `09ca26d` docs(story): requeue 28-3 for review after fixes
  - `6c0296b` chore(renderer): remove lint-only escape regression
  - `d7d4ac1` fix(security): replace vulnerable sanitizer runtime dependency
  - `c4aaa56` fix(renderer): harden markdown link parsing in ArticleContent
  - `74885f7` test(security): add explicit on-event payload coverage
- Patron vigente: resolver riesgo por bloques pequenos, cada bloque con verificacion y trazabilidad.

### Latest Technical Information

- Snapshot de riesgo actual: vulnerabilidades high/critical de runtime en 0; mayor deuda P0 restante es senal de test por skip debt.
- Hallazgo de auditoria: 40 `test.skip` en 8 specs, concentracion alta en `about-experiences-education-ux`, `auth`, y `menu-autoclose`.
- Criterio GO/NO-GO: CI debe reflejar journeys activos y budget de skips controlado, no verde por exclusion masiva.

### Project Context Reference

- No se detecto `project-context.md`.
- Fuentes canonicas para esta story:
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`
  - `docs/release/technical-debt-backlog.md`
  - `docs/release/production-readiness-audit.md`
  - `docs/release/deployment-work-items-template.md`
  - `_bmad-output/implementation-artifacts/28-3-harden-article-content-rendering-path.md`
  - `CLAUDE.md`

### References

- Story source / ACs TD-02.1: `docs/release/technical-debt-backlog.md`
- Work item mapping TD-02.1: `docs/release/deployment-work-items-template.md`
- Riesgo R2 (release confidence por skips): `docs/release/production-readiness-audit.md`
- Estado sprint/story key: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story previa del epic: `_bmad-output/implementation-artifacts/28-3-harden-article-content-rendering-path.md`
- Convenciones E2E criticas y chromium-only: `CLAUDE.md`

## Dev Agent Record

### Agent Model Used

openai/gpt-5.3-codex

### Debug Log References

- N/A

### Completion Notes List

- Story creada en estado `ready-for-dev` con contexto tecnico orientado a reducir skip debt en flujos criticos de Epic 28.
- Se incluyeron guardrails de implementacion, testing y trazabilidad para evitar verde falso en CI.
- Se incorporaron aprendizajes de Story 28.3 y evidencia de auditoria de readiness para priorizacion P0.

### File List

- `_bmad-output/implementation-artifacts/28-4-reduce-e2e-skip-debt-critical-flows.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-03-05: Story creada mediante workflow `create-story`; estado inicial `ready-for-dev` con contexto integral para `dev-story`.
