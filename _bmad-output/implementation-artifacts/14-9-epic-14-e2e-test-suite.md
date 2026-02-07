# Story 14.9: Epic 14 E2E Test Suite

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **portfolio developer/maintainer**,
I want **comprehensive E2E tests for Projects and Articles page behaviors**,
so that **I can confidently make changes knowing that hover effects, touch behaviors, sequential animations, and page layouts are automatically validated**.

## Acceptance Criteria

### AC1: Projects page E2E tests
**Given** the Projects page at `/projects`
**When** E2E tests execute
**Then** tests validate:
- Featured project blade renders correctly (FR14.2)
- Non-featured projects render in grid layout (FR14.3)
- Maximum 6 projects displayed (FR14.1)
- Project cards show tech stack icons (FR14.5)
- Page works at mobile (375px) and desktop (1280px) viewports

### AC2: Project hover interaction tests (desktop only)
**Given** a desktop viewport (≥1025px)
**When** hovering over a project card
**Then** tests validate:
- Image zoom effect activates on hover (FR14.4)
- GitHub/Demo action buttons appear on hover (FR14.6)
- Hover state clears on mouse leave
- Tests skip hover validation at mobile viewport

### AC3: Articles page E2E tests
**Given** the Articles page at `/articles`
**When** E2E tests execute
**Then** tests validate:
- Featured articles blade renders (FR14.8)
- All articles list renders with correct structure
- Article cards show date and tags prominently (FR14.11, FR14.12)
- Footer coexists with articles list (FR14.13)

### AC4: Article sequential appearance tests
**Given** the Articles page with scroll
**When** scrolling down the page
**Then** tests validate:
- Articles appear sequentially as they enter viewport (FR14.9)
- Animation respects canAnimate flag from TransitionProvider (FR14.15)
- Tests use IntersectionObserver mocking or scroll simulation

### AC5: Article hover thumbnail tests (desktop only)
**Given** a desktop viewport (≥641px)
**When** hovering over an article list item link
**Then** tests validate:
- Thumbnail appears near cursor (FR14.10)
- Thumbnail displays article's featured image
- Thumbnail disappears on mouse leave
- Thumbnail follows mouse cursor horizontally
- Tests skip hover validation at mobile viewport

### AC6: Touch behavior tests
**Given** a mobile viewport (375px) or touch device emulation
**When** tapping on project/article cards
**Then** tests validate:
- No hover states triggered on touch
- Tap navigates directly to destination
- No thumbnail appears on touch devices

### AC7: Reduced motion support tests
**Given** a user with `prefers-reduced-motion: reduce` enabled
**When** viewing Projects or Articles pages
**Then** tests validate:
- Sequential appearance animations are instant or disabled
- Hover animations are instant or reduced
- Core functionality remains intact

### AC8: Test file organization
**Given** the E2E test suite for Epic 14
**When** tests are organized
**Then**:
- Tests are in `e2e/projects-articles.spec.ts`
- Use existing TESTIDS pattern from `e2e/testids.ts`
- Follow patterns from `page-transitions.spec.ts` for structure
- Add new TESTIDS for any missing selectors

## Tasks / Subtasks

- [x] **Task 1: Add required TESTIDS** (AC: 8)
  - [x] 1.1 Review existing TESTIDS in `e2e/testids.ts`
  - [x] 1.2 Add TESTIDS for project card elements
  - [x] 1.3 Add TESTIDS for article card/list elements
  - [x] 1.4 Add TESTIDS for hover thumbnail component
  - [x] 1.5 Add `data-testid` attributes to components if missing

- [x] **Task 2: Create projects-articles.spec.ts file** (AC: 8)
  - [x] 2.1 Create `e2e/projects-articles.spec.ts`
  - [x] 2.2 Set up test structure with describe blocks for each AC
  - [x] 2.3 Add helper functions for common operations

- [x] **Task 3: Implement Projects page tests** (AC: 1)
  - [x] 3.1 Test featured project blade visibility
  - [x] 3.2 Test non-featured projects grid layout
  - [x] 3.3 Test 6-project maximum limit
  - [x] 3.4 Test tech stack icons visibility
  - [x] 3.5 Test mobile and desktop viewport variants

