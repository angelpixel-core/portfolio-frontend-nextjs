import type { NextRequest } from "next/server";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { logger } from "@/lib/logger";
import { sendSubscriptionConfirmEmail } from "@/services/subscriptions/email";
import {
  getClientIp,
  getCorrelationId,
  jsonError,
  jsonOk,
} from "@/services/subscriptions/http";
import { checkSubscriptionRateLimit } from "@/services/subscriptions/rateLimit";
import { SubscribeCreateSchema } from "@/services/subscriptions/schema";
import { buildSubscriptionToken } from "@/services/subscriptions/token";

const MIN_FORM_DURATION_MS = Number(
  process.env.SUBSCRIBE_MIN_FORM_DURATION_MS ?? "2500"
);

const getTokenTtlHours = (): number => {
  const parsed = Number(process.env.SUBSCRIBE_TOKEN_TTL_HOURS ?? "24");
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 24;
  }

  return parsed;
};

export const POST = async (request: NextRequest) => {
  const correlationId = getCorrelationId(request);

  try {
    const payload = await request.json().catch(() => null);
    const parsed = SubscribeCreateSchema.safeParse(payload);

    if (!parsed.success) {
      logger.warn("Subscription", "Invalid subscription payload", {
        correlationId,
      });
      return jsonError("invalid", 400, correlationId);
    }

    const now = Date.now();
    const isHoneypot = Boolean(parsed.data.honeypot?.trim());
    const isTooFast =
      typeof parsed.data.formStart === "number" &&
      now - parsed.data.formStart < MIN_FORM_DURATION_MS;

    if (isHoneypot || isTooFast) {
      logger.warn("Subscription", "Spam signal detected on subscribe", {
        correlationId,
        honeypot: isHoneypot,
        tooFast: isTooFast,
      });
      return jsonOk({ ok: true, status: "accepted" }, correlationId);
    }

    const ip = getClientIp(request);
    const identifier = `${ip}:${parsed.data.email.trim().toLowerCase()}`;
    const rateLimit = await checkSubscriptionRateLimit(identifier);
    if (!rateLimit.success) {
      logger.warn("Subscription", "Subscription rate limited", {
        correlationId,
        ip,
      });
      return jsonError("rate_limited", 429, correlationId);
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
      logger.error("Subscription", "Missing subscribe token secret", {
        correlationId,
      });
      return jsonError("config_error", 500, correlationId);
    }

    const delivery = await sendSubscriptionConfirmEmail({
      email: subscription.email,
      confirmToken,
      unsubscribeToken,
    });

    if (!delivery.ok) {
      logger.error("Subscription", "Subscription confirm email failed", {
        correlationId,
      });
      return jsonError("provider_error", 502, correlationId);
    }

    await subscriptionEventModel.recordEvent({
      subscriptionId: subscription.id,
      type: "confirm_sent",
    });

    return jsonOk(
      {
        ok: true,
        status: "pending_confirmation",
      },
      correlationId
    );
  } catch (error) {
    logger.error("Subscription", "Failed to create subscription", {
      correlationId,
      error,
    });
    return jsonError("provider_error", 500, correlationId);
  }
};
