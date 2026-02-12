# Layout Patterns & Global Utilities

> Epic 20 — Component & Style Architecture (Story 20.6)
> Documents the current layout system, page composition patterns, responsive design rules, and global CSS utilities.

---

## 1. Global Layout System

### Root Container (`.layout`)

The site-wide container is defined in `src/styles/globals.css`:

```css
.layout {
  min-width: 320px;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

| Property | Value | Purpose |
|----------|-------|---------|
| `max-width: 1024px` | Matches `desktop:` breakpoint | Content constraint — all pages stay within 1024px |
| `margin: 0 auto` | Centering | Content centered on wide screens |
| `min-width: 320px` | Minimum viewport | Prevents content compression below 320px |
| `min-height: 100vh` | Full viewport | Layout always fills at least viewport height |
| `display: flex; flex-direction: column` | Flex column | Enables footer push-down via flex:1 on main |

Body background (`#f5f5f5` light, `#1b1b1b` dark) fills the area outside the 1024px container.

### Main Content Area

```css
#main-content {
  flex: 1;
}
```

`flex: 1` on `#main-content` makes the main area grow to fill available space, pushing the footer to the bottom even on short pages.

### RootLayout Component Tree (`src/app/layout.jsx`)

```
html[lang="en"]
└── body
    └── RootProvider (Redux + React Query + LazyMotion + Theme)
        └── div.layout.font-mont
            ├── a.skip-link            (WCAG 2.4.1 — keyboard skip navigation)
            ├── NavBar                 (static import)
            ├── main#main-content      (flex: 1, tabIndex=-1 for skip-link target)
            │   └── AnimatedChildren   (framer-motion page transition wrapper)
            │       └── {children}     (page content)
            ├── Footer                 (dynamic import, ssr: true)
            └── Auth                   (dynamic import, ssr: false — client-only modal)
```

### Global Utilities (`src/styles/globals.css`)

| Utility | CSS | Usage |
|---------|-----|-------|
| `.skip-link` | `position: absolute; top: -100%` → `:focus { top: 0 }` | Keyboard skip-to-content link (WCAG 2.4.1) |
| `.focus-ring` | `@layer utilities { outline: 3px solid #0066cc; outline-offset: 2px }` | Reusable accessible focus indicator |
| `.transition-active` | `overflow: hidden; pointer-events: none; cursor: wait` | Applied to body during page transitions (Story 13.6) |

### MainContainer HOC (`src/ui/atoms/hocs/MainContainer`)

```css
/* src/ui/atoms/hocs/MainContainer/styles.css */
.main-container {
  @apply inline-block w-full h-full bg-light dark:bg-dark
  py-12 px-28 xl:p-24 lg:p-16 md:p-12 sm:p-8 z-0;
}
```

| Breakpoint | Padding | Note |
|------------|---------|------|
| Default | `py-12 px-28` (48px / 112px) | Very generous horizontal padding |
| `xl:` (<1280px) | `p-24` (96px) | Legacy max-width breakpoint |
| `lg:` (<1024px) | `p-16` (64px) | Legacy max-width breakpoint |
| `md:` (<768px) | `p-12` (48px) | Legacy max-width breakpoint |
| `sm:` (<640px) | `p-8` (32px) | Legacy max-width breakpoint |

**Known debt:** Uses deprecated max-width breakpoints (`xl:`, `lg:`, `md:`, `sm:`). Migration to semantic min-width breakpoints is a future task (see Section 7).

---

## 2. Layout Primitives (Every Layout)

