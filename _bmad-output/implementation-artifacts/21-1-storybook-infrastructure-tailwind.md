# Story 21.1: Storybook Infrastructure & Tailwind Integration

Status: ready-for-dev

---

## Story

As a **developer**,
I want **Storybook installed and configured with Tailwind CSS, custom breakpoints, and dark mode toggle**,
so that **I can run `npm run storybook` and see components rendered with the project's real styles**.

---

## Acceptance Criteria

1. **Given** the project has no Storybook installed
   **When** I run `npm run storybook`
   **Then** Storybook 8 launches on a configured port with the project's Tailwind styles applied
   **And** the sidebar shows the project name "portfolio-frontend-nextjs"

2. **Given** Storybook is running
   **When** I view any component that uses Tailwind classes or `styles.css` with `@apply`
   **Then** all styles render correctly including BEM classes and Tailwind utilities
   **And** PostCSS processes `@apply` directives from component `styles.css` files

3. **Given** Storybook is running
   **When** I use the viewport addon toolbar
   **Then** I can select presets matching the project's semantic breakpoints: phablet (400px), mobile (480px), tablet (640px), nav (800px), stage (960px), desktop (1025px), wide (1441px)

4. **Given** Storybook is running
   **When** I toggle the dark mode control in the toolbar
   **Then** the `.dark` class is applied to the preview container
   **And** components using `dark:` Tailwind prefix and `:is(.dark .selector)` patterns render correctly

5. **Given** the Storybook infrastructure is complete
   **When** I run `npm run build-storybook`
   **Then** a static build generates without errors in `storybook-static/`

6. **Given** `.gitignore` exists
   **When** Story 21.1 is complete
   **Then** `storybook-static/` is added to `.gitignore`

---

## Tasks / Subtasks

