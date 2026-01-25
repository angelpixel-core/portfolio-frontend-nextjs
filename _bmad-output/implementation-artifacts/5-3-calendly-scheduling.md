# Story 5.3: Calendly Scheduling

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to schedule a meeting via Calendly**,
So that **I can book time without back-and-forth emails**.

---

## Acceptance Criteria

### AC1: Calendly Button Behavior
**Given** I want to schedule a meeting
**When** I click the Calendly button
**Then** the Calendly widget opens or I'm redirected
**And** I can see available time slots

### AC2: Calendly Fallback Behavior
**Given** Calendly embed fails to load
**When** the component renders
**Then** a fallback link to Calendly is displayed
**And** no error is thrown

---

## Tasks / Subtasks

- [ ] **Task 1: Migrate Calendar molecule to TypeScript** (AC: #1, #2)
  - [ ] 1.1 Migrate `src/ui/molecules/Calendar/index.jsx` → `index.tsx`
  - [ ] 1.2 Migrate `src/ui/molecules/Calendar/Link.jsx` → `Link.tsx`
  - [ ] 1.3 Define proper TypeScript interfaces for props
  - [ ] 1.4 Evaluate if "use client" is required (useProfile hook)

- [ ] **Task 2: Migrate CalendarLink atom to TypeScript** (AC: #1, #2)
  - [ ] 2.1 Migrate `src/ui/atoms/links/CalendarLink/index.jsx` → `index.tsx`
  - [ ] 2.2 Migrate `src/ui/atoms/links/CalendarLink/skeleton.jsx` → `skeleton.tsx`
  - [ ] 2.3 Define CalendarLinkProps interface
  - [ ] 2.4 Update barrel export in `src/ui/atoms/links/index.js`

- [ ] **Task 3: Migrate CalendarIcon to TypeScript** (AC: #1)
  - [ ] 3.1 Migrate `src/ui/atoms/icons/CalendarIcon/index.jsx` → `index.tsx`
  - [ ] 3.2 Ensure icon has `aria-hidden="true"` (already present)
  - [ ] 3.3 Update barrel export in `src/ui/atoms/icons/index.js`

- [ ] **Task 4: Fix graceful fallback behavior** (AC: #2)
  - [ ] 4.1 Change fallback from `href="#"` to `return null` (graceful fallback)
  - [ ] 4.2 Add console.warn when calendly URL not available
  - [ ] 4.3 Ensure component doesn't crash on error state

- [ ] **Task 5: Add accessibility improvements** (AC: #1)
  - [ ] 5.1 Add proper aria-label to Calendly links ("Schedule a meeting via Calendly")
  - [ ] 5.2 Add `rel="noopener noreferrer"` to external links
  - [ ] 5.3 Add focus-visible styles (outline-2 outline-primary)
  - [ ] 5.4 Ensure 44x44px minimum touch target (w-11 h-11)
  - [ ] 5.5 Remove duplicate aria-label (icon link should inherit from parent or have different label)

- [ ] **Task 6: Add component tests** (AC: #1, #2) - TDD Approach
  - [ ] 6.1 Create `Calendar/__tests__/Calendar.test.tsx`
  - [ ] 6.2 Test: Renders Calendly link with calendly.com URL
  - [ ] 6.3 Test: Link has correct target="_blank" and rel attributes
  - [ ] 6.4 Test: Icon has aria-hidden
  - [ ] 6.5 Test: Component handles loading state (shows skeleton)
  - [ ] 6.6 Test: Component handles error state gracefully (returns null)
  - [ ] 6.7 Test: Component handles missing calendly URL gracefully
  - [ ] 6.8 Test: Skeleton renders while loading

- [ ] **Task 7: Final Validation** (AC: #1, #2)
  - [ ] 7.1 Run `npm run lint` - PASS
  - [ ] 7.2 Run `npm run typecheck` - PASS
  - [ ] 7.3 Run `npm test` - PASS
  - [ ] 7.4 Manual: Click Calendly button → opens calendly.com link
  - [ ] 7.5 Manual: Tab to Calendly link → focus visible
  - [ ] 7.6 Manual: Mobile test → touch target is 44x44px
  - [ ] 7.7 Manual: Without calendly URL in profile → component not rendered (no error)

---

## Dev Notes

### Previous Story Learnings (Story 5.1 & 5.2)

**APPLY THESE PATTERNS:**
- TypeScript migration pattern: index.tsx, Component.tsx, skeleton.tsx
- 44x44px minimum touch targets for mobile a11y
- aria-labels on interactive elements
- focus-visible styles with outline
- Graceful fallback when data not available (return null, log warning)
- Tests: rendering, accessibility, edge cases
- TDD approach: Write tests BEFORE implementation (RED → GREEN → REFACTOR)
- Fix regressions immediately, document non-blocking issues in backlog

**Retro Insight from 5.2:**
- Clipboard functionality is out of scope (Story 5.5)
- Keep story scope tight, document expectations that exceed AC
- Check iconMapping for PascalCase variants after migration

### Current State Analysis

**Calendar Molecule (JSX, needs TypeScript migration):**
```
src/ui/molecules/Calendar/
├── index.jsx         # Main component (Suspense wrapper)
└── Link.jsx          # Client component with Calendly link (uses useProfile)
```

**CalendarLink Atom (JSX, needs TypeScript migration):**
```
src/ui/atoms/links/CalendarLink/
├── index.jsx         # Link component with icon
├── skeleton.jsx      # Loading state (shows "ABS" placeholder)
└── styles.css        # Component styles
```

**CalendarIcon Atom (JSX, needs TypeScript migration):**
```
src/ui/atoms/icons/CalendarIcon/
├── index.jsx         # Calendar SVG icon
└── styles.css        # Icon styles
```

**Issues Found in Current Implementation:**

1. **Link.jsx falls back to `href="#"`:**
   ```javascript
   const href = isLoading || isError || !profile ? "#" : profile.calendly || "#";
   ```
   - Falls back to "#" which is poor UX
   - Should hide the link or return null (like WhatsApp pattern)

2. **CalendarLink has duplicate aria-labels:**
   - Both text link and icon link have same aria-label
   - Icon link should be aria-hidden or have different label

3. **CalendarLink missing rel attribute:**
   - External links should have `rel="noopener noreferrer"`

4. **CalendarLink uses suppressHydrationWarning:**
   - This hides hydration issues instead of fixing them
   - Should investigate and fix root cause

5. **Skeleton shows "ABS" placeholder:**
   - Should show proper skeleton structure
   - Add aria-hidden to skeleton

6. **No tests exist:**
   - No test files in `__tests__` folders

7. **CalendarIcon has no TypeScript types:**
   - Needs migration with proper IconProps

### Profile Domain (Calendly Source)

The Calendly URL comes from the profile domain:
```typescript
// Profile schema already has calendly field
calendly: z.string().url().optional(),

// Mock data
calendly: "https://www.calendly.com/contact@amazingcompany.com"
```

### Calendly Link Format

Calendly uses the format:
```
https://calendly.com/{username}
# or
https://calendly.com/{username}/{event-type}
```

The link should open in a new tab, redirecting the user to Calendly's scheduling interface.

**Note:** This story does NOT implement Calendly embed widget. The AC says "widget opens OR I'm redirected" - we implement the redirect approach (simpler, works everywhere).

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/molecules/`, `@/links/`, `@/icons/` |
| Atomic Design | Calendar in `molecules/`, CalendarLink in `atoms/links/`, CalendarIcon in `atoms/icons/` |
| Test convention | Tests in `__tests__/` folders |
| Accessibility | aria-labels, keyboard accessible, 44x44px touch targets |
| Client Components | Link.tsx needs "use client" due to useProfile hook |

### Testing Strategy

**Calendar Tests:**
- Renders Calendar molecule with Calendly link
- Link points to calendly.com URL from profile
- Link has target="_blank" and rel="noopener noreferrer"
- Icon has aria-hidden="true"
- Link has proper aria-label ("Schedule a meeting via Calendly")
- Handles loading state (shows skeleton)
- Handles error state (graceful fallback, no crash)
- Handles missing calendly URL (returns null)
- Link is keyboard accessible

### Related Files

```
src/domains/profile/           # Source of Calendly URL
├── queries/useProfile.ts      # Hook that provides profile data
└── model/schema.ts            # Profile schema with calendly field

src/ui/molecules/Hero/         # Uses Calendar component
└── index.jsx                  # Hero section with calendly link

src/ui/atoms/links/index.js    # Barrel export for CalendarLink
src/ui/atoms/icons/index.js    # Barrel export for CalendarIcon
```

### NFR Compliance (from PRD)

**NFR23:** Calendly embed funcional con fallback
- This story implements the "fallback" approach (direct link to Calendly)
- Full embed could be a future enhancement

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm test              # Jest unit tests
```

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] Navigate to contact section → Calendly button visible
- [ ] Click Calendly button → opens calendly.com link in new tab
- [ ] URL format is `https://calendly.com/{username}`
- [ ] Tab to Calendly link → focus visible with proper outline
- [ ] Press Enter on Calendly link → opens in new tab
- [ ] Touch target is at least 44x44px
- [ ] When profile loading → shows skeleton
- [ ] When profile error → graceful fallback (no crash)
- [ ] When profile has no calendly URL → component not rendered

---

## References

- [Source: epics.md#Story 5.3] - Original acceptance criteria (FR20)
- [Source: 5-1-email-contact-access.md] - Email contact patterns
- [Source: 5-2-whatsapp-contact.md] - WhatsApp contact patterns (graceful fallback)
- [Source: src/ui/molecules/Calendar/] - Current implementation to migrate
- [Source: src/ui/atoms/links/CalendarLink/] - CalendarLink atom to migrate
- [Source: src/ui/atoms/icons/CalendarIcon/] - CalendarIcon to migrate
- [Source: src/domains/profile/] - Profile domain with Calendly data
- [Calendly API](https://help.calendly.com/hc/en-us/articles/223147027-Sharing-your-scheduling-link) - Calendly link docs

---

## Dev Agent Record

### Agent Model Used

(To be filled by implementing agent)

### Debug Log References

(To be filled during implementation)

### Completion Notes List

(To be filled during implementation)

### File List

(To be filled during implementation)
