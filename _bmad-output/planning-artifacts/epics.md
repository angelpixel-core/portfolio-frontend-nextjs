---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
status: 'complete'
completedAt: '2026-01-21'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
---

# portfolio-frontend-nextjs - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for portfolio-frontend-nextjs, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Profile & Identity (FR1-4):**
- FR1: Visitor can view developer profile summary on homepage
- FR2: Visitor can see technology stack and skills
- FR3: Visitor can read professional bio and background
- FR4: Visitor can access social/professional links (GitHub, LinkedIn)

**Project Showcase (FR5-9):**
- FR5: Visitor can browse list of featured projects
- FR6: Visitor can view detailed project information (description, tech, outcomes)
- FR7: Visitor can access live demo links for projects
- FR8: Visitor can access source code repositories
- FR9: Visitor can filter/categorize projects by technology

**Experience & Credentials (FR10-13):**
- FR10: Visitor can view professional work history timeline
- FR11: Visitor can see role details and responsibilities
- FR12: Visitor can view academic background
- FR13: Visitor can see certifications or achievements

**Content Discovery (FR14-17):**
- FR14: Visitor can browse published articles
- FR15: Visitor can read full article content
- FR16: Visitor can share articles via social links
- FR17: Search engines can index public content (SEO)

**Contact & Engagement (FR18-22):**
- FR18: Visitor can access email contact
- FR19: Visitor can access WhatsApp contact
- FR20: Visitor can schedule meeting via Calendly
- FR21: Visitor can interact with chat panel UI
- FR22: Visitor can copy contact information to clipboard

**Visual Presentation (FR23-27):**
- FR23: Visitor can toggle light/dark theme
- FR24: Visitor can navigate site on any device (responsive)
- FR25: Visitor can use keyboard navigation throughout
- FR26: Visitor can consume content with screen reader
- FR27: Visitor experiences reduced motion when preferred

**Content Management (FR28-31):**
- FR28: Owner can update project information via CMS/repo
- FR29: Owner can publish new articles
- FR30: Owner can preview changes before deploy
- FR31: Owner can deploy updates with single command

**Technical Infrastructure (FR32-33):**
- FR32: CI pipeline runs automated accessibility audits before deploy
- FR33: E2E tests use resilient selectors (data-testid pattern)

### NonFunctional Requirements

**Performance:**
- NFR1: Lighthouse Performance ≥90
- NFR2: LCP < 2.5s
- NFR3: FID < 100ms
- NFR4: CLS < 0.1
- NFR5: TTI < 3.8s
- NFR6: First Load JS < 100KB
- NFR7: Total Bundle (gzipped) < 200KB

**Security:**
- NFR8: HTTPS obligatorio en producción
- NFR9: JWT con Rodauth, HttpOnly cookies
- NFR10: CORS configurado para dominio específico
- NFR11: npm audit sin vulnerabilidades críticas
- NFR12: Secrets en Vercel, nunca en código

**Accessibility:**
- NFR13: WCAG 2.2 Level AA compliance
- NFR14: Lighthouse Accessibility ≥95
- NFR15: 100% funcionalidad accesible por teclado
- NFR16: Compatible con NVDA/VoiceOver
- NFR17: Color contrast mínimo 4.5:1
- NFR18: Focus visible en todos los interactivos
- NFR19: Respetar prefers-reduced-motion
- NFR20: Alt text en todas las imágenes

**Integration:**
- NFR21: Rails API timeout <5s, retry automático
- NFR22: Desarrollo funcional sin backend (MSW mocks)
- NFR23: Calendly embed funcional con fallback

**Reliability:**
- NFR24: 99.9% uptime (Vercel SLA)
- NFR25: Zero downtime deploys
- NFR26: Error Boundary con graceful degradation

### Additional Requirements

**TypeScript Migration (Architecture):**
- Migración incremental con strict mode habilitado desde inicio
- Orden de migración: Schemas → Hooks → Lib → Atoms → Molecules → Organisms → Pages
- Usar Zod inference para types (z.infer<typeof Schema>)
- Archivos: .tsx para componentes React, .ts para todo lo demás

**Testing Architecture (Architecture):**
- Jest 29 + React Testing Library 14 para unit/integration tests
- Playwright para E2E tests (critical user journeys)
- MSW 2.x para API mocking (desarrollo sin backend)
- jest-axe + @axe-core/playwright para testing de accesibilidad
- Coverage target: MVP critical paths, Growth 80%+

**CI/CD Pipeline (Architecture):**
- GitHub Actions workflow con quality gates
- Stages: lint → typecheck → unit tests → E2E tests → Lighthouse CI
- Vercel preview deploys en cada PR
- Vercel production deploy automático en main merge
- Todos los stages son blocking excepto Lighthouse (warning)

**Error Handling Patterns (Architecture):**
- Error Boundaries por nivel: RootErrorBoundary → RouteErrorBoundary → SectionErrorBoundary
- React Query retry: 3 intentos con fallback offline
- Custom ApiError class con toast notifications
- Zod validation para errores field-level en forms

**Brownfield Project Context:**
- NO starter template requerido (proyecto existente funcional)
- Respetar arquitectura existente: DDD (11 dominios) + Atomic Design
- ~120 componentes existentes para migrar
- Redux Toolkit (UI state) + React Query (server state) ya configurados

### FR Coverage Map

