import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { recaptchaErrorPayload, verifyRecaptchaToken } from "@/lib/recaptcha";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

const getExpectedAction = (request: NextRequest): string | null => {
  const pathname = request.nextUrl.pathname;
  if (pathname.includes("/sign-in/email")) return "auth_login";
  if (pathname.includes("/sign-up/email")) return "auth_signup";
  return null;
};

const isSocialProviderEnabled = (provider: string): boolean => {
  switch (provider) {
    case "google":
      return Boolean(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      );
    case "github":
      return Boolean(
        process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      );
    case "linkedin":
      return Boolean(
        process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      );
    case "microsoft": {
      const id =
        process.env.MICROSOFT_CLIENT_ID ?? process.env.AZURE_AD_CLIENT_ID;
      const secret =
        process.env.MICROSOFT_CLIENT_SECRET ??
        process.env.AZURE_AD_CLIENT_SECRET;
      return Boolean(id && secret);
    }
    default:
      return false;
  }
};

export const GET = handler.GET;

export const POST = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const body = await request
    .clone()
    .json()
    .catch(() => null);

  if (pathname.includes("/sign-in/social")) {
    const provider = typeof body?.provider === "string" ? body.provider : "";

    if (!provider || !isSocialProviderEnabled(provider)) {
      return NextResponse.json(
        { ok: false, error: "provider_not_enabled" },
        { status: 400 }
      );
    }
  }

  const expectedAction = getExpectedAction(request);
  if (!expectedAction) {
    try {
      return await handler.POST(request);
    } catch (error) {
      logger.error("Auth", "Unhandled auth handler error", {
        pathname,
        provider: typeof body?.provider === "string" ? body.provider : null,
        error,
      });
      return NextResponse.json(
        { ok: false, error: "auth_provider_error" },
        {
          status: 500,
        }
      );
    }
  }

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

  try {
    return await handler.POST(request);
  } catch (error) {
    logger.error("Auth", "Unhandled auth handler error", {
      pathname,
      provider: typeof body?.provider === "string" ? body.provider : null,
      error,
    });
    return NextResponse.json(
      { ok: false, error: "auth_provider_error" },
      {
        status: 500,
      }
    );
  }
};
