import type { NextRequest } from "next/server";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";
import { sendSubscriptionConfirmEmail } from "@/services/subscriptions/email";
import { buildSubscriptionToken } from "@/services/subscriptions/token";

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

jest.mock("@/lib/admin/getAdminSessionEmail", () => ({
  getAdminSessionEmail: jest.fn(),
}));

jest.mock("@/services/subscriptions/email", () => ({
  sendSubscriptionConfirmEmail: jest.fn(),
}));

jest.mock("@/services/subscriptions/token", () => ({
  buildSubscriptionToken: jest.fn(),
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
const mockGetAdminSessionEmail = getAdminSessionEmail as jest.MockedFunction<
  typeof getAdminSessionEmail
>;
const mockSendSubscriptionConfirmEmail =
  sendSubscriptionConfirmEmail as jest.MockedFunction<
    typeof sendSubscriptionConfirmEmail
  >;
const mockBuildSubscriptionToken =
  buildSubscriptionToken as jest.MockedFunction<typeof buildSubscriptionToken>;

let POST: typeof import("../route").POST;

const createRequest = (payload: unknown) =>
  ({
    headers: new Headers(),
    json: async () => payload,
  }) as unknown as NextRequest;

describe("POST /api/admin/subscriptions/[id]/actions", () => {
  beforeAll(async () => {
    if (typeof globalThis.Headers === "undefined") {
      class Headers {
        private map = new Map<string, string>();
        get(key: string): string | null {
          return this.map.get(key.toLowerCase()) ?? null;
        }
        set(key: string, value: string): void {
          this.map.set(key.toLowerCase(), value);
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
    mockGetAdminSessionEmail.mockResolvedValue("admin@angelpixel.io");
    mockSendSubscriptionConfirmEmail.mockResolvedValue({ ok: true });
    mockBuildSubscriptionToken
      .mockReturnValueOnce("confirm-token")
      .mockReturnValueOnce("unsubscribe-token");
    mockRecordEvent.mockResolvedValue(undefined);
    mockMarkUnsubscribed.mockResolvedValue(undefined);
    mockFindById.mockResolvedValue({
      id: "sub-1",
      email: "buyer@test.com",
      status: "pending_confirmation",
      source: "article_cta",
      articleSlug: "why-portfolio-not-convert",
      locale: null,
      confirmedAt: null,
      unsubscribedAt: null,
      createdAt: new Date("2026-04-25T00:00:00.000Z"),
      updatedAt: new Date("2026-04-25T00:00:00.000Z"),
    });
  });

  it("returns forbidden for non-admin", async () => {
    mockGetAdminSessionEmail.mockResolvedValue(null);

    const response = await POST(createRequest({ action: "resend_confirm" }), {
      params: Promise.resolve({ id: "sub-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({ ok: false, error: "forbidden" });
  });

  it("resends confirmation and records audit event", async () => {
    const response = await POST(createRequest({ action: "resend_confirm" }), {
      params: Promise.resolve({ id: "sub-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(mockSendSubscriptionConfirmEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "buyer@test.com",
        confirmToken: "confirm-token",
      })
    );
    expect(mockRecordEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriptionId: "sub-1",
        type: "confirm_sent",
      })
    );
  });

  it("marks subscription unsubscribed", async () => {
    mockFindById.mockResolvedValue({
      id: "sub-1",
      email: "buyer@test.com",
      status: "subscribed",
      source: "article_cta",
      articleSlug: "why-portfolio-not-convert",
      locale: null,
      confirmedAt: new Date("2026-04-25T00:10:00.000Z"),
      unsubscribedAt: null,
      createdAt: new Date("2026-04-25T00:00:00.000Z"),
      updatedAt: new Date("2026-04-25T00:10:00.000Z"),
    });

    const response = await POST(
      createRequest({ action: "mark_unsubscribed" }),
      {
        params: Promise.resolve({ id: "sub-1" }),
      }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(mockMarkUnsubscribed).toHaveBeenCalledWith("sub-1");
    expect(mockRecordEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        subscriptionId: "sub-1",
        type: "unsubscribed",
      })
    );
  });
});
