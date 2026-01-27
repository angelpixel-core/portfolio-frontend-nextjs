# Story 10.2: Social Network Icon Mapping

## Story

**As a** visitor viewing social links,
**I want** all social network icons to display correctly,
**So that** I can identify each platform visually.

## Status

- **Epic:** 10 - Runtime & UX Polish
- **Sprint Status:** review
- **Priority:** LOW (Console Warning)
- **Estimated Effort:** Small (1 session)

## Acceptance Criteria

### AC1: Twitter Icon Displays Correctly

**Given** a social link with provider "Twitter"
**When** the link renders
**Then** a Twitter/X icon displays (not QuestionIcon fallback)

### AC2: Dribbble Icon Displays Correctly

**Given** a social link with provider "Dribbble"
**When** the link renders
**Then** a Dribbble icon displays (not QuestionIcon fallback)

### AC3: Zero Console Warnings

**Given** I check browser console
**When** social links render
**Then** zero "Icon not found in iconMapping" warnings appear

## Tasks / Subtasks

### Task 1: Identify Icon Mapping Gap (AC1, AC2) ✅

- [x] 1.1 Review current iconMapping in `Icon.jsx`
- [x] 1.2 Identify missing case variations (Twitter vs twitter, Dribbble vs dribbble)
- [x] 1.3 Determine if data source uses PascalCase or lowercase

**Findings:**
- `iconMapping` had lowercase entries but missing PascalCase
- API likely sends PascalCase ("Twitter", "Dribbble")

### Task 2: Add Missing Icon Mappings (AC1, AC2) ✅

- [x] 2.1 Add `Twitter: TwitterIcon` to iconMapping
- [x] 2.2 Add `Dribbble: DribbbleIcon` to iconMapping
- [x] 2.3 Consider case-insensitive lookup pattern for robustness → Deferred (simple fix sufficient)

### Task 3: Validate Fix (AC3) ✅

- [x] 3.1 Run application and check console for warnings
- [x] 3.2 Run existing unit tests: `npm test -- SocialNetworkLink`
- [x] 3.3 Verify icons render visually in browser

**Results:**
- 21 SocialNetworkLink tests pass
- 519 total tests pass (no regressions)

### Task 4: Update Tests (AC1, AC2, AC3) ✅

- [x] 4.1 Add test case for "Twitter" (PascalCase) icon lookup
- [x] 4.2 Add test case for "Dribbble" (PascalCase) icon lookup
- [x] 4.3 Verify no console warnings in test output

**New Test File:** `src/ui/molecules/SocialNetworkLink/__tests__/Icon.test.tsx`

## Dev Notes

### Technical Context

- **Debt Origin:** Console warning during runtime
- **Component:** `src/ui/molecules/SocialNetworkLink/Icon.jsx`
- **Current Status:** Warning logged but icons fallback to QuestionIcon

### Current Evidence

```
⚠️ [SocialNetworkLink] Icon "Twitter" not found in iconMapping
⚠️ [SocialNetworkLink] Icon "Dribbble" not found in iconMapping
```

### Root Cause Analysis

The `iconMapping` object in `Icon.jsx` has:
- `twitter: TwitterIcon` (lowercase)
- `dribbble: DribbbleIcon` (lowercase)

But missing:
- `Twitter: TwitterIcon` (PascalCase)
- `Dribbble: DribbbleIcon` (PascalCase)

The data source (possibly API or mock data) may use PascalCase names, causing the lookup to fail.

### Current iconMapping (Line 13-29)

```javascript
const iconMapping = {
  dribbble: DribbbleIcon,
  github: GitHubIcon,
  GitHub: GitHubIcon,         // Has PascalCase
  MapPin: GitHubIcon,
  linkedin: LinkedInIcon,
  LinkedIn: LinkedInIcon,     // Has PascalCase
  Map: LinkedInIcon,
  pinterest: PinterestIcon,
  telegram: TelegramIcon,
  Telegram: TelegramIcon,     // Has PascalCase
  Phone: TelegramIcon,
  twitter: TwitterIcon,       // ❌ Missing Twitter (PascalCase)
  whatsapp: WhatsAppIcon,
  WhatsApp: WhatsAppIcon,     // Has PascalCase
  Email: WhatsAppIcon,
};
```

