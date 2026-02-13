# Story 21.4: Atom Stories — Icon Gallery

Status: review

---

## Story

As a **developer**,
I want **a searchable icon gallery in Storybook showing all 57 icons with size variants and import paths**,
so that **I can visually browse, search, and copy the correct direct import path for any icon**.

---

## Acceptance Criteria

1. **Given** I open the Icon Gallery story in Storybook
   **When** the page renders
   **Then** all 57 icons display in a responsive grid with their component name below each icon

2. **Given** the gallery is rendered
   **When** I type in the search input
   **Then** the grid filters icons by name (case-insensitive partial match)

3. **Given** the gallery is rendered
   **When** I select a size from the size selector (sm/md/lg/xl)
   **Then** all icons resize to the selected dimension (16/24/32/48 px)

4. **Given** any icon in the gallery
   **When** I view its cell
   **Then** I see the direct import path: `@/atoms/icons/{IconName}`

5. **Given** the gallery renders in dark mode
   **When** I toggle the Storybook dark mode toolbar
   **Then** icons using `currentColor` switch to light fill, and colored icons remain their brand color

6. **Given** the story file source code
   **When** I inspect all imports
   **Then** ZERO imports reference the barrel file (`@/atoms/icons` or `@/icons`)
   **And** every import uses a direct path (`../IconName` or `@/atoms/icons/IconName`)

---

## Tasks / Subtasks

