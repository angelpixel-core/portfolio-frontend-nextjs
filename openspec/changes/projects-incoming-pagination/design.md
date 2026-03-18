# Design: Projects Incoming Pagination

## Technical Approach

Update the Projects page client-side pipeline to: filter projects by tech, order by featured then incoming (ribbon text), paginate the ordered list using a `page` query param, and finally build blade pairs from the page slice. Reuse the existing `ProjectFeaturedCard.ribbon` model and `ImageRibbon` component to render ribbons in grid cards, and extend Projects page styles to include pagination controls and count copy aligned with the new paging behavior.

## Architecture Decisions

### Decision: Reuse existing ribbon model + ImageRibbon in grid cards

**Choice**: Render `ImageRibbon` inside `GridProjectCard` using `project.featuredCard?.ribbon`.
**Alternatives considered**: Create a new grid-specific ribbon model or duplicate ribbon markup in `GridProjectCard`.
**Rationale**: The ribbon schema and UI already exist, ensuring consistent rendering and minimizing new data shape or styling changes.

### Decision: Partition-based ordering for featured/incoming/standard

**Choice**: Build ordered arrays via stable partitioning: featured first, then incoming (non-featured with ribbon text "Incoming"), then standard non-featured.
**Alternatives considered**: Custom `Array.sort` comparator or multiple sorts with inferred stability.
**Rationale**: Partitioning preserves the existing order within each priority group and avoids relying on engine sort stability.

### Decision: Client-side pagination using URL `page` param

**Choice**: Parse `page` from `useSearchParams` with a default of 1, compute `totalPages`, and slice the ordered list accordingly; update the URL with `page` while preserving `tech` filters.
**Alternatives considered**: Internal component state for page, or server-driven pagination.
**Rationale**: Specs require URL persistence and no server changes; keeping paging in the query string maintains shareable state.

### Decision: Reset page on filter changes

**Choice**: When filters change, clear or set `page=1` to avoid showing empty pages caused by out-of-range paging.
**Alternatives considered**: Preserve current page even if out-of-range.
**Rationale**: Improves UX by preventing blank grids after filter changes while keeping the URL consistent.

## Data Flow

Projects query data flows through a predictable pipeline:

    useProjects() -> full list
         |
         v
    filter by tech (URL `tech` params)
         |
         v
    order by priority (featured -> incoming -> standard)
         |
         v
    paginate by `page` (URL param)
         |
         v
    build blade pairs (featured + grid items)
         |
         v
    render blades + pagination controls

## File Changes

| File                                                          | Action | Description                                                                                               |
| ------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `src/app/projects/page.tsx`                                   | Modify | Add pagination state from URL, incoming-first ordering, total count copy, and blade pairing after paging. |
| `src/app/projects/styles.css`                                 | Modify | Add pagination layout styles near the grid blade and update count copy spacing if needed.                 |
| `src/ui/organisms/ProjectCard/variants/Grid.tsx`              | Modify | Render `ImageRibbon` inside the grid card image link when ribbon metadata exists.                         |
| `src/ui/organisms/ProjectCard/styles.css`                     | Modify | Ensure ribbon placement works with grid image layout (positioning/spacing adjustments).                   |
| `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx`   | Modify | Add coverage for pagination behavior, ordering, and count copy (page vs total).                           |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | Modify | Add grid variant ribbon rendering test.                                                                   |

## Interfaces / Contracts

New helpers in `src/app/projects/page.tsx` (names may vary):

```ts
type ProjectPriorityGroup = "featured" | "incoming" | "standard";

const PAGE_SIZE = 6;

const isIncomingProject = (project: ProjectModel): boolean => {
  const label = project.featuredCard?.ribbon?.text?.trim().toLowerCase();
  return label === "incoming";
};

const getOrderedProjects = (projects: ProjectModel[]): ProjectModel[] => {
  const featured: ProjectModel[] = [];
  const incoming: ProjectModel[] = [];
  const standard: ProjectModel[] = [];

  projects.forEach((project) => {
    if (project.featured) featured.push(project);
    else if (isIncomingProject(project)) incoming.push(project);
    else standard.push(project);
  });

  return [...featured, ...incoming, ...standard];
};

const parsePageParam = (value: string | null): number => {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
};
```

Pagination UI contract (within `ProjectsContent`):

```tsx
<nav className="projects-pagination" aria-label="Projects pagination">
  <button className="projects-pagination__button" disabled={page <= 1}>
    Previous
  </button>
  <div className="projects-pagination__pages">{/* page buttons */}</div>
  <button className="projects-pagination__button" disabled={page >= totalPages}>
    Next
  </button>
</nav>
```

## Testing Strategy

| Layer       | What to Test                                      | Approach                                                                                                |
| ----------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Unit        | Ordering rules (featured -> incoming -> standard) | Add tests in `ProjectsPageFiltering.test.tsx` using mocked data to verify order.                        |
| Integration | Pagination + URL params                           | Simulate `page` in `useSearchParams`, assert slice size and `router.push` calls preserve `tech` params. |
| E2E         | Projects page paging flow (optional)              | If added, validate page navigation keeps filters and count copy is total-based.                         |

## Migration / Rollout

No migration required. Client-side-only behavior changes with existing data schema.

## Open Questions

- [ ] Should page controls include numeric buttons, or only Previous/Next to match existing minimal UI patterns?
- [ ] Should out-of-range `page` values be clamped back to the last page, or left to show an empty grid per spec?
