# Story 14.5: Article Card Component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **portfolio visitor**,
I want **article cards to display publication date, tags/categories, and summary prominently**,
so that **I can quickly assess article relevance and recency before deciding to read**.

## Acceptance Criteria

### AC1: ArticleCard component with base structure
**Given** the ArticleCard component
**When** rendered with an article object
**Then** it displays the article title as a clickable link
**And** it displays the article summary
**And** it displays the publication date prominently
**And** it displays the reading time (e.g., "9 min read")
**And** it displays the article featured image
**And** it uses semantic HTML (`<article>` element)

### AC2: Featured and Grid variants exist
**Given** the ArticleCard component
**When** `article.featured === true`
**Then** the Featured variant is automatically selected (larger card)
**And** when `article.featured === false` the Grid variant is used (compact card)
**And** both variants can be directly imported if needed

### AC3: Article links handle internal and external URLs
**Given** an article card
**When** the article has an internal URL (`/articles/{slug}`)
**Then** navigation uses Next.js Link for client-side routing
**And** when the article has an external URL
**Then** the link opens in a new tab with `target="_blank"` and `rel="noopener noreferrer"`

### AC4: CSS follows BEM naming and matches ProjectCard patterns
**Given** the ArticleCard styles
**When** inspecting CSS classes
**Then** BEM naming is used: `.article-card`, `.article-card--featured`, `.article-card__title`, etc.
**And** dark mode support with `dark:` prefixes
**And** responsive breakpoints match project breakpoints (`xs`, `sm`, `md`, `lg`)

### AC5: Touch behavior integration ready (from Story 14.4)
**Given** the ArticleCard component
**When** rendered on touch devices
**Then** it integrates with `useTouchState` hook for tap-to-reveal pattern
**And** touch targets meet 44x44px WCAG minimum
**And** reduced motion support is implemented

### AC6: Unit tests cover ArticleCard component
**Given** the ArticleCard implementation
**When** running unit tests
**Then** tests verify rendering of all article fields (title, summary, date, reading time)
**And** tests verify Featured vs Grid variant selection
**And** tests verify internal vs external link behavior
**And** tests verify touch state integration
**And** tests verify reduced motion support

## Tasks / Subtasks

- [x] **Task 1: Create ArticleCard types and interfaces** (AC: 1, 2)
  - [x] 1.1 Create `ArticleCard.types.ts` with `ArticleCardProps`, `ArticleCardVariantProps`
  - [x] 1.2 Import Article type from `@/domains/article/model/schema`
  - [x] 1.3 Add `isTouched` optional prop for touch state integration

- [x] **Task 2: Create ArticleCard base structure** (AC: 1, 2)
  - [x] 2.1 Create `src/ui/organisms/ArticleCard/index.tsx` with auto-variant selection
  - [x] 2.2 Create `variants/Featured.tsx` for featured articles
  - [x] 2.3 Create `variants/Grid.tsx` for non-featured articles
  - [x] 2.4 Use semantic HTML (`<article>` element)
  - [x] 2.5 Integrate `useTouchState` hook in both variants

- [x] **Task 3: Create ArticleCard subcomponents** (AC: 1)
  - [x] 3.1 Create `ArticleMeta.tsx` for date + reading time display
  - [x] 3.2 Reuse `FramerImage` for article images with hover effect
  - [x] 3.3 Create `ArticleActions.tsx` if needed (share button, etc.) - DEFERRED: Not needed for MVP

- [x] **Task 4: Implement internal/external link handling** (AC: 3)
  - [x] 4.1 Create `ArticleLink.tsx` wrapper component
  - [x] 4.2 Detect internal URLs (starts with `/` or matches site domain)
  - [x] 4.3 Use Next.js `Link` for internal, `<a target="_blank">` for external
  - [x] 4.4 Add `rel="noopener noreferrer"` for external links

- [x] **Task 5: Create CSS styles** (AC: 4, 5)
  - [x] 5.1 Create `styles.css` with BEM naming
  - [x] 5.2 Add `.article-card--featured` and `.article-card--grid` modifiers
  - [x] 5.3 Add dark mode support with `dark:` prefixes
  - [x] 5.4 Add responsive styles for all breakpoints
  - [x] 5.5 Add 44x44px touch targets with `min-w-11 min-h-11`
  - [x] 5.6 Add hover-reveal pattern for touch states (like ProjectCard)

- [x] **Task 6: Unit tests** (AC: 6)
  - [x] 6.1 Test ArticleCard renders all required fields
  - [x] 6.2 Test Featured variant auto-selection when `featured === true`
  - [x] 6.3 Test Grid variant auto-selection when `featured === false`
  - [x] 6.4 Test internal link uses Next.js Link
  - [x] 6.5 Test external link opens in new tab
  - [x] 6.6 Test touch state integration
  - [x] 6.7 Test reduced motion support

