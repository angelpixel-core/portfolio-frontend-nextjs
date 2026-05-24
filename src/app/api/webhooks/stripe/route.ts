import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  sendPaymentAccessEmail,
  verifyStripeWebhookSignature,
} from "@/application/payments";
import accessModel from "@/domains/access/model";
import orderModel from "@/domains/order/model";
import userModel from "@/domains/user/model";
import webhookEventModel from "@/domains/webhook-event/model";
import { logger } from "@/lib/logger";

type StripeEvent = {
  id?: string;
  type?: string;
  data?: {
    object?: {
      id?: string;
      metadata?: Record<string, string>;
      payment_intent?: string | null;
      customer_email?: string | null;
      customer_details?: {
        email?: string | null;
      } | null;
    };
  };
};

const getEventContext = (event: StripeEvent) => ({
  eventId: event.id,
  eventType: event.type,
  sessionId: event.data?.object?.id,
  orderId: event.data?.object?.metadata?.order_id,
  paymentIntentId: event.data?.object?.payment_intent,
});

const resolveSessionEmail = (event: StripeEvent): string | null => {
  const session = event.data?.object;
  return session?.customer_details?.email ?? session?.customer_email ?? null;
};

const handlePaidOrderFulfillment = async (
  orderId: string,
  productKey: string,
  customerEmail: string | null,
  event: StripeEvent
): Promise<void> => {
  if (!customerEmail) {
    logger.error("Payments", "Paid order without customer email", {
      ...getEventContext(event),
      orderId,
      productKey,
    });
    return;
  }

  const user = await userModel.findOrCreateByEmail(customerEmail);
  await orderModel.attachUser(orderId, user.id, customerEmail);
  await accessModel.grantAccess({
    userId: user.id,
    productKey,
  });

  const emailDelivery = await sendPaymentAccessEmail({
    toEmail: customerEmail,
    orderId,
    productKey,
  });

  if (!emailDelivery.ok) {
    logger.error("Payments", "Access email delivery returned not ok", {
      ...getEventContext(event),
      orderId,
      userId: user.id,
      productKey,
    });
  }
};

const handleCheckoutSessionCompleted = async (event: StripeEvent) => {
  const session = event.data?.object;
  const sessionId = session?.id;

  if (!sessionId) {
    logger.error("Payments", "Stripe webhook ignored: missing session id", {
      ...getEventContext(event),
      reason: "missing_session_id",
    });
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
    logger.error("Payments", "Stripe webhook transition rejected", {
      ...getEventContext(event),
      reason: result.reason,
      orderStatus: result.status,
      orderId: result.orderId,
      targetStatus: "paid",
    });
    return { ok: true, ignored: true, reason: result.reason };
  }

  if (!result.changed) {
    logger.error("Payments", "Stripe webhook duplicate event", {
      ...getEventContext(event),
      orderId: result.orderId,
      targetStatus: "paid",
      duplicated: true,
    });
  }

  const paidOrder = await orderModel.findById(result.orderId);
  if (!paidOrder) {
    logger.error("Payments", "Paid order not found after transition", {
      ...getEventContext(event),
      orderId: result.orderId,
    });
    return { ok: true, duplicated: false };
  }

  await handlePaidOrderFulfillment(
    result.orderId,
    paidOrder.productKey,
    resolveSessionEmail(event),
    event
  );

  return { ok: true, duplicated: !result.changed };
};

const handleCheckoutSessionExpired = async (event: StripeEvent) => {
  const sessionId = event.data?.object?.id;
  if (!sessionId) {
    logger.error("Payments", "Stripe webhook ignored: missing session id", {
      ...getEventContext(event),
      reason: "missing_session_id",
    });
    return { ok: true, ignored: true, reason: "missing_session_id" };
  }

  const result = await orderModel.transitionByStripeSessionId(
    sessionId,
    "failed"
  );

  if (!result.ok) {
    logger.error("Payments", "Stripe webhook transition rejected", {
      ...getEventContext(event),
      reason: result.reason,
      orderStatus: result.status,
      orderId: result.orderId,
      targetStatus: "failed",
    });
    return { ok: true, ignored: true, reason: result.reason };
  }

  if (!result.changed) {
    logger.error("Payments", "Stripe webhook duplicate event", {
      ...getEventContext(event),
      orderId: result.orderId,
      targetStatus: "failed",
      duplicated: true,
    });
  }

  return { ok: true, duplicated: !result.changed };
};

const handlePaymentIntentFailed = async (event: StripeEvent) => {
  const paymentIntentId = event.data?.object?.id;
  if (!paymentIntentId) {
    logger.error(
      "Payments",
      "Stripe webhook ignored: missing payment intent id",
      {
        ...getEventContext(event),
        reason: "missing_payment_intent_id",
      }
    );
    return { ok: true, ignored: true, reason: "missing_payment_intent_id" };
  }

  const result = await orderModel.transitionByStripePaymentIntentId(
    paymentIntentId,
    "failed"
  );

  if (!result.ok) {
    logger.error("Payments", "Stripe webhook transition rejected", {
      ...getEventContext(event),
      reason: result.reason,
      orderStatus: result.status,
      orderId: result.orderId,
      targetStatus: "failed",
    });
    return { ok: true, ignored: true, reason: result.reason };
  }

  if (!result.changed) {
    logger.error("Payments", "Stripe webhook duplicate event", {
      ...getEventContext(event),
      orderId: result.orderId,
      targetStatus: "failed",
      duplicated: true,
    });
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
      logger.error("Payments", "Stripe webhook rejected: invalid signature", {
        hasSignatureHeader: Boolean(signatureHeader),
        payloadLength: payload.length,
      });
      return NextResponse.json(
        { ok: false, error: "invalid_signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(payload) as StripeEvent;

    if (!event.id) {
      logger.error("Payments", "Stripe webhook rejected: missing event id", {
        eventType: event.type,
      });
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    if (!event.type) {
      logger.error("Payments", "Stripe webhook ignored: missing event type", {
        eventId: event.id,
      });
      return NextResponse.json({ ok: true, ignored: true });
    }

    const registeredEvent = await webhookEventModel.registerWebhookEvent({
      id: event.id,
      type: event.type,
    });

    if (!registeredEvent.created) {
      const alreadyProcessed = await webhookEventModel.isProcessed(event.id);
      if (alreadyProcessed) {
        logger.error("Payments", "Stripe webhook duplicate by event id", {
          ...getEventContext(event),
          duplicateByEventId: true,
        });
        return NextResponse.json({ ok: true, duplicated: true });
      }

      logger.error(
        "Payments",
        "Stripe webhook replaying unprocessed existing event",
        {
          ...getEventContext(event),
          duplicateByEventId: true,
        }
      );
    }

    let result:
      | {
          ok: boolean;
          ignored?: boolean;
          duplicated?: boolean;
          reason?: string;
        }
      | undefined;

    switch (event.type) {
      case "checkout.session.completed":
        result = await handleCheckoutSessionCompleted(event);
        break;
      case "checkout.session.expired":
        result = await handleCheckoutSessionExpired(event);
        break;
      case "payment_intent.payment_failed":
        result = await handlePaymentIntentFailed(event);
        break;
      default:
        result = { ok: true, ignored: true };
        break;
    }

    await webhookEventModel.markProcessed(event.id);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("Payments", "Failed to process Stripe webhook", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
