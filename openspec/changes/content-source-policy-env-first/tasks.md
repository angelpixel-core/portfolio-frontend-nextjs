# Tasks: Content Source Policy (Env First)

## Phase 1: Foundation (Resolver + Registry)

- [x] 1.1 Create `src/lib/content-source/index.ts` with `resolveContentSource` and option types to enforce env-first + HTTP fallback policy.
- [x] 1.2 Create `src/environment-content/index.ts` registry that maps `file:<name>.json` references to imported JSON payloads.
- [x] 1.3 Add baseline JSON fixtures under `src/environment-content/*.json` for local development and test coverage.
- [x] 1.4 Update `src/lib/httpRequest/index.ts` to remove any `NEXT_PUBLIC_USE_MOCKS` short-circuit logic.

## Phase 2: Domain Migration (Env-First Resolver Adoption)

- [x] 2.1 Update `src/domains/content/model/index.ts` to call `resolveContentSource` with domain schema and endpoint.
- [x] 2.2 Update `src/domains/profile/model/index.ts` to call `resolveContentSource` with domain schema and endpoint.
- [x] 2.3 Update `src/domains/navigation-item/model/index.ts` to call `resolveContentSource` with domain schema and endpoint.
- [x] 2.4 Update `src/domains/customer/model/index.ts` to call `resolveContentSource` with domain schema and endpoint.
- [x] 2.5 Update `src/domains/technology/model/index.ts` to call `resolveContentSource` with domain schema and endpoint.
- [x] 2.6 Update `src/domains/word-cloud/model/index.ts` to call `resolveContentSource` with domain schema and endpoint.
- [x] 2.7 Update `src/domains/word-cloud/queries/useWordCloudConcepts.ts` to use resolver-provided env data as `initialData` (no runtime mock fallback).

## Phase 3: Mock Isolation + Configuration

- [x] 3.1 Update `src/domains/*/model/mock.ts` files to remove runtime env parsing or selection; keep fixtures for tests only.
- [x] 3.2 Update `.env.template` with unified env keys and `file:` convention for `src/environment-content/` (per config spec).

## Phase 4: Testing and Verification

- [x] 4.1 Add resolver unit tests in `src/lib/content-source/__tests__/` for env inline JSON (content-source spec: env present/valid).
- [x] 4.2 Add resolver unit tests in `src/lib/content-source/__tests__/` for file references, missing file, and parse errors (environment-content spec scenarios).
- [x] 4.3 Add resolver unit tests in `src/lib/content-source/__tests__/` for invalid env content (content-source spec: invalid env, no HTTP fallback).
- [x] 4.4 Add resolver unit tests in `src/lib/content-source/__tests__/` for HTTP fallback when env is absent (content-source spec: env absent).
- [x] 4.5 Update domain tests under `src/domains/content/model/__tests__/` and add/adjust tests for profile, navigation-item, customer, technology, word-cloud to confirm env-first behavior (domain specs: env present/absent, invalid env, no runtime mocks).
- [x] 4.6 Update any tests relying on `NEXT_PUBLIC_USE_MOCKS` to inject fixtures directly at the test layer (content-source spec: no runtime mock selection).
