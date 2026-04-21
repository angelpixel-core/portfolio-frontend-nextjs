import type { NextRequest } from "next/server";

import orderModel from "@/domains/order/model";
import { verifyStripeWebhookSignature } from "@/services/payments/webhook";

jest.mock("@/domains/order/model", () => ({
  __esModule: true,
  default: {
    attachStripePaymentIntentBySessionId: jest.fn(),
    transitionByStripeSessionId: jest.fn(),
    transitionByStripePaymentIntentId: jest.fn(),
  },
}));

jest.mock("@/services/payments/webhook", () => ({
  verifyStripeWebhookSignature: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

const mockVerifyStripeWebhookSignature =
  verifyStripeWebhookSignature as jest.MockedFunction<
    typeof verifyStripeWebhookSignature
  >;

const mockAttachStripePaymentIntentBySessionId =
  orderModel.attachStripePaymentIntentBySessionId as jest.MockedFunction<
    typeof orderModel.attachStripePaymentIntentBySessionId
  >;

const mockTransitionByStripeSessionId =
  orderModel.transitionByStripeSessionId as jest.MockedFunction<
    typeof orderModel.transitionByStripeSessionId
  >;

const mockTransitionByStripePaymentIntentId =
  orderModel.transitionByStripePaymentIntentId as jest.MockedFunction<
    typeof orderModel.transitionByStripePaymentIntentId
  >;

let POST: typeof import("../route").POST;

const createRequest = (payload: Record<string, unknown>) =>
  ({
    text: async () => JSON.stringify(payload),
    headers: new Headers({ "stripe-signature": "t=1,v1=test" }),
    url: "https://example.com/api/webhooks/stripe",
  }) as unknown as NextRequest;

describe("POST /api/webhooks/stripe", () => {
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
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    mockVerifyStripeWebhookSignature.mockReturnValue(true);
    mockAttachStripePaymentIntentBySessionId.mockResolvedValue();
    mockTransitionByStripeSessionId.mockResolvedValue({
      ok: true,
      changed: true,
      orderId: "order-1",
      status: "paid",
    });
    mockTransitionByStripePaymentIntentId.mockResolvedValue({
      ok: true,
      changed: true,
      orderId: "order-1",
      status: "failed",
    });
  });

  it("returns 400 when stripe signature is invalid", async () => {
    mockVerifyStripeWebhookSignature.mockReturnValue(false);

    const response = await POST(
      createRequest({
        id: "evt_invalid",
        type: "checkout.session.completed",
        data: { object: { id: "cs_test_1" } },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid_signature" });
    expect(mockTransitionByStripeSessionId).not.toHaveBeenCalled();
  });

  it("processes valid checkout.session.completed event and marks order paid", async () => {
    const response = await POST(
      createRequest({
        id: "evt_success",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_1",
            payment_intent: "pi_test_1",
            metadata: { order_id: "order-1" },
          },
        },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, duplicated: false });
    expect(mockAttachStripePaymentIntentBySessionId).toHaveBeenCalledWith(
      "cs_test_1",
      "pi_test_1"
    );
    expect(mockTransitionByStripeSessionId).toHaveBeenCalledWith(
      "cs_test_1",
      "paid"
    );
  });

  it("handles duplicated event idempotently", async () => {
    mockTransitionByStripeSessionId.mockResolvedValue({
      ok: true,
      changed: false,
      orderId: "order-1",
      status: "paid",
    });

    const response = await POST(
      createRequest({
        id: "evt_duplicate",
        type: "checkout.session.completed",
        data: { object: { id: "cs_test_1" } },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, duplicated: true });
  });

  it("ignores invalid transition attempts without mutating state", async () => {
    mockTransitionByStripeSessionId.mockResolvedValue({
      ok: false,
      reason: "invalid_transition",
      orderId: "order-1",
      status: "paid",
    });

    const response = await POST(
      createRequest({
        id: "evt_transition",
        type: "checkout.session.expired",
        data: { object: { id: "cs_test_1" } },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      ignored: true,
      reason: "invalid_transition",
    });
    expect(mockTransitionByStripeSessionId).toHaveBeenCalledWith(
      "cs_test_1",
      "failed"
    );
  });
});
