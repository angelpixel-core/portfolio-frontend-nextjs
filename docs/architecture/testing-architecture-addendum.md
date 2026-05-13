# Testing Architecture Addendum

Date: 2026-05-12

## Purpose

Define testing standards that make the refactor measurable in reliability, cost, and maintainability.

## Objectives

- Reduce test inconsistency across layers.
- Reduce test runtime and flakiness.
- Improve debugging and failure diagnosis.
- Reduce duplicated test setup and ad-hoc mocks.

## Layered Testing Strategy

### Domain

- Prefer pure unit tests.
- No framework/runtime dependencies.
- No network/DB/file I/O.

### Application

- Test use-cases through ports/contracts.
- Mock ports, not concrete adapters.
- Verify orchestration and decision paths.

### Infrastructure

- Test adapters in focused integration tests.
- Keep provider-specific behavior localized.
- Avoid duplicating domain behavior assertions.

### Presentation

- Test user behavior and UI state transitions.
- Avoid deep implementation details.
- Keep component tests isolated from provider internals.

## Mocking Rules

- Centralize reusable mocks in test kits per bounded context.
- Prefer deterministic fakes/builders over inline ad-hoc mocks.
- Avoid repeating `jest.mock` blocks for the same modules across many files.
- For cross-cutting concerns (`logger`, analytics), provide one canonical test helper.

## Fixtures and Builders

- Introduce typed builders for key entities (`project`, `article`, `subscription`, etc.).
- Keep canonical scenarios in shared fixtures:
  - happy path
  - invalid input
  - edge-case behavior
- Keep fixture naming business-oriented.

## Observability in Tests

- Standardize test-time logger handling through a single helper.
- Include correlation metadata for critical flow tests when useful.
- Ensure failures emit actionable context (input, expected behavior, received behavior).

## Performance and Cost Targets

Track baseline and progress per phase:

- Total test duration (`npm test`).
- Flaky test incidence (rerun-required failures).
- Ratio of unit tests to integration/E2E tests.
- Average runtime of critical suites.

Target direction:

- More fast unit/application tests.
- Fewer fragile UI/integration tests for business logic.
- Reduced repeated setup code.

## PR Checklist Additions

For refactor and testing-related PRs, include:

1. Layer touched (`domain`, `application`, `infrastructure`, `presentation`).
2. Test strategy used and why.
3. Any new shared mock/fixture introduced.
4. Runtime impact summary (faster/slower/neutral).
5. Validation evidence (`lint`, `typecheck`, `build`, targeted tests).

## Phase Integration

- Phase 1: define strategy and conventions (this document).
- Phase 2: apply to first vertical slices (`logger`, analytics facade, application facades).
- Phase 3: enforce consistency with lint/test guardrails in CI.
