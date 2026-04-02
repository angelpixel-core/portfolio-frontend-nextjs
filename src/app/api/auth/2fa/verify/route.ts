import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyTwoFactorEnrollment } from "../store";
import { getUserKey, handleTwoFactorError } from "../utils";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.code || typeof body.code !== "string") {
      return NextResponse.json(
        { ok: false, error: "invalid_request" },
        { status: 400 }
      );
    }

    const result = verifyTwoFactorEnrollment(getUserKey(request), body.code);
    return NextResponse.json(result);
  } catch (error) {
    return handleTwoFactorError(error);
  }
};
