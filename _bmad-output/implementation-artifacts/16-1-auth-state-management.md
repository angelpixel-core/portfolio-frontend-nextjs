# Story 16.1: Auth State Management (Adaptada)

Status: done

<!-- Note: Story adaptada - el 90% de la infraestructura ya existe del trabajo previo en Epic 16 Header/NavBar Refactor. -->
<!-- Esta story cierra gaps específicos vs los FRs del epic y agrega hooks semánticos + tests. -->

## Story

As a desarrollador,
I want hooks semánticos de auth (`useAuth`, `useUser`, `useIsAuthenticated`) y tests unitarios para la capa de estado,
so that cualquier componente pueda consumir estado de sesión con una API clara, tipada y verificada.

## Acceptance Criteria

### AC1: Hooks semánticos de auth
- [x] `useAuth()` hook que expone: `isAuthenticated`, `user`, `login`, `logout`, `error`, `clearError`
- [x] `useUser()` hook que retorna `AuthUser | null` directamente
- [x] `useIsAuthenticated()` hook que retorna `boolean` directamente
- [x] Los 3 hooks deben ser re-exports tipados que usan `useAuthPanel` internamente
- [x] Exportados desde `@/hooks` barrel (o path dedicado `@/hooks/auth`)

### AC2: Tipo AuthUser alineado con Epic 16 scope
- [x] `AuthUser` tiene al mínimo: `email: string`, `name?: string`
- [x] El tipo `AuthUser` está definido en UN solo lugar canónico (actualmente duplicado en `slice.ts` y `services/auth/types.ts`)
- [x] Consolidar la fuente de verdad: `src/services/auth/types.ts` es el canónico, `slice.ts` re-importa desde ahí

### AC3: Tests unitarios del auth state
- [x] Tests para `authPanelSlice` reducers: loginSuccess, loginError, logout, clearError, open/close
- [x] Tests para `useAuthPanel` hook (o sus aliases semánticos)
- [x] Tests para mock auth service: mockLogin, mockSignup, mockLogout
- [x] Todos los tests pasan con `npm test`

### AC4: Limpieza de exports duplicados
- [x] Eliminar `AuthUser` interface duplicada de `slice.ts` (importar desde `@/services/auth/types`)
- [x] Verificar que todos los consumidores (`AuthModal`, `AuthForm`, `AuthButton`) siguen funcionando
- [x] `npm run build` pasa sin errores

## Tasks / Subtasks

- [x] Task 1: Consolidar tipo AuthUser (AC2, AC4)
  - [x] Mover fuente de verdad de `AuthUser` a `src/services/auth/types.ts` (ya existe ahí)
  - [x] En `src/state/slices/authPanel/slice.ts`: reemplazar `interface AuthUser` por `import { AuthUser } from "@/services/auth/types"`
  - [x] Verificar que todos los archivos que importan `AuthUser` desde `./slice` siguen funcionando
  - [x] Run `npm run typecheck`

- [x] Task 2: Crear hooks semánticos (AC1)
  - [x] Crear `src/hooks/auth/useAuth.ts` que wrappea `useAuthPanel` con API simplificada
  - [x] Crear `src/hooks/auth/useUser.ts` → retorna solo `user`
  - [x] Crear `src/hooks/auth/useIsAuthenticated.ts` → retorna solo `boolean`
  - [x] Exportar desde `src/hooks/index.ts`
  - [x] Run `npm run typecheck`

- [x] Task 3: Tests unitarios (AC3)
  - [x] Crear `src/state/slices/authPanel/__tests__/slice.test.ts`
  - [x] Crear `src/services/auth/__tests__/mock.test.ts`
  - [x] Crear `src/hooks/auth/__tests__/useAuth.test.tsx`
  - [x] Run `npm test`

- [x] Task 4: Verificación final
  - [x] `npm run typecheck` pasa
  - [x] `npm test` pasa (836 tests, +24 nuevos)
  - [x] `npm run build` pasa
  - [x] `npm run lint` pasa (2 errores pre-existentes en archivos no tocados)

## Dev Notes

### Estado Actual del Código (Pre-Story)

