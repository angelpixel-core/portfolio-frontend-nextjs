# Story 16.6: Logout Flow

Status: done

<!-- Note: Formalize the logout flow with proper async service call, UI feedback,
     and dedicated test coverage. The basic Redux logout action + AuthProvider
     clearSession already works from Story 16.5 — this story adds the service
     layer call (mockLogout), loading state, error handling, and comprehensive tests. -->
<!-- Scope: Sign Out button behavior, async logout service call, UI state transitions,
     cross-tab logout propagation, test coverage. -->
<!-- NO incluye: Real backend API call (mock mode), confirmation dialog (epic says "opcional"),
     protected routes, token revocation, redirect post-logout (SPA — no redirect needed). -->

## Story

As a visitante autenticado,
I want poder cerrar mi sesión fácilmente desde el dropdown,
so that mi cuenta esté segura en dispositivos compartidos.

## Acceptance Criteria

### AC1: Sign Out Button Behavior
- [x] Click en "Sign Out" en AuthDropdown inicia el flujo de logout
- [x] El botón se deshabilita durante el logout (no doble-click)
- [x] El dropdown se cierra al completar el logout exitosamente
- [x] El flujo es: click → async service call → dispatch logout() → close dropdown

### AC2: Async Logout Service Call
- [x] El logout pasa por `performLogout()` en `src/services/auth/oauth.ts` (nuevo)
- [x] `performLogout()` llama a `mockLogout()` (ya existe en mock.ts, actualmente sin usar)
- [x] Si el mock/backend responde `success: true`, despacha `logout()` en Redux
- [x] Si responde error, muestra error en el dropdown (no cierra)
- [x] El patrón es análogo a `performOAuthLogin()` — convenience function sobre el service

### AC3: Session Cleanup
- [x] `dispatch(logout())` limpia Redux state: `{ isAuthenticated: false, user: null, error: null }`
- [x] AuthProvider detecta el cambio y llama `clearSession()` (ya funciona desde 16.5)
- [x] `localStorage.removeItem("auth_session")` se ejecuta (ya funciona desde 16.5)
- [x] Cross-tab: otras tabs reciben StorageEvent y actualizan su estado (ya funciona desde 16.5)

### AC4: UI State Transitions
- [x] AuthButton cambia de initials a UserIcon después del logout
- [x] El dropdown desaparece con animación exit (AnimatePresence ya configurado)
- [x] No hay flash — la transición es fluida (AnimatePresence mode="wait" en AuthButton)
- [x] Si logout falla, el usuario permanece autenticado y ve un mensaje de error

### AC5: Tests
- [x] Test: `performLogout()` llama a `mockLogout()` y retorna resultado
- [x] Test: handleSignOut en AuthDropdown deshabilita botón durante logout
- [x] Test: logout exitoso despacha `logout()` y cierra dropdown
- [x] Test: logout con error no despacha `logout()` y muestra error
- [x] Test: AuthButton vuelve a UserIcon después de logout
- [x] Test: tests existentes siguen pasando (no regression)

## Tasks / Subtasks

- [x] Task 1: `performLogout` service function (AC: 2)
  - [x] Agregar `performLogout()` a `src/services/auth/oauth.ts`
  - [x] Implementación: llama `mockLogout()` y retorna `AuthResult`
  - [x] Agregar a barrel `src/services/auth/index.ts`
  - [x] Tests unitarios para `performLogout()` en `src/services/auth/__tests__/oauth.test.ts`
  - [x] Run `npm run typecheck` — clean

- [x] Task 2: Async logout en AuthDropdown (AC: 1, 4)
  - [x] Cambiar `handleSignOut` de síncrono a asíncrono
  - [x] Agregar estado local `isLoggingOut` para deshabilitar botón
  - [x] Llamar `performLogout()` → si success → `onLogout()` + `onClose()`
  - [x] Si error → mostrar mensaje de error en dropdown (no cerrar)
  - [x] Tests para AuthDropdown: botón disabled, success flow, error flow
  - [x] Run `npm run typecheck` — clean

- [x] Task 3: Verificación de integración (AC: 3, 4, 5)
  - [x] Verificar que AuthButton transition (initials → UserIcon) funciona post-logout
  - [x] Verificar que session cleanup (localStorage + cross-tab) sigue funcionando
  - [x] Run `npm run typecheck` — clean
  - [x] Run `npm test` — all pass (935/935)
  - [x] Run `npm run build` — success
  - [x] Run `npm run lint` — clean (0 errors, 0 warnings)

