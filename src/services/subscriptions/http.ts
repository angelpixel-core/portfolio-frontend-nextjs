import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type ErrorCode =
  | "invalid"
  | "rate_limited"
  | "provider_error"
  | "config_error"
  | "not_found"
  | "invalid_state";

export const getCorrelationId = (request: NextRequest): string => {
  const incoming = request.headers.get("x-correlation-id")?.trim();
  return incoming && incoming.length > 0 ? incoming : randomUUID();
};

export const getClientIp = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
};

export const jsonOk = (
  payload: Record<string, unknown>,
  correlationId: string
) => {
  return NextResponse.json(
    { ...payload, correlationId },
    {
      status: 200,
      headers: {
        "x-correlation-id": correlationId,
      },
    }
  );
};

export const jsonError = (
  code: ErrorCode,
  status: number,
  correlationId: string
) => {
  return NextResponse.json(
    {
      ok: false,
      error: code,
      correlationId,
    },
    {
      status,
      headers: {
        "x-correlation-id": correlationId,
      },
    }
  );
};
