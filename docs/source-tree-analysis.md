# Source Tree Analysis

> Generated: 2026-01-15 | Scan Level: Exhaustive

## Project Root Structure

```
portfolio-frontend-nextjs/
├── src/                          # Main source code
│   ├── app/                      # Next.js App Router (pages)
│   ├── domains/                  # DDD domain modules
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities and HTTP client
│   ├── providers/                # React context providers
│   ├── state/                    # Redux state management
│   ├── styles/                   # Global CSS styles
│   └── ui/                       # Atomic Design components
├── docs/                         # Project documentation
├── public/                       # Static assets
├── _bmad/                        # BMAD methodology files
├── _bmad-output/                 # BMAD workflow outputs
├── Dockerfile.dev                # Development container
├── Dockerfile.prod               # Production container
├── docker-compose.yml            # Container orchestration
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind CSS config
├── next.config.js                # Next.js config
└── jest.config.cjs               # Jest testing config
```

## Source Directory Details

### `/src/app/` - Next.js App Router

Entry point for routing and page components.

```
app/
├── layout.jsx           # Root layout (RootProvider, NavBar, Footer)
├── page.jsx             # Home page (/)
├── styles.css           # Page-specific styles
├── about/               # /about route
├── articles/            # /articles route
├── projects/            # /projects route
├── coming-soon/         # /coming-soon route
└── __tests__/           # Page tests
```

**Key File:** `layout.jsx`
- Wraps entire app with `RootProvider`
- Includes `NavBar` and `Footer` globally
- Uses Montserrat font from Google Fonts
- Defines metadata for SEO

### `/src/domains/` - DDD Domain Modules

Business logic organized by domain following DDD patterns.

```
domains/
├── academic/            # Educational background
│   ├── model/           # Data access layer
│   │   ├── index.js     # fetchAll, fetchById
│   │   ├── mock.js      # Mock data
│   │   └── schema.ts    # Zod validation
│   ├── queries/         # React Query hooks
│   └── mutations/       # Data mutations (if any)
├── article/             # Blog articles
├── contact-point/       # Contact methods
├── content/             # Generic content
├── customer/            # Customer/client info
├── experience-stat/     # Experience statistics
├── job-experience/      # Work history
├── navigation-item/     # Nav menu items
├── profile/             # User profile
├── project/             # Portfolio projects
└── technology/          # Tech skills
```

**Pattern per Domain:**
1. `model/index.js` - CRUD operations with `fetchAll`, `fetchById`
2. `model/mock.js` - Mock data for development
3. `model/schema.js` - Zod schema for validation
4. `queries/` - React Query hooks (`useX`, `useXs`)

### `/src/ui/` - Atomic Design Components

UI components organized by complexity level.

```
ui/
├── atoms/               # Basic building blocks
│   ├── buttons/         # 8 button components
│   │   ├── ArrowButton/
│   │   ├── ChatButton/
│   │   ├── CopyButton/
│   │   ├── HireMeButton/
│   │   ├── MenuButton/
│   │   ├── NavigationItemButton/
│   │   ├── SkillSelectorButton/
│   │   └── ThemeButton/
│   ├── icons/           # 52 icon components
│   ├── links/           # 5 link components
│   ├── texts/           # 6 text components
│   ├── shadows/         # 2 shadow components
│   └── hocs/            # 4 higher-order components
├── molecules/           # 27 combined components
│   ├── Author/
│   ├── Education/
│   ├── Experience/
│   ├── FeaturedProject/
│   ├── Hero/
│   ├── Logo/
│   ├── NavigationItems/
│   ├── Skill/
│   ├── SocialNetworkLink/
│   └── ... (17 more)
├── organisms/           # 13 complex sections
│   ├── Academics/
│   ├── Biography/
│   ├── Chat/
│   ├── ExperienceStats/
│   ├── Experiences/
│   ├── Footer/
│   ├── Hiring/
│   ├── Menu/
│   ├── MenuFloating/
│   ├── NavBar/
│   ├── Skills/
│   └── ... (2 more)
├── overlays/            # 2 overlay components
│   ├── Floating/
│   └── FloatingMobile/
└── shared/              # Shared utilities
    └── skeletons/       # Loading skeletons
```

### `/src/state/` - Redux State Management

UI state management with Redux Toolkit.

```
state/
├── index.js             # Store exports
├── ReduxStore.js        # Store configuration
└── slices/
    ├── chatPanel/       # Chat open/close state
    ├── EmailClipboard/  # Email copy state
    ├── menuPanel/       # Mobile menu state
    └── themeMode/       # Light/dark theme
```

### `/src/hooks/` - Custom React Hooks

Aggregated hooks for easy imports.

```
hooks/
├── index.js             # Main export (store, ui, domains)
├── store/               # Redux hooks (useAppDispatch, useAppSelector)
├── ui/                  # UI-related hooks
└── domains/             # Domain hooks aggregator
    └── index.js         # Exports all useX hooks
```

### `/src/providers/` - React Context Providers

Provider hierarchy for the app.

```
providers/
├── index.js             # Exports RootProvider
├── RootProvider.jsx     # Main provider wrapper
├── ReduxProvider.jsx    # Redux store provider
├── ReactQueryProvider.jsx # React Query client
└── ThemeProvider.jsx    # Theme sync with Redux
```

### `/src/lib/` - Utilities

Shared utilities and HTTP client.

```
lib/
├── index.js
├── httpRequest/         # HTTP client
│   ├── index.js         # Main request function
│   └── config.js        # API URL configuration
└── suppressWarnings.js  # Console warning suppression
```

## Critical Integration Points

| From | To | Type |
|------|-----|------|
| `app/layout.jsx` | `providers/RootProvider` | Provider injection |
| `organisms/*` | `hooks/domains` | Data fetching |
| `domains/*/model` | `lib/httpRequest` | API calls |
| `organisms/*` | `state/slices/*` | UI state |
| `providers/ThemeProvider` | `state/slices/themeMode` | Theme sync |

## Entry Points

- **App Entry:** `src/app/layout.jsx`
- **API Entry:** `src/lib/httpRequest/index.js`
- **State Entry:** `src/state/ReduxStore.js`
- **Domain Entry:** `src/domains/index.js`
