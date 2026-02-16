# Folder Structure & Naming Conventions

> Version: 1.0 | Date: 2026-02-12 | Epic: 20 Story 1
> Status: Active — all new files MUST follow these conventions

---

## 1. Canonical Directory Tree

```
src/
├── app/                          # Next.js App Router (pages + layouts)
│   ├── about/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── articles/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── projects/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── coming-soon/
│   │   └── page.tsx
│   ├── __tests__/                # App-level tests
│   ├── error.tsx                 # Route error boundary
│   ├── global-error.tsx          # Root error boundary
│   ├── not-found.tsx             # 404 page
│   ├── layout.jsx                # ⚠️ Root layout (legacy .jsx)
│   ├── page.jsx                  # ⚠️ Root page (legacy .jsx)
│   ├── styles.css                # Global app styles
│   └── icon.svg
│
├── domains/                      # Domain-Driven Design modules
│   ├── academic/
│   ├── article/
│   ├── contact-point/
│   ├── content/
│   ├── customer/
│   ├── experience-stat/
│   ├── job-experience/
│   ├── navigation-item/
│   ├── profile/
│   ├── project/
│   └── technology/
│
├── ui/                           # Atomic Design components
│   ├── atoms/                    # Basic building blocks
│   │   ├── buttons/              # Button components
│   │   ├── icons/                # Icon components (57)
│   │   ├── links/                # Link components
│   │   ├── texts/                # Text/typography components
│   │   ├── motion/               # Framer Motion wrappers
│   │   ├── shadows/              # Shadow/visual effect components
│   │   ├── hocs/                 # ⚠️ Higher-order components (historical)
│   │   ├── ArticleHoverThumbnail/  # ⚠️ Uncategorized atom
│   │   └── index.ts              # Barrel (re-exports subcategories)
│   ├── molecules/                # Composite components
│   ├── organisms/                # Page-section components
│   ├── overlays/                 # Floating UI components
│   └── shared/                   # Shared UI utilities
│
├── state/                        # Redux state management
│   ├── slices/
│   │   ├── authPanel/
│   │   ├── chatPanel/
│   │   ├── menuPanel/
│   │   ├── themeMode/
│   │   ├── EmailClipboard/       # ⚠️ PascalCase (historical)
│   │   ├── __tests__/            # Shared slice tests
│   │   └── index.ts
│   ├── providers/                # State providers (React context wrappers)
│   │   ├── AuthProvider/
│   │   ├── ReactQueryProvider/
│   │   ├── ReduxProvider/
│   │   ├── ThemeProvider/
│   │   └── TransitionProvider/
│   ├── adapters/                 # State adapter implementations
│   │   └── redux/                # Redux-specific: store, hooks, provider
│   └── stores/                   # Store configurations
│       └── ReduxStore/
│
├── hooks/                        # Custom React hooks
│   ├── auth/                     # Auth-related hooks
│   ├── domains/                  # Domain query hook re-exports
│   ├── store/                    # Redux typed hooks
│   │   ├── AppDispatch/
│   │   └── AppSelector/
│   ├── ui/                       # UI behavior hooks
│   └── index.ts
│
├── providers/                    # Top-level providers
│   ├── LazyMotionProvider/
│   ├── RootProvider/
│   └── index.js                  # ⚠️ Legacy .js
│
├── lib/                          # Utility libraries
│   ├── httpRequest/              # ⚠️ camelCase (historical, should be http-request/)
│   ├── seo/
│   ├── social-urls/
│   ├── __tests__/
│   ├── createQueryHook.ts
│   ├── logger.ts
│   ├── queryConfig.ts
│   ├── actions.js                # ⚠️ Legacy .js
│   ├── index.js                  # ⚠️ Legacy .js
│   ├── suppressWarnings.js       # ⚠️ Legacy .js
│   └── utils.js                  # ⚠️ Legacy .js
│
├── config/                       # ⚠️ Alias target (@/conf/*) — directory does not exist yet
├── services/                     # External service integrations
│   └── auth/                     # Auth service layer
├── styles/                       # Global styles
└── test-utils/                   # Test helpers and mocks
    └── framer-motion-mock.ts
```

---

## 2. Layer Definitions

### App Layer (`src/app/`)

Next.js App Router pages and layouts. Follows Next.js file conventions.

