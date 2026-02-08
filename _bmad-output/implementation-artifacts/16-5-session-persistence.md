# Story 16.5: Session Persistence

Status: done

<!-- Note: Persist auth session across page refreshes and tab changes using localStorage
     (mock-first), following the same pattern as themeMode persistence.
     Architecture ready for httpOnly cookie upgrade when Rails backend is available. -->
<!-- Scope: Session save on login/logout, restore on page load, SSR safety, expiration. -->
<!-- NO incluye: Real OAuth tokens (16.3 mock is sufficient), protected routes, user profile,
     token refresh with real backend. -->

## Story

As a visitante autenticado,
I want que mi sesión persista entre recargas de página y entre tabs,
so that no tenga que re-autenticarme cada vez que recargo el portfolio.

## Acceptance Criteria

### AC1: Session Save on Login
- [x] Cuando `loginSuccess` se despacha, los datos del usuario se persisten en localStorage
- [x] Key: `"auth_session"` con valor JSON `{ user: AuthUser, timestamp: number }`
- [x] El timestamp registra el momento del login para expiración futura
- [x] Si localStorage no está disponible (SSR, incognito full), no falla silenciosamente

### AC2: Session Restore on Page Load
- [x] Al inicializar la app, si existe `auth_session` en localStorage, se restaura la sesión
- [x] El slice `authPanel` inicia con `isAuthenticated: true` y `user` restaurado
- [x] El patrón es idéntico a `getInitialTheme()` del themeMode slice
- [x] SSR safe: check `typeof window !== "undefined"` antes de acceder a localStorage

### AC3: Session Clear on Logout
- [x] Cuando `logout` se despacha, se elimina `auth_session` de localStorage
- [x] El estado Redux vuelve a `{ isAuthenticated: false, user: null }`
- [x] La UI (AuthButton) vuelve a mostrar UserIcon inmediatamente

### AC4: Session Expiration
- [x] Al restaurar sesión, verificar que no haya expirado
- [x] Expiración configurable: `AUTH_SESSION_TTL_MS` constante (default: 7 días = 604800000ms)
- [x] Si `Date.now() - timestamp > AUTH_SESSION_TTL_MS`, descartar sesión y no restaurar
- [x] No hay "refresh token" en mock mode — simplemente expira

### AC5: Cross-Tab Sync (opcional pero deseable)
- [x] Listener en `storage` event para detectar login/logout en otra tab
- [x] Si otra tab hace logout, esta tab actualiza su Redux state
- [x] Si otra tab hace login, esta tab restaura la sesión

### AC6: AuthProvider Component
- [x] Crear `AuthProvider` que encapsule la lógica de persistencia
- [x] Se agrega al tree de RootProvider (después de ReduxProvider, antes de ThemeProvider)
- [x] Responsabilidad: suscribirse al store Redux y sincronizar con localStorage
- [x] Patrón análogo a ThemeProvider (useEffect que escucha cambios de estado)

### AC7: Tests
- [x] Test: loginSuccess persiste sesión en localStorage
- [x] Test: initialState restaura sesión desde localStorage
- [x] Test: logout limpia localStorage
- [x] Test: sesión expirada no se restaura
- [x] Test: SSR safe (no falla sin window)
- [x] Test: AuthProvider sincroniza store ↔ localStorage
- [x] Test: cross-tab sync (storage event handler)

## Tasks / Subtasks

- [x] Task 1: Session storage utility (AC: 1,3,4)
  - [x] Crear `src/services/auth/session.ts` con funciones:
    - `saveSession(user: AuthUser): void` — persiste user + timestamp en localStorage
    - `loadSession(): AuthUser | null` — lee y valida sesión (incluye check de expiración)
    - `clearSession(): void` — elimina auth_session de localStorage
    - `AUTH_SESSION_KEY = "auth_session"` constante
    - `AUTH_SESSION_TTL_MS = 604_800_000` constante (7 días)
  - [x] SSR safe: todas las funciones verifican `typeof window !== "undefined"`
  - [x] Tests unitarios para session.ts (save, load, clear, expired, SSR)
  - [x] Re-exportar desde `src/services/auth/index.ts`
  - [x] Run `npm run typecheck` — clean

- [x] Task 2: Hydrate authPanel initialState (AC: 2)
  - [x] Crear `getInitialAuthState(): AuthPanelState` en el slice (patrón de `getInitialTheme()`)
  - [x] Llama `loadSession()` → si user válido, retorna `{ isAuthenticated: true, user, ... }`
  - [x] Si no hay sesión o expiró, retorna el default `{ isAuthenticated: false, user: null, ... }`
  - [x] Usar como `initialState` del authPanelSlice
  - [x] Tests del slice para initialState con/sin sesión guardada
  - [x] Run `npm run typecheck` — clean

