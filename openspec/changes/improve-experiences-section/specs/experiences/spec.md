# Experiences Specification

## Purpose

Define the expected behavior of the Experience section so recruiter-facing content is faster to scan, metadata order is consistent, and timeline visuals are denser without changing core section behavior.

## Requirements

### Requirement: Concise Experience Detail Presentation

The system MUST present each experience entry using concise, impact-oriented detail bullets for scanability and SHALL avoid paragraph-style detail blocks in the expanded experience content.

#### Scenario: Experience renders concise impact bullets

- GIVEN an experience entry with multiple role details
- WHEN the Experience section is rendered
- THEN the details are shown as concise bullet items optimized for quick scanning
- AND the entry remains understandable without requiring long-form paragraph reading

#### Scenario: Entry has limited available detail content

- GIVEN an experience entry with fewer available details than typical
- WHEN the Experience section is rendered
- THEN the system still renders only the available concise bullets
- AND the layout remains readable without empty filler content

### Requirement: Experience Metadata Order and Role Emphasis

The system MUST display experience metadata in the order `Role @ Company`, then `Date`, then `Location` for each experience row, and SHALL preserve stronger role labeling for independent consulting entries.

#### Scenario: Standard experience row metadata order

- GIVEN an experience entry with role, company, date, and location values
- WHEN the row is displayed
- THEN the first metadata line shows `Role @ Company`
- AND the next metadata fields appear in order as `Date` then `Location`

#### Scenario: Independent consulting role entry

- GIVEN an experience entry representing independent consulting work
- WHEN the row is displayed
- THEN the role label is presented with clear independent-consulting emphasis
- AND the metadata order remains `Role @ Company` then `Date` then `Location`

### Requirement: Timeline Density and Logo Fallback Behavior

The system SHOULD render the experience timeline with tighter vertical spacing and reduced timeline-line visual dominance while maintaining readability, and it MUST provide graceful fallback presentation when a company logo is unavailable.

#### Scenario: Timeline appears denser with readable hierarchy

- GIVEN the Experience section is viewed on supported breakpoints
- WHEN experience rows are rendered in sequence
- THEN row spacing appears tighter than before to improve scan density
- AND timeline visual separators remain present but less visually dominant than content text

#### Scenario: Company logo is unavailable

- GIVEN an experience entry without an available company logo
- WHEN the row is rendered
- THEN the experience still renders without broken visual elements
- AND company identity remains understandable through text metadata