| FR | Epic | Descripción |
|----|------|-------------|
| FR1 | Epic 1 | Profile summary on homepage |
| FR2 | Epic 1 | Technology stack and skills |
| FR3 | Epic 1 | Professional bio and background |
| FR4 | Epic 1 | Social/professional links |
| FR5 | Epic 2 | Browse featured projects |
| FR6 | Epic 2 | View detailed project information |
| FR7 | Epic 2 | Access live demo links |
| FR8 | Epic 2 | Access source code repositories |
| FR9 | Epic 2 | Filter projects by technology |
| FR10 | Epic 3 | View work history timeline |
| FR11 | Epic 3 | See role details and responsibilities |
| FR12 | Epic 3 | View academic background |
| FR13 | Epic 3 | See certifications or achievements |
| FR14 | Epic 4 | Browse published articles |
| FR15 | Epic 4 | Read full article content |
| FR16 | Epic 4 | Share articles via social links |
| FR17 | Epic 4 | Search engines can index content |
| FR18 | Epic 5 | Access email contact |
| FR19 | Epic 5 | Access WhatsApp contact |
| FR20 | Epic 5 | Schedule meeting via Calendly |
| FR21 | Epic 5 | Interact with chat panel UI |
| FR22 | Epic 5 | Copy contact information to clipboard |
| FR23 | Epic 1 | Toggle light/dark theme |
| FR24 | Epic 1 | Navigate on any device (responsive) |
| FR25 | Epic 1 | Keyboard navigation throughout |
| FR26 | Epic 1 | Screen reader compatibility |
| FR27 | Epic 1 | Reduced motion when preferred |
| FR28 | Epic 6 | Update project information |
| FR29 | Epic 6 | Publish new articles |
| FR30 | Epic 6 | Preview changes before deploy |
| FR31 | Epic 6 | Deploy updates with single command |
| FR32 | Epic 7 | Automated accessibility audits in CI |
| FR33 | Epic 7 | Resilient E2E selectors (data-testid) |

**Cobertura:** 33/33 FRs mapeados ✅

## Epic List

### Epic 1: Primera Impresión Impecable

Visitantes experimentan un portfolio rápido, accesible, que funciona perfectamente en cualquier dispositivo. Este epic establece la fundación técnica (TypeScript, CI/CD básico) y garantiza que la experiencia core sea impecable.

**FRs cubiertos:** FR1, FR2, FR3, FR4, FR23, FR24, FR25, FR26, FR27
**NFRs addressed:** Performance (NFR1-7), Accessibility (NFR13-20)
**Trabajo técnico:** TypeScript migration (schemas, profile domain, UI core), CI/CD básico, optimización performance.

---

### Epic 2: Showcase de Proyectos

Visitantes exploran proyectos con interacciones fluidas, demos funcionales y código accesible. Demuestra capacidad técnica real.

**FRs cubiertos:** FR5, FR6, FR7, FR8, FR9
**Trabajo técnico:** TypeScript migration (project domain), tests de componentes, skeleton states.

---

### Epic 3: Historia Profesional

Visitantes ven una trayectoria profesional creíble y bien presentada con timeline de experiencia laboral y educación.

**FRs cubiertos:** FR10, FR11, FR12, FR13
**Trabajo técnico:** TypeScript migration (job-experience, academic domains), tests.

---

### Epic 4: Descubrimiento de Contenido

Visitantes y buscadores descubren y leen artículos fácilmente. SEO optimizado para discovery orgánico.

**FRs cubiertos:** FR14, FR15, FR16, FR17
**NFRs addressed:** SEO strategy from PRD
**Trabajo técnico:** TypeScript migration (article domain), SEO optimization, social sharing tests.

---

### Epic 5: Contacto Fácil

Visitantes pueden contactar fácilmente por su canal preferido (email, WhatsApp, Calendly, chat).

**FRs cubiertos:** FR18, FR19, FR20, FR21, FR22
**NFRs addressed:** Integration (NFR21-23)
**Trabajo técnico:** TypeScript migration (contact-point domain), chat panel tests, Calendly integration.

---

### Epic 6: Mantenimiento Sostenible

Owner puede actualizar y desplegar el portfolio con confianza. CI/CD completo con quality gates.

**FRs cubiertos:** FR28, FR29, FR30, FR31
**NFRs addressed:** Reliability (NFR24-26), CI/CD Pipeline
**Trabajo técnico:** CI/CD completion, E2E tests (Playwright), deploy automation, Lighthouse CI.

---

### Epic 7: Technical Infrastructure & Maintenance

Hardening de la infraestructura técnica post-MVP. Automated accessibility testing, E2E test resilience, test quality improvements, documentation navigation.

**FRs cubiertos:** FR32, FR33
**NFRs addressed:** Accessibility automation (NFR13-14), Test quality
**Trabajo técnico:** @axe-core/playwright integration, data-testid migration, flaky test fixes, documentation TOC.
**Origen:** Technical debt documentado en retrospectivas Epic 1-6.

---

### Epic Dependencies

```
Epic 1 (Foundation) ─────────────────────────────────┐
       │                                              │
       ├──→ Epic 2 (Projects)                         │
       ├──→ Epic 3 (Experience)    [Parallel OK]      │
       ├──→ Epic 4 (Articles)                         │
       └──→ Epic 5 (Contact)                          │
                                                      │
Epic 6 (Maintenance) ←────────────────────────────────┘
       [Builds on all previous, completes CI/CD]
                    │
                    ▼
Epic 7 (Technical Infrastructure)
       [Post-MVP hardening, debt resolution]
                    │
                    ▼
       ┌────────────┴────────────┐
       │                         │
Epic 8 (Test Hardening)    Epic 9 (Docs & DX)
[A11y consolidation,       [TOC, templates,
 WCAG 2.2, E2E consistency] navigation]
       │                         │
       └────────────┬────────────┘
                    ▼
          Epic 10 (Runtime & UX Polish) ✅
       [Hydration fix, dark mode contrast,
        missing icons, font preload, favicon]
                    │
                    ▼
          Epic 11 (Responsive Header System)
       [Breakpoints, header zones, visibility
        rules, layout refactor, viewport tests]
                    │
                    ▼
          Epic 12+ [Future]
       [New features, additional pages]
```

---

## Epic 1: Primera Impresión Impecable

Visitantes experimentan un portfolio rápido, accesible, que funciona perfectamente en cualquier dispositivo. Este epic establece la fundación técnica (TypeScript, CI/CD básico) y garantiza que la experiencia core sea impecable.

### Story 1.1: Fundación TypeScript y CI

As a developer/visitor,
I want the codebase to have TypeScript strict mode and automated quality checks,
So that changes don't introduce regressions and the site remains stable.