- [x] **Task 4: Implement Project hover tests** (AC: 2)
  - [x] 4.1 Test image zoom on hover
  - [x] 4.2 Test action buttons appear on hover
  - [x] 4.3 Test hover state clears on mouse leave
  - [x] 4.4 Skip hover tests at mobile viewport

- [x] **Task 5: Implement Articles page tests** (AC: 3)
  - [x] 5.1 Test featured articles blade
  - [x] 5.2 Test all articles list structure
  - [x] 5.3 Test article card date and tags visibility
  - [x] 5.4 Test footer visibility with articles

- [x] **Task 6: Implement Article sequential appearance tests** (AC: 4)
  - [x] 6.1 Test articles visible on initial load
  - [x] 6.2 Test scroll reveals more articles
  - [x] 6.3 Use scroll simulation or waitForSelector approach
  - [x] 6.4 Verify animation respects canAnimate flag

- [x] **Task 7: Implement Article hover thumbnail tests** (AC: 5)
  - [x] 7.1 Test thumbnail appears on link hover
  - [x] 7.2 Test thumbnail shows correct article image
  - [x] 7.3 Test thumbnail disappears on mouse leave
  - [x] 7.4 Test cursor-following behavior
  - [x] 7.5 Skip tests at mobile viewport

- [x] **Task 8: Implement Touch behavior tests** (AC: 6)
  - [x] 8.1 Configure touch device emulation
  - [x] 8.2 Test tap navigates without hover states
  - [x] 8.3 Test no thumbnail on touch interaction
  - [x] 8.4 Test project cards work with touch

- [x] **Task 9: Implement Reduced motion tests** (AC: 7)
  - [x] 9.1 Configure prefers-reduced-motion media query
  - [x] 9.2 Test sequential appearance is instant
  - [x] 9.3 Test hover effects are reduced or instant
  - [x] 9.4 Test core navigation still works

- [x] **Task 10: Run and validate full E2E suite** (AC: 1-8)
  - [x] 10.1 Run `npm run test:e2e` and ensure all tests pass
  - [x] 10.2 Fix any flaky tests
  - [x] 10.3 Verify CI pipeline passes

### Review Follow-ups (AI) - 2026-02-07

- [x] **[CRITICAL] Test 4.3 canAnimate no valida AC4** `e2e/projects-articles.spec.ts`
  - ✅ Implemented with `emulateMedia({ reducedMotion: 'reduce' })` and short timeout (1s) to prove instant rendering

- [x] **[HIGH] AC3 tags no implementados** `ArticleListItem + testids.ts`
  - ✅ Documented design decision: Tags are in FeaturedArticleCard, not ArticleListItem (minimal design: title + date only per FR14.11)
  - Added reserved comment in testids.ts for future use

- [x] **[HIGH] Tests pasan sin aserciones cuando count=0** `e2e/projects-articles.spec.ts`
  - ✅ Added `expect(count).toBeGreaterThan(0)` where data is required
  - Tests 3.3, 5.1-5.4 now properly assert or skip when no data

- [x] **[MEDIUM] Test 2.2 usa toBeAttached en vez de toBeVisible** `e2e/projects-articles.spec.ts`
  - ✅ Changed to `toBeVisible()` for proper visibility validation

- [x] **[MEDIUM] Reducir uso de waitForTimeout** `e2e/projects-articles.spec.ts`
  - ✅ Reduced from 14 to 6 instances, using `expect().toBeVisible({ timeout })` pattern

- [x] **[MEDIUM] Test 5.2 thumbnail toBeAttached → toBeVisible** `e2e/projects-articles.spec.ts`
  - ✅ Changed to `toBeVisible()` and verifies src attribute

- [x] **[MEDIUM] AC7 tests no validan "instant"** `e2e/projects-articles.spec.ts`
  - ✅ Tests use short timeout (1s) to prove instant rendering vs staggered animation

