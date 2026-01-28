# Layout System & Responsive Breakpoints

This document defines the official responsive breakpoint system for the portfolio-frontend-nextjs project. All responsive decisions should reference this document for consistency.

## Quick Reference

| Breakpoint | Range | CSS | Use Case |
|------------|-------|-----|----------|
| Base | 0-640px | (default styles) | Mobile phones |
| `tablet:` | 641-840px | `@media (min-width: 641px)` | Tablets (burger visible) |
| `nav:` | 841-1024px | `@media (min-width: 841px)` | Nav transition (burger hidden, nav visible) |
| `desktop:` | 1025-1440px | `@media (min-width: 1025px)` | Desktop monitors |
| `wide:` | ≥1441px | `@media (min-width: 1441px)` | Wide/ultrawide monitors |

> **Note:** Base styles (no prefix) target mobile. Breakpoints cascade upward with min-width.
> **Story 12.1:** Added `nav:` breakpoint at 841px where hamburger disappears and full navigation appears.

## Design Intent

These breakpoints align with Epic 11 (Responsive Header & Navigation System) and Epic 12 (UX Behavior):

| Name | Range | Description |
|------|-------|-------------|
| Mobile | ≤640px | Single column, burger menu only |
| Tablet | 641-840px | Transitional layout, burger visible, theme toggle visible |
| Nav | 841-1024px | Full navigation visible, burger hidden (Story 12.1) |
| Desktop | 1025-1440px | Full navigation + reserved for future expansions |
| Wide | ≥1441px | All elements visible (social, auth), expanded layout |

## Usage Guidelines

### Mobile-First Approach (Recommended)

Write base styles for mobile, then add breakpoint modifiers to scale up:

```css
/* Single declaration with cascading responsive modifiers */
.component {
  @apply flex flex-col p-4           /* Base: Mobile (0-640px) */
         tablet:flex-row tablet:p-8  /* Tablet+ (≥641px) */
         desktop:p-12;               /* Desktop+ (≥1025px) */
}
```

### In JSX with Tailwind

```jsx
<div className="flex flex-col p-4 tablet:flex-row tablet:p-8 desktop:p-12">
  {/* Mobile: column layout, small padding */}
  {/* Tablet+: row layout, medium padding */}
  {/* Desktop+: large padding */}
</div>
```

## Header Zone-Component Mapping

Each header zone maps to specific components with data-testid attributes for E2E testing:

| Zone | Component | CSS Class | data-testid | Description |
|------|-----------|-----------|-------------|-------------|
| Container | NavBar | `.layout_navbar-container` | `header-container` | Main header wrapper |
| Brand | Logo | `.layout_logo-container` | `header-brand-zone` | Centered logo |
| Hire Me | HireMeHeaderButton | `.hire-me-header` | `header-hire-me-zone` | Mobile CTA button (Story 12.2) |
| Primary Nav | Menu | `.menu-bar__primary-nav` | `header-nav-zone` | Main navigation links |
| Social | Menu | `.menu-bar__social-links` | `header-social-zone` | Social network links |
| Auth | Menu | `.menu-bar__social-login` | `header-auth-zone` | Sign-in buttons |
| UI Controls | Menu | `.menu-bar__ui-controls` | `header-ui-zone` | Theme toggle |
| Burger | MenuFloating | `.menu-floating` | `header-burger-zone` | Mobile menu button |

### Component File Locations

```
src/ui/organisms/
├── NavBar/index.jsx           # Header container (Brand zone)
├── Menu/index.jsx             # Desktop menu (Nav, Social, Auth, UI zones)
├── MenuFloating/index.jsx     # Mobile menu wrapper (Burger zone)
└── MenuFloatingClient/index.jsx # Burger button + floating overlay
```

### Zone Responsibilities

- **Brand Zone**: Always visible, absolutely positioned center
- **Primary Nav Zone**: Navigation links (Home, About, Projects, Articles)
- **Social Zone**: External links (GitHub, LinkedIn, Twitter, etc.)
- **Auth Zone**: Sign-in buttons (LinkedIn, Microsoft, Google)
- **UI Controls Zone**: Theme toggle button
- **Burger Zone**: Mobile menu trigger, opens floating overlay

## Header Zone Visibility Matrix

Reference for Story 11.3, Story 12.1, Story 12.2, and Story 12.3 implementation:

| Breakpoint | Range | Brand | Hire Me | Nav | Social | Auth | Theme | Burger |
|------------|-------|-------|---------|-----|--------|------|-------|--------|
| Base (mobile) | 0-640px | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `tablet:` | 641-840px | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `nav:` | 841-1024px | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `desktop:` | 1025-1440px | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `wide:` | ≥1441px | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |

> **Status (Story 12.3 Complete):** Desktop layout with Social visible at nav+ (841px) and Auth visible at desktop+ (1025px) per FR3.

## Legacy Breakpoints (Deprecated)

The project previously used max-width breakpoints which are **inverted** from standard Tailwind:

