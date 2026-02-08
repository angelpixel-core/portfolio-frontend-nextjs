# Story 16.3: OAuth Integration (Adaptada)

Status: done

<!-- Note: Story adaptada — el backend Rails no está ready aún. Esta story implementa la capa
     de servicio OAuth con mock provider simulation, wires los OAuthButtons en AuthModal, y
     prepara la arquitectura para integración real futura (provider-agnostic). -->
<!-- Scope: Mock OAuth flow completo (redirect simulation + callback + session creation),
     wire OAuthButtons callback, mock OAuth service, tests unitarios. -->
<!-- NO incluye: Backend real, tokens reales, NextAuth, session persistence (Story 16.5). -->

## Story

As a visitante,
I want autenticarme con mi cuenta social (Google, LinkedIn, Microsoft),
so that pueda acceder al portfolio sin crear una cuenta nueva.

## Acceptance Criteria

### AC1: Wire OAuthButtons callback en AuthModal
- [x] `AuthModal.tsx` pasa un `onOAuthClick` handler a `<OAuthButtons />`
- [x] El handler inicia el mock OAuth flow para el provider seleccionado
- [x] Durante el flow, el modal muestra loading state (botones disabled o spinner)
- [x] `onOAuthClick` NO está hardcoded al mock — usa `performOAuthLogin` (delega a `oauthService`)

### AC2: Mock OAuth service (`mockOAuthLogin`)
- [x] Crear `mockOAuthLogin(provider: string): Promise<AuthResult>` en `src/services/auth/mock.ts`
- [x] Simula delay realista (1200ms — más lento que login normal para simular redirect)
- [x] Retorna `{ success: true, user: { email, name } }` con datos mock por provider:
  - google → `{ email: "john.doe@gmail.com", name: "John Doe" }`
  - linkedin → `{ email: "john.doe@linkedin.com", name: "John Doe" }`
  - microsoft → `{ email: "john.doe@outlook.com", name: "John Doe" }`
- [x] Retorna error si provider no soportado: `{ success: false, error: "Unsupported provider" }`
- [x] Re-exportar desde `src/services/auth/index.ts`

### AC3: OAuth types
- [x] Agregar `OAuthProvider` type en `src/services/auth/types.ts`: `"google" | "linkedin" | "microsoft"`
- [x] Agregar `OAuthCredentials` interface: `{ provider: OAuthProvider; token?: string }`
- [x] `mockOAuthLogin` acepta `OAuthProvider` (no string genérico)

### AC4: OAuth flow integrado end-to-end (mock)
- [x] Click en botón Google → loading state → `loginSuccess` con user mock → modal se cierra
- [x] Click en botón LinkedIn → loading state → `loginSuccess` con user mock → modal se cierra
- [x] Click en botón Microsoft → loading state → `loginSuccess` con user mock → modal se cierra
- [x] Error handling: si el flow falla → `loginError` con mensaje → modal permanece abierto
- [x] `clearError()` se llama antes de iniciar cada flow

### AC5: SocialAuthDropdown actualizado
- [x] `SocialAuthDropdown` usa `performOAuthLogin` (via `oauthService`) en vez de lógica mock inline
- [ ] Al recibir OAuth success, llama `loginSuccess` via `useAuth()` o `useAuthPanel()` — *N/A: SocialAuthDropdown opera en chat context, no auth context; usa callback `onEmailFetched` legacy*
- [x] Fix barrel import: reemplazar `@/icons` por direct path imports
- [x] Comportamiento existente preservado (loading, provider icon switch, clear)

### AC6: Tests unitarios para OAuth flow
- [x] Test: `mockOAuthLogin("google")` retorna user con email gmail
- [x] Test: `mockOAuthLogin("linkedin")` retorna user con email linkedin
- [x] Test: `mockOAuthLogin("microsoft")` retorna user con email outlook
- [x] Test: `mockOAuthLogin("invalid")` retorna error
- [x] Test: AuthModal — click en OAuth button dispara flow y llama `loginSuccess`
- [x] Test: AuthModal — OAuth error llama `loginError` con mensaje
- [x] Test: AuthModal — loading state durante OAuth flow (buttons disabled)