- [ ] **Task 1: Install Storybook 8 dependencies** (AC: #1, #5)
  - [ ] 1.1 Install core packages with `--legacy-peer-deps` (consistent with CI pipeline):
    ```
    storybook@8.6.15
    @storybook/nextjs@8.6.15
    @storybook/addon-essentials@8.6.15
    @storybook/addon-a11y@8.6.15
    @storybook/addon-themes@8.6.15
    @storybook/blocks@8.6.15
    @storybook/react@8.6.15
    @storybook/test@8.6.15
    ```
  - [ ] 1.2 Add scripts to `package.json`:
    - `"storybook": "storybook dev -p 6006"`
    - `"build-storybook": "storybook build"`
  - [ ] 1.3 Verify `npm install` succeeds with `--legacy-peer-deps`

- [ ] **Task 2: Create `.storybook/main.ts`** (AC: #1, #2)
  - [ ] 2.1 Configure framework: `@storybook/nextjs`
  - [ ] 2.2 Configure stories glob: `["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"]`
  - [ ] 2.3 Configure addons: `essentials`, `a11y`, `themes`
  - [ ] 2.4 Set `staticDirs: ["../public"]` (for images, fonts)
  - [ ] 2.5 Enable autodocs: `docs: { autodocs: "tag" }`

- [ ] **Task 3: Create `.storybook/preview.ts`** (AC: #2, #3, #4)
  - [ ] 3.1 Import `../src/styles/globals.css` (triggers Tailwind via PostCSS)
  - [ ] 3.2 Configure custom viewport presets for 7 semantic breakpoints + small mobile base
  - [ ] 3.3 Configure `withThemeByClassName` decorator for dark mode toggle (`.dark` class)
  - [ ] 3.4 Set `nextjs: { appDirectory: true }` parameter
  - [ ] 3.5 Configure control matchers (color, date)

- [ ] **Task 4: Update `.gitignore`** (AC: #6)
  - [ ] 4.1 Add `storybook-static/` entry

- [ ] **Task 5: Verify Storybook launch** (AC: #1, #2)
  - [ ] 5.1 Run `npm run storybook` — confirm it launches without errors on port 6006
  - [ ] 5.2 Verify Tailwind classes render correctly
  - [ ] 5.3 Verify component `styles.css` with `@apply` directives render correctly

- [ ] **Task 6: Verify viewport presets** (AC: #3)
  - [ ] 6.1 Open viewport toolbar and confirm all 7 semantic breakpoint presets appear
  - [ ] 6.2 Switch between presets and verify canvas resizes accordingly

- [ ] **Task 7: Verify dark mode toggle** (AC: #4)
  - [ ] 7.1 Toggle dark mode in toolbar
  - [ ] 7.2 Confirm `.dark` class applied to preview container
  - [ ] 7.3 Verify components using `dark:` prefix render dark styles
  - [ ] 7.4 Verify components using `:is(.dark .selector)` pattern render dark styles

- [ ] **Task 8: Build static Storybook** (AC: #5)
  - [ ] 8.1 Run `npm run build-storybook`
  - [ ] 8.2 Confirm `storybook-static/` generated without errors
  - [ ] 8.3 Verify build contains all configured addons

---

## Dev Notes

### Framework Choice: `@storybook/nextjs`

Use `@storybook/nextjs` (NOT `@storybook/react-webpack5`). This framework:
- Automatically reads `postcss.config.js` → `@apply` works without extra config
- Automatically reads `tailwind.config.js` → custom breakpoints, dark mode, theme colors
- Supports App Router via `parameters.nextjs.appDirectory: true`
- Handles `next/image`, `next/link`, `next/font` automatically
- No need for `@storybook/addon-postcss` (deprecated) or `@storybook/addon-styling-webpack`

[Source: epic-21-storybook.md#Story-21.1, storybook.js.org/docs/get-started/frameworks/nextjs]

### PostCSS / @apply Pipeline

The project has **~585 `@apply` directives across 83 CSS files**. The pipeline is:
```
style-loader → css-loader → postcss-loader (reads postcss.config.js)
```

Current `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Known limitation**: `@apply` cannot resolve classes defined in `@layer utilities` from a different CSS file during dev mode. This was already fixed in the codebase by inlining glass utilities (commit `f050310`). No action needed.

[Source: docs/architecture/styles-architecture.md#@apply-policy]

### Tailwind Configuration Critical Details

**`tailwind.config.js`** uses:
- `darkMode: "class"` → compatible with `withThemeByClassName`
- Custom semantic breakpoints (7 min-width) + legacy deprecated breakpoints (6 max-width)
- Custom colors: `dark`, `light`, `primary`, `primaryDark`, brand colors
- Custom font family: `mont` (CSS variable `--font-mont`)
- Circular background gradients for skills section
- `content: ["./src/**/*.{js,ts,jsx,tsx}"]`

[Source: tailwind.config.js]

### Viewport Presets (exact values from project breakpoints)

| Preset Key | Name | Width | Height | Breakpoint |
|------------|------|-------|--------|------------|
| smallMobile | Small Mobile (base) | 375px | 667px | 0-399px |
| phablet | Phablet (400px+) | 400px | 740px | min-width: 400px |
| mobile | Mobile (480px+) | 480px | 844px | min-width: 480px |
| tablet | Tablet (640px+) | 640px | 1024px | min-width: 640px |
| nav | Nav Breakpoint (800px+) | 800px | 1024px | min-width: 800px |
| stage | Stage (960px+) | 960px | 768px | min-width: 960px |
| desktop | Desktop (1025px+) | 1025px | 768px | min-width: 1025px |
| wide | Wide (1441px+) | 1441px | 900px | min-width: 1441px |

[Source: docs/architecture/styles-architecture.md#breakpoint-system, CLAUDE.md#responsive-breakpoints]

### Dark Mode Configuration

Three dark mode patterns exist in the codebase:
1. **`dark:` Tailwind prefix** (~20+ files) — for simple property changes
2. **`:is(.dark .selector)`** (~9 files) — for complex rules (gradients, shadows, filters)
3. **`@media (prefers-color-scheme: dark)`** (2 files) — accessibility only (skip-link, focus ring)

The `withThemeByClassName` decorator applies `.dark` class to the story container, which handles patterns 1 and 2. Pattern 3 (media query) responds to system preference, not the toggle.

Theme colors:
| Role | Light | Dark | Tailwind |
|------|-------|------|----------|
| Background | `#f5f5f5` | `#1b1b1b` | `bg-light` / `bg-dark` |
| Text | `#1b1b1b` | `#f5f5f5` | `text-dark` / `text-light` |
| Primary | `#B63E96` | `#58E6D9` | `text-primary` / `text-primaryDark` |

[Source: docs/architecture/styles-architecture.md#dark-mode-patterns]

### Global CSS Files to Import

Only import `globals.css` in `preview.ts` — it already includes:
- `@tailwind base; @tailwind components; @tailwind utilities;`
- `.layout` container (max-width: 1024px)
- Skip-link (WCAG 2.4.1)
- `.focus-ring` utility
- `reduced-motion.css` import (WCAG 2.2 AA)
- Page transition blocker

**Do NOT import** `src/app/styles.css` (home page specific blade layouts) — it will be loaded by page components that import it.

[Source: src/styles/globals.css]

### Static Assets

Set `staticDirs: ["../public"]` to serve:
- `/images/` (profile photos, logos)
- `/fonts/` (if any)
- Favicon and OG images

[Source: .storybook/main.ts configuration]

### Install Command

Use `--legacy-peer-deps` flag (required — documented in CLAUDE.md and CI pipeline):
```bash
npm install --save-dev --legacy-peer-deps \
  storybook@8.6.15 \
  @storybook/nextjs@8.6.15 \
  @storybook/addon-essentials@8.6.15 \
  @storybook/addon-a11y@8.6.15 \
  @storybook/addon-themes@8.6.15 \
  @storybook/blocks@8.6.15 \
  @storybook/react@8.6.15 \
  @storybook/test@8.6.15
```

[Source: CLAUDE.md#ci-cd-pipeline, package.json]

### Project Structure Notes

- `.storybook/` directory does NOT exist yet — fresh setup
- All new files must be TypeScript (.ts/.tsx)
- Story files follow pattern: `src/**/*.stories.tsx`
- No test files needed for this infrastructure story
- `storybook-static/` must be gitignored

### Alignment with Project Conventions

| Convention | Storybook Alignment |
|-----------|-------------------|
| TypeScript preference | `.storybook/main.ts` and `preview.ts` (not .js) |
| `--legacy-peer-deps` | Used in install command |
| Barrel import avoidance | Stories will use direct path imports |
| BEM naming | Storybook renders CSS as-is, no conflict |
| Component-scoped `styles.css` | Loaded via component imports, PostCSS processes automatically |

### References

- [Source: _bmad-output/implementation-artifacts/epic-21-storybook.md#Story-21.1]
- [Source: docs/architecture/styles-architecture.md] — Full CSS architecture with @apply policy, BEM, dark mode
- [Source: docs/architecture/layout-patterns.md] — Layout primitives, .layout container
- [Source: CLAUDE.md#css-patterns] — Component CSS patterns
- [Source: CLAUDE.md#responsive-breakpoint-system] — Breakpoint reference
- [Source: CLAUDE.md#performance-anti-pattern-barrel-imports] — Barrel import avoidance
- [Source: tailwind.config.js] — Theme, breakpoints, dark mode config
- [Source: postcss.config.js] — PostCSS plugins (tailwindcss + autoprefixer)
- [Source: next.config.js] — Build optimizations, experimental settings
- [Source: package.json] — Dependencies, scripts
- [Source: tsconfig.json] — Path aliases for Storybook webpack resolution
- [Source: storybook.js.org/docs/get-started/frameworks/nextjs] — @storybook/nextjs docs
- [Source: storybook.js.org/recipes/tailwindcss] — Tailwind CSS Storybook recipe

---

## Dev Agent Record

### Agent Model Used

_pending_

### Debug Log References

### Completion Notes List

### File List
