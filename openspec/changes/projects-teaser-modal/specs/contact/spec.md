# Contact Delivery Specification

## Purpose

Define contact submission validation, anti-spam controls, rate limiting, and email delivery behavior.

## Requirements

### Requirement: Contact Submission Validation

The system MUST validate contact submissions and reject invalid payloads.

#### Scenario: Valid payload is accepted

- GIVEN a contact submission with all required fields present
- WHEN the submission is processed
- THEN the system accepts the payload for further handling

#### Scenario: Invalid payload is rejected

- GIVEN a contact submission with missing required fields
- WHEN the submission is processed
- THEN the system rejects the payload with an error response

### Requirement: Honeypot and Timing Guards

The system MUST treat honeypot hits and minimum-time violations as spam and MUST NOT send email for those submissions.

#### Scenario: Honeypot field filled

- GIVEN a contact submission includes a non-empty honeypot field
- WHEN the submission is processed
- THEN the system treats the submission as spam
- AND the system does not send an email

#### Scenario: Submission too fast

- GIVEN a contact submission arrives before the minimum elapsed time
- WHEN the submission is processed
- THEN the system treats the submission as spam
- AND the system does not send an email

### Requirement: Rate Limiting

The system MUST enforce rate limits per client and MUST reject submissions that exceed the limit.

#### Scenario: Rate limit exceeded

- GIVEN a client exceeds the configured submission rate limit
- WHEN the submission is processed
- THEN the system rejects the submission with a rate limit response
- AND the system does not send an email

### Requirement: Email Delivery via Postmark

The system MUST send accepted contact submissions through the configured Postmark delivery channel.

#### Scenario: Email sent successfully

- GIVEN a valid, non-spam, non-rate-limited submission
- WHEN the system sends the message
- THEN the system returns a success response

#### Scenario: Email delivery failure

- GIVEN a valid, non-spam, non-rate-limited submission
- WHEN the email provider returns an error
- THEN the system returns an error response

### Requirement: Error Handling and Non-disclosure

The system SHOULD avoid disclosing anti-spam guard triggers in the response body.

#### Scenario: Honeypot detected response

- GIVEN a contact submission is flagged by a honeypot check
- WHEN the system responds
- THEN the response does not disclose the honeypot trigger