### AC7: Preparación para integración real
- [x] Crear `src/services/auth/oauth.ts` con interface `OAuthService`
- [x] Interface define: `initiateOAuth(provider): Promise<void>`, `handleCallback(params): Promise<AuthResult>`
- [x] Export mock implementation como default + `performOAuthLogin` convenience function
- [x] JSDoc documenta el contract para futura integración con Rails backend
- [x] Environment variable placeholder: `NEXT_PUBLIC_OAUTH_ENABLED=false` (feature flag leído en `oauth.ts`)

## Tasks / Subtasks

- [x] Task 1: Types y mock OAuth service (AC2, AC3) ✓
  - [x] Agregar `OAuthProvider` type y `OAuthCredentials` interface a `types.ts`
  - [x] Implementar `mockOAuthLogin` en `mock.ts`
  - [x] Re-exportar desde `src/services/auth/index.ts` (auto via wildcard export)
  - [x] Tests unitarios para `mockOAuthLogin` (4 tests) — 12/12 pass
  - [x] Run `npm run typecheck` — clean

- [x] Task 2: OAuth service abstraction (AC7) ✓
  - [x] Crear `src/services/auth/oauth.ts` con `OAuthService` interface
  - [x] Implementar `MockOAuthService` que usa `mockOAuthLogin`
  - [x] JSDoc con contract para Rails backend (security reqs, env vars, integration guide)
  - [x] Feature flag env var en `.env.template` — `NEXT_PUBLIC_OAUTH_ENABLED=false`
  - [x] Re-exportar desde `index.ts` — `oauthService` instance + `OAuthService` type
  - [x] Run `npm run typecheck` — clean

- [x] Task 3: Wire OAuthButtons en AuthModal (AC1, AC4) ✓
  - [x] En `AuthModal.tsx`: crear handler `handleOAuthClick(provider)` con useCallback
  - [x] Handler: `clearError()` → `setOauthLoading(true)` → `mockOAuthLogin(provider)` → `loginSuccess`/`loginError` → `closeAuthPanel()` on success
  - [x] Pasar `onOAuthClick={handleOAuthClick}` a `<OAuthButtons />`
  - [x] Agregar loading state visual (disable OAuth buttons via `disabled={oauthLoading}`)
  - [x] OAuthButtons: tipado con `OAuthProvider` (no string), acepta `disabled` prop
  - [x] Run `npm run typecheck` — clean
  - [x] Existing 27 Auth tests pass

- [x] Task 4: Actualizar SocialAuthDropdown (AC5) ✓
  - [x] Reemplazar lógica mock inline (`MOCK_EMAILS`, `MOCK_DELAY_MS`) por `mockOAuthLogin`
  - [x] Fix barrel import: `@/icons` → direct path imports (LinkedInIcon, MicrosoftIcon, GooglePlusIcon, EnvelopeIcon)
  - [x] Removed `forceMock` prop (no longer needed — centralized mock service)
  - [x] Updated `EmailBox.tsx` consumer to remove `forceMock={true}`
  - [x] `Provider` type now aliases `OAuthProvider` (from `@/services/auth`)
  - [x] Preserved `onEmailFetched`/`onEmailCleared` callbacks for backward compat
  - [x] Removed unused `SocialAuthProvider` type export
  - [x] Run `npm run typecheck` — clean
  - [x] 867 tests pass