| Legacy | Behavior | Status |
|--------|----------|--------|
| `lg:` | ≤1023px | ⚠️ DEPRECATED - kept for compatibility |
| `md:` | ≤767px | ⚠️ DEPRECATED - kept for compatibility |
| `sm:` | ≤639px | ⚠️ DEPRECATED - kept for compatibility |
| `xl:` | ≤1279px | ⚠️ DEPRECATED - kept for compatibility |
| `xs:` | ≤479px | ⚠️ DEPRECATED - kept for compatibility |
| `2xl:` | ≤1535px | ⚠️ DEPRECATED - kept for compatibility |

### Why Legacy Breakpoints Are Inverted

In standard Tailwind:
- `lg:flex` means "apply flex when viewport ≥ 1024px" (desktop shows flex)

In this project's legacy system:
- `lg:flex` means "apply flex when viewport ≤ 1023px" (mobile shows flex)

This inversion caused confusion and unexpected behavior. **Do not use legacy breakpoints for new code.**

### Migration Path

When refactoring existing components:

```css
/* LEGACY (max-width, inverted) */
.menu-bar {
  @apply hidden lg:flex; /* Shows on mobile ≤1023px, hides on desktop */
}

/* NEW (min-width, standard) */
.menu-bar {
  @apply hidden tablet:flex; /* Hides on mobile, shows on tablet+ ≥641px */
}
```

## Testing Breakpoints

### Playwright Viewport Tests

```typescript
// e2e/header-responsive.spec.ts
const breakpoints = {
  mobile: { width: 375, height: 667 },   // Base: 0-640px
  tablet: { width: 768, height: 1024 },  // tablet: 641-1024px
  desktop: { width: 1280, height: 800 }, // desktop: 1025-1440px
  wide: { width: 1920, height: 1080 },   // wide: ≥1441px
};

test.describe("Header Responsive", () => {
  for (const [name, size] of Object.entries(breakpoints)) {
    test(`renders correctly at ${name} (${size.width}px)`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto("/");
      // Add visibility assertions per breakpoint
    });
  }
});
```

### Manual Testing Checklist

- [ ] Test at 375px (iPhone SE)
- [ ] Test at 640px (breakpoint boundary)
- [ ] Test at 1024px (tablet breakpoint)
- [ ] Test at 1440px (desktop breakpoint)
- [ ] Test at 1920px (wide screens)
- [ ] Verify smooth transitions when resizing

## How to Modify Header Behavior

### Adding a New Zone

1. **Define the zone** in the component (e.g., `src/ui/organisms/Menu/index.jsx`)
2. **Add data-testid** following pattern: `header-{zone}-zone`
3. **Register testid** in `e2e/testids.ts` under `TESTIDS.header`
4. **Add visibility rules** using semantic breakpoints in the zone's CSS
5. **Update visibility matrix** in this document
6. **Add E2E tests** in `e2e/header-visibility.spec.ts`

### Changing Zone Visibility

1. **Locate the zone's CSS** (see Component File Locations above)
2. **Modify breakpoint classes** using semantic prefixes (`tablet:`, `desktop:`, `wide:`)
3. **Update the visibility matrix** in this document
4. **Update E2E tests** to match new behavior
5. **Run tests**: `npx playwright test e2e/header-visibility.spec.ts`

### Example: Make Social Zone Visible at Desktop

```css
/* Before: Only visible at wide (≥1441px) */
.menu-bar__social-links {
  @apply hidden wide:flex;
}

/* After: Visible at desktop+ (≥1025px) */
.menu-bar__social-links {
  @apply hidden desktop:flex;
}
```

## E2E Test Files

Header behavior is validated by these test files:

| File | Tests | Purpose |
|------|-------|---------|
| `e2e/header-visibility.spec.ts` | 34 | Zone visibility at all breakpoints + transitions |
| `e2e/header-zones.spec.ts` | 7 | Zone data-testid identification |
| `e2e/header-padding.spec.ts` | 11 | Padding values at all breakpoints |
| `e2e/testids.ts` | - | Centralized testid registry |

Run all header tests:
```bash
npx playwright test e2e/header-visibility.spec.ts e2e/header-zones.spec.ts e2e/header-padding.spec.ts
```

## Related Documentation

- [Architecture](./architecture.md) - System design patterns
- [Development Workflow](./development-workflow.md) - Testing guidelines
- [tailwind.config.js](../tailwind.config.js) - Breakpoint definitions
- Epic 11 in planning artifacts defines the responsive header navigation system

## Changelog

- **2026-01-28**: About Biography & Stats Degradation (Story 12.8)
  - FR18: Stats component maintains grid position (col-span-8) in all states
  - FR19: Graceful degradation without loose text - styled fallback components
  - ExperienceStats error state: styled `.experience-stats_fallback` container
  - Biography error state: styled `.biography_fallback` container
  - Fixed skeleton double-wrapping issue (removed extra `.experience-stats` div)
  - Added data-testid attributes: `experience-stats`, `experience-stats-loading`, `experience-stats-fallback`, `biography-fallback`
  - Added 12 E2E tests for stats degradation validation