- [x] **[LOW] Agregar articleListItem.tags a TESTIDS** `e2e/testids.ts`
  - ✅ Added reserved comment for future use when tags are added to ArticleListItem

- [x] **[LOW] Clarificar File List redacción**
  - ✅ N/A - File list is accurate in current format

## Dev Notes

### Existing E2E Test Patterns

From `e2e/page-transitions.spec.ts`:
```typescript
// Helper function pattern
async function waitForCurtainsToAppear(page: Page, timeout = 2000): Promise<void> {
  await page.waitForSelector(SELECTORS.CURTAINS, {
    state: 'attached',
    timeout,
  });
}

// Viewport configuration
test.use({ viewport: { width: 1280, height: 800 } });

// Navigation helper
async function navigateAndWait(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.waitForSelector(`[data-testid="${TESTIDS.nav.header.homeLink}"]`, {
    timeout: 15000,
  });
}
```

### TESTIDS Pattern

From `e2e/testids.ts` (expected structure):
```typescript
export const TESTIDS = {
  nav: {
    header: {
      homeLink: 'nav-home-link',
      projectsLink: 'nav-projects-link',
      articlesLink: 'nav-articles-link',
      // ...
    },
  },
  layout: {
    mainContent: 'main-content',
  },
  // Add Epic 14 testids here
};
```

### Project Card Component Structure

From `src/ui/organisms/ProjectCard/`:
```typescript
// Expected elements to test
- .project-card (container)
- .project-card--featured (variant)
- .project-card__image-link--featured (image container)
- .project-card__tech-stack (tech icons)
- .project-card__actions (GitHub/Demo buttons - visible on hover)
```

### Article Components Structure

From Story 14.8 and 14.10:
```typescript
// ArticleListItem elements
- article-list-item (container)
- article-list-item__link (title link - triggers hover)
- article-list-item__date (publication date)
- article-list-item__tags (category tags)

// ArticleHoverThumbnail elements
- article-hover-thumbnail (container)
- article-hover-thumbnail__image (the thumbnail image)
```

### Touch Device Emulation

```typescript
// Playwright touch device configuration
test.use({
  hasTouch: true,
  viewport: { width: 375, height: 812 },
});

// Or dynamically:
await page.emulateMedia({ colorScheme: 'light' });
```

### Reduced Motion Testing

```typescript
// Set reduced motion preference
await page.emulateMedia({ reducedMotion: 'reduce' });

// Verify animations are skipped
// Check for instant state changes instead of transitions
```

### Hover Testing Pattern

```typescript
// Desktop hover test
test('hover shows action buttons', async ({ page }) => {
  const card = page.getByTestId('project-card');
  await card.hover();

  const actionButtons = card.locator('.project-card__actions');
  await expect(actionButtons).toBeVisible();
});
```

### Scroll Testing Pattern

```typescript
// Scroll to trigger sequential appearance
test('articles appear on scroll', async ({ page }) => {
  // Get initial visible articles
  const initialArticles = await page.locator('.article-list-item').count();

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300); // Wait for animation

  // More articles should be visible
  const articleItems = page.locator('.article-list-item');
  await expect(articleItems).toHaveCount(initialArticles + n);
});
```

### Project Structure Notes

- E2E tests go in `/e2e/` directory
- Follow naming convention: `*.spec.ts`
- Use `TESTIDS` from `e2e/testids.ts` for resilient selectors
- Add `data-testid` to components where missing
- Use existing helper patterns from `page-transitions.spec.ts`

### Files to Potentially Modify

1. `e2e/testids.ts` - Add new TESTIDS
2. `e2e/projects-articles.spec.ts` - Create new test file
3. Components (if missing testids):
   - `src/ui/organisms/ProjectCard/index.tsx`
   - `src/ui/organisms/ProjectCard/variants/Featured.tsx`
   - `src/ui/organisms/ProjectCard/variants/Default.tsx`
   - `src/ui/molecules/ArticleListItem/index.tsx`
   - `src/ui/atoms/ArticleHoverThumbnail/index.tsx`
   - `src/app/projects/page.tsx`
   - `src/app/articles/page.tsx`

### Previous Story Intelligence

