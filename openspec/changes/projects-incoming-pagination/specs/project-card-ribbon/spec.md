# Project Card Ribbon Specification

## Purpose

Define ribbon rendering for grid project cards using existing ribbon metadata.

## Requirements

### Requirement: Grid Ribbon Rendering

The system MUST render the ribbon on grid project cards when ribbon metadata is present.

#### Scenario: Ribbon appears on grid card

- GIVEN a project with ribbon metadata
- WHEN the project is rendered as a grid card
- THEN the ribbon is displayed within the card image area

#### Scenario: Edge case without ribbon metadata

- GIVEN a project without ribbon metadata
- WHEN the project is rendered as a grid card
- THEN no ribbon is displayed

### Requirement: Ribbon Consistency Across Variants

The system SHOULD display the same ribbon content in grid cards as in other card variants when the metadata matches.

#### Scenario: Ribbon text matches metadata

- GIVEN a project with ribbon text of "Incoming"
- WHEN the project is rendered as a grid card
- THEN the ribbon text reads "Incoming"

#### Scenario: Edge case with alternate ribbon text

- GIVEN a project with ribbon text other than "Incoming"
- WHEN the project is rendered as a grid card
- THEN the ribbon displays that exact text
