# Code Review Findings – Story 16.2: Auth Modal Component

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)  
**Story:** 16-2-auth-modal-component  
**Fecha:** 2026-02-07  
**Idioma:** Español

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `implementation-artifacts/16-2-auth-modal-component.md` |
| **Discrepancias Git vs File List** | 1 (cambios sin commit) |
| **Issues encontrados** | 0 High, 2 Medium, 3 Low |

---

## Git vs Story

- **File List:** 3 creados (tests), 3 modificados (AuthModal, OAuthButtons, Form/index), 2 eliminados (LoginForm, SignupForm).
- **Git:** Modificados (AuthModal, OAuthButtons, Form/index, sprint-status), eliminados (LoginForm, SignupForm), sin trackear (story file, __tests__/). No hay commit que agrupe la implementación.
- **Conclusión:** Discrepancia: cambios sin commit respecto al DoD "Commit creado".

---

## Validación de ACs

| AC | Estado | Notas |
|----|--------|--------|
| AC1 Close button bug | OK | AuthModal usa `closeAuthPanel` en líneas 106 y 160 |
| AC2 Barrel import | OK | OAuthButtons importa desde paths directos (@/atoms/icons/...) |
| AC3 Dead code | OK | LoginForm y SignupForm eliminados; Form/index solo exporta AuthForm y OAuthButtons; ningún import residual |
| AC4 Tests AuthModal | OK | 13 tests: render open/closed, authenticated/unauthenticated, a11y (role, aria), close button, backdrop, tab switch, logout |
| AC5 Tests AuthForm | OK | 8 tests según story |
| AC6 Tests OAuthButtons | OK | 4 tests: aria-labels, onOAuthClick |
| AC7 A11y / reduced motion | Parcial | role, aria-modal, aria-labelledby cubiertos en tests; **Escape key** y **focus restore** no tienen test explícito |

---

## CRITICAL ISSUES

*(Ninguno.)*

---

## HIGH ISSUES

*(Ninguno.)*

---

## MEDIUM ISSUES

### 1. [MEDIUM] Cambios sin commit

- **Hecho:** El DoD incluye "Commit creado con mensaje descriptivo". Hay archivos modificados, eliminados y sin trackear; no existe un commit que refleje la story.
- **Impacto:** Misma trazabilidad y riesgo que en otras stories.
- **Recomendación:** Hacer commit de todos los cambios de la story.

### 2. [MEDIUM] AC7: Escape key y focus restore sin test

- **Hecho:** AC7 exige "Escape key cierra el modal" y "Focus restaurado al elemento previo al cerrar". En `AuthModal.test.tsx` no hay ningún test que dispare `keydown` con Escape ni que compruebe `document.activeElement` antes/después de cerrar.
- **Impacto:** No se puede afirmar automáticamente que esas dos garantías de AC7 se cumplen; cualquier regresión quedaría sin detectar.
- **Recomendación:** Añadir al menos: (1) test que simule Escape y compruebe que se llama `closeAuthPanel`; (2) opcional: test que guarde el elemento enfocado antes de abrir, cierre el modal y compruebe que el foco vuelve a ese elemento.

---

## LOW ISSUES

### 3. [LOW] React warning en OAuthButtons.test: prop `colored`

- **Hecho:** Los mocks de iconos en OAuthButtons.test.tsx hacen `<svg {...props} />`. OAuthButtons pasa `colored` a los iconos; al pasarse al DOM, React muestra "Unknown prop `colored`".
- **Impacto:** Tests pasan pero el warning ensucia la salida y puede ocultar otros problemas.
- **Recomendación:** En el mock, no esparcir todas las props al SVG; omitir `colored` (y otras props no-DOM), p. ej. `const { colored, ...svgProps } = props; return <svg data-testid="..." {...svgProps} />`.

### 4. [LOW] Epic 16 sin actualizar

- **Hecho:** Los AC de la story 16.2 en el epic pueden seguir sin marcar.
- **Recomendación:** Marcar como cumplidos al cerrar la story.

### 5. [LOW] File List no menciona framer-motion-mock

- **Hecho:** Los Completion Notes dicen "Tests use centralized @/test-utils/framer-motion-mock". El File List no incluye ese archivo. Si se creó en esta story, debería listarse como Created; si ya existía, no es necesario.
- **Recomendación:** Si el mock se añadió o modificó en 16.2, incluirlo en el File List; si es preexistente, opcional aclararlo en las notas.

---

## Conclusión

Bugs y deuda cerrados: close button corregido, barrel sustituido por imports directos, LoginForm/SignupForm eliminados. Tests cubren render, interacción y parte de a11y. Faltan **tests para Escape y focus restore** (AC7) y **commit de los cambios**; el warning de `colored` en tests es menor.

---

**Próximos pasos (decisión del usuario):**

1. **Corregir automáticamente** – Crear commit; añadir tests de Escape (y opcional focus restore); filtrar `colored` en mocks de OAuthButtons.test.
2. **Crear ítems de acción** – Añadir "Review Follow-ups (AI)" en la story con cada issue.
3. **Ver detalles** – Profundizar en un issue concreto.
