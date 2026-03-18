# Projects UI Specification

## Purpose

Define projects grid ordering behavior to surface incoming work while preserving featured priority and existing blade pairing semantics.

## Requirements

### Requirement: Featured Priority Ordering

The system MUST order featured projects before all non-featured projects in the projects grid.

#### Scenario: Featured items appear first

- GIVEN a projects dataset containing featured and non-featured items
- WHEN the projects grid is rendered
- THEN all featured items appear before any non-featured items

#### Scenario: No featured items present

- GIVEN a projects dataset with no featured items
- WHEN the projects grid is rendered
- THEN the grid order is based on the non-featured ordering rules only

### Requirement: Incoming Priority Within Non-Featured

The system MUST order non-featured projects with an incoming ribbon before other non-featured projects.

#### Scenario: Incoming items prioritized among non-featured

- GIVEN non-featured projects where some include incoming ribbon metadata
- WHEN the projects grid is rendered
- THEN incoming non-featured projects appear before other non-featured projects

#### Scenario: Mixed featured and incoming items

- GIVEN a dataset with featured items and non-featured incoming items
- WHEN the projects grid is rendered
- THEN featured items appear first and incoming non-featured items appear immediately after featured items

### Requirement: Stable Ordering for Ties

The system SHOULD preserve the existing relative order of projects within the same priority group (featured, incoming, or standard).

#### Scenario: Stable order within priority group

- GIVEN two incoming non-featured projects with equal priority
- WHEN the projects grid is rendered
- THEN their relative order matches the pre-sorted dataset order

#### Scenario: Edge case with all same priority

- GIVEN a dataset where all projects are non-featured and non-incoming
- WHEN the projects grid is rendered
- THEN the grid order matches the pre-sorted dataset order
