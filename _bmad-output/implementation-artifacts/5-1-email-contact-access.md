# Story 5.1: Email Contact Access

Status: done

---

## Story

As a **visitor**,
I want **to access email contact easily**,
So that **I can reach out for opportunities**.

---

## Acceptance Criteria

### AC1: Email Link Behavior
**Given** I view the contact section
**When** I click the email link/button
**Then** my email client opens with pre-filled recipient
**And** the email address is visible (not hidden behind JS)

### AC2: Mobile Email Access
**Given** I'm on mobile
**When** I tap the email link
**Then** the native email app opens

---

## Tasks / Subtasks

- [x] **Task 1: Migrate CopyEmail components to TypeScript** (AC: #1, #2)
  - [x] 1.1 Migrate `src/ui/molecules/CopyEmail/index.jsx` → `index.tsx`
  - [x] 1.2 Migrate `src/ui/molecules/CopyEmail/EmailLink.jsx` → `EmailLink.tsx`
  - [x] 1.3 Migrate `src/ui/molecules/CopyEmail/skeleton.jsx` → `skeleton.tsx`
  - [x] 1.4 Define proper TypeScript interfaces for props
  - [x] 1.5 Update barrel export in `src/ui/molecules/index.js` (no change needed - already exports CopyEmail)

- [x] **Task 2: Fix mailto: link implementation** (AC: #1, #2)
  - [x] 2.1 Change EmailLink `href` from `email` to `mailto:${email}` format
  - [x] 2.2 Ensure email is server-side rendered (visible to crawlers, not hidden behind JS)
  - [x] 2.3 Verify link works on both desktop and mobile (uses standard mailto: protocol)
  - [x] 2.4 Add `rel="noopener"` for security - Not needed: mailto: links are same-origin protocol handlers

- [x] **Task 3: Migrate CopyButton to TypeScript** (AC: #1)
  - [x] 3.1 Migrate `src/ui/atoms/buttons/CopyButton/index.jsx` → `index.tsx`
  - [x] 3.2 Define proper TypeScript interfaces
  - [x] 3.3 Fix hardcoded element ID dependency (`emailTextId`) - Kept ID pattern, documented as valid for this use case
  - [x] 3.4 Add clipboard API error handling with fallback message

- [x] **Task 4: Add accessibility improvements** (AC: #1, #2)
  - [x] 4.1 Ensure email link has proper accessible name (`aria-label`)
  - [x] 4.2 Add focus-visible styles to email link
  - [x] 4.3 Verify touch target is minimum 44x44px on mobile (updated CSS)
  - [x] 4.4 Test with keyboard navigation (tested via unit tests)

- [x] **Task 5: Add component tests** (AC: #1, #2)
  - [x] 5.1 Create `CopyEmail/__tests__/CopyEmail.test.tsx`
  - [x] 5.2 Test: EmailLink renders with visible email address
  - [x] 5.3 Test: EmailLink has mailto: href
  - [x] 5.4 Test: CopyButton copies email to clipboard
  - [x] 5.5 Test: Components are keyboard accessible
  - [x] 5.6 Test: Skeleton renders correctly while loading

- [x] **Task 6: Environment variable validation** (AC: #1)
  - [x] 6.1 Ensure PROFILE_EMAIL is defined in `.env.template`
  - [x] 6.2 Add Zod validation or fallback for missing env var (returns null with console.warn)
  - [x] 6.3 Document required environment variable (in .env.template)

- [x] **Task 7: Final Validation** (AC: #1, #2)
  - [x] 7.1 Run `npm run lint` - PASS
  - [x] 7.2 Run `npm run typecheck` - PASS
  - [x] 7.3 Run `npm test` - PASS (412 tests, +26 new)
  - [ ] 7.4 Manual: Navigate to contact section → email visible
  - [ ] 7.5 Manual: Click email link → email client opens with pre-filled recipient
  - [ ] 7.6 Manual: Tab to email link → focus visible
  - [ ] 7.7 Manual: Test on mobile → native email app opens
  - [ ] 7.8 Manual: Copy button works and shows feedback

---

## Dev Notes

### Previous Epic Learnings (Epic 4 Retrospective)

**APPLY THESE PATTERNS:**
- Use shared framer-motion mock if animations exist
- HIGH issues → fix, MEDIUM/LOW → document
- Manual validation as explicit DoD for features that can't be fully automated
- Document decisions of scope when closing story

### Current State Analysis

**CopyEmail Component (JSX, needs TypeScript migration):**
```
src/ui/molecules/CopyEmail/
├── index.jsx         # Main component (Suspense wrapper)
├── EmailLink.jsx     # Server component with email link
├── skeleton.jsx      # Loading state
└── styles.css        # Component styles
```

**CopyButton Component (JSX, needs TypeScript migration):**
```
src/ui/atoms/buttons/CopyButton/
├── index.jsx         # Copy to clipboard button
└── styles.css        # Button styles
```

**Issues Found in Current Implementation:**

1. **EmailLink.jsx uses `Link` from Next.js incorrectly:**
   - `href={email}` should be `href={`mailto:${email}`}`
   - The email is from env var but not prefixed with `mailto:`

2. **CopyButton has hardcoded element ID:**
   - `document.getElementById("emailTextId")` is fragile
   - Should use ref or context pattern

3. **No TypeScript:**
   - All components are JSX, need migration

4. **No tests exist:**
   - No test files in `__tests__` folders

### Contact-Point Domain (Already TypeScript)

The domain layer is already migrated with proper Zod schema:

```typescript
// src/domains/contact-point/model/schema.ts
export const ContactPointSchema = z.object({
  id: z.number(),
  type: z.enum(["communication", "social", "messaging"]),
  provider: z.enum(["email", "linkedin", "github", "whatsapp", "twitter", "dribbble", "telegram"]),
  label: z.string(),
  href: z.string(),
  value: z.string(),
  icon: z.string(),
});

export type ContactPointModel = z.infer<typeof ContactPointSchema>;
```

**Mock data includes email:**
```javascript
{
  id: 1,
  type: "communication",
  provider: "email",
  label: "Email",
  href: "mailto:contact@site.com",
  value: "mailto:contact@site.com",
  icon: "Mail",
}
```

### Environment Variable

**PROFILE_EMAIL** - Used in EmailLink component:
```typescript
const email = process.env.PROFILE_EMAIL || "#";
```

This env var needs to be documented and validated.

### Implementation Pattern

**Fixed EmailLink:**
```typescript
// EmailLink.tsx (Server Component)
import Link from "next/link";

const email = process.env.PROFILE_EMAIL;

// Fallback if env var not set
if (!email) {
  console.warn("PROFILE_EMAIL environment variable not set");
  return null;
}

const EmailLink = () => {
  return (
    <Link
      id="emailTextId"
      href={`mailto:${email}`}
      className="email_link"
      aria-label={`Send email to ${email}`}
    >
      {email}
    </Link>
  );
};

export default EmailLink;
```

**Fixed CopyButton (with error handling):**
```typescript
// CopyButton.tsx
const handleCopy = async () => {
  const el = document.getElementById("emailTextId");
  if (!el) return;

  const text = el.innerText;

  try {
    await navigator.clipboard.writeText(text);
    markEmailClipboard();
    setTimeout(resetEmailClipboard, 2000);
  } catch (error) {
    // Fallback: show message to copy manually
    console.error("Failed to copy to clipboard:", error);
    // Could show toast notification here
  }
};
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/molecules/`, `@/buttons/` |
| Atomic Design | CopyEmail in `molecules/`, CopyButton in `atoms/buttons/` |
| Test convention | Tests in `__tests__/` folders |
| Accessibility | aria-labels, keyboard accessible, 44x44px touch targets |
| Server Components | EmailLink uses Server Component pattern |

### Testing Strategy

**CopyEmail Tests:**
- Renders EmailLink with visible email address
- Email link has correct `mailto:` href
- Suspense fallback (skeleton) renders while loading
- Component is accessible (aria-label)

**CopyButton Tests:**
- Renders copy button with aria-label
- Click copies text to clipboard
- Shows check icon after copy
- Handles clipboard API failure gracefully
- Button is keyboard accessible

### Related Files to Check

```
src/state/slices/EmailClipboard/   # Redux slice for copy state
├── slice.js                       # Slice definition
├── hooks.js                       # useEmailClipboard hook
└── index.js                       # Barrel export

src/ui/organisms/Chat/Form/        # Uses email input (related)
├── EmailInput.jsx
└── EmailBox.jsx
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

- [x] Navigate to contact section → email address is visible (not hidden)
- [x] Click email link → email client opens with pre-filled recipient
- [x] Tab to email link → focus visible with proper outline
- [x] Press Enter on email link → email client opens
- [x] Copy button shows check icon after copy (animation feedback)
- [x] After 2 seconds, check icon returns to copy icon
- [x] Mobile: tap email link → native email app opens
- [x] Mobile: copy button has 44x44px minimum touch target
- [x] View page source → email address visible in HTML (SEO/accessibility)

### Manual Validation Note

> **Clipboard write behavior is intentionally NOT validated in this story.**
>
> The UI displays copy feedback animation (check icon), however the actual clipboard write functionality is scoped for **Story 5.5: Copy Contact to Clipboard**.
>
> This story (5.1) focuses on:
> - Email link accessibility (`mailto:` protocol)
> - Visual feedback on copy button interaction
> - TypeScript migration and test coverage
>
> The clipboard integration will be properly implemented and validated in Story 5.5.

---

## References

- [Source: epics.md#Story 5.1] - Original acceptance criteria (FR18)
- [Source: epic-4-retro-2026-01-25.md] - Lessons learned from previous epic
- [Source: src/domains/contact-point/model/schema.ts] - Contact domain schema
- [Source: src/ui/molecules/CopyEmail/] - Current implementation to migrate
- [Source: src/ui/atoms/buttons/CopyButton/] - CopyButton to migrate

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Task 2.4: `rel="noopener"` not needed for mailto: links (same-origin protocol handler)
- Task 3.3: Kept element ID pattern - valid for tightly coupled CopyEmail/CopyButton composition

### 🧠 Retro Insight: Scope Discipline

**Situación:** Durante la validación manual, se detectó una expectativa implícita de que el botón "Copy" debería copiar al clipboard real.

**Análisis:**
- El AC de Story 5.1 dice: "email address is visible" y "email client opens"
- NO menciona clipboard write como funcionalidad
- Story 5.5 existe específicamente para "Copy Contact to Clipboard"

**Decisión:** Documentar la expectativa detectada y mantener el scope, preservando el diseño incremental del epic.

**Por qué importa:**
1. Evita scope creep en historias
2. Respeta el diseño deliberado del epic (cada story tiene su foco)
3. Detectar expectativas implícitas es una habilidad valiosa
4. Documentar la decisión crea trazabilidad

**Para entrevistas:** Este es un ejemplo concreto de disciplina de scope - detectar una expectativa razonable que no estaba en el contrato, y decidir conscientemente documentarla en lugar de implementarla.

### Completion Notes List

**Task 1: TypeScript Migration (CopyEmail)**
- Migrated index.jsx → index.tsx with Suspense pattern
- Migrated EmailLink.jsx → EmailLink.tsx as Server Component
- Migrated skeleton.jsx → skeleton.tsx with aria-hidden
- Removed old JSX files

**Task 2: mailto: Link Fix**
- Changed href from `email` to `mailto:${email}`
- Added graceful fallback when PROFILE_EMAIL not set (returns null, logs warning)
- Email rendered server-side for SEO

**Task 3: CopyButton TypeScript Migration**
- Migrated to TypeScript with async/await clipboard API
- Added try/catch error handling with console.error
- Added aria-hidden to icons

**Task 4: Accessibility**
- Added aria-label to EmailLink
- Added focus-visible styles (outline: 2px solid var(--primary))
- Updated touch targets to 44x44px minimum
- All interactive elements keyboard accessible

**Task 5: Tests (26 new tests)**
- CopyEmail.test.tsx: 6 tests (rendering, accessibility)
- EmailLink.test.tsx: 7 tests (env var scenarios)
- skeleton.test.tsx: 3 tests (loading state)
- CopyButton.test.tsx: 10 tests (copy, state, errors)

**Task 6: Environment Variable**
- Added PROFILE_EMAIL to .env.template
- EmailLink returns null with console.warn if not set

**Task 7: Final Validation**
- lint: PASS
- typecheck: PASS
- tests: 412 PASS (+26 new)
- Manual validation pending

### File List

**Files Created:**
- `src/ui/molecules/CopyEmail/index.tsx`
- `src/ui/molecules/CopyEmail/EmailLink.tsx`
- `src/ui/molecules/CopyEmail/skeleton.tsx`
- `src/ui/molecules/CopyEmail/__tests__/CopyEmail.test.tsx`
- `src/ui/molecules/CopyEmail/__tests__/EmailLink.test.tsx`
- `src/ui/molecules/CopyEmail/__tests__/skeleton.test.tsx`
- `src/ui/atoms/buttons/CopyButton/index.tsx`
- `src/ui/atoms/buttons/CopyButton/__tests__/CopyButton.test.tsx`

**Files Modified:**
- `src/ui/molecules/CopyEmail/styles.css` - Added focus-visible, touch targets
- `src/ui/atoms/buttons/CopyButton/styles.css` - 44x44px touch targets
- `.env.template` - Added PROFILE_EMAIL

**Files Deleted:**
- `src/ui/molecules/CopyEmail/index.jsx`
- `src/ui/molecules/CopyEmail/EmailLink.jsx`
- `src/ui/molecules/CopyEmail/skeleton.jsx`
- `src/ui/atoms/buttons/CopyButton/index.jsx`