| File | Purpose |
|------|---------|
| `page.tsx` | Route page component |
| `layout.tsx` | Route layout wrapper |
| `loading.tsx` | Loading UI (Suspense fallback) |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |

**Naming:** Lowercase folders matching URL segments. Dynamic segments use `[param]`.

### Domain Layer (`src/domains/`)

Domain-Driven Design bounded contexts. Each domain is self-contained.

```
domain-name/                      # kebab-case
├── model/
│   ├── index.ts                  # fetchAll(), fetchById()
│   ├── mock.ts                   # Development mock data
│   └── schema.ts                 # Zod schema + TypeScript types
├── queries/
│   ├── useDomainName.ts          # React Query hook
│   └── index.ts                  # Barrel export
└── index.ts                      # Domain barrel
```

**Current domains (11):** `academic`, `article`, `contact-point`, `content`, `customer`, `experience-stat`, `job-experience`, `navigation-item`, `profile`, `project`, `technology`

### UI Layer (`src/ui/`)

Atomic Design component hierarchy:

| Level | Location | Purpose | Example |
|-------|----------|---------|---------|
| **Atoms** | `ui/atoms/` | Smallest building blocks | Button, Icon, Link |
| **Molecules** | `ui/molecules/` | Simple component combinations | Experience, Calendar, CopyEmail |
| **Organisms** | `ui/organisms/` | Page sections | NavBar, Footer, Menu, ArticleCard |
| **Overlays** | `ui/overlays/` | Floating/modal UI | Floating, FloatingMobile |
| **Shared** | `ui/shared/` | Cross-cutting UI utilities | Shared components |

### State Layer (`src/state/`)

Redux Toolkit slices for UI state. React Query handles server state.

| Slice | Purpose |
|-------|---------|
| `authPanel` | Authentication panel state |
| `chatPanel` | Chat panel open/close |
| `menuPanel` | Mobile menu state |
| `themeMode` | Dark/light theme |
| `EmailClipboard` | Email copy state (⚠️ naming exception) |

### Hooks Layer (`src/hooks/`)

Custom React hooks organized by concern:

| Subdirectory | Purpose | Example |
|-------------|---------|---------|
| `auth/` | Authentication hooks | `useAuth`, `useAuthModal` |
| `domains/` | Domain query re-exports | Re-exports from domain queries |
| `store/` | Redux typed hooks | `AppDispatch/`, `AppSelector/` (sub-folders) |
| `ui/` | UI behavior hooks | `useMediaQuery`, `useClickOutside` |

### Lib Layer (`src/lib/`)

Utility functions, not React components. No JSX here.

### Providers Layer (`src/providers/`)

Top-level context providers that wrap the application.

---

## 3. Atom Subcategory Rules

Atoms are organized into lowercase **category folders**. Each category contains PascalCase **component folders**.

```
atoms/
├── buttons/                      # lowercase category
│   ├── ArrowButton/              # PascalCase component
│   ├── AuthButton/
│   ├── ChatButton/
│   ├── CopyButton/
│   ├── MenuButton/
│   ├── ThemeButton/
│   └── index.ts                  # Category barrel
├── icons/                        # lowercase category
│   ├── GitHubIcon/               # PascalCase component
│   ├── ReactIcon/
│   ├── LinkedInIcon/
│   └── index.ts                  # ⚠️ BARREL (57 exports — AVOID importing)
├── links/                        # lowercase category
│   ├── BaseLink/
│   ├── NavigationItemLink/
│   └── index.ts
├── texts/                        # lowercase category
│   ├── AnimatedTitle/
│   ├── ParagraphText/
│   └── index.ts
├── motion/                       # lowercase category
│   └── index.js
├── shadows/                      # lowercase category
│   ├── BoxShadow/
│   ├── FeaturedBoxShadow/
│   └── index.js
└── hocs/                         # ⚠️ Historical — utility wrappers, not true atoms
    ├── FramerImage/
    ├── History/
    ├── MainContainer/
    └── index.js
```

**Rules:**
- Category folders: **lowercase** (`buttons/`, `icons/`, `links/`, `texts/`, `motion/`, `shadows/`)
- Component folders inside categories: **PascalCase** (`ArrowButton/`, `GitHubIcon/`)
- New atom components MUST go inside a category — never directly under `atoms/`
- If no existing category fits, evaluate creating a new category or placing in an existing one

---

