# Story 4.1: Article Listing

Status: review

---

## Story

As a **visitor**,
I want **to browse published articles**,
So that **I can discover the developer's knowledge and expertise**.

---

## Acceptance Criteria

### AC1: Article List Display
**Given** I navigate to the articles section
**When** articles load
**Then** I see a list of articles with title, excerpt, and date
**And** articles are sorted by publication date (newest first)
**And** article domain is migrated to TypeScript

### AC2: Loading State with Skeleton
**Given** articles are loading
**When** the request is in progress
**Then** I see skeleton placeholders

---

## Tasks / Subtasks

- [x] **Task 1: Migrate article schema to TypeScript** (AC: #1)
  - [x] 1.1 Rename `src/domains/article/model/schema.js` → `schema.ts`
  - [x] 1.2 Export `Article` and `Articles` types via `z.infer`
  - [x] 1.3 Add schema tests in `__tests__/schema.test.ts` (13 tests)
  - [x] 1.4 Delete old `article.model.test.js` (replaced with new schema tests)

- [x] **Task 2: Migrate article mock to TypeScript** (AC: #1)
  - [x] 2.1 Rename `src/domains/article/model/mock.js` → `mock.ts`
  - [x] 2.2 Type mock data with `Articles` type
  - [x] 2.3 Sort in fetchAll (Option B - mimics API behavior)

- [x] **Task 3: Migrate article model index to TypeScript** (AC: #1)
  - [x] 3.1 Rename `src/domains/article/model/index.js` → `index.ts`
  - [x] 3.2 Update exports with proper types
  - [x] 3.3 Update fetchAll function with return type
  - [x] 3.4 Added sortByPublishedDate helper function

- [x] **Task 4: Migrate useArticles hook to TypeScript** (AC: #1)
  - [x] 4.1 Rename `src/domains/article/queries/useArticles.js` → `useArticles.ts`
  - [x] 4.2 **CRITICAL:** Changed `cacheTime` → `gcTime` (React Query 5.x)
  - [x] 4.3 Add proper return type annotations
  - [x] 4.4 Existing `useArticles.test.tsx` works without changes

- [x] **Task 5: Migrate useArticle hook to TypeScript** (AC: #1)
  - [x] 5.1 Rename `src/domains/article/queries/useArticle.js` → `useArticle.ts`
  - [x] 5.2 **CRITICAL:** Changed `cacheTime` → `gcTime`
  - [x] 5.3 Add proper return type annotations

- [x] **Task 6: Update domain index exports** (AC: #1)
  - [x] 6.1 Update `src/domains/article/index.ts` to export types
  - [x] 6.2 Ensure `Article`, `Articles`, `useArticles`, `useArticle` exported

- [x] **Task 7: Migrate Article molecule to TypeScript** (AC: #1)
  - [x] 7.1 Rename `src/ui/molecules/Article/index.jsx` → `index.tsx`
  - [x] 7.2 Define `ArticleProps` interface
  - [x] 7.3 Add component tests in `__tests__/Article.test.tsx` (6 tests)

- [x] **Task 8: Migrate ArticlesPage to TypeScript** (AC: #1, #2)
  - [x] 8.1 Rename `src/app/articles/page.jsx` → `page.tsx`
  - [x] 8.2 Rename `src/app/articles/layout.jsx` → `layout.tsx`
  - [x] 8.3 Rename `src/app/articles/ArticleListSkeleton.jsx` → `ArticleListSkeleton.tsx`
  - [x] 8.4 Sorting by `published_at` descending in fetchAll

- [x] **Task 9: Final Validation** (AC: #1, #2)
  - [x] 9.1 Run `npm run lint` - PASS
  - [x] 9.2 Run `npm run typecheck` - PASS
  - [x] 9.3 Run `npm test` - PASS (320 tests after code review)
  - [ ] 9.4 Manual: Navigate to /articles → list displays
  - [ ] 9.5 Manual: Articles sorted newest first
  - [ ] 9.6 Manual: Skeleton shows during load (throttle network)
  - [ ] 9.7 Manual: Empty state shows when no articles

### Review Follow-ups (Code Review)

- [ ] [MEDIUM] Article molecule `src/ui/molecules/Article/index.tsx` no se usa en ArticlesPage - considerar refactor o eliminar duplicación
- [ ] [MEDIUM] `@ts-expect-error` en `src/app/articles/layout.tsx:25` - AnimatedTitle no acepta prop `text` (bug pre-existente a resolver en futuro epic)
- [ ] [MEDIUM] MovingImage (`src/ui/molecules/MovingImage/index.jsx`) sigue siendo JSX - migrar a TypeScript para tipado completo
- [ ] [LOW] Empty state message hardcoded en inglés (`src/app/articles/page.tsx:19`) - considerar i18n

---

## Dev Notes

### Previous Epic Learnings (Epic 3 Retrospective)

**CRITICAL - Apply these patterns:**
- Use `gcTime` instead of deprecated `cacheTime` in React Query 5.x
- Use stable keys (`article.id`) instead of array index
- Add `rel="noopener noreferrer"` to external links (already in page.jsx ✓)
- Use shared framer-motion mock in tests: `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))`
- Export types from domain index file
- Priority: HIGH/MEDIUM issues → fix, LOW → document

### Current State Analysis

**Article domain already exists with:**
```
src/domains/article/
├── model/
│   ├── schema.js         # Zod schema (needs .ts)
│   ├── mock.js           # 5 articles (needs .ts, sort)
│   ├── index.js          # Model exports (needs .ts)
│   └── __tests__/
│       └── article.model.test.js  # Old test (replace)
├── queries/
│   ├── useArticles.js    # Has deprecated cacheTime!
│   ├── useArticle.js     # Needs .ts
│   └── __tests__/
│       └── useArticles.test.tsx   # Already TypeScript!
└── index.ts              # Domain exports
```

**UI components already exist:**
```
src/ui/molecules/Article/
├── index.jsx             # Needs .tsx migration
└── styles.css

src/app/articles/
├── page.jsx              # Needs .tsx migration
├── layout.jsx            # Needs .tsx migration
├── ArticleListSkeleton.jsx  # Needs .tsx migration
├── styles.css
└── __tests__/
    └── ArticleListSkeleton.test.tsx  # Already TypeScript!
```

### Schema (current state)

```typescript
// src/domains/article/model/schema.js
export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  reading_time: z.string(),
  published_at: z.string(),
  summary: z.string(),
  img: z.string(),
  featured: z.boolean(),
  status: z.enum(["published", "draft"]).optional().default("published"),
});
```

### Target Schema (TypeScript)

```typescript
// src/domains/article/model/schema.ts
import { z } from "zod";

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  reading_time: z.string(),
  published_at: z.string(),
  summary: z.string(),
  img: z.string(),
  featured: z.boolean(),
  status: z.enum(["published", "draft"]).optional().default("published"),
});

export const ArticlesSchema = z.array(ArticleSchema);

// Inferred types
export type Article = z.infer<typeof ArticleSchema>;
export type Articles = z.infer<typeof ArticlesSchema>;
```

### Critical Fix: cacheTime → gcTime

```typescript
// BEFORE (deprecated)
const useArticles = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: model.fetchAll,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,  // DEPRECATED!
  });
};

// AFTER (React Query 5.x)
export const useArticles = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: model.fetchAll,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,  // CORRECT
  });
};
```

### Sorting Implementation

Articles must be sorted by `published_at` descending (newest first).

**Option A: Sort in mock data**
```typescript
// src/domains/article/model/mock.ts
const articlesMock: Articles = [...].sort(
  (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
);
```

**Option B: Sort in fetchAll**
```typescript
// src/domains/article/model/index.ts
const fetchAll = async (): Promise<Articles> => {
  const data = ArticlesSchema.parse(articlesMock);
  return data.sort((a, b) =>
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
};
```

**Recommended:** Option B (fetchAll) - mimics API behavior.

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/domains/`, `@/ui/`, `@/hooks/` |
| Zod inference | `type Article = z.infer<typeof ArticleSchema>` |
| React Query | Use `gcTime` (NOT `cacheTime`) |
| Test convention | Tests in `__tests__/` folders |
| Framer motion mock | Use shared mock from `@/test-utils/framer-motion-mock` |

### Testing Strategy

**Schema Tests (new):**
- Valid article parses correctly
- Invalid article (missing required field) fails
- Articles array parses correctly
- Status enum validates ("published", "draft")
- Invalid status fails

**Hook Tests (update existing):**
- Returns articles array
- Returns loading state
- Returns error state
- Uses correct query key

**Component Tests (new for Article molecule):**
- Renders article title and date
- Renders with reduced motion
- Has correct accessibility attributes

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm test              # Jest unit tests
```

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] Navigate to /articles → list displays correctly
- [ ] Articles sorted by date (newest first)
- [ ] Each article shows: title, summary, date, reading time
- [ ] Featured article has image
- [ ] External links open in new tab
- [ ] Skeleton shows during loading (throttle network to Slow 3G)
- [ ] Empty state shows when no articles
- [ ] Mobile view → responsive layout
- [ ] Keyboard: Tab through article links works
- [ ] Screen reader: Articles announced correctly

---

## References

- [Source: epics.md#Story 4.1] - Original acceptance criteria (FR14)
- [Source: architecture.md#TypeScript Migration] - Migration strategy
- [Source: epic-3-retro-2026-01-24.md] - Previous epic learnings
- [Source: src/domains/article/] - Existing domain to migrate
- [Source: src/app/articles/page.jsx] - Existing page to migrate

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-5-20251101

### Completion Notes List

1. **cacheTime → gcTime**: Fixed deprecated React Query 5.x option in both useArticles and useArticle hooks
2. **Sorting**: Implemented in fetchAll function (Option B) using sortByPublishedDate helper
3. **Type exports**: Added Article/Articles types to domain index.ts
4. **Article molecule**: Changed import from `@/ui/molecules` to relative `../MovingImage` to avoid barrel export issues
5. **AnimatedTitle bug**: Pre-existing issue where `text` prop is passed but not used - added ts-expect-error comment
6. **framer-motion-mock fix**: Widened type constraint from HTMLElement to Element to support SVG motion elements

### Debug Log References

- Jest cache clear required after deleting .js files
- Prettier formatting fix needed for multi-line function signature

### File List

**Migrated Files (.js/.jsx → .ts/.tsx):**
- `src/domains/article/model/schema.ts`
- `src/domains/article/model/mock.ts`
- `src/domains/article/model/index.ts`
- `src/domains/article/queries/useArticles.ts`
- `src/domains/article/queries/useArticle.ts`
- `src/ui/molecules/Article/index.tsx`
- `src/app/articles/page.tsx`
- `src/app/articles/layout.tsx`
- `src/app/articles/ArticleListSkeleton.tsx`

**Modified Files:**
- `src/domains/article/index.ts` (added type re-exports)
- `src/test-utils/framer-motion-mock.ts` (fixed SVG element type constraint)

**Deleted Files:**
- `src/domains/article/model/__tests__/article.model.test.js`

**New Test Files:**
- `src/domains/article/model/__tests__/schema.test.ts` (13 tests)
- `src/ui/molecules/Article/__tests__/Article.test.tsx` (6 tests)
