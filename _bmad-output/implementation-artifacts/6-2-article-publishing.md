# Story 6.2: Article Publishing

Status: review

---

## Story

As an **owner**,
I want **to publish new articles easily**,
So that **I can share knowledge and improve SEO**.

---

## Acceptance Criteria

### AC1: Add New Article
**Given** I write a new article in markdown
**When** I add it to the articles data source
**Then** it appears in the articles list after deploy
**And** SEO meta tags are auto-generated

### AC2: Future Publish Date
**Given** an article has a future publish date
**When** the site builds
**Then** the article is not visible until that date

---

## Tasks / Subtasks

- [x] **Task 1: Analyze current article data flow** (AC: #1, #2)
  - [x] 1.1 Review `src/domains/article/model/schema.ts` for current Zod schema
  - [x] 1.2 Review `src/domains/article/model/mock.ts` for mock data structure
  - [x] 1.3 Verify article data uses same pattern as project (mock.ts canonical source)
  - [x] 1.4 Document current data flow in Dev Notes

- [x] **Task 2: Add future publish date filtering** (AC: #2)
  - [x] 2.1 Verify `status` field exists in schema (already has: `z.enum(["published", "draft"])`)
  - [x] 2.2 Add `publish_date` field to schema if needed for scheduled publishing - NOT NEEDED, `published_at` already exists
  - [x] 2.3 Update `Article.fetchAll()` to filter out articles with future publish dates
  - [x] 2.4 Add test: article with future date is not returned by fetchAll
  - [x] 2.5 Add test: article with past date IS returned

- [x] **Task 3: Add article validation script** (AC: #1)
  - [x] 3.1 Create `src/domains/article/model/__tests__/validate-data.test.ts`
  - [x] 3.2 Validate all articles in mock data against schema
  - [x] 3.3 Check unique IDs and slugs
  - [x] 3.4 Add `npm run validate:articles` to package.json

- [x] **Task 4: Update content-management.md documentation** (AC: #1)
  - [x] 4.1 Add "## Articles" section (replace placeholder)
  - [x] 4.2 Document step-by-step: "Adding a new article"
  - [x] 4.3 Document step-by-step: "Updating existing article"
  - [x] 4.4 Include schema field reference with examples
  - [x] 4.5 Document draft/scheduled publishing workflow

- [x] **Task 5: Final Validation** (AC: #1, #2)
  - [x] 5.1 Run `npm run lint` - PASS
  - [x] 5.2 Run `npm run typecheck` - PASS
  - [x] 5.3 Run `npm test` - PASS (502 tests)
  - [x] 5.4 Manual: Add test article → validated via schema tests
  - [x] 5.5 Manual: Set future date → validated via filtering.test.ts
  - [x] 5.6 Manual: Set draft status → validated via filtering.test.ts

---

## Dev Notes

### Previous Story Learnings (Story 6.1)

**APPLY THESE PATTERNS FROM 6.1:**
- Canonical source is `mock.ts` (NOT public/data/*.json)
- TypeScript types inferred from Zod schema
- Validation script pattern: Jest-based tests, not standalone script
- Documentation updates as part of story
- TDD: Write tests BEFORE implementation

**Story 6.1 Implementation:**
- Created `npm run validate:projects` using Jest test pattern
- Updated `docs/content-management.md` with full project docs
- Migrated `mock.js` → `mock.ts`

### Current State Analysis

**Article Domain (Already TypeScript):**
```
src/domains/article/
├── model/
│   ├── schema.ts      # Zod schema for Article ✅
│   ├── mock.ts        # Mock data (5 articles) ✅
│   └── index.ts       # Fetch functions ✅
├── queries/
│   ├── useArticles.ts # React Query hook
│   ├── useArticle.ts  # Single article
│   └── useArticleBySlug.ts
└── index.ts           # Domain exports
```

**ArticleSchema Fields (Current):**
```typescript
{
  id: z.number(),
  title: z.string(),
  url: z.string(),
  slug: z.string(),
  reading_time: z.string(),
  published_at: z.string(),        // Already exists!
  summary: z.string(),
  content: z.string().optional(),
  img: z.string(),
  featured: z.boolean(),
  status: z.enum(["published", "draft"]).optional().default("published"),
}
```

**Key Insight:** Schema already has `published_at` and `status` fields!
- `published_at` can be used for future date filtering
- `status` already supports "draft" state
- Need to add filtering logic to `Article.fetchAll()`

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.ts` files |
| Zod validation | Use existing ArticleSchema |
| Documentation | Update `docs/content-management.md` |
| Test convention | Tests in `__tests__/` folders |
| Follow Story 6.1 pattern | Jest-based validation script |

### Testing Strategy

**Filtering Tests (NEW):**
- fetchAll filters out articles with future `published_at`
- fetchAll filters out articles with `status: "draft"`
- fetchAll returns articles with past `published_at` and `status: "published"`

**Validation Tests (Pattern from 6.1):**
- All mock articles pass schema validation
- Unique IDs check
- Unique slugs check
- At least one article exists

### Related Files

```
src/domains/article/model/schema.ts    # Zod schema
src/domains/article/model/mock.ts      # Article data
src/domains/article/model/index.ts     # Fetch functions (needs filtering)
docs/content-management.md             # Documentation to update
package.json                           # Add validate:articles script
```

### NFR Compliance (from PRD)

**FR29:** Owner can publish new articles
- Documentation enables owner to add articles

**NFR17:** Search engines can index content (SEO)
- Articles have meta tags from schema fields

**NFR24-26:** Reliability
- Schema validation prevents bad deploys
- Draft/future filtering prevents premature publishing

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm test              # Jest unit tests
npm run validate:articles  # New validation script
```

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [x] Add new test article → validated via schema tests and filtering.test.ts
- [x] Set article `status: "draft"` → validated via filtering.test.ts (excludes drafts)
- [x] Set article `published_at` to future date → validated via filtering.test.ts (excludes future)
- [x] Set past date + published status → validated via filtering.test.ts (includes past published)
- [x] Documentation is clear for non-technical owner - `docs/content-management.md` updated
- [x] Running validation script shows helpful output - `npm run validate:articles`

---

## References

- [Source: epics.md#Story 6.2] - Original acceptance criteria (FR29)
- [Source: 6-1-project-content-updates.md] - Previous story patterns
- [Source: architecture.md] - Project structure and patterns
- [Source: src/domains/article/] - Current article domain implementation

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Lint/prettier fix required after initial implementation

### Completion Notes List

- Task 1: Verified article domain already TypeScript with `published_at` and `status` fields
- Task 2: Added `filterPublishedArticles()` function to filter drafts and future dates (6 tests)
- Task 3: Created validate-data.test.ts with 9 validation tests
- Task 4: Updated docs/content-management.md with full article documentation
- Task 5: All validations pass (lint, typecheck, 502 tests)

### File List

**Created:**
- `src/domains/article/model/__tests__/filtering.test.ts` - Filtering tests (14 tests total)
- `src/domains/article/model/__tests__/validate-data.test.ts` - Validation tests (9 tests)

**Modified:**
- `src/domains/article/model/index.ts` - Added `isArticlePublished()` + filtering in fetchById/fetchBySlug
- `src/domains/article/model/__tests__/model.test.ts` - Added 3 filtering tests, updated fetchById tests
- `src/domains/article/queries/useArticle.ts` - Updated return type to handle null
- `docs/content-management.md` - Added complete Articles section
- `package.json` - Added `validate:articles` and `validate:content` scripts

### Change Log

- 2026-01-25: Story 6.2 implementation complete
  - Added draft/future date filtering to Article.fetchAll()
  - Added 18 new tests (6 filtering + 9 validation + 3 model)
  - Updated content-management documentation
  - Total tests: 502
- 2026-01-25: Code Review fixes (H1, M1)
  - Fixed fetchById/fetchBySlug to respect publish filtering (H1)
  - Added 8 new tests for direct access filtering (M1)
  - Updated useArticle hook return type to handle null
  - Total tests: 510

---

## Review Backlog

> Items identified in code review, deferred for future stories

| ID | Severity | Issue | Rationale for Deferral |
|----|----------|-------|------------------------|
| M2 | MEDIUM | Validate URL vs slug consistency in validate-data.test.ts | Not a bug, enhancement for data integrity |
| L1 | LOW | console.log in validate-data.test.ts | Functional for human validation, cosmetic issue |
| L2 | LOW | Checklist says "Manual: Add test article" but validated via tests | Spirit of check fulfilled, wording clarification only |

