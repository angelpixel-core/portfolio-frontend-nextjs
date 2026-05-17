import type { NextRequest } from "next/server";

import resumeRequestLinkModel from "@/domains/resume-request-link/model";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";

jest.mock("@/domains/resume-request-link/model", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    revoke: jest.fn(),
  },
}));

jest.mock("@/lib/admin/requireApiPermission", () => ({
  requireApiPermission: jest.fn(),
}));

jest.mock("@/application/resumeRequest", () => {
  const actual = jest.requireActual("@/application/resumeRequest");
  return {
    ...actual,
    getResumeRequestLinkState: jest.fn(() => "revoked"),
  };
});

const mockFindById = resumeRequestLinkModel.findById as jest.MockedFunction<
  typeof resumeRequestLinkModel.findById
>;
const mockRevoke = resumeRequestLinkModel.revoke as jest.MockedFunction<
  typeof resumeRequestLinkModel.revoke
>;
const mockRequireApiPermission = requireApiPermission as jest.MockedFunction<
  typeof requireApiPermission
>;

let POST: typeof import("../route").POST;

const createRequest = () =>
  ({ headers: new Headers() }) as unknown as NextRequest;

describe("POST /api/admin/resume-request/links/[id]/revoke", () => {
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
    mockRequireApiPermission.mockResolvedValue("admin@angelpixel.io");
  });

  it("returns forbidden for non-admin", async () => {
    mockRequireApiPermission.mockResolvedValue(null);

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "link-1" }),
    });

    expect(response.status).toBe(403);
  });

  it("returns not found when link does not exist", async () => {
    mockFindById.mockResolvedValue(null);

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "link-404" }),
    });

    expect(response.status).toBe(404);
  });

  it("revokes active link", async () => {
    mockFindById
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        id: "link-1",
        tokenHash: "h1",
        recipientName: "Jane",
        ttlDays: 7,
        expiresAt: new Date("2026-05-14T00:00:00.000Z"),
        usedAt: null,
        revokedAt: new Date("2026-05-08T00:00:00.000Z"),
        createdByAdminEmail: "admin@angelpixel.io",
        createdAt: new Date("2026-05-07T00:00:00.000Z"),
        updatedAt: new Date("2026-05-08T00:00:00.000Z"),
      });

    const response = await POST(createRequest(), {
      params: Promise.resolve({ id: "link-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(mockRevoke).toHaveBeenCalledWith("link-1");
  });
});
