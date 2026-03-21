# Project Specification

## Purpose

Define the required project data updates for the incoming-priority portfolio items using existing project fields and assets.

## Requirements

### Requirement: Add Incoming Project Entries

The system MUST include three new project entries identified as `financial-core-simulator`, `erc20-token`, and `e-commerce` in the project data set.

#### Scenario: Incoming entries appear in project data

- GIVEN the project data set is loaded
- WHEN the projects list is inspected
- THEN entries with identifiers `financial-core-simulator`, `erc20-token`, and `e-commerce` are present
- AND each entry includes all fields required by the existing project schema

#### Scenario: Validation rejects missing required fields

- GIVEN a project entry for `erc20-token` is missing a required schema field
- WHEN project data validation is executed
- THEN validation fails for that entry

### Requirement: Featured and Incoming Metadata

The system MUST set `featured` to true for `financial-core-simulator` and MUST set `featured` to false (or omit it) for `erc20-token` and `e-commerce`. The system MUST set `featuredCard.ribbon.text` to `Incoming` for all three entries.

#### Scenario: Featured incoming ordering metadata is present

- GIVEN the project data set is loaded
- WHEN the entries for the three incoming projects are inspected
- THEN `financial-core-simulator` has `featured` set to true
- AND `erc20-token` and `e-commerce` do not have `featured` set to true
- AND all three entries include `featuredCard.ribbon.text` equal to `Incoming`

#### Scenario: Incoming status is case-sensitive for ribbon text

- GIVEN a project entry uses `featuredCard.ribbon.text` set to `incoming`
- WHEN incoming grouping logic evaluates ribbon text
- THEN the entry is NOT treated as incoming

### Requirement: Incoming Asset Paths

The system MUST set `img` to an asset path under `public/images/projects/incoming/` for each of the three incoming projects. The system SHOULD set `screenshots[0]` to the same incoming image for `financial-core-simulator` when no dedicated featured screenshot is available.

#### Scenario: Incoming image paths resolve for all entries

- GIVEN the project data set is loaded
- WHEN the image paths for the three incoming projects are inspected
- THEN each `img` path begins with `/images/projects/incoming/`

#### Scenario: Featured project uses incoming image as fallback screenshot

- GIVEN `financial-core-simulator` has no separate featured screenshot asset
- WHEN its data is inspected
- THEN `screenshots[0]` equals its `img` value

### Requirement: No New Project Fields

The system MUST NOT introduce new project schema fields to express priority or status beyond existing fields (`featured` and `featuredCard.ribbon.text`).

#### Scenario: Schema remains unchanged

- GIVEN the project schema is reviewed
- WHEN comparing to the baseline schema
- THEN no new fields related to priority or status are added

#### Scenario: Data uses existing fields only

- GIVEN the project data set is loaded
- WHEN the incoming project entries are inspected
- THEN only existing schema fields are used to express featured and incoming status
