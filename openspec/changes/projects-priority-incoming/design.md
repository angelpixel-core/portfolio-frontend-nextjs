# Design: Projects Priority Incoming

## Technical Approach

Update the project mock data to add three incoming projects and express priority using existing fields (`featured` and `featuredCard.ribbon.text`). Images will reference incoming PNG assets under `public/images/projects/incoming/` with the featured project using `screenshots[0]` as a fallback preview to ensure featured rendering works without code changes.

## Architecture Decisions

### Decision: Use existing priority and incoming fields

**Choice**: Encode priority via `featured` and incoming status via `featuredCard.ribbon.text = "Incoming"`.
**Alternatives considered**: Add a new `priority` or `status` field to `ProjectSchema` and update ordering logic.
**Rationale**: The current ordering logic in `src/app/projects/page.tsx` already prioritizes featured and then incoming by ribbon text. A data-only change satisfies the scope without modifying components or schema.

### Decision: Use incoming PNG assets for images

**Choice**: Reference `/images/projects/incoming/*.png` for `img` (and `screenshots[0]` for the featured project if needed).
**Alternatives considered**: Use SVG assets from the incoming folder or add new image fields.
**Rationale**: PNG assets are already available and compatible with current `next/image` usage, avoiding config changes or unoptimized rendering.

### Decision: Reuse `screenshots[0]` as featured preview

**Choice**: Set `screenshots[0]` to the same path as `img` for `financial-core-simulator` when no dedicated screenshot exists.
**Alternatives considered**: Leave `screenshots` empty and rely on `img` only.
**Rationale**: The featured card uses `screenshots[0] || img`; explicitly setting `screenshots[0]` ensures consistent behavior for featured rendering and detail gallery without code changes.

## Data Flow

Project data flows from mock data through the existing query hook and UI ordering pipeline:

    src/domains/project/model/mock.ts
        └─ useProjects() (queries layer)
             └─ getOrderedProjects() in src/app/projects/page.tsx
                  ├─ featured (project.featured === true)
                  ├─ incoming (featuredCard.ribbon.text === "Incoming")
                  └─ standard
             └─ ProjectCard variants
                  ├─ Featured: screenshots[0] || img + ImageRibbon
                  └─ Grid: img + ImageRibbon

## File Changes

| File                                | Action | Description                                                                               |
| ----------------------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `src/domains/project/model/mock.ts` | Modify | Add three project entries with `featured`/`featuredCard.ribbon` and incoming image paths. |

## Interfaces / Contracts

No new interfaces. Data will conform to the existing `ProjectSchema`:

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
  featuredCard: ProjectFeaturedCardSchema,
});
```

Incoming projects will set:

```ts
featuredCard: {
  ribbon: {
    text: "Incoming",
    variant: "wip",
  },
}
```

## Testing Strategy

| Layer       | What to Test                  | Approach                                                                          |
| ----------- | ----------------------------- | --------------------------------------------------------------------------------- |
| Unit        | Project data validation       | Run `npm run validate:projects` to confirm new entries meet schema.               |
| Integration | Ordering and ribbon rendering | Spot-check Projects page in dev to verify featured/incoming ordering and ribbons. |
| E2E         | Not required                  | No new behavior; existing E2E suite unchanged.                                    |

## Migration / Rollout

No migration required.

## Open Questions

- [ ] Are there preferred descriptions/tech stacks for `financial-core-simulator`, `erc20-token`, and `e-commerce`, or should we follow minimal stub content patterns from existing mock data?
