# Component API & Props Standard

> Canonical guide for typing, naming, and structuring component props.
> Part of Epic 20 — Component & Style Architecture.
> See also: [folder-structure.md](./folder-structure.md), [styles-architecture.md](./styles-architecture.md)

---

## 1. Props Interface Standard

### Rule: Always use `interface`, never `type` alias

```typescript
// ✅ CORRECT — interface for component props
interface ArrowButtonProps {
  href: string;
  text: string;
  target?: "_blank" | "_self";
}

// ❌ WRONG — type alias for component props
type ArrowButtonProps = {
  href: string;
  text: string;
};
```

**Rationale:** `interface` supports declaration merging, produces clearer error messages, and is the convention across 90%+ of the codebase. Reserve `type` for utility type compositions like `Pick<>` and `Omit<>` (see Section 8 for accepted exceptions, including Experience and Education).

### Rule: Name as `ComponentNameProps`

The interface name combines the PascalCase component name with the `Props` suffix:

| Component | Interface Name |
|-----------|---------------|
| ArrowButton | `ArrowButtonProps` |
| NeumorphicToggle | `NeumorphicToggleProps` |
| FeaturedArticlesCarousel | `FeaturedArticlesCarouselProps` |
| ArticleCard | `ArticleCardProps` |

### Rule: Inline vs Separate File

| Condition | Placement | Example |
|-----------|-----------|---------|
| < 10 properties, single consumer | Inline in component file | `ArrowButtonProps` in `ArrowButton/index.tsx` |
| >= 10 properties | Separate `ComponentName.types.ts` | `ArticleCard.types.ts` |
| Shared across multiple files | Separate `ComponentName.types.ts` | `ProjectCard.types.ts` (4 interfaces) |
| Sub-component types needed | Separate `ComponentName.types.ts` | `ArticleCard.types.ts` (Props + Meta + Link + Variant) |

**Current codebase:** 5 components use `.types.ts` files (ArticleHoverThumbnail, ArticleAppearance, ArticleListItem, ArticleCard, ProjectCard). All others define props inline.

### Rule: Export visibility

```typescript
// Local props (only used in this file) — no export
interface ArrowButtonProps {
  href: string;
  text: string;
  target?: "_blank" | "_self";
}

// Shared props (used by other files) — export
export interface ArticleCardProps {
  article: Article;
  className?: string;
}
```

### Import pattern for separate `.types.ts` files

```typescript
// ComponentName/index.tsx
import type { ArticleCardProps } from "./ArticleCard.types";
```

Use `import type` to ensure types are erased at compile time and don't affect bundles.

### Annotated Template

```typescript
import type { ReactNode } from "react";

/**
 * Props for the ExampleComponent
 *
 * @see Story XX.X for implementation context
 */
interface ExampleComponentProps {
  /** Unique identifier (required — no default) */
  id: string;

  /** Display title (required — no default) */
  title: string;

  /** Whether the component is currently active */
  isActive: boolean;

  /** Callback when the component is toggled */
  onToggle: (_id: string, _isActive: boolean) => void;

  /** Content to render inside the component */
  children: ReactNode;

  /** Optional CSS class for customization */
  className?: string;

  /** Optional delay in milliseconds */
  delay?: number;
}
```

---

## 2. Props Naming Conventions

### Naming Rules Table

| Category | Prefix | Valid Examples | Invalid Examples |
|----------|--------|---------------|-----------------|
| Boolean state | `is*` | `isOpen`, `isActive`, `isPressed`, `isExpanded`, `isLoading` | `open`, `active`, `loading` |
| Boolean state | `has*` | `hasError`, `hasWorkDetails`, `hasDetails` | `error`, `workDetails` |
| Boolean state | `should*` | `shouldReduceMotion` | `reduceMotion` |
| Boolean state | `can*` | `canAnimate` | `animate` |
| Event handler (prop) | `on*` | `onClick`, `onChange`, `onToggle`, `onSubmit`, `onClose` | `handleClick`, `clickHandler` |
| Event handler (internal) | `handle*` | `handleClick`, `handleToggle`, `handleClose` | (internal only, never in interface) |
| Children | `children` | `children: ReactNode` | `content`, `body`, `slot` |
| CSS class | `className` | `className?: string` | `cssClass`, `class`, `style` |
| Render slot (recommended) | `render*` | `renderIcon`, `renderHeader` | `iconSlot`, `headerComponent` |
| Discriminator | `mode`, `variant`, `type` | `mode: "login" \| "signup"`, `variant: "featured" \| "grid"` | `kind`, `style` |

