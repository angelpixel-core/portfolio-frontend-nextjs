# Story 3.2: Role Details & Responsibilities

Status: review

---

## Story

As a **visitor**,
I want **to see detailed role information when viewing a job entry**,
So that **I can assess relevant experience depth and understand the developer's responsibilities**.

---

## Acceptance Criteria

### AC1: Expandable Role Details
**Given** I view a job entry in the experience timeline
**When** I expand or click for details
**Then** I see responsibilities and achievements as bullet points
**And** technologies used in that role are listed as tags
**And** the interaction is keyboard accessible (Enter/Space to toggle)

### AC2: Long Content Formatting
**Given** I view role details
**When** content is long (multiple work items)
**Then** it's formatted for readability (bullets, spacing)
**And** each responsibility is clearly separated
**And** technology tags are visually distinct

### AC3: Collapse State
**Given** I have expanded a job entry
**When** I click/press the collapse control
**Then** the details section collapses with smooth animation
**And** focus remains on the trigger element
**And** screen readers announce state change

---

## Tasks / Subtasks

- [x] **Task 1: Enhance Experience molecule with expand/collapse** (AC: #1, #3)
  - [x] 1.1 Add `isExpanded` state with `useState` hook
  - [x] 1.2 Create expandable section below header for work details
  - [x] 1.3 Add toggle button with `aria-expanded` attribute
  - [x] 1.4 Implement keyboard handling (Enter/Space to toggle)
  - [x] 1.5 Add CSS transition for expand/collapse animation
  - [x] 1.6 Respect `prefers-reduced-motion` for animations

- [x] **Task 2: Display responsibilities as formatted list** (AC: #1, #2)
  - [x] 2.1 Map `work` array to `<ul>` list with `<li>` items
  - [x] 2.2 Style list items with proper bullets and spacing
  - [x] 2.3 Handle empty `work` array gracefully (no expand button shown)
  - [x] 2.4 Ensure text wraps properly on mobile

- [x] **Task 3: Display technology tags** (AC: #1, #2)
  - [x] 3.1 Extract unique tags from all work items
  - [x] 3.2 Create TechTag component or reuse existing tag styling
  - [x] 3.3 Display tags in a flex-wrap container below responsibilities
  - [x] 3.4 Style tags with distinct visual treatment (pill shape, colored background)

- [x] **Task 4: Accessibility enhancements** (AC: #1, #3)
  - [x] 4.1 Add `aria-expanded` to toggle button
  - [x] 4.2 Add `aria-controls` linking to expandable section
  - [x] 4.3 Use `aria-hidden` on collapsed content (content unmounted when collapsed)
  - [x] 4.4 Announce state changes with live region or native toggle (button text changes)
  - [x] 4.5 Ensure focus management (focus stays on trigger after toggle)

- [x] **Task 5: Update Experience molecule tests** (AC: #1, #2, #3)
  - [x] 5.1 Test expand/collapse toggle behavior
  - [x] 5.2 Test keyboard interaction (Enter/Space)
  - [x] 5.3 Test work items rendering as list
  - [x] 5.4 Test technology tags display
  - [x] 5.5 Test accessibility attributes (aria-expanded, aria-controls)
  - [x] 5.6 Test graceful handling of empty work array

- [x] **Task 6: Update Experiences organism tests** (AC: #1)
  - [x] 6.1 Test that all experiences can be expanded
  - [x] 6.2 Test multiple experiences can be open simultaneously (decision: all can be open simultaneously)

- [x] **Task 7: Final Validation** (AC: #1, #2, #3)
  - [x] 7.1 Run `npm run lint` - PASS
  - [x] 7.2 Run `npm run typecheck` - PASS
  - [x] 7.3 Run `npm test` - PASS (259 tests)
  - [ ] 7.4 Manual: Expand first experience → responsibilities visible as bullets
  - [ ] 7.5 Manual: Technology tags display below responsibilities
  - [ ] 7.6 Manual: Keyboard: Tab to experience, Enter to expand
  - [ ] 7.7 Manual: Mobile view → expanded content readable
  - [ ] 7.8 Manual: Screen reader announces expanded/collapsed state

---

## Dev Notes

### Previous Story Learnings (Story 3.1)

**Apply these patterns:**
- Use `gcTime` instead of deprecated `cacheTime` in React Query
- Use stable keys (`experience.id`) instead of array index
- Add `rel="noopener noreferrer"` to external links
- Work data is already typed via Zod schema: `work: z.array(JobExperienceTaskSchema).optional()`
- Use shared framer-motion mock in tests: `jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"))`

**Known Issue from 3.1:**
- Timeline progress visualization renders fully on load (LOW priority, documented)
- This story does NOT address that issue

### Existing Data Structure

The `JobExperience` type already includes work details:

```typescript
// src/domains/job-experience/model/schema.ts
export const JobExperienceTaskSchema = z.object({
  description: z.string(),
  tags: z.array(z.string()).optional(),
});

export const JobExperienceSchema = z.object({
  id: z.number(),
  position: z.string(),
  company: z.string(),
  companyLink: z.string().url(),
  time: z.string(),
  address: z.string(),
  work: z.array(JobExperienceTaskSchema).optional(),
});
```

**Mock data example (already exists):**
```typescript
{
  id: 2,
  position: "FullStack Engineer",
  company: "Compass",
  work: [
    {
      description: "A significant part of my role involved code maintenance...",
      tags: ["code maintenance", "enhancement"],
    },
    // ...more work items
  ]
}
```

### Current Implementation Analysis

**Experience molecule (`src/ui/molecules/Experience/index.tsx`):**
- Currently joins work descriptions into a single string: `work?.map((item) => item.description).join(" ")`
- Passes joined text to `TransitionerLi` data prop
- **Change needed:** Replace string display with expandable section

**TransitionerLi (`src/ui/atoms/hocs/TransitionerLi/index.jsx`):**
- Displays `data` prop as a `<p>` element with `.transitioner-li_legend` class
- **Decision:** Keep TransitionerLi simple, move detail logic to Experience molecule

### Recommended Implementation Approach

**Option A: Expand inside Experience molecule** (Recommended)
- Add expand/collapse state and UI within Experience component
- Keep TransitionerLi unchanged (it already handles timeline icon)
- More control over accessibility and animation

**Option B: Enhance TransitionerLi**
- Make TransitionerLi handle expand/collapse generically
- Higher risk of breaking other uses (Education component uses it too)

**Recommendation:** Option A - keep changes scoped to Experience molecule.

### Component Structure After Implementation

```tsx
// src/ui/molecules/Experience/index.tsx
const Experience = ({ position, company, companyLink, time, address, work }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasWorkDetails = work && work.length > 0;
  const allTags = extractUniqueTags(work);

  return (
    <TransitionerLi>
      <h3 className="experience_title">
        {position}&nbsp;
        <a href={companyLink}>@{company}</a>
      </h3>
      <span className="experience_history-info">{time} | {address}</span>

      {hasWorkDetails && (
        <>
          <button
            aria-expanded={isExpanded}
            aria-controls={`work-${id}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide details' : 'Show details'}
          </button>

          {isExpanded && (
            <div id={`work-${id}`} className="experience_details">
              <ul className="experience_responsibilities">
                {work.map((item, idx) => (
                  <li key={idx}>{item.description}</li>
                ))}
              </ul>
              {allTags.length > 0 && (
                <div className="experience_tags">
                  {allTags.map(tag => (
                    <span key={tag} className="experience_tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </TransitionerLi>
  );
};
```

### Styling Guidelines

**Expand/collapse button:**
- Use subtle styling (text link or small icon button)
- Position below time/address or right-aligned
- Min touch target: 44x44px on mobile

**Responsibilities list:**
- Use semantic `<ul>` with custom bullet styling
- Spacing: `mb-2` or equivalent between items
- Text size: slightly smaller than position title

**Technology tags:**
- Pill/badge style: rounded corners, subtle background
- Colors: Use existing theme colors (`primary`/`primaryDark`)
- Flex-wrap for responsive layout
- Gap between tags: `gap-2`

### Architecture Compliance

| Requirement | Implementation |
|-------------|----------------|
| TypeScript strict mode | All changes in `.tsx` files |
| Path aliases | Use `@/atoms/`, `@/hooks` |
| Accessibility | `aria-expanded`, keyboard handlers |
| Test convention | Tests in `__tests__/` folder |
| Reduced motion | Check `useReducedMotion` for animations |

### File Changes Expected

```
src/ui/molecules/Experience/
├── index.tsx              (MODIFY - add expand/collapse, work list, tags)
├── styles.css             (MODIFY - add detail section styles)
└── __tests__/
    └── Experience.test.tsx (MODIFY - add expand/collapse tests)

src/ui/organisms/Experiences/
└── __tests__/
    └── Experiences.test.tsx (MODIFY - integration tests for expandable items)
```

### Props Change

**Current ExperienceProps:**
```typescript
type ExperienceProps = Pick<
  JobExperience,
  "position" | "company" | "companyLink" | "time" | "address" | "work"
>;
```

**Addition needed:** Consider adding `id` for unique `aria-controls` IDs:
```typescript
type ExperienceProps = Pick<
  JobExperience,
  "id" | "position" | "company" | "companyLink" | "time" | "address" | "work"
>;
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

| Test Area | Tests Needed |
|-----------|-------------|
| Expand/collapse toggle | Click toggle, state changes, content appears |
| Keyboard interaction | Enter key, Space key trigger toggle |
| Accessibility | aria-expanded updates, aria-controls present |
| Work list rendering | All work items displayed as list items |
| Technology tags | Unique tags extracted and displayed |
| Empty work array | No expand button shown, no errors |
| Animation respect | Reduced motion disables animation |

### Manual Validation Checklist

> **OBLIGATORIO antes de merge**

- [ ] Navigate to /about → experiences section visible
- [ ] Click expand on first experience → responsibilities show as bullets
- [ ] Technology tags visible below responsibilities
- [ ] Click collapse → details hide
- [ ] Keyboard: Tab to experience expand button
- [ ] Keyboard: Enter or Space toggles expand
- [ ] Screen reader: Announces "expanded" / "collapsed" state
- [ ] Mobile view: Expanded content is readable
- [ ] Multiple experiences can be expanded (or toggle behavior - document)
- [ ] Experience without work array has no expand button

---

## References

- [Source: epics.md#Story 3.2] - Original acceptance criteria
- [Source: architecture.md#TypeScript Migration] - Migration patterns
- [Source: 3-1-work-history-timeline.md] - Previous story learnings
- [Source: src/domains/job-experience/model/schema.ts] - JobExperience type with work array
- [Source: src/domains/job-experience/model/mock.ts] - Mock data with responsibilities
- [Source: src/ui/molecules/Experience/index.tsx] - Current Experience component
- [Source: src/ui/atoms/hocs/TransitionerLi/index.jsx] - Timeline item wrapper

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes List

1. **Task 1**: Added expand/collapse with useState, aria-expanded, aria-controls, keyboard handlers (Enter/Space), CSS slideDown animation with prefers-reduced-motion media query
2. **Task 2**: Work items mapped to semantic `<ul>/<li>` with list-disc styling, space-y-2 spacing, handles empty arrays gracefully
3. **Task 3**: extractUniqueTags() extracts unique tags via Set, displayed as flex-wrap pills with rounded-full and theme colors
4. **Task 4**: Full a11y with aria-expanded, aria-controls linked to details ID, button text announces state change
5. **Task 5**: 17 new tests covering expand/collapse, keyboard interaction, work list rendering, tags display, and accessibility attributes
6. **Task 6**: 4 new integration tests for organism - expand all, multiple open simultaneously, independent collapse
7. **Task 7**: All automated validations pass (lint, typecheck, 259 tests). Manual validation pending.

### Debug Log References

- None

### File List

**Modified Files:**
- `src/ui/molecules/Experience/index.tsx` - Added expand/collapse, responsibilities list, technology tags
- `src/ui/molecules/Experience/styles.css` - Added styles for toggle button, details section, responsibilities, and tags
- `src/ui/molecules/Experience/__tests__/Experience.test.tsx` - Added 17 new tests for Story 3.2
- `src/ui/organisms/Experiences/index.tsx` - Added `id` prop to Experience component
- `src/ui/organisms/Experiences/__tests__/Experiences.test.tsx` - Added 4 new integration tests for Story 3.2
