---
id: 25-2-dark-mode-unification
aliases: []
tags: []
---

# Story 25.2: Dark Mode Unification

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to unify the dark mode mechanism to use `.dark` class pattern throughout the codebase,
so that theme toggle is consistent and predictable across all components.

## Acceptance Criteria

1. Zero `[data-theme="dark"]` selectors in codebase (excl. WordCloud)
2. Zero `prefers-color-scheme: dark` in codebase (excl. WordCloud)
3. Theme toggle works correctly for CustomersSlider logos
4. Skip-link and focus-ring respect theme toggle
5. Coming-soon page respects theme toggle
6. All tests pass

## Tasks / Subtasks

- [ ] Task 1: Migrate CustomersSlider from `[data-theme="dark"]` to `.dark` class pattern (AC: #1, #3)
  - [ ] 1.1 Open `src/ui/molecules/CustomersSlider/styles.css`
  - [ ] 1.2 Identify all `:root[data-theme="dark"]` selectors (2 rules)
  - [ ] 1.3 Replace with `.dark .class` pattern
  - [ ] 1.4 Verify syntax is valid CSS
  - [ ] 1.5 Check customer logo visibility in light/dark mode

- [ ] Task 2: Migrate globals.css skip-link and focus-ring from `prefers-color-scheme: dark` to `.dark` class (AC: #1, #4)
  - [ ] 2.1 Open `src/styles/globals.css`
  - [ ] 2.2 Identify `@media (prefers-color-scheme: dark)` selectors (5 rules for skip-link + focus-ring)
  - [ ] 2.3 Replace dark overrides with `.dark .class` pattern
  - [ ] 2.4 Keep light mode as default (no `.dark` class)
  - [ ] 2.5 Verify skip-link and focus-ring colors work in both modes

- [ ] Task 3: Migrate coming-soon page from `prefers-color-scheme: dark` to `.dark` class (AC: #1, #5)
  - [ ] 3.1 Open `src/app/coming-soon/styles.css`
  - [ ] 3.2 Identify `@media (prefers-color-scheme: dark)` selectors (9 rules)
  - [ ] 3.3 Replace with `.dark .class` pattern
  - [ ] 3.4 Verify coming-soon text and links visible in both modes

- [ ] Task 4: Verification (AC: #1-6)
  - [ ] 4.1 Start dev server: `npm run dev`
  - [ ] 4.2 Test theme toggle: `Ctrl/Cmd + Shift + D` to toggle dark mode
  - [ ] 4.3 Verify CustomersSlider logos show correct colors in both modes
  - [ ] 4.4 Verify skip-link colors respect theme toggle
  - [ ] 4.5 Verify coming-soon page respects theme toggle
  - [ ] 4.6 Visual spot-check for any broken colors in dark mode

- [ ] Task 5: Run tests (AC: #6)
  - [ ] 5.1 Run `npm test` (USER VERIFICATION REQUIRED)
  - [ ] 5.2 Verify all tests pass
  - [ ] 5.3 If failures occur, verify they're not related to CSS changes

- [ ] Task 6: Build verification (AC: #6)
  - [ ] 6.1 Run `npm run build` (USER VERIFICATION REQUIRED)
  - [ ] 6.2 Verify build succeeds
  - [ ] 6.3 Check for CSS build errors or warnings

## Dev Notes

### Historical Context - Why This Story Exists

**Finding #2 from Architectural Audit 2026-02-17** identified that 3 files use incorrect dark mode mechanisms (`[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`) instead of the standard `.dark` class pattern. This causes inconsistency where some components don't respect the theme toggle.

**Audit Finding 2.2 (4 mechanisms, only `.dark` class is correct):**

Story 25-0 ADR-012 established `.dark` class as the ONLY correct dark mode mechanism. Other mechanisms produce unexpected behavior:

- `[data-theme="dark"]` - Doesn't work if element doesn't have the attribute
- `@media (prefers-color-scheme: dark)` - Responds to system preference, not app toggle
- `:root.dark` (WordCloud only) - Correct but component-specific, not global

**Files affected (before fix):**

- `src/ui/molecules/CustomersSlider/styles.css` — 2 rules with `[data-theme="dark"]`
- `src/styles/globals.css` — 5 rules with `@media (prefers-color-scheme: dark)` (skip-link + focus-ring)
- `src/app/coming-soon/styles.css` — 9 rules with `@media (prefers-color-scheme: dark)`

### Technical Context: Dark Mode Mechanisms

**The `.dark` class pattern (established standard):**

```css
/* Light mode default */
.class-name {
  color: var(--dark);
}

.dark .class-name {
  color: var(--light);
}
```

**Why other mechanisms don't work:**

- **`@media (prefers-color-scheme: dark)`**: Responds to SYSTEM setting, not app theme toggle
  - User toggles theme in UI → nothing changes if system preference differs
  - Cannot be controlled by application state

- **`[data-theme="dark"]`**: Attribute selector on root or parent
  - Only works if the specific DOM element has `data-theme="dark"` attribute
  - Inconsistent with `.dark` class pattern used everywhere else
  - Causes theme toggle to fail silently

- **`:root.dark` (WordCloud special case)**: Works but is:
  - Component-specific implementation
  - Not the project standard
  - Explicitly excluded from this story (maintain as-is)

**Theme toggle works by**:

1. User clicks theme toggle button (NavBar)
2. Redux updates `themeMode` state (dark/light)
3. `index.tsx` root applies `.dark` class to `body` when dark is active
4. All `.dark .class` selectors activate with dark mode colors

### Architecture Compliance

**BEM Naming:**

- Follow `block__element--modifier` convention
- Story 25-0 ADR-012 established this as the standard
- This story only dark mode class migration (no class renaming)

**Dark Mode Convention (ADR-012):**

- `.dark` class is the ONLY correct mechanism
- Must be applied at document root level (`body` from index.tsx)
- Components use `.dark .class` for dark mode overrides
- EXCLUDED: WordCloud `:root.dark` pattern (component-specific)

**Breakpoint System:**

- Not relevant to this story (dark mode not responsive)

**Import Rules:**

- No import changes required (CSS files modified in place)
- No barrel imports involved

### Testing Standards

**No new tests required:**

- This is purely CSS migration (no behavior changes)
- Existing tests should pass unchanged
- Visual verification is the primary validation method

**Test execution reminder:**

- Developer does NOT run tests — user runs tests manually per project agreement
- Tasks 5-6 (test and build verification) require user execution
- Developer asks user to execute test verification after migration complete

**Why NOT WordCloud:**

- WordCloud uses `:root.dark` which is CORRECT for that component
- WordCloud has special dark mode logic (SVG fill color transitions)
- Documented in Story 25-0 as EXCLUDED from Epic 25 scope
- Migration path would be complex and risk breaking component

### Project Structure Notes

**File locations:**

- `src/ui/molecules/CustomersSlider/styles.css` — Migrate 2 rules
- `src/styles/globals.css` — Migrate 5 rules (skip-link + focus-ring)
- `src/app/coming-soon/styles.css` — Migrate 9 rules

**No structural conflicts:**

- `.dark` class pattern is already used throughout codebase
- Theme toggle already adds `.dark` class to root
- No new files or structural changes needed

**Alignment with unified project structure:**

- Story 25-0 ADR-012 established `.dark` class as standard
- This story enforces that standard across all files (except WordCloud)
- No structural variances detected

### References

- Audit Finding #2: Dark mode mechanisms — `_bmad-output/implementation-artifacts/architectural-audit-2026-02-17.md` lines 89-98
- Epic 25 Story 25.2 definition: `_bmad-output/implementation-artifacts/epic-25-architectural-coherence.md` lines 137-162
- ADR-012: BEM naming + `.dark` class pattern — Story 25-0 output
- Tailwind theme colors: `tailwind.config.js` lines 82-85 (source of `--dark`, `--light`)

### Previous Story Intelligence

**From Story 25.1 (Fix Undefined CSS Variables):**

- Added CSS custom properties to `:root` (`--dark`, `--light`, `--primary`, `--primaryDark`)
- Confirmed `.dark` class is the correct dark mode mechanism
- Lesson: Visual verification is critical after CSS changes
- Pattern: Ask user to verify visually after migration

**Code patterns:**

- ADR-011 established breakpoint tokenization (not used in this story)
- ADR-012 established BEM naming convention (not used in this story)
- Previous migration pattern (Story 25.1) was additive only (zero regression risk)
- This story is migration (replacing selectors) - slightly higher risk

**Development workflow:**

- Story 25.1 showed: After code changes → visual check → ask user to run tests
- Apply same pattern here (Task 4: visual spot-check)

**Risk mitigation from 25.1:**

- Visual verification task validates migration success
- Test suite catches any regressions
- Build verification ensures no syntax errors

### Migration Strategy

**Why 3 files only?**

- Comprehensive audit confirmed only these files use incorrect mechanisms
- `[data-theme="dark"]` search: Only CustomersSlider (2 selectors)
- `@media prefers-color-scheme: dark` search: Only globals.css (5 selectors) + coming-soon (9 selectors)
- Other components already use `.dark` class pattern

**Verification approach:**

- No automated verification possible (requires browser interaction)
- Developer documents steps → User executes them
- Visual spot-check ensures theme toggle actually works

**If theme toggle fails:**

- Check if `.dark` class is being applied to `body` (index.tsx)
- Verify Redux state updates correctly
- Check browser DevTools for `.dark` class presence
- Review migrated selectors for syntax errors

## Dev Agent Record

### Agent Model Used

glm-4.7 (opencode)

### Debug Log References

No debug log entries — story creation completed in single pass.

### File List

**To be modified:**

- `src/ui/molecules/CustomersSlider/styles.css` — Migrate 2 rules from `[data-theme="dark"]` to `.dark .class`
- `src/styles/globals.css` — Migrate 5 rules from `@media (prefers-color-scheme: dark)` to `.dark .class`
- `src/app/coming-soon/styles.css` — Migrate 9 rules from `@media (prefers-color-scheme: dark)` to `.dark .class`

**Reference files (no changes):**

- `tailwind.config.js` — Source of theme colors (not modified)
- Story 25.1 output — Reference for previous migration pattern
- Story 25.0 ADR-012 — Dark mode convention decisions

### Completion Notes List

**Completion Notes:**

### Initial Story Creation

Story 25.2 created with comprehensive context for dark mode unification:

- Complexity: S (Small, <1h) — 3 files, 16 rules total
- Risk: Low — selector migration, no new code
- Scope: Enforce `.dark` class pattern as only dark mode mechanism
- Excluded: WordCloud `:root.dark` pattern (component-specific correctness)

### Migration Summary

**Before:**

- CustomersSlider: `[data-theme="dark"]` (2 rules)
- globals.css: `@media (prefers-color-scheme: dark)` (5 rules for skip-link + focus-ring)
- coming-soon: `@media (prefers-color-scheme: dark)` (9 rules)

**After:**

- All migrated to `.dark .class` pattern
- Theme toggle now works consistently across all components
- Zero system-dependent overrides remaining

### Visual Verification Required

After migration completion, developer asks user to:

1. Start dev server: `npm run dev`
2. Toggle theme: `Ctrl/Cmd + Shift + D`
3. Verify CustomersSlider logo colors
4. Verify skip-link and focus-ring colors
5. Verify coming-soon page text and links

### Test and Build Verification

Tasks 5-6 require user manual verification:

- `npm test` — Ensure all 1110 tests pass
- `npm run build` — Ensure build succeeds without errors

## Change Log

### 2026-02-24 - Initial Story Creation

Created Story 25.2 with comprehensive developer context:

- Epic-level story definition extracted from epic-25-architectural-coherence.md
- Previous story intelligence from 25.1 (CSS custom properties fix)
- Migration strategy documented (3 files, 16 rules)
- Acceptance criteria aligned with epic requirements
- Visual verification workflow established
- Testing and build verification pattern from 25.1 applied

Note: Story in "ready-for-dev" status. User should run validate-create-story for quality check before executing dev-story.
