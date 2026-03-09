# Design: Experience Company-First Layout V2

## Technical Approach

Implement the change contract-first from the domain boundary outward:

1. Extend `JobExperienceSchema` to the approved v2 contract (`year`, `contextBadges[]`, `technologies[]`, `group`) and keep existing fields (`position`, `company`, `companyLink`, `time`, `address`, `work`) required for current UI continuity.
2. Update `job-experience` mock data to provide explicit metadata arrays and `group` values, stopping technology derivation from `work[].tags`.
3. Refactor `Experience` to render company-first hierarchy and metadata chips from explicit fields only.
4. Refactor `Experiences` to build deterministic grouped sections (`engineering`, then `platform`) and omit empty groups.
5. Synchronize tests and stories with the new rendering contract.

This maps directly to the spec requirements for explicit metadata, technology source isolation, and deterministic grouped rendering.

## Architecture Decisions

### Decision: Keep v2 fields in the domain schema (not UI-only props)

**Choice**: Add `year`, `contextBadges`, `technologies`, and `group` to `src/domains/job-experience/model/schema.ts` and use that single type through query + UI.
**Alternatives considered**: (a) keep domain shape unchanged and inject derived UI props in components; (b) create a parallel UI adapter type only in `Experience`.
**Rationale**: The contract is a data requirement, not only a presentational concern. Centralizing in Zod keeps validation/type safety aligned across mocks, API responses, hooks, and tests.

### Decision: Deterministic grouping with explicit allow-list

**Choice**: Group entries via a constant ordered list `['engineering', 'platform']` and render sections by iterating this list. Entries with missing/invalid `group` are excluded from grouped render output.
**Alternatives considered**: (a) dynamic grouping from encountered values; (b) fallback bucket like `other`; (c) silent coercion of invalid values.
**Rationale**: Spec requires deterministic order and no silent coercion. Ordered allow-list guarantees stable output and prevents accidental group drift.

### Decision: No technology fallback from `work[].tags`

**Choice**: Render technology chips exclusively from `technologies[]`; keep `work[].tags` only for legacy detail semantics and optional future removal.
**Alternatives considered**: (a) merge `technologies[]` with `work[].tags`; (b) fallback to tags when `technologies[]` is empty.
**Rationale**: Spec explicitly forbids deriving technologies from nested work tags. This preserves contract clarity and avoids hidden coupling.

### Decision: Backward compatibility through transitional normalization at model boundary

**Choice**: Introduce a temporary `normalizeLegacyExperience` mapper in `src/domains/job-experience/model/index.ts` (or adjacent helper) that accepts legacy records and outputs v2 shape for fetch paths during rollout.
**Alternatives considered**: (a) hard cutover with strict parse only; (b) dual-schema support in UI components.
**Rationale**: Hard cutover can fail the whole experiences section when older API payloads still exist. Boundary normalization contains migration logic in one place and keeps UI/components v2-only.

## Data Flow

```text
mock/API payload
   |
   v
JobExperienceModel.fetchAll()
   |
   +--> normalizeLegacyExperience(record)   (temporary migration layer)
   |
   v
JobExperiencesSchema (v2) validation
   |
   v
useJobExperiences (React Query)
   |
   v
Experiences organism
   |
   +--> if loading/error/empty: existing fallback path
   |
   +--> group by ordered keys: engineering -> platform
   |        |
   |        +--> skip invalid/missing groups and empty group sections
   |
   v
Experience molecule per item
   |
   +--> company-first header (company primary context)
   +--> year + contextBadges[] metadata row
   +--> technologies[] chips only
   +--> expandable work[] details (unchanged behavior)
```

## File Changes

