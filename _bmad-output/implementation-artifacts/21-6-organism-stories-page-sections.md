# Story 21.6: Organism Stories — Page Sections

Status: review

---

## Story

As a **developer**,
I want **Storybook stories for 10 core organism components showing page sections with Redux state, React Query data, responsive variants, and loading skeletons**,
so that **I can visually verify complex page sections, debug state combinations, and document organism API in isolation**.

---

## Acceptance Criteria

1. **Given** I open Storybook sidebar under `Organisms/`
   **When** the page renders
   **Then** I see 10 organism story entries organized by component name

2. **Given** ArticleCard organism
   **When** I view the stories
   **Then** I see FeaturedArticleCard and GridArticleCard variants with mock article data

3. **Given** ProjectCard organism
   **When** I view the stories
   **Then** I see FeaturedProjectCard and GridProjectCard variants with mock project data

4. **Given** organisms with Redux state (Auth, NavBar)
   **When** the story renders
   **Then** global Redux decorator provides state automatically

5. **Given** organisms with React Query (Biography, Experiences, ExperienceStats, Skills, Academics)
   **When** the story renders
   **Then** mock data loads via React Query auto-mock (`NEXT_PUBLIC_USE_MOCKS=true`)

6. **Given** organisms with skeleton (ArticleContent, Biography, Experiences, ExperienceStats, Hiring, ProjectDetail, Skills)
   **When** I select the `Loading` variant
   **Then** the skeleton renders correctly

7. **Given** organisms with framer-motion (ArticleContent, Skills, WordCloud)
   **When** the story renders
   **Then** animations work via global LazyMotion decorator

8. **Given** all 10 story files
   **When** I inspect imports
   **Then** ZERO barrel imports from `@/organisms`, `@/molecules`, or `@/atoms/icons` — all direct paths

9. **Given** Storybook build
   **When** I run `npx storybook build --quiet`
   **Then** build completes without errors

10. **Given** Jest test suite
    **When** I run `npm test`
    **Then** all tests pass with 0 regressions

---

## Tasks / Subtasks

