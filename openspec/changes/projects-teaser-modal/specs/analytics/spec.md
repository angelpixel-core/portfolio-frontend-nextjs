# Analytics Specification

## Purpose

Define analytics events for teaser interactions and contact delivery outcomes.

## Requirements

### Requirement: Teaser Interaction Events

The system MUST emit analytics events for teaser modal interactions.

#### Scenario: Teaser modal open event

- GIVEN a non-live project card is activated
- WHEN the teaser modal opens
- THEN the system emits the `teaser_opened` event

#### Scenario: Teaser CTA click event

- GIVEN the teaser modal is open
- WHEN the user activates the CTA
- THEN the system emits the `teaser_cta_clicked` event

### Requirement: Contact Delivery Outcome Events

The system MUST emit analytics events for contact submission outcomes.

#### Scenario: Message sent event

- GIVEN a valid contact submission is accepted
- WHEN the email is sent successfully
- THEN the system emits the `message_sent` event

#### Scenario: Spam blocked event

- GIVEN a contact submission is flagged as spam
- WHEN the submission is handled
- THEN the system emits the `spam_blocked` event

#### Scenario: Rate limited event

- GIVEN a contact submission exceeds the rate limit
- WHEN the submission is rejected
- THEN the system emits the `rate_limited` event