- [x] Task 5: Tests para OAuth flow en AuthModal (AC6) ✓
  - [x] Agregados 4 tests a `AuthModal.test.tsx` (describe "OAuth flow")
  - [x] Mock `mockOAuthLogin` via jest.mock("@/services/auth")
  - [x] Test: click Google → success → `loginSuccess` + `closeAuthPanel` called
  - [x] Test: click LinkedIn → error → `loginError` called, modal stays open
  - [x] Test: loading state disables all 3 OAuth buttons
  - [x] Test: mockOAuthLogin throws → `loginError("An unexpected error occurred")`
  - [x] Run `npm test` — 871 tests pass (was 867, +4 OAuth flow tests)

- [x] Task 6: Verificación final ✓
  - [x] `npm run typecheck` — clean
  - [x] `npm test` — 871 tests pass (+8 new: 4 mock OAuth + 4 AuthModal OAuth flow)
  - [x] `npm run build` — success (next-sitemap generated)
  - [x] `npm run lint` — 0 errors, 0 warnings
  - [x] No barrel import contamination introduced (SocialAuthDropdown fixed from `@/icons` → direct paths)

## Dev Notes

### Estado Actual del Código (Pre-Story)

**Story 16.1 estableció:**
- Redux slice `authPanel` con actions: `loginSuccess`, `loginError`, `logout`, `clearError`
- Hooks semánticos: `useAuth()`, `useUser()`, `useIsAuthenticated()`
- Tipos canónicos en `src/services/auth/types.ts`: `AuthUser`, `AuthResult`
- Mock service: `mockLogin`, `mockSignup`, `mockLogout`
- 24 tests (slice 9, mock 5, hooks 10)

**Story 16.2 estableció:**
- `AuthModal.tsx` con tabs Login/Signup, a11y completa
- `AuthForm.tsx` llama `mockLogin`/`mockSignup` y dispatcha `loginSuccess`/`loginError`
- `OAuthButtons.tsx` con 3 botones y `onOAuthClick` callback — **NO WIRED en AuthModal**
- 27 tests (AuthModal 15, AuthForm 8, OAuthButtons 4)

**SocialAuthDropdown (preexistente):**
- `src/ui/molecules/SocialAuthDropdown/index.tsx`
- Dropdown con 3 providers + envelope icon
- `forceMock = true` — usa mock emails hardcoded
- Línea 145: `// TODO: Real OAuth integration`
- **Barrel import contamination**: importa desde `@/icons` (58+ icons en chunk)
- NO integrado con Redux auth state

### OAuthButtons: Estado del Callback

```typescript
// AuthModal.tsx — actualmente NO pasa callback
<OAuthButtons />  // ← falta onOAuthClick

// OAuthButtons.tsx — acepta callback pero es no-op
interface OAuthButtonsProps {
  onOAuthClick?: (_provider: string) => void;
}
```

El principal gap: `AuthModal` no conecta los botones OAuth con ningún servicio. Story 16.3 debe wirer esto.

### Mock OAuth Flow Design

```
User clicks Google → handleOAuthClick("google")
  → clearError()
  → setOAuthLoading(true)
  → mockOAuthLogin("google")
    → simulates 1200ms delay
    → returns { success: true, user: { email: "john.doe@gmail.com", name: "John Doe" } }
  → loginSuccess(user)
  → closeAuthPanel()
```

En producción futura, `mockOAuthLogin` se reemplazará por:
```
User clicks Google → handleOAuthClick("google")
  → window.location.href = "/api/auth/signin?provider=google"
  → redirect to Google OAuth
  → callback to /api/auth/callback/google
  → server exchanges code for token
  → sets httpOnly cookie
  → redirects to frontend
  → frontend reads session from cookie
  → loginSuccess(user)
```

### Barrel Import Fix en SocialAuthDropdown

```typescript
// ANTES (contamina chunk):
import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon, EnvelopeIcon } from "@/icons";

// DESPUÉS (direct paths):
import LinkedInIcon from "@/atoms/icons/LinkedInIcon";
import MicrosoftIcon from "@/atoms/icons/MicrosoftIcon";
import GooglePlusIcon from "@/atoms/icons/GooglePlusIcon";
import EnvelopeIcon from "@/atoms/icons/EnvelopeIcon";
```

