# Proposal: Projects Incoming Pagination

## Intent

Make incoming projects visible in the grid while keeping the featured ribbon language consistent, add pagination to avoid hard caps, and order the list to prioritize incoming work without breaking existing blades and filters.

## Scope

### In Scope

- Display the existing "Incoming" ribbon on grid (non-featured) project cards when project data includes the ribbon metadata.
- Add pagination to the projects grid so users can browse beyond the current max-cap.
- Update ordering to prioritize incoming projects within the grid while keeping featured projects first.

### Out of Scope

- Redesign of ProjectCard visual styles beyond adding the ribbon.
- Changes to project data shape beyond reusing existing ribbon fields.
- Server-side pagination or API changes (data stays client-side with mock/React Query).

## Approach

- Reuse the existing ribbon model (`featuredCard.ribbon`) and render it in the grid variant image container (same component as featured) so "Incoming" appears consistently.
- Replace the hard `MAX_PROJECTS` cap with a paginated slice derived from current filters; keep filters in the query string and append a new `page` param.
- Adjust sorting in `ProjectsContent` to prioritize incoming (ribbon text or variant) while preserving the featured-first rule and current blade pairing logic.

## Affected Areas

| Area                                                          | Impact   | Description                                                                                                 |
| ------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `src/app/projects/page.tsx`                                   | Modified | Replace `MAX_PROJECTS` limit with pagination state/URL param, ordering for incoming, and update count copy. |
| `src/app/projects/styles.css`                                 | Modified | Add pagination layout styles near the grid blade.                                                           |
| `src/ui/organisms/ProjectCard/variants/Grid.tsx`              | Modified | Render `ImageRibbon` in grid variant using existing ribbon data.                                            |
| `src/ui/organisms/ProjectCard/styles.css`                     | Modified | Ensure ribbon styles work with grid image layout (spacing/position).                                        |
| `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx`   | Modified | Update tests for pagination and ordering.                                                                   |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | Modified | Add coverage for grid ribbon rendering.                                                                     |

## Risks

| Risk                                             | Likelihood | Mitigation                                                                                     |
| ------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------- |
| Pagination breaks blade pairing or count display | Medium     | Keep blade pair construction after pagination slice; add tests for blade structure and counts. |
| Ribbon visually overlaps grid image content      | Low        | Validate with CSS adjustments in `ProjectCard` styles and check mobile.                        |
| URL param conflicts with existing filter params  | Low        | Use `page` param and preserve `tech` params when updating.                                     |

## Rollback Plan

Revert the pagination logic in `src/app/projects/page.tsx` to the fixed `MAX_PROJECTS` slice, and remove ribbon rendering from `src/ui/organisms/ProjectCard/variants/Grid.tsx` plus any related CSS tweaks in `src/ui/organisms/ProjectCard/styles.css`.

## Dependencies

- None (reuses existing project mock data and ribbon model).

## Success Criteria

- [ ] Grid cards display the "Incoming" ribbon when `featuredCard.ribbon` is present.
- [ ] Projects list supports pagination with filter + page parameters preserved in the URL.
- [ ] Incoming projects appear before other non-featured projects while featured items remain first.
- [ ] Updated tests in projects page and ProjectCard pass and reflect the new behavior.
