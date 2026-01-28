# Story 12.6: Home Hero Blade Structure

Status: done

## Story

As a visitor landing on the portfolio homepage,
I want to see a clean, focused Hero blade that contains only essential elements (header, hero image, title, description, and action buttons),
so that I have an immediate, uncluttered impression of who this professional is without scrolling.

## Acceptance Criteria

1. **AC1: Hero Blade Contains Only Essential Elements**
   - **Given** the user visits the Home page on any viewport
   - **When** the page loads
   - **Then** the Hero blade (first visible section) contains ONLY:
     - Header (already implemented)
     - Hero image (centered)
     - Title principal
     - Description/slogan
     - Action buttons (Resume, Contact)
   - **And** NO carousels, footer, or secondary content appear in the Hero blade
   - **Note:** FR12, FR14 specify "Hero blade contiene SOLO..." and "NO incluye carrusel, footer, ni contenido secundario"

2. **AC2: Buttons Layout 50/50 on Mobile**
   - **Given** the viewport is mobile (≤640px)
   - **When** the Hero blade renders
   - **Then** the Resume and Contact buttons are displayed side-by-side
   - **And** each button occupies approximately 50% of the available width
   - **Note:** FR13 specifies "Botones Resume/Contact idealmente 50%/50% en mobile"

3. **AC3: Hero Blade Fills Viewport**
   - **Given** the user visits the Home page
   - **When** the page loads
   - **Then** the Hero blade occupies the full viewport height (minus header)
   - **And** no content from the secondary blade is visible without scrolling
   - **Note:** FR16 specifies "Cada blade debe ocupar el viewport cuando sea posible"

4. **AC4: Visual Separation from Secondary Content**
   - **Given** the Hero blade is displayed
   - **When** the user scrolls
   - **Then** there is a clear visual transition to the secondary content
   - **And** the scroll feels like a "blade change" not "content cut in half"
   - **Note:** FR17 specifies "Scroll entre blades se siente como cambio de blade"

5. **AC5: No Footer in Hero Blade**
   - **Given** the Home page is loaded
   - **When** viewing the Hero blade
   - **Then** the footer is NOT visible
   - **And** the footer appears only in the secondary blade (below the fold)

## Tasks / Subtasks

- [x] Task 1: Audit Current Hero Structure (AC: 1, 3)
  - [x] 1.1: Review `src/app/page.jsx` current structure
  - [x] 1.2: Identify elements that should NOT be in Hero blade (CustomersSlider, HireMe if visible)
  - [x] 1.3: Document current viewport height behavior
  - [x] 1.4: Identify CSS changes needed for full-viewport Hero blade

- [x] Task 2: Implement Hero Blade Container (AC: 1, 3)
  - [x] 2.1: Create CSS class for full-viewport Hero blade (`.main_home-container`)
  - [x] 2.2: Apply `min-height: 100vh !important` to Hero section
  - [x] 2.3: Overrode `.main-container` inline-block with `display: flex !important`
  - [x] 2.4: Test on mobile (375px) and desktop (1280px) viewports

- [x] Task 3: Button Layout 50/50 Mobile (AC: 2)
  - [x] 3.1: Located `.home_contact-container` CSS in `src/app/styles.css`
  - [x] 3.2: Added `flex-1` for buttons on mobile, `tablet:flex-none` for desktop
  - [x] 3.3: Buttons have equal width on mobile, natural width on tablet+
  - [x] 3.4: Tested visual balance at 375px and 768px viewports

- [x] Task 4: Move Secondary Content Below Fold (AC: 1, 4, 5)
  - [x] 4.1: CustomersSlider renders BELOW the Hero blade (verified)
  - [x] 4.2: Footer renders BELOW the Hero blade (verified via E2E tests)
  - [x] 4.3: Hero blade fills viewport, creating natural blade separation
  - [x] 4.4: Scroll reveals secondary content (verified via E2E tests)

- [x] Task 5: E2E Tests (AC: 1-5)
  - [x] 5.1: Added test for Hero blade viewport height on mobile
  - [x] 5.2: Added test for Hero blade viewport height on desktop
  - [x] 5.3: Added test for 50/50 button layout on mobile
  - [x] 5.4: Added test to verify no footer visible in initial viewport
  - [x] 5.5: Added test to verify CustomersSlider is below fold

