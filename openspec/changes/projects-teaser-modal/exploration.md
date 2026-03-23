## Exploration: projects-teaser-modal

### Current State

- Project cards always link to `/projects/[slug]` for both image and title in `GridProjectCard` and `FeaturedProjectCard`.
- Projects listing uses `useProjects()` with default visibility, so only `visible: true` projects render, but slug pages exist for any project in mock/API.
- Status is not modeled explicitly. There is a `featuredCard.ribbon` with `variant` values (`wip`, `planned`, `shipped`) and text labels like "Incoming".
- Analytics events live in `src/services/analytics/plausible.ts` with a fixed union type; ProjectCard tracks `project_demo_click` and `project_architecture_click`, and ProjectDetail tracks `project_view` and demo/architecture clicks.
- Overlays use `Floating` / `FloatingMobile` components (focus trap, escape to close, outside click behavior). Project architecture modal is a simple overlay built on `Floating`.

### Affected Areas

- `src/ui/organisms/ProjectCard/variants/Grid.tsx` — uses `Link` for image and title; would need non-link wrapper + modal trigger for coming-soon/in-progress projects.
- `src/ui/organisms/ProjectCard/variants/Featured.tsx` — same link behavior and includes `ArchitectureOverlay`; would need teaser modal support and click gating.
- `src/ui/organisms/ProjectCard/ProjectCard.types.ts` — if adding a status field to the model or new props, types must reflect it.
- `src/domains/project/model/schema.ts` and `src/domains/project/model/mock.ts` — if adding a status field or deriving status, mock data and schema must be updated.
- `src/services/analytics/plausible.ts` — add new event names for teaser interactions.
- `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` — tests will need to assert link disabling and event tracking.
- `src/ui/overlays/Floating/index.tsx` or a new overlay component — likely host for the teaser modal for accessibility and consistent styling.

### Approaches

1. **Add explicit `status` field on ProjectModel** — `status: "live" | "in-progress" | "planned"` and use it to gate links + drive teaser modal.
   - Pros: Clear domain intent, UI driven by data, easier to extend (e.g., SEO rules, filter by status).
   - Cons: Requires schema + mock updates, test fixture updates, and possible API alignment.
   - Effort: Medium.

2. **Infer status from existing ribbon variant** — treat `featuredCard.ribbon.variant` of `wip`/`planned` as non-clickable.
   - Pros: No schema change; minimal data churn.
   - Cons: Coupling display metadata to behavior; cards without ribbons cannot be gated; harder to evolve.
   - Effort: Low.

3. **Add a boolean `isClickable` or `availability` flag** — small new field separate from ribbon and status.
   - Pros: Minimal data and code changes; easy to adopt incrementally.
   - Cons: Less expressive than status; can drift from ribbon or marketing copy.
   - Effort: Low/Medium.

### Recommendation

Adopt **Approach 1 (explicit `status`)** to keep UX behavior and data aligned. Use `status !== "live"` to disable internal links and open a teaser modal. Continue to use `featuredCard.ribbon` for visual labeling; optionally default ribbon variant/text when status is `in-progress` or `planned` to keep cards consistent. This aligns with the research note about "UI driven by domain" and enables future SEO gating if desired.

### Risks

- Touch behavior: `useTouchState` suppresses clicks on links; if links are removed, tap-to-open-modal needs to avoid being blocked by touch handlers.
- Analytics type union: new events require updates across type definitions and tests; forgetting to update breaks type safety.
- Direct slug access: detail pages will still be reachable unless `fetchBySlug` is gated by status (optional scope decision).

### Ready for Proposal

Yes — need one product decision: choose status modeling (recommended: explicit `status` field) and confirm teaser CTA target (e.g., contact section anchor or chat panel).
