# Story 25.5: BEM Normalization

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer maintaining architectural coherence in the frontend,
I want to normalize BEM element separators from `_` to `__` across scoped styles and className consumers,
so that naming is predictable, consistent with ADR-012, and safe for future refactors.

## Acceptance Criteria

1. Zero single-underscore BEM element separators in `src/**/*.css` for in-scope files (WordCloud excluded).
2. All in-scope `className` references are updated to match renamed CSS classes.
3. E2E selectors impacted by renamed classes are updated (or migrated to `data-testid`) so CI remains stable.
4. Unit tests pass after each migration batch.
5. `npm run lint` passes.
6. `npm run build` passes.
7. `npm run test:e2e` passes.
8. Visual spot-check confirms no regressions in About, Home, Projects, Articles, Nav, Chat, and overlays.

## Tasks / Subtasks

- [ ] Task 1: Prepare rename inventory and scope guardrails (AC: 1,2,3)
  - [ ] 1.1 Build list of in-scope CSS files containing `block_element` patterns (`src/**/*.css`).
  - [ ] 1.2 Exclude all files under `src/ui/organisms/WordCloud/`.
  - [ ] 1.3 Map each renamed selector to JSX/TSX consumers and test selectors.
  - [ ] 1.4 Freeze batch plan and expected snapshot churn per batch.

- [ ] Task 2: Execute Batch A (`app/`) renames and consumers (AC: 1,2,4,8)
  - [ ] 2.1 Rename classes in `src/app/styles.css`, `src/app/about/styles.css`, `src/app/articles/styles.css`, `src/app/projects/styles.css`.
  - [ ] 2.2 Update className usages in route components/layout/skeleton files.
  - [ ] 2.3 Run `npm test` and fix regressions only related to Batch A.
  - [ ] 2.4 Visual spot-check route-level layouts.

- [ ] Task 3: Execute Batch B (`atoms/`) renames and consumers (AC: 1,2,4)
  - [ ] 3.1 Rename atom classes in buttons/icons/links/texts/hocs CSS files.
  - [ ] 3.2 Update atom component/skeleton className usages.
  - [ ] 3.3 Run `npm test` and update snapshots/assertions tied to atom class names.

- [ ] Task 4: Execute Batch C (`molecules/`) renames and consumers (AC: 1,2,3,4,8)
  - [ ] 4.1 Rename molecule CSS classes (including Experience, Education, TransitionEffect, HireMe, SocialNetworkLink, CopyEmail).
  - [ ] 4.2 Update molecule component/skeleton className usages.
  - [ ] 4.3 Update known selector risks: Experience/Education and TransitionEffect related tests.
  - [ ] 4.4 Run `npm test` and resolve selector/snapshot failures.

- [ ] Task 5: Execute Batch D (`organisms/`) renames and consumers (AC: 1,2,4,8)
  - [ ] 5.1 Rename organism CSS classes (NavBar, Chat, Skills, Hiring, MenuFloating, MobileMenuOverlay, Biography, ExperienceStats).
  - [ ] 5.2 Update organism className usages and any integration points from pages.
  - [ ] 5.3 Run `npm test` and resolve batch-specific failures.

- [ ] Task 6: Execute Batch E (`overlays/`) renames and consumers (AC: 1,2,4,8)
  - [ ] 6.1 Rename overlay CSS classes in Floating/FloatingMobile.
  - [ ] 6.2 Update overlay component className usages.
  - [ ] 6.3 Run `npm test` and resolve batch-specific failures.

- [ ] Task 7: Cross-suite verification and closure (AC: 3,5,6,7,8)
  - [ ] 7.1 Run `npm run lint`.
  - [ ] 7.2 Run `npm run build`.
  - [ ] 7.3 Run `npm run test:e2e`.
  - [ ] 7.4 Perform visual spot-check for impacted views/components.
  - [ ] 7.5 Capture final file list and change notes in Dev Agent Record.

## Dev Notes

### Technical Requirements

- Official BEM format is mandatory: `block__element--modifier`.
- `__` is required for element separator; `--` is required for modifiers.
- Keep block and element words lowercase, kebab-case within segments.
- Do not rename classes in `src/ui/organisms/WordCloud/` (explicit exclusion).
- Do not introduce feature changes or structural refactors; this story is naming normalization only.

