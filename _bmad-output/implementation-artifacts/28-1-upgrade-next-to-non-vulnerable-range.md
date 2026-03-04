# Story 28.1: Upgrade Next to Non-Vulnerable Range

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como owner de plataforma,
quiero actualizar `next` a un rango no vulnerable y compatible con el proyecto,
para eliminar vulnerabilidades high de runtime sin romper el comportamiento actual del portfolio.

## Acceptance Criteria

1. La dependencia `next` queda en una versión/rango no vulnerable al advisory activo reportado por `npm audit --omit=dev --audit-level=high`.
2. El upgrade mantiene compatibilidad con la arquitectura vigente (App Router, output standalone, next-sitemap, Storybook 8).
3. Se documenta explícitamente la estrategia elegida si `npm audit fix --force` propone un major incompatible.
4. `npm run lint`, `npm run typecheck`, `npm test` y `npm run build` pasan después del cambio.
5. Se actualiza evidencia de seguridad (audit) demostrando remediación o riesgo residual aceptado con racional técnico.

## Tasks / Subtasks

- [x] Task 1: Definir estrategia de upgrade segura y compatible (AC: 1,2,3)
  - [x] 1.1 Confirmar advisories actuales y rango afectado con `npm audit --omit=dev --audit-level=high`.
  - [x] 1.2 Evaluar opciones de upgrade (patch/minor compatible vs major con costo de migración).
  - [x] 1.3 Seleccionar versión objetivo de `next` y rationale de compatibilidad con stack actual.

- [x] Task 2: Aplicar upgrade y ajustar compatibilidad (AC: 1,2,4)
  - [x] 2.1 Actualizar `next` en `package.json` y lockfile con versión objetivo.
  - [x] 2.2 Revisar compatibilidad con `eslint-config-next`, configuración de build y `next-sitemap`.
  - [x] 2.3 Corregir posibles regresiones de configuración (`next.config.js`, scripts, warnings).

- [x] Task 3: Validación de calidad y seguridad (AC: 4,5)
  - [x] 3.1 Ejecutar `npm run lint`.
  - [x] 3.2 Ejecutar `npm run typecheck`.
  - [x] 3.3 Ejecutar `npm test`.
  - [x] 3.4 Ejecutar `npm run build`.
  - [x] 3.5 Ejecutar `npm audit --omit=dev --audit-level=high` y registrar resultado.

- [x] Task 4: Documentar resultado y riesgos residuales (AC: 3,5)
  - [x] 4.1 Si el fix requiere major incompatible, documentar alternativas y plan de mitigación por fases.
  - [x] 4.2 Actualizar artefacto de release/deuda técnica con resultado del upgrade.

## Dev Notes

### Technical Requirements

- Hallazgo actual confirmado: `next` en rango vulnerable (`10.0.0 - 15.5.9`) con advisory high de DoS.
- `npm audit fix --force` sugiere `next@16.1.6` (breaking change), por lo que no se debe aplicar ciegamente sin evaluar compatibilidad.
- Debe priorizarse una remediación que preserve el runtime actual (Next 14 App Router) salvo decisión explícita de migración mayor.

### Architecture Compliance

- Proyecto brownfield: cambios quirúrgicos, sin reescritura.
- Respetar decisiones actuales de arquitectura:
  - Next.js App Router
  - salida `standalone` para Docker
  - CI con quality gates obligatorios
- Evitar expandir alcance a historias de layout/storybook en esta story.

### Library / Framework Requirements

- Dependencias críticas relacionadas:
  - `next` (objetivo de remediación)
  - `eslint-config-next` (alinear versión compatible)
  - `next-sitemap` (verificar postbuild)
- Mantener Node 20 como baseline operativo (CI y docs de release).

### File Structure Requirements

- Archivos primarios esperados:
  - `package.json`
  - `package-lock.json`
  - `next.config.js` (si requiere ajuste de compatibilidad)
  - `docs/release/production-readiness-audit.md` o equivalente de seguimiento (si aplica actualización de evidencia)

### Testing Requirements

- Obligatorios de story:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `npm audit --omit=dev --audit-level=high`
- Si aparece regresión por upgrade, debe quedar documentada con rollback o mitigación.

### Previous Story Intelligence

- No aplica (story `28.1` es primera historia de la épica 28).
- Contexto heredado: epic 28 fue agregado como bloque P0 de producción para seguridad + confiabilidad de señal de testing.

### Git Intelligence Summary

- Commits recientes relevantes de planificación:
  - `bd494b5` (`sprint-status` extendido con epics 26-30)
  - `eaf1e2c` (refresh de epics/stories)
  - `b325ffc` (implementation readiness report)
- Esta story activa el primer trabajo ejecutable de hardening P0.

### Latest Technical Information

- Resultado actual de auditoría local:
  - Advisory high en `next` por DoS (Image Optimizer remotePatterns / RSC deserialization).
  - Rango vulnerable reportado: `10.0.0 - 15.5.9`.
  - `npm audit fix --force` propone salto a major (`16.1.6`) con riesgo de breaking changes.
- Documentación oficial de env en Next.js y Vercel refuerza que cambios de build/runtime deben validarse por entorno durante deploy.

### Project Context Reference

- No se detectó `project-context.md`; fuentes canónicas para esta historia: epics, architecture, release docs y estado de sprint.

### References

- Story tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml` (`28-1-upgrade-next-to-non-vulnerable-range`)
- Backlog de deuda técnica: `docs/release/technical-debt-backlog.md` (TD-01.1)
- Auditoría de producción: `docs/release/production-readiness-audit.md`
- Requisitos de deploy y entorno: `docs/release/devops-iac-requirements.md`
- Arquitectura base: `_bmad-output/planning-artifacts/architecture.md`
- PRD base: `_bmad-output/planning-artifacts/prd.md`
- Manifest de dependencias: `package.json`

## Dev Agent Record

### Agent Model Used

openai/gpt-5.3-codex

### Debug Log References

- N/A

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Upgrade realizado de `next` a `15.5.12` y de `eslint-config-next` a `15.5.12` para salir del rango vulnerable reportado.
- Se descartó salto a `next@16.x` sugerido por `npm audit fix --force` por riesgo de breaking changes fuera de alcance de la story.
- Ajustes de compatibilidad aplicados para Next 15: `next/link` en pantallas de error/not-found, remoción de `dynamic(..., { ssr: false })` en server component, y tipado de `params` como `Promise` en App Router dynamic route.
- Se actualizó evidencia de release hardening en `docs/release/production-readiness-audit.md` con mitigación R1.
- Quality gates ejecutados y en verde: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm audit --omit=dev --audit-level=high`.

### File List

- `_bmad-output/implementation-artifacts/28-1-upgrade-next-to-non-vulnerable-range.md`
- `package.json`
- `package-lock.json`
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/app/layout.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/domains/content/model/__tests__/mock.test.ts`
- `docs/release/production-readiness-audit.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-03-04: Story movida a `in-progress`, se aplico upgrade a `next@15.5.12` y ajustes de compatibilidad para Next 15; quality gates y audit en verde; story movida a `review`.
