# Technical Debt Backlog (Epics + Stories)

Date: 2026-03-01
Planning horizon: 2-3 sprints
Scale: story points (SP), 1 sprint ~= 20-28 SP (team-dependent)

## Prioritization Rules

- P0: release blocker / security / reliability signal
- P1: high-value hardening for production operation
- P2: structural quality and maintainability

## Epic TD-01: Security and Dependency Hardening (P0)

Goal: remove high-risk dependency exposure and enforce continuous vulnerability control.

Stories:

1. TD-01.1 Upgrade/patch `next` to non-vulnerable range
   - Evidence: `npm audit --omit=dev --audit-level=high`
   - AC:
     - no high/critical advisory for deployed runtime scope
     - build, typecheck, unit + e2e baseline pass
   - Estimate: 5 SP

2. TD-01.2 Add dependency security gate to CI
   - AC:
     - automated audit step with policy (fail on high/critical in runtime deps)
     - documented break-glass/waiver process
   - Estimate: 3 SP

3. TD-01.3 Content rendering hardening for article body path
   - Evidence: `src/ui/organisms/ArticleContent/index.tsx`
   - AC:
     - replace ad-hoc sanitizer/innerHTML path with vetted approach
     - add focused security tests for hostile payload cases
   - Estimate: 8 SP

Epic estimate: **16 SP**

## Epic TD-02: Test Signal Reliability (P0)

Goal: make CI green mean real quality, not skip-driven green.

Stories:

1. TD-02.1 Reduce E2E skip debt in critical flows (phase 1)
   - Evidence: 40 skips across 8 specs
   - Target files first:
     - `e2e/about-experiences-education-ux.spec.ts`
     - `e2e/auth.spec.ts`
     - `e2e/menu-autoclose.spec.ts`
   - AC:
     - critical user journeys execute without skip
     - skip inventory and rationale captured
   - Estimate: 8 SP

2. TD-02.2 Introduce skip-budget policy
   - AC:
     - CI check enforces max skip threshold
     - new skip requires issue link and expiration date
   - Estimate: 3 SP

3. TD-02.3 Stabilize env-dependent E2E fixtures
   - AC:
     - deterministic fixtures for auth/social/config-dependent tests
     - no mystery skips in release branch
   - Estimate: 5 SP

Epic estimate: **16 SP**

## Epic TD-03: Deployment Contract Alignment (P1)

Goal: remove ambiguity between mock, preview, and production behavior.

Stories:

1. TD-03.1 Remove hardcoded mock default from production image contract
   - Evidence: `Dockerfile.prod` (`NEXT_PUBLIC_USE_MOCKS=true`)
   - AC:
     - mode is explicit pipeline variable per environment
     - prod guardrail fails build if mock mode enabled unintentionally
   - Estimate: 5 SP

2. TD-03.2 Replace static/mock-only release checklist
   - Evidence: `docs/release/pre-release-checklist.md`
   - AC:
     - platform-aware runbook for Vercel + Azure
     - go/no-go gates map to CI + observability checks
   - Estimate: 3 SP

3. TD-03.3 Add health endpoint and runtime probes contract
   - AC:
     - standard health route defined and tested
     - infra docs include probe semantics and timeout/retry behavior
   - Estimate: 3 SP

Epic estimate: **11 SP**

## Epic TD-04: Architecture Hygiene (P2)

Goal: reduce fragile UI coupling and layer violations.

Stories:

1. TD-04.1 Refactor SkillSelector to React-state-driven interaction
   - Evidence: `src/ui/atoms/buttons/SkillSelectorButton/index.tsx`
   - AC:
     - no direct `document.querySelectorAll` manipulation
     - unit tests cover active/inactive states
   - Estimate: 5 SP

2. TD-04.2 Move `ui/molecules/model/schema.ts` into proper domain boundary
   - Evidence: `src/ui/molecules/model/schema.ts`
   - AC:
     - schema/types in domain layer
     - imports updated and tests green
   - Estimate: 3 SP

3. TD-04.3 Remove deprecated testing helper dependency
   - Evidence: `@testing-library/react-hooks@8.0.1`
   - AC:
     - migrate to `@testing-library/react` `renderHook`
     - dependency removed from manifest
   - Estimate: 2 SP

Epic estimate: **10 SP**

## Epic TD-05: Auth and Integration Readiness (P2)

Goal: close mock-vs-real auth ambiguity and define production contracts.

Stories:

1. TD-05.1 Define auth operating modes and CI contract
   - Evidence: `src/services/auth/oauth.ts`
   - AC:
     - explicit mode matrix documented (`disabled/mock/real`)
     - CI verifies expected mode by environment
   - Estimate: 3 SP

2. TD-05.2 Implement real provider interface skeleton + feature guard
   - AC:
     - real service adapter contract introduced
     - safe fallback and telemetry for misconfiguration
   - Estimate: 5 SP

Epic estimate: **8 SP**

## Suggested Sprint Packaging

Sprint A (P0 focus, 24-28 SP):

- TD-01.1, TD-01.2, TD-02.1, TD-02.2

Sprint B (P0 completion + P1, 22-26 SP):

- TD-01.3, TD-02.3, TD-03.1, TD-03.2, TD-03.3

Sprint C (P2 quality, optional/parallel):

- TD-04._ and TD-05._

## Delivery Definition

Every story is done only if:

- lint/typecheck/build pass
- affected tests pass
- docs/runbooks updated where applicable
- risk and rollback notes included in PR
