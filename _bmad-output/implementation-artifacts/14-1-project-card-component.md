# Story 14.1: Project Card Component

Status: done

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

- [x] **Task 1: Create ProjectCard component with variants** (AC: 1, 2, 4, 5)
  - [x] 1.1 Create `src/ui/organisms/ProjectCard/index.tsx` with TypeScript
  - [x] 1.2 Create `ProjectCard.types.ts` with props interface extending ProjectModel
  - [x] 1.3 Implement base card structure with tech icons slot
  - [x] 1.4 Create `variants/Featured.tsx` for featured layout
  - [x] 1.5 Create `variants/Grid.tsx` for non-featured layout
  - [x] 1.6 Create `styles.css` with BEM naming

- [x] **Task 2: Implement TechStackIcons subcomponent** (AC: 1)
  - [x] 2.1 Create `TechStackIcons.tsx` that maps technology names to icons
  - [x] 2.2 Create icon mapping utility: `getTechIcon(techName: string) => IconComponent`
  - [x] 2.3 Handle unknown technologies with `QuestionIcon` fallback
  - [x] 2.4 Implement "+N more" overflow indicator for > 4 technologies
  - [x] 2.5 Add `aria-label` for accessibility

- [x] **Task 3: Implement action links structure** (AC: 2)
  - [x] 3.1 Create `ActionLinks.tsx` subcomponent
  - [x] 3.2 Add GitHub link with `GitHubIcon`
  - [x] 3.3 Add Demo link with external link indicator
  - [x] 3.4 Ensure keyboard accessibility (tabindex, focus states)
  - [x] 3.5 Add `aria-label="View source code on GitHub"` etc.

- [x] **Task 4: Handle edge cases** (AC: 3)
  - [x] 4.1 Test with 0, 1, 3, 6 projects in page
  - [x] 4.2 Test with missing `repository`, `demo`, `technologies`
  - [x] 4.3 Ensure no layout shift on conditional content

- [x] **Task 5: Migrate existing components** (AC: 4, 5)
  - [x] 5.1 Deprecate `src/ui/molecules/Project/index.jsx` (keep for reference)
  - [x] 5.2 Deprecate `src/ui/molecules/FeaturedProject/index.jsx`
  - [x] 5.3 Update `src/app/projects/page.tsx` imports to new component
  - [x] 5.4 Verify existing hover zoom behavior preserved

- [x] **Task 6: Write unit tests** (AC: 6)
  - [x] 6.1 Create `__tests__/ProjectCard.test.tsx`
  - [x] 6.2 Test tech icons render correctly
  - [x] 6.3 Test conditional link rendering
  - [x] 6.4 Test featured vs grid variants
  - [x] 6.5 Test edge cases (no techs, no links)
  - [x] 6.6 Add snapshot tests

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

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - straightforward implementation

### Completion Notes List

1. **Task 1 (ProjectCard component)**: Created TypeScript component with auto-variant selection based on `project.featured` flag. Includes types, two variants (Featured, Grid), and BEM-styled CSS.

2. **Task 2 (TechStackIcons)**: Implemented with 25+ technology mappings, case-insensitive lookup, QuestionIcon fallback for unknown techs, and "+N more" overflow indicator for >4 technologies.

3. **Task 3 (ActionLinks)**: Created with GitHub and Demo links, proper ARIA labels for accessibility, external link attributes (target="_blank", rel="noopener noreferrer"), and keyboard accessibility.

4. **Task 4 (Edge cases)**: All edge cases covered by unit tests - empty technologies, missing links, various project counts.

5. **Task 5 (Migration)**: Updated `src/app/projects/page.tsx` to use new `ProjectCard` component. Added deprecation comments to old molecules.

6. **Task 6 (Unit tests)**: 37 tests covering all ACs - variant selection, tech icons, action links, edge cases, TypeScript types, getTechIcon/hasTechIcon utilities, and 3 snapshot tests.

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-29 | Story created with comprehensive context | SM Agent (Opus 4.5) |
| 2026-01-29 | Implemented all tasks, 30 unit tests passing, migration complete | Dev Agent (Opus 4.5) |
| 2026-01-29 | Code Review: Fixed 2 HIGH + 4 MEDIUM issues, 37 tests now | Code Review (Opus 4.5) |

### Senior Developer Review (AI)

**Review Date:** 2026-01-29
**Reviewer:** Claude Opus 4.5
**Outcome:** ✅ APPROVED (after fixes)

**Issues Found & Fixed:**
- **H1:** Prettier/ESLint violations in 6 files → Fixed with `prettier --write`
- **H2:** Missing React import in test file → Added `import React from "react"`
- **M1:** Incomplete tech icon coverage → Added 8 new mappings (Bash, Unix, Linux, RSpec, Cucumber, Figma, Storybook, Solidity)
- **M2:** `<img>` warning in tests → Acceptable for mocks (warning only)
- **M3:** Test coverage gaps → Added 7 new tests for `getTechIcon` and `hasTechIcon`
- **M4:** Icon className type error → Added `className=""` to GitHubIcon and ArrowIcon

**Verification:**
- Build: ✅ Passes
- Tests: ✅ 37 passing (was 30)
- All ACs: ✅ Implemented

### File List

**Created:**
- `src/ui/organisms/ProjectCard/index.tsx`
- `src/ui/organisms/ProjectCard/ProjectCard.types.ts`
- `src/ui/organisms/ProjectCard/styles.css`
- `src/ui/organisms/ProjectCard/TechStackIcons.tsx`
- `src/ui/organisms/ProjectCard/ActionLinks.tsx`
- `src/ui/organisms/ProjectCard/variants/Featured.tsx`
- `src/ui/organisms/ProjectCard/variants/Grid.tsx`
- `src/ui/organisms/ProjectCard/utils/getTechIcon.ts`
- `src/ui/organisms/ProjectCard/__tests__/ProjectCard.test.tsx`
- `src/ui/organisms/ProjectCard/__tests__/__snapshots__/ProjectCard.test.tsx.snap`

**Modified:**
- `src/app/projects/page.tsx` - Updated imports to use new ProjectCard
- `src/ui/molecules/Project/index.jsx` - Added deprecation comment
- `src/ui/molecules/FeaturedProject/index.jsx` - Added deprecation comment

---

## Notes for Story 14.2 (Projects Page Layout)

**User Feedback (2026-01-29):** TechnologyFilter layout issue identified during 14.1 review:

### Current Issue
- TechnologyFilter component is displayed **vertically**, consuming an entire blade
- This pushes the Featured Project below the fold

### Desired Behavior
- TechnologyFilter should be a **horizontal grid** that reflows on smaller screens
- First blade should contain in order:
  1. Header
  2. Page title
  3. Technology filter (horizontal)
  4. Featured Project

### Implementation Suggestion
- Refactor `TechnologyFilter` molecule to use `display: flex; flex-wrap: wrap` or CSS Grid
- May need container width constraints
- Consider mobile breakpoint behavior

This feedback directly relates to FR14.2 (Featured project ocupa blade completo) and should be addressed as part of Story 14.2 scope.
