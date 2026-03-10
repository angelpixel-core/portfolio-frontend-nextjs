# Design: Adapt Project Cards to Request 05

## Technical Approach

Implement request-05 as a featured-card-only evolution on top of the current `ProjectModel` contract. We will extend the domain schema with optional featured metadata and architecture-view input, then adapt `FeaturedProjectCard` and `ActionLinks` to render a six-part hierarchy and semantic CTA row while keeping `GridProjectCard` behavior unchanged.

Architecture overlay behavior will reuse the existing Floating dialog interaction model (focus trap, Escape close, click-outside close, focus restore) by making Floating accept an explicit close callback for non-menu/non-chat consumers, then mounting a project-specific overlay from the featured card.

This maps directly to spec requirements:

- six-part featured hierarchy
- semantic CTAs with target-aware rendering
- optional focus microline
- architecture action opens overlay
- backward-compatible fallbacks for legacy records and non-featured cards

## Architecture Decisions

### Decision: Keep the base project contract backward compatible with optional request-05 fields

**Choice**: Extend `ProjectSchema` with optional request-05 fields instead of replacing existing `summary/tags/demo/repository` fields.
**Alternatives considered**: (1) Breaking rename to new required featured-only fields; (2) separate featured-only DTO disconnected from `ProjectModel`.
**Rationale**: The projects query pipeline (`model.fetchAll/fetchBySlug`) and existing consumers (`ProjectCard`, detail page, tests) depend on current fields. Optional extension allows phased mock updates and protects non-featured cards from regressions.

### Decision: Use a nested optional featured metadata block

**Choice**: Introduce an optional object (e.g. `featuredCard`) that holds request-05 featured-only fields (context badges, focus line, architecture content metadata).
**Alternatives considered**: Add many new top-level optional fields; infer all new values from existing `tags/summary/screenshots`.
**Rationale**: A nested block isolates presentation-specific additions, avoids top-level schema sprawl, and creates a clear compatibility boundary. Legacy records remain valid with `featuredCard` omitted.

### Decision: Reuse Floating interaction model by adding an explicit close contract

**Choice**: Extend `Floating` with optional `onRequestClose` (and `closeOnOutsideClick` default true) and use it for project architecture overlay.
**Alternatives considered**: (1) New overlay component copied from Floating; (2) bind architecture overlay to Redux menu/chat slices.
**Rationale**: Current Floating close logic is coupled to menu/chat slices, which is unsafe for project overlays. Adding an explicit callback preserves existing behavior for menu/chat and enables safe reuse without duplicate accessibility logic.

### Decision: Keep CTA semantics fixed in UI, not data-driven labels

**Choice**: Render labels as `Architecture`, `Source Code`, `Live Demo` from component logic and only use data for target availability/URLs.
**Alternatives considered**: Data-defined label text per project.
**Rationale**: The spec requires explicit semantics. Fixed labels prevent wording drift and reduce test fragility while still allowing target-level fallbacks.

## Data Flow

```text
projects mock/API -> ProjectSchema.parse -> ProjectCard(project)
                                        |
                             project.featured ? Featured : Grid

Featured render path:
  FeaturedProjectCard
    -> derives featured context (context badges, focus line, CTA availability)
    -> renders hierarchy blocks in order
    -> ActionLinks(variant="featured", architectureTarget?, demo?, repository?)
           |
           +-- Architecture button click -> setArchitectureOpen(true)
                                            -> <Floating onRequestClose=...>
                                            -> architecture media/content

Overlay close triggers:
  Escape / outside click / close button
    -> onRequestClose
    -> setArchitectureOpen(false)
    -> focus returns to invoking Architecture action
```

### Fallback precedence

For featured cards, values resolve in this order:

1. Request-05 featured metadata (`featuredCard.*`) when present.
2. Legacy equivalents (`tags`, `summary`, `screenshots[0]`, `img`, `demo`, `repository`) when compatible.
3. Omit optional section entirely (focus microline, architecture action, preview support extras) if no safe value exists.

CTA visibility precedence:

- `Architecture` appears only when architecture target is usable.
- `Source Code` appears only when `repository` is usable.
- `Live Demo` appears only when `demo` is usable.
- If none are usable, action row is not rendered.

## File Changes

