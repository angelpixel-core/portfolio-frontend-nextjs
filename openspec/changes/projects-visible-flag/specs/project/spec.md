# Project Specification

## Purpose

Define project visibility behavior for project fetching and filtering.

## Requirements

### Requirement: Default visibility filtering

The system MUST return only projects with `visible: true` when no visibility parameter is provided.

#### Scenario: Default fetch excludes hidden projects

- GIVEN a projects data set that includes both `visible: true` and `visible: false` items
- WHEN a consumer fetches projects without a visibility parameter
- THEN the response contains only projects with `visible: true`
- AND no projects with `visible: false` are included

#### Scenario: Default fetch preserves non-visibility filters

- GIVEN a projects data set with mixed visibility and varying priority values
- WHEN a consumer fetches projects without a visibility parameter and applies priority ordering
- THEN the ordering is applied to the visible-only set

### Requirement: Explicit visibility parameter

The system MUST support a visibility parameter with the values `visible`, `hidden`, and `all`.

#### Scenario: Visible-only parameter

- GIVEN a projects data set that includes both `visible: true` and `visible: false` items
- WHEN a consumer fetches projects with `visibility = "visible"`
- THEN the response contains only projects with `visible: true`

#### Scenario: Hidden-only parameter

- GIVEN a projects data set that includes both `visible: true` and `visible: false` items
- WHEN a consumer fetches projects with `visibility = "hidden"`
- THEN the response contains only projects with `visible: false`

#### Scenario: All parameter

- GIVEN a projects data set that includes both `visible: true` and `visible: false` items
- WHEN a consumer fetches projects with `visibility = "all"`
- THEN the response contains both visible and hidden projects

### Requirement: Visibility filtering precedence

The system MUST apply visibility filtering before any UI-specific filtering (technology, priority, pagination).

#### Scenario: Visibility filtering precedes tech filtering

- GIVEN a projects data set that includes hidden projects matching a technology filter
- WHEN a consumer fetches projects with a technology filter and default visibility
- THEN hidden projects are excluded before technology filtering is applied

#### Scenario: Visibility filtering precedes pagination

- GIVEN a projects data set with mixed visibility and multiple pages of results
- WHEN a consumer fetches projects with pagination and `visibility = "visible"`
- THEN pagination is calculated on the visible-only set

### Requirement: Invalid visibility parameter handling

The system MUST treat any visibility parameter value outside `visible`, `hidden`, or `all` as `visible` and MUST NOT throw an error.

#### Scenario: Invalid visibility parameter defaults to visible

- GIVEN a projects data set that includes both `visible: true` and `visible: false` items
- WHEN a consumer fetches projects with `visibility = "invalid"`
- THEN the response contains only projects with `visible: true`

#### Scenario: Undefined visibility parameter defaults to visible

- GIVEN a projects data set that includes both `visible: true` and `visible: false` items
- WHEN a consumer fetches projects with `visibility = undefined`
- THEN the response contains only projects with `visible: true`
