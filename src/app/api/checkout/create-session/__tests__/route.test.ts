import type { NextRequest } from "next/server";

import orderModel from "@/domains/order/model";
import {
  createStripeCheckoutSession,
  resolveCheckoutProduct,
} from "@/services/payments/stripe";

jest.mock("@/domains/order/model", () => ({
  __esModule: true,
  default: {
    createPendingOrder: jest.fn(),
    attachStripeSession: jest.fn(),
  },
}));

jest.mock("@/services/payments/stripe", () => ({
  createStripeCheckoutSession: jest.fn(),
  resolveCheckoutProduct: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

const mockCreatePendingOrder =
  orderModel.createPendingOrder as jest.MockedFunction<
    typeof orderModel.createPendingOrder
  >;
const mockAttachStripeSession =
  orderModel.attachStripeSession as jest.MockedFunction<
    typeof orderModel.attachStripeSession
  >;
const mockResolveCheckoutProduct =
  resolveCheckoutProduct as jest.MockedFunction<typeof resolveCheckoutProduct>;
const mockCreateStripeCheckoutSession =
  createStripeCheckoutSession as jest.MockedFunction<
    typeof createStripeCheckoutSession
  >;

let POST: typeof import("../route").POST;

const createRequest = (payload: Record<string, unknown>) =>
  ({
    json: async () => payload,
    headers: new Headers(),
    url: "https://example.com/api/checkout/create-session",
  }) as unknown as NextRequest;

describe("POST /api/checkout/create-session", () => {
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

    mockResolveCheckoutProduct.mockReturnValue({
      productKey: "article-why-portfolio-pattern",
      name: "Hire Entry Pattern",
      amount: 2900,
      currency: "usd",
    });

    mockCreatePendingOrder.mockResolvedValue({ id: "order-1" });

    mockCreateStripeCheckoutSession.mockResolvedValue({
      ok: true,
      url: "https://checkout.stripe.com/session/test",
      sessionId: "cs_test_123",
      paymentIntentId: null,
    });

    mockAttachStripeSession.mockResolvedValue();
  });

  it("returns invalid when payload fails validation", async () => {
    const response = await POST(
      createRequest({
        productKey: "",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid" });
    expect(mockCreatePendingOrder).not.toHaveBeenCalled();
    expect(mockCreateStripeCheckoutSession).not.toHaveBeenCalled();
  });

  it("returns provider_error when Stripe session creation fails", async () => {
    mockCreateStripeCheckoutSession.mockResolvedValue({ ok: false });

    const response = await POST(
      createRequest({
        productKey: "article-why-portfolio-pattern",
        email: "buyer@example.com",
        source: "article-cta",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({ ok: false, error: "provider_error" });
    expect(mockCreatePendingOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        productKey: "article-why-portfolio-pattern",
        amount: 2900,
        currency: "usd",
      })
    );
    expect(mockAttachStripeSession).not.toHaveBeenCalled();
  });

  it("returns checkout URL on success and persists order before redirect", async () => {
    const response = await POST(
      createRequest({
        productKey: "article-why-portfolio-pattern",
        email: "buyer@example.com",
        source: "article-cta",
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      url: "https://checkout.stripe.com/session/test",
    });

    expect(mockCreatePendingOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "buyer@example.com",
        productKey: "article-why-portfolio-pattern",
      })
    );

    expect(mockCreateStripeCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: "order-1",
        source: "article-cta",
      })
    );

    expect(mockAttachStripeSession).toHaveBeenCalledWith({
      orderId: "order-1",
      stripeSessionId: "cs_test_123",
      stripePaymentIntentId: null,
    });

    const orderCall = mockCreatePendingOrder.mock.invocationCallOrder[0];
    const stripeCall =
      mockCreateStripeCheckoutSession.mock.invocationCallOrder[0];
    expect(orderCall).toBeLessThan(stripeCall);
  });
});
