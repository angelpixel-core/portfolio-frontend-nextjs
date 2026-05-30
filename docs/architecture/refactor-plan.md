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

### Phase 4.1 - URL Shortener and Provider Tracking (New Vertical)

Objective:

- Introduce a first-party URL shortener under our domain for campaign attribution,
  platform-provider tracking, and server-side click observability.

Scope:

- Public redirect endpoint with controlled query passthrough.
- Admin management for providers and short links.
- Server-side click event capture and analytics integration.

Architecture placement:

- `domain`: short link entities/rules.
- `application`: create/resolve/track use cases and orchestration.
- `infrastructure`: DB persistence and adapters.
- `presentation`: API routes + admin UI.
- `observability`: click events and operational metrics.

Key decision (accepted):

- Redirect strategy uses **controlled passthrough** of query params.
- Allowed passthrough params (initial policy): `utm_*`, `ref`, `src`.
- Non-allowed params are captured in server observability payload but are not
  forwarded to destination by default.

MVP deliverables:

1. DB models/tables
   - `short_providers`
   - `short_links`
   - `short_click_events`
2. Public endpoint
   - `GET /r/:code` resolves link, records click event, redirects to target.
3. Admin API
   - CRUD for providers
   - CRUD/status for short links
   - events listing by link/provider/date range
4. Admin UI
   - Providers management view
   - Short links management view
   - Click events table with filters
5. Observability
   - standardized server event: `short_link_clicked`
   - core attributes: `code`, `provider`, `campaign`, `referrer_host`,
     `has_query`, `passthrough_count`

Risk controls:

- Destination allowlist to avoid open-redirect abuse.
- Rate limit on redirect endpoint.
- PII-safe logging (no raw personal data in event payloads).

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

- [x] Run architecture boundary audit (script/tool to be reintroduced) and capture current violations baseline.
- [x] Classify violations by bucket:
  - [x] `app/api/** -> services/*` (adapter/transition bucket)
  - [x] `ui/** -> services/*` (high-priority fixes)
  - [x] tests importing infrastructure directly (policy decision)
- [x] Publish owner and target date per bucket in architecture docs.
- [x] Keep explicit temporary allowlist with expiry date.

#### Stage A Operating Details

Execution objective:

- Establish a deterministic, reproducible baseline of current cross-layer violations.
- Classify all violations by migration bucket and severity.
- Prepare ownership, target dates, and temporary exceptions so Stage B can execute by slices without ambiguity.

Severity model (current agreement):

- `high`: `ui/** -> services/*` and any direct `presentation -> infrastructure` crossing.
- `medium`: `app/api/** -> services/*` while API-layer policy is in transition.
- `low`: tests importing infrastructure directly (still migrated, but lower immediate risk).

Mandatory Stage A outputs:

1. Baseline report document with:
   - total violations count
   - grouped counts by rule
   - grouped counts by path prefix
   - top violating files list
2. Bucket classification table with:
   - bucket id
   - severity
   - owner
   - target date
   - migration strategy
3. Temporary allowlist section with:
   - exact path/rule
   - reason
   - owner
   - expiry date
4. CI-visible report-only execution (non-blocking) so drift is observable before mixed/full enforcement.

Target bucket definitions:

- `A1`: `src/app/api/** -> services/*` (transition bucket to application facades/adapters).
- `A2`: `src/ui/** -> services/*` (highest-priority migration bucket).
- `A3`: tests importing infrastructure directly (policy + migration bucket).
- `A4`: any additional crossing found by audit that does not fit A1-A3.

Acceptance criteria for Stage A completion:

- Baseline is reproducible locally and in CI from the same command.
- Every discovered violation is mapped to a bucket.
- Every bucket has owner + target date documented.
- Temporary allowlist entries include owner + expiry.
- Stage A does not block merges yet; it only reports and tracks.

### Stage B - Violation Reduction by Slices

- [x] Remove `ui/** -> services/*` crossings by introducing/using `application/*` facades.
- [x] Decide and document API-layer boundary policy for `src/app/api/**`.
- [x] Reduce total violations by at least 40% from baseline.
- [x] Reduce total violations by at least 70% from baseline.
- [x] Reduce total violations by at least 90% from baseline.
- [x] For each reduction PR, include validation evidence (`lint`, `typecheck`, `build`).

#### Stage B Completion Status

- Baseline progression during Phase 3 execution: `70 -> 65 -> 36 -> 31 -> 28 -> 24 -> 23 -> 22 -> 21 -> 15 -> 11 -> 7 -> 2 -> 0`.
- Current architecture baseline: `0` violations (`A1/A2/A3/A4 = 0`) from `npm run architecture:report`.
- Reference delivery PR: `#5` (`chore/phase3-architecture-baseline`), merged.

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
