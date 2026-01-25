# Story 4.3: Social Sharing

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to share articles via social links**,
So that **I can recommend content to others**.

---

## Acceptance Criteria

### AC1: Twitter/X Share Button
**Given** I view an article
**When** I click the Twitter/X share button
**Then** a share dialog opens with pre-filled text and URL

### AC2: LinkedIn Share Button
**Given** I view an article
**When** I click the LinkedIn share button
**Then** LinkedIn share dialog opens with the article URL

### AC3: Popup Behavior & Accessibility
**Given** I click any share button
**When** the dialog opens
**Then** it opens in a popup (not leaving the page)
**And** buttons are keyboard accessible

---

## Tasks / Subtasks

- [ ] **Task 1: Create SocialShareButtons component** (AC: #1, #2, #3)
  - [ ] 1.1 Create `src/ui/molecules/SocialShareButtons/index.tsx`
  - [ ] 1.2 Accept props: `url: string`, `title: string`, `summary?: string`
  - [ ] 1.3 Render Twitter/X and LinkedIn share buttons
  - [ ] 1.4 Use accessible button elements with aria-labels
  - [ ] 1.5 Create `styles.css` with consistent styling

- [ ] **Task 2: Implement popup window logic** (AC: #3)
  - [ ] 2.1 Create utility function `openSharePopup(url, windowName, width, height)`
  - [ ] 2.2 Center popup on screen
  - [ ] 2.3 Use `window.open()` with noopener,noreferrer for security
  - [ ] 2.4 Handle focus return after popup closes (optional enhancement)

- [ ] **Task 3: Implement Twitter/X share URL** (AC: #1)
  - [ ] 3.1 Build Twitter intent URL: `https://twitter.com/intent/tweet`
  - [ ] 3.2 Include params: `text` (title), `url` (article URL)
  - [ ] 3.3 URL-encode all parameters
  - [ ] 3.4 Test with real Twitter/X share dialog

- [ ] **Task 4: Implement LinkedIn share URL** (AC: #2)
  - [ ] 4.1 Build LinkedIn share URL: `https://www.linkedin.com/sharing/share-offsite/`
  - [ ] 4.2 Include param: `url` (article URL)
  - [ ] 4.3 URL-encode the URL parameter
  - [ ] 4.4 Test with real LinkedIn share dialog

- [ ] **Task 5: Integrate SocialShareButtons into ArticleContent** (AC: #1, #2, #3)
  - [ ] 5.1 Import SocialShareButtons in ArticleContent
  - [ ] 5.2 Add share buttons section after article header (before content)
  - [ ] 5.3 Build absolute URL from article slug (client-side: `window.location.origin`)
  - [ ] 5.4 Pass article.title and article.url to SocialShareButtons
  - [ ] 5.5 Add CSS styling for share buttons container

- [ ] **Task 6: Add component tests** (AC: #1, #2, #3)
  - [ ] 6.1 Create `SocialShareButtons/__tests__/SocialShareButtons.test.tsx`
  - [ ] 6.2 Test: renders Twitter/X button with correct aria-label
  - [ ] 6.3 Test: renders LinkedIn button with correct aria-label
  - [ ] 6.4 Test: buttons are keyboard accessible (can be focused, have role="button")
  - [ ] 6.5 Test: clicking button opens popup (mock window.open)
  - [ ] 6.6 Test: Twitter URL is correctly formatted with encoded params
  - [ ] 6.7 Test: LinkedIn URL is correctly formatted with encoded URL

- [ ] **Task 7: Final Validation** (AC: #1, #2, #3)
  - [ ] 7.1 Run `npm run lint` - PASS
  - [ ] 7.2 Run `npm run typecheck` - PASS
  - [ ] 7.3 Run `npm test` - PASS
  - [ ] 7.4 Manual: Navigate to article page → share buttons visible
  - [ ] 7.5 Manual: Click Twitter/X button → popup opens with pre-filled tweet
  - [ ] 7.6 Manual: Click LinkedIn button → popup opens with article URL
  - [ ] 7.7 Manual: Tab to share buttons → focus visible
  - [ ] 7.8 Manual: Press Enter on share button → popup opens
  - [ ] 7.9 Manual: Popup opens centered (not full page navigation)

---

## Dev Notes

### Previous Story Learnings (Story 4.2)

**CRITICAL - Apply these patterns:**
- Use shared framer-motion mock: `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))`
- Escape HTML in any dangerouslySetInnerHTML usage (XSS prevention)
- Wrap list items in proper `<ul>` elements (a11y)
- Use `gcTime` instead of deprecated `cacheTime` in React Query 5.x
- Export types from domain index file
- Priority: HIGH/MEDIUM issues → fix, LOW → document
- Apply same test patterns as ArticleContent tests

### Current State Analysis

**ArticleContent exists:**
```
src/ui/organisms/ArticleContent/
├── index.tsx         # Main component (needs share buttons)
├── CodeBlock.tsx     # Syntax highlighting
├── styles.css        # Component styles
└── __tests__/
    ├── ArticleContent.test.tsx
    └── CodeBlock.test.tsx
```

**No social sharing exists:**
- No SocialShareButtons component
- No share utility functions
- Need to create in `src/ui/molecules/`

**Article data available:**
```typescript
interface Article {
  id: number;
  title: string;
  url: string;           // e.g., "/articles/react-pagination"
  slug: string;          // e.g., "react-pagination"
  reading_time: string;
  published_at: string;
  summary: string;
  content?: string;
  img: string;
  featured: boolean;
  status: "published" | "draft";
}
```

### Social Share URL Patterns

**Twitter/X Intent URL:**
```typescript
const twitterUrl = new URL("https://twitter.com/intent/tweet");
twitterUrl.searchParams.set("text", title);
twitterUrl.searchParams.set("url", articleUrl);
// Result: https://twitter.com/intent/tweet?text=My%20Article&url=https%3A%2F%2Fexample.com%2Farticles%2Fslug
```

**LinkedIn Share URL:**
```typescript
const linkedInUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");
linkedInUrl.searchParams.set("url", articleUrl);
// Result: https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.com%2Farticles%2Fslug
```

### Popup Window Implementation

```typescript
/**
 * Opens a centered popup window for social sharing
 * @param url - The share URL to open
 * @param windowName - Name for the popup window
 * @param width - Popup width (default: 600)
 * @param height - Popup height (default: 400)
 */
const openSharePopup = (
  url: string,
  windowName: string,
  width = 600,
  height = 400
): void => {
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;

  window.open(
    url,
    windowName,
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
  );
};
```

### Component Structure

```typescript
// src/ui/molecules/SocialShareButtons/index.tsx
"use client";

import React from "react";
import "./styles.css";

export interface SocialShareButtonsProps {
  url: string;       // Full article URL
  title: string;     // Article title for share text
  summary?: string;  // Optional summary for platforms that support it
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  summary,
}) => {
  const handleTwitterShare = () => {
    const twitterUrl = new URL("https://twitter.com/intent/tweet");
    twitterUrl.searchParams.set("text", title);
    twitterUrl.searchParams.set("url", url);
    openSharePopup(twitterUrl.toString(), "twitter-share");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");
    linkedInUrl.searchParams.set("url", url);
    openSharePopup(linkedInUrl.toString(), "linkedin-share");
  };

  return (
    <div className="social-share-buttons">
      <span className="social-share-buttons__label">Share:</span>
      <button
        type="button"
        onClick={handleTwitterShare}
        aria-label="Share on Twitter"
        className="social-share-buttons__button social-share-buttons__button--twitter"
      >
        {/* Twitter/X Icon SVG */}
      </button>
      <button
        type="button"
        onClick={handleLinkedInShare}
        aria-label="Share on LinkedIn"
        className="social-share-buttons__button social-share-buttons__button--linkedin"
      >
        {/* LinkedIn Icon SVG */}
      </button>
    </div>
  );
};

export default SocialShareButtons;
```

### Integration in ArticleContent

```typescript
// In ArticleContent/index.tsx
import { SocialShareButtons } from "@/ui/molecules/SocialShareButtons";

// Inside component:
const [articleUrl, setArticleUrl] = useState<string>("");

useEffect(() => {
  // Build full URL on client side
  setArticleUrl(`${window.location.origin}/articles/${article.slug}`);
}, [article.slug]);

// In JSX, after header:
{articleUrl && (
  <SocialShareButtons
    url={articleUrl}
    title={article.title}
    summary={article.summary}
  />
)}
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/ui/molecules/` |
| Atomic Design | SocialShareButtons in `molecules/` (reusable, no domain logic) |
| Test convention | Tests in `__tests__/` folders |
| Framer motion mock | Use shared mock if animations added |
| Accessibility | aria-labels, keyboard accessible buttons |

### Testing Strategy

**SocialShareButtons Tests:**
- Renders both share buttons with correct aria-labels
- Twitter button has correct share intent URL format
- LinkedIn button has correct share URL format
- Buttons are focusable (keyboard accessible)
- Click triggers window.open with correct params

**Integration Tests (optional):**
- ArticleContent renders SocialShareButtons when article loaded
- Share buttons receive correct props from article data

### Icon SVGs

**Twitter/X Icon (use existing pattern or inline SVG):**
```typescript
// Simple X/Twitter icon
<svg aria-hidden="true" viewBox="0 0 24 24" className="social-share-buttons__icon">
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
</svg>
```

**LinkedIn Icon:**
```typescript
<svg aria-hidden="true" viewBox="0 0 24 24" className="social-share-buttons__icon">
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
</svg>
```

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

- [ ] Navigate to /articles/{slug} → share buttons visible near header
- [ ] Click Twitter/X button → popup opens (not page navigation)
- [ ] Twitter popup shows pre-filled tweet with title and URL
- [ ] Click LinkedIn button → popup opens (not page navigation)
- [ ] LinkedIn popup shows article URL
- [ ] Tab key navigates to share buttons → visible focus
- [ ] Press Enter on Twitter button → popup opens
- [ ] Press Enter on LinkedIn button → popup opens
- [ ] Popup windows are centered on screen
- [ ] Theme toggle works (share buttons style correctly in dark/light)
- [ ] Mobile: share buttons are touchable (44x44px minimum)

---

## References

- [Source: epics.md#Story 4.3] - Original acceptance criteria (FR16)
- [Source: architecture.md#Implementation Patterns] - Atomic Design patterns
- [Source: 4-2-article-content-reading.md] - ArticleContent integration point
- [Source: src/ui/organisms/ArticleContent/index.tsx] - Component to integrate with
- [Twitter Intent URL Docs](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent)
- [LinkedIn Share URL Docs](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin)
