# Story 20.2: Styles Architecture

Status: review

## Story

As a **developer working on the portfolio frontend**,
I want **a canonical styles architecture guide defining when and how to use component CSS, Tailwind, BEM, dark mode, and breakpoints**,
so that **all new styling decisions are consistent, maintainable, and aligned with the existing codebase patterns**.

## Acceptance Criteria

1. Decision flowchart: "Where should this style live?" — covering component `styles.css`, Tailwind-only, global CSS, and `@apply` usage
2. BEM naming guide with 5+ real examples from the codebase and valid/invalid patterns
3. Dark mode pattern guide with `:is(.dark ...)` and Tailwind `dark:` usage, including before/after examples
4. Breakpoint reference table listing all 14 breakpoints (6 deprecated + 8 semantic) with status, pixel values, and usage notes
5. At least 3 component examples showing correct style placement (Tailwind-only atom, BEM molecule, complex organism)
6. `@apply` policy with rationale: when acceptable, when to use raw CSS
7. `CLAUDE.md` updated with link to new document in Key Files Reference section

## Tasks / Subtasks

- [x] Task 1: Create `docs/architecture/styles-architecture.md` (AC: #1-6)
  - [x] Section 1: Style Placement Decision Framework (AC: #1)
    - Flowchart: component complexity → Tailwind-only vs co-located styles.css
    - Rules: > 5 utilities → styles.css; animations/pseudo-elements/clip-path → always styles.css
    - Rules: < 5 utilities, no pseudo-elements → Tailwind-only
    - Global CSS rules: what belongs in globals.css vs component CSS
    - No CSS Modules policy with rationale
  - [x] Section 2: BEM Naming Convention (AC: #2)
    - Format: `.block__element--modifier` with real examples
    - 5+ examples from existing components (ArticleCard, ProjectCard, Experience, AuthButton, TechnologiesSlider)
    - Valid/invalid naming table
    - Block name derivation: PascalCase component → kebab-case CSS block
    - State modifiers: `--active`, `--disabled`, `--touched`, `--expanded`, `--loading`, `--error`
    - Historical exceptions: NavBar uses `.layout_*` prefix (documented)
  - [x] Section 3: Dark Mode Pattern Guide (AC: #3)
    - Pattern 1: Tailwind `dark:` prefix for simple properties (bg, text, border)
    - Pattern 2: `:is(.dark .selector)` for complex rules (gradients, shadows, filters)
    - Pattern 3: `@media (prefers-color-scheme: dark)` for accessibility only (skip-link)
    - Before/after examples with real code
    - Color reference: dark=#1b1b1b, light=#f5f5f5, primary=#B63E96, primaryDark=#58E6D9
  - [x] Section 4: Breakpoint Reference Table (AC: #4)
    - All 14 breakpoints: 6 legacy (deprecated, max-width) + 8 semantic (active, min-width)
    - Status column: ACTIVE / DEPRECATED
    - Pixel values, CSS media query, usage description
    - Progressive typography rules: phablet (+10%), mobile (+25%)
    - Cross-reference: ADR-002, Story 14.15, docs/layout-system.md
    - Migration guidance: legacy → semantic
  - [x] Section 5: Component Style Examples (AC: #5)
    - Example 1: Tailwind-only atom (simple component, < 5 utilities)
    - Example 2: BEM molecule with styles.css (moderate complexity)
    - Example 3: Complex organism with animations, pseudo-elements, dark mode
  - [x] Section 6: @apply Policy (AC: #6)
    - ALLOWED: layout foundations, flex/grid compositions, color themes, responsive utilities
    - AVOID: complex animations, pseudo-element positioning, nested selectors
    - Rationale: @apply bridges Tailwind utilities with BEM-scoped styles
    - Current usage: 585 @apply directives across 83 CSS files
- [x] Task 2: Update `CLAUDE.md` (AC: #7)
  - [x] Add `docs/architecture/styles-architecture.md` to Key Files Reference section
- [x] Task 3: Verify document quality (AC: #1-7)
  - [x] `npm run lint` — no regressions
  - [x] `npm run typecheck` — no regressions
  - [x] `npm test` — all tests pass (no code changes, but verify)

## Dev Notes

### Tipo de Story

**DOCUMENTATION ONLY** — Esta story produce un documento markdown. NO hay cambios de codigo fuente, solo `docs/architecture/styles-architecture.md` + update a `CLAUDE.md`.

### Datos del Codebase (auditoria exhaustiva)

#### CSS File Statistics

| Metrica | Valor |
|---------|-------|
| Total CSS files en src/ | 83 |
| Components con co-located styles.css | 83 (100%) |
| Total @apply directives | 585 |
| Archivos con @keyframes | 18 |
| Archivos con ::before/::after | 5 |
| Archivos con clip-path | 2 |
| Archivos con mask-image | 1 |
| Archivos con filter effects | 8+ |
| CSS custom properties (var) | 3 archivos (uso minimo) |

#### CSS File Size Distribution

| Layer | Lineas tipicas | Ejemplo mas grande |
|-------|---------------|-------------------|
| Atoms | 20-50 lineas | AuthButton (~75 lines) |
| Molecules | 60-150 lineas | Experience (~150 lines) |
| Organisms | 200-350 lineas | ProjectCard (~350 lines) |
| Page styles | 300-500 lineas | app/styles.css (~517 lines) |

#### BEM Naming Patterns (datos reales)

| Componente | Patron CSS | Ejemplo |
|------------|-----------|---------|
| ArticleCard | `.article-card__*--*` | `.article-card__meta`, `.article-card--featured` |
| ProjectCard | `.project-card__*--*` | `.project-card__actions`, `.project-card--grid` |
| Experience | `.experience_*--*` | `.experience_title`, `.experience_toggle-inline--expanded` |
| AuthButton | `.auth_button__*--*` | `.auth_button__initials`, `.auth_button--disabled` |
| TechnologiesSlider | `.technologies-slider__*` | `.technologies-slider__icon` |
| NavBar | `.layout_*` | `.layout_navbar-container` (exception: layout-level prefix) |
| Footer | `.copyright_*` | `.copyright_text` (exception: semantic prefix) |

**Consistencia BEM**: ~70% sigue el patron exacto. Excepciones documentadas: NavBar usa `.layout_*`, Footer usa `.copyright_*`.

**Separadores observados**: Mezcla de `__` (doble underscore) y `_` (single underscore) para elementos. El estandar debe formalizar `__` como el separador canonico.

#### Dark Mode Patterns (datos reales)

| Patron | Archivos | Uso |
|--------|----------|-----|
| Tailwind `dark:` prefix | 20+ archivos | Propiedades simples (bg, text, border) |
| `:is(.dark .selector)` | 9 archivos | Gradientes, sombras, filtros complejos |
| `@media (prefers-color-scheme)` | 2 archivos | Solo accesibilidad (skip-link, reduced-motion) |

**Colores del tema** (de tailwind.config.js):
- dark: `#1b1b1b` / light: `#f5f5f5`
- primary: `#B63E96` / primaryDark: `#58E6D9`
- Brand colors: linkedin, github, twitter, telegram, whatsapp, calendly, dribbble

#### Breakpoint System (datos reales)

| Tipo | Occurrencias | Archivos | Status |
|------|-------------|----------|--------|
| Legacy (sm:, md:, lg:, xl:, 2xl:, xs:) | 67 | 24 | DEPRECATED |
| Semantic (phablet:, mobile:, tablet:, nav:, stage:, desktop:, wide:) | 38+ | 13 | ACTIVE |
| `@media screen(mobile)` | 56 | 20 | ACTIVE |
| `@media screen(phablet)` | 8 | 4 | ACTIVE |
| Progressive typography components | — | 20 | Adopted |

**Ratio actual**: 65% legacy / 35% semantic. Migracion en curso.

**ADR-002 (Story 14.15)**: 63 magic number breakpoints formalizados como `phablet:` (400px) y `mobile:` (480px). Todos los nuevos archivos deben usar breakpoints semanticos.

#### @apply Usage Patterns

**Top files por @apply count**:
1. `src/app/styles.css` — 47 directives
2. `src/app/about/styles.css` — 35+ directives
3. `src/app/articles/styles.css` — 30+ directives
4. `src/app/projects/styles.css` — 25+ directives
5. Component files — 5-15 directives cada uno

**Patrones comunes de @apply**:
- Layout foundations: `@apply flex items-center justify-between w-full`
- Color themes: `@apply bg-light dark:bg-dark text-dark dark:text-light`
- Spacing con breakpoints: `@apply px-6 tablet:px-12 desktop:px-16 wide:px-32`
- Opacity syntax: `@apply text-dark/70 dark:text-light/70`

**@apply NO se usa para**: animaciones complejas, pseudo-elementos, nested selectors.

#### Global CSS Structure

| Archivo | Lineas | Proposito |
|---------|--------|-----------|
| `src/styles/globals.css` | 111 | Tailwind setup, body bg, skip-link, focus-ring utility, transition blocker |
| `src/styles/reduced-motion.css` | 22 | WCAG 2.2 reduced motion media query |
| `src/app/styles.css` | 517 | Home page blades, hero layout, animations |

**globals.css contiene**:
- `@tailwind base/components/utilities`
- `.layout` container (min-width: 320px, max-width: 1024px)
- Skip-link accessibility (WCAG 2.4.1)
- `.focus-ring` utility en `@layer utilities`
- `body.transition-active` blocker

#### Components Requiring Co-located CSS (justificacion)

Estos componentes usan features que NO se pueden expresar con Tailwind solo:

| Componente | Feature | Detalle |
|------------|---------|---------|
| AuthButton | clip-path | Polygono custom (heptagono) |
| app/styles.css | @keyframes | animateLigthning, animate (rain) |
| Experience | @keyframes | slideDown (details expansion) |
| TechnologiesSlider | mask-image | Fade edges con gradient lineal |
| TechnologiesSlider | @keyframes | technologies-slider-scroll (infinite) |
| Logo | @keyframes | logo-gradient-cycle (hover) |
| Hero | @keyframes | hero-fade-in (image load) |
| FeaturedArticlesCarousel | ::before | Dot touch target expansion |

### Documentacion Existente a Referenciar

| Documento | Contenido Relevante |
|-----------|-------------------|
| `docs/architecture/folder-structure.md` | Component folder contents, styles.css placement (Story 20.1) |
| `docs/adr/ADR-002.md` | Breakpoint standardization decision, legacy migration |
| `docs/layout-system.md` | Header zone visibility matrix per breakpoint |
| `CLAUDE.md` | CSS Patterns section, Breakpoint System, Theme Colors |
| `tailwind.config.js` | All 14 breakpoints (6 deprecated + 8 semantic), theme colors, brand colors |

### Scope Boundaries — Que NO Hacer

| NO hacer | Razon |
|----------|-------|
| Migrar legacy breakpoints | Solo documentar reglas, migracion es epic futuro |
| Crear utilities CSS nuevas | Solo documentar que deberian existir |
| Refactorizar BEM inconsistente | Solo documentar el estandar correcto |
| Modificar tailwind.config.js | Solo documentar configuracion existente |
| Tocar `src/` | Epic 20 es docs-only |

### Previous Story Intelligence (Story 20.1)

- Story 20.1 creó `docs/architecture/folder-structure.md` exitosamente
- Code review encontró 8 issues (5 MEDIUM, 3 LOW) — todos corregidos
- Key learning: verificar datos contra codebase real (el review encontró `src/config/` documentado como existente pero inexistente)
- Pattern: documentar excepciones históricas explícitamente con ⚠️ markers
- Misplacements se documentan pero NO se corrigen (corrección es epic futuro)

### References

- [Source: _bmad-output/implementation-artifacts/epic-20-component-style-architecture.md#Story 20.2]
- [Source: docs/architecture/folder-structure.md — component folder contents, styles.css placement]
- [Source: docs/adr/ADR-002.md — breakpoint standardization decision]
- [Source: docs/layout-system.md — header zone visibility matrix]
- [Source: tailwind.config.js — all breakpoints, theme colors]
- [Source: CLAUDE.md — CSS Patterns, Breakpoint System sections]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

N/A — documentation-only story, no debugging needed.

### Completion Notes List

- All 6 sections written covering style placement framework, BEM naming (5 real examples + valid/invalid table + historical exceptions), dark mode (3 patterns with real code), breakpoint reference (14 breakpoints with migration guidance), 3 component examples (BaseLink atom, Experience molecule, Chat organism), and @apply policy with top 5 patterns
- Data sourced from exhaustive codebase audit: 83 CSS files, 585 @apply directives, 18 @keyframes files, 5 pseudo-element files
- ADR-002 referenced in tailwind.config.js comments but file does not exist as separate document — documented inline reference instead
- Codebase Metrics Appendix and Global CSS Structure sections added beyond minimum AC scope for completeness
- Cross-references to folder-structure.md, layout-system.md, tailwind.config.js, CLAUDE.md
- Lint, typecheck, 983 tests — all passing, 0 regressions

### File List

| Archivo | Accion | Estado |
|---------|--------|--------|
| `docs/architecture/styles-architecture.md` | CREAR | done |
| `CLAUDE.md` | MODIFICAR — agregar referencia en Key Files Reference | done |
