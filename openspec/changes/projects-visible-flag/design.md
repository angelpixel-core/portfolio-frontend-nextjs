# Design: Projects Visible Flag

## Technical Approach

Add `visible` to the project schema, then centralize visibility filtering in the project domain model (`fetchAll`) with a normalized visibility option (`visible | hidden | all`). Update the projects hook to accept a visibility option and include it in the query key. Keep UI filtering (tech, ordering, pagination) unchanged; it will operate on the visibility-filtered set returned by the hook.

## Architecture Decisions

### Decision: Filter visibility in the domain model

**Choice**: Apply visibility filtering inside `Project.fetchAll()` after schema validation.
**Alternatives considered**: Filter in `src/app/projects/page.tsx` only; introduce a new `useVisibleProjects` hook.
**Rationale**: Centralizing in the model ensures all consumers of `useProjects` default to visible-only and enforces the spec precedence (visibility before UI filters) without duplicating logic across pages.

### Decision: Extend `useProjects` signature to accept visibility

**Choice**: Replace the factory-based hook with a custom `useProjects(visibilityOptions?)` that calls `useQuery` directly and includes visibility in the query key.
**Alternatives considered**: Modify `createFetchAllHook` to accept runtime params (would require touching all domains); keep factory hook and add a separate `useProjectsWithVisibility` wrapper.
**Rationale**: Minimizes blast radius by changing only the project domain and avoids refactoring every other domain hook. A custom hook keeps the public API aligned with the proposal (`useProjects({ visibility })`).

### Decision: Normalize invalid visibility values to `visible`

**Choice**: Add a small normalization helper in the model layer used by both `fetchAll` and the hook.
**Alternatives considered**: Throw on invalid values or allow pass-through.
**Rationale**: The spec requires invalid values to default to `visible` and must not throw.

## Data Flow

Projects page and any future consumers use the same hook, which enforces visibility before UI filters.

    ProjectsPage
        │
        └─→ useProjects({ visibility? })
                │
                └─→ Project.fetchAll({ visibility, useMockFallback })
                        │
                        ├─→ ProjectsSchema.parse(data)
                        ├─→ normalizeVisibility(visibility)
                        └─→ filter by visibility (visible/hidden/all)
                                │
                                └─→ UI filters (tech, priority, pagination)

## File Changes

| File                                                          | Action | Description                                                                                |
| ------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ | -------- | ----------------------------------------------------- |
| `src/domains/project/model/schema.ts`                         | Modify | Add `visible: boolean` to `ProjectSchema` and inferred types.                              |
| `src/domains/project/model/index.ts`                          | Modify | Add `visibility` option to `fetchAll`, normalize input, filter results before returning.   |
| `src/domains/project/queries/useProjects.ts`                  | Modify | Replace factory hook with custom hook that accepts `{ visibility?: "visible"               | "hidden" | "all" }`and uses query key`['projects', visibility]`. |
| `src/domains/project/queries/__tests__/useProjects.test.tsx`  | Modify | Update to pass visibility options and adjust expectations.                                 |
| `src/app/projects/page.tsx`                                   | Modify | Continue calling `useProjects()` with default visibility (no explicit option).             |
| `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx`   | Modify | Update fixtures to include `visible` and adjust counts if visibility default reduces data. |
| `src/app/projects/__tests__/ProjectsPageLayout.test.tsx`      | Modify | Update generated mocks to include `visible` and adjust expectations as needed.             |
| `src/domains/project/model/__tests__/schema.test.ts`          | Modify | Add schema coverage for `visible`.                                                         |
| `src/domains/project/model/__tests__/validate-data.test.ts`   | Modify | Ensure mock data validates with new field.                                                 |
| `src/domains/project/model/__tests__/utils.test.ts`           | Modify | Update `ProjectModel` fixtures with `visible`.                                             |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | Modify | Update `ProjectModel` fixture usage if required by schema change.                          |

## Interfaces / Contracts

```ts
// src/domains/project/model/index.ts
export type ProjectVisibility = "visible" | "hidden" | "all";

export interface FetchAllOptions {
  useMockFallback?: boolean;
  visibility?: ProjectVisibility | string | undefined;
}

export const normalizeVisibility = (
  value?: ProjectVisibility | string
): ProjectVisibility => {
  return value === "hidden" || value === "all" ? value : "visible";
};
```

```ts
// src/domains/project/queries/useProjects.ts
export interface UseProjectsOptions {
  visibility?: ProjectVisibility | string;
}

// useQuery queryKey includes normalized visibility
// queryFn calls model.fetchAll({ visibility })
```

```ts
// src/domains/project/model/schema.ts
const ProjectSchema = z.object({
  // ...existing fields
  visible: z.boolean(),
});
```

## Testing Strategy

| Layer                | What to Test                                                        | Approach                                                                                                                           |
| -------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Unit                 | Schema includes `visible` and mock data validates                   | Update `schema.test.ts` and `validate-data.test.ts` to assert presence and validity.                                               |
| Unit                 | `useProjects` default visibility + explicit `hidden`/`all` behavior | Add cases in `useProjects.test.tsx` to call `useProjects({ visibility })` and assert model calls + returned length.                |
| Integration (page)   | Visibility filtering precedes tech and pagination                   | Update `ProjectsPageFiltering.test.tsx` to include hidden projects and verify they are excluded before tech/pagination assertions. |
| Integration (layout) | Page layout counts with visible-only data                           | Update `ProjectsPageLayout.test.tsx` fixtures to include `visible: true` for expected items.                                       |
| E2E                  | None added                                                          | Existing E2E flows unaffected; no new E2E coverage required for this change.                                                       |

## Migration / Rollout

No migration required.

## Open Questions

- [ ] Should any consumer (e.g., future admin tooling) need `visibility = "hidden"` by default, or is visible-only always preferred for public UI?
