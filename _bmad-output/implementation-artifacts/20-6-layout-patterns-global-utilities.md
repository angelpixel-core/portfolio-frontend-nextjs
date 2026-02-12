# Story 20.6: Layout Patterns & Global Utilities Guide

Status: done

## Story

As a **developer working on the portfolio frontend**,
I want **a canonical guide documenting the current layout system, page composition patterns, responsive design rules, and global CSS utilities**,
so that **new layouts follow established patterns, container constraints are respected, and the blade-based architecture is understood**.

## Acceptance Criteria

1. Current layout system documented (globals.css analysis: `.layout` max-width 1024px, `#main-content` flex:1, skip-link, transition-active)
2. Every Layout evaluation matrix (adopt / skip / defer per primitive) with Tailwind equivalents
3. 5 page composition pattern examples with code (Home hero grid, About biography grid, Projects auto-fill grid, Articles list layout, Article detail prose column)
4. Tailwind equivalents for layout primitives (Stack ≈ `space-y-*`, Center ≈ `max-w-* mx-auto`, etc.)
5. Responsive design rules with breakpoint decision guide (layout-changing vs typography-only breakpoints)
6. `CLAUDE.md` updated with link to new document in Key Files Reference section

## Tasks / Subtasks

- [x] Task 1: Create `docs/architecture/layout-patterns.md` (AC: #1-5)
  - [x] Section 1: Global Layout System (AC: #1)
    - Document `.layout` container (max-width: 1024px, min-width: 320px, centered, flex-col, min-h-screen)
    - Document `#main-content` (flex: 1 — pushes footer to bottom)
    - Document `body` background (light #f5f5f5, dark #1b1b1b — fills behind max-width)
    - Document `RootLayout` component tree: html > body > RootProvider > .layout > skip-link + NavBar + main#main-content + Footer + Auth
    - Document `.skip-link` a11y pattern
    - Document `.transition-active` body state (pointer-events: none, cursor: wait)
    - Document `.focus-ring` utility (@layer utilities)
    - Document `MainContainer` HOC — legacy padding with DEPRECATED breakpoints (px-28 xl:p-24 lg:p-16 md:p-12 sm:p-8)
    - Note: Home page overrides MainContainer with `!important` — document as known debt
  - [x] Section 2: Layout Primitives — Every Layout (AC: #2, #4)
    - Stack: ADOPT — `.stack` utility class, 54+ codebase sites
    - Center: ADOPT — `.center` utility class, 5+ codebase sites
    - Cluster: ADOPT — `.cluster` utility class, 11+ codebase sites
    - Sidebar: ADOPT — `.sidebar` utility class with CSS custom properties, 4+ sites
    - Switcher: ADOPT — `.switcher` utility class, 6+ sites (AnimatedTitle, ExperienceStats, ArticleListItem)
    - Cover: ADOPT — `.cover` utility class, 5+ sites (hero blades, root layout)
    - Grid: ADOPT — `.grid-fluid` utility class with auto-fill minmax, 3+ sites
    - Recommendation: Adopt all 7 as semantic utility classes — naming behaviors, not just reducing code
    - Implementation deferred to future epic (Epic 20 is docs-only)
  - [x] Section 3: Page Composition Patterns (AC: #3)
    - Pattern 1: Home Hero Grid — 2-column grid at 640px+, `display: contents` trick, hero spans rows at 960px+
    - Pattern 2: About Biography Grid — 8-column grid at 640px+, asymmetric 5+3 split
    - Pattern 3: Projects Auto-fill Grid — `repeat(auto-fill, minmax(320px, 1fr))`, blade-pair pattern with featured+grid
    - Pattern 4: Articles List Layout — single-column with max-w-4xl mx-auto, sequential appearance animation
    - Pattern 5: Article Detail Prose — max-width: 800px centered, stagger animation, typographic scale
    - Include component tree for each pattern
    - Include CSS snippets from actual codebase
  - [x] Section 4: Blade-Based Architecture (AC: #3)
    - Define "blade" concept: viewport-aware section (min-h-screen on mobile, auto-height on tablet+)
    - Hero blade: title + primary content (featured item)
    - Grid blade: multi-column layout for non-featured items
    - List blade: single-column sequential content
    - Scroll snap: `scroll-snap-type: y mandatory` + `scroll-snap-align: start` on mobile
    - Document blade-pair pattern (featured project anchors blade, non-featured distributed across)
  - [x] Section 5: Responsive Design Rules (AC: #5)
    - Layout-changing breakpoints: 640px (grid activation), 720px (footer grid), 800px (nav swap), 880px (footer 3-col), 960px (hero swap)
    - Typography-only breakpoints: 400px (phablet +10%), 480px (mobile +25%)
    - Progressive spacing: gap and padding scale up at breakpoints (gap-4 → gap-6 → gap-8)
    - Decision guide: "Which breakpoint should I use for this change?"
    - min-height patterns: 100vh for globals, 100dvh for mobile blades (accounts for browser chrome)
    - No full-bleed: max-width 1024px constraint respected throughout
    - overflow-x-hidden on body and .layout
  - [x] Section 6: Spacing Patterns (AC: #3)
    - Gap scale: gap-1 (tight), gap-2 (component), gap-4 (medium), gap-6 (section), gap-8 (page-level)
    - Progressive scaling pattern: gap-4 mobile → gap-6 tablet → gap-8 desktop
    - MainContainer padding scale (legacy breakpoints — document as migration target)
    - NavBar padding: px-6 tablet:px-12 desktop:px-16 wide:px-32
    - No custom spacing tokens — relies on Tailwind default scale
  - [x] Section 7: Anti-patterns & Known Debt (AC: #1)
    - Anti-pattern: MainContainer legacy breakpoints (max-width) should migrate to semantic (min-width)
    - Anti-pattern: Home page `!important` overrides on MainContainer
    - Anti-pattern: Raw `@media (min-width: 720px)` instead of semantic breakpoint names
    - Anti-pattern: Mixed breakpoint systems in same component (legacy + semantic)
    - Known debt: MainContainer uses `inline-block` (should be block or flex)
    - Known debt: No container query usage (future opportunity)
    - Known debt: Ad-hoc spacing values in raw CSS (36+ occurrences bypass Tailwind scale)
- [x] Task 2: Update `CLAUDE.md` (AC: #6)
  - [x] Add `docs/architecture/layout-patterns.md` to Key Files Reference section
- [x] Task 3: Verify document quality (AC: #1-6)
  - [x] `npm run lint` — no regressions
  - [x] `npm run typecheck` — no regressions
  - [x] `npm test` — all tests pass (983 tests, 0 regressions)

## Dev Notes

### Tipo de Story

**DOCUMENTATION ONLY** — Esta story produce un documento markdown. NO hay cambios de codigo fuente, solo `docs/architecture/layout-patterns.md` + update a `CLAUDE.md`.

### Datos del Codebase (auditoria exhaustiva)

#### Global Layout System

| Element | CSS | Purpose |
|---------|-----|---------|
| `.layout` | `max-width: 1024px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; min-width: 320px` | Site-wide container, centered |
| `#main-content` | `flex: 1` | Pushes footer to bottom |
| `body` | `background-color: #f5f5f5` (dark: `#1b1b1b`) | Fills behind max-width |
| `.skip-link` | `position: absolute; top: -100%; z-index: 9999` → `:focus { top: 0 }` | WCAG 2.4.1 keyboard navigation |
| `body.transition-active` | `overflow: hidden; pointer-events: none; cursor: wait` | Blocks interaction during page transitions |
| `.focus-ring` | `@layer utilities { outline: 3px solid #0066cc; outline-offset: 2px }` | Reusable focus indicator |

#### RootLayout Component Tree (`src/app/layout.jsx`)

```
html[lang="en"]
└── body
    └── RootProvider
        └── div.layout.font-mont
            ├── a.skip-link (Skip to main content)
            ├── NavBar
            ├── main#main-content[tabIndex=-1]
            │   └── AnimatedChildren > {children}
            ├── Footer (dynamic import, ssr: true)
            └── Auth (dynamic import, ssr: false)
```

#### MainContainer HOC (`src/ui/atoms/hocs/MainContainer`)

```css
.main-container {
  @apply inline-block w-full h-full bg-light dark:bg-dark
  py-12 px-28 xl:p-24 lg:p-16 md:p-12 sm:p-8 z-0;
}
```

**DEPRECATED breakpoints**: Uses max-width legacy breakpoints (xl, lg, md, sm). Padding decreases as viewport shrinks:
- Default: py-12 px-28 (112px horizontal)
- xl (<1280px): p-24 (96px)
- lg (<1024px): p-16 (64px)
- md (<768px): p-12 (48px)
- sm (<640px): p-8 (32px)

**Known debt**: Home page overrides with `!important` to achieve viewport-height blades.

#### Page Composition Patterns (verified)

| Page | Layout Mechanism | Key CSS | Breakpoint |
|------|-----------------|---------|------------|
| Home | CSS Grid 2-col | `grid-template-columns: 1fr 1fr` + `display: contents` | 640px grid, 960px hero span |
| About | CSS Grid 8-col | `grid grid-cols-8 gap-8` (5+3 split) | 640px grid activation |
| Projects | Auto-fill grid | `repeat(auto-fill, minmax(320px, 1fr))` | Responsive from 1 → 2 → 3 cols |
| Articles | Single column list | `max-w-4xl mx-auto` | N/A (always single col) |
| Article detail | Prose column | `max-width: 800px; margin: 0 auto` | Responsive typography only |

#### Blade-Based Architecture (implicit pattern)

Projects and Articles pages use **blade pairs**:
- **Hero blade**: `min-h-screen` mobile, `scroll-snap-align: start`, contains title + featured item
- **Grid blade**: Auto-fill grid of non-featured items
- **List blade**: Single-column sequential content (articles list)

Mobile uses `scroll-snap-type: y mandatory` for blade-to-blade scrolling.

#### Responsive Breakpoint Usage Classification

| Breakpoint | Type | Layout Changes |
|------------|------|---------------|
| 400px (phablet) | Typography | Font size +10% |
| 480px (mobile) | Typography | Font size +25% |
| 640px (tablet) | **Layout** | Grid activation (Home, About, Footer), card layout changes |
| 720px | **Layout** | Footer 2-col grid, Auth button position |
| 800px (nav) | **Layout** | Hamburger → full nav, menu/logo visibility |
| 880px | **Layout** | Footer 3-col grid |
| 960px (stage) | **Layout** | Home hero layout swap (all-row span), Footer to flex |
| 1025px (desktop) | Spacing | Padding increases |
| 1441px (wide) | Spacing | Maximum padding (NavBar px-32) |

#### Gap Spacing Frequency (from codebase audit)

| Gap Value | Count | Typical Context |
|-----------|-------|----------------|
| `gap-2` (0.5rem) | 25 | Component-level (forms, social links, buttons) |
| `gap-4` (1rem) | 16 | Medium (chat, footer columns, floating blade) |
| `gap-8` (2rem) | 6 | Page-level (grids, about content) |
| `gap-6` (1.5rem) | 5 | Between gap-4 and gap-8 |
| `gap-1` (0.25rem) | 7 | Tight spacing (icon groups) |
| `gap-3`, `gap-5`, `gap-10` | 3-5 each | Occasional, context-specific |

#### Every Layout Primitives Assessment (UPDATED)

| Primitive | Utility Class | Decision | Codebase Sites |
|-----------|---------------|----------|----------------|
| Stack | `.stack` | **ADOPT** | 54+ (flex flex-col patterns across pages, organisms, molecules) |
| Center | `.center` | **ADOPT** | 5+ (.layout, articles list, prose column, hero images) |
| Cluster | `.cluster` | **ADOPT** | 11+ (WordCloud, TechnologyFilter, SkillSelector, tags, Chat) |
| Sidebar | `.sidebar` | **ADOPT** | 3+ (About 5+3 grid, featured ProjectCard, featured ArticleCard) — Grid-based |
| Switcher | `.switcher` | **ADOPT** | 7+ (ExperienceStats, ArticleListItem, AnimatedTitle, Footer, Home hero) |
| Cover | `.cover` | **ADOPT** | 5+ (root layout, hero blades, coming-soon page) — uses flex-1 principal |
| Grid | `.grid-fluid` | **ADOPT** | 1 (Projects grid only; Articles migrated to flex-col, Footer uses fixed templates) |

**Recommendation**: Adopt all 7 as semantic utility classes. The Tailwind properties already exist — the value is naming layout behaviors for instant readability and replicability. Implementation deferred to future epic.

#### CSS Grid Patterns Inventory

| Location | Pattern | Columns | Breakpoint |
|----------|---------|---------|------------|
| Home hero | `grid-template-columns: 1fr 1fr` | 2 fixed | 640px |
| About content | `grid grid-cols-8 gap-8` | 8 (5+3 split) | 640px |
| Projects grid | `repeat(auto-fill, minmax(320px, 1fr))` | Auto 1-3 | Always |
| Articles grid | `repeat(auto-fill, minmax(320px, 1fr))` | Auto 1-3 | Always |
| Footer | `grid-template-columns: 1fr 1fr` → `1fr auto 1fr` | 2 → 3 | 720px → 880px |
| ProjectCard (featured) | `grid-template-columns: 1fr 1fr` | 2 fixed | Desktop |
| ArticleCard (featured) | `grid-template-columns: 1fr 1fr` | 2 fixed | Desktop |

### Scope Boundaries — Que NO Hacer

| NO hacer | Razon |
|----------|-------|
| Crear clases CSS globales | Solo documentar patrones, implementacion es epic futuro |
| Migrar MainContainer breakpoints | Solo documentar como deuda, migracion es Epic 24 |
| Instalar Every Layout library | Solo evaluar, decision de adoptar 0 primitives |
| Tocar `src/` | Epic 20 es docs-only |
| Cambiar globals.css | Solo documentar estado actual |

### Previous Story Intelligence (Story 20.5)

- Story 20.5 creo `docs/architecture/import-rules.md` exitosamente
- Code review encontro 5 issues (1 HIGH, 2 MEDIUM, 2 LOW) — todos corregidos
- Key learning: organisms barrel count was off-by-one (19→20); siempre contar manualmente
- Key learning: agregar nota de metodologia cuando las metricas tienen definicion ambigua
- Key learning: footnotes para dual-purpose items (barrel + direct aliases)
- **Verificacion triple**: Todo dato citado en el documento debe ser verificable contra codebase real
- Pattern: cross-references a otros documentos del epic (folder-structure, styles-architecture, component-api, test-conventions, import-rules)

### Documentacion Existente a Referenciar

| Documento | Contenido Relevante |
|-----------|-------------------:|
| `docs/architecture/folder-structure.md` | Component folder structure (Story 20.1) |
| `docs/architecture/styles-architecture.md` | CSS patterns, BEM, breakpoints, @apply (Story 20.2) |
| `docs/architecture/component-api.md` | Component props patterns (Story 20.3) |
| `docs/architecture/test-conventions.md` | Test placement patterns (Story 20.4) |
| `docs/architecture/import-rules.md` | Import paths and barrel rules (Story 20.5) |
| `docs/layout-system.md` | Header zone visibility matrix per breakpoint |
| `CLAUDE.md` | Breakpoint system, responsive rules |
| `tailwind.config.js` | All breakpoints (6 legacy + 7 semantic) |
| `src/styles/globals.css` | Global layout rules |
| `src/ui/atoms/hocs/MainContainer/styles.css` | Container padding (legacy breakpoints) |
| `src/app/layout.jsx` | Root layout component tree |

### References

- [Source: epic-20-component-style-architecture.md#Story 20.6]
- [Source: src/styles/globals.css — layout container, skip-link, transition-active, focus-ring utility]
- [Source: src/app/layout.jsx — RootLayout component tree]
- [Source: src/ui/atoms/hocs/MainContainer/styles.css — legacy breakpoint padding]
- [Source: tailwind.config.js — 6 legacy (max-width) + 7 semantic (min-width) breakpoints]
- [Source: src/app/styles.css — Home hero grid layout]
- [Source: src/app/about/styles.css — About biography grid]
- [Source: src/app/projects/styles.css — Projects auto-fill grid, blade-pair pattern]
- [Source: src/app/articles/styles.css — Articles list layout]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A — documentation-only story, no debugging needed.

### Completion Notes List

- All 7 sections written covering global layout system (.layout container, #main-content flex:1, body background, RootLayout component tree, .skip-link a11y, .transition-active blocking, .focus-ring utility, MainContainer HOC with legacy breakpoints), Every Layout primitives (all 7 ADOPTED as semantic utility classes: Stack 54+ sites, Center 5+, Cluster 11+, Sidebar 4+, Switcher 6+, Cover 5+, Grid 3+ — with proposed CSS definitions and implementation plan), page composition patterns (5 patterns: Home hero 2-col grid with display:contents, About biography 8-col grid 5+3 split, Projects auto-fill grid with blade-pair, Articles single-column list, Article detail prose column), blade-based architecture (hero/grid/list blades, scroll-snap on mobile, blade-pair pattern), responsive design rules (5 layout-changing + 2 typography-only breakpoints, decision guide, min-height patterns, no full-bleed constraint), spacing patterns (gap scale gap-1→gap-8, progressive scaling, MainContainer legacy padding, NavBar padding, no custom tokens), anti-patterns & known debt (4 anti-patterns + 3 known debt items)
- **Section 2 updated**: Original evaluation recommended adopting 0 primitives. After discussion, changed to adopt all 7 — the value is naming layout behaviors for readability and replicability, not just reducing code repetition. Each primitive includes proposed utility class CSS, usage pattern, and mapped codebase sites verified against real CSS files
- Data sourced from exhaustive codebase audit: globals.css, layout.jsx, MainContainer/styles.css, app/styles.css, about/styles.css, projects/styles.css, articles/styles.css, tailwind.config.js
- Cross-references to all 5 previous epic-20 docs (folder-structure, styles-architecture, component-api, test-conventions, import-rules) plus layout-system.md, CLAUDE.md, tailwind.config.js
- CLAUDE.md Key Files Reference updated with layout-patterns.md entry
- Lint, typecheck, 983 tests — all passing, 0 regressions
- **Code review fixes (10 issues: 4H, 3M, 3L)**: H1 Sidebar redefined as Grid-based (codebase uses grid not flex-wrap), H2 Footer removed from Grid Fluid (uses fixed templates), H3 Articles removed from Grid Fluid (deprecated grid — Story 14.10), H4 overflow-x-hidden removed (neither body nor .layout has this), M1 !important count 7+→14, M2 ad-hoc spacing ~36→100+ with methodology note, M3 Switcher updated with 3 switching mechanisms (flex-direction, display-mode, layout-system), L1 Center removed `w-full` + added modifier note, L2 progressive gap added @media context note, L3 Cover changed from `my-auto` to `flex-1` principal

### File List

| Archivo | Accion | Estado |
|---------|--------|--------|
| `docs/architecture/layout-patterns.md` | CREAR | done |
| `CLAUDE.md` | MODIFICAR — agregar referencia en Key Files Reference | done |
