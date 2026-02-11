# Code Review: 18-1-lazymotion-feature-splitting

**Story:** 18-1-lazymotion-feature-splitting.md  
**Git vs Story Discrepancies:** 0 (File List coherente con cambios en `src/`)  
**Issues Found:** 1 High, 3 Medium, 2 Low  

---

## CRITICAL / HIGH

### 1. [HIGH] AC1 no cumplido — reducción de bundle

- **AC1:** "el chunk de framer-motion se reduce en al menos 12 KiB gzip".
- **Hecho:** Build actual: chunk 2117 = **31.9 kB** gzip (shared). Línea de base del epic: 33.5 KiB gzip → reducción ~**1.6 KiB gzip**, no 12 KiB.
- **Evidencia:** Completion note en la story lo indica: "Chunk reduction is ~1.6 KiB gzip... This is less than the 12 KiB target".
- **Impacto:** Criterio de aceptación incumplido; la story no puede considerarse "done" hasta cerrar esta brecha o actualizar/aceptar el AC formalmente.

---

## MEDIUM

### 2. [MEDIUM] Task 4 marcada [x] con subtarea pendiente

- **Dónde:** Tasks / Subtasks → Task 4 (Tests y verificación).
- **Problema:** Task 4 está marcada como [x] pero el ítem "Verificación visual pendiente (requiere dev server manual)" sigue en [ ].
- **Impacto:** Se da por cerrada la verificación sin completar el checklist visual en 3 viewports.

### 3. [MEDIUM] AC3 (reduced-motion) sin evidencia de verificación

- **AC3:** Animaciones respetan `prefers-reduced-motion: reduce` sin regresión.
- **Hecho:** `useReducedMotion` sigue en uso (`src/hooks/ui/useReducedMotion.ts`) y no se tocó; no hay test ni paso de revisión que documente la comprobación con reduced-motion activo.
- **Impacto:** Riesgo de regresión no detectada; no hay prueba explícita del AC3.

### 4. [MEDIUM] File List — Created incompleto

- **Problema:** En "Created" solo figura `src/providers/LazyMotionProvider/index.tsx`. Los archivos nuevos `src/ui/overlays/Floating/index.tsx` y `src/ui/overlays/FloatingMobile/index.tsx` solo aparecen como destino de "Migrated JSX → TSX".
- **Impacto:** Listado de archivos creados no del todo explícito para auditoría/onboarding.

---

## LOW

### 5. [LOW] Inconsistencia de Status en la story

- **Dónde:** Cabecera "Status: review" vs sección "Story completion status" que dice "Status: ready-for-dev".
- **Impacto:** Confusión al leer el documento; un único valor de status evita errores.

### 6. [LOW] Descripción de test desactualizada

- **Archivo:** `src/ui/atoms/texts/AnimatedTitle/__tests__/MotionTitle.test.tsx` línea 238.
- **Texto actual:** "renders each word as a separate motion.span".
- **Sugerencia:** Cambiar a "m.span" para alinear con el refactor (solo documentación del test).

---

## Resumen

| Severidad | Cantidad | Acción recomendada |
|-----------|----------|---------------------|
| HIGH      | 1        | Cerrar AC1 (objetivo 12 KiB) o documentar aceptación de excepción |
| MEDIUM    | 3        | Completar verificación visual, documentar AC3, ampliar File List Created |
| LOW       | 2        | Unificar Status en la story, actualizar descripción del test |

**Recomendación:** Dejar la story en **in-progress** hasta resolver el HIGH (AC1) y, si se desea, los MEDIUM. Los LOW pueden aplicarse ya en el documento y en el test.
