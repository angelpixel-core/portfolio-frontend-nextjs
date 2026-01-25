# Story 5.1: Email Contact Access

Status: ready-for-dev

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

- [ ] **Task 1: Migrate CopyEmail components to TypeScript** (AC: #1, #2)
  - [ ] 1.1 Migrate `src/ui/molecules/CopyEmail/index.jsx` → `index.tsx`
  - [ ] 1.2 Migrate `src/ui/molecules/CopyEmail/EmailLink.jsx` → `EmailLink.tsx`
  - [ ] 1.3 Migrate `src/ui/molecules/CopyEmail/skeleton.jsx` → `skeleton.tsx`
  - [ ] 1.4 Define proper TypeScript interfaces for props
  - [ ] 1.5 Update barrel export in `src/ui/molecules/index.js`

- [ ] **Task 2: Fix mailto: link implementation** (AC: #1, #2)
  - [ ] 2.1 Change EmailLink `href` from `email` to `mailto:${email}` format
  - [ ] 2.2 Ensure email is server-side rendered (visible to crawlers, not hidden behind JS)
  - [ ] 2.3 Verify link works on both desktop and mobile
  - [ ] 2.4 Add `rel="noopener"` for security (external link pattern)

- [ ] **Task 3: Migrate CopyButton to TypeScript** (AC: #1)
  - [ ] 3.1 Migrate `src/ui/atoms/buttons/CopyButton/index.jsx` → `index.tsx`
  - [ ] 3.2 Define proper TypeScript interfaces
  - [ ] 3.3 Fix hardcoded element ID dependency (`emailTextId`)
  - [ ] 3.4 Add clipboard API error handling with fallback message

- [ ] **Task 4: Add accessibility improvements** (AC: #1, #2)
  - [ ] 4.1 Ensure email link has proper accessible name
  - [ ] 4.2 Add focus-visible styles to email link
  - [ ] 4.3 Verify touch target is minimum 44x44px on mobile
  - [ ] 4.4 Test with keyboard navigation

- [ ] **Task 5: Add component tests** (AC: #1, #2)
  - [ ] 5.1 Create `CopyEmail/__tests__/CopyEmail.test.tsx`
  - [ ] 5.2 Test: EmailLink renders with visible email address
  - [ ] 5.3 Test: EmailLink has mailto: href
  - [ ] 5.4 Test: CopyButton copies email to clipboard
  - [ ] 5.5 Test: Components are keyboard accessible
  - [ ] 5.6 Test: Skeleton renders correctly while loading

- [ ] **Task 6: Environment variable validation** (AC: #1)
  - [ ] 6.1 Ensure PROFILE_EMAIL is defined in `.env.local` example
  - [ ] 6.2 Add Zod validation or fallback for missing env var
  - [ ] 6.3 Document required environment variable

- [ ] **Task 7: Final Validation** (AC: #1, #2)
  - [ ] 7.1 Run `npm run lint` - PASS
  - [ ] 7.2 Run `npm run typecheck` - PASS
  - [ ] 7.3 Run `npm test` - PASS
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

- [ ] Navigate to contact section → email address is visible (not hidden)
- [ ] Click email link → email client opens with pre-filled recipient
- [ ] Tab to email link → focus visible with proper outline
- [ ] Press Enter on email link → email client opens
- [ ] Click copy button → email copied to clipboard
- [ ] Copy button shows check icon after copy
- [ ] After 2 seconds, check icon returns to copy icon
- [ ] Mobile: tap email link → native email app opens
- [ ] Mobile: copy button has 44x44px minimum touch target
- [ ] View page source → email address visible in HTML (SEO/accessibility)

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

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
