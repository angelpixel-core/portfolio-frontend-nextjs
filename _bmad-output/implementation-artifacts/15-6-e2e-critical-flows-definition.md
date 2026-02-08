# Story 15.6: E2E Critical Flows Definition

**Epic:** 15 - TypeScript Hardening Sprint
**Status:** ready-for-dev
**Estimated Effort:** 2 hours
**Risk:** Low

---

## User Story

**Como** QA engineer,
**Quiero** tener documentados los flujos críticos que siempre deben tener E2E coverage,
**Para que** bugs como el del menú (Story 14-18) se detecten antes.

---

## Context

### Why This Story Exists

El bug del menú en Story 14-18 (menú no se cerraba al navegar) se detectó tarde porque no había un E2E test para ese flujo. Esta story documenta los "critical flows" que siempre deben tener cobertura E2E, evitando regresiones similares.

Continuando la consolidación de Epic 15:
- Story 15.1 migró hooks ✅
- Story 15.2 eliminó deprecated components ✅
- Story 15.3 migró providers ✅
- Story 15.4 migró atoms críticos ✅
- Story 15.5 consolidó logging ✅
- **Story 15.6** (esta) define critical E2E flows

### Current State

**E2E Tests existentes (24 archivos):**
```
e2e/
├── accessibility.spec.ts       # A11y tests
├── home.spec.ts                # Home page basic
├── theme.spec.ts               # Theme toggle
├── navigation.spec.ts          # Navigation flows
├── menu-autoclose.spec.ts      # Menu auto-close (Story 12.5, 14-18)
├── page-transitions.spec.ts    # Curtain transitions (Epic 13)
├── header-*.spec.ts            # Header zones (Epic 11)
├── projects-articles.spec.ts   # Projects/Articles pages (Epic 14)
└── ... (16 more)
```

**Coverage gaps potenciales:**
- No hay documentación centralizada de "flujos críticos"
- Desarrolladores no saben qué tests son obligatorios vs. opcionales
- No hay checklist de E2E mínimos antes de PR

### Target State

- CLAUDE.md tiene sección "Critical E2E Flows" documentada
- Lista explícita de flujos que SIEMPRE deben tener cobertura E2E
- Desarrolladores saben qué verificar antes de crear PR
- E2E tests existentes cubren todos los flujos críticos

---

## Acceptance Criteria

### AC1: Document Critical E2E Flows in CLAUDE.md
- [ ] Agregar sección "## Critical E2E Flows" después de "Testing Conventions"
- [ ] Listar flujos con referencia a archivo de test

### AC2: Define Navigation Flow Tests
- [ ] Navegación desde menú mobile → cierra menú, llega a destino
- [ ] Navegación desde navbar desktop → llega a destino
- [ ] Referencia: `e2e/menu-autoclose.spec.ts`, `e2e/navigation.spec.ts`

### AC3: Define Overlay Flow Tests
- [ ] Apertura/cierre de menú floating
- [ ] Apertura/cierre de chat panel
- [ ] Auth modal (futuro - placeholder)
- [ ] Referencia: `e2e/menu-autoclose.spec.ts`

### AC4: Define Persistent UI Tests
- [ ] Theme toggle persiste entre páginas
- [ ] Header visible en todas las páginas
- [ ] Referencia: `e2e/theme.spec.ts`, `e2e/header-*.spec.ts`

### AC5: Verify Existing E2E Coverage
- [ ] Verificar que `menu-autoclose.spec.ts` cubre menu auto-close on navigation (AC1 línea 25-60)
- [ ] Verificar que existe test de theme toggle cross-page
- [ ] E2E tests pasan: `npm run test:e2e`

---

## Tasks / Subtasks

- [ ] Task 1: Auditar E2E tests existentes (AC5)
  - [ ] Revisar `e2e/menu-autoclose.spec.ts` - verificar coverage de menu navigation
  - [ ] Revisar `e2e/theme.spec.ts` - verificar cross-page persistence
  - [ ] Listar cualquier gap de coverage

- [ ] Task 2: Documentar Critical E2E Flows en CLAUDE.md (AC1, AC2, AC3, AC4)
  - [ ] Agregar sección después de "Testing Conventions"
  - [ ] Formato: flujo → archivo de test → descripción

- [ ] Task 3: Verificar E2E tests pasan
  - [ ] Run `npm run test:e2e`
  - [ ] Documentar cualquier failure

- [ ] Task 4: Commit cambios

---

## Dev Notes

### Critical Flows Definition Pattern

Los "critical flows" son flujos de usuario que:
1. Si fallan, la app es inutilizable
2. Han causado regresiones en el pasado
3. Involucran múltiples componentes coordinados

### CLAUDE.md Section Format

```markdown
## Critical E2E Flows

These flows MUST have E2E coverage. Do not merge PRs that break these tests.

| Flow | Test File | Description |
|------|-----------|-------------|
| Menu mobile navigation | `e2e/menu-autoclose.spec.ts` | Menu closes on nav, reaches destination |
| Theme persistence | `e2e/theme.spec.ts` | Toggle persists across pages |
| Page transitions | `e2e/page-transitions.spec.ts` | Curtain animation completes |
| Header visibility | `e2e/header-visibility.spec.ts` | Header present on all pages |
| Overlay open/close | `e2e/menu-autoclose.spec.ts` | Menu/chat open and close correctly |

Run before PR: `npm run test:e2e`
```

### E2E Files to Audit

1. `e2e/menu-autoclose.spec.ts` - Ya tiene AC1, AC2 de Story 12.5
2. `e2e/theme.spec.ts` - Verificar cross-page
3. `e2e/navigation.spec.ts` - Desktop navigation
4. `e2e/page-transitions.spec.ts` - Transition system

### Story 14-18 Context

El bug era: "menu overlay doesn't auto-close on navigation". Se corrigió en 14-18 agregando `useEffect` en `MenuFloatingClient` que escucha cambios de `pathname` y cierra el menú. El E2E `menu-autoclose.spec.ts` ya lo cubre desde Story 12.5.

### Previous Story Learnings (15.5)

- Jest cache puede quedar stale después de renombrar archivos
- Tests que mockean console.* necesitan actualización cuando el format cambia
- Mantener File List actualizada con line numbers ayuda en review

### References

- [Source: _bmad-output/planning-artifacts/epic-15-typescript-hardening.md#Story 15.6]
- [Source: e2e/menu-autoclose.spec.ts - Existing E2E for menu auto-close]
- [Source: _bmad-output/implementation-artifacts/14-18-menu-auto-close-on-navigation.md - Bug fix context]

---

## Definition of Done

- [ ] CLAUDE.md tiene sección "Critical E2E Flows"
- [ ] Todos los flujos críticos listados con archivo de test
- [ ] E2E tests pasan (`npm run test:e2e`)
- [ ] Commit creado con mensaje descriptivo

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-08 | Story created with comprehensive dev context |

---

**Created:** 2026-02-08
**Author:** BMAD SM Agent (create-story workflow)
