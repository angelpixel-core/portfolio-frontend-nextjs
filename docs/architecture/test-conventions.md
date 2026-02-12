# Test Conventions & Placement Guide

> Epic 20 — Component & Style Architecture (Story 20.4)
> Consolidates test patterns from [test-strategy-2026-02-11.md](../../_bmad-output/analysis/test-strategy-2026-02-11.md) into an actionable guide.

---

## 1. Test Placement Convention

All tests follow a co-located `__tests__/` pattern. Tests live next to the code they test.

### Canonical Placement Patterns

#### Domain Model Tests

```
src/domains/{domain-name}/
├── model/
│   └── __tests__/
│       ├── schema.test.ts         # Zod schema validation
│       ├── model.test.ts          # fetchAll/fetchById logic
│       └── validate-data.test.ts  # Mock data validation
└── queries/
    └── __tests__/
        ├── use{Entity}s.test.tsx       # fetchAll hook
        └── use{Entity}BySlug.test.tsx  # fetchById hook (if applicable)
```

**Extension rule:** `.test.ts` for pure logic (schema, model). `.test.tsx` for hooks that need React rendering context.

#### UI Component Tests

```
src/ui/{layer}/{ComponentName}/
└── __tests__/
    ├── {ComponentName}.test.tsx    # Main test file
    ├── skeleton.test.tsx           # ONLY if skeleton has logic
    └── __snapshots__/              # Auto-generated (do not add new)
```

**Layers:** `atoms/`, `molecules/`, `organisms/`, `overlays/`.
**Atom subcategories:** `atoms/buttons/`, `atoms/links/`, `atoms/texts/`, `atoms/motion/`.

#### Redux Slice Tests

```
src/state/slices/{sliceName}/
└── __tests__/
    └── slice.test.ts              # Reducer + actions + side effects
```

#### Hook Tests

```
src/hooks/{category}/
└── __tests__/
    └── use{HookName}.test.ts(x)   # .tsx if hook uses JSX, .ts otherwise
```

**Categories:** `ui/`, `auth/`, or root level.

#### App Route Tests

```
src/app/
└── __tests__/
    ├── layout.test.tsx            # RootLayout
    ├── error.test.tsx             # Error boundary
    └── smoke.test.tsx             # Route smoke tests
```

#### E2E Tests

```
e2e/
├── {feature}.spec.ts              # One file per feature/flow
└── testids.ts                     # Centralized test ID constants
```

**E2E rules:**
- Playwright with Chromium only
- All spec files use `.spec.ts` extension
- Test IDs imported from `e2e/testids.ts` (never hardcoded)
- Dev server on port 9000 (`http://localhost:9000`)

### Test Utilities

```
src/test-utils/
├── framer-motion-mock.ts          # Comprehensive motion mock (286 lines)
└── axe-helper.ts                  # jest-axe integration helper
```

| Utility | Purpose | Usage |
|---------|---------|-------|
| `framer-motion-mock.ts` | Mocks all `m.*` / `motion.*` components, `LazyMotion`, `AnimatePresence`, and hooks (`useReducedMotion`, `useInView`, `useScroll`, `useTransform`, `useSpring`, `useMotionValue`, `useAnimation`) | `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))` |
| `axe-helper.ts` | Wraps `jest-axe` with `checkA11y()` function | `import { checkA11y } from "@/test-utils/axe-helper"` |

**No centralized test wrapper.** Each test creates its own `QueryClient` / Redux store for full isolation (see Patterns 1 and 4 in Section 3).

### File Naming Rules

| Type | Extension | Naming Pattern | Example |
|------|-----------|----------------|---------|
| React component test | `.test.tsx` | `{ComponentName}.test.tsx` | `ThemeButton.test.tsx` |
| Logic/schema test | `.test.ts` | `{subject}.test.ts` | `schema.test.ts` |
| E2E spec | `.spec.ts` | `{feature}.spec.ts` | `theme.spec.ts` |
| Snapshot (auto) | `.snap` | `{TestFile}.snap` | `ProjectCard.test.tsx.snap` |

**Rule:** New test files MUST be TypeScript (`.test.tsx` or `.test.ts`). Never create `.test.jsx` or `.test.js`.

---

## 2. Test File Templates

### Template 1: Atom Component Test

