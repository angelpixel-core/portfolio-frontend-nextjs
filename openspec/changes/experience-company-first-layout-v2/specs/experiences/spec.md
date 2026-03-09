# Experiences Specification

## Purpose

Define company-first experience behavior so recruiters can scan employers, business context, and technology stacks quickly using explicit fields and deterministic grouped rendering.

## Requirements

### Requirement: Explicit Experience Metadata Contract

The system MUST represent each experience entry with explicit `year`, `contextBadges[]`, `technologies[]`, and `group` fields, and SHALL treat `group` as a constrained value of `engineering` or `platform`.

#### Scenario: Experience entry includes all explicit metadata fields

- GIVEN an experience entry provided to the experiences section
- WHEN the entry is validated against the experience contract
- THEN the entry includes `year`, `contextBadges[]`, `technologies[]`, and `group`
- AND `group` is either `engineering` or `platform`

#### Scenario: Experience entry has missing or invalid group value

- GIVEN an experience entry with missing `group` or a value outside `engineering` and `platform`
- WHEN the entry is validated against the experience contract
- THEN the entry is treated as invalid for grouped rendering
- AND the system does not silently coerce the value to a different group

### Requirement: Company-First Experience Card Rendering

The system MUST render each experience card with company-first information hierarchy and SHALL display explicit metadata fields so company identity, year, context badges, and technologies are directly scannable.

#### Scenario: Card renders company-first hierarchy with explicit metadata

- GIVEN a valid experience entry with `year`, `contextBadges[]`, and `technologies[]`
- WHEN the experience card is rendered
- THEN company identity is shown as the primary heading context
- AND `year`, `contextBadges[]`, and `technologies[]` are displayed from their explicit fields

#### Scenario: Card receives empty badge or technology arrays

- GIVEN a valid experience entry where `contextBadges[]` or `technologies[]` is empty
- WHEN the experience card is rendered
- THEN the card remains readable and structurally valid
- AND no placeholder tokens are shown for missing items

### Requirement: Technology Source Isolation

The system MUST source rendered technology chips only from `technologies[]` and SHALL NOT derive technology chips from nested `work[].tags`.

#### Scenario: Technologies are rendered only from technologies array

- GIVEN an experience entry with `technologies[]` values and different values in `work[].tags`
- WHEN the technology chip area is rendered
- THEN only values from `technologies[]` are displayed as technology chips
- AND values present only in `work[].tags` are not rendered as technology chips

#### Scenario: Technologies array is empty while work tags exist

- GIVEN an experience entry with empty `technologies[]` and non-empty `work[].tags`
- WHEN the technology chip area is rendered
- THEN no technology chips are displayed
- AND the system does not backfill chips from `work[].tags`

### Requirement: Deterministic Grouped Experiences Rendering

The system MUST group experiences by `group` using deterministic order `engineering` followed by `platform`, and SHALL omit empty groups while preserving loading and error fallback behavior.

#### Scenario: Experiences render in fixed group order

- GIVEN experience entries for both `engineering` and `platform`
- WHEN the experiences section is rendered
- THEN group headings are displayed in the order `engineering` then `platform`
- AND entries appear under their matching group heading

#### Scenario: One group has no entries

- GIVEN experience entries exist only for `engineering`
- WHEN the experiences section is rendered
- THEN only the `engineering` group heading and entries are displayed
- AND no empty `platform` group container is shown

#### Scenario: Grouped rendering during error state

- GIVEN the experiences query fails before grouped data is available
- WHEN the experiences section is rendered
- THEN the section shows the existing error fallback behavior
- AND no partial group headings are rendered from incomplete data
