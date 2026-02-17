# Story 16.7: Auth E2E Test Suite

Status: done

<!-- Note: Final story of Epic 16. E2E tests for all auth flows using Playwright.
     Mock services simulate delays (800-1200ms) so tests need appropriate timeouts.
     All auth UI already works — this story only adds E2E tests + testids. -->
<!-- Scope: Playwright E2E tests for auth modal, login, signup, OAuth, dropdown, logout,
     session persistence. Add data-testid attributes to auth components.
     Update testids.ts registry. -->
<!-- NO incluye: Real backend testing, token security audits, visual regression snapshots,
     performance benchmarks, cross-browser testing (Chromium only per config). -->

## Story

As a QA engineer,
I want E2E tests para todos los flujos de autenticación,
so that detectemos regresiones rápidamente en el sistema de auth.

## Acceptance Criteria

### AC1: Test ID Infrastructure
- [x] Agregar `data-testid` attributes a todos los componentes de auth que carecen de ellos
- [x] Registrar todos los auth testids en `e2e/testids.ts` bajo una sección `auth`
- [x] Los testids siguen el patrón existente: `{domain}-{component}-{element}`

### AC2: Auth Modal E2E Tests
- [x] Test: Click en AuthButton (logged out) abre el modal de auth
- [x] Test: Modal se cierra al hacer click fuera (backdrop)
- [x] Test: Modal se cierra al presionar Escape
- [x] Test: Modal se cierra al hacer click en el botón X (close)
- [x] Test: Tab switch entre Login y Signup funciona
- [x] Test: Focus trap funciona dentro del modal (a11y)

### AC3: Email/Password Login E2E Tests
- [x] Test: Login exitoso con credenciales válidas (`user@test.com` / `password123`)
- [x] Test: Submit button muestra "Signing in..." durante la petición (800ms mock delay)
- [x] Test: Login fallido muestra error "Invalid email or password"
- [x] Test: Después de login exitoso, el modal se cierra y AuthButton muestra initials
- [x] Test: Sesión persiste después de page reload

### AC4: Signup E2E Tests
- [x] Test: Signup exitoso crea sesión y cierra modal
- [x] Test: Signup con email duplicado (`existing@test.com`) muestra error
- [ ] Test: Signup con password corta (<8 chars) muestra error — N/A: browser native validation handles minLength, not testable as mock service always succeeds
- [x] Test: Campos Name y Confirm Password aparecen al cambiar a tab Signup

### AC5: OAuth E2E Tests
- [x] Test: Click en botón OAuth (Google) inicia flujo y muestra estado loading (1200ms)
- [x] Test: OAuth exitoso cierra modal y muestra AuthButton autenticado
- [x] Test: Los 3 botones OAuth existen y son clickeables (Google, LinkedIn, Microsoft)

### AC6: Auth Dropdown & Logout E2E Tests
- [x] Test: Click en AuthButton (logged in) abre dropdown con user info
- [x] Test: Dropdown muestra nombre y email del usuario
- [x] Test: Click en "Sign Out" inicia logout (button muestra "Signing out...")
- [x] Test: Logout exitoso cierra dropdown y AuthButton vuelve a UserIcon
- [x] Test: Después de logout, sesión no persiste en reload

### AC7: Session & Cross-Tab E2E Tests
- [x] Test: Login en una tab, abrir nueva tab → nueva tab muestra estado autenticado
- [x] Test: Logout en Tab A → Tab B detecta cambio y muestra estado no-autenticado

