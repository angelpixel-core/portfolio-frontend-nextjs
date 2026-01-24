# Story 3.1: Work History Timeline

Status: review

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

- [x] **Task 1: Create job-experience Zod schema** (AC: #1)
  - [x] 1.1 Create `src/domains/job-experience/model/schema.ts` with JobExperienceSchema
  - [x] 1.2 Define fields: id, position, company, companyLink, time, address, work (array of tasks)
  - [x] 1.3 Export `JobExperience` type using `z.infer<typeof JobExperienceSchema>`
  - [x] 1.4 Add unit tests for schema validation (5+ tests) - 11 tests created

- [x] **Task 2: Create mock data from backend.rb structure** (AC: #1)
  - [x] 2.1 Update `src/domains/job-experience/model/mock.js` → `mock.ts`
  - [x] 2.2 Populate with 6 job experiences matching backend.rb structure:
    - Consulting Service (Feb 2023 - Dec 2023)
    - Compass (Dec 2021 - Aug 2022)
    - SouthWorks (May 2020 - Sept 2021)
    - Nubi (Sept 2019 - May 2020)
    - Bitex (Dec 2017 - May 2019)
    - UNLP (Sept 2014 - May 2015)
  - [x] 2.3 Include work/tasks array for each experience
  - [x] 2.4 Added test to validate mock data against schema (12 tests total)

- [x] **Task 3: Migrate job-experience domain to TypeScript** (AC: #1)
  - [x] 3.1 Convert `src/domains/job-experience/model/index.js` → `index.ts`
  - [x] 3.2 Add Zod validation in fetchAll method
  - [x] 3.3 Convert `src/domains/job-experience/queries/useJobExperiences.js` → `useJobExperiences.ts`
  - [x] 3.4 Fix deprecated `cacheTime` → `gcTime` in React Query
  - [x] 3.5 Update domain index exports (re-exports types from model)

- [x] **Task 4: Migrate Experience molecule to TypeScript** (AC: #1, #2)
  - [x] 4.1 Convert `src/ui/molecules/Experience/index.jsx` → `index.tsx`
  - [x] 4.2 Define ExperienceProps interface using Pick<JobExperience, ...>
  - [x] 4.3 Add `rel="noopener noreferrer"` to company link
  - [x] 4.4 Ensure keyboard accessibility on link (native anchor is keyboard accessible)
  - [x] 4.5 Format work array as string for TransitionerLi data prop

- [x] **Task 5: Migrate Experiences organism to TypeScript** (AC: #1, #2)
  - [x] 5.1 Convert `src/ui/organisms/Experiences/index.jsx` → `index.tsx`
  - [x] 5.2 Use typed hook and components (useJobExperiences returns typed data)
  - [x] 5.3 Use stable keys (experience.id) instead of array index
  - [x] 5.4 Add aria-labels for accessibility (section aria-label added)

- [x] **Task 6: Verify History component (scroll progress)** (AC: #2)
  - [x] 6.1 Review `src/ui/atoms/hocs/History/index.jsx` - uses useScroll + scrollYProgress
  - [x] 6.2 Verify mobile responsiveness of progress bar - CSS has md: and xs: breakpoints
  - [x] 6.3 Test with real data to confirm animation works - deferred to manual validation
  - [x] 6.4 Document any alignment adjustments needed - alignment looks correct, no changes needed

- [x] **Task 7: Create unit tests** (AC: #1, #2)
  - [x] 7.1 Test JobExperienceSchema validation (12 tests in schema.test.ts)
  - [x] 7.2 Test useJobExperiences hook (4 tests - loading, success, error, work tasks)
  - [x] 7.3 Test Experience molecule (9 tests - rendering, links, work tasks)
  - [x] 7.4 Test Experiences organism (8 tests - loading, error, success, accessibility)

- [x] **Task 8: Final Validation** (AC: #1, #2)
  - [x] 8.1 Run `npm run lint` - PASS
  - [x] 8.2 Run `npm run typecheck` - PASS
  - [x] 8.3 Run `npm test` - PASS (240 tests)
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

## Known Issues

### Timeline Progress Visualization

**Priority**: LOW (UX polish)
**Component**: `src/ui/atoms/hocs/History/index.jsx`

The vertical progress line currently renders fully filled on initial load, while individual timeline nodes (LiIcon circles) animate progressively on scroll.

This creates a visual inconsistency with the intended narrative flow:
- **Expected**: line → node → continue (progressive reveal)
- **Actual**: full line visible immediately, nodes animate independently

**Impact**: Does not break functionality or accessibility. The scroll-based animation still works, but the visual storytelling could be more cohesive.

**Recommendation**: Refine in a future UX/motion pass to align line progression with scroll position and node completion. Consider:
- Syncing `scrollYProgress` between History and LiIcon components
- Using a shared motion context for coordinated animations
- Investigating Framer Motion's `useViewportScroll` vs `useScroll` with offset tuning

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

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

1. **Task 1**: Created `schema.ts` with Zod schemas for JobExperience and JobExperienceTask (12 tests)
2. **Task 2**: Created `mock.ts` with 6 job experiences from backend.rb, deleted old mock.js
3. **Task 3**: Migrated domain to TypeScript (index.ts, useJobExperiences.ts), fixed `cacheTime` → `gcTime`
4. **Task 4**: Migrated Experience molecule to TSX, added `rel="noopener noreferrer"`, formatted work as text
5. **Task 5**: Migrated Experiences organism to TSX, replaced array index keys with `experience.id`
6. **Task 6**: Verified History component already implements scroll progress with responsive CSS
7. **Task 7**: Created 33 unit tests across 4 test files (schema, hook, molecule, organism)
8. **Task 8**: All automated validations pass (lint, typecheck, 240 tests)

### File List

**New Files:**
- `src/domains/job-experience/model/schema.ts` - Zod schemas and types
- `src/domains/job-experience/model/mock.ts` - Typed mock data (6 experiences)
- `src/domains/job-experience/model/__tests__/schema.test.ts` - 12 schema tests
- `src/domains/job-experience/queries/__tests__/useJobExperiences.test.tsx` - 4 hook tests
- `src/ui/molecules/Experience/__tests__/Experience.test.tsx` - 9 component tests
- `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx` - 8 organism tests

**Migrated Files (JS → TS):**
- `src/domains/job-experience/model/index.ts` - Added Zod validation, type exports
- `src/domains/job-experience/queries/useJobExperiences.ts` - Typed hook with gcTime
- `src/ui/molecules/Experience/index.tsx` - Added ExperienceProps, security attrs
- `src/ui/organisms/Experiences/index.tsx` - Stable keys, accessibility attrs

**Deleted Files:**
- `src/domains/job-experience/model/schema.js` - Empty, interfering with TS
- `src/domains/job-experience/model/mock.js` - Replaced by typed version
- `src/domains/job-experience/model/index.js` - Migrated to TS
- `src/domains/job-experience/queries/useJobExperiences.js` - Migrated to TS
- `src/ui/molecules/Experience/index.jsx` - Migrated to TSX
- `src/ui/organisms/Experiences/index.jsx` - Migrated to TSX
