# FINAL DEPLOY SAFETY REPORT

> Date: 2026-02-11
> Target: Vercel (production)
> Mode: Mock data (NEXT_PUBLIC_USE_MOCKS=true)
> OAuth: Disabled (NEXT_PUBLIC_OAUTH_ENABLED=false)

---

## PHASE B — Deploy Safety Check

### 1. Global Error Boundary

| Check | Status | Detail |
|-------|--------|--------|
| `src/app/error.tsx` exists | **FAIL** | File does not exist |
| `src/app/global-error.tsx` exists | **FAIL** | File does not exist |
| `src/app/not-found.tsx` exists | **FAIL** | File does not exist |

**VERDICT: BLOCKING.** An unhandled runtime error in any page will produce a white screen. This is the single most critical missing piece.

---

### 2. Unguarded Async Errors in App Router

| Page | Type | Async? | Error Handling | Status |
|------|------|--------|---------------|--------|
| `/page.jsx` | Static | No | N/A | OK |
| `/about/page.jsx` | Static | No | N/A | OK |
| `/coming-soon/page.jsx` | Static | No | N/A | OK |
| `/articles/page.tsx` | Client | React Query | Auto (query hooks) | OK |
| `/projects/page.tsx` | Client | React Query | Auto (query hooks) | OK |
| `/articles/[slug]/page.tsx` | Server | Yes | try/catch in model | OK |
| `/projects/[slug]/page.tsx` | Server | Yes | try/catch in model | OK |

**VERDICT: SAFE.** All async operations have error handling. With mock mode, API failure is not a concern.

---

### 3. Runtime Console Errors in Production

| Check | Status | Detail |
|-------|--------|--------|
| `removeConsole` configured | OK | `next.config.js` removes `console.log` in production, keeps `warn`/`error` |
| No stray `console.log` in critical path | OK | Build compilation clean |
| React strict mode warnings | OK | Not enabled (no `reactStrictMode: true` in config) |

**VERDICT: SAFE.**

---

### 4. NEXT_PUBLIC_USE_MOCKS

| Check | Status | Detail |
|-------|--------|--------|
| `.env` value | `true` | Mock mode active |
| `.env.template` default | `true` | Correct default |
| `.env.production.template` | `true` | Correct for mock deploy |
| Build-time validation | PASS | `USE_MOCKS=false` without API_HOST correctly fails build |

**VERDICT: SAFE.** Mock mode enforced. Build fails fast if someone sets `false` without API_HOST.

---

### 5. NEXT_PUBLIC_OAUTH_ENABLED

| Check | Status | Detail |
|-------|--------|--------|
| `.env` value | NOT SET | Absent = treated as `false` |
| `.env.template` value | `false` | Explicit |
| `.env.production.template` | `false` | Explicit |
| AuthButton behavior | DISABLED | Renders grayed out, not clickable |
| Auth modal | BLOCKED | Cannot be opened from UI |

**VERDICT: SAFE.** Auth is fully disabled.

---

### 6. SITE_URL for Production

| Check | Status | Detail |
|-------|--------|--------|
| `.env` value | NOT SET | Missing |
| `.env.template` | Documented | Added with SITE_URL explanation |
| `next.config.js` warning | ACTIVE | Warns in production build if absent |
| `layout.jsx` metadataBase | `SITE_URL \|\| localhost:3000` | Fallback present |
| `next-sitemap.config.js` | `SITE_URL \|\| localhost:3000` | Fallback present |
| `articles/[slug]/page.tsx` JSON-LD | `SITE_URL \|\| localhost:3000` | Fallback present |

**VERDICT: BLOCKING for Vercel.** SITE_URL MUST be set in Vercel environment variables. Without it, sitemap, robots.txt, OG meta, and JSON-LD all reference `localhost:3000`.

---

### 7. next-sitemap URL Generation

