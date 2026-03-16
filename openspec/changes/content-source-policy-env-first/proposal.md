# Proposal: Content Source Policy (Env First)

## Intent

Unify how content is sourced so environment configuration is the primary source of truth, with HTTP as an explicit fallback, and mocks confined to testing. This removes ambiguity across domains and aligns runtime content behavior with deployment configuration.

## Scope

### In Scope

- Define a single content policy resolver that prefers env and falls back to HTTP when missing.
- Introduce an `environment-content/` folder for complex JSON env payloads and consistent parsing.
- Standardize env keys and align domain model fetch paths to the new policy.

### Out of Scope

- Reworking UI presentation or layout of content.
- Changing backend endpoints or API contracts.
- Removing existing mock fixtures used only by tests.

## Approach

Create a centralized env-first resolver that loads content from environment variables (including JSON files surfaced via env), then uses HTTP if env is absent. Update domain models to use the resolver, relocate mock usage to tests only, and unify env key names in config and templates.

## Affected Areas

| Area                                        | Impact   | Description                                                |
| ------------------------------------------- | -------- | ---------------------------------------------------------- |
| `src/lib/content-source/index.ts`           | New      | Env-first resolver and HTTP fallback utilities.            |
| `src/environment-content/`                  | New      | JSON files referenced by env for complex content payloads. |
| `src/domains/content/model/mock.ts`         | Modified | Remove runtime mock sourcing; route to resolver.           |
| `src/domains/profile/model/mock.ts`         | Modified | Align env keys and resolver usage.                         |
| `src/domains/navigation-item/model/mock.ts` | Modified | Replace env parsing with resolver; standardize env key.    |
| `src/domains/customer/model/mock.ts`        | Modified | Replace env parsing with resolver; standardize env key.    |
| `src/domains/technology/model/mock.ts`      | Modified | Replace env parsing with resolver; standardize env key.    |
| `src/domains/word-cloud/model/mock.ts`      | Modified | Replace env parsing with resolver; standardize env key.    |
| `.env.template`                             | Modified | Document unified env keys and JSON file conventions.       |

## Risks

| Risk                                                    | Likelihood | Mitigation                                                             |
| ------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| Missing env variables cause empty content in production | Medium     | Provide defaults in resolver and validate required keys at build time. |
| Divergence between JSON file content and env values     | Low        | Single source: env points to file, resolver validates shape.           |
| Tests depending on mock behavior break                  | Medium     | Update tests to inject mocks at test layer only.                       |

## Rollback Plan

Revert resolver usage in domain models to prior mock/env parsing, remove `src/lib/content-source/index.ts` and `src/environment-content/`, and restore previous env key usage in `.env.template`. This returns to the pre-change behavior without API changes.

## Dependencies

- None (internal refactor of content sourcing).

## Success Criteria

- [ ] All content domains resolve from env first and only fall back to HTTP when env is absent.
- [ ] Mock data is used only in tests; no runtime mock selection via `NEXT_PUBLIC_USE_MOCKS`.
- [ ] `.env.template` documents the unified keys and JSON file conventions.
- [ ] Content-related tests updated and passing.
