# Auth Provider Runbook

Operational manual for OAuth and Better Auth configuration.

## Purpose

Ensure login/register works for:

- Email/password signup and login
- Social sign-in (new user creates account automatically, existing user logs in)

## 1) Set canonical production origin

Decide and keep one origin everywhere.

Recommended:

- `https://www.angelpixel.io`

## 2) Configure Vercel first

Project settings:

- Environment Variables: `https://vercel.com/<team>/<project>/settings/environment-variables`
- Domains: `https://vercel.com/<team>/<project>/settings/domains`
- Logs: `https://vercel.com/<team>/<project>/logs`

Set at minimum:

- `NEXT_PUBLIC_OAUTH_ENABLED=true`
- `BETTER_AUTH_URL=https://www.angelpixel.io`
- `BETTER_AUTH_SECRET=<strong secret>`
- `DATABASE_URL=<postgres url>`

## 3) Provider callback URLs

Use these in production:

- Google: `https://www.angelpixel.io/api/auth/callback/google`
- Microsoft: `https://www.angelpixel.io/api/auth/callback/microsoft`
- GitHub: `https://www.angelpixel.io/api/auth/callback/github`
- LinkedIn: `https://www.angelpixel.io/api/auth/callback/linkedin`

Use these in local development:

- Google: `http://localhost:9000/api/auth/callback/google`
- Microsoft: `http://localhost:9000/api/auth/callback/microsoft`
- GitHub: `http://localhost:9000/api/auth/callback/github`
- LinkedIn: `http://localhost:9000/api/auth/callback/linkedin`

## 4) Provider console paths

### Google OAuth

- Console: `https://console.cloud.google.com/apis/credentials`
- Consent screen: `https://console.cloud.google.com/apis/credentials/consent`
- Configure:
  - Authorized JavaScript origins: `https://www.angelpixel.io`, `http://localhost:9000`
  - Authorized redirect URI: production callback + local callback

### GitHub OAuth App

- Console: `https://github.com/settings/developers`
- Configure:
  - Homepage URL: `https://www.angelpixel.io`
  - Authorization callback URL: `https://www.angelpixel.io/api/auth/callback/github`

### Microsoft Entra ID

- Console: `https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade`
- Configure app Authentication -> Web redirect URIs:
  - `https://www.angelpixel.io/api/auth/callback/microsoft`
  - `http://localhost:9000/api/auth/callback/microsoft` (dev)

### LinkedIn

- Console: `https://www.linkedin.com/developers/apps`
- Configure Auth redirect URLs:
  - `https://www.angelpixel.io/api/auth/callback/linkedin`
  - `http://localhost:9000/api/auth/callback/linkedin` (if local testing enabled)

## 5) Smoke validation checklist

After deploy:

1. Open auth modal and run Google/GitHub/Microsoft/LinkedIn social sign-in.
2. Verify new social account creates user and logs in directly.
3. Verify existing social account logs in directly.
4. Verify email signup works.
5. Verify email login works.

## 6) Fast failure map

- `recaptcha_invalid` on `/api/auth/sign-in/social`:
  - Auth reCAPTCHA guard incorrectly applied to social endpoint.
- `INVALID_CALLBACK_URL`:
  - `BETTER_AUTH_URL` and callback origin mismatch, or provider callback differs.
- OAuth popup/redirect loops:
  - Wrong callback URL in provider console or wrong domain canonicalization.
