# Styles Architecture Guide

> Canonical reference for styling decisions in the portfolio frontend.
> Created as part of Epic 20, Story 20.2.

---

## Table of Contents

1. [Style Placement Decision Framework](#1-style-placement-decision-framework)
2. [BEM Naming Convention](#2-bem-naming-convention)
3. [Dark Mode Pattern Guide](#3-dark-mode-pattern-guide)
4. [Breakpoint Reference Table](#4-breakpoint-reference-table)
5. [Component Style Examples](#5-component-style-examples)
6. [@apply Policy](#6-apply-policy)

---

## 1. Style Placement Decision Framework

### Decision Flowchart: "Where Should This Style Live?"

```
New styling needed
│
├─ Is it a global reset, body background, or skip-link?
│  └─ YES → src/styles/globals.css
│
├─ Is it a reduced-motion override?
│  └─ YES → src/styles/reduced-motion.css
│
├─ Does it use ONLY Tailwind utilities (< 5) with no pseudo-elements,
│  animations, clip-path, mask-image, or complex selectors?
│  └─ YES → Tailwind classes directly in JSX (className="...")
│
└─ Otherwise → Co-located styles.css in the component folder
```

### Rules

| Condition | Placement | Rationale |
|-----------|-----------|-----------|
| < 5 Tailwind utilities, no pseudo-elements | Tailwind-only in JSX | Keeps simple components lightweight |
| > 5 Tailwind utilities | Co-located `styles.css` with `@apply` | Prevents className bloat in JSX |
| `@keyframes` animations | Always `styles.css` | Cannot be expressed in Tailwind |
| `::before` / `::after` pseudo-elements | Always `styles.css` | Cannot be expressed in Tailwind |
| `clip-path` | Always `styles.css` | Cannot be expressed in Tailwind |
| `mask-image` | Always `styles.css` | Cannot be expressed in Tailwind |
| Complex `box-shadow` (neumorphic, multi-layer) | Always `styles.css` | Too complex for inline utilities |
| Complex dark mode (gradients, filters) | Always `styles.css` with `:is(.dark ...)` | Tailwind `dark:` insufficient |
| Global layout container (`.layout`) | `globals.css` | Site-wide structural element |
| Page-specific blade layouts | `src/app/[page]/styles.css` | Scoped to route, not a component |

### What Does NOT Belong in globals.css

- Component-specific styles (use co-located `styles.css`)
- BEM classes (belong in component `styles.css`)
- Theme color definitions (belong in `tailwind.config.js`)

### No CSS Modules Policy

This project does **not** use CSS Modules (`.module.css`). Rationale:

1. BEM naming already prevents class collisions
2. Tailwind's utility classes are globally scoped by design
3. Co-located `styles.css` files provide component-level organization without module overhead
4. Build toolchain is optimized for `@apply` + Tailwind, not CSS Modules

---

## 2. BEM Naming Convention

### Format

```
.block__element--modifier
```

| Part | Role | Separator | Example |
|------|------|-----------|---------|
| **Block** | Standalone component | None (kebab-case) | `.article-card` |
| **Element** | Part of a block | `__` (double underscore) | `.article-card__title` |
| **Modifier** | Variant or state | `--` (double dash) | `.article-card--featured` |
| **Combined** | Element with modifier | Both | `.article-card__action-link--github` |

### Block Name Derivation

PascalCase component name → kebab-case CSS block name:

| Component | CSS Block |
|-----------|-----------|
| `ArticleCard` | `.article-card` |
| `ProjectCard` | `.project-card` |
| `TechnologiesSlider` | `.technologies-slider` |
| `FeaturedArticlesCarousel` | `.featured-articles-carousel` |

### Real Examples from the Codebase

#### Example 1: ArticleCard — Full BEM Hierarchy

```css
/* Block */
.article-card { ... }

/* Elements */
.article-card__image-link { ... }
.article-card__image { ... }
.article-card__content { ... }
.article-card__title { ... }
.article-card__meta { ... }
.article-card__date { ... }
.article-card__reading-time { ... }
.article-card__separator { ... }
.article-card__summary { ... }

/* Modifiers (variant) */
.article-card--grid { ... }
.article-card--featured { ... }

/* Modifiers (state) */
.article-card--touched { ... }

/* Element with modifier */
.article-card__image-link--featured { ... }
.article-card__content--featured { ... }
```

#### Example 2: ProjectCard — Actions with Semantic Modifiers

```css
.project-card { ... }
.project-card__actions { ... }
.project-card__action-link { ... }
.project-card__action-link--github { ... }
.project-card__action-link--visit { ... }
.project-card__actions--grid { ... }
.project-card__actions--featured { ... }
.project-card__actions--visible { ... }
```

#### Example 3: Experience — Toggle States

```css
.experience_header { ... }
.experience_title { ... }
.experience_toggle-inline { ... }
.experience_toggle-inline--expanded { ... }
.experience_toggle-inline--no-motion { ... }
.experience_details { ... }
.experience_details--animated { ... }
.experience_tags { ... }
.experience_tag { ... }
```

#### Example 4: AuthButton — Neumorphic Component

```css
.auth_button { ... }
.auth_button__wrapper { ... }
.auth_button__initials { ... }
.auth_button--active { ... }
.auth_button--disabled { ... }
```

#### Example 5: TechnologiesSlider — Animation Component

```css
.technologies-slider { ... }
.technologies-slider__track { ... }
.technologies-slider__slide { ... }
.technologies-slider__icon { ... }
```

### State Modifiers (Canonical List)

| Modifier | Usage | Example |
|----------|-------|---------|
| `--active` | Currently selected/active item | `.auth_button--active` |
| `--disabled` | Non-interactive state | `.auth_button--disabled` |
| `--touched` | Touch device interaction | `.article-card--touched` |
| `--expanded` | Expandable section open | `.experience_toggle-inline--expanded` |
| `--loading` | Loading/processing state | `.form-email_input--loading`, `.social-auth-dropdown__trigger--loading` |
| `--sending` | Async submission in progress | `.form-send_input--sending` |
| `--visible` | Visibility toggle | `.project-card__actions--visible` |
| `--featured` | Featured/promoted variant | `.article-card--featured` |
| `--grid` | Grid layout variant | `.project-card--grid` |

### Valid/Invalid Naming Table

| Pattern | Valid? | Reason |
|---------|--------|--------|
| `.article-card__title` | **Valid** | Standard BEM element |
| `.article-card--featured` | **Valid** | Standard BEM modifier |
| `.article-card__title--featured` | **Valid** | Element with modifier |
| `.article-card_title` | **Invalid** | Single underscore for element (use `__`) |
| `.articleCard__title` | **Invalid** | Block must be kebab-case, not camelCase |
| `.article-card__title__subtitle` | **Invalid** | Only one level of element nesting |
| `.article-card---large` | **Invalid** | Triple dash, use `--` |
| `.article-card__title-link` | **Valid** | Hyphens within element name are OK |

### Historical Exceptions

> **Standard:** `__` (double underscore) is the canonical element separator.

The following components use non-standard patterns. They are documented but **not flagged for immediate migration**:

| Component | Pattern | Issue | Status |
|-----------|---------|-------|--------|
| Experience | `.experience_header` | Single `_` for elements | Historical — consistent within component |
| AuthButton | `.auth_button__initials` | Mix of `_` (block) and `__` (elements) | Historical — partially standard |
| NavBar | `.layout_navbar-container` | Layout-level prefix, single `_` | Historical — layout block, not component block |
| Footer | `.footer-col--left` | Hyphenated block, no `__` separator | Historical — uses hyphen-only BEM variant |
| Chat | `.form-email_input` | Sub-component blocks with single `_` | Historical — consistent within component |

**Consistency within a component matters more than cross-component uniformity.** New components must use the `__` / `--` standard.

---

## 3. Dark Mode Pattern Guide

This project uses `darkMode: "class"` in `tailwind.config.js`. The dark mode class (`.dark`) is toggled on `<html>` via Redux + `next-themes`.

### Pattern 1: Tailwind `dark:` Prefix — Simple Properties

**Use for:** Background, text color, border color, opacity, and simple single-property changes.

```css
/* Background + text + border */
.article-card {
  @apply bg-light dark:bg-dark
    border border-solid border-dark dark:border-light
    dark:text-light;
}

/* Opacity variants */
.article-card__meta {
  @apply text-dark/70 dark:text-light/70;
}

/* Brand color swap */
.experience_company-link {
  @apply text-primary dark:text-primaryDark;
}

/* Multiple variant layers */
.skills-grid {
  @apply bg-circularLight dark:bg-circularDark
    lg:bg-circularLightLg lg:dark:bg-circularDarkLg;
}
```

**When to use:** Any property that Tailwind can express as a single utility class with `dark:` prefix. Covers ~80% of dark mode needs.

### Pattern 2: `:is(.dark .selector)` — Complex Rules

**Use for:** Multi-property changes, gradients, neumorphic shadows, filter effects, and any rule that requires raw CSS.

```css
/* Neumorphic button — light mode */
.auth_button {
  background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
  filter: drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.4));
}

/* Dark mode — different gradient + shadow values */
:is(.dark .auth_button) {
  background:
    linear-gradient(145deg, rgba(192, 192, 200, 0.15), transparent 30%),
    linear-gradient(145deg, #4a4a52, #38383f);
  filter: drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.5));
}

/* Form input with inset shadows */
.form-email_input {
  background: rgba(50, 50, 50, 0.6);
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.3),
    inset -1px -1px 3px rgba(255, 255, 255, 0.05);
}

:is(.dark .form-email_input) {
  background: rgba(230, 230, 230, 0.6);
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.1),
    inset -1px -1px 3px rgba(255, 255, 255, 0.5);
}

/* Interactive states also need :is() variants */
.form-send_input:hover:not(:disabled) {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

:is(.dark .form-send_input:hover:not(:disabled)) {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}
```

**Why `:is(.dark ...)`?** The `:is()` pseudo-class provides the same specificity as `.dark .selector` but works correctly with Tailwind's `darkMode: "class"` configuration. It is more concise and avoids nesting issues.

**When to use:** Whenever a dark mode change requires multiple CSS properties, non-Tailwind values (gradients, shadows, rgba), or compound selectors.

### Pattern 3: `@media (prefers-color-scheme: dark)` — Accessibility Only

**Use for:** Elements that must respect system preference **regardless** of the app's class-based theme toggle. Currently used only for accessibility features.

```css
/* Skip link — always follows system preference (globals.css) */
@media (prefers-color-scheme: dark) {
  .skip-link {
    background-color: #ffffff;
    color: #1a1a2e;
  }

  .skip-link:focus {
    outline-color: #66b3ff;
  }
}

/* Focus ring — system preference for accessibility (globals.css) */
@media (prefers-color-scheme: dark) {
  .focus-ring:focus-visible {
    outline-color: #66b3ff;
  }
}
```

**When to use:** Only for WCAG-mandated elements (skip links, focus rings) that render before the theme class is applied. **Do not use** for regular component styling.

### Color Reference

| Role | Light Mode | Dark Mode | Tailwind Class |
|------|-----------|-----------|----------------|
| Background | `#f5f5f5` | `#1b1b1b` | `bg-light` / `bg-dark` |
| Text | `#1b1b1b` | `#f5f5f5` | `text-dark` / `text-light` |
| Primary accent | `#B63E96` | `#58E6D9` | `text-primary` / `text-primaryDark` |
| Subtle text | `rgba(27,27,27,0.7)` | `rgba(245,245,245,0.7)` | `text-dark/70` / `text-light/70` |

**Brand colors** (social network icons — Story 14.12):

| Brand | Color | Tailwind Class |
|-------|-------|----------------|
| LinkedIn | `#0A66C2` | `text-brand-linkedin` |
| GitHub | `#24292f` | `text-brand-github` |
| Twitter | `#1DA1F2` | `text-brand-twitter` |
| Dribbble | `#EA4C89` | `text-brand-dribbble` |

---

## 4. Breakpoint Reference Table

### Semantic Breakpoints (ACTIVE — min-width, mobile-first)

| Breakpoint | CSS Media Query | Range | Purpose | Notes |
|------------|----------------|-------|---------|-------|
| *(base)* | *(no prefix)* | 0–399px | Small mobile | Default styles, no prefix needed |
| `phablet:` | `min-width: 400px` | 400–479px | Progressive typography +10% | Story 14.15 |
| `mobile:` | `min-width: 480px` | 480–639px | Progressive typography +25% | Story 14.15 |
| `tablet:` | `min-width: 640px` | 640–799px | Tablets | Standard tablet layout |
| `nav:` | `min-width: 800px` | 800–1024px | Navigation transition | Hamburger → full nav. Coupled to `NAV_BREAKPOINT` in `MenuFloatingClient/index.jsx` |
| `stage:` | `min-width: 960px` | 960–1024px | Hero layout swap | Hero section restructuring |
| `desktop:` | `min-width: 1025px` | 1025–1440px | Desktop | Full desktop layout |
| `wide:` | `min-width: 1441px` | 1441px+ | Wide screens | Ultra-wide displays |

### Legacy Breakpoints (REMOVED — Story 24.4)

> Legacy max-width breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `xs:`) were removed in Story 24.4. All 49 usages were migrated to semantic min-width equivalents. Definitions removed from `tailwind.config.js`.

### Usage in Tailwind Classes (JSX)

```jsx
// CORRECT — semantic breakpoints (min-width, mobile-first)
<div className="px-4 tablet:px-8 desktop:px-16 wide:px-32">
```

### Usage in CSS `@media screen()`

```css
/* CORRECT — semantic breakpoints in CSS */
@media screen(mobile) {
  .component__title {
    font-size: 1.25rem;  /* +25% progressive scaling */
  }
}

@media screen(phablet) {
  .component__title {
    font-size: 1.1rem;   /* +10% progressive scaling */
  }
}
```

### Progressive Typography Rules

Two breakpoints provide smooth font scaling on mobile devices (see `docs/adr/002-breakpoint-standardization.md` and `tailwind.config.js` line 84):

| Breakpoint | Scale Factor | Purpose |
|------------|-------------|---------|
| `phablet:` (400px) | +10% from base | Slightly larger text on medium phones |
| `mobile:` (480px) | +25% from base | Full-size text on large phones |

**Pattern:** Used in 20+ components via `@media screen(mobile)` and custom `min-width` queries. Example from `ParagraphText/styles.css`:

```css
.paragraph {
  font-size: 1rem;          /* base: 0-479px */
}

@media screen(mobile) {
  .paragraph {
    font-size: 1.04rem;     /* 480px+: +4% */
  }
}

@media (min-width: 560px) {
  .paragraph {
    font-size: 1.08rem;     /* 560px+: +4% more */
  }
}

@media (min-width: 640px) {
  .paragraph {
    font-size: 1.12rem;     /* 640px+: +4% more */
  }
}
```

> **Note:** Not all components use `phablet:` — many use `mobile:` as their first step-up and add custom intermediate breakpoints (560px, 640px, 720px) for finer-grained scaling.

### Migration Status (Completed — Story 24.4)

| Type | Occurrences | Files | Status |
|------|-------------|-------|--------|
| Legacy (max-width) | 0 | 0 | Removed |
| Semantic (min-width) | 100% | All | Active |

All 49 legacy breakpoint usages across 15 files were migrated to semantic equivalents. Legacy definitions removed from `tailwind.config.js`.

### Cross-References

- `tailwind.config.js`: 7 semantic breakpoints with inline documentation
- `docs/layout-system.md`: Header zone visibility matrix per breakpoint
- CLAUDE.md: Responsive Breakpoint System section

---

## 5. Component Style Examples

### Example 1: Tailwind-Only Atom — BaseLink

**Location:** `src/ui/atoms/links/BaseLink/`

A simple atom that uses minimal Tailwind utilities. Its `styles.css` contains a single `@apply`:

```css
/* styles.css — 1 line */
.base-link {
  @apply underline underline-offset-2;
}
```

```tsx
// index.tsx
import "./styles.css";

const BaseLink = ({ href, children, ...props }) => (
  <a href={href} className="base-link" {...props}>
    {children}
  </a>
);
```

**Why Tailwind-minimal works here:**
- Only 2 utilities needed
- No dark mode variant (underline is theme-agnostic)
- No animations, pseudo-elements, or complex selectors
- Single BEM block, no elements or modifiers

### Example 2: BEM Molecule — Experience

**Location:** `src/ui/molecules/Experience/`

A moderate-complexity molecule demonstrating BEM structure, progressive typography, dark mode with `dark:` prefix, `@keyframes`, and reduced motion support.

```css
/* styles.css — key sections (~150 lines total) */

/* Header: stacked mobile → inline on tablet */
.experience_header {
  @apply flex flex-col;
}

@media (min-width: 640px) {
  .experience_header {
    @apply flex-row flex-wrap items-baseline gap-x-1;
  }
}

/* Progressive typography scaling */
.experience_title {
  @apply capitalize font-bold;
  font-size: 1rem;
}

@media screen(phablet) {
  .experience_title {
    font-size: 1.1rem;       /* +10% */
  }
}

@media screen(mobile) {
  .experience_title {
    font-size: 1.25rem;      /* +25% */
  }
}

/* Dark mode via Tailwind prefix */
.experience_company-link {
  @apply text-primary dark:text-primaryDark;
}

.experience_history-info {
  @apply text-dark/75 dark:text-light/75;
}

/* WCAG 2.5.5 touch target (44x44px) */
.experience_toggle-inline {
  @apply flex items-center justify-center cursor-pointer;
  min-width: 44px;
  min-height: 44px;
}

/* State modifier: expanded */
.experience_toggle-inline--expanded {
  transform: rotate(180deg);
}

/* Animation with reduced motion */
.experience_details--animated {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .experience_details--animated {
    animation: none;
  }
}

/* Tag pills with brand colors */
.experience_tag {
  @apply inline-block px-3 py-1 text-xs font-medium rounded-full
    bg-primary/10 dark:bg-primaryDark/10
    text-primary dark:text-primaryDark
    border border-primary/20 dark:border-primaryDark/20;
}
```

**Key patterns demonstrated:**
- BEM naming with single `_` (historical exception, consistent within component)
- Progressive typography via `@media screen(phablet/mobile)`
- Dark mode using Tailwind `dark:` prefix
- `@keyframes` animation with `@media (prefers-reduced-motion: reduce)` fallback
- WCAG 2.5.5 touch target compliance

### Example 3: Complex Organism — Chat Form (Neumorphic)

**Location:** `src/ui/organisms/Chat/`

A highly complex organism demonstrating neumorphic design with dual-theme shadows, `:is(.dark ...)` dark mode, multi-state animations, and multiple `@keyframes`.

```css
/* styles.css — key sections (~300+ lines total) */

/* Neumorphic input — light mode */
.form-email_input {
  @apply px-1 py-2 text-light dark:text-dark rounded-lg
    border border-light/20 dark:border-dark/20
    outline-none transition-all duration-200;

  background: rgba(50, 50, 50, 0.6);
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.3),
    inset -1px -1px 3px rgba(255, 255, 255, 0.05);
}

/* Dark mode — :is() pattern for complex shadow values */
:is(.dark .form-email_input) {
  background: rgba(230, 230, 230, 0.6);
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.1),
    inset -1px -1px 3px rgba(255, 255, 255, 0.5);
}

/* Focus state with glow ring */
.form-email_input:focus {
  @apply border-primaryDark dark:border-primary;
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.3),
    inset -1px -1px 3px rgba(255, 255, 255, 0.05),
    0 0 0 2px rgba(178, 102, 255, 0.3);
}

:is(.dark .form-email_input:focus) {
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.1),
    inset -1px -1px 3px rgba(255, 255, 255, 0.5),
    0 0 0 2px rgba(88, 28, 135, 0.3);
}

/* Send button — raised neumorphic */
.form-send_input {
  @apply relative px-6 py-2.5 font-medium rounded-full cursor-pointer overflow-hidden;
  background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
  color: #f5f5f5;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.4),
    -2px -2px 6px rgba(255, 255, 255, 0.05);
}

:is(.dark .form-send_input) {
  background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
  color: #1a1a1a;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.15),
    -2px -2px 6px rgba(255, 255, 255, 0.8);
}

/* Sending state — animated glow */
.form-send_input--sending {
  animation: fireGlowPressed 1.5s ease-in-out infinite;
}

@keyframes fireGlowPressed {
  0%, 100% {
    box-shadow:
      inset 3px 3px 6px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(88, 230, 217, 0.3),
      0 0 30px rgba(182, 62, 150, 0.15);
  }
  50% {
    box-shadow:
      inset 3px 3px 6px rgba(0, 0, 0, 0.5),
      0 0 25px rgba(182, 62, 150, 0.4),
      0 0 50px rgba(88, 230, 217, 0.25);
  }
}

/* Success state — button appearance change */
.form-send_input--success {
  cursor: default;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.4),
    -2px -2px 6px rgba(255, 255, 255, 0.05);
}

/* Animated text gradient during sending */
.form-send__text--sending {
  background: linear-gradient(90deg, #58e6d9, #b63e96, #58e6d9);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: primaryText 1.5s ease-in-out infinite;
}

/* Success check — SVG stroke animation */
.form-send__check {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: checkDraw 0.5s ease-out 0.2s forwards;
}

@keyframes checkDraw {
  to { stroke-dashoffset: 0; }
}
```

**State machine:** `idle` → `--sending` (glow + text gradient) → `--success` (check draw) → `idle`

**Key patterns demonstrated:**
- `:is(.dark ...)` for every state (base, hover, active, focus, sending)
- `@apply` mixed with raw CSS (layout utilities + custom shadows)
- Multiple `@keyframes` (`fireGlowPressed`, `primaryText`, `checkDraw`)
- BEM modifiers for interactive states (`--sending`, `--success`)
- SVG stroke animation (`stroke-dashoffset`) for success feedback
- Neumorphic design with inset/outset shadow layers

---

## 6. @apply Policy

### When @apply is ALLOWED

| Use Case | Example | Rationale |
|----------|---------|-----------|
| **Layout foundations** | `@apply flex items-center justify-between` | Concise, readable layout primitives |
| **Flex/grid compositions** | `@apply flex flex-col gap-4` | Common layout patterns |
| **Color themes with dark:** | `@apply text-dark dark:text-light` | Clean theme switching |
| **Background + border** | `@apply bg-light dark:bg-dark border border-dark dark:border-light` | Card styling patterns |
| **Spacing utilities** | `@apply px-4 py-2 mt-4` | Consistent spacing |
| **Responsive prefixes** | `@apply px-4 tablet:px-8 desktop:px-16` | Breakpoint-specific layout |
| **Opacity syntax** | `@apply text-dark/70 dark:text-light/70` | Readable transparency |
| **Typography base** | `@apply text-sm font-medium capitalize` | Text styling foundations |

### When @apply Should Be AVOIDED

| Use Case | Why | Use Instead |
|----------|-----|-------------|
| Complex multi-layer `box-shadow` | Too many values for a utility | Raw CSS property |
| `linear-gradient()` backgrounds | Non-standard values | Raw CSS property |
| `clip-path` shapes | Not a Tailwind utility | Raw CSS property |
| `mask-image` effects | Not a Tailwind utility | Raw CSS property |
| Complex `filter` chains | Multi-function values | Raw CSS property |
| `@keyframes` animation properties | Not composable via @apply | Raw CSS `animation:` |
| Pseudo-element `content:` | Requires `::before`/`::after` rules | Raw CSS rule |
| Nested selectors (`:is()`, `:has()`) | @apply cannot nest | Raw CSS with selectors |

### Rationale

`@apply` bridges Tailwind's utility-first approach with BEM-scoped component styles. It allows:

1. **Consistency** — Same design tokens (`bg-light`, `text-primary`) used everywhere
2. **Dark mode** — `dark:` prefix works within `@apply` seamlessly
3. **Responsive** — Breakpoint prefixes (`tablet:`, `desktop:`) compose naturally
4. **Readability** — Complex className strings move from JSX to CSS where they're easier to scan

### Current Usage Statistics

| File | @apply Count | Notes |
|------|-------------|-------|
| `src/app/styles.css` | ~47 | Home page blade layouts |
| `src/app/about/styles.css` | ~35 | About page sections |
| `src/app/articles/styles.css` | ~30 | Article listing layout |
| `src/app/projects/styles.css` | ~25 | Projects page layout |
| Component `styles.css` files | 5–15 each | Standard component styling |
| **Total across codebase** | **~585** | Across 83 CSS files |

### Top 5 Most Common @apply Patterns

1. **Flexbox layout** (~180 occurrences):
   ```css
   @apply flex items-center justify-between;
   ```

2. **Text color with dark mode** (~150 occurrences):
   ```css
   @apply text-dark dark:text-light;
   ```

3. **Background + border with dark mode** (~120 occurrences):
   ```css
   @apply bg-light dark:bg-dark border border-solid border-dark dark:border-light;
   ```

4. **Spacing utilities** (~140 occurrences):
   ```css
   @apply px-4 py-2 gap-2 mt-4;
   ```

5. **Positioning + sizing** (~90 occurrences):
   ```css
   @apply relative w-full;
   ```

---

## Global CSS Structure

| File | Lines | Purpose |
|------|-------|---------|
| `src/styles/globals.css` | 111 | Tailwind setup, body bg, `.layout` container, skip-link (WCAG 2.4.1), `.focus-ring` utility, page transition blocker |
| `src/styles/reduced-motion.css` | 22 | WCAG 2.2 AA reduced-motion media query (0.01ms trick) |
| `src/app/styles.css` | ~517 | Home page blade layouts, hero animations |

### globals.css Contents

1. **Tailwind directives** — `@tailwind base/components/utilities`
2. **Viewport minimum** — `.layout` container: min-width 320px, max-width 1024px, centered
3. **Body background** — `#f5f5f5` light, `#1b1b1b` dark (matches theme)
4. **Skip-link** — WCAG 2.4.1 keyboard navigation link (off-screen until focus)
5. **Focus-ring utility** — `@layer utilities` with accessible 3px outline
6. **Transition blocker** — `body.transition-active` blocks all input during page transitions (Story 13.6)

### reduced-motion.css Contents

WCAG 2.2 AA — Success Criterion 2.3.3. Uses `0.01ms` duration (not `0`) to ensure animations reach their final state:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Codebase Metrics Appendix

| Metric | Value |
|--------|-------|
| Total CSS files in `src/` | 83 |
| Components with co-located `styles.css` | 83 (100%) |
| Total `@apply` directives | ~585 |
| Files with `@keyframes` | 18 |
| Files with `::before`/`::after` | 5 |
| Files with `clip-path` | 2 |
| Files with `mask-image` | 1 |
| Files with `filter` effects | 8+ |
| CSS custom properties (`var()`) | 3 files (minimal usage) |
| Dark mode via `dark:` prefix | 20+ files |
| Dark mode via `:is(.dark ...)` | 9 files |
| Dark mode via `@media (prefers-color-scheme)` | 2 files (accessibility only) |

### CSS File Size Distribution by Layer

| Layer | Typical Lines | Largest File |
|-------|--------------|-------------|
| Atoms | 20–50 | AuthButton (~75 lines) |
| Molecules | 60–150 | Experience (~150 lines) |
| Organisms | 200–350 | ProjectCard (~350 lines) |
| Page styles | 300–500+ | `app/styles.css` (~517 lines) |

---

## Cross-References

- [`docs/architecture/folder-structure.md`](./folder-structure.md) — Component folder contents, `styles.css` placement
- [`docs/layout-system.md`](../layout-system.md) — Header zone visibility matrix per breakpoint
- `tailwind.config.js` — All 14 breakpoints, theme colors, brand colors
- `CLAUDE.md` — CSS Patterns, Breakpoint System, Theme Colors sections
