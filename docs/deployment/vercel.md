# Vercel Deployment Procedure

This document describes how to deploy the portfolio frontend to Vercel.

## Prerequisites

- Vercel account with access to the target team/project.
- Repository access (GitHub/GitLab/Bitbucket) for Vercel to connect.
- Production domain ready (DNS managed in Vercel or external provider).
- Postgres instance (Vercel Postgres or external) if Better Auth is enabled.
- OAuth app credentials for any social providers you plan to enable.

## Environment variables

Source of truth: `.env.template` and `.env.vercel`.

Set environment variables in Vercel per environment (Production / Preview). Use `.env.vercel` as the minimal baseline for a production deploy with mocks + auth disabled.

### Required for basic site

- `NEXT_PUBLIC_AUTHOR_NAME`
- `NEXT_PUBLIC_AUTHOR_ROLE`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_RESUME_URL`
- `NEXT_PUBLIC_LOGO_IMAGE`
- `NEXT_PUBLIC_HERO_IMAGE`
- `NEXT_PUBLIC_HERO_LINK_PROVIDER`
- `NEXT_PUBLIC_HIRE_ME_PROVIDER`
- `NEXT_PUBLIC_SITE_KEYWORDS`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional if analytics enabled)
- `NEXT_PUBLIC_PLAUSIBLE_HOST` (optional if analytics enabled)
- `SITE_URL` (required for sitemap and Open Graph)

### Content and navigation sources

- `NEXT_PUBLIC_CONTENTS`
- `NEXT_PUBLIC_PROFILES`
- `NEXT_PUBLIC_NAV_ITEMS`
- `NEXT_PUBLIC_CUSTOMERS`
- `NEXT_PUBLIC_TECHNOLOGIES`
- `NEXT_PUBLIC_WORD_CLOUD_CONCEPTS`

Values can be inline JSON or `file:<name>.json` and map to `src/environment-content/<name>.json`.

### Optional integrations

Postmark (email delivery):

- `POSTMARK_SERVER_TOKEN`
- `POSTMARK_SENDER_EMAIL`
- `POSTMARK_RECIPIENT_EMAIL`

Upstash (rate limiting):

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_RATE_LIMIT_MAX`
- `UPSTASH_RATE_LIMIT_WINDOW_MS`

reCAPTCHA v3:

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `RECAPTCHA_MIN_SCORE`

Recommended `RECAPTCHA_MIN_SCORE` thresholds:

- `0.1` permissive (low friction, higher bot risk)
- `0.3` balanced for most forms
- `0.5` stricter (typical for public contact forms)
- `0.7` aggressive (high friction, fewer false positives on trusted traffic)

Domain restrictions and test keys:

- Keys are domain-bound; add your production domain and any Vercel preview domains you expect to use.
- `localhost` (and `127.0.0.1`) must be explicitly allowlisted for local dev.
- Google reCAPTCHA provides test keys for local or automated testing; they always return predictable scores and should not be used in production.

### Better Auth

Enable only when the backend auth flow is ready.

- `NEXT_PUBLIC_OAUTH_ENABLED=true`
- `BETTER_AUTH_URL=https://<your-domain>`
- `BETTER_AUTH_SECRET=<32+ char secret>`

Social providers (only needed for providers you enable):

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` / `MICROSOFT_TENANT_ID`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET`

Microsoft env fallback is supported in code via `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`.

### Database (Better Auth only)

If Better Auth is enabled, configure Postgres:

- `DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>`
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`

`DATABASE_URL` is the app connection string used by Better Auth + Drizzle.

## Vercel project setup

1. Create a new Vercel project and connect the repo.
2. Framework preset: Next.js.
3. Root directory: repository root (this app is already at the repo root).
4. Add environment variables for Production and Preview.
5. Assign your production domain in Vercel and verify DNS.

## Build settings

Recommended Vercel settings:

- Install Command: `npm ci --legacy-peer-deps`
- Build Command: `npm run build`
- Output Directory: `.next`
- Node.js version: use the repo default (set in Vercel Project Settings if required)

Notes:

- `npm run build` runs `next-sitemap` postbuild; `SITE_URL` must be set.
- Avoid running tests in Vercel builds; tests are handled in CI.

## Database configuration

- Use Vercel Postgres or an external provider (Neon, Supabase, RDS).
- Ensure `DATABASE_URL` is available at build and runtime.
- Run migrations outside of Vercel build (CI/CD or manual release step).
- For local dev or CI readiness checks, see `docs/integrations-setup.md` for Docker-based workflows.

## Better Auth settings

Auth API route is `src/app/api/auth/[...all]/route.ts` (Better Auth Next.js handler).

Checklist:

- Set `BETTER_AUTH_URL` to your production domain.
- Set `BETTER_AUTH_SECRET` to a strong secret.
- Provide `DATABASE_URL` and DB env vars.
- Enable `NEXT_PUBLIC_OAUTH_ENABLED=true`.

## OAuth callback URLs

Replace `<your-domain>` with the production domain.

- Google: `https://<your-domain>/api/auth/callback/google`
- Microsoft: `https://<your-domain>/api/auth/callback/microsoft`
- GitHub: `https://<your-domain>/api/auth/callback/github`
- LinkedIn: `https://<your-domain>/api/auth/callback/linkedin`

Provider notes:

- Microsoft provider slug is `microsoft` (not `azure-ad`).

## CI considerations

- CI uses `npm ci --legacy-peer-deps` and provides a minimal Better Auth env for readiness checks.
- Keep Vercel build lightweight: do not run tests in Vercel.
- Use GitHub Actions for lint, typecheck, unit, and E2E tests.

## Rollout checklist

1. Confirm Production env vars in Vercel (including `SITE_URL`).
2. Deploy to a Preview URL and validate core pages and assets.
3. If Better Auth is enabled, validate the OAuth flows and session cookies.
4. Promote the build to Production (or merge to main if auto-deploy is enabled).

## Rollback

- Use Vercel Deployments to redeploy a previous successful build.
- If the issue is env related, revert env changes first and redeploy.
- For auth or DB issues, disable auth by setting `NEXT_PUBLIC_OAUTH_ENABLED=false` and redeploy.
