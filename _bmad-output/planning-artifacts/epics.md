---
stepsCompleted:
  [
    step-01-validate-prerequisites,
    step-02-design-epics,
    step-03-create-stories,
    step-04-final-validation,
  ]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - /Users/angel.szymczak/Vaults/Harvis/300-MEMORIA_DIGITAL/475-Sites/AngelSolutions/company/apps/sites/portfolio/portfolio-backend-ruby/app/frontend/styles/*
  - https://every-layout.dev/
---

# portfolio-frontend-nextjs - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for portfolio-frontend-nextjs, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitor can view developer profile summary on homepage.
FR2: Visitor can see technology stack and skills.
FR3: Visitor can read professional bio and background.
FR4: Visitor can access social/professional links (GitHub, LinkedIn).
FR5: Visitor can browse list of featured projects.
FR6: Visitor can view detailed project information (description, tech, outcomes).
FR7: Visitor can access live demo links for projects.
FR8: Visitor can access source code repositories.
FR9: Visitor can filter/categorize projects by technology.
FR10: Visitor can view professional work history timeline.
FR11: Visitor can see role details and responsibilities.
FR12: Visitor can view academic background.
FR13: Visitor can see certifications or achievements.
FR14: Visitor can browse published articles.
FR15: Visitor can read full article content.
FR16: Visitor can share articles via social links.
FR17: Search engines can index public content (SEO).
FR18: Visitor can access email contact.
FR19: Visitor can access WhatsApp contact.
FR20: Visitor can schedule meeting via Calendly.
FR21: Visitor can interact with chat panel UI.
FR22: Visitor can copy contact information to clipboard.
FR23: Visitor can toggle light/dark theme.
FR24: Visitor can navigate site on any device (responsive).
FR25: Visitor can use keyboard navigation throughout.
FR26: Visitor can consume content with screen reader.
FR27: Visitor experiences reduced motion when preferred.
FR28: Owner can update project information via CMS/repo.
FR29: Owner can publish new articles.
FR30: Owner can preview changes before deploy.
FR31: Owner can deploy updates with single command.
FR32: CI pipeline runs automated accessibility audits before deploy.
FR33: E2E tests use resilient selectors (data-testid pattern).

### NonFunctional Requirements

NFR1: Lighthouse Performance >= 90.
NFR2: LCP (Largest Contentful Paint) < 2.5s.
NFR3: FID (First Input Delay) < 100ms.
NFR4: CLS (Cumulative Layout Shift) < 0.1.
NFR5: TTI (Time to Interactive) < 3.8s.
NFR6: First Load JS < 100KB.
NFR7: Total bundle (gzipped) < 200KB.
NFR8: HTTPS obligatorio en produccion.
NFR9: Auth tokens con JWT + Rodauth y cookies HttpOnly.
NFR10: CORS configurado para dominio especifico.
NFR11: Dependencias sin vulnerabilidades criticas (`npm audit`).
NFR12: Secrets en plataforma de deploy, nunca en codigo.
NFR13: Cumplimiento WCAG 2.2 Level AA.
NFR14: Lighthouse Accessibility >= 95.
NFR15: 100% de funcionalidades clave accesibles por teclado.
NFR16: Compatibilidad con NVDA/VoiceOver.
NFR17: Contraste minimo 4.5:1 en texto normal.
NFR18: Focus visible en todos los elementos interactivos.
NFR19: Respeto de `prefers-reduced-motion`.
NFR20: Alt text en todas las imagenes.
NFR21: Rails API timeout < 5s.
NFR22: Retry automatico y fallback graceful en llamadas API.
NFR23: Desarrollo funcional sin backend usando MSW.
NFR24: Integracion Calendly con fallback a link directo.
NFR25: External links con `rel="noopener noreferrer"`.
NFR26: Uptime objetivo 99.9%.
NFR27: Zero-downtime deploy.
NFR28: Error boundaries con graceful degradation.

### Additional Requirements

- Brownfield: no se requiere starter template; se debe evolucionar sin reescritura total.
- Mantener arquitectura existente: DDD (dominios) + Atomic Design + App Router.
- Estrategia TypeScript incremental y en orden: schemas -> hooks -> lib -> atoms -> molecules -> organisms -> app.
- Testing por capas: Jest/RTL (unit/integration), Playwright (E2E), jest-axe/@axe-core (a11y).
- CI/CD con quality gates: lint -> typecheck -> unit -> e2e -> lighthouse (warning).
- Error handling estandarizado: Error Boundaries por nivel + retries de React Query + validacion con Zod.
- Restriccion de estado: React Query para server-state, Redux solo para UI-state.
- Nuevos requisitos de salida a produccion: eliminar default mock en imagen de produccion y formalizar contrato de runtime por entorno.
- Incluir y auditar deuda tecnica de estilos legacy en `/portfolio-backend-ruby/app/frontend/styles/*` antes de reutilizar/adaptar.
- Estilos/layout legacy identificados para revisiones previas a extension:
  - patrones Every Layout ya presentes (`.stack`, `.cluster`, `.sidebar`, `.cover`, `.holy-grail`)
  - inconsistencia de tokens (`--space-xs` vs `--spacing-*`, `--border-radius` sin definicion visible)
  - valores hardcoded no semanticos (`blueviolet`, `orangered`) en primitives.
- Referencia metodologica externa aceptada: `https://every-layout.dev/`.
- Aplicar enfoque Every Layout para layout nuevo en blanco/composable, con contratos por organismo y sin depender de breakpoints rigidos por viewport cuando el contexto del contenedor sea suficiente.
- Prioridad de trabajo confirmada por el usuario (orden de arranque):
  1. TD-03.1 quitar default mock en imagen de produccion.
  2. TD-06.1 crear Layout Shell v2 en blanco/composable.
  3. TD-06.2 definir contratos responsive por organismo.
  4. TD-07.1 estabilizar base de Storybook (aliases/providers/workflow).
  5. TD-07.2 catalogar organismos criticos con estados responsive.
  6. TD-06.3 migrar Home a shell v2 con gate de paridad.
  7. TD-07.3 stories de composicion de layout (deteccion de colisiones).
  8. TD-07.4 gate CI de Storybook (build + smoke/visual).
  9. TD-06.4 migracion por fases About/Projects/Articles.

### FR Coverage Map

FR1: Epic 1 - Homepage profile foundation
FR2: Epic 1 - Skills and stack visibility
FR3: Epic 1 - Professional bio presentation
FR4: Epic 1 - Social/professional outbound links
FR5: Epic 2 - Featured projects discovery
FR6: Epic 2 - Project detail depth
FR7: Epic 2 - Live demo access
FR8: Epic 2 - Source repository access
FR9: Epic 2 - Project filtering
FR10: Epic 2 - Experience timeline
FR11: Epic 2 - Role and responsibility details
FR12: Epic 2 - Academic records
FR13: Epic 2 - Certifications and achievements
FR14: Epic 3 - Articles listing
FR15: Epic 3 - Full article reading
FR16: Epic 3 - Article social sharing
FR17: Epic 3 - SEO indexability
FR18: Epic 4 - Email contact action
FR19: Epic 4 - WhatsApp contact action
FR20: Epic 4 - Calendly scheduling
FR21: Epic 4 - Chat panel interaction
FR22: Epic 4 - Clipboard copy interactions
FR23: Epic 1 - Theme toggle baseline
FR24: Epic 6 - Responsive layout shell contracts
FR25: Epic 1 - Keyboard accessibility baseline
FR26: Epic 1 - Screen reader support baseline
FR27: Epic 1 - Reduced-motion support baseline
FR28: Epic 5 - Owner updates project content
FR29: Epic 5 - Owner publishes articles
FR30: Epic 5 - Preview before release
FR31: Epic 5 - One-command release path
FR32: Epic 7 - CI accessibility and quality gates
FR33: Epic 7 - Resilient selector strategy in test gates

## Epic List

### Epic 1: Profile and Accessibility Foundation

Deliver a polished, accessible first-impression experience where visitors can immediately understand identity, stack, and credibility across theme and input modalities.
**FRs covered:** FR1, FR2, FR3, FR4, FR23, FR25, FR26, FR27

### Epic 2: Project and Experience Proof of Work

Enable visitors to evaluate technical depth and trajectory through projects, demos, source links, and professional timeline content.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13

### Epic 3: Articles and Search Discovery

Provide indexable long-form content with shareability and robust metadata so technical audiences and search engines can discover expertise.
**FRs covered:** FR14, FR15, FR16, FR17

### Epic 4: Contact and Engagement Flows

Provide low-friction contact and interaction pathways for recruiters and clients through direct actions and in-app engagement surfaces.
**FRs covered:** FR18, FR19, FR20, FR21, FR22

### Epic 5: Owner Publishing and Release Operations

Ensure owner-facing content updates, preview, and deployment workflows are deterministic and repeatable.
**FRs covered:** FR28, FR29, FR30, FR31

### Epic 6: Production Runtime and Layout v2 Reconstruction

Remove production-mode ambiguity and rebuild layout composition from a clean Every Layout shell to eliminate residual responsive conflicts.
**FRs covered:** FR24, FR31

### Epic 7: Storybook-Driven Quality Gates

Operationalize Storybook as design-system source of truth with composition coverage and CI gates to prevent visual and interaction regressions.
**FRs covered:** FR32, FR33

## Epic 1: Profile and Accessibility Foundation

Establish a complete and trustworthy profile experience that is accessible by default on keyboard, screen reader, and reduced-motion contexts.

### Story 1.1: Home Profile Summary Baseline

As a tech recruiter,
I want a clear profile summary on the homepage,
So that I can quickly assess candidate fit.

**Acceptance Criteria:**

**Given** I open the homepage on desktop or mobile
**When** the page finishes initial render
**Then** profile headline, summary, and core stack are visible without broken layout
**And** the section has semantic landmarks and readable hierarchy.

### Story 1.2: Social Proof and Stack Visibility

As a potential client,
I want direct access to professional links and visible skills,
So that I can verify credibility and technical alignment.

**Acceptance Criteria:**

**Given** I navigate profile and skill areas
**When** I use social/profile links
**Then** links open correctly with safe external link attributes
**And** skill/technology information is readable and consistently styled.

### Story 1.3: Accessibility and Theme Interaction Baseline

As a keyboard or assistive technology user,
I want full navigation support and theme controls,
So that I can consume content without interaction barriers.

**Acceptance Criteria:**

**Given** I browse with keyboard and reduced-motion preferences
**When** I navigate interactive controls and toggle theme
**Then** focus indicators remain visible and all key actions are reachable
**And** motion-heavy behaviors respect user motion preferences.

## Epic 2: Project and Experience Proof of Work

Deliver depth-oriented portfolio proof, from projects and demos to experience and education narrative.

### Story 2.1: Featured Projects with Filtering

As a peer developer,
I want to browse and filter projects by technology,
So that I can find relevant implementation examples quickly.

**Acceptance Criteria:**

**Given** I am on the projects page
**When** I apply technology filters
**Then** project cards update deterministically to matching criteria
**And** empty-state handling is explicit and accessible.

### Story 2.2: Project Detail, Demo, and Source Navigation

As a technical evaluator,
I want each project to provide detail, live demo, and source links,
So that I can validate engineering quality.

**Acceptance Criteria:**

**Given** I open a project detail view
**When** I inspect its resources
**Then** description, stack, outcomes, demo, and repository links are present and valid
**And** outbound actions are measurable and resilient.

### Story 2.3: Experience, Education, and Achievement Timeline

As a recruiter,
I want a coherent timeline of experience and credentials,
So that I can judge seniority progression.

**Acceptance Criteria:**

**Given** I view experience and credentials sections
**When** I scan timeline entries
**Then** role details, responsibilities, and academic records are complete
**And** chronology and section semantics remain clear across breakpoints.

## Epic 3: Articles and Search Discovery

Provide discoverable content flows that reinforce expertise and remain SEO-ready.

### Story 3.1: Article Index and Navigation

As a visitor,
I want to browse published articles,
So that I can discover relevant technical writing.

**Acceptance Criteria:**

**Given** I access the articles listing
**When** I scroll and open an entry
**Then** article cards expose essential metadata and navigable links
**And** navigation state remains stable under rapid interactions.

### Story 3.2: Full Article Read and Share Actions

As a reader,
I want complete article content and sharing actions,
So that I can consume and distribute useful content.

**Acceptance Criteria:**

**Given** I open an article page
**When** I read and trigger share controls
**Then** full content renders safely and consistently
**And** social sharing actions function with expected targets.

### Story 3.3: SEO Metadata and Indexability Hardening

As a search engine,
I want properly structured metadata and crawlable routes,
So that portfolio content can be indexed and ranked.

**Acceptance Criteria:**

**Given** public pages are built for deployment
**When** metadata artifacts are generated
**Then** sitemap, robots, canonical, and page metadata are valid
**And** article and project routes are indexable without duplicate URL conflicts.

## Epic 4: Contact and Engagement Flows

Enable direct, low-friction engagement paths for hiring and client conversations.

### Story 4.1: Direct Contact Actions (Email and WhatsApp)

As a potential client,
I want immediate access to email and WhatsApp,
So that I can start contact in one action.

**Acceptance Criteria:**

**Given** I use contact controls
**When** I select email or WhatsApp
**Then** the correct target action opens with valid identifiers
**And** failure states are handled without breaking navigation.

### Story 4.2: Calendly Scheduling Path

As a recruiter,
I want scheduling access via Calendly,
So that I can book a meeting quickly.

**Acceptance Criteria:**

**Given** I trigger meeting scheduling
**When** embed or fallback path is required
**Then** scheduling remains available through primary or fallback mode
**And** UI communicates loading and availability clearly.

### Story 4.3: Chat Panel and Clipboard Interaction

As a visitor,
I want lightweight chat interaction and copy actions,
So that I can engage and keep contact data.

**Acceptance Criteria:**

**Given** I interact with chat and copy controls
**When** I open/close panels or copy data
**Then** state changes are consistent and reversible
**And** user feedback confirms copied content and action results.

## Epic 5: Owner Publishing and Release Operations

Provide owner-facing workflows to update, preview, and deploy safely.

### Story 5.1: Update Project Content via Repo/CMS Path

As the portfolio owner,
I want to update project entries quickly,
So that showcased work stays current.

**Acceptance Criteria:**

**Given** I modify project content data
**When** validation runs
**Then** data integrity checks pass or return actionable errors
**And** updated content is available in preview context.

### Story 5.2: Publish and Preview Article Changes

As the portfolio owner,
I want article updates to be previewable before release,
So that I can avoid publishing content errors.

**Acceptance Criteria:**

**Given** I create or edit article content
**When** I open preview
**Then** formatting and routing match production behavior
**And** publish actions apply only validated content.

### Story 5.3: One-Command Production Validation and Deploy

As the portfolio owner,
I want a one-command predeploy and release path,
So that deployments are repeatable and low risk.

**Acceptance Criteria:**

**Given** I run the release workflow
**When** validation completes
**Then** lint, types, tests, and build gates run in required order
**And** deployment proceeds only when required checks pass.

## Epic 6: Production Runtime and Layout v2 Reconstruction

Create a production-safe runtime contract and rebuild layout composition with Every Layout primitives to remove residual responsive debt.

### Story 6.1: Remove Mock Default from Production Image (TD-03.1)

As a platform owner,
I want production image behavior to require explicit runtime mode,
So that production never silently runs in mock mode.

**Acceptance Criteria:**

**Given** production image build and deploy pipelines
**When** environment contracts are applied
**Then** mock mode is not defaulted for production
**And** deployment fails fast if environment mode is missing or invalid.

### Story 6.2: Create Layout Shell v2 Blank Composable Foundation (TD-06.1)

As a frontend engineer,
I want a new blank layout shell for organism composition,
So that I can migrate pages without inheriting legacy CSS conflicts.

**Acceptance Criteria:**

**Given** shell v2 is initialized
**When** header/nav/main/footer organisms are mounted
**Then** zones render with explicit structural contracts
**And** shell styles do not depend on legacy page-level coupling.

### Story 6.3: Define Responsive Contracts per Organism (TD-06.2)

As a design-system contributor,
I want responsive behavior contracts per organism,
So that breakpoint and container behavior is deterministic.

**Acceptance Criteria:**

**Given** organism layout contracts are documented and implemented
**When** viewport and container contexts change
**Then** spacing, stacking, overflow, and transition rules hold consistently
**And** contracts follow Every Layout intrinsic principles where applicable.

### Story 6.4: Migrate Home to Shell v2 with Parity Gate (TD-06.3)

As a frontend engineer,
I want Home migrated to shell v2 with acceptance parity checks,
So that layout regression risk is controlled while fixing residual conflicts.

**Acceptance Criteria:**

**Given** Home migration branch is active
**When** shell v2 composition is enabled for Home
**Then** expected visual/interaction parity is met at target breakpoints
**And** known overlap/clipping defects are resolved in v2 path.

### Story 6.5: Migrate About, Projects, and Articles in Phases (TD-06.4)

As a frontend engineer,
I want phased migration of remaining key pages to shell v2,
So that rollout can be validated incrementally with rollback safety.

**Acceptance Criteria:**

**Given** About, Projects, and Articles are migrated one at a time
**When** each page reaches validation gate
**Then** page-specific regressions are resolved before proceeding
**And** rollback path remains available for each migration phase.

## Epic 7: Storybook-Driven Quality Gates

Use Storybook as contract and validation surface for components and page composition, then enforce that in CI.

### Story 7.1: Stabilize Storybook Foundation (TD-07.1)

As a frontend engineer,
I want Storybook aligned with project aliases, providers, and workflow,
So that stories run consistently with app runtime assumptions.

**Acceptance Criteria:**

**Given** Storybook setup is integrated in repo
**When** stories are executed locally and in CI build mode
**Then** alias and provider dependencies resolve without runtime errors
**And** baseline documentation covers local and CI usage.

### Story 7.2: Catalog Critical Organisms with Responsive States (TD-07.2)

As a design-system maintainer,
I want critical organisms represented with responsive states,
So that behavior contracts are visible and testable before page integration.

**Acceptance Criteria:**

**Given** organism stories are authored
**When** responsive viewports and controls are exercised
**Then** critical states and variants are represented explicitly
**And** story definitions map to layout contracts used in shell v2.

### Story 7.3: Add Layout Composition Stories for Collision Detection (TD-07.3)

As a QA engineer,
I want composition stories that combine organisms in page skeletons,
So that collision and spacing regressions are caught early.

**Acceptance Criteria:**

**Given** composition stories exist for Home and content pages
**When** layout interactions are validated across breakpoints
**Then** collisions/overlaps are detectable in Storybook scenarios
**And** findings feed fixes before merging page-level changes.

### Story 7.4: Add Storybook CI Gate with Build and Visual Smoke (TD-07.4)

As a platform engineer,
I want Storybook quality gates in CI,
So that visual and interaction regressions block risky merges.

**Acceptance Criteria:**

**Given** CI pipeline executes Storybook gate
**When** Storybook build or smoke/visual checks fail
**Then** merge is blocked on protected branches
**And** failures include actionable artifact output for triage.