### Boolean Prop Convention

Boolean props use descriptive prefixes that read naturally:

```typescript
interface ComponentProps {
  // ✅ Reads as: "is this component open?"
  isOpen: boolean;

  // ✅ Reads as: "has this component been touched?"
  isTouched: boolean;

  // ✅ Reads as: "should we reduce motion?"
  shouldReduceMotion: boolean;

  // ❌ Ambiguous — is this a noun or adjective?
  open: boolean;
  touched: boolean;
}
```

**`show*` convention:** Used for derived boolean state within components (e.g., `const showControls = total > 1`), not as prop names.

### Event Handler Naming: `on*` (prop) → `handle*` (internal)

```typescript
// Interface: always on* prefix
interface NeumorphicToggleProps {
  onToggle: (_id: string, _isPressed: boolean) => void;
}

// Implementation: handle* prefix for internal handler
function NeumorphicToggle({ onToggle }: NeumorphicToggleProps) {
  const handleClick = () => {
    onToggle(id, !isPressed);  // Delegates to prop callback
  };

  return <button onClick={handleClick}>...</button>;
}
```

**Why this convention:** `on*` signals "this is an event the consumer can listen to." `handle*` signals "this is an internal function that processes the event." This separation is consistent across ~90% of the codebase.

### Children Pattern

```typescript
import type { ReactNode } from "react";

// ✅ Standard content projection
interface FloatingProps {
  children: ReactNode;
}

// ✅ Children with other props
interface ArticleLinkProps {
  url: string;
  slug: string;
  children: ReactNode;  // Required for content
  className?: string;
}
```

Use `ReactNode` (not `ReactElement`) — it accepts strings, numbers, fragments, arrays, and JSX.

### className Convention

```typescript
// ✅ Optional with empty string default
interface HireMeButtonProps {
  className?: string;
}

const HireMeButton = ({ className = "" }: HireMeButtonProps) => (
  <a className={`hire-me-button ${className}`}>...</a>
);
```

### Render Slot Convention (Recommended)

The `render*` prefix is the **recommended pattern** for component injection props (e.g., `renderIcon`, `renderHeader`). No components currently use this pattern — the codebase uses `children` for content projection instead. Adopt `render*` when a component needs multiple named slots in new code.

### Underscore Prefix on Callback Parameters

The codebase uses `_` prefix on callback parameter names to indicate the parameter is part of the type signature but may not be used by every consumer:

```typescript
interface NeumorphicToggleProps {
  // Parameters prefixed with _ in the type definition
  onToggle: (_id: string, _isPressed: boolean) => void;
}

interface TechnologyFilterProps {
  onToggle: (_tech: string) => void;
  onClearAll: () => void;
}
```

This satisfies ESLint's `no-unused-vars` rule when consumers destructure selectively.

### Discriminated Unions

For components with multiple shapes, use a discriminator prop:

```typescript
// Real example: AuthForm
type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

// Real example: ProjectCard (variant selection via view)
// ArticleCard (variant selection via article.featured flag)
```

---

## 3. Default Values & Optional Props

### Rule: Destructuring defaults only — never `defaultProps`

```typescript
// ✅ CORRECT — inline destructuring default
const ArrowButton = ({
  href,
  text,
  target = "_blank",
}: ArrowButtonProps) => { ... };

// ✅ CORRECT — multiple defaults
const Floating = ({
  id,
  title = "Dialog",
  children,
}: FloatingProps) => { ... };

// ❌ WRONG — legacy defaultProps pattern
ArrowButton.defaultProps = { target: "_blank" };
```

