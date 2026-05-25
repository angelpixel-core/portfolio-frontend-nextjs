import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  createResumeRequestActivity,
  getLatestResumeRequestStatus,
  hasPendingResumeRequest,
  markResumeRequestSent,
  ResumeRequestSchema,
  sendResumeRequestEmail,
} from "@/application/resumeRequest";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { recaptchaErrorPayload, verifyRecaptchaToken } from "@/lib/recaptcha";

const SENT_STATUS = "sent";

const getSessionUser = async (request: NextRequest) => {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
};

export const GET = async (request: NextRequest) => {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "unauthenticated" },
        { status: 401 }
      );
    }

    const status = await getLatestResumeRequestStatus(user.id);
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    logger.error("ResumeRequest", "Failed to fetch status", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "unauthenticated" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = ResumeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const expectedRecaptchaAction = "resume_request";
    if (parsed.data.recaptchaAction !== expectedRecaptchaAction) {
      return NextResponse.json(recaptchaErrorPayload("recaptcha_invalid"), {
        status: 400,
      });
    }

    const recaptcha = await verifyRecaptchaToken(
      parsed.data.recaptchaToken,
      expectedRecaptchaAction
    );
    if (!recaptcha.ok) {
      logger.warn("ResumeRequest", "Recaptcha verification failed", {
        reason: recaptcha.reason,
        score: recaptcha.score,
        action: recaptcha.action,
        errorCodes: recaptcha.errorCodes,
      });

      const status =
        recaptcha.reason === "missing_secret" ||
        recaptcha.reason === "missing_token"
          ? 400
          : 403;
      return NextResponse.json(
        recaptchaErrorPayload(
          status === 400 ? "recaptcha_invalid" : "recaptcha_failed"
        ),
        { status }
      );
    }

    if (await hasPendingResumeRequest(user.id)) {
      return NextResponse.json(
        { ok: false, error: "already_requested" },
        { status: 409 }
      );
    }

    const activityId = randomUUID();
    const now = new Date();
    await createResumeRequestActivity({
      id: activityId,
      userId: user.id,
      source: parsed.data.source,
      createdAt: now,
    });

    const delivery = await sendResumeRequestEmail(
      { id: user.id, email: user.email, name: user.name ?? undefined },
      parsed.data
    );

    if (!delivery.ok) {
      return NextResponse.json(
        { ok: false, error: "provider_error" },
        { status: 502 }
      );
    }

    await markResumeRequestSent(activityId, new Date());

    return NextResponse.json({ ok: true, status: SENT_STATUS });
  } catch (error) {
    logger.error("ResumeRequest", "Failed to process request", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
