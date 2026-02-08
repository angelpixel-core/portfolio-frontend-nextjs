# Code Review Findings – Story 15.5: Logging Consolidation

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)  
**Story:** 15-5-logging-consolidation  
**Fecha:** 2026-02-07  
**Idioma:** Español

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `implementation-artifacts/15-5-logging-consolidation.md` |
| **Discrepancias Git vs File List** | 0 (working tree limpio) |
| **Issues encontrados** | 0 High, 1 Medium, 3 Low |

---

## Git vs Story

- **File List:** 11 archivos modificados + 3 tests, 1 añadido (logger.ts), 1 eliminado (logger.js). Lista coherente y completa.
- **Git:** Sin cambios sin commit.
- **Conclusión:** No hay discrepancia.

---

## Validación de ACs

| AC | Estado | Notas |
|----|--------|--------|
| AC1 Logger a TypeScript | OK | logger.ts existe, LogLevel, LEVELS, API compatible |
| AC2 lib/ | OK | utils.js y actions.js usan logger |
| AC3 TransitionProvider | OK | TransitionContext.ts e index.tsx usan logger (4 reemplazos) |
| AC4 Domain mocks | OK | customer, navigation-item, technology mock.ts usan logger.warn |
| AC5 UI | OK | SectionErrorBoundary, telemetry.js, ChatBox, EmailLink usan logger |
| AC6 Build/typecheck/test | OK | Build pasa; typecheck sin errores en archivos de la story; 813 tests pasan |

**Verificación grep:** Solo aparecen `console.log/warn/error` dentro de `src/lib/logger.ts` (uso legítimo). Código de producción sin console directos.

---

## CRITICAL ISSUES

*(Ninguno.)*

---

## HIGH ISSUES

*(Ninguno.)*

---

## MEDIUM ISSUES

### 1. [MEDIUM] Pérdida de información al registrar errores en utils.js

- **Hecho:** En `src/lib/utils.js`, dentro de `tryQuery`, se llama `logger.error("Database", "Query failed", error.message)`. El tercer parámetro es un **string** (solo el mensaje), no el objeto `error`.
- **Impacto:** Se pierde el stack trace y el tipo real del error en logs, lo que dificulta el debugging en producción.
- **Recomendación:** Pasar el objeto completo: `logger.error("Database", "Query failed", error)` (o al menos `logger.error("Database", "Query failed", { message: error?.message, stack: error?.stack })` si se quiere evitar serializar el objeto entero).

---

## LOW ISSUES

### 2. [LOW] Documentación sigue citando "logger.js"

- **Hecho:** En la story y en el DoD se menciona "excepto logger.js" o "logger.js" como archivo que puede usar console. El archivo actual es **logger.ts**.
- **Impacto:** Leve; la verificación con grep ya usa `grep -v logger.ts`. Solo hay inconsistencia en el texto de la story.
- **Recomendación:** Sustituir "logger.js" por "logger.ts" en Context, DoD, "Files NOT to modify" y Verification Command.

### 3. [LOW] Epic 15 sin actualizar

- **Hecho:** En `planning-artifacts/epic-15-typescript-hardening.md` los AC de la story 15.5 siguen con `[ ]`.
- **Recomendación:** Marcar como cumplidos cuando la story se cierre.

### 4. [LOW] Criterio limitado a console.log/warn/error

- **Hecho:** La story prohíbe solo `console.log`, `console.warn` y `console.error`. `console.info` no está explícitamente prohibido. El logger usa `console.info` para el nivel INFO.
- **Impacto:** Bajo; si alguien añade `console.info` en producción, no quedaría cubierto por el criterio actual.
- **Recomendación:** Opcional: aclarar en la story o en el DoD que "console directos" incluye también `console.info` (o documentar que solo log/warn/error están prohibidos por decisión consciente).

---

## Conclusión

La consolidación de logging está bien implementada: logger migrado a TypeScript, console reemplazados por logger en los archivos indicados, grep confirma 0 console directos en código de producción (salvo logger.ts), build y tests pasan. El único hallazgo de código es **pasar el error completo en utils.js**; el resto son documentación y criterio de verificación.

---

**Próximos pasos (decisión del usuario):**

1. **Corregir automáticamente** – Cambiar utils.js para pasar `error` en lugar de `error.message`; actualizar referencias "logger.js" → "logger.ts" en la story; opcional epic.
2. **Crear ítems de acción** – Añadir "Review Follow-ups (AI)" en la story con cada issue.
3. **Ver detalles** – Profundizar en un issue concreto.
