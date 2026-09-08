# Development Guide

> Generated: 2026-01-15 | Project: portfolio-frontend-nextjs

## Prerequisites

| Requirement    | Version | Notes                       |
| -------------- | ------- | --------------------------- |
| Node.js        | 20.9.0+ | Use `.tool-versions` or nvm |
| npm            | 10.x+   | Comes with Node.js          |
| Docker         | Latest  | For database services       |
| Docker Compose | Latest  | Container orchestration     |

## Quick Start

### 1. Clone and Install

```bash
# Clone repository
git clone <repo-url>
cd portfolio-frontend-nextjs

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.template .env.local

# Edit .env.local with your values:
# - RESUME_URL
# - WEB_PORT
# - DB_PASSWORD, DB_USER, DB_NAME, DB_PORT
# - DB_ADMIN_USER, DB_ADMIN_PASSWORD, DB_ADMIN_PORT
# - CLIENT_ID, API_KEY (Google)
```

Uploaded article/project images are written to `.private/media` in local development and served back through `/media/...` routes.
Production keeps using Vercel Blob via `BLOB_READ_WRITE_TOKEN`.

### 3. Start the Local Stack

```bash
# Start PostgreSQL, app, and pgAdmin
make stack/up

# Skip pgAdmin when needed
STACK_WITH_DB_ADMIN=0 make stack/up

# Or using docker-compose directly
docker compose --profile app up -d db web db_admin
```

### 4. Start Development Server

```bash
# Start Next.js dev server (port 9000)
npm run dev
```

Open [http://localhost:9000](http://localhost:9000)

---

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start development server (port 9000) |
| `npm run build`    | Build for production                 |
| `npm run start`    | Start production server              |
| `npm run lint`     | Run ESLint                           |
| `npm run lint:fix` | Fix ESLint issues                    |
| `npm run format`   | Format with Prettier                 |
| `npm run test`     | Run Jest tests                       |
| `npm run seed`     | Seed database                        |

### Local admin bootstrap

```bash
npm run auth:bootstrap:local-admin
```

Creates or updates `admin@local.com` with password `123456` for local admin access. The email must also be included in `ADMIN_EMAILS`.

---

## Database Setup

### Start Database

```bash
make stack/up
```

### Get Database IP Address

```bash
make grab-db-ip-address
```

### Access pgAdmin

1. Go to `http://localhost:${DB_ADMIN_PORT}` (default: 5050)
2. Login with `DB_ADMIN_USER` / `DB_ADMIN_PASSWORD`
3. Register server with database IP from step above

### Prisma Commands

```bash
# Initialize Prisma
npx prisma init

# Run migrations
npx prisma migrate dev

# Generate client
npx prisma generate

# Seed database (via API)
# Visit: http://localhost:9000/api/seed
```

---

## Docker Development

### Full Stack with Docker

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop all services
docker-compose down
```

### Services

| Service  | Port | Description         |
| -------- | ---- | ------------------- |
| web      | 3000 | Next.js application |
| db       | 5432 | PostgreSQL database |
| db_admin | 5050 | pgAdmin interface   |

---

## Project Structure

```
src/
├── app/           # Pages (App Router)
├── domains/       # DDD domain modules
├── hooks/         # Custom hooks
├── lib/           # Utilities
├── providers/     # React providers
├── state/         # Redux state
├── styles/        # Global CSS
└── ui/            # Components (Atomic)
```

---

## Development Workflow

### Adding a New Domain

1. Create domain folder:

```
src/domains/new-domain/
├── model/
│   ├── index.js     # fetchAll, fetchById
│   ├── mock.js      # Mock data
│   └── schema.js    # Zod schema
├── queries/
│   ├── index.js     # Export hooks
│   ├── useNewDomain.js
│   └── useNewDomains.js
└── index.js         # Domain exports
```

2. Export from `src/domains/index.js`
3. Add hooks to `src/hooks/domains/index.js`

### Adding a New Component

1. Create component folder:

```
src/ui/{level}/{ComponentName}/
├── index.jsx        # Main component
├── styles.css       # Scoped styles (optional)
└── skeleton.jsx     # Loading state (optional)
```

2. Export from `src/ui/{level}/index.js`

### Adding a Redux Slice

1. Create slice folder:

```
src/state/slices/{sliceName}/
├── index.js         # Exports
├── slice.js         # createSlice
└── hooks.js         # Custom hooks (optional)
```

2. Add reducer to `src/state/ReduxStore.js`

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/ui/organisms/__tests__/Skills.test.jsx

# Watch mode
npm test -- --watch
```

### Test Structure

```
component/
├── index.jsx
├── __tests__/
│   └── Component.test.jsx
└── ...
```

### Testing Patterns

```jsx
// Component test example
import { render, screen } from "@testing-library/react";
import { ComponentName } from "./";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

---

## Code Quality

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Formatting

```bash
# Format all files
npm run format
```

### Pre-commit Hooks

Husky is configured to run on pre-push:

- `npm run lint`
- `npm run format`

---

## Import Aliases

| Alias           | Path                     |
| --------------- | ------------------------ |
| `@/app/*`       | `src/app/*`              |
| `@/domains/*`   | `src/domains/*`          |
| `@/hooks/*`     | `src/hooks/*`            |
| `@/lib/*`       | `src/lib/*`              |
| `@/providers/*` | `src/providers/*`        |
| `@/state/*`     | `src/state/*`            |
| `@/styles/*`    | `src/styles/*`           |
| `@/atoms/*`     | `src/ui/atoms/*`         |
| `@/molecules/*` | `src/ui/molecules/*`     |
| `@/organisms/*` | `src/ui/organisms/*`     |
| `@/overlays/*`  | `src/ui/overlays/*`      |
| `@/shared/*`    | `src/ui/shared/*`        |
| `@/buttons/*`   | `src/ui/atoms/buttons/*` |
| `@/icons/*`     | `src/ui/atoms/icons/*`   |
| `@/links/*`     | `src/ui/atoms/links/*`   |
| `@/texts/*`     | `src/ui/atoms/texts/*`   |
| `@/images/*`    | `public/images/*`        |

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 9000
lsof -ti:9000 | xargs kill -9
```

### Database Connection Issues

```bash
# Restart database container
docker-compose restart db

# Check database logs
docker-compose logs db
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Next.js Cache Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```