- [x] **Task 1: Create IconGallery story file** (AC: #1, #6)
  - [x] 1.1 Create `src/ui/atoms/icons/stories/IconGallery.stories.tsx`
  - [x] 1.2 Import all 57 icons using DIRECT paths (e.g., `import GitHubIcon from "../GitHubIcon"`)
  - [x] 1.3 Create `ICONS` array: `{ name: string, Component: ComponentType, path: string }[]`
  - [x] 1.4 Meta: `title: "Atoms/Icons/Gallery"`, `tags: ["autodocs"]`

- [x] **Task 2: Gallery grid layout** (AC: #1)
  - [x] 2.1 Render grid using CSS grid (`grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))`)
  - [x] 2.2 Each cell: icon centered, name below, import path as monospace text below name
  - [x] 2.3 Cell styling: padding, border, hover highlight (box-shadow on hover)
  - [x] 2.4 Total count badge: "{n} of 57 icons" (updates when filtered)

- [x] **Task 3: Search filter** (AC: #2)
  - [x] 3.1 Search via Storybook Controls panel `search` arg (text input)
  - [x] 3.2 Filter `ICONS` array by `name.toLowerCase().includes(query.toLowerCase())`
  - [x] 3.3 Show match count: "{n} of 57 icons"

- [x] **Task 4: Size selector** (AC: #3)
  - [x] 4.1 Radio control via Storybook argTypes: sm (16px), md (24px), lg (32px), xl (48px)
  - [x] 4.2 Default: md (24px)
  - [x] 4.3 Apply `style={{ width: size, height: size }}` wrapper div around each icon
  - [x] 4.4 Icons with `className` get Tailwind size class (w-4/w-6/w-8/w-12); icons without use wrapper div sizing

- [x] **Task 5: Handle special icons** (AC: #1, #5)
  - [x] 5.1 **LiIcon** — LiIconWrapper component with `useRef` passes ref to both container div and LiIcon's `reference` prop. MotionDecorator provides LazyMotion context globally.
  - [x] 5.2 **GooglePlusIcon, LinkedInIcon** — Rendered with `colored={false}` in Default gallery for consistent currentColor behavior. Separate `ColoredIcons` story variant shows them with `colored={true}`.
  - [x] 5.3 **LogoIcon** — Has `hasClassName: true`, receives size class via `className` prop.
  - [x] 5.4 **UserIcon** — Has `hasClassName: true`, receives size-appropriate className overriding default "h-5 w-5".

- [x] **Task 6: Dark mode verification** (AC: #5)
  - [x] 6.1 Icons using `fill="currentColor"` adapt via Storybook dark mode toggle (`.dark` class on preview container)
  - [x] 6.2 Icons with hardcoded brand colors stay brand-colored in dark mode — GooglePlusIcon uses `#EA4335`, LinkedInIcon uses `#0A66C2` when `colored={true}`

- [x] **Task 7: Verify build and tests** (AC: #1, #6)
  - [x] 7.1 Run `npx storybook build --quiet` — clean build (13s)
  - [x] 7.2 Run `npm test` — 97 suites, 983 tests, 0 failures
  - [x] 7.3 Verify sidebar: `Atoms/Icons/Gallery` with Default + ColoredIcons stories
  - [x] 7.4 Grep confirms ZERO barrel imports in story file

---

## Dev Notes

### Icon Inventory (57 total)

**With `className` + `...rest` props (17):**
ArrowIcon, CheckIcon, ChevronDownIcon, CopyIcon, DribbbleIcon, EnvelopeIcon, GitHubIcon, GooglePlusIcon, LinkedInIcon, MoonIcon, PinterestIcon, QuestionIcon, SunIcon, TelegramIcon, TwitterIcon, WhatsAppIcon, MicrosoftIcon

**With `className` only (4):**
CalendarIcon (.tsx), CalendlyIcon (.tsx), LogoIcon (default: ""), UserIcon (default: "h-5 w-5")

**No props — pure SVG (35):**
AWSIcon, BashIcon, CSS3Icon, CucumberIcon, DockerIcon, FigmaIcon, GitIcon, GraphQLIcon, HerokuIcon, HTML5Icon, JavaScriptIcon, JenkinsIcon, KafkaIcon, LinuxIcon, MongoIcon, NextIcon, NodeIcon, PostgresIcon, PulumiIcon, RailsIcon, ReactIcon, RedisIcon, ReduxIcon, RSpecIcon, RubyIcon, RustIcon, SASSIcon, SolidityIcon, StorybookIcon, SvelteIcon, TailwindIcon, TerraformIcon, TypeScriptIcon, UnixIcon, WWWIcon

**Special — framer-motion dependency (1):**
LiIcon — `"use client"`, uses `m.circle` + `useScroll({ target: reference })`. Requires a ref as prop.

### CRITICAL: Direct Import Pattern

```typescript
// CORRECT — 57 individual imports
import ArrowIcon from "../ArrowIcon";
import AWSIcon from "../AWSIcon";
// ... etc

// FORBIDDEN — barrel import
import { ArrowIcon } from "../index";  // NEVER
import { ArrowIcon } from "@/icons";   // NEVER
```

### Gallery Render Pattern

```tsx
const ICONS = [
  { name: "ArrowIcon", Component: ArrowIcon, path: "@/atoms/icons/ArrowIcon" },
  // ... 56 more
];

// Gallery component renders inside the story
const IconGallery = ({ size, search }: { size: number; search: string }) => {
  const filtered = ICONS.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
      {filtered.map(({ name, Component, path }) => (
        <div key={name} style={{ textAlign: "center", padding: "1rem", border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ width: size, height: size, margin: "0 auto" }}>
            <Component className={`w-full h-full`} />
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>{name}</p>
          <code style={{ fontSize: 9, color: "#888" }}>{path}</code>
        </div>
      ))}
    </div>
  );
};
```

### LiIcon Strategy

LiIcon requires `reference` (a React ref for scroll tracking) and uses `m.circle`. In the gallery:
- Create a ref with `useRef(null)` and pass to `<LiIcon reference={ref} />`
- Wrap the LiIcon cell in a `<div ref={ref}>` so useScroll has a target
- The progress circle won't animate in gallery context (no scroll), but the icon renders without errors
- MotionDecorator (global) provides LazyMotion context

### File Location

Story file: `src/ui/atoms/icons/stories/IconGallery.stories.tsx`
This follows the pattern from Story 21.3 where stories live in `stories/` subfolder alongside components.

### Size Selector Values

| Label | Size | Tailwind Class |
|-------|------|---------------|
| sm | 16px | w-4 h-4 |
| md | 24px | w-6 h-6 |
| lg | 32px | w-8 h-8 |
| xl | 48px | w-12 h-12 |

### Story Args Pattern

Use Storybook args for search and size controls:

```typescript
const meta = {
  title: "Atoms/Icons/Gallery",
  tags: ["autodocs"],
  args: {
    size: 24,
    search: "",
  },
  argTypes: {
    size: {
      control: "radio",
      options: [16, 24, 32, 48],
      description: "Icon size in pixels",
    },
    search: {
      control: "text",
      description: "Filter icons by name",
    },
  },
} satisfies Meta;
```

### Project Structure Notes

- Single story file, no skeleton needed (icons are pure SVG, no async data)
- No Redux, no React Query dependencies (except LiIcon needing framer-motion via MotionDecorator)
- Path: `src/ui/atoms/icons/stories/` — consistent with buttons/links/texts story placement
- Sidebar: `Atoms/Icons/Gallery`

### Previous Story Learnings (21.1 + 21.2 + 21.3)

- `@storybook/nextjs` handles PostCSS/Tailwind automatically
- Story file pattern: `satisfies Meta<typeof Component>` with `tags: ["autodocs"]`
- All decorators (Redux, Query, Motion) are global — no per-story wrapping needed
- JSX components import fine from `.tsx` story files
- `fn()` from `@storybook/test` for callbacks (not needed here — icons have no callbacks)
- Storybook build takes ~12s — monitor for size increase with 57 icon imports
- Code review will check: all 57 icons present, zero barrel imports, LiIcon renders, dark mode works

### References

- [Source: _bmad-output/implementation-artifacts/epic-21-storybook.md#Story-21.4]
- [Source: CLAUDE.md#performance-anti-pattern-barrel-imports] — ZERO barrel imports rule
- [Source: _bmad-output/implementation-artifacts/21-3-atom-stories-buttons-links-texts.md] — Story pattern & learnings
- [Source: CLAUDE.md#import-aliases] — tsconfig path aliases

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- No issues encountered. All 57 icons imported and rendered without errors.
- LiIcon renders successfully with ref-based wrapper — progress circle static (expected, no scroll context).
- Storybook build: 13s clean, only expected asset size warnings.

### Completion Notes List

- 1 story file created: `IconGallery.stories.tsx` with 57 direct icon imports
- ICONS registry array with 57 entries, each containing name, Component, path, hasClassName flag, and optional special marker
- Gallery renders responsive CSS grid (auto-fill, minmax 140px) with icon + name + import path per cell
- Search filter via Storybook `search` arg with case-insensitive partial matching + count display
- Size selector via Storybook `size` radio arg: 16/24/32/48px with corresponding Tailwind classes
- LiIconWrapper component handles useRef requirement for LiIcon's useScroll dependency
- GooglePlusIcon and LinkedInIcon rendered with `colored={false}` in Default gallery; separate `ColoredIcons` story shows brand colors
- Hover effect on icon cells (box-shadow transition)
- ZERO barrel imports — all 57 imports use direct path pattern `../IconName`
- Storybook build: 13s clean
- Test regression: 97 suites, 983 tests, 0 failures

### Code Review Findings (Fixed)

| ID | Severity | Finding | Fix Applied |
|----|----------|---------|-------------|
| H1 | High | 35 no-props icons are SVG fragments (`<>...<path>...</>`), rendered inside `<div>` = invisible | Wrapped in `<svg viewBox="0 0 128 128">` matching TechnologiesSlider pattern |
| H2 | High | Unused imports: `ReactElement`, `useState` | Removed from import lines |
| M1 | Medium | MicrosoftIcon marked `hasClassName: true` but has hardcoded `width="26px" height="26px"` — className won't override | Changed to `hasClassName: false` (gets SVG wrapper) |
| L1 | Low | ICONS array grouped by category, not alphabetically sorted | Sorted A-Z, category comments removed |

Post-fix verification: Storybook build 13s clean, 97 suites / 983 tests / 0 failures.

### File List

#### New
- `src/ui/atoms/icons/stories/IconGallery.stories.tsx`

#### Modified
- `_bmad-output/implementation-artifacts/21-4-atom-stories-icon-gallery.md` (story tracking)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (status update)
