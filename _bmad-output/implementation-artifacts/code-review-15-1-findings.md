# Code Review Findings – Story 15.1: Hooks TypeScript Migration

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)  
**Story:** 15-1-hooks-typescript-migration  
**Fecha:** 2026-02-07  
**Idioma:** Español (document_output_language)

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `stories/15-1-hooks-typescript-migration.md` |
| **Discrepancias Git vs File List** | 1 (cambios sin commit) |
| **Issues encontrados** | 2 High, 2 Medium, 3 Low |

---

## Git vs Story

- **File List de la story:** 7 archivos modificados (6 barrels → .ts + `tsconfig.json`), 6 eliminados (.js).
- **Git real:** `git status` muestra 6 archivos `D` (deleted .js), 6 `??` (untracked .ts), 1 `M` (tsconfig). Además `MM` sprint-status.yaml y `AM` story file (excluidos del review de código).
- **Discrepancia:** Los 6 `.ts` nuevos están **sin commit** (untracked). La story declara "Implementation complete" pero no hay commit que refleje la implementación. **Conteo: 1** (cambios sin commit / documentación de estado del repo).

---

## CRITICAL ISSUES

*(Ninguno: no hay tareas [x] no hechas ni AC no implementados en el código de la story.)*

---

## HIGH ISSUES

### 1. [HIGH] AC7 incumplido: `npm run typecheck` no pasa

- **AC7:** "npm run typecheck pasa sin errores nuevos".
- **Hecho:** `npm run typecheck` falla con **34 errores** en el repo:
  - `e2e/home-hero-blade.spec.ts`, `e2e/home-secondary-blade.spec.ts` (offsetWidth/offsetHeight en SVGElement).
  - `src/hooks/ui/__tests__/useScrollAppearance.test.tsx`, `useTouchState.test.tsx` (tipos en tests).
  - `src/ui/atoms/...`, `src/ui/molecules/...` (props faltantes o tipos en tests).
- **Evidencia:** Salida de `npm run typecheck` (exit code 2).
- **Impacto:** La Definition of Done y AC7 afirman que typecheck pasa; en el estado actual no es cierto. Si los errores son pre-existentes, la story no debería marcar typecheck como cumplido; si son regresión, debe corregirse.
- **Recomendación:** O bien (a) corregir los 34 errores y dejar typecheck en verde, o (b) actualizar la story/DoD para no marcar typecheck como criterio de cierre hasta que el proyecto lo cumpla de forma estable.

### 2. [HIGH] Criterio de cierre de la story no verificable

- **DoD:** "npm run typecheck pasa".
- **Hecho:** En el árbol actual, typecheck falla. No hay forma de afirmar que "typecheck pasa" sin ejecutarlo.
- **Recomendación:** No marcar la story como "done" en sprint/status hasta que `npm run typecheck` pase en CI o local de forma explícita.

---

## MEDIUM ISSUES

### 3. [MEDIUM] Cambios de implementación sin commit

- **Hecho:** Los 6 archivos `.ts` en `src/hooks/` están **untracked**; los 6 `.js` aparecen como deleted. La implementación está "completa" en la story pero no existe un commit que la refleje.
- **Riesgo:** Pérdida de trabajo en un reset, ramas o máquinas distintas; el File List no refleja el estado del repositorio (commits).
- **Recomendación:** Hacer commit de la migración (add + commit) y opcionalmente actualizar la story/File List para indicar que los cambios están commiteados.

### 4. [MEDIUM] File List no distingue "modified/created" vs "deleted"

- **Hecho:** La story lista "Modified" los 6 barrels como "(was index.js)". En git son: 6 deletes + 6 archivos nuevos (untracked). Para quien lee el File List no queda claro que son reemplazos (delete + add), no solo "modificación" de archivo.
- **Recomendación:** Mantener la lista de "Deleted" y "Modified/Added" como está, pero asegurarse de que en el Changelog o notas quede que los .ts son los reemplazos de los .js (ya está implícito; opcional aclarar "Added" para los .ts).

---

## LOW ISSUES

### 5. [LOW] `tsconfig.json` en una sola línea

- **Hecho:** Todo `tsconfig.json` está minificado en una línea, lo que dificulta revisar el diff del cambio `@/hooks` → `index.ts`.
- **Recomendación:** Formatear con saltos de línea (o formateador del proyecto) para futuros cambios; no bloquea la story.

### 6. [LOW] Documentación inconsistente en barrels

- **Hecho:** Solo `src/hooks/domains/index.ts` tiene JSDoc (bloque con descripción y ejemplo). El resto de barrels (`index.ts`, `store/index.ts`, `ui/index.ts`) no tienen comentarios.
- **Recomendación:** Añadir comentarios breves en los otros barrels o documentar en CLAUDE.md el patrón (barrels sin comentario vs domains con comentario).

### 7. [LOW] Verificación explícita de "0 index.js en src/hooks"

- **Hecho:** DoD: "0 archivos index.js en src/hooks/". Git muestra los 6 .js como deleted; no hay `index.js` en el árbol actual. Cumplido.
- **Nota:** Si los deletes no están commiteados, un `git checkout -- .` podría restaurar los .js. La DoD se cumple en el working tree actual; para cumplimiento persistente, hacer commit de los deletes.

---

## Validación de ACs (resumen)

| AC | Estado | Notas |
|----|--------|--------|
| AC1 hooks/index.ts | OK | Exports store, ui, domains |
| AC2 store/index.ts | OK | useAppDispatch, useAppSelector |
| AC3 AppSelector | OK | TypedUseSelectorHook<RootState>, RootState desde @/state/stores/ReduxStore |
| AC4 AppDispatch | OK | useDispatch<AppDispatch>(), AppDispatch desde ReduxStore |
| AC5 ui/index.ts | OK | useReducedMotion, useScrollAppearance, useTouchState, useTransition |
| AC6 domains/index.ts | OK | 11 dominios re-exportados |
| AC7 build/typecheck/test | Parcial | Build OK, test 818 OK, **typecheck FALLA** (34 errores) |

---

## Validación de tareas [x]

- Todas las tareas marcadas [x] tienen evidencia en código (archivos migrados, tipos correctos, tsconfig actualizado).
- Ninguna tarea [x] está "no hecha" en el código de la story.

---

## Próximos pasos (decisión del usuario)

Según el workflow de code review:

1. **Corregir automáticamente** – Aplicar correcciones a HIGH y MEDIUM (typecheck, commits, documentación).
2. **Crear ítems de acción** – Añadir subsección "Review Follow-ups (AI)" en Tasks/Subtasks con cada issue como `- [ ] [AI-Review][Severity] Descripción [file:line]`.
3. **Ver detalles** – Profundizar en un issue concreto y luego volver a la decisión de corrección/acciones.

---

**Fin del informe.**
