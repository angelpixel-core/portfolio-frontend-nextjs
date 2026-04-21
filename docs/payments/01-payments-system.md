---
id: 01-payments-system
aliases: []
tags: []
---

# Payments System Plan (Repo-Aligned)

Este documento define el plan para implementar pagos en este proyecto siguiendo patrones ya usados en el repo:

- Next.js App Router + Route Handlers
- Drizzle ORM + migraciones versionadas
- Validación con Zod
- Errores API consistentes (`{ ok: false, error }`)
- Tests por capa (unit + route + e2e)
- Runbook operativo para producción

## 1) Objetivo de V1

Implementar cobro con **Stripe Checkout (card)** para monetizar el bloque CTA del artículo:

- crear orden en DB (`pending`)
- crear Checkout Session en Stripe
- confirmar pago por webhook server-side
- marcar orden como `paid`
- desbloquear entrega inicial (v1: enlace/flag simple)

Fuente de verdad de pago: webhook, no frontend.

## 2) Alcance y no-alcance

### En alcance (V1)

- Card payments con Stripe Checkout
- Orden persistida antes de redirección
- Webhook firmado + idempotencia básica
- Estados de orden (`pending | paid | failed`)
- Integración del CTA actual (`Monetization`) con backend real
- Logging y trazabilidad mínima

### Fuera de alcance (V1)

- Stripe Elements custom
- Suscripciones
- Reembolsos automáticos
- Bitcoin/Angelcoin reales (quedan como providers futuros)

## 3) Arquitectura objetivo

```text
CTA (StealPatternCTA)
  -> POST /api/checkout/create-session
      -> validate input (Zod)
      -> insert order (pending)
      -> Stripe checkout.sessions.create(...)
      -> update order with stripe_session_id/url
      -> return { ok: true, url }
  -> frontend redirect to Stripe hosted page

Stripe webhook
  -> POST /api/webhooks/stripe
      -> verify signature
      -> handle checkout.session.completed (+ payment failed events)
      -> update order status idempotently
      -> trigger unlock/delivery
```

## 4) Diseño de datos (Drizzle)

Archivo principal:

- `src/db/schema.ts`

Nueva tabla propuesta: `orders`

- `id` (text, PK, uuid)
- `userId` (text, nullable, FK `user.id`)
- `email` (text, nullable)
- `productKey` (text, not null) — ej: `article-why-portfolio-pattern`
- `amount` (integer, cents)
- `currency` (text, not null, default `usd`)
- `status` (text, not null) — `pending | paid | failed`
- `provider` (text, not null) — `stripe`
- `stripeSessionId` (text, unique, nullable)
- `stripePaymentIntentId` (text, nullable)
- `createdAt`, `updatedAt`

Opcional recomendado para idempotencia fuerte:

- tabla `payment_events` con `providerEventId` unique.

Migración:

- `drizzle/0009_create_orders.sql` (o siguiente correlativo)

## 5) API contracts

### POST `/api/checkout/create-session`

Request:

```json
{
  "productKey": "article-why-portfolio-pattern",
  "email": "optional@user.com",
  "source": "article-cta"
}
```

Response success:

```json
{ "ok": true, "url": "https://checkout.stripe.com/..." }
```

Response error:

```json
{ "ok": false, "error": "invalid|unauthenticated|provider_error" }
```

### POST `/api/webhooks/stripe`

- leer `req.text()` para firma Stripe
- verificar `stripe-signature`
- retornar `200` rápido tras persistencia/idempotencia

Eventos mínimos:

- `checkout.session.completed` -> `paid`
- `checkout.session.expired` -> `failed`
- `payment_intent.payment_failed` -> `failed` (si aplica)

## 6) Estructura de código

### API routes

- `src/app/api/checkout/create-session/route.ts`
- `src/app/api/webhooks/stripe/route.ts`

### Service layer (provider)

- `src/services/payments/stripe.ts`
- `src/services/payments/schema.ts` (Zod payloads)
- `src/services/payments/types.ts`

### Domain layer (orders)

- `src/domains/order/model/schema.ts`
- `src/domains/order/model/index.ts` (create/update/find)
- `src/domains/order/queries/...` (solo si se necesita en UI)

### UI integration

- `src/ui/molecules/Monetization/config.ts` (activar `card`)
- `src/ui/molecules/Monetization/PaymentOption.tsx` (click handler real)
- `src/ui/molecules/Monetization/PaymentModal.tsx` (loading/error states)

## 7) Variables de entorno

Agregar en `.env.template` y `.env.production.template`:

- `STRIPE_SECRET_KEY=`
- `STRIPE_WEBHOOK_SECRET=`
- `NEXT_PUBLIC_SITE_URL=`
- `STRIPE_PRICE_ID_ARTICLE_PATTERN=`

## 8) Seguridad y robustez

- verificar firma webhook siempre
- no confiar en redirect success para marcar `paid`
- idempotencia por `stripeSessionId` o `providerEventId`
- logging estructurado con `logger` (sin secretos)
- timeouts controlados en llamadas al provider
- respuestas API consistentes (`ok/error`)

## 9) Estrategia de tests

### Unit

- `src/services/payments/__tests__/stripe.test.ts`
  - crea sesión con metadata correcta
  - mapea errores provider -> `provider_error`

### Route tests

- `src/app/api/checkout/create-session/__tests__/route.test.ts`
- `src/app/api/webhooks/stripe/__tests__/route.test.ts`
  - valida signature
  - idempotencia
  - actualización de estados

### E2E crítico mínimo

- CTA card inicia request de checkout
- fallback de error en modal si create-session falla

## 10) Plan por fases

### Fase 0 — Base técnica

1. Definir schema orders + migración.
2. Agregar env vars y documentación.
3. Crear types + zod schemas de payments.

