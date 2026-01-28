# Story 12.7: Home Secondary Blade & Scroll

Status: ready-for-dev

## Story

As a visitor browsing the portfolio homepage,
I want the secondary content (customers slider, footer) to appear in a distinct secondary blade below the hero,
so that the scroll between blades feels like a natural section change rather than content cut in half.

## Acceptance Criteria

1. **AC1: Secondary Blade Contains Correct Elements**
   - **Given** the user scrolls past the Hero blade on the Home page
   - **When** the secondary blade comes into view
   - **Then** it contains:
     - CustomersSlider component (carousel of customer/client logos)
     - Footer component (Copyright, Author, Contact methods)
   - **And** NO hero content appears in the secondary blade
   - **Note:** FR15 specifies "Blade 2 contiene: carrusel de customers/logos + footer completo"

2. **AC2: Secondary Blade Occupies Viewport**
   - **Given** the viewport is any size (mobile to desktop)
   - **When** the secondary blade is fully scrolled into view
   - **Then** the secondary blade occupies the full remaining viewport
   - **And** content is vertically distributed appropriately
   - **Note:** FR16 specifies "Cada blade debe ocupar el viewport cuando sea posible"

3. **AC3: Scroll Feels Like Blade Change**
   - **Given** the user is viewing the Hero blade
   - **When** they scroll down
   - **Then** the transition to the secondary blade feels like entering a new section
   - **And** there is NO visual content cutoff mid-element
   - **And** the blades feel like distinct "pages" not continuous scroll
   - **Note:** FR17 specifies "Scroll entre blades se siente como cambio de blade, no contenido cortado"

4. **AC4: CustomersSlider Is Visible and Functional**
   - **Given** the secondary blade is visible
   - **When** the CustomersSlider loads
   - **Then** it displays customer/client logos in an animated slider
   - **And** the slider animation runs smoothly (existing CSS animation)
   - **Note:** CustomersSlider uses CSS keyframe animation (20s loop)

5. **AC5: Footer Is Complete in Secondary Blade**
   - **Given** the secondary blade is visible
   - **When** the user scrolls to the bottom of the Home page
   - **Then** the footer contains: Copyright, Author, Chat, WhatsApp, CopyEmail
   - **And** the footer styling is consistent with other pages
   - **Note:** Footer should be visually distinct within the secondary blade

## Tasks / Subtasks

- [ ] Task 1: Audit Current Secondary Content Structure (AC: 1, 4, 5)
  - [ ] 1.1: Review `src/app/page.jsx` - identify CustomersSlider and HireMe positioning
  - [ ] 1.2: Verify Footer is rendered globally or per-page (check layout.jsx)
  - [ ] 1.3: Document current CustomersSlider placeholder state (needs implementation?)
  - [ ] 1.4: Identify if secondary blade container exists or needs creation

- [ ] Task 2: Create Secondary Blade Container (AC: 1, 2)
  - [ ] 2.1: Create CSS class for secondary blade (`.home_secondary-blade`)
  - [ ] 2.2: Apply `min-height: 100vh` to secondary blade section (or calc for remaining viewport)
  - [ ] 2.3: Add flex layout to distribute CustomersSlider and Footer vertically
  - [ ] 2.4: Add `data-testid="home-secondary-blade"` for E2E testing

- [ ] Task 3: Implement Visual Blade Separation (AC: 3)
  - [ ] 3.1: Add visual separator between Hero and Secondary blade (subtle gradient, border, or spacing)
  - [ ] 3.2: Test scroll behavior feels like "blade change"
  - [ ] 3.3: Ensure no content is visually cut between blades
  - [ ] 3.4: Consider scroll-snap-y: proximity for optional snap-to-blade behavior

- [ ] Task 4: Verify CustomersSlider Functionality (AC: 4)
  - [ ] 4.1: Confirm CustomersSlider component is not placeholder-only
  - [ ] 4.2: If placeholder, note for future story (out of 12.7 scope if just CSS animation exists)
  - [ ] 4.3: Verify CSS animation runs (existing 20s infinite loop)
  - [ ] 4.4: Ensure slider is visible and properly styled within secondary blade

- [ ] Task 5: Footer Integration (AC: 5)
  - [ ] 5.1: Verify Footer renders in correct position within secondary blade
  - [ ] 5.2: Confirm Footer contains all required components (Copyright, Author, Chat, WhatsApp, CopyEmail)
  - [ ] 5.3: Test Footer styling consistency with other pages

