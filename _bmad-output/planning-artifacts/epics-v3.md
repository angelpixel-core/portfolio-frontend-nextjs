---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/epics-v2.md
  - _bmad-output/implementation-artifacts/sprint-status.yaml
  - _bmad-output/implementation-artifacts/epic-20-retro-2026-02-11.md
---

# portfolio-frontend-nextjs - Epic Breakdown (v3: Post-Epic 20)

## Overview

Este documento proporciona el desglose de epics y stories para la fase POST-MVP del portfolio-frontend-nextjs. Los Epics 1-20 cubrieron todos los FRs originales (FR1-33) del PRD. Los nuevos epics (21+) cubren Growth Phase, Vision Phase, deuda tecnica pendiente, y mejoras de arquitectura identificadas en Epic 20.

## Requirements Inventory

### Functional Requirements (Original PRD — ALL IMPLEMENTED)

> **Estado:** FR1-33 completamente implementados en Epics 1-20.

| FR | Descripcion | Epic que lo implemento |
|----|-------------|----------------------|
| FR1 | Visitor can view developer profile summary on homepage | Epic 1 |
| FR2 | Visitor can see technology stack and skills | Epic 1 |
| FR3 | Visitor can read professional bio and background | Epic 1 |
| FR4 | Visitor can access social/professional links | Epic 1 |
| FR5 | Visitor can browse list of featured projects | Epic 2 |
| FR6 | Visitor can view detailed project information | Epic 2 |
| FR7 | Visitor can access live demo links for projects | Epic 2 |
| FR8 | Visitor can access source code repositories | Epic 2 |
| FR9 | Visitor can filter/categorize projects by technology | Epic 2 |
| FR10 | Visitor can view professional work history timeline | Epic 3 |
| FR11 | Visitor can see role details and responsibilities | Epic 3 |
| FR12 | Visitor can view academic background | Epic 3 |
| FR13 | Visitor can see certifications or achievements | Epic 3 |
| FR14 | Visitor can browse published articles | Epic 4 |
| FR15 | Visitor can read full article content | Epic 4 |
| FR16 | Visitor can share articles via social links | Epic 4 |
| FR17 | Search engines can index public content (SEO) | Epic 4 |
| FR18 | Visitor can access email contact | Epic 5 |
| FR19 | Visitor can access WhatsApp contact | Epic 5 |
| FR20 | Visitor can schedule meeting via Calendly | Epic 5 |
| FR21 | Visitor can interact with chat panel UI | Epic 5 |
| FR22 | Visitor can copy contact information to clipboard | Epic 5 |
| FR23 | Visitor can toggle light/dark theme | Epic 1 |
| FR24 | Visitor can navigate site on any device (responsive) | Epic 1, 11, 12 |
| FR25 | Visitor can use keyboard navigation throughout | Epic 1 |
| FR26 | Visitor can consume content with screen reader | Epic 1 |
| FR27 | Visitor experiences reduced motion when preferred | Epic 1, 13 |
| FR28 | Owner can update project information via CMS/repo | Epic 6 |
| FR29 | Owner can publish new articles | Epic 6 |
| FR30 | Owner can preview changes before deploy | Epic 6 |
| FR31 | Owner can deploy updates with single command | Epic 6 |
| FR32 | CI pipeline runs automated accessibility audits | Epic 7 |
| FR33 | E2E tests use resilient selectors (data-testid) | Epic 7 |

### Non-Functional Requirements (PRD — Status)

**Performance (Parcialmente cubierto):**
- NFR-P1: Lighthouse Performance ≥90 — ✅ Epic 6, 18
- NFR-P2: LCP <2.5s — ✅ Epic 18
- NFR-P3: FID <100ms — ✅ Inherente al stack
- NFR-P4: CLS <0.1 — ✅ Epic 10, 18
- NFR-P5: TTI <3.8s — ✅ Epic 18
- NFR-P6: First Load JS <100KB — ⚠️ Cercano pero no enforced
- NFR-P7: Total Bundle <200KB gzipped — ⚠️ Cercano pero no enforced

