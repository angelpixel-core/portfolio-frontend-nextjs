import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { startTwoFactorEnrollment } from "../store";
import { getUserKey, getUserLabel, handleTwoFactorError } from "../utils";

export const POST = async (request: NextRequest) => {
  try {
    const userKey = getUserKey(request);
    const label = getUserLabel(request);
    const enrollment = startTwoFactorEnrollment(userKey, label);
    return NextResponse.json(enrollment);
  } catch (error) {
    return handleTwoFactorError(error);
  }
};
