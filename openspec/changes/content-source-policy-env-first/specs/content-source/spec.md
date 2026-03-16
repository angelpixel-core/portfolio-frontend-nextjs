# Content Source Specification

## Purpose

Define a centralized policy for resolving content sources with environment-first precedence, explicit HTTP fallback, and strict validation behavior.

## Requirements

### Requirement: Env-First Resolution Order

The system MUST attempt to resolve content from environment configuration first and MUST fall back to HTTP only when the environment source is absent.

#### Scenario: Environment source present

- GIVEN the environment source for a content domain is present
- WHEN the resolver is invoked for that domain
- THEN the resolver MUST return the environment-sourced content
- AND the resolver MUST NOT call the HTTP fallback

#### Scenario: Environment source absent

- GIVEN the environment source for a content domain is not present
- WHEN the resolver is invoked for that domain
- THEN the resolver MUST call the HTTP fallback

### Requirement: Validation of Environment Content

The system MUST validate environment-sourced content against the domain schema before use.

#### Scenario: Valid environment content

- GIVEN the environment source for a domain is present and schema-valid
- WHEN the resolver is invoked for that domain
- THEN the resolver MUST return the validated content

#### Scenario: Invalid environment content

- GIVEN the environment source for a domain is present but schema-invalid
- WHEN the resolver is invoked for that domain
- THEN the resolver MUST surface a validation error
- AND the resolver MUST NOT fall back to HTTP

### Requirement: No Runtime Mock Selection

The system MUST NOT select mock content at runtime for production paths.

#### Scenario: Runtime invocation with mock flag set

- GIVEN runtime execution and a mock selection flag is set
- WHEN the resolver is invoked
- THEN the resolver MUST ignore mock selection
- AND the resolver MUST resolve using environment-first policy

#### Scenario: Runtime invocation without mock flag

- GIVEN runtime execution with no mock selection
- WHEN the resolver is invoked
- THEN the resolver MUST resolve using environment-first policy