### Solution Options

**Option A (Simple):** Add missing PascalCase entries
```javascript
Twitter: TwitterIcon,
Dribbble: DribbbleIcon,
```

**Option B (Robust):** Case-insensitive lookup
```javascript
const IconComponent = iconMapping[name] || iconMapping[name.toLowerCase()];
```

**Recommendation:** Option A is sufficient for this story. Option B could be a follow-up if more case issues arise.

### Data Sources

**Mock Data (`public/data/socials.json`):**
- Uses lowercase: `twitter`, `dribbble`
- Currently `enabled: false` for both

**API Data (Real Backend):**
- May use PascalCase: `Twitter`, `Dribbble`
- This is likely the source of the warning

### Testing Commands

```bash
# Run unit tests for SocialNetworkLink
npm test -- SocialNetworkLink

# Run app and check console
npm run dev
# Open browser DevTools → Console → Filter for "iconMapping"
```

### Scope Boundaries

Per Epic 10 definition:
- Fix the icon mapping ONLY
- NO new icons or features
- NO architecture changes

### Previous Story Intelligence

From Story 10.1:
- TDD approach worked well (RED-GREEN-REFACTOR)
- Commit between phases for traceability
- Simple CSS/config fixes are low risk

## Project Structure Notes

### Files to Modify

```
src/ui/molecules/SocialNetworkLink/
├── Icon.jsx              # PRIMARY: Add Twitter, Dribbble to iconMapping
└── __tests__/
    └── SocialNetworkLink.test.tsx  # Add test cases for PascalCase icons
```

### Related Files (Read Only)

```
src/ui/atoms/icons/
├── TwitterIcon/index.jsx    # Already exists
└── DribbbleIcon/index.jsx   # Already exists

public/data/socials.json     # Mock data (uses lowercase)
```

## References

### Debt Items Addressed

| ID | Issue | Origin | Resolution |
|----|-------|--------|------------|
| 10.2 | Missing icons (Twitter, Dribbble) | Console warning | Add PascalCase entries to iconMapping |

### Architecture Alignment

- **Pattern:** Icon components in `@/atoms/icons`
- **Mapping:** Case-sensitive lookup in Icon.jsx
- **Logging:** Uses `@/lib/logger` for warnings

### Existing Code References

- `src/ui/molecules/SocialNetworkLink/Icon.jsx:13-29` - iconMapping object
- `src/ui/molecules/SocialNetworkLink/Icon.jsx:31-44` - Icon component with fallback
- `src/ui/atoms/icons/TwitterIcon/index.jsx` - Twitter icon component
- `src/ui/atoms/icons/DribbbleIcon/index.jsx` - Dribbble icon component

## Dev Agent Record

| Field | Value |
|-------|-------|
| Story Created | 2026-01-27 |
| Story Author | Workflow: create-story |
| Epic | 10 - Runtime & UX Polish |
| Debt Origin | Console warning |
| Implementation Date | 2026-01-27 |
| Implementation Method | TDD (RED-GREEN-REFACTOR) |

### File List

**Source Files Modified:**
- `src/ui/molecules/SocialNetworkLink/Icon.jsx` - Added Twitter and Dribbble to iconMapping

**Test Files Created:**
- `src/ui/molecules/SocialNetworkLink/__tests__/Icon.test.tsx` - 11 tests for icon mapping

### Commits

| Hash | Phase | Description |
|------|-------|-------------|
| `d82c516` | RED | Failing tests for PascalCase icons |
| `b304202` | GREEN | Add Twitter and Dribbble mappings |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-27 | Story created via create-story workflow |
| 2026-01-27 | TDD implementation: RED (tests), GREEN (fix) |
| 2026-01-27 | All tasks completed, moved to review |
