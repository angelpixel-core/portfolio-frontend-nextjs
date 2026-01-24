# Story 2.2: Project Detail View

Status: done

---

## Story

As a **visitor**,
I want **to view detailed project information**,
So that **I can understand the technical depth and outcomes**.

---

## Acceptance Criteria

### AC1: Project Detail Page Navigation
**Given** I click on a project card
**When** the project detail loads
**Then** I see full description, technologies used, and outcomes
**And** images/screenshots display correctly
**And** the page has proper meta tags for SEO

### AC2: Direct URL Navigation (SSR)
**Given** I navigate directly to a project URL
**When** the page loads
**Then** SSR delivers the content for SEO
**And** the page is fully functional

---

## Tasks / Subtasks

- [x] **Task 1: Extend ProjectSchema for detail fields** (AC: #1)
  - [x] 1.1 Add `description` field to ProjectSchema (full project description, different from summary)
  - [x] 1.2 Add `technologies` array field (z.array(z.string())) for tech stack
  - [x] 1.3 Add `outcomes` field (optional string for project outcomes/results)
  - [x] 1.4 Add `screenshots` field (z.array(z.string()).optional()) for additional images
  - [x] 1.5 Add `slug` field for URL-friendly identifier
  - [x] 1.6 Update mock.js with new fields for all projects
  - [x] 1.7 Run `npm run typecheck` - verify no errors

- [x] **Task 2: Create useProject hook for single project** (AC: #1, #2)
  - [x] 2.1 Create `src/domains/project/queries/useProject.ts` (singular)
  - [x] 2.2 Add `fetchById` or `fetchBySlug` method to model/index.ts
  - [x] 2.3 Follow useProfile pattern with proper typing
  - [x] 2.4 Export from queries/index.ts

- [x] **Task 3: Create dynamic route for project detail** (AC: #1, #2)
  - [x] 3.1 Create `src/app/projects/[slug]/page.tsx`
  - [x] 3.2 Implement `generateMetadata` for SEO meta tags
  - [x] 3.3 Add loading.tsx with skeleton for suspense
  - [x] 3.4 Handle 404 case when project not found

- [x] **Task 4: Create ProjectDetail component** (AC: #1)
  - [x] 4.1 Create `src/ui/organisms/ProjectDetail/index.tsx`
  - [x] 4.2 Display: title, full description, technologies, outcomes
  - [x] 4.3 Display main image and screenshots gallery
  - [x] 4.4 Include demo/repository links (reuse logic from FeaturedProject)
  - [x] 4.5 Create skeleton.tsx for loading state
  - [x] 4.6 Ensure keyboard accessibility

- [x] **Task 5: Update project cards to link to detail** (AC: #1)
  - [x] 5.1 Update FeaturedProject to link title/image to `/projects/[slug]`
  - [x] 5.2 Update Project (non-featured) to link to detail page
  - [x] 5.3 Keep external demo links but add internal detail link

- [x] **Task 6: Create unit tests** (AC: #1)
  - [x] 6.1 Test schema with new fields (schema.test.ts updates)
  - [x] 6.2 Test useProject hook (queries/__tests__/useProject.test.tsx)
  - [x] 6.3 Test ProjectDetail component renders correctly

- [x] **Task 7: Final Validation** (AC: #1, #2)
  - [x] 7.1 Run `npm run lint` - must pass
  - [x] 7.2 Run `npm run typecheck` - must pass
  - [x] 7.3 Run `npm test` - must pass (175 tests)
  - [x] 7.4 Manual verification: navigate to project detail from list
  - [x] 7.5 Manual verification: direct URL navigation works
  - [x] 7.6 Manual verification: SEO meta tags present (view-source)

---

## Dev Notes

### Previous Story Learnings (Story 2.1)

**Apply these patterns from Story 2.1:**
- Schema fields `demo` and `repository` are optional - handle gracefully in UI
- Use `FeaturedProjectSkeleton` pattern for loading states
- Export new components from molecule/organism index files
- Use `gcTime` instead of deprecated `cacheTime` in React Query

**Code Review fixes to remember:**
- Always export skeleton components from index
- Handle optional fields with conditional rendering
- Use proper Zod types in tests (not inline types)

### Current Schema (from Story 2.1)

```typescript
// src/domains/project/model/schema.ts - CURRENT
export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),        // Brief description for cards
  demo: z.string().url().optional(),
  repository: z.string().url().optional(),
  img: z.string(),
  tags: z.string(),
  featured: z.boolean(),
});
```

### Extended Schema (for this story)

```typescript
// EXTEND with these fields:
export const ProjectSchema = z.object({
  id: z.number(),
  slug: z.string(),           // NEW: URL-friendly identifier
  title: z.string(),
  summary: z.string(),        // Brief description for cards
  description: z.string(),    // NEW: Full project description
  technologies: z.array(z.string()), // NEW: Tech stack array
  outcomes: z.string().optional(),   // NEW: Project outcomes/results
  demo: z.string().url().optional(),
  repository: z.string().url().optional(),
  img: z.string(),
  screenshots: z.array(z.string()).optional(), // NEW: Additional images
  tags: z.string(),
  featured: z.boolean(),
});
```

### Dynamic Route Pattern (Next.js 14 App Router)

```typescript
// src/app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch project data for meta tags
  const project = await getProject(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Projects`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.img],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
```

### useProject Hook Pattern

```typescript
// src/domains/project/queries/useProject.ts
import { useQuery } from "@tanstack/react-query";
import model from "../model";
import type { ProjectModel } from "../model/schema";

export function useProject(slug: string) {
  return useQuery<ProjectModel | null>({
    queryKey: ["project", slug],
    queryFn: () => model.fetchBySlug(slug),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!slug,
  });
}

export default useProject;
```

### Model Update Pattern

```typescript
// src/domains/project/model/index.ts - ADD fetchBySlug
const Project = {
  async fetchAll(...) { ... },

  async fetchBySlug(slug: string): Promise<ProjectModel | null> {
    if (useMockFallback) {
      logger.mock("Project", `project/${slug}`, { delay: "1s" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const project = mockData.find(p => p.slug === slug);
      return project ? ProjectSchema.parse(project) : null;
    }
    // ... API implementation
  },
};
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All new `.ts/.tsx` files must compile without errors |
| Zod inference | Use `z.infer<typeof Schema>` for types |
| Path aliases | Use `@/domains/`, `@/ui/`, `@/lib/` imports |
| Next.js App Router | Use `generateMetadata` for SEO, `notFound()` for 404 |
| Test convention | Tests in `__tests__/` folder co-located with source |

### File Structure After Implementation

```
src/app/projects/
├── page.jsx              (existing - list view)
├── layout.jsx            (existing)
├── ProjectListSkeleton.jsx (existing)
└── [slug]/               (NEW - dynamic route)
    ├── page.tsx          (NEW - detail page)
    ├── loading.tsx       (NEW - suspense skeleton)
    └── not-found.tsx     (NEW - 404 page)

src/domains/project/
├── model/
│   ├── schema.ts         (MODIFY - add new fields)
│   ├── mock.js           (MODIFY - add new fields to data)
│   └── index.ts          (MODIFY - add fetchBySlug)
├── queries/
│   ├── useProjects.ts    (existing)
│   ├── useProject.ts     (NEW - single project hook)
│   └── index.ts          (MODIFY - export useProject)

src/ui/organisms/
└── ProjectDetail/        (NEW)
    ├── index.tsx
    ├── skeleton.tsx
    └── styles.css
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

| File | Test Type | Location |
|------|-----------|----------|
| `schema.ts` (extended) | Unit | `model/__tests__/schema.test.ts` |
| `useProject.ts` | Integration | `queries/__tests__/useProject.test.tsx` |
| `ProjectDetail/index.tsx` | Component | `ProjectDetail/__tests__/ProjectDetail.test.tsx` |

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [x] Click project card → navigates to `/projects/[slug]`
- [x] Project detail shows: title, full description, technologies
- [x] Screenshots display correctly (if present)
- [x] Demo/repository links work
- [x] Direct URL `/projects/crypto-screener` loads correctly
- [x] View page source → meta tags present (title, description, og:image)
- [x] 404 page shows for invalid slug `/projects/invalid-project`
- [x] Loading skeleton appears during data fetch
- [x] Keyboard navigation works throughout detail page

---

## References

- [Source: architecture.md#TypeScript Migration] - Migration order and patterns
- [Source: architecture.md#Testing Architecture] - Test file conventions
- [Source: epics.md#Story 2.2] - Original acceptance criteria
- [Source: 2-1-project-domain-migration.md] - Previous story patterns and learnings
- [Source: src/domains/project/model/schema.ts] - Current schema to extend
- [Source: src/ui/molecules/FeaturedProject/index.jsx] - Reference for link handling

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

- All tasks completed with atomic commits
- 175 tests passing
- Lint and typecheck passing
- Manual verification completed via Playwright

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-24 | Story created with comprehensive context | Claude Opus 4.5 |
| 2026-01-24 | Story implementation completed | Claude Opus 4.5 |

### File List

**Created:**
- `src/app/projects/[slug]/page.tsx`
- `src/app/projects/[slug]/loading.tsx`
- `src/app/projects/[slug]/not-found.tsx`
- `src/domains/project/queries/useProject.ts`
- `src/domains/project/queries/__tests__/useProject.test.tsx`
- `src/ui/organisms/ProjectDetail/index.tsx`
- `src/ui/organisms/ProjectDetail/skeleton.tsx`
- `src/ui/organisms/ProjectDetail/styles.css`
- `src/ui/organisms/ProjectDetail/__tests__/ProjectDetail.test.tsx`

**Modified:**
- `src/domains/project/model/schema.ts` - Added detail fields
- `src/domains/project/model/mock.js` - Updated mock data
- `src/domains/project/model/index.ts` - Added fetchBySlug
- `src/domains/project/queries/index.ts` - Export useProject
- `src/domains/project/model/__tests__/schema.test.ts` - Updated tests
- `src/ui/organisms/index.js` - Export ProjectDetail
- `src/ui/molecules/FeaturedProject/index.jsx` - Link to detail
- `src/ui/molecules/Project/index.jsx` - Link to detail
- `src/app/projects/styles.css` - Not-found styles