## Dev Notes

### Estado Actual del Código (Pre-Story)

**Flujo de logout actual (funcional pero incompleto):**
```
AuthButton.tsx → handleClick → setDropdownOpen(true)
  └→ AuthDropdown.tsx → handleSignOut() {
       onLogout();  // → dispatch(logout()) via useAuthPanel hook
       onClose();   // → setDropdownOpen(false)
     }
  └→ AuthProvider.tsx useEffect detects !isAuthenticated → clearSession()
  └→ Cross-tab: StorageEvent fires → other tabs dispatch logout()
```

**Lo que falta:**
1. No hay async service call — `mockLogout()` existe en mock.ts pero NUNCA se llama
2. No hay loading state — el botón no se deshabilita durante logout
3. No hay error handling — si el logout fallara, el estado quedaría inconsistente
4. No hay tests dedicados para el flujo de logout en AuthDropdown

**`mockLogout()` en `src/services/auth/mock.ts` (línea 70-75):**
```typescript
export const mockLogout = async (): Promise<AuthResult> => {
  await simulateDelay(); // 800ms
  return { success: true };
};
```
Ya existe, delay de 800ms, siempre retorna success. Preparado para cuando el backend real necesite revocar tokens.

**`performOAuthLogin()` en `src/services/auth/oauth.ts` (PATTERN to follow):**
```typescript
export const performOAuthLogin = async (provider: OAuthProvider): Promise<AuthResult> => {
  await oauthService.initiateOAuth(provider);
  return oauthService.handleCallback({});
};
```
`performLogout()` sigue el mismo patrón: convenience function que llama al service.

**AuthDropdown props interface:**
```typescript
interface AuthDropdownProps {
  user: AuthUser;
  onLogout: () => void;    // ← Actualmente síncrono, cambiar a async
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}
```

**useAuthPanel hook (`src/state/slices/authPanel/hooks.ts`):**
```typescript
logout: () => dispatch(logout()),  // ← Síncrono, despacha action directamente
```
NO cambiar el hook — la lógica async va en AuthDropdown, no en el hook.

### Architectural Decisions

**¿Por qué async en AuthDropdown y no en el hook?**
- El hook `useAuthPanel` es un wrapper puro de Redux dispatch — mantenerlo síncrono
- La lógica de "llamar al service → si ok → dispatch" es responsabilidad del componente o de un thunk
- Sin Redux thunks en el proyecto (no hay createAsyncThunk en ningún slice)
- El patrón actual es: componente llama service → componente despacha action
- Consistente con `AuthPanelOverlay` que llama `performOAuthLogin()` → dispatch `loginSuccess()`

**¿Por qué NO agregar `performLogout` al OAuthService interface?**
- `OAuthService` es para el flujo OAuth (initiate + callback)
- Logout no es un flujo OAuth — es una operación separada
- `performLogout()` es una standalone convenience function como `performOAuthLogin()`
- Cuando Rails esté listo, será `POST /api/auth/signout` — diferente endpoint

**¿Por qué NO confirmation dialog?**
- El epic dice "Confirmation (opcional)"
- El mock siempre retorna success — no hay riesgo
- Un dialog agrega complejidad sin valor real en mock mode
- Si se necesita en el futuro, es un wrapper trivial sobre `handleSignOut`

**Error state en AuthDropdown:**
- Agregar estado local `logoutError: string | null`
- Si `performLogout()` retorna `{ success: false, error }`, mostrar en dropdown
- El error se limpia al siguiente intento de logout
- No usar Redux error state — el error de logout es local al dropdown

### Import Considerations

```typescript
// New export from oauth.ts — direct import (no barrel contamination risk)
import { performLogout } from "@/services/auth/oauth";

// OR via barrel (already clean)
import { performLogout } from "@/services/auth";
```

### Testing Strategy

- **oauth.test.ts**: Mock `mockLogout` from mock.ts, test `performLogout()` returns result
- **AuthDropdown.test.tsx**: Mock `@/services/auth/oauth` para `performLogout`
  - Test disabled state during async operation
  - Test success path: `onLogout()` + `onClose()` called
  - Test error path: error shown, `onLogout()` NOT called
- **AuthButton.test.tsx**: Verify transition from initials to UserIcon after logout dispatch
- Mock pattern: `jest.mock("@/services/auth/oauth")` — inline factory, `__esModule: true`
- For async: use `await act(async () => { ... })` y `waitFor()`

