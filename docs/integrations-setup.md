# Integrations Setup Guide

This guide covers Plausible, Upstash (rate limiting), and Postmark for this project.

## Plausible Analytics

### What it does
- Tracks UI events via `plausible-tracker`.

### Required env vars
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_PLAUSIBLE_HOST=
```

### Steps
1) Create a site in Plausible for your domain.
2) Copy the domain into `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
3) If you use the default Plausible cloud, set:
   - `NEXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io`
4) Deploy and verify events in Plausible dashboard.

---

## Upstash Redis (Rate Limiting)

### What it does
- Rate limits contact form submissions.

### Required env vars
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
UPSTASH_RATE_LIMIT_MAX=5
UPSTASH_RATE_LIMIT_WINDOW_MS=60000
```

### Steps
1) Go to Upstash Console.
2) Select **Redis** (not Box).
3) Create a Redis database (Free plan is OK).
4) Open the database details and copy:
   - REST URL -> `UPSTASH_REDIS_REST_URL`
   - REST TOKEN -> `UPSTASH_REDIS_REST_TOKEN`
5) Save env vars and redeploy.

---

## Postmark (Email Delivery)

### What it does
- Sends contact form messages to your email.

### Required env vars
```
POSTMARK_SERVER_TOKEN=
POSTMARK_SENDER_EMAIL=
POSTMARK_RECIPIENT_EMAIL=
```

### Steps
1) Create a Postmark server.
2) Add your domain in Sender Signatures.
3) Configure DNS records in your DNS provider:
   - DKIM (TXT)
   - Return-Path (CNAME)
4) Verify DKIM and Return-Path in Postmark.
5) Set:
   - `POSTMARK_SENDER_EMAIL` = a verified sender (e.g. contact@angelpixel.io)
   - `POSTMARK_RECIPIENT_EMAIL` = where you want to receive messages
   - `POSTMARK_SERVER_TOKEN` = server API token

### Deliverability notes
- If emails go to spam, confirm DKIM and Return-Path are verified.
- Optional: add DMARC record in DNS.

---

## Optional: NextAuth (Google OAuth)

### Env vars
```
NEXTAUTH_URL=http://localhost:9000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_OAUTH_ENABLED=true
```

### Steps
1) Create OAuth client in Google Cloud.
2) Authorized redirect URI:
   - `http://localhost:9000/api/auth/callback/google`
3) Copy Client ID/Secret into env.
4) Restart dev server.