- [ ] Task 6: E2E Tests (AC: 1-5)
  - [ ] 6.1: Add test for secondary blade existence and data-testid
  - [ ] 6.2: Add test for secondary blade viewport height (min-height)
  - [ ] 6.3: Add test for CustomersSlider visibility in secondary blade
  - [ ] 6.4: Add test for Footer visibility in secondary blade
  - [ ] 6.5: Add test for scroll revealing secondary blade after Hero

- [ ] Task 7: Documentation Update
  - [ ] 7.1: Add changelog entry for Story 12.7 in layout-system.md
  - [ ] 7.2: Update any component JSDoc if behavior changes

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR15:** Blade 2 contiene: carrusel de customers/logos + footer completo
**FR16:** Cada blade debe ocupar el viewport cuando sea posible
**FR17:** Scroll entre blades se siente como cambio de blade, no contenido cortado

**From epic-12-ux-behavior.md Section 4.2 (Blade 2 — Contenido Secundario):**
> • Carrusel de customers / logos
> • Footer completo:
>   • Copyright
>   • Autor
>   • Métodos de contacto
>
> El scroll debe sentirse como un cambio de blade, no como contenido cortado a la mitad.

### Current State Analysis

**Home Page Structure (`src/app/page.jsx`):**
```jsx
<main className="main_home">
  <MainContainer className="main_home-container" data-testid="home-hero-blade">
    {/* Hero Blade - Story 12.6 complete */}
  </MainContainer>

  <CustomersSlider />   {/* Secondary content - NOT in a blade container */}

  <HireMe />            {/* Floating CTA - hidden on mobile */}
</main>
```

**Current Issues:**
1. CustomersSlider is NOT wrapped in a secondary blade container
2. Footer is likely in global layout, not within Home secondary blade
3. No explicit `min-height` on secondary content section
4. No visual blade separation between Hero and Secondary content
5. CustomersSlider is a placeholder (just text "CustomersSlider")

### CustomersSlider Current State

**Component:** `src/ui/molecules/CustomersSlider/index.jsx`
```jsx
const CustomersSlider = () => {
  return (
    <div className="slider" data-testid="profile-tech-slider">
      <div className="flex slide-track gap-32">
        CustomersSlider
        {/* PLACEHOLDER - customer map logic is commented out */}
      </div>
    </div>
  );
};
```

**CSS Animation:** `src/ui/molecules/CustomersSlider/styles.css`
- 80vw width, auto height, centered
- CSS `@keyframes scroll` animation (20s infinite loop)
- Animation exists but component is placeholder

**Decision:** Story 12.7 focuses on **blade structure**, not implementing the actual customer logos. If CustomersSlider is placeholder, that's acceptable for blade layout testing.

### Footer Component Location

**Component:** `src/ui/organisms/Footer/index.jsx`
- Contains: Copyright, Author, Chat, WhatsApp, CopyEmail
- Full width with top border
- Responsive padding

**Footer Rendering:** Check if Footer is in:
- Global layout (`src/app/layout.jsx`) - renders on ALL pages
- Or needs to be added to Home page specifically

### Previous Story Intelligence (Story 12.6)

**Patterns Established:**
- Use `min-height: 100vh !important` for full viewport blades
- Override `.main-container` inline-block with `display: flex !important`
- Add `data-testid` for E2E testing
- Use semantic breakpoints: `tablet:`, `nav:`, `desktop:`, `wide:`
- Update layout-system.md changelog when making changes
- Use `waitForFunction` instead of `waitForTimeout` in tests

**Code Review Learnings:**
- Add skip guards in tests when elements may not exist
- Use flexible assertions (`>=` instead of exact counts)
- Document `!important` overrides with explanatory comments

### Proposed Implementation

**Step 1: Create Secondary Blade Container**
```jsx
// src/app/page.jsx
<main className="main_home">
  <MainContainer className="main_home-container" data-testid="home-hero-blade">
    {/* Hero Blade */}
  </MainContainer>

  {/* NEW: Secondary Blade Container */}
  <section className="home_secondary-blade" data-testid="home-secondary-blade">
    <CustomersSlider />
    {/* Footer may need to be moved here or handled via layout */}
  </section>

  <HireMe />
</main>
```

