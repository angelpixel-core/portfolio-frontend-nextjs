# Story 6.6: Lighthouse Quality Gate

Status: ready-for-dev

---

## Story

As an **owner**,
I want **automated Lighthouse checks**,
So that **performance and accessibility don't regress**.

---

## Acceptance Criteria

### AC1: Lighthouse CI Executes in CI
**Given** CI runs on a PR
**When** Lighthouse CI executes
**Then** it checks Performance (≥90) and Accessibility (≥95)
**And** results are posted to the PR

### AC2: Threshold Warnings (Non-Blocking)
**Given** scores drop below thresholds
**When** results are reported
**Then** a warning is shown (non-blocking for MVP)
**And** specific issues are listed

---

## Tasks / Subtasks

- [ ] **Task 1: Install Lighthouse CI** (AC: #1)
  - [ ] 1.1 Install `@lhci/cli` as dev dependency (`npm install -D @lhci/cli`)
  - [ ] 1.2 Add `npm run lighthouse` script to package.json
  - [ ] 1.3 Verify installation with `npx lhci --version`

- [ ] **Task 2: Create Lighthouse CI Configuration** (AC: #1, #2)
  - [ ] 2.1 Create `lighthouserc.js` in project root
  - [ ] 2.2 Configure `collect` settings (use localhost:9000, consistent with E2E)
  - [ ] 2.3 Configure `assert` thresholds: Performance ≥90, Accessibility ≥95
  - [ ] 2.4 Configure `upload` to temporary-public-storage (no server needed)
  - [ ] 2.5 Set assertions as `warn` not `error` (non-blocking per architecture)

- [ ] **Task 3: Integrate Lighthouse in CI** (AC: #1, #2)
  - [ ] 3.1 Add `lighthouse` job to `.github/workflows/ci.yml`
  - [ ] 3.2 Lighthouse job should depend on `quality` job (needs: quality)
  - [ ] 3.3 Build Next.js static export (`npm run build`)
  - [ ] 3.4 Serve built assets and run Lighthouse against them
  - [ ] 3.5 Use `continue-on-error: true` for non-blocking (warning only)
  - [ ] 3.6 Upload Lighthouse report as artifact

- [ ] **Task 4: PR Comment Integration** (AC: #1)
  - [ ] 4.1 Configure LHCI to output results that can be posted to PR
  - [ ] 4.2 Add step to post Lighthouse results as PR comment (optional: use lhci autorun or gh CLI)
  - [ ] 4.3 Results should show score categories and link to full report

- [ ] **Task 5: Documentation** (AC: #1, #2)
  - [ ] 5.1 Add Lighthouse section to `docs/development-workflow.md` (Section 12)
  - [ ] 5.2 Document how to run Lighthouse locally
  - [ ] 5.3 Document threshold configuration
  - [ ] 5.4 Document how to interpret and fix common issues
  - [ ] 5.5 Update CI/CD matrix in docs to reflect Lighthouse (warning status)

- [ ] **Task 6: Validation** (AC: #1, #2)
  - [ ] 6.1 Run `npm run lint` - should pass
  - [ ] 6.2 Run `npm run typecheck` - should pass
  - [ ] 6.3 Run `npm test` - should pass (510 tests)
  - [ ] 6.4 Run `npm run lighthouse` locally - should report scores
  - [ ] 6.5 Verify CI runs Lighthouse on push to this branch
  - [ ] 6.6 Verify Lighthouse warnings don't block PR merge

---

## Dev Notes

### Previous Story Learnings (Story 6.5)

**APPLY THESE PATTERNS FROM 6.5:**
- CI workflow is in `.github/workflows/ci.yml`
- Current CI has `quality` job (lint, typecheck, test) + `e2e` job
- Jobs use `needs: quality` pattern for dependencies
- Port 9000 is used for dev server
- Documentation updates go to `docs/development-workflow.md`
- Use `--legacy-peer-deps` for npm installs (peer dependency conflicts)

**Story 6.5 Key Outcomes:**
- Added Playwright E2E tests (18 tests)
- E2E job depends on quality job
- Artifacts uploaded on failure
- Total tests: 510 unit + 18 E2E

**Code Review Learnings:**
- Avoid arbitrary timeouts - use proper assertions
- Document actual CI state, not aspirational
- @axe-core/playwright deferred to future (A11y automated checks)

### Architecture Requirements

**From architecture.md - CI/CD Pipeline:**
```
| Stage | Tool | Trigger | Blocking |
|-------|------|---------|----------|
| Lighthouse | lighthouse-ci | PR + main | Warning |
```

**Target Pipeline State:**
```yaml
jobs:
  quality:
    - lint
    - typecheck
    - test:unit
  e2e:
    needs: quality
    - test:e2e
  lighthouse:
    needs: quality
    - lighthouse-ci  # ← This story
```

**Architecture Gap Note:**
> "Lighthouse CI config (document during setup)"

This story addresses this gap.

### Technical Specifications

**Lighthouse CI Configuration:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:9000/'],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

**CI Job Configuration:**
```yaml
lighthouse:
  runs-on: ubuntu-latest
  needs: quality
  continue-on-error: true  # Non-blocking, warning only
  steps:
    - uses: actions/checkout@v5
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
    - name: Build
      run: npm run build
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun
    - name: Upload Lighthouse report
      uses: actions/upload-artifact@v4
      with:
        name: lighthouse-report
        path: .lighthouseci/
        retention-days: 7
```

**Package.json Scripts:**
```json
{
  "lighthouse": "lhci autorun",
  "lighthouse:local": "lhci collect --url=http://localhost:9000"
}
```

### NFR Compliance (from PRD)

**NFR1-7:** Performance
- NFR1: Lighthouse Performance ≥90
- NFR2: LCP < 2.5s
- NFR3: FID < 100ms
- NFR4: CLS < 0.1

**NFR13-14:** Accessibility
- NFR14: Lighthouse Accessibility ≥95

**Architecture - CI/CD Pipeline:**
- Lighthouse: `PR + main | Warning (non-blocking)`

### Related Files

```
lighthouserc.js                # New Lighthouse CI config
.github/workflows/ci.yml       # Add lighthouse job
package.json                   # Add lighthouse script
docs/development-workflow.md   # Add Lighthouse docs (Section 12)
.gitignore                     # Add .lighthouseci/ artifacts
```

### Key Considerations

**Why Non-Blocking (Warning)?**
- MVP phase - focus on shipping
- Lighthouse scores can be noisy (network conditions, etc.)
- Gives visibility without blocking velocity
- Can tighten to blocking post-MVP

**Local vs CI Differences:**
- CI builds static export, serves with `serve` or `next start`
- Local can test against `npm run dev`
- 3 runs for consistent results in CI

**Common Lighthouse Issues:**
- Unused JavaScript → code splitting
- Render-blocking resources → async loading
- Image optimization → next/image
- Color contrast → WCAG compliance

**Prerequisites:**
- Next.js build must succeed
- Quality job must pass first

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # Should pass
npm run typecheck     # Should pass
npm test              # Should pass (510 tests)
npm run lighthouse    # Should run and report scores
```

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] Lighthouse runs locally with `npm run lighthouse`
- [ ] Lighthouse reports Performance and Accessibility scores
- [ ] CI runs Lighthouse job on push to this branch
- [ ] Lighthouse warnings don't block PR merge (continue-on-error)
- [ ] Lighthouse report artifact is available in GitHub Actions
- [ ] Documentation explains how to run/interpret Lighthouse

---

## References

- [Source: epics.md#Story 6.6] - Original acceptance criteria
- [Source: architecture.md#CI/CD Pipeline] - Lighthouse specification
- [Source: architecture.md#Gap Analysis] - "Lighthouse CI config" gap
- [Source: 6-5-e2e-test-suite.md] - Previous story patterns
- [Source: .github/workflows/ci.yml] - Current CI configuration
- [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci)

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

