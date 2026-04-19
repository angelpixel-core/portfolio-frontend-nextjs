# reCAPTCHA Provider Runbook

Operational manual for Google reCAPTCHA v3 setup and verification.

## Provider Console

- Admin: `https://www.google.com/recaptcha/admin`

## Required keys

- Site key -> `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- Secret key -> `RECAPTCHA_SECRET_KEY`

Both must belong to the same reCAPTCHA v3 site.

## Allowed domains

Add these domains in reCAPTCHA settings:

- `www.angelpixel.io`
- `angelpixel.io`
- `localhost`
- `127.0.0.1`

## App-side variables

Production:

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<prod site key>`
- `RECAPTCHA_SECRET_KEY=<prod secret>`
- `RECAPTCHA_MIN_SCORE=0.5` (adjust to `0.3` if false positives are high)

Local development (optional safeguard):

- `RECAPTCHA_BYPASS_LOCAL=true` only for local debugging when browser returns `browser-error`

Never enable `RECAPTCHA_BYPASS_LOCAL` in production.

## Verification steps

1. Open page, confirm `https://www.google.com/recaptcha/api.js?...` loads (not blocked by CSP).
2. Submit contact form.
3. Confirm `/api/messages` returns `200` on valid submission.

If it fails, inspect server logs for:

- `reason`
- `score`
- `action`
- `errorCodes`

## Error quick map

- `recaptcha_invalid` (`400`): missing token/action, action mismatch, or missing secret/token.
- `recaptcha_failed` (`403`): verification failed, low score, or upstream verification issue.
- `verification_failed` + `browser-error`: browser-side generation blocked/failed; check tracking protection/extensions or domain/key mismatch.
