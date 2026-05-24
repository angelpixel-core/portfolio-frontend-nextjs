# Architecture Baseline Report

- Generated at: 2026-05-24T22:46:08.179Z
- Branch: chore/phase3-architecture-baseline
- Commit SHA: 1a09503cd13f84243ce0373759f1e5a32e3ee50d
- Command: npm run architecture:report

## Totals

- Violations: 22
- Files affected: 20
- Rules violated: 3

## By Rule

| Rule | Count | Severity |
| --- | ---: | --- |
| test-to-infrastructure | 13 | low |
| api-to-services | 7 | medium |
| presentation-to-infrastructure | 2 | high |

## By Bucket

| Bucket | Count | Severity |
| --- | ---: | --- |
| A3 | 13 | low |
| A1 | 7 | medium |
| A4 | 2 | high |

## Top Files

| File | Count |
| --- | ---: |
| src/app/api/resume-request/route.ts | 2 |
| src/services/auth/__tests__/oauth.test.ts | 2 |
| src/app/__tests__/home.smoke.test.tsx | 1 |
| src/app/api/admin/content/articles/upload-image/__tests__/route.test.ts | 1 |
| src/app/api/admin/content/articles/upload-image/route.ts | 1 |
| src/app/api/admin/content/projects/upload-image/__tests__/route.test.ts | 1 |
| src/app/api/admin/content/projects/upload-image/route.ts | 1 |
| src/app/api/admin/orders/[id]/actions/route.ts | 1 |
| src/app/api/resume-request/__tests__/route.test.ts | 1 |
| src/app/api/resume-request/public/[token]/route.ts | 1 |
| src/hooks/auth/__tests__/useAuth.test.tsx | 1 |
| src/providers/PerformanceInsightsProvider/__tests__/PerformanceInsightsProvider.test.tsx | 1 |
| src/providers/RootProvider/__tests__/RootProvider.test.tsx | 1 |
| src/services/analytics/__tests__/plausible.test.ts | 1 |
| src/services/auth/__tests__/getInitials.test.ts | 1 |
| src/services/auth/__tests__/mock.test.ts | 1 |
| src/services/auth/__tests__/session.test.ts | 1 |
| src/services/resumeRequest/__tests__/publicLink.test.ts | 1 |
| src/state/providers/AuthProvider/__tests__/AuthProvider.test.tsx | 1 |
| src/state/slices/authPanel/__tests__/slice.test.ts | 1 |

