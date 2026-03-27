# Portfolio Frontend Documentation Index

> Master Index for AI-Assisted Development
> Generated: 2026-01-15 | Scan Level: Exhaustive

---

## Project Overview

|                      |                                    |
| -------------------- | ---------------------------------- |
| **Type**             | Monolith - Next.js Web Application |
| **Primary Language** | JavaScript/TypeScript              |
| **Architecture**     | DDD + Atomic Design                |
| **Framework**        | Next.js 14.2.33                    |
| **Status**           | Brownfield (Active Development)    |

---

## Quick Reference

| Category       | Technology    | Version |
| -------------- | ------------- | ------- |
| Framework      | Next.js       | 14.2.33 |
| UI Library     | React         | 18.3.1  |
| Styling        | Tailwind CSS  | 3.4.18  |
| State (UI)     | Redux Toolkit | 2.9.2   |
| State (Server) | React Query   | 5.90.6  |
| Validation     | Zod           | 3.25.76 |
| Animation      | Framer Motion | 10.18.0 |
| Testing        | Jest          | 29.7.0  |

**Entry Point:** `src/app/layout.jsx`
**Architecture Pattern:** Component-based with DDD domains

---

## Generated Documentation

### Core Documents

- [Project Overview](./project-overview.md) - Executive summary and quick reference
- [Architecture](./architecture.md) - System design, patterns, data flow
- [Layout System](./layout-system.md) - Responsive breakpoints and header zones
- [Source Tree Analysis](./source-tree-analysis.md) - Annotated directory structure
- [Component Inventory](./component-inventory.md) - Complete UI component catalog
- [Data Models](./data-models.md) - Domain schemas and data access patterns
- [Development Guide](./development-guide.md) - Setup, commands, workflow
- [Development Workflow](./development-workflow.md) - Branching strategy, TDD flow, CI rules
- [Content Management](./content-management.md) - How to add/update projects and articles
- [Vercel Deployment](./deployment/vercel.md) - End-to-end deployment procedure

### Architecture Documentation

- [Z-Index Scale](./architecture/z-index-scale.md) - Layering rules and conflict guidance

### Existing Documentation

- [Technical Research](./technical-research-frontend-portfolio-site.yaml) - Detailed technical analysis (stable-v1)
- [PRD](./prd-frontend-portfolio-site.yaml) - Product requirements document (draft)

### Release Documentation

- [Pre-Release Checklist](./release/pre-release-checklist.md) - Legacy release checklist (static/mock-first)
- [Production Readiness Audit](./release/production-readiness-audit.md) - Deep audit with P0/P1/P2 findings
- [DevOps IaC Requirements](./release/devops-iac-requirements.md) - Vercel/Azure requirements for provisioning
- [Technical Debt Backlog](./release/technical-debt-backlog.md) - Prioritized epics/stories with estimates
- [Deployment Work Items Template](./release/deployment-work-items-template.md) - Azure DevOps/Jira-ready work items with dependencies
- [Terraform Variables Template](./release/terraform.tfvars.example) - IaC variable baseline for environment files
- [Bicep Parameters Template](./release/main.parameters.example.json) - Azure deployment parameter baseline

---

## Key Entry Points

### For UI Development

- Start with [Component Inventory](./component-inventory.md)
- Reference [Source Tree](./source-tree-analysis.md) for `src/ui/` structure
- Follow Atomic Design patterns (atoms → molecules → organisms)

### For Data/API Development

- Start with [Data Models](./data-models.md)
- Reference domain structure in [Source Tree](./source-tree-analysis.md)
- Check API config in `src/lib/httpRequest/config.js`

### For State Management

- Redux slices: `src/state/slices/` (UI state only)
- React Query hooks: `src/hooks/domains/` (server state)
- See [Architecture](./architecture.md) for data flow diagrams

### For New Features

- Read [Architecture](./architecture.md) for system patterns
- Follow [Development Guide](./development-guide.md) for adding domains/components
- Check [Technical Research](./technical-research-frontend-portfolio-site.yaml) for recommendations

---

## Project Statistics

| Metric        | Count |
| ------------- | ----- |
| Domains (DDD) | 11    |
| UI Components | 120+  |
| Redux Slices  | 4     |
| Routes        | 5     |
| Zod Schemas   | 11    |

---

## Getting Started

```bash
# Quick start commands
npm install
cp .env.template .env.local
make start-db
npm run dev
```

Open [http://localhost:9000](http://localhost:9000)

See [Development Guide](./development-guide.md) for full setup instructions.

---

## AI Agent Instructions

When working on this codebase:

1. **UI Changes:** Reference [Component Inventory](./component-inventory.md) for existing components
2. **Data Layer:** Follow patterns in [Data Models](./data-models.md)
3. **New Features:** Check [Architecture](./architecture.md) for system design
4. **Technical Decisions:** Consult [Technical Research](./technical-research-frontend-portfolio-site.yaml)

**Import Conventions:**

```javascript
// Components
import { NavBar, Footer } from "@/organisms";
import { Logo, Hero } from "@/molecules";
import { ThemeButton } from "@/buttons";
import { GitHubIcon } from "@/icons";

// Data hooks
import { useProfile, useProjects } from "@/hooks";

// State
import { useAppDispatch, useAppSelector } from "@/hooks";
```

---

## Documentation Metadata

| Field      | Value                                                  |
| ---------- | ------------------------------------------------------ |
| Generated  | 2026-01-15                                             |
| Scan Mode  | initial_scan                                           |
| Scan Level | exhaustive                                             |
| Workflow   | document-project                                       |
| State File | [project-scan-report.json](./project-scan-report.json) |
