import { logger } from "@/lib/logger";

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
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
  const limit = Number(process.env.UPSTASH_RATE_LIMIT_MAX ?? 5);
  const windowMs = Number(process.env.UPSTASH_RATE_LIMIT_WINDOW_MS ?? 60_000);

  if (!url || !token) {
    logger.warn("Contact", "Upstash rate limit env vars missing", {
      url: Boolean(url),
      token: Boolean(token),
    });
    return null;
  }

  return {
    url,
    token,
    limit: Number.isFinite(limit) ? limit : 5,
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

export const checkRateLimit = async (
  identifier: string
): Promise<RateLimitResult> => {
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
  const key = `ratelimit:contact:${identifier}`;

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
    logger.error("Contact", "Upstash rate limit failed", error);
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit,
      reset: now + config.windowMs,
    };
  }
};
