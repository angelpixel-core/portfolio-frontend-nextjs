# PR Ops Workflow (English)

This folder contains scripts to manage PRs using Markdown documents as the source of truth.

## Files

- `template.md`: template used to create new PR docs.
- `new.sh`: creates a PR doc in `ops/gh/pr/queue/` and auto-commits it.
- `create.sh`: validates the doc, optionally commits doc updates, creates/fetches a PR, and writes PR metadata back to frontmatter.
- `promote.sh`: promotes a draft PR to ready-for-review (idempotent).

## Naming Convention

Draft document:

`YYYY-MM-DD__base-to-head__slug__draft.md`

Ready document:

`YYYY-MM-DD__base-to-head__slug__<sha7>.md`

Examples:

- `2026-05-16__main-to-develop__phase3-guardrails__draft.md`
- `2026-05-16__main-to-develop__phase3-guardrails__4e3b043.md`

## 1) Create PR document

```bash
ops/gh/pr/new.sh --slug phase3-guardrails --base main --head develop --draft
```

This will:

- create the PR document from template,
- preload frontmatter values,
- append commit list from `base..head`,
- auto-commit using conventional commits:
  - draft: `docs(pr): add PR draft document <slug>`
  - ready: `docs(pr): add PR document <slug>`

## 2) Create / persist PR on GitHub

```bash
ops/gh/pr/create.sh --file ops/gh/pr/queue/<file>.md
```

Behavior:

- Validates filename + required frontmatter (`base`, `head`, `title`).
- Checks if PR already exists with `gh pr list --base <base> --head <head>`.
- If the PR doc has changes, prompts to commit with:
  - `docs(pr): update PR#XXX document details` (if PR exists)
  - `docs(pr): update PR document details` (if PR does not exist yet)
- If answer is not `Y`, aborts.
- Creates draft/ready PR if it does not exist.
- Updates frontmatter with `pr_number`, `pr_url`, `pr_state`, `last_synced_at`.

## 3) Promote draft PR to ready-for-review

```bash
ops/gh/pr/promote.sh --file ops/gh/pr/queue/<file>.md
```

Behavior:

- Uses `pr_number`/`pr_url` from frontmatter.
- If missing, resolves by `base/head`.
- If already ready, no-op.
- If draft, runs `gh pr ready <number>`.
- Updates frontmatter to `pr_state: ready`.

## Requirements

- GitHub CLI installed and authenticated (`gh auth status`).
- `jq` available (used by scripts to parse JSON from `gh`).

## Notes

- This flow is designed to be idempotent.
- PR metadata is persisted in the same Markdown document.

## Planning Docs

- `ROADMAP.md`: extraction and hardening plan for a future external `gh-ops` CLI.
