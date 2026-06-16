import type { NextRequest } from "next/server";

import articleAdminModel from "@/domains/article/model/admin";

jest.mock("@/domains/article/model/admin", () => ({
  __esModule: true,
  default: {
    fetchAllForAdmin: jest.fn(),
  },
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

const mockFetchAllForAdmin =
  articleAdminModel.fetchAllForAdmin as jest.MockedFunction<
    typeof articleAdminModel.fetchAllForAdmin
  >;

let GET: typeof import("../route").GET;

const createArticles = () => {
  const past = new Date(Date.now() - 86_400_000).toISOString();

  return [
    {
      id: 12,
      title: "Visible article",
      url: "/articles/visible-article",
      slug: "visible-article",
      lang: "ES",
      reading_time: "5 min read",
      published_at: past,
      summary: "Visible",
      img: "/images/articles/visible.jpg",
      featured: false,
      visible: true,
      status: "published",
    },
  ];
};

const createRequest = (): NextRequest =>
  ({
    headers: new Headers(),
    url: "https://example.com/api/site/articles/12",
  }) as unknown as NextRequest;

describe("GET /api/site/articles/[id]", () => {
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

    ({ GET } = await import("../route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchAllForAdmin.mockResolvedValue(createArticles() as never);
  });

  it("returns a published article by id", async () => {
    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "12" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.slug).toBe("visible-article");
  });

  it("returns 400 for invalid id", async () => {
    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "abc" }),
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ message: "Invalid article id" });
  });

  it("returns 404 when article is missing", async () => {
    const response = await GET(createRequest(), {
      params: Promise.resolve({ id: "99" }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ message: "Article not found" });
  });
});
