# Architecture Documentation

> Generated: 2026-01-15 | Project: portfolio-frontend-nextjs

## Executive Summary

**portfolio-frontend-nextjs** is a modern portfolio website built with Next.js 14 (App Router), featuring:
- **Domain-Driven Design (DDD)** for data organization
- **Atomic Design** for UI components
- **Hybrid state management** with Redux (UI) + React Query (server)
- **Mock-first development** with easy switch to real API

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 14.2.33 |
| UI Library | React | 18.3.1 |
| Language | JavaScript/TypeScript | Mixed |
| Styling | Tailwind CSS | 3.4.18 |
| State (UI) | Redux Toolkit | 2.9.2 |
| State (Server) | React Query | 5.90.6 |
| Validation | Zod | 3.25.76 |
| Animation | Framer Motion | 10.18.0 |
| Database | PostgreSQL | via Vercel Postgres |
| ORM | Prisma | 5.22.0 |
| Testing | Jest | 29.7.0 |
| Testing Utils | React Testing Library | 14.1.2 |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   RootLayout                         │    │
│  │  ┌────────────────────────────────────────────────┐ │    │
│  │  │              RootProvider                       │ │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐       │ │    │
│  │  │  │ Redux    │ │ React    │ │ Theme    │       │ │    │
│  │  │  │ Provider │ │ Query    │ │ Provider │       │ │    │
│  │  │  └──────────┘ └──────────┘ └──────────┘       │ │    │
│  │  └────────────────────────────────────────────────┘ │    │
│  │  ┌────────┐ ┌────────────────────┐ ┌────────┐      │    │
│  │  │ NavBar │ │ AnimatedChildren   │ │ Footer │      │    │
│  │  └────────┘ │   (Page Content)   │ └────────┘      │    │
│  │             └────────────────────┘                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│   UI Components  │ │ Redux Store  │ │  React Query     │
│  (Atomic Design) │ │  (UI State)  │ │ (Server State)   │
├──────────────────┤ ├──────────────┤ ├──────────────────┤
│ atoms/           │ │ chatPanel    │ │ useProfile       │
│ molecules/       │ │ menuPanel    │ │ useProjects      │
│ organisms/       │ │ themeMode    │ │ useArticles      │
│ overlays/        │ │ emailClip    │ │ useExperiences   │
└──────────────────┘ └──────────────┘ └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer (DDD)                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ profile │ │ project │ │ article │ │ job-exp │  ...      │
│  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤           │
│  │ model/  │ │ model/  │ │ model/  │ │ model/  │           │
│  │ queries/│ │ queries/│ │ queries/│ │ queries/│           │
│  │ schema  │ │ schema  │ │ schema  │ │ schema  │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│      Mock Data           │     │    Backend Rails API     │
│   (Development Mode)     │     │   (Production Mode)      │
│   mock.js per domain     │     │   /api/v1/site/*         │
└──────────────────────────┘     └──────────────────────────┘
```

## Layer Responsibilities

### 1. Presentation Layer (`src/ui/`)

**Atomic Design hierarchy:**

| Level | Purpose | Example |
|-------|---------|---------|
| Atoms | Basic elements | `ThemeButton`, `GitHubIcon` |
| Molecules | Simple combinations | `Logo`, `NavigationItems` |
| Organisms | Page sections | `NavBar`, `Biography`, `Skills` |
| Overlays | Floating UI | `Floating`, `FloatingMobile` |

### 2. Application Layer (`src/app/`)

**Next.js App Router pages:**

| Route | Page | Main Organisms |
|-------|------|----------------|
| `/` | Home | Hero, Biography, ExperienceStats, Skills |
| `/about` | About | Biography, Experiences, Academics |
| `/projects` | Projects | ProjectCard list |
| `/articles` | Articles | FeaturedArticle list |
| `/coming-soon` | Placeholder | Coming soon message |

### 3. Domain Layer (`src/domains/`)

**11 bounded contexts:**

| Domain | Purpose | Key Data |
|--------|---------|----------|
| profile | User profile | nickname, bio, avatar, email |
| project | Portfolio work | title, summary, demo, repo |
| article | Blog posts | title, summary, image |
| job-experience | Work history | company, role, dates |
| academic | Education | institution, degree, dates |
| experience-stat | Stats | label, value (years, projects) |
| technology | Skills | name, icon, category |
| contact-point | Contact info | type, value, icon |
| navigation-item | Menu items | label, href, order |
| content | Generic content | type, body |
| customer | Clients | name, logo |

### 4. Infrastructure Layer

#### HTTP Client (`src/lib/httpRequest/`)

```javascript
// API URL construction
API_URL = `${BASE_HOST}:${BACKEND_PORT}/api/v1/site`

// Request pattern
httpRequest(endpoint, api_url?, options?) → Promise<JSON>
```

#### State Management

**Redux (UI State):**
- `chatPanel` - Chat open/close
- `menuPanel` - Mobile menu open/close
- `themeMode` - Light/dark theme
- `emailClipboard` - Email copied state

**React Query (Server State):**
- Caching with `staleTime` and `cacheTime`
- Automatic refetching
- Loading/error states

## Data Flow

### Reading Data

```
User Action
    │
    ▼
Organism Component
    │
    ├──[UI State]──► useAppSelector ──► Redux Store
    │
    └──[Data]──► useDomain Hook ──► React Query
                                         │
                                         ▼
                              Domain Model (fetchAll/fetchById)
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                  Mock Data (dev)              httpRequest (prod)
                         │                               │
                         └───────────────┬───────────────┘
                                         ▼
                              Zod Schema Validation
                                         │
                                         ▼
                              Return to Component
```

### Updating UI State

```
User Action (e.g., click theme button)
    │
    ▼
useAppDispatch()
    │
    ▼
dispatch(themeMode.toggle())
    │
    ▼
Redux Reducer
    │
    ▼
ThemeProvider syncs to document.documentElement.classList
```

## Key Design Decisions

### 1. Mock-First Development

All domains support `useMockFallback` parameter:
- `true` (default): Return mock data with simulated delay
- `false`: Call real backend API

This allows frontend development without backend dependency.

### 2. Zod Validation

All domain models have Zod schemas for:
- Runtime type validation
- TypeScript type inference
- Consistent data contracts

### 3. Separation of Concerns

| Concern | Location | Technology |
|---------|----------|------------|
| UI State | Redux | Small, focused slices |
| Server State | React Query | Caching, refetching |
| Data Access | Domains | Encapsulated models |
| Validation | Schemas | Zod |

### 4. Component-Scoped Styles

Each component can have:
- `index.jsx` - Component logic
- `styles.css` - Local CSS
- `skeleton.jsx` - Loading state

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase directory | `NavBar/index.jsx` |
| Hooks | camelCase with `use` prefix | `useProfile.js` |
| Slices | camelCase | `themeMode/slice.js` |
| Schemas | PascalCase with `Schema` suffix | `ProfileSchema` |
| Types | PascalCase | `Profile` (inferred from Zod) |

## Testing Strategy

- **Jest** for unit tests
- **React Testing Library** for component tests
- Tests located in `__tests__/` directories
- Pattern: `*.test.js` or `*.test.jsx`

## Deployment Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────►│  Rails API  │────►│ PostgreSQL  │
│  Frontend   │     │  Backend    │     │  Database   │
│  (Vercel)   │     │  (TBD)      │     │  (Vercel)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Local Development:**
- Docker Compose with web, db, db_admin services
- Hot reload enabled
- Port 9000 (Next.js dev server)
