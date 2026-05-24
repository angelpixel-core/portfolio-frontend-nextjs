import accessModel from "@/domains/access/model";
import type { NextRequest } from "next/server";

import {
  sendPaymentAccessEmail,
  verifyStripeWebhookSignature,
} from "@/application/payments";
import orderModel from "@/domains/order/model";
import userModel from "@/domains/user/model";
import webhookEventModel from "@/domains/webhook-event/model";

jest.mock("@/domains/access/model", () => ({
  __esModule: true,
  default: {
    grantAccess: jest.fn(),
  },
}));

jest.mock("@/domains/order/model", () => ({
  __esModule: true,
  default: {
    attachStripePaymentIntentBySessionId: jest.fn(),
    transitionByStripeSessionId: jest.fn(),
    transitionByStripePaymentIntentId: jest.fn(),
    attachUser: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock("@/domains/user/model", () => ({
  __esModule: true,
  default: {
    findOrCreateByEmail: jest.fn(),
  },
}));

jest.mock("@/domains/webhook-event/model", () => ({
  __esModule: true,
  default: {
    registerWebhookEvent: jest.fn(),
    isProcessed: jest.fn(),
    markProcessed: jest.fn(),
  },
}));

jest.mock("@/application/payments", () => ({
  ...jest.requireActual("@/application/payments"),
  sendPaymentAccessEmail: jest.fn(),
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

const mockAttachUser = orderModel.attachUser as jest.MockedFunction<
  typeof orderModel.attachUser
>;

const mockFindOrderById = orderModel.findById as jest.MockedFunction<
  typeof orderModel.findById
>;

const mockGrantAccess = accessModel.grantAccess as jest.MockedFunction<
  typeof accessModel.grantAccess
>;

const mockFindOrCreateUserByEmail =
  userModel.findOrCreateByEmail as jest.MockedFunction<
    typeof userModel.findOrCreateByEmail
  >;

const mockRegisterWebhookEvent =
  webhookEventModel.registerWebhookEvent as jest.MockedFunction<
    typeof webhookEventModel.registerWebhookEvent
  >;

const mockIsWebhookEventProcessed =
  webhookEventModel.isProcessed as jest.MockedFunction<
    typeof webhookEventModel.isProcessed
  >;

const mockMarkWebhookEventProcessed =
  webhookEventModel.markProcessed as jest.MockedFunction<
    typeof webhookEventModel.markProcessed
  >;

const mockSendPaymentAccessEmail =
  sendPaymentAccessEmail as jest.MockedFunction<typeof sendPaymentAccessEmail>;

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
    mockRegisterWebhookEvent.mockResolvedValue({ created: true });
    mockIsWebhookEventProcessed.mockResolvedValue(false);
    mockMarkWebhookEventProcessed.mockResolvedValue();
    mockFindOrderById.mockResolvedValue({
      id: "order-1",
      productKey: "article-why-portfolio-pattern",
      status: "paid",
      provider: "stripe",
      amount: 2900,
      currency: "usd",
      createdAt: new Date("2026-04-22T00:00:00.000Z"),
      updatedAt: new Date("2026-04-22T00:00:00.000Z"),
    });
    mockFindOrCreateUserByEmail.mockResolvedValue({
      id: "user-1",
      email: "buyer@test.com",
      name: "buyer",
    });
    mockAttachUser.mockResolvedValue();
    mockGrantAccess.mockResolvedValue({
      id: "access-1",
      userId: "user-1",
      productKey: "article-why-portfolio-pattern",
      createdAt: new Date("2026-04-22T00:00:00.000Z"),
      updatedAt: new Date("2026-04-22T00:00:00.000Z"),
    });
    mockSendPaymentAccessEmail.mockResolvedValue({ ok: true });
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
            customer_details: { email: "buyer@test.com" },
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
    expect(mockFindOrCreateUserByEmail).toHaveBeenCalledWith("buyer@test.com");
    expect(mockAttachUser).toHaveBeenCalledWith(
      "order-1",
      "user-1",
      "buyer@test.com"
    );
    expect(mockGrantAccess).toHaveBeenCalledWith({
      userId: "user-1",
      productKey: "article-why-portfolio-pattern",
    });
    expect(mockSendPaymentAccessEmail).toHaveBeenCalledWith({
      toEmail: "buyer@test.com",
      orderId: "order-1",
      productKey: "article-why-portfolio-pattern",
    });
    expect(mockMarkWebhookEventProcessed).toHaveBeenCalledWith("evt_success");
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

  it("returns duplicated when event id was already processed", async () => {
    mockRegisterWebhookEvent.mockResolvedValue({ created: false });
    mockIsWebhookEventProcessed.mockResolvedValue(true);

    const response = await POST(
      createRequest({
        id: "evt_done",
        type: "checkout.session.completed",
        data: { object: { id: "cs_test_1" } },
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, duplicated: true });
    expect(mockTransitionByStripeSessionId).not.toHaveBeenCalled();
    expect(mockMarkWebhookEventProcessed).not.toHaveBeenCalled();
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
