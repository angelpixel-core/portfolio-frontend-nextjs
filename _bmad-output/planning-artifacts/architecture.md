---
stepsCompleted: [step-01-init, step-02-context]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/research/technical-js-to-ts-migration-react-2026-01-18.md
  - _bmad-output/planning-artifacts/research/technical-nextjs-testing-strategies-2026-01-18.md
  - _bmad-output/planning-artifacts/research/technical-frontend-rails-api-integration-2026-01-18.md
  - _bmad-output/planning-artifacts/research/technical-mobile-first-css-2026-01-18.md
  - docs/architecture.md
  - docs/data-models.md
  - docs/component-inventory.md
workflowType: 'architecture'
project_name: 'portfolio-frontend-nextjs'
user_name: 'Angel DevStack'
date: '2026-01-21'
---

# Architecture Decision Document - portfolio-frontend-nextjs

**Author:** Angel DevStack
**Date:** 2026-01-21

_Este documento se construye colaborativamente a través de descubrimiento paso a paso. Las secciones se agregan a medida que trabajamos juntos en cada decisión arquitectónica._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
31 FRs en 7 capability areas, todas enfocadas en portfolio profesional que demuestre seniority técnico. El sistema ya implementa la mayoría de estas funcionalidades - el trabajo arquitectónico es evolución (TypeScript, testing) no creación.

| Área | FRs | Descripción |
|------|-----|-------------|
| Profile & Identity | FR1-4 | Perfil, bio, stack, links sociales |
| Project Showcase | FR5-9 | Proyectos, demos, repos, filtros |
| Experience & Credentials | FR10-13 | Timeline laboral, educación |
| Content Discovery | FR14-17 | Artículos, SEO |
| Contact & Engagement | FR18-22 | Email, WhatsApp, Calendly, chat |
| Visual Presentation | FR23-27 | Theme, responsive, a11y |
| Content Management | FR28-31 | CMS, preview, deploy |

**Non-Functional Requirements:**

| NFR | Target | Implicación Arquitectónica |
|-----|--------|----------------------------|
| Performance | Lighthouse ≥90, LCP <2.5s | SSR/SSG strategy, code splitting, image optimization |
| Accessibility | WCAG 2.2 AA, ≥95 | Component library con a11y built-in, testing a11y |
| Security | JWT/Rodauth | Auth flow architecture, token management |
| Integration | Rails API <5s timeout | Error boundaries, retry logic, MSW mocks |
| Reliability | 99.9% uptime | Error handling, graceful degradation |

**Scale & Complexity:**

- **Primary domain:** Web Application (Next.js 14 + Rails API)
- **Complexity level:** Low (brownfield, well-architected)
- **Existing components:** ~120 (migración, no creación)

### Technical Constraints & Dependencies

| Constraint | Impacto |
|------------|---------|
| **Brownfield** | Respetar arquitectura DDD+Atomic existente |
| **Solo developer** | Migración incremental, no big-bang |
| **Next.js 14 App Router** | Server Components, nuevo testing paradigm |
| **Rails/Rodauth** | JWT flow específico, no genérico |
| **Vercel** | Edge runtime constraints, deployment model |

### Cross-Cutting Concerns Identified

| Concern | Afecta | Estrategia |
|---------|--------|------------|
| **TypeScript Types** | Todos los archivos | Migración incremental, Zod inference |
| **Error Handling** | API, components, UI | Error boundaries, toast notifications |
| **Accessibility** | Todos los interactivos | Testing a11y en CI, semantic HTML |
| **Testing** | Todas las capas | Jest+RTL (unit), Playwright (E2E) |
| **Performance** | Bundle, rendering | Code splitting, SSG donde posible |

