# Story 14.1: Project Card Component

Status: ready-for-dev

## Story

As a **portfolio visitor**,
I want **project cards that show technology stack and action links without requiring hover**,
so that **I can quickly assess technical skills and access demos/code on any device**.

## Acceptance Criteria

### AC1: Tech stack icons visible on card
**Given** a project card is rendered
**When** the user views the card (no interaction)
**Then** 3-4 technology icons are visible based on `project.technologies` array
**And** icons use existing atoms from `@/atoms/icons` (ReactIcon, TypeScriptIcon, etc.)
**And** overflow technologies show "+N more" indicator if > 4

### AC2: GitHub/Demo links structure prepared for hover
**Given** a project card is rendered
**When** the card has `repository` or `demo` URLs
**Then** link elements exist in DOM (may be hidden by default)
**And** links are accessible via keyboard (tab navigation)
**And** links have proper `aria-label` for screen readers

### AC3: Card handles variable content gracefully (FR14.7)
**Given** project data with varying completeness
**When** rendering cards with 1, 3, or 6 projects
**Then** layout does not break with any count
**And** cards without `repository` don't show GitHub link
**And** cards without `demo` don't show demo link
**And** cards without `technologies` show no icons (graceful degradation)

### AC4: Featured variant maintains existing behavior
**Given** a project with `featured: true`
**When** rendering via FeaturedProject component
**Then** tech stack icons are added (same as non-featured)
**And** existing image zoom hover works unchanged
**And** summary text continues to display

### AC5: TypeScript migration for Project component
**Given** the existing `Project` and `FeaturedProject` molecules
**When** migrating to TypeScript
**Then** components use `ProjectModel` type from `@/domains/project/model/schema`
**And** props are properly typed with explicit interfaces
**And** no `any` types are introduced

### AC6: Unit tests cover all variants
**Given** the refactored ProjectCard component
**When** running unit tests
**Then** tests verify: tech icons render, links conditional render, edge cases (0 techs, no links)
**And** tests use Testing Library patterns consistent with project
**And** snapshot tests capture visual structure

## Tasks / Subtasks

- [ ] **Task 1: Create ProjectCard component with variants** (AC: 1, 2, 4, 5)
  - [ ] 1.1 Create `src/ui/organisms/ProjectCard/index.tsx` with TypeScript
  - [ ] 1.2 Create `ProjectCard.types.ts` with props interface extending ProjectModel
  - [ ] 1.3 Implement base card structure with tech icons slot
  - [ ] 1.4 Create `variants/Featured.tsx` for featured layout
  - [ ] 1.5 Create `variants/Grid.tsx` for non-featured layout
  - [ ] 1.6 Create `styles.css` with BEM naming

- [ ] **Task 2: Implement TechStackIcons subcomponent** (AC: 1)
  - [ ] 2.1 Create `TechStackIcons.tsx` that maps technology names to icons
  - [ ] 2.2 Create icon mapping utility: `getTechIcon(techName: string) => IconComponent`
  - [ ] 2.3 Handle unknown technologies with `QuestionIcon` fallback
  - [ ] 2.4 Implement "+N more" overflow indicator for > 4 technologies
  - [ ] 2.5 Add `aria-label` for accessibility

- [ ] **Task 3: Implement action links structure** (AC: 2)
  - [ ] 3.1 Create `ActionLinks.tsx` subcomponent
  - [ ] 3.2 Add GitHub link with `GitHubIcon`
  - [ ] 3.3 Add Demo link with external link indicator
  - [ ] 3.4 Ensure keyboard accessibility (tabindex, focus states)
  - [ ] 3.5 Add `aria-label="View source code on GitHub"` etc.

- [ ] **Task 4: Handle edge cases** (AC: 3)
  - [ ] 4.1 Test with 0, 1, 3, 6 projects in page
  - [ ] 4.2 Test with missing `repository`, `demo`, `technologies`
  - [ ] 4.3 Ensure no layout shift on conditional content

- [ ] **Task 5: Migrate existing components** (AC: 4, 5)
  - [ ] 5.1 Deprecate `src/ui/molecules/Project/index.jsx` (keep for reference)
  - [ ] 5.2 Deprecate `src/ui/molecules/FeaturedProject/index.jsx`
  - [ ] 5.3 Update `src/app/projects/page.tsx` imports to new component
  - [ ] 5.4 Verify existing hover zoom behavior preserved

- [ ] **Task 6: Write unit tests** (AC: 6)
  - [ ] 6.1 Create `__tests__/ProjectCard.test.tsx`
  - [ ] 6.2 Test tech icons render correctly
  - [ ] 6.3 Test conditional link rendering
  - [ ] 6.4 Test featured vs grid variants
  - [ ] 6.5 Test edge cases (no techs, no links)
  - [ ] 6.6 Add snapshot tests

## Dev Notes

### Existing Implementation Analysis

**Current components:**
- `src/ui/molecules/Project/index.jsx` - Non-featured card (JSX, no TypeScript)
- `src/ui/molecules/FeaturedProject/index.jsx` - Featured card (JSX, no TypeScript)
- `src/ui/organisms/ProjectDetail/index.tsx` - Detail page (already TypeScript)

