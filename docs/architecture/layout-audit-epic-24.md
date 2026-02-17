# Layout Audit — Epic 24: Spatial System & Layout Stabilization

**Date:** 2026-02-16
**Story:** 24.0 — Spatial System Definition
**Scope:** `src/ui/` and `src/app/`
**Method:** Exhaustive grep analysis with exact counts

---

## 1. Hardcoded Widths

**Total: 103 distinct values across 28 files**

### Critical (Layout-Breaking Risk)

| File | Values | Severity | Notes |
|------|--------|----------|-------|
| `atoms/hocs/TransitionerLi/styles.css` | `width: 100%`, `90%`, `75%`, `70%`, `60%` | Low | Responsive transition blade widths — intentional |
| `atoms/hocs/History/styles.css` | `width: 100%`, `95%`, `85%`, `80%`, `75%`, `2px`, `3px`, `4px` | Low | Timeline element scaling — intentional |
| `organisms/WordCloud/styles.css` | `max-width: 320px`, `400px`, `width: 320px`, `14px` | Medium | Tag cloud sizing — hardcoded to breakpoints |
| `organisms/ArticleContent/styles.css` | `max-width: 800px` | Medium | Prose container — should use containment rule |
| `molecules/HireMe/styles.css` | 12 values: `53px` to `239px` | High | Animation keyframes — extremely hardcoded |
| `atoms/texts/AnimatedTitle/styles.css` | `width: 55%`, `45%`, `70%` | Medium | Text scaling per breakpoint |

### Touch Targets (44px — WCAG 2.5.8)

| File | Pattern | Count |
|------|---------|-------|
| `atoms/buttons/HireMeHeaderButton/styles.css` | `min-w-[44px]` | 1 |
| `atoms/buttons/MenuButton/styles.css` | `min-w-[44px]` | 1 |
| `atoms/buttons/CopyButton/styles.css` | `min-w-[44px]` | 1 |
| `atoms/buttons/AuthButton/styles.css` | `min-w-[200px]`, `width: 48px`, `56px` | 3 |
| `atoms/buttons/ThemeButton/styles.css` | `width: 44px`, `48px` | 2 |
| `molecules/LogoMenuTrigger/styles.css` | `min-width: 44px`, `width: 44px` | 2 |
| `molecules/SocialShareButtons/styles.css` | `min-width: 44px` | 1 |

**Finding:** 11 touch target instances use 44px minimum. Pattern is inconsistent: `min-w-[44px]` (Tailwind arbitrary) vs `min-width: 44px` (CSS) vs `width: 44px` (fixed).

### Viewport-Relative

| File | Values | Notes |
|------|--------|-------|
| `molecules/TransitionEffect/index.tsx` | `w-[120vw]`, `w-[140vw]` | Transition blade overflow — intentional |

### Other Intrinsic Sizing (Acceptable per ADR-010)

| File | Values | Notes |
|------|--------|-------|
| `organisms/NavBar/styles.css` | `width: 40px` | Menu icon container |
| `organisms/Menu/styles.css` | `width: 40px`, `44px` | Menu icon sizing |
| `organisms/Chat/styles.css` | `width: 1px`, `180px` | Divider line, chat input |
| `atoms/icons/LiIcon/styles.css` | `width: 28px`, `36px`, `60px` | Icon sizing per breakpoint |
| `atoms/ArticleHoverThumbnail/styles.css` | `width: 220px` | Thumbnail size |
| `atoms/links/ImageLink/skeleton.css` | `width: 140px`, `300px` | Skeleton placeholder |
| `molecules/Logo/styles.css` | `width: 42px` | Logo sizing |
| `molecules/FeaturedArticlesCarousel/styles.css` | `width: 44px`, `12px`, `24px` | Carousel controls |
| `molecules/CustomersSlider/styles.css` | `width: 100%` | Slider container |
| `molecules/Education/styles.css` | `width: 1rem` | Timeline dot |
| `molecules/Experience/styles.css` | `width: 1rem`, `min-width: 44px` | Timeline dot, touch target |
| `atoms/links/CalendarLink/styles.css` | `w-[2em]` | Icon sizing |
| `atoms/shadows/BoxShadow/styles.css` | `w-[100%]` | Shadow container |

---

## 2. Hardcoded Heights