| File                                                          | Action | Description                                                                                                   |
| ------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| `src/domains/project/model/schema.ts`                         | Modify | Add optional `featuredCard` metadata and architecture content contract while preserving legacy fields.        |
| `src/domains/project/model/mock.ts`                           | Modify | Update featured fixtures with request-05 context badges, domain summary/focus copy, and architecture targets. |
| `src/ui/organisms/ProjectCard/ProjectCard.types.ts`           | Modify | Extend props/types for featured metadata and architecture action support.                                     |
| `src/ui/organisms/ProjectCard/variants/Featured.tsx`          | Modify | Implement six-part hierarchy rendering, focus microline behavior, and architecture overlay trigger state.     |
| `src/ui/organisms/ProjectCard/ActionLinks.tsx`                | Modify | Add semantic CTA rendering (`Architecture`, `Source Code`, `Live Demo`) with target-aware visibility.         |
| `src/ui/organisms/ProjectCard/TechStackIcons.tsx`             | Modify | Support featured text badge mode (when required) while keeping icon mode for grid/default.                    |
| `src/ui/organisms/ProjectCard/styles.css`                     | Modify | Add request-05 featured structure classes and responsive spacing/alignment for hierarchy blocks and CTA row.  |
| `src/ui/overlays/Floating/index.tsx`                          | Modify | Add optional explicit close callback path so overlay can be reused outside menu/chat slices.                  |
| `src/ui/organisms/ProjectCard/ArchitectureOverlay.tsx`        | Create | Project-focused overlay content wrapper using Floating interaction model.                                     |
| `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx` | Modify | Update featured hierarchy, CTA semantics, fallback behavior, and architecture overlay interaction coverage.   |
| `src/ui/overlays/__tests__/Floating.a11y.test.tsx`            | Modify | Add coverage for explicit close callback behavior without regressing existing dialog a11y expectations.       |
| `e2e/testids.ts`                                              | Modify | Add stable selectors for architecture/source/demo action semantics and architecture overlay container.        |
| `e2e/projects-articles.spec.ts`                               | Modify | Align Projects assertions with semantic CTAs and architecture overlay open/close behavior.                    |

## Interfaces / Contracts

```ts
// src/domains/project/model/schema.ts
const ProjectFeaturedCardSchema = z
  .object({
    contextBadges: z.array(z.string()).optional(),
    focusLine: z.string().optional(),
    architecture: z
      .object({
        image: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional(),
      })
      .optional(),
  })
  .optional();

const ProjectSchema = z.object({
  // existing fields kept as-is
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  outcomes: z.string().optional(),
  demo: z.string().url().optional(),
  repository: z.string().url().optional(),
  img: z.string(),
  screenshots: z.array(z.string()).optional(),
  tags: z.string(),
  featured: z.boolean(),

  // request-05 extension
  featuredCard: ProjectFeaturedCardSchema,
});
```

```ts
// src/ui/organisms/ProjectCard/ProjectCard.types.ts
export interface ActionLinksProps {
  architectureTarget?: {
    image: string;
    alt?: string;
    caption?: string;
  };
  demo?: string;
  repository?: string;
  projectTitle: string;
  onOpenArchitecture?: () => void;
  isTouched?: boolean;
  variant?: "featured" | "grid";
  className?: string;
}
```

```ts
// src/ui/overlays/Floating/index.tsx
interface FloatingProps {
  id: string;
  title?: string;
  children: ReactNode;
  onRequestClose?: () => void; // new, optional
}
```

## Component Boundaries

- `FeaturedProjectCard` owns content assembly and local architecture overlay open state.
- `ActionLinks` owns semantic CTA rendering and action availability filtering; it does not own overlay state.
- `ArchitectureOverlay` owns architecture media presentation and delegates focus trap/escape/outside-close to `Floating`.
- `Floating` remains a generic dialog shell; menu/chat keep their existing behavior, while project overlays use explicit close callback.

## Testing Strategy

| Layer       | What to Test                                       | Approach                                                                                                                                          |
| ----------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | Schema compatibility (legacy + request-05 records) | Add parse tests for records with/without `featuredCard` and with partial architecture metadata.                                                   |
| Unit        | Featured hierarchy and focus microline behavior    | Update `ProjectCard.test.tsx` assertions for six-part order and conditional microline rendering.                                                  |
| Unit        | CTA semantics and availability                     | Assert labels `Architecture/Source Code/Live Demo`, and absence when targets missing.                                                             |
| Unit        | Architecture overlay interaction                   | In `ProjectCard.test.tsx`, trigger Architecture action and assert dialog open/close and focus-return behavior.                                    |
| Integration | Floating explicit close callback                   | Extend `Floating.a11y.test.tsx` to ensure Escape/outside click routes through callback when provided.                                             |
| E2E         | Projects featured CTA semantics                    | Update selectors in `e2e/testids.ts` and assert semantic actions on featured cards.                                                               |
| E2E         | Architecture overlay flow                          | In `e2e/projects-articles.spec.ts`, open architecture overlay from featured card, validate visible content, close, and continue page interaction. |

## Migration / Rollout

No migration required.

Rollout is incremental and contract-safe:

1. Ship schema optional fields.
2. Update featured mock entries.
3. Ship featured rendering and CTA semantics.
4. Ship overlay integration and synchronized tests.

## Open Questions

- [ ] Should architecture overlay content support only image + caption in this change, or also markdown/text narrative blocks for future cards?
- [ ] Should featured tech badges default to icon mode when no text-badge metadata is provided, or force text mode for all featured cards in request-05?
