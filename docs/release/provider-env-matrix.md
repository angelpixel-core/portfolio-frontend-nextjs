# Provider Environment Matrix

This document is the source of truth for production and local auth-related variables.

## Canonical Origin Rule

Use one canonical production origin everywhere:

- `https://www.angelpixel.io`

Keep this aligned across:

- `BETTER_AUTH_URL`
- `SITE_URL`
- OAuth provider callbacks
- reCAPTCHA allowed domains

## Production Variables (Vercel)

| Variable                         | Required   | Expected value pattern      | Notes                                  |
| -------------------------------- | ---------- | --------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_OAUTH_ENABLED`      | Yes        | `true`                      | Enables OAuth buttons and flows.       |
| `BETTER_AUTH_URL`                | Yes        | `https://www.angelpixel.io` | Must match exact public origin.        |
| `BETTER_AUTH_SECRET`             | Yes        | 32+ chars random            | Stable secret, do not rotate casually. |
| `DATABASE_URL`                   | Yes        | `postgresql://...`          | Runtime DB for Better Auth + app APIs. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Yes        | reCAPTCHA v3 site key       | Browser-side key.                      |
| `RECAPTCHA_SECRET_KEY`           | Yes        | reCAPTCHA v3 secret         | Server-side key.                       |
| `RECAPTCHA_MIN_SCORE`            | Yes        | `0.1`-`0.9`                 | Usually `0.3`-`0.5`.                   |
| `GOOGLE_CLIENT_ID`               | If enabled | OAuth client id             | Google provider.                       |
| `GOOGLE_CLIENT_SECRET`           | If enabled | OAuth client secret         | Google provider.                       |
| `GITHUB_CLIENT_ID`               | If enabled | OAuth client id             | GitHub provider.                       |
| `GITHUB_CLIENT_SECRET`           | If enabled | OAuth client secret         | GitHub provider.                       |
| `MICROSOFT_CLIENT_ID`            | If enabled | OAuth client id             | Microsoft provider.                    |
| `MICROSOFT_CLIENT_SECRET`        | If enabled | OAuth client secret         | Microsoft provider.                    |
| `MICROSOFT_TENANT_ID`            | If enabled | `common` or tenant id       | Microsoft provider.                    |
| `LINKEDIN_CLIENT_ID`             | If enabled | OAuth client id             | LinkedIn provider.                     |
| `LINKEDIN_CLIENT_SECRET`         | If enabled | OAuth client secret         | LinkedIn provider.                     |
| `SITE_URL`                       | Yes        | `https://www.angelpixel.io` | Metadata and sitemap origin.           |

## Local Variables

| Variable                    | Local value                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `BETTER_AUTH_URL`           | `http://localhost:9000`                                                               |
| `SITE_URL`                  | `http://localhost:9000` (or production URL if intentionally testing sitemap behavior) |
| `NEXT_PUBLIC_OAUTH_ENABLED` | `true`/`false` as needed                                                              |
| `RECAPTCHA_BYPASS_LOCAL`    | `true` only when browser returns `browser-error` and you need to continue local QA    |

Never enable `RECAPTCHA_BYPASS_LOCAL` in production.
