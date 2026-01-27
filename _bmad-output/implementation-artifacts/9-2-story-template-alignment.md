# Story 9.2: Story Template Alignment

## Story

**As a** developer,
**I want** story code samples to match actual implementation,
**So that** stories serve as accurate reference documentation.

## Status

- **Epic:** 9 - Documentation & Developer Experience
- **Sprint Status:** ready-for-dev
- **Priority:** MEDIUM
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Code Samples Reflect Real Implementation

**Given** a completed story file with code samples
**When** I compare to actual implementation
**Then** code samples reflect the real implementation
**And** file paths in samples are accurate

### AC2: Future Story Process Improvement

**Given** future stories are created
**When** code samples are included
**Then** they are updated post-implementation if they diverged

## Tasks / Subtasks

### Task 1: Audit Story 7.1-7.4 Code Samples

- [x] 1.1 Review `7-1-automated-accessibility-testing.md` code samples
- [x] 1.2 Compare Task 2 code sample (`e2e/utils/accessibility.ts`) with actual implementation
- [x] 1.3 Compare Task 4 code sample (`e2e/accessibility.spec.ts`) with actual implementation
- [x] 1.4 Document discrepancies found

**Task 1 Discrepancies Found:**

| Sample Location | Discrepancy | Real Implementation |
|-----------------|-------------|---------------------|
| Task 2: `checkA11y()` | Uses inline tags array `['wcag2a', 'wcag2aa', 'wcag21aa']` | Uses exported `WCAG_TAGS` constant including `'wcag22aa'` |
| Task 2: Missing | No `filterSeriousViolations()` | Has `filterSeriousViolations()` function |
| Task 2: Missing | No `WCAG_TAGS` export | Exports `WCAG_TAGS` for test introspection |
| Task 2: Missing | No doc header comments | Has comprehensive JSDoc header |
| Task 4: Structure | Simple flat test file (~42 lines) | Nested test.describe structure (231 lines) |
| Task 4: Theme test | Uses button click to toggle | Uses `emulateMedia({ colorScheme })` |
| Task 4: Missing | No tablet viewport test | Has tablet viewport (768x1024) test |
| Task 4: Missing | No summary test | Has Accessibility Summary test across routes |

### Task 2: Audit Story 7.2 Code Samples

- [x] 2.1 Review `7-2-e2e-test-selector-resilience.md` code samples
- [x] 2.2 Compare `e2e/testids.ts` sample with actual implementation
- [x] 2.3 Compare Task 6-9 E2E migration patterns with actual tests
- [x] 2.4 Document discrepancies found

**Task 2 Discrepancies Found:**

| Sample Location | Discrepancy | Real Implementation |
|-----------------|-------------|---------------------|
| Task 1: `testids.ts` | Has `nav.social.githubLink`, `linkedinLink` explicit | Has `nav.social.container` + `getSocialLinkTestId()` helper |
| Task 1: Missing | No helper function | Has `getSocialLinkTestId(provider)` for dynamic testids |
| Task 6-9: Patterns | Simple BEFORE/AFTER patterns | Real tests include viewport settings, waitForSelector timeouts |
| Task 9: theme.spec | Sample shows simple button click | Real has `clickThemeButton()` helper with JS dispatch |
| Task 6-9: Missing | No consolidation comments | All tests have `// A11y tests consolidated...` comment |

### Task 3: Audit Story 7.3 Code Samples

- [x] 3.1 Review `7-3-test-quality-improvements.md` code samples
- [x] 3.2 Verify timeout replacement patterns match actual changes
- [x] 3.3 Verify weak assertion fix patterns match actual changes
- [x] 3.4 Document discrepancies found

**Task 3 Discrepancies Found:**

| Sample Location | Discrepancy | Real Implementation |
|-----------------|-------------|---------------------|
| Task 2: Pattern | Sample shows `setTimeout` removal | Real code correctly uses `mockResolvedValue` ✅ |
| Task 3: Pattern | Sample shows weak assertion fix | Real code has proper `expect(links).toHaveLength(0)` ✅ |

