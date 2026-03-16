# Design: Content Source Policy (Env First)

## Technical Approach

Introduce a centralized content-source resolver that enforces env-first resolution with strict schema validation and explicit HTTP fallback when env is absent. Domain models (content, profile, navigation item, customer, technology, word cloud) will call this resolver rather than reading environment values or mock data directly. Environment content will support JSON values in env or file references to `src/environment-content/` via a registry so client bundles can resolve content without filesystem access. Mock data will be confined to tests and removed from runtime selection paths.

## Architecture Decisions

### Decision: Centralize env-first resolution in a resolver module

**Choice**: Create `src/lib/content-source/index.ts` with a single resolver function used by all content domains.
**Alternatives considered**: Per-domain env parsing and HTTP fallback logic.
**Rationale**: A single resolver guarantees consistent env-first behavior, validation, and error handling, and makes the policy explicit in one place.

### Decision: Use a static environment-content registry for file references

**Choice**: Add `src/environment-content/index.ts` that imports JSON files and exposes a map keyed by relative file name. Env values use `file:<name>.json` to reference entries in the registry.
**Alternatives considered**: Node filesystem reads at runtime, dynamic import by path.
**Rationale**: Domain models and hooks run in client bundles, so filesystem reads are not viable. A registry provides deterministic, bundle-safe file access and enforces directory boundaries by design.

### Decision: Remove runtime mock selection flag usage

**Choice**: Eliminate `NEXT_PUBLIC_USE_MOCKS` from runtime fetch paths and HTTP utility; mocks remain available only in tests.
**Alternatives considered**: Keep flag and treat it as higher precedence than env.
**Rationale**: Specs require no runtime mock selection and env-first resolution. Keeping the flag would override env or block HTTP fallback.

## Data Flow

Env present path:

    Domain model -> resolveContentSource
         |                |
         |                -> read env value
         |                    -> inline JSON parse OR file registry lookup
         |                    -> Zod schema parse
         |                    -> return validated data
         -> return to query hook

Env absent path:

    Domain model -> resolveContentSource
         |                |
         |                -> env missing
         |                -> httpRequest(endpoint)
         |                -> Zod schema parse
         |                -> return validated data

## File Changes

| File                                                     | Action | Description                                                            |
| -------------------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| `src/lib/content-source/index.ts`                        | Create | Central env-first resolver with validation and HTTP fallback.          |
| `src/environment-content/index.ts`                       | Create | Static registry of JSON content files for env file references.         |
| `src/environment-content/*.json`                         | Create | Optional JSON payloads for domains that use file references.           |
| `src/domains/content/model/index.ts`                     | Modify | Use resolver for env-first + HTTP; remove mock fallback.               |
| `src/domains/profile/model/index.ts`                     | Modify | Use resolver for env-first + HTTP; remove mock fallback.               |
| `src/domains/navigation-item/model/index.ts`             | Modify | Use resolver for env-first + HTTP; remove mock fallback.               |
| `src/domains/customer/model/index.ts`                    | Modify | Use resolver for env-first + HTTP; remove mock fallback.               |
| `src/domains/technology/model/index.ts`                  | Modify | Use resolver for env-first + HTTP; add schema validation via resolver. |
| `src/domains/word-cloud/model/index.ts`                  | Modify | Use resolver for env-first + HTTP; remove mock fallback.               |
| `src/domains/word-cloud/queries/useWordCloudConcepts.ts` | Modify | Use resolver-provided env data as initialData; no mock fallback.       |
| `src/domains/*/model/mock.ts`                            | Modify | Remove runtime env parsing, keep fixtures for tests only.              |
| `src/lib/httpRequest/index.ts`                           | Modify | Remove `NEXT_PUBLIC_USE_MOCKS` short-circuit.                          |
| `.env.template`                                          | Modify | Document unified env keys and file reference convention.               |
| `src/lib/content-source/__tests__/*.test.ts`             | Create | Resolver unit tests for env, file, invalid, and fallback paths.        |
| `src/domains/content/model/__tests__/mock.test.ts`       | Modify | Update tests to use resolver or test-only fixtures.                    |

## Interfaces / Contracts

```ts
// src/lib/content-source/index.ts
import type { z } from "zod";

export type ContentSourceEnv =
  | { kind: "inline"; value: string }
  | { kind: "file"; fileName: string };

export interface ContentSourceOptions<T> {
  envKey: string;
  schema: z.ZodSchema<T>;
  endpoint: string;
  parseJson?: boolean;
}

export type ContentSourceResult<T> = Promise<T>;

export async function resolveContentSource<T>(
  options: ContentSourceOptions<T>
): ContentSourceResult<T>;
```

Env value contract:

```text
INLINE:  JSON string or raw string in env
FILE:    file:<name>.json (resolved via src/environment-content/index.ts)
```

Resolver behavior contract:

- If env key is set and valid -> return schema-validated data
- If env key is set but invalid -> throw validation error (no HTTP fallback)
- If env key is missing/empty -> call HTTP endpoint and validate

## Testing Strategy

| Layer | What to Test                                              | Approach                                                                    |
| ----- | --------------------------------------------------------- | --------------------------------------------------------------------------- |
| Unit  | Resolver env inline JSON parsing                          | New tests under `src/lib/content-source/__tests__/` with mocked env.        |
| Unit  | Resolver file reference parsing and directory restriction | Registry-based tests with known JSON fixtures.                              |
| Unit  | Resolver validation failure stops HTTP fallback           | Assert error thrown when schema fails.                                      |
| Unit  | HTTP fallback when env missing                            | Mock `httpRequest` and verify called only on missing env.                   |
| Unit  | Domain model integration                                  | Update existing domain tests or add new ones to verify env-first selection. |

## Migration / Rollout

No data migration required.

- Update `.env.template` with unified keys and `file:` convention.
- Provide example JSON files under `src/environment-content/` for local development.
- Remove reliance on `NEXT_PUBLIC_USE_MOCKS`; tests should inject fixtures directly.
- Deploy with env keys set in staging first; verify HTTP fallback when env keys are empty.

## Open Questions

- [ ] Confirm unified env key names per domain (proposed: `NEXT_PUBLIC_CONTENTS`, `NEXT_PUBLIC_PROFILES`, `NEXT_PUBLIC_NAV_ITEMS`, `NEXT_PUBLIC_CUSTOMERS`, `NEXT_PUBLIC_TECHNOLOGIES`, `NEXT_PUBLIC_WORD_CLOUD_CONCEPTS`).
