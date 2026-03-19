# Tasks: Projects Incoming Pagination

## Phase 1: Foundation

- [x] 1.1 Add pagination constants and helpers in `src/app/projects/page.tsx` (`PAGE_SIZE`, `parsePageParam`, `isIncomingProject`, `getOrderedProjects`).
- [x] 1.2 Define page-derived values in `src/app/projects/page.tsx` (`page`, `totalPages`, `pageSliceStart`, `pageSliceEnd`).

## Phase 2: Core Implementation

- [x] 2.1 Update ordering pipeline in `src/app/projects/page.tsx` to apply featured->incoming->standard partitioning before pagination.
- [x] 2.2 Apply pagination slice in `src/app/projects/page.tsx` before blade pairing and ensure count copy uses total filtered size.
- [x] 2.3 Render `ImageRibbon` in `src/ui/organisms/ProjectCard/variants/Grid.tsx` using `project.featuredCard?.ribbon` inside the image container.
- [x] 2.4 Adjust ribbon positioning rules in `src/ui/organisms/ProjectCard/styles.css` for grid image layout.
- [x] 2.5 Add pagination layout styles in `src/app/projects/styles.css` for `.projects-pagination`, buttons, and page list.

## Phase 3: Integration / Wiring

- [x] 3.1 Implement pagination controls in `src/app/projects/page.tsx` (Previous/Next + page buttons) with `aria-label` and disabled states.
- [x] 3.2 Preserve existing `tech` filter params when updating `page` in `src/app/projects/page.tsx` (use `useSearchParams` + router push).
- [x] 3.3 Reset or clamp page to 1 on filter changes in `src/app/projects/page.tsx` to avoid empty grids after filter updates.

## Phase 4: Testing / Verification

- [x] 4.1 Update `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` for ribbon scenarios: appears with metadata, absent without, text matches metadata.
- [x] 4.2 Update `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` for ordering scenarios: featured first, incoming next, stable order within groups.
- [x] 4.3 Add pagination tests in `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` for page slice after filters and out-of-range page yields empty grid.
- [x] 4.4 Add URL persistence tests in `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` for page updates preserving `tech` params and defaulting to page 1 when missing.
- [x] 4.5 Add count copy tests in `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` for total filtered count and zero-results state.
