---
id: 01-shared-contracts
aliases: []
tags:
  - contracts
  - zod
  - profile
status: pending
---

# Task 01 - Shared Contracts

## Objetivo

Crear los contratos HTTP compartidos para `profile` en `packages/contracts`, sin importar schemas internos del dominio ni detalles de Next, Nest, Drizzle o PostgreSQL.

## Fase 1 - Package Boundary

- [x] Confirmar que `@portfolio/contracts` solo depende de `zod` y, opcionalmente, `@portfolio/shared`.
  - Evidence: [Contracts package](../../../packages/contracts/package.json)
- [x] Mantener `packages/contracts/src/index.ts` como entrypoint público.
  - Evidence: [Contracts entrypoint](../../../packages/contracts/src/index.ts)
- [x] Exportar el package mediante `@portfolio/contracts`, sin exigir imports a paths internos.
  - Evidence: [Contracts exports](../../../packages/contracts/package.json)
- [x] Confirmar que `packages/*` no importa desde `apps/*`.
  - Evidence: [Contracts source](../../../packages/contracts/src/index.ts), [Shared source](../../../packages/shared/src/index.ts)

## Fase 2 - Public Profile Contracts

- [x] Crear `ProfilePublicResponseSchema`.
- [x] Crear `ProfilesPublicResponseSchema`.
- [x] Incluir únicamente campos seguros para exposición pública.
- [x] Incluir `contactPoints` ya compuestos por el backend.
- [x] Excluir `identifier`, timestamps y metadata administrativa.
- [x] Exportar tipos inferidos desde Zod.
  - Evidence: [Public contracts](../../../packages/contracts/src/profile/public.ts)

## Fase 3 - Profile Settings Contracts

- [x] Crear `ProfileSettingsResponseSchema`.
- [x] Crear `UpdateProfileSettingsRequestSchema`.
- [x] Validar `id` como entero positivo en responses.
- [x] Validar `email` como email.
- [x] Validar `biography` como array de strings.
- [x] Validar URLs opcionales (`resume`, `heroLink`, `hireMeLink`).
- [x] Mantener `id` fuera del PATCH body.
- [x] Rechazar requests de actualización vacíos.
  - Evidence: [Settings contracts](../../../packages/contracts/src/profile/settings.ts)

## Fase 4 - Contact Point Contracts

- [x] Crear `ContactPointTypeSchema`.
- [x] Crear `ContactPointProviderSchema`.
- [x] Crear `ContactPointResponseSchema`.
- [x] Crear `ContactPointsResponseSchema`.
- [x] Crear `PublicContactPointResponseSchema`.
- [x] Crear `PublicContactPointsResponseSchema`.
- [x] Crear `CreateContactPointRequestSchema`.
- [x] Crear `UpdateContactPointRequestSchema`.
- [x] Rechazar requests de actualización vacíos.
- [x] Mantener `identifier` fuera del response público.
- [x] Representar `visible` y `sortOrder` solo en contratos administrativos.
  - Evidence: [Contact point contracts](../../../packages/contracts/src/profile/contact-points.ts)

## Fase 5 - Exports

- [x] Crear `packages/contracts/src/profile/index.ts`.
- [x] Exportar contracts de `public`, `settings` y `contact-points`.
- [x] Re-exportar profile contracts desde `packages/contracts/src/index.ts`.
- [x] Mantener nombres de schemas y tipos consistentes con el API HTTP.
  - Evidence: [Profile exports](../../../packages/contracts/src/profile/index.ts), [Package exports](../../../packages/contracts/src/index.ts)

## Fase 6 - Tests

- [x] Testear responses válidos.
- [x] Testear requests válidos.
- [x] Rechazar emails inválidos.
- [x] Rechazar URLs inválidas.
- [x] Rechazar providers y types inválidos.
- [x] Rechazar PATCH bodies vacíos.
- [x] Verificar que responses públicos no expongan campos administrativos.
- [x] Ejecutar `pnpm --filter @portfolio/contracts typecheck`.
- [x] Ejecutar `pnpm --filter @portfolio/contracts test`.
  - Evidence: [Contract tests](../../../packages/contracts/src/profile/__tests__/contracts.test.ts)

## Definition of Done

- [x] `@portfolio/contracts` compila independientemente.
  - Evidence: [Contracts package](../../../packages/contracts/package.json), [TypeScript config](../../../packages/contracts/tsconfig.json)
- [x] Portal y API pueden importar los mismos schemas desde `@portfolio/contracts`.
  - Evidence: [API contract usage](../../../apps/profile/service/api/src/profile-contracts.ts), [Portal public client](../../../apps/profile/web/portal/src/features/profile/api/profile-public-client.ts), [API package](../../../apps/profile/service/api/package.json), [Portal package](../../../apps/profile/web/portal/package.json)
- [x] Los contratos públicos están separados de los contratos administrativos.
  - Evidence: [Public contracts](../../../packages/contracts/src/profile/public.ts), [Administrative contracts](../../../packages/contracts/src/profile/contact-points.ts)
- [x] Los contratos no dependen de modelos de dominio ni infraestructura.
  - Evidence: [Contracts source](../../../packages/contracts/src/profile/index.ts)
- [x] Cada checkbox completado tiene evidencia enlazada a un archivo o test concreto.
  - Evidence: [Contract tests](../../../packages/contracts/src/profile/__tests__/contracts.test.ts)

## Evidencia Esperada

```md
- [x] Crear `ProfilePublicResponseSchema`.
  - Evidence: [Public contracts](../../../packages/contracts/src/profile/public.ts)
- [x] Crear `ProfileSettingsResponseSchema`.
  - Evidence: [Settings contracts](../../../packages/contracts/src/profile/settings.ts)
- [x] Crear `ContactPointResponseSchema`.
  - Evidence: [Contact point contracts](../../../packages/contracts/src/profile/contact-points.ts)
- [x] Exportar profile contracts.
  - Evidence: [Profile exports](../../../packages/contracts/src/profile/index.ts), [Package exports](../../../packages/contracts/src/index.ts)
```
