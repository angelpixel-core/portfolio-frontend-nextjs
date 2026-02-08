# Epic 15: TypeScript Hardening Sprint

**Status:** Ready for Development
**Type:** Technical Hardening
**Duration:** 1 sprint (~1 semana)
**Origin:** Post-Epic 14 Audit (audit-report-2026-02-07.md)

---

## Objetivo

Completar la migración a TypeScript y eliminar deuda técnica acumulada antes de iniciar el Epic de Auth, estableciendo una base sólida para refactors futuros.

---

## Contexto

La auditoría post-Epic 14 identificó:
- **50% del código en JavaScript** (192 archivos JS vs 192 TS)
- **UI layer** (atoms, molecules, organisms) mayormente en JSX
- **Componentes deprecated** sin eliminar
- **Console statements** sin sistema de logging unificado
- **Barrels mixtos** (index.js/index.ts)

**Cloudy Index actual:** 7.8/10
**Target post-Epic 15:** 8.5+/10

---

## Scope

### In Scope

1. Migración TypeScript de hooks y barrels críticos
2. Eliminación de componentes deprecated
3. Consolidación de logging (console.* → lib/logger)
4. Migración de providers a TypeScript
5. Migración de atoms críticos (buttons, links)
6. Documentación de patrones de testing

### Out of Scope

- Migración completa de todos los componentes UI (solo críticos)
- Features nuevas
- Cambios de UX/UI
- Refactors arquitectónicos mayores

---

## Stories

### Story 15.1: Hooks TypeScript Migration

**Como** desarrollador manteniendo este codebase,
**Quiero** que todos los hooks y sus barrels estén en TypeScript,
**Para que** los refactors sean type-safe y el autocompletado funcione correctamente.

**Acceptance Criteria:**
- [x] `src/hooks/index.js` → `index.ts`
- [x] `src/hooks/ui/index.js` → `index.ts`
- [x] `src/hooks/domains/index.js` → `index.ts`
- [x] `src/hooks/store/index.js` → `index.ts`
- [x] `src/hooks/store/AppSelector/index.js` → `index.ts`
- [x] `src/hooks/store/AppDispatch/index.js` → `index.ts`
- [x] Todos los imports funcionan correctamente
- [x] `npm run build` pasa
- [x] `npm run typecheck` pasa (sin errores nuevos)

**Esfuerzo estimado:** 2 horas
**Riesgo:** Bajo

---

### Story 15.2: Delete Deprecated Components

**Como** desarrollador,
**Quiero** eliminar componentes marcados como deprecated,
**Para que** no haya confusión sobre qué componentes usar.

**Acceptance Criteria:**
- [x] Eliminar `src/ui/molecules/Project/index.jsx` (reemplazado por ProjectCard)
- [x] Eliminar `src/ui/molecules/FeaturedProject/index.jsx` (reemplazado por ProjectCard)
- [x] Verificar que no hay imports a estos componentes
- [x] `npm run build` pasa
- [x] `npm test` pasa

**Esfuerzo estimado:** 30 minutos
**Riesgo:** Bajo

---

### Story 15.3: Providers TypeScript Migration

**Como** desarrollador,
**Quiero** que los providers de estado estén en TypeScript,
**Para que** la configuración de providers sea type-safe.

**Acceptance Criteria:**
- [x] `src/state/providers/ThemeProvider/index.jsx` → `index.tsx`
- [x] `src/state/providers/ReduxProvider/index.jsx` → `index.tsx`
- [x] `src/state/providers/ReactQueryProvider/index.jsx` → `index.tsx`
- [x] Types correctamente definidos para props y context
- [x] `npm run build` pasa

**Esfuerzo estimado:** 1.5 horas
**Riesgo:** Bajo

---

### Story 15.4: Critical Atoms TypeScript Migration

**Como** desarrollador,
**Quiero** que los atoms más usados estén en TypeScript,
**Para que** los componentes que los usan tengan type safety.

**Acceptance Criteria:**
- [ ] Migrar buttons críticos: `MenuButton`, `AuthButton`, `ChatButton`
- [ ] Migrar barrel: `src/ui/atoms/buttons/index.js` → `index.ts`
- [ ] Migrar barrel: `src/ui/atoms/index.js` → `index.ts`
- [ ] Props correctamente tipados con interfaces
- [ ] `npm run build` pasa

**Esfuerzo estimado:** 3 horas
**Riesgo:** Medio (muchos dependientes)

---

### Story 15.5: Logging Consolidation

**Como** desarrollador,
**Quiero** que todos los console.log/warn/error usen el sistema de logging centralizado,
**Para que** el debugging sea consistente y controlable.

