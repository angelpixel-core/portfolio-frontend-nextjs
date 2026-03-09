# Proposal: Experience Company-First Layout V2

## Intent

Replace the current role-first experience presentation with a company-first card model so recruiters can scan employers, business context, and technology stack faster. Formalize explicit experience fields (`year`, `contextBadges[]`, `technologies[]`, `group`) and stop deriving technologies from nested `work[].tags`.

## Scope

### In Scope

- Update the job-experience data contract and mock data to include `year`, `contextBadges[]`, `technologies[]`, and `group` (`engineering`/`platform`).
- Refactor experience card rendering to show company-first hierarchy with explicit metadata fields.
- Add grouping support in the experiences section (single section with group headings or equivalent split by `group`).
- Update tests/stories impacted by the new contract and layout behavior.

### Out of Scope

- Changes to unrelated sections (projects, articles, navbar, contact/social behavior).
- Backend/API persistence changes beyond current frontend mock/query contract.
- Global redesign of typography, theme, or navigation architecture.

## Approach

Implement a contract-first frontend refactor: evolve `job-experience` schema and mocks to explicit company-first fields, then update `Experience` and `Experiences` components to consume those fields directly. Keep `work[]` for expandable detail bullets, but decouple chips/badges from `work[].tags` by rendering `contextBadges[]` and `technologies[]` as first-class arrays. Introduce deterministic grouping by `group` with stable ordering (`engineering`, then `platform`).

## Affected Areas

| Area                                                           | Impact   | Description                                                                                                                                               |
| -------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/domains/job-experience/model/schema.ts`                   | Modified | Extend `JobExperienceSchema` with explicit company-first metadata fields and grouping enum.                                                               |
| `src/domains/job-experience/model/mock.ts`                     | Modified | Reshape experience entries to include `year`, `contextBadges[]`, `technologies[]`, and `group`; remove technology derivation dependency on `work[].tags`. |
| `src/ui/molecules/Experience/index.tsx`                        | Modified | Render company-first card layout and consume explicit metadata arrays.                                                                                    |
| `src/ui/molecules/Experience/styles.css`                       | Modified | Update card visual structure for company-first hierarchy and badge/technology sections.                                                                   |
| `src/ui/organisms/Experiences/index.tsx`                       | Modified | Group/render experience cards by `group` and preserve loading/error behavior.                                                                             |
| `src/ui/molecules/Experience/__tests__/Experience.test.tsx`    | Modified | Align assertions with explicit fields and company-first UI output.                                                                                        |
| `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx`  | Modified | Validate grouped rendering and fallback behavior with updated model shape.                                                                                |
| `src/ui/molecules/Experience/stories/Experience.stories.tsx`   | Modified | Update Storybook examples to new card API/shape.                                                                                                          |
| `src/ui/organisms/Experiences/stories/Experiences.stories.tsx` | Modified | Update grouped examples and section behavior snapshots.                                                                                                   |

## Risks

| Risk                                                          | Likelihood | Mitigation                                                                           |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| Schema change breaks consumers expecting old fields           | Medium     | Update all direct consumers/tests in one PR and keep type-safe compile checks green. |
| Group split introduces ordering or empty-group UI regressions | Medium     | Define fixed group order and hide empty groups with explicit test coverage.          |
| Visual density regressions on mobile breakpoints              | Low        | Verify base, `phablet`, `mobile`, `tablet`, and `desktop` layouts before merge.      |

## Rollback Plan

Revert the change commit to restore the prior role-first schema and UI. If partial rollback is needed, first restore `src/domains/job-experience/model/schema.ts` and `src/domains/job-experience/model/mock.ts`, then revert `src/ui/molecules/Experience/*` and `src/ui/organisms/Experiences/*` plus related tests/stories to the previous contract.

## Dependencies

- Existing `job-experience` query flow (`useJobExperiences`) must continue returning schema-valid entries.
- Existing breakpoint/style system in `tailwind.config.js` and component CSS conventions.
- Test synchronization policy: UI and test updates must land together for changed selectors/content.

## Success Criteria

- [ ] Experience cards present company-first hierarchy with explicit `year`, `contextBadges`, and `technologies` data.
- [ ] No technology badges are derived from `work[].tags`; technologies come only from `technologies[]`.
- [ ] Experience list supports deterministic grouping by `group` and renders correctly when one group is empty.
- [ ] `npm run typecheck` and impacted experience tests pass with the new schema.
- [ ] Mobile and desktop layouts preserve readability and scanning improvements across core breakpoints.
