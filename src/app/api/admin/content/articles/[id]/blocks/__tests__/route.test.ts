import type { NextRequest } from "next/server";

import articleAdminModel from "@/domains/article/model/admin";

jest.mock("@/domains/article/model/admin", () => ({
  __esModule: true,
  default: {
    fetchById: jest.fn(),
    updateById: jest.fn(),
  },
}));

jest.mock("@/lib/admin/requireApiPermission", () => ({
  requireApiPermission: jest.fn(async () => "admin@test.com"),
}));

const mockFetchById = articleAdminModel.fetchById as jest.MockedFunction<
  typeof articleAdminModel.fetchById
>;

const mockUpdateById = articleAdminModel.updateById as jest.MockedFunction<
  typeof articleAdminModel.updateById
>;

let PUT: typeof import("../route").PUT;

const createRequest = (body: unknown) =>
  ({
    headers: new Headers(),
    json: async () => body,
  }) as unknown as NextRequest;

describe("/api/admin/content/articles/[id]/blocks", () => {
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

    ({ PUT } = await import("../route"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("persists blocks independently from article metadata", async () => {
    mockFetchById.mockResolvedValue({
      id: 16,
      title: "Article",
      url: "/articles/article",
      slug: "article",
      lang: "EN",
      reading_time: 5,
      published_at: "2026-06-24",
      summary: "Summary",
      img: "",
      featured: false,
      status: "draft",
    } as never);

    mockUpdateById.mockResolvedValue({
      id: 16,
      title: "Article",
      url: "/articles/article",
      slug: "article",
      lang: "EN",
      reading_time: 5,
      published_at: "2026-06-24",
      summary: "Summary",
      img: "",
      featured: false,
      status: "draft",
      blocks: [
        {
          id: "block_1",
          article_id: 16,
          sort_order: 0,
          block_type: "text",
        },
      ],
    } as never);

    const response = await PUT(
      createRequest({
        blocks: [
          {
            id: "block_1",
            article_id: 16,
            sort_order: 0,
            block_type: "text",
          },
        ],
      }),
      {
        params: Promise.resolve({ id: "16" }),
      }
    );

    expect(response.status).toBe(200);
    expect(mockUpdateById).toHaveBeenCalledWith(
      16,
      expect.objectContaining({
        blocks: expect.arrayContaining([
          expect.objectContaining({ id: "block_1" }),
        ]),
      })
    );
  });
});
