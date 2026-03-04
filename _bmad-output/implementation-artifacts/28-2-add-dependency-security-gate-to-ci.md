# Story 28.2: Add Dependency Security Gate to CI

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como owner de plataforma,
quiero agregar un gate de seguridad de dependencias en CI,
para bloquear merges con vulnerabilidades high/critical en el runtime desplegado.

## Acceptance Criteria

1. El pipeline CI ejecuta un chequeo automatizado de dependencias que falla si hay vulnerabilidades high/critical en el scope de runtime (no dev-only).
2. El gate queda integrado en el workflow oficial (`.github/workflows/ci.yml`) sin romper el orden actual de quality gates.
3. Se documenta un proceso de break-glass/waiver para casos excepcionales con due date y owner explícito.
4. El cambio mantiene compatibilidad con la arquitectura vigente (GitHub Actions + npm ci --legacy-peer-deps + baseline Node 20).
5. La validación posterior al cambio confirma que lint/typecheck/tests/build siguen pasando y que el gate se comporta como esperado por exit code.

## Tasks / Subtasks

- [x] Task 1: Diseñar política y ubicación del gate en CI (AC: 1,2,4)
  - [x] 1.1 Definir comando de auditoría para runtime (`npm audit --omit=dev --audit-level=high`) y rationale técnico.
  - [x] 1.2 Seleccionar job/stage para ejecutar el gate sin romper la secuencia actual (`quality` antes de `e2e` y `lighthouse`).
  - [x] 1.3 Confirmar comportamiento de failure por exit code en GitHub Actions (sin `continue-on-error` en el gate).

- [x] Task 2: Implementar gate en workflow de CI (AC: 1,2,4)
  - [x] 2.1 Agregar paso explícito de security audit en `.github/workflows/ci.yml`.
  - [x] 2.2 Preservar instalación con `npm ci --legacy-peer-deps` y baseline Node 20.
  - [x] 2.3 Verificar que el pipeline mantenga gates bloqueantes/no-bloqueantes según arquitectura (lighthouse sigue warning-only).

- [x] Task 3: Documentar break-glass/waiver process (AC: 3)
  - [x] 3.1 Definir reglas mínimas del waiver: issue link, owner, expiration date, y plan de remediación.
  - [x] 3.2 Documentar dónde vive el waiver y cómo se revisa en PR/CI.

- [x] Task 4: Validación end-to-end del cambio (AC: 5)
  - [x] 4.1 Ejecutar `npm run lint`.
  - [x] 4.2 Ejecutar `npm run typecheck`.
  - [x] 4.3 Ejecutar `npm test`.
  - [x] 4.4 Ejecutar `npm run build`.
  - [x] 4.5 Ejecutar manualmente el comando del gate y registrar evidencia de comportamiento por exit code.

### Review Follow-ups (AI)

- [ ] [AI-Review][MEDIUM] Endurecer validación de waiver para exigir issue link trazable en formato verificable (URL o `owner/repo#id`) en vez de string libre. [scripts/security-audit-gate.cjs:9]
- [ ] [AI-Review][MEDIUM] Agregar tests de flujo completo de `main` con `spawnSync`/`process.exit` mockeados para cubrir success, fail y break-glass (no solo helpers). [scripts/__tests__/security-audit-gate.test.js:18]
- [ ] [AI-Review][MEDIUM] Incorporar guardrail para vigencia de waiver (ej. rechazar expiraciones mayores a 7 dias) para alinear enforcement con politica operativa documentada. [scripts/security-audit-gate.cjs:20]
- [ ] [AI-Review][LOW] Eliminar import no usado `path` del test para reducir ruido y deuda de mantenimiento. [scripts/__tests__/security-audit-gate.test.js:1]

## Dev Notes

### Technical Requirements

