# Environment Stages and File Hierarchy

This document defines the environment strategy for local development and Vercel deployment.

## 1) Source of Truth

For deployed environments, the source of truth is:

- **Vercel Project Settings > Environment Variables**

Use three scopes in Vercel:

- `Development`
- `Preview`
- `Production`

Do not treat repository `.env` files as deployment source-of-truth.

## 2) File Hierarchy

### Versioned (safe)

- `.env.template` — canonical superset for local setup and documentation.
- `.env.production.template` — production-oriented template and checklist.
- `.env.vercel.example` — lightweight Vercel mapping reference.

### Ignored (local/operational)

- `.env.local` — developer local runtime.
- `.env.production` — optional local simulation of production runtime.
- `.env.vercel` — private local copy for operational notes/export; **never committed**.

## 3) Stage Mapping

| Stage       | Runtime values come from            | Local helper file                                  |
| ----------- | ----------------------------------- | -------------------------------------------------- |
| Development | Vercel `Development` or local shell | `.env.local`                                       |
| Preview     | Vercel `Preview`                    | optional `.env.vercel` (local reference only)      |
| Production  | Vercel `Production`                 | optional `.env.production` (local simulation only) |

## 4) Practical Workflow

1. Add/update keys in `.env.template` and/or `.env.production.template`.
2. Replicate real values in Vercel dashboard per scope.
3. Keep any real-value local files (`.env.local`, `.env.vercel`) untracked.
4. Validate critical flows after env updates:
   - auth/session
   - forms/email
   - subscriptions lifecycle
   - payments/webhooks

## 5) Security Rules

- Never commit real secrets (`STRIPE_*`, `POSTMARK_*`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.).
- If a secret was committed at any point, rotate it and update Vercel values.
- `NEXT_PUBLIC_*` are public at runtime; treat them as non-secret configuration.

## 6) Notes for This Repository

- `.env.vercel` is intentionally ignored and should remain local-only.
- `.env.vercel.example` is the safe committed reference.
- `NEXT_PUBLIC_MONETIZATION_MODE` controls article CTA behavior by stage (`checkout`, `contact`, `subscribe`).
