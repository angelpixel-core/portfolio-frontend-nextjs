# Proposal: Projects Priority Incoming

## Intent

Add three incoming projects to the portfolio data set, mark priority and incoming status using existing fields, and wire incoming assets from `public/images/projects/incoming/` while keeping code changes out of scope.

## Scope

### In Scope

- Add project entries for `financial-core-simulator` (featured), `erc20-token` (non-featured), and `e-commerce` (non-featured) in project mock data.
- Use existing `featured` and `featuredCard.ribbon.text = "Incoming"` to drive ordering and ribbon display.
- Set `img` (and optional `screenshots`) to incoming asset paths under `public/images/projects/incoming/`.

### Out of Scope

- Schema changes to add explicit `priority` or `status` fields.
- Component logic changes for ordering or image selection.
- New copywriting or enrichment beyond the available information.

## Approach

Apply the data-only approach from exploration: update `src/domains/project/model/mock.ts` to insert the three projects, set `featured: true` only on `financial-core-simulator`, and mark all three as incoming via `featuredCard.ribbon.text = "Incoming"`. Use existing incoming images as `img` (and optionally first `screenshots` entry for featured rendering) while avoiding SVG unless already supported.

## Affected Areas

| Area                                                 | Impact       | Description                                                              |
| ---------------------------------------------------- | ------------ | ------------------------------------------------------------------------ | --- | ------------------------------------------- |
| `src/domains/project/model/mock.ts`                  | Modified     | Add project entries and set featured/incoming metadata and image paths.  |
| `public/images/projects/incoming/`                   | Existing     | Source for incoming image paths referenced by new projects.              |
| `src/domains/project/model/schema.ts`                | Not modified | Uses existing fields; no schema change planned.                          |
| `src/app/projects/page.tsx`                          | Not modified | Current ordering logic remains (featured, then incoming by ribbon text). |
| `src/ui/organisms/ProjectCard/variants/Grid.tsx`     | Not modified | Uses `img` and ribbon as provided by data.                               |
| `src/ui/organisms/ProjectCard/variants/Featured.tsx` | Not modified | Uses `screenshots[0]                                                     |     | img` and ribbon; ensure data supports this. |

## Assumptions & Data Sourcing

- Missing content (descriptions, tech stack, links) will be stubbed using the minimal fields currently required by the schema and existing project entries.
- Any external URLs (repo, live demo, case study) are unknown; omit or use placeholders consistent with existing mock data conventions.
- Use PNG assets from `public/images/projects/incoming/` when available to avoid Next/Image SVG configuration issues.
- If only a single image exists per incoming project, set `img` only and omit `screenshots` unless required for featured rendering.

## Image Usage

- `img` should reference `public/images/projects/incoming/<file>` for all three items.
- For the featured project, set `screenshots[0]` to the same incoming image (if a separate hero image is not provided) to ensure the featured card renders consistently.

## Testing Notes

- Run `npm run validate:projects` after updating mock data.
- If screenshots or ribbons affect visual output, spot-check the Projects page and project detail rendering in dev.

## Risks

| Risk                                                | Likelihood | Mitigation                                                                 |
| --------------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| Incoming detection is coupled to ribbon text        | Medium     | Use exact text "Incoming" (case-sensitive in data) to match current logic. |
| SVG images may not render via Next/Image defaults   | Low        | Prefer PNG assets; use SVG only if current config already supports it.     |
| Featured card lacks screenshot for featured project | Low        | Set `screenshots[0]` to the same incoming image when needed.               |

## Rollback Plan

Revert the new entries in `src/domains/project/model/mock.ts` and remove any new references to incoming image files. No code changes are expected.

## Dependencies

- Incoming asset files must exist in `public/images/projects/incoming/` with stable filenames.

## Success Criteria

- [ ] The three incoming projects appear on the Projects page in the intended order (featured, then incoming).
- [ ] Each new project renders with the correct incoming image and ribbon.
- [ ] `npm run validate:projects` passes without schema errors.
