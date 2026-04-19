import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/lib/logger";

const getPlausibleHost = (): string | null => {
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST?.trim();
  if (!host) return null;
  return host.replace(/\/+$/, "");
};

export const POST = async (request: NextRequest) => {
  const host = getPlausibleHost();
  if (!host) {
    return NextResponse.json({ ok: true });
  }

  const payload = await request.text().catch(() => "");

  try {
    const response = await fetch(`${host}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type":
          request.headers.get("content-type") ?? "text/plain; charset=UTF-8",
        ...(request.headers.get("user-agent")
          ? { "User-Agent": request.headers.get("user-agent") as string }
          : {}),
        ...(request.headers.get("referer")
          ? { Referer: request.headers.get("referer") as string }
          : {}),
      },
      body: payload,
    });

    if (!response.ok) {
      logger.warn("Analytics", "Plausible proxy returned non-2xx", {
        status: response.status,
      });
    }
  } catch (error) {
    logger.error("Analytics", "Plausible proxy request failed", error);
  }

  return NextResponse.json({ ok: true });
};
