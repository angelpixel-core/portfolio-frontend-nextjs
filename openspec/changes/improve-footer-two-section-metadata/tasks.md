## 1. Footer Structure and Layout

- [x] 1.1 Refactor `src/ui/organisms/Footer/index.tsx` to split footer into top gradient section and bottom solid metadata section.
- [x] 1.2 Update top section markup to center copyright/author on first row and keep `Contact` and `Links` as grouped columns below.
- [x] 1.3 Update `src/ui/organisms/Footer/styles.css` to implement fade gradient for top section and solid background continuation for bottom section.

## 2. Iconography and Typography Harmonization

- [x] 2.1 Adjust contact actions (Telegram/Email) to render icon-left alignment consistently.
- [x] 2.2 Tune icon scales so `Links` icons are slightly larger and `Contact` icons are slightly smaller, with consistent spacing.
- [x] 2.3 Apply metadata typography hierarchy: keys with `opacity: 0.6` + `font-weight: 500`, values with `font-weight: 400`.

## 3. Metadata Content and Responsive Balance

- [x] 3.1 Center the `Built with Next.js · React · TypeScript · Tailwind CSS` line as the first row of the lower section.
- [x] 3.2 Render the three metadata rows (`State & Data`, `Motion & UI`, `Testing & Accessibility`) with balanced key/value distribution across available width.
- [x] 3.3 Apply lower-section visual tuning (`opacity: ~0.75`, slightly smaller text) while preserving readability on mobile and desktop breakpoints.

## 4. Validation and Test Synchronization

- [x] 4.1 Update affected footer tests/selectors (E2E and/or CSS contract tests) to match the new two-section DOM and visual contracts.
- [x] 4.2 Run verification commands (`npm run lint`, `npm run typecheck`, and targeted footer-related tests) and resolve regressions.