**Security (Parcialmente cubierto):**
- NFR-S1: HTTPS obligatorio — ✅ Vercel default
- NFR-S2: JWT con Rodauth, HttpOnly cookies — ⚠️ localStorage actual, HttpOnly pendiente (requiere Rails)
- NFR-S3: CORS configurado — ⏳ Requiere Rails backend
- NFR-S4: npm audit sin vulnerabilidades criticas — ⚠️ peer-deps con --legacy-peer-deps
- NFR-S5: Secrets en Vercel, nunca en codigo — ✅ Epic 19

**Accessibility (Cubierto):**
- NFR-A1: WCAG 2.2 Level AA — ✅ Epic 1, 7, 8
- NFR-A2: Lighthouse Accessibility ≥95 — ✅ Epic 6
- NFR-A3: Keyboard Navigation 100% — ✅ Epic 1
- NFR-A4: Screen Reader compatible — ✅ Epic 1
- NFR-A5: Color Contrast 4.5:1 — ✅ Epic 10
- NFR-A6: Focus Visible en todos los interactivos — ✅ Epic 1
- NFR-A7: prefers-reduced-motion respetado — ✅ Epic 13
- NFR-A8: Alt text en todas las imagenes — ✅ Epic 1

**Integration (Parcialmente cubierto):**
- NFR-I1: Rails API timeout <5s, retry, fallback — ⏳ Requiere Rails backend
- NFR-I2: MSW Mocks desarrollo funcional — ✅ Mock mode implementado
- NFR-I3: Calendly embed funcional — ✅ Epic 5
- NFR-I4: rel="noopener noreferrer" en links externos — ✅ Implementado

**Reliability (Parcialmente cubierto):**
- NFR-R1: 99.9% uptime — ✅ Vercel SLA
- NFR-R2: Zero downtime deploy — ✅ Vercel default
- NFR-R3: Error Boundary graceful degradation — ✅ Epic 19
- NFR-R4: Contenido estatico cacheable (Service Worker) — ⏳ Growth phase

### New Requirements: Growth Phase (PRD — NOT YET IMPLEMENTED)

- GR1: Microinteracciones y polish UX avanzado
- GR2: Test coverage 80%+ (actualmente ~60-70% estimado)
- GR3: Storybook documentacion completa de componentes
- GR4: Error handling exhaustivo (edge cases)
- GR5: Performance optimization avanzada (Service Worker, offline cache)

### New Requirements: Vision Phase (PRD — FUTURE)

- VR1: Design system exportable como package npm
- VR2: Developer View mode (mostrar codigo/arquitectura en vivo)
- VR3: i18n multi-idioma (ES/EN minimo)
- VR4: Metricas visibles como prueba de calidad (badges, dashboards)
- VR5: Live chat integration (WebSocket con backend)

### Additional Requirements from Architecture

**TypeScript Migration (pendiente de completar):**
- AR1: ~170 archivos .js/.jsx pendientes de migracion a .ts/.tsx (Story 20.7 plan)
- AR2: TypeScript strict mode ya habilitado, zero `any` como objetivo

**Technical Debt (de retrospectivas Epic 15-20):**
- TD1: --legacy-peer-deps obligatorio — resolver peer dependency conflicts
- TD2: localStorage → httpOnly cookies para auth tokens (requiere Rails)
- TD3: Logging consolidation para Server Actions
- TD4: Barrel file cleanup — eliminar barrels innecesarios para tree-shaking
- TD5: Breakpoint migration — eliminar legacy inverted breakpoints (sm:, md:, lg:)

**Documentation Debt (detectado post-Epic 20):**
- DD1: `docs/component-inventory.md` desactualizado desde 2026-02-08 — faltan 6+ componentes de Epics 14-15 (ProjectCard, ArticleCard, Auth, NeumorphicToggle, etc.). Refresh necesario.
- DD2: `docs/data-models.md` desactualizado — schema de Article omitido, extensiones .js cuando ya son .ts. Se resuelve parcialmente con Epic 22 (TS Migration), pero schema faltante requiere fix independiente.

