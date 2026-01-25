# Story 3.4: Certifications & Achievements

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to see certifications and achievements**,
So that **I can verify specialized skills**.

---

## Acceptance Criteria

### AC1: Certification Display with Verification Links
**Given** I view the credentials section
**When** certifications exist
**Then** I see certification name, issuer, and date
**And** verification links open in new tabs (if available)
**And** links have `rel="noopener noreferrer"`

### AC2: Graceful Empty State
**Given** no certifications exist
**When** the section would render
**Then** the section is gracefully hidden
**And** no error occurs

---

## Tasks / Subtasks

- [ ] **Task 1: Extend AcademicSchema for verification links** (AC: #1)
  - [ ] 1.1 Add optional `verification_url` field to `src/domains/academic/model/schema.ts`
  - [ ] 1.2 Add optional `type` field to distinguish "degree" vs "certification"
  - [ ] 1.3 Update schema tests for new optional fields
  - [ ] 1.4 Update mock data with verification URL for AWS certification

- [ ] **Task 2: Update Education molecule for verification links** (AC: #1)
  - [ ] 2.1 Add verification link rendering to `src/ui/molecules/Education/index.tsx`
  - [ ] 2.2 Link opens in new tab with `rel="noopener noreferrer"`
  - [ ] 2.3 Link is keyboard accessible
  - [ ] 2.4 Hide link if `verification_url` is undefined
  - [ ] 2.5 Add unit tests for verification link behavior

- [ ] **Task 3: Implement empty state handling in Academics organism** (AC: #2)
  - [ ] 3.1 Update `src/ui/organisms/Academics/index.tsx` to conditionally render
  - [ ] 3.2 Return `null` if academics array is empty (after loading)
  - [ ] 3.3 Keep loading skeleton during fetch
  - [ ] 3.4 Add unit tests for empty state behavior

- [ ] **Task 4: Final Validation** (AC: #1, #2)
  - [ ] 4.1 Run `npm run lint` - PASS
  - [ ] 4.2 Run `npm run typecheck` - PASS
  - [ ] 4.3 Run `npm test` - PASS
  - [ ] 4.4 Manual: Navigate to /about → education section visible
  - [ ] 4.5 Manual: AWS certification shows verification link (if added)
  - [ ] 4.6 Manual: Click verification link → opens new tab
  - [ ] 4.7 Manual: Empty academics array → section hidden

---

## Dev Notes

### Previous Story Learnings (Story 3.3)

**CRITICAL - Apply these patterns:**
- Use `gcTime` instead of deprecated `cacheTime` in React Query
- Use stable keys (`academic.id`) instead of array index
- Add `rel="noopener noreferrer"` to external links
- Use shared framer-motion mock in tests: `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))`
- Export types from domain index file
- Add aria-label to section element

### Current State Analysis

**Schema (already migrated in Story 3.3):**
```typescript
// src/domains/academic/model/schema.ts
export const AcademicSchema = z.object({
  id: z.number(),
  degree: z.string(),
  institution: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  resume: z.string().optional(),
});
```

**Mock Data (already has certification):**
```typescript
// src/domains/academic/model/mock.ts
{
  id: 2,
  degree: "Cloud Platform Practitioner",
  institution: "Amazon Web Services",
  start_date: "Nov 2020",
  end_date: "Dec 2020",
  resume: "Certification covering AWS cloud principles..."
}
```

### Target Schema Extension

```typescript
// src/domains/academic/model/schema.ts
export const AcademicSchema = z.object({
  id: z.number(),
  degree: z.string(),
  institution: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  resume: z.string().optional(),
  verification_url: z.string().url().optional(),  // NEW: verification link
  type: z.enum(["degree", "certification"]).optional(),  // NEW: type distinction
});
```

### Target Education Component Update

```tsx
// src/ui/molecules/Education/index.tsx
const Education = ({
  degree, institution, start_date, end_date, resume, verification_url
}: EducationProps) => {
  const time = `${start_date} - ${end_date}`;

  return (
    <TransitionerLi data={resume || ""}>
      <h3 className="education_title">{degree}</h3>
      <span className="education_history-info">
        {time} | {institution}
      </span>
      {verification_url && (
        <a
          href={verification_url}
          target="_blank"
          rel="noopener noreferrer"
          className="education_verification-link"
          aria-label={`Verify ${degree} certification`}
        >
          Verify credential
        </a>
      )}
    </TransitionerLi>
  );
};
```

### Target Academics Empty State

```tsx
// src/ui/organisms/Academics/index.tsx
const Academics = () => {
  const { data: academics = [], isLoading, isError } = useAcademics();

  // Show loading skeleton during fetch
  if (isLoading) {
    return <AcademicsSkeleton />;
  }

  // Gracefully hide section if no academics
  if (!academics.length) {
    return null;
  }

  // ... rest of component
};
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/domains/`, `@/atoms/`, `@/molecules/` |
| Zod inference | `type Academic = z.infer<typeof AcademicSchema>` |
| React Query | Use `gcTime` (NOT `cacheTime`) |
| Accessibility | `rel="noopener noreferrer"`, `aria-label` on links |
| Test convention | Tests in `__tests__/` folders |
| Framer motion mock | Use shared mock from `@/test-utils/framer-motion-mock` |

### Testing Strategy

**Schema Tests (add 3+ tests):**
- Valid entry with verification_url parses correctly
- Invalid verification_url (not a URL) fails
- Optional type field handles undefined

**Education Molecule Tests (add 3+ tests):**
- Renders verification link when provided
- Hides verification link when undefined
- Link has correct attributes (target, rel, aria-label)

**Academics Organism Tests (add 2+ tests):**
- Returns null when academics array is empty
- Shows skeleton during loading, null after empty load

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

- [ ] Navigate to /about → education section visible
- [ ] AWS certification displays correctly
- [ ] Verification link visible (if added to mock)
- [ ] Click verification link → opens new tab
- [ ] Link has `rel="noopener noreferrer"` (inspect element)
- [ ] Empty academics test → section hidden (modify mock temporarily)
- [ ] Mobile view → links are tappable (44x44px touch target)
- [ ] Keyboard: Tab to verification link works
- [ ] Screen reader: Link announced with aria-label

---

## References

- [Source: epics.md#Story 3.4] - Original acceptance criteria (FR13)
- [Source: 3-3-academic-background.md] - Previous story patterns and learnings
- [Source: src/domains/academic/model/schema.ts] - Current schema to extend
- [Source: src/ui/molecules/Education/index.tsx] - Component to update
- [Source: src/ui/organisms/Academics/index.tsx] - Organism to update

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Completion Notes List

### Debug Log References

### File List
