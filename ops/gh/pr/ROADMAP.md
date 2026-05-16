# PR Operations Roadmap (English)

## Context

This directory owns Pull Request document workflows for this repository:

- Generate PR docs (`new.sh`)
- Persist PRs to GitHub (`create.sh`)
- Promote draft to ready-for-review (`promote.sh`)

Current implementation is local to this repo, while preserving PR document history in git.

## Domain Boundary

Subdomain: `ops/gh/pr`

Responsibility:

- PR document lifecycle and metadata persistence.
- Idempotent GitHub PR creation/promotion based on `base/head` + frontmatter.

Out of scope:

- CI/CD deployment workflows.
- Release/version publishing for application artifacts.

## Current State

- Markdown + frontmatter contract is active and used by scripts.
- Naming conventions support draft and ready states.
- PR metadata is persisted in doc frontmatter (`pr_number`, `pr_url`, `pr_state`).

## Target State

Extract PR operations into external reusable tooling (`angelpixel-core/gh-ops`) while keeping project-local PR docs/history.

### Keep in each app repo

- `ops/gh/pr/queue/*.md` (historical PR docs)
- local template overrides (`template.md`) if needed
- local config file (future): `.gh-ops.yml`

### Move to external tooling

- command implementation (`new`, `create`, `promote`)
- frontmatter and naming validation engine
- idempotency and GitHub integration logic

## Stable Contract (must remain compatible)

### Naming patterns

- Draft: `YYYY-MM-DD__base-to-head__slug__draft.md`
- Ready: `YYYY-MM-DD__base-to-head__slug__<sha7>.md`

### Required frontmatter

- `base`
- `head`
- `title`

### Persisted metadata

- `pr_number`
- `pr_url`
- `pr_state` (`draft|ready`)
- `created_at`
- `last_synced_at`

## Progressive Extraction Plan

### Phase 1 - Contract Freeze

- Lock naming + frontmatter keys.
- Keep local scripts as reference behavior.
- Add fixtures for draft and ready docs.

### Phase 2 - External CLI Bootstrap

- Create `gh-ops` CLI with `pr new/create/promote`.
- Port exact idempotency behavior.
- Add tests for parser + GitHub command wrappers.

### Phase 3 - Repo Adoption

- Replace local script internals with thin wrappers (or direct CLI calls).
- Keep docs and queue in repo.
- Validate no workflow regressions.

### Phase 4 - Final Separation

- Remove local implementation duplication.
- Maintain only integration docs and optional local overrides.

## Idempotency Rules

- Before creating PR, resolve existing PR by `base/head`.
- Re-running `create` must not duplicate PRs.
- Re-running `promote` on ready PR must be a no-op.
- Frontmatter must be updated after each operation.

## Risks and Mitigations

- **Risk:** Parser drift across repos.
  - **Mitigation:** Contract tests with markdown fixtures.
- **Risk:** GitHub API shape changes.
  - **Mitigation:** Wrap `gh` calls behind stable adapters + integration tests.
- **Risk:** Mixed local paths.
  - **Mitigation:** enforce configurable root path and defaults.

## Acceptance Criteria

- External CLI reproduces current behavior in this repo.
- PR document history stays in app repo git history.
- No duplicated PRs on repeated `create`.
- Draft-to-ready promotion is idempotent.
