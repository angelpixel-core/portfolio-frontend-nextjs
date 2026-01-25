# Story 4.2: Article Content Reading

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to read full article content**,
So that **I can learn from the developer's writing**.

---

## Acceptance Criteria

### AC1: Full Article Display
**Given** I click on an article from the listing
**When** the article page loads
**Then** I see the full content with proper formatting
**And** code blocks have syntax highlighting
**And** reading time is displayed

### AC2: SSR & SEO Meta Tags
**Given** I navigate directly to an article URL
**When** the page loads
**Then** SSR delivers content for SEO
**And** meta tags (title, description, og:image) are set

---

## Tasks / Subtasks

- [ ] **Task 1: Extend article schema for content** (AC: #1)
  - [ ] 1.1 Add `content` field to ArticleSchema (optional, for future CMS)
  - [ ] 1.2 Add `slug` field derived from URL (e.g., "react-pagination")
  - [ ] 1.3 Update mock data with sample markdown content
  - [ ] 1.4 Add `fetchBySlug` method to article model
  - [ ] 1.5 Add tests for new schema fields and fetchBySlug

- [ ] **Task 2: Create article detail page** (AC: #1, #2)
  - [ ] 2.1 Create `src/app/articles/[slug]/page.tsx` (SSR)
  - [ ] 2.2 Create `src/app/articles/[slug]/layout.tsx`
  - [ ] 2.3 Follow pattern from `projects/[slug]/page.tsx` (cache + notFound)
  - [ ] 2.4 Implement generateMetadata for SEO meta tags

- [ ] **Task 3: Create ArticleContent component** (AC: #1)
  - [ ] 3.1 Create `src/ui/organisms/ArticleContent/index.tsx`
  - [ ] 3.2 Display article title, published_at, reading_time
  - [ ] 3.3 Render article content with proper typography
  - [ ] 3.4 Style content area (prose-style markdown)
  - [ ] 3.5 Add component tests

- [ ] **Task 4: Implement syntax highlighting** (AC: #1)
  - [ ] 4.1 Research: Use existing syntax highlighting or add library
  - [ ] 4.2 If needed: Install `prism-react-renderer` or similar
  - [ ] 4.3 Create CodeBlock component for code snippets
  - [ ] 4.4 Style code blocks with dark/light theme support
  - [ ] 4.5 Add tests for CodeBlock component

- [ ] **Task 5: Add useArticleBySlug hook** (AC: #1)
  - [ ] 5.1 Create `useArticleBySlug.ts` in article queries
  - [ ] 5.2 Use React Query with slug as query key
  - [ ] 5.3 Apply gcTime (not deprecated cacheTime)
  - [ ] 5.4 Add hook tests

- [ ] **Task 6: Final Validation** (AC: #1, #2)
  - [ ] 6.1 Run `npm run lint` - PASS
  - [ ] 6.2 Run `npm run typecheck` - PASS
  - [ ] 6.3 Run `npm test` - PASS
  - [ ] 6.4 Manual: Click article from /articles → detail page loads
  - [ ] 6.5 Manual: Direct URL /articles/react-pagination loads with SSR
  - [ ] 6.6 Manual: Code blocks display with syntax highlighting
  - [ ] 6.7 Manual: Meta tags visible in page source (title, og:image)
  - [ ] 6.8 Manual: Reading time displayed correctly
  - [ ] 6.9 Manual: Responsive on mobile

---

## Dev Notes

### Previous Story Learnings (Story 4.1)

**CRITICAL - Apply these patterns:**
- Use `gcTime` instead of deprecated `cacheTime` in React Query 5.x
- Use stable keys (`article.slug`) for query keys
- Add `rel="noopener noreferrer"` to external links
- Use shared framer-motion mock in tests: `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))`
- Export types from domain index file
- Priority: HIGH/MEDIUM issues → fix, LOW → document
- Jest cache clear may be needed after file deletions

### Current State Analysis

**Article domain exists:**
```
src/domains/article/
├── model/
│   ├── schema.ts         # Has Article type (needs content/slug)
│   ├── mock.ts           # Has 5 articles (needs content)
│   └── index.ts          # Has fetchById (needs fetchBySlug)
├── queries/
│   ├── useArticles.ts    # List hook
│   ├── useArticle.ts     # Detail by ID (need by slug)
│   └── __tests__/
└── index.ts
```

**No detail page exists:**
```
src/app/articles/
├── page.tsx              # List page (exists)
├── layout.tsx            # List layout (exists)
├── ArticleListSkeleton.tsx
├── styles.css
└── [slug]/               # NEEDS TO BE CREATED
    ├── page.tsx          # Detail page
    └── layout.tsx        # Detail layout
```

**Reference pattern exists:**
```
src/app/projects/[slug]/page.tsx  # Good SSR pattern to follow
```

### Schema Extension

```typescript
// Current schema
export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),           // e.g., "/articles/react-pagination"
  reading_time: z.string(),
  published_at: z.string(),
  summary: z.string(),
  img: z.string(),
  featured: z.boolean(),
  status: z.enum(["published", "draft"]).optional().default("published"),
});

// Extended schema for Story 4.2
export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  slug: z.string(),          // NEW: derived slug (e.g., "react-pagination")
  reading_time: z.string(),
  published_at: z.string(),
  summary: z.string(),
  content: z.string().optional(),  // NEW: full markdown content
  img: z.string(),
  featured: z.boolean(),
  status: z.enum(["published", "draft"]).optional().default("published"),
});
```

### Mock Content Example

```typescript
// Add to mock.ts
{
  id: 1,
  title: "Build A Custom Pagination Component In ReactJS From Scratch",
  url: "/articles/react-pagination",
  slug: "react-pagination",
  reading_time: "9 min read",
  published_at: "2023-03-22",
  summary: "Learn how to build a fully functional custom pagination...",
  content: `
# Introduction

Building pagination from scratch helps you understand...

## Step 1: Setup

\`\`\`tsx
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  // Implementation here
};
\`\`\`

...
  `,
  img: "/images/articles/pagination component in reactjs.jpg",
  featured: true,
  status: "published",
},
```

### SSR Page Pattern (from projects/[slug])

```typescript
// src/app/articles/[slug]/page.tsx
import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import model from "@/domains/article/model";
import { ArticleContent } from "@/organisms";

const getArticle = cache((slug: string) => model.fetchBySlug(slug));

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return { title: "Article Not Found | Articles" };
  }

  return {
    title: `${article.title} | Articles`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [article.img],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [article.img],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} />;
}
```

### Syntax Highlighting Options

**Option A: prism-react-renderer (Recommended)**
- Lightweight, React-native
- Easy theme customization
- SSR compatible

**Option B: rehype-highlight + react-markdown**
- If using markdown rendering already
- More dependencies

**Decision:** Choose based on existing dependencies. If no markdown renderer exists, go with Option A.

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/domains/`, `@/ui/`, `@/organisms/` |
| Zod inference | `type Article = z.infer<typeof ArticleSchema>` |
| React Query | Use `gcTime` (NOT `cacheTime`) |
| Test convention | Tests in `__tests__/` folders |
| SSR pattern | Follow `projects/[slug]/page.tsx` |
| Framer motion mock | Use shared mock if needed |

### Testing Strategy

**Schema Tests (extend existing):**
- Slug field parses correctly
- Content field is optional
- fetchBySlug returns correct article
- fetchBySlug returns null for invalid slug

**Component Tests (new for ArticleContent):**
- Renders article title and reading time
- Renders content area
- Has correct accessibility attributes

**Page Tests (new):**
- SSR generateMetadata returns correct meta
- notFound called for invalid slug

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

- [ ] Click article from /articles → detail page loads
- [ ] Direct navigation to /articles/react-pagination works
- [ ] Full article content displayed with formatting
- [ ] Code blocks have syntax highlighting
- [ ] Reading time shows at top of article
- [ ] Published date displayed
- [ ] Meta tags in page source (View Source): title, og:title, og:image
- [ ] Mobile view → responsive article content
- [ ] Keyboard: Can navigate back to articles list
- [ ] Theme toggle works on article page

---

## References

- [Source: epics.md#Story 4.2] - Original acceptance criteria (FR15)
- [Source: architecture.md#TypeScript Migration] - Migration strategy
- [Source: 4-1-article-listing.md] - Previous story patterns
- [Source: src/app/projects/[slug]/page.tsx] - SSR pattern reference
- [Source: src/domains/article/] - Existing domain to extend

---

## Dev Agent Record

### Agent Model Used

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### Debug Log References

(To be filled during implementation)

### File List

**Files to Create:**
- `src/app/articles/[slug]/page.tsx`
- `src/app/articles/[slug]/layout.tsx`
- `src/ui/organisms/ArticleContent/index.tsx`
- `src/ui/organisms/ArticleContent/__tests__/ArticleContent.test.tsx`
- (Optional) `src/ui/atoms/CodeBlock/index.tsx` - if syntax highlighting needed

**Files to Modify:**
- `src/domains/article/model/schema.ts` (add slug, content fields)
- `src/domains/article/model/mock.ts` (add content to articles)
- `src/domains/article/model/index.ts` (add fetchBySlug)
- `src/domains/article/index.ts` (export new types if needed)
- `src/ui/organisms/index.ts` (export ArticleContent)
