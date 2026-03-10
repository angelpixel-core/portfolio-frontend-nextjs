# Tasks: Adapt Project Cards to Request 05

## Phase 1: Contract Foundation

- [x] 1.1 Extend `src/domains/project/model/schema.ts` with optional `featuredCard` metadata (`contextBadges`, `focusLine`, `architecture`) while preserving all existing legacy fields and parse behavior. (Req: Backward-Compatible Featured and Non-Featured Fallbacks; Decision: backward-compatible optional fields + nested featured block)
- [x] 1.2 Update featured fixtures in `src/domains/project/model/mock.ts` to include request-05 narrative content and architecture targets for at least one featured record, leaving at least one legacy-only featured record for fallback coverage. (Req: Featured Card Six-Part Content Hierarchy, CTA Semantics and Availability, Focus Microline)
- [x] 1.3 Extend `src/ui/organisms/ProjectCard/ProjectCard.types.ts` and related local card typings to add optional `architectureTarget` and featured metadata props without breaking grid/non-featured variant types. (Req: Backward-Compatible Featured and Non-Featured Fallbacks)

## Phase 2: Featured Card Rendering and CTA Semantics

- [x] 2.1 Refactor `src/ui/organisms/ProjectCard/variants/Featured.tsx` to render the six-part hierarchy in order (preview support, context badges, title, description, tech badges, action row) with fallback resolution from `featuredCard` to legacy fields. (Req: Featured Card Six-Part Content Hierarchy, Backward-Compatible Featured and Non-Featured Fallbacks)
- [x] 2.2 Implement optional focus microline rendering in `src/ui/organisms/ProjectCard/variants/Featured.tsx` so focus text is shown only when available and omitted with no placeholder when absent. (Req: Focus Microline for Domain Reinforcement)
- [x] 2.3 Update `src/ui/organisms/ProjectCard/ActionLinks.tsx` to enforce fixed labels `Architecture`, `Source Code`, and `Live Demo`, and hide each action when its target is unusable. (Req: CTA Semantics and Availability; Decision: fixed UI semantics)
- [x] 2.4 Update `src/ui/organisms/ProjectCard/TechStackIcons.tsx` and `src/ui/organisms/ProjectCard/styles.css` to support featured text badge presentation and request-05 spacing/alignment while preserving grid card styling behavior. (Req: Featured Card Six-Part Content Hierarchy, Backward-Compatible Featured and Non-Featured Fallbacks)

## Phase 3: Architecture Overlay Integration

- [x] 3.1 Extend `src/ui/overlays/Floating/index.tsx` with optional explicit close callback support (`onRequestClose`, outside-click close path) while retaining existing menu/chat close behavior as default. (Req: Architecture View Interaction, Featured Card Accessibility; Decision: reuse Floating with explicit close contract)
- [x] 3.2 Create `src/ui/organisms/ProjectCard/ArchitectureOverlay.tsx` as a project-specific wrapper around Floating to render architecture image/content metadata with accessible labeling. (Req: Architecture View Interaction, Featured Card Accessibility)
- [x] 3.3 Wire local architecture overlay state in `src/ui/organisms/ProjectCard/variants/Featured.tsx` so activating Architecture opens overlay and closing overlay restores project-page interaction context. (Req: Architecture View Interaction, Featured Card Accessibility)

## Phase 4: Verification and Test Synchronization

- [x] 4.1 Update `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` to cover: six-part hierarchy order, fixed CTA labels, missing-target filtering, focus microline present/absent, legacy featured fallback, and architecture overlay open/close + focus return. (Req: all project-card requirements)
- [ ] 4.2 Update `src/ui/overlays/__tests__/Floating.a11y.test.tsx` to verify Escape/outside click/close controls route through explicit close callback when provided and do not regress existing dialog accessibility behavior. (Req: Featured Card Accessibility)
- [ ] 4.3 Update selectors in `e2e/testids.ts` and adapt `e2e/projects-articles.spec.ts` assertions for semantic CTA actions and architecture overlay flow (open, visible content, close, continue navigation). (Req: CTA Semantics and Availability, Architecture View Interaction, Featured Card Accessibility)
- [ ] 4.4 Run targeted validation commands and capture pass/fail evidence: `npm test -- src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx`, `npm test -- src/ui/overlays/__tests__/Floating.a11y.test.tsx`, and `npm run test:e2e -- e2e/projects-articles.spec.ts`. (Verification)

## Phase 5: Final Compatibility Gate

- [ ] 5.1 Run regression checks `npm run typecheck` and `npm run lint` to ensure schema/type/UI updates do not break existing consumers and quality gates. (Req: Backward-Compatible Featured and Non-Featured Fallbacks)
- [ ] 5.2 Perform manual keyboard walkthrough on Projects page for featured actions and overlay close path (Tab/Enter/Escape) and record outcomes in PR notes. (Req: Featured Card Accessibility)

## Requirement and Decision Coverage Matrix

| Task(s)                 | Requirement / Decision Covered                                  |
| ----------------------- | --------------------------------------------------------------- |
| 1.1, 1.3, 2.1, 2.4, 5.1 | Backward-compatible featured/non-featured fallbacks             |
| 2.1, 2.4, 4.1           | Featured card six-part hierarchy                                |
| 2.3, 4.1, 4.3           | CTA semantics and target-aware availability                     |
| 2.2, 4.1                | Focus microline conditional behavior                            |
| 3.1, 3.2, 3.3, 4.3      | Architecture action opens/closes overlay through existing model |
| 3.1, 3.3, 4.1, 4.2, 5.2 | Accessibility and focus/interaction continuity                  |
| 1.1, 1.3                | Decision: optional backward-compatible request-05 fields        |
| 1.1                     | Decision: nested optional `featuredCard` metadata block         |
| 3.1                     | Decision: reuse Floating with explicit close callback           |
| 2.3                     | Decision: fixed CTA labels in UI logic                          |
