import { logger } from "@/lib/logger";
import type { AnalyticsEventName, AnalyticsEventProps } from "./plausible";

type ServerEventOptions = {
  url?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
};

const getPlausibleConfig = (): { domain: string; host: string } | null => {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;

  if (!domain || !host) return null;

  return { domain, host };
};

export const trackServerEvent = async (
  name: AnalyticsEventName,
  props?: AnalyticsEventProps,
  options?: ServerEventOptions
): Promise<void> => {
  const config = getPlausibleConfig();
  if (!config) return;

  try {
    const response = await fetch(`${config.host}/api/event`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options?.ip ? { "X-Forwarded-For": options.ip } : {}),
        ...(options?.userAgent ? { "User-Agent": options.userAgent } : {}),
        ...(options?.referrer ? { Referer: options.referrer } : {}),
      },
      body: JSON.stringify({
        domain: config.domain,
        name,
        url: options?.url,
        props,
      }),
    });

    if (!response.ok) {
      logger.error("Analytics", "Server event tracking failed", {
        status: response.status,
      });
    }
  } catch (error) {
    logger.error("Analytics", "Server event tracking error", error);
  }
};