**Acceptance Criteria:**

**Given** a fresh clone of the repository
**When** I run `npm install && npm run typecheck`
**Then** TypeScript compiles with strict mode enabled
**And** zero type errors are reported

**Given** a push to any branch
**When** GitHub Actions CI runs
**Then** lint, typecheck, and unit tests execute
**And** the pipeline fails if any check fails

---

### Story 1.2: Profile Domain Migration

As a visitor,
I want to view the developer's profile reliably,
So that I can quickly understand who they are and their background.

**Acceptance Criteria:**

**Given** I navigate to the homepage
**When** the profile data loads
**Then** I see the developer's name, bio, and summary
**And** the data is validated with Zod schema
**And** TypeScript types are inferred from schema

**Given** the profile API fails
**When** the component renders
**Then** an error boundary shows a friendly fallback
**And** no crash occurs

---

### Story 1.3: Technology Stack Display

As a visitor,
I want to see the technology stack and skills clearly,
So that I can assess the developer's technical expertise.

**Acceptance Criteria:**

**Given** I view the homepage
**When** I scroll to the technologies section
**Then** I see skills organized by category
**And** each technology displays an icon and name
**And** the component is migrated to TypeScript with tests

---

### Story 1.4: Social Links Integration

As a visitor,
I want to access GitHub and LinkedIn profiles easily,
So that I can verify credentials and connect professionally.

**Acceptance Criteria:**

**Given** I view the profile section
**When** I see social links
**Then** GitHub and LinkedIn icons are visible and clickable
**And** links open in new tab with `rel="noopener noreferrer"`
**And** links are keyboard accessible

---

### Story 1.5: Theme Toggle Accessibility

As a visitor,
I want to toggle between light and dark themes,
So that I can view comfortably in any lighting condition.

**Acceptance Criteria:**

**Given** I view the site in light mode
**When** I click the theme toggle button
**Then** the theme switches to dark mode immediately
**And** my preference persists across sessions
**And** the toggle is keyboard accessible (Enter/Space)
**And** the toggle has appropriate ARIA label

**Given** my system preference is dark mode
**When** I visit the site for the first time
**Then** dark mode is applied automatically

---

### Story 1.6: Keyboard Navigation Excellence

As a visitor using keyboard-only navigation,
I want to navigate the entire site using keyboard,
So that I can access all content without a mouse.

**Acceptance Criteria:**

**Given** I land on any page
**When** I press Tab repeatedly
**Then** focus moves through all interactive elements in logical order
**And** focus indicator is clearly visible (meets WCAG 2.4.7)
**And** skip-to-main-content link works

**Given** I open a modal or overlay
**When** I press Escape
**Then** the overlay closes
**And** focus returns to the trigger element

---

### Story 1.7: Screen Reader Compatibility

As a visitor using a screen reader,
I want proper ARIA landmarks and labels,
So that I can understand and navigate the content.

**Acceptance Criteria:**

**Given** I navigate with a screen reader
**When** I use landmark navigation
**Then** I can jump to main, nav, banner, and contentinfo regions
**And** all images have meaningful alt text
**And** all interactive elements have accessible names

**Given** automated a11y tests run
**When** jest-axe scans components
**Then** zero violations are reported

---

### Story 1.8: Responsive Design & Reduced Motion

As a visitor on any device,
I want the site to display perfectly and respect my motion preferences,
So that I have an optimal, comfortable experience.

**Acceptance Criteria:**

**Given** I view the site on mobile (320px-767px)
**When** the page renders
**Then** all content is readable without horizontal scroll
**And** touch targets are at least 44x44px

**Given** my system preference is reduce-motion
**When** animations would normally play
**Then** animations are disabled or minimized
**And** transitions are instant or very short

---

## Epic 2: Showcase de Proyectos

Visitantes exploran proyectos con interacciones fluidas, demos funcionales y código accesible. Demuestra capacidad técnica real.

### Story 2.1: Project Domain Migration

As a visitor,
I want to browse a list of featured projects reliably,
So that I can see the developer's portfolio of work.

**Acceptance Criteria:**

**Given** I navigate to the projects section
**When** the projects load
**Then** I see a grid/list of featured projects with thumbnails
**And** each project shows title and brief description
**And** project data is validated with Zod schema (TypeScript)

**Given** projects are loading
**When** the API request is in progress
**Then** I see skeleton placeholders (no layout shift)

---

### Story 2.2: Project Detail View

As a visitor,
I want to view detailed project information,
So that I can understand the technical depth and outcomes.

**Acceptance Criteria:**

**Given** I click on a project card
**When** the project detail loads
**Then** I see full description, technologies used, and outcomes
**And** images/screenshots display correctly
**And** the page has proper meta tags for SEO

**Given** I navigate directly to a project URL
**When** the page loads
**Then** SSR delivers the content for SEO
**And** the page is fully functional

---

### Story 2.3: Demo & Repository Links

As a visitor,
I want to access live demos and source code,
So that I can evaluate the actual work.

**Acceptance Criteria:**

**Given** I view a project with a live demo
**When** I click the demo link
**Then** the demo opens in a new tab
**And** the link has `rel="noopener noreferrer"`

**Given** I view a project with source code
**When** I click the repository link
**Then** GitHub repository opens in new tab
**And** link is keyboard accessible

**Given** a project has no demo or repo
**When** I view the project
**Then** the respective button is hidden (not disabled)

---

### Story 2.4: Project Filtering by Technology

As a visitor,
I want to filter projects by technology,
So that I can find relevant work quickly.

**Acceptance Criteria:**

**Given** I view the projects list
**When** I click a technology filter (e.g., "React")
**Then** only projects using that technology are displayed
**And** the filter state is reflected in the URL
**And** I can clear filters to see all projects

**Given** I apply multiple filters
**When** I view the results
**Then** projects matching ANY selected technology appear (OR logic)
**And** the active filters are clearly indicated

---

## Epic 3: Historia Profesional

Visitantes ven una trayectoria profesional creíble y bien presentada con timeline de experiencia laboral y educación.

