# Production Gap Execution Plan

> Generated: 2026-02-11
> Phase: Architectural Consolidation (pre-production)
> Expands: production-gap-matrix-2026-02-11.md
> Status: ACTIONABLE

---

## C1: Global Error Boundary — READY TO IMPLEMENT

**Impact:** Unhandled errors → white screen in production
**Effort:** 2h

### Files to Create

**`src/app/error.tsx`** (Client Error Boundary)
```typescript
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Send to error reporting service (Sentry)
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold text-light">Something went wrong</h2>
      <p className="text-gray-400 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-light hover:bg-gray-800 transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
```

**`src/app/global-error.tsx`** (Root Layout Error — minimal, no layout available)
```typescript
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: "#1b1b1b", color: "#f5f5f5", fontFamily: "system-ui" }}>
        <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Something went wrong</h2>
          <p style={{ color: "#9ca3af", maxWidth: "28rem" }}>A critical error occurred.</p>
          <button
            onClick={reset}
            style={{ background: "#B63E96", color: "white", padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
```

### Test File

**`src/app/__tests__/error.test.tsx`**
- Test: renders error message
- Test: "Try again" button calls `reset()`
- Test: "Go home" link points to `/`

### Acceptance Criteria
- [ ] Throwing an error in any page shows error UI instead of white screen
- [ ] "Try again" re-renders the errored segment
- [ ] "Go home" navigates to root
- [ ] `global-error.tsx` handles root layout crashes

---

## C2: ENV Validation — COMPLETED (Phase 1)

Implemented in `next.config.js` during Phase 1:
- `NEXT_PUBLIC_API_HOST` required when `USE_MOCKS=false`
- `SITE_URL` warning in production mode
- `.env.production.template` created with minimal required vars
- `.env.template` updated with `SITE_URL` documentation

---

## C3: robots.txt Configuration — OPERATIONAL

**Current state:** `next-sitemap.config.js` uses `process.env.SITE_URL || "https://localhost:3000"`.

**What's needed:** Set `SITE_URL` in production deployment environment. No code change required.

**Documented in:**
- `.env.production.template` — `SITE_URL` is first required variable
- `.env.template` — Added documentation block explaining SITE_URL usage
- `next.config.js` — Warning emitted if SITE_URL missing in production build

### Deployment Checklist
- [ ] Set `SITE_URL=https://yourdomain.com` in Vercel/hosting env vars
- [ ] Verify `robots.txt` after first production deploy shows correct domain
- [ ] Verify `sitemap.xml` URLs use production domain

---

## C4: Dockerfile.prod — READY TO IMPLEMENT

**Impact:** No multi-stage build, runs as root, no healthcheck
**Effort:** 2h

### Implementation Plan

Rewrite `Dockerfile.prod` as multi-stage:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner (production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
```

### Prerequisites
- Add `output: "standalone"` to `next.config.js` (only when building for Docker)
- Create `.dockerignore` with: `node_modules`, `.next`, `.git`, `e2e`, `coverage`

### Acceptance Criteria
- [ ] Image builds successfully with `docker build -f Dockerfile.prod .`
- [ ] Container runs as non-root user (UID 1001)
- [ ] Healthcheck passes after startup
- [ ] Image size < 200MB (Alpine + standalone output)

---

## C5: Auth Token Storage — POSTPONED

**Reason:** Backend OAuth not yet implemented. Auth button disabled via feature flag (Phase 0).

**When to revisit:** After backend team delivers OAuth endpoints per `auth-contract-draft-2026-02-11.md`.

**Migration path documented in:** `auth-contract-draft-2026-02-11.md` — 7-phase migration plan.

---

## Medium Risks — Backlog

### M1: Error Reporting (Sentry) — 2-3h
- Install `@sentry/nextjs`
- Configure in `sentry.client.config.ts` and `sentry.server.config.ts`
- Wire into `error.tsx` (C1) and `global-error.tsx`
- Free tier sufficient for portfolio traffic

### M2: Content-Security-Policy Header — 1h
- Add CSP headers in `next.config.js` `headers()` function
- Allow: `self`, Google Fonts, image CDNs, analytics (if any)
- Disallow: `unsafe-inline` scripts, `unsafe-eval`
- Test with browser DevTools console for violations

### M3: API Error Handling — 3-4h
- Add `error` and `isError` handling to all query hooks
- Add fallback UI in organisms that use React Query
- Depends on C1 (error boundary as last resort)

### M4: Open Graph Image — 1h
- Add `og:image` and `twitter:card` to `src/app/layout.tsx` metadata
- Create 1200x630 OG image for social sharing
- Test with Open Graph debugger tools

### M5: Bundle Size Tracking — 1-2h
- Add `@next/bundle-analyzer` or `size-limit` to project
- Add CI step: compare bundle size against baseline
- Set threshold for warning (e.g., +5% total)

### M6: HTML Sanitization — 2h
- Install `dompurify` + `@types/dompurify`
- Replace regex escaping in `ArticleContent` with DOMPurify
- Test with XSS payload samples

---

## Safe to Ignore — Confirmed

| Item | Reason | Action |
|------|--------|--------|
| `PROFILE_EMAIL` deprecated var | CI workaround (`test@ci.local`), no production impact | KEEP |
| `console.log` suppression undocumented | `removeConsole` in next.config.js handles production | KEEP |
| `SocialAuthDropdown` unused | Not integrated, no user-facing risk | KEEP (dead code cleanup later) |
| `productionBrowserSourceMaps: true` | Intentional for debugging, ~5% larger assets | KEEP |
| 2 Redux slices without tests | menuPanel & themeMode tested in legacy location | KEEP (migrate later) |

---

## Execution Sequence

| Step | Task | Dependencies | Effort |
|------|------|-------------|--------|
| 1 | C1: error.tsx + global-error.tsx + tests | None | 2h |
| 2 | C4: Dockerfile.prod rewrite + .dockerignore | None | 2h |
| 3 | M2: CSP headers | None | 1h |
| 4 | M4: OG image + meta | None | 1h |
| 5 | M1: Sentry integration | C1 done | 2-3h |
| 6 | M3: API error handling | C1 done | 3-4h |
| 7 | M5: Bundle tracking CI | None | 1-2h |
| 8 | M6: DOMPurify | None | 2h |

**Total estimated:** ~2 days (Steps 1-4), ~1 week (Steps 5-8)

Steps 1-2 can be parallelized. Steps 3-4 can be parallelized. Steps 5-6 depend on C1.
