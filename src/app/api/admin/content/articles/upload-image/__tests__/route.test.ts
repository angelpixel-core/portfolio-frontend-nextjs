import type { NextRequest } from "next/server";

import {
  getArticleImageMaxBytes,
  isValidArticleImageType,
  uploadArticleImage,
  persistArticleImage,
} from "@/application/content";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";

jest.mock("@/lib/admin/requireApiPermission", () => ({
  requireApiPermission: jest.fn(),
}));

jest.mock("@/application/content", () => ({
  getArticleImageMaxBytes: jest.fn(() => 1024 * 1024),
  isValidArticleImageType: jest.fn(() => true),
  uploadArticleImage: jest.fn(async () => ({
    url: "https://x.public.blob.vercel-storage.com/articles/1/image.jpg",
    key: "articles/1/image.jpg",
  })),
  persistArticleImage: jest.fn(async () => undefined),
}));

const mockRequireApiPermission = requireApiPermission as jest.MockedFunction<
  typeof requireApiPermission
>;
const mockGetArticleImageMaxBytes =
  getArticleImageMaxBytes as jest.MockedFunction<
    typeof getArticleImageMaxBytes
  >;
const mockIsValidArticleImageType =
  isValidArticleImageType as jest.MockedFunction<
    typeof isValidArticleImageType
  >;
const mockUploadArticleImage = uploadArticleImage as jest.MockedFunction<
  typeof uploadArticleImage
>;
const mockPersistArticleImage = persistArticleImage as jest.MockedFunction<
  typeof persistArticleImage
>;

let POST: typeof import("../route").POST;

type MockUploadFile = {
  name: string;
  type: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

const createMockFile = (
  contentType: string,
  bytes: number[]
): MockUploadFile => ({
  name: "image.jpg",
  type: contentType,
  size: bytes.length,
  arrayBuffer: async () => new Uint8Array(bytes).buffer,
});

const createRequest = (entries: Record<string, string | MockUploadFile>) =>
  ({
    headers: new Headers(),
    formData: async () => ({
      get: (key: string) => entries[key] ?? null,
    }),
  }) as unknown as NextRequest;

describe("/api/admin/content/articles/upload-image", () => {
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
    mockGetArticleImageMaxBytes.mockReturnValue(1024 * 1024);
    mockIsValidArticleImageType.mockReturnValue(true);
  });

  it("returns forbidden for non-admin", async () => {
    mockRequireApiPermission.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        articleId: "1",
        file: createMockFile("image/jpeg", [1]),
      })
    );
    expect(response.status).toBe(403);
  });

  it("returns invalid type when mime is not allowed", async () => {
    mockIsValidArticleImageType.mockReturnValue(false);

    const response = await POST(
      createRequest({
        articleId: "1",
        file: createMockFile("image/svg+xml", [1]),
      })
    );
    expect(response.status).toBe(400);
  });

  it("uploads and returns blob url", async () => {
    const response = await POST(
      createRequest({
        articleId: "1",
        file: createMockFile("image/jpeg", [1, 2, 3]),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.url).toContain("public.blob.vercel-storage.com");
    expect(mockUploadArticleImage).toHaveBeenCalledTimes(1);
    expect(mockPersistArticleImage).toHaveBeenCalledTimes(1);
  });
});
