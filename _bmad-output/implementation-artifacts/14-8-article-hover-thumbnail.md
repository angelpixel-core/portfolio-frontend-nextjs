# Story 14.8: Article Hover Thumbnail

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **portfolio visitor on desktop**,
I want **a thumbnail image to appear when I hover over an article in the list**,
so that **I can preview the article's visual content before clicking and make more informed navigation decisions**.

## Acceptance Criteria

### AC1: Thumbnail appears on hover (desktop only)
**Given** the Articles page "All Articles" section on desktop (≥641px)
**When** I hover over the article LINK (title, not entire box)
**Then** a thumbnail popup appears near the cursor
**And** the thumbnail displays the article's featured image (`article.img`)
**And** the thumbnail has a subtle shadow/border for visual separation
**And** the thumbnail FOLLOWS the mouse cursor horizontally

### AC2: Thumbnail positioning (cursor-following)
**Given** an article link being hovered
**When** the thumbnail appears
**Then** it is positioned above and to the right of the cursor
**And** it follows the mouse as user moves left/right over the link
**And** the thumbnail dimensions are 220x150px
**And** the thumbnail does not overflow the viewport (flips to left side if needed)

### AC3: Thumbnail animation
**Given** hover state changes
**When** entering hover
**Then** thumbnail fades in smoothly (opacity 0→1, ~200-300ms)
**When** leaving hover
**Then** thumbnail fades out smoothly (opacity 1→0, ~150-200ms)
**And** animation uses ease-out timing function

### AC4: Reduced motion support
**Given** a user with `prefers-reduced-motion: reduce` enabled
**When** hovering over an article
**Then** thumbnail appears immediately without fade animation
**Or** thumbnail can be disabled entirely (acceptable alternative)

### AC5: Touch device behavior
**Given** a touch device (mobile/tablet)
**When** tapping on an article list item
**Then** no thumbnail appears
**And** the tap navigates directly to the article
**And** hover state should not be triggered on touch

### AC6: Integration with existing components (UPDATED)
**Given** the ArticleListItem component from Story 14.10
**When** implementing thumbnail hover
**Then** use the `onHoverChange` callback with mouse position
**And** receive `(isHovered: boolean, mousePosition: {x, y} | null)` from ArticleListItem
**And** hover handlers on LINK element (not article box) for precise trigger
**Note:** ArticleListItem modified to support cursor-following behavior per user request

### AC7: Image loading handling
**Given** an article with an image
**When** the thumbnail loads
**Then** show a placeholder or skeleton while loading
**Or** pre-load images on page load (optional optimization)
**And** handle image load errors gracefully (hide thumbnail if error)

## Tasks / Subtasks

- [x] **Task 1: Create ArticleHoverThumbnail component** (AC: 1, 2, 3, 7)
  - [x] 1.1 Create `src/ui/atoms/ArticleHoverThumbnail/index.tsx`
  - [x] 1.2 Create `src/ui/atoms/ArticleHoverThumbnail/ArticleHoverThumbnail.types.ts`
  - [x] 1.3 Create `src/ui/atoms/ArticleHoverThumbnail/styles.css`
  - [x] 1.4 Implement fixed positioning based on provided rect
  - [x] 1.5 Use next/image for optimized image loading
  - [x] 1.6 Add shadow/border styling per design
  - [x] 1.7 Implement viewport boundary detection (prevent overflow)

- [x] **Task 2: Implement animation with Framer Motion** (AC: 3, 4)
  - [x] 2.1 Use AnimatePresence for enter/exit animations
  - [x] 2.2 Implement fade-in (250ms) on enter
  - [x] 2.3 Implement fade-out (150ms) on exit
  - [x] 2.4 Integrate useReducedMotion hook
  - [x] 2.5 Skip animations when reduced motion enabled

- [x] **Task 3: Add hover state management to Articles page** (AC: 1, 5, 6)
  - [x] 3.1 Create state: `hoveredArticle: { article: Article, rect: DOMRect } | null`
  - [x] 3.2 Create `createHoverHandler` callback factory function
  - [x] 3.3 Pass callback to each ArticleListItem via `onHoverChange`
  - [x] 3.4 Render ArticleHoverThumbnail when hoveredArticle is not null

