## Exploration: Projects priority order

### Current State

- Projects are ordered in `src/app/projects/page.tsx` by `getOrderedProjects`: featured first (`project.featured === true`), then incoming (ribbon text equals "Incoming"), then standard.
- Incoming detection is string-based: `project.featuredCard?.ribbon?.text?.trim()?.toLowerCase()` === "incoming".
- Data source is `src/domains/project/model/mock.ts`, validated by `src/domains/project/model/schema.ts` (requires `featured: boolean`, optional `featuredCard` with ribbon).
- UI layout still depends on `featured` for blade pairing; ordering only affects which items appear first in the page list.

### Affected Areas

- `src/app/projects/page.tsx` — ordering logic (`isIncomingProject`, `getOrderedProjects`) must change to use numeric `order`/`priority` instead of featured/incoming rules.
- `src/domains/project/model/schema.ts` — add numeric field (`order` or `priority`) to `ProjectSchema`.
- `src/domains/project/model/mock.ts` — add the new numeric field to every project entry, ensure values reflect desired ordering (higher first).
- `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` — update "Ordering priority" test to assert numeric ordering instead of featured/incoming grouping.
- `src/domains/project/model/__tests__/schema.test.ts` — update test fixtures to include the new required numeric field (if required).
- `src/domains/project/model/__tests__/validate-data.test.ts` — add/adjust validations for the new numeric field if it is required or if new constraints are introduced.

### Approaches

1. **Required numeric priority field** — Introduce `priority: number` (or `order: number`) in schema, update mock data, and sort descending by this field.
   - Pros: Explicit ordering, decoupled from ribbon text; deterministic and simple.
   - Cons: Requires touching all project entries and tests; potential migration for real API data.
   - Effort: Medium

2. **Optional priority with fallback** — Add `priority?: number` and order by it when present, falling back to existing featured/incoming ordering.
   - Pros: Backwards-compatible with existing data; smaller data migration if API exists.
   - Cons: Conflicts with goal to remove current ordering logic; keeps legacy coupling.
   - Effort: Low/Medium

### Recommendation

Use **Approach 1** with a required numeric field (pick one name, e.g., `priority`). The goal explicitly calls for removing the featured/incoming ordering logic, and a required numeric priority makes ordering deterministic and independent of ribbon text while keeping `featured` available for layout.

### Risks

- Missing or inconsistent priority values will break ordering expectations and may cause tests or data validation to fail.
- Ordering changes may alter which items are paged into blades; verify pagination expectations in tests.
- If `featured` is removed or deprioritized unintentionally, featured blade pairing could degrade the layout.

### Ready for Proposal

Yes — recommend adding required numeric `priority` (or `order`) to schema, updating mock data, and revising ordering logic/tests to sort by this field descending.
