import type { NextRequest } from "next/server";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { sendSubscriptionConfirmEmail } from "@/services/subscriptions/email";
import { checkSubscriptionRateLimit } from "@/services/subscriptions/rateLimit";
import { buildSubscriptionToken } from "@/services/subscriptions/token";

jest.mock("@/domains/subscription/model", () => ({
  __esModule: true,
  default: {
    createOrUpdatePending: jest.fn(),
  },
}));

jest.mock("@/domains/subscription-event/model", () => ({
  __esModule: true,
  default: {
    recordEvent: jest.fn(),
  },
}));

jest.mock("@/services/subscriptions/email", () => ({
  sendSubscriptionConfirmEmail: jest.fn(),
}));

jest.mock("@/services/subscriptions/token", () => ({
  buildSubscriptionToken: jest.fn(),
}));

jest.mock("@/services/subscriptions/rateLimit", () => ({
  checkSubscriptionRateLimit: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

const mockCreateOrUpdatePending =
  subscriptionModel.createOrUpdatePending as jest.MockedFunction<
    typeof subscriptionModel.createOrUpdatePending
  >;
const mockRecordEvent =
  subscriptionEventModel.recordEvent as jest.MockedFunction<
    typeof subscriptionEventModel.recordEvent
  >;
const mockSendSubscriptionConfirmEmail =
  sendSubscriptionConfirmEmail as jest.MockedFunction<
    typeof sendSubscriptionConfirmEmail
  >;
const mockBuildSubscriptionToken =
  buildSubscriptionToken as jest.MockedFunction<typeof buildSubscriptionToken>;
const mockCheckSubscriptionRateLimit =
  checkSubscriptionRateLimit as jest.MockedFunction<
    typeof checkSubscriptionRateLimit
  >;

let POST: typeof import("../route").POST;

const createRequest = (payload: unknown) =>
  ({
    headers: new Headers(),
    json: async () => payload,
  }) as unknown as NextRequest;

describe("POST /api/subscriptions", () => {
  beforeAll(async () => {
    if (typeof globalThis.Headers === "undefined") {
      class Headers {
        private map = new Map<string, string>();

        constructor(init?: Record<string, string> | Headers) {
          if (init instanceof Headers) {
            init.forEach((_value, _key) => this.set(_key, _value));
          } else if (init) {
            Object.entries(init).forEach(([_key, _value]) =>
              this.set(_key, _value)
            );
          }
        }

        get(key: string): string | null {
          return this.map.get(key.toLowerCase()) ?? null;
        }

        set(key: string, value: string): void {
          this.map.set(key.toLowerCase(), value);
        }

        forEach(callback: (_value: string, _key: string) => void): void {
          this.map.forEach(callback);
        }
      }

      globalThis.Headers = Headers as unknown as typeof globalThis.Headers;
    }

    if (typeof globalThis.Response === "undefined") {
      class Response {
        status: number;
        headers: Headers;
        private body: string | null;

        constructor(
          body?: string | null,
          init?: { status?: number; headers?: any }
        ) {
          this.body = body ?? null;
          this.status = init?.status ?? 200;
          this.headers = new Headers(init?.headers);
        }

        async json() {
          if (!this.body) return null;
          return JSON.parse(this.body);
        }

        static json(data: unknown, init?: { status?: number; headers?: any }) {
          return new Response(JSON.stringify(data), {
            ...init,
            headers: {
              "content-type": "application/json",
              ...(init?.headers ?? {}),
            },
          });
        }
      }

      globalThis.Response = Response as unknown as typeof globalThis.Response;
    }

    if (typeof globalThis.Request === "undefined") {
      class Request {}
      globalThis.Request = Request as unknown as typeof globalThis.Request;
    }

    ({ POST } = await import("../route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateOrUpdatePending.mockResolvedValue({
      id: "sub-1",
      email: "hello@angelpixel.io",
      status: "pending_confirmation",
      source: "article_cta",
      articleSlug: "why-portfolio-not-convert",
      locale: null,
      confirmedAt: null,
      unsubscribedAt: null,
      createdAt: new Date("2026-04-25T00:00:00.000Z"),
      updatedAt: new Date("2026-04-25T00:00:00.000Z"),
    });
    mockRecordEvent.mockResolvedValue(undefined);
    mockSendSubscriptionConfirmEmail.mockResolvedValue({ ok: true });
    mockCheckSubscriptionRateLimit.mockResolvedValue({
      success: true,
      limit: 8,
      remaining: 7,
      reset: Date.now() + 60_000,
    });
    mockBuildSubscriptionToken
      .mockReturnValueOnce("confirm-token")
      .mockReturnValueOnce("unsubscribe-token");
  });

  it("returns 400 for invalid payload", async () => {
    const response = await POST(createRequest({ email: "" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual(
      expect.objectContaining({ ok: false, error: "invalid" })
    );
    expect(mockCreateOrUpdatePending).not.toHaveBeenCalled();
  });

  it("returns config_error when token secret is missing", async () => {
    mockBuildSubscriptionToken.mockReset();
    mockBuildSubscriptionToken.mockReturnValue(null);

    const response = await POST(
      createRequest({
        email: "hello@angelpixel.io",
        source: "article_cta",
        articleSlug: "why-portfolio-not-convert",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual(
      expect.objectContaining({ ok: false, error: "config_error" })
    );
    expect(mockSendSubscriptionConfirmEmail).not.toHaveBeenCalled();
  });

  it("returns provider_error when email delivery fails", async () => {
    mockSendSubscriptionConfirmEmail.mockResolvedValue({ ok: false });

    const response = await POST(
      createRequest({
        email: "hello@angelpixel.io",
        source: "article_cta",
        articleSlug: "why-portfolio-not-convert",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual(
      expect.objectContaining({ ok: false, error: "provider_error" })
    );
  });

  it("returns ok accepted for honeypot spam", async () => {
    const response = await POST(
      createRequest({
        email: "hello@angelpixel.io",
        source: "article_cta",
        articleSlug: "why-portfolio-not-convert",
        honeypot: "bot",
        formStart: Date.now() - 10_000,
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({ ok: true, status: "accepted" })
    );
    expect(mockCreateOrUpdatePending).not.toHaveBeenCalled();
  });

  it("returns 429 when subscription is rate limited", async () => {
    mockCheckSubscriptionRateLimit.mockResolvedValue({
      success: false,
      limit: 8,
      remaining: 0,
      reset: Date.now() + 60_000,
    });

    const response = await POST(
      createRequest({
        email: "hello@angelpixel.io",
        source: "article_cta",
        articleSlug: "why-portfolio-not-convert",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body).toEqual(
      expect.objectContaining({ ok: false, error: "rate_limited" })
    );
    expect(mockCreateOrUpdatePending).not.toHaveBeenCalled();
  });

  it("creates or updates pending subscription and logs lifecycle", async () => {
    const response = await POST(
      createRequest({
        email: "hello@angelpixel.io",
        source: "article_cta",
        articleSlug: "why-portfolio-not-convert",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({ ok: true, status: "pending_confirmation" })
    );
    expect(mockCreateOrUpdatePending).toHaveBeenCalledWith({
      email: "hello@angelpixel.io",
      source: "article_cta",
      articleSlug: "why-portfolio-not-convert",
      locale: undefined,
    });
    expect(mockRecordEvent).toHaveBeenNthCalledWith(1, {
      subscriptionId: "sub-1",
      type: "created",
      payload: expect.any(String),
    });
    expect(mockRecordEvent).toHaveBeenNthCalledWith(2, {
      subscriptionId: "sub-1",
      type: "confirm_sent",
    });
  });
});
