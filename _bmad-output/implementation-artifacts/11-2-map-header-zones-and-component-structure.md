# Story 11.2: Map Header Zones and Component Structure

Status: ready-for-dev

## Story

As a developer,
I want header zones clearly defined and mapped to components,
so that each zone has explicit responsibility and styling boundaries.

## Acceptance Criteria

1. **AC1: Zone Identification**
   - **Given** the Header component
   - **When** I inspect its structure
   - **Then** each zone is clearly identifiable (Brand, Nav, Social, Auth, UI, CTA)

2. **AC2: Zone Documentation**
   - **Given** a header zone component
   - **When** I read its code
   - **Then** it has clear documentation of its role and visibility rules

3. **AC3: No Visual Conflicts**
   - **Given** the header layout
   - **When** rendered at any breakpoint
   - **Then** zones do not overlap or conflict visually

## Tasks / Subtasks

- [ ] Task 1: Analyze Current Header Structure (AC: 1, 3)
  - [ ] 1.1: Document current NavBar, Menu, MenuFloating component hierarchy
  - [ ] 1.2: Map each section to Epic 11 zone definitions
  - [ ] 1.3: Identify gaps between current structure and target zones
  - [ ] 1.4: Create component diagram showing zone boundaries

- [ ] Task 2: Define Zone-Component Mapping (AC: 1, 2)
  - [ ] 2.1: Create formal zone definitions with component assignments
  - [ ] 2.2: Document which existing components belong to each zone
  - [ ] 2.3: Identify components that span multiple zones (refactor candidates)
  - [ ] 2.4: Define data-testid naming for each zone

- [ ] Task 3: Add Zone Documentation (AC: 2)
  - [ ] 3.1: Add JSDoc comments to NavBar with zone overview
  - [ ] 3.2: Add zone role comments to Menu component sections
  - [ ] 3.3: Add zone role comments to MenuFloating component sections
  - [ ] 3.4: Update layout-system.md with zone-component mapping

- [ ] Task 4: Validate Zone Boundaries (AC: 3)
  - [ ] 4.1: Check visual rendering at each breakpoint boundary
  - [ ] 4.2: Verify no element overlaps or conflicts
  - [ ] 4.3: Run existing E2E tests to ensure no regressions

## Dev Notes

### Current Header Component Analysis

**Component Hierarchy (from codebase analysis):**
```
NavBar/                        # Main header container
├── index.jsx                  # Header wrapper with Menu, MenuFloating, Logo
├── styles.css                 # .layout_navbar-container, .layout_logo-container

Menu/                          # Desktop navigation (uses legacy inverted lg:)
├── index.jsx                  # Primary nav, social links, auth buttons, theme
├── styles.css                 # .menu-bar { hidden lg:flex } ← INVERTED
├── skeletons/                 # Loading states

MenuFloating/                  # Mobile navigation (burger menu)
├── index.jsx                  # Wrapper for MenuFloatingClient
├── styles.css                 # .menu-floating { flex lg:hidden } ← INVERTED

MenuFloatingClient/            # Client-side burger menu logic
├── index.jsx                  # Actual menu content with navigation + contacts
```

### Current Zone Mapping (Analysis)

Based on Epic 11 zone definitions and current codebase:

| Zone | Epic 11 Definition | Current Component | Current Location |
|------|-------------------|-------------------|------------------|
| **Brand** | Logo (centro visual) | `Logo` | NavBar → `.layout_logo-container` |
| **Primary Nav** | Home / About / Projects / Articles | NavigationItemLink map | Menu → `.menu-bar__primary-nav` |
| **Social/Contact** | WhatsApp, Telegram, Twitter, LinkedIn | SocialNetworkLink map | Menu → `.menu-bar__social-links` |
| **Auth Actions** | Google / Microsoft / LinkedIn buttons | Hardcoded buttons | Menu → `.menu-bar__social-login` |
| **UI Controls** | Theme switcher | `ThemeButton` | Menu (end of component) |
| **Floating CTA** | "Hire me" | NOT in header | Separate component (HireMe) |

### Gap Analysis

**Identified Issues:**

1. **Zone Mixing in Menu Component:**
   - Menu.jsx contains Primary Nav, Social, Auth, AND Theme
   - Should be separate zone components for clarity

2. **Inconsistent Zone Boundaries:**
   - Social links and Auth buttons are separate navs but visually adjacent
   - No clear CSS boundaries between zones

