# Story 28.6: Stabilize Env-Dependent E2E Fixtures

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como owner de QA/release,
quiero estabilizar fixtures E2E dependientes de entorno,
para que el semaforo de CI represente calidad real sin skips condicionados por configuracion.

## Acceptance Criteria

1. Los casos E2E dependientes de auth/social/config se ejecutan con fixtures deterministicas en la matriz objetivo y sin `test.skip` por variabilidad de entorno.
2. En release branch no existen skips misteriosos: todo skip remanente (si aplica) queda justificado, trazable y fuera del scope env-dependent.
3. El flujo CI equivalente (`npm run test:e2e:ci && npm run quality:e2e:skip-budget`) permanece en verde sin introducir nuevos waivers para los casos que esta story estabiliza.
4. La implementacion respeta contratos vigentes de testing (Playwright Chromium-only, reporte JSON para gate, convenciones de `data-testid`) y politicas ADR de env/testing.

## Tasks / Subtasks

- [ ] Task 1: Diseñar contratos de fixture deterministica para casos env-dependent (AC: 1,2,4)
  - [ ] 1.1 Definir contrato para `e2e/contact.spec.ts` sin skip por `Calendly URL not configured` (datos deterministas o fallback verificable).
  - [ ] 1.2 Definir matriz auth-enabled/auth-disabled para `e2e/vertical-viewport.spec.ts` sin skip condicional por estado del boton auth.
  - [ ] 1.3 Definir setup de tema deterministico para `e2e/footer-consistency.spec.ts` sin skip por activacion dark-mode via localStorage.

- [ ] Task 2: Implementar estabilizacion en specs/fixtures/config (AC: 1,4)
  - [ ] 2.1 Aplicar fixture/source de datos estable para contacto/social en pruebas afectadas.
  - [ ] 2.2 Separar o parametrizar suites auth por contrato de entorno (ej. proyecto/suite dedicada `auth-disabled`) manteniendo cobertura equivalente.
  - [ ] 2.3 Reforzar setup de tema y sincronizacion de estado antes de assertions de hover/estilo.

- [ ] Task 3: Alinear governance de skips con policy 28.5 (AC: 2,3)
  - [ ] 3.1 Actualizar `.github/e2e-skip-waiver.json` removiendo excepciones ya cubiertas por fixtures estables.
  - [ ] 3.2 Verificar que cualquier skip remanente no sea env-driven y tenga ownership + expiracion valida.
  - [ ] 3.3 Registrar inventario post-cambio de skip debt con delta explicito respecto a baseline.

- [ ] Task 4: Validacion CI-equivalente y evidencia (AC: 3,4)
  - [ ] 4.1 Ejecutar `npm run lint` y `npm run typecheck`.
  - [ ] 4.2 Ejecutar subset E2E afectado (`contact`, `vertical-viewport`, `footer-consistency`, y suites auth relacionadas).
  - [ ] 4.3 Ejecutar `npm run test:e2e:ci && npm run quality:e2e:skip-budget` y registrar resultado.
  - [ ] 4.4 Actualizar story con evidencias, riesgos residuales y archivos modificados.

## Dev Notes

### Technical Requirements

- Esta story implementa TD-02.3 (Epic 28, P0) y consolida la confiabilidad introducida por TD-02.2.
- Alcance principal: eliminar dependencia de env vars/datos opcionales como causa de `test.skip` en la matriz release.
- Resultado esperado: convertir deuda de skip env-driven en contratos de fixture deterministica y/o suites separadas por modo.

### Architecture Compliance

- Respetar pipeline actual en `.github/workflows/ci.yml`: `quality` -> `e2e` -> `lighthouse`.
- Mantener compatibilidad con el gate implementado en 28.5 (`quality:e2e:skip-budget`) sin atajos (`continue-on-error`, bypass silencioso).
- Mantener convencion de pruebas E2E en `e2e/` y enfoque de assertions sobre experiencia visible del usuario.

### Library / Framework Requirements

- E2E oficial con `@playwright/test` en Chromium-only (`playwright.config.ts`).
- CI sobre GitHub Actions Node 20, con reporter JSON consumido por el skip-budget gate.
- Seguir ADR 006: no se permiten skips por falta de env var ni flakiness no investigada.
- Seguir ADR 004: estrategia mock-first, variables `NEXT_PUBLIC_*` como override opcional, no dependencia dura para ejecutar tests.

### File Structure Requirements

- Archivos primarios esperados para implementacion:
  - `e2e/contact.spec.ts`
  - `e2e/vertical-viewport.spec.ts`
  - `e2e/footer-consistency.spec.ts`
  - `e2e/auth-disabled.spec.ts`
  - `playwright.config.ts`
  - `.github/e2e-skip-waiver.json`
  - `.github/workflows/ci.yml` (solo si se requiere ajuste minimo de matriz/entorno)
  - `_bmad-output/implementation-artifacts/28-6-stabilize-env-dependent-e2e-fixtures.md`

