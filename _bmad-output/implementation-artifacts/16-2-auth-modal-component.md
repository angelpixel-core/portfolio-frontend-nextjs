# Story 16.2: Auth Modal Component (Adaptada)

Status: done

<!-- Note: Story adaptada - el componente AuthModal ya existe y es funcional del trabajo previo en Epic 16 Header/NavBar Refactor. -->
<!-- Esta story cierra gaps: bugs, barrel import, dead code, tests unitarios, y verificación de a11y/reduced motion. -->

## Story

As a visitante,
I want un modal de autenticación robusto, accesible y libre de bugs,
so that pueda hacer sign in/sign up con confianza en cualquier dispositivo y preferencia de accesibilidad.

## Acceptance Criteria

### AC1: Bug fix — Close button usa función inexistente
- [x] En `AuthModal.tsx` líneas 106 y 160: `onClick={close}` referencia `close` que NO está definido/destructurado
- [x] Reemplazar por `onClick={closeAuthPanel}` (ya destructurado del hook)
- [x] Verificar que ambos close buttons (authenticated y unauthenticated views) funcionan
- [x] `npm run typecheck` pasa (actualmente podría no detectar esto si `close` resuelve a `window.close`)

### AC2: Fix barrel import en OAuthButtons (performance)
- [x] `OAuthButtons.tsx:3` importa `{ LinkedInIcon, MicrosoftIcon, GooglePlusIcon }` desde `@/icons` (barrel de 58+ icons)
- [x] Reemplazar por direct path imports: `@/atoms/icons/LinkedInIcon`, `@/atoms/icons/MicrosoftIcon`, `@/atoms/icons/GooglePlusIcon`
- [x] Verificar que los icons renderizan correctamente con sus props (`className`, `colored`)
- [x] `npm run build` no introduce nuevo chunk de icons

### AC3: Eliminar dead code — LoginForm.tsx y SignupForm.tsx legacy
- [x] `LoginForm.tsx` y `SignupForm.tsx` son versiones legacy superseded por `AuthForm.tsx` unificado
- [x] Verificar que NINGÚN componente importa LoginForm ni SignupForm (solo el barrel `Form/index.ts` los exporta)
- [x] Eliminar `LoginForm.tsx` y `SignupForm.tsx`
- [x] Actualizar `Form/index.ts`: remover exports de LoginForm y SignupForm
- [x] `npm run build` pasa sin errores

### AC4: Tests unitarios para AuthModal
- [x] Test: modal NO renderiza cuando `isOpen` es false
- [x] Test: modal renderiza cuando `isOpen` es true (role="dialog", aria-modal)
- [x] Test: muestra view autenticada cuando `isAuthenticated` + `user` están presentes
- [x] Test: muestra view no autenticada (tabs, form, OAuth buttons) cuando no autenticado
- [x] Test: click en backdrop (overlay) llama `closeAuthPanel`
- [x] Test: tab switching entre "Sign In" y "Sign Up" actualiza el activeTab
- [x] Test: botón close llama `closeAuthPanel`

### AC5: Tests unitarios para AuthForm
- [x] Test: renderiza campos email + password en modo login
- [x] Test: renderiza campos name + email + password + confirm en modo signup
- [x] Test: submit login exitoso llama `loginSuccess` con user
- [x] Test: submit login fallido llama `loginError` con mensaje
- [x] Test: submit signup con passwords que no matchean muestra error
- [x] Test: muestra loading state durante submit

### AC6: Tests unitarios para OAuthButtons
- [x] Test: renderiza 3 botones (LinkedIn, Microsoft, Google) con aria-labels correctos
- [x] Test: click en cada botón llama `onOAuthClick` con provider name correcto

### AC7: Verificación de accesibilidad
- [x] `role="dialog"` y `aria-modal="true"` presentes en ambas views (authenticated + unauthenticated)
- [x] `aria-labelledby="auth-dialog-title"` vinculado al h2 en ambas views
- [x] Focus trap funciona (Tab cycle dentro del modal)
- [x] Escape key cierra el modal
- [x] Focus restaurado al elemento previo al cerrar
- [x] Reduced motion: todas las animaciones usan `shouldReduceMotion` condicionalmente

## Tasks / Subtasks

