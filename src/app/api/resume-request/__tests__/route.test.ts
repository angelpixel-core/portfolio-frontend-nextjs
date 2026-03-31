import type { NextRequest } from "next/server";

import { sendResumeRequestEmail } from "@/services/contact/postmark";
import { auth } from "@/lib/auth";

const mockSendResumeRequestEmail =
  sendResumeRequestEmail as jest.MockedFunction<typeof sendResumeRequestEmail>;
const mockGetSession = auth.api.getSession as jest.MockedFunction<
  typeof auth.api.getSession
>;

type SelectRow = { id?: string; status?: string };

type SelectChain = {
  from: jest.MockedFunction<() => SelectChain>;
  where: jest.MockedFunction<() => SelectChain>;
  orderBy: jest.MockedFunction<() => SelectChain>;
  limit: jest.MockedFunction<() => Promise<SelectRow[]>>;
};

const selectQueue: SelectRow[][] = [];
const mockInsertValues = jest.fn();
const mockUpdateSet = jest.fn();
const mockUpdateWhere = jest.fn();

jest.mock("@/services/contact/postmark", () => ({
  sendResumeRequestEmail: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock("../../../../db", () => {
  const makeSelectChain = (result: SelectRow[]): SelectChain => {
    const chain: SelectChain = {
      from: jest.fn(() => chain),
      where: jest.fn(() => chain),
      orderBy: jest.fn(() => chain),
      limit: jest.fn(async () => result),
    };
    return chain;
  };

  return {
    db: {
      select: jest.fn(() => makeSelectChain(selectQueue.shift() ?? [])),
      insert: jest.fn(() => ({
        values: mockInsertValues.mockImplementation(async () => undefined),
      })),
      update: jest.fn(() => ({
        set: mockUpdateSet.mockImplementation(() => ({
          where: mockUpdateWhere.mockImplementation(async () => undefined),
        })),
      })),
    },
  };
});

let POST: typeof import("../route").POST;

const createRequest = (payload: Record<string, unknown>) =>
  ({
    json: async () => payload,
    headers: new Headers(),
    url: "https://example.com/api/resume-request",
  }) as unknown as NextRequest;

const createSession = (userId: string) => ({
  id: `session-${userId}`,
  userId,
  token: `token-${userId}`,
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: new Date(Date.now() + 60_000),
});

describe("POST /api/resume-request", () => {
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
    selectQueue.length = 0;
    mockSendResumeRequestEmail.mockResolvedValue({ ok: true });
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await POST(
      createRequest({ source: "resume_cta", context: "test" })
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ ok: false, error: "unauthenticated" });
    expect(mockInsertValues).not.toHaveBeenCalled();
  });

  it("returns 409 when a request is already pending", async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: "user-1",
        email: "test@example.com",
        name: "Test",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: createSession("user-1"),
    });
    selectQueue.push([{ id: "activity-1" }]);

    const response = await POST(
      createRequest({ source: "resume_cta", context: "test" })
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual({ ok: false, error: "already_requested" });
    expect(mockInsertValues).not.toHaveBeenCalled();
    expect(mockSendResumeRequestEmail).not.toHaveBeenCalled();
  });

  it("creates and updates activity on success", async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: "user-2",
        email: "user@example.com",
        name: "User",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: createSession("user-2"),
    });
    selectQueue.push([]);

    const response = await POST(
      createRequest({ source: "resume_cta", context: "Hiring" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, status: "sent" });
    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-2",
        type: "request_resume",
        status: "requested",
        event: "resume_request",
        source: "resume_cta",
      })
    );
    expect(mockSendResumeRequestEmail).toHaveBeenCalledWith(
      { id: "user-2", email: "user@example.com", name: "User" },
      { source: "resume_cta", context: "Hiring" }
    );
    expect(mockUpdateSet).toHaveBeenCalledWith(
      expect.objectContaining({ status: "sent" })
    );
    expect(mockUpdateWhere).toHaveBeenCalled();
  });
});
