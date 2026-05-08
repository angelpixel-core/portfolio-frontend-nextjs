import type { NextRequest } from "next/server";

import resumeRequestSubmissionModel from "@/domains/resume-request-submission/model";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

jest.mock("@/domains/resume-request-submission/model", () => ({
  __esModule: true,
  default: {
    list: jest.fn(),
  },
}));

jest.mock("@/lib/admin/getAdminSessionEmail", () => ({
  getAdminSessionEmail: jest.fn(),
}));

const mockList = resumeRequestSubmissionModel.list as jest.MockedFunction<
  typeof resumeRequestSubmissionModel.list
>;
const mockGetAdminSessionEmail = getAdminSessionEmail as jest.MockedFunction<
  typeof getAdminSessionEmail
>;

let GET: typeof import("../route").GET;

const createRequest = () =>
  ({ headers: new Headers() }) as unknown as NextRequest;

describe("GET /api/admin/resume-request/submissions", () => {
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

    ({ GET } = await import("../route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAdminSessionEmail.mockResolvedValue("admin@angelpixel.io");
    mockList.mockResolvedValue([]);
  });

  it("returns forbidden for non-admin", async () => {
    mockGetAdminSessionEmail.mockResolvedValue(null);

    const response = await GET(createRequest());
    expect(response.status).toBe(403);
  });

  it("returns submissions list", async () => {
    mockList.mockResolvedValue([
      {
        id: "sub-1",
        linkId: "link-1",
        email: "hello@test.com",
        name: "Jane",
        context: null,
        role: null,
        company: null,
        notes: null,
        status: "requested",
        origin: "on_demand_link",
        createdAt: new Date("2026-05-07T00:00:00.000Z"),
        updatedAt: new Date("2026-05-07T00:00:00.000Z"),
      },
    ]);

    const response = await GET(createRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.items).toHaveLength(1);
  });
});
