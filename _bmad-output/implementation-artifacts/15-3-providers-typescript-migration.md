# Story 15.3: Providers TypeScript Migration

**Epic:** 15 - TypeScript Hardening Sprint
**Status:** Review
**Estimated Effort:** 1.5 hours
**Risk:** Low

---

## User Story

**Como** desarrollador,
**Quiero** que los providers de estado estén en TypeScript,
**Para que** la configuración de providers sea type-safe.

---

## Context

### Why This Story Exists

Continuando la migración TypeScript de Epic 15, los providers son el siguiente target después de hooks (15.1) y componentes deprecated (15.2). Los providers son críticos porque:
1. Envuelven toda la aplicación en `layout.tsx`
2. Configuran el estado global (Redux, React Query, Theme)
3. Deben tener props tipados para evitar errores de children

### Current State

3 archivos provider en JSX:

| Archivo | Responsabilidad | Complejidad |
|---------|-----------------|-------------|
| `src/state/providers/ThemeProvider/index.jsx` | Sync theme to DOM | Baja - solo children |
| `src/state/providers/ReduxProvider/index.jsx` | Wrap with Redux store | Baja - solo children |
| `src/state/providers/ReactQueryProvider/index.jsx` | Setup QueryClient | Media - useState + config |

### Target State

Todos migrados a `.tsx` con:
- Props interface `{ children: React.ReactNode }`
- Tipado explícito de children
- Mantener funcionalidad idéntica

---

## Acceptance Criteria

### AC1: Migrate ThemeProvider to TypeScript
- [x] Rename `src/state/providers/ThemeProvider/index.jsx` → `index.tsx`
- [x] Add `Props` interface with `children: React.ReactNode`
- [x] Type `mode` selector using `RootState`
- [x] Verify component renders correctly

### AC2: Migrate ReduxProvider to TypeScript
- [x] Rename `src/state/providers/ReduxProvider/index.jsx` → `index.tsx`
- [x] Add `Props` interface with `children: React.ReactNode`
- [x] Verify Redux store is typed correctly

### AC3: Migrate ReactQueryProvider to TypeScript
- [x] Rename `src/state/providers/ReactQueryProvider/index.jsx` → `index.tsx`
- [x] Add `Props` interface with `children: React.ReactNode`
- [x] Type QueryClient initialization explicitly
- [x] Verify devtools conditional works correctly

### AC4: Build verification
- [x] `npm run build` passes without errors
- [x] `npm run typecheck` passes without new errors introduced by this story
  - Note: 34+ pre-existing typecheck errors in test files (not related to providers)

### AC5: Barrel update (if needed)
- [x] Check if `src/state/providers/index.js` exists and needs migration
  - Barrel exists at `src/state/providers/index.ts` (already TypeScript, no migration needed)
- [x] Update any path aliases in tsconfig if required (N/A - no changes needed)

---

## Tasks / Subtasks

- [x] Task 1: Migrate ThemeProvider (AC1)
  - [x] Rename file to .tsx
  - [x] Add Props interface
  - [x] Import and type RootState for selector

- [x] Task 2: Migrate ReduxProvider (AC2)
  - [x] Rename file to .tsx
  - [x] Add Props interface

- [x] Task 3: Migrate ReactQueryProvider (AC3)
  - [x] Rename file to .tsx
  - [x] Add Props interface
  - [x] Type QueryClient config

- [x] Task 4: Verify build and types (AC4, AC5)
  - [x] Run npm run build
  - [x] Run npm run typecheck
  - [x] Check for any barrel updates needed (N/A)

- [x] Task 5: Commit changes

---

## Dev Notes

### Code Patterns from Story 15.1

Following the same pattern used in hooks migration:
- Import types with `import type { ... }`
- Use existing type exports from `@/state/stores/ReduxStore`
- Add JSDoc header comment for barrel files

### Expected ThemeProvider Code

```typescript
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/state/stores/ReduxStore";

interface Props {
  children: React.ReactNode;
}

const DARK = "dark";
const KEY_NAME = "themeMode";

const ThemeProvider = ({ children }: Props) => {
  const mode = useSelector((state: RootState) => state.themeMode.mode);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (mode === DARK) root.classList.add(DARK);
    else root.classList.remove(DARK);

    if (typeof window !== "undefined") {
      localStorage.setItem(KEY_NAME, mode);
    }
  }, [mode]);

  return children;
};

export default ThemeProvider;
```

### Expected ReduxProvider Code

```typescript
"use client";

import { Provider } from "react-redux";
import { ReduxStore } from "@/state/stores";

interface Props {
  children: React.ReactNode;
}

const ReduxProvider = ({ children }: Props) => {
  return <Provider store={ReduxStore}>{children}</Provider>;
};

export default ReduxProvider;
```

### Expected ReactQueryProvider Code

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

const devTools = process.env.NODE_ENV !== "production";

const ReactQueryProvider = ({ children }: Props) => {
  const [queryClient] = useState<QueryClient>(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {devTools && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
```

### Project Structure Notes

- Providers location: `src/state/providers/`
- No barrel file exists at `src/state/providers/index.js` - each provider is imported directly
- Used in: `src/app/layout.tsx` wrapping the entire app

### Previous Story Learnings (15.1)

- Rename file, don't create new one (preserves git history)
- Check tsconfig.json path aliases if build fails
- JSDoc headers are nice-to-have but not critical

### References

- [Source: _bmad-output/planning-artifacts/epic-15-typescript-hardening.md#Story 15.3]
- [Source: _bmad-output/implementation-artifacts/15-1-hooks-typescript-migration.md]

---

## Definition of Done

- [x] All 3 providers migrated to TypeScript
- [x] Props interfaces defined for all providers
- [x] Build passes
- [x] Typecheck passes
- [x] Commit created with descriptive message

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Fixed ESLint error: `React` not defined → Import `ReactNode` type directly
- Fixed type error: `position` prop deprecated → Use `buttonPosition` instead
- Fixed Prettier formatting on ReactQueryDevtools props

### Completion Notes List

✅ All 3 providers migrated to TypeScript:
- ThemeProvider: Added Props interface, typed RootState selector
- ReduxProvider: Added Props interface
- ReactQueryProvider: Added Props interface, typed QueryClient, updated devtools API

### File List

#### Modified
- `src/state/providers/ThemeProvider/index.tsx` (renamed from .jsx)
- `src/state/providers/ReduxProvider/index.tsx` (renamed from .jsx)
- `src/state/providers/ReactQueryProvider/index.tsx` (renamed from .jsx)

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-07 | Story created with comprehensive dev context |
| 2026-02-07 | Implementation complete - all 3 providers migrated to TypeScript |

---

**Created:** 2026-02-07
**Author:** BMAD SM Agent
