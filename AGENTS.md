# AGENTS.md

## Purpose

Operational contract for human and AI contributors. This file defines architecture boundaries, coding constraints, and validation requirements to keep changes safe and consistent.

## Core Principles

- Keep behavior stable first, improve structure second.
- Prefer small, atomic commits by concern.
- Update tests and docs in the same PR as structural changes.
- Avoid hidden coupling through broad aliases and cross-layer imports.

## Architecture Contract

Reference: `docs/architecture/dependency-matrix.md`

Mandatory rules:

1. `domain` does not import from `presentation` or `infrastructure`.
2. `presentation` does not import from DB/external provider modules directly.
3. `shared` stays framework-agnostic.
4. Cross-cutting logs and telemetry go through a centralized observability module.

## Import Rules

- Prefer explicit module paths over ambiguous barrels in performance-critical areas.
- Keep alias usage aligned with `tsconfig.json` paths.
- Do not introduce global alias overrides in bundler config that conflict with `tsconfig` path aliases.
- If a path alias fails in remote builds, validate root directory and build environment before replacing aliases with broad fallbacks.

## Refactor Rules

For each refactor PR, include:

1. What changed.
2. Why it changed.
3. New rule extracted from that change.
4. Validation evidence (`lint`, `typecheck`, `build`, and any targeted test).

## Observability Rules

- Use one logger interface across app/server code.
- Log level policy must be environment-aware and consistent.
- Avoid ad-hoc console calls in business and API flows.

## CI Safety Checks

Before merge, run:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

When touching critical flows, also run relevant E2E specs.

## Anti-Patterns

- Cross-layer imports that bypass architecture boundaries.
- Barrel imports that accidentally inflate bundles in hot paths.
- Refactors that move files without updating tests/docs in same PR.
- Configuration-only fixes that hide unresolved architecture coupling.

## Decision Log Pattern

When adding a new rule or architectural decision, append it to architecture docs with:

- Context
- Decision
- Consequences
- Verification method
