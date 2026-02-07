# ADR-002: Breakpoint Standardization

**Date:** 2026-02-06
**Status:** Accepted
**Story:** 14.15 - Breakpoint Standardization

## Context

Engineering analysis identified **63 occurrences** of magic number breakpoints in CSS:
- `@media (min-width: 400px)` - 8 occurrences
- `@media (min-width: 480px)` - 55 occurrences

These magic numbers exist outside the official breakpoint system defined in `tailwind.config.js` and `docs/layout-system.md`. The project currently has 3 breakpoint systems coexisting:
1. **Legacy max-width** (deprecated): `sm:`, `md:`, `lg:`, etc.
2. **Semantic min-width** (preferred): `tablet:`, `nav:`, `desktop:`, `wide:`
3. **Magic numbers** (undocumented): 400px, 480px

### Design Intent Analysis

The magic numbers serve a specific design purpose: **Progressive Typography Scaling** on mobile devices:
- **Base (0-400px)**: Smallest font sizes for very small phones
- **400px+**: +10% font size increase
- **480px+**: +25% font size increase
- **640px+ / 768px+**: Full tablet/desktop sizes

This is a deliberate UX decision to ensure readability on very small phones (320px-400px) while avoiding oversized text that breaks layouts.

## Options Considered

### Option A: Add to Config (Conservative)

Add `phablet: 400px` and `large-mobile: 480px` to tailwind.config.js as semantic breakpoints.

**Pros:**
- No visual risk - preserves current behavior exactly
- CSS becomes self-documenting with semantic names
- Aligns with mobile-first philosophy

**Cons:**
- More breakpoints to manage (7 semantic + 6 legacy = 13 total)
- Legitimizes fragmentation instead of consolidating
- 400px/480px are very similar (80px apart)

### Option B: Migrate to Semantic (Consolidation)

Migrate 400px/480px occurrences to existing breakpoints: either stay at base (0px) or jump to `tablet:` (640px).

**Pros:**
- Simpler system with fewer breakpoints
- Forces mobile-first discipline
- Reduces CSS complexity

**Cons:**
- Visual adjustments required at 400-480px range
- High risk of layout breaks on intermediate devices
- May require design iteration for each component

## Decision

**Chosen: Option A - Add to Config**

Add two new semantic breakpoints to `tailwind.config.js`:

```javascript
phablet: "400px",   // => @media (min-width: 400px) { ... } Phablet: 400-479px
mobile: "480px",    // => @media (min-width: 480px) { ... } Large Mobile: 480-639px
```

### Rationale

1. **Zero Visual Regression Risk**: The magic numbers represent intentional design decisions. Adding them to config documents existing behavior without changing it.

2. **Progressive Enhancement**: The 400px → 480px → 640px progression is a valid mobile-first pattern for typography scaling on small devices.

3. **Maintenance Path**: Once in config, these breakpoints can be evaluated and potentially consolidated in a future UX-focused story.

4. **Immediate Cleanup**: Eliminates 63 magic numbers from CSS, making the codebase more maintainable.

## Implementation

### Phase 1: Add Breakpoints to Config

```javascript
// tailwind.config.js - screens section
phablet: "400px",  // Small phone → normal phone transition
mobile: "480px",   // Normal phone → large phone transition
tablet: "640px",   // Tablets
nav: "800px",      // Nav transition
desktop: "1025px", // Desktop
wide: "1441px",    // Wide screens
```

### Phase 2: Migrate CSS Files

Replace all magic number media queries with Tailwind breakpoints:

| Magic Number | Tailwind Breakpoint |
|--------------|---------------------|
| `@media (min-width: 400px)` | `@apply phablet:...` or `@media screen(phablet)` |
| `@media (min-width: 480px)` | `@apply mobile:...` or `@media screen(mobile)` |

### Phase 3: Mark Legacy Breakpoints Deprecated

Update legacy breakpoint comments in tailwind.config.js:

```javascript
// LEGACY BREAKPOINTS (max-width) - @deprecated
// Use semantic min-width breakpoints instead.
```

## Consequences

### Positive
- All breakpoints documented in config (single source of truth)
- CSS uses semantic names instead of magic numbers
- No visual regressions (same behavior, better organization)
- Clear migration path for future consolidation

### Negative
- 2 additional semantic breakpoints (7 total)
- Some may view 400px/480px as too granular
- Legacy breakpoints remain (not addressed in this story)

## Files Changed

### Configuration
- `tailwind.config.js` - Added phablet/mobile breakpoints

### Documentation
- `docs/layout-system.md` - Updated breakpoint table
- `docs/adr/002-breakpoint-standardization.md` - This ADR
- `CLAUDE.md` - Updated breakpoint system section

### CSS Migration (63 occurrences)
- `src/ui/molecules/Experience/styles.css` - 10 migrations
- `src/ui/molecules/Education/styles.css` - 4 migrations
- `src/ui/organisms/WordCloud/styles.css` - 12 migrations
- `src/app/about/styles.css` - 8 migrations
- `src/app/styles.css` - 6 migrations
- `src/app/articles/styles.css` - 2 migrations
- `src/app/projects/styles.css` - 2 migrations
- `src/ui/atoms/hocs/History/styles.css` - 3 migrations
- `src/ui/atoms/hocs/TransitionerLi/styles.css` - 1 migration
- `src/ui/organisms/Academics/styles.css` - 2 migrations
- `src/ui/atoms/links/CalendarLink/styles.css` - 1 migration
- `src/ui/atoms/buttons/ArrowButton/styles.css` - 1 migration
- `src/ui/atoms/icons/LiIcon/styles.css` - 2 migrations
- `src/ui/atoms/texts/AnimatedTitle/styles.css` - 1 migration
- `src/ui/molecules/HireMe/styles.css` - 2 migrations
- `src/ui/atoms/texts/ParagraphText/styles.css` - 1 migration
- `src/ui/molecules/CustomersSlider/styles.css` - 2 migrations
- `src/ui/molecules/TechnologiesSlider/styles.css` - 1 migration
- `src/ui/organisms/Experiences/styles.css` - 2 migrations

## References

- [Story 14.15](../../_bmad-output/implementation-artifacts/14-15-breakpoint-standardization.md)
- [Layout System](../layout-system.md)
- [Tailwind Config](../../tailwind.config.js)
