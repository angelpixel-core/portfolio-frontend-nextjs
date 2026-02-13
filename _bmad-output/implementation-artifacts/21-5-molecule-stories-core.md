# Story 21.5: Molecule Stories — Core Compositions

Status: done

---

## Story

As a **developer**,
I want **Storybook stories for 15 core molecule components showing composition of atoms with mock data, interactive controls, and loading states**,
so that **I can visually verify molecule behavior, debug state combinations, and document component API in isolation**.

---

## Acceptance Criteria

1. **Given** I open Storybook sidebar under `Molecules/`
   **When** the page renders
   **Then** I see 15 molecule story entries organized by component name

2. **Given** any molecule story with domain data (WhatsApp, Calendar)
   **When** the story renders
   **Then** it shows loading skeleton first, then resolves with mock data (via `NEXT_PUBLIC_USE_MOCKS=true`)

3. **Given** any molecule with a skeleton (Experience, Education, CopyEmail, WhatsApp, SocialNetworkLink, NavigationItems, Calendar)
   **When** I select the `Loading` variant
   **Then** the skeleton renders correctly

4. **Given** Experience or Education molecule
   **When** I click the expand toggle
   **Then** the details section expands/collapses with chevron rotation

5. **Given** TechnologyFilter molecule
   **When** I click technology chips and "Clear All"
   **Then** selected state toggles and Clear All resets selections (verified via Storybook Actions panel)

6. **Given** SocialShareButtons molecule
   **When** I view the story with controls
   **Then** I can modify `url` and `title` props via Controls panel

7. **Given** FeaturedArticlesCarousel molecule
   **When** the story renders with mock articles
   **Then** prev/next buttons and dot indicators are visible and functional

8. **Given** all 15 story files
   **When** I inspect imports
   **Then** ZERO barrel imports from `@/molecules` or `@/atoms/icons` — all direct paths

9. **Given** Storybook build
   **When** I run `npx storybook build --quiet`
   **Then** build completes without errors

10. **Given** Jest test suite
    **When** I run `npm test`
    **Then** all tests pass with 0 regressions

---

## Tasks / Subtasks