**Based on:** `src/ui/atoms/buttons/ThemeButton/__tests__/ThemeButton.test.tsx`

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// Import the relevant slice reducer
import themeModeReducer from "@/state/slices/themeMode/slice";
// Import the component under test
import ThemeButton from "../index";

// ── Test Store Setup ──────────────────────────────────────────
// Create a minimal store with only the slices this component needs
const createTestStore = (initialMode: "light" | "dark" = "light") =>
  configureStore({
    reducer: { themeMode: themeModeReducer },
    preloadedState: { themeMode: { mode: initialMode } },
  });

// Helper: render with Redux Provider
const renderWithProvider = (
  ui: React.ReactElement,
  initialMode: "light" | "dark" = "light"
) => {
  const store = createTestStore(initialMode);
  return { ...render(<Provider store={store}>{ui}</Provider>), store };
};

// ── Tests ─────────────────────────────────────────────────────
describe("ThemeButton", () => {
  describe("accessibility", () => {
    it("has role switch for toggle semantics", () => {
      renderWithProvider(<ThemeButton />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("has aria-label describing the action", () => {
      renderWithProvider(<ThemeButton />, "light");
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-label",
        "Switch to dark mode"
      );
    });

    it("is focusable", () => {
      renderWithProvider(<ThemeButton />);
      const toggle = screen.getByRole("switch");
      toggle.focus();
      expect(document.activeElement).toBe(toggle);
    });
  });

  describe("functionality", () => {
    it("toggles theme on click", () => {
      const { store } = renderWithProvider(<ThemeButton />, "light");
      fireEvent.click(screen.getByRole("switch"));
      expect(store.getState().themeMode.mode).toBe("dark");
    });
  });
});
```

**Pattern notes:**
- `createTestStore()` — minimal Redux store with only needed slices
- `renderWithProvider()` — wraps component with `<Provider>`
- Grouped `describe` blocks: accessibility, functionality
- Role-based queries (`getByRole`) preferred over test IDs for unit tests

### Template 2: Domain Schema Test

**Based on:** `src/domains/article/model/__tests__/schema.test.ts`

```typescript
import { ArticleSchema, ArticlesSchema } from "../schema";

// ── Valid Data Fixture ────────────────────────────────────────
const validArticle = {
  id: 1,
  title: "Test Article",
  url: "/articles/test",
  slug: "test",
  reading_time: "5 min read",
  published_at: "2023-03-22",
  summary: "A test article summary",
  img: "/images/test.jpg",
  featured: true,
  status: "published",
};

// ── Tests ─────────────────────────────────────────────────────
describe("ArticleSchema", () => {
  describe("valid articles", () => {
    it("parses valid article with all fields", () => {
      const result = ArticleSchema.safeParse(validArticle);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
        expect(result.data.title).toBe("Test Article");
      }
    });

    it("applies default value for optional fields", () => {
      const withoutStatus = { ...validArticle };
      delete (withoutStatus as Record<string, unknown>).status;
      const result = ArticleSchema.safeParse(withoutStatus);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("published");
      }
    });
  });

  describe("invalid articles", () => {
    it("fails when required field is missing", () => {
      const invalid = { ...validArticle };
      delete (invalid as Record<string, unknown>).id;
      expect(ArticleSchema.safeParse(invalid).success).toBe(false);
    });

    it("fails when enum value is invalid", () => {
      const invalid = { ...validArticle, status: "archived" };
      expect(ArticleSchema.safeParse(invalid).success).toBe(false);
    });
  });
});

describe("ArticlesSchema", () => {
  it("parses valid articles array", () => {
    const result = ArticlesSchema.safeParse([validArticle]);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
    }
  });
});
```

**Pattern notes:**
- Zod `.safeParse()` — never `.parse()` (avoids throw in test)
- Type-safe success check: `if (result.success)` before accessing `.data`
- Separate `describe` blocks for valid and invalid cases
- Test default values and enum validation explicitly

### Template 3: Redux Slice Test

**Based on:** `src/state/slices/__tests__/themeMode.slice.test.ts`

```typescript
import themeModeReducer, {
  setDarkThemeMode,
  setLightThemeMode,
  toggleThemeMode,
  type ThemeModeState,
  type ThemeMode,
} from "../themeMode/slice";

const LIGHT: ThemeMode = "light";
const DARK: ThemeMode = "dark";