- [x] Task 1: Fix bugs y cleanup (AC1, AC2, AC3)
  - [x] Fix `onClick={close}` → `onClick={closeAuthPanel}` en AuthModal.tsx (líneas 106 y 160)
  - [x] Fix barrel import en OAuthButtons.tsx → direct path imports
  - [x] Verificar que LoginForm/SignupForm no son importados en ningún otro lugar
  - [x] Eliminar `LoginForm.tsx`, `SignupForm.tsx`
  - [x] Actualizar `Form/index.ts` barrel
  - [x] Run `npm run typecheck`
  - [x] Run `npm run build`

- [x] Task 2: Tests para AuthModal (AC4, AC7)
  - [x] Crear `src/ui/organisms/Auth/__tests__/AuthModal.test.tsx`
  - [x] Mock: `framer-motion` (AnimatePresence + motion components como passthrough)
  - [x] Mock: `useAuthPanel` hook para controlar state
  - [x] Mock: `useReducedMotion` hook
  - [x] Tests de rendering: open/closed, authenticated/unauthenticated views
  - [x] Tests de interacción: close button, backdrop click, tab switching
  - [x] Tests de a11y: role, aria-modal, aria-labelledby, Escape key
  - [x] Run `npm test`

- [x] Task 3: Tests para AuthForm (AC5)
  - [x] Crear `src/ui/organisms/Auth/__tests__/AuthForm.test.tsx`
  - [x] Mock: `framer-motion`, `useAuthPanel`, `useReducedMotion`, `mockLogin`, `mockSignup`
  - [x] Tests de rendering: campos por mode (login vs signup)
  - [x] Tests de submit: login success, login error, signup password mismatch, loading state
  - [x] Run `npm test`

- [x] Task 4: Tests para OAuthButtons (AC6)
  - [x] Crear `src/ui/organisms/Auth/__tests__/OAuthButtons.test.tsx`
  - [x] Mock: icons como SVG simples con data-testid
  - [x] Tests: renderización de 3 buttons con aria-labels
  - [x] Tests: callback onOAuthClick con provider names
  - [x] Run `npm test`

- [x] Task 5: Verificación final
  - [x] `npm run typecheck` pasa
  - [x] `npm test` pasa (861 tests: 836 existentes + 25 nuevos)
  - [x] `npm run build` pasa
  - [x] `npm run lint` pasa (2 errores pre-existentes en archivos no tocados)

## Dev Notes

### Estado Actual del Código (Pre-Story)

Los componentes AuthModal, AuthForm, OAuthButtons **ya existen y son funcionales** del trabajo previo en Epic 16 Header/NavBar Refactor. Esta story cierra gaps específicos.

**AuthModal** (`src/ui/organisms/Auth/AuthModal.tsx`):
- Modal completo con AnimatePresence, tabs Login/Signup, focus trap, Escape key
- Dos views: authenticated (user info + logout) y unauthenticated (tabs + form + OAuth)
- Usa `useAuthPanel()` para state y `useReducedMotion()` para a11y
- **BUG:** `onClick={close}` en close buttons — `close` no está definido, debería ser `closeAuthPanel`

**AuthForm** (`src/ui/organisms/Auth/Form/AuthForm.tsx`):
- Formulario unificado con modo login/signup
- Campos animados: Name y Confirm Password aparecen/desaparecen en signup
- Submit llama `mockLogin`/`mockSignup` y dispatcha `loginSuccess`/`loginError`
- Loading state, error display, reduced motion support

**OAuthButtons** (`src/ui/organisms/Auth/Form/OAuthButtons.tsx`):
- 3 botones: LinkedIn, Microsoft, Google con aria-labels
- **PROBLEMA:** Importa desde barrel `@/icons` — contamina chunk con 58+ icons
- Callback `onOAuthClick` opcional (actualmente no wired)

**LoginForm.tsx y SignupForm.tsx** (LEGACY):
- Versiones standalone pre-unificación
- Solo exportados en `Form/index.ts` barrel
- **NO son usados** por ningún componente — AuthModal usa `AuthForm` directamente
- Dead code que debe eliminarse

**Auth wrapper** (`src/ui/organisms/Auth/index.tsx`):
- Wrapper simple que renderiza `AuthModal` e importa `styles.css`
- Lazy-loaded en root `layout.jsx` con `ssr: false`

### Bug: `onClick={close}` en AuthModal

```typescript
// Línea 106 y 160 de AuthModal.tsx
<button className="auth-close" onClick={close} aria-label="Close dialog">
```

`close` no existe en el scope del componente. La destructuración del hook es:
```typescript
const { isOpen, isAuthenticated, user, closeAuthPanel, logout } = useAuthPanel();
```

