---
id: 002-monorepo-client-server-split-design
aliases: []
tags:
  - architecture
  - monorepo
  - nextjs
  - nestjs
status: pending
---

# Diseño 002 - Monorepo Client/Server Split

## Objetivo

Diseñar el split objetivo del monorepo para que la app Next.js siga siendo el cliente web y el backend sea el único dueño de las escrituras de negocio y la persistencia.

## Decisión

El cliente frontend debería consumir solo:

- `contracts`
- `http adapters`
- utilidades `shared` agnósticas al framework

El backend debería ser dueño de:

- `domain`
- `application`
- `infrastructure`
- la persistencia y las integraciones externas

En otras palabras, la capa `application` no está pensada para compartirse con el cliente. El cliente debe orquestar UI y llamadas remotas, no reutilizar directamente los casos de uso del backend.

## Por qué no compartir `application` con el cliente

- Los casos de uso de `application` suelen codificar orquestación del backend alrededor de persistencia y efectos secundarios.
- Compartirlos con el cliente crea un acoplamiento falso a detalles de ejecución del lado servidor.
- El borde del cliente debería seguir siendo HTTP-first y agnóstico al transporte solo a nivel de contrato.
- Reutilizar `application` del backend en el frontend tiende a difuminar la propiedad y vuelve más difícil evolucionar el split.

## Estructura recomendada

```text
repo/
  apps/
    profile/
      web/
        portal/
          src/
            app/
            features/
            lib/
      service/
        api/
          src/
            modules/
            controllers/
            application/
            domain/
            infrastructure/
  packages/
    contracts/
    shared/
```

La capa `presentation` no aparece como package compartido porque vive dentro de cada app:

- `apps/*/web/portal` para la UI cliente
- `apps/*/service/api/controllers` para la frontera HTTP del backend

Si más adelante hace falta lógica de dominio compartida, debería extraerse de forma intencional y solo cuando sea realmente pura y reutilizable entre apps. Para el primer split, mantener `application` solo en el backend.

## Reglas de dependencias

```text
portal -> contracts, shared, http adapters
api -> contracts, domain, application, infrastructure, shared

application -> domain, contracts, shared
infrastructure -> application, domain, contracts, shared
domain -> shared
contracts -> shared
```

No permitido:

- `portal` importando `application` del backend
- `portal` importando `domain` del backend
- `packages/*` dependiendo de `apps/*`

## Responsabilidades Finales

- `contracts`: schemas y tipos de transporte compartidos entre portal y API.
- `shared`: utilidades puras y agnósticas al framework.
- `domain`: reglas de negocio y modelos internos del backend Nest.
- `application`: casos de uso, orquestación y ports del backend Nest.
- `infrastructure`: PostgreSQL, adapters y servicios externos del backend Nest.
- `presentation`: vive dentro de cada app; UI en el portal y controllers HTTP en el API.

`domain`, `application` e `infrastructure` no se crearán como packages compartidos en esta primera etapa.

## Vertical slice de `profile`

Usar `profile` como el primer vertical slice:

- `profile/public` - read model consumido por el cliente
- `profile/settings` - write model del backend para identidad
- `profile/contact-points` - write model del backend para socials/contact
- `profile/public/service.ts` y `profile/public/mapper.ts` - composición del read model público del perfil

El cliente debería llamar a un único endpoint HTTP para el perfil público y nunca debería ensamblar por sí mismo datos respaldados por persistencia.

## Estrategia de contratos HTTP

- Poner los DTOs y schemas de request/response en `packages/contracts`.
- Generar o escribir a mano `http adapters` delgados en el cliente.
- Validar los mismos contratos en el borde de controllers del backend.
- Mantener las preocupaciones de transporte fuera de `domain` y `application`.

## Forma de migración

1. Extraer contratos para lecturas/escrituras de `profile`.
2. Construir el esqueleto de backend en Nest para `profile`.
3. Mover `profile/public/service.ts`, `profile/public/mapper.ts` y la persistencia a módulos del backend.
4. Reemplazar lecturas directas a DB en Next por `http adapters`.
5. Repetir para `projects` y `articles`.

## Consecuencias

Positivas:

- Propiedad clara del cliente y servidor.
- Reutilización más fácil de contratos sin filtrar lógica de backend al cliente.
- Expansión futura del backend más ordenada.

Trade-offs:

- Más código explícito de DTOs y adapters.
- Algo de mapeo duplicado en el borde HTTP.
- Requiere disciplina para mantener `contracts` pequeño y estable.

## Notas

- Este diseño intencionalmente no pone `application` en paquetes compartidos para el cliente.
- El cliente debería poder correr contra un backend mock o stub sin saber nada de persistencia.
- El backend todavía puede reutilizar módulos internos entre vertical slices, pero eso queda del lado servidor.
