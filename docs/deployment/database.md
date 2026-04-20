# Database Deployment Runbook

This runbook covers how to validate and migrate the production database used by Better Auth + Drizzle.

## Problem signal

If runtime logs show errors like:

- `relation "verification" does not exist`

your app is connected to Postgres, but required tables were never migrated on that environment.

## Prerequisites

- `DATABASE_URL` exported in your shell (production database target)
- `psql` installed locally
- Repo dependencies installed (`npm ci` or `npm install`)

TLS recommendation for current runtime compatibility:

- `...?sslmode=require&uselibpqcompat=true`

Notes:

- Parameter name is `uselibpqcompat` (with `pq`, not `pg`).
- `psql` does not understand `uselibpqcompat`; the provided scripts automatically strip it for `psql` checks and add it for Node/Drizzle migrate when needed.
- Some Supabase URLs include provider-specific params (for example `supa=...`); scripts ignore these for `psql` compatibility checks.

Alternative strict mode:

- `...?sslmode=verify-full`

## Plan B commands

These scripts read `DATABASE_URL` directly from the environment.

1. Connectivity + schema pre-check (non-destructive):

```bash
npm run db:prod:check
```

2. Run migrations:

```bash
npm run db:prod:migrate
```

3. Enforce post-migration verification:

```bash
npm run db:prod:verify
```

4. One-shot flow:

```bash
npm run db:prod:release
```

## What verification enforces

- Required tables exist:
  - `user`, `account`, `session`, `verification`, `user_two_factor`, `activity`
- `verification` columns are queryable
- Critical `activity` indexes exist (current or legacy naming accepted):
  - `activity_user_type_status_created_idx` (or legacy `activity_user_type_status_created_at_idx`)
  - `activity_request_resume_requested_idx` (or legacy `activity_user_type_requested_unique`)
- Core auth foreign keys exist across auth tables

## Local dry-run against production URL (safe checks only)

```bash
export DATABASE_URL='postgresql://...?...&sslmode=require&uselibpqcompat=true'
npm run db:prod:check
```

## Plan C (CI/CD)

Workflow file:

- `.github/workflows/db-prod-migration.yml`

Trigger:

- Manual (`workflow_dispatch`) from GitHub Actions UI.

Inputs:

- `operation`: `check` | `migrate` | `verify` | `release`
- `strict_tables`: whether `db:prod:check` fails when required tables are missing

Required secret:

- `PROD_DATABASE_URL` (recommended format: `...?sslmode=require&uselibpqcompat=true`)

Environment protection:

- The job runs under `environment: production`; configure required reviewers in GitHub Environment settings.

Recommended usage:

1. Run `operation=check`
2. Run `operation=release`
3. Deploy app
