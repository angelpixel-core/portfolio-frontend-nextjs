# Story 12.5: Menu Auto-Close & Theme Contrast

Status: ready-for-dev

## Story

As a mobile user navigating the portfolio,
I want the floating menu to close automatically when I select a navigation item and social icons to have proper contrast in all themes,
so that I have a smooth navigation experience without manual menu management and can clearly see all interactive elements.

## Acceptance Criteria

1. **AC1: Menu Auto-Close on Navigation**
   - **Given** the floating menu is open on mobile/tablet viewport
   - **When** user clicks on any navigation link (Home, About, Projects, Articles)
   - **Then** the menu closes automatically
   - **And** navigation to the selected page completes
   - **Note:** FR8 specifies "Al navegar a una sección, el menú se cierra automáticamente"

2. **AC2: Menu Auto-Close on Social Link Click**
   - **Given** the floating menu is open
   - **When** user clicks on any social link (GitHub, LinkedIn, etc.)
   - **Then** the menu closes automatically
   - **And** the external link opens (likely in new tab)

3. **AC3: Twitter Icon Theme Contrast**
   - **Given** the Twitter icon is displayed in header or floating menu
   - **When** user toggles between light and dark theme
   - **Then** the icon adapts to current theme color (inherits text color)
   - **And** maintains WCAG AA contrast ratio (4.5:1)
   - **Note:** Currently hardcoded `#55acee`, needs `currentColor`

4. **AC4: Dribbble Icon Theme Contrast**
   - **Given** the Dribbble icon is displayed
   - **When** user toggles between light and dark theme
   - **Then** the icon adapts to current theme color
   - **And** maintains WCAG AA contrast ratio
   - **Note:** Currently hardcoded `#E74D89` and `#B2215A`, needs `currentColor`

5. **AC5: Other Social Icons Verification**
   - **Given** all social icons (GitHub, LinkedIn, Telegram, WhatsApp)
   - **When** displayed in light and dark themes
   - **Then** they maintain proper contrast (already use `currentColor`)
   - **And** visual consistency is verified across all icons

## Tasks / Subtasks

- [ ] Task 1: Implement Menu Auto-Close on Navigation (AC: 1)
  - [ ] 1.1: Add optional `onClick` prop to NavigationItemLink component
  - [ ] 1.2: In MenuFloatingClient, pass `closeMenu` as onClick to NavigationItemLink
  - [ ] 1.3: Test navigation works and menu closes on mobile viewport
  - [ ] 1.4: Verify menu doesn't close on desktop (where floating menu isn't used)

- [ ] Task 2: Implement Menu Auto-Close on Social Links (AC: 2)
  - [ ] 2.1: Add optional `onClick` prop to SocialNetworkLink component
  - [ ] 2.2: In MenuFloatingClient, pass `closeMenu` as onClick to SocialNetworkLink
  - [ ] 2.3: Test external links open and menu closes
  - [ ] 2.4: Ensure onClick fires before navigation (or use Promise pattern)

- [ ] Task 3: Fix Twitter Icon Theme Contrast (AC: 3)
  - [ ] 3.1: Open `src/ui/atoms/icons/TwitterIcon/index.jsx`
  - [ ] 3.2: Change `fill="#55acee"` to `fill="currentColor"`
  - [ ] 3.3: Test icon visibility in light theme
  - [ ] 3.4: Test icon visibility in dark theme
  - [ ] 3.5: Verify contrast ratio meets WCAG AA

- [ ] Task 4: Fix Dribbble Icon Theme Contrast (AC: 4)
  - [ ] 4.1: Open `src/ui/atoms/icons/DribbbleIcon/index.jsx`
  - [ ] 4.2: Change `fill="#E74D89"` to `fill="currentColor"` (outer path)
  - [ ] 4.3: Change `fill="#B2215A"` to `fill="currentColor"` (inner path)
  - [ ] 4.4: Test icon visibility in both themes
  - [ ] 4.5: Verify contrast ratio meets WCAG AA