- [x] **Task 1: Simple molecules — no state, no data** (AC: #1, #8)
  - [x] 1.1 `Logo/stories/Logo.stories.tsx` — No props. Default story only. Wrap in 200px container for visibility.
  - [x] 1.2 `HireMe/stories/HireMe.stories.tsx` — No props. Default story. NOTE: Component uses `position: fixed` — add decorator with `{ position: 'relative', height: '400px', overflow: 'hidden' }` to contain it.
  - [x] 1.3 `SocialNetworkLink/stories/SocialNetworkLink.stories.tsx` — Props: `href`, `iconName`, `iconClassName`, `ariaLabel`, `onClick`. Args with sample values. Variants: Default (GitHub), LinkedIn, Twitter. Loading variant with skeleton.
  - [x] 1.4 `ArticleListItem/stories/ArticleListItem.stories.tsx` — Props: `article` (Article type), `className`, `onHoverChange`. Use mock article from `@/domains/article/model/mock`. Variant with hover callback via `fn()`.

- [x] **Task 2: Interactive molecules — expand/toggle behavior** (AC: #4, #5)
  - [x] 2.1 `Experience/stories/Experience.stories.tsx` — Props from `JobExperience` type. Use sample experience data inline (no mock import needed). Default + WithoutTasks + Loading variants.
  - [x] 2.2 `Education/stories/Education.stories.tsx` — Props from `Academic` type. Use sample education data inline. Default + WithVerification + Loading variants.
  - [x] 2.3 `TechnologyFilter/stories/TechnologyFilter.stories.tsx` — Props: `technologies`, `selected`, `onToggle`, `onClearAll`. Use `fn()` for callbacks. Variants: Default, WithSelection. Wrap in 800px min-width container.

- [x] **Task 3: Domain-data molecules — React Query dependent** (AC: #2, #3)
  - [x] 3.1 `CopyEmail/stories/CopyEmail.stories.tsx` — No props. Default + Loading variants. EmailLink may show skeleton indefinitely in Storybook (server component limitation).
  - [x] 3.2 `WhatsApp/stories/WhatsApp.stories.tsx` — Props: `text`. Default + Loading variants. React Query auto-mock provides data.
  - [x] 3.3 `Calendar/stories/Calendar.stories.tsx` — Props: `className`. Default + Loading variants. Uses CalendarLink skeleton from atoms.

- [x] **Task 4: Content composition molecules** (AC: #6, #7)
  - [x] 4.1 `SocialShareButtons/stories/SocialShareButtons.stories.tsx` — Props: `url`, `title`. Controls panel for both props. Default with sample article URL/title.
  - [x] 4.2 `Article/stories/Article.stories.tsx` — Named export `Article`. Props: `props` (ArticleProps). Uses `m.li` (LazyMotion global decorator). Default with sample data.
  - [x] 4.3 `FeaturedArticlesCarousel/stories/FeaturedArticlesCarousel.stories.tsx` — Props: `articles`, `interval`. Inline mock articles (3). Variants: Default, SingleArticle. 400px min-height container.

- [x] **Task 5: Complex / special molecules** (AC: #1, #8)
  - [x] 5.1 `TransitionEffect/stories/TransitionEffect.stories.tsx` — No props. Renders null in idle state (no active transition). Documented limitation in JSDoc. Relative container decorator.
  - [x] 5.2 `NavigationItems/stories/NavigationItems.stories.tsx` — **SERVER COMPONENT** workaround: renders `NavigationItemButton` atoms with mock nav data. Default + Loading (skeleton) variants.

- [x] **Task 6: Verify build and tests** (AC: #9, #10)
  - [x] 6.1 Run `npx storybook build --quiet` — clean build (15s)
  - [x] 6.2 Run `npm test` — 97 suites, 983 tests, 0 failures
  - [x] 6.3 Verify sidebar: `Molecules/` with 15 component entries (glob confirmed)
  - [x] 6.4 Grep confirms ZERO barrel imports in all story files

---

## Dev Notes

### Molecule Inventory (15 components)

| # | Molecule | File | Skeleton | styles.css | Domain | Framer | Server |
|---|----------|------|----------|-----------|--------|--------|--------|
| 1 | Experience | .tsx | YES | YES | JobExperience type | NO | NO |
| 2 | Education | .tsx | YES | YES | Academic type | NO | NO |
| 3 | Article | .tsx | NO | YES | — | `m.li` | NO |
| 4 | ArticleListItem | .tsx | NO | YES | Article type | NO | NO |
| 5 | CopyEmail | .tsx | YES | YES | env var | NO | Partial (EmailLink) |
| 6 | WhatsApp | .tsx | YES | YES | useProfile | NO | NO |
| 7 | Calendar | .tsx | ext | ext | useProfile | NO | NO |
| 8 | SocialNetworkLink | .jsx | YES | YES | — | NO | NO |
| 9 | SocialShareButtons | .tsx | NO | YES | — | NO | NO |
| 10 | TechnologyFilter | .tsx | NO | YES | — | NO | NO |
| 11 | TransitionEffect | .jsx | NO | YES | — | `m.div` | NO |
| 12 | FeaturedArticlesCarousel | .tsx | NO | YES | Article[] | NO | NO |
| 13 | NavigationItems | .jsx | YES | YES | fetchAll | NO | YES (async) |
| 14 | Logo | .jsx | NO | YES | — | NO | NO |
| 15 | HireMe | .jsx | NO | YES | — | NO | NO |

### CRITICAL: Server Component — NavigationItems

`NavigationItems` is an async server component (`const NavigationItemButtons = async () => {...}`). Storybook renders in a browser (client) context — async components don't work directly.

**Strategy:** Create a client-side wrapper in the story that:
1. Imports the domain model directly: `import NavigationItem from "@/domains/navigation-item/model"`
2. Calls `NavigationItem.fetchAll()` in a `useEffect` or uses React Query
3. Maps results to `<NavigationItemButton>` atoms
4. This mirrors what the server component does, but client-side

Alternative: If the above is too complex, render the individual `NavigationItemButton` atoms with mock data instead, and document that NavigationItems is a server-only component.

### CRITICAL: CopyEmail Server Composition

`CopyEmail` wraps `EmailLink` (server component reading `PROFILE_EMAIL` env) in `<Suspense>`. In Storybook:
- The Suspense boundary will trigger
- If EmailLink fails (no server env), skeleton will show indefinitely
- **Workaround**: Set `PROFILE_EMAIL` in `.storybook/preview.ts` via `process.env.PROFILE_EMAIL = "demo@example.com"` or use `storybook-static` env handling

### CRITICAL: TransitionEffect Context

`TransitionEffect` uses `useTransition()` from `src/providers/TransitionProvider`. This provider is NOT in global Storybook decorators (only Redux, Query, Motion are global).

**Options:**
1. Add TransitionProvider as story-level decorator
2. The component returns `null` when `phase === 'idle'` — it may just render nothing without context
3. Document as non-interactive story showing the curtain layers structure

### HireMe Fixed Positioning

`HireMe` uses `position: fixed` which escapes Storybook's canvas. Wrap in a relative container:
```tsx
decorators: [
  (Story) => (
    <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
      <Story />
    </div>
  ),
],
```

### TechnologyFilter Responsive Hiding

`TechnologyFilter` has `display: none` below 720px viewport via media query. In Storybook's default viewport this may be invisible. Either:
- Use viewport addon to set desktop width
- Or add a story-level override: `decorators` that sets min-width on container

### Mock Data Sources

| Molecule | Mock Data Strategy |
|----------|--------------------|
| Experience | Inline sample data matching `JobExperience` type |
| Education | Inline sample data matching `Academic` type |
| Article | Inline ArticleProps: `{ img, title, date, link }` |
| ArticleListItem | Import from `@/domains/article/model/mock` |
| WhatsApp | Auto — `useProfile` hook fetches mock via React Query |
| Calendar | Auto — `useProfile` hook fetches mock via React Query |
| SocialNetworkLink | Inline: `{ href: "https://github.com/user", iconName: "github", ariaLabel: "GitHub" }` |
| SocialShareButtons | Inline: `{ url: "https://example.com/article", title: "Sample Article" }` |
| TechnologyFilter | Inline: `{ technologies: ["React", "TypeScript", "Node.js", "Docker"], selected: [] }` |
| FeaturedArticlesCarousel | Import articles from `@/domains/article/model/mock` |
| NavigationItems | Import from `@/domains/navigation-item/model` (fetchAll mock) |

### Story File Pattern (established in 21.3)

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import ComponentName from "../index";

const meta = {
  title: "Molecules/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// With props:
export const Default: Story = {
  args: {
    propName: "value",
    callback: fn(),
  },
};

// Skeleton loading:
import { ComponentSkeleton } from "../skeleton";
export const Loading: Story = {
  render: () => <ComponentSkeleton />,
};
```

### Sidebar Organization

All stories use `title: "Molecules/{ComponentName}"`:
- `Molecules/Article`
- `Molecules/ArticleListItem`
- `Molecules/Calendar`
- `Molecules/CopyEmail`
- `Molecules/Education`
- `Molecules/Experience`
- `Molecules/FeaturedArticlesCarousel`
- `Molecules/HireMe`
- `Molecules/Logo`
- `Molecules/NavigationItems`
- `Molecules/SocialNetworkLink`
- `Molecules/SocialShareButtons`
- `Molecules/TechnologyFilter`
- `Molecules/TransitionEffect`
- `Molecules/WhatsApp`

### Project Structure Notes

- Story placement: `src/ui/molecules/{Component}/stories/{Component}.stories.tsx`
- Consistent with atoms pattern from Story 21.3
- All story files are `.tsx` even when component is `.jsx`
- Direct path imports only — ZERO barrel imports from `@/molecules/index.js`

### Previous Story Learnings (21.1 + 21.2 + 21.3 + 21.4)

- `@storybook/nextjs` handles PostCSS/Tailwind automatically
- All decorators (Redux, Query, Motion) are global — no per-story wrapping needed
- `fn()` from `@storybook/test` for ALL callback props
- Skeleton variant pattern: `render: () => <Skeleton />`
- Redux state override: `parameters: { redux: { initialState: { ... } } }`
- React Query auto-mocks: components with `useProfile`/`useContent` get mock data automatically
- JSX components import fine into `.tsx` story files
- Storybook build ~13s — may increase with 15 more story files
- Code review catches: missing skeleton variants, incomplete prop coverage, barrel imports
- SVG fragment icons need `<svg viewBox="0 0 128 128">` wrapper (21.4 H1 fix)

### References

- [Source: _bmad-output/implementation-artifacts/epic-21-storybook.md#Story-21.5]
- [Source: _bmad-output/implementation-artifacts/21-3-atom-stories-buttons-links-texts.md] — Story pattern & learnings
- [Source: _bmad-output/implementation-artifacts/21-4-atom-stories-icon-gallery.md] — Code review findings
- [Source: CLAUDE.md#performance-anti-pattern-barrel-imports] — ZERO barrel imports rule
- [Source: CLAUDE.md#import-aliases] — tsconfig path aliases

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation with no build or test issues.

### Completion Notes List

1. **NavigationItems (server component)**: Used client-side wrapper rendering `NavigationItemButton` atoms with mock nav data. Async server component cannot render in Storybook canvas.
2. **TransitionEffect**: Renders null in idle state (no active transition in Storybook). Documented limitation in JSDoc. The curtain animation layers are only visible during navigation transitions.
3. **CopyEmail**: EmailLink is a server-side async component. In Storybook canvas it may show the Suspense fallback (skeleton) indefinitely. Default story provided alongside explicit Loading variant.
4. **TechnologyFilter**: Wrapped in 800px min-width container to prevent CSS `display: none` below 720px viewport.
5. **HireMe**: Wrapped in relative container with `overflow: hidden` to contain `position: fixed` element within canvas.
6. **Article**: Uses named export `{ Article }` (not default export). Uses `m.li` from framer-motion — global LazyMotion decorator provides the feature set.
7. **FeaturedArticlesCarousel**: Uses domain mock import (`@/domains/article/model/mock`) filtered to featured articles.
8. **Experience/Education**: Props spread individually (not as object) since component destructures from `Pick<JobExperience, ...>` / `Academic` type.
9. **Calendar**: Skeleton imported from `@/links/CalendarLink/skeleton` (atoms), not from molecule directory.
10. **All 15 stories**: ZERO barrel imports confirmed via grep. All use direct path imports.

### Code Review Findings (Senior Developer Review)

| ID | Severity | File | Finding | Resolution |
|----|----------|------|---------|------------|
| H1 | HIGH | Experience.stories.tsx | Missing `WithTags` variant — `JobExperienceTask.tags` path never exercised | Added `WithTags` variant with sample tags |
| M1 | MEDIUM | FeaturedArticlesCarousel.stories.tsx | Inline mock data instead of domain import — schema drift risk | Replaced with `import articlesMock from "@/domains/article/model/mock"` |
| M2 | MEDIUM | ArticleListItem.stories.tsx | Inline mock data instead of domain import — schema drift risk | Replaced with `import articlesMock from "@/domains/article/model/mock"` |
| L1 | LOW | Story doc AC#3 | Calendar not listed in AC#3 but has Loading variant | Added Calendar to AC#3 skeleton list |

### File List

| File | Action |
|------|--------|
| `src/ui/molecules/Logo/stories/Logo.stories.tsx` | CREATED |
| `src/ui/molecules/HireMe/stories/HireMe.stories.tsx` | CREATED |
| `src/ui/molecules/SocialNetworkLink/stories/SocialNetworkLink.stories.tsx` | CREATED |
| `src/ui/molecules/ArticleListItem/stories/ArticleListItem.stories.tsx` | CREATED |
| `src/ui/molecules/Experience/stories/Experience.stories.tsx` | CREATED |
| `src/ui/molecules/Education/stories/Education.stories.tsx` | CREATED |
| `src/ui/molecules/TechnologyFilter/stories/TechnologyFilter.stories.tsx` | CREATED |
| `src/ui/molecules/CopyEmail/stories/CopyEmail.stories.tsx` | CREATED |
| `src/ui/molecules/WhatsApp/stories/WhatsApp.stories.tsx` | CREATED |
| `src/ui/molecules/Calendar/stories/Calendar.stories.tsx` | CREATED |
| `src/ui/molecules/SocialShareButtons/stories/SocialShareButtons.stories.tsx` | CREATED |
| `src/ui/molecules/Article/stories/Article.stories.tsx` | CREATED |
| `src/ui/molecules/FeaturedArticlesCarousel/stories/FeaturedArticlesCarousel.stories.tsx` | CREATED |
| `src/ui/molecules/TransitionEffect/stories/TransitionEffect.stories.tsx` | CREATED |
| `src/ui/molecules/NavigationItems/stories/NavigationItems.stories.tsx` | CREATED |