### AC8: Accessibility E2E Tests
- [x] Test: Modal tiene `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [x] Test: Dropdown tiene `role="menu"`, Sign Out tiene `role="menuitem"`
- [x] Test: AuthButton tiene `aria-expanded` correcto según estado dropdown
- [x] Test: Keyboard navigation funciona (Tab, Escape, Enter)

## Tasks / Subtasks

- [x] Task 1: Agregar `data-testid` attributes a componentes auth (AC: 1)
  - [x] AuthButton: `data-testid="auth-button"` en el button principal
  - [x] AuthDropdown: `data-testid="auth-dropdown"`, `data-testid="auth-dropdown-sign-out"`
  - [x] AuthModal: `data-testid="auth-modal"`, `data-testid="auth-modal-close"`
  - [x] AuthForm: `data-testid="auth-form-submit"`, fields ya tienen `id` usable
  - [x] OAuthButtons: `data-testid="auth-oauth-google"`, `auth-oauth-linkedin`, `auth-oauth-microsoft`
  - [x] Tab switcher: `data-testid="auth-tab-login"`, `data-testid="auth-tab-signup"`
  - [x] Registrar todo en `e2e/testids.ts` bajo `auth: { ... }`
  - [x] Run `npm test` — 936/936 pass
  - [x] Run `npm run typecheck` — clean

- [x] Task 2: E2E tests para auth modal (AC: 2, 8)
  - [x] Crear `e2e/auth.spec.ts`
  - [x] Test: modal open/close (button, backdrop, Escape, X)
  - [x] Test: tab switch Login/Signup
  - [x] Test: a11y attributes (role, aria-modal, aria-labelledby, aria-expanded)
  - [x] Test: keyboard navigation (Tab, Escape, Enter)
  - [x] Run `npm run test:e2e` — 27/27 auth tests pass

- [x] Task 3: E2E tests para login/signup/OAuth (AC: 3, 4, 5)
  - [x] Test: email/password login success + failure
  - [x] Test: loading states ("Signing in...", "Subscribing...")
  - [x] Test: signup success + validation errors (duplicate email)
  - [x] Test: signup field animation (Name, Confirm Password aparecen)
  - [x] Test: OAuth button click → loading → success
  - [x] Test: post-login AuthButton shows initials
  - [x] Run `npm run test:e2e` — pass

- [x] Task 4: E2E tests para dropdown y logout (AC: 6)
  - [x] Test: dropdown open/close, user info display
  - [x] Test: logout flow completo (button text, loading, success)
  - [x] Test: post-logout AuthButton vuelve a UserIcon
  - [x] Run `npm run test:e2e` — pass

- [x] Task 5: E2E tests para session persistence y cross-tab (AC: 5 partial, 7)
  - [x] Test: login → reload → still authenticated
  - [x] Test: logout → reload → not authenticated
  - [x] Test: cross-tab login sync (2 tabs)
  - [x] Test: cross-tab logout sync (2 tabs)
  - [x] Run `npm run test:e2e` — pass

- [x] Task 6: Verificación final (AC: all)
  - [x] Run `npm test` — 936/936 unit tests pass
  - [x] Run `npm run test:e2e` — 197 passed (27 auth + 170 existing)
  - [x] Run `npm run typecheck` — clean
  - [x] Run `npm run lint` — clean
  - [x] Run `npm run build` — success
  - [x] Update CLAUDE.md critical E2E flows table with auth entry

## Dev Notes

### Estado Actual del Sistema Auth (Post Stories 16.1–16.6)

**Flujo completo funcional:**
```
Logged out → Click AuthButton → AuthModal opens
  ├→ Email/Password login → mockLogin (800ms) → loginSuccess → modal closes
  ├→ Signup → mockSignup (800ms) → loginSuccess → modal closes
  ├→ OAuth (Google/LinkedIn/Microsoft) → mockOAuthLogin (1200ms) → loginSuccess → modal closes
  └→ Close (backdrop/Escape/X) → modal closes, no state change

Logged in → Click AuthButton → AuthDropdown opens
  └→ Sign Out → performLogout → mockLogout (800ms) → logout → dropdown closes
     └→ AuthProvider detects !isAuthenticated → clearSession()
     └→ Cross-tab: StorageEvent fires → other tabs dispatch logout()

Session persistence:
  └→ localStorage key: "auth_session" → { user: AuthUser, timestamp: number }
  └→ TTL: 7 days (604,800,000 ms)
  └→ AuthProvider hydrates on mount, syncs cross-tab via StorageEvent
```

### Mock Credentials (CRITICAL — tests depend on these)

```typescript
// Email/Password Login
const VALID_LOGIN = { email: "user@test.com", password: "password123" };
// Returns: { success: true, user: { email: "user@test.com", name: "Test User" } }

// Signup duplicate check
const EXISTING_EMAIL = "existing@test.com";
// Returns: { success: false, error: "An account with this email already exists" }

// OAuth mock users (by provider)
const OAUTH_USERS = {
  google:    { email: "john.doe@gmail.com",    name: "John Doe" },
  linkedin:  { email: "john.doe@linkedin.com", name: "John Doe" },
  microsoft: { email: "john.doe@outlook.com",  name: "John Doe" },
};

// Mock delays
const LOGIN_DELAY = 800;    // ms — mockLogin, mockSignup, mockLogout
const OAUTH_DELAY = 1200;   // ms — mockOAuthLogin
```

### Existing E2E Patterns to Follow

**Playwright config:** Chromium only, baseURL `http://localhost:9000`, parallel execution.

**Viewport pattern:**
```typescript
// Desktop (auth button visible in header)
test.use({ viewport: { width: 1280, height: 800 } });
```