// ── Browser API Mocks ─────────────────────────────────────────
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)" ? matches : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// ── Tests ─────────────────────────────────────────────────────
describe("themeMode slice", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("returns initial state (light mode)", () => {
    const state = themeModeReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual({ mode: LIGHT });
  });

  it("sets dark mode", () => {
    const state = themeModeReducer({ mode: LIGHT }, setDarkThemeMode());
    expect(state.mode).toBe(DARK);
  });

  it("toggles between light and dark", () => {
    const dark = themeModeReducer({ mode: LIGHT }, toggleThemeMode());
    expect(dark.mode).toBe(DARK);
    const light = themeModeReducer(dark, toggleThemeMode());
    expect(light.mode).toBe(LIGHT);
  });
});
```

**Pattern notes:**
- Pure reducer testing: `reducer(state, action)` → expected state
- `localStorage.clear()` + `jest.clearAllMocks()` in `beforeEach`
- Browser API mocks (`matchMedia`) as helper functions
- Test initial state, each action, and toggle round-trips

### Template 4: Hook Test

**Adapted from:** `src/hooks/ui/__tests__/useReducedMotion.test.ts`

```typescript
import { renderHook } from "@testing-library/react";

// ── Mock Setup (before imports) ───────────────────────────────
// jest.mock is hoisted above imports — see Section 4
const mockUseReducedMotion = jest.fn();

jest.mock("framer-motion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

// ── Import AFTER mock declaration ─────────────────────────────
import { useReducedMotion } from "../useReducedMotion";

// ── Tests ─────────────────────────────────────────────────────
describe("useReducedMotion", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReset();
  });

  it("returns false when user does not prefer reduced motion", () => {
    mockUseReducedMotion.mockReturnValue(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when user prefers reduced motion", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("returns false for null (defensive)", () => {
    mockUseReducedMotion.mockReturnValue(null);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
```

**Pattern notes:**
- `renderHook()` from `@testing-library/react`
- Mock variable declared at module scope (before `jest.mock`)
- `mockReset()` in `beforeEach` for test isolation
- Test defensive cases (null, undefined returns)

**Query hook variant** (based on `useArticles.test.tsx`):

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useArticles from "../useArticles";

jest.useFakeTimers();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestQueryWrapper";
  return Wrapper;
};

describe("useArticles", () => {
  it("fetches and returns articles", async () => {
    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);

    jest.advanceTimersByTime(2000);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });
});
```

### Template 5: E2E Spec Test

**Based on:** `e2e/theme.spec.ts`

```typescript
import { test, expect } from "@playwright/test";
import { TESTIDS } from "./testids";

// ── Viewport Configuration ────────────────────────────────────
test.use({ viewport: { width: 1000, height: 720 } });

// ── Helper Functions ──────────────────────────────────────────
function getThemeButton(page: import("@playwright/test").Page) {
  return page
    .getByTestId("header-ui-zone")
    .getByTestId(TESTIDS.theme.toggleButton);
}

// ── Tests ─────────────────────────────────────────────────────
test.describe("Theme Toggle", () => {
  test("button is visible and has correct role", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("themeMode");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const button = getThemeButton(page);
    await expect(button).toBeVisible({ timeout: 10000 });
    await expect(button).toHaveRole("switch");
  });

  test("click toggles theme", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("themeMode");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const button = getThemeButton(page);
    const initial = await button.getAttribute("aria-checked");
    await button.evaluate((btn) => (btn as HTMLElement).click());

    const expected = initial === "true" ? "false" : "true";
    await expect(button).toHaveAttribute("aria-checked", expected, {
      timeout: 5000,
    });
  });

  test("respects system dark mode preference", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("themeMode");
    });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
```

**Pattern notes:**
- `test.use({ viewport })` for breakpoint control
- Helper functions for repeated element queries
- `addInitScript()` for localStorage setup (runs before page scripts)
- `page.waitForLoadState("networkidle")` for reliability
- `emulateMedia()` for system preference testing
- Test IDs from centralized `TESTIDS` constant — never hardcoded strings
- Timeouts: 10000ms for visibility, 5000ms for attribute changes

---

## 3. Mock Patterns Reference

### Pattern 1: Redux Store Mock

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      themeMode: themeModeReducer,
      // Add only slices needed by the component
    },
    preloadedState,
  });

const renderWithProvider = (ui: React.ReactElement, preloadedState = {}) => {
  const store = createTestStore(preloadedState);
  return { ...render(<Provider store={store}>{ui}</Provider>), store };
};