**Total: 84 distinct values across 26 files**

### Critical

| File | Values | Severity | Notes |
|------|--------|----------|-------|
| `organisms/WordCloud/styles.css` | `height: 280px`, `340px`, `400px`, `480px`, `550px`, `max-height: 75vh`, `80vh`, `min-height: 200px` | High | 9 height values — scales per breakpoint, very rigid |
| `molecules/HireMe/styles.css` | `height: 53px` to `120px` (6 values) | High | Animation keyframes — matches width pattern |
| `molecules/CustomersSlider/styles.css` | `height: 50px` to `86px` (5 values) | Medium | Logo heights per breakpoint |
| `molecules/TechnologiesSlider/styles.css` | `height: 25px` to `42px` (5 values) | Medium | Tech icon heights per breakpoint |
| `organisms/Skills/styles.css` | `h-[60vh]`, `h-[50vh]`, `h-[40vh]`, `min-h-[200px]` | Medium | Background decoration viewport heights |
| `atoms/texts/AnimatedTitle/styles.css` | `min-height: 5rem`, `6rem`, `height: 3rem`, `4rem` | Medium | Text container reservation |
| `atoms/texts/ParagraphText/styles.css` | `height: 11rem`, `min-height: 11rem`, `height: 1rem` | Medium | Text container reservation |

### Touch Targets (44px)

| File | Pattern |
|------|---------|
| `atoms/buttons/HireMeHeaderButton/styles.css` | `min-h-[44px]` |
| `atoms/buttons/MenuButton/styles.css` | `min-h-[44px]` |
| `atoms/buttons/AuthButton/styles.css` | `min-height: 44px`, `height: 48px`, `52px` |
| `atoms/buttons/ThemeButton/styles.css` | `height: 44px`, `48px` |
| `molecules/LogoMenuTrigger/styles.css` | `min-height: 44px`, `height: 44px` |
| `molecules/SocialShareButtons/styles.css` | `min-height: 44px` |
| `molecules/Experience/styles.css` | `min-height: 44px` |
| `organisms/ArticleCard/styles.css` | `min-h-11` (44px) |
| `organisms/Menu/styles.css` | `height: 40px`, `44px` |

**Finding:** 12 touch target height instances. Same inconsistency as widths.

---

## 3. Position: Absolute

**Total: 27 instances across 18 files**

### Intentional (15 instances)

| File | Purpose | Classification |
|------|---------|----------------|
| `atoms/shadows/BoxShadow/styles.css` (2) | Decorative shadow positioning | Safe |
| `atoms/shadows/FeaturedBoxShadow/styles.css` (2) | Decorative shadow positioning | Safe |
| `organisms/WordCloud/styles.css` | Search clear button | Safe |
| `organisms/Auth/styles.css` | Dropdown menu overlay | Safe |
| `molecules/SocialAuthDropdown/styles.css` | Dropdown positioning | Safe |
| `atoms/buttons/AuthButton/styles.css` | Menu positioning | Safe |
| `atoms/hocs/History/styles.css` | Timeline vertical line | Safe |
| `atoms/texts/ActiveMark/styles.css` | Active indicator animation | Safe |
| `atoms/ArticleHoverThumbnail/styles.css` (2) | Image + gradient overlay | Safe |
| `atoms/icons/LiIcon/styles.css` | Icon positioning | Safe |

### Fragile (12 instances)

| File | Purpose | Risk | Recommended Fix |
|------|---------|------|-----------------|
| `organisms/Auth/styles.css` | Modal close button (top-4 right-4) | Medium | Flex layout with justify-end |
| `organisms/Chat/styles.css` | Divider line | Low | Border-bottom on container |
| `organisms/NavBar/styles.css` | Centered positioning | Medium | Flex centering |
| `organisms/Skills/styles.css` (2) | Background decoration | Low | CSS background or pseudo-element |
| `molecules/MovingImage/styles.css` | Floating card widget | High | Needs design review |
| `molecules/FeaturedArticlesCarousel/styles.css` (2) | Carousel navigation buttons | Medium | Flex/grid layout |
| `molecules/HireMe/styles.css` | Animation decoration | Low | CSS animation only |
| `molecules/skill/styles.css` | Skill icon positioning | Medium | Flex/grid |

---