### Story 3.1: Work History Timeline

As a visitor,
I want to view a professional work history timeline,
So that I can understand the developer's career progression.

**Acceptance Criteria:**

**Given** I navigate to the experience section
**When** the work history loads
**Then** I see jobs displayed in reverse chronological order
**And** each job shows company, role, and dates
**And** job-experience domain is migrated to TypeScript

**Given** the timeline renders
**When** I view on mobile
**Then** the timeline adapts to vertical layout
**And** all information remains readable

---

### Story 3.2: Role Details & Responsibilities

As a visitor,
I want to see detailed role information,
So that I can assess relevant experience depth.

**Acceptance Criteria:**

**Given** I view a job entry
**When** I expand or click for details
**Then** I see responsibilities and achievements
**And** technologies used in that role are listed
**And** the interaction is keyboard accessible

**Given** I view role details
**When** content is long
**Then** it's formatted for readability (bullets, spacing)

---

### Story 3.3: Academic Background

As a visitor,
I want to view academic credentials,
So that I can verify educational background.

**Acceptance Criteria:**

**Given** I navigate to the education section
**When** academic data loads
**Then** I see degrees, institutions, and graduation dates
**And** academic domain is migrated to TypeScript with tests

**Given** I view on any device
**When** the section renders
**Then** layout is responsive and readable

---

### Story 3.4: Certifications & Achievements

As a visitor,
I want to see certifications and achievements,
So that I can verify specialized skills.

**Acceptance Criteria:**

**Given** I view the credentials section
**When** certifications exist
**Then** I see certification name, issuer, and date
**And** verification links open in new tabs (if available)

**Given** no certifications exist
**When** the section would render
**Then** the section is gracefully hidden

---

## Epic 4: Descubrimiento de Contenido

Visitantes y buscadores descubren y leen artículos fácilmente. SEO optimizado para discovery orgánico.

### Story 4.1: Article Listing

As a visitor,
I want to browse published articles,
So that I can discover the developer's knowledge and expertise.

**Acceptance Criteria:**

**Given** I navigate to the articles section
**When** articles load
**Then** I see a list of articles with title, excerpt, and date
**And** articles are sorted by publication date (newest first)
**And** article domain is migrated to TypeScript

**Given** articles are loading
**When** the request is in progress
**Then** I see skeleton placeholders

---

### Story 4.2: Article Content Reading

As a visitor,
I want to read full article content,
So that I can learn from the developer's writing.

**Acceptance Criteria:**

**Given** I click on an article
**When** the article page loads
**Then** I see the full content with proper formatting
**And** code blocks have syntax highlighting
**And** reading time is displayed

**Given** I navigate directly to an article URL
**When** the page loads
**Then** SSR delivers content for SEO
**And** meta tags (title, description, og:image) are set

---

### Story 4.3: Social Sharing

As a visitor,
I want to share articles via social links,
So that I can recommend content to others.

**Acceptance Criteria:**

**Given** I view an article
**When** I click the Twitter/X share button
**Then** a share dialog opens with pre-filled text and URL

**Given** I view an article
**When** I click the LinkedIn share button
**Then** LinkedIn share dialog opens with the article URL

**Given** I click any share button
**When** the dialog opens
**Then** it opens in a popup (not leaving the page)
**And** buttons are keyboard accessible

---

### Story 4.4: SEO & Indexability

As a search engine,
I want to index portfolio content properly,
So that users can discover the portfolio via search.

**Acceptance Criteria:**

**Given** Googlebot crawls the site
**When** it accesses any page
**Then** it receives server-rendered HTML with content
**And** proper meta tags exist (title, description, canonical)

**Given** the site builds
**When** next-sitemap runs
**Then** sitemap.xml is generated with all public pages
**And** robots.txt allows indexing of public content

**Given** an article page
**When** rendered
**Then** JSON-LD Article schema is present
**And** Open Graph tags are complete

---

## Epic 5: Contacto Fácil

Visitantes pueden contactar fácilmente por su canal preferido (email, WhatsApp, Calendly, chat).

### Story 5.1: Email Contact Access

As a visitor,
I want to access email contact easily,
So that I can reach out for opportunities.

**Acceptance Criteria:**

**Given** I view the contact section
**When** I click the email link/button
**Then** my email client opens with pre-filled recipient
**And** the email address is visible (not hidden behind JS)

**Given** I'm on mobile
**When** I tap the email link
**Then** the native email app opens

---

### Story 5.2: WhatsApp Contact

As a visitor,
I want to contact via WhatsApp,
So that I can have a quick conversation.

**Acceptance Criteria:**

**Given** I view the contact section
**When** I click the WhatsApp button
**Then** WhatsApp opens with the correct number
**And** on mobile, the WhatsApp app opens
**And** on desktop, WhatsApp Web opens

**Given** the WhatsApp link
**When** rendered
**Then** it uses the wa.me format with country code

---

### Story 5.3: Calendly Scheduling

As a visitor,
I want to schedule a meeting via Calendly,
So that I can book time without back-and-forth emails.

**Acceptance Criteria:**

**Given** I want to schedule a meeting
**When** I click the Calendly button
**Then** the Calendly widget opens or I'm redirected
**And** I can see available time slots

**Given** Calendly embed fails to load
**When** the component renders
**Then** a fallback link to Calendly is displayed
**And** no error is thrown

---

### Story 5.4: Chat Panel Interaction

As a visitor,
I want to interact with a chat panel,
So that I can get quick information or feel engaged.

**Acceptance Criteria:**

**Given** I view any page
**When** I click the chat icon
**Then** the chat panel opens with smooth animation
**And** I can see predefined quick responses

**Given** the chat panel is open
**When** I press Escape or click outside
**Then** the panel closes
**And** focus returns to the trigger button

**Given** I use keyboard navigation
**When** I interact with chat
**Then** all controls are keyboard accessible
**And** focus is trapped within the panel when open

---

### Story 5.5: Copy Contact to Clipboard

