# Story 23.3: Safe Barrels en Lib, Domains, Hooks y State

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

Como **arquitecto del proyecto**,
quiero **asegurar que los barrels fuera de la capa UI (lib, domains, hooks, state) usan solo patrones seguros**,
para que **la organización de imports sea cómoda sin penalizar el rendimiento**.

## Acceptance Criteria

1. **AC1: Inventario completo** — Existe un inventario documentado de todos los barrels en `src/lib/`, `src/domains/`, `src/hooks/`, `src/state/`, `src/services/`, `src/providers/`, y `src/ui/shared/` con: ruta, cantidad de exports, tipo de export, consumers, y estado.
2. **AC2: Eliminación de `export *`** — Ningún barrel en hooks/ o state/ usa `export *` para re-exportar desde sub-barrels. Convertidos a named re-exports explícitos. Domains pueden conservar `export *` (aceptable para server-side).
3. **AC3: Sin cascading** — No hay barrels en hooks/ o state/ que reempaqueten otros barrels via `export *` encadenado.
4. **AC4: shared/skeletons limpio** — `src/ui/shared/skeletons/index.ts` convertido de `export *` a named exports (único `export *` restante en UI de Story 23.2).
5. **AC5: Documentación actualizada** — `docs/architecture/import-rules.md` actualizada con lista de barrels "permitidos" (safe) y su propósito.
6. **AC6: Lint, typecheck y tests pasan** — `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` pasan sin nuevos errores.

## Tasks / Subtasks

