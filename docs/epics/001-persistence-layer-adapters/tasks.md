---
id: 001-persistence-layer-adapters-tasks
aliases: []
tags: []
status: pending
---

# Tasks 001 - Persistence Layer Adapters

## Phase 1 - Foundation

- [x] Define the persistence port for `job-experience`.
- [x] Add the shared adapter mode contract (`postgres`, `snapshot-json`, `memory`).
- [x] Add a central factory that resolves the active adapter from config.
- [x] Add capability metadata for `read` and `write`.

## Phase 2 - Pilot Domain

- [x] Implement `job-experience` postgres adapter.
- [x] Implement `job-experience` snapshot-json adapter.
- [x] Implement `job-experience` memory adapter.
- [x] Switch public experiences reads to the factory-resolved adapter.
- [x] Keep writes disabled when the adapter is read-only.

## Phase 3 - Runtime Behavior

- [x] Gray out write controls in the admin UI when read-only.
- [x] Return `403 read_only` from write APIs when the adapter is read-only.
- [x] Ensure tests can run on memory without PostgreSQL.

## Phase 4 - Profile

- [x] Define the `profile/public` persistence port.
  - Evidence: [Profile persistence port](../../../src/domains/profile/ports.ts)
- [x] Implement `profile/public` memory adapter.
  - Evidence: [Memory adapter](../../../src/infrastructure/persistence/profile/memory.ts)
- [x] Implement `profile/public` snapshot-json adapter.
  - Evidence: [Snapshot JSON adapter](../../../src/infrastructure/persistence/profile/snapshot-json.ts)
- [x] Implement `profile/public` postgres adapter.
  - Evidence: [Postgres adapter](../../../src/infrastructure/persistence/profile/postgres.ts)
- [x] Add `profile/public` application service and mapper.
  - Evidence: [Application service](../../../src/application/profile/index.ts), [Public mapper](../../../src/domains/profile/public/mapper.ts)
- [x] Switch profile API reads to the factory-resolved adapter.
  - Evidence: [Profiles route](../../../src/app/api/profiles/route.ts), [Profile by ID route](../../../src/app/api/profiles/[id]/route.ts), [Persistence factory](../../../src/infrastructure/persistence/profile/index.ts)

## Phase 5 - Expansion

- [ ] Apply the same adapter pattern to projects.
- [ ] Apply the same adapter pattern to articles.
- [ ] Apply the same adapter pattern to any remaining content domains.

## Done Criteria

- [ ] Public pages render from `snapshot-json` when DB access is unavailable.
- [ ] Admin write surfaces stay disabled in read-only mode.
- [ ] Domain code depends only on persistence ports.
