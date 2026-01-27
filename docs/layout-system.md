# Layout System & Responsive Breakpoints

This document defines the official responsive breakpoint system for the portfolio-frontend-nextjs project. All responsive decisions should reference this document for consistency.

## Quick Reference

| Breakpoint | Range | CSS | Use Case |
|------------|-------|-----|----------|
| Base | 0-640px | (default styles) | Mobile phones |
| `tablet:` | 641-1024px | `@media (min-width: 641px)` | Tablets, small laptops |
| `desktop:` | 1025-1440px | `@media (min-width: 1025px)` | Desktop monitors |
| `wide:` | ≥1441px | `@media (min-width: 1441px)` | Wide/ultrawide monitors |

> **Note:** Base styles (no prefix) target mobile. Breakpoints cascade upward with min-width.

## Design Intent

These breakpoints align with Epic 11 (Responsive Header & Navigation System):

| Name | Range | Description |
|------|-------|-------------|
| Mobile | ≤640px | Single column, burger menu only |
| Tablet | 641-1024px | Transitional layout, selective element collapse |
| Desktop | 1025-1440px | Full navigation visible |
| Wide | ≥1441px | All elements visible, expanded layout |

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

Reference for Story 11.3 implementation:

| Breakpoint | Range | Nav | Social | Auth | Theme | Burger |
|------------|-------|-----|--------|------|-------|--------|
| Base (mobile) | 0-640px | ❌ | ❌ | ❌ | ❌ | ✅ |
| `tablet:` | 641-1024px | ❌ | ❌ | ❌ | ✅ | ✅ |
| `desktop:` | 1025-1440px | ✅ | ❌ | ❌ | ✅ | ❌ |
| `wide:` | ≥1441px | ✅ | ✅ | ✅ | ✅ | ❌ |

> **Status (Story 11.3 Complete):** Zone testids and semantic min-width breakpoints are fully implemented. The Floating component was also migrated from legacy `lg:flex` to `flex desktop:hidden`.

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

## Related Documentation

- [Architecture](./architecture.md) - System design patterns
- [tailwind.config.js](../tailwind.config.js) - Breakpoint definitions
- Epic 11 in planning artifacts defines the responsive header navigation system

## Changelog

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
