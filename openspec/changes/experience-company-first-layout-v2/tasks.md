# Tasks: Experience Company-First Layout V2

## Phase 1: Contract Foundation

- [x] 1.1 Update `src/domains/job-experience/model/schema.ts` to add required v2 fields: `year`, `contextBadges`, `technologies`, and enum `group` (`engineering` | `platform`), and export the group type.
- [x] 1.2 Add transitional legacy normalization in `src/domains/job-experience/model/index.ts` (or adjacent helper) to map legacy payloads into the v2 shape before schema validation.
- [x] 1.3 Migrate fixtures in `src/domains/job-experience/model/mock.ts` to explicit v2 fields and remove any technology dependence on `work[].tags`.

## Phase 2: UI Implementation

- [x] 2.1 Refactor `src/ui/molecules/Experience/index.tsx` to render company-first hierarchy (company prominence) and consume `year`, `contextBadges[]`, and `technologies[]` directly.
- [x] 2.2 Update `src/ui/molecules/Experience/styles.css` to support company-first card layout, metadata row, and technology chip section across existing breakpoints.
- [x] 2.3 Implement deterministic grouped rendering in `src/ui/organisms/Experiences/index.tsx` using fixed order `engineering` then `platform`, excluding invalid/missing groups.
- [x] 2.4 Update `src/ui/organisms/Experiences/styles.css` to style group headings/containers and omit visual gaps when a group is not rendered.

## Phase 3: Storybook and Component Wiring Validation

- [x] 3.1 Update `src/ui/molecules/Experience/stories/Experience.stories.tsx` with v2 args and edge-state stories for empty `contextBadges[]` and empty `technologies[]`.
- [ ] 3.2 Update `src/ui/organisms/Experiences/stories/Experiences.stories.tsx` with grouped examples for: both groups present, only engineering present, and invalid-group entries omitted.

## Phase 4: Tests Mapped to Spec Scenarios

- [ ] 4.1 Add/adjust schema/model contract tests in `src/domains/job-experience/model/__tests__/` (create if missing) for explicit v2 fields and valid group enum (`engineering`/`platform`) [Spec: Explicit Metadata - happy path].
- [ ] 4.2 Add/adjust schema/model invalid-data tests in `src/domains/job-experience/model/__tests__/` for missing/invalid `group` with no silent coercion [Spec: Explicit Metadata - edge case].
- [ ] 4.3 Update `src/ui/molecules/Experience/__tests__/Experience.test.tsx` to assert company-first card metadata rendering from explicit fields (`year`, `contextBadges[]`, `technologies[]`) [Spec: Company-First Rendering - happy path].
- [ ] 4.4 Extend `src/ui/molecules/Experience/__tests__/Experience.test.tsx` to verify empty badges/technologies show no placeholders and remain readable [Spec: Company-First Rendering - edge case].
- [ ] 4.5 Extend `src/ui/molecules/Experience/__tests__/Experience.test.tsx` to verify technology chips render only from `technologies[]` and never backfill from `work[].tags` (including empty `technologies[]` + populated `work[].tags`) [Spec: Technology Source Isolation - happy + edge].
- [ ] 4.6 Update `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx` to assert grouped heading order (`engineering`, then `platform`) and correct item placement [Spec: Grouped Rendering - happy path].
- [ ] 4.7 Extend `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx` to assert empty-group omission and invalid-group exclusion [Spec: Grouped Rendering - edge cases].
- [ ] 4.8 Extend `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx` error-state test to assert fallback remains and no partial group headings render on failure [Spec: Grouped Rendering during error].

## Phase 5: Verification and Cleanup

- [ ] 5.1 Run targeted tests: `npm test -- src/ui/molecules/Experience/__tests__/Experience.test.tsx src/ui/organisms/Experiences/__tests__/Experiences.test.tsx`.
- [ ] 5.2 Run contract and type safety checks: `npm run typecheck` and `npm run validate:content` (or domain-scoped validation if project uses it for experiences fixtures).
- [ ] 5.3 Run lint on touched areas with `npm run lint` and resolve violations in updated files.