**Acceptance Criteria:**
- [ ] Revisar `src/lib/logger.js` - migrar a TypeScript si necesario
- [ ] Reemplazar `console.log` en `ChatBox.tsx`
- [ ] Reemplazar `console.warn/error` en `TransitionProvider`
- [ ] Reemplazar `console.warn` en domain mocks
- [ ] Reemplazar `console.log` en `lib/actions.js`
- [ ] 0 console.log/warn/error directos en código de producción (excepto logger.js)
- [ ] `npm run build` pasa

**Esfuerzo estimado:** 3 horas
**Riesgo:** Bajo

---

### Story 15.6: E2E Critical Flows Definition

**Como** QA engineer,
**Quiero** tener documentados los flujos críticos que siempre deben tener E2E coverage,
**Para que** bugs como el del menú (Story 14-18) se detecten antes.

**Acceptance Criteria:**
- [ ] Documentar en CLAUDE.md sección "Critical E2E Flows"
- [ ] Flujos definidos:
  - Navegación desde menú mobile
  - Apertura/cierre de overlays (menu, chat, auth)
  - Cambio de ruta con UI persistente
  - Theme toggle en todas las páginas
- [ ] Agregar E2E test para menu auto-close on navigation (si no existe)
- [ ] E2E tests pasan

**Esfuerzo estimado:** 2 horas
**Riesgo:** Bajo

---

### Story 15.7: Documentation Update

**Como** desarrollador nuevo en el proyecto,
**Quiero** que la documentación refleje el estado actual post-Epic 14,
**Para que** el onboarding sea más rápido.

**Acceptance Criteria:**
- [ ] Actualizar CLAUDE.md con regla HYBRID_EPIC
- [ ] Actualizar CLAUDE.md con principio de testing ("test que no refleja UI = deuda")
- [ ] Agregar sección "Critical E2E Flows" en CLAUDE.md
- [ ] Verificar que component-inventory.md está actualizado (o marcar para actualización futura)

**Esfuerzo estimado:** 1.5 horas
**Riesgo:** Bajo

---

## Story Summary

| Story | Descripción | Esfuerzo | Riesgo | Prioridad |
|-------|-------------|----------|--------|-----------|
| 15.1 | Hooks TypeScript Migration | 2h | Bajo | Alta |
| 15.2 | Delete Deprecated Components | 30m | Bajo | Alta |
| 15.3 | Providers TypeScript Migration | 1.5h | Bajo | Media |
| 15.4 | Critical Atoms TypeScript Migration | 3h | Medio | Media |
| 15.5 | Logging Consolidation | 3h | Bajo | Media |
| 15.6 | E2E Critical Flows Definition | 2h | Bajo | Alta |
| 15.7 | Documentation Update | 1.5h | Bajo | Alta |

**Total estimado:** ~13.5 horas (~2-3 días de trabajo)

---

## Definition of Done (Epic)

- [ ] Todos los hooks y barrels críticos en TypeScript
- [ ] 0 componentes deprecated en el codebase
- [ ] 0 console.log/warn/error directos (excepto logger)
- [ ] Providers en TypeScript
- [ ] Atoms críticos (buttons) en TypeScript
- [ ] CLAUDE.md actualizado con reglas de proceso
- [ ] E2E critical flows documentados
- [ ] `npm run build` pasa
- [ ] `npm test` pasa (818+ tests)
- [ ] E2E tests pasan
- [ ] Cloudy Index: 8.0+ (target 8.5)

---

## Success Metrics

| Métrica | Antes | Target |
|---------|-------|--------|
| Cloudy Index | 7.8 | 8.5+ |
| JS files en src/ | 192 | <150 |
| Console statements | 17+ | 0 (en prod code) |
| Deprecated components | 2 | 0 |

---

## Risks & Mitigations

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Breaking imports | Media | Alto | Verificar build después de cada migración |
| Type errors cascade | Baja | Medio | Migración incremental, no big-bang |
| Test failures | Baja | Bajo | Tests ya pasan, cambios son de tipos |

---

## Dependencies

- **Ninguna externa** - Este epic es self-contained
- **Prerequisito para:** Epic 16 (Auth System)

---

## References

- [Audit Report](../_bmad-output/analysis/code-quality-and-refactoring/audit-report-2026-02-07.md)
- [Epic 14 Retrospective](../_bmad-output/implementation-artifacts/epic-14-retro-2026-02-07.md)
- [CLAUDE.md](../CLAUDE.md)

---

**Document Created:** 2026-02-07
**Author:** BMAD SM Agent
