---
id: 15-4-[code-review]
aliases: []
tags: []
---

# Code Review Findings – Story 15.4: Critical Atoms TypeScript Migration

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)
**Story:** 15-4-critical-atoms-typescript-migration
**Fecha:** 2026-02-07
**Idioma:** Español

---

## Resumen

| Métrica                            | Valor                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------- |
| **Story file**                     | `implementation-artifacts/15-4-critical-atoms-typescript-migration.md` |
| **Discrepancias Git vs File List** | 0 (working tree limpio)                                                |
| **Issues encontrados**             | 0 High, 2 Medium, 4 Low                                                |

---

## Git vs Story

- **File List:** 6 botones renombrados a .tsx, 2 barrels a .ts, tsconfig actualizado. No se listan archivos "Deleted" (.jsx/.js).
- **Git:** Sin cambios sin commit (working tree limpio).
- **Conclusión:** No hay discrepancia entre story y estado del repo; la documentación del File List podría ser más explícita sobre archivos eliminados.

---

## Validación de ACs

| AC                   | Estado | Notas                                                                                                      |
| -------------------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| AC1 MenuButton       | OK     | index.tsx, MenuTickProps, MenuIconProps; useMenuPanel ya tipado en hook                                    |
| AC2 Resto de botones | OK     | ArrowButton, HireMeButton, HireMeHeaderButton, NavigationItemButton, SkillSelectorButton en .tsx con Props |
| AC3 Barrels          | OK     | buttons/index.ts, atoms/index.ts; re-exports correctos                                                     |
| AC4 Build/typecheck  | OK     | Build pasa; typecheck no añade errores en atoms (nota de la story sobre 34+ preexistentes)                 |
| AC4 Tests            | OK     | 813 tests pasan                                                                                            |

---

## CRITICAL ISSUES

_(Ninguno.)_

---

## HIGH ISSUES

_(Ninguno.)_

---

## MEDIUM ISSUES

### 1. [MEDIUM] File List no documenta archivos eliminados

- **Hecho:** La story solo lista "Modified (renamed from .jsx/.js)" pero no incluye una sección "Deleted" con los 6 index.jsx y los 2 index.js que dejaron de existir. En migraciones rename/delete, la trazabilidad mejora si se documentan ambos lados.
- **Impacto:** Quien revise el historial o la story no ve explícitamente qué archivos se eliminaron; en otros repos sí se suele listar "Deleted: ...".
- **Recomendación:** Añadir a File List: "#### Deleted: src/ui/atoms/buttons/MenuButton/index.jsx, ... (y resto de .jsx/.js reemplazados)".

### 2. [MEDIUM] Epic 15 y story desalineados en lista de botones

- **Hecho:** En `planning-artifacts/epic-15-typescript-hardening.md`, Story 15.4 dice: "Migrar buttons críticos: MenuButton, **AuthButton, ChatButton**". La story 15.4 migró MenuButton, ArrowButton, HireMeButton, HireMeHeaderButton, NavigationItemButton, SkillSelectorButton. AuthButton y ChatButton ya estaban en TypeScript antes de esta story.
- **Impacto:** El epic queda desactualizado y puede inducir a error en planificación o en siguientes code reviews.
- **Recomendación:** Actualizar el epic 15 para que los AC de 15.4 reflejen los 6 botones realmente migrados (o "resto de buttons en JSX") en lugar de AuthButton/ChatButton.

---

## LOW ISSUES

### 3. [LOW] Magic number `useProfile(1)` en dos componentes

- **Hecho:** `HireMeButton` y `HireMeHeaderButton` llaman a `useProfile(1)` con el id literal `1`. No hay constante ni configuración que documente ese valor.
- **Impacto:** Bajo; si el "profile principal" pasa a ser otro id o se obtiene por config, hay que tocar dos sitios.
- **Recomendación:** Extraer a constante (p. ej. `const MAIN_PROFILE_ID = 1` en un módulo compartido o en el mismo archivo) o obtener el id desde config/env.

### 4. [LOW] Skeletons siguen en .jsx en carpetas migradas

- **Hecho:** `ArrowButton/skeleton.jsx` y `NavigationItemButton/skeleton.jsx` siguen en JSX. La story solo exigía migrar los index de los botones y los barrels, no los skeletons.
- **Impacto:** Mezcla de extensiones (.tsx + .jsx) en la misma carpeta; consistencia futura.
- **Recomendación:** Dejar como deuda opcional o planear migración de skeletons en una story posterior.

### 5. [LOW] ArrowButton sin directiva "use client"

- **Hecho:** `MenuButton`, `HireMeButton`, `HireMeHeaderButton` tienen `"use client"`; `ArrowButton` no. ArrowButton solo usa `Link` e `ArrowIcon` (sin hooks). En App Router puede ser correcto si se usa solo bajo client boundaries.
- **Impacto:** Bajo; si ArrowButton se usara en un Server Component como hijo interactivo, podría requerir "use client". Actualmente no hay indicio de fallo.
- **Recomendación:** Dejar como está; si en el futuro se usa en contexto server-only, añadir "use client" o documentar la decisión.

### 6. [LOW] SkillSelectorButton y manipulación directa del DOM

- **Hecho:** El componente ya incluye un TODO que documenta deuda técnica: uso de `document.querySelectorAll` y manipulación de clases en lugar de estado/contexto compartido.
- **Impacto:** La story no exigía refactor; la deuda ya está documentada.
- **Recomendación:** Mantener el TODO; considerar story futura para sustituir por estado/contexto si se prioriza.

---

## Conclusión

La migración de los 6 botones y los 2 barrels a TypeScript está bien ejecutada: Props definidas, barrels y tsconfig coherentes, build y tests pasan, typecheck sin errores nuevos en el scope de la story. Los hallazgos son de **documentación** (File List, epic) y **detalles de calidad** (magic number, skeletons .jsx, "use client", TODO existente).

---

**Próximos pasos (decisión del usuario):**

1. **Corregir automáticamente** – Actualizar story (File List con Deleted) y epic 15 (AC de 15.4); opcionalmente extraer constante para profile id.
2. **Crear ítems de acción** – Añadir "Review Follow-ups (AI)" en la story con cada issue.
3. **Ver detalles** – Profundizar en un issue concreto.
