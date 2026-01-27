# Story 10.3: Font Preload Optimization

## Story

**As a** performance-conscious developer,
**I want** fonts to load efficiently without console warnings,
**So that** the site performs optimally and console stays clean.

## Status

- **Epic:** 10 - Runtime & UX Polish
- **Sprint Status:** ready-for-dev
- **Priority:** LOW (Console Warning)
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Zero Preload Warnings

**Given** the site loads
**When** I check browser console
**Then** zero "preloaded with link preload was not used" warnings appear

### AC2: Efficient Font Loading

**Given** fonts are needed
**When** they load
**Then** they load on first use without blocking render
**And** no FOUT (Flash of Unstyled Text) occurs

### AC3: Performance Maintained

**Given** I run Lighthouse audit
**When** the audit completes
**Then** Performance score remains ≥90
**And** LCP is not negatively impacted

## Tasks / Subtasks

### Task 1: Diagnose Font Preload Issue (AC1)

- [ ] 1.1 Run dev server and reproduce console warning
- [ ] 1.2 Identify which font file triggers the warning (904be59b21bd51cb-s.p.woff2)
- [ ] 1.3 Verify the font is from Montserrat (next/font/google)
- [ ] 1.4 Document root cause

### Task 2: Analyze Current Font Configuration (AC1, AC2)

- [ ] 2.1 Review `src/app/layout.jsx` Montserrat configuration
- [ ] 2.2 Check if `display: 'swap'` is configured
- [ ] 2.3 Verify subsets configuration (currently `["latin"]`)
- [ ] 2.4 Check if preload is being triggered unnecessarily

### Task 3: Apply Fix (AC1, AC2)

- [ ] 3.1 Add `display: 'swap'` to Montserrat config if missing
- [ ] 3.2 Consider adding `preload: false` if font not critical for above-fold
- [ ] 3.3 Or optimize which font weights/styles are loaded
- [ ] 3.4 Verify fix resolves console warning

### Task 4: Validate Performance (AC3)

- [ ] 4.1 Run `npm run build && npm run start`
- [ ] 4.2 Check console for zero font warnings
- [ ] 4.3 Run Lighthouse audit and verify Performance ≥90
- [ ] 4.4 Verify no FOUT occurs during page load

## Dev Notes

### Technical Context

- **Debt Origin:** Browser console warning during runtime
- **File:** `src/app/layout.jsx` (line 30-33)
- **Current Status:** Warning logged but site functions normally

### Current Evidence

```
The resource at "http://localhost:9000/_next/static/media/904be59b21bd51cb-s.p.woff2"
preloaded with link preload was not used within a few seconds.
```

### Root Cause Analysis

The Montserrat font from `next/font/google` is being preloaded by Next.js, but the preloaded variant may not be used immediately. Possible causes:

1. **Missing `display: 'swap'`** - Without this, the font may load differently
2. **Unused font weights** - Preloading a weight that's not used above-fold
3. **Timing issue** - Font preload happens but component using it renders later

### Current Font Configuration (layout.jsx:30-33)

```javascript
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});
```

### Solution Options

**Option A (Recommended): Add display: 'swap'**
```javascript
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
  display: "swap",
});
```

This is the standard best practice for Google Fonts and should resolve the preload warning while maintaining good UX.

**Option B: Disable preload**
```javascript
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
  display: "swap",
  preload: false,
});
```

Only use if Option A doesn't work. This disables preloading entirely.

**Option C: Specify weight**
```javascript
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
  display: "swap",
  weight: ["400", "600", "700"], // Only weights actually used
});
```

More aggressive optimization if specific weights are known.

### Related Files

```
src/app/layout.jsx          # PRIMARY: Font configuration
tailwind.config.js          # Uses --font-mont variable
src/styles/globals.css      # May reference font-mont
```

### Testing Commands

```bash
# Run dev server and check console
npm run dev
# Open browser DevTools → Console → Filter for "preload"

# Build and run production
npm run build && npm run start

# Run Lighthouse CI
npm run lighthouse
```

### Scope Boundaries

Per Epic 10 definition:
- Fix the font preload warning ONLY
- NO new fonts or font features
- NO architecture changes
- Maintain current performance metrics

### Previous Story Intelligence

From Story 10.2:
- TDD approach worked well (RED-GREEN-REFACTOR)
- Simple config changes are low risk
- Commit between phases for traceability

From Story 10.1:
- CSS/config fixes are straightforward
- Verify with existing test infrastructure

## Project Structure Notes

### Files to Modify

```
src/app/
└── layout.jsx              # PRIMARY: Add display: 'swap' to Montserrat config
```

### Related Files (Read Only)

```
tailwind.config.js          # References --font-mont variable (line 11)
next.config.js              # Currently empty, no font config
```

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| 10.3 | Font preload warning | Console warning | Add display: 'swap' to font config |

### Architecture Alignment

- **Pattern:** Next.js next/font/google for optimized font loading
- **Tailwind:** Custom font-family via CSS variable
- **Performance:** Lighthouse ≥90 requirement (NFR1)

### Existing Code References

- `src/app/layout.jsx:30-33` - Montserrat configuration
- `tailwind.config.js:11` - font-mont definition
- `_bmad-output/implementation-artifacts/technical-debt-backlog.md:72-96` - Debt documentation

### Next.js Font Documentation

From Next.js docs (next/font):
- `display: 'swap'` is recommended for better UX
- Controls CSS `font-display` property
- 'swap' shows fallback font immediately, swaps when custom loads
- Prevents invisible text during font load

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-27 | Story created via create-story workflow |
