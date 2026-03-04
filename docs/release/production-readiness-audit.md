# Production Readiness Audit (Deep)

Date: 2026-03-04
Scope: portfolio-frontend-nextjs (Next.js 15.5.12)
Requested by: Product/Engineering

## Executive Summary

Current readiness for dual production target (Vercel + Azure): **CONDITIONAL GO**.

- **P0 blockers** exist and should be resolved before a formal production cutover.
- There is strong baseline in CI, type safety, and containerization, but there are high-impact gaps in security posture and test reliability.
- Infrastructure-as-Code artifacts are not present yet; this blocks repeatable Azure provisioning.

## Method and Evidence

Review sources:

- `package.json`
- `next.config.js`
- `vercel.json`
- `.env.template`
- `.github/workflows/ci.yml`
- `Dockerfile.prod`
- `src/lib/httpRequest/index.ts`
- `src/lib/httpRequest/config.ts`
- `docs/release/pre-release-checklist.md`
- `e2e/*.spec.ts`
- `src/ui/organisms/ArticleContent/index.tsx`
- `src/services/auth/oauth.ts`
- `src/ui/atoms/buttons/SkillSelectorButton/index.tsx`
- `src/ui/molecules/model/schema.ts`

Commands executed:

- `npm audit --omit=dev --audit-level=high`
- `npm ls @testing-library/react-hooks --depth=0`
- grep scans for `test.skip`, `TODO`, `FIXME`, env usage, and deprecated patterns

## Prioritized Findings

### P0 (Must fix before production cutover)

1. Next.js high-severity advisory in current dependency range
   - Evidence: `npm audit --omit=dev --audit-level=high`.
   - Impact: potential DoS exposure in self-hosted runtime path.
   - Location: `package.json` (`next` actualizado a `^15.5.12`).
   - Estado: remediado en baseline actual; mantener gate de seguridad en CI para prevenir regresion.

2. Critical E2E skip debt reduces trust in release signal
   - Evidence: 40 `test.skip(` occurrences across 8 files.
   - Heavy concentration:
     - `e2e/about-experiences-education-ux.spec.ts` (21)
     - `e2e/auth.spec.ts` (9)
     - `e2e/menu-autoclose.spec.ts` (5)
   - Impact: green pipeline can hide regressions in key UX flows.
   - Action: convert skips to deterministic fixtures or environment contracts; define allowed skip budget.

3. Deployment strategy mismatch documented as static/mock-only
   - Evidence: `docs/release/pre-release-checklist.md` says static frontend + mock mode + no backend assumptions.
   - Impact: operational playbook is misaligned with dual target (Vercel SSR + Azure container/runtime).
   - Action: replace with production-grade checklist by platform.

### P1 (High priority, next sprint)

1. Container build defaults to mock mode
   - Evidence: `Dockerfile.prod` sets `ENV NEXT_PUBLIC_USE_MOCKS=true` during build.
   - Impact: easy to publish a build that is unintentionally tied to mock-mode behavior.
   - Action: move mode selection to explicit pipeline variable matrix and release gates.

2. Custom HTML escaping + `dangerouslySetInnerHTML`
   - Evidence: `src/ui/organisms/ArticleContent/index.tsx` (`escapeHtml`, inline replacement, innerHTML path).
   - Impact: security and maintenance risk if content source expands or formatting rules evolve.
   - Action: replace with vetted rendering/sanitization approach and security tests.

3. Auth/OAuth implementation still mock-first in production code path
   - Evidence: `src/services/auth/oauth.ts` TODO for real service, both branches instantiate mock service.
   - Impact: feature-flag ambiguity and production expectation drift.
   - Action: explicit runtime contract (`auth_disabled`, `auth_mock`, `auth_real`) and enforcement in CI.

### P2 (Important debt, can follow after cutover hardening)

1. UI tech debt: direct DOM manipulation bypassing React state model
   - Evidence: `src/ui/atoms/buttons/SkillSelectorButton/index.tsx`.
   - Impact: brittle behavior and difficult testing.

2. Domain/schema placement debt
   - Evidence: `src/ui/molecules/model/schema.ts` marked TODO to move to domain layer.
   - Impact: architecture boundaries become weaker over time.

3. Tooling drift
   - Evidence: `@testing-library/react-hooks@8.0.1` fue removido; persisten vulnerabilidades low dev-only transitivas en cadena de Storybook (`@storybook/nextjs` → `node-polyfill-webpack-plugin` → `elliptic`).
   - Impact: deuda de tooling en entorno de desarrollo; sin impacto directo en runtime productivo actual.

## Risk Matrix

| Risk ID | Area                   | Severity | Probability | Impact      | Evidence                                           |
| ------- | ---------------------- | -------- | ----------- | ----------- | -------------------------------------------------- |
| R1      | Dependency security    | High     | Medium      | High        | `npm audit` result for `next`                      |
| R2      | Release confidence     | High     | High        | High        | 40 E2E skips                                       |
| R3      | Deployment correctness | High     | Medium      | High        | static/mock checklist + `Dockerfile.prod` defaults |
| R4      | Content safety         | Medium   | Medium      | Medium/High | custom sanitizer path                              |
| R5      | Architecture hygiene   | Medium   | High        | Medium      | DOM manipulation and UI/domain bleed               |

### Current Security Snapshot (2026-03-04)

- `npm audit --omit=dev --audit-level=high`: `found 0 vulnerabilities`.
- `npm audit`: 6 vulnerabilities low, todas dev-only transitivas de Storybook.
- Decisión operativa: mantener cutover condicionado por P0/P1 funcionales y cerrar deuda dev-only en sprint de tooling.

## Recommended Remediation Order

1. Resolve R1 and R2 first (security + testing signal).
2. Align release/deployment docs and pipeline contracts (R3).
3. Harden content rendering path and auth mode contracts (R4 + auth).
4. Address architectural debt batch (R5) once deployment path is stable.

## Go / No-Go Criteria

GO only if all are true:

- No high/critical production vulnerability in lockfile for deployed target.
- E2E skip policy enforced (bounded and justified), with core user journeys fully active.
- Build/runtime mode matrix is explicit and validated per environment.
- Production checklist replaced with platform-aware runbook.

NO-GO if any P0 item remains open without approved risk waiver.

## Change Log

- 2026-03-04: Remediated R1 baseline by upgrading `next` to `15.5.12` and re-running `npm audit --omit=dev --audit-level=high` (result: `found 0 vulnerabilities`).
- 2026-03-04: Actualizado scope/evidencia post-upgrade y agregado snapshot de riesgo residual dev-only (6 low transitivas de Storybook).
