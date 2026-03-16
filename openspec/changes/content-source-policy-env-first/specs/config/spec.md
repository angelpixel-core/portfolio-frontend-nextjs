# Configuration Specification

## Purpose

Define the unified environment key conventions and documentation expectations for content sourcing.

## Requirements

### Requirement: Unified Environment Keys Documentation

The system MUST document the unified environment keys for all content domains in `.env.template`.

#### Scenario: Template documents keys

- GIVEN a content domain is supported by the resolver
- WHEN `.env.template` is updated
- THEN the template MUST list the unified environment key for that domain

#### Scenario: Missing key documentation

- GIVEN a content domain is supported by the resolver
- WHEN `.env.template` omits its unified environment key
- THEN the configuration documentation MUST be considered incomplete

### Requirement: Environment Content File Convention Documentation

The system MUST document the environment-content JSON file convention in `.env.template` for domains that support file references.

#### Scenario: Template documents file convention

- GIVEN a content domain supports JSON file references
- WHEN `.env.template` is updated
- THEN the template MUST document the `src/environment-content/` convention

#### Scenario: Template omits file convention

- GIVEN a content domain supports JSON file references
- WHEN `.env.template` omits the file reference convention
- THEN the configuration documentation MUST be considered incomplete
