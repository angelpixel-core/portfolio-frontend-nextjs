# Tasks: Hero Parallax

## Phase 1: Foundation (Dependencies & Wiring)

- [x] 1.1 Add `@react-spring/parallax` dependency in `package.json`.
- [x] 1.2 Create `src/ui/molecules/HeroParallax/index.tsx` as a client component that loads `@react-spring/parallax` via dynamic `import()` and renders a static `<Hero />` fallback until the module is ready.
- [x] 1.3 Create `src/ui/molecules/HeroParallax/styles.css` with base wrapper/layout styles (positioning and overflow rules) to support parallax without clipping.

## Phase 2: Core Implementation (Parallax Behavior)

- [ ] 2.1 Implement `HeroParallax` props (`name`, `size`, `sizes`, `className`, `imageSrc`) and pass them through to `<Hero />` for parity with the existing usage in `src/app/page.tsx`.
- [ ] 2.2 Gate parallax activation with `useReducedMotion` from `src/hooks/ui/useReducedMotion.ts`; when true, render only `<Hero />` without any parallax wrapper.
- [ ] 2.3 When parallax is active, wrap `<Hero />` with `<Parallax>` and a single `<ParallaxLayer>` and tune `speed`/`offset` to preserve the final resting position defined by the current home hero layout.

## Phase 3: Integration (Home Page + Styles)

- [ ] 3.1 Update `src/app/page.tsx` to replace the direct `<Hero />` render with `<HeroParallax />` inside `.home-hero__image-container` (home page only).
- [ ] 3.2 Update `src/app/styles.css` to ensure `.home-hero__image-container` supports parallax motion without clipping (e.g., `overflow: visible`, `position: relative`) across breakpoints.
- [ ] 3.3 Update `src/ui/molecules/Hero/styles.css` to confirm reduced-motion rules still apply with parallax active (no transforms/animations when reduced motion is enabled).

## Phase 4: Testing & Verification

- [ ] 4.1 Unit test: `HeroParallax` renders static `<Hero />` when `useReducedMotion` returns true (no parallax wrapper elements).
- [ ] 4.2 Integration test: home page renders without SSR/runtime errors and includes `data-testid="profile-hero-image"` when `HeroParallax` is used.
- [ ] 4.3 E2E test: Playwright scroll on home page shows parallax motion and confirms hero image matches baseline resting position at end of range.
- [ ] 4.4 E2E test: with reduced motion enabled, home page hero remains static during scroll.

## Phase 5: Cleanup & Documentation

- [ ] 5.1 Update or add any relevant notes in `docs/architecture/layout-patterns.md` if parallax constraints or hero container behavior changes.
