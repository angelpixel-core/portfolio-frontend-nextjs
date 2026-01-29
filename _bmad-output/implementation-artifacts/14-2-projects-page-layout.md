# Story 14.2: Projects Page Layout

Status: done

## Story

As a **portfolio visitor**,
I want **the projects page to have a clear visual hierarchy with featured project prominent and non-featured projects in a responsive grid**,
so that **I can quickly identify the main project and browse others efficiently on any device**.

## Acceptance Criteria

### AC1: Featured project occupies complete first blade (FR14.2)
**Given** a project with `featured: true`
**When** the projects page renders
**Then** the featured project occupies a complete blade (full viewport height on mobile)
**And** on desktop, featured project takes full width within content max-width (1024px)
**And** featured project is visually prominent with larger image and summary text

### AC2: Technology filter is horizontal and compact (User Feedback)
**Given** the TechnologyFilter component
**When** rendered on the projects page
**Then** filter chips display horizontally with `flex-wrap`
**And** filter takes `col-span-12` in the grid (full width)
**And** filter fits in first blade along with page title
**And** "Clear All" button appears inline when filters are selected

### AC3: Non-featured projects in responsive grid (FR14.3)
**Given** non-featured projects
**When** rendering on mobile (< 640px)
**Then** projects display 2 per blade (stacked vertically)
**And** each project card fits within blade without being cut off
**When** rendering on desktop (≥ 1024px)
**Then** projects display in free grid layout (2-3 columns)
**And** no snap scrolling is applied

### AC4: Layout handles variable project counts (FR14.7)
**Given** projects data with 1, 3, or 6 projects
**When** rendering the page
**Then** layout adapts gracefully without breaking
**And** empty states show appropriate message
**And** no layout shift when projects load

### AC5: Maximum 6 projects visible (FR14.1)
**Given** the projects page
**When** data contains more than 6 projects
**Then** only first 6 are displayed
**And** no pagination or scroll-infinite is implemented
**And** featured projects are prioritized in the limit

### AC6: Blade-based scroll on mobile (UX Spec 0.2)
**Given** mobile viewport (< 640px)
**When** user scrolls
**Then** scroll behavior is blade-based (snap to section boundaries)
**And** cards are never cut off at blade boundaries
**And** first blade contains: title, filter, featured project

## Tasks / Subtasks

- [x] **Task 1: Fix TechnologyFilter grid placement** (AC: 2)
  - [x] 1.1 Add `col-span-12` wrapper around TechnologyFilter in page.tsx
  - [x] 1.2 Verify filter takes full width in 12-column grid
  - [x] 1.3 Ensure filter remains horizontally laid out with `flex-wrap`

- [x] **Task 2: Restructure page for blade layout** (AC: 1, 6)
  - [x] 2.1 Create blade containers: `projects-blade--hero`, `projects-blade--grid`
  - [x] 2.2 Hero blade contains: title + filter + featured project
  - [x] 2.3 Grid blade contains: non-featured projects
  - [x] 2.4 Add `scroll-snap-align: start` on mobile blades

- [x] **Task 3: Implement featured project full-blade layout** (AC: 1)
  - [x] 3.1 Featured container takes full blade height on mobile
  - [x] 3.2 Featured maintains max-width constraint on desktop
  - [x] 3.3 Featured has visual prominence (existing styles preserved)

- [x] **Task 4: Implement non-featured grid layout** (AC: 3)
  - [x] 4.1 Mobile: 2 projects per blade (1 column, 2 rows per blade)
  - [x] 4.2 Desktop: 2-3 column grid with gap
  - [x] 4.3 Reduce excessive gaps (current `gap-24 gap-y-32` is too large)
  - [x] 4.4 Test at breakpoints: 376px, 640px, 1024px

- [x] **Task 5: Implement 6-project limit** (AC: 5)
  - [x] 5.1 Slice filtered projects to max 6
  - [x] 5.2 Prioritize featured projects in the limit
  - [x] 5.3 Update count message to reflect limit

- [x] **Task 6: Handle edge cases** (AC: 4)
  - [x] 6.1 Test with 0, 1, 3, 6 projects
  - [x] 6.2 Test with all featured, no featured, mixed
  - [x] 6.3 Verify no layout shift on data load

