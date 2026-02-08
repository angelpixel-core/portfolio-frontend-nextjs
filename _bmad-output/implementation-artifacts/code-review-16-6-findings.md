# Code Review Findings – Story 16.6: Logout Flow

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)  
**Story:** 16-6-logout-flow  
**Fecha:** 2026-02-07  
**Idioma:** Español

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `implementation-artifacts/16-6-logout-flow.md` |
| **Discrepancias Git vs File List** | 1 |
| **Issues encontrados** | 0 High, 2 Medium, 4 Low |

---

## Git vs Story

- **File List (story):** 9 archivos (oauth.ts, auth/index, oauth.test.ts, AuthDropdown.tsx, AuthDropdown.test, AuthButton.test, Icon.test, ProjectCard.test, sprint-status).
- **Git:** Modificados: story, sprint-status, auth/index, oauth.ts, AuthDropdown, AuthDropdown.test, AuthButton.test, Icon.test, ProjectCard.test. Sin trackear: oauth.test.ts.
- **Discrepancia:** Implementación sin commit; el resto de archivos de la File List coincide (modificados o untracked).

---

## Validación de ACs

| AC | Estado | Notas |
|----|--------|--------|
| AC1 Sign Out button | OK | Click inicia flujo, botón disabled durante logout, dropdown se cierra al éxito, flujo click → performLogout → logout → close. |
| AC2 Async service call | Parcial | performLogout() en oauth.ts llama mockLogout(); success → logout; error → mensaje en dropdown. **Falta:** si performLogout() lanza excepción, el botón queda disabled (véase MEDIUM #1). |
| AC3 Session cleanup | OK | logout() limpia Redux; AuthProvider + clearSession y cross-tab ya de 16.5. |
| AC4 UI transitions | OK | Initials → UserIcon post-logout; AnimatePresence; error mostrado si falla. |
| AC5 Tests | OK | oauth.test 2 tests; AuthDropdown async tests (disabled, success, error, clear error); AuthButton con act async; sin regresiones. |

---

## CRITICAL ISSUES

*(Ninguno.)*

---

## HIGH ISSUES

*(Ninguno.)*

---

## MEDIUM ISSUES

### 1. handleSignOut: si performLogout() lanza, el botón queda deshabilitado

**Hecho:** En `AuthDropdown.tsx`, `handleSignOut` hace `setIsLoggingOut(true)`, luego `await performLogout()`, y solo al final (en las ramas success/error) hace `setIsLoggingOut(false)`. Si `performLogout()` **lanza** (p. ej. fallo de red, timeout), nunca se ejecuta `setIsLoggingOut(false)`, el botón queda en "Signing out…" y deshabilitado de forma permanente hasta cerrar el dropdown.

**Recomendación:** Envolver la llamada en `try/catch/finally`: en `finally` siempre ejecutar `setIsLoggingOut(false)`; en `catch` opcionalmente `setLogoutError("An unexpected error occurred")` (o mensaje genérico) para alinear con el manejo de errores de OAuth.

### 2. Sin test para el camino de excepción en performLogout

**Hecho:** Los tests cubren `success: true` y `success: false` retornados por `performLogout`, pero no el caso en que `performLogout()` **lance** (p. ej. `mockPerformLogout.mockRejectedValue(new Error("Network error"))`). No se comprueba que el botón se rehabilita ni que se muestra un mensaje de error.

**Recomendación:** Añadir en AuthDropdown.test un test que haga que `performLogout` rechace, espere a que se resuelva, y compruebe que el botón vuelve a estar habilitado y (si se implementa) que se muestra un mensaje de error.

---

## LOW ISSUES

### 3. Clase .auth-dropdown__error sin estilos

**Hecho:** Se renderiza `<div className="auth-dropdown__error" role="alert">` cuando hay `logoutError`, pero en `AuthButton/styles.css` no existe ninguna regla para `.auth-dropdown__error`. El texto se muestra por herencia; no hay color, margen ni tamaño específicos para el mensaje de error.

**Recomendación:** Añadir en `styles.css` una regla para `.auth-dropdown__error` (p. ej. texto de error, padding, alineación) para que el error sea claramente visible y consistente con el resto del dropdown.

### 4. Cambios sin commit

Ningún cambio de la implementación de 16.6 está commiteado (archivos modificados y oauth.test.ts sin trackear).

**Recomendación:** Crear un commit que agrupe los archivos de la File List de la story.

### 5. performLogout no usa oauthService

**Hecho:** La story aclara que logout no forma parte del `OAuthService` y que `performLogout()` es una función standalone. En el código, `performLogout()` llama directamente a `mockLogout()`. Está correcto según la story; solo se señala que, si en el futuro el logout real pasara por un “auth service” único (p. ej. `authService.logout()`), habría que centralizarlo aquí para no acoplar a mock.

**Recomendación:** Ninguna obligatoria; mantener el patrón actual y documentar en comentario o en la story que, con backend real, `performLogout` podría delegar en un servicio de auth.

### 6. Duplicación de lógica de mensaje de error por defecto

**Hecho:** En error path se usa `result.error ?? "An unexpected error occurred"`. El mismo texto aparece en AuthModal para OAuth. Si se estandarizan mensajes de error de auth, convendría una constante compartida (p. ej. en `@/services/auth` o en un módulo de mensajes).

**Recomendación:** Opcional: extraer a constante `DEFAULT_AUTH_ERROR_MESSAGE` o similar y reutilizarla en AuthModal y AuthDropdown.

---

## Verificación ejecutada

- `npm run typecheck`: OK
- `npm test` (oauth.test, AuthDropdown.test, AuthButton.test): 32 tests passed
- Lectura de oauth.ts, AuthDropdown.tsx, tests y File List

---

## Siguiente paso sugerido

1. **MEDIUM #1:** En `handleSignOut`, usar `try/catch/finally`: en `finally` siempre `setIsLoggingOut(false)`; en `catch` opcionalmente `setLogoutError(...)`.
2. **MEDIUM #2:** Añadir test que simule `performLogout` rechazado y compruebe botón habilitado y mensaje de error.
3. **LOW:** Opcional: estilos para `.auth-dropdown__error`, commit de la story, constante para mensaje de error por defecto.

---

## Fix Record

| Issue | Fix aplicado | Verificación |
|-------|-------------|-------------|
| MEDIUM #1 | `handleSignOut` envuelto en `try/catch/finally`: `finally` siempre ejecuta `setIsLoggingOut(false)`, `catch` ejecuta `setLogoutError("An unexpected error occurred")` | 936/936 tests, typecheck OK, lint OK |
| MEDIUM #2 | Nuevo test "re-enables button and shows error when performLogout throws" con `mockRejectedValue(new Error("Network error"))` | 14/14 AuthDropdown tests pass |

**Post-fix:** 0 MEDIUM pendientes. LOWs opcionales no resueltos (estilos `.auth-dropdown__error`, constante de error).
