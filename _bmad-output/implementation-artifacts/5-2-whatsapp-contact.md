# Story 5.2: WhatsApp Contact

Status: in-progress

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

- [x] **Task 1: Migrate WhatsApp components to TypeScript** (AC: #1, #2)
  - [x] 1.1 Migrate `src/ui/molecules/WhatsApp/index.jsx` → `index.tsx`
  - [x] 1.2 Migrate `src/ui/molecules/WhatsApp/Link.jsx` → `Link.tsx`
  - [x] 1.3 Migrate `src/ui/molecules/WhatsApp/Skeleton.jsx` → `Skeleton.tsx`
  - [x] 1.4 Define proper TypeScript interfaces for props
  - [x] 1.5 Remove "use client" if possible - KEPT: useProfile hook requires client-side

- [x] **Task 2: Fix wa.me link format** (AC: #2)
  - [x] 2.1 Ensure link uses `https://wa.me/{country_code}{number}` format - Uses profile.whatsapp
  - [x] 2.2 Validate phone number format - Validated via Zod URL schema
  - [x] 2.3 Add fallback behavior when WhatsApp URL not available - Returns null (graceful)
  - [x] 2.4 Add `rel="noopener noreferrer"` and `target="_blank"` for security

- [x] **Task 3: Add accessibility improvements** (AC: #1)
  - [x] 3.1 Add proper aria-label to WhatsApp link ("Contact via WhatsApp")
  - [x] 3.2 Add focus-visible styles (outline-2 outline-primary)
  - [x] 3.3 Ensure 44x44px minimum touch target (w-11 h-11)
  - [x] 3.4 Add aria-hidden to decorative icon - Built into WhatsAppIcon
  - [x] 3.5 Ensure keyboard navigability - Standard link behavior

- [x] **Task 4: Add component tests** (AC: #1, #2) - TDD: Written BEFORE implementation
  - [x] 4.1 Create `WhatsApp/__tests__/WhatsApp.test.tsx`
  - [x] 4.2 Test: Renders WhatsApp link with wa.me format
  - [x] 4.3 Test: Link has correct target="_blank" and rel attributes
  - [x] 4.4 Test: Icon has aria-hidden
  - [x] 4.5 Test: Component handles loading state
  - [x] 4.6 Test: Component handles error state gracefully
  - [x] 4.7 Test: Skeleton renders while loading

- [x] **Task 5: Final Validation** (AC: #1, #2)
  - [x] 5.1 Run `npm run lint` - PASS
  - [x] 5.2 Run `npm run typecheck` - PASS
  - [x] 5.3 Run `npm test` - PASS (423 tests, +11 new)
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

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Task 1.5: "use client" kept because useProfile hook requires client-side rendering
- Task 3.4: WhatsAppIcon already has aria-hidden="true" built-in (line 11 of icon)

### 🐛 Regression Fix: iconMapping Missing WhatsApp PascalCase

**Síntoma:** WhatsApp button not rendering after migration. Console warning:
```
Icon "WhatsApp" not found in iconMapping
```

**Causa:** `SocialNetworkLink/Icon.jsx` iconMapping had `whatsapp` (lowercase) but data passes `WhatsApp` (PascalCase).

**Fix:** Added `WhatsApp: WhatsAppIcon` to iconMapping for consistency with other icons (GitHub/github, LinkedIn/linkedin).

**Lección:** Migraciones JSX → TSX necesitan verificar barrels y smoke tests post-migración.

### 📋 Scope Decision: Clipboard Functionality

**Decisión:** NO implementar clipboard real en Story 5.2.

**Razón:**
- AC de Story 5.2 dice "WhatsApp opens" - no menciona copy
- Story 5.5 existe específicamente: "Copy Contact to Clipboard"
- La UI puede mostrar feedback visual, pero la funcionalidad real es de Story 5.5

**Documentación:** Esto es disciplina de scope, no deuda escondida.

### TDD Approach Used

**RED Phase:**
- Created 11 tests BEFORE implementation
- Tests covered: rendering, wa.me format, link attributes, accessibility, loading/error states
- 4 tests failed as expected (aria-label, rel attribute, aria-hidden mock, broken href)

**GREEN Phase:**
- Migrated components to TypeScript
- Fixed all failing tests by implementing proper accessibility and link attributes
- Added whatsapp field to ProfileSchema

**REFACTOR Phase:**
- Updated CSS for 44x44px touch targets
- Added focus-visible styles

### Completion Notes List

**Task 1: TypeScript Migration**
- Migrated index.jsx → index.tsx with Suspense pattern
- Migrated Link.jsx → Link.tsx as Client Component (useProfile hook)
- Migrated Skeleton.jsx → Skeleton.tsx with aria-hidden
- Removed old JSX files

**Task 2: Link Format Fix**
- Changed fallback from href="#" to return null (graceful)
- Added rel="noopener noreferrer" for security
- URL format comes from profile.whatsapp (should be wa.me)

**Task 3: Accessibility**
- Added aria-label="Contact via WhatsApp" to both links
- Added focus-visible styles (outline-2 outline-primary)
- Updated touch targets to 44x44px (w-11 h-11)
- Icon already has aria-hidden built-in

**Task 4: Tests (11 new)**
- Created WhatsApp.test.tsx with TDD approach
- Tests: rendering, wa.me format, link attributes, accessibility, states
- All 11 tests passing

**Task 5: Validation**
- lint: PASS
- typecheck: PASS
- tests: 423 PASS (+11 new)
- Manual validation pending

### File List

**Files Created:**
- `src/ui/molecules/WhatsApp/index.tsx`
- `src/ui/molecules/WhatsApp/Link.tsx`
- `src/ui/molecules/WhatsApp/Skeleton.tsx`
- `src/ui/molecules/WhatsApp/__tests__/WhatsApp.test.tsx`

**Files Modified:**
- `src/domains/profile/model/schema.ts` - Added whatsapp field
- `src/ui/molecules/WhatsApp/styles.css` - Added focus-visible, touch targets
- `src/ui/molecules/SocialNetworkLink/Icon.jsx` - Added WhatsApp PascalCase to iconMapping

**Files Deleted:**
- `src/ui/molecules/WhatsApp/index.jsx`
- `src/ui/molecules/WhatsApp/Link.jsx`
- `src/ui/molecules/WhatsApp/Skeleton.jsx`