> **Decision:** Adopt **all 7** [Every Layout](https://every-layout.dev/) primitives as **semantic CSS utility classes** (`@layer utilities` in `globals.css`). The Tailwind properties already exist in the codebase — the value of naming them is **making layout intent instantly readable and replicable**.
>
> Reading `flex flex-col gap-4` requires parsing 3 properties to deduce "vertical stack". Reading `stack gap-4` communicates intent immediately. When a new page needs "something that behaves like this," the pattern already has a name.

### Evaluation Summary

| Primitive | Decision | Utility Class | Codebase Sites | Tailwind Underneath |
|-----------|----------|---------------|----------------|---------------------|
| **Stack** | ADOPT | `.stack` | 54+ | `flex flex-col` |
| **Center** | ADOPT | `.center` | 5+ | `mx-auto w-full` |
| **Cluster** | ADOPT | `.cluster` | 11+ | `flex flex-wrap` |
| **Sidebar** | ADOPT | `.sidebar` | 4+ | `flex flex-wrap` + flex-basis |
| **Switcher** | ADOPT | `.switcher` | 6+ | `flex flex-col` → breakpoint `flex-row` |
| **Cover** | ADOPT | `.cover` | 5+ | `flex flex-col min-h-screen` |
| **Grid** | ADOPT | `.grid-fluid` | 3+ | `grid` + `auto-fill minmax()` |

Context-dependent modifiers (`gap-*`, `max-w-*`, `items-*`, breakpoint prefixes) remain per-use — they vary by context and shouldn't be baked into the base class.

### Stack

Vertical flow with consistent spacing between children.

```css
@layer utilities {
  .stack { @apply flex flex-col; }
}
```

**Usage:** `<div class="stack gap-4">` — vertical stack with 1rem spacing.

**Current codebase sites (54+):**
- About page sections: biography text, stats, skills (`about/styles.css`)
- Footer columns: links, social, contact (`Footer/styles.css`)
- Card content: ProjectCard, ArticleCard inner content (`ProjectCard/styles.css`, `ArticleCard/styles.css`)
- Chat panel: message list, input area (`Chat/styles.css`)
- Auth modal: form fields, social buttons (`Auth/styles.css`)
- Menu overlay: nav items (`MobileMenuOverlay/styles.css`)
- HireMe, ExtraInfo, Experience molecules

### Center

Horizontally centered content with a max-width constraint.

```css
@layer utilities {
  .center { @apply mx-auto w-full; }
}
```

**Usage:** `<div class="center max-w-4xl">` — centered column, max 672px.

**Current codebase sites:**
- `.layout` — global page center at max-width: 1024px (`globals.css`)
- Articles list — `max-w-4xl mx-auto` for reading width (`articles/styles.css`)
- Article detail prose — `max-width: 800px; margin: 0 auto` (`ArticleContent/styles.css`)
- About hero image — centered within grid column (`about/styles.css`)
- WordCloud container — `w-full flex ... items-center` with centered content

### Cluster

Horizontal wrapping group with consistent gaps.

```css
@layer utilities {
  .cluster { @apply flex flex-wrap; }
}
```

**Usage:** `<div class="cluster gap-2 items-center">` — wrapping row of items.

**Current codebase sites (11+):**
- WordCloud tags — 3 instances: all-tags, category-tags, tag-groups (`WordCloud/styles.css`)
- TechnologyFilter pills — filter chip row (`TechnologyFilter/styles.css`)
- SkillSelector — skill pill row (`SkillSelector/styles.css`)
- ProjectDetail — tech tags + action links (`ProjectDetail/styles.css`)
- Experience — role/company metadata row (`Experience/styles.css`)
- Chat suggestions — `flex flex-wrap justify-center` (`Chat/styles.css`)
- ProjectCard — responsive tech tag wrapping (`ProjectCard/styles.css`)

### Sidebar

Two-panel layout where one panel has an intrinsic width and the other fills remaining space.

```css
@layer utilities {
  .sidebar {
    @apply flex flex-wrap;
    --sidebar-width: 20rem;
    --content-min: 50%;
  }
  .sidebar > :first-child { flex-basis: var(--sidebar-width); flex-grow: 1; }
  .sidebar > :last-child { flex-basis: 0; flex-grow: 999; min-inline-size: var(--content-min); }
}
```

> Note: Sidebar uses CSS custom properties for configurability. Override `--sidebar-width` and `--content-min` per instance.

**Current codebase sites:**
- About page — biography (5 cols) + hero image (3 cols), asymmetric split (`about/styles.css`)
- Featured ProjectCard — image panel + content panel side-by-side (`ProjectCard/styles.css`)
- Featured ArticleCard — thumbnail + content side-by-side (`ArticleCard/styles.css`)
- ArticleListItem — thumbnail + text at `tablet:flex-row` (`ArticleListItem/styles.css`)

### Switcher

Switches from vertical stack to horizontal flow based on available space or breakpoint.

```css
@layer utilities {
  .switcher { @apply flex flex-col; }
  /* Apply breakpoint-based switching per instance:
     .switcher.tablet\:flex-row { ... }
     Or use intrinsic switching with flex-basis threshold */
}
```

**Usage:** `<div class="switcher tablet:flex-row gap-4">` — stacked on mobile, row on tablet.

**Current codebase sites:**
- AnimatedTitle — words `block` (stacked) on mobile → `inline-block` (inline) at 960px+ (`AnimatedTitle/styles.css`)
- ExperienceStats — `flex flex-col xl:flex-row`, vertical on mobile, horizontal on wide (`ExperienceStats/styles.css`)
- ArticleListItem — `flex flex-col tablet:flex-row`, stacked → row at 640px+ (`ArticleListItem/styles.css`)
- Home CTAs — column on mobile, row with centering on desktop (`app/styles.css`)
- Footer — single column → grid columns at 720px+ (`Footer/styles.css`)
- AnimatedTitle skeleton — `flex-direction: column` → `row` at 960px+ (`AnimatedTitle/styles.css`)

### Cover

Minimum-height container where a principal element is vertically centered.

```css
@layer utilities {
  .cover { @apply flex flex-col; }
  .cover > .principal { @apply my-auto; }
}
```

**Usage:** `<section class="cover min-h-screen">` — viewport-height section with centered content.

**Current codebase sites:**
- Root layout — `.layout` min-h-screen + `#main-content` flex:1 pushes footer down (`globals.css`)
- Home hero blade — `calc(100dvh - 114px)` with vertically distributed content (`app/styles.css`)
- Projects hero blades — `min-h-screen` with scroll-snap, title + featured card centered (`projects/styles.css`)
- Articles hero blade — `min-h-screen` carousel section (`articles/styles.css`)
- Coming Soon page — `min-height: 100vh` centered message (`coming-soon/styles.css`)

### Grid (Fluid)

Responsive grid that adapts column count based on available space and a minimum item width.

```css
@layer utilities {
  .grid-fluid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(var(--min, 320px), 100%), 1fr));
  }
}
```

**Usage:** `<div class="grid-fluid gap-8" style="--min: 320px">` — auto-fills 1→2→3 columns.

**Current codebase sites:**
- Projects grid — `repeat(auto-fill, minmax(320px, 1fr))` for project cards (`projects/styles.css`)
- Articles grid — same pattern for article cards (`articles/styles.css`)
- Footer — progressive grid: `1fr 1fr` at 720px → `1fr auto 1fr` at 880px (`Footer/styles.css`)

### Implementation Plan

This document **defines the patterns and their CSS**. Creating the utility classes and migrating components is a future implementation epic:

1. **Add utility classes** to `src/styles/globals.css` inside `@layer utilities`
2. **Migrate incrementally** — replace `flex flex-col` with `stack`, `flex flex-wrap` with `cluster`, etc.
3. **Simple primitives first** (Stack, Center, Cluster) — pure `@apply`, low risk
4. **Complex primitives next** (Sidebar, Switcher, Cover, Grid) — may need CSS custom properties
5. **No breaking changes** — old Tailwind classes and new semantic classes coexist during migration

---

## 3. Page Composition Patterns

### Pattern 1: Home Hero Grid

**File:** `src/app/styles.css`

```
Mobile (0-639px):     Flexbox column, viewport-constrained
                      height: calc(100dvh - 114px)
                      Hero (28vh) → Title → Description → CTAs → Sliders (margin-top: auto)

640px+:               CSS Grid 2×3
                      ┌──────────┬──────────┐
                      │ Hero     │ Title    │ row 1
                      │ (1-2)    │          │
                      ├──────────┤ Desc     │ row 2
                      │          │          │
                      ├──────────┴──────────┤
                      │     CTAs (centered) │ row 3
                      └─────────────────────┘

960px+:               Hero spans ALL 3 rows (grid-row: 1/4)
                      CTAs move to right column (grid-column: 2)
```

**Key CSS:**
```css
/* 640px+ grid activation */
.home-container {
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 0.5rem 1rem;
}

/* display: contents trick — children become grid items */
.home-content { display: contents; }
```

**Notable:** Home overrides MainContainer with `!important` because `.main-container` uses `inline-block` which doesn't support height constraints. This is documented debt.

### Pattern 2: About Biography Grid

**File:** `src/app/about/styles.css`

```
Mobile (0-639px):     Single column, biography only (hero hidden)
                      min-height: calc(100dvh - 200px)

640px+:               8-column grid
                      ┌─────────────────┬──────────┐
                      │ Biography       │ Hero     │
                      │ (cols 1-5)      │ (cols 6-8)│
                      └─────────────────┴──────────┘
```

**Key CSS:**
```css
.about-content {
  @apply grid grid-cols-8 gap-8;
}
/* Biography: col-span-5, Hero: col-span-3 */
```

**Progressive gap scaling:**
- 640px: `gap-8` (2rem)
- 768px: `gap-12` (3rem)
- 1024px: `gap-16` (4rem)

### Pattern 3: Projects Auto-Fill Grid

**File:** `src/app/projects/styles.css`

```
Mobile (0-639px):     Single column, scroll-snap blades
                      scroll-snap-type: y mandatory
                      Each blade: min-h-screen, scroll-snap-align: start

640px+:               Auto-fill responsive grid
                      2 columns typical on tablet
                      3 columns on wide desktop
```

**Key CSS:**
```css
.projects-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  @apply grid gap-8;
}
```

**Blade-pair pattern:** Each featured project anchors a "hero blade" (full title + featured card). Non-featured projects are distributed evenly across "grid blades."

### Pattern 4: Articles List Layout

**File:** `src/app/articles/styles.css`

```
All viewports:        Single-column list
                      max-w-4xl mx-auto (672px centered)
                      Sequential appearance animation (stagger)

Hero blade:           Carousel of featured articles
                      transform: translateX(-${index * 100}%)
                      Auto-advance (5s), pause on hover
```

**Key CSS:**
```css
.articles-list {
  @apply max-w-4xl mx-auto;
}
```

Single column at all breakpoints — optimized for reading flow. Each article item has `ArticleAppearance` wrapper for stagger animation.

### Pattern 5: Article Detail Prose Column

**File:** `src/ui/organisms/ArticleContent/styles.css`

```
All viewports:        Centered prose column
                      max-width: 800px, margin: 0 auto
                      Stagger animation (containerVariants, 0.1s staggerChildren)

Typography scale:
  Desktop:  h1 2.5rem, body 1.125rem, h2 2rem
  Mobile:   h1 1.75rem, body 1rem, h2 1.5rem
```

Single-column reading layout. No grid needed — simple centered container with typographic scale.

---

## 4. Blade-Based Architecture

The project uses an implicit **blade-based** design system for page composition. Each "blade" is a viewport-aware section.

### Blade Types

| Type | Behavior | Mobile | Tablet+ |
|------|----------|--------|---------|
| **Hero blade** | Title + primary content | `min-h-screen`, scroll-snap | Auto height |
| **Grid blade** | Multi-column card layout | Single column | Auto-fill grid |
| **List blade** | Single-column sequential | Stagger animation | Same, wider |

### Scroll Snap (Mobile Only)

```css
/* Projects page mobile behavior */
.projects-page {
  scroll-snap-type: y mandatory;
}
.projects-blade--hero {
  @apply min-h-screen;
  scroll-snap-align: start;
}
```

Users scroll blade-to-blade on mobile. Each blade fills the viewport. Scroll snap ensures clean transitions between blades.

### Blade-Pair Pattern (Projects)

Featured projects anchor hero blades. Non-featured projects fill grid blades. The pairing algorithm distributes cards evenly:

```
Blade 1 (hero): Featured Project A + title
Blade 2 (grid): Projects B, C, D (auto-fill grid)
Blade 3 (hero): Featured Project E
Blade 4 (grid): Projects F, G, H
```

### Viewport Height Calculations

| Pattern | CSS | Usage |
|---------|-----|-------|
| Full viewport | `min-height: 100vh` | `.layout`, body |
| Dynamic viewport | `calc(100dvh - 114px)` | Home hero blade (accounts for browser chrome) |
| Blade height | `min-h-screen` | Mobile hero blades (Projects, Articles) |

`100dvh` (dynamic viewport height) is used on the Home page because mobile browsers have variable-height chrome (address bar, toolbar). `100vh` would cause content to extend behind the browser UI.

---

## 5. Responsive Design Rules

### Layout-Changing Breakpoints

These breakpoints trigger structural layout changes (grid activation, column count, navigation swap):

| Breakpoint | Trigger | Layout Change |
|------------|---------|---------------|
| **640px** (tablet) | Grid activation | Home switches to 2-col grid; About switches to 8-col grid; Footer grid |
| **720px** | Footer grid | Footer becomes 2-column, 3-row grid |
| **800px** (nav) | Navigation swap | Hamburger menu disappears, full nav bar appears |
| **880px** | Footer evolution | Footer becomes 3-column grid |
| **960px** (stage) | Hero swap | Home hero spans all rows; Footer switches to single-line flex |

### Typography-Only Breakpoints

These breakpoints only change font sizes, not layout structure:

| Breakpoint | Effect |
|------------|--------|
| **400px** (phablet) | Font size +10% from base |
| **480px** (mobile) | Font size +25% from base |

### Breakpoint Decision Guide

```
What are you changing?
│
├── Page structure (columns, grid, visibility)?
│   └── Use layout breakpoints: tablet (640), nav (800), stage (960)
│
├── Font size only?
│   └── Use progressive breakpoints: phablet (400), mobile (480)
│
├── Spacing (padding, gap, margins)?
│   └── Usually scales with layout breakpoints (640, 960, 1025)
│
└── Navigation-related?
    └── Use nav breakpoint (800) — coupled with MenuFloatingClient
```

### Overflow Prevention

```css
/* Both body and layout prevent horizontal overflow */
body { @apply overflow-x-hidden; }
.layout { @apply overflow-x-hidden; }
```

### No Full-Bleed

The project does not use full-bleed patterns. All content stays within the 1024px `.layout` container. No negative margins, no `100vw` widths, no viewport-width images.

---

## 6. Spacing Patterns

### Gap Scale

| Gap | Size | Typical Context |
|-----|------|----------------|
| `gap-1` | 0.25rem (4px) | Tight: icon groups, inline elements |
| `gap-2` | 0.5rem (8px) | Component-level: forms, social links, button groups |
| `gap-4` | 1rem (16px) | Medium: chat sections, footer columns, floating blade |
| `gap-6` | 1.5rem (24px) | Between section and page-level |
| `gap-8` | 2rem (32px) | Page-level: grids, about content, section spacing |

### Progressive Gap Scaling

Gaps increase at breakpoints for more breathing room:

```css
/* Home slider container progressive scaling */
gap: 0.5rem;                          /* Mobile base */
@media screen(mobile) { gap: 0.75rem; } /* 480px+ */
@media (min-width: 640px) { gap: 1rem; } /* Tablet */
```

Pattern: `gap-4` (mobile) → `gap-6` (tablet) → `gap-8` (desktop) for section-level spacing.

### MainContainer Padding (Legacy)

```css
/* Padding decreases as viewport shrinks (max-width breakpoints) */
Default:    py-12 px-28  (48px vertical, 112px horizontal)
xl (<1280):  p-24        (96px all sides)
lg (<1024):  p-16        (64px all sides)
md (<768):   p-12        (48px all sides)
sm (<640):   p-8         (32px all sides)
```

**Migration target:** Replace with semantic min-width breakpoints in a future refactor.

### NavBar Progressive Padding

```css
/* NavBar uses semantic breakpoints correctly */
px-6 tablet:px-12 desktop:px-16 wide:px-32
py-4 desktop:py-6
```

### Spacing Consistency

The project relies on Tailwind's default spacing scale. No custom spacing tokens file exists. Ad-hoc raw CSS values (e.g., `margin-bottom: 0.75rem`, `gap: 10rem`) appear in ~36 locations where precise alignment is needed.

---

## 7. Anti-Patterns & Known Debt

### Anti-Pattern: MainContainer Legacy Breakpoints

```css
/* CURRENT — uses deprecated max-width breakpoints */
.main-container {
  @apply py-12 px-28 xl:p-24 lg:p-16 md:p-12 sm:p-8;
}

/* PREFERRED — semantic min-width breakpoints */
.main-container {
  @apply p-8 tablet:p-12 desktop:p-16;
}
```

Migration deferred to Epic 24 (Legacy Breakpoint Migration).

### Anti-Pattern: `!important` Overrides on MainContainer

The Home page uses 7+ `!important` declarations to override MainContainer's base styles:

```css
.main_home-container {
  display: flex !important;
  flex-direction: column !important;
  height: calc(100dvh - 114px) !important;
  padding: 0 1rem !important;
}
```

**Root cause:** MainContainer uses `inline-block` which doesn't support height constraints. Changing the base class would affect all pages.

**Fix (future):** Refactor MainContainer to accept a `variant` prop or use `display: block` as base.

### Anti-Pattern: Raw Media Queries

Some components use raw pixel values instead of semantic breakpoint names:

```css
/* RAW — harder to maintain */
@media (min-width: 720px) { ... }
@media (min-width: 880px) { ... }

/* PREFERRED — use Tailwind screen() function */
@media screen(tablet) { ... }
@media screen(nav) { ... }
```

Not all pixel values map to named breakpoints (720px and 880px have no name). These are intentional intermediate breakpoints for fine-grained layout control.

### Anti-Pattern: Mixed Breakpoint Systems

Some components use both legacy (max-width) and semantic (min-width) breakpoints:

```css
/* AVOID mixing in same component */
.element {
  @apply text-lg md:text-base;          /* md: is max-width 767px */
  @apply tablet:text-xl;                 /* tablet: is min-width 640px */
}
```

### Known Debt Summary

| Debt | Location | Impact | Fix Effort |
|------|----------|--------|------------|
| MainContainer legacy breakpoints | `atoms/hocs/MainContainer/styles.css` | Medium — affects all pages | Epic 24 |
| Home `!important` overrides | `src/app/styles.css` | Low — scoped to home page | Medium (refactor MainContainer) |
| `inline-block` on MainContainer | `atoms/hocs/MainContainer/styles.css` | Low — causes Home override cascade | Low (change to `block`) |
| Raw media queries (720px, 880px) | Various component styles | Low — no named breakpoint exists | Low (add named breakpoints or keep raw) |
| Ad-hoc spacing values (~36 raw CSS) | Various component styles | Low — precise alignment needs | N/A (intentional in many cases) |
| No container query usage | Global | None — future opportunity | Deferred |

---

## Cross-References

- **Folder structure:** [folder-structure.md](./folder-structure.md) — Component folder placement
- **Styles architecture:** [styles-architecture.md](./styles-architecture.md) — CSS patterns, BEM, breakpoints, `@apply` policy
- **Component API:** [component-api.md](./component-api.md) — Props patterns and framer-motion rules
- **Test conventions:** [test-conventions.md](./test-conventions.md) — Test placement patterns
- **Import rules:** [import-rules.md](./import-rules.md) — Barrel file rules and import paths
- **Header layout:** [layout-system.md](../layout-system.md) — Header zone visibility matrix per breakpoint
- **CLAUDE.md breakpoints:** [CLAUDE.md](../../CLAUDE.md) — Responsive Breakpoint System reference
- **Tailwind config:** [`tailwind.config.js`](../../tailwind.config.js) — 6 legacy + 7 semantic breakpoints