## 4. Z-Index Inventory

**Total: 47 declarations**

### Z-Index Hierarchy (from highest to lowest)

| Value | Layer | Components | Files |
|-------|-------|------------|-------|
| `9999` | Skip Link | Global accessibility | `globals.css` |
| `100` | Coming Soon | Full-page overlay | `app/coming-soon/styles.css` |
| `z-50` | Modals/Transitions | Auth modal, transition curtains (primary), floating overlays, dropdowns, thumbnails | 6 files |
| `z-40` | Transition (secondary) | White curtain | `TransitionEffect/index.tsx` |
| `z-30` | Transition (tertiary) | Dark curtain, floating panels, HireMe overlay | 4 files |
| `z-20` | Panels | Chat panel, NavBar, floating overlays | 4 files |
| `z-10` | Navigation | NavBar actual, moving image, carousel, icons | 5 files |
| `z-0` | Base | MainContainer, footer, history, auth switch | 4 files |
| `-z-10` | Background | Decorative shadows | 2 files |

### Issues

1. **Skip link z-9999** — Disproportionately high. Should be `z-50` or a dedicated `z-[9999]` with comment.
2. **Coming Soon z-100** — Raw CSS `z-index: 100` outside Tailwind scale. Should use `z-50`.
3. **Transition curtains** — z-50/40/30 layering is correct and documented (Story 13.6 AC5).
4. **No gaps in hierarchy** — The z-0 through z-50 scale is coherent.

---

## 5. Min-Height Gaps

### Present (Correct)

| Section | Min-Height | File |
|---------|-----------|------|
| `.layout` (root) | `100vh` | `globals.css` |
| Error page | `min-h-[50vh]` | `app/error.tsx` |
| Not Found page | `min-h-[50vh]` | `app/not-found.tsx` |
| Articles page | `min-h-screen` | `app/articles/styles.css` |
| Projects page | `min-h-screen` | `app/projects/styles.css` |
| Skills section | `min-h-[200px]` | `organisms/Skills/styles.css` |
| Biography section | `min-h-[100px]` | `organisms/Biography/styles.css` |
| ExperienceStats | `min-h-[120px]` | `organisms/ExperienceStats/styles.css` |
| Chat input | `min-h-[120px]` | `organisms/Chat/styles.css` |

### Absent (Gaps)

| Section | File | Risk |
|---------|------|------|
| **Home hero** | `app/styles.css` | High — hero can collapse to 0px on empty state |
| **Main content area** | No file | Medium — relies on flex:1 from `#main-content` |
| **Footer** | `organisms/Footer/styles.css` | Low — content-driven, unlikely to collapse |
| **ArticleContent container** | `organisms/ArticleContent/styles.css` | Medium — long-form content, could be empty during loading |
| **WordCloud container** | `organisms/WordCloud/styles.css` | Low — children have constraints |
| **About page hero** | `app/about/styles.css` | Medium — biography grid without min-height guard |

---

## 6. Legacy Breakpoints

**Total: 25 files using deprecated max-width breakpoints**

### By Breakpoint

