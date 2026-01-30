# Story 14.10: Article List Format

Status: ready-for-dev

<!-- Note: This story fixes a design discrepancy discovered during 14.7 review. -->

## Story

As a **portfolio visitor**,
I want **the "All Articles" section to display articles in a clean list format with title and date**,
so that **I can quickly scan available articles and the page matches the intended editorial design**.

## Background

During Story 14.7 review, a significant design discrepancy was identified:
- **Design spec**: "All Articles" blade uses a simple list format (title + date + left border accent)
- **Current implementation**: Grid of `GridArticleCard` components with images and summaries

This story corrects the implementation to match the original UX design.

## Acceptance Criteria

### AC1: ArticleListItem component structure
**Given** the ArticleListItem component
**When** rendered
**Then** it displays:
  - Left border accent (magenta/pink theme color)
  - Article title (left-aligned, takes available space)
  - Publication date (right-aligned on desktop, below title on mobile)
**And** it does NOT display image or summary (those are for FeaturedArticleCard only)

### AC2: Desktop layout (≥768px)
**Given** the Articles page on desktop viewport
**When** viewing the "All Articles" section
**Then** each list item shows title and date on the same row
**And** title is left-aligned with left border accent
**And** date is right-aligned in pink/magenta color
**And** items are full-width with consistent spacing

### AC3: Mobile layout (<768px)
**Given** the Articles page on mobile viewport
**When** viewing the "All Articles" section
**Then** each list item shows title with date below
**And** left border accent remains visible
**And** date is in pink/magenta color
**And** touch target is adequately sized (min 44px height)

### AC4: Sequential appearance integration
**Given** the updated "All Articles" list
**When** scrolling
**Then** ArticleAppearance wrapper still provides sequential animations
**And** existing useScrollAppearance hook works without modification
**And** reduced motion support is maintained

### AC5: Hover state preparation
**Given** an ArticleListItem on desktop
**When** hovered
**Then** title becomes underlined or shows subtle highlight
**And** component exposes hover state for Story 14.8 thumbnail integration
**And** cursor indicates clickable element

### AC6: Accessibility requirements
**Given** the ArticleListItem component
**When** used with assistive technology
**Then** each item is a semantic link to the article
**And** date is properly associated with the article
**And** keyboard navigation works correctly
**And** focus states are visible

## Tasks / Subtasks

- [ ] **Task 1: Create ArticleListItem component** (AC: 1, 5, 6)
  - [ ] 1.1 Create `src/ui/molecules/ArticleListItem/index.tsx`
  - [ ] 1.2 Create `src/ui/molecules/ArticleListItem/ArticleListItem.types.ts`
  - [ ] 1.3 Create `src/ui/molecules/ArticleListItem/styles.css`
  - [ ] 1.4 Implement left border accent with theme color
  - [ ] 1.5 Implement title + date layout
  - [ ] 1.6 Export hover state for Story 14.8 integration

- [ ] **Task 2: Implement responsive styles** (AC: 2, 3)
  - [ ] 2.1 Desktop: title left, date right (same row)
  - [ ] 2.2 Mobile: title above, date below (stacked)
  - [ ] 2.3 Ensure adequate touch targets on mobile
  - [ ] 2.4 Use project breakpoints from Epic 11

- [ ] **Task 3: Update Articles page** (AC: 4)
  - [ ] 3.1 Replace grid structure with list structure in page.tsx
  - [ ] 3.2 Replace GridArticleCard with ArticleListItem
  - [ ] 3.3 Keep ArticleAppearance wrapper for sequential animations
  - [ ] 3.4 Update section heading to "All Articles"
  - [ ] 3.5 Update CSS classes from grid to list

- [ ] **Task 4: Update/create tests** (AC: 1-6)
  - [ ] 4.1 Create ArticleListItem unit tests
  - [ ] 4.2 Update ArticlesPageLayout tests for list format
  - [ ] 4.3 Test responsive behavior
  - [ ] 4.4 Test accessibility (semantic structure, focus)
  - [ ] 4.5 Test sequential appearance still works

- [ ] **Task 5: Cleanup** (AC: N/A)
  - [ ] 5.1 Verify GridArticleCard is not used elsewhere
  - [ ] 5.2 Add deprecation note to GridArticleCard if needed
  - [ ] 5.3 Update articles page styles.css

## Dev Notes

### Design Reference

From `_bmad-output/implementation-artifacts/ux-design-behavior/04-articles/`:
- `06-3rd-blade | All articles transition 4.png` - Desktop list view
- `07-all-articles-hover-effect.png` - Hover with thumbnail
- `11-all-articles-blade-[animation].png` - Mobile view (iPhone SE)

**Desktop design:**
```
┌─────────────────────────────────────────────────────────────┐
│ ▌ Form Validation In Reactjs: Build A Reusable...  Jan 27, 2023 │
├─────────────────────────────────────────────────────────────┤
│ ▌ Silky Smooth Scrolling In Reactjs...              Jan 30, 2023 │
├─────────────────────────────────────────────────────────────┤
│ ▌ Creating An Efficient Modal Component...          Jan 29, 2023 │
└─────────────────────────────────────────────────────────────┘
```

**Mobile design (stacked):**
```
┌─────────────────────────┐
│ ▌ Form Validation In    │
│   Reactjs: Build A      │
│   Reusable Custom Hook  │
│   January 27, 2023      │
├─────────────────────────┤
│ ▌ Silky Smooth          │
│   Scrolling In Reactjs  │
│   January 30, 2023      │
└─────────────────────────┘
```

### CSS Variables to use

```css
/* From project theme */
--color-accent: /* magenta/pink for border and date */
--spacing-md: /* gap between items */
--font-size-body: /* title size */
--font-size-sm: /* date size */
```

### Component placement

Place in `molecules` (not `organisms`) because:
- Simpler than ArticleCard (no image, no summary)
- Single responsibility (list item display)
- Composes with ArticleAppearance atom

```
src/ui/molecules/ArticleListItem/
├── index.tsx
├── ArticleListItem.types.ts
├── styles.css
└── __tests__/ArticleListItem.test.tsx
```

### Integration with existing code

**Keep:**
- `ArticleAppearance` wrapper for animations
- `useScrollAppearance` hook (no changes)
- `useTouchState` for mobile interactions
- FeaturedArticleCard for hero blade

**Replace:**
- `GridArticleCard` usage → `ArticleListItem`
- `.articles-grid` CSS → `.articles-list` CSS

### Hover thumbnail (Story 14.8 dependency)

This story prepares hover state but does NOT implement thumbnail.
Story 14.8 will add:
- Thumbnail image that appears on hover
- Mouse-follow behavior (desktop)
- Simple box on mobile

ArticleListItem should expose:
```typescript
interface ArticleListItemProps {
  article: Article;
  onHoverChange?: (isHovered: boolean, rect: DOMRect) => void;
}
```

### References

- [Source: epics-v2.md line 529] - "Featured blade + list"
- [Source: spec-[curated].md lines 293-298] - All Articles blade spec
- [Source: 04-articles/*.png] - Design reference images
- [Source: Story 14.7] - Sequential appearance (to integrate with)
- [Source: Story 14.8] - Hover thumbnail (future integration)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

