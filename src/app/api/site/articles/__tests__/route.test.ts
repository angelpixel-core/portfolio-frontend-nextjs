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
  const future = new Date(Date.now() + 86_400_000).toISOString();

  return [
    {
      id: 1,
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
    {
      id: 2,
      title: "Draft article",
      url: "/articles/draft-article",
      slug: "draft-article",
      lang: "ES",
      reading_time: "5 min read",
      published_at: past,
      summary: "Draft",
      img: "/images/articles/draft.jpg",
      featured: false,
      visible: true,
      status: "draft",
    },
    {
      id: 3,
      title: "Future article",
      url: "/articles/future-article",
      slug: "future-article",
      lang: "ES",
      reading_time: "5 min read",
      published_at: future,
      summary: "Future",
      img: "/images/articles/future.jpg",
      featured: false,
      visible: true,
      status: "published",
    },
  ];
};

describe("GET /api/site/articles", () => {
  beforeAll(async () => {
    if (typeof globalThis.Request === "undefined") {
      class Request {}
      globalThis.Request = Request as unknown as typeof globalThis.Request;
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

    ({ GET } = await import("../route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchAllForAdmin.mockResolvedValue(createArticles() as never);
  });

  it("returns only published articles sorted by date", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].slug).toBe("visible-article");
  });

  it("returns 500 when fetching fails", async () => {
    mockFetchAllForAdmin.mockRejectedValue(new Error("db offline"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ message: "Failed to load articles" });
  });
});
