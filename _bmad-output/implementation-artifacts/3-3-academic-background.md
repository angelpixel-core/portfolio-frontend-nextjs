# Story 3.3: Academic Background

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to view academic credentials**,
So that **I can verify the developer's educational background**.

---

## Acceptance Criteria

### AC1: Academic Data Display
**Given** I navigate to the education section (about page)
**When** academic data loads
**Then** I see degrees, institutions, and graduation dates
**And** academic domain is migrated to TypeScript with tests

### AC2: Responsive Layout
**Given** I view on any device
**When** the section renders
**Then** layout is responsive and readable
**And** all information is visible without horizontal scroll
**And** touch targets are at least 44x44px on mobile

---

## Tasks / Subtasks

- [ ] **Task 1: Create academic Zod schema** (AC: #1)
  - [ ] 1.1 Create `src/domains/academic/model/schema.ts` with AcademicSchema (file exists but needs Zod schema)
  - [ ] 1.2 Define fields: id, degree, institution, start_date, end_date, resume
  - [ ] 1.3 Export `Academic` type using `z.infer<typeof AcademicSchema>`
  - [ ] 1.4 Add unit tests for schema validation (5+ tests)

- [ ] **Task 2: Migrate mock data to TypeScript** (AC: #1)
  - [ ] 2.1 Convert `src/domains/academic/model/mock.js` → `mock.ts`
  - [ ] 2.2 Type mock data with Academic type
  - [ ] 2.3 Add test to validate mock data against schema

- [ ] **Task 3: Migrate academic domain model to TypeScript** (AC: #1)
  - [ ] 3.1 Convert `src/domains/academic/model/index.js` → `index.ts`
  - [ ] 3.2 Add Zod validation in fetchAll method
  - [ ] 3.3 Update domain index exports

- [ ] **Task 4: Migrate useAcademics hook to TypeScript** (AC: #1)
  - [ ] 4.1 Convert `src/domains/academic/queries/useAcademics.js` → `useAcademics.ts`
  - [ ] 4.2 Fix deprecated `cacheTime` → `gcTime` in React Query (CRITICAL)
  - [ ] 4.3 Add proper TypeScript types for return value
  - [ ] 4.4 Add unit tests for hook (loading, success, error states)

- [ ] **Task 5: Align Education molecule with new schema** (AC: #1, #2)
  - [ ] 5.1 Update `src/ui/molecules/Education/index.tsx` props to match new AcademicSchema
  - [ ] 5.2 Remove old EducationModel interface (replace with Academic type)
  - [ ] 5.3 Simplify component to display: degree, institution, time period, resume
  - [ ] 5.4 Remove infoToString complex logic (no longer needed with simplified schema)
  - [ ] 5.5 Add unit tests for Education molecule (5+ tests)

- [ ] **Task 6: Migrate Academics organism to TypeScript** (AC: #1, #2)
  - [ ] 6.1 Convert `src/ui/organisms/Academics/index.jsx` → `index.tsx`
  - [ ] 6.2 Use stable keys (`academic.id`) instead of array index
  - [ ] 6.3 Add aria-labels for accessibility (section aria-label)
  - [ ] 6.4 Add loading skeleton component usage
  - [ ] 6.5 Add unit tests for Academics organism (5+ tests)

- [ ] **Task 7: Final Validation** (AC: #1, #2)
  - [ ] 7.1 Run `npm run lint` - PASS required
  - [ ] 7.2 Run `npm run typecheck` - PASS required
  - [ ] 7.3 Run `npm test` - PASS required
  - [ ] 7.4 Manual: Navigate to /about → education section visible
  - [ ] 7.5 Manual: 2 education entries displayed (BS Information Systems, AWS Practitioner)
  - [ ] 7.6 Manual: Mobile view → layout adapts, content readable
  - [ ] 7.7 Manual: Screen reader announces section and entries correctly

---

## Dev Notes

### Previous Story Learnings (Stories 3.1, 3.2)

**CRITICAL - Apply these patterns:**
- Use `gcTime` instead of deprecated `cacheTime` in React Query
- Use stable keys (`academic.id`) instead of array index
- Add `rel="noopener noreferrer"` to external links
- Use shared framer-motion mock in tests: `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))`
- Export types from domain index file
- Add aria-label to section element

### Current Code Analysis

**IMPORTANT - Schema Mismatch Detected:**

The current `schema.ts` has a complex interface that doesn't match the mock data:

```typescript
// CURRENT schema.ts (COMPLEX - not matching mock)
export interface EducationModel {
  id: string;
  type: string;           // Ej: "Bachelor's Degree"
  time: string;           // Ej: "2016 - 2020"
  place: string;          // Ej: "University of Buenos Aires"
  info: EducationInfo[] | string;  // Complex nested structure
}
```

```typescript
// CURRENT mock.js (SIMPLE - actual data structure)
{
  id: 1,
  degree: "Bachelor Of Science in Information Systems",
  institution: "La Plata, Argentina (MIT)",
  start_date: "March 2013",
  end_date: "Dec 2017",
  resume: "The program equips individuals..."
}
```

**DECISION:** Align schema with mock data (simple structure). The complex `EducationInfo` structure is unused.

### Target Schema (Zod)

```typescript
// src/domains/academic/model/schema.ts
import { z } from "zod";

export const AcademicSchema = z.object({
  id: z.number(),
  degree: z.string(),
  institution: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  resume: z.string().optional(),
});

export const AcademicsSchema = z.array(AcademicSchema);

export type Academic = z.infer<typeof AcademicSchema>;
export type Academics = z.infer<typeof AcademicsSchema>;
```

### Target Component Structure

```tsx
// src/ui/molecules/Education/index.tsx
import { TransitionerLi } from "@/atoms/hocs";
import type { Academic } from "@/domains/academic";

interface EducationProps {
  id: number;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
  resume?: string;
}

const Education = ({ degree, institution, start_date, end_date, resume }: EducationProps) => {
  const time = `${start_date} - ${end_date}`;

  return (
    <TransitionerLi data={resume || ""}>
      <h3 className="education_title">{degree}</h3>
      <span className="education_history-info">
        {time} | {institution}
      </span>
    </TransitionerLi>
  );
};
```

```tsx
// src/ui/organisms/Academics/index.tsx
import { History } from "@/atoms/hocs";
import { Education } from "@/molecules";
import { useAcademics } from "@/domains/academic";

const Academics = () => {
  const { data: academics = [], isLoading, isError } = useAcademics();

  // ... loading/error handling

  return (
    <section
      className="academics-container"
      aria-labelledby="academics-heading"
      aria-label="Educational background"
    >
      <h2 id="academics-heading" className="academics-title">Education</h2>
      <History>
        {academics.map((academic) => (
          <Education key={academic.id} {...academic} />
        ))}
      </History>
    </section>
  );
};
```

### Mock Data (Already Exists)

```typescript
// src/domains/academic/model/mock.ts
const academicsMock: Academic[] = [
  {
    id: 1,
    degree: "Bachelor Of Science in Information Systems",
    institution: "La Plata, Argentina (MIT)",
    start_date: "March 2013",
    end_date: "Dec 2017",
    resume: "The program equips individuals to lead software projects and develop information systems.",
  },
  {
    id: 2,
    degree: "Cloud Platform Practitioner",
    institution: "Amazon Web Services",
    start_date: "Nov 2020",
    end_date: "Dec 2020",
    resume: "Certification covering AWS cloud principles, management, and architectural practices.",
  },
];
```

### File Changes Expected

```
src/domains/academic/
├── model/
│   ├── schema.ts           (REWRITE - replace interfaces with Zod schema)
│   ├── mock.ts             (RENAME from .js, add types)
│   ├── index.ts            (RENAME from .js, add Zod validation)
│   └── __tests__/
│       └── schema.test.ts  (CREATE - schema validation tests)
├── queries/
│   ├── useAcademics.ts     (RENAME from .js, fix gcTime, add types)
│   └── __tests__/
│       └── useAcademics.test.ts (CREATE - hook tests)
└── index.ts                (EXISTS - may need export updates)

src/ui/molecules/Education/
├── index.tsx               (EXISTS - update props, simplify logic)
├── styles.css              (EXISTS - no changes expected)
└── __tests__/
    └── Education.test.tsx  (CREATE - molecule tests)

src/ui/organisms/Academics/
├── index.tsx               (RENAME from .jsx, add types, stable keys)
├── skeleton.jsx            (EXISTS - consider .tsx migration if time permits)
├── styles.css              (EXISTS - no changes expected)
└── __tests__/
    └── Academics.test.tsx  (CREATE - organism tests)
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx`/`.ts` files |
| Path aliases | Use `@/domains/`, `@/atoms/`, `@/molecules/` |
| Zod inference | `type Academic = z.infer<typeof AcademicSchema>` |
| React Query | Use `gcTime` (NOT `cacheTime`) |
| Accessibility | `aria-labelledby`, `aria-label` on section |
| Test convention | Tests in `__tests__/` folders |
| Framer motion mock | Use shared mock from `@/test-utils/framer-motion-mock` |

### Testing Strategy

**Schema Tests (5+ tests):**
- Valid academic entry parses correctly
- Invalid id (string instead of number) fails
- Missing required fields fail validation
- Optional resume field handles undefined
- Array of academics validates correctly

**Hook Tests (4+ tests):**
- Returns loading state initially
- Returns data on successful fetch
- Returns error state on fetch failure
- Uses gcTime instead of cacheTime

**Education Molecule Tests (5+ tests):**
- Renders degree correctly
- Renders institution correctly
- Renders time period correctly
- Renders resume in TransitionerLi
- Handles missing resume gracefully

**Academics Organism Tests (5+ tests):**
- Shows loading state
- Shows error state
- Renders all academics on success
- Uses stable keys (academic.id)
- Has proper accessibility attributes

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
- [ ] 2 education entries displayed
- [ ] First entry: "Bachelor Of Science in Information Systems"
- [ ] Second entry: "Cloud Platform Practitioner" (AWS certification)
- [ ] Time periods displayed correctly (e.g., "March 2013 - Dec 2017")
- [ ] Mobile view (< 768px) → content readable
- [ ] Screen reader: Section announced as "Educational background"
- [ ] Keyboard: Tab through section works

---

## References

- [Source: epics.md#Story 3.3] - Original acceptance criteria (FR12)
- [Source: 3-1-work-history-timeline.md] - Job-experience migration pattern
- [Source: 3-2-role-details-responsibilities.md] - Previous story learnings
- [Source: src/domains/academic/model/mock.js] - Actual data structure
- [Source: src/ui/molecules/Education/index.tsx] - Current component
- [Source: src/ui/organisms/Academics/index.jsx] - Current organism

---

## Dev Agent Record

### Agent Model Used

(To be filled after implementation)

### Completion Notes List

(To be filled after implementation)

### Debug Log References

(To be filled if needed)
