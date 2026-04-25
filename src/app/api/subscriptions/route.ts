import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { logger } from "@/lib/logger";
import { sendSubscriptionConfirmEmail } from "@/services/subscriptions/email";
import { SubscribeCreateSchema } from "@/services/subscriptions/schema";
import { buildSubscriptionToken } from "@/services/subscriptions/token";

const getTokenTtlHours = (): number => {
  const parsed = Number(process.env.SUBSCRIBE_TOKEN_TTL_HOURS ?? "24");
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 24;
  }

  return parsed;
};

export const POST = async (request: NextRequest) => {
  try {
    const payload = await request.json().catch(() => null);
    const parsed = SubscribeCreateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const subscription = await subscriptionModel.createOrUpdatePending({
      email: parsed.data.email,
      source: parsed.data.source,
      articleSlug: parsed.data.articleSlug,
      locale: parsed.data.locale,
    });

    await subscriptionEventModel.recordEvent({
      subscriptionId: subscription.id,
      type: "created",
      payload: JSON.stringify({
        source: subscription.source,
        articleSlug: subscription.articleSlug,
      }),
    });

    const ttlSeconds = getTokenTtlHours() * 60 * 60;
    const confirmToken = buildSubscriptionToken({
      subscriptionId: subscription.id,
      email: subscription.email,
      purpose: "confirm",
      expiresInSeconds: ttlSeconds,
    });
    const unsubscribeToken = buildSubscriptionToken({
      subscriptionId: subscription.id,
      email: subscription.email,
      purpose: "unsubscribe",
      expiresInSeconds: ttlSeconds,
    });

    if (!confirmToken || !unsubscribeToken) {
      return NextResponse.json(
        { ok: false, error: "config_error" },
        { status: 500 }
      );
    }

    const delivery = await sendSubscriptionConfirmEmail({
      email: subscription.email,
      confirmToken,
      unsubscribeToken,
    });

    if (!delivery.ok) {
      return NextResponse.json(
        { ok: false, error: "provider_error" },
        { status: 502 }
      );
    }

    await subscriptionEventModel.recordEvent({
      subscriptionId: subscription.id,
      type: "confirm_sent",
    });

    return NextResponse.json({
      ok: true,
      status: "pending_confirmation",
    });
  } catch (error) {
    logger.error("Subscription", "Failed to create subscription", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
