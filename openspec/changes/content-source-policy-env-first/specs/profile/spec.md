# Profile Domain Specification

## Purpose

Ensure the profile domain uses the centralized env-first content policy with strict validation and no runtime mocks.

## Requirements

### Requirement: Env-First with HTTP Fallback

The profile domain MUST resolve its content using the centralized resolver, preferring environment configuration and falling back to HTTP only when the environment source is absent.

#### Scenario: Environment content present

- GIVEN the profile domain environment source is present
- WHEN the profile domain requests its content
- THEN the domain MUST return the environment-sourced content
- AND the domain MUST NOT call the HTTP fallback

#### Scenario: Environment content absent

- GIVEN the profile domain environment source is absent
- WHEN the profile domain requests its content
- THEN the domain MUST call the HTTP fallback

### Requirement: Domain Schema Validation

The profile domain MUST validate environment-sourced content against its schema before use.

#### Scenario: Valid environment content

- GIVEN the profile domain environment source is schema-valid
- WHEN the profile domain requests its content
- THEN the domain MUST return the validated content

#### Scenario: Invalid environment content

- GIVEN the profile domain environment source is schema-invalid
- WHEN the profile domain requests its content
- THEN the domain MUST surface a validation error
- AND the domain MUST NOT fall back to HTTP

### Requirement: Test-Only Mocks

The profile domain MUST NOT use mocks at runtime and MAY use mocks only in test layers.

#### Scenario: Runtime access

- GIVEN runtime execution
- WHEN the profile domain requests its content
- THEN the domain MUST NOT select mock data

#### Scenario: Test access

- GIVEN test execution
- WHEN the profile domain requests its content with test-provided mocks
- THEN the domain MAY use the test-provided mocks
