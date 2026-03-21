# Tasks: Projects Priority Order

## Phase 1: Foundation (Schema + Data Contract)

- [x] 1.1 Update `src/domains/project/model/schema.ts` to require `priority: number` in `ProjectSchema` and inferred types.
- [x] 1.2 Update `src/domains/project/model/__tests__/schema.test.ts` valid fixtures to include `priority` and add a missing/invalid priority case per spec.
- [x] 1.3 Update `src/domains/project/model/__tests__/validate-data.test.ts` fixtures or expectations to include required `priority` for mock validation.

## Phase 2: Core Implementation (Ordering Logic + Mock Data)

- [ ] 2.1 Add `priority` values to every entry in `src/domains/project/model/mock.ts` matching the desired ordering.
- [ ] 2.2 Replace featured/incoming ordering in `src/app/projects/page.tsx` with a stable descending sort by `priority`.
- [ ] 2.3 Ensure `featured` is only used for blade pairing/layout in `src/app/projects/page.tsx` after ordering change.

## Phase 3: Integration (Page Behavior Tests)

- [ ] 3.1 Update `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` ordering scenario to assert priority-based ordering (higher first).
- [ ] 3.2 Add test coverage in `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` for stable ordering on equal priorities.
- [ ] 3.3 Add test coverage in `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` that `featured`/ribbon do not override priority ordering.

## Phase 4: Verification

- [ ] 4.1 Run `npm run validate:projects` and confirm mock data passes schema validation.
- [ ] 4.2 Run `npm test -- src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` to confirm ordering expectations pass.
- [ ] 4.3 Run `npm test -- src/domains/project/model/__tests__/schema.test.ts` to confirm schema validation passes.

## Phase 5: Documentation (Optional)

- [ ] 5.1 If required, document priority guidance in `docs/content-management.md` once a range or convention is decided.
