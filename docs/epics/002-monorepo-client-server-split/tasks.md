---
id: 002-monorepo-client-server-split
aliases: []
tags:
  - architecture
  - monorepo
  - nextjs
  - nestjs
status: pending
---

# Tasks 002 - Monorepo Client/Server Split

## Phase 0 - Boundaries

- [x] Definir la estructura root del monorepo con `apps/` y `packages/`.
  - Evidence: [pnpm workspace](../../../pnpm-workspace.yaml), [profile API](../../../apps/profile/service/api/README.md), [profile portal](../../../apps/profile/web/portal/README.md), [contracts](../../../packages/contracts/README.md), [shared](../../../packages/shared/README.md)
- [ ] Confirmar responsabilidades finales de `contracts`, `shared`, `domain`, `application` e `infrastructure`.
- [ ] Dejar `presentation` dentro de `apps/*`, no como package compartido.
- [ ] Escribir reglas de import para `portal` y `api`.

## Phase 1 - Shared Contracts

- [ ] Extraer schemas/DTOs de `profile` a `packages/contracts`.
- [ ] Definir contratos compartidos para `profile/public`.
- [ ] Definir contratos compartidos para `profile/settings`.
- [ ] Definir contratos compartidos para `profile/contact-points`.
- [ ] Establecer convención de versionado/naming para contracts.
- [ ] Definir boundary de validación para cliente y backend.

## Phase 2 - Backend Skeleton

- [ ] Crear `apps/profile/service/api`.
- [ ] Crear módulos Nest para `profile/public`, `profile/settings` y `profile/contact-points`.
- [ ] Agregar un health endpoint.
- [ ] Agregar un public read endpoint.
- [ ] Crear la capa backend de `application/use-case`.
- [ ] Crear adapters backend para `postgres`, `memory` y, si hace falta, `snapshot-json`.

## Phase 3 - Client Skeleton

- [ ] Crear `apps/profile/web/portal`.
- [ ] Agregar la capa de `http adapters` en el cliente.
- [ ] Reemplazar lecturas directas a DB por calls al backend.
- [ ] Mantener `presentation` local a la app.
- [ ] Definir fallback/stub para desarrollo local.

## Phase 4 - Profile Vertical Slice

- [ ] Mover `profile/public` al backend vía HTTP.
- [ ] Mover `profile/settings` al backend.
- [ ] Mover `profile/contact-points` al backend.
- [x] Implementar `profile/public/mapper.ts` en el backend.
  - Evidence: [Public mapper](../../../src/domains/profile/public/mapper.ts)
- [ ] Implementar `profile/public/service.ts` y moverlo al backend Nest.
- [ ] Asegurar que el UI público consuma solo datos públicos ya ensamblados.

## Phase 5 - Expansion

- [ ] Repetir el patrón para `projects`.
- [ ] Repetir el patrón para `articles`.
- [ ] Eliminar el acoplamiento directo a DB desde el cliente Next.
- [ ] Verificar que todos los reads públicos pasen por HTTP.

## Definition of Done

- [ ] `portal` solo depende de `contracts`, `shared` y `http adapters`.
- [ ] `api` es dueño de `domain`, `application` e `infrastructure`.
- [ ] Ningún código cliente importa adapters de DB directamente.
- [ ] `packages/*` no dependen de `apps/*`.