- [x] **Task 4: Implement touch device detection** (AC: 5)
  - [x] 4.1 Use `@media (hover: none)` in CSS to hide on touch devices
  - [x] 4.2 CSS-only approach - cleaner than JS detection
  - [x] 4.3 Thumbnail hidden via `display: none !important` on touch

- [x] **Task 5: Create unit tests** (AC: 1-7)
  - [x] 5.1 Test ArticleHoverThumbnail renders with image
  - [x] 5.2 Test positioning based on rect prop
  - [x] 5.3 Test animation states (entering, exiting)
  - [x] 5.4 Test reduced motion skips animation
  - [x] 5.5 Test touch device behavior (via CSS media query)
  - [x] 5.6 Test image error handling

- [x] **Task 6: Add barrel exports** (AC: N/A)
  - [x] 6.1 Add ArticleHoverThumbnail to atoms index
  - [x] 6.2 Update any necessary imports

## Dev Notes

### Previous Story Intelligence (Story 14.10)

**ArticleListItem already prepared for this story:**
```typescript
// From src/ui/molecules/ArticleListItem/ArticleListItem.types.ts
export interface ArticleListItemProps {
  article: Article;
  className?: string;
  onHoverChange?: (_isHovered: boolean, _rect: DOMRect | null) => void;
}
```

**Hover handlers already implemented:**
```typescript
// From src/ui/molecules/ArticleListItem/index.tsx
const handleMouseEnter = useCallback(() => {
  if (onHoverChange && elementRef.current) {
    const rect = elementRef.current.getBoundingClientRect();
    onHoverChange(true, rect);
  }
}, [onHoverChange]);

const handleMouseLeave = useCallback(() => {
  if (onHoverChange) {
    onHoverChange(false, null);
  }
}, [onHoverChange]);
```

**Key insight:** No changes needed to ArticleListItem - just pass the callback from Articles page.

### Design Reference

From `_bmad-output/implementation-artifacts/ux-design-behavior/04-articles/`:
- `07-all-articles-hover-effect.png` - Shows thumbnail popup over "Form Validation" article
- `08-all-articles-hover-effect | 2nd sample.png` - Shows thumbnail over "Silky Smooth Scrolling" article

**Design observations:**
1. Thumbnail appears centered horizontally over the article row
2. Thumbnail overlaps the text slightly (positioned above center of row)
3. White background with subtle shadow
4. Rounded corners on thumbnail container
5. Aspect ratio matches article image (appears ~16:9 or 4:3)
6. Width approximately 200-250px based on visual proportion

### Article Schema

```typescript
// From src/domains/article/model/schema.ts
export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  slug: z.string(),
  reading_time: z.string(),
  published_at: z.string(),
  summary: z.string(),
  content: z.string().optional(),
  img: z.string(),  // <-- Thumbnail image URL
  featured: z.boolean(),
  status: z.enum(["published", "draft"]).optional().default("published"),
});
```

### Positioning Logic

```typescript
// Example positioning calculation
function calculateThumbnailPosition(rect: DOMRect): { top: number; left: number } {
  const thumbnailWidth = 220;
  const thumbnailHeight = 150; // Approximate

  return {
    // Center horizontally over the article row
    left: rect.left + (rect.width / 2) - (thumbnailWidth / 2),
    // Position above the row, overlapping slightly
    top: rect.top - thumbnailHeight + 20, // 20px overlap
  };
}
```

### Framer Motion Animation Patterns

```typescript
// Similar to ArticleAppearance from Story 14.7
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const transition = {
  enter: { duration: 0.25, ease: "easeOut" },
  exit: { duration: 0.15, ease: "easeIn" },
};
```

### Touch Detection Pattern

```css
/* CSS approach - simplest */
@media (hover: none) {
  .article-hover-thumbnail {
    display: none !important;
  }
}
```

```typescript
// JS approach if needed
const canHover = window.matchMedia('(hover: hover)').matches;
```

### File Structure

```
src/ui/atoms/ArticleHoverThumbnail/
├── index.tsx
├── ArticleHoverThumbnail.types.ts
├── styles.css
└── __tests__/ArticleHoverThumbnail.test.tsx
```

### Current Articles Page Structure (from Story 14.10)

