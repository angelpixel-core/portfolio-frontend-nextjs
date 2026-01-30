# Story 14.6: Articles Page Layout

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **portfolio visitor**,
I want **the articles page to display featured articles prominently in a hero blade and all articles in a consistent grid layout**,
so that **I can quickly identify highlighted content and browse the complete article collection with a clear visual hierarchy**.

## Acceptance Criteria

### AC1: Featured articles blade structure
**Given** the Articles page
**When** rendered with articles data
**Then** featured articles appear in a hero blade at the top
**And** mobile displays exactly 1 featured article (never cut off)
**And** desktop attempts to show up to 2 featured articles
**And** the blade follows the same pattern as Projects page

### AC2: All articles list with ArticleCard components
**Given** the Articles page
**When** rendering non-featured articles
**Then** each article uses the `ArticleCard` component from Story 14.5
**And** articles are displayed in a responsive grid layout
**And** the grid follows the Projects page pattern (auto-fill, minmax)

### AC3: Page uses ArticleCard components from Story 14.5
**Given** the Articles page implementation
**When** rendering any article
**Then** it uses `<ArticleCard article={article} />` for auto-variant selection
**And** OR uses `<FeaturedArticleCard>` / `<GridArticleCard>` directly when needed
**And** all ArticleCard features work (touch behavior, links, meta display)

### AC4: Footer convivencia with articles
**Given** the Articles page
**When** scrolling to the bottom
**Then** the footer can share space with last articles without visual competition
**And** footer has less visual weight than article cards
**And** footer follows FR14.13 requirements

### AC5: Responsive layout matches Projects page patterns
**Given** the Articles page CSS
**When** viewed at different viewport sizes
**Then** mobile uses single column with scroll-snap
**And** tablet uses 2-column grid
**And** desktop uses auto-fill grid (minmax 320px)
**And** blade structure mirrors Projects page

### AC6: Loading and empty states
**Given** the Articles page
**When** data is loading
**Then** a skeleton loader is displayed
**And** when no articles exist, an appropriate empty message is shown
**And** error states are handled gracefully

## Tasks / Subtasks

- [x] **Task 1: Refactor Articles page to use ArticleCard components** (AC: 2, 3)
  - [x] 1.1 Import `ArticleCard`, `FeaturedArticleCard` from `@/organisms`
  - [x] 1.2 Replace inline article rendering with `<ArticleCard article={article} />`
  - [x] 1.3 Separate featured and non-featured articles using `article.featured` flag
  - [x] 1.4 Maintain existing data fetching with `useArticles` hook

- [x] **Task 2: Implement blade structure** (AC: 1, 4)
  - [x] 2.1 Create hero blade section for featured articles
  - [x] 2.2 Create grid blade section for non-featured articles
  - [x] 2.3 Add page title with `MotionTitle` component (like Projects)
  - [x] 2.4 Ensure footer convivencia (less visual weight)

- [x] **Task 3: Create Articles page CSS** (AC: 5)
  - [x] 3.1 Create `src/app/articles/styles.css` following Projects pattern
  - [x] 3.2 Add `.articles-page`, `.articles-blade--hero`, `.articles-blade--grid` classes
  - [x] 3.3 Add mobile scroll-snap behavior (max-width: 639px)
  - [x] 3.4 Add responsive grid (auto-fill, minmax 320px)
  - [x] 3.5 Add dark mode support

- [x] **Task 4: Handle loading and empty states** (AC: 6)
  - [x] 4.1 Update `ArticleListSkeleton` to match new layout
  - [x] 4.2 Add empty state message for no articles
  - [x] 4.3 Ensure error handling is consistent

- [x] **Task 5: Unit tests for Articles page** (AC: 1-6)
  - [x] 5.1 Test featured articles appear in hero blade
  - [x] 5.2 Test non-featured articles appear in grid
  - [x] 5.3 Test ArticleCard components are used
  - [x] 5.4 Test loading skeleton is displayed
  - [x] 5.5 Test empty state message

## Dev Notes

### Previous Story Intelligence (Story 14.5)

**ArticleCard Component Created:**
```typescript
// Auto-variant selection
import { ArticleCard } from "@/organisms";
<ArticleCard article={article} /> // Auto-selects Featured or Grid variant

// Direct variant imports
import { FeaturedArticleCard, GridArticleCard } from "@/organisms";
```

**ArticleCard exports from `src/ui/organisms/index.js`:**
```javascript
export {
  ArticleCard,
  FeaturedArticleCard,
  GridArticleCard,
  ArticleMeta,
  ArticleLink,
} from "./ArticleCard";
```

**Code Review Fixes Applied in 14.5:**
- `"use client"` directive added to variants
- Date validation with fallback for invalid dates
- Default exports added to variants

### Projects Page Pattern (Reference)