**Codebase status:** Zero components use `defaultProps`. All defaults are inline destructuring.

### Rule: Required by default

Props are required unless there's a genuine reason for them to be optional:

```typescript
interface FeaturedArticlesCarouselProps {
  articles: Article[];        // Required — component needs data
  interval?: number;          // Optional — has sensible default (5000ms)
}
```

**When to use `?`:**
- Props with sensible defaults (`className = ""`, `delay = 0`, `interval = 5000`)
- Callback props that consumers may not need (`onSubmit?`, `onChange?`)
- Props that enhance but aren't essential (`title?`, `ariaLabel?`)

### Common Default Patterns

| Pattern | Example | Component |
|---------|---------|-----------|
| Empty string | `className = ""` | NavigationItemButton, NeumorphicToggle, HireMeButton |
| String literal | `target = "_blank"` | ArrowButton |
| String literal | `title = "Dialog"` | Floating |
| Number (timeout) | `interval = AUTO_ADVANCE_MS` | FeaturedArticlesCarousel |
| Number (delay) | `simulateDelay = 2500` | Chat/Submit |
| Number (limit) | `limit = 4500` | Chat/MessageBox |
| Boolean | `isLoading = false` | Chat/EmailInput |

### Optional Callback Guard

When calling optional callbacks, use optional chaining:

```typescript
// ✅ CORRECT — safe invocation of optional callback
onChange?.(newSelected);

// ✅ CORRECT — with event parameter
onClick?.(e);

// ❌ WRONG — manual null check (verbose)
if (onChange) {
  onChange(newSelected);
}
```

---

## 4. Event Handler Pattern Guide

### Type-Safe Callback Signatures

| Pattern | Signature | Real Component |
|---------|-----------|---------------|
| Simple value | `(_tech: string) => void` | TechnologyFilter |
| Multi-param | `(_id: string, _isPressed: boolean) => void` | NeumorphicToggle |
| Promise return | `() => Promise<boolean>` | Chat/Submit |
| Event object | `(_event: ChangeEvent<HTMLInputElement>) => void` | Chat/EmailInput |
| Mouse event | `(_e: MouseEvent<HTMLAnchorElement>) => void` | TransitionLink |
| Complex callback | `(isHovered: boolean, mousePosition: MousePosition \| null) => void` | ArticleListItem |

### Internal vs External Naming

```typescript
// INTERFACE: on* prefix (public API)
interface SubmitProps {
  onSubmit?: () => Promise<boolean>;
}

// IMPLEMENTATION: handle* prefix (internal handler)
export function Submit({ onSubmit }: SubmitProps) {
  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (state !== "idle") {
      e.preventDefault();
      return;
    }

    setState("sending");

    if (onSubmit) {
      const success = await onSubmit();
      // ... handle result
    }
  };

  return <button onClick={handleClick}>...</button>;
}
```

### Promise Callbacks

For async operations, use `Promise<T>` return types:

```typescript
interface SubmitProps {
  /** Callback when form should actually submit. Returns true on success. */
  onSubmit?: () => Promise<boolean>;
}
```

The component awaits the result and updates state accordingly (e.g., `sending` → `success` or `idle`).

### Event Object Typing

Use specific React event types from the `react` package:

```typescript
import type { ChangeEvent, MouseEvent, FormEvent, KeyboardEvent } from "react";

// Input changes
onChange: (_event: ChangeEvent<HTMLInputElement>) => void;

// Click events
onClick?: (_e: MouseEvent<HTMLAnchorElement>) => void;

// Form submission
onSubmit: (_event: FormEvent<HTMLFormElement>) => void;
```

### Extending Library Event Handlers

When wrapping library components (e.g., Next.js Link), use `Omit<>` to override specific handlers:

```typescript
import type { ComponentProps, MouseEvent } from "react";
import Link from "next/link";

type LinkProps = ComponentProps<typeof Link>;

export interface TransitionLinkProps extends Omit<LinkProps, "onClick"> {
  onClick?: (_e: MouseEvent<HTMLAnchorElement>) => void;
}
```

---

