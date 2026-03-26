import type { NextRequest } from "next/server";

import { sendContactMessage } from "@/services/contact/postmark";
import { checkRateLimit } from "@/services/contact/rateLimit";
import { trackServerEvent } from "@/services/analytics/server";

jest.mock("@/services/contact/postmark", () => ({
  sendContactMessage: jest.fn(),
}));

jest.mock("@/services/contact/rateLimit", () => ({
  checkRateLimit: jest.fn(),
}));

jest.mock("@/services/analytics/server", () => ({
  trackServerEvent: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

const mockSendContactMessage = sendContactMessage as jest.MockedFunction<
  typeof sendContactMessage
>;
const mockCheckRateLimit = checkRateLimit as jest.MockedFunction<
  typeof checkRateLimit
>;
const mockTrackServerEvent = trackServerEvent as jest.MockedFunction<
  typeof trackServerEvent
>;

let POST: typeof import("../route").POST;

const buildFormData = (overrides: Record<string, string | undefined> = {}) => {
  const formData = new FormData();
  formData.set("email", "test@example.com");
  formData.set("message", "Hello from tests");
  formData.set("projectName", "Test Project");
  formData.set("source", "project_teaser");

  Object.entries(overrides).forEach(([key, value]) => {
    if (value === undefined) {
      formData.delete(key);
    } else {
      formData.set(key, value);
    }
  });

  return formData;
};

const createRequest = (
  formData: FormData,
  headers: Record<string, string> = {}
) =>
  ({
    formData: async () => formData,
    headers: new Headers(headers),
    url: "https://example.com/api/messages",
  }) as unknown as NextRequest;

describe("POST /api/messages", () => {
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
    mockCheckRateLimit.mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Date.now() + 60_000,
    });
    mockSendContactMessage.mockResolvedValue({ ok: true });
  });

  it("rejects invalid payloads", async () => {
    const formData = buildFormData({ email: "" });
    const response = await POST(createRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ ok: false, error: "invalid" });
    expect(mockCheckRateLimit).not.toHaveBeenCalled();
    expect(mockSendContactMessage).not.toHaveBeenCalled();
    expect(mockTrackServerEvent).not.toHaveBeenCalled();
  });

  it("treats honeypot submissions as spam", async () => {
    const formData = buildFormData({ honeypot: "gotcha" });
    const response = await POST(
      createRequest(formData, { "x-forwarded-for": "10.0.0.1" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(mockCheckRateLimit).not.toHaveBeenCalled();
    expect(mockSendContactMessage).not.toHaveBeenCalled();
    expect(mockTrackServerEvent).toHaveBeenCalledWith(
      "spam_blocked",
      { label: "Test Project", source: "project_teaser" },
      expect.objectContaining({ ip: "10.0.0.1" })
    );
  });

  it("treats too-fast submissions as spam", async () => {
    const now = 1_700_000_000_000;
    const nowSpy = jest.spyOn(Date, "now").mockReturnValue(now);

    const formData = buildFormData({
      formStart: String(now - 1000),
    });
    const response = await POST(createRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(mockCheckRateLimit).not.toHaveBeenCalled();
    expect(mockSendContactMessage).not.toHaveBeenCalled();
    expect(mockTrackServerEvent).toHaveBeenCalledWith(
      "spam_blocked",
      { label: "Test Project", source: "project_teaser" },
      expect.any(Object)
    );

    nowSpy.mockRestore();
  });

  it("rejects when rate limit is exceeded", async () => {
    mockCheckRateLimit.mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60_000,
    });

    const formData = buildFormData();
    const response = await POST(createRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body).toEqual({ ok: false, error: "rate_limited" });
    expect(mockSendContactMessage).not.toHaveBeenCalled();
    expect(mockTrackServerEvent).toHaveBeenCalledWith(
      "rate_limited",
      { label: "Test Project", source: "project_teaser" },
      expect.any(Object)
    );
  });

  it("returns success when Postmark sends", async () => {
    mockSendContactMessage.mockResolvedValue({ ok: true });

    const formData = buildFormData();
    const response = await POST(createRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true });
    expect(mockSendContactMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        projectName: "Test Project",
        source: "project_teaser",
      }),
      []
    );
    expect(mockTrackServerEvent).toHaveBeenCalledWith(
      "message_sent",
      { label: "Test Project", source: "project_teaser" },
      expect.any(Object)
    );
  });

  it("returns provider error when Postmark fails", async () => {
    mockSendContactMessage.mockResolvedValue({ ok: false });

    const formData = buildFormData();
    const response = await POST(createRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body).toEqual({ ok: false, error: "provider_error" });
    expect(mockTrackServerEvent).not.toHaveBeenCalledWith(
      "message_sent",
      expect.anything(),
      expect.anything()
    );
  });

  it("rejects oversized attachments", async () => {
    const formData = buildFormData();
    const oversized = new File(
      [new Uint8Array(9 * 1024 * 1024 + 1)],
      "too-big.pdf",
      { type: "application/pdf" }
    );
    formData.set("attachment", oversized);

    const response = await POST(createRequest(formData));
    const body = await response.json();

    expect(response.status).toBe(413);
    expect(body).toEqual({ ok: false, error: "attachment_too_large" });
    expect(mockSendContactMessage).not.toHaveBeenCalled();
  });
});
