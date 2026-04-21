---
id: 04-stripe-go-production
aliases: []
tags: []
---

# Stripe Go-Live Plan (Production)

This runbook defines the safest rollout path for Payments V1 in production:

- P0: DB migration (`orders` + constraints/indexes)
- P1: create-session API
- P2: webhook status transitions (`pending -> paid|failed`)
- P3: monetization UI checkout integration
- P4: status-gated unlock (`/success`, `/cancel`)

## 1) Release Preparation

- Confirm `main` includes P0-P4 commits.
- Ensure no secrets are committed (`.env.vercel` with real keys must not be versioned).
- Deploy current code to production before enabling final payment traffic.

## 2) Production Environment Variables (Vercel)

Required:

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID_ARTICLE_PATTERN`
- `STRIPE_WEBHOOK_SECRET`

Recommended:

- `PAYMENT_UNLOCK_URL_ARTICLE_PATTERN`
- `PAYMENT_UNLOCK_URL_DEFAULT`

### DATABASE_URL format

Use runtime-safe suffix:

```txt
...?sslmode=require&uselibpqcompat=true
```

Notes:

- `uselibpqcompat=true` is needed by Node/pg runtime in this setup.
- `psql` does not support this param; local scripts strip it automatically.

## 3) Database Migration in Production

Run:

```bash
npm run db:prod:release
```

Then verify:

```bash
npm run db:prod:verify
```

Expected verification outcome includes:

- `orders` table exists
- `orders_status_check` (`pending|paid|failed`)
- unique index on `stripe_session_id`

Do not proceed to checkout testing if DB verification fails.

## 4) Stripe Dashboard Setup

### Product + Price

- Create or confirm product for the monetized article.
- Create one-time price and copy ID (`price_...`).
- Set `STRIPE_PRICE_ID_ARTICLE_PATTERN` in Vercel.

### Webhook

Create endpoint:

```txt
https://<your-domain>/api/webhooks/stripe
```

Subscribe to events:

- `checkout.session.completed`
- `checkout.session.expired`
- `payment_intent.payment_failed`

Copy signing secret (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`.

## 5) Redeploy

- Trigger a fresh production deployment after env updates.
- Confirm deployment is using updated variables.

## 6) End-to-End Smoke Tests (Sandbox First)

From:

```txt
/articles/why-portfolio-not-convert
```

Flow checks:

1. Click `Pay with Card`.
2. Confirm `POST /api/checkout/create-session` succeeds.
3. Confirm redirect to Stripe Checkout.
4. Complete payment using Stripe test card.
5. Confirm webhook processes event and updates order status.
6. Confirm `/success?order_id=...`:
   - `paid` -> unlock shown
   - `pending` -> processing message (no unlock)
   - `failed` -> failure message (no unlock)
7. Confirm `/cancel?order_id=...` shows cancellation message (no unlock).

## 7) Log Expectations (Healthy)

Should **not** appear:

- `SELF_SIGNED_CERT_IN_CHAIN`
- `relation "orders" does not exist`
- webhook signature validation errors for valid Stripe events

Should appear:

- successful checkout session creation
- webhook event processing with idempotent behavior for retries/duplicates

## 8) Controlled Go-Live

- Keep Stripe in sandbox until all smoke tests pass.
- Switch to live credentials only when checklist is green.
- Re-run minimal smoke test on live with controlled transaction.

## 9) Rollback Strategy

If critical issue detected:

- Disable card option in monetization config (or feature flag env if introduced).
- Keep `/success` and `/cancel` status-safe messaging active.
- Do not mark orders as paid manually unless incident procedure explicitly requires it.

## 10) Definition of Done (Production)

- [ ] Vercel env vars configured and consistent
- [ ] DB migration + verification fully green
- [ ] Stripe webhook endpoint active with correct events
- [ ] End-to-end sandbox payment succeeds
- [ ] `paid` unlock behavior confirmed
- [ ] `pending/failed/cancel` behavior confirmed (no unlock)
- [ ] Logs clean of TLS/schema errors