### Architecture Compliance

- Scope is constrained to Epic 25 normalization goals; no behavior redesign.
- Batch order must follow ADR-012 and Epic 25 plan: `app/` -> `atoms/` -> `molecules/` -> `organisms/` -> `overlays/`.
- Use per-batch test gates to reduce blast radius.
- Preserve existing CSS placement architecture (co-located `styles.css`, no CSS Modules migration).

### Library / Framework Requirements

- Next.js 14 + React 18 + Tailwind CSS 3 conventions must remain intact.
- No new dependencies are required.
- Follow current testing stack: Jest/RTL for unit/integration and Playwright for E2E.

### File Structure Requirements

- Primary impacted layers (from current repository scan):
  - `src/app/*.css` and corresponding page/layout/skeleton TSX files
  - `src/ui/atoms/**/styles.css` and matching atom TSX/skeleton files
  - `src/ui/molecules/**/styles.css` and matching molecule TSX/skeleton files
  - `src/ui/organisms/**/styles.css` and matching organism TSX files
  - `src/ui/overlays/**/styles.css` and matching overlay TSX files
- High-volume CSS candidates from scan:
  - `src/ui/organisms/Chat/styles.css`
  - `src/app/about/styles.css`
  - `src/ui/molecules/Experience/styles.css`
  - `src/app/styles.css`
  - `src/ui/molecules/Education/styles.css`
  - `src/ui/organisms/NavBar/styles.css`

### Testing Requirements

- Execute `npm test` after each batch (A-E).
- Update snapshot/assertion selectors that intentionally change due to class rename.
- Explicit risk targets:
  - `e2e/about-experiences-education-ux.spec.ts` selectors currently tied to single-underscore classes.
  - `e2e/page-transitions.spec.ts` selectors tied to `.transition-effect_blade`.
- Final quality gate sequence:
  1. `npm test`
  2. `npm run lint`
  3. `npm run build`
  4. `npm run test:e2e`

### Previous Story Intelligence

- Story 25.4 established strict exclusion enforcement (WordCloud must stay out of scope).
- Story 25.4 remediation added guardrail testing and validated that scope violations are treated as critical.
- Story 25.4 completion pattern should be reused: implement -> verify -> resolve findings -> finalize tracking.

### Git Intelligence Summary

- Recent commits show the expected closure pattern:
  - `2188d88`: scope correction + guardrail test.
  - `3e5a11d`: story/sprint documentation finalization.
- Implication for 25.5: keep changes auditable by batch and preserve strict alignment between code state and story/sprint status.

### Latest Technical Information

- No external library research required for this story.
- This task is internal convention normalization over existing CSS/React code.
- Current project standards in docs/architecture and ADRs are sufficient and authoritative.

### Project Structure Notes

- No `project-context.md` file was discovered in the repository.
- Canonical guidance must be taken from:
  - `docs/architecture/styles-architecture.md`
  - `docs/adr/012-bem-enforcement-strategy.md`
  - `_bmad-output/implementation-artifacts/epic-25-architectural-coherence.md`

### References

- Epic 25 Story 25.5 definition: `_bmad-output/implementation-artifacts/epic-25-architectural-coherence.md` (Story 25.5 section)
- BEM strategy and selector risks: `docs/adr/012-bem-enforcement-strategy.md`
- Styling architecture and canonical BEM format: `docs/architecture/styles-architecture.md`
- Sprint tracking state (`25-5-bem-normalization: backlog`): `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Previous story learnings and scope remediation: `_bmad-output/implementation-artifacts/25-4-breakpoint-tokenization.md`

## Dev Agent Record

### Agent Model Used

openai/gpt-5.3-codex

### Debug Log References

- Explore session: `ses_3686d4765ffeXcoy1p5wvuEcsX`
- Background task: `bg_954b9d13`

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story includes batch plan, exclusion guardrails, selector risk handling, and test/build/lint/E2E gates.

### File List

- `_bmad-output/implementation-artifacts/25-5-bem-normalization.md` (created)
