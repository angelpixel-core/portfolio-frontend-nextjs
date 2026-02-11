# Story 19.1: Global Error Boundary

Status: done

## Story

As a **visitor**,
I want **the application to gracefully handle runtime errors instead of showing a white screen**,
so that **I can understand something went wrong and recover by retrying or navigating home**.

## Acceptance Criteria

1. `src/app/error.tsx` renders client error boundary with "Try again" (calls `reset()`) and "Go home" (links to `/`)
2. `src/app/global-error.tsx` renders minimal error UI with inline styles (no layout available at this level)
3. `src/app/not-found.tsx` renders a styled 404 page with "Go home" link
4. Unit tests verify rendering, reset callback, and navigation link for each component
5. Manual verification: throwing error in a page shows error UI, not white screen

## Tasks / Subtasks

- [x] Task 1: Create `src/app/error.tsx` (AC: #1)
  - [x] "use client" directive (required by Next.js App Router)
  - [x] Accept `{error, reset}` props with proper TypeScript typing
  - [x] Log error via `console.error` in `useEffect`
  - [x] Render heading "Something went wrong", description, "Try again" button, "Go home" link
  - [x] Use Tailwind utilities consistent with project theme (`text-light`, `bg-primary`, `border-gray-600`)
- [x] Task 2: Create `src/app/global-error.tsx` (AC: #2)
  - [x] "use client" directive
  - [x] Render own `<html>` and `<body>` (no layout available at root error level)
  - [x] ALL styles inline (no Tailwind/CSS — layout hasn't loaded)
  - [x] Use project theme colors inline: `#1b1b1b` (dark), `#f5f5f5` (light), `#B63E96` (primary)
  - [x] "Try again" button calls `reset()`
- [x] Task 3: Create `src/app/not-found.tsx` (AC: #3)
  - [x] Server component (no "use client" needed)
  - [x] Render "404" heading, description, "Go home" link
  - [x] Use Tailwind utilities consistent with error.tsx styling
- [x] Task 4: Create `src/app/__tests__/error.test.tsx` (AC: #4)
  - [x] Import as `ErrorPage` to avoid shadowing native `Error` constructor
  - [x] Use `new globalThis.Error()` for test error objects (avoids import shadow)
  - [x] Test: renders heading, description, reset callback, "Go home" link href, console.error logging
  - [x] Suppress console.error in tests via `jest.spyOn(console, "error").mockImplementation`
- [x] Task 5: Create `src/app/__tests__/global-error.test.tsx` (AC: #4)
  - [x] Test: renders heading, critical error description, reset callback
- [x] Task 6: Create `src/app/__tests__/not-found.test.tsx` (AC: #4)
  - [x] Test: renders 404 heading, description text, "Go home" link href

## Dev Notes

### Arquitectura de Error Boundaries en Next.js App Router

- `error.tsx`: Catch-all para errores en rutas anidadas. Requerido: `"use client"`, props `{error: Error & {digest?}, reset: () => void}`
- `global-error.tsx`: Solo para errores fatales en el root layout. Debe renderizar su propio `<html>/<body>` porque el layout no está disponible. DEBE usar inline styles exclusivamente.
- `not-found.tsx`: Renderizado cuando `notFound()` es llamado o ruta no existe. Puede ser server component.

### Patrón de Testing: Error Import Shadow

Al importar `error.tsx` como componente en tests, el nombre `Error` colisiona con el constructor nativo `Error`. Solución:
```typescript
import ErrorPage from "../error";           // Alias para evitar shadow
const mockError = new globalThis.Error("Test error");  // Constructor explícito
```

### Theme Colors (inline para global-error)

| Token | Hex | Uso |
|-------|-----|-----|
| dark | `#1b1b1b` | Background |
| light | `#f5f5f5` | Text |
| primary | `#B63E96` | Botones CTA |
| gray-400 equiv | `#9ca3af` | Texto secundario |

### Project Structure Notes

- Archivos creados en `src/app/` — nivel raíz del App Router (correcto para error boundaries globales)
- Tests en `src/app/__tests__/` — convención de co-locación del proyecto
- No se necesitan cambios en `layout.jsx` ni en proveedores

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.1]
- [Source: _bmad-output/analysis/production-gap-execution-plan-2026-02-11.md#C1]
- [Source: _bmad-output/analysis/deploy-safety-report-2026-02-11.md]
- [Docs: Next.js App Router Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Completion Notes List

- Story implementada en commit `2c83870` — `feat(app): add error boundaries and 404 page for production safety`
- 11 tests creados inicialmente (5 error + 3 global-error + 3 not-found)
- Lección aprendida: import alias `ErrorPage` para evitar shadow del constructor `Error` nativo

### Code Review Fixes (2026-02-11)

- **M1**: `global-error.test.tsx` — corregido `new Error()` → `new globalThis.Error()` para consistencia
- **M2**: `global-error.test.tsx` — agregado `jest.spyOn(console, "error").mockImplementation()` para suprimir validateDOMNesting warning
- **M3**: `error.tsx` y `global-error.tsx` — agregado `role="alert"` para accesibilidad con screen readers
- **M3b**: `global-error.tsx` — agregado `<head><title>Error</title></head>` para cumplir a11y document-title
- **L2**: 3 tests axe agregados (1 por componente) — total: 14 tests pasando (6 error + 4 global-error + 4 not-found)
- 983 tests totales pasando post-review

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `src/app/error.tsx` | CREADO | ✅ |
| `src/app/global-error.tsx` | CREADO | ✅ |
| `src/app/not-found.tsx` | CREADO | ✅ |
| `src/app/__tests__/error.test.tsx` | CREADO | ✅ |
| `src/app/__tests__/global-error.test.tsx` | CREADO | ✅ |
| `src/app/__tests__/not-found.test.tsx` | CREADO | ✅ |
