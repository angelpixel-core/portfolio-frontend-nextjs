# Projects Specification

## Purpose

Define project ordering using an explicit numeric priority that is independent of featured or ribbon metadata.

## Requirements

### Requirement: Priority Is Required

The system MUST require a numeric `priority` value on every project record used for ordering.

#### Scenario: Valid project includes priority

- GIVEN a project record includes a numeric `priority`
- WHEN the project data is validated for the projects page
- THEN the record is accepted as valid

#### Scenario: Missing or non-numeric priority

- GIVEN a project record omits `priority` or provides a non-numeric value
- WHEN the project data is validated for the projects page
- THEN the record is rejected as invalid

### Requirement: Priority Determines Ordering

The system MUST order projects by descending `priority`, with higher values appearing earlier in the list.

#### Scenario: Higher priority appears first

- GIVEN two project records with priorities 10 and 5
- WHEN the projects list is ordered
- THEN the project with priority 10 appears before the project with priority 5

#### Scenario: Negative and zero priorities

- GIVEN project records with priorities 0 and -1
- WHEN the projects list is ordered
- THEN the project with priority 0 appears before the project with priority -1

### Requirement: Stable Ordering on Ties

The system SHOULD preserve the original input order for projects with equal `priority` values.

#### Scenario: Equal priorities preserve input order

- GIVEN two project records with equal `priority` values in a specific input order
- WHEN the projects list is ordered
- THEN the ordered list preserves the original relative order of those records

#### Scenario: Multiple ties across the list

- GIVEN multiple project records share the same `priority` within the list
- WHEN the projects list is ordered
- THEN each tied group preserves its original relative order

### Requirement: Featured Does Not Influence Ordering

The system MUST NOT use `featured` or ribbon text to determine project ordering.

#### Scenario: Featured flag does not override priority

- GIVEN a featured project has a lower `priority` than a non-featured project
- WHEN the projects list is ordered
- THEN the non-featured project appears before the featured project

#### Scenario: Ribbon text does not affect ordering

- GIVEN a project with ribbon text "Incoming" has a lower `priority` than another project
- WHEN the projects list is ordered
- THEN the project with higher `priority` appears earlier regardless of ribbon text
