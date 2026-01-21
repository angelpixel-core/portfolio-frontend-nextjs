---
stepsCompleted: [step-01-validate-prerequisites]
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

{{requirements_coverage_map}}

## Epic List

{{epics_list}}