## 4. Component Folder Contents

### Standard Component Structure

Every component folder SHOULD contain:

```
ComponentName/                    # PascalCase
├── index.tsx                     # Main component (default export)
├── styles.css                    # Component-scoped styles (if needed)
├── skeleton.tsx                  # Loading state skeleton (if needed)
├── __tests__/
│   └── ComponentName.test.tsx    # Unit tests
└── ComponentName.types.ts        # Type definitions (if > 10 props or shared)
```

### File Descriptions

| File | Required | Purpose |
|------|----------|---------|
| `index.tsx` | YES | Main component with default export |
| `styles.css` | If needed | BEM-scoped styles (see Story 20.2 for rules) |
| `skeleton.tsx` | If needed | Suspense/loading fallback skeleton |
| `__tests__/ComponentName.test.tsx` | Recommended | Jest + RTL unit tests |
| `ComponentName.types.ts` | If complex | TypeScript interfaces when > 10 props or shared |

### Complex Components

Components with sub-components, variants, or utilities:

```
ComponentName/
├── index.tsx                     # Main component
├── SubComponent.tsx              # Named sub-component
├── AnotherSub.tsx
├── ComponentName.types.ts        # Shared types
├── styles.css
├── __tests__/
│   ├── ComponentName.test.tsx
│   └── SubComponent.test.tsx
├── utils/                        # Component-specific helpers
│   └── helper.ts
├── variants/                     # Component variants
│   ├── Featured.tsx
│   └── Grid.tsx
└── skeletons/                    # Multiple loading states
    └── VariantSkeleton.jsx
```

---

## 5. Naming Convention Rules

### Folder Naming

| Layer | Convention | Examples | Invalid |
|-------|-----------|----------|---------|
| **App routes** | lowercase | `about/`, `articles/`, `[slug]/` | `About/`, `Articles/` |
| **Domains** | kebab-case | `job-experience/`, `contact-point/` | `jobExperience/`, `ContactPoint/` |
| **UI components** | PascalCase | `ArrowButton/`, `NavBar/` | `arrowButton/`, `nav-bar/` |
| **Atom categories** | lowercase | `buttons/`, `icons/`, `links/` | `Buttons/`, `Icons/` |
| **State slices** | camelCase | `authPanel/`, `chatPanel/` | `AuthPanel/`, `auth-panel/` |
| **Hooks subdirs** | lowercase | `auth/`, `ui/`, `store/` | `Auth/`, `UI/` |
| **Lib modules** | kebab-case | `social-urls/`, `seo/` | `SocialUrls/`, `Seo/` |

> **Exception:** `httpRequest/` is camelCase (historical). New lib modules MUST use kebab-case.

### File Naming

| File Type | Convention | Examples | Invalid |
|-----------|-----------|----------|---------|
| **Component entry** | `index.tsx` | `index.tsx` | `Component.tsx`, `Index.tsx` |
| **Sub-component** | PascalCase | `ActionLinks.tsx`, `TechStackIcons.tsx` | `actionLinks.tsx` |
| **Styles** | `styles.css` | `styles.css` | `ComponentName.css`, `style.css` |
| **Skeleton** | `skeleton.tsx` | `skeleton.tsx` | `Skeleton.tsx`, `loading.tsx` |
| **Types** | `ComponentName.types.ts` | `ProjectCard.types.ts` | `types.ts`, `interfaces.ts` |
| **Tests** | `ComponentName.test.tsx` | `NavBar.test.tsx` | `test.tsx`, `navbar.test.tsx` |
| **Hook files** | `useHookName.ts` | `useMediaQuery.ts` | `MediaQuery.ts`, `use-media-query.ts` |
| **Domain model** | `index.ts` | `model/index.ts` | `model.ts` |
| **Domain schema** | `schema.ts` | `model/schema.ts` | `Schema.ts`, `types.ts` |
| **Domain mock** | `mock.ts` | `model/mock.ts` | `Mock.ts`, `mockData.ts` |

### File Extension Rules

| Rule | Extension | Use For |
|------|-----------|---------|
| **New React components** | `.tsx` | Any file with JSX |
| **New logic/utilities** | `.ts` | TypeScript without JSX |
| **NEVER for new files** | `.jsx`, `.js` | Legacy only — do not create new |
| **Styles** | `.css` | Component-scoped or global |