## 5. Component Examples

### Example 1: Atom — ArrowButton (< 5 props, inline interface)

**Source:** `src/ui/atoms/buttons/ArrowButton/index.tsx`

```typescript
import "./styles.css";
import Link from "next/link";
import ArrowIcon from "@/atoms/icons/ArrowIcon";

// Inline interface — 3 props, simple atom
interface ArrowButtonProps {
  href: string;
  text: string;
  target?: "_blank" | "_self";
}

// Destructuring with default
const ArrowButton = ({ href, text, target = "_blank" }: ArrowButtonProps) => {
  return (
    <Link
      href={href}
      target={target}
      className="arrow-link focus-ring"
      download={target === "_self"}
      aria-label={text}
      title={text}
    >
      {text}
      <ArrowIcon className="arrow-icon" />
    </Link>
  );
};

export default ArrowButton;
```

**Key patterns:**
- Inline `interface` (only 3 props)
- Destructuring default: `target = "_blank"`
- Union type for constrained values: `"_blank" | "_self"`
- Stateless — no hooks, pure render
- No `"use client"` — server-compatible

### Example 2: Molecule — FeaturedArticlesCarousel (2 props, stateful with hooks)

**Source:** `src/ui/molecules/FeaturedArticlesCarousel/index.tsx`

```typescript
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FeaturedArticleCard } from "@/organisms/ArticleCard";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type { Article } from "@/domains/article/model/schema";
import "./styles.css";

const AUTO_ADVANCE_MS = 5000;

interface FeaturedArticlesCarouselProps {
  articles: Article[];
  interval?: number;
}

function FeaturedArticlesCarousel({
  articles,
  interval = AUTO_ADVANCE_MS,
}: FeaturedArticlesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const total = articles.length;
  const showControls = total > 1;

  // handle* prefix for internal handlers
  const handlePrevClick = useCallback(() => { /* ... */ }, []);
  const handleNextClick = useCallback(() => { /* ... */ }, []);
  const handleDotClick = useCallback((index: number) => { /* ... */ }, []);

  return (
    <div
      className="featured-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured articles"
    >
      {/* Viewport, slides, controls, dots */}
    </div>
  );
}

export default FeaturedArticlesCarousel;
```

**Key patterns:**
- `"use client"` — needs hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
- Domain type import: `Article` from domain model
- Destructuring default: `interval = AUTO_ADVANCE_MS` (named constant)
- Derived state: `const showControls = total > 1` (local boolean, not a prop)
- Internal handlers use `handle*` prefix (no `on*` props — this molecule manages its own state)
- WCAG: `useReducedMotion()` for accessible animations, `aria-roledescription="carousel"`
- BEM class names (see [styles-architecture.md](./styles-architecture.md))

### Example 3: Organism — ArticleCard (separate `.types.ts`, variant dispatch)

**Source:** `src/ui/organisms/ArticleCard/ArticleCard.types.ts`

```typescript
import type { ReactNode } from "react";
import type { Article } from "@/domains/article/model/schema";

/**
 * Props for the ArticleCard component
 * Extends the domain model with presentation-specific options
 */
export interface ArticleCardProps {
  /** Article data from the domain model */
  article: Article;
  /** Optional class name for custom styling */
  className?: string;
}

/**
 * Props shared by both Featured and Grid variants
 */
export interface ArticleCardVariantProps {
  /** Article data from the domain model */
  article: Article;
  /** Optional class name for custom styling */
  className?: string;
}

/**
 * Props for the ArticleMeta subcomponent
 */
export interface ArticleMetaProps {
  /** Publication date in ISO format */
  publishedAt: string;
  /** Reading time (e.g., "9 min read") */
  readingTime: string;
  /** Optional class name */
  className?: string;
}

/**
 * Props for the ArticleLink subcomponent
 */
export interface ArticleLinkProps {
  /** Article URL (internal or external) */
  url: string;
  /** Article slug for internal routing */
  slug: string;
  /** Children to render inside the link */
  children: ReactNode;
  /** Optional class name */
  className?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}
```

