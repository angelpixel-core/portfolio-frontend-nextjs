import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { readFile } from "fs/promises";

import {
  getLocalMediaMetaPath,
  resolveLocalMediaPath,
} from "@/services/storage/localMedia";

type Params = { params: Promise<{ path: string[] }> };

const inferContentType = (pathname: string): string => {
  const ext = pathname.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
};

const readContentType = async (
  metaPath: string | null
): Promise<string | null> => {
  if (!metaPath) return null;

  try {
    const raw = await readFile(metaPath, "utf8");
    const parsed = JSON.parse(raw) as { contentType?: string };
    return typeof parsed.contentType === "string" && parsed.contentType.trim()
      ? parsed.contentType.trim()
      : null;
  } catch {
    return null;
  }
};

export const GET = async (_request: NextRequest, { params }: Params) => {
  const { path } = await params;
  const pathname = path.join("/");
  const absolutePath = resolveLocalMediaPath(pathname);

  if (!absolutePath) {
    return NextResponse.json(
      { ok: false, error: "invalid_path" },
      { status: 400 }
    );
  }

  try {
    const [bytes, contentType] = await Promise.all([
      readFile(absolutePath),
      readContentType(getLocalMediaMetaPath(pathname)),
    ]);

    return new NextResponse(bytes, {
      headers: {
        "content-type": contentType ?? inferContentType(absolutePath),
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "not_found" },
      { status: 404 }
    );
  }
};