// Usage:
const { store } = renderWithProvider(<Component />, {
  themeMode: { mode: "dark" },
});
// Assert state changes:
expect(store.getState().themeMode.mode).toBe("light");
```

**When to use:** Components that read from or dispatch to Redux (`useSelector`, `useDispatch`, custom hooks like `useMenuPanel`, `useThemeMode`).

### Pattern 2: Framer Motion Mock

```typescript
jest.mock("framer-motion", () =>
  require("@/test-utils/framer-motion-mock")
);
```

**When to use:** Any component importing from `framer-motion` — `m.*` elements, `AnimatePresence`, `useReducedMotion`, or `LazyMotion`.

**What it provides:**
- All `m.*` and `motion.*` elements render as plain HTML (with motion props stripped)
- `LazyMotion` renders children directly (Fragment passthrough)
- `AnimatePresence` renders children directly
- `useReducedMotion()` returns `false` by default
- `useInView()`, `useScroll()`, `useTransform()`, `useSpring()`, `useMotionValue()`, `useAnimation()` return sensible defaults

### Pattern 3: Hook Mock

```typescript
// 1. Declare mock variable at module scope
const mockUseReducedMotion = jest.fn();

// 2. jest.mock factory references the module-scope variable
jest.mock("framer-motion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

// 3. Import AFTER mock (imports are hoisted too, but mock wins)
import { useReducedMotion } from "../useReducedMotion";

// 4. Control return value per test
beforeEach(() => mockUseReducedMotion.mockReset());

it("test case", () => {
  mockUseReducedMotion.mockReturnValue(true);
  // ... test using the mocked value
});
```

**When to use:** Testing components or hooks that depend on other hooks.

### Pattern 4: React Query Wrapper

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestQueryWrapper";
  return Wrapper;
};

// Usage with renderHook:
const { result } = renderHook(() => useArticles(), {
  wrapper: createWrapper(),
});
```

**When to use:** Testing React Query hooks (`useArticles`, `useProjects`, etc.). Always set `retry: false` to prevent flaky tests.

**With fake timers** (for mock data with simulated delay):
```typescript
jest.useFakeTimers();
// ... render hook
jest.advanceTimersByTime(2000);
await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

### Pattern 5: Next.js Navigation Mock (Global)

Defined in `jest.setup.js` — applies to ALL tests automatically:

```typescript
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
```

**When to use:** Already global. Override in specific tests if you need different pathname or search params:

```typescript
const mockUsePathname = jest.fn().mockReturnValue("/about");
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  usePathname: () => mockUsePathname(),
}));
```

### Pattern 6: Direct Import Mock (`__esModule`)

```typescript
jest.mock("@/atoms/icons/GitHubIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="github-icon" />,
}));
```

**When to use:** Mocking components imported via direct path (not barrel). The `__esModule: true` flag is **required** for default exports to work correctly with Jest's module system.

**Without `__esModule: true`**, Jest treats the mock as a CommonJS module and the default export won't resolve.

### Pattern 7: Next.js Link Mock

```typescript
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});
```

**When to use:** Components rendering `<Link>`. Simplifies assertions — test `<a>` attributes directly.

---

## 4. Jest Mock Hoisting Rules

### The Problem

`jest.mock()` calls are **hoisted by Babel to the top of the file**, above all `import` and `const` declarations. This means any variable referenced inside a `jest.mock()` factory must be declared in a way that survives hoisting.

### Anti-pattern: Referencing `const` in Factory

```typescript
// BAD — mockIcon is undefined when jest.mock runs
const mockIcon = (id: string) => () => <svg data-testid={id} />;

jest.mock("@/atoms/icons/GitHubIcon", () => ({
  __esModule: true,
  default: mockIcon("github-icon"),  // ReferenceError!
}));
```

**Why it fails:** `jest.mock()` is hoisted above `const mockIcon`, so `mockIcon` is `undefined` when the factory executes.

### Fix: Inline Everything

```typescript
// GOOD — factory is self-contained
jest.mock("@/atoms/icons/GitHubIcon", () => ({
  __esModule: true,
  default: () => <svg data-testid="github-icon" />,
}));
```

### Exception: `jest.fn()` at Module Scope

Variables declared with `jest.fn()` at module scope work because Jest recognizes the `jest` global before hoisting:

```typescript
// GOOD — jest.fn() is available at hoist time
const mockToggle = jest.fn();

