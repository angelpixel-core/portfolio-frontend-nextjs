# Vercel Deployment Procedure

This document describes how to deploy the portfolio frontend to Vercel.

## Deployment Profile (Chosen)

This project currently targets **full_next_api** on Vercel.

- Next.js app + API routes run on Vercel.
- No separate backend-for-frontend service.
- Forms remain fully functional:
  - CV Request (`/api/resume-request`)
  - Let’s Talk (`/api/messages`)
  - HireMe (same request/email flow)
- Email delivery uses Postmark.
- Auth and 2FA use Better Auth + Postgres.

## Prerequisites

- Vercel account with access to the target team/project.
- Repository access (GitHub/GitLab/Bitbucket) for Vercel to connect.
- Production domain ready (DNS managed in Vercel or external provider).
- Postgres instance (Vercel Postgres or external) if Better Auth is enabled.
- OAuth app credentials for any social providers you plan to enable.

## Environment variables

Source of truth: `.env.template` and `.env.production.template`.

Set environment variables in Vercel per environment (Production / Preview). For this repository, use the **full_next_api** variable set.

### Required for basic site

- `NEXT_PUBLIC_AUTHOR_NAME`
- `NEXT_PUBLIC_AUTHOR_ROLE`
- `NEXT_PUBLIC_CONTACT_EMAIL`
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

Recommended static values for this project:

- `NEXT_PUBLIC_CONTENTS=file:contents.json`
- `NEXT_PUBLIC_PROFILES=file:profiles.json`
- `NEXT_PUBLIC_NAV_ITEMS=file:navigation-items.json`
- `NEXT_PUBLIC_CUSTOMERS=file:customers.json`
- `NEXT_PUBLIC_TECHNOLOGIES=file:technologies.json`
- `NEXT_PUBLIC_WORD_CLOUD_CONCEPTS=file:word-cloud-concepts.json`

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

### Better Auth (full_next_api)

- `NEXT_PUBLIC_OAUTH_ENABLED=true`
- `BETTER_AUTH_URL=https://www.angelpixel.io` (must match exact public origin)
- `BETTER_AUTH_SECRET=<32+ char secret>`

2FA:

- `TWO_FACTOR_ISSUER`
- `TWO_FACTOR_ENCRYPTION_KEY`
- `TWO_FACTOR_RECOVERY_PEPPER`

Social providers (only needed for providers you enable):

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` / `MICROSOFT_TENANT_ID`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET`

Microsoft env fallback is supported in code via `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`.

### Database (required for full_next_api)

Configure Postgres for Better Auth + Drizzle:

- `DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>?sslmode=require`

Optional compatibility vars (if scripts/features still use them):

- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`

`DATABASE_URL` is the primary source for runtime DB connectivity.

#### Where to get `DATABASE_URL` / `DB_PORT`

- **Vercel Postgres**:
  - In Vercel: Storage -> Postgres -> Connect.
  - Copy `POSTGRES_URL`/`DATABASE_URL` from generated env vars.
  - `DB_PORT` is the port inside that URL.
- **Neon / Supabase / Railway / RDS**:
  - Copy the connection string from provider dashboard.
  - Parse host/port/user/db from the URL only if you need split `DB_*` vars.

Example:

`postgresql://app_user:***@ep-xyz.us-east-1.aws.neon.tech:5432/app_db?sslmode=require`

- `DB_HOST=ep-xyz.us-east-1.aws.neon.tech`
- `DB_PORT=5432`
- `DB_USER=app_user`
- `DB_NAME=app_db`

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

Suggested release order:

1. Set production env vars in Vercel.
2. Run DB migrations against production DB.
3. Deploy.
4. Validate auth + forms + mail delivery.

## Better Auth settings

Auth API route is `src/app/api/auth/[...all]/route.ts` (Better Auth Next.js handler).

Checklist:

- Set `BETTER_AUTH_URL` to your production domain.
- Set `BETTER_AUTH_SECRET` to a strong secret.
- Provide `DATABASE_URL` and DB env vars.
- Enable `NEXT_PUBLIC_OAUTH_ENABLED=true`.

Detailed operational guides:

- `docs/release/provider-env-matrix.md`
- `docs/release/provider-runbook-auth.md`
- `docs/release/provider-runbook-recaptcha.md`

## OAuth callback URLs

Use the same canonical origin as `BETTER_AUTH_URL`.

Production callbacks (recommended canonical domain):

- Google: `https://www.angelpixel.io/api/auth/callback/google`
- Microsoft: `https://www.angelpixel.io/api/auth/callback/microsoft`
- GitHub: `https://www.angelpixel.io/api/auth/callback/github`
- LinkedIn: `https://www.angelpixel.io/api/auth/callback/linkedin`

Local callbacks:

- Google: `http://localhost:9000/api/auth/callback/google`
- Microsoft: `http://localhost:9000/api/auth/callback/microsoft`
- GitHub: `http://localhost:9000/api/auth/callback/github`
- LinkedIn: `http://localhost:9000/api/auth/callback/linkedin`

Provider-side allowed origins/URLs checklist:

- Google OAuth:
  - Authorized JavaScript origins: `https://www.angelpixel.io`, `http://localhost:9000`
  - Authorized redirect URI: `https://www.angelpixel.io/api/auth/callback/google` (+ localhost variant for dev)
- GitHub OAuth App:
  - Homepage URL: `https://www.angelpixel.io`
  - Authorization callback URL: `https://www.angelpixel.io/api/auth/callback/github`
- Microsoft Entra ID App:
  - Redirect URI (Web): `https://www.angelpixel.io/api/auth/callback/microsoft`
  - Also add `http://localhost:9000/api/auth/callback/microsoft` for local dev
- LinkedIn Developer App:
  - Authorized redirect URLs: `https://www.angelpixel.io/api/auth/callback/linkedin`
  - Add localhost callback for local testing if required

Provider notes:

- Microsoft provider slug is `microsoft` (not `azure-ad`).

## CI considerations

- CI uses `npm ci --legacy-peer-deps` and provides a minimal Better Auth env for readiness checks.
- Keep Vercel build lightweight: do not run tests in Vercel.
- Use GitHub Actions for lint, typecheck, unit, and E2E tests.

## Rollout checklist

1. Confirm Production env vars in Vercel (including `SITE_URL`).
2. Deploy to a Preview URL and validate core pages and assets.
3. Validate OAuth flows and session cookies.
4. Validate `CV Request`, `Let's Talk`, and `HireMe` end-to-end (request + email delivery).
5. Promote the build to Production (or merge to main if auto-deploy is enabled).

## Rollback

- Use Vercel Deployments to redeploy a previous successful build.
- If the issue is env related, revert env changes first and redeploy.
- For auth or DB issues, disable auth by setting `NEXT_PUBLIC_OAUTH_ENABLED=false` and redeploy.
