# Design: Hero Parallax

## Technical Approach

Introduce a home-page-only client wrapper that conditionally renders a parallax layer around the existing `Hero` image. The wrapper loads `@react-spring/parallax` only on the client, uses `useReducedMotion` to short-circuit to the static hero, and preserves the exact final resting position by calibrating layer speed/offset within the hero image container. The server continues to render the static hero markup so SSR remains safe and no-JS clients see the current layout. CSS adjustments are limited to preventing clipping during transform motion.

## Architecture Decisions

### Decision: Home-only parallax wrapper as a new molecule

**Choice**: Add `src/ui/molecules/HeroParallax/` and use it only in `src/app/page.tsx`.
**Alternatives considered**: Extend `Hero` with optional parallax props; inline parallax logic inside `src/app/page.tsx`.
**Rationale**: Keeps scope isolated to home without changing `Hero` behavior used on other pages, while still following the UI molecule pattern already used in the repo.

### Decision: Client-only parallax dependency loading

**Choice**: Dynamically import `@react-spring/parallax` inside the client component (via `import()` in `useEffect`) and render static hero until the module is available.
**Alternatives considered**: Static import in the client component; `next/dynamic` with `ssr: false` for the parallax wrapper.
**Rationale**: Avoids SSR execution of any browser-only logic while still rendering static hero markup on the server (requirement: server-safe rendering + no-JS fallback).

### Decision: Keep layout control in existing home CSS

**Choice**: Reuse `.home-hero__image-container` sizing and grid placement from `src/app/styles.css`, adding minimal overflow/positioning adjustments to avoid clipping.
**Alternatives considered**: Move hero sizing into the parallax component styles or add new layout wrappers.
**Rationale**: The home hero layout is tightly tuned across breakpoints; minimizing CSS surface area reduces regression risk and keeps layout behavior consistent.

## Data Flow

HomePage (server)
│
├─ renders HeroParallax (client)
│ ├─ useReducedMotion()
│ ├─ (client) import("@react-spring/parallax")
│ └─ if reduced-motion or module not loaded: render <Hero />
│ else: <Parallax> → <ParallaxLayer> → <Hero />
│
└─ renders remaining home content

    Hero (client)
      └─ useProfile() → resolved image → ImageLink

## File Changes

| File                                       | Action | Description                                                                                                                      |
| ------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/ui/molecules/HeroParallax/index.tsx`  | Create | Client wrapper that loads `@react-spring/parallax`, gates by `useReducedMotion`, and renders static `Hero` fallback until ready. |
| `src/ui/molecules/HeroParallax/styles.css` | Create | Parallax wrapper styles (positioning, overflow, layer sizing).                                                                   |
| `src/app/page.tsx`                         | Modify | Replace the direct `Hero` render with `HeroParallax` inside `.home-hero__image-container`.                                       |
| `src/app/styles.css`                       | Modify | Ensure hero container and parallax layer are not clipped during transform (e.g., `overflow: visible`, `position: relative`).     |
| `src/ui/molecules/Hero/styles.css`         | Modify | Confirm reduced-motion rules still apply when parallax is active (no new animation).                                             |
| `package.json`                             | Modify | Add `@react-spring/parallax` dependency.                                                                                         |

## Interfaces / Contracts

```tsx
// src/ui/molecules/HeroParallax/index.tsx
interface HeroParallaxProps {
  name?: string;
  size: number;
  sizes?: string;
  className: string;
  imageSrc?: string;
}

// Behavior contract
// - When prefers-reduced-motion is true: render <Hero> without parallax.
// - When parallax module not loaded yet: render <Hero> without parallax.
// - When parallax active: wrap <Hero> in Parallax/ParallaxLayer with tuned speed/offset.
```

## Testing Strategy

| Layer       | What to Test                                 | Approach                                                                                                                                                                       |
| ----------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit        | Reduced-motion bypass renders static `Hero`  | Render `HeroParallax` with mocked `useReducedMotion` true; assert no parallax wrapper elements.                                                                                |
| Integration | Home page renders without SSR/runtime errors | Render `HomePage` in Jest/RTL; ensure `data-testid="profile-hero-image"` exists and no crashes.                                                                                |
| E2E         | Parallax motion and final resting position   | Playwright: scroll home page, verify hero image transforms during scroll and matches baseline position at rest; repeat with reduced motion enabled to confirm static behavior. |

## Migration / Rollout

No migration required.

## Open Questions

- [ ] Confirm the preferred `@react-spring/parallax` API for binding to window scroll in this Next.js 15 app (scroll container vs. window) to avoid nested scrolling.
- [ ] Decide the initial parallax tuning values (speed/offset) that keep the final image position identical to the current static layout.
