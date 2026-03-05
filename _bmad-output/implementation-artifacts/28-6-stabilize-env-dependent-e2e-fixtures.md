# Story 28.6: Stabilize Env-Dependent E2E Fixtures

Status: done

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

- [x] Task 1: Diseñar contratos de fixture deterministica para casos env-dependent (AC: 1,2,4)
  - [x] 1.1 Definir contrato para `e2e/contact.spec.ts` sin skip por `Calendly URL not configured` (datos deterministas o fallback verificable).
  - [x] 1.2 Definir matriz auth-enabled/auth-disabled para `e2e/vertical-viewport.spec.ts` sin skip condicional por estado del boton auth.
  - [x] 1.3 Definir setup de tema deterministico para `e2e/footer-consistency.spec.ts` sin skip por activacion dark-mode via localStorage.

- [x] Task 2: Implementar estabilizacion en specs/fixtures/config (AC: 1,4)
  - [x] 2.1 Aplicar fixture/source de datos estable para contacto/social en pruebas afectadas.
  - [x] 2.2 Separar o parametrizar suites auth por contrato de entorno (ej. proyecto/suite dedicada `auth-disabled`) manteniendo cobertura equivalente.
  - [x] 2.3 Reforzar setup de tema y sincronizacion de estado antes de assertions de hover/estilo.

- [x] Task 3: Alinear governance de skips con policy 28.5 (AC: 2,3)
  - [x] 3.1 Actualizar `.github/e2e-skip-waiver.json` removiendo excepciones ya cubiertas por fixtures estables.
  - [x] 3.2 Verificar que cualquier skip remanente no sea env-driven y tenga ownership + expiracion valida.
  - [x] 3.3 Registrar inventario post-cambio de skip debt con delta explicito respecto a baseline.

- [x] Task 4: Validacion CI-equivalente y evidencia (AC: 3,4)
  - [x] 4.1 Ejecutar `npm run lint` y `npm run typecheck`.
  - [x] 4.2 Ejecutar subset E2E afectado (`contact`, `vertical-viewport`, `footer-consistency`, y suites auth relacionadas).
  - [x] 4.3 Ejecutar `npm run test:e2e:ci && npm run quality:e2e:skip-budget` y registrar resultado.
  - [x] 4.4 Actualizar story con evidencias, riesgos residuales y archivos modificados.

### Review Follow-ups (AI)

- [x] [AI-Review][High] Cerrar deuda env-dependent remanente hoy cubierta por waiver: `e2e/reduced-motion.spec.ts` y `e2e/home-hero-blade.spec.ts` ya no dependen de `test.skip`, y `.github/e2e-skip-waiver.json` se redujo a baseline `0` sin entradas activas.
- [x] [AI-Review][Medium] Convertir T9 de `vertical-viewport` a assertion fail-fast cuando haya overflow.
- [x] [AI-Review][Medium] Reemplazar `waitForTimeout` en `vertical-viewport` por esperas basadas en estado con `expect.poll`.
- [x] [AI-Review][Low] Endurecer contrato de unicidad en links duplicados de `contact.spec.ts` para email/whatsapp.

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

- `npm run test:e2e -- e2e/contact.spec.ts e2e/vertical-viewport.spec.ts e2e/footer-consistency.spec.ts e2e/auth-disabled.spec.ts` (32 passed)
- `npm run lint && npm run typecheck`
- `npm run test:e2e:ci && npm run quality:e2e:skip-budget` (254 passed, gate PASS: skipped=0 budget=2 unexpected=0 unwaived=0)
- `npm test` (109 suites passed)
- `npm run build` (Next.js production build + sitemap OK)
- `npm run test:e2e -- e2e/reduced-motion.spec.ts e2e/home-hero-blade.spec.ts e2e/vertical-viewport.spec.ts e2e/contact.spec.ts` (27 passed)
- `npm run test:e2e:ci && npm run quality:e2e:skip-budget` (254 passed, gate PASS: skipped=0 budget=0 unexpected=0 unwaived=0)

### Completion Notes List

- Eliminados skips env-dependent en targets de la story: `contact.spec.ts`, `vertical-viewport.spec.ts`, `footer-consistency.spec.ts` y `auth-disabled.spec.ts`.
- `contact.spec.ts` ahora valida contrato opcional de Calendly sin `test.skip`, con resultado deterministico (0 o 1 link visible).
- `vertical-viewport.spec.ts` cubre ambos modos auth (habilitado/deshabilitado) con assertions explicitas en lugar de skip condicional.
- `footer-consistency.spec.ts` usa espera deterministica sobre clase `dark` con `expect.poll` antes de validar hover en tema oscuro.
- `.github/e2e-skip-waiver.json` reducido para remover excepciones estabilizadas por 28.6 y ajustar baseline a `2`.
- Validaciones completas ejecutadas: lint, typecheck, Jest full, subset E2E, E2E CI completo, skip-budget gate y build.
- Follow-ups de code-review resueltos: sin skips env/data remanentes waivados, T9 fail-fast activo, waits fijos removidos en `vertical-viewport`, y contrato de unicidad reforzado en `contact`.

