import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { logger } from "@/lib/logger";
import { SubscribeTokenSchema } from "@/services/subscriptions/schema";
import { validateSubscriptionToken } from "@/services/subscriptions/token";

export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.json().catch(() => null);
    const parsed = SubscribeTokenSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const parsedToken = validateSubscriptionToken(
      parsed.data.token,
      "unsubscribe"
    );
    if (!parsedToken.ok) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const subscription = await subscriptionModel.findById(
      parsedToken.payload.sid
    );
    if (!subscription) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }

    if (subscription.email !== parsedToken.payload.email) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    if (subscription.status === "unsubscribed") {
      return NextResponse.json({
        ok: true,
        status: "unsubscribed",
        idempotent: true,
      });
    }

    await subscriptionModel.markUnsubscribed(subscription.id);
    await subscriptionEventModel.recordEvent({
      subscriptionId: subscription.id,
      type: "unsubscribed",
    });

    return NextResponse.json({
      ok: true,
      status: "unsubscribed",
      idempotent: false,
    });
  } catch (error) {
    logger.error("Subscription", "Failed to unsubscribe", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
