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

# Epic 002 - Monorepo Client/Server Split

## Contexto

El repositorio actual es un híbrido transicional: Next.js actúa como cliente, pero algunas rutas server-side todavía hablan directamente con la base de datos. La arquitectura objetivo es un split real cliente/servidor donde la web consuma un backend vía HTTP y los paquetes compartidos provean contratos y código de dominio reusable.

Esta épica convierte ADR-013 en un plan de implementación.

## Objetivo

Separar el producto en apps explícitas de cliente y servidor dentro de un monorepo, con paquetes compartidos para contracts, domain logic, application use cases e infrastructure adapters.

## Checklist

- [ ] Ejecutar el [plan de scaffold del workspace y backend Nest](./scaffold-plan.md).
- [x] Definir la estructura root del monorepo para `apps/` y `packages/`.
  - Evidence: [pnpm workspace](../../../pnpm-workspace.yaml), [profile API package](../../../apps/profile/service/api/package.json), [profile portal package](../../../apps/profile/web/portal/package.json), [contracts package](../../../packages/contracts/package.json), [shared package](../../../packages/shared/package.json)
- [ ] Crear el package compartido `contracts` para schemas de request/response.
- [ ] Crear el package compartido `domain` para reglas de negocio puras.
- [ ] Crear el package compartido `application` para use cases y ports.
- [ ] Crear el package compartido `infrastructure` para adapters y helpers de transporte.
- [ ] Crear el package compartido `shared` para utilidades agnósticas al framework.
- [ ] Levantar `apps/profile/web/portal` como la app cliente en Next.js.
- [ ] Levantar `apps/profile/service/api` como la app backend en NestJS.
- [ ] Mover los workflows de lectura/escritura de `profile` detrás de HTTP contracts.
- [ ] Agregar una capa de HTTP adapters en el cliente Next.
- [ ] Eliminar cualquier acoplamiento directo a DB desde el borde del cliente Next.
- [ ] Mantener rutas server-side transicionales solo hasta que el reemplazo backend esté completo.

## Alcance

En alcance:

- Estructura de carpetas del monorepo.
- Límites de packages y reglas de import.
- Split cliente/servidor sobre HTTP.
- Vertical slice inicial de `profile`.
- Reutilización de contracts y domain.

Fuera de alcance:

- Migrar todos los dominios en un solo paso.
- Reescribir el diseño visual o las URLs.
- Introducir un segundo backend antes de estabilizar el split.

## Fases

### Phase 1 - Foundation

- [x] Crear la estructura root del workspace.
- [ ] Definir naming de packages y reglas de import.
- [ ] Mover schemas/contracts reutilizables a `packages/contracts`.
- [ ] Mover el código puro de dominio a `packages/domain` donde corresponda.

### Phase 2 - Backend Pilot

- [ ] Crear `apps/profile/service/api`.
- [ ] Agregar un health endpoint y un public read endpoint.
- [ ] Agregar la capa backend de application/use-case.
- [ ] Agregar backend infrastructure adapters.

### Phase 3 - Client Pilot

- [ ] Crear `apps/profile/web/portal`.
- [ ] Agregar HTTP adapters en el cliente.
- [ ] Cambiar las lecturas de `profile` a HTTP backend.
- [ ] Mantener fallback con snapshot estático solo como runtime mode, no como frontera final.

### Phase 4 - Slice Migration

- [ ] Migrar `profile settings` y `contact-points`.
- [ ] Migrar `projects`.
- [ ] Migrar `articles`.
- [ ] Eliminar el acceso directo a DB desde la app cliente.

## Criterios de Aceptación

- `portal` solo habla con `api` por HTTP.
- `api` es dueño de la persistencia y de las escrituras de negocio.
- Los shared packages son importables desde ambas apps.
- `packages/*` no dependen de `apps/*`.
- Ningún código cliente de Next importa adapters de DB directamente.

## Notas

- Esta épica es estructural, no funcional.
- Mantener el primer slice pequeño y verificable.
- Preferir un vertical slice sobre un movimiento mecánico amplio.