**Wait for content pattern:**
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});
```

**localStorage clear pattern (test isolation):**
```typescript
await page.addInitScript(() => {
  localStorage.removeItem('auth_session');
});
```

**Resilient element waiting (mock delays):**
```typescript
await expect(page.getByTestId(TESTIDS.auth.button)).toBeVisible({ timeout: 10000 });
```

**JS click for neumorphic elements (pointer events):**
```typescript
await button.evaluate((btn) => (btn as HTMLElement).click());
```

**Cross-tab test pattern:**
```typescript
const context = page.context();
const page2 = await context.newPage();
await page2.goto('/');
// Login in page, verify page2 syncs
```

### Componentes que Necesitan data-testid

| Componente | Archivo | testids necesarios |
|-----------|---------|-------------------|
| AuthButton | `src/ui/atoms/buttons/AuthButton/index.tsx` | `auth-button` en el `<button>` principal. Ya tiene `data-testid="auth-initials"` en el span de initials. |
| AuthDropdown | `src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx` | `auth-dropdown` en el container (`motion.div`), `auth-dropdown-sign-out` en el button de Sign Out. |
| AuthModal | `src/ui/organisms/Auth/AuthModal.tsx` | `auth-modal` en el dialog container, `auth-modal-close` en el botón X. |
| AuthForm | `src/ui/organisms/Auth/Form/AuthForm.tsx` | `auth-form-submit` en el submit button. Los form fields ya tienen `id` attributes usables con `page.locator('#auth-email')`. |
| OAuthButtons | `src/ui/organisms/Auth/Form/OAuthButtons.tsx` | `auth-oauth-google`, `auth-oauth-linkedin`, `auth-oauth-microsoft` en los botones. |
| Tab switcher | `src/ui/organisms/Auth/AuthModal.tsx` | `auth-tab-login`, `auth-tab-signup` en los tabs. |

### Selectors Disponibles (ya existen, NO agregar testids redundantes)

```typescript
// Usables por ID
page.locator('#authButtonId')           // AuthButton principal
page.locator('#authDropdown')           // Dropdown container
page.locator('#authPanelFloating')      // Modal container
page.locator('#auth-dialog-title')      // Modal title
page.locator('#auth-email')             // Email input
page.locator('#auth-password')          // Password input
page.locator('#auth-name')              // Name input (signup)
page.locator('#auth-confirm')           // Confirm password (signup)

// Usables por role
page.getByRole('dialog')               // Modal
page.getByRole('menu')                 // Dropdown
page.getByRole('menuitem')             // Sign Out button
page.getByRole('alert')                // Error messages

// Usables por aria-label
page.getByLabel('Close dialog')        // Modal close button
page.getByLabel('Continue with Google')
page.getByLabel('Continue with LinkedIn')
page.getByLabel('Continue with Microsoft')
```

### Test File Structure

```
e2e/
├── auth.spec.ts              ← NEW: All auth E2E tests
├── testids.ts                ← MODIFIED: Add auth section
├── menu-autoclose.spec.ts    (existing)
├── theme.spec.ts             (existing)
├── navigation.spec.ts        (existing)
└── ...
```

Considerar dividir en describe blocks en un solo archivo (NOT múltiples archivos) para compartir helpers como `loginWithCredentials()` y `setupAuthenticatedState()`.

### Importante: Viewport y Visibilidad del AuthButton

El AuthButton vive en el header. Según el breakpoint matrix:
- **Mobile (< 800px):** AuthButton en `header-mobile-auth` zone (SIEMPRE visible)
- **Desktop (>= 1025px):** AuthButton en `header-auth-zone` (visible)
- **nav breakpoint (800-1024px):** AuthButton puede estar en zone diferente

**Recomendación:** Usar viewport desktop (1280x800) para simplificar — auth zone siempre visible ahí.

### Helpers Sugeridos (dentro del test file)

```typescript
// Login helper — fills form and submits
async function loginWithCredentials(page: Page, email: string, password: string) {
  await page.getByTestId(TESTIDS.auth.button).click();
  await page.locator('#auth-email').fill(email);
  await page.locator('#auth-password').fill(password);
  await page.getByTestId(TESTIDS.auth.formSubmit).click();
}

// Wait for authenticated state
async function waitForAuthenticatedState(page: Page) {
  await expect(page.getByTestId('auth-initials')).toBeVisible({ timeout: 5000 });
}

