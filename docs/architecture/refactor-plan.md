# Refactor Plan: Layered Architecture and Agent Guardrails

## Goal

Stabilize module resolution and architecture boundaries across local, CI, and Vercel by introducing a clear layered model, codified dependency rules, and incremental refactor phases.

## Scope

- Define bounded layers and import boundaries.
- Reduce fragile alias usage and cross-layer coupling.
- Extract cross-cutting concerns (observability, shared utilities) into stable modules.
- Add guardrails so regressions are detected automatically.

## Layer Model

- `presentation`: `src/app`, `src/ui`, page composition and rendering.
- `application`: use-cases/orchestration that coordinates domain and infrastructure.
- `domain`: business models, schemas, policies, pure business logic.
- `infrastructure`: DB, external providers, network clients, adapters.
- `shared`: reusable framework-agnostic utilities, types, constants.
- `observability`: logging, telemetry, tracing, operational events.
- `config`: env parsing, runtime feature flags, platform wiring.

## Phases

### Phase 0 - Baseline Inventory

1. Inventory all `@/...` imports and rank by frequency.
2. Identify hotspots (`logger`, domain queries, barrel imports in critical bundles).
3. Tag current violations against the target layer model.

Exit criteria:

- Import inventory captured and reviewed.
- Top 10 fragile paths identified.

Current artifact:

- `docs/architecture/baseline-inventory-phase0.md`

### Phase 1 - Contract First

1. Publish dependency matrix (`docs/architecture/dependency-matrix.md`).
2. Publish agent operating rules (`AGENTS.md`).
3. Establish naming conventions for new modules (`shared`, `observability`, `application`).

Exit criteria:

- Matrix and rules merged.
- Team alignment on naming and boundaries.

### Phase 2 - High-Value Low-Risk Moves

1. Consolidate logging under a single `observability/logger` entrypoint.
2. Normalize fragile path imports in pages/routes with explicit, stable module paths.
3. Remove accidental architecture leaks (UI importing infrastructure directly).

Exit criteria:

- Logger imports standardized.
- No direct `presentation -> infrastructure` imports in touched areas.

### Phase 3 - Guardrails in CI

1. Add lint rules for dependency boundaries.
2. Add checks for restricted imports and forbidden layer crossings.
3. Keep `lint + typecheck + build` as pre-merge requirements.

Exit criteria:

- Boundary violations fail CI.
- Rules documented with examples.

### Phase 4 - Incremental Migration

1. Migrate remaining hotspots by domain verticals.
2. Update tests and docs in the same PR as structural changes.
3. Record decision deltas in architecture docs.

Exit criteria:

- Critical paths migrated.
- No net new boundary violations.

## Risk Controls

- Small, atomic PRs by boundary/topic.
- Preserve behavior first; rename/move second.
- Always run `npm run lint`, `npm run typecheck`, and `npm run build` after structural refactors.

## Deliverables

- `docs/architecture/dependency-matrix.md`
- `AGENTS.md`
- Follow-up lint boundary config in future phase