| Check | Status |
|-------|--------|
| Local build sitemap output | `https://localhost:3000/sitemap.xml` |
| With SITE_URL set | Will use production URL |
| robots.txt generated | Yes |
| Excluded paths | `/coming-soon`, `/coming-soon/*` |

**VERDICT: CONDITIONAL.** Works correctly IF SITE_URL is set in Vercel.

---

### 8. Server-Only Variable Exposure

| Check | Status | Detail |
|-------|--------|--------|
| `@aws-sdk` in src/ components | NOT FOUND | Safe (only in package.json) |
| `@vercel/postgres` in src/ | NOT FOUND | Safe |
| `prisma` in src/ | NOT FOUND | False positive on "PostgresIcon" |
| DB_PASSWORD in NEXT_PUBLIC_ | NO | Server-only |
| API_KEY in NEXT_PUBLIC_ | NO | Server-only |
| CLIENT_ID in NEXT_PUBLIC_ | NO | Server-only |

**VERDICT: SAFE.** No server secrets exposed to client bundle.

---

### 9. Build Verification

```
npm run build  →  SUCCESS (all pages compiled, sitemap generated)
npm run lint   →  SUCCESS (0 warnings)
npm run typecheck  →  SUCCESS (no errors)
npm test       →  SUCCESS (969 tests, 0 failures)
```

**VERDICT: SAFE.**

---

### 10. Predeploy Script Sufficiency

```json
"predeploy": "npm run lint && npm run typecheck && npm test && npm run build"
```

| Step | Coverage |
|------|----------|
| Lint | ESLint with --max-warnings 0 |
| Typecheck | tsc --noEmit |
| Tests | All 969 Jest tests |
| Build | Next.js build + next-sitemap postbuild |

**Missing from predeploy (acceptable):**
- E2E tests (require running dev server, too slow for predeploy)
- Bundle size check (no threshold configured)
- Lighthouse audit (runs separately in CI)

**VERDICT: SUFFICIENT for deploy gate.**

---

## DEPLOY VERDICT

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   SAFE TO DEPLOY:  YES (conditional)            │
│   RISK LEVEL:      MEDIUM                       │
│                                                 │
│   BLOCKING REQUIREMENTS:                        │
│   1. Set SITE_URL in Vercel env vars            │
│   2. Implement error.tsx (Story 19.1)           │
│                                                 │
│   RECOMMENDED BEFORE DEPLOY:                    │
│   3. Remove unused prod deps (Story 19.6)       │
│   4. Add not-found.tsx for 404 pages            │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Without error.tsx:** Deployable but RISKY. Any runtime error = white screen. User impact: HIGH.
**With error.tsx + SITE_URL:** Safe to deploy. Risk: LOW.

---

## Misconfigurations Found

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | No `error.tsx` — white screen on errors | **HIGH** | Create file (Story 19.1) |
| 2 | No `not-found.tsx` — default Next.js 404 | LOW | Create file (Story 19.1) |
| 3 | SITE_URL not in `.env` | **HIGH** (for Vercel) | Set in Vercel dashboard |
| 4 | `@aws-sdk`, `@vercel/postgres` unused deps | LOW | Remove from package.json |
| 5 | `husky` hooks reference `pnpm` not `npm` | LOW | Update to `npm` |
| 6 | No CSP header | MEDIUM | Add to vercel.json |

---

## Minimal Required Changes Before Deploy

1. **MUST:** Set `SITE_URL` in Vercel environment variables
2. **MUST:** Create `src/app/error.tsx` (even minimal)
3. **SHOULD:** Create `src/app/global-error.tsx`
4. **SHOULD:** Create `src/app/not-found.tsx`

---

---

## PHASE C — Vercel Deployment Checklist

### Required Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `SITE_URL` | `https://yourdomain.com` | Sitemap, robots.txt, OG meta, JSON-LD |
| `NEXT_PUBLIC_USE_MOCKS` | `true` | Enable mock data mode |
| `NEXT_PUBLIC_OAUTH_ENABLED` | `false` | Keep auth disabled |

