# Architecture Baseline Report

- Generated at: 2026-05-17T14:09:35.738Z
- Branch: chore/phase3-architecture-baseline
- Commit SHA: ee943e5309026798b501648b0bcc51539ca5287c
- Command: npm run architecture:report

## Totals

- Violations: 65
- Files affected: 38
- Rules violated: 3

## By Rule

| Rule | Count | Severity |
| --- | ---: | --- |
| api-to-services | 44 | medium |
| test-to-infrastructure | 13 | low |
| presentation-to-infrastructure | 8 | high |

## By Bucket

| Bucket | Count | Severity |
| --- | ---: | --- |
| A1 | 44 | medium |
| A3 | 13 | low |
| A4 | 8 | high |

## Top Files

| File | Count |
| --- | ---: |
| src/app/api/subscriptions/route.ts | 5 |
| src/app/api/admin/content/articles/upload-image/route.ts | 3 |
| src/app/api/admin/content/projects/upload-image/route.ts | 3 |
| src/app/api/messages/route.ts | 3 |
| src/app/api/resume-request/public/[token]/route.ts | 3 |
| src/app/api/resume-request/route.ts | 3 |
| src/app/api/subscriptions/__tests__/route.test.ts | 3 |
| src/app/api/subscriptions/unsubscribe/route.ts | 3 |
| src/app/api/admin/resume-request/links/route.ts | 2 |
| src/app/api/admin/subscriptions/[id]/actions/__tests__/route.test.ts | 2 |
| src/app/api/admin/subscriptions/[id]/actions/route.ts | 2 |
| src/app/api/checkout/create-session/route.ts | 2 |
| src/app/api/messages/__tests__/route.test.ts | 2 |
| src/app/api/subscriptions/confirm/route.ts | 2 |
| src/app/api/webhooks/stripe/__tests__/route.test.ts | 2 |
| src/app/api/webhooks/stripe/route.ts | 2 |
| src/services/auth/__tests__/oauth.test.ts | 2 |
| src/app/__tests__/home.smoke.test.tsx | 1 |
| src/app/api/admin/content/articles/upload-image/__tests__/route.test.ts | 1 |
| src/app/api/admin/content/projects/upload-image/__tests__/route.test.ts | 1 |

