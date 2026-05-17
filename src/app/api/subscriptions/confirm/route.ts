import type { NextRequest } from "next/server";

import {
  getCorrelationId,
  jsonError,
  jsonOk,
  validateSubscriptionToken,
} from "@/application/subscriptions";
import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { logger } from "@/lib/logger";

export const GET = async (request: NextRequest) => {
  const correlationId = getCorrelationId(request);

  try {
    const token = request.nextUrl.searchParams.get("token")?.trim();
    if (!token) {
      return jsonError("invalid", 400, correlationId);
    }

    const parsedToken = validateSubscriptionToken(token, "confirm");
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

    if (subscription.status === "subscribed") {
      return jsonOk(
        {
          ok: true,
          status: "subscribed",
          idempotent: true,
        },
        correlationId
      );
    }

    await subscriptionModel.markConfirmed(subscription.id);
    await subscriptionEventModel.recordEvent({
      subscriptionId: subscription.id,
      type: "confirmed",
    });

    return jsonOk(
      {
        ok: true,
        status: "subscribed",
        idempotent: false,
      },
      correlationId
    );
  } catch (error) {
    logger.error("Subscription", "Failed to confirm subscription", {
      correlationId,
      error,
    });
    return jsonError("provider_error", 500, correlationId);
  }
};
