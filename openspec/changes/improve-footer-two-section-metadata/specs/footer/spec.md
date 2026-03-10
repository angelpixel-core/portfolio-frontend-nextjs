## ADDED Requirements

### Requirement: Two-section footer composition

The system MUST render the footer as two stacked sections where the first section uses a fade gradient treatment and the second section uses a solid background continuation.

#### Scenario: Footer renders gradient top and solid bottom

- **WHEN** the footer is rendered on any primary route
- **THEN** the top footer section MUST display a fade gradient background
- **AND** the lower footer section MUST display a solid background visually distinct from the gradient end.

### Requirement: Top-section information hierarchy

The system MUST center copyright and author in the first line of the top section and MUST render `Contact` and `Links` groups below that line.

#### Scenario: Copyright and author are centered on first line

- **WHEN** a user views the top footer section
- **THEN** copyright and author text MUST appear on the first row in centered alignment.

#### Scenario: Contact and links remain grouped below

- **WHEN** the first row is rendered
- **THEN** `Contact` and `Links` MUST appear as distinct grouped columns below the first row.

### Requirement: Footer icon alignment and scale consistency

The system MUST render Telegram and Email actions with icon-left alignment and MUST apply balanced icon sizing where `Links` icons are slightly larger than `Contact` icons.

#### Scenario: Contact actions display icon-left

- **WHEN** Telegram and Email actions are shown in the footer
- **THEN** their icons MUST render to the left of their text labels.

#### Scenario: Links icons are larger than contact icons

- **WHEN** both `Contact` and `Links` groups are visible
- **THEN** icon sizing MUST be consistent within each group
- **AND** `Links` icon size MUST be slightly larger than `Contact` icon size.

### Requirement: Technical metadata section balance

The system MUST render a lower metadata section with reduced visual intensity, centered `Built with...` line, and three key/value lines for technology categories.

#### Scenario: Metadata section applies reduced emphasis

- **WHEN** the lower metadata section is rendered
- **THEN** the section MUST apply approximately 0.75 overall opacity and slightly reduced typography size relative to the upper section.

#### Scenario: Built-with line is centered

- **WHEN** metadata content is displayed
- **THEN** the `Built with Next.js · React · TypeScript · Tailwind CSS` line MUST be centered on its own row.

#### Scenario: Key and value styling is balanced

- **WHEN** key/value metadata rows are shown
- **THEN** each key label MUST use reduced emphasis (`opacity: 0.6`, `font-weight: 500`)
- **AND** each value group MUST use `font-weight: 400` and occupy remaining horizontal space for balanced distribution.
