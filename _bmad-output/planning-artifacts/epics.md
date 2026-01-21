---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories]
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

**Cobertura:** 31/31 FRs mapeados ✅

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