**Migration note:** 170 legacy `.jsx`/`.js` files exist. See Story 20.7 for migration plan.

---

## 6. Known Misplacements & Proposed Resolutions

These items are **documented for future correction**. Do NOT fix them in this story.

### Confirmed Misplacements

| # | Item | Current Location | Problem | Proposed Resolution | Priority |
|---|------|-----------------|---------|---------------------|----------|
| 1 | `hocs/` category | `src/ui/atoms/hocs/` | HOCs are utility wrappers, not atomic UI elements | Document as historical exception. Consider moving to `src/lib/hocs/` in a future cleanup epic | LOW |
| 2 | `skill/` folder | `src/ui/molecules/skill/` | Only lowercase component folder in entire UI layer (should be `Skill/`) | Rename to `Skill/` when touching this component | MEDIUM |
| 3 | `model/` in molecules | `src/ui/molecules/model/` | Contains only `schema.ts` — domain logic, not UI | Investigate purpose. If domain schema, move to appropriate domain. If unused, delete | MEDIUM |
| 4 | `ArticleHoverThumbnail/` | `src/ui/atoms/ArticleHoverThumbnail/` | Atom not in a subcategory folder | Evaluate: could go in a new `thumbnails/` category or existing `hocs/` | LOW |
| 5 | `EmailClipboard/` slice | `src/state/slices/EmailClipboard/` | PascalCase while other slices use camelCase | Rename to `emailClipboard/` when touching this slice | LOW |
| 6 | `httpRequest/` module | `src/lib/httpRequest/` | camelCase while lib convention is kebab-case | Rename to `http-request/` when touching this module | LOW |

### Legacy Files (not misplaced, but need migration)

| File | Current Extension | Target Extension |
|------|-------------------|------------------|
| `src/app/layout.jsx` | `.jsx` | `.tsx` |
| `src/app/page.jsx` | `.jsx` | `.tsx` |
| `src/providers/index.js` | `.js` | `.ts` |
| `src/lib/actions.js` | `.js` | `.ts` |
| `src/lib/utils.js` | `.js` | `.ts` |
| `src/lib/suppressWarnings.js` | `.js` | `.ts` |
| `src/lib/index.js` | `.js` | `.ts` |

---

## 7. Before/After Examples

### Example 1: Creating a New Atom (Button)

**WRONG:**
```
src/ui/atoms/shareButton.jsx        ← wrong: no folder, wrong case, wrong extension
```

**CORRECT:**
```
src/ui/atoms/buttons/ShareButton/
├── index.tsx                        ← PascalCase folder, .tsx extension
├── styles.css                       ← co-located styles
├── __tests__/
│   └── ShareButton.test.tsx         ← test matches component name
└── skeleton.tsx                     ← loading state (optional)
```

### Example 2: Creating a New Molecule

**WRONG:**
```
src/ui/molecules/user-card/
├── UserCard.tsx                     ← wrong: kebab-case folder, non-index entry
├── styles.module.css                ← wrong: CSS Modules not used in project
└── test.tsx                         ← wrong: test file naming
```

**CORRECT:**
```
src/ui/molecules/UserCard/
├── index.tsx                        ← PascalCase folder, index.tsx entry
├── UserCard.types.ts                ← types separate (if complex)
├── styles.css                       ← BEM scoped styles
├── __tests__/
│   └── UserCard.test.tsx            ← ComponentName.test.tsx
└── skeleton.tsx                     ← loading state
```

### Example 3: Creating a New Organism with Sub-components

**WRONG:**
```
src/ui/organisms/pricing-table/
├── main.tsx                         ← wrong: not index.tsx
├── row.tsx                          ← wrong: lowercase sub-component
├── types.ts                         ← wrong: should be PricingTable.types.ts
└── pricing-table.css                ← wrong: should be styles.css
```

**CORRECT:**
```
src/ui/organisms/PricingTable/
├── index.tsx                        ← default export main component
├── PricingRow.tsx                   ← PascalCase sub-component
├── PricingHeader.tsx                ← PascalCase sub-component
├── PricingTable.types.ts            ← ComponentName.types.ts
├── styles.css                       ← BEM scoped: .pricing-table__row--highlighted
├── __tests__/
│   ├── PricingTable.test.tsx
│   └── PricingRow.test.tsx
└── skeleton.tsx
```

---

## 8. Import Path Aliases

