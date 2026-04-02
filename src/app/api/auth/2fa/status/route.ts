import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getTwoFactorStatus } from "../store";
import { getUserKey, handleTwoFactorError } from "../utils";

export const GET = async (request: NextRequest) => {
  try {
    const status = getTwoFactorStatus(getUserKey(request));
    return NextResponse.json(status);
  } catch (error) {
    return handleTwoFactorError(error);
  }
};
