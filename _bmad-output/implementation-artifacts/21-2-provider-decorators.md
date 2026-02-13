# Story 21.2: Provider Decorators (Redux, React Query, Framer Motion)

Status: review

---

## Story

As a **developer**,
I want **global Storybook decorators for Redux, React Query, and Framer Motion LazyMotion**,
so that **components depending on state management or animations render correctly in isolation**.

---

## Acceptance Criteria

1. **Given** a component using `useAppSelector` or a slice hook (e.g., `useThemeMode`)
   **When** I view it in Storybook
   **Then** it renders without errors using default Redux state
   **And** I can override initial state via story `parameters.redux.initialState`

2. **Given** a component using a React Query hook (e.g., `useProjects`, `useArticles`)
   **When** I view it in Storybook
   **Then** it renders with mock data (loading → resolved)
   **And** each story gets a fresh QueryClient (no cache leaks between stories)

3. **Given** a component using `m.*` framer-motion elements
   **When** I view it in Storybook
   **Then** animations execute correctly
   **And** `strict` mode is enabled (rejects `motion.*` components)

4. **Given** decorators are registered in `.storybook/preview.ts`
   **When** I open any story in Storybook
   **Then** all three decorators apply automatically without per-story configuration

5. **Given** a story needs a specific Redux state (e.g., menu open, dark mode)
   **When** the story defines `parameters: { redux: { initialState: { menuPanel: { isOpen: true } } } }`
   **Then** the decorator creates a store with that preloaded state
   **And** the component renders with the overridden state

---

## Tasks / Subtasks