## Dev Notes

### Previous Story Intelligence (14.1 - 14.4)

**From Story 14.1 (Project Card Component):**
- **Variant pattern**: Auto-select based on `featured` flag, can also import specific variants
- **TypeScript**: Full type definitions in `*.types.ts` file
- **BEM CSS**: Block (`.project-card`), modifiers (`--featured`, `--grid`), elements (`__title`, `__image`)
- **Icon className issue**: Icons require `className=""` prop when used
- **Testing patterns**: Use `@testing-library/react`, mock Next.js Link

**From Story 14.4 (Touch Behavior):**
- **useTouchState hook**: `src/hooks/ui/useTouchState.ts` - reusable for ArticleCard
- **Hook API**:
```typescript
const { isTouched, handleTouchStart, handleClick, elementRef } = useTouchState({
  id: 'article-card-{slug}'
});
```
- **TransitionProvider coordination**: Touch disabled during `isTransitioning`
- **Reduced motion**: `useReducedMotion` hook; actions always visible when enabled
- **CSS pattern for hover-reveal**:
```css
.article-card__actions {
  @apply opacity-0 invisible;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}
.article-card:hover .article-card__actions,
.article-card--touched .article-card__actions {
  @apply opacity-100 visible;
}
```

**File patterns established from ProjectCard:**
```
src/ui/organisms/ArticleCard/
├── index.tsx              # Auto-selects variant based on article.featured
├── ArticleCard.types.ts   # Type definitions
├── styles.css             # BEM naming, hover/touch styles
├── ArticleMeta.tsx        # Date + reading time display
├── ArticleLink.tsx        # Internal/external link wrapper
└── variants/
    ├── Featured.tsx       # With useTouchState integration
    └── Grid.tsx           # With useTouchState integration
```

### UX Spec Requirements (Critical)

**From spec.md Section "Articles":**
```
1. Primer blade – Featured Articles
   - Desktop: Se intenta mostrar 2 featured completos
   - Mobile: Siempre 1 featured, nunca cortado

6. Footer + convivencia con artículos
   - El footer puede:
     • Estar solo
     • Compartir blade con últimos artículos
   - El footer nunca debe competir visualmente con un artículo
```

**From epics-v2.md FR14.11 & FR14.12:**
```
| FR14.11 | Fecha de publicación prominente en article card |
| FR14.12 | Tags/categorías visibles en article card |
```

**From epics-v2.md NFR14.3:**
```
| NFR14.3 | Mobile-first: touch behavior diseñado primero, hover como enhancement |
```

### Article Domain Model

**Article type from `/src/domains/article/model/schema.ts`:**
```typescript
type Article = {
  id: number;
  title: string;
  url: string;                  // External or internal URL
  slug: string;                 // Route parameter
  reading_time: string;         // e.g., "9 min read"
  published_at: string;         // ISO date string
  summary: string;              // Short description
  content?: string;             // Markdown content for detail view
  img: string;                  // Featured image URL
  featured: boolean;            // Display variant selector
  status: "published" | "draft"; // Publishing control
}
```

### Existing Article Components Analysis

**Current molecules to consider:**
1. `src/ui/molecules/Article/index.tsx` - Simple hero display (can reference)
2. `src/ui/molecules/FeaturedArticle/index.jsx` - Larger variant (partially reusable)

**Current articles page (`/src/app/articles/page.tsx`):**
- Renders inline card layout (not componentized yet)
- Grid layout: 4 cols on desktop, 12 cols on mobile
- Shows: image, title, summary, reading time, date
- Links to internal `/articles/{slug}` or external URLs

### Link Handling Logic

```typescript
// ArticleLink.tsx
const isInternalUrl = (url: string): boolean => {
  // Internal if: starts with "/" or matches article detail pattern
  return url.startsWith('/') || url.startsWith('/articles/');
};

// Usage
const articleUrl = article.url.startsWith('http')
  ? article.url  // External URL
  : `/articles/${article.slug}`;  // Internal route
```

### Accessibility Requirements

- **44x44px touch targets**: WCAG 2.5.5 Target Size (Level AAA recommended)
- **Semantic HTML**: `<article>` element with proper heading hierarchy
- **Keyboard navigation**: Tab navigation must work
- **Screen readers**: Proper ARIA labels for date, reading time, links
- **Reduced motion**: Actions visible without animation when `prefers-reduced-motion`

### Performance Considerations

- **Image optimization**: Use Next.js Image with proper `sizes` attribute
- **Lazy loading**: Images below fold should lazy load
- **Bundle size**: Reuse existing components (FramerImage, BoxShadow)

### References

