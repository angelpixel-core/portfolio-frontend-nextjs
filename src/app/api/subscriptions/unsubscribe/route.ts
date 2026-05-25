import type { NextRequest } from "next/server";

import {
  getCorrelationId,
  jsonError,
  jsonOk,
  SubscribeTokenSchema,
  validateSubscriptionToken,
} from "@/application/subscriptions";
import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { logger } from "@/lib/logger";

export const POST = async (request: NextRequest) => {
  const correlationId = getCorrelationId(request);

  try {
    const payload = await request.json().catch(() => null);
    const parsed = SubscribeTokenSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError("invalid", 400, correlationId);
    }

    const parsedToken = validateSubscriptionToken(
      parsed.data.token,
      "unsubscribe"
    );
    if (!parsedToken.ok) {
      return jsonError("invalid", 400, correlationId);
    }

    const subscription = await subscriptionModel.findById(
      parsedToken.payload.sid
    );
    if (!subscription) {
      return jsonError("not_found", 404, correlationId);
    }

    if (subscription.email !== parsedToken.payload.email) {
      return jsonError("invalid", 400, correlationId);
    }

    if (subscription.status === "unsubscribed") {
      return jsonOk(
        {
          ok: true,
          status: "unsubscribed",
          idempotent: true,
        },
        correlationId
      );
    }

    await subscriptionModel.markUnsubscribed(subscription.id);
    await subscriptionEventModel.recordEvent({
      subscriptionId: subscription.id,
      type: "unsubscribed",
    });

    return jsonOk(
      {
        ok: true,
        status: "unsubscribed",
        idempotent: false,
      },
      correlationId
    );
  } catch (error) {
    logger.error("Subscription", "Failed to unsubscribe", {
      correlationId,
      error,
    });
    return jsonError("provider_error", 500, correlationId);
  }
};