```typescript
// From src/app/articles/page.tsx
{listArticles.map((article, index) => (
  <ArticleAppearance
    key={article.slug}
    id={article.slug}
    index={index}
    className="articles-list__item"
  >
    <ArticleListItem article={article} />  {/* Add onHoverChange here */}
  </ArticleAppearance>
))}
```

### Integration Point

```typescript
// Updated Articles page (conceptual)
function ArticlesContent() {
  const [hoveredArticle, setHoveredArticle] = useState<{
    article: Article;
    rect: DOMRect;
  } | null>(null);

  const handleArticleHover = useCallback((
    article: Article,
    isHovered: boolean,
    rect: DOMRect | null
  ) => {
    if (isHovered && rect) {
      setHoveredArticle({ article, rect });
    } else {
      setHoveredArticle(null);
    }
  }, []);

  return (
    <>
      {/* ... existing content ... */}
      {listArticles.map((article, index) => (
        <ArticleAppearance key={article.slug} id={article.slug} index={index}>
          <ArticleListItem
            article={article}
            onHoverChange={(isHovered, rect) => handleArticleHover(article, isHovered, rect)}
          />
        </ArticleAppearance>
      ))}

      {/* Thumbnail portal - render at page level */}
      <ArticleHoverThumbnail
        article={hoveredArticle?.article ?? null}
        rect={hoveredArticle?.rect ?? null}
      />
    </>
  );
}
```

### References

- [Source: epics-v2.md#FR14.10] - "Hover effect: thumbnail aparece al hover"
- [Source: epics-v2.md#FR14.16] - "Reduced motion support"
- [Source: Story 14.10] - ArticleListItem with onHoverChange callback
- [Source: Story 14.7] - Animation patterns (Framer Motion, useReducedMotion)
- [Source: 04-articles/07-all-articles-hover-effect.png] - Design reference
- [Source: 04-articles/08-all-articles-hover-effect | 2nd sample.png] - Design reference

### Deferred / Follow-up (out of scope for 14.8)

- **Image preloading optimization**: Can be added later if hover feels slow
- **Tooltip-style arrow**: Design doesn't show one, but could be nice-to-have
- **Keyboard focus thumbnail**: Not in spec, would require different trigger mechanism
- **E2E tests**: Consolidated in Story 14.9

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A

### Completion Notes List

1. Created ArticleHoverThumbnail atom component with cursor-following behavior
2. Thumbnail follows mouse cursor - appears above and to the right
3. Hover triggers on LINK element (not entire article box) per user request
4. Viewport boundary detection: flips to left side when near right edge
5. Used Framer Motion AnimatePresence for enter/exit animations (250ms/150ms)
6. Integrated useReducedMotion hook - skips animation when enabled
7. Touch device detection via CSS `@media (hover: none)` - hides thumbnail on touch devices
8. Image loading states: placeholder during load, hide on error
9. Fixed framer-motion mock to preserve style props for positioning tests
10. Modified ArticleListItem to track mouse position on link hover
11. All 35 unit tests passing (17 ArticleHoverThumbnail + 18 ArticleListItem)
12. Refinement: Link wraps ONLY title (not date) - date moved outside Link element
13. Refinement: Added flex justify-between layout - title left, date right

### File List

- `src/ui/atoms/ArticleHoverThumbnail/index.tsx` (created)
- `src/ui/atoms/ArticleHoverThumbnail/ArticleHoverThumbnail.types.ts` (created)
- `src/ui/atoms/ArticleHoverThumbnail/styles.css` (created)
- `src/ui/atoms/ArticleHoverThumbnail/__tests__/ArticleHoverThumbnail.test.tsx` (created)
- `src/ui/atoms/index.js` (modified - added barrel export)
- `src/ui/molecules/ArticleListItem/index.tsx` (modified - hover on link, mouse tracking, date outside link)
- `src/ui/molecules/ArticleListItem/ArticleListItem.types.ts` (modified - MousePosition type)
- `src/ui/molecules/ArticleListItem/styles.css` (modified - flex justify-between layout)
- `src/ui/molecules/ArticleListItem/__tests__/ArticleListItem.test.tsx` (modified - updated tests)
- `src/app/articles/page.tsx` (modified - mouse position state)
- `src/test-utils/framer-motion-mock.ts` (modified - preserve style prop)
- `tsconfig.json` (modified - added @/atoms barrel path)
