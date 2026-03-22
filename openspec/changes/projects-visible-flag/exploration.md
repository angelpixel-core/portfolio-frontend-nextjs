## Exploration: projects-visible-flag

### Current State

Projects are fetched via `Project.fetchAll()` in `src/domains/project/model/index.ts`, validated with `ProjectsSchema` in `src/domains/project/model/schema.ts`, and consumed by the projects list page at `src/app/projects/page.tsx` using `useProjects` from `src/domains/project/queries/useProjects.ts`. The list page applies technology filtering, ordering by `priority`, and pagination, but currently does not filter on visibility. The mock data in `src/domains/project/model/mock.ts` now includes a `visible` boolean per project, but the schema does not include that field yet.

### Affected Areas

- `src/domains/project/model/schema.ts` — define `visible` on `ProjectSchema` if it becomes a supported field.
- `src/domains/project/model/index.ts` — potential place to filter `fetchAll()` results by `visible`.
- `src/domains/project/queries/useProjects.ts` — alternative place to filter before passing to UI.
- `src/app/projects/page.tsx` — current filtering pipeline (tech + priority + pagination) where visibility could be applied.
- `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` — list expectations will change if visibility filtering is added (mock data needs `visible: true`).
- `src/app/projects/__tests__/ProjectsPageLayout.test.tsx` — layout counts will change if visibility filtering is applied (mock data needs `visible: true`).
- `src/domains/project/model/__tests__/schema.test.ts` — will require `visible` when schema is updated.
- `src/domains/project/model/__tests__/validate-data.test.ts` — mock data must pass schema; already includes `visible` but will fail until schema is updated.
- `src/domains/project/model/__tests__/utils.test.ts` and `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` — fixtures typed as `ProjectModel` will need `visible` if schema requires it.

### Approaches

1. **Filter in the UI list pipeline** — apply `visible` filtering in `src/app/projects/page.tsx` before tech filtering/ordering.
   - Pros: Minimal surface area, only affects the list page (matches request).
   - Cons: Other consumers of `useProjects` would still receive hidden projects if added later.
   - Effort: Low.

2. **Filter at the domain model layer** — filter `visible` in `Project.fetchAll()` (or `useProjects`) so all consumers get visible-only lists by default.
   - Pros: Centralized behavior; future list pages or widgets automatically respect visibility.
   - Cons: If a future admin or detail view needs hidden items, it will require a separate fetch path or option flag.
   - Effort: Low/Medium (may require a new option flag or secondary hook).

3. **Extend schema and add an explicit visibility query** — add `visible` to schema and create a `useVisibleProjects` hook that filters and is used by the list page.
   - Pros: Clear intent, avoids altering existing hook semantics.
   - Cons: Slightly more boilerplate and extra hook maintenance.
   - Effort: Medium.

### Recommendation

Apply visibility filtering close to the list page (Approach 1) for the smallest change set aligned to the request, while adding `visible` to the schema so the field is first-class. If future consumers need hidden data, a dedicated hook or a model option can be introduced later.

### Risks

- Tests that assume all mock projects are visible will fail once visibility filtering is enforced.
- If filtering is done only in the list page, other consumers of `useProjects` (if added later) may unintentionally display hidden projects.

### Ready for Proposal

Yes — the orchestrator should confirm whether visibility is intended only for the projects list page or for all list consumers of `useProjects`.
