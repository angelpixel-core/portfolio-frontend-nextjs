## Exploration: hero-parallax

### Current State

- Home hero is rendered in `src/app/page.tsx` inside `.home-hero__image-container` using the client component `Hero` from `src/ui/molecules/Hero/index.tsx`.
- The hero image layout is controlled by `src/app/styles.css` with max-height caps, grid placement at 640px+, and centered anchor styling. The image uses the `home-hero__image` class, with `Hero` adding a fade-in animation class.
- `Hero` is already a client component and uses `useProfile` to resolve the image source; reduced motion is respected in CSS via `prefers-reduced-motion` in `src/ui/molecules/Hero/styles.css`.
- The project is on Next.js App Router (Next 15), with server `page.tsx` composing client components. `@react-spring/parallax` is not currently installed.

### Affected Areas

- `src/app/page.tsx` — hero markup where a parallax wrapper/layer would be inserted.
- `src/app/styles.css` — hero container sizing/overflow rules that could conflict with parallax layers or stacking.
- `src/ui/molecules/Hero/index.tsx` — potential location to wrap the image in a parallax layer if it should be reusable across pages.
- `src/ui/molecules/Hero/styles.css` — adjust animation/respect reduced motion when parallax is active.
- `package.json` — add `@react-spring/parallax` dependency.
- `src/hooks/ui/useReducedMotion.ts` — existing hook to disable parallax for reduced motion users.

### Approaches

1. **Local Parallax Wrapper in Home Page** — Wrap only the hero image container on the home page with `Parallax`/`ParallaxLayer`.
   - Pros: Scoped change, minimal impact on other pages using `Hero` (About/Biography). Keeps layout-specific rules close to `src/app/page.tsx`.
   - Cons: Parallax component must be configured to work with page scroll (not its own scroll container). Risk of layout conflicts with existing max-height/grid rules.
   - Effort: Medium.

2. **Parallax-aware Hero Component** — Build a `HeroParallax` or extend `Hero` with optional parallax props and use it on the home page.
   - Pros: Encapsulates parallax behavior and reduced-motion handling in one component; reusable if other pages want the effect later.
   - Cons: Higher coupling to `Hero` data fetching and sizing; extra API complexity for a single page.
   - Effort: Medium.

### Recommendation

Start with a home-page-only parallax wrapper (Approach 1). The hero layout is tightly controlled by `src/app/styles.css`, and `Hero` is already used on other pages with different image sources. Keeping parallax local avoids unintended changes and makes it easier to tune the scroll range so the image ends in its current position.

### Risks

- `@react-spring/parallax` uses its own scroll container by default; if not configured for window scroll, it may create nested scrolling or fail to move at all.
- The hero container has max-height caps and grid placement that could clip or misalign parallax layers if the layer uses transforms outside the container.
- Reduced motion users should get a static image; parallax transforms should be disabled via `useReducedMotion`.
- Ensure the final scroll position aligns with the current static layout (the “end in current position” requirement), which may require tuning offsets/speeds after integration tests.

### Ready for Proposal

Yes — but confirm how `@react-spring/parallax` should be wired to window scroll in Next 15 so the parallax effect works without a nested scroll container.
