import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";
import { sendSubscriptionConfirmEmail } from "@/services/subscriptions/email";
import { buildSubscriptionToken } from "@/services/subscriptions/token";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ActionSchema = z.object({
  action: z.enum(["resend_confirm", "mark_unsubscribed"]),
});

const getTokenTtlHours = (): number => {
  const parsed = Number(process.env.SUBSCRIBE_TOKEN_TTL_HOURS ?? "24");
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 24;
  }

  return parsed;
};

export const POST = async (request: NextRequest, context: RouteContext) => {
  const adminEmail = await getAdminSessionEmail(request.headers);
  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = ActionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { id } = await context.params;
  const subscription = await subscriptionModel.findById(id);
  if (!subscription) {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );
  }

  if (parsed.data.action === "mark_unsubscribed") {
    if (subscription.status === "unsubscribed") {
      return NextResponse.json({ ok: true, idempotent: true, subscription });
    }

    await subscriptionModel.markUnsubscribed(subscription.id);
    await subscriptionEventModel.recordEvent({
      subscriptionId: subscription.id,
      type: "unsubscribed",
      payload: JSON.stringify({ actor: adminEmail, source: "admin_action" }),
    });

    const updated = await subscriptionModel.findById(subscription.id);
    return NextResponse.json({
      ok: true,
      idempotent: false,
      subscription: updated,
    });
  }

  if (
    subscription.status === "unsubscribed" ||
    subscription.status === "bounced" ||
    subscription.status === "complained"
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_state" },
      { status: 409 }
    );
  }

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

  const sent = await sendSubscriptionConfirmEmail({
    email: subscription.email,
    confirmToken,
    unsubscribeToken,
  });

  if (!sent.ok) {
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 502 }
    );
  }

  await subscriptionEventModel.recordEvent({
    subscriptionId: subscription.id,
    type: "confirm_sent",
    payload: JSON.stringify({ actor: adminEmail, source: "admin_action" }),
  });

  return NextResponse.json({ ok: true, idempotent: false, subscription });
};
