# Design: Projects Priority Order

## Technical Approach

Add a required numeric `priority` to `ProjectSchema` and mock data, then replace the current featured/incoming ordering with a stable descending sort by `priority`. Keep `featured` logic exclusively for blade pairing/layout as it exists today. This aligns with the proposal and the projects spec requirements for explicit priority-based ordering and stable ties.

## Architecture Decisions

### Decision: Required numeric priority on ProjectSchema

**Choice**: Add `priority: number` as a required field in `ProjectSchema` and `ProjectModel`.
**Alternatives considered**: Optional `priority` with fallback to featured/incoming ordering.
**Rationale**: The specs require deterministic ordering independent of ribbon text or `featured`, and the proposal explicitly removes the existing ordering logic. Required priority enforces the contract in mock data and future API payloads.

### Decision: Stable descending sort for ordering

**Choice**: Sort projects by `priority` descending while preserving original order for ties.
**Alternatives considered**: Secondary sort keys (e.g., slug/title) or reusing featured/incoming as tiebreakers.
**Rationale**: The spec calls for stable ordering on ties and explicitly forbids featured/ribbon from affecting order. Stable sort preserves existing array order and avoids hidden coupling.

### Decision: Keep featured for layout only

**Choice**: Retain `featured` to build blade pairs; ordering only uses `priority`.
**Alternatives considered**: Remove featured usage or repurpose it for ordering.
**Rationale**: The layout pairing in `src/app/projects/page.tsx` relies on `featured` to split hero/grid blades; removing it would be a separate UX change and out of scope.

## Data Flow

Projects are fetched, optionally filtered by tech, ordered by priority, paginated, then split into blade pairs using `featured` for layout.

    useProjects() ──→ filter by tech ──→ stable sort by priority desc ──→ slice by page
           │                                                                  │
           └────────────────────────────── blade pairing (featured vs grid) ──┘

## File Changes

| File                                                        | Action | Description                                                                   |
| ----------------------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| `src/domains/project/model/schema.ts`                       | Modify | Add required `priority: number` to `ProjectSchema` and the inferred types.    |
| `src/domains/project/model/mock.ts`                         | Modify | Add `priority` values for each project entry matching desired order.          |
| `src/app/projects/page.tsx`                                 | Modify | Replace featured/incoming ordering with stable descending sort by `priority`. |
| `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` | Modify | Update ordering test to assert priority-based ordering.                       |
| `src/domains/project/model/__tests__/schema.test.ts`        | Modify | Include `priority` in valid fixtures; add missing-field coverage.             |
| `src/domains/project/model/__tests__/validate-data.test.ts` | Modify | Ensure mock data validation includes required `priority`.                     |

## Interfaces / Contracts

The project model will require a `priority` number.

```ts
// src/domains/project/model/schema.ts
export const ProjectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  outcomes: z.string().optional(),
  technicalHighlights: z.array(z.string()).optional(),
  demo: z.string().url().optional(),
  repository: z.string().url().optional(),
  img: z.string(),
  screenshots: z.array(z.string()).optional(),
  tags: z.string(),
  featured: z.boolean(),
  priority: z.number(),
  featuredCard: ProjectFeaturedCardSchema,
});
```

Ordering helper contract (implementation detail in `page.tsx`):

```ts
const getOrderedProjects = (projects: ProjectModel[]): ProjectModel[] =>
  stableSort(projects, (a, b) => b.priority - a.priority);
```

## Testing Strategy

| Layer           | What to Test                              | Approach                                                                                                   |
| --------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Unit            | Schema requires `priority`                | Extend `schema.test.ts` to include `priority` in valid fixtures and assert missing/invalid priority fails. |
| Integration     | Project ordering uses priority descending | Update `ProjectsPageFiltering.test.tsx` ordering case with explicit `priority` values and expected order.  |
| Data validation | Mock data conforms to schema              | `validate-data.test.ts` continues to parse mock data; ensure all entries have `priority`.                  |

## Migration / Rollout

No migration required beyond updating local mock data. For real API payloads, the required `priority` contract will be documented and enforced by schema validation in the same release.

## Open Questions

- [ ] Should we enforce a priority range (e.g., integer >= 0) or allow any number as long as ordering is correct?
- [ ] Do we want to document the current priority values in `docs/content-management.md` for future edits?