**Epic 20 Future Epic Candidates:**
- EC1: Epic 21 - Storybook Setup (bajo urgencia, alto riesgo)
- EC2: Epic 22 - TS Migration Execution (~170 archivos, alto impacto, medio riesgo)
- EC3: Epic 23 - Barrel File Cleanup (medio impacto, bajo riesgo)
- EC4: Epic 24 - Breakpoint Migration + Every Layout (medio impacto, medio riesgo)

### FR Coverage Map

**Post-MVP Requirements → Epic Mapping:**

| Requirement | Epic | Descripcion |
|-------------|------|-------------|
| GR3 | Epic 21 | Storybook documentacion completa |
| EC1 | Epic 21 | Storybook Setup |
| AR1, AR2 | Epic 22 | TypeScript migration execution |
| TD4 | Epic 23 | Barrel file cleanup |
| TD5 | Epic 24 | Breakpoint migration + Every Layout utilities |
| GR1 | Future | Microinteracciones y polish UX |
| GR2 | Future | Test coverage 80%+ |
| GR4 | Future | Error handling exhaustivo |
| GR5 | Future | Performance optimization (Service Worker) |
| VR1-VR5 | Future | Vision phase requirements |
| TD1-TD3 | Backlog | Deuda tecnica (requiere Rails backend o decision) |
| DD1 | Backlog | Refresh `docs/component-inventory.md` (stale desde 2026-02-08) |
| DD2 | Backlog | Fix `docs/data-models.md` (schema Article + extensiones .js→.ts) |

## Epic List

### Epic 21: Storybook — Documentacion Visual de Componentes
El desarrollador puede explorar, probar y documentar visualmente todos los componentes del portfolio en aislamiento, verificando variantes, estados, temas y responsividad.
**Requerimientos cubiertos:** GR3, EC1

### Epic 22: TypeScript Migration Execution (Pendiente de creacion)
Completar la migracion de ~170 archivos JS/JSX a TS/TSX siguiendo el plan de Story 20.7.
**Requerimientos cubiertos:** AR1, AR2

### Epic 23: Barrel File Cleanup (Pendiente de creacion)
Eliminar barrel files innecesarios para mejorar tree-shaking y reducir bundle size.
**Requerimientos cubiertos:** TD4

### Epic 24: Breakpoint Migration + Every Layout (Pendiente de creacion)
Migrar breakpoints legacy invertidos a sistema semantico y implementar Every Layout utilities.
**Requerimientos cubiertos:** TD5

---

## Epic 21: Storybook — Documentacion Visual de Componentes

El desarrollador puede explorar, probar y documentar visualmente todos los componentes del portfolio en aislamiento, verificando variantes, estados, temas y responsividad.

**Requerimientos cubiertos:** GR3 (Storybook documentacion completa), EC1 (Storybook Setup)

**Inventario de componentes:** 181 total (123 atoms, 30 molecules, 21 organisms, 2 overlays, 2 shared). Cobertura target de este epic: ~108 componentes (~60%).

**Consideraciones tecnicas (riesgo ALTO):**
- Tailwind custom breakpoints (phablet, mobile, nav, stage, etc.)
- Framer Motion + LazyMotion provider (`m.*` components)
- Redux state (~10 componentes dependen de slices)
- Mixed JS/TS (126 JSX + 55 TSX)
- BEM + Tailwind (styles.css con `@apply` necesita PostCSS)
- Icons barrel (58 icons, importar por path directo)

### Story 21.1: Storybook Infrastructure & Tailwind Integration

As a **developer**,
I want **Storybook installed and configured with Tailwind CSS, custom breakpoints, and dark mode toggle**,
So that **I can run `npm run storybook` and see components rendered with the project's real styles**.

**Acceptance Criteria:**

**Given** the project has no Storybook installed
**When** I run `npm run storybook`
**Then** Storybook 8 launches on a configured port with the project's Tailwind styles applied
**And** the sidebar shows the project name "portfolio-frontend-nextjs"

**Given** Storybook is running
**When** I view any component that uses Tailwind classes or `styles.css` with `@apply`
**Then** all styles render correctly including BEM classes and Tailwind utilities
**And** PostCSS processes `@apply` directives from component `styles.css` files

**Given** Storybook is running
**When** I use the viewport addon toolbar
**Then** I can select presets matching the project's semantic breakpoints: phablet (400px), mobile (480px), tablet (640px), nav (800px), stage (960px), desktop (1025px), wide (1441px)

