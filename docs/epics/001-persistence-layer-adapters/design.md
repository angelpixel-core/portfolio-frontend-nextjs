---
id: 001-persistence-layer-adapters-design
aliases: []
tags: []
status: pending
---

# Design 001 - Persistence Layer Adapters

## Objective

Design a transparent persistence abstraction that can switch between PostgreSQL, snapshot JSON, and in-memory storage without leaking the choice into presentation code.

## Implementation Checklist

- [x] Define persistence ports per domain.
- [x] Define a shared adapter contract with `read` and `write` capabilities.
- [x] Implement `postgres` adapters for live admin/content flows.
- [x] Implement `snapshot-json` adapters for read-only runtime.
- [x] Implement `memory` adapters for tests and isolated local runs.
- [x] Add a central factory that resolves the active adapter from config.
- [x] Make read-only mode visible to UI and API layers.
- [x] Apply the pilot to `job-experience` first.

## Proposed Structure

```text
src/
  domains/<domain>/ports.ts
  infrastructure/persistence/<domain>/postgres.ts
  infrastructure/persistence/<domain>/snapshot-json.ts
  infrastructure/persistence/<domain>/memory.ts
  infrastructure/persistence/factory.ts
  infrastructure/persistence/mode.ts
```

## Runtime Modes

- `postgres`
- `snapshot-json`
- `memory`

## Capability Model

- `read`: true/false
- `write`: true/false

## Notes

- `snapshot-json` is a deployment artifact, not editable source of truth.
- The factory should be the only module that knows the active adapter.
- Domain code must depend on ports, not adapter implementations.
