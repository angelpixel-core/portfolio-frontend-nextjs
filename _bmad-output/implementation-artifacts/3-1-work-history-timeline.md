# Story 3.1: Work History Timeline

Status: ready-for-dev

---

## Story

As a **visitor**,
I want **to view a professional work history timeline**,
So that **I can understand the developer's career progression**.

---

## Acceptance Criteria

### AC1: Timeline Display
**Given** I navigate to the experience section (about page)
**When** the work history loads
**Then** I see jobs displayed in reverse chronological order
**And** each job shows company, role, and dates
**And** job-experience domain is migrated to TypeScript

### AC2: Mobile Responsive Timeline
**Given** the timeline renders
**When** I view on mobile (< 768px)
**Then** the timeline adapts to vertical layout
**And** all information remains readable
**And** touch targets are at least 44x44px

---

## Tasks / Subtasks

- [ ] **Task 1: Create job-experience Zod schema** (AC: #1)
  - [ ] 1.1 Create `src/domains/job-experience/model/schema.ts` with JobExperienceSchema
  - [ ] 1.2 Define fields: id, position, company, companyLink, time, address, work (array of tasks)
  - [ ] 1.3 Export `JobExperience` type using `z.infer<typeof JobExperienceSchema>`
  - [ ] 1.4 Add unit tests for schema validation (5+ tests)

- [ ] **Task 2: Create mock data from backend.rb structure** (AC: #1)
  - [ ] 2.1 Update `src/domains/job-experience/model/mock.js` → `mock.ts`
  - [ ] 2.2 Populate with 6 job experiences matching backend.rb structure:
    - Consulting Service (Feb 2023 - Dec 2023)
    - Compass (Dec 2021 - Aug 2022)
    - SouthWorks (May 2020 - Sept 2021)
    - Nubi (Sept 2019 - May 2020)
    - Bitex (Dec 2017 - May 2019)
    - UNLP (Sept 2014 - May 2015)
  - [ ] 2.3 Include work/tasks array for each experience

- [ ] **Task 3: Migrate job-experience domain to TypeScript** (AC: #1)
  - [ ] 3.1 Convert `src/domains/job-experience/model/index.js` → `index.ts`
  - [ ] 3.2 Add Zod validation in fetchAll method
  - [ ] 3.3 Convert `src/domains/job-experience/queries/useJobExperiences.js` → `useJobExperiences.ts`
  - [ ] 3.4 Fix deprecated `cacheTime` → `gcTime` in React Query
  - [ ] 3.5 Update domain index exports

- [ ] **Task 4: Migrate Experience molecule to TypeScript** (AC: #1, #2)
  - [ ] 4.1 Convert `src/ui/molecules/Experience/index.jsx` → `index.tsx`
  - [ ] 4.2 Define ExperienceProps interface
  - [ ] 4.3 Add `rel="noopener noreferrer"` to company link
  - [ ] 4.4 Ensure keyboard accessibility on link

- [ ] **Task 5: Migrate Experiences organism to TypeScript** (AC: #1, #2)
  - [ ] 5.1 Convert `src/ui/organisms/Experiences/index.jsx` → `index.tsx`
  - [ ] 5.2 Use typed hook and components
  - [ ] 5.3 Use stable keys (experience.id or company+position) instead of array index
  - [ ] 5.4 Add aria-labels for accessibility

- [ ] **Task 6: Verify History component (scroll progress)** (AC: #2)
  - [ ] 6.1 Review `src/ui/atoms/hocs/History/index.jsx` - already implements scroll progress
  - [ ] 6.2 Verify mobile responsiveness of progress bar
  - [ ] 6.3 Test with real data to confirm animation works
  - [ ] 6.4 Document any alignment adjustments needed (LOW priority debt)

- [ ] **Task 7: Create unit tests** (AC: #1, #2)
  - [ ] 7.1 Test JobExperienceSchema validation (5 tests)
  - [ ] 7.2 Test useJobExperiences hook (mock data, loading, error states)
  - [ ] 7.3 Test Experience molecule renders correctly
  - [ ] 7.4 Test Experiences organism with mock data

- [ ] **Task 8: Final Validation** (AC: #1, #2)
  - [ ] 8.1 Run `npm run lint` - PASS
  - [ ] 8.2 Run `npm run typecheck` - PASS
  - [ ] 8.3 Run `npm test` - PASS
  - [ ] 8.4 Manual: Navigate to /about → experiences section visible
  - [ ] 8.5 Manual: 6 job entries displayed in reverse chronological order
  - [ ] 8.6 Manual: Scroll progress bar animates on scroll
  - [ ] 8.7 Manual: Mobile view (< 768px) → timeline adapts
  - [ ] 8.8 Manual: Company links open in new tab

---

## Dev Notes

### Previous Story Learnings (Epic 2)

**Apply these patterns:**
- Use `gcTime` instead of deprecated `cacheTime` in React Query
- Handle optional fields with conditional rendering
- Use proper Zod types in tests (not inline types)
- Use stable keys (id or compound key) instead of array index
- Always add `rel="noopener noreferrer"` to external links
- Export new components from molecule/organism index files

**Code Review fixes to remember:**
- Use React's `cache()` for data deduplication if needed
- Underscore prefix for unused type params: `(_param: Type) => void`

### Existing Components Analysis

**History Component (Timeline with Scroll Progress)** - `src/ui/atoms/hocs/History/`
```jsx
// ALREADY IMPLEMENTED - vertical scroll progress indicator
import { motion, useScroll } from "framer-motion";

const History = ({ children }) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <div ref={ref} className="history-container">
      <motion.div style={{ scaleY: scrollYProgress }} className="history_progress-bar" />
      <ul className="history_list-grid">{children}</ul>
    </div>
  );
};
```

**Experience Molecule** - `src/ui/molecules/Experience/`
```jsx
// Current structure - needs TypeScript migration
const Experience = ({ position, company, companyLink, time, address, work }) => {
  return (
    <TransitionerLi data={work}>
      <h3>{position} <a href={companyLink}>@{company}</a></h3>
      <span>{time} | {address}</span>
    </TransitionerLi>
  );
};
```

**Experiences Organism** - `src/ui/organisms/Experiences/`
- Already uses `useJobExperiences` hook
- Already wraps items in `History` component
- Needs TypeScript migration and stable keys

### Backend Data Structure (from docs/seeds/backend.rb)

```ruby
# Site::Customer with Site::Experience
[
  name,           # "Compass"
  company_type,   # "Real Estate Brokerage"
  url,            # "https://compass.com"
  address,        # "New York, United States"
  avatar_url,
  experiences: [
    [
      position,   # "FullStack Engineer"
      start_date, # "Dec 2021"
      end_date,   # "Aug 2022"
      tasks: [
        [outcome, [tags]]
      ]
    ]
  ]
]
```

### Target Schema (TypeScript)

```typescript
// src/domains/job-experience/model/schema.ts
import { z } from "zod";

export const JobExperienceTaskSchema = z.object({
  description: z.string(),
  tags: z.array(z.string()).optional(),
});

export const JobExperienceSchema = z.object({
  id: z.number(),
  position: z.string(),
  company: z.string(),
  companyLink: z.string().url(),
  time: z.string(), // "Dec 2021 - Aug 2022" format
  address: z.string(),
  work: z.array(JobExperienceTaskSchema).optional(),
});

export type JobExperienceTask = z.infer<typeof JobExperienceTaskSchema>;
export type JobExperience = z.infer<typeof JobExperienceSchema>;
```

### Mock Data Structure (Target)

```typescript
// src/domains/job-experience/model/mock.ts
import type { JobExperience } from "./schema";

const jobExperiencesMock: JobExperience[] = [
  {
    id: 1,
    position: "Independant",
    company: "Consulting Service",
    companyLink: "https://site.dev",
    time: "Feb 2023 - Dec 2023",
    address: "Remote",
    work: [
      {
        description: "I collaborated with CTOs, Product Owners...",
        tags: ["collaboration", "CTOs", "Product Owners"]
      }
    ]
  },
  // ... 5 more entries
];

export default jobExperiencesMock;
```

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | New files in `.ts/.tsx` |
| Path aliases | Use `@/domains/`, `@/ui/`, `@/hooks` |
| Zod validation | Schema with `z.infer<>` types |
| React Query | `gcTime` (not `cacheTime`) |
| Test convention | Tests in `__tests__/` folder |
| Keyboard accessibility | Links with proper ARIA |

### File Structure After Implementation

```
src/domains/job-experience/
├── model/
│   ├── schema.ts          (NEW - Zod schema)
│   ├── mock.ts            (MIGRATE from .js)
│   ├── index.ts           (MIGRATE from .js)
│   └── __tests__/
│       └── schema.test.ts (NEW)
├── queries/
│   ├── useJobExperiences.ts (MIGRATE from .js)
│   ├── index.ts           (existing)
│   └── __tests__/
│       └── useJobExperiences.test.ts (NEW)
└── index.ts               (existing)

src/ui/molecules/Experience/
├── index.tsx              (MIGRATE from .jsx)
├── skeleton.jsx           (existing)
├── styles.css             (existing)
└── __tests__/
    └── Experience.test.tsx (NEW)

src/ui/organisms/Experiences/
├── index.tsx              (MIGRATE from .jsx)
├── skeleton.jsx           (existing)
├── styles.css             (existing)
└── __tests__/
    └── Experiences.test.tsx (NEW)
```

---

## Testing Requirements

### Validation Commands

```bash
npm run lint          # ESLint check
npm run typecheck     # TypeScript check
npm test              # Jest unit tests
```

### Test Coverage Expected

| File | Test Type | Location |
|------|-----------|----------|
| `schema.ts` | Unit | `model/__tests__/schema.test.ts` |
| `useJobExperiences.ts` | Hook | `queries/__tests__/useJobExperiences.test.ts` |
| `Experience/index.tsx` | Component | `Experience/__tests__/Experience.test.tsx` |
| `Experiences/index.tsx` | Organism | `Experiences/__tests__/Experiences.test.tsx` |

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] Navigate to /about → experiences section is visible
- [ ] 6 job experiences displayed
- [ ] Entries in reverse chronological order (newest first)
- [ ] Each entry shows: position, company, dates, address
- [ ] Company links open in new tab
- [ ] Scroll progress bar animates on scroll
- [ ] Mobile view (< 768px) → layout adapts
- [ ] Keyboard: Tab navigates through company links
- [ ] Screen reader: Section has proper heading structure

---

## References

- [Source: epics.md#Story 3.1] - Original acceptance criteria
- [Source: architecture.md#TypeScript Migration] - Migration patterns
- [Source: 2-4-project-filtering-by-technology.md] - Previous story patterns
- [Source: docs/seeds/backend.rb] - Work history data structure
- [Source: src/ui/atoms/hocs/History/index.jsx] - Existing timeline component
- [Source: src/ui/organisms/Experiences/index.jsx] - Current experiences organism
- [Source: src/domains/job-experience/] - Current domain structure

---

## Dev Agent Record

### Agent Model Used

(To be filled by dev agent)

### Completion Notes List

(To be filled by dev agent)

### File List

(To be filled by dev agent)
