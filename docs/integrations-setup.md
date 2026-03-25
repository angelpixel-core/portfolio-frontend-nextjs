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

1. Create a site in Plausible for your domain.
2. Copy the domain into `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
3. If you use the default Plausible cloud, set:
   - `NEXT_PUBLIC_PLAUSIBLE_HOST=https://plausible.io`
4. Deploy and verify events in Plausible dashboard.

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

1. Go to Upstash Console.
2. Select **Redis** (not Box).
3. Create a Redis database (Free plan is OK).
4. Open the database details and copy:
   - REST URL -> `UPSTASH_REDIS_REST_URL`
   - REST TOKEN -> `UPSTASH_REDIS_REST_TOKEN`
5. Save env vars and redeploy.

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

1. Create a Postmark server.
2. Add your domain in Sender Signatures.
3. Configure DNS records in your DNS provider:
   - DKIM (TXT)
   - Return-Path (CNAME)
4. Verify DKIM and Return-Path in Postmark.
5. Set:
   - `POSTMARK_SENDER_EMAIL` = a verified sender (e.g. contact@angelpixel.io)
   - `POSTMARK_RECIPIENT_EMAIL` = where you want to receive messages
   - `POSTMARK_SERVER_TOKEN` = server API token

### Approval / Test Mode

- New Postmark accounts run in **Test Mode** until approved.
- While in Test Mode, you can only send to recipients on the **same domain** as the `From` address.
- After clicking **Request approval**, approval can take up to 24 hours (or next business day).

### How to complete the approval form

Recommended answers for a portfolio contact form:

- **Monthly volume**: `0–100`
- **Why Postmark?**
  - `Transactional contact form for my portfolio site. I need reliable delivery of inbound inquiries to my inbox.`
- **What types of messages?**
  - `Contact form submissions only (transactional). No marketing or newsletters.`
- **How are recipients acquired?**
  - `Recipients are myself (site owner). Messages are sent from a contact form with rate limiting and spam protection. No lists or subscriptions.`

### Deliverability notes

- If emails go to spam, confirm DKIM and Return-Path are verified.
- Optional: add DMARC record in DNS.

---

## Optional: Better Auth (OAuth + Email/Password)

### Env vars

```
BETTER_AUTH_URL=http://localhost:9000
BETTER_AUTH_SECRET=...
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
NEXT_PUBLIC_OAUTH_ENABLED=true
```

---

## Database (Postgres + Drizzle)

### Env vars (Docker)

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_NAME=portfolio_frontend_development
DB_USER=developer
DB_PASSWORD=abc123
DB_HOST=db
DB_PORT=5432
DATABASE_URL=postgresql://developer:abc123@db:5432/portfolio_frontend_development
DB_ADMIN_USER=admin@admin.com
DB_ADMIN_PASSWORD=postgres
DB_ADMIN_PORT=5050
```

### Local setup (Docker)

1. Start Postgres + pgAdmin:
   - `docker compose up -d db db_admin`
2. Optional: regenerate Better Auth schema:
   - `npm run auth:generate`
3. Generate migrations:
   - `npm run db:generate`
4. Apply migrations:
   - `npm run db:migrate`

### Create app role (if init script did not run)

If the `developer` role or database doesn’t exist (volume already initialized), run:

```
docker compose exec db psql -U postgres -d postgres -c "CREATE ROLE developer WITH LOGIN PASSWORD 'abc123';"
docker compose exec db psql -U postgres -d postgres -c "CREATE DATABASE portfolio_frontend_development OWNER developer;"
docker compose exec db psql -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_frontend_development TO developer;"
docker compose exec db psql -U postgres -d portfolio_frontend_development -c "GRANT USAGE, CREATE ON SCHEMA public TO developer;"
docker compose exec db psql -U postgres -d portfolio_frontend_development -c "ALTER SCHEMA public OWNER TO developer;"
```

### Google steps

1. Create OAuth client in Google Cloud.
2. Authorized redirect URI:
   - `http://localhost:9000/api/auth/callback/google`
3. Copy Client ID/Secret into env.
4. Restart dev server.

### Microsoft steps

1. Register an app in Azure AD (Microsoft Entra ID).
2. Add redirect URI:
   - `http://localhost:9000/api/auth/callback/microsoft`
3. Copy Client ID, Client Secret, and Tenant ID into env.
4. Restart dev server.

### GitHub steps

1. Create OAuth App in GitHub.
2. Authorization callback URL:
   - `http://localhost:9000/api/auth/callback/github`
3. Copy Client ID/Secret into env.
4. Restart dev server.

### LinkedIn steps

1. Create an app in LinkedIn Developer Portal.
2. Add redirect URL:
   - `http://localhost:9000/api/auth/callback/linkedin`
3. Copy Client ID/Secret into env.
4. Restart dev server.
