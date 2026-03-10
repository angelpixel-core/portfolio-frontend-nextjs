# Proposal: Adapt Project Cards to Request 05

## Intent

Upgrade featured project cards from a generic portfolio presentation to a systems-engineering narrative that highlights domain context, architecture thinking, and decision-ready actions. This change aligns Projects with request 05 so recruiters can understand system type, technical depth, and architecture artifacts in one scan.

## Scope

### In Scope

- Add support for featured-card context badges, domain-focused summary copy, and a small focus microline.
- Extend project data contract for richer featured-card metadata and architecture action input while keeping backward compatibility for existing cards.
- Refactor featured ProjectCard layout to match the 6-part structure from request 05 (context -> title -> description -> tech badges -> actions -> preview support).
- Replace junior-feeling CTA wording with architecture/source/demo action labels and wire an architecture action to an existing overlay/modal pattern.
- Synchronize tests and test IDs impacted by changed content structure and action semantics.

### Out of Scope

- Rebuilding the full Projects page information architecture beyond featured-card behavior.
- Replacing current project assets/diagrams with new design production work.
- Introducing backend persistence changes or new external data services for projects.

## Approach

Apply a contract-first, featured-first evolution: extend `project` schema and mock data with optional request-05 fields, then update only the featured variant rendering to consume the richer model while preserving grid card compatibility. Reuse the existing overlay interaction pattern to present architecture content (diagram/image) and keep CTA behavior explicit (`Architecture`, `Source Code`, `Live Demo`) without breaking existing links for projects that do not yet provide all optional fields.

## Affected Areas

| Area                                                          | Impact   | Description                                                                                         |
| ------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `src/domains/project/model/schema.ts`                         | Modified | Add optional fields for featured-card context badges, focus line, and architecture action metadata. |
| `src/domains/project/model/mock.ts`                           | Modified | Adapt featured project fixtures to request-05 narrative format and CTA labeling inputs.             |
| `src/ui/organisms/ProjectCard/ProjectCard.types.ts`           | Modified | Extend card types to support richer featured metadata while keeping existing card variants valid.   |
| `src/ui/organisms/ProjectCard/variants/Featured.tsx`          | Modified | Render context badges, revised hierarchy, focus microline, and request-05 CTA section.              |
| `src/ui/organisms/ProjectCard/ActionLinks.tsx`                | Modified | Support explicit architecture/source/demo labels and architecture trigger behavior.                 |
| `src/ui/organisms/ProjectCard/TechStackIcons.tsx`             | Modified | Ensure featured cards can render text badge style without forcing icon-only presentation.           |
| `src/ui/organisms/ProjectCard/styles.css`                     | Modified | Implement request-05 featured visual structure and responsive spacing hierarchy.                    |
| `src/ui/overlays/Floating/index.tsx`                          | Modified | Reuse/extend floating overlay to display project architecture diagram content.                      |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | Modified | Update assertions for new featured hierarchy, CTA labels, and fallback behavior.                    |
| `e2e/projects-articles.spec.ts`                               | Modified | Align Projects flow checks with updated featured-card actions and text structure.                   |
| `e2e/testids.ts`                                              | Modified | Add/rename stable selectors for architecture/source/demo actions where needed.                      |

## Risks

| Risk                                                              | Likelihood | Mitigation                                                                                                |
| ----------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| Schema expansion breaks existing project consumers                | Medium     | Keep new fields optional, preserve legacy fields, and validate with typecheck plus current project tests. |
| CTA/test coupling causes false regressions after label changes    | Medium     | Update unit + E2E selectors in the same change and keep stable `data-testid` contracts.                   |
| Architecture overlay introduces interaction regressions on mobile | Low        | Reuse existing floating pattern and verify open/close plus focus behavior across breakpoints.             |

## Rollback Plan

Revert the change commit to restore previous featured-card layout and CTA semantics. For partial rollback, first restore `src/domains/project/model/schema.ts` and `src/domains/project/model/mock.ts`, then revert `src/ui/organisms/ProjectCard/*` and overlay/test files so rendering and selectors return to the prior contract.

## Dependencies

- Request baseline: `.private/requests/05-project-cards.md`.
- Existing project query pipeline (`src/domains/project/model/index.ts`) must continue returning schema-valid data.
- Existing overlay behavior in `src/ui/overlays/Floating/index.tsx` should remain the base interaction model.
- Test synchronization rule: UI/test updates ship together for selector or label changes.

## Success Criteria

- [ ] Featured project cards display request-05 hierarchy: context badges, strong title, system-oriented summary, tech badges, and action row.
- [ ] Featured cards support an architecture action that opens architecture content through the existing overlay pattern.
- [ ] CTA language and intent align to `Architecture`, `Source Code`, and `Live Demo` (with safe fallback when data is missing).
- [ ] Existing non-featured project cards remain functional without requiring all new fields.
- [ ] Updated ProjectCard unit tests and impacted Projects E2E checks pass with new selectors/content expectations.
