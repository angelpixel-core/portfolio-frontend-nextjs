# Story 15.7: Documentation Update

**Epic:** 15 - TypeScript Hardening Sprint
**Status:** ready-for-dev
**Estimated Effort:** 1.5 hours
**Risk:** Low

---

## User Story

**Como** desarrollador nuevo en el proyecto,
**Quiero** que la documentación refleje el estado actual post-Epic 14,
**Para que** el onboarding sea más rápido.

---

## Context

### Why This Story Exists

Post-Epic 14 audit reveló que CLAUDE.md carece de reglas de proceso aprendidas durante Epics 13-14:
- **HYBRID_EPIC pattern**: Epics pueden fusionarse estratégicamente (e.g., Epic 17 merged into 14)
- **Testing principle**: "Test que no refleja UI = deuda técnica"

Esta story cierra Epic 15 documentando lecciones aprendidas.

### Previous Story Learnings (15.6)

- Jest cache puede quedar stale después de renombrar archivos
- Tests que mockean console.* necesitan actualización cuando el format cambia
- 109/285 E2E failures son pre-existentes (infraestructura, no regresiones)

### Current State

**CLAUDE.md ya tiene:**
- [x] Sección "Critical E2E Flows" (agregada en Story 15.6, lines 154-171)

**CLAUDE.md falta:**
- [ ] Regla HYBRID_EPIC para fusión estratégica de epics
- [ ] Principio de testing sobre sincronización test/UI

**component-inventory.md:**
- Existe en `docs/component-inventory.md`
- Requiere verificación de actualización (o marcado para futuro)

### Target State

- CLAUDE.md documenta HYBRID_EPIC pattern
- CLAUDE.md documenta testing principle
- component-inventory.md verificado o marcado para actualización

---

## Acceptance Criteria

### AC1: Document HYBRID_EPIC Rule
- [ ] Agregar sección en CLAUDE.md explicando cuándo/cómo fusionar epics
- [ ] Incluir ejemplo: "Epic 17 (Code Quality) merged into Epic 14"
- [ ] Ubicación: después de "Testing Conventions" o en nueva sección "Process Rules"

### AC2: Document Testing Principle
- [ ] Agregar regla: "Test que no refleja UI actual = deuda técnica"
- [ ] Incluir contexto: snapshots y assertions deben sincronizarse con cambios de UI
- [ ] Ubicación: en "Testing Conventions"

### AC3: Verify Component Inventory (ALREADY DONE in 15.6)
- [x] Sección "Critical E2E Flows" ya existe en CLAUDE.md (lines 154-171)
- Este AC fue completado prematuramente en Story 15.6

### AC4: Verify component-inventory.md
- [ ] Revisar `docs/component-inventory.md`
- [ ] Si está desactualizado, crear nota para actualización futura
- [ ] NO reescribir completamente (fuera de scope)

---

## Tasks / Subtasks

- [x] Task 1: Document HYBRID_EPIC pattern (AC1)
  - [x] Leer contexto de Epic 14 retrospective para entender el merge
  - [x] Redactar sección clara y concisa
  - [x] Agregar a CLAUDE.md

- [x] Task 2: Document Testing Principle (AC2)
  - [x] Redactar regla sobre sincronización test/UI
  - [x] Agregar a Testing Conventions en CLAUDE.md

- [x] Task 3: Verify component-inventory.md (AC4)
  - [x] Leer `docs/component-inventory.md`
  - [x] Comparar con componentes actuales en `src/ui/`
  - [x] Documentar estado (actual o marcado para update)

- [ ] Task 4: Commit cambios
  - [ ] Commit descriptivo con cambios de documentación

---

## Dev Notes

### HYBRID_EPIC Pattern Context

En Epic 14 se fusionó el planeado Epic 17 (Code Quality & Refactorization). Las razones fueron:
1. Sinergia: ambos epics tocaban los mismos archivos
2. Momentum: el equipo estaba en flujo con UI consolidation
3. Eficiencia: evitar context switching

La fusión se documentó en `sprint-status.yaml` con comentario explicando el merge.

### Testing Principle Origin

Durante Story 14-10 y otras, se actualizaron componentes pero los tests no se sincronizaron. Esto creó:
- Snapshots obsoletos
- Assertions buscando clases CSS antiguas
- Mocks con APIs desactualizadas

La regla previene esta deuda: cuando cambias UI, actualizas tests en el mismo commit.

### CLAUDE.md Structure Suggestion

```markdown
## Process Rules

### HYBRID_EPIC Pattern
When strategic synergy exists, epics can be merged mid-sprint:
- Example: Epic 17 merged into Epic 14 (code quality + UI consolidation)
- Document merge in sprint-status.yaml with comment
- Update epic file with merged stories

## Testing Conventions

### Test-UI Synchronization Rule
A test that doesn't reflect current UI is technical debt.
- Update snapshots when visual changes are intentional
- Update assertions when selectors/classes change
- Update mocks when APIs are renamed
```

### References

- [Source: _bmad-output/planning-artifacts/epic-15-typescript-hardening.md#Story 15.7]
- [Source: _bmad-output/implementation-artifacts/epic-14-retro-2026-02-07.md - Epic 14 retrospective]
- [Source: docs/component-inventory.md - Component inventory to verify]

---

## Definition of Done

- [ ] CLAUDE.md tiene regla HYBRID_EPIC documentada
- [ ] CLAUDE.md tiene principio de testing documentado
- [ ] component-inventory.md verificado (o marcado para update)
- [ ] `npm run build` pasa
- [ ] Commit creado con mensaje descriptivo

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-08 | Story created with comprehensive dev context |

---

**Created:** 2026-02-08
**Author:** BMAD SM Agent (create-story workflow)
