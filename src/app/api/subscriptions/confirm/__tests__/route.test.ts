import type { NextRequest } from "next/server";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { validateSubscriptionToken } from "@/services/subscriptions/token";

jest.mock("@/domains/subscription/model", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    markConfirmed: jest.fn(),
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
const mockMarkConfirmed =
  subscriptionModel.markConfirmed as jest.MockedFunction<
    typeof subscriptionModel.markConfirmed
  >;
const mockRecordEvent =
  subscriptionEventModel.recordEvent as jest.MockedFunction<
    typeof subscriptionEventModel.recordEvent
  >;
const mockValidateSubscriptionToken =
  validateSubscriptionToken as jest.MockedFunction<
    typeof validateSubscriptionToken
  >;

let GET: typeof import("../route").GET;

const createRequest = (url: string) =>
  ({
    nextUrl: new URL(url),
  }) as unknown as NextRequest;

describe("GET /api/subscriptions/confirm", () => {
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

    ({ GET } = await import("../route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockMarkConfirmed.mockResolvedValue(undefined);
    mockRecordEvent.mockResolvedValue(undefined);
  });

  it("returns 400 when token is missing", async () => {
    const response = await GET(
      createRequest("https://example.com/api/subscriptions/confirm")
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid" });
  });

  it("returns 400 for invalid token", async () => {
    mockValidateSubscriptionToken.mockReturnValue({
      ok: false,
      reason: "invalid",
    });

    const response = await GET(
      createRequest("https://example.com/api/subscriptions/confirm?token=abc")
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid" });
  });

  it("returns 404 when subscription does not exist", async () => {
    mockValidateSubscriptionToken.mockReturnValue({
      ok: true,
      payload: {
        sid: "sub-1",
        email: "hello@angelpixel.io",
        purpose: "confirm",
        exp: Math.floor(Date.now() / 1000) + 100,
      },
    });
    mockFindById.mockResolvedValue(null);

    const response = await GET(
      createRequest("https://example.com/api/subscriptions/confirm?token=abc")
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ ok: false, error: "not_found" });
  });

  it("returns idempotent success when already subscribed", async () => {
    mockValidateSubscriptionToken.mockReturnValue({
      ok: true,
      payload: {
        sid: "sub-1",
        email: "hello@angelpixel.io",
        purpose: "confirm",
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

    const response = await GET(
      createRequest("https://example.com/api/subscriptions/confirm?token=abc")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, status: "subscribed", idempotent: true });
    expect(mockMarkConfirmed).not.toHaveBeenCalled();
  });

  it("marks subscription confirmed and records event", async () => {
    mockValidateSubscriptionToken.mockReturnValue({
      ok: true,
      payload: {
        sid: "sub-1",
        email: "hello@angelpixel.io",
        purpose: "confirm",
        exp: Math.floor(Date.now() / 1000) + 100,
      },
    });
    mockFindById.mockResolvedValue({
      id: "sub-1",
      email: "hello@angelpixel.io",
      status: "pending_confirmation",
      source: null,
      articleSlug: null,
      locale: null,
      confirmedAt: null,
      unsubscribedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await GET(
      createRequest("https://example.com/api/subscriptions/confirm?token=abc")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, status: "subscribed", idempotent: false });
    expect(mockMarkConfirmed).toHaveBeenCalledWith("sub-1");
    expect(mockRecordEvent).toHaveBeenCalledWith({
      subscriptionId: "sub-1",
      type: "confirmed",
    });
  });
});
