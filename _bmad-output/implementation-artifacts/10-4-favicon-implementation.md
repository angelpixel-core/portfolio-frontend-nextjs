# Story 10.4: Favicon Implementation

## Story

**As a** visitor with multiple browser tabs,
**I want** the site to have a favicon,
**So that** I can identify the tab visually.

## Status

- **Epic:** 10 - Runtime & UX Polish
- **Sprint Status:** ready-for-dev
- **Priority:** LOW (Assets)
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Favicon Displays in Browser Tab

**Given** I visit the site
**When** I look at the browser tab
**Then** a favicon displays (not blank/default)

### AC2: No 404 Error

**Given** I check network requests
**When** the page loads
**Then** `/favicon.ico` returns 200 (not 404)

## Tasks / Subtasks

### Task 1: Create Favicon Asset (AC1, AC2)

- [ ] 1.1 Create or obtain a favicon.ico file
- [ ] 1.2 Create favicon in multiple sizes (16x16, 32x32, 48x48)
- [ ] 1.3 Place favicon.ico in `/public/` directory
- [ ] 1.4 Verify file is accessible at `/favicon.ico`

### Task 2: Configure Next.js Metadata (AC1)

- [ ] 2.1 Add icon configuration to `layout.jsx` metadata (optional, Next.js auto-detects /public/favicon.ico)
- [ ] 2.2 Consider adding apple-touch-icon for iOS bookmarks (optional enhancement)
- [ ] 2.3 Verify metadata is correctly generated in HTML head

### Task 3: Write E2E Tests (AC1, AC2)

- [ ] 3.1 Create test that favicon returns 200 status
- [ ] 3.2 Create test that favicon is properly linked in HTML
- [ ] 3.3 Verify tests pass in CI environment

### Task 4: Validate Implementation (AC1, AC2)

- [ ] 4.1 Run dev server and verify favicon appears in browser tab
- [ ] 4.2 Check Network tab - `/favicon.ico` returns 200
- [ ] 4.3 Verify no console errors related to favicon
- [ ] 4.4 Test in multiple browsers (Chrome, Firefox, Safari)

## Dev Notes

### Technical Context

- **Debt Origin:** Network tab showing 404 for favicon.ico
- **Current Status:** Site functions but browser tab shows default/no icon
- **Impact:** Poor UX for users with multiple tabs

### Current Evidence

```
GET http://localhost:9000/favicon.ico [HTTP/1.1 404 Not Found 2ms]
```

### Root Cause Analysis

The portfolio site was scaffolded without a favicon.ico file. Next.js automatically looks for `/public/favicon.ico` and serves it at the root URL. Without this file, browsers receive a 404.

### Solution Approach

**Option A (Recommended): Simple favicon.ico**
1. Create a simple favicon.ico file
2. Place in `/public/favicon.ico`
3. Next.js will automatically serve it

**Option B: Full Icon Set with Metadata**
```javascript
// In layout.jsx metadata
export const metadata = {
  // ... existing metadata
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
```

### Favicon Creation Options

1. **Use existing logo/brand asset** - If there's a logo in `/public/images/`
2. **Generate programmatically** - Use a simple geometric shape
3. **Online generator** - Convert an image to .ico format

### Current Public Directory

```
public/
├── data/           # JSON data files
├── images/         # Image assets
├── resume.pdf      # Resume download
├── robots.txt      # SEO
├── sitemap.xml     # SEO
└── sitemap-0.xml   # SEO
```

### Related Files

```
public/favicon.ico          # TO CREATE: Favicon file
src/app/layout.jsx          # OPTIONAL: Add icons metadata
```

### Testing Commands

```bash
# Run dev server and check network tab
npm run dev
# Open browser DevTools → Network → Filter for "favicon"

# Verify file exists and is served
curl -I http://localhost:3000/favicon.ico

# Run E2E tests
npm run test:e2e
```

### Scope Boundaries

Per Epic 10 definition:
- Add a basic favicon ONLY
- NO complex icon sets or PWA manifest (unless trivial)
- NO branding decisions (use simple placeholder if needed)
- Maintain current build/performance

### Previous Story Intelligence

From Story 10.3:
- TDD approach worked well (RED-GREEN-REFACTOR)
- Simple asset additions are low risk
- Commit between phases for traceability

From Story 10.2:
- Small targeted fixes are efficient
- Verify with E2E tests

## Project Structure Notes

### Files to Create

```
public/
└── favicon.ico             # PRIMARY: Favicon file
```

### Files to Modify (Optional)

```
src/app/
└── layout.jsx              # OPTIONAL: Add icons metadata
```

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| 10.4 | Favicon 404 | Network tab | Add favicon.ico to public/ |

### Architecture Alignment

- **Pattern:** Next.js App Router with automatic favicon detection
- **Standard:** `/public/favicon.ico` is convention
- **SEO:** Favicon improves site recognition in bookmarks/tabs

### Existing Code References

- `src/app/layout.jsx:10-23` - Current metadata configuration
- `_bmad-output/implementation-artifacts/technical-debt-backlog.md:91-108` - Debt documentation

### Next.js Favicon Documentation

From Next.js App Router docs:
- Place `favicon.ico` in `/app/` or `/public/` directory
- Next.js automatically detects and serves it
- Optional: Use `icons` metadata field for more control
- Supports `.ico`, `.png`, `.svg` formats

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-27 |
| Story Author | Workflow: create-story |
| Epic | 10 - Runtime & UX Polish |
| Debt Origin | Network 404 error |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-27 | Story created via create-story workflow |