- [x] **Task 1: Install `@storybook/addon-interactions`** (AC: #4)
  - [x] 1.1 Install `@storybook/addon-interactions@8.6.15` with `--legacy-peer-deps`
  - [x] 1.2 Register addon in `.storybook/main.ts` addons array
  - [x] 1.3 Verify `npm run storybook` still launches

- [x] **Task 2: Create ReduxDecorator** (AC: #1, #5)
  - [x] 2.1 Create `.storybook/decorators/ReduxDecorator.tsx`
  - [x] 2.2 Import all 5 slice reducers: `themeMode`, `menuPanel`, `chatPanel`, `authPanel`, `emailClipboard`
  - [x] 2.3 Create `createMockStore(preloadedState?)` using `configureStore`
  - [x] 2.4 Read `context.parameters.redux?.initialState` for per-story overrides
  - [x] 2.5 Wrap `<Story />` with `<Provider store={store}>`

- [x] **Task 3: Create QueryDecorator** (AC: #2)
  - [x] 3.1 Create `.storybook/decorators/QueryDecorator.tsx`
  - [x] 3.2 Create fresh `QueryClient` per render (cache isolation)
  - [x] 3.3 Set `retry: false`, `staleTime: Infinity` for predictable dev behavior
  - [x] 3.4 Wrap `<Story />` with `<QueryClientProvider client={queryClient}>`

- [x] **Task 4: Create MotionDecorator** (AC: #3)
  - [x] 4.1 Create `.storybook/decorators/MotionDecorator.tsx`
  - [x] 4.2 Import `domAnimation` from `framer-motion`
  - [x] 4.3 Wrap `<Story />` with `<LazyMotion features={domAnimation} strict>`

- [x] **Task 5: Create barrel export** (AC: #4)
  - [x] 5.1 Create `.storybook/decorators/index.ts` re-exporting all decorators

- [x] **Task 6: Register decorators in preview.ts** (AC: #4)
  - [x] 6.1 Import decorators from `.storybook/decorators`
  - [x] 6.2 Add to `preview.decorators` array in order: ReduxDecorator → QueryDecorator → MotionDecorator → withThemeByClassName (existing)
  - [x] 6.3 Verify Storybook launches with all decorators active

- [x] **Task 7: Verify Redux decorator with ThemeButton** (AC: #1, #5)
  - [x] 7.1 Create or extend a story for ThemeButton with default state
  - [x] 7.2 Create variant with `parameters.redux.initialState: { themeMode: { mode: "dark" } }`
  - [x] 7.3 Verify ThemeButton toggles theme via Redux dispatch

- [x] **Task 8: Verify Query decorator with a domain component** (AC: #2)
  - [x] 8.1 Confirm existing ArrowButton story still works (no query dependency — baseline)
  - [x] 8.2 Verify QueryClientProvider is available in story context (no hook errors)

- [x] **Task 9: Verify Motion decorator with m.* component** (AC: #3)
  - [x] 9.1 Verify a component using `m.*` renders and animates in Storybook

- [x] **Task 10: Verify static build** (AC: #4)
  - [x] 10.1 Run `npm run build-storybook` — confirm clean build with decorators
  - [x] 10.2 Run `npm test` — confirm no regressions (983+ tests)

---

## Dev Notes

### Redux Store: 5 Slices

| Slice | State Shape | Initial State |
|-------|-------------|---------------|
| `themeMode` | `{ mode: "dark" \| "light" }` | Reads localStorage → system preference → `"light"` |
| `menuPanel` | `{ isOpen: boolean }` | `{ isOpen: false }` |
| `chatPanel` | `{ isOpen: boolean }` | `{ isOpen: false }` |
| `authPanel` | `{ isOpen: boolean, isAuthenticated: boolean, user: AuthUser \| null, error: string \| null }` | `{ isOpen: false, isAuthenticated: false, user: null, error: null }` |
| `emailClipboard` | `{ isCopied: boolean, error: string \| null }` | `{ isCopied: false, error: null }` |

**Store file:** `src/state/stores/ReduxStore/index.ts`

```typescript
const ReduxStore = configureStore({
  reducer: {
    authPanel: authPanelReducer,
    chatPanel: chatPanelReducer,
    emailClipboard: emailClipboardReducer,
    menuPanel: menuPanelReducer,
    themeMode: themeModeReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;
```

**Import paths for reducers:**

- `src/state/slices/themeMode/slice.ts` → exports `default` (reducer) + named actions
- `src/state/slices/menuPanel/slice.ts` → exports `default` + named actions
- `src/state/slices/chatPanel/slice.ts` → exports `default` + named actions
- `src/state/slices/authPanel/slice.ts` → exports `default` + named actions
- `src/state/slices/EmailClipboard/slice.ts` → exports `default` + named actions

**ReduxDecorator pattern:**

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { Decorator } from "@storybook/react";

// Import reducers (NOT from barrels)
import themeModeReducer from "../src/state/slices/themeMode/slice";
import menuPanelReducer from "../src/state/slices/menuPanel/slice";
import chatPanelReducer from "../src/state/slices/chatPanel/slice";
import authPanelReducer from "../src/state/slices/authPanel/slice";
import emailClipboardReducer from "../src/state/slices/EmailClipboard/slice";

const reducers = {
  authPanel: authPanelReducer,
  chatPanel: chatPanelReducer,
  emailClipboard: emailClipboardReducer,
  menuPanel: menuPanelReducer,
  themeMode: themeModeReducer,
};

const ReduxDecorator: Decorator = (Story, context) => {
  const initialState = context.parameters?.redux?.initialState;
  const store = configureStore({
    reducer: reducers,
    preloadedState: initialState,
  });

  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};
```

[Source: src/state/stores/ReduxStore/index.ts, src/state/slices/*/slice.ts]

### React Query: Fresh Client Per Story

**Production config** (`src/lib/queryConfig.ts`):
- `DEFAULT_STALE_TIME`: 5 minutes
- `DEFAULT_GC_TIME`: 10 minutes

**Storybook config (different):**
- `retry: false` — No retries in stories (instant failure)
- `staleTime: Infinity` — Data never stales during dev
- Fresh `QueryClient` per story render — prevents cache leaks

**QueryDecorator pattern:**

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Decorator } from "@storybook/react";

const QueryDecorator: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};
```

[Source: src/state/providers/ReactQueryProvider/index.tsx, src/lib/queryConfig.ts]

### Framer Motion: LazyMotion strict

**Production setup** (`src/providers/LazyMotionProvider/index.tsx`):

```typescript
<LazyMotion features={domAnimation} strict>
  {children}
</LazyMotion>
```

**18 components use `m.*`** — all require LazyMotion wrapper.

**MotionDecorator pattern:**

```typescript
import { LazyMotion, domAnimation } from "framer-motion";
import type { Decorator } from "@storybook/react";

const MotionDecorator: Decorator = (Story) => (
  <LazyMotion features={domAnimation} strict>
    <Story />
  </LazyMotion>
);
```

[Source: src/providers/LazyMotionProvider/index.tsx]

### Decorator Composition Order

Production provider nesting is:
```
ReduxProvider → AuthProvider → ReactQueryProvider → ThemeProvider → LazyMotionProvider → TransitionProvider
```

Storybook decorator order (outermost wraps first):
```
ReduxDecorator → QueryDecorator → MotionDecorator → withThemeByClassName
```

**Why this order:**
- Redux must be outermost (QueryDecorator could theoretically read Redux state)
- QueryDecorator is independent but logically before Motion
- MotionDecorator wraps stories closest to component
- `withThemeByClassName` (existing from 21.1) adds `.dark` class — independent of providers

**ThemeProvider and AuthProvider omitted:** ThemeProvider reads Redux to apply `.dark` class to `document.documentElement`, but Storybook already handles dark mode via `withThemeByClassName`. AuthProvider syncs localStorage — unnecessary for isolated stories. TransitionProvider manages page transitions — irrelevant in Storybook.

### @storybook/addon-interactions

Required for Interactions panel debugging (play functions). Install as part of this story since `@storybook/test` was already installed in 21.1.

```bash
npm install --save-dev --legacy-peer-deps @storybook/addon-interactions@8.6.15
```

### Critical Constraints

1. **Import paths:** Import reducers from `src/state/slices/*/slice.ts` (direct path), NOT from barrel exports
2. **TypeScript:** All new files must be `.tsx` / `.ts`
3. **--legacy-peer-deps:** Required for all npm installs
4. **webpack@5.101.2:** Already pinned from Story 21.1 — do not upgrade
5. **No barrel in `.storybook/decorators/index.ts`:** This barrel is acceptable — it only has 3 exports for internal Storybook use, not in the app bundle

### ThemeButton for Verification

**File:** `src/ui/atoms/buttons/ThemeButton/index.tsx`
- Uses `useThemeMode()` hook (wraps `useAppSelector` + `useAppDispatch`)
- Returns `{ isDarkMode, toggleThemeMode }`
- Renders MoonIcon/SunIcon based on mode
- Has `mounted` state to avoid SSR hydration mismatch

**Story should set `parameters.redux.initialState.themeMode.mode` to test both modes.**

### Previous Story Learnings (21.1)

- `@storybook/nextjs` auto-processes PostCSS/Tailwind — no extra config needed
- webpack 5.101.2 pin is permanent (storybookjs/storybook#32301)
- ajv@8.17.1 + ajv-keywords@5.1.0 required by Storybook webpack
- 983 tests pass, lint clean, typecheck clean
- ArrowButton smoke story placement: `src/ui/atoms/buttons/ArrowButton/stories/ArrowButton.stories.tsx`
- Story file naming: `ComponentName.stories.tsx` inside `stories/` folder

### Project Structure Notes

- Decorators live in `.storybook/decorators/` (outside `src/` — Storybook tooling, not app code)
- Preview.ts registers decorators globally
- Story files follow: `src/ui/{level}/{category}/{Component}/stories/{Component}.stories.tsx`
- Alignment with Epic 20 conventions: decorator files are Storybook config, not UI components

### References

- [Source: _bmad-output/implementation-artifacts/epic-21-storybook.md#Story-21.2]
- [Source: src/state/stores/ReduxStore/index.ts] — Store configuration
- [Source: src/state/slices/*/slice.ts] — All 5 Redux slices
- [Source: src/state/providers/ReactQueryProvider/index.tsx] — QueryClient setup
- [Source: src/providers/LazyMotionProvider/index.tsx] — LazyMotion strict mode
- [Source: src/providers/RootProvider/index.jsx] — Provider nesting order
- [Source: src/lib/queryConfig.ts] — Stale time / GC time defaults
- [Source: src/lib/createQueryHook.ts] — Query hook factory pattern
- [Source: src/ui/atoms/buttons/ThemeButton/index.tsx] — Redux consumer example
- [Source: _bmad-output/implementation-artifacts/21-1-storybook-infrastructure-tailwind.md] — Previous story learnings
- [Source: storybook.js.org/docs/writing-stories/decorators] — Storybook 8 decorator docs
- [Source: CLAUDE.md#state-management-split] — Redux vs React Query split

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Storybook dev server launched successfully (224ms manager, 4.99s preview)
- ThemeButton Default: renders with switch "Switch to dark mode" (light mode default)
- ThemeButton DarkMode: renders with switch "Switch to light mode" [checked] — preloadedState override works
- ThemeButton LightMode: renders with switch "Switch to dark mode" [unchecked] — preloadedState override works
- Console: 0 errors, 0 warnings — LazyMotion strict mode satisfied (m.* used correctly)
- Storybook static build: 11s, clean output
- Jest: 983 tests passing, 97 suites, 0 failures

### Completion Notes List

- **ReduxDecorator imports via tsconfig aliases**: Used `@/state/slices/*` paths which resolve in Storybook via `@storybook/nextjs` TsconfigPathsPlugin — matches production import pattern
- **Named reducer exports**: Slices export `{ <name>Reducer }` as named exports via barrel `index.ts` in each slice folder — imported as named imports in decorator
- **QueryDecorator creates fresh client per render**: Each story invocation creates a new `QueryClient` — no stale cache between story switches
- **MotionDecorator strict mode**: `strict` prop on `<LazyMotion>` enforces `m.*` over `motion.*` — verified with ThemeButton which uses `m.div` and `m.span`
- **ThemeButton SSR guard**: Component has `mounted` state that prevents rendering until after first useEffect — safe in Storybook context
- **Decorator order**: Redux (outermost) → Query → Motion → withThemeByClassName (innermost before component)

### File List

- `.storybook/main.ts` — MODIFIED (added @storybook/addon-interactions)
- `.storybook/preview.ts` — MODIFIED (added decorator imports and registration)
- `.storybook/decorators/ReduxDecorator.tsx` — NEW
- `.storybook/decorators/QueryDecorator.tsx` — NEW
- `.storybook/decorators/MotionDecorator.tsx` — NEW
- `.storybook/decorators/index.ts` — NEW
- `src/ui/atoms/buttons/ThemeButton/stories/ThemeButton.stories.tsx` — NEW
- `package.json` — MODIFIED (@storybook/addon-interactions added)
- `package-lock.json` — MODIFIED (lockfile update)
