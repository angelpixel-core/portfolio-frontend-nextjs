# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start dev server on port 9000
npm run build            # Production build (runs next-sitemap postbuild)
npm run lint             # ESLint check (strict: --max-warnings 0)
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Prettier format src/
npm run typecheck        # TypeScript check (tsc --noEmit)
npm run predeploy        # Full validation: lint + typecheck + test + build

# Testing
npm test                 # Run all Jest tests
npm test -- --watch      # Watch mode
npm test -- path/to/file.test.tsx  # Run single test file
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # Playwright with UI

# Content validation
npm run validate:content   # Validate all mock data
npm run validate:projects  # Validate project mock data only
npm run validate:articles  # Validate article mock data only

# Database (Docker required)
make start-db            # Start PostgreSQL + pgAdmin
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma client

# Docker (production image)
docker build -f Dockerfile.prod -t portfolio-prod .  # Build image (~177MB)
docker run -p 4000:4000 portfolio-prod               # Run on port 4000
```

## Architecture Overview

### Stack
- **Next.js 14** (App Router) + **React 18** + **TypeScript/JavaScript** (mixed)
- **Tailwind CSS 3** with custom breakpoints
- **Redux Toolkit** (UI state) + **React Query** (server state)
- **Framer Motion** (animations) + **Zod** (validation)
- **Jest** + **React Testing Library** (unit) + **Playwright** (E2E)

### Directory Structure
```
src/
├── app/           # Next.js App Router pages
├── domains/       # Domain-Driven Design modules (model/, queries/, schema)
├── ui/            # Atomic Design components
│   ├── atoms/     # Basic elements (buttons/, icons/, links/, texts/)
│   ├── molecules/ # Simple combinations
│   ├── organisms/ # Page sections (NavBar, Footer, Menu)
│   └── overlays/  # Floating UI
├── state/         # Redux slices (chatPanel, menuPanel, themeMode)
├── hooks/         # Custom hooks
└── providers/     # React context providers
```

### Import Aliases (tsconfig paths)
```typescript
@/atoms, @/molecules, @/organisms, @/overlays  // UI components
@/buttons, @/icons, @/links, @/texts           // Atom subcategories
@/domains/*, @/hooks, @/state/*, @/lib/*       // Core modules
@/conf/*, @/services/*, @/shared/*             // Config, services, shared UI
@/test-utils/*                                 // Test helpers
@/images/*                                     // public/images/
```

## Responsive Breakpoint System

**IMPORTANT**: This project has inverted legacy breakpoints. Use semantic breakpoints for new code:

| Breakpoint | CSS | Range | Usage |
|------------|-----|-------|-------|
| (base) | default | 0-399px | Small mobile (no prefix) |
| `phablet:` | min-width: 400px | 400-479px | Progressive typography (+10%) |
| `mobile:` | min-width: 480px | 480-639px | Progressive typography (+25%) |
| `tablet:` | min-width: 640px | 640-799px | Tablets |
| `nav:` | min-width: 800px | 800-1024px | Navigation transition |
| `stage:` | min-width: 960px | 960-1024px | Hero layout swap |
| `desktop:` | min-width: 1025px | 1025-1440px | Desktop |
| `wide:` | min-width: 1441px | 1441px+ | Wide screens |

**Progressive Typography**: `phablet:` and `mobile:` provide smooth font scaling on mobile devices (Story 14.15, ADR-002).

**Legacy breakpoints (DEPRECATED - max-width, inverted behavior):**
`sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `xs:` - These apply at or BELOW the breakpoint, opposite of standard Tailwind. See ADR-002 for migration guidance.

## CSS Patterns

### Component-Scoped Styles
Each component can have `index.jsx` + `styles.css` + `skeleton.jsx` (loading state).

### BEM Naming
CSS classes follow BEM: `.block__element--modifier`

### Theme Colors
```css
dark: #1b1b1b        light: #f5f5f5
primary: #B63E96     primaryDark: #58E6D9
```

## Domain Layer Pattern

Each domain in `src/domains/` follows:
```
domain-name/
├── model/
│   ├── index.ts    # fetchAll, fetchById functions
│   ├── mock.ts     # Development mock data
│   └── schema.ts   # Zod schema + TypeScript types
└── queries/
    └── useDomain.ts  # React Query hooks (use factory pattern)
```

Domains support `useMockFallback` parameter for mock-first development.

### Query Hook Factory Pattern

All React Query hooks use centralized factory functions from `src/lib/createQueryHook.ts`:

```typescript
// For fetching all items (useArticles, useProjects, etc.)
import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { Articles } from "../model/schema";

const useArticles = createFetchAllHook<Articles>({
  queryKey: "articles",
  fetchFn: () => model.fetchAll(),
});
export default useArticles;

// For fetching by id/slug (useArticle, useProject, etc.)
import { createFetchByIdHook } from "@/lib/createQueryHook";

const useArticle = createFetchByIdHook<Article, number>({
  queryKey: "article",
  fetchFn: (id) => model.fetchById(id),
});
export default useArticle;
```

**Cache Configuration** (`src/lib/queryConfig.ts`):
- `DEFAULT_STALE_TIME`: 5 minutes (data considered fresh)
- `DEFAULT_GC_TIME`: 10 minutes (inactive data garbage collected)

**Safety Guard**: `createFetchByIdHook` requires a truthy param to execute. The `enabled` option can only disable queries, never enable without a valid param.

## Testing Conventions

- Test files: `__tests__/*.test.tsx` or `__tests__/*.test.jsx`
- Jest config: `jest.config.cjs` (CommonJS)
- E2E tests: `e2e/*.spec.ts` (Playwright, **Chromium only**)
- Test IDs: `data-testid` attributes (centralized in `e2e/testids.ts`)
- Run specific domain validation: `npm run validate:projects`

## Critical E2E Flows

These flows MUST have E2E coverage. Do not merge PRs that break these tests.

| Flow | Test File | Description |
|------|-----------|-------------|
| Menu mobile navigation | `e2e/menu-autoclose.spec.ts` | Menu closes on nav click, reaches destination |
| Desktop navigation | `e2e/navigation.spec.ts` | Navbar links work, keyboard accessible |
| Theme persistence | `e2e/theme.spec.ts` | Toggle persists after page reload |
| Page transitions | `e2e/page-transitions.spec.ts` | Curtain animation completes correctly |
| Header visibility | `e2e/header-visibility.spec.ts` | Zones show/hide per breakpoint matrix |
| Menu overlay open/close | `e2e/menu-autoclose.spec.ts` | Menu/social links open and close correctly |
| Chat panel open/close | TBD | When chat E2E exists, reference here |
| Auth modal open/close | `e2e/auth.spec.ts` | Modal opens/closes, login/signup/OAuth flows, dropdown, logout, session persistence, a11y |

**Run before PR:** `npm run test:e2e`

**Why this matters:** Bug in Story 14-18 (menu not closing on navigation) was caught late because critical flow wasn't explicitly tracked. These tests prevent similar regressions.

## Process Rules

### HYBRID_EPIC Pattern

Hybrid epics combine multiple concerns (UX, refactor, bug fixes) in a single epic. Rules:

1. **When allowed:** Only when refactor directly unblocks UX or stability improvements
2. **Declaration:** Must be declared as HYBRID at epic kickoff with explicit split (value vs. enabling debt)
3. **Documentation:** Update `sprint-status.yaml` with comment explaining merge rationale
4. **Example:** Epic 17 (Code Quality) merged into Epic 14 (Projects & Articles) because both touched same files and momentum was high

**Why this pattern exists:** Separate "cleanup" epics tend to get indefinitely postponed. Merging strategic refactors with product work ensures they get done.

### Test-UI Synchronization Rule

**Principle:** A test that doesn't reflect current UI is technical debt, not protection.

When you change UI:
- Update snapshots when visual changes are intentional
- Update assertions when selectors/classes change (e.g., `.project-card__action-link--repo` → `--github`)
- Update mocks when APIs are renamed (e.g., `close` → `closeMenuPanel`)
- Commit test updates in the same PR as UI changes

**Why:** During Epic 14, UI components were updated but tests weren't synchronized, causing 30+ false failures. This rule prevents similar debt accumulation.

## State Management Split

| Type | Tool | Location | Example |
|------|------|----------|---------|
| UI State | Redux | `src/state/slices/` | menuPanel, themeMode, chatPanel |
| Server State | React Query | `src/domains/*/queries/` | useProjects, useArticles |

## Environment Variables

All configuration in `.env.template`. Key variables:

- `NEXT_PUBLIC_USE_MOCKS=true` — Mock-first development (default). Set to `false` to hit real API.
- Social identifiers (`NEXT_PUBLIC_GITHUB_USERNAME`, `NEXT_PUBLIC_LINKEDIN_USERNAME`, etc.) — Components build full URLs from usernames.
- `NEXT_PUBLIC_NAV_ITEMS` / `NEXT_PUBLIC_CUSTOMERS` — JSON arrays; leave empty for mock defaults.
- `PROFILE_EMAIL` — **Deprecated**, use `NEXT_PUBLIC_CONTACT_EMAIL`. CI sets `PROFILE_EMAIL=test@ci.local` to suppress warnings.

## CI/CD Pipeline

Three parallel jobs in `.github/workflows/ci.yml`:

| Job | Depends on | Blocking | Notes |
|-----|-----------|----------|-------|
| `quality` | — | Yes | lint + typecheck + unit tests |
| `e2e` | quality | Yes | Playwright (Chromium), uploads report on failure |
| `lighthouse` | quality | **No** (`continue-on-error`) | Performance audit, warning only |

**Install command**: `npm ci --legacy-peer-deps` (required due to peer dependency conflicts).

## Build & Performance Configuration

- **Browserslist**: Modern-only targets (Chrome 93+, Firefox 92+, Safari 15.4+, Edge 93+) — avoids legacy polyfills.
- **Next.js optimizations** (`next.config.js`):
  - `experimental.optimizePackageImports`: tree-shaking for framer-motion, react-query, zod, immer
  - `experimental.optimizeCss`: critical CSS extraction via Critters
  - `compiler.removeConsole` in production (keeps `warn`/`error`)
  - `productionBrowserSourceMaps: true`

### Performance Anti-pattern: Barrel Imports

**CRITICAL**: `@/atoms/icons/index.js` re-exports 58+ icons. Importing from the barrel (`@/icons`) pulls ALL icons into the chunk, defeating tree-shaking.

```typescript
// BAD — pulls entire icon barrel (~50 KiB)
import { GitHubIcon } from "@/icons";

// GOOD — imports only this icon
import GitHubIcon from "@/atoms/icons/GitHubIcon";
```

This applies to all barrel files, but the icons barrel is the most impactful.

## Key Files Reference

- `next.config.js` - CSP + security headers (`headers()`), build-time env validation, image/compiler config
- `tailwind.config.js` - Custom breakpoints and theme colors
- `docs/layout-system.md` - Header zone visibility matrix per breakpoint
- `docs/architecture.md` - Full system architecture diagram
- `docs/architecture/folder-structure.md` - Canonical folder structure, naming conventions, import rules
- `docs/architecture/styles-architecture.md` - CSS patterns, BEM naming, dark mode, breakpoints, @apply policy
- `docs/architecture/component-api.md` - Props typing, naming conventions, event handlers, state patterns, framer-motion rules
- `docs/architecture/test-conventions.md` - Test placement, templates, mock patterns, Jest/Playwright config
- `_bmad-output/` - BMAD methodology artifacts (planning, stories, retros)