- [x] Task 3: AuthProvider component (AC: 6,1,3)
  - [x] Crear `src/state/providers/AuthProvider/index.tsx`
  - [x] useEffect que se suscribe a cambios de `isAuthenticated` y `user`:
    - Si `isAuthenticated && user` → `saveSession(user)`
    - Si `!isAuthenticated` → `clearSession()`
  - [x] Agregar al RootProvider tree: `ReduxProvider > AuthProvider > ReactQueryProvider > ...`
  - [x] Tests: AuthProvider sincroniza login/logout con localStorage
  - [x] Run `npm run typecheck` — clean

- [x] Task 4: Cross-tab sync (AC: 5)
  - [x] En AuthProvider, agregar listener `window.addEventListener("storage", handler)`
  - [x] Handler: cuando `auth_session` cambia, sincronizar Redux state
    - Si key removida o null → dispatch `logout()`
    - Si key con nuevo valor → dispatch `loginSuccess(parsedUser)`
  - [x] Cleanup en return del useEffect
  - [x] Tests: simular StorageEvent y verificar dispatch
  - [x] Run `npm run typecheck` — clean

- [x] Task 5: Integration tests y verificación (AC: 7)
  - [x] Verificar que todo el flow funciona end-to-end en tests:
    1. Login → sesión persiste
    2. "Recargar" (re-render con initialState) → sesión restaurada
    3. Logout → sesión limpia
    4. Sesión expirada → no restaura
  - [x] Run `npm run typecheck` — clean
  - [x] Run `npm test` — all pass (927/927)
  - [x] Run `npm run build` — success
  - [x] Run `npm run lint` — clean (0 errors, 0 warnings)

## Dev Notes

### Estado Actual del Código (Pre-Story)

**Auth State (`src/state/slices/authPanel/slice.ts`):**
- Redux slice con reducers: loginSuccess, loginError, logout, clearError, etc.
- `initialState` es hardcoded: `{ isOpen: false, isAuthenticated: false, user: null, error: null }`
- **NO tiene persistencia** — sesión se pierde al recargar la página
- Re-exporta `AuthUser` desde `@/services/auth/types`

**ThemeMode Persistence Pattern (REFERENCE — follow this pattern):**
```typescript
// src/state/slices/themeMode/slice.ts
export const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return LIGHT;
  const storedTheme = localStorage.getItem(KEY_NAME) as ThemeMode | null;
  if (storedTheme === DARK || storedTheme === LIGHT) return storedTheme;
  // ... fallbacks
  return LIGHT;
};

const initialState: ThemeModeState = {
  mode: getInitialTheme(), // ← hydration from localStorage
};

// src/state/providers/ThemeProvider/index.tsx
useEffect(() => {
  localStorage.setItem(KEY_NAME, mode); // ← write on change
}, [mode]);
```

**Patrón para auth session (análogo):**
```typescript
// slice.ts — hydration
export const getInitialAuthState = (): AuthPanelState => {
  const user = loadSession(); // from services/auth/session
  if (user) return { isOpen: false, isAuthenticated: true, user, error: null };
  return { isOpen: false, isAuthenticated: false, user: null, error: null };
};

// AuthProvider — write on change
useEffect(() => {
  if (isAuthenticated && user) saveSession(user);
  else clearSession();
}, [isAuthenticated, user]);
```

**RootProvider (`src/providers/RootProvider/index.jsx`):**
```
ReduxProvider > ReactQueryProvider > ThemeProvider > TransitionProvider
                                     ↑
                          AuthProvider goes HERE (after Redux, needs dispatch)
```

**httpRequest (`src/lib/httpRequest/index.js`):**
- Ya lee `localStorage.getItem("auth_token")` automáticamente
- Cuando haya real backend, setear `auth_token` en session.ts junto con user data
- En mock mode (`USE_MOCKS=true`), httpRequest lanza error y no se usa

**localStorage Keys en el proyecto:**
- `"themeMode"` — theme preference (dark/light)
- `"auth_token"` — bearer token (leído por httpRequest, no escrito aún)
- `"auth_session"` — **NUEVO** — user data + timestamp para persistencia

### Architectural Decisions

**localStorage vs httpOnly cookies:**
El epic recomienda httpOnly cookies cuando hay backend. En mock mode (actual), usamos localStorage para `{ user, timestamp }` (NO tokens reales). Cuando el Rails backend esté listo, la sesión será manejada por cookies httpOnly y este localStorage actuará como cache local.

**Por qué AuthProvider y no middleware Redux:**
- Consistencia con el patrón de ThemeProvider (useEffect que escribe a localStorage)
- Más simple que configurar redux-persist o middleware custom
- El provider puede manejar cross-tab sync con el storage event listener
- Más testeable (componente React con hooks mockables)

**Session data structure:**
```typescript
interface StoredSession {
  user: AuthUser;   // { email: string, name?: string }
  timestamp: number; // Date.now() at login time
}
```
No almacenar tokens (no existen aún). Solo user identity para restaurar la UI.

### Import Considerations