- [Source: epics-v2.md#FR14.11] - Fecha de publicación prominente
- [Source: epics-v2.md#FR14.12] - Tags/categorías visibles
- [Source: epics-v2.md#NFR14.3] - Mobile-first touch behavior
- [Source: spec.md#Articles] - Articles page UX specification
- [Source: 14-4-project-article-touch-behavior.md] - Touch behavior patterns and useTouchState hook
- [Source: src/ui/organisms/ProjectCard/] - Component structure to follow
- [Source: src/domains/article/model/schema.ts] - Article domain type
- [Source: src/hooks/ui/useTouchState.ts] - Touch state management hook

### Deferred / Follow-up (out of scope for 14.5)

- **Tags display**: FR14.12 mentions tags, but current Article schema doesn't have tags field. May need domain model update or defer to separate story.
- **Article hover thumbnail**: Story 14.8 will implement hover thumbnail effect
- **Sequential appearance animation**: Story 14.7 will implement scroll-triggered animations
- **E2E tests**: Consolidated in Story 14.9

---

## File List

### Created Files
- `src/ui/organisms/ArticleCard/ArticleCard.types.ts` - Type definitions
- `src/ui/organisms/ArticleCard/ArticleLink.tsx` - Internal/external link wrapper
- `src/ui/organisms/ArticleCard/ArticleMeta.tsx` - Date + reading time display
- `src/ui/organisms/ArticleCard/variants/Featured.tsx` - Featured article variant
- `src/ui/organisms/ArticleCard/variants/Grid.tsx` - Grid article variant
- `src/ui/organisms/ArticleCard/index.tsx` - Main component with auto-variant selection
- `src/ui/organisms/ArticleCard/styles.css` - BEM CSS with touch/dark mode support
- `src/ui/organisms/ArticleCard/__tests__/ArticleCard.test.tsx` - 37 unit tests

### Modified Files
- `src/ui/organisms/index.js` - Added ArticleCard exports

---

## Dev Agent Record

### Implementation Summary
Implemented ArticleCard component following ProjectCard patterns from Story 14.1. The component auto-selects between Featured and Grid variants based on `article.featured` flag. Integrated `useTouchState` hook from Story 14.4 for mobile touch behavior.

### Key Decisions
1. **Link handling**: Used `isExternalUrl()` function to detect http/https URLs. Internal URLs use Next.js Link, external use `<a target="_blank" rel="noopener noreferrer">`.
2. **Date formatting**: Used `toLocaleDateString("en-US")` for human-readable dates. Tests use regex patterns to account for timezone variations.
3. **ArticleActions deferred**: Task 3.3 deferred as no share button is needed for MVP.
4. **Touch targets**: 44x44px minimum via CSS `@media (hover: none)` instead of inline classes.

### Test Results
```
Test Suites: 1 passed, 1 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        0.831 s
```

### Acceptance Criteria Verification
- AC1: ✅ ArticleCard displays title, summary, date, reading time, image, uses `<article>` element
- AC2: ✅ Featured/Grid variants auto-selected based on `article.featured`
- AC3: ✅ Internal URLs use Next.js Link, external open in new tab with security attributes
- AC4: ✅ BEM naming (`.article-card`, `--featured`, `--grid`, `__title`, etc.), dark mode, responsive
- AC5: ✅ `useTouchState` integrated, 44x44px touch targets, reduced motion support
- AC6: ✅ 37 unit tests covering all requirements

---

## Senior Developer Review (AI)

**Reviewer:** Angel DevStack
**Date:** 2026-01-29
**Outcome:** ✅ APPROVED

### Issues Found & Fixed

| Severity | Issue | Fix Applied |
|----------|-------|-------------|
| 🔴 HIGH | H3: Missing "use client" directive in variants | Added `"use client"` to Featured.tsx and Grid.tsx |
| 🟡 MEDIUM | M1: No default export in variants | Added `export default` to both variants |
| 🟡 MEDIUM | M2: Date formatting can fail with invalid dates | Added validation in `formatDate()` with fallback |
| 🟡 MEDIUM | M3: Insufficient test coverage for reduced motion | Added test for `isDisabled: true` scenario |
| 🟡 MEDIUM | M4: Double call to `isExternalUrl()` | Optimized to single call with cached result |
| 🟢 LOW | L2: Incorrect comment in test | Fixed comment to reflect actual behavior |

### Additional Tests Added
- `disables touch state when reduced motion is enabled`
- `handles empty date string gracefully`
- `handles invalid date string gracefully`

### Files Modified During Review
- `src/ui/organisms/ArticleCard/variants/Featured.tsx` - Added "use client", default export
- `src/ui/organisms/ArticleCard/variants/Grid.tsx` - Added "use client", default export
- `src/ui/organisms/ArticleCard/ArticleMeta.tsx` - Added date validation
- `src/ui/organisms/ArticleCard/ArticleLink.tsx` - Optimized isExternalUrl call
- `src/ui/organisms/ArticleCard/__tests__/ArticleCard.test.tsx` - Added 3 new tests, fixed comment