**Given** Storybook is running
**When** I toggle the dark mode control in the toolbar
**Then** the `.dark` class is applied to the preview container
**And** components using `dark:` Tailwind prefix and `:is(.dark .selector)` patterns render correctly

**Given** the Storybook infrastructure is complete
**When** I run `npm run build-storybook`
**Then** a static build generates without errors in `storybook-static/`

**Given** `.gitignore` exists
**When** Story 21.1 is complete
**Then** `storybook-static/` is added to `.gitignore`

---

### Story 21.2: Provider Decorators (Redux, React Query, Framer Motion)

As a **developer**,
I want **global Storybook decorators that wrap components with the same providers as the real app**,
So that **components depending on Redux, React Query, or Framer Motion render correctly in stories**.

**Acceptance Criteria:**

**Given** a component uses `useAppSelector` or `useAppDispatch` (e.g., ThemeButton, ChatButton)
**When** its story renders in Storybook
**Then** the component has access to a pre-configured Redux store with all slices (themeMode, menuPanel, chatPanel)
**And** the story can override initial Redux state via story-level args

**Given** a component uses React Query hooks (e.g., `useProjects`, `useArticles`)
**When** its story renders in Storybook
**Then** a QueryClientProvider wraps the component
**And** mock data from existing `domains/*/model/mock.ts` files can be provided via story setup

**Given** a component uses `m.*` from framer-motion (e.g., AnimatedTitle, TransitionEffect)
**When** its story renders in Storybook
**Then** a `LazyMotionProvider` wraps the component with `domAnimation` features
**And** animations play correctly in the Storybook canvas

**Given** all three decorators are configured
**When** I create a new story file
**Then** decorators apply automatically via `.storybook/preview.ts` global configuration
**And** individual stories can override or extend providers as needed

---

### Story 21.3: Atom Stories — Buttons, Links & Interactive Elements

As a **developer**,
I want **Storybook stories for all button, link, and interactive atom components**,
So that **I can see every variant, state, and theme combination for foundational UI elements**.

**Acceptance Criteria:**

**Given** the project has 12 button components, 6 link components, and 7 text components
**When** I navigate to the "Atoms" category in Storybook
**Then** I see organized subcategories: Buttons, Links, Texts

**Given** a button story (e.g., AuthButton)
**When** I view the story
**Then** I see variants: default, disabled, dark mode
**And** the Controls panel shows all props from `ComponentNameProps` interface
**And** I can modify props interactively (toggle `isDisabled`, change `aria-label`)

**Given** a button that has a skeleton loading state (e.g., ArrowButton, NavigationItemButton)
**When** I view the story
**Then** a "Skeleton" variant shows the loading state alongside the loaded state

**Given** all button stories are created
**When** I browse the Buttons subcategory
**Then** stories exist for: AuthButton, ChatButton, CopyButton, HireMeButton, HireMeHeaderButton, MenuButton, NavigationItemButton, NeumorphicToggle, SkillSelectorButton, ThemeButton, ArrowButton
**And** each story has at minimum: Default, Dark Mode variants

**Given** link components (BaseLink, CalendarLink, TransitionLink, etc.)
**When** I view link stories
**Then** link behavior is documented (href patterns, external vs internal, skeleton states)

---

### Story 21.4: Atom Stories — Icon Gallery

As a **developer**,
I want **a visual gallery of all 58 icons with search and size variants**,
So that **I can quickly find and reference any icon without reading source code**.

**Acceptance Criteria:**

**Given** the project has 58 icon components in `src/ui/atoms/icons/`
**When** I navigate to "Atoms > Icons" in Storybook
**Then** I see a single "Icon Gallery" story that displays all 58 icons in a grid

**Given** the Icon Gallery is displayed
**When** I look at each icon cell
**Then** I see the icon rendered at default size, the component name (e.g., "GitHubIcon"), and the import path (`@/atoms/icons/GitHubIcon`)

**Given** the Icon Gallery has a search control
**When** I type "React" in the search field
**Then** only icons matching the filter are shown (ReactIcon, etc.)

