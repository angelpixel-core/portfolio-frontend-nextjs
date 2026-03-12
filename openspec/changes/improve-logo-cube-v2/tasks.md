# Tasks: Improve LogoCube V2

## Phase 1: Foundation - Contracts and 3D Transform Module

- [x] 1.1 Update `src/ui/molecules/LogoCube/cube-orientation.ts` to support `FaceValue = string | number` and add `CubeFaceConfig` type contract.
- [x] 1.2 Create `src/ui/molecules/LogoCube/cube-transforms.ts` with `getFaceTransform(position, size)` for all canonical faces and safe fallback for unknown positions.
- [x] 1.3 Add unit tests in `src/ui/molecules/LogoCube/__tests__/cube-transforms.test.ts` validating expected transforms for `front/back/top/bottom/left/right` plus unknown-position fallback.

## Phase 2: Core Implementation - Configurable Faces and Stable Animation

- [x] 2.1 Refactor `src/ui/molecules/LogoCube/index.tsx` to consume `getFaceTransform(...)` from `cube-transforms.ts` instead of hardcoding face transform classes.
- [x] 2.2 Implement `faces?: CubeFaceConfig` prop in `src/ui/molecules/LogoCube/index.tsx` with deterministic merge against defaults to guarantee a complete six-face orientation.
- [x] 2.3 Keep transition synchronization in `src/ui/molecules/LogoCube/index.tsx` on `onTransitionEnd`, ensuring action -> animation -> logical commit -> visual reset flow remains unchanged.
- [x] 2.4 Update `src/ui/molecules/LogoCube/styles.css` for multi-character face content legibility (font-size bounds, line-height, and overflow-safe behavior in 42/44px slots).

## Phase 3: Integration - Header Hosts and Responsive Stability

- [x] 3.1 Update `src/ui/molecules/Logo/index.tsx` to pass the selected face configuration to `LogoCube` for desktop header rendering.
- [x] 3.2 Update `src/ui/molecules/LogoMenuTrigger/index.tsx` to pass the same face configuration while preserving `toggleMenuPanel` trigger behavior.
- [x] 3.3 Validate and adjust container fit styles in `src/ui/molecules/Logo/styles.css` and `src/ui/molecules/LogoMenuTrigger/styles.css` so `LogoCube` does not overflow or shift header zones across `<880` and `>=880`.

## Phase 4: Testing and Verification - Spec Scenario Coverage

- [x] 4.1 Extend `src/ui/molecules/LogoCube/__tests__/cube-orientation.test.ts` for string/symbol face-value invariants under `rotateUp/Down/Left/Right`.
- [x] 4.2 Create `src/ui/molecules/LogoCube/__tests__/LogoCube.test.tsx` covering hover-triggered rotation and post-transition orientation sync (Requirement: Accessible interaction behavior and reduced motion, happy path).
- [x] 4.3 Add reduced-motion test in `src/ui/molecules/LogoCube/__tests__/LogoCube.test.tsx` asserting no rotational animation is executed when reduced motion is enabled (edge case scenario).
- [x] 4.4 Add partial-face-config test in `src/ui/molecules/LogoCube/__tests__/LogoCube.test.tsx` asserting fallback to complete default face set without render errors (Requirement: Configurable face content, edge case).
- [x] 4.5 Run regression suites `src/ui/organisms/NavBar/__tests__/NavBar.test.tsx` and `src/ui/organisms/MobileMenuOverlay/__tests__/MobileMenuOverlay.test.tsx` and fix any integration regressions.

## Phase 5: Cleanup and Notes

- [x] 5.1 Add concise inline comments in `src/ui/molecules/LogoCube/index.tsx` and/or `cube-transforms.ts` documenting non-obvious synchronization and fallback rules.
- [x] 5.2 Run `npm run typecheck` and ensure no type regressions remain before marking change implementation-ready.