- [ ] Task 5: Verify Existing Icon Theme Contrast (AC: 5)
  - [ ] 5.1: Visually verify GitHubIcon in both themes
  - [ ] 5.2: Visually verify LinkedInIcon in both themes
  - [ ] 5.3: Visually verify TelegramIcon in both themes
  - [ ] 5.4: Visually verify WhatsAppIcon in both themes
  - [ ] 5.5: Document any issues found

- [ ] Task 6: E2E Tests (AC: 1-5)
  - [ ] 6.1: Add test for menu auto-close on navigation click
  - [ ] 6.2: Add test for menu auto-close on social link click
  - [ ] 6.3: Add visual consistency test for icons in both themes
  - [ ] 6.4: Run all tests at mobile and tablet viewports

- [ ] Task 7: Documentation Update
  - [ ] 7.1: Add changelog entry for Story 12.5 in layout-system.md
  - [ ] 7.2: Update JSDoc comments in modified components

## Dev Notes

### Critical Context (Epic 12 UX Behavior Specification)

**FR8:** Al navegar a una sección, el menú se cierra automáticamente
**FR10:** Íconos sociales con contraste correcto según tema (light/dark)

**From epic-12-ux-behavior.md Section 3.2 (Header abierto):**
> Al hacer click en cualquier item de navegación:
> • Se navega a la sección
> • El menú se cierra automáticamente

> Íconos deben tener contraste correcto según tema

### Current State Analysis

**MenuFloatingClient (src/ui/organisms/MenuFloatingClient/index.jsx):**
- Uses `useMenuPanel` hook: `const { isOpen: isMenuOpen, close: closeMenu } = useMenuPanel();`
- Has viewport-based auto-close via useEffect (already implemented for breakpoint changes)
- NavigationItemLink used at lines 121-127 WITHOUT onClick handler
- SocialNetworkLink used at lines 151-157 WITHOUT onClick handler
- **Gap:** Neither component receives closeMenu callback

**NavigationItemLink (src/ui/atoms/links/NavigationItemLink/index.jsx):**
- Simple wrapper around Next.js Link
- Does NOT accept onClick prop currently
- **Fix needed:** Add optional onClick prop, forward to Link

**SocialNetworkLink (src/ui/molecules/SocialNetworkLink/):**
- Renders anchor with icon
- Does NOT accept onClick prop currently
- **Fix needed:** Add optional onClick prop

**Icon Theme Contrast Analysis:**

| Icon | Current Fill | Status | Fix Needed |
|------|--------------|--------|------------|
| GitHubIcon | `currentColor` | ✅ OK | None |
| LinkedInIcon | `currentColor` | ✅ OK | None |
| TelegramIcon | `currentColor` | ✅ OK | None |
| WhatsAppIcon | `currentColor` | ✅ OK | None |
| TwitterIcon | `#55acee` | ❌ Hardcoded | Change to `currentColor` |
| DribbbleIcon | `#E74D89`, `#B2215A` | ❌ Hardcoded | Change to `currentColor` |

### Code Changes Required

**NavigationItemLink (Task 1):**
```jsx
// BEFORE
const NavigationItemLink = ({ href, name, className }) => {
  return (
    <Link href={href} className={...} data-testid={...}>
      {name}
      <ActiveMark activePath={href} />
    </Link>
  );
};

// AFTER
const NavigationItemLink = ({ href, name, className, onClick }) => {
  return (
    <Link href={href} className={...} data-testid={...} onClick={onClick}>
      {name}
      <ActiveMark activePath={href} />
    </Link>
  );
};
```

**MenuFloatingClient usage (Task 1):**
```jsx
// BEFORE
<NavigationItemLink
  key={idx}
  href={href}
  name={name}
  className="menu-floating__link"
/>

// AFTER
<NavigationItemLink
  key={idx}
  href={href}
  name={name}
  className="menu-floating__link"
  onClick={closeMenu}
/>
```

**TwitterIcon (Task 3):**
```jsx
// BEFORE
<path
  fill="#55acee"
  d="M256 25.45..."
/>

// AFTER
<path
  fill="currentColor"
  d="M256 25.45..."
/>
```