- **2026-01-28**: Home Secondary Blade & Scroll (Story 12.7)
  - Added secondary blade container with `data-testid="home-secondary-blade"`
  - Secondary blade contains CustomersSlider component and Footer (FR15 compliance)
  - Footer added to secondary blade per FR15 requirement, while maintaining Footer in global layout for all pages
  - CSS rule hides global Footer on Home page to prevent duplication (`.layout:has(.main_home) > footer`)
  - Added visual separation (subtle border-top) between Hero and Secondary blades per FR17
  - Secondary blade has min-height: 100vh !important for full viewport height (FR16 compliance)
  - CSS layout uses justify-between for vertical content distribution
  - Added 13 E2E tests for secondary blade structure validation (includes Footer inside blade test and no duplication check)
- **2026-01-28**: Home Hero blade structure (Story 12.6)
  - Hero blade now fills full viewport height (min-height: 100vh) per FR16
  - Added `./styles.css` import to Home page (was missing)
  - Button container now uses 50/50 layout on mobile (flex-1) per FR13
  - Buttons return to natural width on tablet+ (flex-none)
  - Added data-testid="home-hero-blade" to MainContainer for E2E testing
  - MainContainer now supports rest props (e.g., data-testid)
  - Added 10 E2E tests for Hero blade structure validation
- **2026-01-28**: Menu auto-close & theme contrast (Story 12.5)
  - NavigationItemLink now accepts optional onClick prop for menu auto-close (FR8)
  - SocialNetworkLink now accepts optional onClick prop for menu auto-close
  - MenuFloatingClient passes closeMenu callback to all links
  - TwitterIcon changed from hardcoded #55acee to currentColor (FR10)
  - DribbbleIcon changed from hardcoded #E74D89/#B2215A to currentColor (FR10)
  - Added 9 E2E tests for menu auto-close and icon theme contrast
- **2026-01-28**: Header hover & selected states (Story 12.4)
  - HireMeHeaderButton hover changed from bg-primary to color inverse (FR6)
  - ActiveMark animation changed from left-to-right to center-out via scale-x (FR9)
  - Added 10 E2E tests for hover states in header-hover-states.spec.ts
  - Added navLinks to TESTIDS registry for navigation link selectors
- **2026-01-28**: Desktop header layout (Story 12.3)
  - Social zone now visible at nav+ (841px) instead of wide only
  - Auth zone now visible at desktop+ (1025px) instead of wide only
  - Updated visibility matrix with FR3 compliance
  - Updated E2E tests with new visibility expectations and added 2 transition tests
- **2026-01-28**: Mobile header layout (Story 12.2)
  - Added HireMeHeaderButton component for mobile header right zone
  - Added Hire Me zone to visibility matrix (visible mobile/tablet, hidden nav+)
  - Hidden circular HireMe component on mobile (migrated to nav:flex)
  - Fixed z-index layering for MenuButton (z-30) above floating overlay
  - Added 13 E2E tests for mobile header layout validation
- **2026-01-27**: Nav breakpoint implementation (Story 12.1)
  - Added `nav:` breakpoint at 841px in tailwind.config.js
  - Hamburger menu now disappears at 841px instead of 1025px (FR1, FR4)
  - Updated visibility matrix with new `nav:` row
  - Migrated MenuFloating from `desktop:hidden` to `nav:hidden`
  - Updated MenuFloatingClient zombie state prevention from 1025px to 841px
  - Added 15 new E2E tests for nav breakpoint boundary and transitions
- **2026-01-27**: Documentation completion (Story 11.6)
  - Added "How to Modify Header Behavior" guide with step-by-step instructions
  - Added E2E Test Files section with test counts and run commands
  - Added development-workflow.md to related documentation
- **2026-01-27**: NavBar padding migration (Story 11.4)
  - Migrated NavBar padding from legacy inverted breakpoints to semantic min-width
  - Legacy: `px-32 lg:px-16 md:px-12 sm:px-8` → Semantic: `px-8 tablet:px-12 desktop:px-16 wide:px-32`
  - Added 11 E2E tests for padding validation at all breakpoints
- **2026-01-27**: Zone-component mapping (Story 11.2)
  - Added zone-component mapping table with data-testid references
  - Documented component file locations and zone responsibilities
  - Added status note about current legacy breakpoint usage
- **2026-01-27**: Code review fixes (Story 11.1)
  - Aligned breakpoints exactly with Epic 11 ranges: tablet (641px), desktop (1025px), wide (1441px)
  - Removed confusing `mobile:` breakpoint (base styles cover mobile)
  - Fixed documentation examples and references
- **2026-01-27**: Initial breakpoint system documentation (Story 11.1)
  - Added semantic breakpoints (tablet, desktop, wide)
  - Documented legacy breakpoint deprecation
  - Created visibility matrix for header zones
