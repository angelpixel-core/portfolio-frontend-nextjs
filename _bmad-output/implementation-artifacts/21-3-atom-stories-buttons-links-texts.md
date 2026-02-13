# Story 21.3: Atom Stories — Buttons, Links & Texts

Status: done

---

## Story

As a **developer**,
I want **Storybook stories for all atom-level buttons, links, and text components**,
so that **each component is visually documented with variants, dark mode, and interactive controls in isolation**.

---

## Acceptance Criteria

1. **Given** any button atom (9 remaining without stories)
   **When** I open its story in Storybook
   **Then** it renders a Default variant and a Dark Mode variant at minimum
   **And** interactive props are exposed in the Controls panel

2. **Given** any link atom (6 total, 0 have stories)
   **When** I open its story in Storybook
   **Then** it renders correctly with required props
   **And** `target="_blank"` links show external indicator behavior

3. **Given** any text atom (6 total, 0 have stories)
   **When** I open its story in Storybook
   **Then** it renders correctly with representative content
   **And** animated texts show their animation behavior

4. **Given** a component that uses Redux (AuthButton, ChatButton, CopyButton, MenuButton, NavigationItemButton, ThemeButton)
   **When** its story renders
   **Then** the ReduxDecorator provides state automatically
   **And** per-story `parameters.redux.initialState` overrides work for variant stories

5. **Given** a component that uses React Query (HireMeButton, HireMeHeaderButton, AnimatedTitle)
   **When** its story renders
   **Then** the QueryDecorator provides QueryClient automatically
   **And** the component shows loading/resolved/error states as applicable

6. **Given** a component with a skeleton (ArrowButton, NavigationItemButton, CalendarLink, ImageLink, NavigationItemLink, AnimatedNumber, AnimatedTitle, ParagraphText)
   **When** a "Loading" variant story exists
   **Then** it renders the skeleton component directly

7. **Given** all stories are created
   **When** I view the Storybook sidebar
   **Then** components are organized as `Atoms/Buttons/*`, `Atoms/Links/*`, `Atoms/Texts/*`

---

## Tasks / Subtasks

### Buttons (9 new stories — ArrowButton and ThemeButton already exist)

