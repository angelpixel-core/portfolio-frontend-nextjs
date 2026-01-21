---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions]
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

---

## Starter Template Evaluation

### Primary Technology Domain

**Web Application (Next.js + Rails API)** - Proyecto brownfield existente

### Starter Options: N/A (Brownfield)

Este es un proyecto brownfield con arquitectura establecida. No se requiere starter template.

### Existing Technical Foundation

**Framework Stack:**

| Technology | Version | Status |
|------------|---------|--------|
| Next.js | 14.2.33 | ✅ Migrado a App Router |
| React | 18.3.1 | ✅ Actualizado |
| Tailwind CSS | 3.4.18 | ✅ Configurado |
| TypeScript | Partial | ⚠️ Migración pendiente |

**State Management:**

| Technology | Version | Purpose |
|------------|---------|---------|
| Redux Toolkit | 2.9.2 | UI State (theme, panels) |
| React Query | 5.90.6 | Server State (API data) |
| Zod | 3.25.76 | Runtime validation |

**Development Tools:**

| Technology | Version | Coverage |
|------------|---------|----------|
| Jest | 29.7.0 | Unit tests |
| React Testing Library | 14.1.2 | Component tests |
| Playwright | Pending | E2E tests (MVP) |
| ESLint | Configured | Linting |

**Architecture Patterns Established:**

- **Domain Layer:** DDD con 11 bounded contexts
- **UI Layer:** Atomic Design (atoms → organisms → overlays)
- **Data Flow:** React Query + Zod validation
- **Rendering:** Hybrid SSR/CSR via App Router

### Evolution Strategy (vs New Starter)

| Área | Acción |
|------|--------|
| **TypeScript** | Migración incremental `.js` → `.ts/.tsx` |
| **Testing** | Agregar Playwright, aumentar coverage |
| **CI/CD** | Configurar GitHub Actions pipeline |
| **Types** | Generar types desde Zod schemas existentes |

**Rationale:** Respetar arquitectura existente, evolucionar incrementalmente, no reescribir.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- TypeScript migration strategy
- Testing architecture
- CI/CD pipeline configuration

**Important Decisions (Shape Architecture):**
- Error handling patterns
- Code organization conventions

**Deferred Decisions (Post-MVP):**
- Service Worker / PWA
- i18n architecture
- Analytics integration

### TypeScript Migration

| Aspect | Decision |
|--------|----------|
| **Strategy** | Incremental Strict |
| **tsconfig** | `strict: true` desde inicio |
| **Priority** | Schemas → Hooks → Components |
| **Tooling** | `// @ts-check` comments para transición |

**Rationale:** Evitar deuda técnica, Zod inference ya provee types.

**Migration Order:**
1. `src/domains/*/model/schema.js` → `.ts` (Zod types)
2. `src/domains/*/queries/*.js` → `.ts` (React Query hooks)
3. `src/lib/**/*.js` → `.ts` (Utilities)
4. `src/ui/atoms/**` → `.tsx` (Simple components)
5. `src/ui/molecules/**` → `.tsx`
6. `src/ui/organisms/**` → `.tsx`
7. `src/app/**` → `.tsx` (Pages)

### Testing Architecture

| Layer | Technology | Scope |
|-------|------------|-------|
| **Unit** | Jest 29 + RTL 14 | Components, hooks, utils |
| **Integration** | Jest + MSW 2.x | API mocking, state flows |
| **E2E** | Playwright | Critical user journeys |
| **A11y** | jest-axe + @axe-core/playwright | Automated checks |

**Coverage Strategy:**
- MVP: Critical paths only (auth, navigation, core pages)
- Growth: 80% coverage target

**Test File Convention:**
```
src/
  domains/profile/
    queries/__tests__/useProfile.test.ts
  ui/organisms/NavBar/
    __tests__/NavBar.test.tsx
e2e/
  home.spec.ts
  navigation.spec.ts
```

### CI/CD Pipeline

| Stage | Tool | Trigger | Blocking |
|-------|------|---------|----------|
| **Lint** | ESLint + Prettier | Every push | Yes |
| **Types** | tsc --noEmit | Every push | Yes |
| **Unit Tests** | Jest | Every push | Yes |
| **E2E Tests** | Playwright | PR + main | Yes |
| **Lighthouse** | lighthouse-ci | PR + main | Warning |
| **Deploy Preview** | Vercel | PR | No |
| **Deploy Prod** | Vercel | main merge | Auto |

**GitHub Actions Workflow:**
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  quality:
    - lint
    - typecheck
    - test:unit
  e2e:
    needs: quality
    - test:e2e
  lighthouse:
    needs: quality
    - lighthouse-ci
```

### Error Handling Patterns

| Context | Pattern | Implementation |
|---------|---------|----------------|
| **API Errors** | Custom error types | `ApiError` class + toast |
| **Components** | Error Boundaries | Fallback UI per section |
| **Forms** | Zod validation | Field-level messages |
| **Network** | React Query retry | 3 retries + offline fallback |

**Error Boundary Strategy:**
```
<RootErrorBoundary>        // App-level crash
  <RouteErrorBoundary>     // Page-level errors
    <SectionErrorBoundary> // Component-level errors
```

### Decision Impact Analysis

**Implementation Sequence:**
1. `tsconfig.json` → strict mode enabled
2. `.github/workflows/ci.yml` → pipeline setup
3. `jest.config.js` + `playwright.config.ts` → testing infra
4. TypeScript migration → by priority order

**Cross-Component Dependencies:**
- TypeScript types flow from Zod schemas (single source of truth)
- Tests depend on MSW for API mocking (no real backend needed)
- CI enforces quality gates before merge (automated quality)
- Vercel handles deployment (zero-config deploy)

