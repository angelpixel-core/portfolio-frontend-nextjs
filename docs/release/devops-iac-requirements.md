# DevOps IaC Requirements (Vercel + Azure)

Date: 2026-03-01
Audience: DevOps / Platform Engineering
App: `portfolio-frontend-nextjs`

## 1) Objective

Provide a production-ready infrastructure and deployment baseline for two targets:

- Primary: Vercel (managed Next.js)
- Secondary: Azure (enterprise fallback / controlled hosting)

## 2) Source of Truth in Repo

- Build/start scripts: `package.json`
- Next runtime/security config: `next.config.js`
- Vercel project config: `vercel.json`
- Env contract: `.env.template`
- CI pipeline: `.github/workflows/ci.yml`
- Container image: `Dockerfile.prod`
- API URL composition: `src/lib/httpRequest/config.ts`

## 3) Mandatory Environment Contracts

### 3.1 Build-time public vars (`NEXT_PUBLIC_*`)

These are inlined in client bundles at build time (Next.js behavior).

Core set to explicitly define per environment:

- `NEXT_PUBLIC_USE_MOCKS`
- `NEXT_PUBLIC_API_HOST`
- `NEXT_PUBLIC_BACKEND_PORT`
- `NEXT_PUBLIC_OAUTH_ENABLED`
- `NEXT_PUBLIC_HOME_*` and other UI/profile/contact vars when needed

Important: changing these values requires a new deployment build.

### 3.2 Runtime server vars (non-public)

- `SITE_URL` (metadata/sitemap)
- platform secrets (tokens, credentials, integration keys)

Do not expose non-public secrets via `NEXT_PUBLIC_*`.

## 4) Common IaC Inputs (Both Platforms)

Minimum module inputs:

- `app_name`
- `environment` (`dev|staging|prod`)
- `region`
- `node_version` (pin to 20.x)
- `build_command` (`npm run build`)
- `start_command` (`npm run start` for managed runtime or container entrypoint)
- `env_public` map
- `env_private` map / secret references
- `domain` and TLS settings
- `observability_enabled` flags
- `alert_channels`

## 5) Vercel Requirements

## 5.1 Project and Build

- Use existing `vercel.json`:
  - `framework: nextjs`
  - `buildCommand: npm run build`
  - `installCommand: npm ci --legacy-peer-deps`
- Enforce Node 20 in project settings.

## 5.2 Environment Management

- Define vars for `Production`, `Preview`, `Development`.
- Use branch-specific overrides for preview where needed.
- Use `vercel env pull .env.local` for local parity.

## 5.3 Functions and Region

- Set function region close to backend/data source.
- If multi-region is needed, define supported region set per plan constraints.

## 5.4 Security and Governance

- Enable deployment protection for preview links.
- Restrict project access with least privilege.
- Keep sensitive values managed in Vercel env settings, not in repo.

## 5.5 Observability

- Capture deployment metadata and build logs.
- Monitor function latency, error rate, and cold start behavior.

## 6) Azure Requirements

## 6.1 Hosting Option Matrix

| Option                         | Use When                                  | Pros                                      | Cons                               |
| ------------------------------ | ----------------------------------------- | ----------------------------------------- | ---------------------------------- |
| App Service (Linux, container) | stable enterprise baseline, easy ops      | mature ops model, slots, identity support | fixed plan cost                    |
| Container Apps                 | variable traffic, modern autoscaling      | elastic, revision model, secret refs      | more platform complexity           |
| Static Web Apps (hybrid)       | static-first + hybrid features acceptable | managed DX                                | hybrid constraints/preview caveats |

Recommendation for this app now: **App Service (Linux, container)** as default secondary platform baseline.

## 6.2 App Service (Recommended Baseline)

Required IaC resources:

- Resource Group
- App Service Plan (Linux)
- Web App for Containers
- Container registry integration (if private image)
- Managed Identity
- Key Vault + references
- Diagnostic settings to Log Analytics
- Application Insights

Mandatory app settings:

- `WEBSITES_PORT=4000` (image serves on 4000)
- all required runtime env vars from `.env.template`

Operational settings:

- `always_on=true`
- health check path (implement and wire, e.g. `/healthz`)
- HTTPS only, minimum TLS policy

## 6.3 Container Apps (Alternative)

Required IaC resources:

- Container Apps Environment
- Container App
- Ingress config
- Secret store references
- Log Analytics workspace
- Managed Identity

Inputs:

- `target_port=4000`
- `min_replicas>=1` for prod SSR latency control
- CPU/memory profile
- autoscaling rules

## 6.4 Static Web Apps (Hybrid)

Use only if product constraints accept hybrid limitations.

Known considerations from official docs:

- hybrid support is preview
- size limits and configuration caveats
- middleware/routing exclusions for `/.swa/health.html`

## 7) Networking and Access Controls

Baseline controls:

- principle of least privilege for deploy identities
- egress restrictions where feasible
- private access to secrets store
- optional private endpoints / VNet integration for enterprise profile

## 8) Observability Baseline

Must have:

- centralized logs
- metrics dashboards (availability, p95 latency, 4xx/5xx)
- alerting thresholds and escalation path
- deployment markers in monitoring timeline

Suggested SLO starter:

- Availability: 99.9%
- p95 web response target per route class
- Error budget policy per release window

## 9) Runbooks (Required Before Go-Live)

- Deploy rollback procedure
- Secret rotation procedure
- Incident triage checklist
- Region failover strategy (if multi-region enabled)
- Hotfix path for dependency vulnerabilities

## 10) Handoff Payload to DevOps

Deliver the following with IaC request:

1. Environment matrix (`dev/staging/prod`) with exact variable names and ownership.
2. Chosen Azure target (App Service default unless explicitly changed).
3. Domain/DNS/TLS requirements.
4. Monitoring and alert policy.
5. Security controls and approval gates.

## Official References Used

- Next.js env vars (build-time vs runtime):
  - https://nextjs.org/docs/14/app/building-your-application/configuring/environment-variables
- Vercel env vars:
  - https://vercel.com/docs/projects/environment-variables
- Vercel function regions:
  - https://vercel.com/docs/functions/configuring-functions/region
- Azure App Service Node quickstart:
  - https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs
- Azure App Service app settings:
  - https://learn.microsoft.com/en-us/azure/app-service/configure-common
- Azure Container Apps env vars:
  - https://learn.microsoft.com/en-us/azure/container-apps/environment-variables
- Azure Static Web Apps Next.js hybrid tutorial:
  - https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-hybrid
