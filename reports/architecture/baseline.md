# Architecture Baseline Report

- Generated at: 2026-05-24T22:57:11.045Z
- Branch: chore/phase3-architecture-baseline
- Commit SHA: b30396dcbf0c90d180cfaca2b4e2a0f0655b85bc
- Command: npm run architecture:report

## Totals

- Violations: 15
- Files affected: 13
- Rules violated: 3

## By Rule

| Rule | Count | Severity |
| --- | ---: | --- |
| test-to-infrastructure | 11 | low |
| api-to-services | 2 | medium |
| presentation-to-infrastructure | 2 | high |

## By Bucket

| Bucket | Count | Severity |
| --- | ---: | --- |
| A3 | 11 | low |
| A1 | 2 | medium |
| A4 | 2 | high |

## Top Files

| File | Count |
| --- | ---: |
| src/app/api/resume-request/route.ts | 2 |
| src/services/auth/__tests__/oauth.test.ts | 2 |
| src/app/__tests__/home.smoke.test.tsx | 1 |
| src/app/api/resume-request/__tests__/route.test.ts | 1 |
| src/app/api/resume-request/public/[token]/route.ts | 1 |
| src/hooks/auth/__tests__/useAuth.test.tsx | 1 |
| src/services/analytics/__tests__/plausible.test.ts | 1 |
| src/services/auth/__tests__/getInitials.test.ts | 1 |
| src/services/auth/__tests__/mock.test.ts | 1 |
| src/services/auth/__tests__/session.test.ts | 1 |
| src/services/resumeRequest/__tests__/publicLink.test.ts | 1 |
| src/state/providers/AuthProvider/__tests__/AuthProvider.test.tsx | 1 |
| src/state/slices/authPanel/__tests__/slice.test.ts | 1 |

