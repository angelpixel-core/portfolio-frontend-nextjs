# Tasks: Projects Priority Incoming

## Phase 1: Foundation

- [x] 1.1 Confirm incoming asset filenames under `public/images/projects/incoming/` for `financial-core-simulator.png`, `erc20-token.png`, and `e-commerce.png` to use in project data.
- [x] 1.2 Review required fields in `src/domains/project/model/schema.ts` and mirror required keys from an existing entry in `src/domains/project/model/mock.ts` for the new projects.

## Phase 2: Core Implementation

- [x] 2.1 Add `financial-core-simulator` entry to `src/domains/project/model/mock.ts` with required fields, `featured: true`, `featuredCard.ribbon.text: "Incoming"`, `featuredCard.ribbon.variant: "wip"`, `img` pointing to `/images/projects/incoming/financial-core-simulator.png`, and `screenshots[0]` set to the same path.
- [x] 2.2 Add `erc20-token` entry to `src/domains/project/model/mock.ts` with required fields, `featured: false`, `featuredCard.ribbon.text: "Incoming"`, and `img` pointing to `/images/projects/incoming/erc20-token.png`.
- [x] 2.3 Add `e-commerce` entry to `src/domains/project/model/mock.ts` with required fields, `featured: false`, `featuredCard.ribbon.text: "Incoming"`, and `img` pointing to `/images/projects/incoming/e-commerce.png`.
- [x] 2.4 Ensure no new fields are introduced in `src/domains/project/model/mock.ts` beyond the existing schema and that ribbon text is exactly `"Incoming"` (case-sensitive).

## Phase 3: Testing / Verification

- [ ] 3.1 Run `npm run validate:projects` to confirm the three new entries satisfy `ProjectSchema` validation.
- [ ] 3.2 Spot-check `src/app/projects/page.tsx` rendering in dev to confirm ordering (featured first, then incoming) and ribbon display for the three new projects.