- [ ] Task 1: Generar inventario de barrels fuera de UI (AC: #1)
  - [ ] Listar todos los `index.ts`/`index.js` en `src/hooks/`, `src/state/`, `src/lib/`, `src/domains/`, `src/services/`, `src/providers/`
  - [ ] Clasificar tipo de export: `export *` vs named re-exports
  - [ ] Contar consumers de cada barrel via grep
  - [ ] Documentar inventario en Dev Notes
- [ ] Task 2: Convertir `export *` en hooks root barrel (AC: #2, #3)
  - [ ] `src/hooks/index.ts`: convertir 4 `export *` a ~19 named re-exports explícitos
  - [ ] Verificar exports exactos de sub-barrels: `store/` (2), `ui/` (4), `domains/` (15), `auth/` (3)
  - [ ] Añadir JSDoc descriptivo (ya tiene JSDoc — actualizar si necesario)
  - [ ] Ejecutar `npm run lint` y `npm test` después del cambio
- [ ] Task 3: Convertir `export *` en state root barrel (AC: #2, #3)
  - [ ] `src/state/index.ts`: convertir 3 `export *` a named re-exports explícitos
  - [ ] Verificar exports de `stores/` (1 default + 2 types), `slices/` (ver Task 4), `providers/` (5 defaults)
  - [ ] Ejecutar `npm run lint` y `npm test`
- [ ] Task 4: Convertir `export *` en state/slices barrel y sub-barrels (AC: #2, #3)
  - [ ] `src/state/slices/index.ts`: convertir 5 `export *` a named re-exports
  - [ ] `src/state/slices/authPanel/index.ts`: convertir `export * from "./slice"` a named exports (actions + types)
  - [ ] `src/state/slices/chatPanel/index.ts`: idem
  - [ ] `src/state/slices/menuPanel/index.ts`: idem
  - [ ] `src/state/slices/themeMode/index.ts`: idem
  - [ ] `src/state/slices/EmailClipboard/index.ts`: ya usa named exports — verificar solamente
  - [ ] Ejecutar `npm run lint` y `npm test` después de cada cambio
- [ ] Task 5: Limpiar shared/skeletons barrel (AC: #4)
  - [ ] `src/ui/shared/skeletons/index.ts`: convertir `export * from "./skeletons"` a 3 named exports (`MenuResponsiveSkeleton`, `ArticleSkeleton`, `FeaturedArticleSkeleton`)
  - [ ] Ejecutar `npm run lint` y `npm test`
- [ ] Task 6: Verificar barrels safe y documentar (AC: #1, #5)
  - [ ] `src/lib/index.ts` (1 export): safe
  - [ ] `src/lib/seo/index.ts` (3 exports): safe
  - [ ] `src/lib/httpRequest/index.ts` (1 export): safe
  - [ ] `src/lib/social-urls/index.ts` (8 exports): safe — borderline pero módulo cohesivo
  - [ ] `src/providers/index.ts` (1 export): safe
  - [ ] `src/services/auth/index.ts`: tiene `export *` para types/mocks — documentar como aceptable
  - [ ] Domains: tienen `export *` interno — documentar como aceptable (server-side pattern)
  - [ ] Actualizar `docs/architecture/import-rules.md` con sección "Safe Barrels List"
- [ ] Task 7: Ejecutar suite de validación completa (AC: #6)
  - [ ] `npm run lint` — sin errores
  - [ ] `npm run typecheck` — sin errores
  - [ ] `npm test` — all passed
  - [ ] `npm run build` — build exitoso

## Dev Notes

### Contexto del Epic

Story 23.3 es parte de **Epic 23: Barrel File Cleanup**. Stories 23.1 (Icons) y 23.2 (UI Barrels) están completadas. Esta story limpia los barrels fuera de la capa UI.

### Inventario de Barrels Non-UI (Pre-audit)

#### Hooks Layer (`src/hooks/`)

| Ruta | Exports | Tipo | Consumers | Estado |
|------|---------|------|-----------|--------|
| `src/hooks/index.ts` | ~19 (cascading) | 4 `export *` | 0 en UI/App (ESLint protege) | CRITICAL — convertir |
| `src/hooks/store/index.ts` | 2 | named defaults | interno | Safe |
| `src/hooks/ui/index.ts` | 4 | named exports | interno | Safe |
| `src/hooks/domains/index.ts` | 15 | named re-exports | interno | Safe (>10 pero cohesivo) |
| `src/hooks/auth/index.ts` | 3 | named defaults | interno | Safe |
| `src/hooks/store/AppDispatch/index.ts` | 1 | default | interno | Safe |
| `src/hooks/store/AppSelector/index.ts` | 1 | default | interno | Safe |

**Cadena de cascading actual:**
```
@/hooks (root) ← 4 export *
├── export * from "./store"    → useAppDispatch, useAppSelector (2)
├── export * from "./ui"       → useReducedMotion, useScrollAppearance, useTouchState, useTransition (4)
├── export * from "./domains"  → useProfile, useProfiles, useContent, useContents, useNavigationItems,
│                                 useTechnologies, useProjects, useArticle, useArticles,
│                                 useJobExperiences, useAcademics, useExperienceStats,
│                                 useCustomer, useCustomers, useContactPoints (15)
└── export * from "./auth"     → useAuth, useUser, useIsAuthenticated (3)
```

**Total transitive: ~24 exports** — Convertir a named re-exports.

#### State Layer (`src/state/`)

| Ruta | Exports | Tipo | Consumers | Estado |
|------|---------|------|-----------|--------|
| `src/state/index.ts` | ~30+ (cascading) | 3 `export *` | ~40 archivos | CRITICAL — convertir |
| `src/state/stores/index.ts` | 3 (1 default + 2 types) | named | interno | Safe |
| `src/state/stores/ReduxStore/index.ts` | 3 | default + types | interno | Safe |
| `src/state/slices/index.ts` | ~20+ (cascading) | 5 `export *` | interno | CRITICAL — convertir |
| `src/state/slices/authPanel/index.ts` | ~8 | `export *` + 2 named | interno | Convertir `export *` |
| `src/state/slices/chatPanel/index.ts` | ~5 | `export *` + 2 named | interno | Convertir `export *` |
| `src/state/slices/menuPanel/index.ts` | ~5 | `export *` + 2 named | interno | Convertir `export *` |
| `src/state/slices/themeMode/index.ts` | ~6 | `export *` + 2 named | interno | Convertir `export *` |
| `src/state/slices/EmailClipboard/index.ts` | 10 | named exports | interno | Safe (ya sin `export *`) |
| `src/state/providers/index.ts` | 5 | named defaults | interno | Safe |
| `src/state/adapters/index.ts` | 1 | named | interno | Safe |

**Exports de cada slice (lo que `export *` propaga):**

`authPanel/slice.ts`:
- `type AuthUser`, `interface AuthPanelState`, `getInitialAuthState()`, destructured actions (openAuthPanel, closeAuthPanel, setAuthUser, clearAuthUser, setAuthError, clearAuthError, setAuthLoading), `default` reducer

`chatPanel/slice.ts`:
- `interface ChatPanelState`, destructured actions (openChatPanel, closeChatPanel, toggleChatPanel), `default` reducer

`menuPanel/slice.ts`:
- `interface MenuPanelState`, destructured actions (openMenuPanel, closeMenuPanel, toggleMenuPanel), `default` reducer

`themeMode/slice.ts`:
- `type ThemeMode`, `interface ThemeModeState`, `getInitialTheme()`, destructured actions (setThemeLight, setThemeDark, toggleThemeMode), `default` reducer

#### Lib Layer (`src/lib/`)

| Ruta | Exports | Tipo | Consumers | Estado |
|------|---------|------|-----------|--------|
| `src/lib/index.ts` | 1 | named default | ~45 archivos | Safe |
| `src/lib/seo/index.ts` | 3 | named exports | minimal | Safe |
| `src/lib/httpRequest/index.ts` | 1 | default | interno | Safe |
| `src/lib/social-urls/index.ts` | 8 | named + default | minimal | Safe (cohesivo) |

#### Services Layer (`src/services/`)

| Ruta | Exports | Tipo | Consumers | Estado |
|------|---------|------|-----------|--------|
| `src/services/auth/index.ts` | mixed | `export *` (types/mocks) + named | ~14 archivos | Documentar como aceptable |

#### Providers Layer (`src/providers/`)

| Ruta | Exports | Tipo | Consumers | Estado |
|------|---------|------|-----------|--------|
| `src/providers/index.ts` | 1 | named default | minimal | Safe |

#### Shared UI (`src/ui/shared/`)

| Ruta | Exports | Tipo | Consumers | Estado |
|------|---------|------|-----------|--------|
| `src/ui/shared/skeletons/index.ts` | 3 (cascading) | `export *` | interno | Convertir (último `export *` en UI) |

**Exports de `skeletons.tsx`:** `MenuResponsiveSkeleton`, `ArticleSkeleton`, `FeaturedArticleSkeleton`

#### Domains Layer (`src/domains/`)

Los ~24 barrels de domains usan `export * from "./model"` + `export * from "./queries"`. Esto es aceptable:
- No se consumen desde UI/App directamente (los hooks de `@/hooks/domains` importan desde `@/domains/*/queries` directamente)
- Patrón de DDD: model + queries son la API pública del domain
- Server-side primarily — no afecta tree-shaking de client bundles
- **Decisión: Documentar como "safe pattern" en import-rules.md**

### Decisión Técnica: Hooks Root Barrel

**Problema:** `src/hooks/index.ts` tiene 4 `export *` que propagan ~24 hooks.

**Solución:** Convertir a named re-exports explícitos:
```typescript
// ❌ ANTES (cascading export *)
export * from "./store";
export * from "./ui";
export * from "./domains";
export * from "./auth";

// ✅ DESPUÉS (named re-exports, ~24 exports)
// Store (2)
export { default as useAppDispatch } from "./store/AppDispatch";
export { default as useAppSelector } from "./store/AppSelector";

// UI (4)
export { useReducedMotion } from "./ui/useReducedMotion";
export { useScrollAppearance } from "./ui/useScrollAppearance";
export { useTouchState } from "./ui/useTouchState";
export { useTransition } from "./ui/useTransition";

// Domains (15)
export { useProfile, useProfiles } from "@/domains/profile/queries";
// ... (same as current hooks/domains/index.ts)

// Auth (3)
export { default as useAuth } from "./auth/useAuth";
export { default as useUser } from "./auth/useUser";
export { default as useIsAuthenticated } from "./auth/useIsAuthenticated";
```

**Nota:** El hooks root barrel tiene ~24 exports (> 15), pero ya está protegido por ESLint en UI/App. El propósito es eliminar `export *` y cascading, no reducir el tamaño del barrel. Los sub-barrels (`store/`, `ui/`, `auth/`) son safe y se mantienen.

### Decisión Técnica: State Slice Barrels

**Problema:** 4 slice barrels (authPanel, chatPanel, menuPanel, themeMode) usan `export * from "./slice"` que propaga types, interfaces, helper functions, y actions además del reducer.

**Solución:** Reemplazar `export *` por named exports explícitos de lo que realmente se necesita:

```typescript
// ❌ ANTES (authPanel/index.ts)
export * from "./slice";  // propaga AuthUser, AuthPanelState, getInitialAuthState, 7+ actions, default reducer
export { default as authPanelReducer } from "./slice";
export { default as useAuthPanel } from "./hooks";

// ✅ DESPUÉS
export {
  openAuthPanel,
  closeAuthPanel,
  setAuthUser,
  clearAuthUser,
  setAuthError,
  clearAuthError,
  setAuthLoading,
} from "./slice";
export { default as authPanelReducer } from "./slice";
export { default as useAuthPanel } from "./hooks";
export type { AuthPanelState } from "./slice";
export type { AuthUser } from "./slice";
```

**Patrón para cada slice:** Exportar explícitamente: actions, reducer (default as), hook (default as), types/interfaces.

### Decisión Técnica: State Root Barrel

**Problema:** `src/state/index.ts` tiene 3 `export *` que propagan todo de stores, slices, providers.

**Solución:** Convertir a named re-exports. Dado que los sub-barrels (stores, providers) ya usan named exports, y slices será convertido en Task 4, el root solo necesita re-exportar:

```typescript
// ✅ DESPUÉS
// Stores
export { default as ReduxStore } from "./stores/ReduxStore";
export type { RootState, AppDispatch } from "./stores/ReduxStore";

// Providers
export { default as ReduxProvider } from "./providers/ReduxProvider";
export { default as ReactQueryProvider } from "./providers/ReactQueryProvider";
export { default as AuthProvider } from "./providers/AuthProvider";
export { default as ThemeProvider } from "./providers/ThemeProvider";
export { default as TransitionProvider } from "./providers/TransitionProvider";

// Slices — re-export from sub-barrels (ya convertidos)
export { authPanelReducer, useAuthPanel } from "./slices/authPanel";
export { chatPanelReducer, useChatPanel } from "./slices/chatPanel";
// ... etc
```

### Decisión Técnica: Domains — Conservar `export *`

Los barrels de domains son aceptables con `export *` porque:
1. **Patrón DDD**: model + queries son la API pública completa del domain
2. **No afectan UI bundles**: consumidos vía hooks, no directamente en componentes
3. **Cohesivos**: cada domain barrel tiene < 10 exports en total
4. **Server-side oriented**: React Query hooks ejecutan en boundary de servidor

**Decisión: Documentar como "Safe Domain Pattern" en import-rules.md. No modificar.**

### ESLint Protection Status

**Ya protegidos (severity: `error`):**
`@/atoms`, `@/buttons`, `@/icons`, `@/links`, `@/texts`, `@/molecules`, `@/organisms`, `@/overlays`, `@/hooks`

**No protegidos pero safe (no requieren protección):**
- `@/lib` — 1 export, safe
- `@/providers` — 1 export, safe
- `@/state` — Será protegido si se identifica uso en UI/App (verificar en Task 1)
- `@/domains/*` — No consumidos directamente en UI/App
- `@/services/*` — Bajo impacto

### Archivos a Modificar

| Archivo | Acción | Cambio |
|---------|--------|--------|
| `src/hooks/index.ts` | MODIFY | 4 `export *` → ~24 named re-exports |
| `src/state/index.ts` | MODIFY | 3 `export *` → named re-exports |
| `src/state/slices/index.ts` | MODIFY | 5 `export *` → named re-exports |
| `src/state/slices/authPanel/index.ts` | MODIFY | `export *` → named exports |
| `src/state/slices/chatPanel/index.ts` | MODIFY | `export *` → named exports |
| `src/state/slices/menuPanel/index.ts` | MODIFY | `export *` → named exports |
| `src/state/slices/themeMode/index.ts` | MODIFY | `export *` → named exports |
| `src/ui/shared/skeletons/index.ts` | MODIFY | `export *` → 3 named exports |
| `docs/architecture/import-rules.md` | MODIFY | Añadir "Safe Barrels List" |

### Patrón de Conversión (de Stories 23.1/23.2)

```typescript
// Para defaults:
export { default as ComponentName } from "./ComponentName";

// Para named exports:
export { functionName, anotherFunction } from "./module";

// Para types:
export type { TypeName, InterfaceName } from "./module";
```

### Lecciones de Stories 23.1 y 23.2

1. **File List debe distinguir Modified vs Referenced**
2. **JSDoc `@deprecated` convención:** `@deprecated Since YYYY-MM-DD (Story XX.X)` como texto libre — consistente con 23.1/23.2
3. **Commits:** `feat()` para código, `docs()` para story/planning, `chore()` para sprint-status
4. **Verificar export types exactos** antes de convertir (named vs default)
5. **Ejecutar tests después de cada cambio**
6. **atoms/index.ts bypasses sub-barrels** (importa directamente componentes) — misma estrategia posible para hooks/state si deseado

### Risk Assessment

- **Riesgo**: Bajo
- **Razón**: Los barrels en hooks/state están protegidos por ESLint en UI/App (0 consumers). Los cambios son en los barrel files internos.
- **Riesgo principal**: Slice barrels exportan actions que podrían importarse de formas inesperadas en tests o mocks.
- **Mitigación**: Verificar consumers de cada slice action antes de convertir. Ejecutar full test suite.

### Project Structure Notes

- **Alias de importación**: `@/hooks` → `src/hooks/index.ts`, `@/state` → `src/state/index.ts`
- **Dual aliases**: `@/hooks` (barrel) vs `@/hooks/*` (direct sub-path) — ambos disponibles
- **Domains**: Cada domain sigue patrón `model/` + `queries/` con barrel en root
- **State**: Redux Toolkit slices con patrón slice + hooks + barrel

### Referencias

- [Source: docs/architecture/import-rules.md#Barrel File Decision Matrix] — Reglas de safe vs unsafe
- [Source: docs/architecture/import-rules.md#Risk Zone: Hooks Barrel Chain] — Diagnóstico actual de hooks
- [Source: docs/architecture/import-rules.md#Risk Zone: State Barrel Chain] — Diagnóstico actual de state
- [Source: docs/architecture/import-rules.md#Domain Barrel Pattern] — Patrón aceptable para domains
- [Source: docs/architecture/folder-structure.md#Lib Layer] — Estructura de lib
- [Source: _bmad-output/implementation-artifacts/23-2-ui-barrel-audit-cleanup.md#Dev Notes] — Lecciones y patrones
- [Source: _bmad-output/implementation-artifacts/epic-23-barrel-file-cleanup.md#Story 23.3] — Requisitos del epic

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