jest.mock("@/hooks/ui", () => ({
  useTouchState: () => ({
    isTouched: false,
    handleTouchStart: mockToggle,
  }),
}));
```

### `__esModule: true` Rule

When mocking a module that uses `export default`, you **must** include `__esModule: true`:

```typescript
// Direct import: import GitHubIcon from "@/atoms/icons/GitHubIcon"
jest.mock("@/atoms/icons/GitHubIcon", () => ({
  __esModule: true,           // Required for default exports
  default: () => <svg />,
}));

// Named import: import { useReducedMotion } from "framer-motion"
jest.mock("framer-motion", () => ({
  useReducedMotion: () => false,  // No __esModule needed for named exports
}));
```

**Rule of thumb:** If the real module uses `export default` → add `__esModule: true`. If it uses named exports only → not needed.

---

## 5. Snapshot Policy

### Current State

| File | Snapshots | Component |
|------|-----------|-----------|
| `ProjectCard/__tests__/__snapshots__/ProjectCard.test.tsx.snap` | 3 | ProjectCard variants (grid, featured, list) |
| `MenuFloating/__tests__/__snapshots__/MenuFloatingClient.test.tsx.snap` | 1 | Floating menu touch state |
| `projects/__tests__/__snapshots__/ProjectListSkeleton.test.tsx.snap` | 1 | Skeleton loading state |

**Total:** 3 snapshot files, 5 snapshots.

### Rules

1. **Keep existing snapshots.** They detect unintended structural changes in complex variant components.
2. **Do not add new snapshot tests.** Prefer explicit assertions.
3. **Update snapshots** when visual changes are intentional: `npm test -- -u`.

### Rationale

Snapshots are brittle for styling changes (class name updates, Tailwind class reordering) and produce noisy diffs. Explicit assertions are more maintainable and communicate intent:

```typescript
// PREFERRED — explicit assertion
expect(screen.getByRole("link")).toHaveAttribute("href", "/projects/demo");

// AVOID — snapshot of entire component
expect(container).toMatchSnapshot();
```

---

## 6. Legacy & Known Debt

### Legacy Test Placement

Two Redux slice tests live in a shared `__tests__/` directory instead of co-located with their slice:

| Test File | Current Location | Correct Location |
|-----------|-----------------|-----------------|
| `menuPanel.slice.test.ts` | `src/state/slices/__tests__/` | `src/state/slices/menuPanel/__tests__/slice.test.ts` |
| `themeMode.slice.test.ts` | `src/state/slices/__tests__/` | `src/state/slices/themeMode/__tests__/slice.test.ts` |

**Status:** Low priority. Tests function correctly. Migration is a future task.

**Compare with co-located slices** (correct pattern):
- `src/state/slices/authPanel/__tests__/slice.test.ts`
- `src/state/slices/EmailClipboard/__tests__/slice.test.ts`

### Cross-Cutting A11y Test Approaches

Three separate accessibility testing approaches coexist:

| Approach | Files | Value |
|----------|-------|-------|
| jest-axe full-page scan | `a11y-axe.test.tsx` | Lower — requires extensive component mocking, reducing test fidelity |
| Section-level assertions | `Sections.a11y.test.tsx` | Higher — targeted ARIA attribute checks, less mocking |
| Overlay-specific a11y | `Floating.a11y.test.tsx`, `FloatingMobile.a11y.test.tsx` | Higher — focused on overlay interaction patterns |

**Recommendation for new tests:** Prefer targeted assertions over full-page jest-axe scans. Reserve jest-axe for integration-level checks with minimal mocking.

```typescript
// PREFERRED — targeted assertion
expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
expect(screen.getByRole("switch")).toHaveAccessibleName("Switch to dark mode");

// USE SPARINGLY — jest-axe scan (needs many mocks for complex pages)
import { checkA11y } from "@/test-utils/axe-helper";
const { container } = render(<SimpleComponent />);
await checkA11y(container);
```

---

## 7. Test Configuration Reference

### Jest (`jest.config.cjs`)

| Setting | Value | Notes |
|---------|-------|-------|
| Framework | `next/jest` wrapper | Auto-handles CSS, images, Next.js transforms |
| Environment | `jsdom` | DOM simulation for React components |
| Test match | `**/__tests__/**/*.test.[jt]s?(x)` | Only matches files in `__tests__/` directories |
| Setup file | `jest.setup.js` | Loads `@testing-library/jest-dom` + global Next.js navigation mock |
| Module aliases | 20+ `moduleNameMapper` entries | Mirrors `tsconfig.json` paths exactly |
| Coverage thresholds | None configured | See proposed thresholds below |
| CSS handling | Auto-mocked | `next/jest` transforms CSS imports to empty objects |

### Jest Setup (`jest.setup.js`)

Global configuration applied to every test:

```javascript
import "@testing-library/jest-dom";  // Adds .toBeInTheDocument(), .toHaveAttribute(), etc.