### OAuth Provider Mock Data

| Provider | Email | Name |
|----------|-------|------|
| google | john.doe@gmail.com | John Doe |
| linkedin | john.doe@linkedin.com | John Doe |
| microsoft | john.doe@outlook.com | John Doe |

### Architecture Compliance

| Requisito | Estado | Acción |
|-----------|--------|--------|
| TypeScript strict | OK | Nuevos archivos serán .ts/.tsx |
| Barrel import clean | FALTA | SocialAuthDropdown usa @/icons barrel |
| Provider-agnostic | FALTA | Diseñar interface que soporte cualquier provider |
| Test coverage | FALTA | 0 tests para OAuth flow |
| Feature flag | FALTA | NEXT_PUBLIC_OAUTH_ENABLED para toggle mock/real |
| Mock-first | OK | Pattern existente: `mockLogin`/`mockSignup` |

### File Structure (Target)

```
src/services/auth/
├── types.ts           # MODIFY — add OAuthProvider, OAuthCredentials
├── mock.ts            # MODIFY — add mockOAuthLogin
├── oauth.ts           # NEW — OAuthService interface + MockOAuthService
└── index.ts           # MODIFY — re-export mockOAuthLogin

src/ui/organisms/Auth/
├── AuthModal.tsx       # MODIFY — wire onOAuthClick handler
└── __tests__/
    └── AuthModal.test.tsx  # MODIFY — add OAuth flow tests

src/ui/molecules/SocialAuthDropdown/
└── index.tsx           # MODIFY — use mockOAuthLogin, fix barrel import
```

### Testing Standards

- Test framework: Jest + React Testing Library
- Mock OAuth service: `jest.mock("@/services/auth")` con mockOAuthLogin
- Pattern establecido: `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))`
- Pattern icons: `__esModule: true` + destructurar `colored` prop
- `jest.mock()` se hoistea — inline factory functions

### Mocking Strategy para OAuth Tests

```typescript
const mockOAuthLoginFn = jest.fn();

jest.mock("@/services/auth", () => ({
  ...jest.requireActual("@/services/auth"),
  mockOAuthLogin: (...args: unknown[]) => mockOAuthLoginFn(...args),
}));

// Test: success flow
mockOAuthLoginFn.mockResolvedValue({
  success: true,
  user: { email: "john.doe@gmail.com", name: "John Doe" },
});
```

### Previous Story Intelligence

**Story 16.1 learnings:**
- Jest mock hoisting: inline factory functions en `jest.mock()`
- `__esModule: true` para mocks de imports directos
- JSDoc obligatorio cuando API puede confundir (ej: `login()` no triggerea request)
- Action creators importados (no string types) en tests

**Story 16.2 learnings:**
- `screen.getAllByText()` para textos duplicados (tab + button)
- Framer Motion mock centralizado: `@/test-utils/framer-motion-mock`
- `role="alert"` para error containers (WCAG 4.1.3)
- Destructurar `colored` en icon mocks para evitar React warnings

### SocialAuthDropdown: Consideraciones de Refactor

El componente ya tiene:
- Loading state (spinner SVG)
- Provider icon switching
- Clear/reset functionality
- Dropdown animation (AnimatePresence)

Lo que falta:
- Usar `mockOAuthLogin` en vez de inline mock
- Dispatch `loginSuccess` al Redux store
- Fix barrel import
- El `onEmailFetched` callback es legacy — OAuth flow debería dispatch directo a Redux

### Security Notes (Future)

Para la integración real (futura, no esta story):
- NUNCA guardar tokens en localStorage (vulnerabilidad XSS)
- httpOnly cookies para tokens (Rails backend como owner)
- CSRF protection via state parameter en OAuth flow
- PKCE para SPA security (code_verifier + code_challenge)
- Rate limiting en auth endpoints (backend responsibility)