### Previous Story Intelligence

**Story 16.5 (Session Persistence):**
- AuthProvider ya maneja `clearSession()` cuando `!isAuthenticated`
- Cross-tab sync ya propaga logout a otras tabs vía StorageEvent
- `loadSession()` ya valida estructura y TTL — expired sessions are cleaned
- 930 tests passing post-16.5

**Story 16.4 (Auth Button States):**
- AuthButton muestra initials cuando `isAuthenticated && user`
- AuthDropdown muestra user info + "Sign Out" button
- `handleSignOut` actualmente es síncrono: `onLogout(); onClose();`
- AnimatePresence mode="wait" en AuthButton para transición fluida
- triggerRef fix para click-outside — no impacta esta story

**Story 16.3 (OAuth Integration):**
- `performOAuthLogin()` es el patrón a seguir para `performLogout()`
- `MockOAuthService` clase con `initiateOAuth` + `handleCallback`
- AuthPanelOverlay llama `performOAuthLogin()` → dispatch `loginSuccess()`
- Misma estructura: component calls service → dispatches action

### References

- [Source: src/services/auth/mock.ts — mockLogout function (lines 70-75)]
- [Source: src/services/auth/oauth.ts — performOAuthLogin pattern (lines 90-95)]
- [Source: src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx — handleSignOut (lines 58-61)]
- [Source: src/ui/atoms/buttons/AuthButton/index.tsx — AuthButton with logout prop (line 13)]
- [Source: src/state/slices/authPanel/hooks.ts — useAuthPanel hook with logout (line 47)]
- [Source: src/state/providers/AuthProvider/index.tsx — clearSession on !isAuthenticated]
- [Source: _bmad-output/planning-artifacts/epic-16-auth-system.md — Story 16.6 scope]

## Change Log

| Date | Change |
|------|--------|
| 2026-02-08 | Story created — ready-for-dev |
| 2026-02-08 | Implementation complete — all 3 tasks done, 935 tests passing, lint clean, build success |
| 2026-02-08 | Code review: 0H 2M 4L — MEDIUM fixes applied (try/catch/finally + rejection test), 936 tests, done |

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Pre-existing lint issues in SocialNetworkLink/Icon.test.tsx and ProjectCard/ProjectCard.test.tsx: unused `eslint-disable react/display-name` directives — removed (not related to this story but blocked lint gate)
- AuthButton.test.tsx needed `performLogout` mock + async `act()` wrappers for Sign Out tests after AuthDropdown became async

### Completion Notes List

- Task 1: `performLogout()` added to oauth.ts following `performOAuthLogin()` pattern. Calls `mockLogout()` and returns `AuthResult`. 2 tests.
- Task 2: AuthDropdown `handleSignOut` changed from sync to async. Added `isLoggingOut` (disables button), `logoutError` (shows inline error), error clears on retry. 5 new tests + 8 existing updated.
- Task 3: Full regression suite 935/935, typecheck clean, lint clean (0 errors), build success.
- Fixed 2 pre-existing lint issues (unused eslint-disable directives in unrelated test files).
- Total: 5 new tests added (2 oauth + 5 AuthDropdown async - 2 removed sync = 5 net new)
- Code review fix: `handleSignOut` wrapped in `try/catch/finally` (M1), added rejection path test (M2). 936 total tests.

### File List

| File | Action | Description |
|------|--------|-------------|
| `src/services/auth/oauth.ts` | MODIFIED | Added `performLogout()` function + mockLogout import |
| `src/services/auth/index.ts` | MODIFIED | Added `performLogout` to barrel exports |
| `src/services/auth/__tests__/oauth.test.ts` | NEW | 2 tests for performLogout (success + error) |
| `src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx` | MODIFIED | Async handleSignOut with try/catch/finally, loading state + error handling |
| `src/ui/atoms/buttons/AuthButton/__tests__/AuthDropdown.test.tsx` | MODIFIED | 6 new async tests (incl. rejection path) + performLogout mock |
| `src/ui/atoms/buttons/AuthButton/__tests__/AuthButton.test.tsx` | MODIFIED | Added performLogout mock + async act wrappers |
| `src/ui/molecules/SocialNetworkLink/__tests__/Icon.test.tsx` | MODIFIED | Removed unused eslint-disable directive |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | MODIFIED | Removed unused eslint-disable directive |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | MODIFIED | 16-6 status tracking |
