# Tasks: Improve Experiences Section

## Phase 1: Foundation and Data Copy

- [x] 1.1 Rewrite experience `work[].description` entries into concise, impact-oriented bullets (target <= 3 bullets per role where content allows) in `src/domains/job-experience/model/mock.ts`.
- [x] 1.2 Update independent consulting role/company label wording in `src/domains/job-experience/model/mock.ts` and verify no schema/type changes are required in `src/domains/job-experience/model/schema.ts`.
- [x] 1.3 Add or adjust test fixtures/assertions for updated mock content expectations in `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx`.

## Phase 2: Experience Molecule Layout and Timeline Density

- [x] 2.1 Reorder metadata render sequence to `Role @ Company` -> `Date` -> `Location` in `src/ui/molecules/Experience/index.tsx` while preserving current expand/collapse and accessibility attributes.
- [x] 2.2 Preserve optional logo behavior in `src/ui/molecules/Experience/index.tsx` so entries without a known logo key still render text metadata cleanly (no broken image state).
- [x] 2.3 Tighten vertical spacing and reduce timeline line visual dominance in `src/ui/molecules/Experience/styles.css`, maintaining readability and touch targets.
- [x] 2.4 Verify `src/ui/organisms/Experiences/index.tsx` needs no behavioral changes; if required, apply minimal wiring adjustments only for updated Experience rendering contract.

## Phase 3: Desktop/Mobile Social Filtering Split

- [ ] 3.1 Replace shared social provider list with surface-specific constants in `src/ui/organisms/Menu/constants.ts` (desktop/tablet curated vs mobile-preserved).
- [ ] 3.2 Apply curated desktop provider filter (GitHub + LinkedIn only) in `src/ui/organisms/Menu/index.tsx` for desktop-equivalent header social slots.
- [ ] 3.3 Align tablet header social filtering with curated desktop rules in `src/ui/organisms/NavBar/index.tsx`.
- [ ] 3.4 Keep broader mobile provider visibility by using mobile-specific constants in `src/ui/organisms/MenuFloatingClient/index.tsx` and `src/ui/organisms/MobileMenuOverlay/index.tsx`.

## Phase 4: Unit and Integration Test Synchronization

- [ ] 4.1 Update `src/ui/molecules/Experience/__tests__/Experience.test.tsx` to cover: concise bullet rendering, metadata order (`Role @ Company`, `Date`, `Location`), and graceful no-logo fallback (spec scenarios: "Experience renders concise impact bullets", "Standard experience row metadata order", "Company logo is unavailable").
- [ ] 4.2 Update `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx` to remove brittle long-paragraph assumptions and verify limited-detail entries render without filler (spec scenario: "Entry has limited available detail content").
- [ ] 4.3 Update `src/ui/organisms/Menu/__tests__/Menu.test.tsx`, `src/ui/organisms/NavBar/__tests__/NavBar.test.tsx`, and `src/ui/organisms/MobileMenuOverlay/__tests__/MobileMenuOverlay.test.tsx` for split provider rules (spec scenarios: "Desktop header shows curated providers only", "One curated desktop provider is unavailable", "Mobile menu retains broader provider set").

## Phase 5: E2E Verification and Breakpoint Regression Checks

- [ ] 5.1 Update and run `e2e/about-experiences-education-ux.spec.ts` to verify expandable Experience behavior and responsive readability after copy/layout changes (spec scenario: "Timeline appears denser with readable hierarchy").
- [ ] 5.2 Run and adjust if needed: `e2e/header-visibility.spec.ts`, `e2e/header-mobile-layout.spec.ts`, and `e2e/contact.spec.ts` to validate desktop curated socials vs mobile-preserved socials across breakpoints (navigation spec breakpoint scenarios).
- [ ] 5.3 Run and confirm no navigation interaction regressions in `e2e/menu-autoclose.spec.ts` and `e2e/navigation.spec.ts` after social filtering changes (spec scenario: "Menu interactions remain stable after social curation").
- [ ] 5.4 Execute validation commands `npm test -- src/ui/molecules/Experience/__tests__/Experience.test.tsx src/ui/organisms/Experiences/__tests__/Experiences.test.tsx src/ui/organisms/Menu/__tests__/Menu.test.tsx src/ui/organisms/NavBar/__tests__/NavBar.test.tsx src/ui/organisms/MobileMenuOverlay/__tests__/MobileMenuOverlay.test.tsx` and `npm run test:e2e -- e2e/about-experiences-education-ux.spec.ts e2e/header-visibility.spec.ts e2e/header-mobile-layout.spec.ts e2e/contact.spec.ts e2e/menu-autoclose.spec.ts e2e/navigation.spec.ts`.
