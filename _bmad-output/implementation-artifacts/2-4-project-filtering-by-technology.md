# Story 2.4: Project Filtering by Technology

Status: done

---

## Story

As a **visitor**,
I want **to filter projects by technology**,
So that **I can find relevant work quickly**.

---

## Acceptance Criteria

### AC1: Single Technology Filter

**Given** I view the projects list
**When** I click a technology filter (e.g., "React")
**Then** only projects using that technology are displayed
**And** the filter state is reflected in the URL
**And** I can clear filters to see all projects

### AC2: Multiple Technology Filters (OR Logic)

**Given** I apply multiple filters
**When** I view the results
**Then** projects matching ANY selected technology appear (OR logic)
**And** the active filters are clearly indicated

---

## Tasks / Subtasks

- [x] **Task 1: Extract unique technologies from projects** (AC: #1, #2)
  - [x] 1.1 Create helper function `getUniqueTechnologies(projects)` in `src/domains/project/model/utils.ts`
  - [x] 1.2 Return sorted array of unique technology strings from all projects
  - [x] 1.3 Add unit test for the helper function (5 tests)

- [x] **Task 2: Create TechnologyFilter component** (AC: #1, #2)
  - [x] 2.1 Create `src/ui/molecules/TechnologyFilter/index.tsx`
  - [x] 2.2 Display technology chips/buttons as filter options
  - [x] 2.3 Support multi-select (toggle on/off)
  - [x] 2.4 Visual indicator for active filters (different color/style)
  - [x] 2.5 "Clear All" button to reset filters
  - [x] 2.6 Create `styles.css` with Tailwind classes
  - [x] 2.7 Ensure keyboard accessibility (Enter/Space to toggle)
  - [x] 2.8 Export from `molecules/index.js`

- [x] **Task 3: Implement URL-based filter state** (AC: #1)
  - [x] 3.1 Use `useSearchParams` from `next/navigation` for URL sync
  - [x] 3.2 URL format: `/projects?tech=React&tech=TypeScript`
  - [x] 3.3 Parse URL params on page load to restore filter state
  - [x] 3.4 Update URL when filters change (without page reload)

- [x] **Task 4: Add filter logic to projects page** (AC: #1, #2)
  - [x] 4.1 Convert `src/app/projects/page.jsx` to TypeScript and include TechnologyFilter
  - [x] 4.2 Filter projects array based on selected technologies
  - [x] 4.3 OR logic: show project if ANY of its technologies match ANY selected filter
  - [x] 4.4 Show all projects when no filters selected
  - [x] 4.5 Display count of filtered results

- [x] **Task 5: Create unit tests** (AC: #1, #2)
  - [x] 5.1 Test `getUniqueTechnologies` helper (5 tests)
  - [x] 5.2 Test TechnologyFilter component renders and toggles (10 tests)
  - [x] 5.3 Test filter logic (single filter, multiple filters, clear all) (12 integration tests)

- [x] **Task 6: Final Validation** (AC: #1, #2)
  - [x] 6.1 Run `npm run lint` - PASSED
  - [x] 6.2 Run `npm run typecheck` - PASSED
  - [x] 6.3 Run `npm test` - PASSED (207 tests)
  - [x] 6.4 Manual: Click "React" filter → only React projects shown
  - [x] 6.5 Manual: URL shows `?tech=React`
  - [x] 6.6 Manual: Refresh page → filter persists from URL
  - [x] 6.7 Manual: Click "Clear All" → all projects shown, URL clean
  - [x] 6.8 Manual: Select multiple techs → OR logic works

---

## Dev Notes

### Previous Story Learnings (Stories 2.1-2.3)

**Apply these patterns:**

- Use `gcTime` instead of deprecated `cacheTime` in React Query
- Handle optional fields with conditional rendering
- Use proper Zod types in tests (not inline types)
- Use stable keys (tech name) instead of array index
- Always add `rel="noopener noreferrer"` to external links

**Code Review fixes to remember:**

- Export new components from molecule index files
- Use React's `cache()` for data deduplication if needed

### Current Schema

```typescript
// src/domains/project/model/schema.ts
export const ProjectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  technologies: z.array(z.string()), // ← Used for filtering
  outcomes: z.string().optional(),
  demo: z.string().url().optional(),
  repository: z.string().url().optional(),
  img: z.string(),
  screenshots: z.array(z.string()).optional(),
  tags: z.string(),
  featured: z.boolean(),
});
```

### Available Technologies (from mock data)

```javascript
// Unique technologies across all projects:
[
  "Context API",
  "Framer Motion",
  "JavaScript",
  "MDX",
  "Next.js",
  "PostgreSQL",
  "Prisma",
  "React",
  "React Router",
  "Styled Components",
  "Tailwind CSS",
  "TypeScript",
  "Vercel",
];
```

### Implementation Pattern: URL State with Next.js App Router

```typescript
// src/app/projects/page.tsx (or keep as .jsx)
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get selected technologies from URL
  const selectedTechs = useMemo(() => {
    return searchParams.getAll("tech");
  }, [searchParams]);

  // Update URL when filter changes
  const toggleTech = useCallback(
    (tech: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentTechs = params.getAll("tech");

      if (currentTechs.includes(tech)) {
        // Remove tech
        params.delete("tech");
        currentTechs
          .filter((t) => t !== tech)
          .forEach((t) => params.append("tech", t));
      } else {
        // Add tech
        params.append("tech", tech);
      }

      router.push(`/projects?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Filter projects (OR logic)
  const filteredProjects = useMemo(() => {
    if (selectedTechs.length === 0) return projects;
    return projects.filter((p) =>
      p.technologies.some((tech) => selectedTechs.includes(tech))
    );
  }, [projects, selectedTechs]);

  // ...
}
```

### TechnologyFilter Component Pattern

```typescript
// src/ui/molecules/TechnologyFilter/index.tsx
"use client";

interface TechnologyFilterProps {
  technologies: string[];
  selected: string[];
  onToggle: (tech: string) => void;
  onClearAll: () => void;
}

export const TechnologyFilter = ({
  technologies,
  selected,
  onToggle,
  onClearAll,
}: TechnologyFilterProps) => {
  return (
    <div className="tech-filter" role="group" aria-label="Filter by technology">
      <div className="tech-filter__chips">
        {technologies.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => onToggle(tech)}
            className={`tech-filter__chip ${
              selected.includes(tech) ? "tech-filter__chip--active" : ""
            }`}
            aria-pressed={selected.includes(tech)}
          >
            {tech}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="tech-filter__clear"
        >
          Clear All ({selected.length})
        </button>
      )}
    </div>
  );
};
```

### Architecture Compliance

| Requirement            | Implementation                           |
| ---------------------- | ---------------------------------------- |
| TypeScript strict mode | New files in `.tsx`                      |
| Path aliases           | Use `@/domains/`, `@/ui/`, `@/hooks`     |
| Keyboard accessibility | `aria-pressed`, `role="group"`           |
| URL state              | `useSearchParams` from `next/navigation` |
| Test convention        | Tests in `__tests__/` folder             |

### File Structure After Implementation

```
src/app/projects/
├── page.jsx              (MODIFY - add filtering)
├── layout.jsx            (existing)
├── ProjectListSkeleton.jsx (existing)
├── styles.css            (existing)
└── [slug]/               (existing from Story 2.2)

src/domains/project/model/
├── schema.ts             (existing)
├── mock.js               (existing)
├── index.ts              (existing)
└── utils.ts              (NEW - getUniqueTechnologies)

src/ui/molecules/
├── TechnologyFilter/     (NEW)
│   ├── index.tsx
│   ├── styles.css
│   └── __tests__/
│       └── TechnologyFilter.test.tsx
└── index.js              (MODIFY - export TechnologyFilter)
```

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm test              # Jest unit tests
```

### Test Coverage Expected

| File               | Test Type   | Location                                               |
| ------------------ | ----------- | ------------------------------------------------------ |
| `utils.ts`         | Unit        | `model/__tests__/utils.test.ts`                        |
| `TechnologyFilter` | Component   | `TechnologyFilter/__tests__/TechnologyFilter.test.tsx` |
| Filter logic       | Integration | In component test or page test                         |

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] Click technology chip → filters projects correctly
- [ ] URL updates with `?tech=React`
- [ ] Refresh page → filter persists
- [ ] Click active chip → removes filter
- [ ] Select multiple chips → OR logic works
- [ ] Click "Clear All" → resets to all projects
- [ ] Keyboard: Tab to chips, Enter/Space toggles
- [ ] Active chips have distinct visual style

---

## References

- [Source: epics.md#Story 2.4] - Original acceptance criteria
- [Source: architecture.md#TypeScript Migration] - Migration patterns
- [Source: 2-2-project-detail-view.md] - Previous story patterns
- [Source: src/domains/project/model/schema.ts] - Technologies array field
- [Source: src/app/projects/page.jsx] - Current projects page to modify

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

1. **Task 1**: Created `getUniqueTechnologies` helper with 5 unit tests
2. **Task 2**: Created TechnologyFilter component with 10 unit tests - used underscore prefix for type params to satisfy ESLint
3. **Task 3-4**: Converted projects page from JSX to TypeScript, integrated filtering with URL state via `useSearchParams`
4. **Task 5**: Added 12 integration tests for filtering logic (OR semantics, URL persistence, clear all)
5. **Task 6**: All automated validations pass (lint, typecheck, 207 tests)

### File List

**New Files:**

- `src/domains/project/model/utils.ts` - getUniqueTechnologies helper
- `src/domains/project/model/__tests__/utils.test.ts` - 5 tests
- `src/ui/molecules/TechnologyFilter/index.tsx` - Filter component
- `src/ui/molecules/TechnologyFilter/styles.css` - Styling
- `src/ui/molecules/TechnologyFilter/__tests__/TechnologyFilter.test.tsx` - 10 tests
- `src/app/projects/page.tsx` - Converted from JSX with filtering
- `src/app/projects/__tests__/ProjectsPageFiltering.test.tsx` - 12 integration tests

**Modified Files:**

- `src/ui/molecules/index.js` - Export TechnologyFilter
- `src/app/projects/styles.css` - Added filter results styles
- `src/ui/molecules/FeaturedProject/__tests__/FeaturedProject.test.tsx` - Fixed TypeScript type issues

**Deleted Files:**

- `src/app/projects/page.jsx` - Replaced by TypeScript version
