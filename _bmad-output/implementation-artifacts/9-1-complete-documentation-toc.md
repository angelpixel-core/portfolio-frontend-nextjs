# Story 9.1: Complete Documentation TOC

## Story

**As a** developer reading documentation,
**I want** complete and consistent Table of Contents,
**So that** I can navigate long documents efficiently.

## Status

- **Epic:** 9 - Documentation & Developer Experience
- **Sprint Status:** done
- **Priority:** MEDIUM
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: development-workflow.md TOC Enhancement

**Given** development-workflow.md has a TOC
**When** I review it
**Then** subsections (###) are included where helpful
**And** all headers follow consistent naming pattern (`## N. Title`)
**And** the `## Manual Validation Checklist` header is corrected to `### Manual Validation Checklist`

### AC2: content-management.md TOC Addition

**Given** content-management.md (220 lines)
**When** I open the document
**Then** a Table of Contents is present at the top
**And** TOC links navigate to correct sections

## Tasks / Subtasks

### Task 1: Audit Current TOC State (AC1, AC2)

- [x] 1.1 Review development-workflow.md current TOC (lines 9-26)
- [x] 1.2 Identify missing subsections that would improve navigation
- [x] 1.3 Locate `## Manual Validation Checklist` (line 375) for header correction
- [x] 1.4 Confirm content-management.md has no TOC

### Task 2: Fix development-workflow.md Header (AC1)

- [x] 2.1 Change `## Manual Validation Checklist` to `### Manual Validation Checklist`
- [x] 2.2 Verify `### Manual Validation Result` remains correctly leveled
- [x] 2.3 Verify document structure remains consistent

### Task 3: Enhance development-workflow.md TOC (AC1)

- [x] 3.1 Add key subsections to TOC where navigation benefit is clear
- [x] 3.2 Ensure all TOC links work correctly
- [x] 3.3 Verify consistent numbering pattern (`## N. Title`)

### Task 4: Add TOC to content-management.md (AC2)

- [x] 4.1 Identify all `##` headers in content-management.md
- [x] 4.2 Create Table of Contents section at top of file
- [x] 4.3 Generate anchor links for each section
- [x] 4.4 Verify all TOC links navigate correctly

### Task 5: Validate Changes

- [x] 5.1 Review all modified documents for consistency
- [x] 5.2 Verify no broken links in TOC entries
- [x] 5.3 Confirm criterion met: docs >150 lines have TOC

## Dev Notes

### Technical Context

- **Debt Origin:** Story 7.4 code review identified TOC inconsistencies
- **Scope:** Documentation navigation only - NO content changes
- **Criterion:** Documents >150 lines should have TOC

### Current State Analysis

**development-workflow.md:**
- Lines: ~1,250
- Has TOC: Yes (lines 9-26)
- Issue 1: `## Manual Validation Checklist` at line 375 should be `###`
- Issue 2: TOC could include key subsections for better navigation

**content-management.md:**
- Lines: 220
- Has TOC: **NO**
- Action: Add TOC at top

### Scope Boundaries

Per Epic 9 definition:
- This story does NOT rewrite content
- This story does NOT change technical decisions
- Focus: improve navigation and accessibility of existing docs

### Previous Story Intelligence

From Epic 8:
- Scope discipline was key to story closure
- Story 8.3 added Wait Strategies section to development-workflow.md (now in TOC)
- Pattern: minimal changes, maximum clarity

### Dependencies

- **Blocks:** None
- **Blocked by:** None
- **Related:** Story 9.2, 9.3 (other documentation improvements)

## Project Structure Notes

### Files to Modify

```
docs/
├── development-workflow.md  # MODIFY: Fix header level, enhance TOC
└── content-management.md    # MODIFY: Add TOC
```

### Files NOT Modified

- Other docs/*.md files (out of scope for this story)
- Story files or implementation artifacts
- Any code files

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| - | TOC incompleto (subsecciones no listadas) | Story 7.4 | Add subsections to TOC |
| - | Header inconsistente (`## Manual Validation Checklist`) | Story 7.4 | Change to `###` |
| - | content-management.md sin TOC | Story 7.4 | Add TOC |

### Architecture Alignment

- **Documentation Standards:** docs >150 lines should have TOC
- **Pattern:** Consistent header hierarchy (## for sections, ### for subsections)

### Existing Code References

- `docs/development-workflow.md:9-26` - Current TOC
- `docs/development-workflow.md:375` - Header to fix
- `docs/content-management.md` - Needs TOC

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-27 |
| Story Author | Workflow: create-story |
| Epic | 9 - Documentation & Developer Experience |
| Debt Origin | Story 7.4 code review |
| Implementation Started | 2026-01-27 |
| Implementation Completed | 2026-01-27 |
| Dev Agent | Claude Opus 4.5 |

### Completion Notes

- ✅ All 5 tasks completed
- ✅ Both acceptance criteria satisfied:
  - AC1: development-workflow.md header fixed (## → ###), TOC enhanced with Wait Strategies subsection
  - AC2: content-management.md TOC added (25 lines, 4 main sections + subsections)

---

## File List

### Files Modified

| File | Changes |
|------|---------|
| `docs/development-workflow.md` | Fixed `## Manual Validation Checklist` → `### Manual Validation Checklist`, added Wait Strategies to TOC |
| `docs/content-management.md` | Added complete Table of Contents (25 lines) |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-27 | Story created via create-story workflow |
| 2026-01-27 | Implementation completed: TOC improvements applied to both docs |
| 2026-01-27 | Code review passed: M1 accepted (story doc accuracy), L1/L2 accepted |
