---
id: 001-persistence-layer-adapters
aliases: []
tags: []
status: pending
---

# Epic 001 - Persistence Layer Adapters

## Context

Content and experience data currently mixes multiple access patterns:

- PostgreSQL for live admin/content flows
- in-memory data for tests and local fallback
- static JSON snapshots for env/file-backed content

This has already caused runtime gaps when the DB is unavailable, especially for public pages that should still render from a static snapshot.

## Goal

Introduce a unified persistence layer with interchangeable adapters so the rest of the app can consume a single contract regardless of source.

## Checklist

- [x] Define per-domain persistence ports.
- [x] Implement `postgres`, `snapshot-json`, and `memory` adapters.
- [x] Add a central factory for adapter selection.
- [x] Degrade public reads to `snapshot-json` when DB is unavailable.
- [x] Gray out write surfaces in read-only mode.
- [x] Keep tests on `memory`.

## Decision

Use a per-domain persistence port with three primary adapters:

- `postgres` for live production/admin writes
- `snapshot-json` for read-only static runtime
- `memory` for tests and isolated local runs

The active adapter is selected by configuration and injected through a central factory.

## Scope

In scope:

- Define persistence contracts per domain.
- Add adapter implementations for `postgres`, `snapshot-json`, and `memory`.
- Make the adapter choice transparent to application and UI layers.
- Support read-only degradation when `snapshot-json` is active.
- Keep write actions and write routes disabled in read-only mode.

Out of scope:

- Rewriting every domain in one step.
- Changing public URLs or content schemas.
- Making `snapshot-json` writable.

## Rationale

- `postgres` is the live system of record.
- `snapshot-json` is a deployment artifact, not a source of truth.
- `memory` keeps tests fast and predictable.
- A single factory avoids spreading mode checks across the codebase.

## Implementation Model

Recommended shape:

```text
src/
  domains/<domain>/ports.ts
  infrastructure/persistence/<domain>/postgres.ts
  infrastructure/persistence/<domain>/snapshot-json.ts
  infrastructure/persistence/<domain>/memory.ts
  infrastructure/persistence/factory.ts
  infrastructure/persistence/mode.ts
```

Suggested runtime mode values:

- `postgres`
- `snapshot-json`
- `memory`

Suggested capability model:

- `read`: true/false
- `write`: true/false

## Rollout Plan

1. Pilot the contract with `job-experience`.
2. Migrate public read paths first.
3. Add the static snapshot for experiences and use it in read-only mode.
4. Extend the same adapter pattern to profile, projects, articles, and related content.
5. Keep tests on `memory`.

## Acceptance Criteria

- Public pages render from `snapshot-json` when DB access is unavailable.
- Admin write surfaces are disabled in read-only mode.
- Write APIs return `403 read_only` when the active adapter is read-only.
- Tests can run without PostgreSQL by selecting `memory`.
- Domain code depends only on the persistence contract, not on adapter specifics.

## Notes

- `snapshot-json` should remain versioned with the repo or deployment artifact, not treated as editable content.
- The factory should be the only place that knows which adapter is active.
- This epic should be applied incrementally, domain by domain.