3. **Missing Burger Zone:**
   - MenuFloating contains everything for mobile
   - Burger button itself (MenuButton) is inside MenuFloatingClient

4. **Logo Positioning:**
   - Logo is absolutely positioned (center)
   - This works but may conflict with flex layout at edge cases

### Target Zone Structure (Story 11.2 Output)

```
Header (NavBar)
├── Zone: Brand
│   └── Logo (absolutely centered)
│
├── Zone: Primary Nav (Menu desktop)
│   └── NavigationItemLink[] (Home, About, Projects, Articles)
│
├── Zone: Social/Contact
│   └── SocialNetworkLink[] (GitHub, LinkedIn, Twitter, etc.)
│
├── Zone: Auth Actions
│   └── AuthButton[] (LinkedIn, Microsoft, Google sign-in)
│
├── Zone: UI Controls
│   └── ThemeButton
│
└── Zone: Burger (Mobile only)
    └── MenuButton → opens Floating overlay
```

### Visibility Matrix Reference

From `docs/layout-system.md` (Story 11.1):

| Breakpoint | Range | Nav | Social | Auth | Theme | Burger |
|------------|-------|-----|--------|------|-------|--------|
| Base (mobile) | 0-640px | ❌ | ❌ | ❌ | ❌ | ✅ |
| `tablet:` | 641-1024px | ❌ | ❌ | ❌ | ✅ | ✅ |
| `desktop:` | 1025-1440px | ✅ | ❌ | ❌ | ✅ | ❌ |
| `wide:` | ≥1441px | ✅ | ✅ | ✅ | ✅ | ❌ |

### Breakpoint System Reference

From Story 11.1 implementation:
- **Semantic breakpoints (NEW):** `tablet:`, `desktop:`, `wide:` (min-width, standard)
- **Legacy breakpoints (DEPRECATED):** `lg:`, `md:`, `sm:` (max-width, inverted)
- Current Menu uses legacy `lg:flex` (shows ≤1023px, hides >1023px)

### data-testid Naming Convention

Following Story 7.2 pattern: `{domain}-{component}-{element}`

| Zone | Proposed testid |
|------|-----------------|
| Header container | `layout-header-container` |
| Brand zone | `header-brand-zone` |
| Primary nav zone | `header-nav-zone` |
| Social zone | `header-social-zone` |
| Auth zone | `header-auth-zone` |
| UI controls zone | `header-ui-zone` |
| Burger zone | `header-burger-zone` |

### Project Structure Notes

**Files to Modify:**
- `src/ui/organisms/NavBar/index.jsx` - Add zone documentation, testids
- `src/ui/organisms/Menu/index.jsx` - Add zone section comments, testids
- `src/ui/organisms/Menu/styles.css` - Document zone CSS classes
- `src/ui/organisms/MenuFloating/index.jsx` - Add zone documentation
- `src/ui/organisms/MenuFloatingClient/index.jsx` - Add zone section comments
- `docs/layout-system.md` - Add zone-component mapping section

**Files to Reference:**
- `tailwind.config.js` - Breakpoint definitions (tablet:, desktop:, wide:)
- `docs/layout-system.md` - Visibility matrix, breakpoint documentation

### Implementation Approach

**Scope Clarification:** This story is DOCUMENTATION and MAPPING only. No component refactoring.
- Add JSDoc comments documenting zone responsibilities
- Add data-testid attributes to zone containers
- Update docs/layout-system.md with zone mapping
- Do NOT change component structure (that's Story 11.4)

### Previous Story Intelligence

From Story 11.1:
- Semantic breakpoints implemented: `tablet:`, `desktop:`, `wide:`
- Legacy breakpoints preserved for backward compatibility
- docs/layout-system.md created with visibility matrix
- Current components still use legacy `lg:` breakpoints (migration in 11.3/11.4)

### References

- [Source: src/ui/organisms/NavBar/index.jsx:1-21] - Current NavBar structure
- [Source: src/ui/organisms/Menu/index.jsx:1-181] - Menu with all zones mixed
- [Source: src/ui/organisms/Menu/styles.css:1-44] - Menu zone CSS classes
- [Source: src/ui/organisms/MenuFloating/styles.css:1-21] - MenuFloating CSS
- [Source: src/ui/organisms/MenuFloatingClient/index.jsx:1-113] - Mobile menu content
- [Source: docs/layout-system.md:52-62] - Header Zone Visibility Matrix
- [Source: _bmad-output/planning-artifacts/epics.md:1416-1422] - Epic 11 zone definitions

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