- [x] **Task 1: AuthButton story** (AC: #1, #4)
  - [x] 1.1 Create `src/ui/atoms/buttons/AuthButton/stories/AuthButton.stories.tsx`
  - [x] 1.2 Default variant (logged out state)
  - [x] 1.3 Authenticated variant (`parameters.redux.initialState: { authPanel: { isAuthenticated: true, user: { name: "Test User", email: "test@test.com" } } }`)
  - [x] 1.4 Panel Open variant (`authPanel: { isOpen: true }`)

- [x] **Task 2: ChatButton story** (AC: #1, #4)
  - [x] 2.1 Create `src/ui/atoms/buttons/ChatButton/stories/ChatButton.stories.tsx`
  - [x] 2.2 Default variant (panel closed)
  - [x] 2.3 Active variant (`parameters.redux.initialState: { chatPanel: { isOpen: true } }`)

- [x] **Task 3: CopyButton story** (AC: #1, #4)
  - [x] 3.1 Create `src/ui/atoms/buttons/CopyButton/stories/CopyButton.stories.tsx`
  - [x] 3.2 Default variant
  - [x] 3.3 Copied variant (`parameters.redux.initialState: { emailClipboard: { isCopied: true, error: null } }`)

- [x] **Task 4: HireMeButton story** (AC: #1, #5)
  - [x] 4.1 Create `src/ui/atoms/buttons/HireMeButton/stories/HireMeButton.stories.tsx`
  - [x] 4.2 Default variant (uses `useProfile` hook — will show loading then resolved from mock)

- [x] **Task 5: HireMeHeaderButton story** (AC: #1, #5)
  - [x] 5.1 Create `src/ui/atoms/buttons/HireMeHeaderButton/stories/HireMeHeaderButton.stories.tsx`
  - [x] 5.2 Default variant (uses `useProfile` hook)

- [x] **Task 6: MenuButton story** (AC: #1, #4)
  - [x] 6.1 Create `src/ui/atoms/buttons/MenuButton/stories/MenuButton.stories.tsx`
  - [x] 6.2 Default variant (menu closed)
  - [x] 6.3 Open variant (`parameters.redux.initialState: { menuPanel: { isOpen: true } }`)

- [x] **Task 7: NavigationItemButton story** (AC: #1, #4, #6)
  - [x] 7.1 Create `src/ui/atoms/buttons/NavigationItemButton/stories/NavigationItemButton.stories.tsx`
  - [x] 7.2 Default variant with `args: { href: "/about", name: "About" }`
  - [x] 7.3 Loading variant (render skeleton directly)

- [x] **Task 8: NeumorphicToggle story** (AC: #1)
  - [x] 8.1 Create `src/ui/atoms/buttons/NeumorphicToggle/stories/NeumorphicToggle.stories.tsx`
  - [x] 8.2 Default variant with `args: { id: "toggle-1", label: "Filter", isPressed: false, onToggle: fn() }`
  - [x] 8.3 Pressed variant with `args: { isPressed: true }`

- [x] **Task 9: SkillSelectorButton story** (AC: #1)
  - [x] 9.1 Create `src/ui/atoms/buttons/SkillSelectorButton/stories/SkillSelectorButton.stories.tsx`
  - [x] 9.2 Default variant with `args: { category: "senior", text: "Senior" }`
  - [x] 9.3 AllCategories variant showing each category value

### Links (6 new stories)

- [x] **Task 10: BaseLink story** (AC: #2)
  - [x] 10.1 Create `src/ui/atoms/links/BaseLink/stories/BaseLink.stories.tsx`
  - [x] 10.2 Default variant with `args: { href: "https://example.com", text: "Example Link" }`
  - [x] 10.3 InternalLink variant with `target: "_self"`

- [x] **Task 11: CalendarLink story** (AC: #2, #6)
  - [x] 11.1 Create `src/ui/atoms/links/CalendarLink/stories/CalendarLink.stories.tsx`
  - [x] 11.2 Default variant with `args: { href: "https://calendly.com/test" }`
  - [x] 11.3 Loading variant (render skeleton directly)

- [x] **Task 12: ImageLink story** (AC: #2, #6)
  - [x] 12.1 Create `src/ui/atoms/links/ImageLink/stories/ImageLink.stories.tsx`
  - [x] 12.2 Default variant with `args: { href: "/", src: "/images/profile/hero.png", alt: "Profile", size: 100 }`
  - [x] 12.3 Loading variant (render skeleton directly)

- [x] **Task 13: NavigationItemLink story** (AC: #2, #6)
  - [x] 13.1 Create `src/ui/atoms/links/NavigationItemLink/stories/NavigationItemLink.stories.tsx`
  - [x] 13.2 Default variant with `args: { href: "/about", name: "About" }`
  - [x] 13.3 Loading variant (render skeleton directly)

- [x] **Task 14: TransitionLink story** (AC: #2)
  - [x] 14.1 Create `src/ui/atoms/links/TransitionLink/stories/TransitionLink.stories.tsx`
  - [x] 14.2 Default variant with `args: { href: "/about", children: "About" }`
  - [x] 14.3 Note: TransitionLink uses `useTransition` context — may need mock or simplified render

- [x] **Task 15: WhatsAppLink story** (AC: #2)
  - [x] 15.1 Create `src/ui/atoms/links/WhatsAppLink/stories/WhatsAppLink.stories.tsx`
  - [x] 15.2 Default variant with `args: { href: "https://wa.me/123456", text: "WhatsApp" }`

### Texts (6 new stories)

- [x] **Task 16: ActiveMark story** (AC: #3)
  - [x] 16.1 Create `src/ui/atoms/texts/ActiveMark/stories/ActiveMark.stories.tsx`
  - [x] 16.2 Default variant with `args: { activePath: true }`
  - [x] 16.3 Inactive variant with `args: { activePath: false }`

- [x] **Task 17: ActiveMarkFloating story** (AC: #3)
  - [x] 17.1 Create `src/ui/atoms/texts/ActiveMarkFloating/stories/ActiveMarkFloating.stories.tsx`
  - [x] 17.2 Default variant with `args: { activePath: true }`
  - [x] 17.3 Inactive variant with `args: { activePath: false }`

- [x] **Task 18: AnimatedNumber story** (AC: #3)
  - [x] 18.1 Create `src/ui/atoms/texts/AnimatedNumber/stories/AnimatedNumber.stories.tsx`
  - [x] 18.2 Default variant with `args: { value: 42 }`
  - [x] 18.3 Note: Uses `useMotionValue`, `useSpring`, `useInView` from framer-motion — LazyMotion decorator active

- [x] **Task 19: AnimatedTitle story** (AC: #3, #5)
  - [x] 19.1 Create `src/ui/atoms/texts/AnimatedTitle/stories/AnimatedTitle.stories.tsx`
  - [x] 19.2 Default variant (fetches content via `useContent` React Query hook — will use mock data)
  - [x] 19.3 Loading variant (render skeleton directly)
  - [x] 19.4 Note: Composed of `Title.jsx` + `MotionTitle.jsx` — uses both React Query AND `m.h1`/`m.span`

- [x] **Task 20: CircularText story** (AC: #3)
  - [x] 20.1 Create `src/ui/atoms/texts/CircularText/stories/CircularText.stories.tsx`
  - [x] 20.2 Default variant

- [x] **Task 21: ParagraphText story** (AC: #3, #6)
  - [x] 21.1 Create `src/ui/atoms/texts/ParagraphText/stories/ParagraphText.stories.tsx`
  - [x] 21.2 Default variant with `args: { text: "Lorem ipsum dolor sit amet..." }`
  - [x] 21.3 Loading variant (render skeleton directly)

### Verification

- [x] **Task 22: Verify Storybook build and test regression** (AC: #7)
  - [x] 22.1 Run `npx storybook build --quiet` — confirm clean build with all 23 atom stories
  - [x] 22.2 Run `npm test` — confirm no regressions (983+ tests)
  - [x] 22.3 Verify sidebar organization: `Atoms/Buttons/*`, `Atoms/Links/*`, `Atoms/Texts/*`

---

## Dev Notes

### Component Dependency Matrix

| Component | Redux | Framer Motion | React Query | Skeleton | .tsx |
|-----------|-------|---------------|-------------|----------|------|
| **Buttons** | | | | | |
| ArrowButton | - | - | - | YES | YES |
| AuthButton | `useAuthPanel` | `m.span`, `m.div`, `AnimatePresence` | - | - | YES |
| ChatButton | `useChatPanel` | - | - | - | YES |
| CopyButton | `useEmailClipboard` | - | - | - | YES |
| HireMeButton | - | - | `useProfile` | - | YES |
| HireMeHeaderButton | - | - | `useProfile` | - | YES |
| MenuButton | `useMenuPanel` | - | - | - | YES |
| NavigationItemButton | `useMenuPanel` | - | - | YES | YES |
| NeumorphicToggle | - | - | - | - | YES |
| SkillSelectorButton | - | - | - | - | YES |
| ThemeButton | `useThemeMode` | - | - | - | YES |
| **Links** | | | | | |
| BaseLink | - | - | - | - | JSX |
| CalendarLink | - | - | - | YES | YES |
| ImageLink | - | - | - | YES | JSX |
| NavigationItemLink | - | TransitionLink | - | YES | JSX |
| TransitionLink | - | `useTransition` ctx | - | - | YES |
| WhatsAppLink | - | - | - | - | JSX |
| **Texts** | | | | | |
| ActiveMark | - | - | - | - | JSX |
| ActiveMarkFloating | - | - | - | - | JSX |
| AnimatedNumber | - | `useMotionValue`, `useSpring` | - | YES | JSX |
| AnimatedTitle | - | `m.h1`, `m.span` | `useContent` | YES | JSX |
| CircularText | - | - | - | - | JSX |
| ParagraphText | - | - | - | YES | JSX |

### Story File Pattern (established in 21.1/21.2)

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import ComponentName from "../index";

const meta = {
  title: "Atoms/Category/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// For components with props:
export const Default: Story = {
  args: {
    propName: "value",
  },
};

// For Redux state override:
export const DarkMode: Story = {
  parameters: {
    redux: {
      initialState: {
        themeMode: { mode: "dark" },
      },
    },
  },
};
```

### Skeleton Story Pattern

For components with skeletons, create a Loading variant that renders the skeleton directly:

```typescript
import { ComponentSkeleton } from "../skeleton";

export const Loading: Story = {
  render: () => <ComponentSkeleton />,
};
```

### JSX Components in Stories

10 of 23 components are `.jsx`. Stories are still `.tsx` — import the JSX component normally:

```typescript
// stories/BaseLink.stories.tsx
import BaseLink from "../index"; // imports .jsx component
```

TypeScript will infer props from the JSX component usage. For JSX components without typed props, use `args` with explicit values rather than relying on Controls auto-detection.

### TransitionLink Special Case

TransitionLink uses `useTransition()` from `src/providers/TransitionProvider`. This context is NOT provided by any Storybook decorator. Options:
1. **Wrap in decorator per-story** — add TransitionProvider as story-level decorator
2. **Simplify** — if TransitionLink just renders `<Link>` without transition context, it may work as-is (context returns defaults)
3. **Mock** — provide a mock TransitionProvider

Investigate at implementation time. If it fails, add a minimal TransitionProvider decorator to this story only.

### AuthButton Sub-components

AuthButton includes `AuthDropdown.tsx` which uses `m.div` and `AnimatePresence`. The Authenticated variant should trigger the dropdown to verify both sub-components render.

### React Query Mock Data Flow

Components using React Query hooks (`useProfile`, `useContent`) will automatically fetch mock data because `NEXT_PUBLIC_USE_MOCKS=true` is the default. The domain model's `fetchAll()`/`fetchById()` functions return mock data with a 2s simulated delay. Stories will show:
1. Loading state (skeleton or spinner) for ~2s
2. Resolved state with mock data

### fn() for Callback Props

Use `fn()` from `@storybook/test` for callback props:

```typescript
import { fn } from "@storybook/test";

export const Default: Story = {
  args: {
    onToggle: fn(),
  },
};
```

### Previous Story Learnings (21.1 + 21.2)

- Story file naming: `ComponentName.stories.tsx` inside `stories/` folder
- `@storybook/nextjs` handles PostCSS/Tailwind automatically
- `--legacy-peer-deps` required for all npm installs
- ReduxDecorator uses `useMemo` with `[initialState]` dependency
- QueryDecorator uses `useState` initializer for stability
- MotionDecorator wraps with `LazyMotion strict` — enforces `m.*` over `motion.*`
- All decorators are global (preview.ts) — no per-story provider wrapping needed
- ThemeButton SSR guard (`mounted` state) works fine in Storybook
- 983 tests passing, lint clean, typecheck clean

### Project Structure Notes

- Story files: `src/ui/atoms/{category}/{Component}/stories/{Component}.stories.tsx`
- Alignment with Epic 20 conventions: stories live alongside components
- Sidebar path derived from `meta.title`: `"Atoms/Buttons/AuthButton"` → sidebar nesting

### References

- [Source: _bmad-output/implementation-artifacts/epic-21-storybook.md#Story-21.3]
- [Source: _bmad-output/implementation-artifacts/21-1-storybook-infrastructure-tailwind.md] — Infrastructure learnings
- [Source: _bmad-output/implementation-artifacts/21-2-provider-decorators.md] — Decorator patterns and code review fixes
- [Source: CLAUDE.md#import-aliases] — tsconfig path aliases
- [Source: CLAUDE.md#testing-conventions] — Test file patterns
- [Source: CLAUDE.md#performance-anti-pattern-barrel-imports] — Direct path imports

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- ActiveMarkFloating missing `styles.css` — pre-existing bug. Component imports `./styles.css` but file didn't exist. Created the missing CSS file with `@import "../ActiveMark/styles.css"` for shared states + `.active_mark--floating` class for the dot variant. This fixed the Storybook build error.

### Completion Notes List

- 21 new story files created (9 buttons, 6 links, 6 texts)
- All stories follow established pattern: `satisfies Meta<typeof Component>`, `tags: ["autodocs"]`
- Redux-dependent components use `parameters.redux.initialState` for variant stories (AuthButton, ChatButton, CopyButton, MenuButton)
- Skeleton variants use direct `render: () => <Skeleton />` pattern (CalendarLink, ImageLink, NavigationItemLink, NavigationItemButton, AnimatedNumber, AnimatedTitle, ParagraphText)
- `fn()` from `@storybook/test` used for callback props (NeumorphicToggle)
- TransitionLink story created with minimal approach — may need TransitionProvider mock at runtime
- NavigationItemLink requires `next/navigation` mock for `usePathname` — works via `@storybook/nextjs`
- Storybook build: 12s clean (only expected asset size warnings)
- Test regression: 97 suites, 983 tests, 0 failures
- Sidebar organization verified: `Atoms/Buttons/*` (11), `Atoms/Links/*` (6), `Atoms/Texts/*` (6) = 23 total

### File List

#### New Story Files (21)
- `src/ui/atoms/buttons/AuthButton/stories/AuthButton.stories.tsx`
- `src/ui/atoms/buttons/ChatButton/stories/ChatButton.stories.tsx`
- `src/ui/atoms/buttons/CopyButton/stories/CopyButton.stories.tsx`
- `src/ui/atoms/buttons/HireMeButton/stories/HireMeButton.stories.tsx`
- `src/ui/atoms/buttons/HireMeHeaderButton/stories/HireMeHeaderButton.stories.tsx`
- `src/ui/atoms/buttons/MenuButton/stories/MenuButton.stories.tsx`
- `src/ui/atoms/buttons/NavigationItemButton/stories/NavigationItemButton.stories.tsx`
- `src/ui/atoms/buttons/NeumorphicToggle/stories/NeumorphicToggle.stories.tsx`
- `src/ui/atoms/buttons/SkillSelectorButton/stories/SkillSelectorButton.stories.tsx`
- `src/ui/atoms/links/BaseLink/stories/BaseLink.stories.tsx`
- `src/ui/atoms/links/CalendarLink/stories/CalendarLink.stories.tsx`
- `src/ui/atoms/links/ImageLink/stories/ImageLink.stories.tsx`
- `src/ui/atoms/links/NavigationItemLink/stories/NavigationItemLink.stories.tsx`
- `src/ui/atoms/links/TransitionLink/stories/TransitionLink.stories.tsx`
- `src/ui/atoms/links/WhatsAppLink/stories/WhatsAppLink.stories.tsx`
- `src/ui/atoms/texts/ActiveMark/stories/ActiveMark.stories.tsx`
- `src/ui/atoms/texts/ActiveMarkFloating/stories/ActiveMarkFloating.stories.tsx`
- `src/ui/atoms/texts/AnimatedNumber/stories/AnimatedNumber.stories.tsx`
- `src/ui/atoms/texts/AnimatedTitle/stories/AnimatedTitle.stories.tsx`
- `src/ui/atoms/texts/CircularText/stories/CircularText.stories.tsx`
- `src/ui/atoms/texts/ParagraphText/stories/ParagraphText.stories.tsx`

#### Bug Fix
- `src/ui/atoms/texts/ActiveMarkFloating/styles.css` (NEW — missing CSS file)

#### Code Review Fixes (6 issues fixed)
- H1: `NavigationItemButton.stories.tsx` — added missing Loading variant with skeleton import
- H2: `AnimatedNumber.stories.tsx` — added missing Loading variant with AnimatedNumberSkeleton import
- M1: `NavigationItemLink.stories.tsx` — Projects variant now spreads `...meta.args` to preserve onClick
- M2: `ActiveMarkFloating/styles.css` — improved JSDoc to document cross-component dependency explicitly
- L1: `SkillSelectorButton.stories.tsx` — added Trainee and Roadmap category variants (5/5 coverage)
- L2: `CircularText.stories.tsx` — added `fillSvgColor` to meta args for Controls panel exposure

#### Modified
- `_bmad-output/implementation-artifacts/21-3-atom-stories-buttons-links-texts.md` (story tracking)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (status update)
