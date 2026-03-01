# Deployment Work Items Template (Azure DevOps + Jira)

Date: 2026-03-01
Source: `docs/release/technical-debt-backlog.md`

## Team Role Map (Default Owners)

- `@frontend-lead` - Frontend implementation owner
- `@platform-devops` - IaC, deployment, runtime platform owner
- `@qa-lead` - test strategy and release gate owner
- `@security-owner` - vulnerability and hardening owner
- `@product-owner` - scope, priority, and risk waiver owner

## Azure DevOps Template (Import-Friendly)

Use as parent-child links (`Epic -> User Story -> Task`) and `Predecessor` for dependencies.

| ID      | Work Item Type | Title                                               | Owner            | Depends On   | Estimate (SP) | Acceptance Criteria (summary)                               |
| ------- | -------------- | --------------------------------------------------- | ---------------- | ------------ | ------------- | ----------------------------------------------------------- |
| TD-01   | Epic           | Security and dependency hardening                   | @security-owner  | -            | 16            | Runtime dependency risk reduced and security gate enabled   |
| TD-01.1 | User Story     | Upgrade/patch `next` to non-vulnerable range        | @frontend-lead   | -            | 5             | No high/critical advisory in deploy scope; build+tests pass |
| TD-01.2 | User Story     | Add dependency security gate to CI                  | @platform-devops | TD-01.1      | 3             | CI fails on high/critical runtime vulnerabilities           |
| TD-01.3 | User Story     | Harden article content rendering path               | @frontend-lead   | TD-01.1      | 8             | Remove ad-hoc sanitizer path and add security tests         |
| TD-02   | Epic           | Test signal reliability                             | @qa-lead         | -            | 16            | Green CI reflects real user-path validation                 |
| TD-02.1 | User Story     | Reduce E2E skip debt in critical flows              | @qa-lead         | -            | 8             | Critical flows run without skips                            |
| TD-02.2 | User Story     | Enforce skip-budget policy in CI                    | @platform-devops | TD-02.1      | 3             | New skips require reason + expiration + issue link          |
| TD-02.3 | User Story     | Stabilize env-dependent E2E fixtures                | @qa-lead         | TD-02.1      | 5             | Deterministic fixtures remove flaky/conditional skips       |
| TD-03   | Epic           | Deployment contract alignment                       | @platform-devops | TD-01, TD-02 | 11            | Mock/preview/prod behavior is explicit and validated        |
| TD-03.1 | User Story     | Remove hardcoded mock default from production image | @platform-devops | -            | 5             | Prod guardrail blocks accidental mock mode                  |
| TD-03.2 | User Story     | Replace static/mock-only release checklist          | @product-owner   | TD-03.1      | 3             | Runbook aligned to Vercel + Azure rollout                   |
| TD-03.3 | User Story     | Add health endpoint and probe contract              | @frontend-lead   | TD-03.1      | 3             | Health route implemented and wired to probes                |
| TD-04   | Epic           | Architecture hygiene                                | @frontend-lead   | TD-03        | 10            | UI/domain boundaries are cleaner and testable               |
| TD-04.1 | User Story     | Refactor SkillSelector to React-state approach      | @frontend-lead   | -            | 5             | No direct DOM query manipulation in interaction logic       |
| TD-04.2 | User Story     | Move UI schema into domain boundary                 | @frontend-lead   | TD-04.1      | 3             | Domain ownership restored and imports updated               |
| TD-04.3 | User Story     | Remove deprecated `@testing-library/react-hooks`    | @qa-lead         | TD-02.3      | 2             | Uses modern `renderHook` from `@testing-library/react`      |
| TD-05   | Epic           | Auth and integration readiness                      | @product-owner   | TD-03        | 8             | Auth mode contracts are explicit per environment            |
| TD-05.1 | User Story     | Define auth operating modes and CI contract         | @product-owner   | -            | 3             | `disabled/mock/real` mode matrix documented and validated   |
| TD-05.2 | User Story     | Implement real provider adapter skeleton and guard  | @frontend-lead   | TD-05.1      | 5             | Real adapter contract exists with safe fallback             |

## Jira Template (Issue Keys + Links)

Suggested issue type mapping:

- Epic -> Epic
- User Story -> Story
- Actionable implementation step -> Sub-task

Recommended labels:

- `prod-readiness`
- `tech-debt`
- `vercel`
- `azure`
- `security`

Copy template per issue:

```md
Summary: [TD-XX.X] <title>
Issue Type: Story
Epic Link: TD-XX
Owner: @role
Story Points: <n>
Dependencies: <issue keys>
Labels: prod-readiness, tech-debt

Description:

- Context:
- Problem:
- Scope:

Acceptance Criteria:

- [ ]
- [ ]

## Rollback Plan:
```

## Dependency Graph (Execution Order)

1. TD-01.1 -> TD-01.2 -> TD-01.3
2. TD-02.1 -> TD-02.2 and TD-02.3
3. TD-03.1 -> TD-03.2 and TD-03.3
4. TD-04.\* after TD-03 baseline
5. TD-05.1 -> TD-05.2
