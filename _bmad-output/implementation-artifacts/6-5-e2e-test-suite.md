# Story 6.5: E2E Test Suite

Status: in-progress

---

## Story

As an **owner**,
I want **end-to-end tests for critical paths**,
So that **I can deploy with confidence**.

---

## Acceptance Criteria

### AC1: E2E Tests Execute in CI
**Given** CI runs on a PR
**When** E2E tests execute
**Then** Playwright tests critical user journeys:
- Homepage loads and profile displays
- Navigation works across all pages
- Theme toggle functions
- Contact methods are accessible

### AC2: CI Blocks on E2E Failure
**Given** any E2E test fails
**When** CI reports results
**Then** the PR is blocked from merging
**And** failure details are visible in GitHub

---

## Tasks / Subtasks

- [x] **Task 1: Setup Playwright Infrastructure** (AC: #1)
  - [x] 1.1 Install Playwright and dependencies (`npm install -D @playwright/test`)
  - [x] 1.2 Create `playwright.config.ts` with Next.js dev server integration
  - [x] 1.3 Add `e2e/` directory structure following architecture patterns
  - [x] 1.4 Add `.gitignore` entries for Playwright artifacts (test-results/, playwright-report/)
  - [x] 1.5 Add `npm run test:e2e` script to package.json

- [x] **Task 2: Homepage E2E Test** (AC: #1)
  - [x] 2.1 Create `e2e/home.spec.ts`
  - [x] 2.2 Test: Homepage loads successfully (HTTP 200)
  - [x] 2.3 Test: Profile section displays name and bio
  - [x] 2.4 Test: Technology stack section is visible
  - [x] 2.5 Test: No console errors on page load

- [x] **Task 3: Navigation E2E Test** (AC: #1)
  - [x] 3.1 Create `e2e/navigation.spec.ts`
  - [x] 3.2 Test: Main navigation links are clickable
  - [x] 3.3 Test: Navigate to Projects page
  - [x] 3.4 Test: Navigate to Articles page
  - [x] 3.5 Test: Navigate back to Homepage
  - [x] 3.6 Test: All navigation is keyboard accessible

- [ ] **Task 4: Theme Toggle E2E Test** (AC: #1)
  - [ ] 4.1 Create `e2e/theme.spec.ts`
  - [ ] 4.2 Test: Theme toggle button is visible
  - [ ] 4.3 Test: Click toggle switches theme (light ↔ dark)
  - [ ] 4.4 Test: Theme persists after page reload
  - [ ] 4.5 Test: Theme respects system preference on first visit

- [ ] **Task 5: Contact Methods E2E Test** (AC: #1)
  - [ ] 5.1 Create `e2e/contact.spec.ts`
  - [ ] 5.2 Test: Email link is visible and has mailto: href
  - [ ] 5.3 Test: WhatsApp link is visible and has wa.me href
  - [ ] 5.4 Test: Calendly button is visible
  - [ ] 5.5 Test: Contact methods are keyboard accessible

- [ ] **Task 6: Integrate E2E in CI** (AC: #2)
  - [ ] 6.1 Add `e2e` job to `.github/workflows/ci.yml`
  - [ ] 6.2 E2E job should depend on `quality` job (needs: quality)
  - [ ] 6.3 Install Playwright browsers in CI
  - [ ] 6.4 Run E2E tests against Next.js dev server
  - [ ] 6.5 Upload test results as artifacts on failure
  - [ ] 6.6 Ensure E2E failure blocks PR merge

- [ ] **Task 7: Documentation** (AC: #1, #2)
  - [ ] 7.1 Add E2E testing section to `docs/development-workflow.md`
  - [ ] 7.2 Document how to run E2E tests locally
  - [ ] 7.3 Document how to debug failing E2E tests
  - [ ] 7.4 Update architecture compliance notes

- [ ] **Task 8: Validation** (AC: #1, #2)
  - [ ] 8.1 Run `npm run lint` - should pass
  - [ ] 8.2 Run `npm run typecheck` - should pass
  - [ ] 8.3 Run `npm test` - should pass (existing 510 tests)
  - [ ] 8.4 Run `npm run test:e2e` - new E2E tests pass
  - [ ] 8.5 Verify CI runs E2E tests on push

---

## Dev Notes

### Previous Story Learnings (Story 6.4)

**APPLY THESE PATTERNS FROM 6.4:**
- CI workflow is in `.github/workflows/ci.yml`
- Current CI has single `quality` job with lint, typecheck, test
- Vercel auto-deploys on main merge (don't duplicate)
- Documentation updates go to `docs/development-workflow.md`

**Story 6.4 Key Outcomes:**
- Added `npm run predeploy` script
- Added Production Deployment docs (Section 9)
- Added Branch Protection docs (Section 10)
- Total tests: 510

**Code Review Learnings:**
- Docs should reflect actual CI state (not aspirational)
- E2E job was documented but didn't exist - this story creates it

### Architecture Requirements

**From architecture.md - Testing Architecture:**
```
| Layer | Technology | Scope |
|-------|------------|-------|
| E2E   | Playwright | Critical user journeys |
| A11y  | @axe-core/playwright | Automated checks |
```

**E2E Test File Convention:**
```
e2e/
  home.spec.ts
  navigation.spec.ts
  theme.spec.ts
  contact.spec.ts
```

**CI/CD Pipeline (Target State):**
```yaml
jobs:
  quality:
    - lint
    - typecheck
    - test:unit
  e2e:
    needs: quality
    - test:e2e
```

### Technical Specifications

**Playwright Configuration:**
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:9000', // matches npm run dev --port 9000
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:9000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Critical User Journeys to Test:**
1. **Homepage loads** - Visitor lands, sees profile
2. **Navigation** - Visitor explores site sections
3. **Theme toggle** - Visitor switches theme
4. **Contact access** - Visitor finds contact methods

**Package.json Scripts:**
```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

### NFR Compliance (from PRD)

**NFR24-26:** Reliability
- E2E tests ensure critical paths work before deploy
- CI blocks bad code from reaching production

**Architecture - CI/CD Pipeline:**
- E2E Tests: `PR + main | Yes (blocking)`

### Related Files

```
e2e/                           # New directory for E2E tests
playwright.config.ts           # New Playwright config
.github/workflows/ci.yml       # Add e2e job
package.json                   # Add test:e2e script
docs/development-workflow.md   # Add E2E testing docs
.gitignore                     # Add Playwright artifacts
```

### Key Considerations

**Playwright vs Cypress:**
- Architecture specifies Playwright (decision made)
- Playwright has better Next.js integration
- Lighter weight than Cypress

**CI Performance:**
- E2E tests are slower than unit tests
- Run after quality job to fail fast
- Use single worker in CI for stability

**Test Stability:**
- Use `data-testid` attributes for selectors
- Avoid timing-based assertions
- Handle loading states properly

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # Should pass
npm run typecheck     # Should pass
npm test              # Should pass (510 tests)
npm run test:e2e      # New E2E tests should pass
```

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] E2E tests run locally with `npm run test:e2e`
- [ ] All 4 critical journeys pass (home, navigation, theme, contact)
- [ ] CI runs E2E tests on push to this branch
- [ ] E2E failures block PR merge
- [ ] Test results are visible in GitHub Actions
- [ ] Documentation explains how to run/debug E2E tests

---

## References

- [Source: epics.md#Story 6.5] - Original acceptance criteria
- [Source: architecture.md#Testing Architecture] - Playwright specification
- [Source: architecture.md#CI/CD Pipeline] - E2E in CI requirements
- [Source: 6-4-one-command-deploy.md] - Previous story patterns
- [Source: .github/workflows/ci.yml] - Current CI configuration

---

## Dev Agent Record

### Agent Model Used

(To be filled during implementation)

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

(To be filled during implementation)

### Change Log

(To be filled during implementation)
