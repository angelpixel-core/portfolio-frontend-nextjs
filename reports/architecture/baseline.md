# Architecture Baseline Report

- Generated at: 2026-05-17T13:38:35.532Z
- Branch: chore/phase3-architecture-baseline
- Commit SHA: ba3550932e3ba25ccc3141889f6d4d1b129b8b68
- Command: npm run architecture:report

## Totals

- Violations: 70
- Files affected: 42
- Rules violated: 4

## By Rule

| Rule | Count | Severity |
| --- | ---: | --- |
| api-to-services | 44 | medium |
| test-to-infrastructure | 13 | low |
| presentation-to-infrastructure | 9 | high |
| ui-to-services | 4 | high |

## By Bucket

| Bucket | Count | Severity |
| --- | ---: | --- |
| A1 | 44 | medium |
| A3 | 13 | low |
| A4 | 9 | high |
| A2 | 4 | high |

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
| src/ui/organisms/ResumeRequest/ResumeRequestModal.tsx | 2 |
| src/app/__tests__/home.smoke.test.tsx | 1 |
| src/app/admin/resume-request/page.tsx | 1 |