**Current props flow:**
```typescript
// From ProjectModel schema
interface ProjectModel {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  technologies: string[];  // ← Use for tech icons
  outcomes?: string;
  demo?: string;           // ← Conditional link
  repository?: string;     // ← Conditional link
  img: string;
  screenshots?: string[];
  tags: string;
  featured: boolean;
}
```

**Current page usage (page.tsx:99-124):**
```tsx
filteredProjects.map((project) =>
  project.featured ? (
    <FeaturedProject {...project} />
  ) : (
    <DefaultProject {...project} />
  )
)
```

### Architecture Decision: ADR-14.5 (Organisms with Variants)

```
src/ui/organisms/ProjectCard/
├── index.tsx              # Main export, decides variant
├── ProjectCard.types.ts   # TypeScript interfaces
├── styles.css             # All styles (BEM)
├── TechStackIcons.tsx     # Tech icons subcomponent
├── ActionLinks.tsx        # GitHub/Demo links
├── variants/
│   ├── Featured.tsx       # Featured blade layout
│   └── Grid.tsx           # Non-featured grid layout
└── __tests__/
    └── ProjectCard.test.tsx
```

### Tech Icon Mapping

Create utility to map technology names to icon components:

```typescript
// src/ui/organisms/ProjectCard/utils/getTechIcon.ts
import {
  ReactIcon, TypeScriptIcon, NextIcon, NodeIcon,
  TailwindIcon, PostgresIcon, DockerIcon, GitHubIcon,
  QuestionIcon
} from "@/atoms/icons";

const TECH_ICON_MAP: Record<string, React.ComponentType> = {
  "React": ReactIcon,
  "TypeScript": TypeScriptIcon,
  "Next.js": NextIcon,
  "Node.js": NodeIcon,
  "Tailwind": TailwindIcon,
  "PostgreSQL": PostgresIcon,
  "Docker": DockerIcon,
  // ... add more as needed
};

export function getTechIcon(techName: string): React.ComponentType {
  return TECH_ICON_MAP[techName] || QuestionIcon;
}
```

### Performance Considerations

- Tech icons are SVG components (already optimized)
- No additional re-renders needed (static content)
- Image hover zoom uses existing `FramerImage` with `whileHover`

### Accessibility Requirements

```tsx
// TechStackIcons.tsx
<div
  className="project-card__tech-stack"
  role="list"
  aria-label="Technologies used"
>
  {visibleTechs.map(tech => (
    <span key={tech} role="listitem" aria-label={tech}>
      <TechIcon />
    </span>
  ))}
  {overflowCount > 0 && (
    <span aria-label={`and ${overflowCount} more technologies`}>
      +{overflowCount}
    </span>
  )}
</div>

// ActionLinks.tsx
<a
  href={repository}
  aria-label="View source code on GitHub"
  target="_blank"
  rel="noopener noreferrer"
>
  <GitHubIcon aria-hidden="true" />
</a>
```

### References

- [Source: epics-v2.md#FR14.5] - Tech stack icons visible en card
- [Source: epics-v2.md#FR14.6] - GitHub/Demo links visibles en hover state
- [Source: epics-v2.md#FR14.7] - Layout preparado para crecer (1, 3, 6 proyectos)
- [Source: epics-v2.md#ADR-14.5] - Organisms con variants
- [Source: src/domains/project/model/schema.ts] - ProjectModel type definition
- [Source: src/ui/molecules/Project/index.jsx] - Current implementation
- [Source: src/ui/atoms/icons/index.js] - Available tech icons

### Previous Story Intelligence

This is the first story in Epic 14. Key learnings from Epic 13:
- Use TypeScript for new components (consistency with ProjectDetail)
- Follow BEM naming for CSS
- Include comprehensive unit tests
- Preserve existing hover animations (FramerImage whileHover)

### Testing Patterns

```typescript
// From existing tests in project
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./index";

const mockProject: ProjectModel = {
  id: 1,
  slug: "test-project",
  title: "Test Project",
  technologies: ["React", "TypeScript", "Next.js"],
  // ...
};

describe("ProjectCard", () => {
  it("renders tech stack icons", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByLabelText("Technologies used")).toBeInTheDocument();
  });
});
```

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Debug Log References

(To be filled if debugging needed)

### Completion Notes List

(To be filled by dev agent)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with comprehensive context | SM Agent (Opus 4.5) |

### File List

**To Create:**
- `src/ui/organisms/ProjectCard/index.tsx`
- `src/ui/organisms/ProjectCard/ProjectCard.types.ts`
- `src/ui/organisms/ProjectCard/styles.css`
- `src/ui/organisms/ProjectCard/TechStackIcons.tsx`
- `src/ui/organisms/ProjectCard/ActionLinks.tsx`
- `src/ui/organisms/ProjectCard/variants/Featured.tsx`
- `src/ui/organisms/ProjectCard/variants/Grid.tsx`
- `src/ui/organisms/ProjectCard/utils/getTechIcon.ts`
- `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx`

**To Modify:**
- `src/app/projects/page.tsx` - Import new ProjectCard

**To Deprecate (keep but mark):**
- `src/ui/molecules/Project/index.jsx`
- `src/ui/molecules/FeaturedProject/index.jsx`
