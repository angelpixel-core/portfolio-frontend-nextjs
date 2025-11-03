# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# Start development server (runs on port 9000)
pnpm dev

# Or use Makefile
make web/start  # Also runs on port 9000
```

### Building
```bash
pnpm build
pnpm start  # Production server
```

### Code Quality
```bash
# Run linter
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Format code with Prettier
pnpm format
```

### Data Management

**Important**: This project does NOT have a local database or seed script for execution. The `pnpm seed` command exists in package.json but is not actively used.

For backend data structure reference, see: `./docs/seeds/backend.rb` - This Ruby/Rails seed file documents the data models and structure from the backend API.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: 
  - Redux Toolkit (client state)
  - React Query / TanStack Query (server state)
- **Validation**: Zod schemas
- **Backend Integration**: REST API via React Query (Rails backend)
- **Storage**: AWS S3 with presigned URLs
- **Animation**: Framer Motion
- **Package Manager**: pnpm

## Architecture Overview

### Core Architectural Principles

1. **Domain-Driven Design**: Business logic organized by domain entities
2. **Atomic Design Pattern**: UI components structured hierarchically
3. **Server State via React Query**: All backend communication through React Query hooks
4. **Mock-First Development**: Local development uses mock data, production uses backend API
5. **No Local Database**: All data comes from Rails backend API

### Project Structure

```
src/
├── app/              # Next.js 14 App Router
│   ├── layout.jsx    # Root layout with providers
│   ├── page.jsx      # Home page
│   ├── about/
│   ├── articles/
│   ├── projects/
│   └── coming-soon/
│
├── domains/          # Domain entities (DDD)
│   ├── profile/      # Hero/Profile data
│   ├── project/      # Portfolio projects
│   ├── article/      # Blog articles
│   ├── technology/   # Tech stack/skills
│   ├── job-experience/    # Work experience
│   ├── academic/     # Education/certifications
│   ├── navigation-item/   # Navigation links
│   ├── experience-stat/   # Statistics
│   ├── content/      # Page content
│   ├── customer/     # Companies/clients
│   └── contact-point/     # Contact info/social links
│
├── ui/               # Atomic Design components
│   ├── atoms/        # Basic elements (buttons, links, icons, texts)
│   ├── molecules/    # Simple combinations (Logo, AnimatedChildren)
│   ├── organisms/    # Complex components (NavBar, Menu, Footer)
│   ├── overlays/     # Modals and overlays
│   └── shared/       # Shared UI utilities
│
├── state/            # State management
│   ├── adapters/redux/  # Redux store
│   ├── providers/       # State providers
│   ├── slices/          # Redux slices
│   └── stores/          # Store configurations
│
├── lib/              # Utilities and helpers
│   ├── httpRequest/  # HTTP client with mock mode
│   ├── actions.js    # Server actions (WIP)
│   └── utils.js      # General utilities
│
├── hooks/            # Custom React hooks
│   ├── ui/           # UI-related hooks
│   └── store/        # State hooks
│
├── providers/        # Application providers
│   └── RootProvider/ # Wraps Redux + React Query + Theme
│
└── styles/           # Global styles and CSS modules

docs/
└── seeds/
    └── backend.rb    # Backend data structure reference (Rails seed file)
