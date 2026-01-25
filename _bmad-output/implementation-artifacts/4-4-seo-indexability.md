# Story 4.4: SEO & Indexability

Status: ready-for-dev

---

## Story

As a **search engine**,
I want **to index portfolio content properly**,
So that **users can discover the portfolio via search**.

---

## Acceptance Criteria

### AC1: Server-Rendered HTML
**Given** Googlebot crawls the site
**When** it accesses any page
**Then** it receives server-rendered HTML with content
**And** proper meta tags exist (title, description, canonical)

### AC2: Sitemap Generation
**Given** the site builds
**When** next-sitemap runs
**Then** sitemap.xml is generated with all public pages
**And** robots.txt allows indexing of public content

### AC3: Structured Data (JSON-LD)
**Given** an article page
**When** rendered
**Then** JSON-LD Article schema is present
**And** Open Graph tags are complete

---

## Tasks / Subtasks

- [ ] **Task 1: Install and configure next-sitemap** (AC: #2)
  - [ ] 1.1 Install `next-sitemap` package
  - [ ] 1.2 Create `next-sitemap.config.js` with site URL
  - [ ] 1.3 Add `postbuild` script to package.json
  - [ ] 1.4 Configure sitemap for articles and projects pages
  - [ ] 1.5 Exclude non-public routes (coming-soon, etc.)

- [ ] **Task 2: Create robots.txt configuration** (AC: #2)
  - [ ] 2.1 Configure robots policy in next-sitemap.config.js
  - [ ] 2.2 Allow all crawlers for public pages
  - [ ] 2.3 Reference sitemap.xml in robots.txt
  - [ ] 2.4 Verify robots.txt generation in build output

- [ ] **Task 3: Add canonical URLs to all pages** (AC: #1)
  - [ ] 3.1 Update `src/app/layout.jsx` metadata with metadataBase
  - [ ] 3.2 Ensure alternates.canonical is set automatically
  - [ ] 3.3 Verify canonical tags in article pages
  - [ ] 3.4 Verify canonical tags in project pages

- [ ] **Task 4: Implement JSON-LD Article schema** (AC: #3)
  - [ ] 4.1 Create `src/lib/seo/article-jsonld.ts` utility
  - [ ] 4.2 Generate Article schema with: headline, author, datePublished, image
  - [ ] 4.3 Add JSON-LD script tag in article detail page
  - [ ] 4.4 Validate schema with Google Rich Results Test

- [ ] **Task 5: Enhance Open Graph tags for articles** (AC: #3)
  - [ ] 5.1 Verify og:type is "article" in article pages (already done)
  - [ ] 5.2 Add og:published_time meta tag
  - [ ] 5.3 Add og:author meta tag
  - [ ] 5.4 Verify og:image uses absolute URL

- [ ] **Task 6: Enhance Open Graph for projects** (AC: #1, #3)
  - [ ] 6.1 Add generateMetadata to project detail page if missing
  - [ ] 6.2 Set og:type to "website" for project pages
  - [ ] 6.3 Include project image and description
  - [ ] 6.4 Verify meta tags with social debuggers

- [ ] **Task 7: Add SEO tests** (AC: #1, #2, #3)
  - [ ] 7.1 Create `src/lib/seo/__tests__/article-jsonld.test.ts`
  - [ ] 7.2 Test JSON-LD schema structure is valid
  - [ ] 7.3 Test sitemap includes expected routes
  - [ ] 7.4 Test robots.txt content is correct

- [ ] **Task 8: Final Validation** (AC: #1, #2, #3)
  - [ ] 8.1 Run `npm run build` - PASS
  - [ ] 8.2 Verify `public/sitemap.xml` exists post-build
  - [ ] 8.3 Verify `public/robots.txt` exists post-build
  - [ ] 8.4 Run `npm run lint` - PASS
  - [ ] 8.5 Run `npm run typecheck` - PASS
  - [ ] 8.6 Run `npm test` - PASS
  - [ ] 8.7 Manual: View page source → meta tags present
  - [ ] 8.8 Manual: Test with Google Rich Results Test

---

## Dev Notes

### Previous Story Learnings (Story 4.3)

**CRITICAL - Apply these patterns:**
- Use shared framer-motion mock: `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))`
- Clean props API - don't declare props you don't use
- Add `role="group"` for grouped interactive elements (a11y)
- Handle edge cases (popup blocker fallback pattern)
- Document known limitations in code review

### Current State Analysis

**SEO Infrastructure - NOT EXISTS:**
- No `next-sitemap` package installed
- No `sitemap.xml` or `robots.txt` files
- No JSON-LD structured data on any page

**Meta Tags - PARTIAL:**
- `src/app/layout.jsx:10-19` - Basic metadata (title template, description)
- `src/app/articles/[slug]/page.tsx:14-40` - Full OG tags for articles ✅
- Missing: canonical URLs, metadataBase, article:published_time

**Pages to Index:**
```
/                    - Homepage
/about              - About page
/projects           - Projects listing
/projects/[slug]    - Project details (dynamic)
/articles           - Articles listing
/articles/[slug]    - Article details (dynamic)
```

**Pages to Exclude:**
```
/coming-soon        - Placeholder page
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | New files in `.ts` |
| Path aliases | Use `@/lib/seo/` |
| Test convention | Tests in `__tests__/` folders |
| Next.js 14 App Router | Use Metadata API |

### next-sitemap Configuration Pattern

```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  exclude: ['/coming-soon'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};
```

### JSON-LD Article Schema Pattern

```typescript
// src/lib/seo/article-jsonld.ts
import type { Article } from "@/domains/article";

export function generateArticleJsonLd(article: Article, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: `${siteUrl}${article.img}`,
    datePublished: article.published_at,
    author: {
      "@type": "Person",
      name: "Angel Thunder", // Or from config
    },
    publisher: {
      "@type": "Organization",
      name: "Portfolio",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  };
}
```

### Metadata Enhancement Pattern

```typescript
// In article page.tsx, add to existing metadata:
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ...existing code...
  return {
    // ...existing...
    alternates: {
      canonical: `/articles/${slug}`,
    },
    other: {
      'article:published_time': article.published_at,
      'article:author': 'Angel Thunder',
    },
  };
}
```

### Testing Strategy

**Unit Tests:**
- JSON-LD schema generation utility
- Validate schema structure matches schema.org spec

**Build Validation:**
- Sitemap generation in postbuild
- robots.txt content verification

**Manual Validation:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

### File Structure

```
src/lib/seo/
├── article-jsonld.ts     # JSON-LD generator
├── index.ts              # Exports
└── __tests__/
    └── article-jsonld.test.ts

next-sitemap.config.js    # Root config file
```

### Dependencies

```bash
npm install next-sitemap
```

### Environment Variables

```env
SITE_URL=https://your-portfolio-domain.com
```

Fallback to localhost in development.

---

## Testing Requirements

### Validation Commands

```bash
npm run build         # Generates sitemap + robots.txt
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm test              # Jest unit tests
```

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] `npm run build` succeeds
- [ ] `public/sitemap.xml` exists and contains all pages
- [ ] `public/robots.txt` exists and allows crawling
- [ ] View source on article page → JSON-LD script tag visible
- [ ] View source on article page → canonical URL present
- [ ] Google Rich Results Test → no errors for article
- [ ] Open Graph meta tags complete (verify with debugger)

---

## References

- [Source: epics.md#Story 4.4] - Original acceptance criteria (FR17)
- [Source: architecture.md#Implementation Patterns] - File structure patterns
- [Source: 4-3-social-sharing.md] - Previous story learnings
- [next-sitemap docs](https://github.com/iamvishnusankar/next-sitemap)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google JSON-LD Article](https://developers.google.com/search/docs/appearance/structured-data/article)

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
