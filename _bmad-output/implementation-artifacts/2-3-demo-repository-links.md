# Story 2.3: Demo & Repository Links

Status: done

---

## Story

As a **visitor**,
I want **to access live demos and source code**,
So that **I can evaluate the actual work**.

---

## Acceptance Criteria

### AC1: Demo Link Opens in New Tab
**Given** I view a project with a live demo
**When** I click the demo link
**Then** the demo opens in a new tab
**And** the link has `rel="noopener noreferrer"`

### AC2: Repository Link Opens GitHub
**Given** I view a project with source code
**When** I click the repository link
**Then** GitHub repository opens in new tab
**And** link is keyboard accessible

### AC3: Hidden When Not Available
**Given** a project has no demo or repo
**When** I view the project
**Then** the respective button is hidden (not disabled)

---

## Implementation Notes

**Story completada en Story 2.2** - Los links de demo y repository ya fueron implementados como parte del trabajo de Story 2.2 (Project Detail View):

- `FeaturedProject/index.jsx:57-77` - Demo y repository links
- `Project/index.jsx:36-57` - Demo y repository links
- `ProjectDetail/index.tsx:74-94` - Demo y repository links

Todos los links tienen:
- `target="_blank"` para abrir en nueva pestaña
- `rel="noopener noreferrer"` para seguridad (tabnabbing prevention)
- Conditional rendering `{demo && ...}` para ocultar cuando no disponible

---

## Tasks / Subtasks

- [x] **Task 1: Verify existing implementation** (AC: #1, #2, #3)
  - [x] 1.1 Confirmed demo links have `target="_blank"` and `rel="noopener noreferrer"`
  - [x] 1.2 Confirmed repository links have same security attributes
  - [x] 1.3 Confirmed conditional rendering hides links when not available

- [x] **Task 2: Add test coverage** (AC: #1, #2, #3)
  - [x] 2.1 Created `FeaturedProject/__tests__/FeaturedProject.test.tsx`
  - [x] 2.2 Tests for demo link security attributes
  - [x] 2.3 Tests for repository link security attributes
  - [x] 2.4 Tests for conditional rendering (hidden when not provided)

---

## Testing Requirements

### Test Coverage Added

| File | Tests | Location |
|------|-------|----------|
| `FeaturedProject` | 5 tests | `molecules/FeaturedProject/__tests__/FeaturedProject.test.tsx` |

### Future Test Ideas (documented in test file)

- Test keyboard navigation (Tab order through links)
- Test GitHubIcon renders with aria-hidden
- Test image link navigates to detail page
- E2E: Verify links actually open in new tab

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes

- Functionality already implemented in Story 2.2
- Added 5 focused tests for link security and conditional rendering
- Total tests: 180 passing

### File List

**Created:**
- `src/ui/molecules/FeaturedProject/__tests__/FeaturedProject.test.tsx`

**Modified:**
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
