# Story 3.4: Certifications & Achievements

Status: review

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

- [x] **Task 1: Extend AcademicSchema for verification links** (AC: #1)
  - [x] 1.1 Add optional `verification_url` field to `src/domains/academic/model/schema.ts`
  - [x] 1.2 Add optional `type` field to distinguish "degree" vs "certification"
  - [x] 1.3 Update schema tests for new optional fields - 8 new tests (20 total)
  - [x] 1.4 Update mock data with verification URL for AWS certification

- [x] **Task 2: Update Education molecule for verification links** (AC: #1)
  - [x] 2.1 Add verification link rendering to `src/ui/molecules/Education/index.tsx`
  - [x] 2.2 Link opens in new tab with `rel="noopener noreferrer"`
  - [x] 2.3 Link is keyboard accessible (native anchor element)
  - [x] 2.4 Hide link if `verification_url` is undefined
  - [x] 2.5 Add unit tests for verification link behavior - 5 new tests (12 total)

- [x] **Task 3: Implement empty state handling in Academics organism** (AC: #2)
  - [x] 3.1 Update `src/ui/organisms/Academics/index.tsx` to conditionally render
  - [x] 3.2 Return `null` if academics array is empty (after loading)
  - [x] 3.3 Keep loading skeleton during fetch
  - [x] 3.4 Add unit tests for empty state behavior - 2 tests (9 total)

- [x] **Task 4: Final Validation** (AC: #1, #2)
  - [x] 4.1 Run `npm run lint` - PASS
  - [x] 4.2 Run `npm run typecheck` - PASS
  - [x] 4.3 Run `npm test` - PASS (304 tests)
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

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

1. **Task 1**: Extended AcademicSchema with `verification_url` (z.string().url().optional()) and `type` (z.enum(["degree", "certification"]).optional()). Added 8 new schema tests (20 total). Updated mock with AWS verification URL.
2. **Task 2**: Added verification link to Education molecule with target="_blank", rel="noopener noreferrer", and aria-label for accessibility. 5 new tests (12 total).
3. **Task 3**: Implemented graceful empty state in Academics organism - returns null when academics array is empty (after loading). 2 new tests (9 total).
4. **Task 4**: All automated validations pass (lint, typecheck, 304 tests). Manual validation pending.

### Additional Changes

- Updated `src/ui/organisms/__tests__/Sections.a11y.test.tsx` to provide mock data (empty array now returns null)
- Updated `src/ui/organisms/__tests__/a11y-axe.test.tsx` to provide mock data
- Added SVG motion elements (circle, path, g, rect, etc.) to `src/test-utils/framer-motion-mock.ts`
- Added `useReducedMotion` mock to existing a11y tests
- Added `framer-motion` mock to existing a11y tests

### Debug Log References

- None

### File List

**Modified Files:**
- `src/domains/academic/model/schema.ts` - Added verification_url and type fields
- `src/domains/academic/model/mock.ts` - Added verification_url and type to entries
- `src/domains/academic/model/__tests__/schema.test.ts` - Added 8 new tests
- `src/ui/molecules/Education/index.tsx` - Added verification link rendering
- `src/ui/molecules/Education/__tests__/Education.test.tsx` - Added 5 new tests
- `src/ui/organisms/Academics/index.tsx` - Added graceful empty state
- `src/ui/organisms/Academics/__tests__/Academics.test.tsx` - Updated empty state tests
- `src/ui/organisms/__tests__/Sections.a11y.test.tsx` - Updated mock, added framer-motion mock
- `src/ui/organisms/__tests__/a11y-axe.test.tsx` - Updated mock, added framer-motion mock
- `src/test-utils/framer-motion-mock.ts` - Added SVG motion elements
- `_bmad-output/implementation-artifacts/sprint-status.yaml` - Updated status
- `_bmad-output/implementation-artifacts/3-4-certifications-achievements.md` - Story file
