# Navigation Specification

## Purpose

Define responsive social-link visibility behavior so desktop header socials are curated for focus while mobile menu social behavior remains unchanged.

## Requirements

### Requirement: Desktop Header Social Curation

The system MUST limit desktop header social visibility to the curated providers GitHub and LinkedIn, and SHALL NOT surface non-curated providers in desktop header social slots.

#### Scenario: Desktop header shows curated providers only

- GIVEN social providers include GitHub, LinkedIn, Twitter, and Dribbble
- WHEN the header is rendered at desktop-equivalent breakpoints
- THEN only GitHub and LinkedIn are visible in desktop header social locations
- AND Twitter and Dribbble are not shown in those desktop header social locations

#### Scenario: One curated desktop provider is unavailable

- GIVEN only one curated provider has usable data
- WHEN the desktop header is rendered
- THEN the available curated provider is shown
- AND non-curated providers are not used as replacement in desktop header social locations

### Requirement: Mobile Social Set Preservation

The system MUST preserve existing mobile menu social behavior and MAY show the broader provider set on mobile surfaces independent of desktop curation.

#### Scenario: Mobile menu retains broader provider set

- GIVEN social providers include GitHub, LinkedIn, Twitter, and Dribbble
- WHEN the menu is rendered on mobile surfaces
- THEN the mobile menu social area includes the same providers as before this change
- AND desktop curation rules do not reduce mobile provider visibility

#### Scenario: Desktop curation is active across breakpoints

- GIVEN desktop and mobile social rendering rules are both configured
- WHEN the viewport changes between mobile and desktop breakpoints
- THEN desktop views apply curated provider visibility
- AND mobile views continue using mobile-specific social visibility behavior

### Requirement: Navigation Priority and Stability

The system SHOULD keep primary navigation as the dominant header focus on desktop after social curation, and MUST preserve existing menu and navigation interaction behavior across target breakpoints.

#### Scenario: Desktop header prioritizes navigation links

- GIVEN a desktop viewport with header navigation and social links
- WHEN the header is rendered with curated socials
- THEN primary navigation remains visually and functionally prominent
- AND social links appear as secondary actions

#### Scenario: Menu interactions remain stable after social curation

- GIVEN a user opens and closes menu/navigation controls on supported breakpoints
- WHEN social visibility rules are applied
- THEN menu open/close and navigation activation behavior remain consistent with prior behavior
- AND no breakpoint-specific regression blocks access to navigation destinations
