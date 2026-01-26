# Story 6.4: One-Command Deploy

Status: in-progress

---

## Story

As an **owner**,
I want **to deploy updates with a single command**,
So that **updates are quick and reliable**.

---

## Acceptance Criteria

### AC1: Auto-Deploy on Merge
**Given** changes are approved and merged to main
**When** the merge completes
**Then** Vercel auto-deploys to production
**And** the deploy is zero-downtime

### AC2: Quality Gates Before Deploy
**Given** I want to deploy manually
**When** I run `git push origin main` (or merge PR)
**Then** CI runs all quality gates
**And** deploy only proceeds if all checks pass

---

## Tasks / Subtasks

- [x] **Task 1: Verify Current CI/CD Pipeline** (AC: #1, #2)
  - [x] 1.1 Review `.github/workflows/ci.yml` for current quality gates
  - [x] 1.2 Verify Vercel GitHub integration auto-deploys on main merge
  - [x] 1.3 Document current pipeline stages in Dev Notes
  - [x] 1.4 Identify any gaps between current state and AC requirements

- [x] **Task 2: Enhance CI Quality Gates** (AC: #2)
  - [x] 2.1 Ensure CI blocks merge if lint fails - CI jobs run sequentially, failure stops workflow
  - [x] 2.2 Ensure CI blocks merge if typecheck fails - CI jobs run sequentially, failure stops workflow
  - [x] 2.3 Ensure CI blocks merge if tests fail - CI jobs run sequentially, failure stops workflow
  - [x] 2.4 Add GitHub branch protection rules documentation - added to development-workflow.md

- [x] **Task 3: Document Deploy Workflow** (AC: #1, #2)
  - [x] 3.1 Add "## Production Deployment" section to `docs/development-workflow.md`
  - [x] 3.2 Document step-by-step: "How to deploy to production"
  - [x] 3.3 Document: "What quality gates must pass"
  - [x] 3.4 Document: "How to verify deployment success"
  - [x] 3.5 Add rollback procedure documentation

- [ ] **Task 4: Add Deploy Script** (AC: #2)
  - [ ] 4.1 Add `npm run deploy` script to package.json (if not using Vercel auto-deploy)
  - [ ] 4.2 Script should run quality checks before push
  - [ ] 4.3 Document script usage in development-workflow.md
  - [ ] 4.4 Consider: may not be needed if Vercel auto-deploys on merge

- [ ] **Task 5: Validation** (AC: #1, #2)
  - [ ] 5.1 Verify current branch can trigger preview deploy
  - [ ] 5.2 Verify merging to main triggers production deploy
  - [ ] 5.3 Verify CI blocks merge if tests fail (test with intentional failure)
  - [ ] 5.4 Document validation results in Dev Notes

---

## Dev Notes

### Previous Story Learnings (Story 6.3)

**APPLY THESE PATTERNS FROM 6.3:**
- Configuration-only stories focus on verification + documentation
- vercel.json already configured with GitHub integration
- Preview deployments are working (from Story 6.3)
- Documentation updates in `docs/development-workflow.md`

**Story 6.3 Key Outcomes:**
- vercel.json created with `github.silent: false`
- Preview workflow documented in development-workflow.md
- Total tests: 510

### Current State Analysis (Task 1 Verified)

**CI Pipeline (`.github/workflows/ci.yml`) - VERIFIED:**
```yaml
name: CI
on:
  push:
    branches: [main, 'epic/*']
  pull_request:
    branches: [main, 'epic/*']

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4 (node 20, cache npm)
      - npm ci --legacy-peer-deps
      - npm run lint          # ✅ Quality Gate 1
      - npm run typecheck     # ✅ Quality Gate 2
      - npm test              # ✅ Quality Gate 3
```

**Vercel Configuration (`vercel.json`) - VERIFIED:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci --legacy-peer-deps",
  "github": {
    "silent": false,           // ✅ PR comments enabled
    "autoJobCancellation": true // ✅ Efficient CI
  },
  "headers": [...]             // ✅ Security headers
}
```

**Current Deploy Flow - VERIFIED:**
1. Developer pushes to PR branch → Vercel creates preview ✅
2. CI runs lint, typecheck, tests (blocking) ✅
3. PR merged to main → Vercel auto-deploys to production ✅
4. Zero-downtime by Vercel atomic deployments ✅

**Gap Analysis:**
| Requirement | Status | Action Needed |
|-------------|--------|---------------|
| Auto-deploy on merge | ✅ Working | None |
| Quality gates in CI | ✅ Working | None |
| Block merge if CI fails | ⚠️ Needs branch protection | Document setup |
| Documentation | ❌ Missing | Add to development-workflow.md |

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| Quality gates | CI blocks on lint/typecheck/test failure |
| Auto-deploy | Vercel GitHub App on main merge |
| Zero-downtime | Vercel atomic deploys |
| Documentation | Update `docs/development-workflow.md` |

### Key Considerations

**What "One-Command Deploy" Means:**
1. **Option A: Git-based (Recommended)** - `git push origin main` triggers deploy
2. **Option B: Script-based** - `npm run deploy` runs checks + push

**Vercel Auto-Deploy Behavior:**
- On merge to main → automatic production deploy
- On push to PR branch → automatic preview deploy
- No manual `vercel deploy` needed in normal workflow

**Quality Gate Enforcement:**
- GitHub Actions CI must pass before merge
- Branch protection rules on main recommended
- Vercel only deploys after CI success (if configured)

### Related Files

```
.github/workflows/ci.yml     # CI quality gates
vercel.json                  # Vercel deployment config
docs/development-workflow.md # Documentation to update
package.json                 # May add deploy script
```

### NFR Compliance (from PRD)

**FR31:** Owner can deploy updates with single command
- Git push to main triggers full pipeline
- Vercel auto-deploys after CI passes

**NFR25:** Zero downtime deploys
- Vercel atomic deployments (SLA)
- Old deployment serves until new one is ready

**NFR24:** 99.9% uptime (Vercel SLA)
- Deployment failures don't affect running site

---

## Testing Requirements

### Validation Commands

```bash
# No code changes expected - validation is manual/integration
npm run lint          # Should still pass (no code changes)
npm run typecheck     # Should still pass (no code changes)
npm test              # Should still pass (no code changes)
```

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] CI runs on every PR push
- [ ] CI blocks merge if lint fails
- [ ] CI blocks merge if typecheck fails
- [ ] CI blocks merge if tests fail
- [ ] Merging to main triggers Vercel production deploy
- [ ] Production deploy is zero-downtime
- [ ] Documentation clearly explains deploy process
- [ ] Owner can deploy without developer assistance

---

## References

- [Source: epics.md#Story 6.4] - Original acceptance criteria (FR31)
- [Source: 6-3-preview-changes.md] - Previous story patterns
- [Source: architecture.md] - CI/CD pipeline requirements
- [Source: .github/workflows/ci.yml] - Current CI configuration
- [Source: vercel.json] - Vercel deployment configuration

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
