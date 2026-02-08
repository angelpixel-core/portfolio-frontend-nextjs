# Code Review Findings – Story 15.6: E2E Critical Flows Definition

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)  
**Story:** 15-6-e2e-critical-flows-definition  
**Fecha:** 2026-02-07  
**Idioma:** Español

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `implementation-artifacts/15-6-e2e-critical-flows-definition.md` |
| **Discrepancias Git vs File List** | 0 (working tree limpio) |
| **Issues encontrados** | 0 High, 2 Medium, 3 Low |

---

## Git vs Story

- **File List:** CLAUDE.md (líneas 154-169), sprint-status.yaml, story file. Working tree limpio.
- **Conclusión:** No hay discrepancia. El único cambio en el codebase de la aplicación es **CLAUDE.md**.

---

## Validación de ACs

| AC | Estado | Notas |
|----|--------|--------|
| AC1 Sección en CLAUDE.md | OK | "Critical E2E Flows" en líneas 154-169, después de "Testing Conventions" |
| AC2 Navegación | OK | Menu mobile y Desktop con referencias a menu-autoclose.spec.ts y navigation.spec.ts |
| AC3 Overlays | Parcial | Menu y social links cubiertos; **chat panel** no aparece en la tabla ni hay E2E de chat; Auth modal (placeholder) no listado |
| AC4 UI persistente | OK | Theme y Header con referencias correctas |
| AC5 Verificar coverage | OK | menu-autoclose y theme verificados; E2E pass explícitamente fuera de scope (109/285 pre-existentes) |

**Archivos E2E referenciados:** Todos existen (menu-autoclose.spec.ts, navigation.spec.ts, theme.spec.ts, page-transitions.spec.ts, header-visibility.spec.ts). Las descripciones coinciden con el contenido de los specs (p. ej. theme.spec.ts tiene "theme persists after page reload").

---

## CRITICAL ISSUES

*(Ninguno.)*

---

## HIGH ISSUES

*(Ninguno.)*

---

## MEDIUM ISSUES

### 1. [MEDIUM] AC3: Chat panel sin reflejo en Critical E2E Flows

- **Hecho:** AC3 exige "Apertura/cierre de chat panel". La tabla de CLAUDE.md tiene la fila "Overlay open/close" con descripción "Menu/social links open and close correctly" y archivo `menu-autoclose.spec.ts`. No hay E2E que cubra el chat panel (grep en e2e/ no encuentra referencias a chat) y la tabla no menciona el chat.
- **Impacto:** Un flujo crítico definido en la story (chat panel) queda sin documentar como crítico y sin test E2E referenciado; riesgo de regresiones no detectadas.
- **Recomendación:** Añadir una fila explícita, por ejemplo: "Chat panel open/close | TBD (no E2E aún) | Cuando exista spec, referenciar aquí", o documentar en la story/CLAUDE que el chat panel queda fuera del alcance actual de critical flows hasta tener E2E.

### 2. [MEDIUM] AC3: Auth modal (placeholder) no aparece en la tabla

- **Hecho:** AC3 incluye "Auth modal (futuro - placeholder)". La sección Critical E2E Flows no tiene ninguna fila para Auth modal.
- **Impacto:** Cuando se implemente el modal de auth, no hay recordatorio en CLAUDE de que ese flujo debe tener E2E.
- **Recomendación:** Añadir fila placeholder: "Auth modal open/close | TBD | When auth E2E exists (Epic 16)".

---

## LOW ISSUES

### 3. [LOW] File List incluye artefactos de proceso

- **Hecho:** El File List lista cambios en `sprint-status.yaml` y en el propio story file. El único cambio en el código de la aplicación es CLAUDE.md.
- **Impacto:** Para un revisor de código, lo relevante es CLAUDE.md; los otros son seguimiento de proceso.
- **Recomendación:** Opcional: en File List distinguir "Application code: CLAUDE.md" y "Process: sprint-status, story file", o documentar que la story solo modifica CLAUDE.md en el repo de aplicación.

### 4. [LOW] Epic 15 sin actualizar

- **Hecho:** En `planning-artifacts/epic-15-typescript-hardening.md` los AC de la story 15.6 siguen con `[ ]`.
- **Recomendación:** Marcar como cumplidos cuando la story se cierre.

### 5. [LOW] DoD con ítem no cumplido sin enlace a story de remediación

- **Hecho:** DoD tiene "[ ] E2E tests pasan" con nota "Pre-existing failures - tracked for future story". No hay referencia a una story concreta o ticket que recoja esa remediación.
- **Recomendación:** Añadir en la story un enlace o ID a la story/ticket que vaya a abordar los 109/285 fallos E2E (o crear uno y referenciarlo).

---

## Conclusión

La sección Critical E2E Flows está bien ubicada en CLAUDE.md, las referencias a los specs son correctas y los archivos existen. Los hallazgos son: **dos flujos de AC3 (chat panel y Auth modal) no quedan reflejados en la tabla** (MEDIUM), y detalles de documentación/proceso (File List, epic, DoD).

---

**Próximos pasos (decisión del usuario):**

1. **Corregir automáticamente** – Añadir filas en CLAUDE.md para Chat panel y Auth modal (TBD); opcional epic y referencia a story de E2E.
2. **Crear ítems de acción** – Añadir "Review Follow-ups (AI)" en la story con cada issue.
3. **Ver detalles** – Profundizar en un issue concreto.
