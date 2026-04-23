---
id: 05-oms-stripe-implementacion
aliases: []
tags: []
---

# Guia OMS + Stripe (implementacion end-to-end)

Esta guia describe el flujo completo desde el Order Management System (OMS) hasta la configuracion de Stripe para sandbox y produccion.

## 1. Arquitectura operativa

Flujo oficial:

1. UI llama `POST /api/checkout/create-session`.
2. Se crea orden `pending` en `orders`.
3. Se crea Stripe Checkout Session con `metadata.order_id`.
4. Stripe envia webhook a `POST /api/webhooks/stripe`.
5. OMS transiciona estado:
   - `checkout.session.completed` -> `paid`
   - `checkout.session.expired` -> `failed`
   - `payment_intent.payment_failed` -> `failed`
6. Fulfillment:
   - attach user por email
   - grant access (`access`)
   - email de acceso por Postmark
7. Usuario consulta estado en `/articles/[slug]/success?order_id=...` (o fallback `/success`).

## 2. Componentes del sistema

- API checkout: `src/app/api/checkout/create-session/route.ts`
- API webhook: `src/app/api/webhooks/stripe/route.ts`
- Modelo ordenes: `src/domains/order/model/index.ts`
- Idempotencia webhook: `src/domains/webhook-event/model/index.ts`
- Accesos: `src/domains/access/model/index.ts`
- Email post-pago: `src/services/payments/accessEmail.ts`
- Paths de resultado: `src/lib/payments/routes.ts`

## 3. Variables de entorno requeridas

### Aplicacion

- `SITE_URL` (o `NEXT_PUBLIC_SITE_URL`)
- `DATABASE_URL`
- `BETTER_AUTH_URL`

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID_ARTICLE_PATTERN`
- `STRIPE_WEBHOOK_SECRET`

### Fulfillment

- `POSTMARK_SERVER_TOKEN`
- `POSTMARK_SENDER_EMAIL`

### Unlock URLs (opcional)

- `PAYMENT_UNLOCK_URL_ARTICLE_PATTERN`
- `PAYMENT_UNLOCK_URL_DEFAULT`

## 4. Configuracion Stripe (sandbox)

1. Entrar en modo test/sandbox.
2. Crear/validar producto y precio one-time.
3. Configurar endpoint webhook:
   - URL: `https://<dominio>/api/webhooks/stripe`
   - Eventos suscritos:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.payment_failed`
4. Copiar `whsec_...` y guardarlo en `STRIPE_WEBHOOK_SECRET`.

## 5. Verificacion funcional en sandbox

Checklist minimo:

1. Checkout inicia (`/api/checkout/create-session` responde 200).
2. Stripe redirige a checkout correctamente.
3. Al pagar, Stripe entrega `checkout.session.completed` con 200.
4. Orden pasa a `paid` en admin (`/admin/orders`).
5. Se crea grant en `access`.
6. Pantalla `/articles/[slug]/success?order_id=...` muestra "Payment confirmed" y link de unlock.

## 6. Diagnostico rapido de incidencias

### Caso: orden queda en `pending`

Verificar en Stripe deliveries:

- Si solo ves `payment_intent.succeeded` con respuesta `{ "ok": true, "ignored": true }`, el comportamiento es esperado y no cierra OMS.
- Debe existir `checkout.session.completed` para transicionar a `paid`.

### Caso: `invalid_signature`

- Revisar que `STRIPE_WEBHOOK_SECRET` corresponda al endpoint correcto y al modo correcto (test/live).

### Caso: `reason: "not_found"`

- Validar correlacion entre `checkout.session.id` y `orders.stripe_session_id`.

### Caso: `duplicated: true`

- Evento reintentado/replay ya procesado (idempotencia OK).

## 7. Paso a produccion (resumen)

1. Cambiar a live en Stripe.
2. Cargar credenciales live en Vercel (`sk_live`, `price_live`, `whsec_live`).
3. Confirmar endpoint webhook live con los 3 eventos.
4. Redeploy.
5. Hacer una transaccion real controlada y validar E2E.

## 8. Regla de oro operativa

Sin `checkout.session.completed` correctamente suscrito y entregado, el OMS no puede cerrar la orden como `paid`.