As a visitor,
I want to copy contact information to clipboard,
So that I can paste it elsewhere easily.

**Acceptance Criteria:**

**Given** I view an email or phone number
**When** I click the copy button
**Then** the text is copied to clipboard
**And** I see visual feedback (toast or icon change)

**Given** I use keyboard
**When** I press Enter on the copy button
**Then** it copies and shows feedback

**Given** clipboard access is denied
**When** I try to copy
**Then** a fallback message is shown (select and copy manually)

---

## Epic 6: Mantenimiento Sostenible

Owner puede actualizar y desplegar el portfolio con confianza. CI/CD completo con quality gates.

### Story 6.1: Project Content Updates

As an owner,
I want to update project information easily,
So that my portfolio stays current with my latest work.

**Acceptance Criteria:**

**Given** I have a new project to add
**When** I create/edit project data in CMS/repo
**Then** the changes are reflected after deploy
**And** project schema validates the data

**Given** I update an existing project
**When** I modify description or technologies
**Then** only the changed content updates
**And** no other projects are affected

---

### Story 6.2: Article Publishing

As an owner,
I want to publish new articles,
So that I can share knowledge and improve SEO.

**Acceptance Criteria:**

**Given** I write a new article in markdown
**When** I add it to the articles directory/CMS
**Then** it appears in the articles list after deploy
**And** SEO meta tags are auto-generated

**Given** an article has a future publish date
**When** the site builds
**Then** the article is not visible until that date

---

### Story 6.3: Preview Changes

As an owner,
I want to preview changes before deploy,
So that I can verify content looks correct.

**Acceptance Criteria:**

**Given** I push changes to a PR branch
**When** Vercel detects the push
**Then** a preview deployment is created
**And** I receive a unique preview URL

**Given** I view the preview
**When** I test functionality
**Then** it behaves like production
**And** I can test on mobile via the preview URL

---

### Story 6.4: One-Command Deploy

As an owner,
I want to deploy updates with a single command,
So that updates are quick and reliable.

**Acceptance Criteria:**

**Given** changes are approved and merged to main
**When** the merge completes
**Then** Vercel auto-deploys to production
**And** the deploy is zero-downtime

**Given** I want to deploy manually
**When** I run `git push origin main` (or merge PR)
**Then** CI runs all quality gates
**And** deploy only proceeds if all checks pass

---

### Story 6.5: E2E Test Suite

As an owner,
I want end-to-end tests for critical paths,
So that I can deploy with confidence.

**Acceptance Criteria:**

**Given** CI runs on a PR
**When** E2E tests execute
**Then** Playwright tests critical user journeys:
- Homepage loads and profile displays
- Navigation works across all pages
- Theme toggle functions
- Contact methods are accessible

**Given** any E2E test fails
**When** CI reports results
**Then** the PR is blocked from merging
**And** failure details are visible in GitHub

---

### Story 6.6: Lighthouse Quality Gate

As an owner,
I want automated Lighthouse checks,
So that performance and accessibility don't regress.

**Acceptance Criteria:**

**Given** CI runs on a PR
**When** Lighthouse CI executes
**Then** it checks Performance (≥90) and Accessibility (≥95)
**And** results are posted to the PR

**Given** scores drop below thresholds
**When** results are reported
**Then** a warning is shown (non-blocking for MVP)
**And** specific issues are listed

---

## Epic 7: Technical Infrastructure & Maintenance

Hardening de la infraestructura técnica post-MVP. Este epic aborda la deuda técnica documentada en las retrospectivas de Epic 1-6, enfocándose en automated testing, test resilience, y documentation improvements.

**Origen:** Technical debt acumulado y documentado en retrospectivas.
**Filosofía:** No cambia UX, no agrega features visibles, reduce riesgo y mejora confiabilidad.

### Story 7.1: Automated Accessibility Testing

As a developer,
I want automated accessibility audits in CI,
So that accessibility regressions are caught before deploy.

**Acceptance Criteria:**

**Given** CI runs on a PR
**When** the E2E test stage executes
**Then** @axe-core/playwright runs accessibility audits
**And** violations are reported with severity levels
**And** critical violations fail the build

**Given** a component has accessibility violations
**When** the audit runs
**Then** specific elements and WCAG criteria are identified
**And** remediation guidance is provided in the report

**Given** the audit completes
**When** results are available
**Then** a summary is posted to the PR
**And** detailed report is available as CI artifact

**Technical Notes:**
- Integrates with existing Playwright E2E infrastructure (Story 6.5)
- Uses @axe-core/playwright for WCAG 2.2 AA compliance
- Addresses debt item from Epic 5-6 retrospectives

---

### Story 7.2: E2E Test Selector Resilience

As a developer,
I want E2E tests to use resilient selectors,
So that tests don't break when UI structure changes.

**Acceptance Criteria:**

**Given** an interactive element in the UI
**When** I write an E2E test for it
**Then** I use data-testid attribute for selection
**And** the selector is documented in a central registry

**Given** existing E2E tests use fragile selectors
**When** I migrate them
**Then** components are updated with data-testid attributes
**And** tests are updated to use new selectors
**And** no functionality is changed

**Given** a data-testid naming convention
**When** new testids are added
**Then** they follow the pattern: `{domain}-{component}-{element}`
**And** the pattern is documented in development-workflow.md

**Technical Notes:**
- Addresses viewport workaround debt from Epic 6 retrospective
- Establishes selector resilience pattern for future tests
- Follows testing architecture from Architecture.md

---

### Story 7.3: Test Quality Improvements

As a developer,
I want to fix flaky tests and improve test quality,
So that CI results are reliable and trustworthy.

**Acceptance Criteria:**

**Given** a test that uses arbitrary timeouts
**When** I refactor it
**Then** proper async assertions replace timeouts
**And** the test is deterministic

**Given** a test with weak assertions (always passes)
**When** I review it
**Then** assertions are strengthened to validate real behavior
**And** edge cases are covered

**Given** the test suite runs
**When** all tests complete
**Then** zero flaky tests are reported
**And** test execution time is under 30 seconds (unit tests)