### Fase 1 — Create Session

1. Implementar `POST /api/checkout/create-session`.
2. Persistir orden `pending`.
3. Crear Stripe Session con metadata `order_id`.
4. Retornar URL y conectar CTA card provider.

### Fase 2 — Webhook

1. Implementar `POST /api/webhooks/stripe`.
2. Verificar firma.
3. Actualizar estado de orden (`paid/failed`).
4. Idempotencia.

### Fase 3 — Unlock V1

1. Definir mecanismo simple de entrega (link/flag).
2. Activar post-pago.
3. Instrumentar evento analytics server-side.

### Fase 4 — Hardening + CI

1. Completar tests route/unit/e2e mínimos.
2. Runbook de despliegue y verificación.
3. Checklist de producción (secrets, webhook endpoint, replay test).

## 11) Checklist operativo (producción)

- [ ] migración ejecutada en prod (`orders` existe)
- [ ] `STRIPE_SECRET_KEY` configurada en Vercel
- [ ] `STRIPE_WEBHOOK_SECRET` configurada
- [ ] endpoint webhook activo en Stripe Dashboard
- [ ] evento `checkout.session.completed` recibido
- [ ] orden cambia `pending -> paid`
- [ ] CTA card redirige correctamente a Checkout
- [ ] logs sin errores críticos

## 12) Evolución multiprovider (V2+)

Contrato recomendado:

```ts
interface PaymentProviderStrategy {
  createSession(input): Promise<{ url: string; providerSessionId: string }>;
  parseWebhook(request): Promise<ProviderEvent>;
  mapStatus(event): "pending" | "paid" | "failed";
}
```

Implementaciones futuras:

- `StripeProvider`
- `BitcoinProvider`
- `AngelcoinProvider`

Todos reutilizan el mismo flujo de órdenes y estados.

## 13) Plan operativo detallado (ready-to-implement)

Esta sección traduce el plan en tareas concretas por archivo, con criterio de aceptación.

### P0 — Data model + migración

Archivos:

- `src/db/schema.ts`
- `drizzle/0009_create_orders.sql` (o siguiente correlativo)
- `drizzle/meta/_journal.json`

Entregables:

- tabla `orders` creada y versionada
- índices mínimos (`stripe_session_id` unique)
- `status` limitado a `pending | paid | failed`

Aceptación:

- migración corre en local y en DB objetivo sin errores
- `npm run db:migrate` deja esquema consistente

### P1 — Create Session API

Archivos:

- `src/app/api/checkout/create-session/route.ts`
- `src/services/payments/schema.ts`
- `src/services/payments/stripe.ts`
- `src/domains/order/model/index.ts`

Entregables:

- valida payload con Zod
- crea order `pending`
- crea Stripe Checkout Session con `metadata.order_id`
- retorna `{ ok: true, url }`

Aceptación:

- route test cubre `invalid`, `provider_error` y `success`
- order queda persistida antes del redirect

### P2 — Stripe webhook

Archivos:

- `src/app/api/webhooks/stripe/route.ts`
- `src/domains/order/model/index.ts`
- (opcional) `src/domains/payment-event/model/*`

Entregables:

- valida firma `stripe-signature`
- procesa `checkout.session.completed` y marca `paid`
- procesa eventos de fallo y marca `failed`
- idempotencia por `stripeSessionId` o `providerEventId`

Aceptación:

- route test cubre firma inválida, evento duplicado y evento válido
- no hay transiciones inválidas de estado

### P3 — Integración UI Monetization

Archivos:

- `src/ui/molecules/Monetization/config.ts`
- `src/ui/molecules/Monetization/PaymentOption.tsx`
- `src/ui/molecules/Monetization/PaymentModal.tsx`

Entregables:

- `card` habilitado en config
- click de card llama `POST /api/checkout/create-session`
- estado de loading/error y redirect manejado en modal

Aceptación:

- e2e mínimo: CTA -> request -> redirect URL
- fallback visible si API falla

### P4 — Unlock V1

Archivos:

- `src/app/success/page.tsx` (o ruta equivalente)
- `src/domains/order/model/index.ts`

Entregables:

- desbloqueo básico condicionado a `order.status === "paid"`
- mensaje claro de éxito/fracaso para usuario

Aceptación:

- flujo exitoso muestra unlock
- flujo cancelado/fallido no muestra unlock

## 14) Decisiones cerradas y abiertas

### Cerradas

- proveedor inicial: Stripe Checkout
- source of truth: webhook server-side
- modelo base: `orders` con estado explícito

### Abiertas (resolver antes de P1)

- `amount`: integer en cents (recomendado) vs numeric
- estrategia de unlock: link temporal vs flag en UI
- idempotencia fuerte: tabla `payment_events` sí/no en V1

## 15) Definition of Done (V1)

V1 se considera terminado cuando se cumplen todos estos puntos:

- [ ] se puede pagar con card desde CTA en artículo
- [ ] orden se crea como `pending` antes de redirección
- [ ] webhook válido cambia estado a `paid`
- [ ] eventos de fallo marcan `failed`
- [ ] unlock básico visible solo en `paid`
- [ ] tests unit + route + e2e mínimo en verde
- [ ] runbook de deploy/verify actualizado

## 16) Riesgos y mitigaciones

- Riesgo: marcar pago por redirect del frontend.
  Mitigación: nunca mutar estado a `paid` fuera de webhook.

- Riesgo: eventos duplicados de Stripe.
  Mitigación: idempotencia por `stripeSessionId` o `providerEventId` unique.

- Riesgo: secretos faltantes en producción.
  Mitigación: checklist previo de env vars y smoke test webhook.

- Riesgo: degradación UX en modal.
  Mitigación: estados explícitos (`idle/loading/error`) y copy de recuperación.
