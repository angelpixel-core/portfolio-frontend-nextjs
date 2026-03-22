# Tasks: Projects Visible Flag

## Phase 1: Foundation (Schema + Data Contract)

- [x] 1.1 Update `src/domains/project/model/schema.ts` to add `visible: boolean` to `ProjectSchema` and inferred types.
- [x] 1.2 Add `visible` to all entries in `src/domains/project/model/mock.ts` with intentional true/false coverage.

## Phase 2: Core Implementation (Visibility Filtering)

- [ ] 2.1 Add `ProjectVisibility` type, `FetchAllOptions.visibility`, and `normalizeVisibility()` to `src/domains/project/model/index.ts`.
- [ ] 2.2 Update `Project.fetchAll()` in `src/domains/project/model/index.ts` to normalize visibility, filter results after schema parsing, and default invalid values to `visible`.
- [ ] 2.3 Replace the factory hook in `src/domains/project/queries/useProjects.ts` with a custom hook that accepts `{ visibility?: ProjectVisibility | string }`, uses a query key like `['projects', visibility]`, and passes options to `fetchAll()`.

## Phase 3: Integration (Page Wiring)

- [ ] 3.1 Confirm `src/app/projects/page.tsx` calls `useProjects()` without explicit visibility to rely on the default visible-only behavior.

## Phase 4: Tests (Unit + Integration)

- [ ] 4.1 Update `src/domains/project/model/__tests__/schema.test.ts` to cover the required `visible` field (valid + missing/invalid cases).
- [ ] 4.2 Update `src/domains/project/model/__tests__/validate-data.test.ts` fixtures/expectations to include `visible`.
- [ ] 4.3 Update `src/domains/project/model/__tests__/utils.test.ts` fixtures to include `visible` in `ProjectModel` data.
- [ ] 4.4 Update `src/domains/project/queries/__tests__/useProjects.test.tsx` to cover default visibility, `hidden`, `all`, and invalid values.
- [ ] 4.5 Update `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` to include hidden items and assert visibility filtering precedes tech and pagination.
- [ ] 4.6 Update `src/app/projects/__tests__/ProjectsPageLayout.test.tsx` to reflect visible-only counts.
- [ ] 4.7 Update `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` fixtures/types if `ProjectModel` updates require `visible`.

## Phase 5: Verification

- [ ] 5.1 Run `npm run validate:projects` to confirm mock data passes schema validation.
- [ ] 5.2 Run `npm test -- src/domains/project/model/__tests__/schema.test.ts` to confirm schema validation.
- [ ] 5.3 Run `npm test -- src/domains/project/queries/__tests__/useProjects.test.tsx` for visibility hook behavior.
- [ ] 5.4 Run `npm test -- src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` to verify filtering precedence scenarios.
