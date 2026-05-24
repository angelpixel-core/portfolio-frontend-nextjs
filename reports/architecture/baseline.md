# Architecture Baseline Report

- Generated at: 2026-05-24T22:16:06.012Z
- Branch: chore/phase3-architecture-baseline
- Commit SHA: 31e29db7ad5b079f233cd68e7509cc2c5269c53f
- Command: npm run architecture:report

## Totals

- Violations: 28
- Files affected: 24
- Rules violated: 3

## By Rule

| Rule | Count | Severity |
| --- | ---: | --- |
| test-to-infrastructure | 13 | low |
| api-to-services | 11 | medium |
| presentation-to-infrastructure | 4 | high |

## By Bucket

| Bucket | Count | Severity |
| --- | ---: | --- |
| A3 | 13 | low |
| A1 | 11 | medium |
| A4 | 4 | high |

## Top Files

| File | Count |
| --- | ---: |
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
| src/app/api/resume-request/__tests__/route.test.ts | 1 |
| src/app/api/resume-request/public/[token]/route.ts | 1 |
| src/app/layout.tsx | 1 |
| src/hooks/auth/__tests__/useAuth.test.tsx | 1 |
| src/providers/PerformanceInsightsProvider/__tests__/PerformanceInsightsProvider.test.tsx | 1 |
| src/providers/RootProvider/__tests__/RootProvider.test.tsx | 1 |
| src/services/analytics/__tests__/plausible.test.ts | 1 |
| src/services/auth/__tests__/getInitials.test.ts | 1 |
| src/services/auth/__tests__/mock.test.ts | 1 |

