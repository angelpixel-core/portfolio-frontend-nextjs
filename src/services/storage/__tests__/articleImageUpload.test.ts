import { readFile, rm } from "fs/promises";
import { join, resolve } from "path";

import type { NextRequest } from "next/server";

describe("local media storage", () => {
  const mediaRoot = resolve(process.cwd(), ".private", "media");
  const articleId = 987654;

  beforeAll(() => {
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
        headers: any;
        private body: unknown;

        constructor(body?: unknown, init?: { status?: number; headers?: any }) {
          this.body = body ?? null;
          this.status = init?.status ?? 200;
          this.headers = new Headers(init?.headers);
        }

        private async readBytes(): Promise<Uint8Array> {
          if (this.body instanceof Uint8Array) {
            return new Uint8Array(this.body);
          }

          if (this.body instanceof ArrayBuffer) {
            return new Uint8Array(this.body);
          }

          if (ArrayBuffer.isView(this.body)) {
            return new Uint8Array(
              this.body.buffer.slice(
                this.body.byteOffset,
                this.body.byteOffset + this.body.byteLength
              )
            );
          }

          if (typeof this.body === "string") {
            return new TextEncoder().encode(this.body);
          }

          if (
            this.body &&
            typeof (this.body as { getReader?: unknown }).getReader ===
              "function"
          ) {
            const reader = (
              this.body as ReadableStream<Uint8Array>
            ).getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) chunks.push(new Uint8Array(value));
            }

            const size = chunks.reduce(
              (total, chunk) => total + chunk.length,
              0
            );
            const merged = new Uint8Array(size);
            let offset = 0;
            for (const chunk of chunks) {
              merged.set(chunk, offset);
              offset += chunk.length;
            }

            return merged;
          }

          return new Uint8Array();
        }

        async arrayBuffer(): Promise<ArrayBuffer> {
          const bytes = await this.readBytes();
          return bytes.buffer.slice(
            bytes.byteOffset,
            bytes.byteOffset + bytes.byteLength
          ) as ArrayBuffer;
        }

        async text(): Promise<string> {
          return new TextDecoder().decode(await this.readBytes());
        }
      }

      globalThis.Response = Response as unknown as typeof globalThis.Response;
    }

    if (typeof globalThis.Request === "undefined") {
      class Request {}
      globalThis.Request = Request as unknown as typeof globalThis.Request;
    }
  });

  afterAll(async () => {
    await rm(join(mediaRoot, "articles", String(articleId)), {
      recursive: true,
      force: true,
    });
  });

  it("stores uploads on disk and serves them from /media", async () => {
    const { uploadArticleImage } = await import("../articleImageUpload");
    const { GET } = await import("@/app/media/[...path]/route");

    const result = await uploadArticleImage({
      articleId,
      fileName: "hero image.png",
      contentType: "image/png",
      bytes: new Uint8Array([1, 2, 3, 4]),
    });

    expect(result.url).toMatch(
      new RegExp(`^\\/media\\/articles\\/${articleId}\\/`)
    );
    expect(result.key).toMatch(new RegExp(`^articles\\/${articleId}\\/`));

    const storedPath = resolve(mediaRoot, result.key);
    const storedBytes = await readFile(storedPath);
    expect(Array.from(storedBytes)).toEqual([1, 2, 3, 4]);

    const response = await GET(
      { headers: new Headers() } as unknown as NextRequest,
      {
        params: Promise.resolve({ path: result.key.split("/") }),
      }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("cache-control")).toContain("immutable");
    const body = await response.text();
    expect(Array.from(body, (char) => char.charCodeAt(0))).toEqual([
      1, 2, 3, 4,
    ]);
  });
});
