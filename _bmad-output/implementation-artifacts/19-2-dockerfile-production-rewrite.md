# Story 19.2: Dockerfile Production Rewrite

Status: review

## Story

As a **DevOps engineer**,
I want **a secure, optimized multi-stage Docker build for production**,
so that **container deployments are reproducible, lightweight, and use a non-root user**.

## Acceptance Criteria

1. `Dockerfile.prod` rewritten as multi-stage build: `deps` → `builder` → `runner`
2. Runner stage uses Alpine base image and non-root user (UID 1001)
3. HEALTHCHECK directive present in runner stage
4. `.dockerignore` excludes development files (node_modules, .next, .git, e2e, coverage, _bmad-output)
5. `next.config.js` conditionally adds `output: "standalone"` when `NEXT_OUTPUT=standalone` env var is set
6. Image builds successfully: `docker build -f Dockerfile.prod .`
7. Final image size < 200MB
8. `npm run build` (without Docker) continues working unchanged

## Tasks / Subtasks

- [x] Task 1: Modificar `next.config.js` — conditional standalone output (AC: #5, #8)
  - [x] Agregar `output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined` dentro de `nextConfig` (después de `productionBrowserSourceMaps`)
  - [x] Verificar que `npm run build` sin `NEXT_OUTPUT` no genera standalone output
  - [x] Verificar que `NEXT_OUTPUT=standalone npm run build` genera `.next/standalone/`
  - [x] Limpiar `.next/standalone/` después de verificar para no contaminar working tree
- [x] Task 2: Crear `.dockerignore` (AC: #4)
  - [x] Excluir: `node_modules`, `.next`, `.git`, `e2e`, `coverage`, `_bmad-output`, `_bmad`, `*.md`, `.env*`, `.github`, `.husky`, `.vscode`, `.cursor`, `.agents`, `.playwright-mcp`, `docker-compose*.yml`, `Makefile`, `jest.config.cjs`, `playwright.config.ts`, `.lhci`, `.lighthouseci`, `scripts/`
  - [x] NO excluir: `public/`, `src/`, `package.json`, `package-lock.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `.env.template` (referencia, no se copia al runtime)
  - [x] Incluir explícitamente lo necesario con `!` si se usan patrones amplios
- [x] Task 3: Reescribir `Dockerfile.prod` — multi-stage (AC: #1, #2, #3, #6, #7)
  - [x] **Stage 1 (deps):** `node:20-alpine AS deps` → `apk add --no-cache libc6-compat` → copiar package*.json → `npm ci --legacy-peer-deps`
  - [x] **Stage 2 (builder):** copiar source + node_modules de deps → set env vars de build → `npm run build`
  - [x] **Stage 3 (runner):** `node:20-alpine AS runner` → crear user nextjs (UID 1001) → copiar standalone output + public + static
  - [x] Agregar `HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:4000/ || exit 1`
  - [x] `ENV PORT=4000 HOSTNAME=0.0.0.0`, `EXPOSE 4000`, `USER nextjs`
  - [x] `CMD ["node", "server.js"]` (standalone output crea server.js)
- [x] Task 4: Verificar build Docker (AC: #6, #7)
  - [x] `docker build -f Dockerfile.prod -t portfolio-prod .` — exitoso
  - [x] `docker images portfolio-prod` — **177MB** < 200MB ✓
  - [x] `docker run -p 4000:4000 portfolio-prod` — responde en localhost:4000 con HTTP 200
  - [x] `curl -sI http://localhost:4000/` — 6 security headers presentes (CSP, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- [x] Task 5: Verificar que build normal sigue funcionando (AC: #8)
  - [x] `npm run build` sin NEXT_OUTPUT → success, sin .next/standalone/
  - [x] `npm test` → 983 tests pasando
  - [x] `npm run lint` → 0 warnings

## Dev Notes

### Estado Actual del Dockerfile

El `Dockerfile.prod` actual es un **single-stage build** con la mayoría del multi-stage comentado. Problemas:
- Usa `node:20.9.0` (no Alpine, imagen ~900MB+)
- Corre como root (security risk)
- No tiene HEALTHCHECK
- No usa standalone output (copia TODO node_modules al runtime)
- `.dockerignore` no existe → copia `.git`, `e2e`, `coverage`, etc.
- Usa `npm i` en vez de `npm ci` (no reproducible)
- `CMD ["npm", "run", "start"]` (overhead de npm process manager)

### Estado Actual de `next.config.js` (Post-Stories 19.3/19.5)

**CRÍTICO:** `next.config.js` fue modificado por Stories 19.3 y 19.5. El archivo actual contiene:
- Líneas 1-19: Build-time env validation (useMocks, SITE_URL warning)
- Líneas 21-36: Security headers (isDev, cspHeader template)
- Líneas 38-102: `nextConfig` object con images, experimental, compiler, headers()

La propiedad `output` debe agregarse **dentro de `nextConfig`**, no fuera. Ubicación recomendada: después de `productionBrowserSourceMaps: true` (línea 42).

```javascript
// next.config.js — agregar SOLO esta línea dentro de nextConfig:
output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
```

### Dockerfile Multi-Stage Completo (Referencia)

Basado en el [Dockerfile oficial de Next.js](https://github.com/vercel/next.js/tree/canary/examples/with-docker):

```dockerfile
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_OUTPUT=standalone
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_USE_MOCKS=true
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:4000/ || exit 1
CMD ["node", "server.js"]
```

### Build-Time Environment Variables (CRÍTICO)

El build de Next.js embebe `NEXT_PUBLIC_*` vars en compile time. Para Docker:

| Variable | Valor en Docker | Razón |
|----------|----------------|-------|
| `NEXT_OUTPUT=standalone` | Requerido | Activa standalone output |
| `NEXT_TELEMETRY_DISABLED=1` | Recomendado | No enviar telemetría durante build |
| `NEXT_PUBLIC_USE_MOCKS=true` | Requerido | Sin backend API, usar mock data |
| `SITE_URL` | NO requerido | El postbuild warning es aceptable en Docker (sitemap usa localhost fallback) |

**NO agregar** SITE_URL al Dockerfile — cada deployment lo configura via runtime env o build arg.

### `libc6-compat` — OBLIGATORIO

Alpine usa musl libc. El paquete `libc6-compat` es requerido por:
- `critters` (devDep, usado por `experimental.optimizeCss`)
- Cualquier binding nativo en node_modules
- Es la [recomendación oficial](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) de Next.js para Alpine

```dockerfile
RUN apk add --no-cache libc6-compat
```

### `HOSTNAME=0.0.0.0` — OBLIGATORIO

El standalone server de Next.js por defecto escucha en `127.0.0.1` (localhost), que NO es accesible desde fuera del container. **DEBE** configurarse `HOSTNAME=0.0.0.0` en el runner stage.

### `--legacy-peer-deps` — OBLIGATORIO

El proyecto tiene conflictos de peer deps documentados en CLAUDE.md y en CI (`npm ci --legacy-peer-deps`). Sin este flag, `npm ci` falla con ERESOLVE.

### `postbuild` Script — `next-sitemap`

El `package.json` tiene `"postbuild": "next-sitemap"`. Esto se ejecuta automáticamente después de `npm run build`. En Docker:
- `next-sitemap` genera `sitemap.xml` y `robots.txt` en `public/`
- Sin `SITE_URL`, usa fallback `localhost:3000` (warning, no error)
- Los archivos generados se copian al standalone via `COPY --from=builder /app/public ./public`

### Prerender Cache Permissions

El patrón oficial de Next.js incluye crear `.next` con permisos correctos ANTES de copiar standalone:

```dockerfile
RUN mkdir .next && chown nextjs:nodejs .next
```

Esto permite que el prerender cache funcione en runtime sin errores de permisos.

### Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| `critters` falla en Alpine | Build failure | `libc6-compat` instalado en stage deps |
| standalone output cambia serving | Build normal roto | Condicional via `NEXT_OUTPUT` env var |
| Image cache invalidation | Builds lentos | `.dockerignore` + layer ordering (deps first) |
| `HOSTNAME` mal configurado | Container no accesible | `HOSTNAME=0.0.0.0` explícito |
| `SITE_URL` missing en build | sitemap con localhost | Aceptable; configurar en deployment |
| `next-sitemap` postbuild falla | Build failure | No falla sin SITE_URL, solo warning |

### Scope Boundaries — Qué NO Modificar

| Archivo | Razón |
|---------|-------|
| `vercel.json` | No relacionado con Docker |
| `src/` (cualquier componente) | Docker es infra-only |
| `package.json` | Scripts y deps no cambian |
| `.github/workflows/ci.yml` | CI no usa Docker (usa npm directamente) |
| `docker-compose.dev.yml` | Es para dev (PostgreSQL + pgAdmin), no afectado |

### Previous Story Intelligence (19.1, 19.3)

**De Story 19.1 (Global Error Boundary):**
- Tests pasando: 983 totales (14 nuevos de error boundaries)
- `console.error` suppression pattern en tests
- No impacta Docker

**De Story 19.3 (CSP Headers):**
- `next.config.js` ahora tiene ~102 líneas (vs ~52 antes)
- Security headers se aplican via `headers()` async function
- Los headers se servirán automáticamente en standalone mode
- `isDev` variable usa `process.env.NODE_ENV` (correcto en Docker: `NODE_ENV=production` en runner)

**Lecciones comunes:**
- Siempre correr `npm run lint` después de cambios en next.config.js
- Verificar build completo: `npm run build` antes de marcar task como hecho
- Los 983 tests actuales deben seguir pasando

### Project Structure Notes

- `Dockerfile.prod` en root del proyecto (ubicación actual, mantener)
- `.dockerignore` en root (nuevo)
- `next.config.js` — solo agregar `output` condicional, no modificar nada más
- No se necesitan cambios en `package.json` ni en CI

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.2]
- [Source: _bmad-output/analysis/production-gap-execution-plan-2026-02-11.md#C4]
- [Source: next.config.js:38-102 — current nextConfig after stories 19.3/19.5]
- [Source: Dockerfile.prod — current single-stage build to replace]
- [Source: _bmad-output/implementation-artifacts/19-3-content-security-policy-headers.md — next.config.js changes]
- [Docs: Next.js Standalone Output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Docs: Next.js Official Docker Example](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [Docs: Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (Amelia dev agent)

### Debug Log References

- Docker build initially failed due to case-sensitive import: `@/links/NavigationItemLink/Skeleton` → file is `skeleton.jsx` (lowercase). macOS is case-insensitive so local builds pass, but Alpine Linux (Docker) is case-sensitive. Fixed import to lowercase.

### Completion Notes List

- All 8 Acceptance Criteria verified and passing
- Docker image size: 177MB (< 200MB target)
- Container responds on localhost:4000 with HTTP 200 and all 6 security headers
- Normal `npm run build` unaffected (no standalone output without `NEXT_OUTPUT`)
- 983 tests passing, 0 lint warnings
- Bonus fix: case-sensitivity bug in `NavigationItemLinksSkeleton.jsx` (pre-existing from Story 14-11 rename)

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `next.config.js` | MODIFICAR — agregar conditional standalone output (línea 44) | hecho |
| `.dockerignore` | CREAR — exclusiones para Docker build context | hecho |
| `Dockerfile.prod` | REESCRIBIR — multi-stage build (deps → builder → runner) | hecho |
| `src/ui/organisms/Menu/skeletons/NavigationItemLinksSkeleton.jsx` | FIX — case-sensitive import path (bonus) | hecho |

## Change Log

- 2026-02-11: Story created with basic Dockerfile plan
- 2026-02-12: Enhanced — added libc6-compat requirement, HOSTNAME=0.0.0.0, build-time env vars, prerender cache permissions, previous story intelligence (19.1/19.3), current next.config.js state, official Next.js Docker pattern reference, postbuild script handling
- 2026-02-12: Implementation complete — all 5 tasks done, all ACs verified, status → review