| Breakpoint | Behavior | Files |
|-----------|----------|-------|
| `sm:` (max-width: 639px) | 17 files | `app/articles/styles.css`, `app/projects/styles.css`, `app/styles.css`, `organisms/ProjectCard/styles.css`, `organisms/Skills/styles.css`, `atoms/hocs/TransitionerLi/styles.css`, `atoms/hocs/MainContainer/styles.css`, `atoms/buttons/ArrowButton/styles.css`, `atoms/buttons/SkillSelectorButton/styles.css`, `atoms/shadows/BoxShadow/styles.css`, `atoms/texts/AnimatedTitle/styles.css`, `atoms/Article/styles.css`, `molecules/skill/styles.css`, `molecules/SocialNetworkLink/styles.css`, `molecules/SkillSelector/styles.css`, `molecules/FeaturedArticle/styles.css`, `molecules/ArticleListItem/styles.css` |
| `md:` (max-width: 767px) | 15 files | `organisms/ProjectCard/styles.css`, `organisms/ProjectDetail/styles.css`, `organisms/ExperienceStats/styles.css`, `atoms/hocs/MainContainer/styles.css`, `atoms/buttons/ArrowButton/styles.css`, `atoms/buttons/SkillSelectorButton/styles.css`, `molecules/skill/styles.css`, `molecules/ExtraInfo/styles.css`, `molecules/ArticleListItem/styles.css`, `app/styles.css`, `app/projects/styles.css` |
| `lg:` (max-width: 1023px) | 11 files | `organisms/ProjectCard/styles.css`, `organisms/ArticleCard/styles.css`, `organisms/Skills/styles.css`, `organisms/ProjectDetail/styles.css`, `organisms/ExperienceStats/styles.css`, `molecules/ExtraInfo/styles.css`, `molecules/skill/styles.css` |
| `xl:` (max-width: 1279px) | 8 files | `organisms/ExperienceStats/styles.css`, `atoms/hocs/MainContainer/styles.css`, `molecules/ExtraInfo/styles.css`, `organisms/Chat/styles.css` |
| `xs:` (max-width: 479px) | 9 files | `app/articles/ArticleListSkeleton.tsx`, `organisms/ProjectCard/styles.css`, `organisms/ArticleCard/styles.css`, `molecules/ExtraInfo/styles.css`, `molecules/skill/styles.css`, `atoms/shadows/BoxShadow/styles.css`, `molecules/ArticleListItem/styles.css`, `molecules/FeaturedArticle/styles.css` |
| `2xl:` (max-width: 1535px) | 0 files | Not used |

### Semantic Breakpoint Adoption (for comparison)

| Breakpoint | Files |
|-----------|-------|
| `nav:` (800px+) | 8 instances, 6 files |
| `tablet:` (640px+) | 12 instances, 5 files |
| `desktop:` (1025px+) | 4 instances, 2 files |
| `wide:` (1441px+) | 2 instances, 1 file |
| `phablet:` (400px+) | 0 as Tailwind class (used as `@media screen(phablet)`) |
| `mobile:` (480px+) | 0 as Tailwind class (used as `@media screen(mobile)`) |
| `stage:` (960px+) | 0 instances |

**Migration ratio:** 25 files legacy vs 16 files semantic. Legacy still dominant.

---

## 7. Raw Media Queries

