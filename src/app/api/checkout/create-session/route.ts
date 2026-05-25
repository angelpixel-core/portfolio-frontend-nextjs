import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  CheckoutCreateSessionSchema,
  createStripeCheckoutSession,
  resolveCheckoutProduct,
} from "@/application/payments";
import orderModel from "@/domains/order/model";
import { logger } from "@/lib/logger";

export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.json().catch(() => null);
    const parsed = CheckoutCreateSessionSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const product = resolveCheckoutProduct(parsed.data.productKey);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const order = await orderModel.createPendingOrder({
      email: parsed.data.email,
      productKey: product.productKey,
      amount: product.amount,
      currency: product.currency,
      provider: "stripe",
    });

    const stripeSession = await createStripeCheckoutSession({
      orderId: order.id,
      product,
      email: parsed.data.email,
      source: parsed.data.source,
    });

    if (!stripeSession.ok) {
      return NextResponse.json(
        { ok: false, error: "provider_error" },
        { status: 502 }
      );
    }

    await orderModel.attachStripeSession({
      orderId: order.id,
      stripeSessionId: stripeSession.sessionId,
      stripePaymentIntentId: stripeSession.paymentIntentId,
    });

    return NextResponse.json({ ok: true, url: stripeSession.url });
  } catch (error) {
    logger.error("Payments", "Failed to create checkout session", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