**Source:** `src/ui/organisms/ArticleCard/index.tsx` (variant dispatch)

```typescript
import type { ArticleCardProps } from "./ArticleCard.types";

export function ArticleCard({ article, className }: ArticleCardProps) {
  if (article.featured) {
    return <FeaturedArticleCard article={article} className={className} />;
  }
  return <GridArticleCard article={article} className={className} />;
}
```

**Key patterns:**
- Separate `.types.ts` — 4 interfaces for main component + sub-components
- `export interface` — shared across variant files
- `import type` for type-only imports
- JSDoc on every property with `/** */` format
- Domain type reference: `Article` from domain model
- Variant dispatch pattern: routes to `FeaturedArticleCard` or `GridArticleCard`
- `children: ReactNode` in sub-component props (ArticleLinkProps)
- `className?: string` consistent across all interfaces

---

## 6. Stateful vs Stateless Decision Guide

### Decision Tree

```
Does the component need dynamic behavior?
│
├── NO → Stateless (pure render)
│         Examples: ArrowButton, NavigationItemButton, ArticleCard dispatcher
│
└── YES → What kind of state?
    │
    ├── UI-only (expand/collapse, hover, mounted) → useState / useRef
    │   Examples: Experience (isExpanded), ThemeButton (mounted),
    │             FeaturedArticlesCarousel (currentIndex, isPaused)
    │
    ├── Cross-component UI state (panels, theme) → Redux (useSelector/dispatch)
    │   Examples: MenuButton (useMenuPanel), ChatButton (useChatPanel),
    │             AuthButton (useAuthPanel), ThemeButton (useThemeMode)
    │
    ├── Server data (API responses) → React Query (domain hooks)
    │   Examples: Page components via useArticles(), useProjects()
    │
    └── Error recovery → Class component (Error Boundary)
        Example: SectionErrorBoundary (only class component in codebase)
```

### Pattern Definitions

#### Stateless (Pure Render)

No hooks. Takes props, returns JSX. Can be server or client component.

```typescript
// ~125 components follow this pattern
const ArrowButton = ({ href, text, target = "_blank" }: ArrowButtonProps) => (
  <Link href={href} target={target} className="arrow-link focus-ring">
    {text}
    <ArrowIcon className="arrow-icon" />
  </Link>
);
```

#### Stateful Local (`useState`)

UI-only state that doesn't need to be shared. Requires `"use client"`.

```typescript
"use client";

const Experience = ({ id, position, company, ...rest }: ExperienceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return ( /* renders based on isExpanded */ );
};
```

~30 components use this pattern. Common state: `isExpanded`, `isTouched`, `mounted`, `currentIndex`, `isPaused`, form field values.

#### Stateful Redux

Cross-component UI state managed by Redux Toolkit. Accessed via custom hooks from `src/state/slices/`.

```typescript
"use client";

const Floating = ({ id, title = "Dialog", children }: FloatingProps) => {
  const { isOpen: isChatOpen, closeChatPanel } = useChatPanel();
  const { isOpen: isMenuOpen, closeMenuPanel } = useMenuPanel();

  const handleClose = () => {
    if (isMenuOpen) closeMenuPanel();
    else if (isChatOpen) closeChatPanel();
  };

  return ( /* renders overlay UI */ );
};
```

~10 components use this pattern. Redux slices: `menuPanel`, `chatPanel`, `themeMode`, `authPanel`.

#### Stateful React Query

Server data fetched via React Query hooks from domain queries. Used in page-level components.

**State Management Split:**

| State Type | Tool | Location |
|-----------|------|----------|
| UI state (panels, theme) | Redux Toolkit | `src/state/slices/` |
| Server data (API) | React Query | `src/domains/*/queries/` |

#### Error Boundary (Class Component)

The only class component in the codebase. Required by React's error boundary API.

```typescript
export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState { ... }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void { ... }
}
```

**Rule:** Never create new class components. Error boundaries are the sole exception.

---

## 7. Framer Motion Convention

### Rule: Use `m.*` not `motion.*`

The codebase uses `LazyMotion` with `domAnimation` features for smaller bundles. All animated elements must use `m.*` components:

```typescript
// ✅ CORRECT — m.* with LazyMotion
import { m } from "framer-motion";

<m.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  ...
</m.div>

// ❌ WRONG — motion.* bypasses LazyMotion tree-shaking
import { motion } from "framer-motion";

<motion.div animate={{ opacity: 1 }}>...</motion.div>
```

**Codebase status:** 18 components use `m.*`, 0 components use `motion.*`. Migration is complete. Components include ArticleContent, AuthModal, AuthForm, Floating, FloatingMobile, TransitionerLi, SkillDetail, History, FramerImage, ArticleAppearance, ArticleHoverThumbnail, AuthDropdown, MotionTitle, Article, TransitionEffect, LiIcon, skill, SocialAuthDropdown.

### Import Pattern

```typescript
// Single import for animated component
import { m } from "framer-motion";

// With exit animations
import { m, AnimatePresence } from "framer-motion";

// With reduced motion hook (for a11y)
import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
```

**Note:** `useReducedMotion` is imported from `@/hooks/ui/useReducedMotion` (custom wrapper), not directly from `framer-motion`.

### LazyMotion Provider

The `LazyMotionProvider` wraps the app at the root level, providing `domAnimation` features:

```typescript
// src/providers/LazyMotionProvider/index.tsx
import { LazyMotion, domAnimation } from "framer-motion";

const LazyMotionProvider = ({ children }: LazyMotionProviderProps) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);
```

The `strict` prop ensures any `motion.*` usage throws an error, enforcing the `m.*` convention.

### Reduced Motion (WCAG 2.2)

Always respect `prefers-reduced-motion` for animations:

```typescript
const Floating = ({ id, title = "Dialog", children }: FloatingProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial={
        shouldReduceMotion
          ? { opacity: 0, x: "-50%", y: "-50%" }
          : { scale: 0.8, opacity: 0, x: "-50%", y: "-50%" }
      }
      animate={
        shouldReduceMotion
          ? { opacity: 1 }
          : { scale: 1, opacity: 1 }
      }
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : { scale: 0.8, opacity: 0 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : { duration: 0.2, ease: "easeOut" }
      }
    >
      ...
    </m.div>
  );
};
```

**Pattern:** When reduced motion is on, use opacity-only transitions with near-zero duration (0.01ms, not 0, to ensure animations complete their final state — see `src/styles/reduced-motion.css`).

### AnimatePresence

Required for exit animations. Use `mode="wait"` for page transitions:

```typescript
import { m, AnimatePresence } from "framer-motion";

// Wraps conditional content that needs exit animations
<AnimatePresence>
  {isVisible && (
    <m.div
      key="unique-key"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      ...
    </m.div>
  )}
</AnimatePresence>
```

### Test Mocking

Framer motion is mocked in tests via `src/test-utils/framer-motion-mock.ts`, which exports both `m` and `motion` as pass-through elements.

---

## 8. Utility Types in Props

### `Pick<DomainType, ...>` — Domain Model Subsets

Extract specific fields from a domain model type:

```typescript
import type { JobExperience } from "@/domains/job-experience";

// ✅ Pick specific fields from the domain model
type ExperienceProps = Pick<
  JobExperience,
  "id" | "position" | "company" | "companyLink" | "time" | "address" | "work"
>;
```

**When to use:** When a component only needs a subset of a domain model. Avoids passing the entire model and documents the exact data dependency.

> ⚠️ **Historical exception:** `Experience` and `Education` use `type` alias with `Pick<>` instead of `interface`. This is acceptable for utility type compositions. The `interface` rule applies to newly defined prop shapes, not utility type aliases.

### `Omit<LibraryProps, ...>` — Extending Library Components

Override specific props from a library component:

```typescript
import type { ComponentProps, MouseEvent } from "react";
import Link from "next/link";

type LinkProps = ComponentProps<typeof Link>;

// ✅ Omit "onClick" to replace with custom signature
export interface TransitionLinkProps extends Omit<LinkProps, "onClick"> {
  onClick?: (_e: MouseEvent<HTMLAnchorElement>) => void;
}
```