### File List

- `.github/e2e-skip-waiver.json`
- `_bmad-output/implementation-artifacts/28-6-stabilize-env-dependent-e2e-fixtures.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `e2e/auth-disabled.spec.ts`
- `e2e/contact.spec.ts`
- `e2e/footer-consistency.spec.ts`
- `e2e/vertical-viewport.spec.ts`

## Senior Developer Review (AI)

### Reviewer

OpenCode (GPT-5.3-codex)

### Date

2026-03-05

### Outcome

Blocked

### Summary

Se validaron los claims de la story contra implementacion real y evidencia de CI. La base de 28.6 mejora significativamente los skips env-dependent en targets directos, pero aun quedan gaps de calidad que impiden cerrar a `done` sin follow-ups: deuda env-dependent remanente fuera del alcance declarado de AC2 y señales de test no-fail que pueden dejar pasar regresiones.

### Findings

- **High:** Riesgo de AC2/policy: se mantienen skips env/data-driven en `reduced-motion` y `home-hero-blade`, actualmente waivados y con expiracion corta.
- **Medium:** T9 en `vertical-viewport` no falla ante overflow (solo log), degradando el valor del semaforo.
- **Medium:** Persisten `waitForTimeout` en el mismo spec, con riesgo de flakiness intermitente en CI.
- **Low:** `contact.spec.ts` conserva estrategia `.first()` en links duplicados (email/whatsapp), lo que puede ocultar drift estructural.

### AC Validation Snapshot

- **AC1**: **IMPLEMENTED** — Los targets de 28.6 (`contact`, `vertical-viewport`, `footer-consistency`, `auth-disabled`) ya no usan `test.skip` env-dependent.
- **AC2**: **PARTIAL** — Existen skips env/data-driven remanentes (actualmente justificados por waiver), pero la deuda no esta cerrada en codigo y depende de expiraciones/seguimiento.
- **AC3**: **IMPLEMENTED** — CI equivalente documentado en verde (`test:e2e:ci` + `quality:e2e:skip-budget`, skipped=0).
- **AC4**: **PARTIAL** — Se respeta contrato Playwright/CI, pero quedan patrones de test quality que reducen confiabilidad (detection-only + fixed timeouts).

### Review Evidence

- Git reality vs story claims: no cambios sueltos en working tree; cambios de 28.6 trazados en commits `9ad0b72`, `b0a7729`, `c446438` con archivos consistentes con File List.
- Inventario actual de skips: `e2e/reduced-motion.spec.ts:110`, `e2e/home-hero-blade.spec.ts:74`.
- Waiver activo para esos skips: `.github/e2e-skip-waiver.json:11` y `.github/e2e-skip-waiver.json:19`.
- Riesgo de falso verde en T9: `e2e/vertical-viewport.spec.ts:267`.
- Referencia externa (MCP doc search): Playwright recomienda modelar diferencias de entorno con projects/parametrizacion y usar `test.skip` solo cuando el caso no aplica realmente; tambien priorizar assertions con retry (`expect`, `expect.poll`) sobre checks one-shot. Fuentes: `https://playwright.dev/docs/test-projects`, `https://playwright.dev/docs/test-annotations`, `https://playwright.dev/docs/test-assertions`.

## Change Log

- 2026-03-05: Story creada mediante workflow `create-story`; estado inicial `ready-for-dev` con contexto tecnico y de riesgo completo para `dev-story`.
- 2026-03-05: Story movida a `in-progress` para ejecucion de `dev-story`; sprint-status sincronizado a `in-progress`.
- 2026-03-05: Implementada estabilizacion de fixtures env-dependent (contact/auth/viewport/theme), waivers alineados y validaciones completas en verde; story movida a `review`.
- 2026-03-05: Senior Developer Review (AI) ejecutado con outcome `Blocked`; se agregan 4 follow-ups (1 High, 2 Medium, 1 Low) y status vuelve a `in-progress`.
- 2026-03-05: Aplicados fixes H(1), M(2,3), L(4); follow-ups marcados resueltos, validacion CI-equivalente en verde con budget=0 y status movido a `review`.
