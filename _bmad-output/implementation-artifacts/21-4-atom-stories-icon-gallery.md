# Story 21.4: Atom Stories — Icon Gallery

Status: ready-for-dev

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

- [ ] **Task 1: Create IconGallery story file** (AC: #1, #6)
  - [ ] 1.1 Create `src/ui/atoms/icons/stories/IconGallery.stories.tsx`
  - [ ] 1.2 Import all 57 icons using DIRECT paths (e.g., `import GitHubIcon from "../GitHubIcon"`)
  - [ ] 1.3 Create `ICONS` array: `{ name: string, Component: ComponentType, path: string }[]`
  - [ ] 1.4 Meta: `title: "Atoms/Icons/Gallery"`, `tags: ["autodocs"]`

- [ ] **Task 2: Gallery grid layout** (AC: #1)
  - [ ] 2.1 Render grid using CSS grid (`grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))`)
  - [ ] 2.2 Each cell: icon centered, name below, import path as monospace text below name
  - [ ] 2.3 Cell styling: padding, border, hover highlight
  - [ ] 2.4 Total count badge: "57 icons" (updates when filtered)

- [ ] **Task 3: Search filter** (AC: #2)
  - [ ] 3.1 Text input at top of gallery
  - [ ] 3.2 Filter `ICONS` array by `name.toLowerCase().includes(query.toLowerCase())`
  - [ ] 3.3 Show match count: "{n} of 57 icons"

- [ ] **Task 4: Size selector** (AC: #3)
  - [ ] 4.1 Four buttons/radio: sm (16px), md (24px), lg (32px), xl (48px)
  - [ ] 4.2 Default: md (24px)
  - [ ] 4.3 Apply `style={{ width: size, height: size }}` wrapper div around each icon
  - [ ] 4.4 For icons without `className` prop: wrapper div controls size; for icons with `className`: pass `className` with Tailwind size class

- [ ] **Task 5: Handle special icons** (AC: #1, #5)
  - [ ] 5.1 **LiIcon** — Requires `reference` prop (useScroll target) + `m.circle` (framer-motion). Render with `useRef` + placeholder container, OR exclude with a note. Decision: include with a ref-based wrapper in the gallery render function.
  - [ ] 5.2 **GooglePlusIcon, LinkedInIcon** — Have `colored` prop (default: true). Render with `colored={false}` in gallery (uses `currentColor` for consistent dark mode display). Add a separate "Colored Icons" story variant showing them with `colored={true}`.
  - [ ] 5.3 **LogoIcon** — Has default `className=""`. Pass size via wrapper div.
  - [ ] 5.4 **UserIcon** — Has default `className="h-5 w-5"`. Override with size-appropriate className.

- [ ] **Task 6: Dark mode verification** (AC: #5)
  - [ ] 6.1 Icons using `fill="currentColor"` should adapt via Storybook dark mode toggle (inherited from `.dark` class on preview)
  - [ ] 6.2 Icons with hardcoded brand colors (GooglePlusIcon `#EA4335`, etc.) stay brand-colored in dark mode — verify visually

- [ ] **Task 7: Verify build and tests** (AC: #1, #6)
  - [ ] 7.1 Run `npx storybook build --quiet` — clean build
  - [ ] 7.2 Run `npm test` — no regressions
  - [ ] 7.3 Verify sidebar: `Atoms/Icons/Gallery` appears correctly
  - [ ] 7.4 Grep the story file to confirm ZERO barrel imports

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

### Debug Log References

### Completion Notes List

### File List
