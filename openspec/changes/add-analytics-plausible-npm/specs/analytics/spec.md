# Analytics Specification

## Purpose

Define production-only Plausible analytics initialization and event tracking for CTA, navigation, and content engagement.

## Requirements

### Requirement: Production-Only Initialization

The system MUST initialize Plausible tracking only when `NODE_ENV` is `production` and required Plausible configuration values are present.
The system MUST NOT initialize Plausible tracking in non-production environments.

#### Scenario: Initialize analytics in production

- GIVEN `NODE_ENV` is `production` and Plausible configuration values are set
- WHEN the application client initializes
- THEN Plausible tracking is initialized
- AND initialization occurs only once per application session

#### Scenario: Skip initialization outside production

- GIVEN `NODE_ENV` is not `production`
- WHEN the application client initializes
- THEN Plausible tracking is not initialized

### Requirement: Data-Domain and Host Configuration

The system MUST configure Plausible with `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` as the data-domain value and `NEXT_PUBLIC_PLAUSIBLE_HOST` as the host.
The system MUST NOT initialize tracking when either configuration value is missing.

#### Scenario: Configure tracker with domain and host

- GIVEN `NODE_ENV` is `production`
- AND `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and `NEXT_PUBLIC_PLAUSIBLE_HOST` are set
- WHEN Plausible tracking is initialized
- THEN the tracker uses the configured data-domain and host values

#### Scenario: Missing configuration prevents initialization

- GIVEN `NODE_ENV` is `production`
- AND `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is missing or `NEXT_PUBLIC_PLAUSIBLE_HOST` is missing
- WHEN the application client initializes
- THEN Plausible tracking is not initialized

### Requirement: Event Taxonomy Coverage

The system MUST track the following custom events for user interactions:

- CTA: `cta_resume_click`, `cta_book_call_click`, `cta_contact_click`
- Navigation: `nav_primary_click`, `nav_menu_click`, `nav_footer_click`
- Content & Engagement: `article_view`, `project_view`, `project_demo_click`, `project_architecture_click`, `details_expand`, `social_click`
  The system SHOULD include event properties when available: `label`, `href`, `slug`, `section`, `source`.

#### Scenario: Track a CTA click with properties

- GIVEN a user clicks a tracked CTA element
- WHEN the click is handled
- THEN the corresponding CTA event name is sent
- AND the event includes available properties such as `label` and `href`

#### Scenario: Track an event without optional properties

- GIVEN a tracked interaction occurs without optional metadata
- WHEN the event is sent
- THEN the event is still emitted with the correct event name
- AND missing optional properties do not prevent sending the event

### Requirement: Content View Events

The system MUST emit `article_view` when a user visits an article detail page.
The system MUST emit `project_view` when a user visits a project detail page.

#### Scenario: Track article view on page visit

- GIVEN a user navigates to an article detail page
- WHEN the page is rendered for the user
- THEN an `article_view` event is sent

#### Scenario: Track project view on page visit

- GIVEN a user navigates to a project detail page
- WHEN the page is rendered for the user
- THEN a `project_view` event is sent

### Requirement: No-Tracking in Development or Tests

The system MUST treat `trackEvent` as a no-op when `NODE_ENV` is not `production`.
The system MUST NOT emit events or perform network calls for analytics in development or test environments.

#### Scenario: No-op tracking in development

- GIVEN `NODE_ENV` is `development`
- WHEN a tracked interaction occurs
- THEN no analytics event is emitted

#### Scenario: No-op tracking in tests

- GIVEN `NODE_ENV` is `test`
- WHEN a tracked interaction occurs
- THEN no analytics event is emitted
