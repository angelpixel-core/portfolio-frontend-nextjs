import resumeRequestLinkModel from "@/domains/resume-request-link/model";

jest.mock("@/domains/resume-request-link/model", () => ({
  __esModule: true,
  default: {
    findByTokenHash: jest.fn(),
  },
}));

const mockFindByTokenHash =
  resumeRequestLinkModel.findByTokenHash as jest.MockedFunction<
    typeof resumeRequestLinkModel.findByTokenHash
  >;

const mockTransaction = jest.fn();

jest.mock("../../../../../../db", () => ({
  db: {
    transaction: (...args: unknown[]) => mockTransaction(...args),
  },
}));

const makeLink = (overrides?: Partial<any>) => ({
  id: "link-1",
  tokenHash: "hashed",
  recipientName: "Jane Doe",
  ttlDays: 7,
  expiresAt: new Date("2026-05-14T00:00:00.000Z"),
  usedAt: null,
  revokedAt: null,
  createdByAdminEmail: "admin@angelpixel.io",
  createdAt: new Date("2026-05-07T00:00:00.000Z"),
  updatedAt: new Date("2026-05-07T00:00:00.000Z"),
  ...overrides,
});

let GET: typeof import("../route").GET;
let POST: typeof import("../route").POST;

describe("/api/resume-request/public/[token]", () => {
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
    mockFindByTokenHash.mockResolvedValue(makeLink());
    mockTransaction.mockResolvedValue({
      ok: true,
      submission: { id: "sub-1", email: "hello@test.com" },
    });
  });

  it("returns bootstrap data for active token", async () => {
    const response = await GET({} as Request, {
      params: Promise.resolve({ token: "plain-token" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.recipientName).toBe("Jane Doe");
  });

  it("returns invalid for missing token record", async () => {
    mockFindByTokenHash.mockResolvedValue(null);

    const response = await GET({} as Request, {
      params: Promise.resolve({ token: "missing" }),
    });

    expect(response.status).toBe(404);
  });

  it("returns gone when token already used", async () => {
    mockFindByTokenHash.mockResolvedValue(
      makeLink({ usedAt: new Date("2026-05-08T00:00:00.000Z") })
    );

    const response = await GET({} as Request, {
      params: Promise.resolve({ token: "used-token" }),
    });
    const body = await response.json();

    expect(response.status).toBe(410);
    expect(body.error).toBe("token_used");
  });

  it("submits once and rejects token reuse semantics", async () => {
    const first = await POST(
      {
        json: async () => ({ email: "hello@test.com" }),
      } as Request,
      { params: Promise.resolve({ token: "plain-token" }) }
    );
    const firstBody = await first.json();

    expect(first.status).toBe(200);
    expect(firstBody.ok).toBe(true);

    mockTransaction.mockResolvedValueOnce({ ok: false });
    mockFindByTokenHash.mockResolvedValueOnce(
      makeLink({ usedAt: new Date("2026-05-08T00:00:00.000Z") })
    );

    const second = await POST(
      {
        json: async () => ({ email: "hello@test.com" }),
      } as Request,
      { params: Promise.resolve({ token: "plain-token" }) }
    );
    const secondBody = await second.json();

    expect(second.status).toBe(410);
    expect(secondBody.error).toBe("token_used");
  });

  it("returns invalid for malformed payload", async () => {
    const response = await POST(
      {
        json: async () => ({ email: "not-an-email" }),
      } as Request,
      { params: Promise.resolve({ token: "plain-token" }) }
    );

    expect(response.status).toBe(400);
  });
});
