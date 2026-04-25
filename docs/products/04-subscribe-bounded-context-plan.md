---
id: 04-subscribe-bounded-context-plan
aliases: []
tags: []
---

# Plan por fases: Subscribe Bounded Context

Este documento define el plan de implementacion por fases para reemplazar el CTA de articulos por `Subscribe` y construir el bounded context de suscripciones (dominio, APIs, lifecycle, persistencia y operacion), manteniendo compatibilidad con la arquitectura actual (Next.js + Drizzle + Postmark).

## 1. Objetivo

Implementar un contexto de negocio `Subscribe` que permita:

- Captura de suscriptores desde articulos (CTA `Subscribe`).
- Gestion de ciclo de vida (`pending_confirmation`, `subscribed`, `unsubscribed`, `bounced`, `complained`).
- Trazabilidad de eventos operativos.
- Evolucion futura a servicio separado (Nest) sin reescritura total.

## 2. Decision arquitectonica inicial

### Decision

Implementar primero dentro del monolito actual:

- UI + Route Handlers en Next.js (`src/app/api/...`)
- Persistencia en Postgres via Drizzle
- Envio de email via Postmark

### Razon

- Menor costo de arranque.
- Reutiliza patrones existentes (orders/webhooks/admin/audit).
- Permite entregar valor rapido con riesgo bajo.
- Mantiene opcion de extraer luego a Nest cuando el volumen/operacion lo justifique.

## 3. Alcance funcional minimo (MVP)

1. CTA `Subscribe` en articulos (modo por env).
2. Alta de suscriptor via email.
3. Confirmacion por double opt-in (token de confirmacion).
4. Baja de suscripcion (unsubscribe).
5. Registro de eventos de lifecycle para auditoria.
6. Vista admin basica de estado y metricas.

Fuera de alcance MVP:

- Segmentacion avanzada.
- Campanas masivas.
- Automatizaciones de marketing complejas.
- Preferencias multitema por usuario.

## 4. Modelo de dominio propuesto

### 4.1 Entidad `subscriptions`

Campos sugeridos:

- `id` (uuid/text pk)
- `email` (normalizado lowercase)
- `status` (`pending_confirmation` | `subscribed` | `unsubscribed` | `bounced` | `complained`)
- `source` (ej: `article_cta`)
- `articleSlug` (nullable)
- `locale` (nullable)
- `confirmedAt` (nullable)
- `unsubscribedAt` (nullable)
- `createdAt`
- `updatedAt`

Indices:

- unique por `email`
- indice por `status`
- indice por `createdAt desc`

### 4.2 Entidad `subscription_event`

Campos sugeridos:

- `id` (uuid/text pk)
- `subscriptionId` (fk -> subscriptions)
- `type` (`created` | `confirm_sent` | `confirmed` | `unsubscribed` | `resubscribed` | `bounced` | `complained`)
- `payload` (json/text)
- `createdAt`
- `updatedAt`

### 4.3 Entidad `subscription_token` (si se separa de verification)

Campos sugeridos:

- `id` (uuid/text pk)
- `subscriptionId` (fk)
- `tokenHash`
- `expiresAt`
- `usedAt` (nullable)
- `createdAt`
- `updatedAt`

Nota: se puede reutilizar tabla `verification` existente, pero para claridad del bounded context se recomienda tabla explicita propia.

## 5. Fases de implementacion

### Fase 0 - Discovery y decision de contrato (0.5-1 dia)

- Estado: `COMPLETADA`
- Flag cerrada:
  - `NEXT_PUBLIC_MONETIZATION_MODE`
  - valor objetivo para esta vertical: `subscribe`
  - valores soportados del sistema: `checkout | contact | subscribe`
- Copy cerrada:
  - CTA principal: `Subscribe`
  - mensaje post-alta: `Check your inbox`
- SLA de token cerrado:
  - expiracion: `24h`
  - cooldown de reenvio: `15m`
  - maximo reenvios por ventana de 24h: `3`
- Contrato de estados cerrado:
  - `pending_confirmation`
  - `subscribed`
  - `unsubscribed`
  - `bounced`
  - `complained`
- Contrato de eventos cerrado:
  - `created`
  - `confirm_sent`
  - `confirmed`
  - `unsubscribed`
  - `resubscribed`
  - `bounced`
  - `complained`

DoD:

- [x] Contrato funcional aprobado.
- [x] Nombres de estados/eventos cerrados.

### Fase 1 - Persistencia + dominio core (1-2 dias)

- Extender `src/db/schema.ts` con nuevas tablas.
- Crear migracion Drizzle.
- Crear `src/domains/subscription/model/index.ts` con operaciones:
  - createOrUpdatePending(email, source, articleSlug)
  - markConfirmed(subscriptionId)
  - markUnsubscribed(subscriptionId)
  - findByEmail/findById