En runtime, `close` podría resolverse a `window.close()` (cierra el tab!) o ser `undefined`. Fix: `onClick={closeAuthPanel}`.

### Barrel Import Contamination en OAuthButtons

```typescript
// OAuthButtons.tsx:3 — CONTAMINA CHUNK
import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

// FIX → Direct path imports
import LinkedInIcon from "@/atoms/icons/LinkedInIcon";
import MicrosoftIcon from "@/atoms/icons/MicrosoftIcon";
import GooglePlusIcon from "@/atoms/icons/GooglePlusIcon";
```

Este pattern fue documentado como CRÍTICO en la memoria del proyecto. La barrel `@/atoms/icons/index.js` tiene 58+ re-exports que previenen tree-shaking.

### Mocking Strategy para Tests

**Framer Motion** — Los componentes usan `motion.div`, `AnimatePresence`, `layoutId`. Para tests unitarios:
```typescript
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));
```

**useAuthPanel** — Mock con jest.fn() para cada acción:
```typescript
jest.mock("@/state/slices", () => ({
  useAuthPanel: jest.fn(),
}));
```

**useReducedMotion** — Simple boolean mock:
```typescript
jest.mock("@/hooks", () => ({
  useReducedMotion: () => false,
}));
```

**Icons** — Mock como SVG simples (evitar barrel import en tests):
```typescript
jest.mock("@/atoms/icons/LinkedInIcon", () => ({
  __esModule: true,
  default: (props) => <svg data-testid="linkedin-icon" {...props} />,
}));
```

### Architecture Compliance

| Requisito | Estado | Acción |
|-----------|--------|--------|
| TypeScript strict | OK | Todos los archivos auth son .ts/.tsx |
| Barrel import clean | FALTA | OAuthButtons usa @/icons barrel |
| Dead code free | FALTA | LoginForm.tsx + SignupForm.tsx legacy |
| Bug free | FALTA | close button bug |
| Test coverage | FALTA | 0 component tests |
| WCAG 2.1 AA | OK | role, aria-modal, aria-labelledby, focus trap, Escape |
| Reduced motion | OK | useReducedMotion condiciona todas las animaciones |

### File Structure (Target)

```
src/ui/organisms/Auth/
├── index.tsx              # NO CHANGE
├── AuthModal.tsx          # MODIFY - fix close button bug
├── styles.css             # NO CHANGE
├── __tests__/
│   ├── AuthModal.test.tsx # NEW - modal tests
│   ├── AuthForm.test.tsx  # NEW - form tests
│   └── OAuthButtons.test.tsx # NEW - OAuth button tests
└── Form/
    ├── index.ts           # MODIFY - remove LoginForm, SignupForm exports
    ├── AuthForm.tsx        # NO CHANGE
    ├── OAuthButtons.tsx    # MODIFY - fix barrel import
    ├── LoginForm.tsx       # DELETE
    └── SignupForm.tsx      # DELETE
```

### Testing Standards

- Test framework: Jest + React Testing Library
- Test file pattern: `__tests__/*.test.tsx`
- Para component tests: usar `render` + `screen` + `fireEvent`/`userEvent`
- Para hooks: mock via `jest.mock` (no renderHook needed — hooks consumed via components)
- Framer Motion: mock como passthrough elements
- Icons: mock como SVG simples con data-testid

### Barrel Import Warning (CRÍTICO)

**NO importar icons desde barrel** (`@/icons` o `@/atoms/icons`). Usar paths directos.
**OAuthButtons.tsx es violator activo** — debe corregirse en esta story.

### Previous Story Intelligence

**Story 16.1 estableció:**
- Hooks semánticos (`useAuth`, `useUser`, `useIsAuthenticated`) en `src/hooks/auth/`
- AuthUser consolidado en `src/services/auth/types.ts`
- 24 tests: slice (9), mock (5), hooks (10)
- Pattern: `renderHook` con Redux Provider wrapper para hook tests
- Pattern: action creators importados (no string types) en tests
- JSDoc obligatorio cuando API puede confundir

**Learnings aplicables:**
- Jest mock hoisting: `jest.mock()` se hoistea sobre variable declarations
- Cuando se mockea imports directos (no barrels), agregar `__esModule: true` en factory
- Inline factory functions directamente en `jest.mock()` calls

### Project Context Reference

