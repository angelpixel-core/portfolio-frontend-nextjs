# Story 25.6: Z-index System Documentation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como desarrollador que mantiene coherencia arquitectonica,
quiero auditar y documentar de forma definitiva la escala de z-index del proyecto,
para que futuras implementaciones eviten conflictos de capas y regresiones visuales.

## Acceptance Criteria

1. `docs/architecture/z-index-scale.md` queda actualizado con inventario completo de valores `z-index`/`z-*` usados en la app (scope Epic 25).
2. Cada valor encontrado en `src/` (con exclusion explicita de WordCloud) queda mapeado a una capa oficial de la escala (Background, Document, Elevation, Components, Overlays, Panels, Modals, A11y).
3. El solapamiento `z-30` entre HireMe y Floating panel queda documentado como conflicto conocido no-bloqueante con racional tecnico.
4. `docs/index.md` incluye un enlace valido hacia `docs/architecture/z-index-scale.md`.
5. No se introducen cambios funcionales de UI; el alcance es de documentacion y auditoria.

## Tasks / Subtasks

- [ ] Task 1: Auditoria exhaustiva de capas actuales (AC: 1,2)
  - [ ] 1.1 Ejecutar inventario de `z-index` en CSS (`grep -rn "z-index" src/ --include="*.css"`).
  - [ ] 1.2 Ejecutar inventario de utilidades Tailwind `z-*` en componentes (`grep -rn "z-\\[|z-[0-9]" src/ --include="*.tsx" --include="*.jsx"`).
  - [ ] 1.3 Excluir `src/ui/organisms/WordCloud/**` del alcance y dejar la exclusion explicitada en documento.
  - [ ] 1.4 Consolidar tabla de ocurrencias por archivo/componente para trazabilidad.

- [ ] Task 2: Actualizar documento de arquitectura de escala z-index (AC: 1,2,3)
  - [ ] 2.1 Completar/ajustar `docs/architecture/z-index-scale.md` con inventario real post-Story 25.5.
  - [ ] 2.2 Validar que cada ocurrencia mapea a una capa oficial y marcar excepciones justificadas.
  - [ ] 2.3 Documentar conflicto conocido HireMe vs Floating (`z-30`) como no-conflicto por visibilidad mutuamente excluyente.
  - [ ] 2.4 Incluir seccion de reglas operativas para evitar nuevos valores ad-hoc sin actualizacion documental.

- [ ] Task 3: Integracion documental y navegabilidad (AC: 4,5)
  - [ ] 3.1 Verificar y corregir (si aplica) enlace en `docs/index.md` hacia `docs/architecture/z-index-scale.md`.
  - [ ] 3.2 Confirmar consistencia de lenguaje y estructura con `docs/architecture/*.md`.
  - [ ] 3.3 Verificar que no hubo cambios de comportamiento visual ni refactors de componentes (solo docs + auditoria).

- [ ] Task 4: Verificacion y cierre de story (AC: 1,2,3,4,5)
  - [ ] 4.1 Ejecutar `npm run lint`.
  - [ ] 4.2 Ejecutar `npm run typecheck`.
  - [ ] 4.3 Ejecutar `npm run build`.
  - [ ] 4.4 Documentar evidencia de comandos de auditoria utilizados y resultados.

## Dev Notes

### Technical Requirements

- Esta story es de **documentacion + auditoria**; no debe modificar UX ni comportamiento funcional.
- La escala oficial debe permanecer centralizada en `docs/architecture/z-index-scale.md`.
- Cualquier valor fuera de la escala debe quedar registrado como excepcion explicita con motivo.
- WordCloud permanece fuera de alcance por decision de Epic 25.

### Architecture Compliance

- Epic 25 define Story 25.6 como cierre de coherencia CSS con riesgo muy bajo y alcance documental.
- Debe respetarse el alcance estricto de Epic 25: sin nuevas features ni refactor estructural.
- Debe preservarse la trazabilidad entre hallazgos de auditoria y capas oficiales.

### Library / Framework Requirements

- Stack vigente: Next.js 14, React 18, Tailwind CSS 3.
- No se requieren nuevas dependencias para esta story.
- Las verificaciones tecnicas deben usar comandos existentes del proyecto.

### File Structure Requirements

- Archivos objetivo principales:
  - `docs/architecture/z-index-scale.md`
  - `docs/index.md`
- Archivos de evidencia/auditoria (lectura):
  - `src/styles/globals.css`
  - `src/ui/organisms/NavBar/styles.css`
  - `src/ui/overlays/Floating/styles.css`
  - `src/ui/overlays/FloatingMobile/styles.css`
  - `src/ui/molecules/TransitionEffect/index.tsx`
  - `src/ui/molecules/HireMe/styles.css`

### Testing Requirements

- Ejecutar `npm run lint`, `npm run typecheck`, `npm run build` como gate minimo de cierre.
- No se exige nueva cobertura de tests para funcionalidades, pero si evidencia reproducible de auditoria (`grep`).
- Si durante auditoria aparece un riesgo funcional real, registrar follow-up sin expandir alcance de la story.

### Previous Story Intelligence

- Story 25.5 quedo en `done` con migracion BEM completa y exclusion de WordCloud validada.
- En code-review 25.5 se corrigieron issues de consistencia de selectores y cobertura de breakpoint.
- Leccion aplicable: priorizar evidencia concreta de auditoria y mantener alineacion estricta entre story y sprint-status.

### Git Intelligence Summary

- Commits recientes de 25.5 muestran patron por capas (app/atoms/molecules/organisms+overlays/tests/docs), util para mantener trazabilidad en esta story.
- El cierre de 25.5 sincronizo story y sprint status a `done`, habilitando 25.6 como siguiente backlog.

### Latest Technical Information

- No hay dependencia externa nueva para investigar; la fuente de verdad es el propio repo y documentos de arquitectura.
- El documento `docs/architecture/z-index-scale.md` ya existe y debe consolidarse contra inventario real actual.

### Project Structure Notes

- No se detecta `project-context.md`; las referencias canonicas son docs de arquitectura + artifacts de Epic 25.
- Mantener estilo y estructura de documentacion existente en `docs/architecture/`.

### References

- Story 25.6 en Epic 25: `_bmad-output/implementation-artifacts/epic-25-architectural-coherence.md` (seccion "Story 25.6 — Z-index System Documentation").
- Estado de sprint y backlog activo: `_bmad-output/implementation-artifacts/sprint-status.yaml`.
- Documento objetivo de escala: `docs/architecture/z-index-scale.md`.
- Indice documental del proyecto: `docs/index.md`.
- Convenciones CSS/BEM del proyecto: `docs/architecture/styles-architecture.md`.

## Dev Agent Record

### Agent Model Used

openai/gpt-5.3-codex

### Debug Log References

- Explore session: `ses_367ad9a62ffe6nvjsB2okKRAdI`
- Explore task: `bg_9f50c7c9`
- Explore session: `ses_367ad9677ffeyVd4A1z0QbmxWz`
- Explore task: `bg_f58e7acb`

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story enfocada en cierre documental de escala z-index post-normalizacion BEM.

### File List

- `_bmad-output/implementation-artifacts/25-6-z-index-system-documentation.md` (created)