```typescript
// Session utility — direct import (no barrel contamination risk)
import { saveSession, loadSession, clearSession } from "@/services/auth/session";

// OR via barrel (already clean, no icon issues)
import { saveSession, loadSession, clearSession } from "@/services/auth";
```

### Testing Strategy

- Mock `localStorage` con `jest.spyOn(Storage.prototype, 'getItem')` etc.
- Para SSR tests: `jest.spyOn(global, 'window', 'get').mockReturnValue(undefined as any)`
- Mock `Date.now()` para tests de expiración
- StorageEvent para cross-tab: `new StorageEvent("storage", { key, newValue, oldValue })`
- Framer-motion mock no necesario (no hay animaciones en esta story)
- Pattern: `jest.mock("@/services/auth/session")` para tests de AuthProvider

### Previous Story Intelligence

**Story 16.4 (Auth Button States):**
- AuthButton muestra initials cuando `isAuthenticated && user` — la persistencia hará que esto funcione al recargar
- AuthDropdown muestra user info + Sign Out — persistence no cambia nada aquí
- Code review H1: triggerRef fix para click-outside — no impacta esta story
- Jest mock hoisting: inline factories en jest.mock — aplicar mismo patrón

**Story 16.3 (OAuth Integration):**
- `performOAuthLogin(provider)` → `loginSuccess(user)` → Redux dispatch
- La persistencia intercepta el loginSuccess dispatch y guarda en localStorage
- El `OAuthService` interface no cambia — persistence es transparente

**Story 16.1 (Auth State Management):**
- Semantic hooks (`useAuth`, `useUser`, `useIsAuthenticated`) leen del Redux store
- La persistencia cambia el initialState del store → hooks automáticamente reflejan la sesión restaurada
- No hay que tocar los hooks

### References

- [Source: src/state/slices/themeMode/slice.ts — getInitialTheme pattern]
- [Source: src/state/providers/ThemeProvider/index.tsx — localStorage write pattern]
- [Source: src/state/slices/authPanel/slice.ts — current initialState without persistence]
- [Source: src/state/slices/authPanel/hooks.ts — useAuthPanel hook]
- [Source: src/providers/RootProvider/index.jsx — provider tree order]
- [Source: src/lib/httpRequest/index.js — auth_token localStorage read]
- [Source: _bmad-output/planning-artifacts/epic-16-auth-system.md — Story 16.5 requirements]
- [Source: _bmad-output/implementation-artifacts/16-4-auth-button-states.md — previous story]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Branch merge required: story/16.4 had to be merged into story/16.5 branch (fast-forward, no conflicts in code)
- Sprint-status.yaml had stash conflict (resolved manually)
- Pre-existing lint issues in AuthDropdown.tsx fixed: `React.RefObject` → `RefObject` import, missing `triggerRef` in useEffect deps

### Completion Notes List

- All 5 tasks completed with red-green-refactor TDD cycle
- Session persistence follows exact same pattern as themeMode (getInitialTheme → getInitialAuthState)
- AuthProvider placed after ReduxProvider, before ReactQueryProvider (needs dispatch access)
- Cross-tab sync implemented via StorageEvent listener with cleanup on unmount
- 20 new tests added (9 session utility + 3 slice hydration + 9 AuthProvider including cross-tab)
- Fixed 2 pre-existing lint issues in AuthDropdown.tsx from story 16.4

### File List

| File | Action | Description |
|------|--------|-------------|
| `src/services/auth/session.ts` | NEW | Session persistence utility (save, load, clear, TTL) |
| `src/services/auth/__tests__/session.test.ts` | NEW | 9 unit tests for session utility |
| `src/services/auth/index.ts` | MODIFIED | Re-export session functions and constants |
| `src/state/slices/authPanel/slice.ts` | MODIFIED | getInitialAuthState hydration from localStorage |
| `src/state/slices/authPanel/__tests__/slice.test.ts` | MODIFIED | 3 tests for initialState hydration |
| `src/state/providers/AuthProvider/index.tsx` | NEW | Provider for store ↔ localStorage sync + cross-tab |
| `src/state/providers/AuthProvider/__tests__/AuthProvider.test.tsx` | NEW | 9 tests for AuthProvider sync and cross-tab |
| `src/state/providers/index.ts` | MODIFIED | Export AuthProvider |
| `src/providers/RootProvider/index.jsx` | MODIFIED | Add AuthProvider to tree |
| `src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx` | MODIFIED | Fix lint: RefObject import + triggerRef dep |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | MODIFIED | 16-5 status tracking |

## Change Log

| Date | Change |
|------|--------|
| 2026-02-08 | Story created — ready-for-dev |
| 2026-02-08 | Implementation complete — all 5 tasks done, 927 tests passing, lint clean, build success |
| 2026-02-08 | Code review: 1H 2M 3L found → all fixed. H1: loadSession runtime validation, M1+M2: cross-tab uses loadSession (DRY + TTL), L1+L2: test constants. 930 tests passing |
