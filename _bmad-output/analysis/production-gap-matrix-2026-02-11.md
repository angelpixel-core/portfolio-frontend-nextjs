# Production Gap Matrix

> Generated: 2026-02-11
> Phase: Architectural Consolidation (pre-production)
> Status: ASSESSMENT COMPLETE

## Critical Blockers (Must fix)

| # | Blocker | Impact | Effort |
|---|---------|--------|--------|
| **C1** | No `src/app/error.tsx` global error boundary | Unhandled errors -> white screen | 1-2h |
| **C2** | `NEXT_PUBLIC_API_HOST` not validated at build | Silent API misconfiguration -> runtime crash | 30min |
| **C3** | `robots.txt` hardcoded to `localhost:3000` | SEO: search engines see wrong host | 20min |
| **C4** | `Dockerfile.prod` not production-ready | No multi-stage, runs as root, no healthcheck | 2h |
| **C5** | Auth tokens in localStorage (when real auth) | XSS -> token theft | Requires backend httpOnly cookies |

### Details

**C1 — Global Error Boundary:**
Next.js App Router requires `src/app/error.tsx` to catch unhandled errors. Without it, a runtime error in any page results in a white screen. The existing `SectionErrorBoundary` only protects individual sections, not the app-level layout.

**C2 — API Host Validation:**
If `NEXT_PUBLIC_API_HOST` is missing or malformed when `USE_MOCKS=false`, the app crashes at runtime with opaque fetch errors. A build-time validation in `next.config.js` would fail fast.

**C3 — robots.txt:**
`next-sitemap.config.js` generates robots.txt. Verify it uses `SITE_URL` and not a hardcoded localhost. Must point to production domain.

**C4 — Dockerfile.prod:**
Current `Dockerfile.prod` lacks: multi-stage build (build + runtime stages), non-root user, healthcheck endpoint, `.dockerignore` for node_modules. Standard for production container security.

**C5 — Auth Token Storage:**
Current mock auth stores session in localStorage. For production with real OAuth, tokens MUST be in httpOnly cookies managed by the backend. This is addressed in the Auth Contract Draft (see `auth-contract-draft-2026-02-11.md`).

---

## Medium Risks (Should fix)

| # | Risk | Impact | Effort |
|---|------|--------|--------|
| **M1** | No error reporting (Sentry/LogRocket) | Production errors invisible | 2-3h |
| **M2** | No Content-Security-Policy header | XSS attack surface wider | 1h |
| **M3** | API error handling incomplete | `USE_MOCKS=false` + API down -> crash (no error boundary) | 3-4h |
| **M4** | Missing Open Graph image + Twitter card | Social shares have no preview | 1h |
| **M5** | No bundle size tracking in CI | Regressions undetected | 1-2h |
| **M6** | `dangerouslySetInnerHTML` uses regex escaping | Consider DOMPurify for defense-in-depth | 2h |

### Details

**M1 — Error Reporting:**
No error tracking service configured. In production, errors in client-side rendering, failed API calls, and unhandled promise rejections would go unnoticed. Sentry (free tier) provides error grouping, stack traces, and alerts.

**M2 — CSP Header:**
No `Content-Security-Policy` header in `next.config.js` or `vercel.json`. This allows inline scripts and styles from any origin. Add strict CSP in `next.config.js` headers configuration.

**M3 — API Error Handling:**
When `USE_MOCKS=false` and the API is unreachable, components relying on React Query will show loading forever or crash. Need: error states in query hooks, fallback UI in organisms, C1 error boundary as last resort.

**M4 — Social Sharing:**
No `og:image` meta tag in `src/app/layout.jsx`. Social shares (LinkedIn, Twitter) will show a generic fallback. Add Open Graph metadata with preview image.

**M5 — Bundle Tracking:**
CI pipeline (`quality` job) runs lint + typecheck + tests but doesn't track bundle size. Regressions like barrel import contamination (~50 KiB) can reappear. Add `@next/bundle-analyzer` or `size-limit` to CI.

**M6 — HTML Sanitization:**
`ArticleContent` uses `dangerouslySetInnerHTML` with regex-based escaping for code blocks. While acceptable for CMS-controlled content, DOMPurify provides stronger defense if content sources change.

---

## Safe to Ignore

| # | Item | Reason |
|---|------|--------|
| **S1** | `PROFILE_EMAIL` deprecated var | CI workaround, no production impact |
| **S2** | `console.log` suppression undocumented | Developer DX only, no user impact |
| **S3** | `SocialAuthDropdown` unused component | Not integrated in main flow, no risk |
| **S4** | `productionBrowserSourceMaps: true` | Intentional (debugging), minimal perf impact |
| **S5** | 2 Redux slices without tests | Covered indirectly by component/E2E tests |

---

## Deployment Readiness by Scenario

| Scenario | Ready? | Blockers |
|----------|--------|----------|
| **Static deploy with mocks** | Almost | C1 (error boundary), C3 (robots.txt) |
| **Real OAuth enabled** | NO | C5 (localStorage tokens), backend not ready, C1, C2 |
| **Static frontend + real API** | NO | C1, C2, M1, M3, backend endpoints needed |

---

## Effort Estimates

| Scenario | Total Effort |
|----------|-------------|
| Production with mocks | ~1 dia (C1 + C3 + C4) |
| Production with API real | ~2-3 semanas (incluye backend) |

## Recommended Sequence

1. **Day 1:** C1 (error.tsx) + C3 (robots.txt) + C2 (env validation)
2. **Day 2:** C4 (Dockerfile) + M2 (CSP header) + M4 (OG image)
3. **Week 1:** M1 (Sentry) + M3 (API error handling) + M5 (bundle tracking)
4. **Week 2-3:** Backend auth endpoints + C5 migration (when backend ready)