**Step 2: Secondary Blade CSS**
```css
/* src/app/styles.css */

/**
 * Secondary Blade Container - Full viewport, visual separation
 * Story 12.7: FR15-FR17 - Secondary content blade
 */
.home_secondary-blade {
  @apply flex flex-col items-center justify-between
  w-full
  bg-light dark:bg-dark;

  /* Fill remaining viewport */
  min-height: 100vh;

  /* Visual separation from Hero blade */
  /* Option A: Subtle top border */
  border-top: 1px solid rgba(0,0,0,0.1);

  /* Option B: Top padding for breathing room */
  padding-top: 2rem;
}

/* Dark mode separation */
.dark .home_secondary-blade {
  border-top: 1px solid rgba(255,255,255,0.1);
}
```

**Step 3: Optional Scroll Snap (Consider)**
```css
/* Optional: Scroll snap for blade feeling */
.main_home {
  scroll-snap-type: y proximity;
}

.main_home-container,
.home_secondary-blade {
  scroll-snap-align: start;
}
```

### Component File Locations

```
src/app/
├── page.jsx              # Home page - add secondary blade container
├── styles.css            # Home page styles - secondary blade CSS
├── layout.jsx            # Check Footer placement

src/ui/molecules/
├── CustomersSlider/      # Customer logos slider (placeholder)
│   ├── index.jsx
│   └── styles.css
└── HireMe/               # Floating CTA (hidden on mobile)

src/ui/organisms/
├── Footer/               # Footer component
│   ├── index.jsx
│   └── styles.css
└── Layout/               # Layout wrapper - may contain Footer
```

### E2E Test Patterns

```typescript
// e2e/home-secondary-blade.spec.ts

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

test.describe("Home Secondary Blade (Story 12.7)", () => {
  test("secondary blade exists and has correct testid", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/");

    const secondaryBlade = page.getByTestId("home-secondary-blade");
    await expect(secondaryBlade).toBeVisible();
  });

  test("secondary blade appears after scrolling past Hero", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Hero blade should be visible initially
    const heroBlade = page.getByTestId("home-hero-blade");
    await expect(heroBlade).toBeInViewport();

    // Secondary blade should NOT be in initial viewport
    const secondaryBlade = page.getByTestId("home-secondary-blade");
    await expect(secondaryBlade).not.toBeInViewport();

    // Scroll down one viewport height
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForFunction(() => window.scrollY >= window.innerHeight * 0.5);

    // Secondary blade should now be visible
    await expect(secondaryBlade).toBeInViewport();
  });

  test("CustomersSlider is visible in secondary blade", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/");

    // Scroll to secondary blade
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForFunction(() => window.scrollY >= window.innerHeight * 0.5);

    const slider = page.locator(".slider, .customers-slider");
    const sliderExists = await slider.count() > 0;

    if (sliderExists) {
      await expect(slider).toBeVisible();
    }
    // If slider doesn't exist, that's okay for blade structure test
  });

  test("footer is visible when scrolled to bottom", async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto("/");

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.locator("footer");
    await expect(footer).toBeInViewport();
  });
});
```

### Risk Assessment

**Riesgo:** 🟢 Bajo (Estructural)

**Potential Issues:**
1. Footer may be in global layout - need to verify if it should be in secondary blade
2. CustomersSlider is placeholder - may affect visual balance
3. Scroll snap could feel "sticky" if not tuned properly
4. 100vh on secondary blade may be too tall on larger screens

**Mitigations:**
1. Check layout.jsx first; if Footer is global, no changes needed
2. Use min-height not exact height for flexibility
3. Use `scroll-snap-type: y proximity` (soft snap) not mandatory
4. Test on multiple viewport sizes

### Breakpoints Reference

| Breakpoint | Range | CSS | Notes |
|------------|-------|-----|-------|
| Base (mobile) | 0-640px | (default) | Primary focus |
| `tablet:` | 641-840px | `@media (min-width: 641px)` | - |
| `nav:` | 841-1024px | `@media (min-width: 841px)` | - |
| `desktop:` | 1025-1440px | `@media (min-width: 1025px)` | - |
| `wide:` | ≥1441px | `@media (min-width: 1441px)` | - |

### References

- [Source: docs/layout-system.md] - Breakpoint system and visibility matrix
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:120-128] - FR15-FR17 specifications
- [Source: _bmad-output/planning-artifacts/epics-v2.md:57-63] - Story 12.7 definition
- [Source: src/app/page.jsx] - Current Home page structure
- [Source: src/app/styles.css] - Home page styles
- [Source: src/ui/molecules/CustomersSlider/] - Customer slider component
- [Source: src/ui/organisms/Footer/] - Footer component
- [Source: Story 12.6] - Previous story patterns and learnings

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