- **CLAUDE.md**: "State Management Split", "Testing Conventions", "Import Aliases"
- **Jest config**: `jest.config.cjs`
- **Store config**: `src/state/stores/ReduxStore/index.ts`
- **Hooks barrel**: `src/hooks/index.ts`
- **Auth state**: `src/state/slices/authPanel/` (slice.ts, hooks.ts)
- **Auth service**: `src/services/auth/` (types.ts, mock.ts)
- **Auth UI**: `src/ui/organisms/Auth/` (AuthModal.tsx, Form/)
- **Layout integration**: `src/app/layout.jsx` → `dynamic(() => import("@/organisms/Auth"), { ssr: false })`

### References

- [Source: _bmad-output/planning-artifacts/epic-16-auth-system.md#Story 16.2]
- [Source: _bmad-output/planning-artifacts/epic-16-header-navbar-refactor.md#Story 16.4-16.6]
- [Source: _bmad-output/implementation-artifacts/16-1-auth-state-management.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/ux-design-behavior/spec.md#Section 3]
- [Source: CLAUDE.md#Testing Conventions]
- [Source: CLAUDE.md#Import Aliases]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- typecheck passed after Task 1 (bug fix + barrel import + dead code cleanup)
- build passed after Task 1 (no new icon chunk introduced)
- 27 new tests all pass (3 test suites: AuthModal 15, AuthForm 8, OAuthButtons 4)
- Full suite: 863 tests pass, 0 failures
- Build passes with next-sitemap postbuild
- Lint: 0 new errors (2 pre-existing in unrelated files)

### Completion Notes List

- Fixed `onClick={close}` bug in AuthModal.tsx — `close` was undefined (potentially calling `window.close()`), replaced with `closeAuthPanel`
- Fixed barrel import contamination in OAuthButtons.tsx — replaced `@/icons` barrel with direct path imports for LinkedInIcon, MicrosoftIcon, GooglePlusIcon
- Deleted legacy `LoginForm.tsx` and `SignupForm.tsx` — superseded by unified `AuthForm.tsx`, confirmed zero external consumers
- Updated `Form/index.ts` barrel to remove dead exports
- Created 27 unit tests across 3 test files covering modal rendering, interactions, a11y, form validation, and OAuth buttons
- Tests use centralized `@/test-utils/framer-motion-mock` for consistent motion mocking (preexisting utility)
- Verified all a11y attributes: role="dialog", aria-modal="true", aria-labelledby, focus trap, Escape key, reduced motion
- No regressions: 863 total tests pass (836 pre-existing + 27 new)

#### Code Review Fixes (AI)
- Added 2 Escape key tests (unauthenticated + authenticated views) — AC7 coverage gap
- Added `role="alert"` to error container in AuthForm.tsx — WCAG 4.1.3 status messages
- Fixed `colored` prop leak in OAuthButtons.test.tsx mocks — eliminated React unknown prop warning

### File List

#### Created
- `src/ui/organisms/Auth/__tests__/AuthModal.test.tsx` - Modal tests (15 tests)
- `src/ui/organisms/Auth/__tests__/AuthForm.test.tsx` - Form tests (8 tests)
- `src/ui/organisms/Auth/__tests__/OAuthButtons.test.tsx` - OAuth button tests (4 tests)

#### Modified
- `src/ui/organisms/Auth/AuthModal.tsx` - Fixed `onClick={close}` → `onClick={closeAuthPanel}` (2 occurrences)
- `src/ui/organisms/Auth/Form/AuthForm.tsx` - Added `role="alert"` to error container (code review fix)
- `src/ui/organisms/Auth/Form/OAuthButtons.tsx` - Replaced barrel import with direct path imports
- `src/ui/organisms/Auth/Form/index.ts` - Removed LoginForm and SignupForm exports

#### Deleted
- `src/ui/organisms/Auth/Form/LoginForm.tsx` - Legacy standalone login form (superseded by AuthForm)
- `src/ui/organisms/Auth/Form/SignupForm.tsx` - Legacy standalone signup form (superseded by AuthForm)

## Change Log

| Date | Change |
|------|--------|
| 2026-02-08 | Story created (adaptada) with comprehensive dev context |
| 2026-02-08 | Story completed - all 5 tasks done, 25 tests added, bug fixed, dead code removed, status → review |
| 2026-02-08 | Code review fixes: +2 Escape key tests, role="alert" on errors, colored prop mock fix. 27 total tests, 863 suite. status → done |