**Technical Notes:**
- Addresses MEDIUM debt items from code reviews (Epic 5-6)
- Fixes: loading state tests, console.log assertions, timeout tests
- Follows TDD pragmatico pattern from retrospectives

---

### Story 7.4: Documentation Navigation

As a developer reading documentation,
I want navigation aids in long documents,
So that I can find information quickly.

**Acceptance Criteria:**

**Given** development-workflow.md (700+ lines)
**When** I open the document
**Then** a Table of Contents is present at the top
**And** TOC links navigate to correct sections
**And** section headers use consistent formatting

**Given** content-management.md
**When** I read it
**Then** cross-references to related docs work
**And** examples are complete and accurate

**Given** any documentation file
**When** I read it
**Then** code examples are syntax-highlighted
**And** commands are copy-pasteable

**Technical Notes:**
- Addresses LOW debt item from Epic 6 retrospective (docs lack TOC)
- Improves DX for future contributors
- Follows documentation standards from PRD

---

## Epic 8: Test Infrastructure Hardening

Consolidación y refinamiento de la infraestructura de testing para eliminar deuda técnica de accesibilidad y E2E. Enfocado en consistencia, predecibilidad y eliminación de duplicación.

**Origen:** Deuda técnica documentada en code reviews de Epic 7 (Stories 7.1, 7.3).
**Filosofía:** No cambia funcionalidad, no agrega cobertura nueva, reduce fricción y mejora confiabilidad del sistema de tests.

> **Scope Boundaries:**
> - Este epic NO introduce nuevos tests funcionales ni cobertura de features nuevas; se enfoca exclusivamente en consolidación y calidad de la infraestructura existente.
> - Epic 8 se considera completo cuando la infraestructura es consistente, predecible y sin duplicación significativa, no cuando alcanza perfección absoluta.

**Deuda a resolver:**

| ID | Issue | Origen | Prioridad |
|----|-------|--------|-----------|
| M2 | Serious violations not distinguished from others | Story 7.1 | MEDIUM |
| M3 | WCAG_TAGS missing `wcag22aa` tag | Story 7.1 | MEDIUM |
| M4 | Duplicate a11y tests across specs | Story 7.1 | MEDIUM |
| L1 | Unnecessary spread in withTags | Story 7.1 | LOW |
| L2 | Inconsistent waitForLoadState usage | Story 7.1 | LOW |
| L3 | WCAG_TAGS not exported | Story 7.1 | LOW |

---

### Story 8.1: A11y Test Consolidation

As a developer,
I want a unified accessibility testing strategy,
So that a11y tests are maintainable and not duplicated across specs.

**Acceptance Criteria:**

**Given** accessibility tests exist in multiple spec files
**When** I consolidate them
**Then** a single strategy is documented and implemented
**And** duplicate a11y checks are removed from individual specs
**And** the dedicated `accessibility.spec.ts` is the single source of a11y tests

**Given** the WCAG_TAGS constant
**When** I review the module
**Then** it is exported for test introspection
**And** unnecessary spread operators are removed

**Technical Notes:**
- Addresses M4, L1, L3 from Story 7.1 code review
- Consolidates to `e2e/accessibility.spec.ts` as authoritative source

---

### Story 8.2: WCAG 2.2 Full Coverage

As a developer,
I want complete WCAG 2.2 AA coverage in accessibility tests,
So that we catch all relevant accessibility violations.

**Acceptance Criteria:**

**Given** the axe-core configuration
**When** I review WCAG tags
**Then** `wcag22aa` is included alongside existing tags
**And** the configuration matches WCAG 2.2 Level AA requirements

**Given** an accessibility violation is detected
**When** the test reports it
**Then** serious violations are distinguished from moderate/minor
**And** filterSeriousViolations() utility exists if needed

**Technical Notes:**
- Addresses M2, M3 from Story 7.1 code review
- Aligns with NFR13 (WCAG 2.2 Level AA compliance)

---

### Story 8.3: E2E Test Consistency

As a developer,
I want consistent patterns across all E2E tests,
So that tests are predictable and easy to maintain.

**Acceptance Criteria:**

**Given** E2E tests use waitForLoadState
**When** I review them
**Then** usage is standardized to `networkidle` where appropriate
**And** the pattern is documented

**Given** any E2E test file
**When** I read it
**Then** it follows the established patterns from Story 7.2
**And** no arbitrary timeouts exist

**Technical Notes:**
- Addresses L2 from Story 7.1 code review
- Builds on patterns established in Story 7.2 (testid registry)

---

## Epic 9: Documentation & Developer Experience

Mejora de navegabilidad de documentación y experiencia de desarrollo. Enfocado en accesibilidad de contenido existente, no en reescritura.

**Origen:** Deuda técnica documentada en code reviews de Epic 7 (Stories 7.1, 7.4).
**Filosofía:** No altera contenido técnico existente, no cambia decisiones de arquitectura, mejora navegación y coherencia.

> **Scope Boundaries:**
> - Este epic NO reescribe contenido ni cambia decisiones técnicas; se limita a mejorar accesibilidad, navegación y coherencia de la documentación existente.
> - Epic 9 se considera completo cuando la documentación es navegable y consistente, no cuando está "perfecta".

**Deuda a resolver:**

| ID | Issue | Origen | Prioridad |
|----|-------|--------|-----------|
| M1 | Story code samples differ from implementation | Story 7.1 | MEDIUM |
| - | TOC incompleto (subsecciones no listadas) | Story 7.4 | MEDIUM |
| - | Header inconsistente (`## Manual Validation Checklist`) | Story 7.4 | MEDIUM |
| - | content-management.md sin TOC | Story 7.4 | LOW |
| - | Audit results usa "Many" vs conteo exacto | Story 7.4 | LOW |

---

### Story 9.1: Complete Documentation TOC

As a developer reading documentation,
I want complete and consistent Table of Contents,
So that I can navigate long documents efficiently.

**Acceptance Criteria:**

