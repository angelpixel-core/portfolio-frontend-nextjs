# Story 15.2: Delete Deprecated Components

**Epic:** 15 - TypeScript Hardening Sprint
**Status:** Review
**Estimated Effort:** 30 minutes
**Risk:** Low

---

## User Story

**Como** desarrollador,
**Quiero** eliminar componentes marcados como deprecated,
**Para que** no haya confusión sobre qué componentes usar.

---

## Context

Durante Epic 14 se creó `ProjectCard` como reemplazo unificado de los componentes `Project` y `FeaturedProject`. Estos componentes antiguos ya no se usan pero siguen en el codebase creando confusión.

### Componentes a eliminar:
1. `src/ui/molecules/Project/` - Componente antiguo de tarjeta de proyecto
2. `src/ui/molecules/FeaturedProject/` - Componente antiguo de proyecto destacado

Ambos fueron reemplazados por `src/ui/organisms/ProjectCard/`.

---

## Acceptance Criteria

### AC1: Eliminar componente Project
- [x] Eliminar directorio `src/ui/molecules/Project/` completo
- [x] Verificar que no hay imports residuales

### AC2: Eliminar componente FeaturedProject
- [x] Eliminar directorio `src/ui/molecules/FeaturedProject/` completo
- [x] Verificar que no hay imports residuales

### AC3: Limpiar exports de barrel
- [x] Si `src/ui/molecules/index.js` exporta estos componentes, remover las líneas
- [x] Verificar que no hay re-exports en otros barrels

### AC4: Build verification
- [x] `npm run build` pasa sin errores
- [x] `npm test` pasa sin errores

### AC5: No broken imports
- [x] `grep -r "Project.*molecules" src/` no encuentra resultados
- [x] `grep -r "FeaturedProject" src/` no encuentra resultados (excepto en ProjectCard si hay comentarios)

---

## Technical Notes

### Verificación pre-eliminación
```bash
# Buscar imports del componente Project
grep -r "from.*molecules/Project" src/
grep -r "from.*@/molecules.*Project" src/

# Buscar imports del componente FeaturedProject
grep -r "FeaturedProject" src/
```

### Archivos a eliminar
```
src/ui/molecules/Project/
├── index.jsx
├── styles.css (si existe)
└── skeleton.jsx (si existe)

src/ui/molecules/FeaturedProject/
├── index.jsx
├── styles.css (si existe)
└── skeleton.jsx (si existe)
```

---

## Out of Scope

- Migración de otros componentes a TypeScript
- Refactoring de ProjectCard
- Cambios en tests de ProjectCard

---

## Definition of Done

- [x] Componentes deprecated eliminados del filesystem
- [x] No hay imports rotos
- [x] Build pasa
- [x] Tests pasan
- [x] Commit creado con mensaje descriptivo

---

## Tasks

- [x] Task 1: Verificar que no hay imports a Project/FeaturedProject
- [x] Task 2: Eliminar directorio src/ui/molecules/Project/
- [x] Task 3: Eliminar directorio src/ui/molecules/FeaturedProject/
- [x] Task 4: Limpiar barrel exports si es necesario
- [x] Task 5: Run build and tests
- [x] Task 6: Commit changes

---

## File List

### Deleted
- `src/ui/molecules/Project/index.jsx`
- `src/ui/molecules/Project/styles.css`
- `src/ui/molecules/FeaturedProject/index.jsx`
- `src/ui/molecules/FeaturedProject/styles.css`
- `src/ui/molecules/FeaturedProject/skeleton.tsx`
- `src/ui/molecules/FeaturedProject/__tests__/FeaturedProject.test.tsx`

### Modified
- `src/ui/molecules/index.js` - Removed deprecated exports
- `src/ui/shared/skeletons/skeletons.jsx` - Removed unused skeleton placeholders

---

## Dev Agent Record

### Implementation Plan
1. Verify no external imports to deprecated components
2. Delete Project/ and FeaturedProject/ directories
3. Clean barrel exports in molecules/index.js
4. Remove unused skeletons from shared/skeletons
5. Run build and test suite
6. Create commit

### Completion Notes
✅ Story completed successfully
- Deleted 2 deprecated component directories (Project, FeaturedProject)
- Removed 3 export lines from molecules/index.js
- Removed 2 unused skeleton placeholders from shared/skeletons/skeletons.jsx
- Build passes with 0 errors
- All 813 tests pass (81 suites)
- No breaking imports found

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-07 | Story created |
| 2026-02-07 | Implementation complete - deprecated components deleted |

---

**Created:** 2026-02-07
**Author:** BMAD SM Agent