**Given** the Icon Gallery has a size control
**When** I change the size slider/select
**Then** all icons re-render at the selected size (sm: 16px, md: 24px, lg: 32px, xl: 48px)

**Given** dark mode is toggled on
**When** I view the Icon Gallery
**Then** all icons render with their dark mode colors

**Given** the gallery story file
**When** I review the import statements
**Then** each icon is imported via direct path (`@/atoms/icons/IconName`) NOT from the barrel file

---

### Story 21.5: Molecule Stories — Core Compositions

As a **developer**,
I want **Storybook stories for the most important molecule components**,
So that **I can verify how atoms compose into functional UI units with real mock data**.

**Acceptance Criteria:**

**Given** the project has 30 molecule components
**When** I navigate to "Molecules" in Storybook
**Then** I see stories for at minimum 15 key molecules prioritized by usage and complexity

**Given** molecules that consume domain data (Experience, Education, Article, WhatsApp, CopyEmail, Calendar)
**When** their stories render
**Then** they use mock data from existing `domains/*/model/mock.ts` files
**And** the Controls panel allows modifying key props

**Given** molecules with skeleton loading states (e.g., Education, Experience, CopyEmail, WhatsApp)
**When** I view their stories
**Then** a "Loading" variant shows the skeleton state

**Given** molecules with dark mode support
**When** dark mode is toggled
**Then** the molecule renders correctly with dark theme styles

**Given** responsive molecules (e.g., NavigationItems, FeaturedArticlesCarousel)
**When** I switch between viewport presets
**Then** the molecule adapts to the selected breakpoint

**Given** the story is complete
**When** I review the molecule story files
**Then** each story documents the molecule's purpose, required props, and composition pattern

---

### Story 21.6: Organism Stories — Page Sections

As a **developer**,
I want **Storybook stories for complex organism components (NavBar, Footer, Auth, Chat, ProjectCard, ArticleCard)**,
So that **I can test page-level sections in isolation with full state management**.

**Acceptance Criteria:**

**Given** the project has 21 organism components
**When** I navigate to "Organisms" in Storybook
**Then** I see stories for at minimum 10 key organisms

**Given** organisms with Redux state dependency (NavBar, Menu, Footer, Auth, Chat)
**When** their stories render
**Then** Redux store is pre-populated with appropriate initial state
**And** I can interact with state-changing actions (toggle menu, switch theme, open chat)

**Given** ArticleCard and ProjectCard organisms with variants
**When** I view their stories
**Then** I see variant stories: Featured, Grid, and List (for ArticleCard)
**And** each variant shows different prop configurations
**And** the Controls panel documents all props from their `.types.ts` files

**Given** the Auth organism
**When** I view its story
**Then** I see variants: Login form, Signup form, OAuth buttons, AuthDropdown (logged in state)
**And** the modal opens/closes via story controls

**Given** the Chat organism (ChatOverlay)
**When** I view its story
**Then** the chat panel opens with preset messages
**And** the form accepts input and shows mock responses

**Given** organisms with responsive behavior (NavBar, Footer, Menu)
**When** I switch between mobile/desktop viewports
**Then** the organism adapts (hamburger menu on mobile, inline nav on desktop)

---

### Story 21.7: Storybook Build & Accessibility Addon

As a **developer**,
I want **Storybook integrated with accessibility testing and a static build script**,
So that **I can catch a11y issues in component development and deploy documentation**.

**Acceptance Criteria:**

**Given** the `@storybook/addon-a11y` addon is configured
**When** I view any story in Storybook
**Then** the Accessibility tab shows axe-core audit results
**And** violations are highlighted directly on the component preview

**Given** all stories are created
**When** I run `npm run build-storybook`
**Then** the build completes successfully with 0 errors
**And** the output in `storybook-static/` is a deployable static site

**Given** `package.json` scripts section
**When** Story 21.7 is complete
**Then** these scripts exist: `storybook` (dev), `build-storybook` (static build)

**Given** the CI pipeline (`.github/workflows/ci.yml`)
**When** Story 21.7 is complete
**Then** `build-storybook` is NOT added to CI yet (future consideration, keep scope minimal)
**And** a comment in the workflow file documents where to add it when ready