- [x] Task 6: Documentation Update
  - [x] 6.1: Added changelog entry for Story 12.6 in layout-system.md
  - [x] 6.2: Updated JSDoc comments in MainContainer component

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR12:** Hero blade contiene SOLO: header, imagen hero, título, descripción, botones (Resume/Contact)
**FR13:** Botones Resume/Contact idealmente 50%/50% en mobile
**FR14:** Hero blade NO incluye carrusel, footer, ni contenido secundario
**FR16:** Cada blade debe ocupar el viewport cuando sea posible
**FR17:** Scroll entre blades se siente como cambio de blade, no contenido cortado

**From epic-12-ux-behavior.md Section 4.1 (Blade 1 — Hero):**
> Debe contener exclusivamente:
> • Header
> • Imagen hero (centrada)
> • Título principal
> • Descripción
> • Botones de acción: Resume, Contact
> (idealmente 50% / 50% en mobile)
>
> No debe incluir:
> • Carruseles
> • Footer
> • Contenido secundario

### Current State Analysis

**Home Page Structure (`src/app/page.jsx`):**
```jsx
<main className="main_home">
  <MainContainer className="main_home-container">
    <div className="home-container">
      <div className="home-hero_image-container">
        <Hero name="hero" size="512" className="home-hero_image ligthning" />
      </div>
      <div className="home-content">
        <Title className="home_title" />
        <Paragraph className="home_slogan" />
        <div className="home_contact-container">
          <Resume />
          <Calendar className="home_contact-link" />
        </div>
      </div>
    </div>
  </MainContainer>
  <CustomersSlider />   <!-- PROBLEM: May appear in Hero viewport -->
  <HireMe />            <!-- OK: Already hidden on mobile per Story 12.2 -->
</main>
```

**Current Issues:**
1. No explicit `min-h-screen` on Hero section
2. Buttons are NOT 50/50 on mobile (flex with gap, not equal widths)
3. CustomersSlider may be partially visible in initial viewport
4. No visual "blade separation" between Hero and secondary content

### Button Container Current CSS

**Location:** `src/app/styles.css`
```css
.home_contact-container {
  @apply flex items-center
  self-start lg:self-center
  justify-between
  mt-2
  px-2
  gap-4;
}
```

**Fix Needed:**
```css
/* Mobile-first: 50/50 buttons */
.home_contact-container {
  @apply flex items-center
  self-start lg:self-center
  justify-between
  mt-2
  px-2
  gap-4
  /* NEW: Mobile 50/50 layout */
  w-full;
}

/* Button flex behavior */
.home_contact-container > * {
  @apply flex-1;  /* Equal width on mobile */
}

/* Desktop: natural width */
@screen tablet {
  .home_contact-container > * {
    @apply flex-none;  /* Return to natural width */
  }
}
```

### Hero Blade CSS Pattern

**Recommended Implementation:**
```css
/* Hero blade - full viewport minus header */
.hero-blade {
  @apply min-h-screen
  flex flex-col
  justify-center
  items-center;
  /* Account for header height if fixed/sticky */
  /* min-height: calc(100vh - var(--header-height)); */
}
```

**Alternative with CSS Variable:**
```css
:root {
  --header-height: 80px;  /* Adjust based on actual header */
}

.hero-blade {
  min-height: calc(100vh - var(--header-height));
}
```

### Previous Story Intelligence (Story 12.5)

**Patterns Established:**
- Use semantic breakpoints: `tablet:`, `nav:`, `desktop:`, `wide:`
- Update layout-system.md changelog when making changes
- Always update JSDoc in component when changing behavior
- Test at boundary viewports
- Use proper waitFor patterns in E2E tests, not arbitrary timeouts

**Code Review Learnings:**
- Add skip guards in tests when elements may not exist
- Use flexible assertions (`>=` instead of exact counts)
- Replace `waitForTimeout` with proper `expect().toBeVisible()`

### Component File Locations

```
src/app/
├── page.jsx              # Home page - needs Hero blade structure
├── styles.css            # Home page styles - button layout changes

src/ui/molecules/
├── Hero/                 # Hero image component
├── Title/                # Animated title
├── Paragraph/            # Slogan/description
├── Resume/               # Resume download button
├── Calendar/             # Contact/Calendly button
├── CustomersSlider/      # Secondary content (should be below fold)
└── HireMe/               # Circular hire button (already nav:hidden on mobile)

src/ui/atoms/hocs/
└── MainContainer/        # Main wrapper with padding
```

