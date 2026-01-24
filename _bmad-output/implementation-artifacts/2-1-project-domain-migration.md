# Story 2.1: Project Domain Migration

Status: done

---

## Story

As a **visitor**,
I want **to browse a list of featured projects reliably**,
So that **I can see the developer's portfolio of work**.

---

## Acceptance Criteria

### AC1: Project List Display
**Given** I navigate to the projects section
**When** the projects load
**Then** I see a grid/list of featured projects with thumbnails
**And** each project shows title and brief description
**And** project data is validated with Zod schema (TypeScript)

### AC2: Loading State with Skeleton
**Given** projects are loading
**When** the API request is in progress
**Then** I see skeleton placeholders (no layout shift)

---

## Tasks / Subtasks

- [x] **Task 1: Migrate schema.js to TypeScript** (AC: #1)
  - [x] 1.1 Rename `src/domains/project/model/schema.js` → `schema.ts`
  - [x] 1.2 Add inferred types: `export type ProjectModel = z.infer<typeof ProjectSchema>`
  - [x] 1.3 Add `ProjectsModel` type for array
  - [x] 1.4 Fix schema issues: `demo` and `repository` should be optional (`.url().optional()`)
  - [x] 1.5 Run `npm run typecheck` - verify no errors

- [x] **Task 2: Create schema unit tests** (AC: #1)
  - [x] 2.1 Create `src/domains/project/model/__tests__/schema.test.ts`
  - [x] 2.2 Test valid project object validation
  - [x] 2.3 Test required fields validation
  - [x] 2.4 Test optional fields (demo, repository can be null/undefined)
  - [x] 2.5 Test type inference works correctly

- [x] **Task 3: Migrate model/index.js to TypeScript** (AC: #1)
  - [x] 3.1 Rename `src/domains/project/model/index.js` → `index.ts`
  - [x] 3.2 Add return types to `fetchAll` function
  - [x] 3.3 Import types from schema.ts
  - [x] 3.4 Ensure Zod validation in `fetchAll` returns typed data

- [x] **Task 4: Migrate useProjects hook to TypeScript** (AC: #1)
  - [x] 4.1 Rename `src/domains/project/queries/useProjects.js` → `useProjects.ts`
  - [x] 4.2 Add proper typing following `useProfile.ts` pattern
  - [x] 4.3 Replace deprecated `cacheTime` with `gcTime` (React Query v5)
  - [x] 4.4 Add `UseProjectsOptions` interface if needed

- [x] **Task 5: Update existing hook test** (AC: #1)
  - [x] 5.1 Review `src/domains/project/queries/__tests__/useProjects.test.tsx`
  - [x] 5.2 Update imports if needed for TypeScript
  - [x] 5.3 Ensure test passes with migrated hook

- [x] **Task 6: Create skeleton component for FeaturedProject** (AC: #2)
  - [x] 6.1 Create `src/ui/molecules/FeaturedProject/skeleton.tsx`
  - [x] 6.2 Match dimensions and layout of FeaturedProject
  - [x] 6.3 Use CSS pulse animation (Tailwind `animate-pulse`)
  - [x] 6.4 Export from molecule index

- [x] **Task 7: Update queries/index.ts exports** (AC: #1)
  - [x] 7.1 Ensure `useProjects` is properly exported
  - [x] 7.2 Update domain index.ts if needed

- [x] **Task 8: Final Validation** (AC: #1, #2)
  - [x] 8.1 Run `npm run lint` - must pass
  - [x] 8.2 Run `npm run typecheck` - must pass
  - [x] 8.3 Run `npm test` - must pass
  - [x] 8.4 Manual verification: projects display correctly in browser

---

## Dev Notes

### Migration Pattern Reference (from Profile Domain)

Follow the **exact pattern** established in `src/domains/profile/`:

**Schema pattern (`schema.ts`):**
```typescript
import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  demo: z.string().url().optional(),      // CHANGE: Make optional
  repository: z.string().url().optional(), // CHANGE: Make optional
  img: z.string(),
  tags: z.string(),
  featured: z.boolean(),
});

export const ProjectsSchema = z.array(ProjectSchema);

// Inferred types from Zod schemas
export type ProjectModel = z.infer<typeof ProjectSchema>;
export type ProjectsModel = z.infer<typeof ProjectsSchema>;
```

**Hook pattern (`useProjects.ts`):**
```typescript
import { useQuery } from "@tanstack/react-query";
import model from "../model";
import type { ProjectsModel } from "../model/schema";

const QUERY_KEY = "projects";

export function useProjects() {
  return useQuery<ProjectsModel>({
    queryKey: [QUERY_KEY],
    queryFn: model.fetchAll,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,  // Note: gcTime replaces deprecated cacheTime
  });
}

export default useProjects;
```

### Current File Locations

```
src/domains/project/
├── model/
│   ├── schema.js      → schema.ts (migrate)
│   ├── mock.js        (keep as .js - data file)
│   ├── index.js       → index.ts (migrate)
│   └── __tests__/
│       └── project.model.test.js (exists - review after migration)
├── queries/
│   ├── useProjects.js → useProjects.ts (migrate)
│   ├── index.ts       (already TypeScript)
│   └── __tests__/
│       └── useProjects.test.tsx (already TypeScript)
└── index.ts           (already TypeScript)
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All new `.ts/.tsx` files must compile without errors |
| Zod inference | Use `z.infer<typeof Schema>` for types - NEVER define types manually |
| Path aliases | Use `@/domains/`, `@/ui/`, `@/lib/` imports |
| Test convention | Tests in `__tests__/` folder co-located with source |
| Naming | PascalCase for types, camelCase for functions/hooks |

### Schema Fix Required

**Current schema issue:** `demo` and `repository` are required URLs, but some projects may not have both:

```javascript
// Current (problematic)
demo: z.string().url(),
repository: z.string().url(),

// Fixed (allow optional)
demo: z.string().url().optional(),
repository: z.string().url().optional(),
```

This matches the FeaturedProject component logic which handles missing demo/repo:
```jsx
// From FeaturedProject/index.jsx - already handles optional links
<a href={demo} ...>  // Will fail if demo is undefined without optional schema
```

### Previous Story Learnings (Story 0: Technical Sanitation)

**Apply these patterns from Story 0:**
- Use shared mock utilities from `src/test-utils/framer-motion-mock.ts` if testing animated components
- All icon SVGs must have `aria-hidden="true"` (already done in Story 0)
- Panel hooks have short aliases: `toggle`, `open`, `close` (from Story 0)

**Testing pattern for React Query hooks:**
```typescript
// From useProjects.test.tsx - already good pattern
jest.useFakeTimers();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // ... wrapper component
};
```

### Skeleton Component Pattern

```tsx
// src/ui/molecules/FeaturedProject/skeleton.tsx
export const FeaturedProjectSkeleton = () => (
  <article className="project--featured">
    <div className="project_image-link--feat animate-pulse bg-gray-200 dark:bg-gray-700"
         style={{ aspectRatio: '16/9' }} />
    <div className="project_info-grid--feat">
      <div className="h-4 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-6 w-3/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-2" />
      <div className="h-16 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-2" />
    </div>
  </article>
);
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
| `schema.ts` | Unit | `model/__tests__/schema.test.ts` |
| `useProjects.ts` | Integration | `queries/__tests__/useProjects.test.tsx` |

### Manual Validation Checklist

> **OBLIGATORIO antes de merge** ✅ Completed 2026-01-24

- [x] Projects section displays project cards
- [x] Each project shows: title, summary, image, tags
- [x] Demo and repository links work (when present)
- [x] No TypeScript errors in terminal
- [x] No console errors in browser
- [x] Skeleton shows during loading (verified via mock delay)

---

## References

- [Source: architecture.md#TypeScript Migration] - Migration order and patterns
- [Source: architecture.md#Testing Architecture] - Test file conventions
- [Source: architecture.md#Domain Structure] - Folder organization
- [Source: epics.md#Story 2.1] - Original acceptance criteria
- [Source: 0-technical-sanitation.md] - Previous story learnings
- [Source: src/domains/profile/model/schema.ts] - Reference implementation pattern

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

- Migrated project domain from JavaScript to TypeScript following profile domain pattern
- Fixed schema to make `demo` and `repository` fields optional
- Created 14 unit tests for schema validation
- Updated useProjects hook with proper typing and gcTime (replaced deprecated cacheTime)
- Created FeaturedProjectSkeleton component with pulse animation
- All quality gates pass: lint, typecheck, 148 tests

### Code Review Fixes

| Issue | Severity | Fix | Commit |
|-------|----------|-----|--------|
| FeaturedProjectSkeleton not exported | HIGH | Added export to molecules/index.js | `f809b86` |
| FeaturedProject didn't handle optional links | HIGH | Added conditional rendering for demo/repository | `90bfda4` |
| Test used inline type instead of ProjectsModel | MEDIUM | Updated import and type assertion | `eed9096` |
| Missing error handling test | MEDIUM | Added test for isError state | `7d275ee` |

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-24 | Story created with comprehensive context | Claude Opus 4.5 |
| 2026-01-24 | Implementation complete - all automated tasks done | Claude Opus 4.5 |
| 2026-01-24 | Code review fixes: 4 issues resolved (2 HIGH, 2 MEDIUM) | Claude Opus 4.5 |

### File List

**Migrated (.js → .ts):**
- `src/domains/project/model/schema.js` → `schema.ts`
- `src/domains/project/model/index.js` → `index.ts`
- `src/domains/project/queries/useProjects.js` → `useProjects.ts`

**Created:**
- `src/domains/project/model/__tests__/schema.test.ts` (14 tests)
- `src/ui/molecules/FeaturedProject/skeleton.tsx`

**Modified (code review):**
- `src/ui/molecules/index.js` - Added FeaturedProjectSkeleton export
- `src/ui/molecules/FeaturedProject/index.jsx` - Handle optional demo/repository
- `src/domains/project/queries/__tests__/useProjects.test.tsx` - Type safety + error test

**Unchanged (verified working):**
- `src/domains/project/queries/index.ts`
- `src/domains/project/index.ts`
