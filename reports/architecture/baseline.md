# Architecture Baseline Report

- Generated at: 2026-05-24T21:49:40.342Z
- Branch: chore/phase3-architecture-baseline
- Commit SHA: 51c4e2c613777e53718cf9c9fae0991328f4c56e
- Command: npm run architecture:report

## Totals

- Violations: 31
- Files affected: 26
- Rules violated: 3

## By Rule

| Rule | Count | Severity |
| --- | ---: | --- |
| api-to-services | 14 | medium |
| test-to-infrastructure | 13 | low |
| presentation-to-infrastructure | 4 | high |

## By Bucket

| Bucket | Count | Severity |
| --- | ---: | --- |
| A1 | 14 | medium |
| A3 | 13 | low |
| A4 | 4 | high |

## Top Files

| File | Count |
| --- | ---: |
| src/app/api/checkout/create-session/route.ts | 2 |
| src/app/api/resume-request/route.ts | 2 |
| src/app/api/webhooks/stripe/__tests__/route.test.ts | 2 |
| src/app/api/webhooks/stripe/route.ts | 2 |
| src/services/auth/__tests__/oauth.test.ts | 2 |
| src/app/__tests__/home.smoke.test.tsx | 1 |
| src/app/api/admin/content/articles/upload-image/__tests__/route.test.ts | 1 |
| src/app/api/admin/content/articles/upload-image/route.ts | 1 |
| src/app/api/admin/content/projects/upload-image/__tests__/route.test.ts | 1 |
| src/app/api/admin/content/projects/upload-image/route.ts | 1 |
| src/app/api/admin/orders/[id]/actions/route.ts | 1 |
| src/app/api/admin/settings/general/route.ts | 1 |
| src/app/api/checkout/create-session/__tests__/route.test.ts | 1 |
| src/app/api/resume-request/__tests__/route.test.ts | 1 |
| src/app/api/resume-request/public/[token]/route.ts | 1 |
| src/app/layout.tsx | 1 |
| src/hooks/auth/__tests__/useAuth.test.tsx | 1 |
| src/providers/PerformanceInsightsProvider/__tests__/PerformanceInsightsProvider.test.tsx | 1 |
| src/providers/RootProvider/__tests__/RootProvider.test.tsx | 1 |
| src/services/analytics/__tests__/plausible.test.ts | 1 |