- Crear `src/domains/subscription-event/model/index.ts`.

DoD:

- Migraciones aplican sin errores.
- CRUD y transiciones base cubiertas por tests unitarios.

### Fase 2 - API lifecycle (1-2 dias)

Crear endpoints:

- `POST /api/subscriptions`
  - valida email + source + articleSlug
  - crea/actualiza `pending_confirmation`
  - genera token
  - envia email confirmacion
  - log `created` + `confirm_sent`
- `GET /api/subscriptions/confirm?token=...`
  - valida token
  - marca `subscribed`
  - log `confirmed`
- `POST /api/subscriptions/unsubscribe`
  - token o email signed link
  - marca `unsubscribed`
  - log `unsubscribed`

DoD:

- Flujo end-to-end subscribe -> confirm -> subscribed funcionando.
- Manejo de casos idempotentes (reclick/replay).
- Tests API passing.

### Fase 3 - UI + feature flag de CTA (0.5-1 dia)

- Extender `StealPatternCTA` con modo `subscribe`.
- `contact`: Let's talk (actual).
- `checkout`: compra (actual).
- `subscribe`: boton Subscribe + formulario simple (email) o modal minimo.
- Ocultar copy de checkout/lock cuando no corresponda (regla ya aplicada en contact, extender a subscribe).

DoD:

- En `subscribe` no aparece copy de venta ni lock de checkout.
- Se puede suscribir desde articulo monetizado.
- Tests de UI por modo (`checkout`, `contact`, `subscribe`).

### Fase 4 - Admin/ops basico (1 dia)

- `/admin/subscriptions`:
  - listado (email, status, source, article, createdAt)
  - filtros por status
- overview cards:
  - total pending/subscribed/unsubscribed
- accion manual minima:
  - re-send confirm
  - mark unsubscribed

DoD:

- Operaciones manuales basicas disponibles.
- Auditoria visible via `subscription_event`.

### Fase 5 - Hardening (1-2 dias)

- Rate limit en `POST /api/subscriptions`.
- Anti-abuso (honeypot/time gate opcional como chat form).
- Observabilidad:
  - logs con correlation id
  - codigos de error estables.
- E2E happy path + regresion.

DoD:

- Flujos resilientes frente a spam/reintentos.
- CI verde en unit + API + E2E relevante.

## 6. Variables de entorno propuestas

Public/client:

- `NEXT_PUBLIC_MONETIZATION_MODE=subscribe|contact|checkout`

Server:

- `SUBSCRIBE_TOKEN_TTL_HOURS=24`
- `SUBSCRIBE_CONFIRM_BASE_URL=https://...`
- `SUBSCRIBE_FROM_EMAIL=...` (si no se reusa postmark sender global)
- `SUBSCRIBE_REPLY_TO_EMAIL=...` (opcional)

## 7. Compatibilidad y extraccion futura a Nest

### 7.1 Cuando conviene extraer a Nest

Extraer cuando aparezca alguno:

- Alto volumen de eventos y necesidad de colas/retries complejos.
- Multiples canales (email + push + crm sync + webhooks de varios providers).
- Dominio de marketing automation independiente del frontend.
- Equipo separado para backend de growth/comms.

### 7.2 Estrategia de extraccion sin romper

1. Mantener contratos API estables desde ahora (`/api/subscriptions/*`).
2. Encapsular logica en servicios de dominio (sin acoplar a handlers).
3. Introducir adapter layer para provider email.
4. Luego mover internals a Nest manteniendo fachada (proxy o edge handler).

Resultado: migracion gradual sin cambio de UX ni contratos publicos.

## 8. Riesgos y mitigaciones

- Riesgo: spam/bots.
  - Mitigacion: rate limit + honeypot + cooldown de resend.
- Riesgo: deliverability baja.
  - Mitigacion: double opt-in + tracking de bounces/complaints.
- Riesgo: confusion UX entre CTA modes.
  - Mitigacion: rules claras por `NEXT_PUBLIC_MONETIZATION_MODE` + tests por modo.
- Riesgo: deuda de dominio mixto (orders/subscriptions).
  - Mitigacion: bounded contexts separados (`order/*` vs `subscription/*`).

## 9. Checklist de salida a produccion

- [ ] Migraciones aplicadas en prod.
- [ ] Env vars configuradas.
- [ ] Confirm/unsubscribe links validados en dominio real.
- [ ] Logs y errores observables.
- [ ] Admin basico operativo.
- [ ] E2E smoke: subscribe -> confirm -> unsubscribe.

## 10. Siguiente accion recomendada

Implementar Fase 1 + Fase 2 en un PR inicial (backend-first), luego Fase 3 (UI), y cerrar con Fase 4/5.
