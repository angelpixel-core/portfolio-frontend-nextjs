import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { TwoFactorError } from "./store";

const DEFAULT_USER_KEY = "demo-user";
const DEFAULT_USER_LABEL = "user";

export const getUserKey = (request: NextRequest): string =>
  request.headers.get("x-user-id")?.trim() || DEFAULT_USER_KEY;

export const getUserLabel = (request: NextRequest): string =>
  request.headers.get("x-user-email")?.trim() || DEFAULT_USER_LABEL;

export const handleTwoFactorError = (error: unknown) => {
  if (error instanceof TwoFactorError) {
    return NextResponse.json(
      { ok: false, error: error.code },
      { status: error.status }
    );
  }

  return NextResponse.json(
    { ok: false, error: "server_error" },
    { status: 500 }
  );
};
