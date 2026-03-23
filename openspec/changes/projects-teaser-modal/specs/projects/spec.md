# Projects Specification

## Purpose

Define project status modeling for gating project interactions.

## Requirements

### Requirement: Project Status Field

The system MUST model each project with a `status` value of `live`, `in-progress`, or `planned`.

#### Scenario: Valid status is accepted

- GIVEN a project record with `status` set to `live`
- WHEN the project record is validated
- THEN the record is accepted as valid

#### Scenario: Missing or unknown status is rejected

- GIVEN a project record with no `status` or an unknown value
- WHEN the project record is validated
- THEN the record is rejected as invalid
