# Story 10.1: Dark Mode Color Contrast

## Story

**As a** user with visual impairments,
**I want** sufficient color contrast in dark mode,
**So that** I can read all content comfortably.

## Status

- **Epic:** 10 - Runtime & UX Polish
- **Sprint Status:** done
- **Priority:** SERIOUS (Accessibility)
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Zero Color-Contrast Violations

**Given** the site is in dark mode
**When** axe-core accessibility audit runs
**Then** zero color-contrast violations are reported
**And** all text meets WCAG 2 AA minimum ratio (4.5:1 for normal text, 3:1 for large text)

### AC2: Visual Readability

**Given** I visually inspect dark mode
**When** I read text content
**Then** text is clearly readable against backgrounds

### AC3: E2E Test Passes Without Warnings

**Given** I run `npm run test:e2e -- --grep "dark mode"`
**When** the test completes
**Then** zero "SERIOUS" violations are logged
**And** the console shows no color-contrast warnings

## Tasks / Subtasks

### Task 1: Identify Failing Elements (AC1) ✅

- [x] 1.1 Run E2E test with verbose violation output
- [x] 1.2 Capture specific elements failing contrast check
- [x] 1.3 Document current contrast ratios vs required ratios
- [x] 1.4 Prioritize fixes by visibility/impact

**Findings:**
- `.hero-image` (ImageLinkSkeleton): `#000000` on `#1b1b1b` = 1.21:1 ratio
- `p.paragraph` (ParagraphText loading): `#000000` on `#1b1b1b` = 1.21:1 ratio
- Both elements lacked explicit text color, defaulting to browser black

### Task 2: Analyze Current Dark Mode Colors (AC1, AC2) ✅

- [x] 2.1 Audit `tailwind.config.js` color definitions
- [x] 2.2 Audit CSS files using `.dark` class selectors
- [x] 2.3 Identify text/background color combinations with low contrast
- [x] 2.4 Calculate contrast ratios using WebAIM contrast checker

**Root Cause:**
- Components rendered during loading state (skeletons) didn't inherit dark mode colors
- Parent container `.main_home-container` has `text-dark dark:text-light` but not inherited by loading states

### Task 3: Fix Color Contrast Issues (AC1, AC2) ✅

- [x] 3.1 Adjust problematic colors in Tailwind config or CSS
- [x] 3.2 Ensure fixes maintain visual design intent
- [x] 3.3 Test fixes visually in dark mode
- [x] 3.4 Verify no regressions in light mode

**Files Modified:**
- `src/ui/atoms/texts/ParagraphText/styles.css`: Added `text-dark dark:text-light`
- `src/ui/molecules/Hero/styles.css`: Added `text-dark dark:text-light`

### Task 4: Validate Fixes (AC1, AC3) ✅

- [x] 4.1 Run `npm run test:e2e -- --grep "dark mode"`
- [x] 4.2 Verify zero SERIOUS violations in console
- [x] 4.3 Run full a11y test suite to check for regressions
- [x] 4.4 Visual spot-check across key pages

**Results:**
```
=== Accessibility Audit Summary ===
✅ /: 0 violations (0 critical, 0 serious)
✅ /about: 0 violations (0 critical, 0 serious)
✅ /projects: 0 violations (0 critical, 0 serious)
✅ /articles: 0 violations (0 critical, 0 serious)
===================================
9 passed (14.0s)
```

## Dev Notes

### Technical Context

- **Debt Origin:** axe-core E2E audit in `e2e/accessibility.spec.ts:66`
- **Test Location:** `e2e/accessibility.spec.ts` - "dark mode is accessible"
- **Current Status:** ✅ RESOLVED - All tests pass with zero violations

### Original Evidence (Pre-Fix)

```
Serious a11y violations in dark mode (should fix soon):
 [SERIOUS] color-contrast: Ensure the contrast between foreground and
 background colors meets WCAG 2 AA minimum contrast ratio thresholds
```

### Post-Fix Verification

```
=== Accessibility Audit Summary ===
✅ /: 0 violations (0 critical, 0 serious)
✅ /about: 0 violations (0 critical, 0 serious)
✅ /projects: 0 violations (0 critical, 0 serious)
✅ /articles: 0 violations (0 critical, 0 serious)
===================================
9 passed
```

### Dark Mode Implementation

**Method:** Tailwind CSS with `darkMode: "class"` (uses `.dark` class on `<html>`)

**Primary Colors (tailwind.config.js):**

| Variable | Value | Usage |
|----------|-------|-------|
| `dark` | `#1b1b1b` | Dark background |
| `light` | `#f5f5f5` | Light text in dark mode |
| `primary` | `#B63E96` | Accent (light mode) |
| `primaryDark` | `#58E6D9` | Accent (dark mode) |

