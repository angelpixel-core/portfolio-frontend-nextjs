import type { NextRequest } from "next/server";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { validateSubscriptionToken } from "@/services/subscriptions/token";

jest.mock("@/domains/subscription/model", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    markUnsubscribed: jest.fn(),
  },
}));

jest.mock("@/domains/subscription-event/model", () => ({
  __esModule: true,
  default: {
    recordEvent: jest.fn(),
  },
}));

jest.mock("@/services/subscriptions/token", () => ({
  validateSubscriptionToken: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

const mockFindById = subscriptionModel.findById as jest.MockedFunction<
  typeof subscriptionModel.findById
>;
const mockMarkUnsubscribed =
  subscriptionModel.markUnsubscribed as jest.MockedFunction<
    typeof subscriptionModel.markUnsubscribed
  >;
const mockRecordEvent =
  subscriptionEventModel.recordEvent as jest.MockedFunction<
    typeof subscriptionEventModel.recordEvent
  >;
const mockValidateSubscriptionToken =
  validateSubscriptionToken as jest.MockedFunction<
    typeof validateSubscriptionToken
  >;

let POST: typeof import("../route").POST;

const createRequest = (payload: unknown) =>
  ({
    json: async () => payload,
  }) as unknown as NextRequest;

describe("POST /api/subscriptions/unsubscribe", () => {
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
    mockMarkUnsubscribed.mockResolvedValue(undefined);
    mockRecordEvent.mockResolvedValue(undefined);
  });

  it("returns 400 for invalid payload", async () => {
    const response = await POST(createRequest({ token: "" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid" });
  });

  it("returns 400 for invalid token", async () => {
    mockValidateSubscriptionToken.mockReturnValue({
      ok: false,
      reason: "invalid",
    });

    const response = await POST(createRequest({ token: "abc" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid" });
  });

  it("returns 404 when subscription is missing", async () => {
    mockValidateSubscriptionToken.mockReturnValue({
      ok: true,
      payload: {
        sid: "sub-1",
        email: "hello@angelpixel.io",
        purpose: "unsubscribe",
        exp: Math.floor(Date.now() / 1000) + 100,
      },
    });
    mockFindById.mockResolvedValue(null);

    const response = await POST(createRequest({ token: "abc" }));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ ok: false, error: "not_found" });
  });

  it("returns idempotent success when already unsubscribed", async () => {
    mockValidateSubscriptionToken.mockReturnValue({
      ok: true,
      payload: {
        sid: "sub-1",
        email: "hello@angelpixel.io",
        purpose: "unsubscribe",
        exp: Math.floor(Date.now() / 1000) + 100,
      },
    });
    mockFindById.mockResolvedValue({
      id: "sub-1",
      email: "hello@angelpixel.io",
      status: "unsubscribed",
      source: null,
      articleSlug: null,
      locale: null,
      confirmedAt: null,
      unsubscribedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await POST(createRequest({ token: "abc" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      status: "unsubscribed",
      idempotent: true,
    });
    expect(mockMarkUnsubscribed).not.toHaveBeenCalled();
  });

  it("marks unsubscribed and logs lifecycle event", async () => {
    mockValidateSubscriptionToken.mockReturnValue({
      ok: true,
      payload: {
        sid: "sub-1",
        email: "hello@angelpixel.io",
        purpose: "unsubscribe",
        exp: Math.floor(Date.now() / 1000) + 100,
      },
    });
    mockFindById.mockResolvedValue({
      id: "sub-1",
      email: "hello@angelpixel.io",
      status: "subscribed",
      source: null,
      articleSlug: null,
      locale: null,
      confirmedAt: null,
      unsubscribedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await POST(createRequest({ token: "abc" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      status: "unsubscribed",
      idempotent: false,
    });
    expect(mockMarkUnsubscribed).toHaveBeenCalledWith("sub-1");
    expect(mockRecordEvent).toHaveBeenCalledWith({
      subscriptionId: "sub-1",
      type: "unsubscribed",
    });
  });
});
