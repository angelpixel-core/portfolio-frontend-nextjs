# Story 5.2: WhatsApp Contact

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to contact via WhatsApp**,
So that **I can have a quick conversation**.

---

## Acceptance Criteria

### AC1: WhatsApp Button Behavior
**Given** I view the contact section
**When** I click the WhatsApp button
**Then** WhatsApp opens with the correct number
**And** on mobile, the WhatsApp app opens
**And** on desktop, WhatsApp Web opens

### AC2: WhatsApp Link Format
**Given** the WhatsApp link
**When** rendered
**Then** it uses the wa.me format with country code

---

## Tasks / Subtasks

- [ ] **Task 1: Migrate WhatsApp components to TypeScript** (AC: #1, #2)
  - [ ] 1.1 Migrate `src/ui/molecules/WhatsApp/index.jsx` → `index.tsx`
  - [ ] 1.2 Migrate `src/ui/molecules/WhatsApp/Link.jsx` → `Link.tsx`
  - [ ] 1.3 Migrate `src/ui/molecules/WhatsApp/Skeleton.jsx` → `Skeleton.tsx`
  - [ ] 1.4 Define proper TypeScript interfaces for props
  - [ ] 1.5 Remove "use client" if possible (convert to Server Component)

- [ ] **Task 2: Fix wa.me link format** (AC: #2)
  - [ ] 2.1 Ensure link uses `https://wa.me/{country_code}{number}` format
  - [ ] 2.2 Validate phone number format (no spaces, no dashes, with country code)
  - [ ] 2.3 Add fallback behavior when WhatsApp URL not available
  - [ ] 2.4 Add `rel="noopener noreferrer"` and `target="_blank"` for security

- [ ] **Task 3: Add accessibility improvements** (AC: #1)
  - [ ] 3.1 Add proper aria-label to WhatsApp link ("Contact via WhatsApp")
  - [ ] 3.2 Add focus-visible styles
  - [ ] 3.3 Ensure 44x44px minimum touch target
  - [ ] 3.4 Add aria-hidden to decorative icon
  - [ ] 3.5 Ensure keyboard navigability

- [ ] **Task 4: Add component tests** (AC: #1, #2)
  - [ ] 4.1 Create `WhatsApp/__tests__/WhatsApp.test.tsx`
  - [ ] 4.2 Test: Renders WhatsApp link with wa.me format
  - [ ] 4.3 Test: Link has correct target="_blank" and rel attributes
  - [ ] 4.4 Test: Icon has aria-hidden
  - [ ] 4.5 Test: Component handles loading state
  - [ ] 4.6 Test: Component handles error state gracefully
  - [ ] 4.7 Test: Skeleton renders while loading

- [ ] **Task 5: Final Validation** (AC: #1, #2)
  - [ ] 5.1 Run `npm run lint` - PASS
  - [ ] 5.2 Run `npm run typecheck` - PASS
  - [ ] 5.3 Run `npm test` - PASS
  - [ ] 5.4 Manual: Click WhatsApp button → opens wa.me link
  - [ ] 5.5 Manual: Tab to WhatsApp link → focus visible
  - [ ] 5.6 Manual: Mobile test → opens WhatsApp app
  - [ ] 5.7 Manual: Desktop test → opens WhatsApp Web

---

## Dev Notes

### Previous Story Learnings (Story 5.1)

**APPLY THESE PATTERNS:**
- TypeScript migration pattern: index.tsx, Component.tsx, skeleton.tsx
- 44x44px minimum touch targets for mobile a11y
- aria-labels on interactive elements
- focus-visible styles with outline
- Graceful fallback when data not available (return null, log warning)
- Tests: rendering, accessibility, edge cases

**Retro Insight from 5.1:**
- Clipboard functionality is out of scope (Story 5.5)
- Keep story scope tight, document expectations that exceed AC

### Current State Analysis

**WhatsApp Component (JSX, needs TypeScript migration):**
```
src/ui/molecules/WhatsApp/
├── index.jsx         # Main component (Suspense wrapper)
├── Link.jsx          # Client component with WhatsApp link (uses useProfile)
├── Skeleton.jsx      # Loading state
└── styles.css        # Component styles
```

**Issues Found in Current Implementation:**

1. **Link.jsx is a Client Component ("use client")**
   - Uses `useProfile` hook to get WhatsApp URL
   - Consider if this can be server-rendered for SEO

2. **WhatsApp URL from profile data:**
   ```javascript
   const whatsappUrl = isLoading || isError || !profile ? "#" : profile.whatsapp || "#";
   ```
   - Falls back to "#" which is poor UX
   - Should hide the link or show disabled state

3. **No accessibility attributes:**
   - Missing aria-label on links
   - Icon not marked aria-hidden
   - No focus-visible styles

4. **No tests exist:**
   - No test files in `__tests__` folder

5. **Skeleton has typo:**
   - `whatspp_link` should be `whatsapp_link`

### Profile Domain (WhatsApp Source)

The WhatsApp URL comes from the profile domain:
```typescript
// Profile has whatsapp field
profile.whatsapp // e.g., "https://wa.me/5491122334455"
```

### wa.me Link Format

WhatsApp universal links use the format:
```
https://wa.me/<number>
```

Where `<number>` is the full phone number in international format:
- Country code (without +)
- Area code
- Phone number
- No spaces, dashes, or parentheses

Examples:
- Argentina: `https://wa.me/5491122334455`
- US: `https://wa.me/14155551234`

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/molecules/`, `@/icons/` |
| Atomic Design | WhatsApp in `molecules/` |
| Test convention | Tests in `__tests__/` folders |
| Accessibility | aria-labels, keyboard accessible, 44x44px touch targets |
| Client Components | May need to stay client-side due to useProfile hook |

### Testing Strategy

**WhatsApp Tests:**
- Renders WhatsApp link with correct wa.me URL
- Link has target="_blank" and rel="noopener noreferrer"
- Icon has aria-hidden="true"
- Link has proper aria-label
- Handles loading state (shows skeleton)
- Handles error state (graceful fallback)
- Link is keyboard accessible

### Related Files

```
src/domains/profile/           # Source of WhatsApp URL
├── queries/useProfile.ts      # Hook that provides profile data
└── model/schema.ts            # Profile schema with whatsapp field

src/ui/icons/                  # WhatsApp icon
└── WhatsAppIcon.tsx           # Icon component
```

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

- [ ] Navigate to contact section → WhatsApp button visible
- [ ] Click WhatsApp button → opens wa.me link in new tab
- [ ] URL format is `https://wa.me/{number}` (no spaces, with country code)
- [ ] Tab to WhatsApp link → focus visible with proper outline
- [ ] Press Enter on WhatsApp link → opens in new tab
- [ ] Mobile: tap WhatsApp button → opens WhatsApp app
- [ ] Desktop: click → opens WhatsApp Web
- [ ] Touch target is at least 44x44px
- [ ] When profile loading → shows skeleton
- [ ] When profile error → graceful fallback (no crash)

---

## References

- [Source: epics.md#Story 5.2] - Original acceptance criteria (FR19)
- [Source: 5-1-email-contact-access.md] - Previous story patterns
- [Source: src/ui/molecules/WhatsApp/] - Current implementation to migrate
- [Source: src/domains/profile/] - Profile domain with WhatsApp data
- [WhatsApp Click to Chat](https://faq.whatsapp.com/5913398998672934) - wa.me format docs

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