La infraestructura de auth ya existe del trabajo previo en Epic 16 Header/NavBar Refactor:

**Redux slice** (`src/state/slices/authPanel/`):
- `slice.ts`: State completo con `isOpen`, `isAuthenticated`, `user`, `error`
- `hooks.ts`: `useAuthPanel()` con todos los selectores y dispatchers
- Registrado en Redux store, funcional

**Mock service** (`src/services/auth/`):
- `types.ts`: `AuthUser`, `AuthResult`, `LoginCredentials`, `SignupCredentials`
- `mock.ts`: `mockLogin`, `mockSignup`, `mockLogout` con delay simulado
- Credenciales mock: `user@test.com` / `password123`

**UI ya integrada**:
- `AuthButton` en NavBar (triangular neumorphic)
- `AuthModal` con tabs Login/Signup + OAuth buttons
- `AuthForm` con validación y animaciones
- `<Auth />` en root layout (lazy-loaded, SSR disabled)

### Problema: AuthUser Duplicado

`AuthUser` interface está definida en DOS lugares:
1. `src/state/slices/authPanel/slice.ts:7-10` — `{ email: string; name?: string }`
2. `src/services/auth/types.ts:1-4` — `{ email: string; name?: string }`

Son idénticas pero violan DRY. La fuente canónica debe ser `services/auth/types.ts` (domain types).

### Problema: No hay hooks semánticos

El epic pide `useAuth`, `useUser`, `useIsAuthenticated`. Solo existe `useAuthPanel` que mezcla UI panel state (isOpen) con auth state (isAuthenticated, user). Los hooks semánticos separan estas preocupaciones:

```typescript
// useAuth: estado de auth sin UI panel concern
const { isAuthenticated, user, login, logout } = useAuth();

// useUser: acceso directo al usuario
const user = useUser(); // AuthUser | null

// useIsAuthenticated: guard simple
const isAuthenticated = useIsAuthenticated(); // boolean
```

### Problema: Zero tests para auth

No existe ningún test para:
- Auth slice reducers
- Mock auth service
- Auth hooks

Esto es deuda que debe cerrarse antes de tocar la funcionalidad en stories posteriores.

### Architecture Compliance

| Requisito | Estado | Acción |
|-----------|--------|--------|
| TypeScript strict | OK | Todos los archivos auth ya son .ts/.tsx |
| Redux para UI state | OK | authPanel slice en `src/state/slices/` |
| Domain types | PARCIAL | AuthUser duplicado, consolidar |
| Hook pattern | PARCIAL | Falta hooks semánticos en `src/hooks/` |
| Test coverage | FALTA | 0 tests → crear suite completa |

### File Structure (Target)

```
src/
├── hooks/
│   ├── auth/
│   │   ├── useAuth.ts          # NEW - semantic auth hook
│   │   ├── useUser.ts          # NEW - user-only hook
│   │   ├── useIsAuthenticated.ts # NEW - boolean guard hook
│   │   ├── index.ts            # NEW - auth barrel
│   │   └── __tests__/
│   │       └── useAuth.test.tsx # NEW - hook tests
│   └── index.ts            # UPDATE - add auth exports
├── state/slices/authPanel/
│   ├── slice.ts            # MODIFY - import AuthUser from services
│   ├── hooks.ts            # NO CHANGE
│   ├── index.ts            # NO CHANGE
│   └── __tests__/
│       └── slice.test.ts   # NEW - reducer tests
└── services/auth/
    ├── types.ts            # NO CHANGE (canonical AuthUser)
    ├── mock.ts             # NO CHANGE
    ├── index.ts            # NO CHANGE
    └── __tests__/
        └── mock.test.ts    # NEW - service tests
```

### Testing Standards

- Test framework: Jest + React Testing Library
- Test file pattern: `__tests__/*.test.ts` / `__tests__/*.test.tsx`
- Para reducer tests: test puro sin RTL (solo dispatch y assert state)
- Para hook tests: usar `renderHook` de `@testing-library/react` con Redux provider wrapper
- Para mock service: test puro async/await

### Barrel Import Warning

