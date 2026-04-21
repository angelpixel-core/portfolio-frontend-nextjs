import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import orderModel from "@/domains/order/model";
import { logger } from "@/lib/logger";
import { verifyStripeWebhookSignature } from "@/services/payments/webhook";

type StripeEvent = {
  id?: string;
  type?: string;
  data?: {
    object?: {
      id?: string;
      metadata?: Record<string, string>;
      payment_intent?: string | null;
    };
  };
};

const handleCheckoutSessionCompleted = async (event: StripeEvent) => {
  const session = event.data?.object;
  const sessionId = session?.id;

  if (!sessionId) {
    return { ok: true, ignored: true, reason: "missing_session_id" };
  }

  if (session.payment_intent) {
    await orderModel.attachStripePaymentIntentBySessionId(
      sessionId,
      session.payment_intent
    );
  }

  const result = await orderModel.transitionByStripeSessionId(
    sessionId,
    "paid"
  );

  if (!result.ok) {
    return { ok: true, ignored: true, reason: result.reason };
  }

  return { ok: true, duplicated: !result.changed };
};

const handleCheckoutSessionExpired = async (event: StripeEvent) => {
  const sessionId = event.data?.object?.id;
  if (!sessionId) {
    return { ok: true, ignored: true, reason: "missing_session_id" };
  }

  const result = await orderModel.transitionByStripeSessionId(
    sessionId,
    "failed"
  );

  if (!result.ok) {
    return { ok: true, ignored: true, reason: result.reason };
  }

  return { ok: true, duplicated: !result.changed };
};

const handlePaymentIntentFailed = async (event: StripeEvent) => {
  const paymentIntentId = event.data?.object?.id;
  if (!paymentIntentId) {
    return { ok: true, ignored: true, reason: "missing_payment_intent_id" };
  }

  const result = await orderModel.transitionByStripePaymentIntentId(
    paymentIntentId,
    "failed"
  );

  if (!result.ok) {
    return { ok: true, ignored: true, reason: result.reason };
  }

  return { ok: true, duplicated: !result.changed };
};

export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.text();
    const signatureHeader = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

    const signatureValid = verifyStripeWebhookSignature(
      payload,
      signatureHeader,
      webhookSecret
    );

    if (!signatureValid) {
      return NextResponse.json(
        { ok: false, error: "invalid_signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(payload) as StripeEvent;

    if (!event.type) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    switch (event.type) {
      case "checkout.session.completed":
        return NextResponse.json(await handleCheckoutSessionCompleted(event));
      case "checkout.session.expired":
        return NextResponse.json(await handleCheckoutSessionExpired(event));
      case "payment_intent.payment_failed":
        return NextResponse.json(await handlePaymentIntentFailed(event));
      default:
        return NextResponse.json({ ok: true, ignored: true });
    }
  } catch (error) {
    logger.error("Payments", "Failed to process Stripe webhook", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
