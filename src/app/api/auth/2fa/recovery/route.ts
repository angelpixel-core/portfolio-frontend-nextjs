import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { regenerateRecoveryCodes } from "../store";
import { getUserKey, handleTwoFactorError } from "../utils";

export const POST = async (request: NextRequest) => {
  try {
    const codes = regenerateRecoveryCodes(getUserKey(request));
    return NextResponse.json(codes);
  } catch (error) {
    return handleTwoFactorError(error);
  }
};
