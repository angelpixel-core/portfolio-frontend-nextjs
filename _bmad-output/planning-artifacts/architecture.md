---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns, step-06-structure, step-07-validation]
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

---

## Implementation Patterns & Consistency Rules

### Naming Patterns

**File Extensions (TypeScript Migration):**

| Type | Extension | Example |
|------|-----------|---------|
| React components | `.tsx` | `NavBar/index.tsx` |
| Hooks | `.ts` | `useProfile.ts` |
| Schemas | `.ts` | `schema.ts` |
| Utils/lib | `.ts` | `httpRequest.ts` |
| Config files | `.ts` | `jest.config.ts` |
| Tests | `.test.ts` / `.test.tsx` | `NavBar.test.tsx` |

**Component Structure:**
```
src/ui/organisms/NavBar/
├── index.tsx          # Main component
├── NavBar.test.tsx    # Tests (co-located)
├── styles.css         # Scoped styles (optional)
└── skeleton.tsx       # Loading state (optional)
```

**Domain Structure:**
```
src/domains/profile/
├── model/
│   ├── schema.ts      # Zod schema + types
│   ├── mock.ts        # Mock data
│   └── index.ts       # Model exports
├── queries/
│   ├── useProfile.ts  # React Query hook
│   └── __tests__/
│       └── useProfile.test.ts
└── index.ts           # Domain exports
```

### Import Path Patterns

**Path Aliases (tsconfig):**

| Alias | Path | Use For |
|-------|------|---------|
| `@/domains/*` | `src/domains/*` | Domain imports |
| `@/ui/*` | `src/ui/*` | Component imports |
| `@/lib/*` | `src/lib/*` | Utility imports |
| `@/store/*` | `src/store/*` | Redux imports |

**Import Order (ESLint enforced):**
1. React/Next.js imports
2. External packages
3. `@/` aliased imports
4. Relative imports
5. Type imports

### API & Data Patterns

**React Query Hook Pattern:**
```typescript
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
    staleTime: 5 * 60 * 1000,
  });
}
```

**Zod Validation Pattern:**
```typescript
// Schema defines both validation AND types
export const ProfileSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  email: z.string().email(),
});

export type Profile = z.infer<typeof ProfileSchema>;
```

### State Management Patterns

**Redux (UI State Only):**
- Theme mode
- Panel open/close states
- Clipboard states
- NO server data in Redux

**React Query (Server State Only):**
- All API data
- Caching and sync
- Loading/error states

### Error Message Patterns

| Context | Format | Example |
|---------|--------|---------|
| **User-facing** | Friendly, actionable | "No pudimos cargar tu perfil. Intenta de nuevo." |
| **Technical** | Detailed, loggable | `ApiError: GET /profile failed (500)` |
| **Validation** | Field-specific | "El email no es válido" |

### Test Patterns

**Unit Test Naming:**
```typescript
describe('ComponentName', () => {
  it('renders correctly', () => {});
  it('handles user interaction', () => {});
  it('displays error state', () => {});
});
```

**MSW Mock Pattern:**
```typescript
rest.get('/api/profile', (req, res, ctx) => {
  return res(ctx.json(mockProfile));
});
```

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow existing naming conventions (PascalCase components, camelCase hooks)
2. Use `.tsx` for React components, `.ts` for everything else
3. Co-locate tests or use `__tests__/` directory
4. Use path aliases (`@/`) instead of deep relative imports
5. Let React Query handle server state, Redux for UI only
6. Use Zod for all runtime validation
7. Never hardcode API URLs (use env vars)

**Pattern Verification:**
- ESLint rules enforce import order and naming
- TypeScript strict mode catches type violations
- PR reviews check pattern compliance

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
portfolio-frontend-nextjs/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
├── docs/                             # Project documentation
│   ├── index.md
│   ├── architecture.md
│   ├── component-inventory.md
│   ├── data-models.md
│   └── development-guide.md
├── e2e/                              # E2E tests (Playwright)
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   └── fixtures/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── assets/images/
│   └── fonts/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── articles/page.tsx
│   │   ├── projects/page.tsx
│   │   └── coming-soon/page.tsx
│   ├── domains/                      # DDD Bounded Contexts (11)
│   │   ├── profile/
│   │   │   ├── model/
│   │   │   │   ├── schema.ts
│   │   │   │   ├── mock.ts
│   │   │   │   └── index.ts
│   │   │   ├── queries/
│   │   │   │   ├── useProfile.ts
│   │   │   │   └── __tests__/
│   │   │   └── index.ts
│   │   ├── project/
│   │   ├── article/
│   │   ├── job-experience/
│   │   ├── academic/
│   │   ├── experience-stat/
│   │   ├── technology/
│   │   ├── contact-point/
│   │   ├── navigation-item/
│   │   ├── content/
│   │   └── customer/
│   ├── lib/                          # Shared utilities
│   │   ├── httpRequest/
│   │   └── utils/
│   ├── store/                        # Redux store (UI state)
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── chatPanel/
│   │       ├── menuPanel/
│   │       ├── themeMode/
│   │       └── emailClipboard/
│   ├── providers/                    # React providers
│   │   ├── RootProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── ui/                           # Atomic Design
│       ├── atoms/
│       ├── molecules/
│       ├── organisms/
│       ├── overlays/
│       └── shared/
├── .env.local
├── .env.example
├── jest.config.ts
├── jest.setup.ts
├── next.config.js
├── playwright.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Architectural Boundaries