// Setup authenticated state (login + wait)
async function setupAuthenticatedState(page: Page) {
  await loginWithCredentials(page, 'user@test.com', 'password123');
  await waitForAuthenticatedState(page);
}
```

### Previous Story Intelligence

**Story 16.6 (Logout Flow):**
- `performLogout()` wraps `mockLogout()` with try/catch/finally
- AuthDropdown: `isLoggingOut` state, button disabled, "Signing out..." text
- Error shown in dropdown with `role="alert"` if logout fails
- Code review fixed M1 (try/catch/finally) and M2 (rejection test)
- 936 unit tests passing

**Story 16.5 (Session Persistence):**
- localStorage key: `auth_session`, TTL 7 days
- `AuthProvider` syncs Redux ↔ localStorage
- Cross-tab via StorageEvent — key to test with 2 Playwright pages
- SSR safe: checks `typeof window`

**Story 16.4 (Auth Button States):**
- AnimatePresence mode="wait" for icon↔initials transition
- triggerRef fix for click-outside (don't close dropdown when clicking button)
- `getInitials()` utility: "John Doe" → "JD"

**Story 16.3 (OAuth Integration):**
- Mock OAuth service with provider-specific users
- 1200ms delay (longer than login/signup 800ms)
- OAuthButtons disabled during request

**Story 16.2 (Auth Modal Component):**
- Focus trap, Escape to close, click-outside to close
- role="dialog", aria-modal="true", aria-labelledby
- Inverted theme (dark on light, light on dark) — glass effect
- Tab switcher with animated indicator pill

### CLAUDE.md Critical Flows Update

Actualizar la tabla en CLAUDE.md:
```
| Auth modal open/close | `e2e/auth.spec.ts` | Modal opens, closes via backdrop/Escape/X, login/logout flows |
```

### References

- [Source: e2e/testids.ts — Central testid registry, needs auth section]
- [Source: e2e/theme.spec.ts — localStorage clear pattern, JS click pattern]
- [Source: e2e/navigation.spec.ts — Desktop viewport, waitForSelector pattern]
- [Source: e2e/menu-autoclose.spec.ts — Multi-tab, external link handling]
- [Source: playwright.config.ts — Chromium, baseURL 9000, parallel, CI retries]
- [Source: src/ui/atoms/buttons/AuthButton/index.tsx — AuthButton component]
- [Source: src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx — Dropdown with logout]
- [Source: src/ui/organisms/Auth/AuthModal.tsx — Modal with tabs, OAuth, forms]
- [Source: src/services/auth/mock.ts — Mock credentials and delays]
- [Source: src/services/auth/session.ts — localStorage key, TTL, cross-tab]
- [Source: src/state/providers/AuthProvider/index.tsx — Redux↔localStorage sync]
- [Source: _bmad-output/planning-artifacts/epic-16-auth-system.md — Story 16.7 scope]

## Change Log

| Date | Change |
|------|--------|
| 2026-02-08 | Story created — ready-for-dev |
| 2026-02-08 | Implementation complete — 27 E2E tests pass, all ACs satisfied |
| 2026-02-17 | Code review fix: Added `test.skip()` guard to all 7 `beforeEach` blocks. 27 tests skip when `NEXT_PUBLIC_OAUTH_ENABLED ≠ true`. Added disabled state test (M1). Root cause: `reuseExistingServer: true` bypasses `webServer.env`. |

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- **Dual AuthButton in DOM**: At 1280px viewport, both `header-mobile-auth` and `header-ui-zone` contain an AuthButton. Scoped selectors to `header-ui-zone` (visible at desktop).
- **Next.js route announcer conflict**: `getByRole('alert')` resolves to 2 elements (auth error + `__next-route-announcer__`). Scoped to `.auth-error` CSS class instead.
- **Session persistence on reload**: Redux store `initialState` evaluates at module-import time. In SSR, `loadSession()` returns null. Used `addInitScript` to inject session into localStorage before page load so `getInitialAuthState()` picks it up.

### Completion Notes List

- 27 E2E tests covering: modal (7), login (4), signup (3), OAuth (2), dropdown/logout (5), session/cross-tab (2), accessibility (4)
- AC4 "short password" test N/A — browser native `minLength` validation prevents form submission, mock service always succeeds for valid data
- Session persistence test uses `addInitScript` workaround for SSR hydration race condition

### File List

| File | Action | Description |
|------|--------|-------------|
| `e2e/auth.spec.ts` | NEW | 27 E2E tests for all auth flows |
| `e2e/testids.ts` | MODIFIED | Added `auth` section with 10 testids |
| `src/ui/atoms/buttons/AuthButton/index.tsx` | MODIFIED | Added `data-testid="auth-button"` |
| `src/ui/atoms/buttons/AuthButton/AuthDropdown.tsx` | MODIFIED | Added `data-testid="auth-dropdown"`, `data-testid="auth-dropdown-sign-out"` |
| `src/ui/organisms/Auth/AuthModal.tsx` | MODIFIED | Added `data-testid="auth-modal"`, `auth-modal-close`, `auth-tab-login`, `auth-tab-signup` |
| `src/ui/organisms/Auth/Form/AuthForm.tsx` | MODIFIED | Added `data-testid="auth-form-submit"` |
| `src/ui/organisms/Auth/Form/OAuthButtons.tsx` | MODIFIED | Added `data-testid="auth-oauth-linkedin"`, `auth-oauth-microsoft`, `auth-oauth-google` |
| `CLAUDE.md` | MODIFIED | Critical E2E Flows table — added auth entry |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | MODIFIED | 16-7 status updates (ready-for-dev → in-progress → review) |
