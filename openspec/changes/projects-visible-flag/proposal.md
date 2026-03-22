# Proposal: Projects Visible Flag

## Intent

Ensure project visibility is respected everywhere by default while still allowing consumers to request hidden-only or all projects when needed.

## Scope

### In Scope

- Add a `visible: boolean` field to the project schema and validation.
- Introduce a visibility parameter for project fetching (global default behavior).
- Apply visibility filtering before UI-specific filters (tech, priority, pagination).
- Update affected tests to reflect visibility filtering and schema requirements.

### Out of Scope

- Building admin UI to toggle visibility.
- Adding new routes or endpoints for hidden projects.
- Changing non-project domains or cross-domain filtering behavior.

## Approach

Add `visible` to `ProjectSchema` and make visibility a first-class query option. Default to `visible` projects globally, but allow consumers to pass a parameter to include hidden or all items. Implement filtering at the domain hook/model layer so all consumers share the same default behavior, and keep the UI list pipeline unchanged except for relying on the filtered data.

### Param API

- `useProjects({ visibility?: "visible" | "hidden" | "all" })`
- Default: `visibility = "visible"`
- Behavior:
  - `"visible"` => only `visible: true`
  - `"hidden"` => only `visible: false`
  - `"all"` => no visibility filtering

## Affected Areas

| Area                                                          | Impact   | Description                                                 |
| ------------------------------------------------------------- | -------- | ----------------------------------------------------------- |
| `src/domains/project/model/schema.ts`                         | Modified | Add `visible: boolean` to `ProjectSchema` and types.        |
| `src/domains/project/model/index.ts`                          | Modified | Apply visibility filtering in `fetchAll()` based on option. |
| `src/domains/project/queries/useProjects.ts`                  | Modified | Add `visibility` option and pass through to model.          |
| `src/app/projects/page.tsx`                                   | Modified | Ensure list uses default visibility behavior.               |
| `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx`   | Modified | Update fixtures/expectations for visibility.                |
| `src/app/projects/__tests__/ProjectsPageLayout.test.tsx`      | Modified | Update counts for visibility changes.                       |
| `src/domains/project/model/__tests__/schema.test.ts`          | Modified | Add coverage for `visible`.                                 |
| `src/domains/project/model/__tests__/validate-data.test.ts`   | Modified | Ensure mock data validates with `visible`.                  |
| `src/domains/project/model/__tests__/utils.test.ts`           | Modified | Update `ProjectModel` fixtures.                             |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | Modified | Update fixtures/types if `ProjectModel` changes.            |

## Risks

| Risk                                                    | Likelihood | Mitigation                                                                                         |
| ------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| Hidden projects unexpectedly excluded in existing views | Medium     | Default remains visible-only; document `visibility` option for any consumer that needs hidden/all. |
| Test failures due to new schema field                   | High       | Update fixtures and validation tests alongside schema change.                                      |
| Inconsistent filtering if applied in multiple layers    | Low        | Centralize filtering in model/hook; avoid UI-specific filters for visibility.                      |

## Rollback Plan

Revert the schema addition and remove visibility filtering option, restoring existing `useProjects` and `fetchAll()` behavior. Revert related test updates to previous expectations.

## Dependencies

- None.

## Success Criteria

- [ ] By default, project lists exclude hidden projects across all consumers of `useProjects`.
- [ ] Consumers can request hidden-only or all projects via `visibility` parameter.
- [ ] All project schema and UI tests pass with updated fixtures.
- [ ] No regressions in existing filtering, ordering, or pagination behavior.

## Testing Notes

- Update unit tests for schema validation and fixtures to include `visible`.
- Update project page tests to cover default visible-only behavior and optional hidden/all behavior where applicable.
