import { logger } from "@/lib/logger";

export type SubscriptionRateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  degraded?: boolean;
  degradedReason?: "dns" | "auth" | "timeout" | "http_error" | "unknown";
  degradedHost?: string;
};

type UpstashConfig = {
  url: string;
  token: string;
  limit: number;
  windowMs: number;
};

const getUpstashConfig = (): UpstashConfig | null => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const limit = Number(process.env.SUBSCRIBE_RATE_LIMIT_MAX ?? 8);
  const windowMs = Number(process.env.SUBSCRIBE_RATE_LIMIT_WINDOW_MS ?? 60_000);

  if (!url || !token) {
    logger.warn("Subscription", "Upstash rate limit env vars missing", {
      url: Boolean(url),
      token: Boolean(token),
    });
    return null;
  }

  return {
    url,
    token,
    limit: Number.isFinite(limit) ? limit : 8,
    windowMs: Number.isFinite(windowMs) ? windowMs : 60_000,
  };
};

const redisCommand = async <T>(
  config: UpstashConfig,
  command: string,
  args: Array<string | number>
): Promise<T> => {
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([command, ...args.map(String)]),
  });

  const data = (await response.json()) as { result?: T; error?: string };

  if (!response.ok || data.error) {
    throw new Error(data.error || "Upstash request failed");
  }

  return data.result as T;
};

const normalizeIdentifier = (identifier: string): string => {
  return identifier.trim().toLowerCase();
};

const getHostFromUrl = (url: string): string | null => {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
};

const classifyUpstashError = (
  error: unknown
): "dns" | "auth" | "timeout" | "http_error" | "unknown" => {
  const message =
    error instanceof Error
      ? `${error.message} ${(error as any)?.cause?.code ?? ""}`.toLowerCase()
      : String(error).toLowerCase();

  if (message.includes("enotfound") || message.includes("getaddrinfo")) {
    return "dns";
  }

  if (
    message.includes("401") ||
    message.includes("403") ||
    message.includes("unauthorized") ||
    message.includes("forbidden")
  ) {
    return "auth";
  }

  if (
    message.includes("timeout") ||
    message.includes("etimedout") ||
    message.includes("aborted")
  ) {
    return "timeout";
  }

  if (
    message.includes("upstash request failed") ||
    message.includes("fetch failed")
  ) {
    return "http_error";
  }

  return "unknown";
};

export const checkSubscriptionRateLimit = async (
  identifier: string
): Promise<SubscriptionRateLimitResult> => {
  const config = getUpstashConfig();
  if (!config) {
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: Date.now(),
    };
  }

  const now = Date.now();
  const windowStart = now - config.windowMs;
  const key = `ratelimit:subscription:${normalizeIdentifier(identifier)}`;
  const degradedHost = getHostFromUrl(config.url) ?? "unknown";

  try {
    await redisCommand<number>(config, "ZREMRANGEBYSCORE", [
      key,
      0,
      windowStart,
    ]);
    const current = await redisCommand<number>(config, "ZCARD", [key]);

    if (current >= config.limit) {
      return {
        success: false,
        limit: config.limit,
        remaining: 0,
        reset: now + config.windowMs,
      };
    }

    await redisCommand<number>(config, "ZADD", [
      key,
      now,
      `${now}-${Math.random()}`,
    ]);
    await redisCommand<number>(config, "PEXPIRE", [key, config.windowMs]);

    return {
      success: true,
      limit: config.limit,
      remaining: Math.max(config.limit - current - 1, 0),
      reset: now + config.windowMs,
    };
  } catch (error) {
    const degradedReason = classifyUpstashError(error);
    logger.error(
      "Subscription",
      "Upstash subscription rate limit failed",
      error
    );
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: now + config.windowMs,
      degraded: true,
      degradedReason,
      degradedHost,
    };
  }
};
