# Story 15.1: Hooks TypeScript Migration

**Epic:** Epic 15 - TypeScript Hardening Sprint
**Status:** Done
**Priority:** Alta
**Estimated Effort:** 2 hours
**Risk:** Bajo

---

## User Story

**Como** desarrollador manteniendo este codebase,
**Quiero** que todos los hooks y sus barrels estén en TypeScript,
**Para que** los refactors sean type-safe y el autocompletado funcione correctamente.

---

## Context

### Why This Story Exists

La auditoría post-Epic 14 identificó que 50% del código sigue en JavaScript. Los hooks son críticos porque:
1. Son importados por múltiples componentes
2. `useAppSelector` y `useAppDispatch` necesitan tipado de `RootState` y `AppDispatch`
3. Los barrels mixtos (`index.js` vs `index.ts`) causan inconsistencia

### Current State

6 archivos barrel en JavaScript dentro de `src/hooks/`:

| Archivo | Contenido | Complejidad |
|---------|-----------|-------------|
| `src/hooks/index.js` | Re-exports store, ui, domains | Mínima |
| `src/hooks/store/index.js` | Exports useAppDispatch, useAppSelector | Mínima |
| `src/hooks/store/AppSelector/index.js` | Wrapper de useSelector | Necesita tipos |
| `src/hooks/store/AppDispatch/index.js` | Wrapper de useDispatch | Necesita tipos |
| `src/hooks/ui/index.js` | Exports 4 UI hooks | Mínima |
| `src/hooks/domains/index.js` | Re-exports 11 domain queries | Mínima |

### Target State

Todos los archivos migrados a TypeScript con:
- Tipos explícitos para `RootState` y `AppDispatch` importados desde `@/state/stores/ReduxStore`
- Typed hooks `useAppSelector` y `useAppDispatch` usando `TypedUseSelectorHook`
- Barrels con extensión `.ts` manteniendo mismas exports

---

## Acceptance Criteria

### AC1: Migrate src/hooks/index.js → index.ts
- [x] Renombrar archivo a `index.ts`
- [x] Mantener mismas exports (`store`, `ui`, `domains`)
- [x] Verificar que TypeScript no reporta errores

### AC2: Migrate src/hooks/store/index.js → index.ts
- [x] Renombrar archivo a `index.ts`
- [x] Mantener exports de `useAppDispatch` y `useAppSelector`

### AC3: Migrate src/hooks/store/AppSelector/index.js → index.ts
- [x] Renombrar archivo a `index.ts`
- [x] Importar `RootState` desde `@/state/stores/ReduxStore`
- [x] Tipar como `TypedUseSelectorHook<RootState>`
- [x] Ejemplo de código esperado:
```typescript
import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState } from "@/state/stores/ReduxStore";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
```

### AC4: Migrate src/hooks/store/AppDispatch/index.js → index.ts
- [x] Renombrar archivo a `index.ts`
- [x] Importar `AppDispatch` desde `@/state/stores/ReduxStore`
- [x] Retornar hook tipado
- [x] Ejemplo de código esperado:
```typescript
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/stores/ReduxStore";

const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
```

### AC5: Migrate src/hooks/ui/index.js → index.ts
- [x] Renombrar archivo a `index.ts`
- [x] Mantener exports de `useReducedMotion`, `useScrollAppearance`, `useTouchState`, `useTransition`

### AC6: Migrate src/hooks/domains/index.js → index.ts
- [x] Renombrar archivo a `index.ts`
- [x] Mantener re-exports de todos los domain query hooks (11 domains)

### AC7: Build Verification
- [x] `npm run build` pasa sin errores
- [x] `npm run typecheck` pasa sin errores nuevos (34 errores pre-existentes en tests, ninguno en archivos migrados)
- [x] `npm test` pasa (818+ tests)

---

## Technical Implementation

### Files to Modify

| File | Action | Notes |
|------|--------|-------|
| `src/hooks/index.js` | Rename → `.ts` | Solo cambio de extensión |
| `src/hooks/store/index.js` | Rename → `.ts` | Solo cambio de extensión |
| `src/hooks/store/AppSelector/index.js` | Migrate → `.ts` | Agregar tipos de Redux |
| `src/hooks/store/AppDispatch/index.js` | Migrate → `.ts` | Agregar tipos de Redux |
| `src/hooks/ui/index.js` | Rename → `.ts` | Solo cambio de extensión |
| `src/hooks/domains/index.js` | Rename → `.ts` | Solo cambio de extensión |

### Dependencies

- `RootState` y `AppDispatch` ya están exportados desde `src/state/stores/ReduxStore/index.ts:23-24`
- `TypedUseSelectorHook` viene de `react-redux`

### Order of Operations

1. Migrar `AppSelector` y `AppDispatch` primero (tienen tipado)
2. Migrar barrel `store/index.js`
3. Migrar `ui/index.js` y `domains/index.js`
4. Migrar barrel raíz `hooks/index.js`
5. Verificar build y tests