All import aliases are defined in `tsconfig.json`. Use aliases instead of relative paths.

### Direct Path Aliases (`/*`)

| Alias | Resolves To | Usage |
|-------|-------------|-------|
| `@/app/*` | `src/app/*` | App router file imports |
| `@/atoms/*` | `src/ui/atoms/*` | Direct atom component imports |
| `@/buttons/*` | `src/ui/atoms/buttons/*` | Direct button imports |
| `@/icons/*` | `src/ui/atoms/icons/*` | Direct icon imports (ALWAYS use this, not barrel) |
| `@/links/*` | `src/ui/atoms/links/*` | Direct link imports |
| `@/texts/*` | `src/ui/atoms/texts/*` | Direct text imports |
| `@/molecules/*` | `src/ui/molecules/*` | Direct molecule imports |
| `@/organisms/*` | `src/ui/organisms/*` | Direct organism imports |
| `@/overlays/*` | `src/ui/overlays/*` | Direct overlay imports |
| `@/domains/*` | `src/domains/*` | Domain model/query imports |
| `@/hooks/*` | `src/hooks/*` | Direct hook imports |
| `@/state/*` | `src/state/*` | Redux state imports |
| `@/lib/*` | `src/lib/*` | Utility imports |
| `@/conf/*` | `src/config/*` | Configuration imports (⚠️ target dir does not exist) |
| `@/services/*` | `src/services/*` | Service layer imports |
| `@/shared/*` | `src/ui/shared/*` | Shared UI utilities |
| `@/styles/*` | `src/styles/*` | Global style imports |
| `@/providers/*` | `src/providers/*` | Provider imports |
| `@/test-utils/*` | `src/test-utils/*` | Test helper imports |
| `@/images/*` | `public/images/*` | Static image imports |

### Barrel Aliases (re-export index files)

| Alias | Resolves To | Notes |
|-------|-------------|-------|
| `@/atoms` | `src/ui/atoms/index.ts` | Atoms barrel |
| `@/buttons` | `src/ui/atoms/buttons/index.ts` | Buttons barrel |
| `@/icons` | `src/ui/atoms/icons/index.ts` | **AVOID** — 57 exports, defeats tree-shaking |
| `@/links` | `src/ui/atoms/links/index.ts` | Links barrel (small, safe) |
| `@/texts` | `src/ui/atoms/texts/index.ts` | Texts barrel (small, safe) |
| `@/molecules` | `src/ui/molecules/index.ts` | Molecules barrel |
| `@/organisms` | `src/ui/organisms/index.ts` | Organisms barrel |
| `@/overlays` | `src/ui/overlays/index.ts` | Overlays barrel |
| `@/hooks` | `src/hooks/index.ts` | Hooks barrel |
| `@/providers` | `src/providers/index.ts` | Providers barrel |

---

## 9. Barrel File Rules (Summary)

> Full barrel file rules will be defined in Story 20.5 — Import & Barrel Rules (`./import-rules.md`, pending creation).

**Quick reference:**
- **NEVER** import from `@/icons` barrel — always use `@/atoms/icons/IconName`
- **AVOID** barrel imports for categories with > 15 exports
- **ALLOWED** for small barrels (< 10 exports): `@/buttons`, `@/links`, `@/texts`
- **ALWAYS** use direct path imports when performance matters

**Why:** The icons barrel (`index.ts`) re-exports 57 components. A single import from `@/icons` pulls ALL icons into the chunk (~50 KiB), defeating tree-shaking.

```typescript
// BAD — pulls entire icon barrel
import { GitHubIcon } from "@/icons";

// GOOD — imports only this icon
import GitHubIcon from "@/atoms/icons/GitHubIcon";
```

---

## Appendix: Current Codebase Metrics

| Metric | Value | Date |
|--------|-------|------|
| Total files in `src/` | 494 | 2026-02-12 |
| TypeScript files | 324 (65.6%) | |
| JavaScript files (legacy) | 170 (34.4%) | |
| `.tsx` files in `src/ui/` | 115 | |
| `.jsx` files in `src/ui/` | 138 | |
| Components with `styles.css` | 76 | |
| Skeleton files | 20 | |
| Barrel files | 8+ | |
| Domains | 11 | |
| Redux slices | 5 | |
| Custom hooks | 15+ | |
| Atom subcategories | 7 | |