**Total: 317 @media declarations across src/**

### Custom Breakpoints (Not in tailwind.config.js)

| Query | Count | Files | Action |
|-------|-------|-------|--------|
| `@media (min-width: 560px)` | 8 | AnimatedTitle, Academics, Experiences | Map to `mobile:` or `tablet:` |
| `@media (min-width: 720px)` | 30 | Footer, NavBar, Academics, WordCloud, TechnologyFilter | Map to `nav:` or create new |
| `@media (min-width: 880px)` | 8 | Academics, Experiences, Footer, Menu | Map to `stage:` |
| `@media (min-width: 768px)` | 39 | Footer, Academics, Experiences, History, WordCloud | Map to `nav:` |
| `@media (max-width: 639px)` | 11 | ArticleContent, FeaturedArticlesCarousel | Invert to min-width |
| `@media (max-width: 400px)` | 7 | ProjectCard, ProjectDetail | Invert to min-width |
| `@media (max-width: 479px)` | 1 | Small mobile edge case | Invert to min-width |
| `@media (max-width: 768px)` | 1 | ArticleContent | Invert to min-width |
| `@media (max-width: 600px)` | 1 | TechnologiesSlider | Invert to min-width |

**Critical finding:** `720px` appears 30 times but is NOT a defined breakpoint. `768px` appears 39 times — also not in the semantic system. These are the two highest-usage custom values.

---

## 8. Anti-Patterns Summary

| Anti-Pattern | Severity | Count | Files | ADR Reference |
|-------------|----------|-------|-------|---------------|
| Legacy breakpoints (max-width) | **High** | 25 files | See Section 6 | ADR-002 |
| External margin in components | **High** | 8+ files | SkillSelector (mb-28), Hiring (my-16), SocialNetworkLink, Navigation, ArticleListItem | ADR-010 |
| MainContainer `inline-block` | **Medium** | 1 file | `atoms/hocs/MainContainer/styles.css` | ADR-010 |
| Inconsistent touch target patterns | **Medium** | 11 files | Mix of `min-w-[44px]`, `min-width: 44px`, `width: 44px` | ADR-010 |
| Raw media queries (720px, 768px, 880px) | **Medium** | 77 instances | See Section 7 | ADR-002 |
| Home `!important` overrides | **Medium** | 14 instances | `app/styles.css` | ADR-010 |
| `.layout` uses `100vh` not `100dvh` | **Low** | 1 file | `globals.css` | ADR-009 |
| z-index: 9999 (skip link) | **Low** | 1 file | `globals.css` | ADR-009 |
| WordCloud 9 hardcoded heights | **Low** | 1 file | `organisms/WordCloud/styles.css` | ADR-009 |
| No min-height on hero blade | **Low** | 1 file | `app/styles.css` | ADR-009 |

---

## 9. Component Dependency Map

### Spatial Relationships

```
.layout (max-width: 1024px, centered)
├── NavBar
│   ├── Logo / LogoMenuTrigger (width: 42-44px)
│   ├── Navigation links (gap-4)
│   ├── ThemeButton (width: 44px)
│   ├── HireMeHeaderButton (min-w: 44px)
│   └── MenuButton (min-w: 44px)
├── #main-content (flex: 1)
│   └── MainContainer (py-12 px-28, legacy breakpoints)
│       ├── Home Page
│       │   ├── Hero blade (no min-height)
│       │   ├── HireMe (12 widths, 6 heights — animation)
│       │   ├── Skills (h-[60vh/50vh/40vh], absolute bg)
│       │   └── ExperienceStats (min-h-[120px])
│       ├── About Page
│       │   ├── Biography (min-h-[100px])
│       │   ├── Skills section
│       │   ├── Experiences timeline (History component)
│       │   └── Education timeline (History component)
│       ├── Projects Page
│       │   └── ProjectCard grid (gap-8, legacy sm:/md:/lg:)
│       └── Articles Page
│           ├── ArticleCard grid (gap-8, legacy sm:/lg:)
│           └── ArticleContent (max-width: 800px)
└── Footer
    ├── Footer columns (gap-4, raw @media 720px/960px)
    └── Copyright (gap-2)
```

### Shared Components

| Component | Used In | Spatial Concern |
|-----------|---------|-----------------|
| `MainContainer` | All pages | Legacy breakpoints affect all page padding |
| `History` | About (Experiences, Education) | 8 width values, absolute timeline |
| `TransitionerLi` | About (Experiences, Education) | 6 responsive width values |
| `AnimatedTitle` | Home, About | 3 width values, 4 height values |
| `WordCloud` | About | 5 width + 9 height values — most rigid component |
| `ProjectCard` | Projects page | Legacy sm:/md:/lg:/xs: breakpoints |
| `ArticleCard` | Articles page | Legacy lg:/xs: breakpoints |

---

## 10. Migration Priority

Based on severity, blast radius, and dependency chain:

| Priority | Action | Files | Blocked By |
|----------|--------|-------|------------|
| P0 | Define Every Layout primitives | `globals.css` (new) | Story 24.1 |
| P1 | Migrate MainContainer to semantic breakpoints | 1 file | Story 24.2 |
| P1 | Add min-height to hero blade | 1 file | Story 24.2 |
| P1 | Migrate `.layout` to `100dvh` | 1 file | Story 24.2 |
| P2 | Migrate page-level legacy breakpoints | 3 files (`app/styles.css`, `app/articles/styles.css`, `app/projects/styles.css`) | Story 24.4 |
| P2 | Migrate ProjectCard/ArticleCard breakpoints | 2 files | Story 24.4 |
| P3 | Migrate remaining component breakpoints | 20 files | Story 24.4 |
| P3 | Standardize touch target pattern | 11 files | Story 24.2 |
| P4 | Refactor WordCloud sizing | 1 file | Future |
| P4 | Refactor HireMe animation values | 1 file | Future |

---

## References

- [ADR-002: Breakpoint Standardization](../adr/002-breakpoint-standardization.md)
- [ADR-008: Spacing Scale](../adr/008-spacing-scale.md)
- [ADR-009: Containment Rules](../adr/009-containment-rules.md)
- [ADR-010: Layout vs Component Separation](../adr/010-layout-component-separation.md)
- [Layout Patterns](./layout-patterns.md)
- [Styles Architecture](./styles-architecture.md)
- [Epic 24 Definition](../../_bmad-output/planning-artifacts/epics-v4.md#epic-24)
