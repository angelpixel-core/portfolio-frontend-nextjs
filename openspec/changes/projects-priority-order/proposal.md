# Proposal: Projects Priority Order

## Intent

Replace featured/incoming-based ordering with an explicit numeric `priority` so project ordering is deterministic, independent of ribbon text, and easy to control.

## Scope

### In Scope

- Add required `priority: number` to the project schema.
- Update mock data to include `priority` for all projects and reflect desired ordering.
- Update ordering logic in the projects page to sort by `priority` (higher first).
- Update tests that assert ordering and schema validation to include `priority`.

### Out of Scope

- Changing featured blade layout logic (featured remains for layout only).
- Adding UI controls or CMS tooling to edit priority values.
- Reordering rules for any other content types (articles, clients, etc.).

## Approach

Introduce a required numeric `priority` field in `ProjectSchema`, migrate all mock entries to include it, and replace the current featured/incoming ordering logic with a simple descending sort by `priority`. Keep `featured` intact for layout pairing.

## Assumptions

- The change applies to mock data and schema validation now; real API data will follow the same contract.
- Higher `priority` means earlier in the list.
- Ties can use stable sort (preserve existing order) or fall back to current array order.

## Ordering Rules

1. Sort projects by `priority` descending.
2. If priorities are equal, preserve original array order (stable).
3. `featured` does not influence ordering; it only affects layout pairing.

## Migration Strategy (Mock Data)

- Add `priority` to every project in `src/domains/project/model/mock.ts`.
- Assign values that reflect the current desired order (featured/incoming can map to higher numbers if needed).
- Keep `featured` and ribbon fields intact to avoid layout regressions.

## Affected Areas

| Area                                                        | Impact   | Description                                              |
| ----------------------------------------------------------- | -------- | -------------------------------------------------------- |
| `src/domains/project/model/schema.ts`                       | Modified | Add required `priority: number` to `ProjectSchema`.      |
| `src/domains/project/model/mock.ts`                         | Modified | Add `priority` values to every project entry.            |
| `src/app/projects/page.tsx`                                 | Modified | Replace featured/incoming ordering with `priority` sort. |
| `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` | Modified | Update ordering test expectations to numeric priority.   |
| `src/domains/project/model/__tests__/schema.test.ts`        | Modified | Update fixtures to include `priority` if required.       |
| `src/domains/project/model/__tests__/validate-data.test.ts` | Modified | Validate presence/type/range if applicable.              |

## Risks

| Risk                                                    | Likelihood | Mitigation                                                               |
| ------------------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| Missing `priority` in data causes validation failures.  | Med        | Make schema change and mock updates in the same change; update fixtures. |
| Ordering change affects blade composition expectations. | Low/Med    | Keep `featured` logic for layout; update tests to reflect ordering rule. |
| Future API payloads omit `priority`.                    | Med        | Document contract; add validation with clear error messaging.            |

## Testing Notes

- Update unit tests covering ordering on the projects page.
- Update schema validation tests and data validation tests for the new field.
- Run `npm run validate:projects` and relevant Jest tests for the projects page.

## Rollback Plan

- Revert ordering logic back to featured/incoming grouping in `src/app/projects/page.tsx`.
- Remove `priority` from schema and mock data.
- Restore previous test expectations for ordering and schema validation.

## Dependencies

- None (local schema and mock data updates only).

## Success Criteria

- [ ] Projects render ordered by descending `priority`.
- [ ] `ProjectSchema` requires `priority` and validation passes with updated mock data.
- [ ] Ordering-related tests are updated and pass.