### References

- [Source: _bmad-output/planning-artifacts/epic-16-auth-system.md#Story 16.3]
- [Source: _bmad-output/implementation-artifacts/16-1-auth-state-management.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/16-2-auth-modal-component.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/ux-design-behavior/spec.md#Section 3]
- [Source: CLAUDE.md#Testing Conventions]
- [Source: CLAUDE.md#Import Aliases]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Lint fixes: prettier formatting in AuthModal.test.tsx, no-unused-vars in oauth.ts interface, _colored prefix in OAuthButtons.test.tsx

### Completion Notes List

- Task 1: OAuthProvider type, OAuthCredentials interface, mockOAuthLogin (4 tests) — types.ts, mock.ts, mock.test.ts
- Task 2: OAuthService interface, MockOAuthService class, JSDoc contract, NEXT_PUBLIC_OAUTH_ENABLED feature flag — oauth.ts, .env.template, index.ts
- Task 3: handleOAuthClick handler wired in AuthModal, OAuthButtons typed with OAuthProvider + disabled prop — AuthModal.tsx, OAuthButtons.tsx
- Task 4: SocialAuthDropdown refactored: barrel import fix, mockOAuthLogin replaces inline mock, forceMock removed — SocialAuthDropdown/index.tsx, EmailBox.tsx
- Task 5: 4 OAuth flow tests: success, error, loading/disabled, exception — AuthModal.test.tsx
- Task 6: Full verification — typecheck, 871 tests, build, lint all clean

### File List

| File | Action | Description |
|------|--------|-------------|
| `src/services/auth/types.ts` | MODIFIED | Added OAuthProvider type, OAuthCredentials interface |
| `src/services/auth/mock.ts` | MODIFIED | Added mockOAuthLogin with 1200ms delay, provider-specific mock users |
| `src/services/auth/oauth.ts` | NEW | OAuthService interface, MockOAuthService, JSDoc Rails contract |
| `src/services/auth/index.ts` | MODIFIED | Re-export oauthService, OAuthService type |
| `src/services/auth/__tests__/mock.test.ts` | MODIFIED | +4 OAuth tests (google, linkedin, microsoft, invalid) |
| `src/ui/organisms/Auth/AuthModal.tsx` | MODIFIED | handleOAuthClick handler, oauthLoading state, wired OAuthButtons |
| `src/ui/organisms/Auth/Form/OAuthButtons.tsx` | MODIFIED | OAuthProvider typing, disabled prop |
| `src/ui/organisms/Auth/__tests__/AuthModal.test.tsx` | MODIFIED | +4 OAuth flow tests (success, error, loading, exception) |
| `src/ui/organisms/Auth/__tests__/OAuthButtons.test.tsx` | MODIFIED | _colored prefix for lint |
| `src/ui/molecules/SocialAuthDropdown/index.tsx` | MODIFIED | Fix barrel import, use mockOAuthLogin, remove forceMock, remove inline mocks |
| `src/ui/organisms/Chat/Form/EmailBox.tsx` | MODIFIED | Remove forceMock={true} prop |
| `.env.template` | MODIFIED | Added NEXT_PUBLIC_OAUTH_ENABLED=false |
| `_bmad-output/implementation-artifacts/16-3-oauth-integration.md` | MODIFIED | Story tracking updates |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | MODIFIED | 16-3 status: in-progress |

## Change Log

| Date | Change |
|------|--------|
| 2026-02-08 | Story created (adaptada) — mock OAuth flow, wire OAuthButtons, SocialAuthDropdown fix, OAuth service abstraction |
| 2026-02-08 | Implementation complete — 6 tasks done, 871 tests pass, build clean |
| 2026-02-08 | Code review fixes — H1: `performOAuthLogin` via `oauthService` (no direct mock import), M1: feature flag reads env var, M2: ACs marked [x] |
