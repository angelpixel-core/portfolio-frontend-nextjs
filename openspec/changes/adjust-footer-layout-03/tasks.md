# Tasks: Footer Layout 03 Refresh

## Phase 1: Footer Structure Foundation

- [x] 1.1 Refactor `src/ui/organisms/Footer/index.tsx` to define explicit top-level groups for copyright, `Contact`, and `Links` while preserving `data-testid="footer"` and `data-testid="footer-content"`.
- [x] 1.2 Add the lower technology-summary section markup in `src/ui/organisms/Footer/index.tsx` with the four lines defined in `.private/requests/03-footer.md`.
- [x] 1.3 Resolve link-source wiring in `src/ui/organisms/Footer/index.tsx` for explicit GitHub + LinkedIn items using existing project social-link patterns (without introducing new domain APIs).

## Phase 2: Responsive Layout and Visual Hierarchy

- [x] 2.1 Redesign `src/ui/organisms/Footer/styles.css` base/mobile rules to render single-column reading order with section titles and link stacks.
- [x] 2.2 Implement tablet breakpoint behavior in `src/ui/organisms/Footer/styles.css` for the requested two-column presentation while keeping semantic grouping intact.
- [x] 2.3 Implement desktop breakpoint behavior in `src/ui/organisms/Footer/styles.css` for the requested three-column presentation and stable spacing.
- [x] 2.4 Add typography hierarchy rules in `src/ui/organisms/Footer/styles.css` (small uppercase section headings, link spacing) and enforce no internal separator under `Contact`/`Links`.
- [ ] 2.5 Implement the lower summary separation in `src/ui/organisms/Footer/styles.css` so the technology block is visually distinct from upper groups.

## Phase 3: Integration and Contract Preservation

- [ ] 3.1 Verify `src/app/layout.tsx` footer mount assumptions remain valid (no code change unless required by compilation or rendering contract).
- [ ] 3.2 Verify Home-specific footer visibility behavior (global footer hidden vs blade footer visible) remains unchanged after footer DOM refactor.
- [ ] 3.3 Confirm footer does not reintroduce overlap risks with `HireMe` and short viewport behavior tied to existing selectors.

## Phase 4: Test Synchronization (Spec-Driven Verification)

- [ ] 4.1 Update `e2e/footer-consistency.spec.ts` assertions for new footer structure, including explicit `Contact`/`Links` groups and lower summary block presence.
- [ ] 4.2 Update `src/styles/__tests__/layout-migration-wave3.test.ts` footer expectations to match updated CSS primitives/classes and breakpoint-safe conventions.
- [ ] 4.3 Update `e2e/vertical-viewport.spec.ts` selectors only if needed so the no-overlap scenario remains valid with the new footer markup.
- [ ] 4.4 Run targeted verification commands for affected suites (`footer-consistency`, `vertical-viewport`, and wave3 CSS contract) and capture pass/fail outcomes for acceptance.

## Phase 5: Final Validation and Closeout

- [ ] 5.1 Execute project quality gates (`npm run lint`, `npm run typecheck`, `npm test`) and resolve regressions caused by footer changes.
- [ ] 5.2 Execute footer-focused E2E verification (`npm run test:e2e -- e2e/footer-consistency.spec.ts e2e/vertical-viewport.spec.ts`) and confirm all footer scenarios pass.
- [ ] 5.3 Confirm all spec requirements from `openspec/changes/adjust-footer-layout-03/specs/footer/spec.md` are satisfied (responsive layout, information architecture, visual hierarchy, route consistency).
