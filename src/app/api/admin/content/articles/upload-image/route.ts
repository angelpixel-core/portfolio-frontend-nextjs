import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { PERMISSIONS } from "@/application/authz";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";
import { isMemoryDriver } from "../../../../../../db/runtime";
import { memoryStore } from "../../../../../../db/memory-store";
import {
  getArticleImageMaxBytes,
  isValidArticleImageType,
  uploadArticleImage,
} from "@/services/storage/articleImageUpload";

const parseArticleId = (value: string | File | null): number | null => {
  if (typeof value !== "string") return null;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};

type UploadFileLike = {
  name: string;
  type: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

const isUploadFileLike = (value: unknown): value is UploadFileLike => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<UploadFileLike>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.size === "number" &&
    typeof candidate.arrayBuffer === "function"
  );
};

export const POST = async (request: NextRequest) => {
  const adminEmail = await requireApiPermission(
    request.headers,
    PERMISSIONS.CONTENT_WRITE
  );

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { ok: false, error: "invalid_form_data" },
      { status: 400 }
    );
  }

  const articleId = parseArticleId(formData.get("articleId"));
  if (!articleId) {
    return NextResponse.json(
      { ok: false, error: "invalid_article_id" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!isUploadFileLike(file)) {
    return NextResponse.json(
      { ok: false, error: "file_required" },
      { status: 400 }
    );
  }

  if (!isValidArticleImageType(file.type)) {
    return NextResponse.json(
      { ok: false, error: "invalid_file_type" },
      { status: 400 }
    );
  }

  const maxBytes = getArticleImageMaxBytes();
  if (file.size > maxBytes) {
    return NextResponse.json(
      { ok: false, error: "file_too_large", maxBytes },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await uploadArticleImage({
      articleId,
      fileName: file.name,
      contentType: file.type,
      bytes: new Uint8Array(arrayBuffer),
    });

    if (isMemoryDriver()) {
      const articles = memoryStore.getArticles();
      const idx = articles.findIndex((article) => article.id === articleId);
      if (idx !== -1) {
        articles[idx] = {
          ...articles[idx],
          img: uploaded.url,
        };
        memoryStore.setArticles(articles);
      }
    } else {
      const { db } = await import("../../../../../../db");
      const { contentAssets, contentArticles } =
        await import("../../../../../../db/schema");

      const provider = "vercel-blob";
      const providerKey = uploaded.key;
      const existingAsset = await db
        .select({ id: contentAssets.id })
        .from(contentAssets)
        .where(eq(contentAssets.providerKey, providerKey))
        .limit(1);

      const assetId =
        existingAsset[0]?.id ??
        `asset_${articleId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      if (!existingAsset[0]) {
        await db.insert(contentAssets).values({
          id: assetId,
          url: uploaded.url,
          provider,
          providerKey,
          mimeType: file.type,
          sizeBytes: file.size,
          alt: null,
        });
      } else {
        await db
          .update(contentAssets)
          .set({
            url: uploaded.url,
            mimeType: file.type,
            sizeBytes: file.size,
            updatedAt: new Date(),
          })
          .where(eq(contentAssets.id, assetId));
      }

      await db
        .update(contentArticles)
        .set({
          img: uploaded.url,
          heroAssetId: assetId,
          updatedAt: new Date(),
        })
        .where(eq(contentArticles.id, articleId));
    }

    return NextResponse.json({ ok: true, ...uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload_failed";
    const status = message === "missing_blob_token" ? 500 : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
};
