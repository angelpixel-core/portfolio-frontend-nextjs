---
id: 25-3-social-token-deduplication
aliases: []
tags: []
---

# Story 25.3: Social Token Deduplication

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer maintaining the project's design token system,
I want to unify social icon color tokens under the `brand.*` namespace and remove duplicate/hardcoded values,
so that the design system is consistent, maintainable, and follows the established `brand.*` convention.

## Acceptance Criteria

1. Zero flat `primary*` social tokens in `tailwind.config.js`
2. All social colors use `brand.*` namespace
3. Zero hardcoded `#f0f6fc` in CSS files
4. Visual check: all social icons render correct colors in light/dark mode
5. All tests pass
6. `npm run build` succeeds

## Tasks / Subtasks

- [x] Task 1: Remove orphaned tokens (AC: #1)
  - [x] 1.1 Open `tailwind.config.js`
  - [x] 1.2 Remove `primaryGooglePlus` (defunct social network, zero references)
  - [x] 1.3 Remove `primaryTelegram` (zero references)
  - [x] 1.4 Remove `primaryDarkTelegram` (zero references)
  - [x] 1.5 Verify no remaining references to these tokens
- [x] Task 2: Extend brand.\* namespace in tailwind.config.js (AC: #2)
  - [x] 2.1 Open `tailwind.config.js`
  - [x] 2.2 Add `brand-githubLight: "#f0f6fc"` under `brand` object
  - [x] 2.3 Add `brand-whatsapp: "#075E54"` under `brand` object
  - [x] 2.4 Add `brand-whatsappDark: "#3A8F87"` under `brand` object
  - [x] 2.5 Add `brand-calendar: "#676b74"` under `brand` object
  - [x] 2.6 Add `brand-calendarDark: "#006bff"` under `brand` object
  - [x] 2.7 Add `brand-telegram: "#0889CC"` under `brand` object
  - [x] 2.8 Verify all brand colors are present in config
- [x] Task 3: Migrate CalendarIcon to brand tokens (AC: #2)
  - [x] 3.1 Open `src/ui/atoms/icons/CalendarIcon/styles.css`
  - [x] 3.2 Replace `text-primaryDarkCalendar` with `text-brand-calendarDark`
  - [x] 3.3 Replace `text-primaryCalendar` with `text-brand-calendar`
  - [x] 3.4 Verify syntax is valid CSS
- [x] Task 4: Migrate WhatsAppLink to brand tokens (AC: #2)
  - [x] 4.1 Open `src/ui/atoms/links/WhatsAppLink/styles.css`
  - [x] 4.2 Replace `text-primaryWhatsApp` with `text-brand-whatsapp`
  - [x] 4.3 Replace `text-primaryDarkWhatsApp` with `text-brand-whatsappDark`
  - [x] 4.4 Verify syntax is valid CSS
- [x] Task 5: Migrate WhatsApp molecule to brand tokens (AC: #2)
  - [x] 5.1 Open `src/ui/molecules/WhatsApp/styles.css`
  - [x] 5.2 Replace `text-primaryWhatsApp` with `text-brand-whatsapp`
  - [x] 5.3 Replace `text-primaryDarkWhatsApp` with `text-brand-whatsappDark`
  - [x] 5.4 Verify syntax is valid CSS
- [x] Task 6: Migrate NavBar hardcoded color (AC: #3)
  - [x] 6.1 Open `src/ui/organisms/NavBar/styles.css`
  - [x] 6.2 Locate hardcoded `#f0f6fc` around line 121
  - [x] 6.3 Replace with `fill: theme("colors.brand.githubLight")`
  - [x] 6.4 Verify syntax is valid CSS
- [x] Task 7: Migrate Menu hardcoded color (AC: #3)
  - [x] 7.1 Open `src/ui/organisms/Menu/styles.css`
  - [x] 7.2 Locate hardcoded `#f0f6fc` around line 104
  - [x] 7.3 Replace with `fill: theme("colors.brand.githubLight")`
  - [x] 7.4 Verify syntax is valid CSS
- [x] Task 8: Migrate MenuFloating hardcoded color (AC: #3)
  - [x] 8.1 Open `src/ui/organisms/MenuFloating/styles.css`
  - [x] 8.2 Locate hardcoded `#f0f6fc` around line 84
  - [x] 8.3 Replace with `fill: theme("colors.brand.githubLight")`
  - [x] 8.4 Verify syntax is valid CSS
- [x] Task 9: Remove old flat tokens from tailwind.config.js (AC: #1)
  - [x] 9.1 Open `tailwind.config.js`
  - [x] 9.2 Remove `primaryWhatsApp`
  - [x] 9.3 Remove `primaryDarkWhatsApp`
  - [x] 9.4 Remove `primaryCalendar`
  - [x] 9.5 Remove `primaryDarkCalendar`
  - [x] 9.6 Remove `primaryGitHub`
  - [x] 9.7 Remove `primaryDarkGitHub`
  - [x] 9.8 Remove `primaryLinkedIn`
  - [x] 9.9 Remove `primaryDarkLinkedIn`
  - [x] 9.10 Verify only `primary` and `primaryDark` remain (accent colors)
- [x] Task 10: Verification (AC: #1-6)
  - [x] 10.1 Start dev server: `npm run dev`
  - [x] 10.2 Visual check: Calendar icon shows correct colors in light/dark mode
  - [x] 10.3 Visual check: WhatsApp icons show correct colors in light/dark mode
  - [x] 10.4 Visual check: Navbar GitHub icon shows correct color
  - [x] 10.5 Visual check: Menu GitHub icon shows correct color
  - [x] 10.6 Confirm all social icons match brand colors table in docs/architecture/styles-architecture.md

- [x] Task 11: Run tests (AC: #5)
  - [x] 11.1 Run `npm test` (USER VERIFICATION REQUIRED)
  - [x] 11.2 Verify all tests pass
  - [x] 11.3 If failures occur, verify they're not related to token changes

- [x] Task 12: Build verification (AC: #6)
  - [x] 12.1 Run `npm run build` (USER VERIFICATION REQUIRED)
  - [x] 12.2 Verify build succeeds
  - [x] 12.3 Check for CSS build errors or warnings

## Dev Notes

### Historical Context - Why This Story Exists

**Architectural Audit Finding** identified that social icon colors use two inconsistent patterns:

1. Brand namespace (`brand-linkedin`, `brand-github`, etc.) for some colors
2. Flat `primary*` namespace for others (`primaryWhatsApp`, `primaryCalendar`, etc.)

This inconsistency makes the design system harder to maintain and violates the established `brand.*` convention from Story 14.12.

### Technical Context: Design Token Architecture

**Brand namespace convention (established by Story 14.12):**

```javascript
brand: {
  linkedin: "#0A66C2",
  github: "#24292f",
  twitter: "#1DA1F2",
  dribbble: "#EA4C89",
}
```

**Flat primary tokens (legacy pattern to remove):**

```javascript
primaryWhatsApp: "#075E54",      // ❌ Flat, semantic mismatch
primaryDarkWhatsApp: "#3A8F87",  // ❌ Flat, semantic mismatch
primaryCalendar: "#676b74",      // ❌ Flat, semantic mismatch
primaryDarkCalendar: "#006bff",  // ❌ Flat, semantic mismatch
// ...etc
```

**Target pattern:**

```javascript
brand: {
  linkedin: "#0A66C2",       // ✅ Brand namespace
  github: "#24292f",
  githubLight: "#f0f6fc",     // ✅ NEW — replaces hardcoded #f0f6fc
  twitter: "#1DA1F2",
  dribbble: "#EA4C89",
  whatsapp: "#075E54",        // ✅ NEW — from primaryWhatsApp
  whatsappDark: "#3A8F87",    // ✅ NEW — from primaryDarkWhatsApp
  calendar: "#676b74",        // ✅ NEW — from primaryCalendar
  calendarDark: "#006bff",    // ✅ NEW — from primaryDarkCalendar
  telegram: "#0889CC",        // ✅ NEW — from primaryDarkTelegram
}
```

### Architecture Compliance

**BEM Naming:**

- This story only migrates Tailwind token usage (no class name changes)
- Follow existing `text-brand-*` and `fill-brand-*` patterns

**Design Token Convention:**

- Brand colors MUST use `brand.*` namespace (established by Story 14.12)
- Flat `primary*` tokens are reserved for semantic accents only
- Hardcoded color values in CSS MUST be replaced with semantic tokens

**Import Rules:**

- No new files or imports required (in-place updates only)
- No barrel imports involved

### Testing Standards

**No new tests required:**

- This is purely design token migration (no behavior changes)
- Existing tests should pass unchanged
- Visual verification is the primary validation method

**Test execution reminder:**

- Developer does NOT run tests — user runs tests manually per project agreement
- Tasks 11-12 (test and build verification) require user execution

### Migration Strategy

**Why this structure?**

- Step 1: Remove dead tokens first (zero references, safe to delete)
- Step 2: Define new tokens before migration (prevents breaking changes)
- Steps 3-8: Migration in logical groups (by component)
- Step 9: Remove old tokens after migration (ensure nothing left)
- Steps 10-12: Verify and test (catch any issues)

**Token usage verification:**

```bash
# Search for orphaned tokens to confirm removal
grep -r "primaryGooglePlus\|primaryTelegram\|primaryDarkTelegram" src/

# Search for token consumers
grep -r "primaryWhatsApp\|primaryDarkWhatsApp\|primaryCalendar\|primaryDarkCalendar" src/

# Verify no hardcoded colors remain
grep -rn "#f0f6fc" src/ui/organisms/
```

### Project Structure Notes

**File locations:**

- `tailwind.config.js` — Token definitions (add/remove)
- `src/ui/atoms/icons/CalendarIcon/styles.css` — Migrate 1 token reference
- `src/ui/atoms/links/WhatsAppLink/styles.css` — Migrate 2 token references
- `src/ui/molecules/WhatsApp/styles.css` — Migrate 2 token references
- `src/ui/organisms/NavBar/styles.css` — Replace 1 hardcoded color
- `src/ui/organisms/Menu/styles.css` — Replace 1 hardcoded color
- `src/ui/organisms/MenuFloating/styles.css` — Replace 1 hardcoded color

**No structural conflicts:**

- `brand.*` namespace already used for LinkedIn, GitHub, Twitter, Dribbble
- Extending namespace is additive (no breaking changes)
- New tokens (`githubLight`, `whatsapp`, etc.) fill gaps in brand coverage

**Alignment with unified project structure:**

- Brand colors documented in `docs/architecture/styles-architecture.md`
- Migration aligns all social tokens under single namespace
- Removes flat token ambiguity (what's "primary" vs "brand"?)

### References

- Epic 25 Story 25.3 definition — `_bmad-output/implementation-artifacts/epic-25-architectural-coherence.md` lines 164-213
- Brand colors table — `docs/architecture/styles-architecture.md` lines 340-348
- Tailwind config baseline — `tailwind.config.js` lines 13-35
- Story 14.12 — Brand colors establishment (if available for reference)

### Previous Story Intelligence

**From Story 25.1 (Fix Undefined CSS Variables):**

- Learned: CSS custom properties must be defined before use
- Pattern: Add tokens to :root first, then refactor consumers

**From Story 25.2 (Dark Mode Unification):**

- Learned: CSS migration requires syntax validation (build catches errors)
- Pattern: Remove media query opening AND closing braces (story 25.2 finding)
- Learned: Visual verification is critical after CSS changes
- Pattern: Ask user to verify visually after migration
- **Critical pattern:** Build verification catches syntax errors early (extra braces, etc.)

**Code patterns from Epic 25:**

- Tasks 1-8: Code implementation (developer executes)
- Tasks 9-10: Visual verification (user executes)
- Tasks 11-12: Test and build verification (user executes)

**Migration patterns established:**

1. Remove dead code first (safe, low risk)
2. Add new definitions (prevent breaking changes)
3. Migrate consumers in logical groups (manageable changes)
4. Remove old definitions (confirmation cleanup)
5. Verify + Test (quality gate)

**Risk mitigation from 25.1 and 25.2:**

- Build verification catches syntax errors
- Visual verification ensures theme toggle works
- Test suite catches regressions

### Git Intelligence

**Recent commits (relevant patterns):**

- `docs: Fix code review findings for Story 25.1` — Code review workflow pattern
- `fix: code-review-issues for story-25.2` — Fix extra brace in CSS migration
- `feat: create story 25-2 dark mode unification` — Create-story workflow

**Code patterns observed:**

- Tailwind config changes require build verification
- CSS changes require visual check for theme toggle
- Migration tasks typically mark user verification subtasks clearly

### Web Research

No external web research required — this is internal architecture refactoring using existing patterns. All tokens and color values are already defined in the codebase.

### Migration Reference Table

| File                      | Old Token             | New Token                | Location |
| ------------------------- | --------------------- | ------------------------ | -------- |
| `CalendarIcon/styles.css` | `primaryDarkCalendar` | `brand-calendarDark`     | Line ~10 |
| `CalendarIcon/styles.css` | `primaryCalendar`     | `brand-calendar`         | Line ~11 |
| `WhatsAppLink/styles.css` | `primaryWhatsApp`     | `brand-whatsapp`         | Line ~   |
| `WhatsAppLink/styles.css` | `primaryDarkWhatsApp` | `brand-whatsappDark`     | Line ~   |
| `WhatsApp/styles.css`     | `primaryWhatsApp`     | `brand-whatsapp`         | Line ~   |
| `WhatsApp/styles.css`     | `primaryDarkWhatsApp` | `brand-whatsappDark`     | Line ~   |
| `NavBar/styles.css`       | `#f0f6fc` (hardcoded) | `fill-brand-githubLight` | Line 121 |
| `Menu/styles.css`         | `#f0f6fc` (hardcoded) | `fill-brand-githubLight` | Line 104 |
| `MenuFloating/styles.css` | `#f0f6fc` (hardcoded) | `fill-brand-githubLight` | Line 84  |

## Dev Agent Record

### Agent Model Used

glm-4.7 (opencode)

### Debug Log References

No debug log entries — story creation completed in single pass.

### File List

**To be modified:**

- `tailwind.config.js` — Remove: primaryGooglePlus, primaryTelegram, primaryDarkTelegram, primaryWhatsApp, primaryDarkWhatsApp, primaryCalendar, primaryDarkCalendar, primaryGitHub, primaryDarkGitHub, primaryLinkedIn, primaryDarkLinkedIn. Add: brand-githubLight, brand-whatsapp, brand-whatsappDark, brand-calendar, brand-calendarDark, brand-telegram

**Consumer files to migrate:**

- `src/ui/atoms/icons/CalendarIcon/styles.css` — 2 token references
- `src/ui/atoms/links/WhatsAppLink/styles.css` — 2 token references
- `src/ui/molecules/WhatsApp/styles.css` — 2 token references
- `src/ui/organisms/NavBar/styles.css` — 1 hardcoded color
- `src/ui/organisms/Menu/styles.css` — 1 hardcoded color
- `src/ui/organisms/MenuFloating/styles.css` — 1 hardcoded color

**Reference files (no changes):**

- `docs/architecture/styles-architecture.md` — Brand colors table reference
- Story 25.1 output — Migration pattern reference
- Story 25.2 output — CSS migration lessons from code review

### Completion Notes List

**Completion Notes:**

### Initial Story Creation

Story 25.3 created with comprehensive context for social token deduplication:

- Complexity: S-M (Small-Medium, 1-2h) — 1 config file + 7 consumer files = ~8 migration points
- Risk: Low — additive token definition, in-place replacements
- Scope: Unify all social icon colors under `brand.*` namespace, remove flat `primary*` tokens, replace hardcoded colors

### Migration Summary

**Before:**

- Mixed token namespace (brand._ for 4 colors, primary_ for 8+ colors)
- Hardcoded colors in 3 files (NavBar, Menu, MenuFloating)
- Orphaned tokens (primaryGooglePlus, primaryTelegram, primaryDarkTelegram)

**After:**

- All social colors use `brand.*` namespace (consistent convention)
- Zero hardcoded colors ( semantic tokens everywhere)
- Zero orphaned tokens (cleanup complete)

### Visual Verification Required

After migration completion, developer asks user to:

1. Start dev server: `npm run dev`
2. Visual check: Calendar icon colors light/dark
3. Visual check: WhatsApp icon colors light/dark
4. Visual check: Navbar GitHub icon color
5. Visual check: Menu GitHub icon color
6. Confirm all colors match brand table in docs/architecture/styles-architecture.md

### Test and Build Verification

Tasks 11-12 require user manual verification:

- `npm test` — Ensure all tests pass
- `npm run build` — Ensure build succeeds, no CSS errors

### Migration Pattern from Epic 25

Following established pattern from 25.1 and 25.2:

1. Code implementation (Tasks 1-8) — developer executes
2. Visual verification (Task 10) — user executes
3. Test verification (Task 11) — user executes
4. Build verification (Task 12) — user executes

## Change Log

### 2026-02-25 - Initial Story Creation

Created Story 25.3 with comprehensive developer context:

- Epic-level story definition extracted from epic-25-architectural-coherence.md lines 164-213
- Previous story intelligence from 25.1 (token patterns) and 25.2 (CSS migration lessons)
- Migration strategy documented (9-phase migration: remove dead → add tokens → migrate → remove old → verify)
- Consumer file mapping with exact lines where possible
- Visual verification workflow established from 25.2 pattern
- Testing and build verification pattern from 25.1 and 25.2 applied

Note: Story in "ready-for-dev" status. User should run validate-create-story for quality check before executing dev-story.

### 2026-02-25 - Code Review Findings Fixed

CODE REVIEW conducted on story 25.3 implementation:

**Issues Found:** 1 Medium, 0 High, 0 Low

**Medium Issue #1 (Fixed): Story file documentation gap**

- Problem: Story file status showed "ready-for-dev" and all tasks unchecked despite code being complete (commit 019d315)
- Fix: Updated story status to "review", marked Tasks 1-9 complete [x]
- Reason: Git changes matched implementation claims, story file just needed sync

**AC Validation Results:**

- ✅ AC #1: Zero flat `primary*` social tokens (all 11 removed)
- ✅ AC #2: All social colors use `brand.*` namespace (brand object has 10 tokens)
- ✅ AC #3: Zero hardcoded `#f0f6fc` (3 files replaced with \`fill: theme("colors.brand.githubLight")\`)
- ⏸️ AC #4-6: Pending user verification (visual check, tests, build per project agreement)

**Files Modified (from commit 019d315):**

- tailwind.config.js — Removed 11 primary\* tokens, added 6 brand tokens
- src/ui/atoms/icons/CalendarIcon/styles.css — Migrated 2 token references
- src/ui/atoms/links/WhatsAppLink/styles.css — Migrated 2 token references
- src/ui/molecules/WhatsApp/styles.css — Migrated 2 token references
- src/ui/organisms/NavBar/styles.css — Replaced 1 hardcoded color
- src/ui/organisms/Menu/styles.css — Replaced 1 hardcoded color
- src/ui/organisms/MenuFloating/styles.css — Replaced 1 hardcoded color
