# Code Review: 18-1-lazymotion-feature-splitting

**Story:** 18-1-lazymotion-feature-splitting.md
**Git vs Story Discrepancies:** 0 (File List coherente con cambios en `src/`)
**Reviews:** 2 (initial + 2nd pass)
**Issues Found:** 1 High, 3 Medium, 3 Low (1 HIGH open, 2 MEDIUM open, 1 LOW open)

---

## Review History

| Review | Date | Agent | Issues |
|--------|------|-------|--------|
| 1st | 2026-02-11 | Claude Opus 4.6 | 1H, 3M, 2L |
| 2nd | 2026-02-11 | Claude Opus 4.6 | +0H, +0M, +1L; resolved 1M, 2L |

---

## CRITICAL / HIGH

### 1. [HIGH] AC1 no cumplido — reducción de bundle — **OPEN**

- **AC1:** "el chunk de framer-motion se reduce en al menos 12 KiB gzip".
- **Hecho:** Build actual: chunk 2117 = **31.9 kB** gzip (shared). Línea de base del epic: 33.5 KiB gzip → reducción ~**1.6 KiB gzip**, no 12 KiB.
- **Evidencia:** Completion note en la story lo indica: "Chunk reduction is ~1.6 KiB gzip... This is less than the 12 KiB target".
- **Root cause:** `optimizePackageImports: ["framer-motion"]` en next.config.js ya realiza tree-shaking equivalente al que LazyMotion proporciona. El beneficio incremental es marginal (~1.6 KiB).
- **Impacto:** Criterio de aceptación incumplido; la story no puede considerarse "done" hasta cerrar esta brecha o actualizar/aceptar el AC formalmente con PO.
- **Opciones:**
  1. Documentar excepción: AC1 se reescribe reconociendo que `optimizePackageImports` ya cubre la mayor parte. Story se acepta con AC1 ajustado.
  2. Investigar approaches alternativos (improbable que rindan ≥12 KiB dado el tree-shaking existente).

---

## MEDIUM

### 2. [MEDIUM] Task 4 marcada [x] con subtarea pendiente — **OPEN**

- **Dónde:** Tasks / Subtasks → Task 4 (Tests y verificación).
- **Problema:** Task 4 está marcada como [x] pero el ítem "Verificación visual pendiente (requiere dev server manual)" sigue en [ ].
- **Impacto:** Se da por cerrada la verificación sin completar el checklist visual en 3 viewports.
- **Requiere:** Dev server manual (`npm run dev`) + inspección en mobile/tablet/desktop.

### 3. [MEDIUM] AC3 (reduced-motion) sin evidencia de verificación — **OPEN**

- **AC3:** Animaciones respetan `prefers-reduced-motion: reduce` sin regresión.
- **Hecho:** `useReducedMotion` sigue en uso (`src/hooks/ui/useReducedMotion.ts`) y no se tocó; no hay test ni paso de revisión que documente la comprobación con reduced-motion activo.
- **Impacto:** Riesgo de regresión no detectada; no hay prueba explícita del AC3.
- **Requiere:** Verificación manual con prefers-reduced-motion activo en OS, o test automatizado.

### 4. ~~[MEDIUM] File List — Created incompleto~~ — **RESOLVED** (2nd review)

- **Fix:** Los archivos `src/ui/overlays/Floating/index.tsx` y `src/ui/overlays/FloatingMobile/index.tsx` ahora aparecen en la sección "Created" del File List de la story.

---

## LOW

### 5. ~~[LOW] Inconsistencia de Status en la story~~ — **RESOLVED** (2nd review)

- **Fix:** Status unificado a "in-progress" en cabecera y en Story completion status.

### 6. ~~[LOW] Descripción de test desactualizada~~ — **RESOLVED** (2nd review)

- **Fix:** `MotionTitle.test.tsx` L238 actualizado de "motion.span" a "m.span".

### 7. [LOW] `RootProvider` sigue en `.jsx` — **OPEN** (2nd review, new)

- **Archivo:** `src/providers/RootProvider/index.jsx`
- **Problema:** No fue migrado a `.tsx` en esta story. Inconsistente con la convención del proyecto ("estamos usando ts y queremos evitar generar js").
- **Contexto:** No estaba en scope de Story 18.1 (la story solo listaba overlays para migración TS). Es deuda técnica pre-existente.
- **Impacto:** Bajo. Candidato para future debt cleanup, no bloquea esta story.

---

## Verificación de Implementación (2nd review)

| Check | Result |
|-------|--------|
| 19/19 files refactored (motion→m) | PASS |
| LazyMotionProvider: "use client", strict, domAnimation | PASS |
| RootProvider: LazyMotionProvider wraps TransitionProvider | PASS |
| Old overlay .jsx files deleted | PASS |
| Overlays .tsx: interfaces, typed refs, typed handlers | PASS |
| Centralized mock: exports m, LazyMotion, domAnimation | PASS |
| 2 inline mocks: export m alongside motion | PASS |
| Zero remaining `import { motion }` in source files | PASS |
| Build passes (npm run build) | PASS |
| 963/963 tests pass (npm test) | PASS |
| Git vs Story File List discrepancies | 0 |

---

## Resumen Consolidado

| Severidad | Total | Abiertos | Cerrados |
|-----------|-------|----------|----------|
| HIGH      | 1     | 1        | 0        |
| MEDIUM    | 3     | 2        | 1        |
| LOW       | 3     | 1        | 2        |

**Recomendación:** Story permanece en **in-progress** hasta que PO resuelva el HIGH (AC1 — aceptar excepción o ajustar AC). Los 2 MEDIUM requieren dev server manual. El LOW nuevo (RootProvider .jsx) es deuda pre-existente fuera de scope.