**Note:** Story 7.3 samples are BEFORE/AFTER patterns showing what was changed. The actual implementation matches the AFTER patterns correctly. No alignment needed - samples serve as historical reference of what was fixed.

### Task 4: Audit Story 7.4 (No Code Samples)

- [x] 4.1 Confirm `7-4-documentation-navigation.md` has no code samples requiring alignment
- [x] 4.2 Mark as N/A if confirmed

**Task 4 Result:** N/A - Story 7.4 contains only a tree diagram of files to modify, no TypeScript/JavaScript code samples requiring alignment.

### Task 5: Align Discrepant Samples

- [ ] 5.1 Update story files with corrected code samples
- [ ] 5.2 Add note in Change Log indicating alignment performed
- [ ] 5.3 Keep original intent clear (samples are examples, not verbatim)

### Task 6: Document Process Improvement (AC2)

- [ ] 6.1 Add recommendation to story template or workflow notes
- [ ] 6.2 Suggest: "Post-implementation, verify code samples match reality"

## Dev Notes

### Technical Context

- **Debt Origin:** Story 7.1 code review identified M1 (code samples differ from implementation)
- **Scope:** Story documentation only - NO code changes
- **Affected Stories:** 7.1, 7.2, 7.3 (7.4 likely has no code samples)

### M1 Issue Context (from Story 7.1)

The code review found:
> | M1 | Story code sample differs from implementation | Story file | Update story template to match real code |

Story files contain code samples in the Tasks sections that were written as planning guidance but may not reflect the actual implementation decisions made during development.

### Implementation Approach

1. **Read each story file** - Identify all code blocks in Task sections
2. **Read actual implementation** - Compare with code samples
3. **Document discrepancies** - Note what differs and why
4. **Update samples** - Align to reality while preserving intent
5. **Add process note** - Recommend post-implementation verification

### Scope Boundaries

Per Epic 9 definition:
- This story does NOT change code files
- This story does NOT rewrite story narratives
- Focus: align code samples to reality

### Previous Story Intelligence

From Story 9.1:
- Scope discipline was key to story closure
- Documentation-only changes close quickly
- Pattern: minimal changes, maximum accuracy

### Dependencies

- **Blocks:** None
- **Blocked by:** None
- **Related:** Story 9.1 (same epic, documentation focus)

## Project Structure Notes

### Files to Audit

```
_bmad-output/implementation-artifacts/
├── 7-1-automated-accessibility-testing.md  # AUDIT: Task 2, Task 4 code samples
├── 7-2-e2e-test-selector-resilience.md     # AUDIT: Task 1, Task 6-9 code samples
├── 7-3-test-quality-improvements.md        # AUDIT: Task 2, Task 3 patterns
└── 7-4-documentation-navigation.md         # VERIFY: No code samples
```

### Implementation Files to Compare

```
e2e/
├── utils/accessibility.ts    # Compare with 7.1 Task 2 sample
├── accessibility.spec.ts     # Compare with 7.1 Task 4 sample
├── testids.ts               # Compare with 7.2 Task 1 sample
├── home.spec.ts             # Compare with 7.2 Task 6 patterns
├── navigation.spec.ts       # Compare with 7.2 Task 7 patterns
├── contact.spec.ts          # Compare with 7.2 Task 8 patterns
└── theme.spec.ts            # Compare with 7.2 Task 9 patterns

src/domains/project/queries/__tests__/
└── useProject.test.tsx      # Compare with 7.3 Task 2 patterns
```

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| M1 | Story code sample differs from implementation | Story 7.1 code review | Audit and align samples |

### Architecture Alignment

- **Documentation Standards:** Stories serve as reference documentation
- **Pattern:** Code samples should be accurate or clearly marked as illustrative

### Existing Code References

- `e2e/utils/accessibility.ts` - Actual a11y utility implementation
- `e2e/testids.ts` - Actual testid registry
- Story 7.1-7.4 files - Contain code samples to audit

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-27 |
| Story Author | Workflow: create-story |
| Epic | 9 - Documentation & Developer Experience |
| Debt Origin | Story 7.1 code review M1 |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-27 | Story created via create-story workflow |
