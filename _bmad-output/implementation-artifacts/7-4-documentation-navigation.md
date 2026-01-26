# Story 7.4: Documentation Navigation

## Story

**As a** developer reading documentation,
**I want** navigation aids in long documents,
**So that** I can find information quickly.

## Status

- **Epic:** 7 - Technical Infrastructure & Maintenance
- **Sprint Status:** ready-for-dev
- **Priority:** LOW
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Table of Contents in development-workflow.md

**Given** development-workflow.md (1169 lines)
**When** I open the document
**Then** a Table of Contents is present at the top
**And** TOC links navigate to correct sections
**And** section headers use consistent formatting

### AC2: Cross-References in content-management.md

**Given** content-management.md
**When** I read it
**Then** cross-references to related docs work
**And** examples are complete and accurate

### AC3: Code Examples Quality

**Given** any documentation file
**When** I read it
**Then** code examples are syntax-highlighted (via markdown fences)
**And** commands are copy-pasteable

## Tasks / Subtasks

### Task 1: Add TOC to development-workflow.md (AC1)

- [ ] 1.1 Analyze document structure (sections, subsections)
- [ ] 1.2 Generate Table of Contents with anchor links
- [ ] 1.3 Ensure all section headers have consistent markdown format
- [ ] 1.4 Verify TOC links navigate correctly

### Task 2: Improve content-management.md Cross-References (AC2)

- [ ] 2.1 Audit existing cross-references for broken links
- [ ] 2.2 Add references to related docs where helpful
- [ ] 2.3 Verify examples are complete and accurate

### Task 3: Verify Code Examples Quality (AC3)

- [ ] 3.1 Audit code blocks for proper language tags
- [ ] 3.2 Ensure shell commands are copy-pasteable (no prompt chars)
- [ ] 3.3 Fix any malformed code fences

## Dev Notes

### Technical Context

- **Target Files:**
  - `docs/development-workflow.md` (1169 lines) - main target for TOC
  - `docs/content-management.md` (220 lines) - cross-references focus
  - All docs in `docs/` folder (9 files total)

- **Approach:** Documentation-only changes, no code modifications

### Implementation Constraints

1. **Non-breaking:** Changes are purely documentary
2. **Markdown compatibility:** TOC must work in GitHub and VS Code preview
3. **No build tooling:** Generate TOC manually (no external tools required)

### Previous Story Intelligence

From Story 7.3 code review:
- Documentation improvements were identified as LOW priority
- Deferred to avoid scope creep in test quality work
- Now dedicated story for focused documentation work

### Files to Modify

```
docs/
├── development-workflow.md   # ADD: Table of Contents
├── content-management.md     # VERIFY: Cross-references
├── architecture.md           # AUDIT: Code examples
├── component-inventory.md    # AUDIT: Code examples
├── data-models.md            # AUDIT: Code examples
├── development-guide.md      # AUDIT: Code examples
├── index.md                  # VERIFY: Links work
├── project-overview.md       # AUDIT: Code examples
└── source-tree-analysis.md   # AUDIT: Code examples
```

## References

### Architecture Alignment

- **Documentation Standards (PRD):** Developer-facing docs should be navigable
- **DX Focus:** Improve contributor onboarding experience
- **Debt Origin:** Epic 6 retrospective identified docs lack TOC

### Existing Documentation Patterns

- `docs/index.md` serves as docs entry point
- Documents use GitHub-flavored markdown
- Code blocks use triple-backtick fencing with language tags

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-26 |
| Story Author | Workflow: create-story |
| Epic | 7 - Technical Infrastructure & Maintenance |
| FR Coverage | N/A (internal quality) |
| NFR Coverage | Developer experience, documentation |
| Debt Origin | Epic 6 retrospective |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-26 | Story created via create-story workflow |