### Testing Requirements

- Cobertura minima requerida:
  - remocion verificable de skips env-dependent en casos objetivo de 28.6
  - corrida de suites afectadas en modo auth-enabled y auth-disabled cuando corresponda
  - verificacion de gate skip-budget sobre reporte CI-equivalente
- Validaciones obligatorias post-cambio:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run test:e2e -- e2e/contact.spec.ts e2e/vertical-viewport.spec.ts e2e/footer-consistency.spec.ts e2e/auth-disabled.spec.ts`
  - `npm run test:e2e:ci && npm run quality:e2e:skip-budget`

### Previous Story Intelligence

- 28.5 dejo enforcement estricto del skip-budget en CI, por lo que 28.6 ya no puede tratar skips env-dependent como deuda tolerable.
- Follow-ups cerrados en 28.5 endurecieron parser y waiver matching (paths normalizados, match exacto, exclusion de `interrupted`, gate solo en `success()`).
- Inventario heredado de 28.4/28.5 indica que los focos env-dependent principales son:
  - `e2e/contact.spec.ts` (Calendly opcional)
  - `e2e/vertical-viewport.spec.ts` (modo auth en matriz viewport)
  - `e2e/footer-consistency.spec.ts` (tema dark no deterministico)

### Git Intelligence Summary

- Commits recientes relevantes:
  - `7477f57` docs(story): mark 28-5 review follow-ups resolved
  - `811b920` ci: run skip-budget gate only after successful e2e step
  - `f6542f2` fix(policy): require exact waiver matching for skipped tests
  - `40cdb50` fix(policy): exclude interrupted runs from skip-debt counting
  - `861c93f` fix(ci): align skip waiver baseline with active auth/contact skips
- Patron vigente: cambios atomicos por concern y trazabilidad directa en story + sprint-status.

### Latest Technical Information

- El gate de skip-budget en CI consume `test-results/e2e-results.json` y falla por skips no waivados o budget excedido (`.github/workflows/ci.yml`).
- `playwright.config.ts` fuerza `NEXT_PUBLIC_OAUTH_ENABLED` default a `true`, por lo que las pruebas que requieran `false` deben ejecutarse en suite/matriz dedicada y no como skip condicional en suite principal.
- El waiver actual incluye expiracion corta y ownership explicito; 28.6 debe reducir este baseline removiendo entradas estabilizadas.
- Politica de release exige "no mystery skips" y ADR 006 explicita que faltas de env var no son causa valida de skip.

### Project Context Reference

- No se detecto `project-context.md`.
- Fuentes canonicas para esta story:
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`
  - `docs/release/technical-debt-backlog.md`
  - `docs/release/deployment-work-items-template.md`
  - `docs/release/production-readiness-audit.md`
  - `docs/release/pre-release-checklist.md`
  - `_bmad-output/implementation-artifacts/28-4-reduce-e2e-skip-debt-critical-flows.md`
  - `_bmad-output/implementation-artifacts/28-5-enforce-skip-budget-policy-in-ci.md`
  - `docs/adr/006-frontend-testing-strategy.md`
  - `docs/adr/004-environment-variables-strategy.md`

### References

- Story source / ACs TD-02.3: `docs/release/technical-debt-backlog.md`
- Dependencias y ownership TD-02.3: `docs/release/deployment-work-items-template.md`
- Riesgo R2 (release confidence por skip debt): `docs/release/production-readiness-audit.md`
- Politica operativa "no mystery skips": `docs/release/pre-release-checklist.md`
- Estado sprint/story key: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Story previa 28.4 (inventario remanente): `_bmad-output/implementation-artifacts/28-4-reduce-e2e-skip-debt-critical-flows.md`
- Story previa 28.5 (policy gate + follow-ups): `_bmad-output/implementation-artifacts/28-5-enforce-skip-budget-policy-in-ci.md`
- Waiver activo: `.github/e2e-skip-waiver.json`
- Pipeline CI e2e/gate: `.github/workflows/ci.yml`
- Contrato Playwright: `playwright.config.ts`

## Dev Agent Record

### Agent Model Used

openai/gpt-5.3-codex

### Debug Log References

- `create-story` workflow execution for 28.6 (artifact synthesis from planning/release/previous-story sources).

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story 28.6 creada con guardrails especificos para eliminar skips env-dependent y sostener compatibilidad con gate de 28.5.
- Scope acotado a fixtures/matriz de entorno; no introduce cambios de producto fuera de confiabilidad E2E.

### File List

- `_bmad-output/implementation-artifacts/28-6-stabilize-env-dependent-e2e-fixtures.md`

## Change Log

- 2026-03-05: Story creada mediante workflow `create-story`; estado inicial `ready-for-dev` con contexto tecnico y de riesgo completo para `dev-story`.
