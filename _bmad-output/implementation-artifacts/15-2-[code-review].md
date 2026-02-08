---
id: 15-2-[code-review]
aliases: []
tags: []
---

# Code Review Findings – Story 15.2: Delete Deprecated Components

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)
**Story:** 15-2-delete-deprecated-components
**Fecha:** 2026-02-07
**Idioma:** Español

---

## Resumen

| Métrica                            | Valor                                                           |
| ---------------------------------- | --------------------------------------------------------------- |
| **Story file**                     | `implementation-artifacts/15-2-delete-deprecated-components.md` |
| **Discrepancias Git vs File List** | 0 (cambios commiteados)                                         |
| **Issues encontrados**             | 0 High, 2 Medium, 3 Low                                         |

---

## Git vs Story

- **File List:** 6 archivos eliminados, 2 modificados (`molecules/index.js`, `shared/skeletons/skeletons.jsx`).
- **Git:** Commit presente `76696a1 refactor(molecules): delete deprecated Project and FeaturedProject components`. Working tree limpio.
- **Conclusión:** No hay discrepancia; la implementación está commiteada.

---

## Validación de ACs

| AC                            | Estado | Notas                                                                                                   |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| AC1 Eliminar Project/         | OK     | Directorio ausente en `src/ui/molecules/`                                                               |
| AC2 Eliminar FeaturedProject/ | OK     | Directorio ausente                                                                                      |
| AC3 Limpiar barrel            | OK     | `molecules/index.js` no exporta Project ni FeaturedProject                                              |
| AC4 Build/test                | OK     | `npm run build` y `npm test` (813 tests, 81 suites) pasan                                               |
| AC5 No broken imports         | OK     | En `src/` solo aparece "FeaturedProject" en ProjectCard (`FeaturedProjectCard`), permitido por la story |

---

## CRITICAL ISSUES

_(Ninguno.)_

---

## HIGH ISSUES

_(Ninguno.)_

---

## MEDIUM ISSUES

### 1. [MEDIUM] Documentación en `docs/` desactualizada

- **Hecho:** Tras eliminar los componentes, tres documentos siguen referenciando **FeaturedProject** y/o **Project** como existentes:
  - **docs/component-inventory.md** (líneas 116 y 122): tabla de Molecules incluye "FeaturedProject | Highlighted project" y "Project | Project card".
  - **docs/architecture.md** (línea 110): "`/projects` | Projects | FeaturedProject list".
  - **docs/source-tree-analysis.md** (línea 111): árbol incluye "FeaturedProject/" bajo molecules.
- **Impacto:** Onboarding y auditorías pueden asumir que los componentes siguen en el codebase; la documentación no refleja el estado real.
- **Recomendación:** Actualizar los tres archivos: quitar FeaturedProject y Project de inventario y árbol, y ajustar la descripción de `/projects` (p. ej. "ProjectCard list").

### 2. [MEDIUM] Epic 15 y documentación de arquitectura sin actualizar

- **Hecho:** En `_bmad-output/planning-artifacts/epic-15-typescript-hardening.md` los AC de la story 15.2 siguen con `[ ]`. En `architecture.md` (planning) la tabla FR-to-structure usa "ui/organisms/FeaturedProject/" (ruta incorrecta: era molecules; además el componente ya no existe).
- **Impacto:** El epic no refleja que 15.2 está hecha; la arquitectura mantiene referencias a componentes eliminados.
- **Recomendación:** Marcar los AC de 15.2 en el epic como cumplidos y corregir/eliminar la referencia a FeaturedProject en la tabla de arquitectura.

---

## LOW ISSUES

### 3. [LOW] Ubicación del story file inconsistente

- **Hecho:** La story 15.2 está en `implementation-artifacts/15-2-delete-deprecated-components.md`, mientras que 15.1 está en `implementation-artifacts/stories/15-1-hooks-typescript-migration.md`. No hay subcarpeta `stories/` para 15.2.
- **Impacto:** Cualquier script o convención que espere todas las stories bajo `stories/` podría omitir 15.2.
- **Recomendación:** Mover 15.2 a `implementation-artifacts/stories/15-2-delete-deprecated-components.md` o documentar la convención (raíz vs `stories/`) en el proceso.

### 4. [LOW] Ruta incorrecta en architecture (planning)

- **Hecho:** `planning-artifacts/architecture.md` línea 521 mapea "Project Showcase (FR5-9)" a "ui/organisms/FeaturedProject/". El componente estaba en **molecules**, no organisms, y ya fue eliminado.
- **Recomendación:** Actualizar a la estructura actual (p. ej. `ui/organisms/ProjectCard/`).

### 5. [LOW] Conteo de molecules en component-inventory

- **Hecho:** El inventario indica "Molecules | 27". Tras eliminar 2 componentes, serían 25 a menos que el 27 ya estuviera desactualizado antes de esta story.
- **Recomendación:** Revisar el conteo y actualizarlo si procede (p. ej. a 25) para mantener coherencia con el filesystem.

---

## Conclusión

La implementación cumple los AC y el DoD: componentes eliminados, barrel y skeletons limpiados, build y tests pasan, commit con mensaje descriptivo. Los hallazgos son de **documentación y consistencia** (docs/, epic, ubicación del story), no de código faltante o incorrecto.

---
