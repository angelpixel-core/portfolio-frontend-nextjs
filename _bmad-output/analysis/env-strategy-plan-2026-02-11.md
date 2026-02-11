# Env Strategy Plan

> Generated: 2026-02-11
> Phase: Architectural Consolidation (pre-production)
> Status: DRAFT

## Current Inventory: 28 NEXT_PUBLIC_ + 13 server-side

| Category | Count | Variables |
|----------|-------|-----------|
| **Runtime Config** | 5 | `USE_MOCKS`, `API_HOST`, `BACKEND_PORT`, `TRANSITION_PAUSE_MS`, `OAUTH_ENABLED` |
| **Identity** | 2 | `AUTHOR_NAME`, `CONTACT_EMAIL` |
| **Social IDs** | 7 | `LINKEDIN_USERNAME`, `GITHUB_USERNAME`, `TWITTER_USERNAME`, `DRIBBBLE_USERNAME`, `TELEGRAM_USERNAME`, `WHATSAPP_PHONE`, `CALENDLY_USERNAME` |
| **Structural Data** | 3 | `NAV_ITEMS`, `CUSTOMERS`, `TECHNOLOGIES` (JSON arrays) |
| **Page Content** | 6 | `HOME_TITLE/DESC/CONTENT`, `ABOUT_TITLE/DESC/CONTENT` |
| **Assets/URLs** | 3 | `HERO_IMAGE`, `LOGO_IMAGE`, `RESUME_URL` |
| **UI Behavior** | 2 | `HERO_LINK_PROVIDER`, `HIRE_ME_PROVIDER` |
| **Deprecated** | 5 | `PROFILE_EMAIL`, `CALENDLY_URL`, `TELEGRAM_URL`, `WHATSAPP_URL`, `RESUME_URL` (server) |
| **Server-only** | 13 | `NODE_ENV`, `SITE_URL`, DB vars, `CLIENT_ID`, `API_KEY` |

## Minimal `.env.production` Template

```bash
# === REQUIRED ===
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_HOST=https://api.yourdomain.com
NEXT_PUBLIC_BACKEND_PORT=443
SITE_URL=https://yourdomain.com

# === AUTH (when backend ready) ===
NEXT_PUBLIC_OAUTH_ENABLED=true

# === IDENTITY (keep in env -- changes per deployment) ===
NEXT_PUBLIC_AUTHOR_NAME=Angel Szymczak
NEXT_PUBLIC_CONTACT_EMAIL=angel.solutions@pm.me

# === SOCIAL (keep in env -- personalization) ===
NEXT_PUBLIC_LINKEDIN_USERNAME=angelszymczak
NEXT_PUBLIC_GITHUB_USERNAME=angelszymczak
NEXT_PUBLIC_TWITTER_USERNAME=angelszymczak
NEXT_PUBLIC_WHATSAPP_PHONE=5491122334455
NEXT_PUBLIC_CALENDLY_USERNAME=angelszymczak
NEXT_PUBLIC_TELEGRAM_USERNAME=angelszymczak

# === ASSETS ===
NEXT_PUBLIC_RESUME_URL=https://drive.google.com/my-resume
```

**Total: ~15 variables** (down from 41 current).

## What Should Move to Backend

| Variable | Reason | Backend Endpoint |
|----------|--------|-----------------|
| `NAV_ITEMS` | Structural data, not env config | `GET /api/v1/site/navigation` |
| `CUSTOMERS` | CMS-managed content | `GET /api/v1/site/customers` |
| `TECHNOLOGIES` | CMS-managed content | `GET /api/v1/site/technologies` |
| `HOME_TITLE/DESC/CONTENT` | Page content, not config | `GET /api/v1/site/content?page=home` |
| `ABOUT_TITLE/DESC/CONTENT` | Page content, not config | `GET /api/v1/site/content?page=about` |
| `HERO_IMAGE`, `LOGO_IMAGE` | Asset management | `GET /api/v1/site/profile` |
| `HERO_LINK_PROVIDER`, `HIRE_ME_PROVIDER` | UI behavior config | `GET /api/v1/site/profile` |

## What Stays Mock-Only

| Variable | Reason |
|----------|--------|
| `NEXT_PUBLIC_TRANSITION_PAUSE_MS` | Dev/debug only |
| `PROFILE_EMAIL` (deprecated) | CI workaround only |
| `DRIBBBLE_USERNAME` | Low priority social |

## Classification Matrix

| Variable | Category | Production | Mock-only | Move to Backend |
|----------|----------|-----------|-----------|----------------|
| `USE_MOCKS` | Runtime | YES (`false`) | YES (`true`) | No |
| `API_HOST` | Runtime | YES | No | No |
| `BACKEND_PORT` | Runtime | YES | No | No |
| `OAUTH_ENABLED` | Runtime | YES | No | No |
| `TRANSITION_PAUSE_MS` | Runtime | No | YES | No |
| `AUTHOR_NAME` | Identity | YES | YES | No |
| `CONTACT_EMAIL` | Identity | YES | YES | No |
| `LINKEDIN_USERNAME` | Social | YES | YES | No |
| `GITHUB_USERNAME` | Social | YES | YES | No |
| `TWITTER_USERNAME` | Social | YES | YES | No |
| `WHATSAPP_PHONE` | Social | YES | YES | No |
| `CALENDLY_USERNAME` | Social | YES | YES | No |
| `TELEGRAM_USERNAME` | Social | YES | YES | No |
| `DRIBBBLE_USERNAME` | Social | No | YES | No |
| `RESUME_URL` | Asset | YES | YES | No |
| `NAV_ITEMS` | Structural | No | YES | YES |
| `CUSTOMERS` | Structural | No | YES | YES |
| `TECHNOLOGIES` | Structural | No | YES | YES |
| `HOME_TITLE/DESC/CONTENT` | Content | No | YES | YES |
| `ABOUT_TITLE/DESC/CONTENT` | Content | No | YES | YES |
| `HERO_IMAGE` | Asset | No | YES | YES |
| `LOGO_IMAGE` | Asset | No | YES | YES |
| `HERO_LINK_PROVIDER` | UI Behavior | No | YES | YES |
| `HIRE_ME_PROVIDER` | UI Behavior | No | YES | YES |
| `PROFILE_EMAIL` | Deprecated | No | CI only | DELETE |
| `CALENDLY_URL` | Deprecated | No | No | DELETE |
| `TELEGRAM_URL` | Deprecated | No | No | DELETE |
| `WHATSAPP_URL` | Deprecated | No | No | DELETE |

## Transition Plan

| Phase | Action |
|-------|--------|
| **Now** | Clean up deprecated vars, add `SITE_URL` to `.env.template` |
| **Pre-backend** | Create `.env.production` template with required vars |
| **Post-backend** | Remove content/structural NEXT_PUBLIC_ vars as backend provides them |
| **Final** | Env should have ~15 vars max (runtime + identity + social) |