**File structure to follow:**
```
src/app/projects/
├── page.tsx              # Main page with blade structure
├── styles.css            # BEM CSS with blade classes
└── ProjectListSkeleton.tsx
```

**Key patterns from `src/app/projects/page.tsx`:**
```typescript
// Separate featured from non-featured
const { featuredProject, nonFeaturedProjects } = useMemo(() => {
  const featured = projects.find((p) => p.featured) || null;
  const nonFeatured = projects.filter((p) => !p.featured);
  return { featuredProject: featured, nonFeaturedProjects: nonFeatured };
}, [projects]);

// Blade structure
<section className="projects-blade projects-blade--hero">
  {featuredProject && <ProjectCard project={featuredProject} />}
</section>

<section className="projects-blade projects-blade--grid">
  <div className="projects-grid">
    {nonFeaturedProjects.map((project) => (
      <ProjectCard project={project} />
    ))}
  </div>
</section>
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

**From epics-v2.md FR14.8 & FR14.13:**
```
| FR14.8 | Featured articles en blade 1 (mobile: 1, desktop: hasta 2) |
| FR14.13 | Footer puede convivir con últimos artículos sin competir visualmente |
```

### Current Articles Page Analysis

**Current implementation (`src/app/articles/page.tsx`):**
- Uses `useArticles()` hook - ✅ keep
- Inline article rendering - ❌ replace with ArticleCard
- Single list layout - ❌ replace with blade structure
- Has `ArticleListSkeleton` - ✅ update to match new layout

**Current data shape:**
```typescript
const { data: articles = [], isLoading, isError } = useArticles();
// articles: Article[] from domain model
```

### CSS Class Naming Pattern

Follow Projects page pattern:
```css
.articles-page { }
.articles-blade { }
.articles-blade--hero { }
.articles-blade--grid { }
.articles-grid { }
.articles-grid__item { }
.articles-title { }
.articles-empty { }
```

### Mobile Scroll-Snap Pattern

From Projects styles.css:
```css
/* Mobile scroll snap behavior */
@media (max-width: 639px) {
  .articles-page {
    scroll-snap-type: y mandatory;
  }

  .articles-blade--hero {
    @apply min-h-screen;
    scroll-snap-align: start;
  }
}
```

### Featured Articles Logic

**Desktop (2 featured max):**
```typescript
const featuredArticles = articles.filter(a => a.featured).slice(0, 2);
```

**Mobile (1 featured only):**
- CSS handles this via responsive layout
- Or conditionally render based on viewport

### References

- [Source: epics-v2.md#FR14.8] - Featured articles en blade 1
- [Source: epics-v2.md#FR14.13] - Footer convivencia
- [Source: spec.md#Articles] - Articles page UX specification
- [Source: 14-5-article-card-component.md] - ArticleCard component implementation
- [Source: src/app/projects/page.tsx] - Projects page blade structure pattern
- [Source: src/app/projects/styles.css] - Projects page CSS pattern
- [Source: src/ui/organisms/ArticleCard/] - ArticleCard components

### Deferred / Follow-up (out of scope for 14.6)

- **Sequential appearance animation**: Story 14.7 will implement scroll-triggered animations
- **Hover thumbnail effect**: Story 14.8 will implement hover thumbnail
- **E2E tests**: Consolidated in Story 14.9
- **Article filtering by category**: Not in current requirements

## Dev Agent Record

### File List

**Created:**
- `src/app/articles/__tests__/ArticlesPageLayout.test.tsx` - Unit tests for Articles page (27 tests)

**Modified:**
- `src/app/articles/page.tsx` - Refactored to use ArticleCard components with blade structure
- `src/app/articles/styles.css` - Added blade layout CSS following Projects page pattern
- `src/app/articles/ArticleListSkeleton.tsx` - Updated skeleton to match blade structure
- `src/app/articles/__tests__/ArticleListSkeleton.test.tsx` - Updated skeleton tests (7 tests)
- `src/app/articles/layout.tsx` - Removed duplicate AnimatedTitle (now in page.tsx)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Updated story status

**Also modified (Story 14.5 linting fixes):**
- `src/ui/organisms/ArticleCard/ArticleCard.types.ts` - Added ReactNode import
- `src/ui/organisms/ArticleCard/__tests__/ArticleCard.test.tsx` - Prettier formatting

### Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-30 | Refactored page.tsx to blade structure | AC1, AC2, AC5 |
| 2026-01-30 | Added ArticleCard components usage | AC2, AC3 |
| 2026-01-30 | Created blade CSS with responsive grid | AC5 |
| 2026-01-30 | Updated skeleton to match layout | AC6 |
| 2026-01-30 | Created 27 unit tests | AC1-AC6 |
| 2026-01-30 | Removed title from layout (was duplicate) | Bug fix |
| 2026-01-30 | Fixed extra featured articles going to grid | Code review fix |