**NO importar icons desde barrel** (`@/icons`). Usar paths directos.
Esto NO aplica a esta story (no toca icons), pero registrar para referencia del dev agent.

### Project Context Reference

- **CLAUDE.md**: Secciones relevantes → "State Management Split", "Testing Conventions", "Import Aliases"
- **Jest config**: `jest.config.cjs`
- **Store config**: `src/state/stores/ReduxStore/index.ts`
- **Hooks barrel**: `src/hooks/index.ts`

### Previous Story Intelligence

**Epic 15 Retrospective Key Decisions para Epic 16:**
- OAuth Provider: Google first, diseño provider-agnostic
- Token Storage: httpOnly cookie (Rails como owner)
- E2E Testing: Mock OAuth callback
- Scope: Captura mínima de identidad (email + nombre), NO user management completo

**Patrones establecidos en Epic 15:**
- Small stories (30min-3h) → ciclos rápidos
- Code reviews adversariales → issues reales
- TypeScript migration sin breaking changes

### Git Intelligence

Últimos commits relevantes:
```
211de63 docs: improve CLAUDE.md with env vars, CI/CD, perf config, and barrel import warning
291f720 fix(ci): set PROFILE_EMAIL env var in e2e job to suppress warning
abe0aae perf(js): eliminate barrel imports to remove chunk 514 (~50 KiB savings)
```

Patrón de commits: `type(scope): description` — seguir esta convención.

### References

- [Source: _bmad-output/planning-artifacts/epic-16-auth-system.md#Story 16.1]
- [Source: src/state/slices/authPanel/ - Existing auth state implementation]
- [Source: src/services/auth/ - Existing mock auth service]
- [Source: _bmad-output/implementation-artifacts/epic-15-retro-2026-02-08.md#Key Decisions for Epic 16]
- [Source: CLAUDE.md#State Management Split]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- typecheck passed after Task 1 (AuthUser consolidation)
- typecheck passed after Task 2 (semantic hooks creation)
- 24 new tests all pass (3 test suites: slice, mock, hooks)
- Full suite: 836 tests pass, 0 failures
- Build passes with next-sitemap postbuild
- Lint: 0 new errors (2 pre-existing in unrelated files)

### Completion Notes List

- Consolidated `AuthUser` type: removed duplicate from `slice.ts`, now imports from `@/services/auth/types` with `export type` re-export for backward compatibility
- Created 3 semantic hooks in `src/hooks/auth/`: `useAuth` (full auth API without panel concerns), `useUser` (user-only), `useIsAuthenticated` (boolean guard)
- Hooks follow existing project pattern: subdirectory with barrel, re-exported from main hooks barrel
- Created 24 unit tests across 3 test files covering all reducers, mock service functions, and hook behavior
- Hook tests use `renderHook` with Redux Provider wrapper, following RTL patterns
- No regressions: 836 total tests pass (812 pre-existing + 24 new)

### File List

#### Created
- `src/hooks/auth/useAuth.ts` - Semantic auth hook wrapping useAuthPanel
- `src/hooks/auth/useUser.ts` - User-only convenience hook
- `src/hooks/auth/useIsAuthenticated.ts` - Boolean auth guard hook
- `src/hooks/auth/index.ts` - Auth hooks barrel export
- `src/hooks/auth/__tests__/useAuth.test.tsx` - Tests for all 3 semantic hooks (10 tests)
- `src/state/slices/authPanel/__tests__/slice.test.ts` - Redux slice reducer tests (9 tests)
- `src/services/auth/__tests__/mock.test.ts` - Mock auth service tests (5 tests)

#### Modified
- `src/state/slices/authPanel/slice.ts` - Replaced local AuthUser interface with import from @/services/auth/types
- `src/hooks/index.ts` - Added auth barrel re-export

## Change Log

| Date | Change |
|------|--------|
| 2026-02-08 | Story created (adaptada) with comprehensive dev context |
| 2026-02-08 | Story completed - all 4 tasks done, 24 tests added, status → review |
| 2026-02-08 | Code review findings addressed: JSDoc clarification, action creators in tests, commit created |