- [x] **Task 7: Update/add unit tests** (AC: all)
  - [x] 7.1 Test blade structure renders correctly
  - [x] 7.2 Test 6-project limit
  - [x] 7.3 Test filter placement
  - [x] 7.4 Snapshot tests for layout variants

- [x] **Task 8: Fix transition flash on first navigation** (Bug fix)
  - [x] 8.1 Diagnose root cause: React state batching issue with `isInitialLoad`
  - [x] 8.2 Change `useState` to `useRef` for `isInitialLoad` in TransitionProvider
  - [x] 8.3 Update context value to read from ref
  - [x] 8.4 Verify 63 transition tests still pass

## Dev Notes

### Previous Story Intelligence (14.1)

From Story 14.1 code review:
- **ProjectCard component** is already TypeScript with variants (Featured, Grid)
- **Icon className issue**: Icons require `className=""` prop when used
- **Prettier/ESLint**: Run `prettier --write` before commit
- **Testing patterns**: Use `@testing-library/react`, mock Next.js Link

**File patterns established:**
```
src/ui/organisms/ProjectCard/
├── index.tsx           # Auto-selects variant
├── variants/Featured.tsx
├── variants/Grid.tsx
└── styles.css          # BEM naming
```

### Current Implementation Analysis

**Page structure (page.tsx):**
```tsx
<div className="projects-content">     // 12-col grid
  <TechnologyFilter />                  // NO col-span = defaults to 1 col!
  <p className="projects-count">...</p> // col-span-12
  {projects.map(p => (
    <div className={project.featured
      ? "project_container--feat"       // col-span-12
      : "project_container"}>           // col-span-6 / sm:col-span-12
      <ProjectCard project={p} />
    </div>
  ))}
</div>
```

**Current CSS issues (styles.css):**
```css
.projects-content {
  @apply grid grid-cols-12
  gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0;
  /* ⚠️ Gap is too large - pushes content apart */
}
```

### Architecture Requirements

**From UX Spec (Section 0.2 Scroll Rules):**
- Mobile: blade-based scroll, blades = 100vh
- Desktop: free scroll, no snap
- Cards never cut off at blade boundaries

**From UX Spec (Section 3 Projects):**
- Featured: full blade (mobile & desktop)
- Non-featured mobile: 2 per blade
- Non-featured desktop: free grid
- Max 6 projects, no pagination

### Proposed Blade Structure

```tsx
// Hero Blade (first blade)
<section className="projects-blade projects-blade--hero">
  <h1 className="projects-title">Projects</h1>
  <TechnologyFilter ... />
  {featuredProject && (
    <ProjectCard project={featuredProject} />
  )}
</section>

// Grid Blade (remaining projects)
<section className="projects-blade projects-blade--grid">
  {nonFeaturedProjects.map(p => (
    <ProjectCard project={p} />
  ))}
</section>
```

### CSS Approach

```css
/* Blade container */
.projects-blade {
  @apply min-h-screen; /* 100vh on mobile */
}

@media (min-width: 1024px) {
  .projects-blade {
    @apply min-h-0; /* Remove on desktop */
  }
}

/* Mobile scroll snap */
@media (max-width: 639px) {
  .projects-content {
    scroll-snap-type: y mandatory;
  }
  .projects-blade {
    scroll-snap-align: start;
  }
}
```

### Breakpoints Reference

From Epic 11 (project breakpoints):
- `xs`: 0-375px (min supported)
- `sm`: 376-639px (mobile)
- `md`: 640-767px (tablet/compact desktop)
- `lg`: 768-1023px (desktop)
- `xl`: 1024px+ (wide desktop)
- `2xl`: 1280px+ (ultrawide)

### References