// Global mock: Next.js navigation (required by TransitionProvider)
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn(), back: jest.fn(), forward: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
```

### Playwright (`playwright.config.ts`)

| Setting | Value | Notes |
|---------|-------|-------|
| Test directory | `./e2e` | All E2E specs |
| Browser | Chromium only | Single project (no Firefox/Safari) |
| Base URL | `http://localhost:9000` | Dev server port |
| Parallel | `fullyParallel: true` | Tests run concurrently |
| Retries | 2 in CI, 0 locally | CI resilience |
| Workers | 1 in CI, auto locally | Sequential in CI for stability |
| Reporter | `github` in CI, `html` locally | Different output formats |
| Web server | `npm run dev` (auto-started) | Reuses existing server outside CI |
| Trace | `on-first-retry` | Debug data on failures |
| `forbidOnly` | `true` in CI | Prevents accidental `.only` in pipeline |

### Proposed Coverage Thresholds

From [test-strategy-2026-02-11.md](../../_bmad-output/analysis/test-strategy-2026-02-11.md) — not yet enforced:

```javascript
// jest.config.cjs — proposed addition (after gap remediation)
coverageThreshold: {
  global: {
    branches: 40, functions: 50, lines: 50, statements: 45,
  },
  "./src/domains/": {
    branches: 60, functions: 70, lines: 70, statements: 65,
  },
  "./src/state/slices/": {
    branches: 80, functions: 80, lines: 80, statements: 80,
  },
}
```

**Status:** Not enforced. Enforcing requires filling P1-P3 gaps first (see test-strategy doc).

---

## 8. Codebase Metrics Appendix

### Test File Counts

| Category | Files | Extension |
|----------|-------|-----------|
| Unit tests (React) | 70 | `.test.tsx` |
| Unit tests (logic) | 25 | `.test.ts` |
| Unit tests (legacy) | 1 | `.test.js` |
| **Total unit tests** | **96** | — |
| E2E specs | 22 | `.spec.ts` |
| **Grand total** | **118** | — |

### Test Distribution by Layer

| Layer | Test Files | Tested / Total | Coverage % |
|-------|-----------|---------------|------------|
| Domains (model) | 13 | 7/11 | 64% |
| Domains (queries) | 7 | 5/11 | 45% |
| Redux slices | 4 | 4/5 | 80% |
| State providers | 2 | 2/~3 | ~67% |
| Hooks | 5 | 5/~8 | ~63% |
| Atoms | 11 | 11/~87 | ~13% |
| Molecules | 15 | 15/32 | 47% |
| Organisms | 18 | 18/20 | 90% |
| App routes | 12 | — | — |
| Services | 4 | — | — |
| Lib | 2 | — | — |
| Styles | 1 | — | — |
| Other (`src/__tests__/`) | 1 | — | — |
| E2E critical flows | 22 | 7/7 defined | 100% |

### Test Pyramid (Actual)

```
          /  22 E2E  \         (19%)
         /  ~15 Integ \        (13%)
        /   ~81 Unit   \       (68%)
```

**Target ratio:** 70% unit / 15% integration / 15% E2E — actual distribution is close to target.

### Cross-References

- **Gap details and priorities:** [test-strategy-2026-02-11.md](../../_bmad-output/analysis/test-strategy-2026-02-11.md) — Sections 3-4
- **Component folder structure:** [folder-structure.md](./folder-structure.md) — Section "Component Folder Contents"
- **Props and component patterns:** [component-api.md](./component-api.md) — Section "Stateful vs Stateless Decision Guide"
- **Style testing considerations:** [styles-architecture.md](./styles-architecture.md) — Section "Component Style Examples"
- **Critical E2E flows:** [CLAUDE.md](../../CLAUDE.md) — Section "Critical E2E Flows"
