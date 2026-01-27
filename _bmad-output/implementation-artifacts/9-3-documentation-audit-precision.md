# Story 9.3: Documentation Audit Precision

## Story

**As a** developer,
**I want** precise metrics in documentation audits,
**So that** audit results are verifiable and trustworthy.

## Status

- **Epic:** 9 - Documentation & Developer Experience
- **Sprint Status:** ready-for-dev
- **Priority:** LOW
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Exact Counts Replace Vague Terms

**Given** a documentation audit is performed
**When** results are recorded
**Then** exact counts replace vague terms ("Many" → specific number)
**And** audit methodology is documented

### AC2: Audit Table Maintainability

**Given** future documentation changes
**When** they affect audited metrics
**Then** the audit table is updated accordingly

## Tasks / Subtasks

### Task 1: Count Code Blocks in "Many" Files

- [ ] 1.1 Count code blocks in `docs/development-workflow.md`
- [ ] 1.2 Count code blocks in `docs/development-guide.md`
- [ ] 1.3 Count code blocks in `docs/source-tree-analysis.md`
- [ ] 1.4 Document counting methodology

### Task 2: Update Story 7.4 Audit Table

- [ ] 2.1 Update Story 7.4 "Code Examples Audit Results" table
- [ ] 2.2 Replace "Many" with exact counts
- [ ] 2.3 Add "Last Updated" note to table

### Task 3: Document Audit Methodology (AC1, AC2)

- [ ] 3.1 Add methodology note explaining how to count code blocks
- [ ] 3.2 Include command or pattern for future audits

## Dev Notes

### Technical Context

- **Debt Origin:** Story 7.4 code review identified "Many" vs exact counts as precision issue
- **Scope:** Story documentation only - NO code changes
- **Affected File:** `_bmad-output/implementation-artifacts/7-4-documentation-navigation.md`

### Issue to Fix

From Story 7.4 "Code Examples Audit Results" table:

| File | Code Blocks | Issue |
|------|-------------|-------|
| development-workflow.md | Many | Should be exact count |
| development-guide.md | Many | Should be exact count |
| source-tree-analysis.md | Many | Should be exact count |

### Implementation Approach

1. **Count code blocks** - Use grep to count triple-backtick fences
2. **Update table** - Replace "Many" with exact numbers
3. **Add methodology** - Document how to re-audit in future

### Counting Methodology

```bash
# Count code blocks in a markdown file
grep -c '```' docs/<filename>.md | awk '{print $1/2}'
# Divide by 2 because each code block has opening and closing fence
```

### Scope Boundaries

Per Epic 9 definition:
- This story does NOT change code files
- This story does NOT rewrite story narratives
- Focus: precision in audit metrics

### Previous Story Intelligence

From Story 9.2:
- Scope discipline was key to story closure
- Documentation-only changes close quickly
- Pattern: minimal changes, maximum accuracy
- TDD approach with commits between phases

### Dependencies

- **Blocks:** None
- **Blocked by:** None
- **Related:** Story 9.1, 9.2 (same epic, documentation focus)

## Project Structure Notes

### Files to Modify

```
_bmad-output/implementation-artifacts/
└── 7-4-documentation-navigation.md  # UPDATE: Audit table with exact counts
```

### Files to Count

```
docs/
├── development-workflow.md   # COUNT: Replace "Many"
├── development-guide.md      # COUNT: Replace "Many"
└── source-tree-analysis.md   # COUNT: Replace "Many"
```

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| - | Audit uses "Many" vs exact count | Story 7.4 code review | Replace with exact counts |

### Architecture Alignment

- **Documentation Standards:** Audit results should be verifiable
- **Pattern:** Precise metrics over vague descriptions

### Existing Code References

- `7-4-documentation-navigation.md` - Contains audit table to update

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-27 |
| Story Author | Workflow: create-story |
| Epic | 9 - Documentation & Developer Experience |
| Debt Origin | Story 7.4 code review |

---

## File List

### Files Modified

| File | Changes |
|------|---------|
| (to be filled during implementation) | |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-27 | Story created via create-story workflow |