**When to use:** When wrapping a library component and need to override one or more prop types.

### `ComponentProps<typeof Component>` — Extracting from Components

Extract the full props type from an existing component:

```typescript
type LinkProps = ComponentProps<typeof Link>;
```

**When to use:** When you need to reference or extend the props of a third-party or internal component.

### `ReactNode` vs `ReactElement`

| Type | Accepts | Use Case |
|------|---------|----------|
| `ReactNode` | string, number, JSX, null, fragments, arrays | Content projection (`children`) |
| `ReactElement` | JSX only | When you need exactly one renderable element |

**Rule:** Use `ReactNode` for `children`. Use `ReactElement` only when the component structurally requires a single JSX element (rare).

---

## 9. Anti-patterns & Historical Exceptions

### Anti-patterns (avoid in new code)

| Anti-pattern | Why | Correct Alternative |
|--------------|-----|-------------------|
| `type` alias for new prop shapes | Less tooling support, no declaration merging | `interface ComponentNameProps { ... }` |
| `defaultProps` | Deprecated pattern, poor TypeScript inference | Destructuring defaults: `({ prop = "default" })` |
| `forwardRef` | Not used in codebase, adds complexity | Standard props (no ref forwarding needed) |
| `{...rest}` without constraint | Passes unknown props to DOM, TypeScript can't verify | Explicit prop listing |
| `PropTypes` | Redundant with TypeScript interfaces | TypeScript `interface` |
| `motion.*` instead of `m.*` | Bypasses LazyMotion tree-shaking | `m.*` with LazyMotion |
| Direct DOM manipulation | Breaks React's reconciliation model | `useState` / `useRef` |

### Historical Exceptions (documented, not corrected)

These exist in the codebase and are documented for awareness. Correction is a future migration epic.

| Component | Location | Exception | Note |
|-----------|----------|-----------|------|
| MainContainer | `src/ui/atoms/hocs/MainContainer/index.jsx` | JSX (not TSX), uses `{...rest}` spread without type constraint | Legacy HOC — future TS migration |
| TransitionerLi | `src/ui/atoms/hocs/TransitionerLi/index.jsx` | JSX without TypeScript, minimal untyped props | Legacy HOC — future TS migration |
| SkillSelectorButton | `src/ui/atoms/buttons/SkillSelectorButton/index.tsx` | Direct DOM manipulation (`document.querySelectorAll`) instead of React state | Documented tech debt |
| Experience | `src/ui/molecules/Experience/index.tsx` | `type ExperienceProps = Pick<JobExperience, ...>` — uses `type` alias | Acceptable for utility type composition (see Section 8) |
| Education | `src/ui/molecules/Education/index.tsx` | `type EducationProps = Academic` — direct type alias | Acceptable for simple domain type pass-through |

---

## Appendix: Codebase Metrics

| Metric | Value |
|--------|-------|
| Total UI components | ~207 |
| Components with explicit Props interface | ~40 |
| Separate `.types.ts` files | 5 |
| Inline Props definitions | ~35 |
| `interface` usage | ~90% of prop definitions |
| `type` alias usage | ~10% (utility compositions) |
| `defaultProps` usage | 0 |
| `forwardRef` usage | 0 |
| `PropTypes` usage | 0 |
| `"use client"` components | 82 |
| Server components | ~125 |
| Components using `m.*` | 18 |
| Components using `motion.*` | 0 |
| Class components | 1 (SectionErrorBoundary) |
| Components accepting `children` | 15+ |
| Average props per component | 2-4 |

---

## Cross-references

- [folder-structure.md](./folder-structure.md) — Component folder contents, `.types.ts` placement (Story 20.1)
- [styles-architecture.md](./styles-architecture.md) — BEM naming, style placement rules (Story 20.2)
- `CLAUDE.md` — State Management Split, Domain Layer Pattern
- `src/providers/LazyMotionProvider/index.tsx` — LazyMotion setup
- `src/test-utils/framer-motion-mock.ts` — Test mock for `m` and `motion`
