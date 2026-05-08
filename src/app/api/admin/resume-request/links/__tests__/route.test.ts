import type { NextRequest } from "next/server";

import resumeRequestLinkModel from "@/domains/resume-request-link/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

jest.mock("@/domains/resume-request-link/model", () => ({
  __esModule: true,
  default: {
    list: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("@/lib/admin/getAdminSessionEmail", () => ({
  getAdminSessionEmail: jest.fn(),
}));

jest.mock("@/services/resumeRequest/publicLink", () => ({
  createResumeRequestToken: jest.fn(() => "plain-token"),
  hashResumeRequestToken: jest.fn(() => "hashed-token"),
  getResumeRequestPublicBaseUrl: jest.fn(() => "https://angelpixel.io"),
  getResumeRequestLinkState: jest.fn(() => "active"),
}));

jest.mock("@/services/resumeRequest/publicLinkSchema", () => ({
  AdminCreateResumeRequestLinkSchema: {
    safeParse: jest.fn((payload) => ({
      success: true,
      data: payload,
    })),
  },
  normalizeTtlDays: jest.fn((ttlDays) => ttlDays ?? 7),
}));

const mockList = resumeRequestLinkModel.list as jest.MockedFunction<
  typeof resumeRequestLinkModel.list
>;
const mockCreate = resumeRequestLinkModel.create as jest.MockedFunction<
  typeof resumeRequestLinkModel.create
>;
const mockGetAdminSessionEmail = getAdminSessionEmail as jest.MockedFunction<
  typeof getAdminSessionEmail
>;

let GET: typeof import("../route").GET;
let POST: typeof import("../route").POST;

const createRequest = (payload?: unknown) =>
  ({
    headers: new Headers(),
    json: async () => payload,
  }) as unknown as NextRequest;

describe("/api/admin/resume-request/links", () => {
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

    ({ GET, POST } = await import("../route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAdminSessionEmail.mockResolvedValue("admin@angelpixel.io");
    mockList.mockResolvedValue([]);
    mockCreate.mockResolvedValue({
      id: "link-1",
      tokenHash: "hashed-token",
      recipientName: "Jane Doe",
      ttlDays: 7,
      expiresAt: new Date("2026-05-14T00:00:00.000Z"),
      usedAt: null,
      revokedAt: null,
      createdByAdminEmail: "admin@angelpixel.io",
      createdAt: new Date("2026-05-07T00:00:00.000Z"),
      updatedAt: new Date("2026-05-07T00:00:00.000Z"),
    });
  });

  it("returns forbidden for non-admin", async () => {
    mockGetAdminSessionEmail.mockResolvedValue(null);

    const response = await GET(createRequest());
    expect(response.status).toBe(403);
  });

  it("lists invite links", async () => {
    mockList.mockResolvedValue([
      {
        id: "link-1",
        tokenHash: "h1",
        recipientName: "Jane",
        ttlDays: 7,
        expiresAt: new Date("2026-05-14T00:00:00.000Z"),
        usedAt: null,
        revokedAt: null,
        createdByAdminEmail: "admin@angelpixel.io",
        createdAt: new Date("2026-05-07T00:00:00.000Z"),
        updatedAt: new Date("2026-05-07T00:00:00.000Z"),
      },
    ]);

    const response = await GET(createRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items[0].id).toBe("link-1");
  });

  it("creates invite link and returns public URL", async () => {
    const response = await POST(
      createRequest({ recipientName: "Jane Doe", ttlDays: 7 })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.publicUrl).toBe(
      "https://angelpixel.io/resume-request/plain-token"
    );
    expect(mockCreate).toHaveBeenCalled();
  });
});
