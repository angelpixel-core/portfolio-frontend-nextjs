# Story 28.2: Add Dependency Security Gate to CI

Status: ready-for-dev

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

- [ ] Task 1: Diseñar política y ubicación del gate en CI (AC: 1,2,4)
  - [ ] 1.1 Definir comando de auditoría para runtime (`npm audit --omit=dev --audit-level=high`) y rationale técnico.
  - [ ] 1.2 Seleccionar job/stage para ejecutar el gate sin romper la secuencia actual (`quality` antes de `e2e` y `lighthouse`).
  - [ ] 1.3 Confirmar comportamiento de failure por exit code en GitHub Actions (sin `continue-on-error` en el gate).

- [ ] Task 2: Implementar gate en workflow de CI (AC: 1,2,4)
  - [ ] 2.1 Agregar paso explícito de security audit en `.github/workflows/ci.yml`.
  - [ ] 2.2 Preservar instalación con `npm ci --legacy-peer-deps` y baseline Node 20.
  - [ ] 2.3 Verificar que el pipeline mantenga gates bloqueantes/no-bloqueantes según arquitectura (lighthouse sigue warning-only).

- [ ] Task 3: Documentar break-glass/waiver process (AC: 3)
  - [ ] 3.1 Definir reglas mínimas del waiver: issue link, owner, expiration date, y plan de remediación.
  - [ ] 3.2 Documentar dónde vive el waiver y cómo se revisa en PR/CI.

- [ ] Task 4: Validación end-to-end del cambio (AC: 5)
  - [ ] 4.1 Ejecutar `npm run lint`.
  - [ ] 4.2 Ejecutar `npm run typecheck`.
  - [ ] 4.3 Ejecutar `npm test`.
  - [ ] 4.4 Ejecutar `npm run build`.
  - [ ] 4.5 Ejecutar manualmente el comando del gate y registrar evidencia de comportamiento por exit code.

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

## Dev Agent Record

### Agent Model Used

openai/gpt-5.3-codex

### Debug Log References

- N/A

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.

### File List

- `_bmad-output/implementation-artifacts/28-2-add-dependency-security-gate-to-ci.md`