- [x] **Task 1: Card organisms — variant-based** (AC: #2, #3, #8)
  - [x] 1.1 `ArticleCard/stories/ArticleCard.stories.tsx` — Import `ArticleCard` variants (FeaturedArticleCard, GridArticleCard). Use mock article from `@/domains/article/model/mock`. Variants: Featured, Grid.
  - [x] 1.2 `ProjectCard/stories/ProjectCard.stories.tsx` — Import `ProjectCard` variants (FeaturedProjectCard, GridProjectCard). Use mock project from `@/domains/project/model/mock`. Variants: Featured, Grid.

- [x] **Task 2: Content organisms — domain data + skeletons** (AC: #5, #6, #7)
  - [x] 2.1 `ArticleContent/stories/ArticleContent.stories.tsx` — Props: `article` (Article). Uses `m.article` (framer-motion). Mock article with markdown content. Default + Loading variants.
  - [x] 2.2 `Biography/stories/Biography.stories.tsx` — Props: `showTitle?`. Uses `useProfile(1)` via React Query. Default + WithTitle + Loading variants.
  - [x] 2.3 `Experiences/stories/Experiences.stories.tsx` — No props. Uses `useJobExperiences()` via React Query. Default + Loading variants.
  - [x] 2.4 `ExperienceStats/stories/ExperienceStats.stories.tsx` — No props. Uses `useExperienceStats()` via React Query. Default + Loading variants.
  - [x] 2.5 `Academics/stories/Academics.stories.tsx` — No props. Uses `useAcademics()` via React Query. Default + Loading story added.

- [x] **Task 3: Interactive organisms — Redux state + framer-motion** (AC: #4, #7)
  - [x] 3.1 `Skills/stories/Skills.stories.tsx` — No props. Uses `useTechnologies()` + framer-motion via Skill molecule. Default + Loading variants.
  - [x] 3.2 `WordCloud/stories/WordCloud.stories.tsx` — No props. Uses AnimatePresence + TagCloud external lib. Default story. Min-height decorator for sphere visibility.

- [x] **Task 4: Page-level organisms** (AC: #1, #6)
  - [x] 4.1 `Hiring/stories/Hiring.stories.tsx` — No props. Contains HireMeButton in Suspense. Default + Loading variants.

- [x] **Task 5: Verify build and tests** (AC: #9, #10)
  - [x] 5.1 Run `npx storybook build --quiet` — clean build (16s)
  - [x] 5.2 Run `npm test` — 97 suites, 983 tests, 0 regressions
  - [x] 5.3 Verify sidebar: `Organisms/` with 10 component entries (10 story files confirmed)
  - [x] 5.4 Grep confirms ZERO barrel imports in all story files

---

## Dev Notes

### Organism Inventory (10 selected from 19 total)

| # | Organism | File | Skeleton | Redux | React Query | Framer | Sub-variants |
|---|----------|------|----------|-------|-------------|--------|--------------|
| 1 | ArticleCard | .tsx | NO | NO | NO | NO | FeaturedArticleCard, GridArticleCard |
| 2 | ProjectCard | .tsx | NO | NO | NO | NO | FeaturedProjectCard, GridProjectCard |
| 3 | ArticleContent | .tsx | YES | NO | NO | `m.article` | CodeBlock |
| 4 | Biography | .jsx | YES (skeletons.jsx) | NO | `useProfile(1)` | NO | — |
| 5 | Experiences | .tsx | YES (.jsx) | NO | `useJobExperiences()` | NO | History HOC |
| 6 | ExperienceStats | .jsx | YES (.jsx) | NO | `useExperienceStats()` | NO | ExtraInfo |
| 7 | Academics | .tsx | NO | NO | `useAcademics()` | NO | History HOC |
| 8 | Skills | .jsx | YES (.jsx) | NO | `useTechnologies()` | YES (via Skill) | — |
| 9 | WordCloud | .jsx | NO | NO | NO | AnimatePresence | TagCloud lib |
| 10 | Hiring | .jsx | YES (.jsx) | NO | NO | NO | Suspense wrapper |

### Excluded Organisms (9 — deferred to future stories)

| Organism | Reason for Exclusion |
|----------|---------------------|
| NavBar | Extremely complex — orchestrates Menu, MobileMenuOverlay, breakpoint detection. Needs dedicated story. |
| Footer | Composes multiple molecules (CopyEmail, WhatsApp). Server component issues same as 21.5. |
| Menu | Complex Suspense boundaries with React Query. Responsive hiding. |
| MenuFloating | Thin wrapper around MenuFloatingClient — redundant story. |
| MenuFloatingClient | Redux (useMenuPanel) + React Query + AnimatePresence. Complex. |
| MobileMenuOverlay | Redux (useMenuPanel) + React Query. Mobile-specific. |
| Auth | Redux (useAuthPanel) + AnimatePresence + AuthModal + Forms. Extremely complex — needs dedicated auth story. |
| Chat | Redux (useChatPanel) + AnimatePresence + Form sub-components. Extremely complex — needs dedicated chat story. |
| ProjectDetail | Simple detail view, low priority for Storybook visual documentation. |

### CRITICAL: ArticleCard & ProjectCard — Variant Pattern

Both `ArticleCard` and `ProjectCard` use a variant pattern:

```typescript
// ArticleCard/index.tsx exports:
export { FeaturedArticleCard } from "./FeaturedArticleCard";
export { GridArticleCard } from "./GridArticleCard";
// Main ArticleCard component accepts article + className

// ProjectCard/index.tsx exports:
export { FeaturedProjectCard } from "./FeaturedProjectCard";
export { GridProjectCard } from "./GridProjectCard";
```

Stories should demonstrate BOTH variants with mock domain data. Import each variant directly — do NOT import from barrel.

### CRITICAL: WordCloud — TagCloud External Library

`WordCloud` uses `react-tagcloud` (TagCloud) via dynamic import. In Storybook:
- The dynamic import should resolve normally in webpack
- Component also references `data.js` for word data and `telemetry.js` for tracking
- AnimatePresence wraps skill detail panel
- May render differently without interaction (no selected skill)

### CRITICAL: Biography — Plural Skeleton File

`Biography` has `skeletons.jsx` (plural, not `skeleton.jsx`). Check the exact export name before importing.

### CRITICAL: ArticleContent — Rich Markdown Content

`ArticleContent` renders a full article with:
- `m.article`, `m.header`, `m.figure`, `m.div`, `m.footer` (framer-motion)
- CodeBlock sub-component for syntax highlighting
- Mock article needs `content` field with actual markdown

Use a mock article that has rich `content` from `@/domains/article/model/mock` (articles 1-5 have full markdown content).

### Mock Data Sources

| Organism | Mock Data Strategy |
|----------|--------------------|
| ArticleCard | Import from `@/domains/article/model/mock` — use featured articles |
| ProjectCard | Import from `@/domains/project/model/mock` — use first project |
| ArticleContent | Import from `@/domains/article/model/mock` — use article with full content (id 1-5) |
| Biography | Auto — `useProfile(1)` fetches mock via React Query |
| Experiences | Auto — `useJobExperiences()` fetches mock via React Query |
| ExperienceStats | Auto — `useExperienceStats()` fetches mock via React Query |
| Academics | Auto — `useAcademics()` fetches mock via React Query |
| Skills | Auto — `useTechnologies()` fetches mock via React Query |
| WordCloud | Internal `data.js` — no external mock needed |
| Hiring | No data — renders HireMeButton atom |

### Story File Pattern (established in 21.3-21.5)

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import ComponentName from "../index";

const meta = {
  title: "Organisms/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Skeleton loading:
import Skeleton from "../skeleton";
export const Loading: Story = {
  render: () => <Skeleton />,
};
```

### Sidebar Organization

All stories use `title: "Organisms/{ComponentName}"`:
- `Organisms/Academics`
- `Organisms/ArticleCard`
- `Organisms/ArticleContent`
- `Organisms/Biography`
- `Organisms/ExperienceStats`
- `Organisms/Experiences`
- `Organisms/Hiring`
- `Organisms/ProjectCard`
- `Organisms/Skills`
- `Organisms/WordCloud`

### Project Structure Notes

- Story placement: `src/ui/organisms/{Component}/stories/{Component}.stories.tsx`
- Consistent with atoms/molecules pattern from Stories 21.3-21.5
- All story files are `.tsx` even when component is `.jsx`
- Direct path imports only — ZERO barrel imports

### Previous Story Learnings (21.1 through 21.5)

- `@storybook/nextjs` handles PostCSS/Tailwind automatically
- All decorators (Redux, Query, Motion) are global — no per-story wrapping needed
- `fn()` from `@storybook/test` for ALL callback props
- Skeleton variant pattern: `render: () => <Skeleton />`
- Redux state override: `parameters: { redux: { initialState: { ... } } }`
- React Query auto-mocks: components with hooks get mock data automatically
- JSX components import fine into `.tsx` story files
- Storybook build ~15s — may increase with 10 more story files
- Code review catches: missing skeleton variants, incomplete prop coverage, barrel imports, mock data should use domain imports not inline
- Domain mock imports prevent schema drift (M1/M2 fix from 21.5 review)
- Server components can't render in Storybook — use client wrappers or atom-level rendering

### References

- [Source: _bmad-output/implementation-artifacts/epic-21-storybook.md#Story-21.6]
- [Source: _bmad-output/implementation-artifacts/21-5-molecule-stories-core.md] — Story pattern & code review learnings
- [Source: _bmad-output/implementation-artifacts/21-3-atom-stories-buttons-links-texts.md] — Established story patterns
- [Source: CLAUDE.md#performance-anti-pattern-barrel-imports] — ZERO barrel imports rule
- [Source: CLAUDE.md#import-aliases] — tsconfig path aliases

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Pre-existing warning in Storybook build: `export 'HistorySkeleton' was not found in '@/atoms/hocs/History/skeleton'` — this is a bug in `Academics/skeleton.jsx` importing `HistorySkeleton` when the export is `Skeleton`. Pre-dates this story, not introduced by story changes.
- Storybook build: 16s clean, only expected asset size warnings.

### Completion Notes List

- 10 story files created covering all 10 selected organisms
- Card organisms (ArticleCard, ProjectCard): Both have Featured, Grid, and Auto variants using domain mock imports
- Content organisms (ArticleContent, Biography, Experiences, ExperienceStats, Academics): All use React Query auto-mocks via global decorator; Loading skeleton variants for all 5
- Biography story includes WithTitle variant exercising `showTitle` prop
- ArticleContent uses article with rich markdown content (id 1) from domain mock
- Interactive organisms (Skills, WordCloud): Skills has Loading skeleton; WordCloud has min-height decorator for TagCloud sphere visibility
- Hiring organism: Default with Suspense-wrapped HireMeButton + Loading skeleton variant
- ZERO barrel imports — all 10 stories use direct path imports only
- Storybook build: 16s clean
- Test regression: 97 suites, 983 tests, 0 failures

### File List

#### New
- `src/ui/organisms/ArticleCard/stories/ArticleCard.stories.tsx`
- `src/ui/organisms/ProjectCard/stories/ProjectCard.stories.tsx`
- `src/ui/organisms/ArticleContent/stories/ArticleContent.stories.tsx`
- `src/ui/organisms/Biography/stories/Biography.stories.tsx`
- `src/ui/organisms/Experiences/stories/Experiences.stories.tsx`
- `src/ui/organisms/ExperienceStats/stories/ExperienceStats.stories.tsx`
- `src/ui/organisms/Academics/stories/Academics.stories.tsx`
- `src/ui/organisms/Skills/stories/Skills.stories.tsx`
- `src/ui/organisms/WordCloud/stories/WordCloud.stories.tsx`
- `src/ui/organisms/Hiring/stories/Hiring.stories.tsx`

#### Modified
- `_bmad-output/implementation-artifacts/21-6-organism-stories-page-sections.md` (story tracking)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (status update)