**UI Layer:**
| Level | Responsibility | State Allowed |
|-------|----------------|---------------|
| `atoms/` | Primitivos, sin lógica | Props only |
| `molecules/` | Combinaciones simples | Local state minimal |
| `organisms/` | Secciones completas | Domain hooks allowed |
| `overlays/` | UI flotante | Redux state allowed |
| `shared/` | Cross-cutting | Error/Loading states |

**Domain Layer:**
| Directory | Responsibility | Imports Allowed |
|-----------|----------------|-----------------|
| `model/` | Schema + types | Zod only |
| `queries/` | Data fetching | React Query, model |
| `index.ts` | Public API | Re-exports only |

**State Boundaries:**
| Redux (UI) | React Query (Server) |
|------------|---------------------|
| themeMode | profile |
| menuPanel | projects |
| chatPanel | articles |
| emailClipboard | experiences, academics |

### FR to Structure Mapping

| FR Category | Primary Directory | Key Files |
|-------------|-------------------|-----------|
| Profile & Identity (FR1-4) | `domains/profile/`, `ui/organisms/Biography/` | `useProfile.ts` |
| Project Showcase (FR5-9) | `domains/project/`, `ui/organisms/FeaturedProject/` | `useProjects.ts` |
| Experience (FR10-13) | `domains/job-experience/`, `domains/academic/` | `useJobExperiences.ts` |
| Content Discovery (FR14-17) | `domains/article/`, `app/articles/` | `useArticles.ts` |
| Contact (FR18-22) | `domains/contact-point/`, `ui/overlays/` | `useContactPoints.ts` |
| Visual (FR23-27) | `store/slices/themeMode/`, `providers/` | `ThemeProvider.tsx` |

### Integration Points

**Data Flow:**
```
Component → useDomain hook → React Query → httpRequest → Rails API
              ↓
         Zod validation
              ↓
         Typed response
```

**External Integrations:**
| Integration | Implementation | Location |
|-------------|----------------|----------|
| Rails API | httpRequest + React Query | `lib/httpRequest/` |
| Calendly | Embed widget | `ui/organisms/` |
| Vercel | Deployment + Image optimization | `next.config.js` |

### New Files (MVP)

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | GitHub Actions pipeline |
| `e2e/*.spec.ts` | Playwright E2E tests |
| `playwright.config.ts` | Playwright configuration |
| `jest.setup.ts` | Jest + MSW setup |

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are compatible and work together:
- Next.js 14.2.33 + React 18.3.1 (official support)
- Tailwind CSS 3.4.18 (Next.js optimized)
- Redux Toolkit 2.9.2 + React Query 5.90.6 (no conflicts, different concerns)
- Jest 29 + Playwright (complementary testing layers)
- TypeScript strict mode (all libraries support)

**Pattern Consistency:**
- Naming: PascalCase components, camelCase hooks/utils
- Structure: Atomic Design + DDD maintained throughout
- Communication: React Query for data, Redux for UI

**Structure Alignment:**
- Project structure supports all architectural decisions
- Boundaries clearly defined (UI, domains, store, lib)
- Integration points mapped (httpRequest → API)

### Requirements Coverage ✅

**Functional Requirements:**

| Category | FRs | Status |
|----------|-----|--------|
| Profile & Identity | FR1-4 | ✅ Full |
| Project Showcase | FR5-9 | ✅ Full |
| Experience | FR10-13 | ✅ Full |
| Content Discovery | FR14-17 | ✅ Full |
| Contact | FR18-22 | ✅ Full |
| Visual Presentation | FR23-27 | ✅ Full |
| Content Management | FR28-31 | ⚠️ Backend |

**Non-Functional Requirements:**

| NFR | Status | Support |
|-----|--------|---------|
| Performance | ✅ | Lighthouse CI, SSR/SSG |
| Accessibility | ✅ | WCAG 2.2 AA, automated testing |
| Security | ✅ | JWT/Rodauth, env vars |
| Integration | ✅ | React Query + MSW |
| Reliability | ✅ | Error boundaries + retry |

### Implementation Readiness ✅

| Aspect | Status |
|--------|--------|
| Decisions documented | ✅ All with versions |
| Patterns defined | ✅ 7 mandatory rules |
| Structure complete | ✅ Full directory tree |
| Examples provided | ✅ Code samples |

### Gap Analysis

| Priority | Gaps Found |
|----------|------------|
| **Critical** | None |
| **Important** | Lighthouse CI config (document during setup) |
| **Nice-to-have** | More E2E examples (add during implementation) |

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context analyzed
- [x] Scale assessed (11 domains, 120+ components)
- [x] Constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] TypeScript migration strategy
- [x] Testing architecture
- [x] CI/CD pipeline
- [x] Error handling patterns

**✅ Implementation Patterns**
- [x] File naming conventions
- [x] Import path patterns
- [x] State management boundaries
- [x] Test patterns

**✅ Project Structure**
- [x] Complete directory tree
- [x] Layer boundaries
- [x] FR to structure mapping
- [x] New files identified

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
- Existing architecture is solid (DDD + Atomic Design)
- TypeScript migration is incremental (low risk)
- Testing strategy covers all layers
- CI/CD will enforce quality gates

**Areas for Future Enhancement:**
- PWA/Service Worker (Growth phase)
- i18n architecture (Vision phase)
- Design system as package (Vision phase)

### Implementation Handoff

**AI Agent Guidelines:**
1. Follow architectural decisions exactly as documented
2. Use implementation patterns consistently
3. Respect layer boundaries
4. Migrate TypeScript in specified order
5. Add tests alongside new/migrated code

**First Implementation Priority:**
1. `tsconfig.json` strict mode
2. `.github/workflows/ci.yml` pipeline
3. TypeScript migration: `src/domains/*/model/schema.ts`

