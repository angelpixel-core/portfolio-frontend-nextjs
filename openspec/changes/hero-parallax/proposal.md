# Proposal: Hero Parallax

## Intent

Add a subtle parallax motion to the home hero image using `@react-spring/parallax` while keeping the final resting position identical to the current static layout and respecting reduced-motion preferences.

## Scope

### In Scope

- Add `@react-spring/parallax` dependency and wire it into the home hero image only.
- Implement a parallax wrapper that uses window scroll and ends with the hero image in its current position.
- Ensure reduced-motion users receive a static hero image without parallax transforms.
- Update styles needed to prevent clipping or layout shifts while parallax is active.

### Out of Scope

- Reworking hero layout, typography, or visual design beyond parallax motion.
- Applying parallax to other pages or hero instances.
- Adding new animations unrelated to the hero image.

## Approach

Use a home-page-only parallax wrapper around the existing hero image container in `src/app/page.tsx`. The wrapper will be a client-only component (or a dynamic import with SSR disabled) that renders `Parallax` and a single `ParallaxLayer`. The layer offset/speed will be tuned so that the image settles into the exact same position at the end of the scroll range, matching the current static layout. Reduced-motion will short-circuit to the existing `Hero` rendering without any parallax transforms.

SSR/Client considerations: `@react-spring/parallax` is browser-only, so the parallax wrapper must be a client component. For SSR safety, render a static hero server-side and hydrate into the parallax wrapper on the client, or use a dynamic client-only component to avoid server execution of parallax logic.

Motion reduction: use `useReducedMotion` (and existing CSS `prefers-reduced-motion` guards) to disable parallax and keep the image static.

## Affected Areas

| Area                               | Impact    | Description                                                                        |
| ---------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| `src/app/page.tsx`                 | Modified  | Wrap hero image container with a parallax wrapper on the home page only.           |
| `src/app/styles.css`               | Modified  | Adjust hero container sizing/overflow to support parallax layers without clipping. |
| `src/ui/molecules/Hero/index.tsx`  | Unchanged | Existing client component remains as the content rendered inside parallax.         |
| `src/ui/molecules/Hero/styles.css` | Modified  | Ensure motion reduction styles still apply with parallax active.                   |
| `src/hooks/ui/useReducedMotion.ts` | Used      | Gate parallax behavior for reduced-motion users.                                   |
| `package.json`                     | Modified  | Add `@react-spring/parallax` dependency.                                           |

## Risks

| Risk                                                                   | Likelihood | Mitigation                                                                       |
| ---------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| Parallax uses its own scroll container instead of window scroll        | Medium     | Configure parallax wrapper to follow window scroll and avoid nested scrolling.   |
| Parallax transforms cause clipping with current max-height/grid styles | Medium     | Tune container overflow and max-height to preserve current layout bounds.        |
| Final position deviates from the current static hero placement         | Medium     | Calibrate offset/speed so the end-of-scroll layout matches today’s DOM position. |
| Reduced-motion preference is ignored                                   | Low        | Explicitly bypass parallax when `useReducedMotion` is true.                      |

## Rollback Plan

Remove the parallax wrapper and dependency, reverting to the current `Hero` markup in `src/app/page.tsx` and restoring any style tweaks in `src/app/styles.css` and `src/ui/molecules/Hero/styles.css`.

## Dependencies

- `@react-spring/parallax`

## Success Criteria

- [ ] Home hero image animates with parallax while scrolling and ends in the exact same position as the current static layout.
- [ ] Reduced-motion users see a static hero image with no parallax transforms.
- [ ] No layout shifts, clipping, or overflow issues across breakpoints.
- [ ] No SSR/runtime errors introduced by parallax integration.
