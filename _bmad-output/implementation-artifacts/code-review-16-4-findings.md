# Code Review Findings – Story 16.4: Auth Button States

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)  
**Story:** 16-4-auth-button-states  
**Fecha:** 2026-02-07  
**Idioma:** Español

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `implementation-artifacts/16-4-auth-button-states.md` |
| **Discrepancias Git vs File List** | 2 |
| **Issues encontrados** | 1 High, 3 Medium, 4 Low |

---

## Git vs Story

- **File List (story):** 10 archivos (utils.ts, getInitials.test.ts, auth/index, AuthButton index, styles, AuthDropdown, AuthButton.test, AuthDropdown.test, AuthModal, AuthModal.test).
- **Git:** Modificados: sprint-status.yaml, auth/index.ts, AuthButton/index.tsx, styles.css, AuthModal.tsx, AuthModal.test.tsx. Sin trackear: 16-4 story, getInitials.test.ts, utils.ts, AuthDropdown.tsx, AuthButton/__tests__/ (AuthButton.test, AuthDropdown.test).
- **Discrepancias:**
  1. **sprint-status.yaml** está modificado en git pero no figura en la File List de la story (documentación incompleta).
  2. **Cambios sin commit:** toda la implementación de 16.4 está sin commit; no hay un commit que agrupe la story (DoD / transparencia).

---

## Validación de ACs

| AC | Estado | Notas |
|----|--------|--------|
| AC1 Logged out | OK | UserIcon, click abre modal, aria-label Open/Close panel. |
| AC2 Logged in initials | OK | getInitials, auth_button__initials, auth_button--active, AnimatePresence mode="wait" con reduced motion. |
| AC3 Dropdown | Parcial | Dropdown con user info + Sign Out; **bug**: click en el botón para cerrar reabre el dropdown (véase HIGH #1). |
| AC4 Logout | OK | Sign Out llama logout, onClose, vuelve a UserIcon. |
| AC5 A11y | Parcial | role="menu", menuitem, Escape, aria-expanded, aria-haspopup; **falta** id="authDropdown" para aria-controls (MEDIUM #2); focus en primer menuitem implementado pero no testeado. |
| AC6 Responsive / reduced motion | OK | min-height 44px, right:0 z-50, reduced motion en animaciones. |
| AC7 Tests | OK | 17 AuthButton + 8 AuthDropdown + 7 getInitials; 5 AuthModal actualizados. |

---

## CRITICAL ISSUES

*(Ninguno.)*

---

## HIGH ISSUES

### 1. Click en el botón para cerrar el dropdown lo reabre (event order)

**Comportamiento actual:** Con el dropdown abierto, si el usuario hace click en el **AuthButton** para cerrarlo:

1. **mousedown** se dispara primero → `AuthDropdown` tiene listener en `document` → el target no está dentro de `dropdownRef` (el botón está fuera del dropdown) → se llama `onClose()` → `setDropdownOpen(false)`.
2. **click** se dispara después → `handleClick` en AuthButton → `setDropdownOpen(prev => !prev)` → `prev` ya es `false` → se ejecuta `setDropdownOpen(true)` → el dropdown vuelve a abrirse.

**Resultado:** Un click en el botón con dropdown abierto cierra y luego reabre el menú (AC3: "Click en AuthButton (logged in) muestra un dropdown" / "Dropdown se cierra al click fuera").

**Recomendación:** Pasar una ref del botón trigger a `AuthDropdown` y en `handleClickOutside` no considerar "outside" si el target es el botón (o está contenido en él). Alternativa: cerrar en `click` en lugar de `mousedown` y excluir el trigger en el chequeo de "outside".

---

## MEDIUM ISSUES

### 2. aria-controls sin target: dropdown sin id

**AC5:** "aria-controls dinámicamente según estado". En `AuthButton` cuando el usuario está autenticado se usa `aria-controls="authDropdown"`, pero el componente `AuthDropdown` no tiene `id="authDropdown"` en el contenedor (el `motion.div` con `role="menu"`). La relación accesible queda rota y las AT no pueden asociar el botón al menú.

**Recomendación:** Añadir `id="authDropdown"` al elemento raíz del dropdown (p. ej. en el `motion.div` de `AuthDropdown.tsx`).

### 3. sprint-status.yaml no está en la File List

El archivo `_bmad-output/implementation-artifacts/sprint-status.yaml` aparece modificado en `git status` pero no está listado en la tabla File List de la story. Otras stories suelen documentar cambios en el sprint status.

**Recomendación:** Incluir en la File List: `sprint-status.yaml` | MODIFIED | 16-4 en review (o el cambio que corresponda).

### 4. Cambios sin commit

Ningún cambio de la implementación de 16.4 está commiteado; hay archivos modificados y sin trackear. El DoD suele exigir un commit que agrupe la implementación de la story.

**Recomendación:** Crear un commit que incluya los archivos de la File List (excluyendo solo artefactos de planificación si el equipo así lo define) y actualizar la story si aplica.

---

## LOW ISSUES

### 5. getInitials: email vacío no cubierto

Si `user.email` es `""`, la línea `return user.email[0].toUpperCase()` accede a `undefined` y lanza. Los tests cubren `name` vacío pero no `email` vacío.

**Recomendación:** Añadir test con `email: ""` (y/o defensa en código si el tipo lo permite) para evitar runtime error.

### 6. AC5 focus en primer menuitem sin test

La story pide "Focus: first menuitem focused on mount". El código hace `firstItem?.focus()` en el `useEffect` de `AuthDropdown`, pero no hay test que compruebe que el primer `role="menuitem"` tiene foco al montar.

**Recomendación:** Añadir un test que, tras renderizar `AuthDropdown`, verifique que `document.activeElement` sea el botón "Sign Out" (o el primer menuitem).

### 7. Redundancia sr-only + aria-label en AuthButton

El botón tiene tanto `aria-label={ariaLabel}` como `<span className="sr-only">{ariaLabel}</span>`. El mismo texto se expone dos veces a lectores de pantalla.

**Recomendación:** Dejar solo `aria-label` en el botón y eliminar el `sr-only` duplicado, o documentar si hay razón específica para mantener ambos.

### 8. AuthDropdown: focus en mount puede ser frágil en Strict Mode

El `useEffect` que hace `firstItem?.focus()` depende de que `dropdownRef.current` y el primer `[role="menuitem"]` existan en el mismo tick. En React 18 Strict Mode (doble montaje) el cleanup podría interferir. No hay fallo observado en tests; es un riesgo de mantenimiento.

**Recomendación:** Opcional: usar `requestAnimationFrame` o `setTimeout(..., 0)` para enfocar en el siguiente frame si se observan flakiness en tests o en entorno real.

---

## Verificación ejecutada

- `npm run typecheck`: OK  
- `npm test` (getInitials, AuthButton, AuthDropdown): 32 tests passed  
- Lectura de todos los archivos de la File List (solo código en `src/`)

---

## Siguiente paso sugerido

1. **Corregir HIGH #1:** Excluir el botón trigger del "click outside" (p. ej. ref del botón en AuthDropdown) para que un click en el botón no cierre-y-reabra el dropdown.  
2. **MEDIUM #2:** Añadir `id="authDropdown"` al dropdown.  
3. **MEDIUM #3–#4:** Actualizar File List con sprint-status y crear commit de la story.  
4. **LOW:** Opcional: test email vacío en getInitials, test de focus, quitar sr-only duplicado, y/o refuerzo del focus en mount.