**DribbbleIcon (Task 4):**
```jsx
// BEFORE (two paths)
<path fill="#E74D89" d="M128 8.5c66..." />
<path fill="#B2215A" d="M128 255.7c..." />

// AFTER
<path fill="currentColor" d="M128 8.5c66..." />
<path fill="currentColor" d="M128 255.7c..." />
```

### Previous Story Intelligence (Story 12.4)

**Patterns Established:**
- Use semantic breakpoints: `tablet:`, `nav:`, `desktop:`, `wide:`
- Update layout-system.md changelog when making changes
- Always update JSDoc in component when changing behavior
- Test at boundary viewports

**Code Review Learnings:**
- Complete Dev Agent Record with file list
- Test in both light and dark themes
- Verify prefers-reduced-motion compliance (not applicable to this story)

### Component File Locations

```
src/ui/atoms/links/NavigationItemLink/
├── index.jsx              # Add onClick prop
└── styles.css             # No changes needed

src/ui/molecules/SocialNetworkLink/
├── index.jsx              # Add onClick prop
├── Icon.jsx               # No changes needed
└── Skeleton.jsx           # No changes needed

src/ui/organisms/MenuFloatingClient/
└── index.jsx              # Pass closeMenu to links

src/ui/atoms/icons/TwitterIcon/
└── index.jsx              # Change fill to currentColor

src/ui/atoms/icons/DribbbleIcon/
└── index.jsx              # Change fill to currentColor
```

### E2E Test Patterns

```typescript
// Test menu auto-close on navigation
test("menu closes when clicking navigation link", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Open menu
  const menuButton = page.getByTestId(TESTIDS.header.burgerZone);
  await menuButton.click();

  // Wait for menu to open
  await expect(page.locator(".menu-floating")).toBeVisible();

  // Click About link
  const aboutLink = page.locator(".menu-floating__link").filter({ hasText: "About" });
  await aboutLink.click();

  // Menu should close and navigation should happen
  await expect(page.locator(".menu-floating")).not.toBeVisible();
  await expect(page).toHaveURL("/about");
});

// Test icon theme contrast
test("social icons adapt to dark theme", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  // Open menu
  await page.getByTestId(TESTIDS.header.burgerZone).click();
  await expect(page.locator(".menu-floating")).toBeVisible();

  // Check that icons inherit text color (not hardcoded brand colors)
  const twitterIcon = page.locator(".menu-floating svg path[d*='256 25.45']");
  await expect(twitterIcon).toHaveAttribute("fill", "currentColor");
});
```

### Risk Assessment

**Riesgo:** 🟡 Medio (Mayormente layout)

**Potential Issues:**
1. onClick on Link might fire after navigation starts, not closing menu
2. External social links may have different click behavior
3. Changing icon colors affects brand recognition
4. Tests may be flaky due to timing of menu close + navigation

**Mitigations:**
1. onClick fires synchronously, so closeMenu will execute before navigation
2. For external links (target="_blank"), onClick still fires before navigation
3. Theme adaptation is specified in FR10, brand recognition is secondary
4. Use proper waitFor patterns in tests, not arbitrary timeouts

### References

- [Source: docs/layout-system.md] - Component file locations and breakpoint system
- [Source: _bmad-output/implementation-artifacts/epic-12-ux-behavior.md:61-65] - FR8, FR10 specifications
- [Source: _bmad-output/planning-artifacts/epics-v2.md:140-144] - Story 12.5 definition
- [Source: src/ui/organisms/MenuFloatingClient/index.jsx:52] - useMenuPanel usage
- [Source: src/ui/atoms/links/NavigationItemLink/index.jsx:6-19] - Current component
- [Source: src/ui/atoms/icons/TwitterIcon/index.jsx:14] - Hardcoded fill color
- [Source: src/ui/atoms/icons/DribbbleIcon/index.jsx:14,18] - Hardcoded fill colors
- [Source: src/ui/atoms/icons/GitHubIcon/index.jsx:14] - Correct currentColor pattern

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
