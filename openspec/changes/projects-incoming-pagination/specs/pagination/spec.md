# Pagination Specification

## Purpose

Define client-side pagination behavior for the projects grid while preserving existing filter parameters in the URL.

## Requirements

### Requirement: Paged Grid Slice

The system MUST display only the projects for the active page based on the current filters.

#### Scenario: Page slice applies after filtering

- GIVEN a filtered projects dataset spanning multiple pages
- WHEN the user views page 2
- THEN only projects belonging to page 2 are displayed

#### Scenario: Edge case when page exceeds available items

- GIVEN a filtered projects dataset with fewer items than the requested page
- WHEN the user navigates to an out-of-range page
- THEN the grid displays no projects for that page

### Requirement: Page Parameter Persistence

The system MUST preserve existing filter parameters when changing the page and MUST store the active page in the URL as `page`.

#### Scenario: Page navigation preserves filters

- GIVEN the URL includes one or more filter parameters
- WHEN the user changes the page
- THEN the URL retains the filter parameters and updates the `page` parameter

#### Scenario: Edge case with missing page parameter

- GIVEN the URL includes filter parameters but no `page` parameter
- WHEN the projects page loads
- THEN the system defaults to page 1 without altering filter parameters

### Requirement: Page Count Copy

The system SHOULD reflect the total filtered project count independently of pagination.

#### Scenario: Total count reflects filtered results

- GIVEN filters are applied to the projects dataset
- WHEN the projects grid is rendered
- THEN the displayed count reflects the total number of filtered projects, not the current page size

#### Scenario: Edge case with zero results

- GIVEN filters that yield zero projects
- WHEN the projects grid is rendered
- THEN the displayed count is zero
