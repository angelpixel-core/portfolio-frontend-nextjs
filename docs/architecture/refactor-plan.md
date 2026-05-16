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

Current artifacts:

- `docs/architecture/dependency-matrix.md`
- `docs/architecture/phase1-blueprint.md`
- `AGENTS.md`

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
- `docs/architecture/testing-architecture-addendum.md`
- `docs/architecture/rbac-foundation-v1.md`
- Follow-up lint boundary config in future phase

## Phase 3 Execution Checklist (Progressive Hardening)

### Stage A - Baseline and Classification

- [ ] Run architecture boundary audit (script/tool to be reintroduced) and capture current violations baseline.
- [ ] Classify violations by bucket:
  - [ ] `app/api/** -> services/*` (adapter/transition bucket)
  - [ ] `ui/** -> services/*` (high-priority fixes)
  - [ ] tests importing infrastructure directly (policy decision)
- [ ] Publish owner and target date per bucket in architecture docs.
- [ ] Keep explicit temporary allowlist with expiry date.

### Stage B - Violation Reduction by Slices

- [ ] Remove `ui/** -> services/*` crossings by introducing/using `application/*` facades.
- [ ] Decide and document API-layer boundary policy for `src/app/api/**`.
- [ ] Reduce total violations by at least 40% from baseline.
- [ ] Reduce total violations by at least 70% from baseline.
- [ ] Reduce total violations by at least 90% from baseline.
- [ ] For each reduction PR, include validation evidence (`lint`, `typecheck`, `build`).

### Stage C - Mixed Enforcement

- [ ] Make `architecture-check` block new/modified files.
- [ ] Keep inherited legacy violations in allowlist during transition window.
- [ ] Keep global report visible in CI summary for tracking.
- [ ] Define and publish cutover date to full blocking mode.

### Stage D - Full Blocking

- [ ] Make `architecture-check` fully blocking in CI.
- [ ] Promote critical boundary rules from warning to error.
- [ ] Remove or minimize allowlist entries with strict owner and short expiry.

### Node 24 CI Hardening

- [ ] Verify all CI jobs run on Node 24 (`quality`, `e2e`, `lighthouse`, `architecture-check`).
- [ ] Validate reproducible installs with `npm ci --include=dev --legacy-peer-deps`.
- [ ] Run at least two clean CI executions (without cache) and record results.

### Phase 3 Done Criteria

- [ ] `architecture-check` is fully blocking.
- [ ] No unapproved boundary violations remain.
- [ ] Allowlist has explicit owner and expiry for any remaining exception.
- [ ] CI on Node 24 is stable.
