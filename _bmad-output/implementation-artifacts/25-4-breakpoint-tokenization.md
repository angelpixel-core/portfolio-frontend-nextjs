# Story 25.4: Breakpoint Tokenization

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer maintaining the project's design token architecture,
I want to replace raw breakpoint pixel values semantic media query tokens,
so that the codebase is maintainable and breakpoints follow the established token system.

## Acceptance Criteria

1. Zero raw `560px`, `720px`, `768px`, `880px` in `@media` queries (excl. WordCloud)
2. Zero raw `1024px` in `@media` queries (excl. WordCloud, excl. max-width containers)
3. All migrations use `@media screen(token)` pattern (not plain numeric)
4. All tests pass (no regressions)
5. `npm run build` succeeds

## Tasks / Subtasks

**Phase 1: Add new tokens to tailwind.config.js**

- [ ] Task 1: Add new breakpoint tokens (AC: #3)
  - [ ] 1.1 Open `tailwind.config.js`
  - [ ] 1.2 Add `compact: "560px"` under `screens` object (new, progressive typography step)
  - [ ] 1.3 Add `medium: "720px"` under `screens` object (new, tablet content expansion)
  - [ ] 1.4 Add `content: "768px"` under `screens` object (new, content layout shifts)
  - [ ] 1.5 Add `navContent: "880px"` under `screens` object (new, nav content full display)
  - [ ] 1.6 Verify all 10 breakpoints defined (phablet, compact, mobile, tablet, medium, content, nav, navContent, stage, desktop, wide)

**Phase 2: Batch migrations by token type**

- [ ] Task 2: Migrate `compact: 560px` instances (~10 files, AC: #1,#3)
  - [ ] 2.1 Search for `min-width: 560px` in CSS files (exclude WordCloud)
  - [ ] 2.2 Replace with `@media screen(compact)`
  - [ ] 2.3 Verify no remaining `560px` values
  - [ ] 2.4 List files modified
  - [ ] 2.5 Visual check: progressive typography scaling works at 400px → 560px step

- [ ] Task 3: Migrate `medium: 720px` instances (~34 files, AC: #1,#3)
  - [ ] 3.1 Search for `min-width: 720px` in CSS files (exclude WordCloud)
  - [ ] 3.2 Replace with `@media screen(medium)`
  - [ ] 3.3 Verify no remaining `720px` values
  - [ ] 3.4 List files modified
  - [ ] 3.5 Visual check: tablet content expansion works at 720px breakpoint

- [ ] Task 4: Migrate `content: 768px` instances (~40 files, AC: #1,#3)
  - [ ] 4.1 Search for `min-width: 768px` in CSS files (exclude WordCloud)
  - [ ] 4.2 Replace with `@media screen(content)`
  - [ ] 4.3 Handle edge case: `max-width: 768px` in ArticleContent → `@media not screen(content)` (per epic)
  - [ ] 4.4 Verify no remaining `768px` values (except max-width containers)
  - [ ] 4.5 List files modified
  - [ ] 4.6 Visual check: content layout shifts work at 768px breakpoint

- [ ] Task 5: Migrate `navContent: 880px` instances (~11 files, AC: #1,#3)
  - [ ] 5.1 Search for `min-width: 880px` in CSS files (exclude WordCloud)
  - [ ] 5.2 Replace with `@media screen(navContent)`
  - [ ] 5.3 Verify no remaining `880px` values
  - [ ] 5.4 List files modified
  - [ ] 5.5 Visual check: nav content full display works at 880px breakpoint

- [ ] Task 6: Migrate `desktop: 1025px` legacy instances (~29 files, AC: #2,#3)
  - [ ] 6.1 Search for `min-width: 1024px` in CSS files (exclude WordCloud, exclude max-width containers)
  - [ ] 6.2 Replace with `@media screen(desktop)`
  - [ ] 6.3 Handle edge case: `max-width: 1024px` in globals.css → keep as raw value (per epic, container max not breakpoint)
  - [ ] 6.4 Verify no remaining `1024px` values (except max-width containers)
  - [ ] 6.5 List files modified
  - [ ] 6.6 Visual check: desktop layout works at 1025px breakpoint

**Phase 3: Verification**

- [ ] Task 7: Verify all breakpoints migrated (AC: #1,#2)
  - [ ] 7.1 Search for remaining `560px`, `720px`, `768px`, `880px`, `1024px` in `@media` queries (exclude WordCloud, exclude max-width containers)
  - [ ] 7.2 If any found, investigate and migrate

- [ ] Task 8: Run tests (AC: #4)
  - [ ] 8.1 Run `npm test` (USER VERIFICATION REQUIRED)
  - [ ] 8.2 Verify all tests pass
  - [ ] 8.3 If failures occur, verify they're not related to breakpoint changes

- [ ] Task 9: Build verification (AC: #5)
  - [ ] 9.1 Run `npm run build` (USER VERIFICATION REQUIRED)
  - [ ] 9.2 Verify build succeeds
  - [ ] 9.3 Check for media query errors or warnings

## Dev Notes

### Historical Context - Why This Story Exists

**Architectural Audit Finding** and **ADR-011 (from Story 25.0)** established that raw breakpoint values (`min-width: 560px`, etc.) should be replaced with semantic tokens (`@media screen(compact)`) for consistency and maintainability.

Current state: Mixed pattern — some components use semantic breakpoints (`screen(nav)`, `screen(desktop)`) while others use raw values (`min-width: 720px`, `min-width: 1024px`). This inconsistency makes the codebase harder to maintain.

### Technical Context: Breakpoint Token System

**Current semantic breakpoints (existing in tailwind.config.js):**

```javascript
screens: {
  phablet: "400px",    // Progressive typography +10%
  mobile: "480px",      // Progressive typography +25%
  tablet: "640px",      // Tablets
  nav: "800px",         // Navigation transition
  stage: "960px",       // Hero layout swap
  desktop: "1025px",   // Desktop
  wide: "1441px",      // Wide screens
}
```

**New tokens to add (per ADR-011):**

```javascript
compact: "560px",    // NEW — progressive typography step (phablet → compact)
medium: "720px",     // NEW — tablet content expansion
content: "768px",    // NEW — content layout shifts
navContent: "880px", // NEW — nav content full display
```

**Total: 10 tokens** for full coverage of breakpoint system

### Migration Pattern

**Replace pattern:**

```css
/* Before: */
@media (min-width: 720px) {
  .component__element { ... }
}

/* After: */
@media screen(medium) {
  .component__element { ... }
}
```

**Edge cases (per epic requirements):**

1. `max-width: 768px` in ArticleContent → `@media not screen(content)` (inverted query)
2. `max-width: 1024px` in globals.css (page-container) → **keep as raw value** (container max width, not breakpoint)
3. `min-width: 800px` in HireMe → already maps to `screen(nav)`

**WordCloud exclusion:**

- WordCloud component has ~33 instances of 720/768/1024 pixel values
- These are Component-Specific Correctness (per story 25.0 ADR-012)
- DO NOT MIGRATE — these are intentionally component-specific, not global breakpoints

### Architecture Compliance

**Media Query Syntax:**

- Use `@media screen(token)` pattern (not `@media (min-width: value)`)
- Token lookup: `screen(compact)`, `screen(medium)`, `screen(content)`, `screen(navContent)`, `screen(desktop)`
- Edge case: `@media not screen(content)` for max-width queries

**BEM Naming:**

- This story only migrates media queries (no class name changes)
- Follow existing BEM naming conventions

**Import Rules:**

- No new files or imports required (in-place updates only)
- No barrel imports involved

### Testing Standards

**No new tests required:**

- This is purely media query syntax migration (no behavior changes)
- Existing tests should pass unchanged (visual verification is the primary validation method)
- Build verification catches syntax errors

**Test execution reminder:**

- Developer does NOT run tests — user runs tests manually per project agreement
- Tasks 8-9 (test and build verification) require user execution

### Migration Strategy

**Why this structure (batched by token type)?**

- Grouping by token type (560, 720, 768, 880, 1024) makes progress tracking clearer
- Each task has clear "before → after" pattern
- Prevents overwhelming developers with single task for 124 instances
- Allows visual verification after each batch (catch issues early)

**Batch sizes:**

- Task 2: ~10 instances (small warm-up)
- Task 3: ~34 instances (medium batch)
- Task 4: ~40 instances (largest batch, with edge case handling)
- Task 5: ~11 instances (small batch)
- Task 6: ~29 instances (medium-large batch with edge case)

**Excluded:**

- WordCloud (~33 instances) — Component-specific correctness
- Max-width containers — These are NOT breakpoints, keep raw values

### Project Structure Notes

**File locations:**

- `tailwind.config.js` — Token definitions (add 4 new tokens)
- ~55 CSS files across `src/app/*`, `src/ui/atoms/*`, `src/ui/molecules/*`, `src/ui/organisms/*`

**No structural conflicts:**

- Tokens added to existing `screens` object (extending, not replacing)
- Media query pattern is additive (backward compatible)
- Existing `screen(nav)`, `screen(desktop)` pattern used in codebase

**Alignment with unified project structure:**

- Breakpoints documented in docs/layout-system.md
- Migration aligns all media queries to token pattern
- Removes inconsistency (some components use tokens, some use raw values)

### References

- Epic 25 Story 25.4 definition — `_bmad-output/implementation-artifacts/epic-25-architectural-coherence.md` lines 217-266
- ADR-011 (from Story 25.0) — Breakpoint tokenization requirement
- Brand colors table — `docs/architecture/styles-architecture.md` lines 340-348 (not relevant, but shows pattern)
- Tailwind config baseline — `tailwind.config.js` lines 59-79

### Previous Story Intelligence

**From Story 25.1 (Fix Undefined CSS Variables):**

- Learned: CSS custom properties must be defined before use
- Pattern: Add tokens to config first, then refactor consumers

**From Story 25.2 (Dark Mode Unification):**

- Learned: Media query removal requires both opening AND closing braces
- Learned: Visual verification is critical after CSS changes
- **Critical pattern:** Use perl for batch replacements (hash mismatch issues with edit tool)
- Learned: Build verification catches syntax errors early
- Pattern: Ask user to verify visually after migration

**From Story 25.3 (Social Token Deduplication):**

- Learned: Always re-read file before using edit tool (hash mismatch prevention)
- Learned: Use `perl -pi -e 's/pattern/replacement/g' filename` for batch replacements
- Pattern: When user passes manual verification, mark story complete and done

**Code patterns from Epic 25:**

- Tasks 1-7: Code implementation (developer executes)
- Tasks 8-9: Visual verification (user executes)
- Tasks 8-9: Test and build verification (user executes)

**Migration patterns established:**

1. Add definitions first (prevent breaking changes)
2. Batch migrations by pattern type (manageable changes)
3. Verify + Test (quality gate)
4. Visual verification confirms behavior (especially for CSS)

**Risk mitigation from 25.1, 25.2, 25.3:**

- Build verification catches syntax errors (essential for media query syntax)
- Visual verification ensures responsive layouts work
- Test suite catches regressions

### Git Intelligence

**Recent commits (relevant patterns):**

- `fix: code-review-issues for story-25.2` — Fixed extra brace in CSS media query
- `done: story-25-3 social token deduplication` — Marked done after user verification
- Pattern: Batch CSS migrations using perl -pi -e instead of edit tool

**Code patterns observed:**

- Media query syntax requires balanced braces
- Batch replacements work better with sequential perl commands
- Build verification required after CSS changes (catches syntax errors)

### Web Research

No external web research required — this is internal architecture refactoring using existing patterns. Breakpoint system is already documented in the codebase.

### Migration Reference Table

| Token                | Replaces            | Count | Notes                                                                              |
| -------------------- | ------------------- | ----- | ---------------------------------------------------------------------------------- |
| `screen(compact)`    | `min-width: 560px`  | ~10   | Progressive typography step (phablet → 400 → 560 → 480)                            |
| `screen(medium)`     | `min-width: 720px`  | ~34   | Tablet content expansion                                                           |
| `screen(content)`    | `min-width: 768px`  | ~40\* | Content layout shifts (\*includes ArticleContent edge case: `not screen(content)`) |
| `screen(navContent)` | `min-width: 880px`  | ~11   | Nav content full display                                                           |
| `screen(desktop)`    | `min-width: 1024px` | ~29\* | Desktop layout (\*excludes max-width containers)                                   |

**Total: ~124 instances across ~55 CSS files**

**Excluded:**

- WordCloud: ~33 instances (Component-specific correctness per ADR-012)
- Max-width containers: Keep raw values (these are NOT breakpoints)

## Dev Agent Record

### Agent Model Used

glm-4.7 (opencode)

### Debug Log References

No debug log entries — story creation completed in single pass.

### File List

**To be modified:**

- `tailwind.config.js` — Add 4 new breakpoint tokens (compact, medium, content, navContent)
- ~55 CSS files — Batch migrations by token type (Tasks 2-6)

**Consumer files to migrate (estimated counts):**

- Task 2 (~10 files): `min-width: 560px` → `screen(compact)`
- Task 3 (~34 files): `min-width: 720px` → `screen(medium)`
- Task 4 (~40 files): `min-width: 768px` → `screen(content)` (includes edge case handling)
- Task 5 (~11 files): `min-width: 880px` → `screen(navContent)`
- Task 6 (~29 files): `min-width: 1024px` → `screen(desktop)` (includes edge case handling)

**Reference files (no changes):**

- `docs/architecture/layout-system.md` — Breakpoint system reference
- ADR-011 (Story 25.0) — Breakpoint tokenization requirement

### Completion Notes List

**Completion Notes:**

### Initial Story Creation

Story 25.4 created with comprehensive context for breakpoint tokenization:

- Complexity: L (Large, 4-6h) — ~55 CSS files, ~124 media query instances to migrate
- Risk: Medium — large-scale CSS refactoring, requires careful edge case handling
- Scope: Replace raw pixel values with semantic breakpoint tokens across codebase
- Batch strategy: Group by token type (5 tasks) to make progress manageable

### Migration Summary

**Before:**

- Mixed pattern: some components use `screen(nav)`, `screen(desktop)` tokens, others use `min-width: 720px` raw values
- ~124 raw pixel values hardcoded in @media queries
- Inconsistent maintainability (hard to change breakpoints centrally)

**After:**

- All breakpoints use `screen(token)` pattern (consistent convention)
- 10 breakpoints total (4 original + 2 progressive typography + 4 new layout/context)
- 4 new tokens: compact (560px), medium (720px), content (768px), navContent (880px)
- Centralized breakpoint management via tokens

### Batch Migration Strategy

**Breakdown by task:**

- Task 1: Add 4 new tokens (setup)
- Task 2: Migrate `screen(compact)` (~10 instances) — small batch, warm-up
- Task 3: Migrate `screen(medium)` (~34 instances) — medium batch
- Task 4: Migrate `screen(content)` (~40 instances) — largest batch, includes edge case
- Task 5: Migrate `screen(navContent)` (~11 instances) — small batch
- Task 6: Migrate `screen(desktop)` (~29 instances) — medium-large batch, includes edge case
- Task 7: Verify completion
- Task 8-9: User verification (tests + build)

### Visual Verification Required

After migration completion, developer asks user to:

1. Run visual spot-check: resize browser to 400px, 560px, 720px, 768px, 880px breakpoints
2. Verify progressive typography scaling (400 → 560 → 480 fonts)
3. Verify tablet content expands at 720px
4. Verify content layout shifts at 768px
5. Verify nav content shows fully at 880px
6. Verify desktop layout works at 1025px

### Test and Build Verification

Tasks 8-9 require user manual verification:

- `npm test` — Ensure all tests pass
- `npm run build` — Ensure build succeeds, no media query syntax errors

### Migration Pattern from Epic 25

Following established pattern from 25.1, 25.2, 25.3:

1. Code implementation (Tasks 1-7) — developer executes
2. Visual verification (Task 8) — user executes (resize + spot-check all breakpoints)
3. Test verification (Task 9) — user executes
4. Build verification (Task 9) — user executes

### Batch Learning from 25.3

From Story 25.3 (Social Token Deduplication):

- Learned: Use `perl -pi -e 's/pattern/replacement/g' filename` for batch replacements
- Learned: Always re-read file before using edit tool (hash mismatch prevention)
- Learned: Build verification catches syntax errors early (critical for media queries)

Apply to batch migrations:

- Use perl for each task (single command per token type)
- Re-verify file counts after each batch
- Build after each task to catch syntax errors early

## Change Log

### 2026-02-25 - Initial Story Creation

Created Story 25.4 with comprehensive developer context:

- Epic-level story definition extracted from epic-25-architectural-coherence.md lines 217-266
- Previous story intelligence from 25.1 (token patterns), 25.2 (media query lessons + build verification), 25.3 (perl batch replacements)
- Migration strategy documented (batched by token type, total ~124 instances across ~55 files)
- Consumer file mapping with edge case handling (max-width in ArticleContent + globals.css)
- Visual verification workflow established from 25.2, 25.3 patterns
- Testing and build verification pattern from 25.1, 25.2, 25.3 applied
- Batch learning: Use `perl -pi -e` instead of edit tool (prevents hash mismatch issues)

Note: Story in "ready-for-dev" status. User should run validate-create-story for quality check before executing dev-story.