### Recommended Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_AUTHOR_NAME` | `Angel Szymczak` | Footer attribution |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `angel.solutions@pm.me` | Contact email |
| `NEXT_PUBLIC_LINKEDIN_USERNAME` | `angelszymczak` | Social links |
| `NEXT_PUBLIC_GITHUB_USERNAME` | `angelszymczak` | Social links |
| `NEXT_PUBLIC_HERO_IMAGE` | `/images/profile/hero.png` | Hero section |
| `NEXT_PUBLIC_LOGO_IMAGE` | `/images/logo.svg` | Header logo |
| `NEXT_PUBLIC_HERO_LINK_PROVIDER` | `linkedin` | Hero click target |
| `NEXT_PUBLIC_HIRE_ME_PROVIDER` | `telegram` | CTA button target |

### Variables That MUST NOT Be Defined

| Variable | Reason |
|----------|--------|
| `NEXT_PUBLIC_API_HOST` | Must be empty when USE_MOCKS=true (prevents confusion) |
| `DB_PASSWORD` | No database in mock mode |
| `DB_USER` | No database in mock mode |
| `CLIENT_ID` | No OAuth in mock mode |
| `API_KEY` | No external API in mock mode |

### Mock-Only Mode Confirmation

- [x] `NEXT_PUBLIC_USE_MOCKS=true` in env
- [x] Build-time validation blocks `false` without API_HOST
- [x] `NEXT_PUBLIC_OAUTH_ENABLED=false` disables auth button
- [x] No server-side database or API dependencies imported
- [x] All data served from local mock files in `src/domains/*/model/mock.ts`

### SEO Validation Steps (post-deploy)

1. [ ] Visit `https://yourdomain.com/robots.txt` — verify domain is correct, not localhost
2. [ ] Visit `https://yourdomain.com/sitemap.xml` — verify URLs use production domain
3. [ ] Inspect `<head>` on homepage — verify `og:url`, `og:title`, `og:description`
4. [ ] Inspect article pages — verify JSON-LD `@context` and `url` fields
5. [ ] Run Google Rich Results Test on an article URL
6. [ ] Submit sitemap to Google Search Console

### Lighthouse Validation Step

```bash
# After deploy, run against production URL:
npx @lhci/cli collect --url=https://yourdomain.com
npx @lhci/cli collect --url=https://yourdomain.com/about
npx @lhci/cli collect --url=https://yourdomain.com/projects
npx @lhci/cli collect --url=https://yourdomain.com/articles
```

**Targets:**
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Smoke Test Checklist (Manual)

| # | Test | Expected |
|---|------|----------|
| 1 | Homepage loads | Hero image, title, sliders visible |
| 2 | Navigate to /about | Page renders, experiences/education sections load |
| 3 | Navigate to /projects | Project cards render with images |
| 4 | Click a project card | Detail page loads with tech stack |
| 5 | Navigate to /articles | Article list renders |
| 6 | Click an article | Article content renders with code blocks |
| 7 | Toggle theme (sun/moon) | Theme switches, persists on reload |
| 8 | Mobile menu opens/closes | Hamburger works, links navigate correctly |
| 9 | Auth button appearance | Grayed out, disabled, not clickable |
| 10 | Page transitions | Curtain animation between routes |
| 11 | 404 page | Visit `/nonexistent` — custom 404 (after Story 19.1) |
| 12 | Footer links | Social links open correct profiles |
| 13 | Resume link | Opens resume document |
| 14 | robots.txt | Correct domain, allows `/`, disallows `/coming-soon` |
| 15 | Responsive | Check 3 breakpoints: mobile (375px), tablet (768px), desktop (1280px) |

### Vercel Configuration Summary

```json
// vercel.json — already configured
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm ci --legacy-peer-deps",
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-XSS-Protection", "value": "1; mode=block" }
    ]}
  ]
}
```

**No changes needed to vercel.json for deploy** (CSP can be added post-deploy as Story 19.3).
