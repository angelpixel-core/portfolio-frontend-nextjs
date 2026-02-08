# Code Review Findings – Story 16.5: Session Persistence

**Revisor:** Adversarial Senior Developer (BMAD Code Review Workflow)  
**Story:** 16-5-session-persistence  
**Fecha:** 2026-02-07  
**Idioma:** Español

---

## Resumen

| Métrica | Valor |
|--------|--------|
| **Story file** | `implementation-artifacts/16-5-session-persistence.md` |
| **Discrepancias Git vs File List** | 1 |
| **Issues encontrados** | 0 High, 3 Medium, 5 Low |

---

## Git vs Story

- **File List (story):** 11 archivos (session.ts, session.test.ts, auth/index, slice, slice.test, AuthProvider, AuthProvider.test, state/providers index, RootProvider, AuthDropdown, sprint-status).
- **Git:** Modificados: sprint-status, RootProvider, auth/index, state/providers index, slice.test, slice, AuthDropdown. Sin trackear: story 16-5, session.test.ts, session.ts, AuthProvider/ (carpeta con index y tests).
- **Discrepancia:** Toda la implementación está sin commit; no hay un commit que agrupe la story (DoD / transparencia). El resto de archivos de la File List coincide con git (modificados o untracked).

---

## Validación de ACs

| AC | Estado | Notas |
|----|--------|--------|
| AC1 Session save on login | OK | saveSession con user + timestamp, key auth_session, SSR check, try/catch. |
| AC2 Session restore on load | OK | getInitialAuthState() → loadSession(), patrón análogo a getInitialTheme, SSR safe. |
| AC3 Session clear on logout | OK | AuthProvider llama clearSession cuando !isAuthenticated; logout reducer limpia state. |
| AC4 Session expiration | OK | AUTH_SESSION_TTL_MS, loadSession comprueba TTL y elimina si expirado. |
| AC5 Cross-tab sync | Parcial | Listener storage, loginSuccess/logout según newValue; **no se valida TTL ni forma de user** en el handler (LOW). |
| AC6 AuthProvider | OK | Provider en tree Redux > Auth > ReactQuery > Theme; sync store ↔ localStorage; export en state/providers. |
| AC7 Tests | OK | 9 session + 3 slice hydration + 9 AuthProvider (incl. cross-tab y cleanup). |

---

## CRITICAL ISSUES

*(Ninguno.)*

---

## HIGH ISSUES

*(Ninguno.)*

---

## MEDIUM ISSUES

### 1. loadSession puede devolver undefined con datos malformados

**Hecho:** Si en localStorage hay un JSON válido pero sin `user` o con `user` inválido (p. ej. `{ "timestamp": 1 }`), `session.user` es `undefined`. La función hace `return session.user` y el tipo declarado es `AuthUser | null`. Se devuelve `undefined`, no `null`, lo que rompe el contrato de tipo y puede propagar a `getInitialAuthState()` (que hace `if (user)` y trataría undefined como falsy, pero el tipo no es correcto).

**Recomendación:** Validar forma mínima antes de devolver: p. ej. comprobar que `session?.user` sea un objeto con al menos `email` (string). Si no, hacer `return null` y, si se desea, limpiar la key corrupta.

### 2. Cross-tab: no se comprueba TTL en el storage event

**Hecho:** En `AuthProvider`, cuando llega un `StorageEvent` con `newValue`, se hace `JSON.parse(e.newValue)` y `dispatch(loginSuccess(session.user))` sin comprobar si la sesión está expirada (`Date.now() - session.timestamp > AUTH_SESSION_TTL_MS`). Otra pestaña podría escribir una sesión ya expirada (p. ej. por reloj atrasado o bug) y esta pestaña restauraría sesión caducada.

**Recomendación:** En el handler de `storage`, después de parsear, comprobar TTL; si la sesión está expirada, hacer `dispatch(logout())` (o no despachar loginSuccess) en lugar de restaurar.

### 3. Cambios sin commit

Ningún cambio de la implementación de 16.5 está commiteado (hay modificados y archivos sin trackear). El DoD suele exigir un commit que agrupe la story.

**Recomendación:** Crear un commit con los archivos de la File List (excluyendo solo artefactos de planificación si aplica).

---

## LOW ISSUES

### 4. slice.test.ts usa string literal "auth_session" en vez de AUTH_SESSION_KEY

En `slice.test.ts` (líneas 108 y 134) se usa el string `"auth_session"` al escribir en localStorage en lugar de importar `AUTH_SESSION_KEY` desde `@/services/auth/session`. Si la constante cambia, los tests seguirían pasando pero estarían probando otra key.

**Recomendación:** Importar `AUTH_SESSION_KEY` y usarla en los tests de `getInitialAuthState`.

### 5. Duplicación de la interfaz StoredSession

`StoredSession` está definida en `session.ts` (no exportada) y vuelta a definir en `AuthProvider/index.tsx`. Cualquier cambio de forma (p. ej. nuevos campos) hay que replicarlo en dos sitios.

**Recomendación:** Exportar `StoredSession` desde `session.ts` (o desde `@/services/auth`) e importarla en AuthProvider.

### 6. Cross-tab: no se valida la forma de session.user antes del dispatch

En el handler de `storage`, si `e.newValue` es JSON válido pero `session.user` tiene forma incorrecta (p. ej. sin `email`), se hace igualmente `dispatch(loginSuccess(session.user))`. Conviene validar mínimamente (p. ej. `user?.email` string) antes de despachar.

**Recomendación:** Validar forma mínima de `session.user` (o reutilizar la misma lógica que en loadSession) y, si no es válida, ignorar el evento o hacer logout.

### 7. Test "returns initial state" depende del estado de localStorage al cargar el módulo

El test espera `reducer(undefined, { type: "unknown" })` igual al estado por defecto (no autenticado). El `initialState` del slice se calcula una sola vez al importar el módulo con `getInitialAuthState()` (que usa `loadSession()`). Si otro test o archivo dejó `auth_session` en localStorage antes de que se cargue el slice, el estado inicial sería autenticado y el test fallaría. Riesgo de flakiness según orden de ejecución.

**Recomendación:** En el describe raíz del slice, usar `beforeEach(() => localStorage.removeItem(AUTH_SESSION_KEY))` o mockear `loadSession` en ese test para fijar un estado inicial conocido.

### 8. RootProvider sigue en .jsx

El archivo `src/providers/RootProvider/index.jsx` sigue en JavaScript. La story no exige migración a TS, pero el proyecto está en migración TypeScript; mantener este nodo en JS deja tipos implícitos (p. ej. `children`).

**Recomendación:** Opcional: migrar a `.tsx` y tipar `children` (ReactNode) cuando se toque este archivo.

---

## Verificación ejecutada

- `npm run typecheck`: OK  
- `npm test` (session.test, slice.test, AuthProvider.test): 29 tests passed  
- Lectura de todos los archivos de la File List en `src/`

---

## Siguiente paso sugerido

1. **MEDIUM #1:** En `loadSession`, validar forma de `session.user` y devolver `null` si no es válida (y opcionalmente limpiar key).  
2. **MEDIUM #2:** En el handler de `storage` de AuthProvider, comprobar TTL antes de `loginSuccess`; si expirada, no restaurar o hacer logout.  
3. **MEDIUM #3:** Crear commit con los cambios de la story.  
4. **LOW:** Opcional: usar AUTH_SESSION_KEY en slice.test, exportar StoredSession, validar user en cross-tab, reforzar test de initialState, migrar RootProvider a .tsx.
