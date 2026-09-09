# Dependency Matrix

## Purpose

Define which architectural layers may import which other layers.

## Layers

- `presentation`: `src/app`, `src/ui`
- `application`: use-cases and orchestration modules
- `domain`: business models and domain logic
- `infrastructure`: DB and third-party adapters
- `shared`: framework-agnostic common code
- `observability`: logger/telemetry/tracing
- `config`: env and runtime configuration

## Monorepo Ownership

The target monorepo keeps shared code intentionally small:

- `packages/contracts`: framework-agnostic HTTP request/response schemas and inferred types.
- `packages/shared`: framework-agnostic utilities with minimal dependencies.
- `apps/profile/service/api`: backend-owned `domain`, `application`, `infrastructure` and HTTP controllers.
- `apps/profile/web/portal`: client-owned presentation, UI state and HTTP adapters.

`domain`, `application` and `infrastructure` are not shared packages in the first split. They may be extracted later only when a second backend needs genuinely reusable, framework-agnostic code.

## Allowed Dependencies

| From \\ To | presentation | application | domain | infrastructure | shared | observability | config |
| --- | --- | --- | --- | --- | --- | --- | --- |
| presentation | N/A | YES | YES (read-only data contracts) | NO | YES | YES | YES |
| application | NO | N/A | YES | YES | YES | YES | YES |
| domain | NO | NO | N/A | NO | YES | YES | YES |
| infrastructure | NO | NO | YES (contracts only) | N/A | YES | YES | YES |
| shared | NO | NO | NO | NO | N/A | NO | NO |
| observability | NO | NO | NO | NO | YES | N/A | YES |
| config | NO | NO | NO | NO | YES | YES | N/A |

## Rules

- `shared` must stay framework-agnostic and dependency-light.
- `domain` must not import `presentation` or `infrastructure`.
- `presentation` must not call external services directly; go through `application` or dedicated service abstractions.
- `infrastructure` may depend on `domain` contracts but not UI concerns.
- All logging/telemetry should use `observability` entrypoints.
- `packages/*` must not depend on `apps/*`.
- The portal must not import backend `domain`, `application` or `infrastructure` modules.

## Examples

Allowed:

- `src/app/projects/page.tsx` -> `src/domains/project/model/schema`
- `src/services/payments/stripe.ts` -> `src/lib/config/*` and `src/lib/logger` (until observability extraction)

Not allowed:

- `src/ui/*` importing DB client modules
- `src/domains/*` importing React components

## Migration Notes

Current repository structure is mid-transition. Use this matrix as target state and enforce incrementally by vertical slices.

Temporary Phase 1/2 exceptions (sunset: end of Phase 2 or 4 weeks):

- `presentation -> @/services/analytics/*`
- `presentation -> @/services/*/intent`

## Phase 3 Guardrails Rollout

Architecture boundary checks were temporarily introduced during Phase 3 planning and are currently disabled from package scripts/CI until a deterministic enforcement strategy is finalized.