```

## Backend Data Structure Reference

The backend is built with **Ruby on Rails** and defines the following data models (documented in `docs/seeds/backend.rb`):

### Core Entities

**Site Module:**
- `Site::Application` - Application/site configuration
- `Site::Logo` - Site logo and branding
- `Site::Hero` - Profile/hero information (main user)
- `Site::Page` - Pages (landing, about, portfolio, blog)
- `Site::NavLink` - Navigation menu items
- `Site::AuthLink` - Authentication links
- `Site::ContactPoint` - Contact information and social links
  - Types: `:location`, `:messaging`, `:mail`, `:personal`, `:scheduling`, `:social`
  - Fields: name, icon_name, value, custom_styles, position, status
- `Site::Customer` - Companies/clients
- `Site::Experience` - Job experiences (linked to customers)
- `Site::Task` - Tasks/achievements within experiences (with tags)
- `Site::Academic` - Education and certifications
  - Related: `Portfolio::Knowledge` (with concepts)
  - Related: `Portfolio::Specialization` (with concepts)
- `Site::Technology` - Tech stack with positioning (x, y coordinates)
- `Site::Tag` - Technology tags
- `Site::Alert` - Site-wide alerts/announcements
- `Site::Event` - Calendar events

**Portfolio Module:**
- `Portfolio::Project` - Portfolio projects
  - Fields: title, summary, published_url, repository_url, featured, status, tags
- `Portfolio::Technology` - Technologies with proficiency levels
  - Proficiency: `roadmap`, `trainee`, `junior`, `middle`, `senior`
  - Fields: x, y (for visualization), years_of_experience
- `Portfolio::Concept` - General concepts/skills
- `Portfolio::Knowledge` - Educational knowledge areas
- `Portfolio::Specialization` - Specialized skills

**Blog Module:**
- `Blog::Article` - Blog articles
  - Fields: title, url, reading_time, published_at, summary, featured, status

**IAM Module:**
- `IAM::User` - User accounts
- `IAM::Account` - Authentication credentials

### Data Relationships

```
Application
  └─ Hero (Profile)
      ├─ ContactPoints (social, email, phone, etc.)
      ├─ Customers
      │   └─ Experiences
      │       └─ Tasks (with tags)
      ├─ Academics
      │   ├─ Knowledges → Concepts
      │   └─ Specializations → Concepts
      └─ Technologies (with x/y positioning)

Application
  ├─ Projects (with tags)
  ├─ Articles
  ├─ Pages
  ├─ NavLinks
  ├─ Alerts
  └─ Events