### E2E Test Patterns

```typescript
// Test Hero blade fills viewport
test("Hero blade occupies full viewport height", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const heroSection = page.locator(".hero-blade");
  const heroHeight = await heroSection.evaluate(el => el.offsetHeight);
  const viewportHeight = 667;

  // Hero should be at least 90% of viewport (allowing for header)
  expect(heroHeight).toBeGreaterThanOrEqual(viewportHeight * 0.85);
});

// Test 50/50 button layout on mobile
test("Resume and Contact buttons have equal width on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const resumeButton = page.locator('.home_contact-container').locator('a').first();
  const contactButton = page.locator('.home_contact-container').locator('a').last();

  const resumeWidth = await resumeButton.evaluate(el => el.offsetWidth);
  const contactWidth = await contactButton.evaluate(el => el.offsetWidth);

  // Buttons should be roughly equal (within 10% tolerance)
  const ratio = resumeWidth / contactWidth;
  expect(ratio).toBeGreaterThan(0.9);
  expect(ratio).toBeLessThan(1.1);
});

// Test no footer in initial viewport
test("Footer is not visible in Hero blade", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Footer should exist but not be visible without scrolling
  const footer = page.locator('footer');
  await expect(footer).not.toBeInViewport();
});
```

### Risk Assessment

**Riesgo:** 🟢 Bajo (Estructural)

**Potential Issues:**
1. `min-h-screen` may cause issues with fixed/sticky header
2. Button 50/50 layout may affect text overflow on very long button labels
3. CustomersSlider may have loading states that affect layout
4. Some users may have browser UI that affects `100vh`

**Mitigations:**
1. Use CSS variable for header height if needed, or test with actual values
2. Test with actual button text to ensure no overflow
3. Handle CustomersSlider loading state gracefully
4. Use `min-height` not `height` to allow content overflow if needed

### Breakpoints Reference

| Breakpoint | Range | CSS | Button Behavior |
|------------|-------|-----|-----------------|
| Base (mobile) | 0-640px | (default) | 50/50 width |
| `tablet:` | 641-840px | `@media (min-width: 641px)` | Natural width |
| `nav:` | 841-1024px | `@media (min-width: 841px)` | Natural width |
| `desktop:` | 1025-1440px | `@media (min-width: 1025px)` | Natural width |
| `wide:` | ≥1441px | `@media (min-width: 1441px)` | Natural width |

### References

- [Source: docs/layout-system.md] - Breakpoint system and visibility matrix
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:100-119] - FR12-FR17 specifications
- [Source: _bmad-output/planning-artifacts/epics-v2.md:147-152] - Story 12.6 definition
- [Source: src/app/page.jsx] - Current Home page structure
- [Source: src/app/styles.css] - Current button container styles
- [Source: src/ui/molecules/Hero/] - Hero image component
- [Source: src/ui/molecules/Resume/] - Resume button component
- [Source: src/ui/molecules/Calendar/] - Contact button component

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Task 1: Explored Home page structure via Task agent - found missing styles.css import
- Task 2: src/app/styles.css:22-32 - Added min-height: 100vh and display: flex overrides
- Task 3: src/app/styles.css:73-87 - Added 50/50 button layout with flex-1/tablet:flex-none
- Task 4: Verified CustomersSlider and Footer are below fold via E2E tests
- Task 5: e2e/home-hero-blade.spec.ts - Created 10 tests for Hero blade structure
- Task 6: docs/layout-system.md:233-241 - Added changelog entry

### Completion Notes List

- Hero blade now fills full viewport height (min-height: 100vh) per FR16
- Fixed missing `./styles.css` import in Home page (critical fix)
- Button container uses 50/50 layout on mobile (flex-1) per FR13
- Buttons return to natural width on tablet+ (flex-none)
- MainContainer updated to support rest props (e.g., data-testid)
- Added data-testid="home-hero-blade" for E2E testing
- 10 new E2E tests added (146 total tests pass, no regressions)

### File List

- `src/app/page.jsx` - Added styles.css import, data-testid on MainContainer
- `src/app/styles.css` - Hero blade min-height, button 50/50 layout
- `src/ui/atoms/hocs/MainContainer/index.jsx` - Added rest props support
- `e2e/home-hero-blade.spec.ts` - New test file with 10 tests
- `docs/layout-system.md` - Added changelog entry for Story 12.6