**Given** development-workflow.md has a TOC
**When** I review it
**Then** subsections (###) are included where helpful
**And** all headers follow consistent naming pattern (`## N. Title`)
**And** the `## Manual Validation Checklist` header is corrected to `### Manual Validation Checklist`

**Given** content-management.md (220+ lines)
**When** I open the document
**Then** a Table of Contents is present at the top
**And** TOC links navigate to correct sections

**Technical Notes:**
- Addresses TOC and header consistency items from Story 7.4 code review
- Applies criterion: docs >150 lines should have TOC

---

### Story 9.2: Story Template Alignment

As a developer,
I want story code samples to match actual implementation,
So that stories serve as accurate reference documentation.

**Acceptance Criteria:**

**Given** a completed story file with code samples
**When** I compare to actual implementation
**Then** code samples reflect the real implementation
**And** file paths in samples are accurate

**Given** future stories are created
**When** code samples are included
**Then** they are updated post-implementation if they diverged

**Technical Notes:**
- Addresses M1 from Story 7.1 code review
- May require review of stories 7.1-7.4 samples

---

### Story 9.3: Documentation Audit Precision

As a developer,
I want precise metrics in documentation audits,
So that audit results are verifiable and trustworthy.

**Acceptance Criteria:**

**Given** a documentation audit is performed
**When** results are recorded
**Then** exact counts replace vague terms ("Many" → "47")
**And** audit methodology is documented

**Given** future documentation changes
**When** they affect audited metrics
**Then** the audit table is updated accordingly

**Technical Notes:**
- Addresses precision item from Story 7.4 code review
- Improves traceability of documentation quality

---

## Epic 10: Runtime & UX Polish

Resolución de deuda técnica de runtime, accesibilidad y assets pendientes. Enfocado en polish final del sistema.

**Origen:** Deuda técnica documentada en Epic 9 retrospective + console analysis.
**Filosofía:** Fixes quirúrgicos, sin features nuevas, sin refactors grandes.

> **Scope Boundaries:**
> - Este epic resuelve issues específicos documentados en `technical-debt-backlog.md`
> - NO incluye nuevas features ni cambios de arquitectura
> - Prioridad: SERIOUS primero, luego LOW en orden de impacto

**Deuda a resolver:**

| ID | Issue | Severidad | Origen |
|----|-------|-----------|--------|
| ~~10.0~~ | ~~Hydration mismatch (ThemeButton)~~ | ~~HIGH~~ | ~~✅ Resuelto pre-epic~~ |
| 10.1 | Color contrast in dark mode | SERIOUS | axe-core E2E audit |
| 10.2 | Missing icons (Twitter, Dribbble) | LOW | Console warning |
| 10.3 | Font preload warning | LOW | Browser console |
| 10.4 | Favicon 404 | LOW | Network tab |

---

### Story 10.1: Dark Mode Color Contrast

As a user with visual impairments,
I want sufficient color contrast in dark mode,
So that I can read all content comfortably.

**Acceptance Criteria:**

**Given** the site is in dark mode
**When** axe-core accessibility audit runs
**Then** zero color-contrast violations are reported
**And** all text meets WCAG 2 AA minimum ratio (4.5:1 for normal text, 3:1 for large text)

**Given** I visually inspect dark mode
**When** I read text content
**Then** text is clearly readable against backgrounds

**Technical Notes:**
- Audit CSS variables in `globals.css` or theme config
- May need to adjust `--foreground`, `--muted`, `--accent` in dark mode
- Verify with `npm run test:e2e -- --grep "dark mode"`

---

### Story 10.2: Social Network Icon Mapping

As a visitor viewing social links,
I want all social network icons to display correctly,
So that I can identify each platform visually.

**Acceptance Criteria:**

**Given** a social link with provider "Twitter"
**When** the link renders
**Then** a Twitter/X icon displays (not QuestionIcon fallback)

**Given** a social link with provider "Dribbble"
**When** the link renders
**Then** a Dribbble icon displays (not QuestionIcon fallback)

**Given** I check browser console
**When** social links render
**Then** zero "Icon not found in iconMapping" warnings appear

**Technical Notes:**
- Add Twitter and Dribbble to `iconMapping` in SocialNetworkLink component
- Or update mock data to use existing icon names
- Location: `src/ui/molecules/SocialNetworkLink/` or similar

---

### Story 10.3: Font Preload Optimization

As a performance-conscious developer,
I want fonts to load efficiently without console warnings,
So that the site performs optimally and console stays clean.

**Acceptance Criteria:**

**Given** the site loads
**When** I check browser console
**Then** zero "preloaded with link preload was not used" warnings appear

**Given** fonts are needed
**When** they load
**Then** they load on first use without blocking render

**Technical Notes:**
- Review font configuration in `src/app/layout.tsx`
- Consider removing unused preload or lazy loading
- Verify with Lighthouse performance audit

---

### Story 10.4: Favicon Implementation

As a visitor with multiple browser tabs,
I want the site to have a favicon,
So that I can identify the tab visually.

**Acceptance Criteria:**

**Given** I visit the site
**When** I look at the browser tab
**Then** a favicon displays (not blank/default)

**Given** I check network requests
**When** the page loads
**Then** `/favicon.ico` returns 200 (not 404)

**Technical Notes:**
- Add `favicon.ico` to `/public/` directory
- Or configure in `app/layout.tsx` metadata
- Consider adding additional sizes (apple-touch-icon, etc.)

---

## Epic 11: Responsive Header & Navigation System

Definir, documentar e implementar un sistema coherente de layout responsivo para el header, incluyendo navegación, identidad, acciones y estados de transición. Este epic resuelve el comportamiento inconsistente del navbar que desaparece en ~1250px y deja estados intermedios confusos.

**Scope Boundaries:**
- ✅ Solo reglas, consistencia y estados
- ✅ Tests de layout por viewport
- ❌ No nuevas features
- ❌ No rediseño visual profundo

**Breakpoints Oficiales:**
| Nombre | Rango | Descripción |
|--------|-------|-------------|
| Mobile | ≤640px | Single column, burger menu |
| Tablet | 641-1024px | Transitional, selective collapse |
| Desktop | 1025-1440px | Full navigation visible |
| Wide | ≥1441px | All elements visible, expanded |

**Header Zones:**
1. **Brand zone** - Logo (centro visual)
2. **Primary navigation** - Home / About / Projects / Articles
3. **Social / Contact** - WhatsApp, Telegram, Twitter, LinkedIn, etc.
4. **Auth actions** - Google / Microsoft / LinkedIn
5. **UI controls** - Theme switcher
6. **Floating CTA** - "Hire me" (no responde a breakpoints normales)

---

### Story 11.1: Define Official Project Breakpoints

As a developer,
I want officially defined and documented breakpoints,
So that all responsive decisions are consistent across the codebase.

**Acceptance Criteria:**

**Given** the design system documentation
**When** I need to make responsive decisions
**Then** I can reference documented breakpoint definitions

**Given** Tailwind configuration
**When** I check theme.screens
**Then** custom breakpoints match documented values

**Given** any component using responsive styles
**When** I review the breakpoint used
**Then** it aligns with the official breakpoint names

**Technical Notes:**
- Document breakpoints in design system or architecture docs
- Update `tailwind.config.ts` with custom screen values if needed
- Consider CSS custom properties for non-Tailwind contexts
- Ensure no magic numbers in responsive styles

---

### Story 11.2: Map Header Zones and Component Structure

As a developer,
I want header zones clearly defined and mapped to components,
So that each zone has explicit responsibility and styling boundaries.

**Acceptance Criteria:**

**Given** the Header component
**When** I inspect its structure
**Then** each zone is clearly identifiable (Brand, Nav, Social, Auth, UI, CTA)

**Given** a header zone component
**When** I read its code
**Then** it has clear documentation of its role and visibility rules

**Given** the header layout
**When** rendered at any breakpoint
**Then** zones do not overlap or conflict visually

**Technical Notes:**
- Review current Header implementation in `src/ui/organisms/Header/`
- Create or refactor zone components if needed
- Document zone relationships in component comments or README
- Consider using CSS Grid or Flexbox explicitly per zone

---

### Story 11.3: Implement Visibility Rules per Breakpoint

As a visitor,
I want consistent navigation visibility at every screen size,
So that I never see "ghost" elements or missing navigation.

**Acceptance Criteria:**

**Given** the visibility rules matrix:
| Breakpoint | Nav | Social | Auth | Theme | Burger |
|------------|-----|--------|------|-------|--------|
| Mobile     | ❌  | ❌     | ❌   | ❌    | ✅     |
| Tablet     | ❌  | ❌     | ❌   | ✅    | ✅     |
| Desktop    | ✅  | ❌     | ❌   | ✅    | ❌     |
| Wide       | ✅  | ✅     | ✅   | ✅    | ❌     |

**When** I resize the browser to any breakpoint
**Then** elements show/hide according to the matrix

**Given** a breakpoint transition (e.g., 1024px → 1025px)
**When** the viewport crosses the boundary
**Then** visibility changes smoothly without intermediate states

**Given** any viewport width
**When** I inspect the header
**Then** no "orphan" or "floating" elements appear

**Technical Notes:**
- Use Tailwind responsive modifiers consistently (hidden, block, flex)
- Avoid arbitrary pixel breakpoints; use defined screen values
- Consider CSS `@container` queries if component-level control needed
- Test all transition points, not just static breakpoints

---

### Story 11.4: Refactor Header Layout Implementation

As a developer,
I want the Header component to implement the zone and visibility system,
So that the code is maintainable and consistent.

**Acceptance Criteria:**

**Given** the Header component code
**When** I review its structure
**Then** it follows the zone-based architecture from Story 11.2

**Given** the visibility rules from Story 11.3
**When** I trace the responsive classes
**Then** they match the documented rules exactly

**Given** the refactored header
**When** I run existing tests
**Then** all tests pass (or are updated to match new behavior)

**Given** the production site
**When** I compare before/after visually at each breakpoint
**Then** intentional changes are documented, regressions are fixed

**Technical Notes:**
- May require significant refactor of existing Header code
- Preserve existing functionality while improving structure
- Document any breaking changes in migration notes
- Consider feature flag for gradual rollout if needed

---

### Story 11.5: Playwright Viewport Tests for Header

As a developer,
I want automated tests that validate header visibility at each breakpoint,
So that layout regressions are caught automatically.

**Acceptance Criteria:**

**Given** the E2E test suite
**When** I run Playwright tests
**Then** header visibility tests execute for all defined breakpoints

**Given** a test for Mobile viewport (≤640px)
**When** the header renders
**Then** only Burger and Brand are visible; Nav, Social, Auth are hidden

**Given** a test for Wide viewport (≥1441px)
**When** the header renders
**Then** all zones are visible; Burger is hidden

**Given** a viewport transition test
**When** resizing from 1024px to 1025px
**Then** Nav becomes visible, Burger becomes hidden

**Technical Notes:**
- Create `e2e/header-responsive.spec.ts`
- Use `page.setViewportSize()` for each breakpoint
- Assert visibility with `toBeVisible()` / `toBeHidden()`
- Consider visual regression screenshots per breakpoint
- Reference Story 11.3 visibility matrix for assertions

---

### Story 11.6: Layout System Documentation

As a developer,
I want comprehensive documentation of the responsive layout system,
So that future changes maintain consistency.

**Acceptance Criteria:**

**Given** the project documentation
**When** I look for responsive guidelines
**Then** I find a clear document explaining the layout system

**Given** the documentation
**When** I read about header zones
**Then** each zone is described with its visibility rules

**Given** a new developer
**When** they need to modify header behavior
**Then** documentation provides clear guidance on how to do so correctly

**Technical Notes:**
- Add section to architecture.md or create dedicated layout-system.md
- Include visual diagrams of breakpoints and zones
- Document the visibility matrix from Story 11.3
- Explain rationale for design decisions
- Reference test files for validation approach