- Esta story implementa TD-01.2 (P0) inmediatamente después de TD-01.1 ya completada.
- El gate debe evaluar vulnerabilidades del runtime desplegado, no ruido de tooling dev-only.
- Comando objetivo recomendado por evidencia actual del proyecto y docs npm:
  - `npm audit --omit=dev --audit-level=high`
- El parámetro `--audit-level` controla el umbral de fallo por exit code y no filtra el reporte.

### Architecture Compliance

- Mantener pipeline base en GitHub Actions con jobs `quality`, `e2e`, `lighthouse`.
- No degradar `lighthouse` como warning-only (`continue-on-error: true`) ya establecido.
- Mantener Node 20 y `npm ci --legacy-peer-deps` para consistencia con CI vigente.
- No introducir bypass silencioso del gate (no `continue-on-error` en el paso de security audit).

### Library / Framework Requirements

- npm CLI (`npm audit`) con lockfile presente.
- GitHub Actions workflow syntax para comportamiento de fallo por step.
- Next.js/React stack no requiere cambios funcionales para esta story; foco en CI contract.

### File Structure Requirements

- Archivos esperados a tocar:
  - `.github/workflows/ci.yml`
  - `docs/release/production-readiness-audit.md` (si se agrega evidencia de gate)
  - `docs/release/pre-release-checklist.md` o runbook equivalente (para waiver/break-glass)
  - `_bmad-output/implementation-artifacts/28-2-add-dependency-security-gate-to-ci.md` (esta story)

### Testing Requirements

- Validaciones obligatorias post-cambio:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Validación específica del gate:
  - ejecutar comando de audit de runtime y comprobar semántica de exit code en entorno local/CI.

### Previous Story Intelligence

- Story previa (`28-1`) ya cerró remediación principal de `next` y dejó baseline:
  - `npm audit --omit=dev --audit-level=high` => `found 0 vulnerabilities`.
- Riesgo residual documentado: 6 vulnerabilidades low dev-only transitivas de cadena Storybook.
- Lección aplicada: separar claramente runtime security posture vs tooling debt para evitar falsos bloqueos de release.

### Git Intelligence Summary

- Commits recientes relevantes para esta story:
  - `42dadcc` docs(story): close 28-1 as done
  - `0aeed56` docs(review): reconcile 28.1 findings and audit evidence
  - `fe9821f` test(setup): reduce react act warning noise
  - `12612fc` fix(error): sanitize app error boundary logging
  - `777ee2f` chore(lighthouse): run lhci via npx to trim dev vuln chain
- Patrón vigente: cambios atómicos por concern (runtime code, test infra, docs/workflow), mantenerlo en 28.2.

### Latest Technical Information

- npm docs (`npm audit`): por defecto retorna non-zero con vulnerabilidades; `--audit-level` define umbral de fallo por severidad y no filtra output.
- npm docs (`--omit=dev`): recomendado para auditar alcance de producción/runtime.
- GitHub Actions docs: un step falla el job por non-zero exit code salvo `continue-on-error` explícito.

### Project Context Reference

- No se detectó `project-context.md`.
- Fuentes canónicas para esta story:
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`
  - `docs/release/technical-debt-backlog.md`
  - `docs/release/deployment-work-items-template.md`
  - `.github/workflows/ci.yml`
  - `_bmad-output/planning-artifacts/architecture.md`

### References

- Sprint tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml` (`28-2-add-dependency-security-gate-to-ci`)
- Backlog de deuda técnica: `docs/release/technical-debt-backlog.md` (TD-01.2)
- Template de work items y dependencia TD-01.1 -> TD-01.2: `docs/release/deployment-work-items-template.md`
- Workflow CI actual: `.github/workflows/ci.yml`
- Arquitectura base y quality gates: `_bmad-output/planning-artifacts/architecture.md`
- Story previa (contexto y baseline): `_bmad-output/implementation-artifacts/28-1-upgrade-next-to-non-vulnerable-range.md`

## Senior Developer Review (AI)

### Reviewer

Angel DevStack

### Date

2026-03-04

### Outcome

Changes Requested

