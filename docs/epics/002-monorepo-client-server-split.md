---
id: 002-monorepo-client-server-split
aliases: []
tags:
  - architecture
  - monorepo
  - nextjs
  - nestjs
status: pending
---

# Epic 002 - Monorepo Client/Server Split

## Context

The current repository is a transitional hybrid: Next.js acts as the client, but some server-side routes still talk directly to the database. The target architecture is a true client/server split where the web app consumes a backend over HTTP and shared packages provide contracts and reusable domain code.

This epic turns ADR-013 into an implementation plan.

## Goal

Split the product into explicit client and server apps inside a monorepo, with shared packages for contracts, domain logic, application use cases, and infrastructure adapters.

## Checklist

- [ ] Define the monorepo root structure for `apps/` and `packages/`.
- [ ] Create shared `contracts` package for request/response schemas.
- [ ] Create shared `domain` package for pure business rules.
- [ ] Create shared `application` package for use cases and ports.
- [ ] Create shared `infrastructure` package for adapters and transport helpers.
- [ ] Create shared `shared` package for framework-agnostic utilities.
- [ ] Stand up `apps/profile/web/portal` as the Next.js client app.
- [ ] Stand up `apps/profile/service/api` as the NestJS backend app.
- [ ] Move profile read/write workflows behind HTTP contracts.
- [ ] Add an HTTP adapter layer in the Next client.
- [ ] Remove any direct DB coupling from the Next client boundary.
- [ ] Keep transitional server routes only until the backend replacement is complete.

## Scope

In scope:

- Monorepo folder structure.
- Package boundaries and import rules.
- HTTP client/server split.
- Initial `profile` vertical slice.
- Shared contracts and domain reuse.

Out of scope:

- Migrating every domain in one pass.
- Rewriting visual design or URLs.
- Introducing a second backend before the split is stable.

## Phases

### Phase 1 - Foundation

- [ ] Create root workspace structure.
- [ ] Define package naming and import rules.
- [ ] Move reusable schemas/contracts into `packages/contracts`.
- [ ] Move pure domain code into `packages/domain` where appropriate.

### Phase 2 - Backend Pilot

- [ ] Create `apps/profile/service/api`.
- [ ] Add a health endpoint and one public read endpoint.
- [ ] Add backend application/use-case layer.
- [ ] Add backend infrastructure adapters.

### Phase 3 - Client Pilot

- [ ] Create `apps/profile/web/portal`.
- [ ] Add HTTP adapters in the client.
- [ ] Switch profile reads to backend HTTP.
- [ ] Keep a static snapshot fallback only as a runtime mode, not as the long-term boundary.

### Phase 4 - Slice Migration

- [ ] Migrate profile settings and contact points.
- [ ] Migrate projects.
- [ ] Migrate articles.
- [ ] Remove direct DB access from the client app.

## Acceptance Criteria

- `portal` only talks to `api` over HTTP.
- `api` owns persistence and business writes.
- Shared packages are importable from both apps.
- `packages/*` do not depend on `apps/*`.
- No Next.js client code imports DB adapters directly.

## Notes

- This is a structural epic, not a product feature.
- Keep the first slice small and verifiable.
- Prefer a vertical slice over a broad mechanical move.
