---
id: 002-monorepo-client-server-split-scaffold-plan
aliases: []
tags:
  - architecture
  - monorepo
  - pnpm
  - nestjs
status: pending
---

# Plan de Scaffold - Workspace, Nest y Packages

## Objetivo

Crear el skeleton de backend Nest y los packages compartidos directamente en la estructura objetivo, sin mover inicialmente la app Next existente. La migración física de Next a `apps/profile/web/portal` queda para un commit posterior y separado.

## Fase 1 - Workspace Base

Crear `apps/profile/service/api`, `apps/profile/web/portal`, `packages/contracts` y `packages/shared`. Mantener temporalmente la app Next en la raíz como workspace package existente. El workspace debe incluir la raíz, `apps/**/*` y `packages/*`.

Agregar scripts raíz para ejecutar `dev`, `build`, `lint`, `typecheck` y `test` del API.

## Fase 2 - `packages/contracts`

Crear un package framework-agnostic para schemas Zod y tipos inferidos:

```text
packages/contracts/src/profile/
  public.ts
  settings.ts
  contact-points.ts
```

Contratos iniciales: `ProfilePublicResponse`, `ProfileSettingsResponse`, `UpdateProfileSettingsRequest`, `ContactPointResponse`, `CreateContactPointRequest`, `UpdateContactPointRequest`, `ContactPointProvider` y `ContactPointType`.

`contracts` no puede importar Nest, Next, React, Drizzle ni módulos desde `apps`.

## Fase 3 - `packages/shared`

Crear utilidades puras compartidas, inicialmente limitadas a errores serializables, resultados de aplicación y helpers de validación o serialización con uso concreto. No mover `src/lib` masivamente.

## Fase 4 - Skeleton Nest

Crear `apps/profile/service/api` con `src/main.ts`, `src/app.module.ts` y módulos `profile/public`, `profile/settings` y `profile/contact-points`.

Dependencias mínimas: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `zod`, `@portfolio/contracts` y `@portfolio/shared`.

Endpoints iniciales:

```text
GET    /health
GET    /profile/public
GET    /profile/settings
PATCH  /profile/settings
GET    /profile/contact-points
POST   /profile/contact-points
PATCH  /profile/contact-points/:id
DELETE /profile/contact-points/:id
```

El skeleton debe iniciar y responder `/health` antes de integrar persistencia real.

## Fase 5 - Backend Profile Modules

Organizar el vertical slice en `domain`, `application`, `infrastructure`, `public`, `settings` y `contact-points`. `profile/public` es el read model. No crear una layer `profile/assembler`.

`settings` es dueño de identidad/configuración. `contact-points` es dueño de socials, email y canales de contacto.

## Fase 6 - Adapters

Implementar primero repositories memory para validar controllers y use cases. Después implementar PostgreSQL usando las tablas existentes `site_profile` y `site_contact_point`.

El adapter Nest debe ser dueño de consultas, writes, orden, visibilidad y unicidad. No importar infraestructura desde Next.

## Fase 7 - Auth y Runtime Modes

Proteger settings y contact points con autenticación/autorización, dejar `profile/public` público, devolver `401`/`403` consistentemente, devolver `403 read_only` en modo snapshot y usar el logger centralizado.

## Fase 8 - Integración Cliente

Crear HTTP adapters en `apps/profile/web/portal/src/features/profile/api/`. Durante la transición pueden vivir temporalmente bajo `src/features/profile/api`. El cliente solo puede depender de contracts, shared y HTTP adapters.

## Orden de Commits

1. `chore(workspace): scaffold pnpm workspace packages`
2. `feat(contracts): add profile http contracts`
3. `feat(shared): add framework agnostic shared package`
4. `feat(profile-api): scaffold nest profile service`
5. `feat(profile-api): add profile memory adapters`
6. `feat(profile-api): add profile postgres adapters`
7. `docs(epics): link nest scaffold evidence`

## Validación

```text
pnpm install --frozen-lockfile
pnpm --filter @portfolio/contracts typecheck
pnpm --filter @portfolio/shared typecheck
pnpm --filter @portfolio/profile-api typecheck
pnpm --filter @portfolio/profile-api test
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run build
```

## Criterios de Salida

- El API Nest inicia independientemente de Next y `/health` responde correctamente.
- Los packages no dependen de `apps`.
- Backend es dueño de persistence y writes de profile.
- Frontend no importa DB, Drizzle ni application backend.
- La app Next raíz sigue funcionando durante la transición.