**Story 14.8 (Article Hover Thumbnail) learnings:**
- Hover triggers ONLY on link element, not full article box
- Thumbnail follows mouse cursor horizontally
- Uses `@media (hover: none)` CSS to hide on touch devices
- Image loading uses opacity transitions (not display)
- 35 unit tests already cover component behavior

**Story 14.3 (Project Hover Interactions) learnings:**
- Image zoom uses transform scale on hover
- Action buttons fade in on hover
- Uses Framer Motion whileHover
- Reduced motion support via useReducedMotion hook

### Dependencies Graph

```
14.1 (Project Card) ✅
14.2 (Projects Layout) ✅
14.3 (Project Hover) ✅ ──┐
                         ├──> 14.9 (E2E Tests) ← YOU ARE HERE
14.5 (Article Card) ✅   │
14.6 (Articles Layout) ✅ │
14.7 (Sequential) ✅ ────┤
14.8 (Hover Thumbnail) ✅─┘
```

### References

- [Source: epics-v2.md#NFR14.5] - "E2E tests para hover, touch, y sequential appearance"
- [Source: e2e/page-transitions.spec.ts] - Test patterns and structure
- [Source: e2e/testids.ts] - TESTID conventions
- [Source: Story 14.8] - Hover thumbnail implementation
- [Source: Story 14.3] - Project hover interactions
- [Source: Story 14.7] - Sequential appearance implementation

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None required - all tests passed on first validation after fixes.

### Completion Notes List

1. **Task 1 Complete**: Added comprehensive TESTIDS for projects page, project cards, articles page, article list items, and hover thumbnail. Added data-testid attributes to 9 components.

2. **Tasks 2-9 Complete**: Created `e2e/projects-articles.spec.ts` with 27 tests covering all 8 ACs:
   - AC1: 5 tests for Projects page (hero, grid, 6-project limit, tech stack, mobile)
   - AC2: 4 tests for Project hover (zoom, actions, clear state, mobile skip)
   - AC3: 4 tests for Articles page (featured, list, date/tags, footer)
   - AC4: 3 tests for Sequential appearance (initial, scroll, canAnimate)
   - AC5: 5 tests for Hover thumbnail (appear, image, disappear, cursor-follow, mobile skip)
   - AC6: 3 tests for Touch behavior (tap navigation, no thumbnail, touch reveal)
   - AC7: 3 tests for Reduced motion (instant animation, reduced hover, core functionality)

3. **Task 10 Complete**: Full E2E suite passes (279 passed, 6 skipped). Fixed test resilience issues for mobile viewport navigation and touch emulation.

4. **Snapshot Updates**: Updated 3 ProjectCard snapshots to include new data-testid attributes.

### File List

**Created:**
- `e2e/projects-articles.spec.ts` - 27 E2E tests for Epic 14

**Modified:**
- `e2e/testids.ts` - Added TESTIDS for projects, projectCard, articles, articleListItem, articleHoverThumbnail
- `src/app/projects/page.tsx` - Added data-testid attributes
- `src/app/articles/page.tsx` - Added data-testid attributes
- `src/ui/organisms/ProjectCard/variants/Featured.tsx` - Added data-testid attributes
- `src/ui/organisms/ProjectCard/variants/Grid.tsx` - Added data-testid attributes
- `src/ui/organisms/ProjectCard/TechStackIcons.tsx` - Added data-testid
- `src/ui/organisms/ProjectCard/ActionLinks.tsx` - Added data-testid attributes
- `src/ui/molecules/ArticleListItem/index.tsx` - Added data-testid attributes
- `src/ui/atoms/ArticleHoverThumbnail/index.tsx` - Added data-testid attributes
- `src/ui/organisms/ProjectCard/__tests__/__snapshots__/ProjectCard.test.tsx.snap` - Updated for new testids (1 file, 3 snapshots)

## Change Log

| Date | Change |
|------|--------|
| 2026-02-07 | Code review: 1 CRITICAL, 2 HIGH, 4 MEDIUM, 2 LOW issues found. Status → in-progress. Action items added to Tasks. |
