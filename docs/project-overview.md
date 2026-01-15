# Project Overview

> Generated: 2026-01-15 | Mode: Exhaustive Scan

## Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | portfolio-frontend-nextjs |
| **Type** | Web Application (Portfolio) |
| **Status** | Brownfield (active development) |
| **Framework** | Next.js 14.2.33 |
| **Architecture** | DDD + Atomic Design |

## Purpose

A modern **personal portfolio website** showcasing:
- Professional profile and biography
- Work experience and education history
- Portfolio projects with demos/repositories
- Blog articles
- Contact methods (email, WhatsApp, Calendly, social networks)

## Key Features

### Implemented
- Responsive design with Tailwind CSS
- Dark/light theme toggle
- Animated page transitions (Framer Motion)
- Loading skeletons for async data
- Mobile-first navigation
- Social network integration
- Contact chat panel

### Planned
- Real API integration (Rails backend)
- i18n/Multi-language support
- Admin dashboard
- Analytics integration

## Tech Stack Summary

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 14, React 18 |
| **Styling** | Tailwind CSS 3.4 |
| **State (UI)** | Redux Toolkit |
| **State (Server)** | React Query v5 |
| **Validation** | Zod |
| **Animation** | Framer Motion |
| **Database** | PostgreSQL (Vercel Postgres) |
| **ORM** | Prisma |
| **Testing** | Jest + React Testing Library |
| **Containerization** | Docker + Docker Compose |

## Architecture Highlights

### Domain-Driven Design
- **11 bounded contexts** (profile, project, article, etc.)
- Each domain has model, schema, queries
- Mock-first development with real API support

### Atomic Design UI
- **120+ components** across 5 levels
- Atoms (77) → Molecules (27) → Organisms (13) → Overlays (2)
- Skeleton loading states included

### Hybrid State Management
- **Redux:** UI state (theme, menu, chat)
- **React Query:** Server state (domain data)
- Clear separation of concerns

## Quick Reference

### Key Directories

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js pages (App Router) |
| `src/domains/` | Business logic (DDD) |
| `src/ui/` | UI components (Atomic) |
| `src/state/` | Redux store and slices |
| `src/hooks/` | Custom React hooks |
| `src/providers/` | Context providers |
| `docs/` | Project documentation |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/layout.jsx` | Root layout with providers |
| `src/state/ReduxStore.js` | Redux store configuration |
| `src/lib/httpRequest/config.js` | API configuration |
| `tailwind.config.js` | Tailwind customization |
| `docker-compose.yml` | Container orchestration |

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 9000) |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `make start-db` | Start database containers |

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture](./architecture.md) | System design and patterns |
| [Source Tree](./source-tree-analysis.md) | Directory structure |
| [Component Inventory](./component-inventory.md) | UI component catalog |
| [Data Models](./data-models.md) | Domain schemas |
| [Development Guide](./development-guide.md) | Setup and workflow |
| [Technical Research](./technical-research-frontend-portfolio-site.yaml) | Detailed analysis |
| [PRD](./prd-frontend-portfolio-site.yaml) | Product requirements (draft) |

## Team Context

- **Owner:** Angel Thunder (AngelThunder)
- **Backend:** Rails API (separate repository)
- **Design System:** Custom Atomic Design
- **Methodology:** BMAD (Brownfield)