| File                                                           | Action | Description                                                                                                                                                 |
| -------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/domains/job-experience/model/schema.ts`                   | Modify | Add `year`, `contextBadges`, `technologies`, and `group` enum (`engineering`/`platform`) to `JobExperienceSchema`; export `JobExperienceGroup` type.        |
| `src/domains/job-experience/model/mock.ts`                     | Modify | Migrate all mock entries to provide explicit v2 fields and stop relying on `work[].tags` for technology chips.                                              |
| `src/domains/job-experience/model/index.ts`                    | Modify | Add temporary legacy-to-v2 normalization before schema parse for backward compatibility while API payloads converge.                                        |
| `src/ui/molecules/Experience/index.tsx`                        | Modify | Update props to include v2 fields and render company-first card metadata (`year`, `contextBadges[]`, `technologies[]`) without deriving from `work[].tags`. |
| `src/ui/molecules/Experience/styles.css`                       | Modify | Add/adjust classes for company-first hierarchy, metadata badge rows, and technology chip section while preserving responsive behavior.                      |
| `src/ui/organisms/Experiences/index.tsx`                       | Modify | Implement deterministic grouped rendering (`engineering`, `platform`), omit empty groups, and preserve loading/error fallback flow.                         |
| `src/ui/organisms/Experiences/styles.css`                      | Modify | Add group heading/container spacing styles consistent with existing section typography and breakpoint system.                                               |
| `src/ui/molecules/Experience/__tests__/Experience.test.tsx`    | Modify | Update assertions for explicit metadata rendering and technology isolation from `technologies[]`.                                                           |
| `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx`  | Modify | Add tests for fixed group order, empty-group omission, and invalid-group behavior under grouped rendering.                                                  |
| `src/ui/molecules/Experience/stories/Experience.stories.tsx`   | Modify | Align story args with v2 fields and add stories for empty badges/technologies.                                                                              |
| `src/ui/organisms/Experiences/stories/Experiences.stories.tsx` | Modify | Add grouped rendering examples (both groups present / one group missing).                                                                                   |

## Interfaces / Contracts

```ts
// src/domains/job-experience/model/schema.ts
export const JobExperienceGroupSchema = z.enum(["engineering", "platform"]);

export const JobExperienceSchema = z.object({
  id: z.number(),
  position: z.string(),
  company: z.string(),
  companyLink: z.string().url(),
  time: z.string(),
  year: z.string(),
  address: z.string(),
  contextBadges: z.array(z.string()),
  technologies: z.array(z.string()),
  group: JobExperienceGroupSchema,
  work: z.array(JobExperienceTaskSchema).optional(),
});
```

```ts
// src/ui/organisms/Experiences/index.tsx
const GROUP_ORDER = ["engineering", "platform"] as const;

type GroupedExperiences = Record<(typeof GROUP_ORDER)[number], JobExperience[]>;

// grouping behavior
// - include only entries whose group is in GROUP_ORDER
// - render sections by GROUP_ORDER iteration
// - skip rendering section when grouped[group].length === 0
```

## Testing Strategy

| Layer            | What to Test                                                       | Approach                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit             | Schema enforces required v2 fields and enum-constrained `group`    | Add/adjust schema tests (or model fetch tests) using valid and invalid fixtures; assert invalid `group` fails validation.                                                        |
| Unit             | Experience card renders explicit metadata and technology isolation | Update `Experience.test.tsx` to assert `year`, `contextBadges`, `technologies`; verify `work[].tags` values are not shown as technology chips when absent from `technologies[]`. |
| Integration      | Experiences grouped rendering order and empty-group behavior       | Update `Experiences.test.tsx` with fixtures for both groups, single-group, and invalid-group entries; assert heading order and omission of empty group containers.               |
| Integration      | Loading/error fallback behavior remains unchanged                  | Preserve current loading/error tests and add assertion that no group headings render in error fallback path.                                                                     |
| Visual/Storybook | New card/group layouts and edge states                             | Update stories for grouped and empty array cases; use Storybook smoke/snapshot checks if available.                                                                              |

## Migration / Rollout

1. **Phase 1 (compatibility)**: ship schema + UI changes with a temporary model-level normalizer for legacy payloads.
   - Legacy `time` can seed `year` (safe textual extraction) when missing.
   - Legacy missing `contextBadges`/`technologies` default to empty arrays.
   - Legacy missing/invalid `group` is marked invalid for grouped rendering (entry omitted, optional log warning in development).
2. **Phase 2 (contract enforcement)**: once API/mocks are fully v2, remove legacy normalizer and require strict `JobExperiencesSchema` parse-only path.
3. **Rollback**: revert schema + mock + UI/test commits together to restore prior role-first behavior.

## Open Questions

- [ ] Should entries with invalid/missing `group` be logged (dev-only) to aid content debugging, or silently omitted from grouped rendering?
- [ ] After v2 stabilization, do we remove `tags` from `JobExperienceTaskSchema`, or keep it for non-technology detail semantics?
