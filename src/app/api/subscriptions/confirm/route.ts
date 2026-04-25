import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { logger } from "@/lib/logger";
import { validateSubscriptionToken } from "@/services/subscriptions/token";

export const GET = async (request: NextRequest) => {
  try {
    const token = request.nextUrl.searchParams.get("token")?.trim();
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const parsedToken = validateSubscriptionToken(token, "confirm");
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

    if (subscription.status === "subscribed") {
      return NextResponse.json({
        ok: true,
        status: "subscribed",
        idempotent: true,
      });
    }

    await subscriptionModel.markConfirmed(subscription.id);
    await subscriptionEventModel.recordEvent({
      subscriptionId: subscription.id,
      type: "confirmed",
    });

    return NextResponse.json({
      ok: true,
      status: "subscribed",
      idempotent: false,
    });
  } catch (error) {
    logger.error("Subscription", "Failed to confirm subscription", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