---

## Testing Strategy

### Verification Steps

1. **TypeScript Check**
   ```bash
   npm run typecheck
   ```

2. **Build Check**
   ```bash
   npm run build
   ```

3. **Test Suite**
   ```bash
   npm test
   ```

### No New Tests Required

Esta story es refactor de tipado. Los hooks ya funcionan y tienen cobertura en tests existentes. La verificación es que:
- Los imports desde `@/hooks` sigan funcionando
- TypeScript no reporte errores
- Build siga generándose correctamente

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking imports | Low | High | Verificar build después de cada archivo |
| Type errors cascade | Low | Medium | Migrar un archivo a la vez |
| Test failures | Very Low | Low | Tests ya pasan, cambios son solo de tipos |

---

## Definition of Done

- [x] 6 archivos migrados de `.js` a `.ts`
- [x] `useAppSelector` tipado con `TypedUseSelectorHook<RootState>`
- [x] `useAppDispatch` tipado con `AppDispatch`
- [x] `npm run build` pasa
- [x] `npm run typecheck` pasa (sin errores nuevos - 34 pre-existentes en tests)
- [x] `npm test` pasa (818+ tests)
- [x] 0 archivos `index.js` en `src/hooks/`

---

## Senior Developer Review (AI)

**Reviewer:** Adversarial Code Review Workflow
**Date:** 2026-02-07
**Outcome:** Approved with notes

### Findings Summary

| Severity | Count | Status |
|----------|-------|--------|
| HIGH | 2 | Resolved |
| MEDIUM | 2 | Resolved |
| LOW | 3 | Acknowledged |

### Action Items

- [x] [HIGH] Commit implementation changes - 6 .ts files + tsconfig.json committed
- [x] [HIGH] Clarify AC7 typecheck status - 34 errors are pre-existing in test files, not introduced by this story
- [x] [MEDIUM] Commit all changes - Done (commit 88548dd)
- [x] [MEDIUM] Clarify File List - Added/Deleted sections already distinguish changes
- [ ] [LOW] Add JSDoc to other barrels (optional - domains has it, others don't)
- [ ] [LOW] Format tsconfig.json with line breaks (cosmetic)

### Review Notes

Los 34 errores de typecheck son **pre-existentes** en archivos de test (`e2e/`, `__tests__/`). Ningún error fue introducido por esta migración. Los archivos migrados (`src/hooks/*.ts`) no tienen errores de TypeScript.

---

## Dev Agent Record

### Implementation Plan
1. Migrate AppSelector with TypedUseSelectorHook<RootState>
2. Migrate AppDispatch with typed dispatch function
3. Migrate remaining barrels (store, ui, domains, root)
4. Update tsconfig.json path alias to point to .ts
5. Verify build, typecheck, and tests

### Completion Notes
- All 6 barrel files successfully migrated from .js to .ts
- useAppSelector now uses TypedUseSelectorHook<RootState> for proper type inference
- useAppDispatch returns typed dispatch function with AppDispatch
- tsconfig.json updated: @/hooks path now points to index.ts
- Build passes, 818 tests passing, 0 index.js files remain in hooks/

### Debug Log
- Build initially failed due to tsconfig.json pointing to old index.js
- Fixed by updating path alias from index.js to index.ts

---

## File List

### Modified
- `src/hooks/index.ts` (was index.js)
- `src/hooks/store/index.ts` (was index.js)
- `src/hooks/store/AppSelector/index.ts` (was index.js)
- `src/hooks/store/AppDispatch/index.ts` (was index.js)
- `src/hooks/ui/index.ts` (was index.js)
- `src/hooks/domains/index.ts` (was index.js)
- `tsconfig.json` (updated @/hooks path)

### Deleted
- `src/hooks/index.js`
- `src/hooks/store/index.js`
- `src/hooks/store/AppSelector/index.js`
- `src/hooks/store/AppDispatch/index.js`
- `src/hooks/ui/index.js`
- `src/hooks/domains/index.js`

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-07 | Story created | BMAD SM Agent |
| 2026-02-07 | Implementation complete - all hooks migrated to TypeScript | Dev Agent |
| 2026-02-07 | Code review completed - approved with notes, committed (88548dd) | Code Review Agent |

---

## References

- [Redux Toolkit TypeScript Guide](https://redux-toolkit.js.org/usage/usage-with-typescript)
- [RootState/AppDispatch Types](../../../src/state/stores/ReduxStore/index.ts)
- [Epic 15 Specification](../../planning-artifacts/epic-15-typescript-hardening.md)
- [Post-Epic 14 Audit](../../analysis/code-quality-and-refactoring/audit-report-2026-02-07.md)

---

**Story Created:** 2026-02-07
**Author:** BMAD SM Agent
**Workflow:** bmad:bmm:workflows:create-story
**Implementation Completed:** 2026-02-07
