# Story 19.2: Dockerfile Production Rewrite

Status: ready-for-dev

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

- [ ] Task 1: Modificar `next.config.js` — conditional standalone output (AC: #5, #8)
  - [ ] Agregar `output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined` al config
  - [ ] Verificar que `npm run build` sin `NEXT_OUTPUT` no genera standalone output
  - [ ] Verificar que `NEXT_OUTPUT=standalone npm run build` genera `.next/standalone/`
- [ ] Task 2: Crear `.dockerignore` (AC: #4)
  - [ ] Excluir: `node_modules`, `.next`, `.git`, `e2e`, `coverage`, `_bmad-output`, `*.md`, `.env*`, `.github`, `.husky`, `.vscode`, `.cursor`, `.agents`
  - [ ] NO excluir: `public/`, `src/`, `package.json`, `package-lock.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`
- [ ] Task 3: Reescribir `Dockerfile.prod` — multi-stage (AC: #1, #2, #3, #6, #7)
  - [ ] **Stage 1 (deps):** `node:20-alpine AS deps` → copiar package*.json → `npm ci --legacy-peer-deps`
  - [ ] **Stage 2 (builder):** copiar source + node_modules de deps → `NEXT_OUTPUT=standalone npm run build`
  - [ ] **Stage 3 (runner):** `node:20-alpine AS runner` → crear user nextjs (UID 1001) → copiar standalone output + public + static
  - [ ] Agregar `HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:4000/ || exit 1`
  - [ ] `ENV PORT=4000`, `EXPOSE 4000`, `USER nextjs`
  - [ ] `CMD ["node", "server.js"]` (standalone output crea server.js)
- [ ] Task 4: Verificar build Docker (AC: #6, #7)
  - [ ] `docker build -f Dockerfile.prod -t portfolio-prod .`
  - [ ] `docker images portfolio-prod` — verificar < 200MB
  - [ ] `docker run -p 4000:4000 portfolio-prod` — verificar que responde en localhost:4000
- [ ] Task 5: Verificar que build normal sigue funcionando (AC: #8)
  - [ ] `npm run build` sin NEXT_OUTPUT → success, sin .next/standalone/
  - [ ] `npm test` → todos los tests siguen pasando

## Dev Notes

### Estado Actual del Dockerfile

El `Dockerfile.prod` actual es un **single-stage build** con la mayoría del multi-stage comentado. Problemas:
- Usa `node:20.9.0` (no Alpine, imagen enorme ~900MB+)
- Corre como root
- No tiene HEALTHCHECK
- No usa standalone output (copia TODO node_modules al runtime)
- `.dockerignore` no existe → copia `.git`, `e2e`, `coverage`, etc.

### Patrón Multi-Stage para Next.js

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_OUTPUT=standalone
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:4000/ || exit 1
CMD ["node", "server.js"]
```

### Standalone Output Condicional

**Crítico:** El `output: "standalone"` cambia cómo Next.js genera el build. Para que el build normal (Vercel) no se vea afectado, usar env var condicional:

```javascript
// next.config.js
output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
```

### `--legacy-peer-deps` Requerido

El proyecto tiene conflictos de peer deps documentados en CLAUDE.md. El `npm ci` en Docker DEBE usar `--legacy-peer-deps` o fallará con ERESOLVE.

### Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| `critters` devDep requiere libc | Alpine incluye musl; si falla, agregar `libc6-compat` |
| standalone output cambia serving | Solo se activa con `NEXT_OUTPUT=standalone`, build normal no se afecta |
| Image cache invalidation | `.dockerignore` + layer ordering (deps first) maximiza cache |

### Project Structure Notes

- `Dockerfile.prod` en root del proyecto (ubicación actual, mantener)
- `.dockerignore` en root (nuevo)
- `next.config.js` — solo agregar conditional output, no modificar nada más
- No se necesitan cambios en `package.json` ni en CI

### References

- [Source: _bmad-output/epics/epic-19-production-readiness.md#Story 19.2]
- [Source: _bmad-output/analysis/production-gap-execution-plan-2026-02-11.md#C4]
- [Docs: Next.js Standalone Output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
- [Docs: Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

| Archivo | Acción | Estado |
|---------|--------|--------|
| `next.config.js` | MODIFICAR — agregar conditional standalone output | pendiente |
| `.dockerignore` | CREAR | pendiente |
| `Dockerfile.prod` | REESCRIBIR — multi-stage build | pendiente |
