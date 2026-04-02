import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { recaptchaErrorPayload, verifyRecaptchaToken } from "@/lib/recaptcha";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

const getExpectedAction = (request: NextRequest): string | null => {
  const pathname = request.nextUrl.pathname;
  if (pathname.includes("/sign-in/")) return "auth_login";
  if (pathname.includes("/sign-up/")) return "auth_signup";
  return null;
};

export const GET = handler.GET;

export const POST = async (request: NextRequest) => {
  const expectedAction = getExpectedAction(request);
  if (!expectedAction) {
    return handler.POST(request);
  }

  const body = await request
    .clone()
    .json()
    .catch(() => null);
  if (!body || body.recaptchaAction !== expectedAction) {
    return NextResponse.json(recaptchaErrorPayload("recaptcha_invalid"), {
      status: 400,
    });
  }

  const recaptcha = await verifyRecaptchaToken(
    body.recaptchaToken,
    expectedAction
  );

  if (!recaptcha.ok) {
    logger.warn("Auth", "Recaptcha verification failed", {
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

  return handler.POST(request);
};