```

### Key Data Patterns

**Image/Avatar Paths:**
- Profile images: `@images/profile/{filename}`
- Customer logos: `@images/customers/{filename}`
- Project images: `@images/projects/{filename}`
- Article images: `@images/articles/{filename}`
- Icons: `@icons/{name}/index.svg`
- Public logos: `@public/{filename}`

**Status Enums:**
- Common statuses: `:active`, `:inactive`, `:pending`, `:published`, `:draft`

**ContactPoint Types:**
- Location: address, map
- Messaging: phone, whatsapp, telegram
- Mail: email
- Personal: resume
- Scheduling: calendar
- Social: github, linkedin, twitter, pinterest, dribbble

## Domain Architecture (DDD)

Each domain represents a business entity and follows this structure:

```
domain-name/
├── index.ts              # Barrel exports
├── model/
│   ├── index.js          # Domain model with API methods
│   ├── schema.js         # Zod validation schema
│   └── mock.js           # Mock data for local development
├── queries/
│   ├── useDomainName.js  # React Query hook
│   └── index.ts
├── mutations/            # React Query mutations (optional)
│   └── index.ts
└── components/           # Domain-specific components (optional)
```

### Domain Model Pattern

Each domain model exports methods like:
- `fetchAll()` - Get all records
- `fetchById(id)` - Get single record

The model handles the mock/API switch:

```javascript
async fetchAll({ useMockFallback = true } = {}) {
  if (useMockFallback) {
    console.warn("⚠️  Using mock data");
    return mockData;
  }
  
  try {
    return await httpRequest(ENDPOINT);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
```

### React Query Integration

Domains expose React Query hooks for data fetching:

```javascript
// domains/profile/queries/useProfile.js
const useProfile = (id, { enabled = !!id } = {}) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => model.fetchById(id),
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    suspense: true,
  });
};
```

### Creating Mock Data

When creating mock data in `domains/*/model/mock.js`, reference the backend structure documented in `docs/seeds/backend.rb`.

**Example for Profile domain:**

```javascript
// domains/profile/model/mock.js
export default [
  {
    nickname: "elvis",
    biography: "Hi, I'm Angel Szymczak...",
    avatar: {
      url: "/images/profile/hero.png"
    }
  }
];
```

**Example for ContactPoint domain:**

```javascript
// domains/contact-point/model/mock.js
export default [
  {
    name: "github",
    type: "social",
    value: "https://github.com/amazingdev",
    icon_name: "GitHub",
    custom_styles: "bg-primaryDarkGitHub dark:bg-primaryGitHub...",
    status: "active",
    position: 0
  },
  // ... more contact points
];
```

## Data Fetching Strategy

### Mock Mode (Local Development)

The HTTP client has a `USE_MOCKS` flag in `src/lib/httpRequest/index.js`:

```javascript
const USE_MOCKS = true;  // Set to false for production API
```

When enabled:
- All API calls are bypassed
- Domains return data from `model/mock.js`
- Console warnings indicate mock mode is active

### Production Mode

When `USE_MOCKS = false`:
- App communicates with Rails backend API
- React Query handles caching, refetching, and state
- API endpoints follow REST conventions

**Important**: There is NO local database (no PostgreSQL, no Prisma). All data persistence is handled by the Rails backend.

## Provider Hierarchy

Application providers wrap children in this order:

```jsx
<ReduxProvider>
  <ReactQueryProvider>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </ReactQueryProvider>
</ReduxProvider>
```

## Import Aliases

Extensive path aliasing configured in `jsconfig.json`:

**Domain & App:**
- `@/app` - App directory
- `@/domains` - Domain layer

**UI Components (Atomic Design):**
- `@/atoms`, `@/molecules`, `@/organisms`, `@/overlays` - UI layers
- `@/buttons`, `@/icons`, `@/links`, `@/texts` - Atom subcategories
- `@/shared` - Shared UI components

**Infrastructure:**
- `@/styles` - Styles
- `@/lib` - Utilities
- `@/hooks` - Custom hooks
- `@/providers` - Providers
- `@/state` - State management
- `@/images` - Public images directory

## Environment Variables

Copy `.env.template` to `.env.local`:

```bash
# Resume/Portfolio
RESUME_URL=

# Server
WEB_PORT=9000

# Google Sheets API (legacy - may not be in use)
CLIENT_ID=
API_KEY=
GOOGLE_SPREADSHEET_MACRO_ID=
```

**Note**: Database variables (`DB_*`) in `.env.template` are legacy and not used. This app communicates with a separate Rails backend service.

## Code Conventions

### Component Organization
- Components use CSS modules (e.g., `NavBar/styles.css`)
- Each component directory contains an `index.jsx` or `index.js`
- Atomic design hierarchy: atoms → molecules → organisms

### State Management
- **Server State**: React Query hooks in domain queries
- **Client State**: Redux slices in `src/state/slices`
- Domains own their data fetching logic

### File Extensions
- JSX/JS for application code
- TS for index/config files
- CSS for styles

## Git Hooks & Code Quality

Husky + lint-staged configured:
- **Pre-push**: Runs `pnpm lint` and `pnpm format`
- Staged files auto-linted and formatted

## BMAD Framework Integration

This project uses the **BMAD Method** (v6.0) - an AI-driven agile development framework with specialized agents and workflows.

### BMAD Directory Structure

```
bmad/
├── core/         # Core orchestration system
├── bmm/          # BMad Method Module (development lifecycle)
├── cis/          # Creative Intelligence Suite
├── bmb/          # BMad Builder Module
└── _cfg/         # Configuration and manifests
```

### Core Agents

#### Development Team (BMM Module)

**Product & Planning:**
- `@pm` (John) - Product Manager: Market research, user insights, roadmap prioritization
- `@analyst` (Mary) - Business Analyst: Requirements elicitation, competitive analysis
- `@sm` (Bob) - Scrum Master: Story preparation, sprint coordination

**Technical:**
- `@architect` (Winston) - System Architect: Technical design, architecture decisions
- `@dev` (Amelia) - Developer: Implementation, story execution
- `@tea` (Murat) - Test Architect: Test strategy, quality gates, CI/CD

**Design & Documentation:**
- `@ux-designer` (Sally) - UX Designer: User experience, interface design
- `@paige` (Paige) - Documentation Guide: Technical writing, API docs, knowledge curation

#### Creative Facilitation (CIS Module)

- `@brainstorming-coach` (Carson) - Elite brainstorming specialist
- `@design-thinking-coach` (Maya) - Human-centered design expert
- `@creative-problem-solver` (Dr. Quinn) - Systematic problem-solving
- `@innovation-strategist` (Victor) - Business model innovation
- `@storyteller` (Sophia) - Master narrative architect

#### Master Orchestrator (Core)

- `@bmad-master` (🧙) - BMad Master Executor: Workflow orchestration, knowledge custodian

### Invoking BMAD Agents

Load an agent by mentioning them with `@` prefix:

```
@bmad-master
@pm help me prioritize the product backlog
@architect review this component structure
@dev implement the user authentication story
@tea create a test strategy for this feature
```

### Common BMAD Commands

**Master Agent Menu:**
```
@bmad-master *help              # Show all available commands
@bmad-master *list-workflows    # List all workflows
@bmad-master *list-tasks        # List available tasks
@bmad-master *party-mode        # Multi-agent collaboration
```

**Development Workflows:**
```
@sm *workflow-init              # Initialize new project workflow
@pm *create-prd                 # Create Product Requirements Document
@architect *design-architecture # Architecture design workflow
@dev *implement-story          # Story implementation workflow
@tea *test-strategy            # Create test strategy
```

**Creative Workflows (CIS):**
```
@brainstorming-coach *brainstorm       # Brainstorming session
@design-thinking-coach *design-sprint  # Design thinking process
@innovation-strategist *innovate       # Innovation strategy session
```

### BMAD Configuration

User configuration in `bmad/core/config.yaml`:

```yaml
user_name: Angel DevStack
communication_language: Spanish
document_output_language: Spanish
output_folder: '{project-root}/docs'
```

### BMAD Scale-Adaptive System

BMAD automatically adjusts to project complexity (Levels 0-4):

- **Level 0-1**: Quick fixes, small features (Quick Spec Flow)
- **Level 2**: Medium features (PRD with optional architecture)
- **Level 3-4**: Large features, new systems (Full PRD + Architecture)

### Multi-Agent Collaboration (Party Mode)

For complex decisions, brainstorming, or strategic planning:

```
@bmad-master *party-mode
```

This engages all available agents (19+) in a group discussion.

## Development Workflow with BMAD

### Starting a New Feature

1. **Requirements Gathering**:
   ```
   @pm analyze requirements for [feature name]
   @analyst help me understand user needs
   ```

2. **Technical Planning**:
   ```
   @architect design the architecture for [feature]
   @sm create user stories for [feature]
   ```

3. **Implementation**:
   ```
   @dev implement story [story-id]
   @tea review test coverage
   ```

4. **Documentation**:
   ```
   @paige document this new API endpoint
   @ux-designer review user flows
   ```

### Problem Solving

```
@creative-problem-solver help me debug [issue]
@bmad-master *party-mode  # For complex architectural decisions
```

## Important Notes

- **No Local Database**: This project does NOT use PostgreSQL, Prisma, or any local database
- **Backend**: Rails API - data structure documented in `docs/seeds/backend.rb`
- **Mock Development**: Use `USE_MOCKS = true` for local development with mock data
- **Data Reference**: Always check `docs/seeds/backend.rb` for backend data structure
- **Language**: UI in English, BMAD agents communicate in Spanish (configurable)
- **Port**: Development server runs on port 9000

## Troubleshooting

**Mock data not appearing?**
- Check `USE_MOCKS = true` in `src/lib/httpRequest/index.js`
- Verify mock data exists in `domains/*/model/mock.js`
- Ensure mock data structure matches backend schema in `docs/seeds/backend.rb`

**React Query errors?**
- Ensure domain model methods handle errors properly
- Check `useMockFallback` parameter in model methods
- Verify query keys are unique

**BMAD agent not responding?**
- Load agent with `@` prefix first
- Check `bmad/core/config.yaml` exists
- Verify agent name in `bmad/_cfg/agent-manifest.csv`

**Need to understand backend data structure?**
- Review `docs/seeds/backend.rb` for complete data models
- Check field names, relationships, and enums
- Verify image/avatar path conventions

## Additional Resources

- [Next.js 14 App Router Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [BMAD Method Documentation](./bmad/bmm/README.md)
- [CIS Creative Suite](./bmad/cis/README.md)
- Backend Data Structure: `./docs/seeds/backend.rb`