**Contrast Calculation:**
- `#f5f5f5` on `#1b1b1b` = 12.6:1 ✅ (exceeds 4.5:1)
- `#58E6D9` on `#1b1b1b` = 10.8:1 ✅ (exceeds 4.5:1)

The primary colors should pass. The issue is likely in **secondary/muted colors** used somewhere in the UI.

### Files to Investigate

```
Primary:
├── tailwind.config.js                    # Color definitions
├── src/styles/globals.css                # Global dark mode styles

Component CSS (use .dark selectors):
├── src/ui/organisms/ArticleContent/styles.css
├── src/ui/molecules/SocialShareButtons/styles.css
├── src/ui/atoms/buttons/CopyButton/styles.css
├── src/ui/atoms/buttons/ThemeButton/styles.css
└── src/app/coming-soon/styles.css
```

### Testing Commands

```bash
# Run dark mode a11y test
npm run test:e2e -- --grep "dark mode"

# Run with debug to see detailed violations
DEBUG=pw:api npm run test:e2e -- --grep "dark mode"

# Run full a11y suite
npm run test:e2e -- --grep "Accessibility"
```

### WCAG 2 AA Requirements

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text (<18pt) | 4.5:1 |
| Large text (≥18pt or ≥14pt bold) | 3:1 |
| UI components & graphics | 3:1 |

### Contrast Checker Tools

- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools: Elements → Styles → Color picker shows contrast ratio
- axe DevTools browser extension

### Scope Boundaries

Per Epic 10 definition:
- This story fixes color contrast ONLY
- NO new features or UI changes beyond color adjustments
- Maintain visual design intent while meeting WCAG

### Previous Story Intelligence

From Epic 8-9:
- Scope discipline was key to closure
- A11y tests are authoritative (accessibility.spec.ts)
- Pattern: fix specific issues, don't over-engineer

### Dependencies

- **Blocks:** None
- **Blocked by:** None
- **Related:** Story 8.2 (WCAG 2.2 coverage), Story 7.1 (a11y testing infra)

## Project Structure Notes

### Files Likely to Modify

```
src/
├── styles/
│   └── globals.css         # If global dark mode colors need adjustment
└── ui/
    └── [component]/
        └── styles.css      # Component-specific dark mode colors

tailwind.config.js          # If Tailwind color definitions need adjustment
```

### Test Files (Validation)

```
e2e/
├── accessibility.spec.ts   # Primary validation - dark mode test
└── utils/
    └── accessibility.ts    # checkA11y, filterSeriousViolations
```

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| 10.1 | Color contrast in dark mode | axe-core E2E audit | Adjust CSS colors to meet 4.5:1 ratio |

### Architecture Alignment

- **A11y Standards:** WCAG 2 AA compliance required
- **Testing:** axe-core via @axe-core/playwright
- **Pattern:** Dark mode via Tailwind `darkMode: "class"`

### Existing Code References

- `e2e/accessibility.spec.ts:66-99` - Dark mode accessibility test
- `e2e/utils/accessibility.ts` - a11y utility functions
- `tailwind.config.js:13-28` - Color definitions

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-27 |
| Story Author | Workflow: create-story |
| Epic | 10 - Runtime & UX Polish |
| Debt Origin | axe-core E2E audit |
| Implementation Date | 2026-01-27 |
| Implementation Method | TDD (RED-GREEN-REFACTOR) |

### File List

**Source Files Modified:**
- `src/ui/atoms/texts/ParagraphText/styles.css` - Added `text-dark dark:text-light`
- `src/ui/molecules/Hero/styles.css` - Added `text-dark dark:text-light`

**Test Files (temporary, removed after validation):**
- `e2e/dark-mode-contrast-debug.spec.ts` - Debug test for violation identification (deleted)

**Documentation Updated:**
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `_bmad-output/implementation-artifacts/technical-debt-backlog.md`

### Commits

| Hash | Phase | Description |
|------|-------|-------------|
| `66c90d7` | RED | Debug test to identify failing elements |
| `9b9635d` | GREEN | CSS fixes for contrast compliance |
| `4f36cfe` | REFACTOR | Remove temporary debug test |
| `26e1f2d` | DOCS | Complete story documentation |

### Code Review Notes

**Potential Future Debt (not in scope):**
- `src/ui/shared/skeletons/skeletons.jsx` contains skeletons with inline text that lack explicit color classes. Not detected by axe-core in current tests but could be affected if rendered in different contexts.
- Typo in class name `.ligthning` (should be `.lightning`) in `src/app/styles.css:96` - cosmetic, not blocking.

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-27 | Story created via create-story workflow |
| 2026-01-27 | TDD implementation: RED (debug test), GREEN (CSS fixes), REFACTOR (cleanup) |
| 2026-01-27 | All tasks completed, moved to review |
| 2026-01-27 | Code review passed, added File List and commits, moved to done |
