# Story 24.6: WCAG Color Contrast Fix

Status: backlog

## Story

As a **user with low vision or in bright environments**,
I want **all text and interactive elements to meet WCAG 2 AA minimum contrast ratios (4.5:1 for normal text, 3:1 for large text)**,
so that **the portfolio is legible and accessible regardless of theme or viewport**.

## Context

### Evidence (E2E Run 2026-02-17)

axe-core reports `[SERIOUS] color-contrast` violations across multiple audit dimensions:

| Audit | Scope | Violation |
|-------|-------|-----------|
| Route Audits | `/` (homepage) | color-contrast (SERIOUS) |
| Theme State | dark mode | color-contrast (SERIOUS) |
| Theme State | light mode | color-contrast (SERIOUS) |
| Viewport | tablet (768x1024) | color-contrast (SERIOUS) |

**axe rule**: [color-contrast](https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright)

### Current Behavior

- `accessibility.spec.ts` only **fails on CRITICAL** violations
- SERIOUS violations are logged as `console.warn` but **tests pass**
- This means color-contrast regressions are invisible in CI

### Prior Work

- Story 10-1 (`dark-mode-color-contrast`): Fixed dark mode contrast issues — marked done
- Current violations suggest either regression or gaps in 10-1 coverage (e.g., light mode, specific components)

## Acceptance Criteria

### AC1: Identify All Failing Elements

- [ ] Run axe-core audit on all 4 routes (`/`, `/about`, `/projects`, `/articles`)
- [ ] Run audit in both dark and light mode
- [ ] Run audit at mobile (375px), tablet (768px), desktop (1280px) viewports
- [ ] Produce element-level report: which elements fail, current ratio, required ratio

### AC2: Fix Color Contrast Violations

- [ ] All text elements meet 4.5:1 contrast ratio (normal text)
- [ ] All large text elements meet 3:1 contrast ratio
- [ ] All interactive elements (links, buttons) meet contrast requirements
- [ ] Fixes apply to both dark and light themes
- [ ] No visual regression — changes are minimal and targeted

### AC3: Promote SERIOUS to Failing in CI

- [ ] `accessibility.spec.ts` fails on SERIOUS violations (not just CRITICAL)
- [ ] Or: create a separate test that asserts `color-contrast` specifically has 0 violations
- [ ] CI catches future color-contrast regressions

### AC4: Verify Fix Across Dimensions

- [ ] 0 color-contrast violations on all 4 routes
- [ ] 0 color-contrast violations in dark mode
- [ ] 0 color-contrast violations in light mode
- [ ] 0 color-contrast violations at mobile, tablet, desktop viewports

## Technical Notes

- Theme colors defined in `tailwind.config.js`:
  - dark: `#1b1b1b`, light: `#f5f5f5`
  - primary: `#B63E96`, primaryDark: `#58E6D9`
- Check `primary` on `dark` background and `primaryDark` on `light` background — most likely culprits
- `AuthButton` disabled state uses `auth_button--disabled` class — verify contrast
- Slogan/subtitle text may use reduced opacity — common contrast offender

## Dependencies

- None (can be worked independently of 24-4 and 24-5)

## Estimation

- Investigation: 1 session (identify all failing elements)
- Fix: 1-2 sessions (CSS changes, likely in tailwind.config.js + component styles)
- Verification: included in fix session

## Change Log

| Date | Change |
|------|--------|
| 2026-02-17 | Story created from E2E a11y audit findings |
