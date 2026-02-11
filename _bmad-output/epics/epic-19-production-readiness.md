# Epic 19 — Production Readiness & Hardening

> Target: Safe Vercel deploy with mock mode
> Backend: NOT integrated
> OAuth: Disabled (NEXT_PUBLIC_OAUTH_ENABLED=false)
> Scope: Frontend safety & stability ONLY

---

## Epic Definition

**Objective:** Bring the frontend to production-safe deployment on Vercel with mock data, closing all critical and medium-priority gaps identified in the production gap matrix.

**Out of Scope:**
- OAuth implementation (disabled, deferred to backend readiness)
- Analytics/error reporting integration (Sentry — backlog)
- Backend API integration
- New features

**Success Criteria:**
- `npm run predeploy` passes (lint + typecheck + test + build)
- No white screen on unhandled errors
- SEO metadata uses production domain
- Security headers present
- Auth button visually disabled

---

## Story Breakdown

### Story 19.1 — Global Error Boundary

**Objective:** Prevent white screen on unhandled runtime errors by implementing Next.js App Router error boundaries.

**Risk Level:** HIGH (currently any unhandled error = white screen)

**Affected Files:**
| File | Action |
|------|--------|
| `src/app/error.tsx` | CREATE — Client error boundary with "Try again" + "Go home" |
| `src/app/global-error.tsx` | CREATE — Root layout error boundary (inline CSS, no layout) |
| `src/app/not-found.tsx` | CREATE — Custom 404 page |
| `src/app/__tests__/error.test.tsx` | CREATE — Unit tests for error boundary |

**Definition of Done:**
- [ ] `error.tsx` renders error UI with "Try again" (calls `reset()`) and "Go home" (links to `/`)
- [ ] `global-error.tsx` renders minimal error UI with inline styles (no layout available)
- [ ] `not-found.tsx` renders a styled 404 page
- [ ] Tests verify rendering, reset callback, and navigation link
- [ ] Manual verification: throwing error in a page shows error UI, not white screen

**Complexity:** Low

---

### Story 19.2 — Dockerfile Production Rewrite

**Objective:** Replace single-stage Dockerfile with secure multi-stage build for container deployments.

**Risk Level:** Medium (not blocking Vercel deploy, but required for Docker deployments)

**Affected Files:**
| File | Action |
|------|--------|
| `Dockerfile.prod` | REWRITE — Multi-stage (deps → builder → runner) |
| `.dockerignore` | CREATE — Exclude node_modules, .next, .git, e2e, coverage |
| `next.config.js` | CONDITIONAL — Add `output: "standalone"` only for Docker builds |

**Definition of Done:**
- [ ] Multi-stage build: deps (Alpine) → builder → runner (Alpine)
- [ ] Runner stage uses non-root user (UID 1001)
- [ ] HEALTHCHECK directive present
- [ ] `.dockerignore` excludes development files
- [ ] Image builds: `docker build -f Dockerfile.prod .`
- [ ] Image size < 200MB

**Complexity:** Medium

---

### Story 19.3 — Content Security Policy Headers

**Objective:** Add CSP headers to restrict resource loading origins.

**Risk Level:** Medium (XSS attack surface wider without CSP)

**Affected Files:**
| File | Action |
|------|--------|
| `vercel.json` | MODIFY — Add Content-Security-Policy header |

**Definition of Done:**
- [ ] CSP header restricts: `default-src 'self'`
- [ ] Allows: Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), images from `self`
- [ ] Allows: `style-src 'self' 'unsafe-inline'` (required by Next.js + Tailwind)
- [ ] Allows: `script-src 'self' 'unsafe-inline' 'unsafe-eval'` (required by Next.js)
- [ ] No console errors on any page after CSP is applied
- [ ] Manual verification on all routes

**Complexity:** Medium (requires testing each page for violations)

---

### Story 19.4 — Open Graph & Social Meta

**Objective:** Add social sharing preview image and Twitter card metadata.

**Risk Level:** Low (SEO/social improvement, not safety)

**Affected Files:**
| File | Action |
|------|--------|
| `src/app/layout.jsx` | MODIFY — Add openGraph and twitter to metadata export |
| `public/images/og-image.png` | CREATE — 1200x630 social preview image |

**Definition of Done:**
- [ ] `og:image` meta tag present on all pages
- [ ] `twitter:card` set to `summary_large_image`
- [ ] `og:title`, `og:description`, `og:url` populated
- [ ] Verified with Open Graph debugger (or `<meta>` inspection)
- [ ] OG image file < 300KB

**Complexity:** Low

---

### Story 19.5 — Production Metadata Hardening

**Objective:** Ensure metadata, canonical URLs, and SEO fields use production domain.

**Risk Level:** Medium (incorrect SEO metadata in production)

**Affected Files:**
| File | Action |
|------|--------|
| `src/app/layout.jsx` | AUDIT — Verify metadataBase uses SITE_URL |
| `src/app/articles/[slug]/page.tsx` | AUDIT — Verify JSON-LD uses SITE_URL |
| `next-sitemap.config.js` | AUDIT — Verify siteUrl uses SITE_URL |

**Definition of Done:**
- [ ] All three files confirmed using `process.env.SITE_URL` with fallback
- [ ] `SITE_URL` documented as required in Vercel env vars
- [ ] Build with `SITE_URL=https://production.com` produces correct sitemap URLs
- [ ] robots.txt references production domain

**Complexity:** Low

---

### Story 19.6 — Unused Production Dependencies Audit

**Objective:** Identify and flag production dependencies not used in runtime code.

**Risk Level:** Low

**Affected Files:**
| File | Action |
|------|--------|
| `package.json` | AUDIT + potentially MODIFY |

**Findings (from audit):**
| Dependency | Used in src/? | Verdict |
|------------|:------------:|---------|
| `@aws-sdk/client-s3` | NO | REMOVE |
| `@aws-sdk/s3-request-presigner` | NO | REMOVE |
| `@vercel/postgres` | NO | REMOVE |
| `dotenv` | scripts only | MOVE to devDependencies |
| `uuid` | CHECK | Verify usage |

**Definition of Done:**
- [ ] Unused production dependencies removed or moved to devDeps
- [ ] `npm run build` still succeeds
- [ ] Bundle size reduced (verify with build output)

**Complexity:** Low

---

## Recommended Execution Order

| Order | Story | Rationale |
|:-----:|-------|-----------|
| 1 | **19.1** Global Error Boundary | **BLOCKER** — prevents white screen. Must be first. |
| 2 | **19.6** Dependency Audit | Quick win, reduces attack surface and bundle |
| 3 | **19.5** Metadata Hardening | Verifies SEO correctness before deploy |
| 4 | **19.4** Open Graph Meta | Social sharing, pairs with 19.5 |
| 5 | **19.3** CSP Headers | Security hardening |
| 6 | **19.2** Dockerfile | Not blocking Vercel, lower priority |

**Critical path for today's deploy:** Stories 19.1 + 19.5 + 19.6

---

## Dependency Graph

```
19.1 (Error Boundary) ──┐
19.6 (Dep Audit)  ──────┤──> Deploy Gate
19.5 (Metadata)   ──────┘
19.4 (OG Image)   ──────── Nice to have
19.3 (CSP)        ──────── Nice to have
19.2 (Docker)     ──────── Future (not needed for Vercel)
```
