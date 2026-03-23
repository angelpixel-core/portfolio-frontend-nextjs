# UI Project Teaser Specification

## Purpose

Define project card interaction gating and teaser modal behavior for non-live projects.

## Requirements

### Requirement: Non-live Project Cards Are Not Navigable

The system MUST prevent navigation to project detail pages when a project status is not `live`.

#### Scenario: Non-live card click opens teaser modal

- GIVEN a project card with `status` set to `in-progress`
- WHEN the user activates the card
- THEN the system opens the teaser modal
- AND the system does not navigate to the project detail route

#### Scenario: Planned card activation does not navigate

- GIVEN a project card with `status` set to `planned`
- WHEN the user activates the card
- THEN the system does not navigate to the project detail route

### Requirement: Live Project Cards Remain Navigable

The system MUST allow navigation to project detail pages when a project status is `live`.

#### Scenario: Live card click navigates

- GIVEN a project card with `status` set to `live`
- WHEN the user activates the card
- THEN the system navigates to the project detail route

### Requirement: Teaser Modal Provides Chat Overlay CTA

The system MUST present a teaser modal for non-live projects with a single CTA that opens the ChatOverlay contact form.

#### Scenario: CTA opens ChatOverlay

- GIVEN the teaser modal is open for a non-live project
- WHEN the user activates the CTA
- THEN the ChatOverlay contact form opens

#### Scenario: CTA includes project context when available

- GIVEN the teaser modal is open for a project with a name
- WHEN the user activates the CTA
- THEN the ChatOverlay contact form receives the project name as context
