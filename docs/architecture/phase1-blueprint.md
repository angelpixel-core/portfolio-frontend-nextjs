# Phase 1 Blueprint: Target Architecture and Extraction Path

Date: 2026-05-12

## Goal

Define the target folder/module architecture and a safe migration path from the current `src/*` layout to bounded-context and ports/adapters-oriented modules.

## Decisions

1. Keep `presentation -> services` temporary exceptions only for:
   - `@/services/analytics/*`
   - `@/services/*/intent`
2. Exception expiry: end of Phase 2 or 4 weeks, whichever comes first.
3. Use `packages/` as the future extraction boundary (instead of `libs/`).
4. Keep physical migration incremental; avoid big-bang moves.

## Target Structure (End State)

```text
packages/
  shared/
    src/
      types/
      utils/
      validation/
  observability/
    src/
      logger/
      analytics/
      telemetry/
  content/
    src/
      domain/
      application/
      infrastructure/
  commerce/
    src/
      domain/
      application/
      infrastructure/
  identity/
    src/
      domain/
      application/
      infrastructure/
  engagement/
    src/
      domain/
      application/
      infrastructure/

apps/
  web/ (current app equivalent)
    src/
      app/            # Next.js routes/pages
      ui/             # components and view composition
      adapters/       # app-facing adapters/glue during transition
```

## Bounded Context Mapping (Current -> Target)

- `src/domains/article`, `src/domains/project`, `src/domains/word-cloud` -> `packages/content`
- `src/domains/order`, `src/domains/subscription*`, `src/services/payments`, `src/services/subscriptions` -> `packages/commerce`
- `src/services/auth`, `src/domains/two-factor` -> `packages/identity`
- `src/services/contact`, `src/app/api/messages`, UX intent flows -> `packages/engagement`
- `src/lib/logger`, analytics event code -> `packages/observability`
- generic helpers from `src/lib/*` -> `packages/shared`

## Ports and Adapters Direction

- Domain modules define ports (interfaces/contracts).
- Infrastructure modules implement adapters (DB, external APIs, providers).
- Presentation should call application use-cases, not infrastructure adapters directly.

## Transitional Architecture (While Still in src)

Before extracting to `packages/`, mirror target layering in place:

```text
src/
  application/
  observability/
  shared/
  domains/
  services/
  app/
  ui/
```

This keeps refactors incremental and reduces path-churn risk.

## Import Contract During Transition

Allowed temporary exceptions (must be removed by Phase 2 end):

- `presentation -> @/services/analytics/*`
- `presentation -> @/services/*/intent`

Disallowed immediately:

- `domain -> presentation`
- `domain -> infrastructure`
- `presentation -> DB/provider adapters` (except temporary allowlist above)

## Phase 2 Entry Checklist

1. Create `src/observability` and migrate `logger` entrypoint there.
2. Create `src/application` facades for flows currently consumed directly from `services` in UI.
3. Add lint rules for the transition contract in warning mode.
4. Record remaining exceptions with owners and sunset date.

## Implementation Start Point (Recommended)

Start with a small, high-impact slice:

1. `logger` move (`src/lib/logger` -> `src/observability/logger`) with compatibility shim.
2. Migrate `@/services/analytics` entry usage to `@/observability/analytics` facade.
3. Keep behavior unchanged; run `lint`, `typecheck`, `build`.
