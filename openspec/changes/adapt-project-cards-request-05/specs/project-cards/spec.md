# Project Cards Specification

## Purpose

Define required behavior for featured project cards so they communicate system domain context, architecture intent, and decision-ready actions while preserving compatibility with existing project data.

## Requirements

### Requirement: Featured Card Six-Part Content Hierarchy

The system MUST render featured project cards using a consistent six-part hierarchy: preview support, context badges, project title, domain-oriented description, tech badges, and action row.

#### Scenario: Featured card with complete request-05 content

- GIVEN a featured project with preview media, context badges, title, description, tech badges, and actions
- WHEN the Projects section is rendered
- THEN the featured card presents all six parts in the defined order
- AND the card content emphasizes system/domain context before implementation details

#### Scenario: Featured card without preview media

- GIVEN a featured project that has no preview media
- WHEN the Projects section is rendered
- THEN the featured card still renders context badges, title, description, tech badges, and action row
- AND the card layout remains valid without breaking the reading order

### Requirement: CTA Semantics and Availability

The system MUST expose featured-card actions with explicit semantics for architecture view, source code, and live demo; it MUST NOT display an action that has no usable target.

#### Scenario: All CTA targets are available

- GIVEN a featured project with valid architecture, source code, and live demo targets
- WHEN the action row is rendered
- THEN the user sees actions labeled Architecture, Source Code, and Live Demo
- AND each action is individually operable

#### Scenario: One or more CTA targets are missing

- GIVEN a featured project where one or more action targets are absent
- WHEN the action row is rendered
- THEN only actions with usable targets are shown
- AND available actions keep their explicit semantic labels

### Requirement: Focus Microline for Domain Reinforcement

The system SHOULD display a concise focus microline in featured cards to reinforce domain positioning when focus text is available.

#### Scenario: Focus text is provided

- GIVEN a featured project with focus text
- WHEN the featured card is rendered
- THEN a short focus microline is shown in the card
- AND the microline content describes system-domain focus rather than UI styling

#### Scenario: Focus text is not provided

- GIVEN a featured project without focus text
- WHEN the featured card is rendered
- THEN the card renders without the focus microline
- AND no placeholder or broken copy is shown

### Requirement: Architecture View Interaction

The system MUST open architecture content through the existing overlay interaction model when the Architecture action is invoked for a featured project.

#### Scenario: Architecture action opens overlay content

- GIVEN a featured project with architecture view content
- WHEN the user activates the Architecture action
- THEN an overlay opens and displays the project architecture content
- AND the base Projects page remains available when the overlay closes

#### Scenario: Architecture action target is unavailable

- GIVEN a featured project with no architecture view content
- WHEN the featured card is rendered
- THEN the Architecture action is not shown
- AND invoking other available actions remains unaffected

### Requirement: Featured Card Accessibility

The system MUST provide keyboard-operable actions, perceivable labels, and stable interaction states for featured-card actions and architecture overlay behavior.

#### Scenario: Keyboard user activates a featured-card action

- GIVEN keyboard focus is on a featured-card action
- WHEN the user activates the action with standard keyboard interaction
- THEN the action performs the same behavior as pointer activation
- AND the focus state remains visible before and after activation

#### Scenario: Overlay closes and returns interaction context

- GIVEN the architecture overlay was opened from a featured-card action
- WHEN the user closes the overlay
- THEN interaction returns to the Projects context without trapping focus
- AND subsequent keyboard navigation continues through the page controls

### Requirement: Backward-Compatible Featured and Non-Featured Fallbacks

The system MUST preserve existing project-card functionality for records that only provide legacy fields and for non-featured variants not participating in request-05 enhancements.

#### Scenario: Legacy featured record without new metadata

- GIVEN a featured project record that only contains legacy card fields
- WHEN the project card is rendered
- THEN the card renders with safe fallback content for required sections
- AND the card remains functional without requiring request-05-only fields

#### Scenario: Non-featured card behavior remains unchanged

- GIVEN a non-featured project card variant
- WHEN Projects are rendered after request-05 changes
- THEN non-featured cards keep their prior behavior and structure
- AND no additional request-05 metadata is required for them to function