### Summary

La implementación cumple el objetivo central del gate runtime en CI, pero el proceso de waiver y la cobertura de pruebas de comportamiento por exit code quedaron por debajo del nivel de robustez esperado para cerrar la story como `done`.

### Findings

1. **MEDIUM** - Validación de `issue` demasiado permisiva para trazabilidad de waiver
   - Evidencia: `isValidWaiver` acepta cualquier string no vacío para `issue`, sin verificar formato de link trazable. (`scripts/security-audit-gate.cjs:9`)
   - Impacto: puede aprobarse break-glass con referencias opacas, dificultando auditoría y accountability.
2. **MEDIUM** - Cobertura de tests incompleta sobre comportamiento de exit code del gate
   - Evidencia: los tests actuales solo cubren helpers (`isValidWaiver`, `isWaiverActive`, `canUseBreakGlass`) y no validan rutas `main` (success/failure/break-glass) con mocks de proceso/comando. (`scripts/__tests__/security-audit-gate.test.js:18`)
   - Impacto: AC5 queda con evidencia manual puntual, pero sin regresión automatizada del contrato de salida.
3. **MEDIUM** - Política de expiración de waiver no queda enforceada en runtime
   - Evidencia: el script acepta cualquier fecha futura válida; no hay límite de vigencia alineado con la regla operativa recomendada en checklist. (`scripts/security-audit-gate.cjs:20`, `docs/release/pre-release-checklist.md:198`)
   - Impacto: riesgo de waivers excesivamente largos en escenarios de emergencia.
4. **LOW** - Import no usado en test
   - Evidencia: `const path = require("path");` no se utiliza. (`scripts/__tests__/security-audit-gate.test.js:1`)
   - Impacto: deuda menor de higiene de pruebas.

### AC Validation Snapshot

- AC1: Implementado
- AC2: Implementado
- AC3: Implementado (con brecha de enforcement en trazabilidad estricta)
- AC4: Implementado
- AC5: Parcial (evidencia manual correcta, automatización incompleta)

### Review Baseline Evidence

- Commit revisado: `83c251c` (`ci(security): add runtime audit gate and story 28-2 review`).
- Verificación git para discrepancias story-vs-git: working tree limpio y archivos de `HEAD` alineados con File List principal.
- Referencias externas verificadas (npm audit + GitHub Actions exit codes) vía investigación documentada.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.3-codex

### Debug Log References

- N/A

### Completion Notes List

- Implementado gate de seguridad runtime en CI con comando `npm audit --omit=dev --audit-level=high`, ejecutado dentro de `quality` sin `continue-on-error`.
- Se agrego script `scripts/security-audit-gate.cjs` con soporte de break-glass estricto: requiere waiver valido+activo y `SECURITY_AUDIT_BREAK_GLASS=1`.
- Se agrego template versionado `.github/security-audit-waiver.json` y documentacion operativa en `docs/release/pre-release-checklist.md`.
- Se cubrio la logica de waiver/break-glass con tests unitarios en `scripts/__tests__/security-audit-gate.test.js`.
- Validaciones en verde: `npm test -- scripts/__tests__/security-audit-gate.test.js`, `npm run security:audit:runtime`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

### File List

- `_bmad-output/implementation-artifacts/28-2-add-dependency-security-gate-to-ci.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `.github/workflows/ci.yml`
- `package.json`
- `scripts/security-audit-gate.cjs`
- `scripts/__tests__/security-audit-gate.test.js`
- `.github/security-audit-waiver.json`
- `docs/release/pre-release-checklist.md`

## Change Log

- 2026-03-04: Story movida a `in-progress`, se implemento gate de seguridad runtime en CI con waiver break-glass controlado y documentado.
- 2026-03-04: Validaciones completas ejecutadas en verde y story movida a `review`.
- 2026-03-04: Code review adversarial ejecutado; resultado `Changes Requested`; se agregan follow-ups AI y story vuelve a `in-progress`.