- [Source: epics-v2.md#FR14.1] - Max 6 proyectos, sin paginación
- [Source: epics-v2.md#FR14.2] - Featured project ocupa blade completo
- [Source: epics-v2.md#FR14.3] - Non-featured en grid (mobile: 2/blade, desktop: libre)
- [Source: epics-v2.md#FR14.7] - Layout preparado para crecer
- [Source: ux-spec#0.2] - Scroll rules: blade-based mobile, free desktop
- [Source: ux-spec#Projects] - Featured full blade, non-featured grid
- [Source: 14-1-project-card-component.md#Notes-for-Story-14.2] - TechnologyFilter feedback

### Testing Patterns

```typescript
// From existing tests
import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function renderPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <ProjectsPage />
    </QueryClientProvider>
  );
}

describe("Projects Page Layout", () => {
  it("limits to 6 projects maximum", () => {
    // Mock 10 projects
    // Verify only 6 rendered
  });

  it("renders filter with full width", () => {
    renderPage();
    const filter = screen.getByRole("group", { name: /filter by technology/i });
    // Verify col-span-12 or equivalent
  });
});
```

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - straightforward implementation

### Completion Notes List

1. **Task 1-2 (Blade restructure)**: Completely restructured page.tsx with hero and grid blades. Hero blade contains title, filter wrapper and featured project (AC6 compliance). Grid blade contains non-featured projects.

2. **Task 3 (Featured layout)**: Featured project now renders in `.projects-blade__featured` container with desktop max-width constraint. Mobile: featured fills remaining blade space with flex-1.

3. **Task 4 (Grid layout)**: Implemented responsive grid using `auto-fill, minmax(320px, 1fr)`. Reduced gap from `gap-24 gap-y-32` to `gap-8`. Mobile shows single column, tablet 2 columns, desktop 2-3 columns.

4. **Task 5 (6-project limit)**: Implemented MAX_PROJECTS=6 constant. Featured projects prioritized via sorting before slicing. Count message updated to show "(max 6 shown)" when applicable.

5. **Task 6 (Edge cases)**: All edge cases covered by unit tests - 0, 1, 3, 6 projects; all featured; no featured; mixed.

6. **Task 7 (Unit tests)**: Added 14 new tests in ProjectsPageLayout.test.tsx covering 6-project limit, variable project counts, multiple featured prioritization, and grid layout. Updated existing test for count message change and hero blade structure. Total: 66 project-related tests passing.

7. **Task 8 (Transition flash fix)**: Fixed bug where first navigation showed a "flash" instead of smooth curtain animation. Root cause was React state batching: `setIsInitialLoad(false)` was batched with `setState`, causing `TransitionEffect` to read stale `isInitialLoad=true` during first "entering" phase. Fix: Changed `isInitialLoad` from `useState` to `useRef` for synchronous updates. 63 transition tests still passing.

8. **Code Review Fixes (2026-01-29)**:
   - Fixed AC6 violation: Moved title from layout.jsx to hero blade in page.tsx
   - Fixed AC1 violation: Adjusted CSS so featured project fills blade space on mobile
   - Added explicit desktop min-height rule (min-h-0) for hero blade
   - Improved test for multiple featured projects prioritization
   - Updated File List to include layout.jsx changes

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with comprehensive context from 14.1 learnings | SM Agent (Opus 4.5) |
| 2026-01-29 | Implemented all 7 tasks: blade layout, 6-project limit, responsive grid, 13 new tests | Dev Agent (Opus 4.5) |
| 2026-01-29 | Task 8: Fixed transition flash bug on first navigation (useState→useRef) | Dev Agent (Opus 4.5) |

### File List

**Modified:**
- `src/app/projects/page.tsx` - Restructured for blade layout, added 6-project limit with featured prioritization, moved title to hero blade (AC6)
- `src/app/projects/layout.jsx` - Removed title from layout (moved to hero blade in page.tsx)
- `src/app/projects/styles.css` - Added blade styles, responsive grid, reduced gaps, desktop min-height rule
- `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` - Added Story 14.2 layout tests, improved hero blade structure validation
- `src/app/projects/__tests__/ProjectsPageLayout.test.tsx` - Added test for multiple featured projects prioritization
- `src/state/providers/TransitionProvider/index.tsx` - Fixed isInitialLoad state batching bug (useState→useRef)

**Created:**
- `src/app/projects/__tests__/ProjectsPageLayout.test.tsx` - New test file for 6-project limit and edge cases
