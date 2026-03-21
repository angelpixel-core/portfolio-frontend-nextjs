## Exploration: Projects priority + incoming assets

### Current State

- Projects data lives in `src/domains/project/model/mock.ts` and is validated by `src/domains/project/model/schema.ts`. Each project has required `img`, optional `screenshots`, `featured` boolean, and optional `featuredCard` metadata (ribbon, focus line, architecture, badges).
- Projects ordering is handled client-side in `src/app/projects/page.tsx` by `getOrderedProjects`: featured first, then incoming (non-featured with ribbon text "Incoming"), then standard. Incoming detection uses `project.featuredCard?.ribbon?.text` lowercased.
- Project cards use `img` (grid) and `screenshots[0] || img` (featured) with `FramerImage` (Next/Image). Ribbons render via `ImageRibbon` when `featuredCard.ribbon` exists. Project detail uses `project.img` and optional `project.screenshots`.
- Incoming assets exist in `public/images/projects/incoming/` but are not referenced in project data today.

### Affected Areas

- `src/domains/project/model/mock.ts` — canonical data source where new projects, `featured`, `featuredCard.ribbon`, and image paths are specified.
- `src/domains/project/model/schema.ts` — defines required fields and optional `featuredCard` shape used for ribbons/architecture.
- `src/app/projects/page.tsx` — ordering logic (featured -> incoming -> standard) and incoming detection by ribbon text.
- `src/ui/organisms/ProjectCard/variants/Grid.tsx` — uses `img` and displays ribbon for non-featured incoming.
- `src/ui/organisms/ProjectCard/variants/Featured.tsx` — uses `screenshots[0] || img`, shows ribbon, and provides architecture fallback.
- `src/ui/organisms/ProjectDetail/index.tsx` — uses `img` and `screenshots` for detail page.
- `public/images/projects/incoming/` — available incoming images (png/svg) for new project entries.

### Approaches

1. **Data-only priority via existing fields** — Add new projects in `mock.ts`, set `featured: true` for the top-priority item, and set `featuredCard.ribbon.text = "Incoming"` for all incoming items. Use incoming images in `img` and optionally in `screenshots`.
   - Pros: No code changes; ordering logic already supports featured and incoming; ribbons show automatically in grid/featured cards.
   - Cons: Priority is implied via `featured`/ribbon text; relies on label string match for incoming status.
   - Effort: Low

2. **Explicit priority field in schema** — Introduce a `priority` or `status` field (e.g., `"featured" | "incoming" | "standard"`) and update ordering logic to use it; keep ribbon text as display-only.
   - Pros: Clear, data-driven ordering without relying on ribbon text; reduces label coupling.
   - Cons: Requires schema updates, mock updates, and usage changes across components/tests.
   - Effort: Medium

3. **Incoming assets as separate image fields** — Add `incomingImg` or `previewImg` field and update card/detail rendering to prefer it for incoming projects.
   - Pros: Separates incoming visuals from main cover images; keeps existing assets intact.
   - Cons: Requires schema and component changes; adds conditional rendering complexity.
   - Effort: Medium

### Recommendation

Approach 1: data-only priority via existing fields. The ordering pipeline already prioritizes featured then incoming by ribbon text, and the UI components already render ribbons and images. This matches the goal and keeps changes scoped to data updates only, which is consistent with the "do not implement code" constraint for now.

### Risks

- Incoming status is coupled to ribbon text (case-insensitive "Incoming"). A typo or different label will skip the incoming group.
- If any incoming asset uses SVG, Next/Image may require additional config or `unoptimized` usage; prefer the PNG assets already present.
- If a featured project lacks `featuredCard` and `screenshots`, featured card relies on `img` only and architecture overlay falls back to preview.

### Ready for Proposal

Yes — propose updating project mock data to add the new items, assign featured/incoming status via `featured` and `featuredCard.ribbon.text`, and use incoming image paths from `public/images/projects/incoming/`.
