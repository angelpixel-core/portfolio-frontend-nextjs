## Verification Report

**Change**: experience-company-first-layout-v2

### Completeness

| Metric           | Value |
| ---------------- | ----- |
| Tasks total      | 16    |
| Tasks complete   | 16    |
| Tasks incomplete | 0     |

All tasks in `openspec/changes/experience-company-first-layout-v2/tasks.md` are marked complete and are consistent with implemented files.

### Correctness (Specs)

| Requirement                                 | Status         | Notes                                                                                                                                                             |
| ------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Explicit Experience Metadata Contract       | ✅ Implemented | Schema requires `year`, `contextBadges[]`, `technologies[]`, and enum `group`; invalid/missing group is rejected without coercion.                                |
| Company-First Experience Card Rendering     | ✅ Implemented | Card renders company link/name before role title and displays explicit `year`, `contextBadges[]`, and `technologies[]`; empty arrays render without placeholders. |
| Technology Source Isolation                 | ✅ Implemented | Technology chips render only from `technologies[]`; no rendering from `work[].tags`, including empty `technologies[]` case.                                       |
| Deterministic Grouped Experiences Rendering | ✅ Implemented | Group order is fixed (`engineering`, then `platform`), empty groups omitted, and error fallback renders without group headings.                                   |

**Scenarios Coverage:**
| Scenario | Status |
|----------|--------|
| Experience entry includes all explicit metadata fields | ✅ Covered |
| Experience entry has missing or invalid group value | ✅ Covered |
| Card renders company-first hierarchy with explicit metadata | ✅ Covered |
| Card receives empty badge or technology arrays | ✅ Covered |
| Technologies are rendered only from technologies array | ✅ Covered |
| Technologies array is empty while work tags exist | ✅ Covered |
| Experiences render in fixed group order | ✅ Covered |
| One group has no entries | ✅ Covered |
| Grouped rendering during error state | ✅ Covered |

### Coherence (Design)

| Decision                                        | Followed? | Notes                                                                                     |
| ----------------------------------------------- | --------- | ----------------------------------------------------------------------------------------- |
| Keep v2 fields in domain schema                 | ✅ Yes    | `JobExperienceSchema` includes `year`, `contextBadges`, `technologies`, and enum `group`. |
| Deterministic grouping with explicit allow-list | ✅ Yes    | `GROUP_ORDER` drives render order and unsupported groups are excluded.                    |
| No technology fallback from `work[].tags`       | ✅ Yes    | Experience card maps only `technologies[]` for chips.                                     |
| Transitional normalization at model boundary    | ✅ Yes    | `normalizeLegacyExperience` maps legacy payloads and drops invalid group entries.         |

File-change alignment: all design-listed files are present and updated (`schema.ts`, `mock.ts`, `model/index.ts`, `Experience` molecule files, `Experiences` organism files, tests, and stories).

### Testing

| Area                                                                                          | Tests Exist? | Coverage |
| --------------------------------------------------------------------------------------------- | ------------ | -------- |
| Schema contract and group validation                                                          | Yes          | Good     |
| Experience molecule (company-first + metadata + tech isolation + empty arrays)                | Yes          | Good     |
| Experiences organism (group order + placement + empty group + invalid group + error fallback) | Yes          | Good     |
| Stories for edge rendering states                                                             | Yes          | Good     |

Validation commands executed during verification:

| Command                                                                                                                             | Status  | Notes                                     |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------- |
| `npm test -- src/ui/molecules/Experience/__tests__/Experience.test.tsx src/ui/organisms/Experiences/__tests__/Experiences.test.tsx` | ✅ Pass | 2 suites, 15 tests passed.                |
| `npm run typecheck`                                                                                                                 | ✅ Pass | Completed with no reported type errors.   |
| `npm run validate:content`                                                                                                          | ✅ Pass | Content validation suites passed.         |
| `npm run lint`                                                                                                                      | ✅ Pass | ESLint completed with no warnings/errors. |

### Issues Found

**CRITICAL** (must fix before archive):
None.

**WARNING** (should fix):
None.

**SUGGESTION** (nice to have):

- Add a dedicated `job-experience` validation command/test-path if long-term fixture validation is expected outside schema tests, since `validate:content` currently validates articles/projects only.

### Verdict

PASS

Implementation matches proposal/spec/design/tasks for this change and passes verification checks.
